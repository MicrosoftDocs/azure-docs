---
title: Create a user defined restore point for a dedicated SQL pool
description: Learn how to use the Azure portal to create a user-defined restore point for dedicated SQL pool in Azure Synapse Analytics.
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
# User-defined restore points

In this article, you'll learn to create a new user-defined restore point for a dedicated SQL pool in Azure Synapse Analytics by using the Azure portal.

## Create user-defined restore points through the Azure portal

User-defined restore points can also be created through Azure portal.

1. Sign in to your [Azure portal](https://portal.azure.com/) account.

2. Navigate to the dedicated SQL pool that you want to create a restore point for.

3. Select **Overview** from the left pane, select **+ New restore point**. If the New Restore Point button isn't enabled, make sure that the dedicated SQL pool isn't paused.

    ![New Restore Point](../media/sql-pools/create-sqlpool-restore-point-01.png)

4. Specify a name for your user-defined restore point and click **Apply**. User-defined restore points have a default retention period of seven days.

    ![Name of Restore Point](../media/sql-pools/create-sqlpool-restore-point-02.png)

## Next steps

- [Restore an existing dedicated SQL pool](restore-sql-pool.md)

