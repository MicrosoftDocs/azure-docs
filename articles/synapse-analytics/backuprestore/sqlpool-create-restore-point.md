---
title: Create a user defined restore point for a dedicated SQL pool
description: Learn how to use the Azure portal to create a user-defined restore point for dedicated SQL pool in Azure Synapse Analytics.
author: joannapea
ms.author: joanpo
ms.reviewer: wiassaf
ms.date: 01/23/2024
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: how-to
---
# User-defined restore points

In this article, you'll learn to create a new user-defined restore point for a dedicated SQL pool in Azure Synapse Analytics by using the Azure portal.

## Create user-defined restore points through the Azure portal

User-defined restore points can also be created through Azure portal.

1. Sign in to your [Azure portal](https://portal.azure.com/) account.

1. Navigate to the dedicated SQL pool that you want to create a restore point for.

1. Select **Overview** from the left pane, select **+ New restore point**. If the New Restore Point button isn't enabled, make sure that the dedicated SQL pool isn't paused.

    :::image type="content" source="../media/sql-pools/create-sqlpool-new-restore-point.png" alt-text="Screenshot from the Azure portal, on the Overview page of a SQL pool. The New Restore Point button is highlighted.":::

1. Specify a name for your user-defined restore point and select **Apply**. User-defined restore points have a default retention period of seven days.

    :::image type="content" source="../media/sql-pools/create-sqlpool-user-defined-restore-point.png" alt-text="Screenshot from the Azure portal, providing the name of new user-defined restore point.":::

## Next step

> [!div class="nextstepaction"]
> [Restore an existing dedicated SQL pool](restore-sql-pool.md)
