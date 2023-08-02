---
title: We're retiring classic storage accounts on August 31, 2024
titleSuffix: Azure Storage
description: Overview of migration of classic storage accounts to the Azure Resource Manager deployment model. All classic accounts must be migrated by August 31, 2024.
services: storage
author: tamram

ms.service: azure-storage
ms.topic: conceptual
ms.date: 07/26/2023
ms.author: tamram
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
---

# Migrate your classic storage accounts to Azure Resource Manager by August 31, 2024

The [Azure Resource Manager](../../azure-resource-manager/management/overview.md) deployment model now offers extensive functionality for Azure Storage accounts. For this reason, we deprecated the management of classic storage accounts through Azure Service Manager (ASM) on August 31, 2021. Classic storage accounts will be fully retired on August 31, 2024. All data in classic storage accounts must be migrated to Azure Resource Manager storage accounts by that date.

If you have classic storage accounts, start planning your migration now. Complete it by August 31, 2024, to take advantage of Azure Resource Manager.

To learn more about the classic versus Azure Resource Manager deployment models, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md#changes-for-compute-network-and-storage).

Storage accounts created using the classic deployment model follow the [Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy) for retirement.

## Why is a migration required?

On August 31, 2024, we'll retire classic Azure storage accounts and they'll no longer be accessible. Before that date, you must migrate your storage accounts to Azure Resource Manager, and update your applications to use [Azure Storage resource provider](/rest/api/storagerp/) APIs.

The Azure Storage resource provider is the implementation of Azure Resource Manager for Azure Storage. To learn more about resource providers in Azure Resource Manager, see [Resource providers and resource types](../../azure-resource-manager/management/resource-providers-and-types.md).

Azure Resource Manager storage accounts provide all of the same functionality, as well as new features, including:

