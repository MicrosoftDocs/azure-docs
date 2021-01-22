---
title: Single region data residency
description: How-to guide for enabling single region data residency for dedicated SQL pools (formerly SQL DW)
services: synapse-analytics
author: joannapea
manager: igorstan
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw 
ms.date: 01/06/2021
ms.author: joanpo
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Disable geo-backups for a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics

In this article, you learn to disable geo-backups for your dedicated SQL pool (formerly SQL DW) Azure portal.

## Disable geo-backups through Azure Portal

Follow these steps to disable geo-backups for your dedicated SQL pool (formerly SQL DW):

> [!NOTE]
> If you disable geo-backups, you will no longer be able to recover your dedicated SQL pool (formerly SQL DW) to another Azure region. 
>

1. Sign in to your [Azure portal](https://portal.azure.com/) account.
1. Select the dedicated SQL pool (formerly SQL DW) resource that you would like to disable geo-backups for. 
1. Under **Settings** in the left-hand navigation panel, select **Geo-backup policy**.

   ![Geo-backup](./media/sql-data-warehouse-restore-from-geo-backup/disable-geo-backup-1.png)

1. To disable geo-backups, select **Disabled**. 

   ![Geo-backup](./media/sql-data-warehouse-restore-from-geo-backup/disable-geo-backup-2.png)

1. Select *Save* to ensure that your settings are saved. 

   ![Geo-backup](./media/sql-data-warehouse-restore-from-geo-backup/disable-geo-backup-3.png)

## Next Steps

- [Restore an existing dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-restore-active-paused-dw.md)
- [Restore a deleted dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-restore-deleted-dw.md)
