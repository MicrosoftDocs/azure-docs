To enable sign-in on your application, you will need to create a sign-in policy. This policy describes the experiences that consumers will go through during sign-in and the contents of tokens that the application will receive on successful sign-ins.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]
Click **Sign-in policies**.

Click **+Add** at the top of the blade.

The **Name** determines the sign-in policy name used by your application. For example, enter **SiIn**.

Click **Identity providers** and select **Local Account SignIn**. Optionally, you can also select social identity providers, if already configured. Click **OK**.

Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful sign-in experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**  and **User's Object ID**. Click **OK**.

Click **Create**. Note that the policy just created appears as **B2C_1_SiIn** (the **B2C\_1\_** fragment is automatically added) in the **Sign-in policies** blade.

Open the policy by clicking **B2C_1_SiIn**.

Select **Contoso B2C app** in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.

Click **Run now**. A new browser tab opens, and you can run through the consumer experience of signing into your application.

> [!NOTE]
> It takes up to a minute for policy creation and updates to take effect.
>