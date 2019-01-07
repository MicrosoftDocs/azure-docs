---
author: PatAltimore
ms.service: active-directory-b2c 
ms.topic: include
ms.date: 11/30/2018
ms.author: patricka
---
If you want to only enable sign-in on your application, you use a **sign-in** user flow. This user flow describes the experiences that customers will go through during sign-in and the contents of tokens that the application will receive on successful sign-ins.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]
Under **Manage**, select **User flows**.

Click +**New user flow** at the top of the blade.

Under **Select a user flow type**, select **All**, and then select the version of **Sign in** you want to use.

The **Name** determines the sign-in user flow name used by your application. For example, enter **SiIn**.

Under **Identity providers**, select an option. You can also select social identity providers, if already configured. Click **OK**.

Under **Application claims**, click **Show more**.

In the **Return claim** column, choose claims that you want returned in the tokens sent back to your application after a successful sign-in experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**  and **User's Object ID**. Click **OK**.

Click **Create**. Note that the user flow just created appears as **B2C_1_SiIn** (the **B2C\_1\_** fragment is automatically added).

Click **Run user flow**.

Select **Contoso B2C app** in the **Application** drop-down and `https://localhost:44321/` in the **Reply URL** drop-down.

Click **Run user flow**. A new browser tab opens, and you can run through the consumer experience of signing into your application.

> [!NOTE]
> It takes up to a minute for user flow creation and updates to take effect.
>