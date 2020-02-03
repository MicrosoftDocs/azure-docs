---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 02/08/2020
ms.author: marsma
# Used by articles that interact with the Microsoft Graph API for user object manipulation.
---
#### [Applications](#tab/applications/)

1. On the **Registered app** overview page, select **Settings**.
1. Under **API Access**, select **Required permissions**.
1. Select **Microsoft Graph**.
1. Under **Application Permissions**, select the check box of the permission to grant to your management application. For example:
    * **Read and write directory data**: Select this permission for user migration or user management scenarios.
    * **Read and write your organization's trust framework policies**: Select this permission for continuous integration/continuous delivery (CI/CD) scenarios. For example, custom policy deployment with Azure Pipelines.
1. Select **Save**.
1. Select **Grant permissions**, and then select **Yes**. It might take a few minutes to for the permissions to fully propagate.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select **Microsoft Graph**.
1. Select **Application permissions**.
1. Expand **Directory** and then select the check box of the permission to grant to your management application. For example:
    * **Directory.ReadWrite.All**: Select this permission for user migration or user management scenarios.
    * **Policy.ReadWrite.TrustFramework**: Select this permission for continuous integration/continuous delivery (CI/CD) scenarios. For example, custom policy deployment with Azure Pipelines.
1. Select **Add permissions**. As directed, wait a few minutes before proceeding to the next step.
1. Select **Grant admin consent for (your tenant name)**.
1. Select a tenant administrator account.
1. Select **Accept**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **Status**. It might take a few minutes for the permissions to propagate.