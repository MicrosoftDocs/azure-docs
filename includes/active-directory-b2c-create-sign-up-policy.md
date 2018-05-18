If you want to only enable sign-up on your application, you use a **sign-up** policy. This policy describes the experiences that customers go through during sign-up and the contents of tokens that the application receives on successful sign-ups.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]

Click **Sign-up policies**.

Click **+Add** at the top of the blade.

The **Name** determines the sign-up policy name used by your application. For example, enter **SiUp**.

Click **Identity providers** and select **Email signup**. Optionally, you can also select social identity providers, if already configured. Click **OK**.

Click **Sign-up attributes**. Here you choose attributes that you want to collect from the consumer during sign-up. For example, select **Country/Region**, **Display Name**, and **Postal Code**. Click **OK**.

Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful sign-up experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**, **User is new**, and **User's Object ID**.

Click **Create**. The policy created appears as **B2C_1_SiUp** (the **B2C\_1\_** fragment is automatically added) in the **Sign-up policies** blade.

Open the policy by clicking **B2C_1_SiUp**.

Select **Contoso B2C app** in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.

Click **Run now**. A new browser tab opens, and you can run through the consumer experience of signing up for your application.

> [!NOTE]
> It takes up to a minute for policy creation and updates to take effect.
>