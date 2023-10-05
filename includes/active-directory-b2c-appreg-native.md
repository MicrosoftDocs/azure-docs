---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 05/26/2021
ms.author: kengaderdus
# Used by articles that register native client applications in the B2C tenant.
---
To register an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](../articles/active-directory-b2c/app-registrations-training-guide.md).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *nativeapp1*.
1. Under **Supported account types**, select **Accounts in any organizational directory or any identity provider**.
1. Under **Redirect URI**, use the drop-down to select **Public client/native (mobile & desktop)**.
1. Enter a redirect URI with a unique scheme. For example, `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`. There are important considerations when choosing a redirect URI:
    * **Development** For development use, and **desktop apps**, you can set the redirect URI to `http://localhost` and Azure AD B2C will respect any port in the request. If the registered URI contains a port, Azure AD B2C will use that port only. For example, if the registered redirect URI is `http://localhost`, the redirect URI in the request can be `http://localhost:<randomport>`. If the registered redirect URI is `http://localhost:8080`, the redirect URI in the request must be `http://localhost:8080`.
    * **Unique**: The scheme of the redirect URI must be unique for every application. In the example `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`, `com.onmicrosoft.contosob2c.exampleapp` is the scheme. This pattern should be followed. If two applications share the same scheme, the user is given a choice to choose an application. If the user chooses incorrectly, the sign-in fails.
    * **Complete**: The redirect URI must have a both a scheme and a path. The path must contain at least one forward slash after the domain. For example, `//oauth/` works while `//oauth` fails. Don't include special characters in the URI, for example, underscores.
1. Under **Permissions**, select the *Grant admin consent to openid and offline_access permissions* check box.
2. Select **Register**.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications (Legacy)**, and then select **Add**.
1. Enter a name for the application. For example, *nativeapp1*.
1. For **Native client**, select **Yes**.
1. Enter a **Custom Redirect URI** with a unique scheme. For example, `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`. There are two important considerations when choosing a redirect URI:
    * **Unique**: The scheme of the redirect URI must be unique for every application. In the example `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`, `com.onmicrosoft.contosob2c.exampleapp` is the scheme. This pattern should be followed. If two applications share the same scheme, the user is given a choice to choose an application. If the user chooses incorrectly, the sign-in fails.
    * **Complete**: The redirect URI must have a both a scheme and a path. The path must contain at least one forward slash after the domain. For example, `//oauth/` works while `//oauth` fails. Don't include special characters in the URI, for example, underscores.
1. Select **Create**.
