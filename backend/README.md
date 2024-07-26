# Authentication Complete With Sendind Email Address 

## Modules
1. Sign Up User -------------> Create User
2. Verifiation Email Address -------------> No Spam Accounts
3. Login User ---------------> Secure And Personalize Account 
4. Update profile --------------> Can Change His Details
5. change Password -------------------> Change Password If Feel Insecure
6. View Profile ------------------> Can See Profile Details
7. Forget Password ------------------> If Forget Password So can Reset That
8. Reset Password -------------------> Can reset Password By Verification Link in email
9. Request For Verify Email Address ---------------> Can Request Again For Email Verification if reset link expires
10. Logout -----------------------> Can Logout His Account


## Required Config Variables

1. PORT = 5000

2. DB=mongodb://localhost:27017

3. JWT_SECRET= yourjwtsecret

4. COOKIE_EXPIRES= 2 ------> these two are days when the cookie will expire

5. SMTP_HOST= smtp.example.com

6. SMTP_PORT=587

7. SMTP_USER=youruser@gmail.com

8. SMTP_PASSWORD=yourpassword

9. SMTP_SENDNAME = Aashan Amir --------------> Sender Name

