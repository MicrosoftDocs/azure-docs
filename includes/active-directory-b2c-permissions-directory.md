---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: marsma
# Used by articles that interact with the Graph API for user object manipulation.
# Currently used only for those articles that reference the Azure AD Graph API, not MS Graph.
# TODO: Once MS Graph API supports user object manipulation in a B2C tenant, convert this to use MS Graph.
---
#### [Applications](#tab/applications/)

1. On the **Registered app** overview page, select **Settings**.
1. Under **API ACCESS**, select **Required permissions**.
1. Select **Windows Azure Active Directory**.
1. Under **APPLICATION PERMISSIONS**, select **Read and write directory data**.
1. Select **Save**.
1. Select **Grant permissions**, and then select **Yes**. It might take a few minutes to for the permissions to fully propagate.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select **Azure Active Directory Graph**.
1. Select **Application permissions**.
1. Expand **Directory** and then select the **Directory.ReadWrite.All** check box.
1. Select **Add permissions**. As directed, wait a few minutes before proceeding to the next step.
1. Select **Grant admin consent for (your tenant name)**.
1. Select a tenant administrator account.
1. Select **Accept**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **STATUS**. It might take a few minutes for the permissions to propagate.