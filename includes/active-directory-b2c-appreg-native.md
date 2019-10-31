---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: marsma
# Used by articles that register native client applications in the B2C tenant.
---
To register an application in your Azure AD B2C tenant, you can use the current **Applications** experience, or our new unified **App registrations (Preview)** experience. [Learn more about the preview experience](https://aka.ms/b2cappregintro).

#### [Applications](#tab/applications/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *nativeapp1*.
1. For **Native client**, select **Yes**.
1. Enter a **Custom Redirect URI** with a unique scheme. For example, `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`. There are two important considerations when choosing a redirect URI:
    * **Unique**: The scheme of the redirect URI must be unique for every application. In the example `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`, `com.onmicrosoft.contosob2c.exampleapp` is the scheme. This pattern should be followed. If two applications share the same scheme, the user is given a choice to choose an application. If the user chooses incorrectly, the sign-in fails.
    * **Complete**: The redirect URI must have a both a scheme and a path. The path must contain at least one forward slash after the domain. For example, `//oauth/` works while `//oauth` fails. Don't include special characters in the URI, for example, underscores.
1. Select **Create**.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations (Preview)**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *nativeapp1*.
1. Under **Supported account types**, select **Accounts in any organizational directory or any identity provider**.
1. Under **Redirect URI**, use the drop-down to select **Public client/native (mobile & desktop)**.
1. Enter a redirect URI with a unique scheme. For example, `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`. There are two important considerations when choosing a redirect URI:
    * **Unique**: The scheme of the redirect URI must be unique for every application. In the example `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`, `com.onmicrosoft.contosob2c.exampleapp` is the scheme. This pattern should be followed. If two applications share the same scheme, the user is given a choice to choose an application. If the user chooses incorrectly, the sign-in fails.
    * **Complete**: The redirect URI must have a both a scheme and a path. The path must contain at least one forward slash after the domain. For example, `//oauth/` works while `//oauth` fails. Don't include special characters in the URI, for example, underscores.
1. Under **Permissions**, select the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.