- A [consistent management layer](../../azure-resource-manager/management/overview.md#consistent-management-layer) that simplifies deployment by enabling you to create, update, and delete resources.
- [Resource grouping](../../azure-resource-manager/management/overview.md#resource-groups), which allows you to deploy, monitor, manage, and apply access control policies to resources as a group.
- All new features for Azure Storage are implemented for storage accounts in Azure Resource Manager deployments. Customers that are still using classic resources will not have access to new features and updates.

For more information about the advantages of using Azure Resource Manager, see [The benefits of using Resource Manager](../../azure-resource-manager/management/overview.md#the-benefits-of-using-resource-manager).

## What happens if I don't migrate my accounts?

Starting on September 1, 2024, customers will no longer be able to manage classic storage accounts using Azure Service Manager. Any data still contained in these accounts will be preserved.

If your applications are using Azure Service Manager classic APIs to manage classic accounts, then those applications will no longer be able to manage those storage accounts after August 31, 2024.

> [!WARNING]
> If you do not migrate your classic storage account to Azure Resource Manager by August 31, 2024, you will no longer be able to perform management operations through Azure Service Manager.

## What actions should I take?

Before you get started with the migration, read [Understand storage account migration from the classic deployment model to Azure Resource Manager](classic-account-migration-process.md) for an overview of the process.

To migrate your classic storage accounts, you should:

1. Identify all classic storage accounts in your subscription. To learn how, see [Identify classic storage accounts in your subscription](classic-account-migrate.md#identify-classic-storage-accounts-in-your-subscription).
1. Delete any classic (unmanaged) disks or disk artifacts in your classic storage accounts. To learn how to delete classic disk artifacts, see [Locate and delete any disk artifacts in a classic account](classic-account-migrate.md#locate-and-delete-any-disk-artifacts-in-a-classic-account).
1. Migrate any classic storage accounts to [Azure Resource Manager](../../azure-resource-manager/management/overview.md). For step-by-step instructions on performing the migration, see [How to migrate your classic storage accounts to Azure Resource Manager](classic-account-migrate.md).
1. Check your applications and logs to determine whether you're dynamically creating, updating, or deleting classic storage accounts from your code, scripts, or templates. If you are, then you must update your applications to use Azure Resource Manager APIs for account management. For more information, see [Update your applications to use Azure Resource Manager APIs](classic-account-migrate.md#update-your-applications-to-use-azure-resource-manager-apis).

## How to get help

- If you have questions, get answers from community experts in [Microsoft Q&A](/answers/tags/98/azure-storage-accounts).
- If your organization or company has partnered with Microsoft or works with Microsoft representatives, such as cloud solution architects (CSAs) or customer success account managers (CSAMs), contact them for additional resources for migration.
- If you have a support plan and you need technical help, create a support request in the Azure portal:

    1. Search for **Help + support** in the [Azure portal](https://portal.azure.com#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).
    1. Select **Create a support request**.
    1. For **Summary**, type a description of your issue.
    1. For **Issue type**, select **Technical**.
    1. For **Subscription**, select your subscription.
    1. For **Service**, select **My services**.
    1. For **Service type**, select **Storage Account Management**.
    1. For **Resource**, select the resource you want to migrate.
    1. For **Problem type**, select **Data Migration**.
    1. For **Problem subtype**, select **Migrate account to new resource group/subscription/region/tenant**.
    1. Select **Next**, then follow the instructions to submit your support request.

## FAQ

### How do I migrate my classic storage accounts to Resource Manager?

For step-by-step instructions for migrating your classic storage accounts, see [How to migrate your classic storage accounts to Azure Resource Manager](classic-account-migrate.md). For an in-depth overview of the migration process, see [Understand storage account migration from the classic deployment model to Azure Resource Manager](classic-account-migration-process.md).

### Can I create new classic accounts?

Depending on when your subscription was created, you may no longer be able to create classic storage accounts:

- Subscriptions created after August 31, 2022 can no longer create classic storage accounts.
- Subscriptions created before September 1, 2022 will be able to create classic storage accounts until September 1, 2023.
- Also, beginning August 31, 2022, the ability to create classic storage accounts has been discontinued in additional phases based on the last time a classic storage account was created.

We recommend creating storage accounts only in Azure Resource Manager from this point forward.

### What happens to existing classic storage accounts after August 31, 2024?

After August 31, 2024, you'll no longer be able to manage data in your classic storage accounts through Azure Service Manager. The data will be preserved but we highly recommend migrating these accounts to Azure Resource Manager to avoid any service interruptions.

### Will there be downtime when migrating my storage account from Classic to Resource Manager?

There's no downtime for data plane operations while you are migrating a classic storage account to Resource Manager. Management plane operations are blocked during the migration. For more information, see [Understand storage account migration from the classic deployment model to Azure Resource Manager](classic-account-migration-process.md).

There may be downtime for scenarios linked to classic virtual machine (VM) migration or unmanaged disk migration. For more information about those scenarios, see [Migration classic VMs](../../virtual-machines/classic-vm-deprecation.md) and [Migrating unmanaged disks to managed disks](../../virtual-machines/unmanaged-disks-deprecation.md).

### What operations aren't available during the migration?

Also, during the migration, management operations aren't available on the storage account. Data operations can continue to be performed during the migration.

If you're creating or managing container objects with the Azure Storage resource provider, keep in mind that those operations are blocked while the migration is underway. For more information, see [Understand storage account migration from the classic deployment model to Azure Resource Manager](classic-account-migration-process.md).

### How do I migrate storage accounts that contain classic disk artifacts?

If your classic storage accounts contain classic (unmanaged) disks, virtual machine images, or operating system (OS) images, you'll need to delete these artifacts before you begin the migration. Failing to delete these artifacts may cause the migration to fail. To learn how to delete classic disk artifacts, see [Locate and delete any disk artifacts in a classic account](classic-account-migrate.md#locate-and-delete-any-disk-artifacts-in-a-classic-account).

We recommend migrating unmanaged disks to managed disks. To learn about migrating unmanaged disks to managed disks, see [Migrating unmanaged disks to managed disks](../../virtual-machines/unmanaged-disks-deprecation.md).

### Are storage account access keys regenerated as part of the migration?

No, account access keys aren't regenerated during the migration. Your access keys and connection strings will continue to work unchanged after the migration is complete.

### Are Azure RBAC role assignments maintained through the migration?

Any RBAC role assignments that are scoped to the classic storage account are maintained after the migration.

### What type of storage account is created by the migration process?

Your storage account will be a general-purpose v1 account after the migration process completes. You can then upgrade it to general-purpose v2. For more information about upgrading your account, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md).

### Will the URL of my storage account remain the same post-migration?

Yes, the migrated storage account has the same name and address as the classic account.

### Can verbose logging be added as part of the migration process?

No, migration is a service that doesn't have capabilities to provide additional logging.

## See also

- [How to migrate your classic storage accounts to Azure Resource Manager](classic-account-migrate.md)
- [Understand storage account migration from the classic deployment model to Azure Resource Manager](classic-account-migration-process.md)
