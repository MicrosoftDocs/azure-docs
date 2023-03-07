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
ms.date: 02/07/2023
---

# Restore a cluster in Azure Cosmos DB for MongoDB (vCore)

Azure Cosmos DB for MongoDB vCore provides automatic backups that enable point-in-time recovery (PITR) without any action required from users. Backups are kept for 35 days, and are performed automatically in the background.

## Backup

During the preview phase, backups are free of charge.

Backups allow customers to restore a server to any point in time within the retention period, which is 35 days for all clusters. All backups are encrypted using AES 256-bit encryption.

In Azure regions that support availability zones, backup snapshots are stored in three availability zones. As long as at least one availability zone is online, the cluster is restorable.

Backup files can't be exported. They may only be used for restore operations in Azure Cosmos DB for MongoDB vCore.

## Restore

The restore process creates a new cluster in the same Azure region, subscription, and resource group as the original. The new cluster has the same configuration as the original.

To restore data, customers must file a support ticket. Once the support ticket is submitted, our team guides you through the process of restoring your data from the backup. It's important to note that the backup and restore feature is designed to protect against data loss, but it doesn't provide a complete disaster recovery solution. Customers should ensure that they have their own disaster recovery plan in place to protect against larger scale outages.

## Next steps

In this guide, we've covered the backup and restore features for Azure Cosmos DB for MongoDB vCore. The automatic backup feature allows point-in-time recovery without any user action required, and backups are kept for up to 35 days. During the preview phase, backup costs are free of charge.

> [!div class="nextstepaction"]
> [Review security concepts](security.md)
