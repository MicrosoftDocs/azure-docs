To enable fine-grained password reset on your application, you will need to create a password reset policy. Note that the tenant-wide password reset option specified [here](../articles/active-directory-b2c/active-directory-b2c-reference-sspr.md). This policy describes the experiences that the consumers will go through during password reset and the contents of tokens that the application will receive on successful completion.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]
Click **Password reset policies**.

Click **+Add** at the top of the blade.

The **Name** determines the password reset policy name used by your application. For example, enter "SSPR".

Click **Identity providers** and select "Reset password using email address". Click **OK**.

Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful password reset experience. For example, select "User's Object ID".

Click **Create**. Note that the policy just created appears as "**B2C_1_SSPR**" (the **B2C\_1\_** fragment is automatically added) in the **Password reset policies** blade.

Open the policy by clicking "**B2C_1_SSPR**".

Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.

Click **Run now**. A new browser tab opens, and you can run through the password reset consumer experience in your application.
    
    > [!NOTE]
    > It takes up to a minute for policy creation and updates to take effect.
    > 
    > 