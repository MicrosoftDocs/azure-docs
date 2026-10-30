---
title: Tutorial - Protect Azure Cosmos DB with vaulted backup by using the Azure portal
description: Learn how to protect Azure Cosmos DB with vaulted backup using Azure Backup in the Azure portal.
ms.topic: tutorial
ms.date: 10/29/2026
ms.custom: build-2026, ignite-2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to configure backup for Azure Cosmos DB, so that I can protect database accounts."
---

# Tutorial: Protect Azure Cosmos DB with vaulted backup by using the Azure portal

Azure Backup provides vaulted backup for Azure Cosmos DB through an Azure Backup vault. You can configure backup schedules, retain recovery points, and restore backup to a new database account when needed. 

This tutorial describes how to protect Azure Cosmos DB with vaulted backup by using Azure Backup via Azure portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Verify prerequisites for Azure Cosmos DB backup.
> - Configure vaulted backup.
> - Run an on-demand backup.
> - Track backup jobs.

## Prerequisites

Before you configure vaulted backup for Azure Cosmos DB by using Azure portal, ensure that you meet the following prerequisites:

- Check the [supported scenarios and known limitations](backup-azure-cosmos-db-support-matrix.md) of Azure Cosmos DB backup.
- Identify or [create a Backup Vault](create-manage-backup-vault.md) in the same region where you want to back up the Azure Cosmos DB account.
- Identify or [create a new backup policy for Azure Cosmos DB](backup-azure-cosmos-db-quickstart.md?pivots=client-portaltier).
- Review the access permission if present to assign _Cosmos DB Long Term Retention Backup Role_ over the source Cosmos DB account to the Backup Vault.

[!INCLUDE [Configure vaulted backup for Azure Cosmos DB](../../includes/backup-cosmos-db-configure-backup.md)]

## Run an on-demand backup for Azure Cosmos DB by using the Azure portal

To run an on-demand backup for an Azure Cosmos DB, follow these steps:

1. Go to **Resiliency**, and select **Backup and recovery** > **Protected items**.
1. On the **Protected items** pane, filter **Datasource type** by **Azure Cosmos DB**, and select the Cosmos DB instance you want to back up.
1. On the **Protected item** pane, under **Associated items**, select a protected item from the list.

   :::image type="content" source="./media/backup-azure-cosmos-db-tutorial/select-protected-item-to-back-up.png" alt-text="Screenshot that shows the selection of a backup instance to trigger backup." lightbox="./media/backup-azure-cosmos-db-tutorial/select-protected-item-to-back-up.png":::

1. On the **Backup instance** pane, select **Backup Now**.

   :::image type="content" source="./media/backup-azure-cosmos-db-tutorial/trigger-backup.png" alt-text="Screenshot that shows how to start backup." lightbox="./media/backup-azure-cosmos-db-tutorial/trigger-backup.png":::

## Track backup jobs for Azure Cosmos DB

To view Azure Cosmos DB vaulted backup jobs, follow these steps:

1. Go to **Resiliency**, and select **Monitoring + Reporting** > **Jobs**.
1. On the **Jobs** pane, filter **Datasource type** by **Azure Cosmos DB**.

## Next steps

[Restore Azure Cosmos DB account by using Azure portal](backup-azure-cosmos-db-restore.md)

[Manage backup of Azure Cosmos DB account by using Azure portal](backup-azure-cosmos-db-manage.md)