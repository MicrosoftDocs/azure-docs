---
title: Restore an existing dedicated SQL pool
description: How-to guide for restoring an existing dedicated SQL pool.
author: joannapea
manager: igorstan
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 10/29/2020
ms.author: joanpo
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Restore an existing dedicated SQL pool

In this article, you learn how to restore an existing dedicated SQL pool in Azure Synapse Analytics using Azure portal and Synapse Studio. This article applies to both restores and geo-restores. 

## Restore an existing dedicated SQL pool through the Synapse Studio

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to your Synapse workspace. 
3. Under Getting Started -> Open Synapse Studio, select **Open**.

    ![ Synapse Studio](../media/sql-pools/open-synapse-studio.png)
4. On the left hand navigation pane, select **Data**.
5. Select **Manage pools**. 
6. Select **+ New** to create a new dedicated SQL pool. 
7. In the Additional Settings tab, select a Restore Point to restore from. 

    If you want to perform a geo-restore, select the workspace and dedicated SQL pool that you want to recover. 

8. Select either **Automatic Restore Points** or **User-Defined Restore Points**. 

    ![Restore points](../media/sql-pools/restore-point.PNG)

    If the dedicated SQL pool doesn't have any automatic restore points, wait a few hours or create a user defined restore point before restoring. For User-Defined Restore Points, select an existing one or create a new one.

    If you are restoring a geo-backup, simply select the workspace located in the source region and the dedicated SQL pool you want to restore. 

9. Select **Review + Create**.

## Restore an existing dedicated SQL pool through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to the dedicated SQL pool that you want to restore from.
3. At the top of the Overview blade, select **Restore**.

    ![ Restore Overview](../media/sql-pools/restore-sqlpool-01.png)

4. Select either **Automatic Restore Points** or **User-Defined Restore Points**. 

    If the dedicated SQL pool doesn't have any automatic restore points, wait a few hours or create a user-defined restore point before restoring. 

    If you want to perform a geo-restore, select the workspace and dedicated SQL pool that you want to recover. 

5. Select **Review + Create**.

## Next Steps

- [Create a restore point](sqlpool-create-restore-point.md)
