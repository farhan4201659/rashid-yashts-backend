export const callRequestTemplate = (name, subject, number, message) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-header {
            background-color: #FF0000;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .email-body {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #FF0000;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.8em;
            text-align: center;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Call Request</h1>
        </div>
        <div class="email-body">
            <p>Hi Rashid,</p>
            <p>New User Has Been Requested For A Call:</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Number:</strong> ${number}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p>Kindly Contact Him as soon as possible.</p>
            <p>Thank you,<br></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Rashid Yachts. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
