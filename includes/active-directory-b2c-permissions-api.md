---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/11/2024
ms.author: kengaderdus
# Used by the web app/web API tutorials for granting a web application access to a registered web API application.
---

1. Select **App registrations**, and then select the web application that should have access to the API. For example, *webapp1*.
1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select the **My APIs** tab.
1. Select the API to which the web application should be granted access. For example, *webapi1*.
1. Under **Permission**, expand **demo**, and then select the scopes that you defined earlier. For example, *demo.read* and *demo.write*.
1. Select **Add permissions**.
1. Select **Grant admin consent for (your tenant name)**.
1. If you're prompted to select an account, select your currently signed-in administrator account, or sign in with an account in your Azure AD B2C tenant that's been assigned at least the *Cloud application administrator* role.
1. Select **Yes**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **Status** for both scopes.