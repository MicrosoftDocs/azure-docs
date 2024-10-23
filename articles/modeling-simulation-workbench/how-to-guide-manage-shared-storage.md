---
title: "Manage shared storage: Azure Modeling and Simulation Workbench"
description: Learn how to manage shared storage in Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/22/2024
# Customer intent: As a Chamber Admin in Azure Modeling and Simulation Workbench, I want to manage shared storage.
---

# Manage shared storage in Azure Modeling and Simulation Workbench

Shared storage is accessible between one or more chambers and is the only means that data can be exchanged between chambers. Chamber Admins and Workbench Owners can manage the Shared storage in Azure Modeling and Simulation Workbench. For example, they can increase or decrease the amount of chamber storage. They can also change the performance tier.

This article explains how Chamber Admins and Workbench Owners manage chamber storage.

## Prerequisites

[!INCLUDE [prerequisite-account-sub](includes/prerequisite-account-sub.md)]

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

[!INCLUDE [prerequisite-user-chamber-admin](includes/prerequisite-user-chamber-admin.md)]

## Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Create shared storage

If you're a Workbench Owner or Chamber Admin, complete the following steps to access the shared storage options:

1. Enter **Modeling and Simulation Workbench** in the global search. Under **Services**, select **Modeling and Simulation Workbench**.
1. Select your workbench from the resource list.
1. On the left menu, select **Settings** > **Shared storage**.
1. Select **Create** from the action bar. The Create shared storage configuration appears.
1. Fill in a name, set the capacity in 4-TB increments, and select the chambers that the shared storage should be accessible to.

    :::image type="content" source="media/howtoguide-shared-storage/shared-storage-create.png" alt-text="Screenshot of shared storage create dialog.":::

1. Select **Review + Create**. If the validation checks pass, select **Create**.

## Manage shared storage

If you're a Workbench Owner or Chamber Admin, complete the following steps to access the chamber storage options:

1. Enter **Modeling and Simulation Workbench** in the global search. Then, under **Services**, select **Modeling and Simulation Workbench**.
1. Select your workbench from the resource list.
1. On the left menu, select **Settings** > **Shared storage**. In the resource list, select the storage to be managed.

### Resize chamber storage

If you're a Workbench Owner or Chamber Admin, you can increase or decrease a chamber's storage capacity by changing the storage size.

You can't change the storage size to less than what you're currently using for that storage instance. In addition, you can't change the storage size to more than the available capacity for the region where your workbench is installed. The default storage quota limit is 25 TB across all workbenches installed in your subscription per region. For more information about resource capacity limits, contact your Microsoft account manager.

Complete the following steps to increase or decrease the storage size:

1. In the storage overview, select **Resize**.
1. In the **Resize** pop-up dialog, enter the desired storage size.
1. Select the **Change** button to confirm the resize request.
1. Select **Refresh** to show the new size in the storage overview.

> [!IMPORTANT]
> Azure NetApp Files capacity availability is limited per region. Azure NetApp Files quota availability is limited per region and customer subscription. To request an increase in storage quota, contact your Microsoft account manager.

### Change the performance tier

If you're a Workbench Owner or a Chamber Admin, you can change the performance tier for storage.

You can change the storage performance tier to a higher tier, such as from standard to ultra, at any time. You can change the storage performance tier to a lower tier, such as from ultra to standard, after the cool-down period. The Azure Net App Files cool-down period is one week from when you created the storage or one week from the last time that you increased the storage tier.

Complete the following steps to change the performance tier:

1. In the chamber storage overview, select **Change tier**.
1. In the **Change tier** pop-up dialog, select the desired storage tier from the combo box.
1. Select the **Update** button to confirm the request to change the tier.
1. Select **Refresh** to show the new tier in the storage overview.
