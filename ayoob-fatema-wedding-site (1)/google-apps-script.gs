/**
 * Ayoob & Fatema — RSVP handler
 *
 * SETUP:
 * 1. Create a Google Sheet with a tab named "RSVPs" (or change SHEET_NAME below)
 *    and header row: Timestamp | Name | Email | Attending | Number of Guests | Guest Names | Message
 * 2. In the Sheet: Extensions -> Apps Script, paste this whole file, replacing any starter code.
 * 3. Update NOTIFY_EMAIL below if needed (currently amallothkuni@gmail.com).
 * 4. Click Deploy -> New deployment -> select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployed Web App URL and paste it into RSVP_ENDPOINT in script.js.
 */

const SHEET_NAME = 'RSVPs';
const NOTIFY_EMAIL = 'amallothkuni@gmail.com';

function doPost(e) {
  try {
    const sheet = getSheet_();
    const params = e.parameter || {};

    const name = params.name || '';
    const email = params.email || '';
    const attending = params.attending || '';
    const guests = params.guests || '';
    const guestNames = params.guestNames || '';
    const message = params.message || '';
    const timestamp = new Date();

    sheet.appendRow([timestamp, name, email, attending, guests, guestNames, message]);

    sendNotificationEmail_(name, email, attending, guests, guestNames, message);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Attending',
      'Number of Guests', 'Guest Names', 'Message'
    ]);
    // Total confirmed guests, based on column D (Attending) and column E (Number of Guests)
    sheet.getRange('I1').setValue('Total Confirmed Guests');
    sheet.getRange('I2').setFormula('=SUMIF(D2:D,"Yes",E2:E)');
  }
  return sheet;
}

function sendNotificationEmail_(name, email, attending, guests, guestNames, message) {
  const subject = 'New RSVP — Ayoob & Fatema';
  const body =
    'A new RSVP has been submitted for Ayoob & Fatema\'s wedding.\n\n' +
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Attending: ' + attending + '\n' +
    'Number of Guests: ' + guests + '\n' +
    'Guest Names: ' + guestNames + '\n' +
    'Message: ' + message + '\n';

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
