---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: marsma
# Used by user and audit log management articles. Application is used for
# interacting with Graph API (AD Graph or MS Graph, depending on article).
---
To register an application in your Azure AD B2C tenant, you can use the current **Applications** experience, or our new unified **App registrations (Preview)** experience. [Learn more about the preview experience](https://aka.ms/b2cappregintro).

#### [Applications](#tab/applications/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure Active Directory** (*not* Azure AD B2C). Or, select **All services** and then search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations (Legacy)**.
1. Select **New application registration**.
1. Enter a name for the application. For example, *managementapp1*.
1. For **Application type**, select **Web app / API**.
1. Enter any valid URL in **Sign-on URL**. For example, `https://localhost`. The endpoint doesn't need to be reachable, but must be a valid URL.
1. Select **Create**.
1. Record the **Application ID** that appears on the **Registered app** overview page. You use this value in a later step.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations (Preview)**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *managementapp1*.
1. Select **Accounts in this organizational directory only**.
1. Under **Permissions**, clear the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.
1. Record the **Application (client) ID** that appears on the application overview page. You use this value in a later step.