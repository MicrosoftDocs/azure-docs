---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select the **My APIs** tab.
1. Select the API to which the web application should be granted access. For example, *my-api1*.
1. Under **Permission**, expand **tasks**, and then select the scopes that you defined earlier. For example, *tasks.read* and *tasks.write*.
1. Select **Add permissions**.
1. Select **Grant admin consent for (your tenant name)**.
1. Select **Yes**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **Status** for both scopes.
1. From the list of **Configured permissions**, select your scope and copy the scope full name. 

    ![Get your web application scop](./media/active-directory-b2c-app-integration-grant-permissions/get-azure-ad-b2c-app-permissions.png)  