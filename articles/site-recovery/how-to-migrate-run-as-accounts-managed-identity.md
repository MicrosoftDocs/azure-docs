---
title: Migrate from a Run As account to a managed identity.
description: This article describes how to migrate from a Run As account to a managed identity in Azure Site Recovery.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.author: ankitadutta
ms.topic: how-to 
ms.date: 01/19/2023
---

# Manage identities for automation accounts

> [!IMPORTANT]
> - Azure Automation Run As Account will retire on September 30, 2023 and will be replaced with Managed Identities. Before that date, you'll need to start migrating your runbooks to use [managed identities](/articles/automation/automation-security-overview.md#managed-identities). For more information, see [migrating from an existing Run As accounts to managed identity](/articles/automation/migrate-run-as-accounts-managed-identity?tabs=run-as-account#sample-scripts).
> - Delaying the feature has a direct impact on our support burden, as it would cause upgrades of mobility agent to fail.

This article shows you how to migrate a Managed Identities for Azure Site Recovery applications. Azure Automation Accounts are used by Azure Site Recovery customers to auto-update the agents of their protected virtual machines. Site Recovery creates Azure Automation Run As Accounts when you enable replication via the IaaS VM Blade and Recovery Services Vault. 


## Prerequisites

Before you migrate from a Run As account to a managed identity:

1. Create a [system-assigned](../automation/enable-managed-identity-for-automation.md) or [user-assigned](../automation/add-user-assigned-identity.md) managed identity, or create both types. To learn more about the differences between them, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

    > [!NOTE]
    > - User-assigned identities are supported for cloud jobs only. It isn't possible to use the Automation account's user-managed identity on a hybrid runbook worker. To use hybrid jobs, you must create system-assigned identities. 
    > - There are two ways to use managed identities in hybrid runbook worker scripts: either the system-assigned managed identity for the Automation account *or* the virtual machine (VM) managed identity for an Azure VM running as a hybrid runbook worker. 
    > - The VM's user-assigned managed identity and the VM's system-assigned managed identity will *not* work in an Automation account that's configured with an Automation account's managed identity. When you enable the Automation account's managed identity, you can use only the Automation account's system-assigned managed identity and not the VM managed identity. For more information, see [Use runbook authentication with managed identities](../automation/automation-hrw-run-runbooks.md).

1. Assign the same role to the managed identity to access the Azure resources that match the Run As account. Follow the steps in [Check the role assignment for the Azure Automation Run As account](../automation/manage-run-as-account.md#check-role-assignment-for-azure-automation-run-as-account).

   Ensure that you don't assign high-privilege permissions like contributor or owner to the Run As account. Follow the role-based access control (RBAC) guidelines to limit the permissions from the default contributor permissions assigned to a Run As account by using [this script](../automation/manage-run-as-account.md#limit-run-as-account-permissions). 
 
## Configure managed identities 

You can configure your managed identities through:

- Azure portal
- Azure CLI
- your Azure Resource Manager (ARM) template

When a managed identity is added, deleted, or modified on a running container app, the app doesn't automatically restart and a new revision isn't created.

> [!NOTE]
> For more information about migration cadence and the support timeline for Run As account creation and certificate renewal, see the [frequently asked questions](../automation/automation-managed-identity-faq.md).

> [!NOTE]
> When adding a managed identity to a container app deployed before April 11, 2022, you must create a new revision.

## Migrate from an existing Run As account to a managed identity

### Portal experience



## Next steps

Learn more about:
- [Managed identities](../active-directory/managed-identities-azure-resources/overview).
- [Using a system-assigned managed identity for an Azure Automation account](../automation/enable-managed-identity-for-automation).
- [Using a user-assigned managed identity for an Azure Automation account](../automation/add-user-assigned-identity).