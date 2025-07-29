---
title: Delete an Azure Automation Run As account
description: This article tells how to delete a Run As account with PowerShell or from the Azure portal.
services: automation
ms.subservice: process-automation
ms.date: 04/11/2025
ms.topic: how-to
ms.service: azure-automation
ms.author: v-jasmineme
author: jasminemehndir
---

# Delete an Azure Automation Run As account

> [!IMPORTANT]
> Azure Automation Run as accounts, including  Classic Run as accounts have retired on **30 September 2023** and replaced with [Managed Identities](automation-security-overview.md#managed-identities). You would no longer be able to create or renew Run as accounts through the Azure portal. For more information, see [migrating from an existing Run As accounts to managed identity](migrate-run-as-accounts-managed-identity.md?tabs=run-as-account#sample-scripts).

Run As accounts in Azure Automation provide authentication for managing resources on the Azure Resource Manager or Azure Classic deployment model using Automation runbooks and other Automation features. This article describes how to delete a Run As or Classic Run As account. When you perform this action, the Automation account is retained.

## Permissions for Run As accounts and Classic Run As accounts

To configure or update or delete a Run As account and a Classic Run As accounts, you must either be:

- An owner of the Microsoft Entra Application for the Run As Account.

    (or)

- A member in one of the following Microsoft Entra roles.
    - Application Administrator
    - Cloud Application Administrator

You can delete the Service principal from the **Microsoft Entra ID** portal > **App registrations** > search and select your Automation account name and in the **Overview** page, select **Delete**.

## Next steps

- [Use system-assigned managed identity](enable-managed-identity-for-automation.md).
- [Use user-assigned managed identity](add-user-assigned-identity.md).
