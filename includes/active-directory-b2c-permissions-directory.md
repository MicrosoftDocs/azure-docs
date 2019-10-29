---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 10/02/2019
ms.author: marsma
# Used by articles that interact with the Graph API for user object manipulation.
# Currently used only for those articles that reference the Azure AD Graph API, not MS Graph.
# TODO: Once MS Graph API supports user object manipulation in a B2C tenant, convert this to use MS Graph.
---
1. On the **Registered app** overview page, select **Settings**.
1. Under **API ACCESS**, select **Required permissions**.
1. Select **Windows Azure Active Directory**.
1. Under **APPLICATION PERMISSIONS**, select **Read and write directory data**.
1. Select **Save**.
1. Select **Grant permissions**, and then select **Yes**. It might take a few minutes to for the permissions to fully propagate.