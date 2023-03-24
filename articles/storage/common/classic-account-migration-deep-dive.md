---
title: Technical deep dive on migration from classic accounts to Azure Resource Manager
titleSuffix: Azure Storage
description: Deep dive - migrate your classic storage accounts to the Azure Resource Manager deployment model. All classic accounts must be migrated by August 31, 2024.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/17/2023
ms.author: tamram
ms.subservice: common
---

# Technical deep dive on migration from classic accounts to Azure Resource Manager

> [!IMPORTANT]
> Today, about 90% of IaaS VMs are using [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/). As of February 28, 2020, classic VMs have been deprecated and will be fully retired on September 1, 2023. [Learn more]( https://aka.ms/classicvmretirement) about this deprecation and [how it affects you](./classic-vm-deprecation.md#how-does-this-affect-me).
???do we want similar stats for storage?

Let's take a deep-dive on migrating storage accounts from the Azure classic deployment model to the Azure Resource Manager deployment model. We look at resources at a resource and feature level to help you understand how the Azure platform migrates resources between the two deployment models. For more information, please read the service announcement article: [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-overview.md).

## Understand the data plane and management plane

First, it's helpful to understand the basic architecture of Azure Storage. Azure Storage offers services that store data, including Blob Storage, Azure Data Lake Storage, Azure Files, Queue Storage, and Table Storage. These services and the operations they expose comprise the *data plane* for Azure Storage. Azure Storage also exposes operations for managing an Azure Storage account and related resources, such as redundancy SKUs, account keys, and certain policies. These operations comprise the *management* or *control* plane.

:::image type="content" source="media/classic-account-migration-deep-dive/storage-architecture-diagram.png" alt-text="Diagram showing the Azure Storage data and management plane architecture.":::

During the migration process, Microsoft translates the representation of the storage account resource from the classic deployment model to the Azure Resource Manager deployment model. As a result, you need to use new tools, APIs, and SDKs to manage your storage accounts and related resources after the migration.

The data plane is unaffected by migration from the classic deployment model to the Azure Resource Manager model. The data in your migrated storage account will be identical to the data in the original storage account.

## The migration experience

You can migrate your classic storage account with the Azure portal, PowerShell, or Azure CLI. To learn how to migrate your account, see [Migrate your classic storage accounts to Azure Resource Manager](storage-account-migrate-classic.md).

### Before the migration

Before you start the migration:

- Ensure that the storage accounts that you want to migrate don't use any unsupported features or configurations. Usually the platform detects these issues and generates an error.
- Plan your migration during non-business hours to accommodate for any unexpected failures that might happen during migration.
- Evaluate any Azure role-based access control (Azure RBAC) roles that are configured on the classic storage account, and plan for after the migration is complete. ???is this even possible with classic accts?
- If possible, halt write operations to the storage account for the duration of the migration.

### During the migration

There are four steps to the migration process, as shown in the following diagram:

:::image type="content" source="media/classic-account-migration-deep-dive/migration-workflow.png" alt-text="Screenshot showing the account migration workflow.":::

1. **Validate**. During the Validation phase, Azure checks the storage account to ensure that it can be migrated.
1. **Prepare**. In the Prepare phase, Azure creates a new general-purpose v1 storage account and alerts you to any problems that may have occurred. The new account is created in a new resource group in the same region as your classic account. All of your data has been migrated to the new account.

    At this point your classic storage account still exists and contains all of your data. If there are any problems reported, you can correct them or abort the process.

1. **Check manually**. It's a good idea to make a manual check of the new storage account to make sure that the output is as you expect.
1. **Commit or abort**. If you are satisfied that the migration has been successful, then you can commit the migration. Committing the migration permanently deletes the classic storage account.

    If there are any problems with the migration, then you can abort the migration at this point. If you choose to abort, the new resource group and new storage account are deleted. Your classic account remains available. You can address any problems and attempt the migration again.

### After the migration

After the migration is complete, your new storage account is a general-purpose v1 storage account. We recommend upgrading to a general-purpose v2 account to take advantage of the newest features that Azure Storage has to offer for security, data protection, lifecycle management, and more. To learn how to upgrade to a general-purpose v2 storage account, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md).

## See also

