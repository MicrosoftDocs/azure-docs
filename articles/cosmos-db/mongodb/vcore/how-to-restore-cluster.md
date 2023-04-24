---
title: Restore a cluster backup
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Restore an Azure Cosmos DB for MongoDB vCore cluster from a point in time encrypted backup snapshot.
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
author: gahl-levy
ms.author: gahllevy
ms.reviewer: nayakshweta
ms.date: 03/07/2023
---

# Restore a cluster in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure Cosmos DB for MongoDB vCore provides automatic backups that enable point-in-time recovery (PITR) without any action required from users. Backups allow customers to restore a server to any point in time within the retention period.

> [!IMPORTANT]
> During the preview phase, backups are free of charge.

> [!NOTE]
> The backup and restore feature is designed to protect against data loss, but it doesn't provide a complete disaster recovery solution. You should ensure that alaredy have your own disaster recovery plan in place to protect against larger scale outages.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).

## Backups

Backups are **performed automatically** in the background. Backups are retained for 35 days for active clusters and 7 days for deleted clusters. All backups are encrypted using AES 256-bit encryption.

> [!NOTE]
> Backup files can't be exported. They may only be used for restore operations in Azure Cosmos DB for MongoDB vCore.

In Azure regions that support availability zones, backup snapshots are stored in three availability zones. As long as at least one availability zone is online, the cluster is restorable.

## Restore from a backup

The restore process creates a new cluster with the same configuration in the same Azure region, subscription, and resource group as the original. To restore data, customers must create an Azure support request.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the **Help + support** section and select **Create a support request**. For more information, see [create an Azure support request](../../../azure-portal/supportability/how-to-create-azure-support-request.md#go-to-help--support-from-the-global-header).

1. Once the support ticket is submitted, our team guides you through the process of restoring your data from the backup.

## Next steps

In this guide, we've covered the backup and restore features for Azure Cosmos DB for MongoDB vCore.

> [!div class="nextstepaction"]
> [Review security concepts](security.md)
