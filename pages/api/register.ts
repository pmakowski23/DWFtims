import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  const { indexNumber, talks } = req.body;

  const { CLIENT_EMAIL, PRIVATE_KEY, SHEET_ID, SHEET_NAME } = process.env;

  if (!CLIENT_EMAIL || !PRIVATE_KEY || !SHEET_NAME || !SHEET_ID) {
    return res.status(400).json({
      message: 'Env value is missing'
    });
  }

  if (typeof indexNumber !== 'string' || !Array.isArray(talks) || !indexNumber) {
    return res.status(400).json({
      message: 'Invalid request body'
    });
  }

  if (!talks.length) {
    return res.status(400).json({
      message: 'Musisz wybrać przynajmniej jeden wykład.'
    });
  }

  const isCorrectIndexNumber = /[0-9]{6}/.test(indexNumber);

  if (!isCorrectIndexNumber) {
    return res.status(400).json({
      message: 'Nieprawidłowy numer indeksu.'
    });
  }

  const doc = new GoogleSpreadsheet(SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[SHEET_NAME];

  const rows = await sheet.getRows();

  const isEmailAlreadyInSheet = !!rows.filter(row => row.indexNumber === indexNumber).length;

  if (isEmailAlreadyInSheet) {
    return res.status(409).json({
      message: 'Podałeś zarejestrowany numer indeksu.'
    });
  }

  await sheet.addRow([new Date().toLocaleString(), indexNumber, JSON.stringify(talks)]);

  return res.status(201).json({ message: 'Success' });
}
