---
title: Delete an Azure Automation Run As account
description: This article tells how to delete a Run As account with PowerShell or from the Azure portal.
services: automation
ms.subservice: process-automation
ms.date: 09/01/2023
ms.topic: conceptual
---

# Delete an Azure Automation Run As account

> [!IMPORTANT]
> Azure Automation Run As Account will retire on September 30, 2023 and will be replaced with Managed Identities. Before that date, you'll need to start migrating your runbooks to use [managed identities](automation-security-overview.md#managed-identities). For more information, see [migrating from an existing Run As accounts to managed identity](/azure/automation/migrate-run-as-accounts-managed-identity?tabs=run-as-account#sample-scripts) to start migrating the runbooks from Run As account to managed identities before 30 September 2023.

Run As accounts in Azure Automation provide authentication for managing resources on the Azure Resource Manager or Azure Classic deployment model using Automation runbooks and other Automation features. This article describes how to delete a Run As or Classic Run As account. When you perform this action, the Automation account is retained. After you delete the Run As account, you can re-create it in the Azure portal or with the provided PowerShell script.

## Permissions for Run As accounts and Classic Run As accounts

To configure or update or delete a Run As account and a Classic Run As accounts, you must either be:

- An owner of the Azure AD Application for the Run As Account

    (or)

- A member in one of the following Azure AD roles
    - Application Administrator
    - Cloud Application Administrator
    - Global Administrator

To learn more about permissions, see [Run As account permissions](automation-security-overview.md#permissions).


## Delete a Run As or Classic Run As account

1. In the Azure portal, open the Automation account.

2. In the left pane, select **Run As Accounts** in the account settings section.

3. On the Run As Accounts properties page, select either the Run As account or Classic Run As account that you want to delete.

4. On the Properties pane for the selected account, click **Delete**.

   ![Delete Run As account](media/delete-run-as-account/automation-account-delete-run-as.png)

5. While the account is being deleted, you can track the progress under **Notifications** from the menu. Run As accounts can't be restored after deletion.

> [!NOTE]
> We recommend that you delete the Run As account from Automation account portal. Alternatively, you can delete the Service principal from the **Azure Active Directory** portal > **App registrations** > search and select your Automation account name and in the **Overview** page, select **Delete**.

## Next steps

- [Use system-assigned managed identity](enable-managed-identity-for-automation.md).
- [Use user-assigned managed identity](add-user-assigned-identity.md).