---
title: Configure backup for Azure Cosmos DB using Azure portal
description: Learn about how to configure backup for Azure Cosmos DB using Azure portal. 
ms.topic: how-to
ms.date: 10/29/2026
ms.service: azure-backup
ms.custom:
  - build-2026
  - ignite-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to configure backup policies for Azure Cosmos DB using a portal, so that I can ensure data protection and manage retention effectively.
---

# Configure vaulted backup for Azure Cosmos DB account by using Azure portal

This article describes how to configure backup for Azure Cosmos DB using Azure portal.

## Prerequisites

Before you configure backup for Azure Cosmos DB, review the following prerequisites:

- Check the [supported scenarios and known limitations](backup-azure-cosmos-db-support-matrix.md) of Azure Cosmos DB backup.
- Identify or [create a Backup Vault](create-manage-backup-vault.md) in the same region where you want to back up the Azure Cosmos DB account.
- Identify or [create a new backup policy for Azure Cosmos DB](backup-azure-cosmos-db-quickstart.md?pivots=client-portaltier).
- Review the access permission if present to assign _Cosmos DB Long Term Retention Backup Role_ over the source Cosmos DB account to the Backup Vault.

[!INCLUDE [Configure vaulted backup for Azure Cosmos DB](../../includes/backup-cosmos-db-configure-backup.md)]

## Related content

[Restore Azure Cosmos DB account by using Azure portal](backup-azure-cosmos-db-restore.md)

[Manage backup of Azure Cosmos DB account by using Azure portal](backup-azure-cosmos-db-manage.md)
