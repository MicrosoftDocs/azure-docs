---
title: Disable geo-backups
description: How-to guide for disabling geo-backups for a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics
author: joannapea
ms.author: joanpo
ms.reviewer: wiassaf
ms.date: 01/09/2024
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
---

# Disable geo-backups for a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics

In this article, you learn to disable geo-backups for your [dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-overview-what-is.md) in the Azure portal.

## Disable geo-backups through Azure portal

Follow these steps to disable geo-backups for your dedicated SQL pool (formerly SQL DW):

> [!NOTE]
> If you disable geo-backups, you will no longer be able to recover your dedicated SQL pool (formerly SQL DW) to another Azure region. 

1. Sign in to your [Azure portal](https://portal.azure.com/) account.
1. Select the dedicated SQL pool (formerly SQL DW) resource that you would like to disable geo-backups for. 
1. Under **Settings** in the left-hand navigation panel, select **Geo-backup policy**.

   :::image type="content" source="media/sql-data-warehouse-restore-from-geo-backup/disable-geo-backup-1.png" alt-text="Disable geo-backup.":::

1. To disable geo-backups, select **Disabled**. 

   :::image type="content" source="media/sql-data-warehouse-restore-from-geo-backup/disable-geo-backup-2.png" alt-text="Disabled geo-backup.":::

1. Select **Save** to ensure that your settings are saved. 

   :::image type="content" source="media/sql-data-warehouse-restore-from-geo-backup/disable-geo-backup-3.png" alt-text="Save geo-backup settings.":::

## Related content

- [Restore an existing dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-restore-active-paused-dw.md)
- [Restore a deleted dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](sql-data-warehouse-restore-deleted-dw.md)
