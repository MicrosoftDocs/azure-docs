---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: marsma
# Used by the web app/web API tutorials for granting a web application access to
# a registered web API application
---
#### [Applications](#tab/applications/)

1. Select **Applications**, and then select the web application that should have access to the API. For example, *webapp1*.
1. Select **API access**, and then select **Add**.
1. In the **Select API** dropdown, select the API to which web application should be granted access. For example, *webapi1*.
1. In the **Select Scopes** dropdown, select the scopes that you defined earlier. For example, *demo.read* and *demo.write*.
1. Select **OK**.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. Select **App registrations (Preview)**, and then select the web application that should have access to the API. For example, *webapp1*.
1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select the **My APIs** tab.
1. Select the API to which the web application should be granted access. For example, *webapi1*.
1. Under **PERMISSION**, expand **demo**, and then select the scopes that you defined earlier. For example, *demo.read* and *demo.write*.
1. Select **Add permissions**. As directed, wait a few minutes before proceeding to the next step.
1. Select **Grant admin consent for (your tenant name)**.
1. Select your currently signed-in administrator account, or sign in with an account in your Azure AD B2C tenant that's been assigned at least the *Cloud application administrator* role.
1. Select **Accept**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **STATUS** for both scopes. It might take a few minutes for the permissions to propagate.