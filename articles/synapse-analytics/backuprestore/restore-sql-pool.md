---
title: Restore an existing Synapse SQL pool.
description: How-to guide for restoring an existing SQL pool.
services: synapse-analytics
author: joannapea
manager: igorstan
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql
ms.date: 10/29/2020
ms.author: joanpo
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Restore an existing SQL pool

In this article, you learn how to restore an existing SQL pool in Azure Synapse Analytics using Azure portal and Azure Synapse Studio. This article applies to both restores and geo-restores. 

**Verify your DWU capacity.** Each pool has a default DTU quota. Verify the server has enough remaining DTU quota for the database being restored. To learn how to calculate DTU needed or to request more DTU, see [Request a DTU quota change](../sql-data-warehouse/sql-data-warehouse-get-started-create-support-ticket.md).

## Restore an existing SQL pool through the Synapse Studio

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to your Synapse Workspace. 
3. Under Getting Started -> Open Synapse Studio, select **Open**.

    ![ Synapse Studio](../media/sql-pools/open-synapse-studio.png)
4. On the left hand navigation pane, select **Data**.
5. Select **Manage pools**. 
6. Select **+ New** to create a new SQL pool. 
7. In the Additional Settings tab, select a Restore Point to restore from. 

    If you want to perform a geo-restore, select the Workspace and SQL pool that you want to recover. 

8. Select either **Automatic Restore Points** or **User-Defined Restore Points**. 

    ![Restore points](../media/sql-pools/restore-point.PNG)

If the SQL pool doesn't have any automatic restore points, wait a few hours or create a user defined restore point before restoring. For User-Defined Restore Points, select an existing one or create a new one.

If you are restoring a geo-backup, simply select the Workspace located in the source region and the SQL pool you want to restore. 

9. Select **Review + Create**.

## Restore an existing SQL pool through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to the SQL pool that you want to restore from.
3. At the top of the Overview blade, select **Restore**.

    ![ Restore Overview](../media/sql-pools/restore-sqlpool-01.png)

4. Select either **Automatic Restore Points** or **User-Defined Restore Points**. 

If the SQL pool doesn't have any automatic restore points, wait a few hours or create a user defined restore point before restoring. 

If you want to perform a geo-restore, select the Workspace and SQL pool that you want to recover. 

5. Select **Review + Create**.

## Next Steps

- [Create a restore point](sqlpool-create-restore-point.md)
