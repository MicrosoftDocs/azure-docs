---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 10/01/2019
ms.author: marsma
# Used by the identity provider (IdP) setup articles under "Custom policy"
---
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
