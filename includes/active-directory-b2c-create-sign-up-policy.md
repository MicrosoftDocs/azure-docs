---
author: PatAltimore
ms.service: active-directory-b2c 
ms.topic: include
ms.date: 11/30/2018
ms.author: patricka
---
If you want to only enable sign-up on your application, you use a **sign-up** user flow. This user flow describes the experiences that customers go through during sign-up and the contents of tokens that the application receives on successful sign-ups.

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](active-directory-b2c-portal-navigate-b2c-service.md)]

Under **Manage**, select **User flows**.

Click +**New user flow** at the top of the blade.

Under **Select a user flow type**, select **All**, and then select the version of **Sign up** you want to use.

The **Name** determines the sign-up user flow name used by your application. For example, enter **SiUp**.

Under **Identity providers**, select **Email signup**. Optionally, you can also select social identity providers, if already configured.

Under  **User attributes and claims**, click **Show more**.

In the **Collect attribute** column, choose attributes that you want to collect from the consumer during sign-up. For example, select **Country/Region**, **Display Name**, and **Postal Code**.

In the **Return claim** column, choose claims that you want returned in the tokens sent back to your application after a successful sign-up experience. For example, select **Display Name**, **Identity Provider**, **Postal Code**, **User is new**, and **User's Object ID**.

Click **OK**.

Click **Create**. The user flow created appears as **B2C_1_SiUp** (the **B2C\_1\_** fragment is automatically added).

Click **Run user flow**.

Select **Contoso B2C app** in the **Application** drop-down and `https://localhost:44321/` in the **Reply URL** drop-down.

Click **Run user flow**. A new browser tab opens, and you can run through the consumer experience of signing up for your application.

> [!NOTE]
> It takes up to a minute for user flow creation and updates to take effect.
>