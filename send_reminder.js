const nodemailer = require('nodemailer');

async function sendReminder() {
  const { EMAIL_USER, EMAIL_PASS, TO_EMAIL } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS || !TO_EMAIL) {
    console.error('Missing email credentials in secrets!');
    process.exit(1);
  }

  // Create transporter (Example using Gmail, modify service if using Yahoo/Outlook)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS, // This must be an App Password, not a normal password!
    },
  });

  const getGreeting = () => {
    const hour = (new Date()).getUTCHours() + 5.5; // Quick IST offset
    const istHour = (hour >= 24) ? hour - 24 : hour;
    if (istHour < 12) return 'Bonjour (Good Morning)';
    if (istHour < 17) return 'Bon après-midi (Good Afternoon)';
    return 'Bonsoir (Good Evening)';
  };

  const mailOptions = {
    from: `"French Tracker Bot" <${EMAIL_USER}>`,
    to: TO_EMAIL,
    subject: `🕒 French Tracker Reminder — ${getGreeting()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0d1b2a;">
        <h2 style="color: #d4a843;">${getGreeting()}!</h2>
        <p>This is your automated reminder to complete your French study goals.</p>
        
        <div style="background-color: #0d1b2a; color: #f5f0e8; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #d4a843;">📅 Daily Routine Checklist</h3>
          <ul style="line-height: 1.6;">
            <li><strong>Morning (8:00 AM - 10:00 AM):</strong> Duolingo streak + Quizlet (10 new words)</li>
            <li><strong>Noon (1:00 PM):</strong> 1 TV5Monde video or RFI Français Facile episode with transcript</li>
            <li><strong>Evening (6:00 PM - 8:00 PM):</strong> Tick 1 topic from A1 + 1 from A2. Write in journal.</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://Jothibasu2203.github.io/french-tracker/french_tracker.html" style="background-color: #2980b9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
            Open My French Tracker
          </a>
          <p style="font-size: 12px; color: #7a9ab5; margin-top: 10px;">
            For the link above to work, make sure you enabled GitHub Pages in your repository settings!
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Reminder email sent successfully!', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    process.exit(1);
  }
}

sendReminder();
