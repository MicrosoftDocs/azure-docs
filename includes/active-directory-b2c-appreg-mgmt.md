---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 10/01/2019
ms.author: marsma
# Used by user and audit log management articles. Application is used for
# interacting with Graph API (AD Graph or MS Graph, depending on article).
---
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications (Preview)**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *managementapp1*.
1. Select **Accounts in this organizational directory only**.
1. Under **Redirect URI**, select **Web**, and then enter any valid URL in **Sign-on URL**. For example, `https://localhost`. The endpoint doesn't need to be reachable, but must be a valid URL.
1. Under **Permissions**, leave the *Grant admin consent to openid and offline_access permissions* checkbox **checked**.
1. Select **Register**.
1. Record the **Application (client) ID** that appears on the application overview page. You use this value in a later step.