---
title: How to meet data residency requirements in Azure Cosmos DB
description: learn how to meet data residency requirements in Azure Cosmos DB for your data and backups to remain in a single region.
author: kanshiG
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 04/05/2021
ms.author: govindk
ms.reviewer: mjbrown
---

# How to meet data residency requirements in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

In Azure Cosmos DB, you can configure your data and backups to remain in a single region to meet the [residency requirements](https://azure.microsoft.com/global-infrastructure/data-residency/).

## Residency requirements for data

In Azure Cosmos DB, you must explicitly configure the cross-region data replication. Learn how to configure geo-replication using [Azure portal](how-to-manage-database-account.md#addremove-regions-from-your-database-account), [Azure CLI](scripts/cli/common/regions.md). To meet data residency requirements, you can create an Azure Policy definition that allows certain regions to prevent data replication to unwanted regions.

## Residency requirements for backups

**Continuous mode Backups**: These backups are resident by default as they are stored in either locally redundant or zone redundant storage. To learn more, see the [continuous backup](provision-account-continuous-backup.md) article.

**Periodic mode Backups**: By default, periodic mode account backups will be stored in geo-redundant storage. For periodic backup modes, you can configure data redundancy at the account level. There are three redundancy options for the backup storage. They are local redundancy, zone redundancy, or geo redundancy. For more information, see [periodic backup/restore](periodic-backup-restore-introduction.md).

## Residency requirements for analytical store

Analytical store is resident by default as it is stored in either locally redundant or zone redundant storage. To learn more, see the [analytical store](analytical-store-introduction.md) article.


## Use Azure Policy to enforce the residency requirements

If you have data residency requirements that require you to keep all your data in a single Azure region, you can enforce zone-redundant or locally redundant backups for your account by using an Azure Policy.  You can also enforce a policy that the Azure Cosmos DB accounts are not geo-replicated to other regions.

Azure Policy is a service that you can use to create, assign, and manage policies that apply rules to Azure resources. Azure Policy helps you to keep these resources compliant with your corporate standards and service level agreements. For more information, see how to use [Azure Policy](policy.md) to implement governance and controls for Azure Cosmos DB resources

## Next steps

* Configure and manage periodic backup using [Azure portal](periodic-backup-restore-introduction.md)
* Provision continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* Restore continuous backup account using [Azure portal](restore-account-continuous-backup.md#restore-account-portal), [PowerShell](restore-account-continuous-backup.md#restore-account-powershell), [CLI](restore-account-continuous-backup.md#restore-account-cli), or [Azure Resource Manager](restore-account-continuous-backup.md#restore-arm-template).
* [Migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
