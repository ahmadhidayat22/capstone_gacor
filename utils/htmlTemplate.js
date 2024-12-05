const HTML_TEMPLATE = (reset_link) => {
    return `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-header img {
            max-width: 150px;
        }
        .email-body {
            margin-bottom: 20px;
        }
        .email-body p {
            margin: 0 0 10px;
        }
        .reset-button {
            display: block;
            width: 200px;
            margin: 20px auto;
            text-align: center;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://yourapp.com/logo.png" alt="Your App Logo">
        </div>
        <div class="email-body">
            <h2>Hello, </h2>
            <p>We received a request to reset your password for your account associated with this email. If you did not request this, please ignore this email.</p>
            <p>To reset your password, please click the button below:</p>
            <a href="${reset_link}" class="reset-button">Reset Password</a>
            <p>This link will expire in 15 minutes. If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p><a href="${reset_link}">${reset_link}</a></p>
        </div>
        <div class="email-footer">
            <p>If you did not request a password reset, no action is required.</p>
            <p>Need help? Contact us at <a href="mailto:nutriisee@gmail.com">support@nutrisee.my.id</a></p>
            <p>&copy; 2024 Your App. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

    `;
  }
  
  export default HTML_TEMPLATE;