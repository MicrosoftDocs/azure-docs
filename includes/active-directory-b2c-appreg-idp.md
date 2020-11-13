---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: mimart
# Used by the identity provider (IdP) setup articles under "Custom policy"
---

To register an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *testapp1*.
1. Select **Accounts in any organizational directory or any identity provider**.
1. Under **Redirect URI**, select **Web**, and then enter `https://jwt.ms` in the URL text box.
1. Under **Permissions**, select the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.

Once the application registration is complete, enable the implicit grant flow:

1. Under **Manage**, select **Authentication**.
1. Select **Try out the new experience** (if shown).
1. Under **Implicit grant**, select both the **Access tokens** and **ID tokens** check boxes.
1. Select **Save**.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *testapp1*.
1. For **Web App / Web API**, select **Yes**.
1. For **Reply URL**, enter `https://jwt.ms`
1. Select **Create**.