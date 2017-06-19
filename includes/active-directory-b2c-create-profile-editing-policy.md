To enable profile editing on your application, you will need to create a profile editing policy. This policy describes the experiences that consumers will go through during profile editing and the contents of tokens that the application will receive on successful completion.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]

Click **Profile editing policies**.

Click **+Add** at the top of the blade.

The **Name** determines the profile editing policy name used by your application. For example, enter "SiPe".

Click **Identity providers** and select "Local Account Signin". Optionally, you can also select social identity providers, if already configured. Click **OK**.

Click **Profile attributes**. Here you choose attributes that the consumer can view and edit. For example, select "Country/Region", "Display Name", and "Postal Code". Click **OK**.

Click **Application claims**. Here you choose claims that you want returned in the tokens sent back to your application after a successful profile editing experience. For example, select "Display Name" and "Postal Code".

Click **Create**. Note that the policy just created appears as "**B2C_1_SiPe**" (the **B2C\_1\_** fragment is automatically added) in the **Profile editing policies** blade.

Open the policy by clicking "**B2C_1_SiPe**".

Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.

Click **Run now**. A new browser tab opens, and you can run through the profile editing consumer experience in your application.

> [!NOTE]
> It takes up to a minute for policy creation and updates to take effect.
>