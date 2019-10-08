---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 10/01/2019
ms.author: marsma
# Used by the web app/web API tutorials for granting a web application access to
# a registered web API application
---
1. Select **Applications (Preview)**, and then select the web application that should have access to the API. For example, *webapp1*.
1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select the **My APIs** tab.
1. Select the API to which the web application should be granted access. For example, *webapi1*.
1. Under **PERMISSION**, expand **demo**, and then select the scopes that you defined earlier. For example, *demo.read* and *demo.write*.
1. Select **Add permissions**. As directed, wait at least **10 seconds** before proceeding to the next step.
1. Select **Grant admin consent for (your tenant name)**.
1. Select a tenant administrator account.
1. Select **Accept**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **STATUS**. It might take a few minutes for the permissions to propagate.