To enable sign-in on your application, you will need to create a sign-in policy. This policy describes the experiences that consumers will go through during sign-in and the contents of tokens that the application will receive on successful sign-ins.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]

Click **Sign-up or sign-in policies** in settings.
[!INCLUDE [active-directory-b2c-add-policy](active-directory-b2c-add-policy.md)]

Open the policy by clicking "**B2C_1_SiUpIn**".

Select "Contoso B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down.

Click **Run now**. A new browser tab opens, and you can run through the sign-up or sign-in consumer experience as configured.

> [!NOTE]
> It takes up to a minute for policy creation and updates to take effect.
>