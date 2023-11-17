---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 11/20/2023
ms.author: kengaderdus
# Used by articles that interact with the Microsoft Graph API for user object manipulation.
---

#### App registrations

1. Under **Manage**, select **API permissions**.
1. Under **Configured permissions**, select **Add a permission**.
1. Select the **Microsoft APIs** tab, then select **Microsoft Graph**.
1. Select **Application permissions**.
1. Expand the appropriate permission group and select the check box of the permission to grant to your management application. For example:
    * **User** > **User.ReadWrite.All**: For user migration or user management scenarios.
    * **Group** > **Group.ReadWrite.All**: For creating groups, read and update group memberships, and delete groups.
    * **AuditLog** > **AuditLog.Read.All**: For reading the directory's audit logs.
    * **Policy** > **Policy.ReadWrite.TrustFramework**: For continuous integration/continuous delivery (CI/CD) scenarios. For example, custom policy deployment with Azure Pipelines.
1. Select **Add permissions**. As directed, wait a few minutes before proceeding to the next step.
1. Select **Grant admin consent for (your tenant name)**.
1. If you are not currently signed-in with Global Administrator account, sign in with an account in your Azure AD B2C tenant that's been assigned at least the *Cloud application administrator* role and then select **Grant admin consent for (your tenant name)**.
1. Select **Refresh**, and then verify that "Granted for ..." appears under **Status**. It might take a few minutes for the permissions to propagate.
