---
title: Manage chamber storage in Azure Modeling and Simulation Workbench
description: Learn how to manage chamber storage within a Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Chamber Admin, I want to manage chamber storage
---

# Manage chamber storage in Azure Modeling and Simulation Workbench

Chamber Admins and Workbench Owners can manage the storage capacity within Azure Modeling and Simulation Workbench to fit your organization's specific needs. For example, they can increase or decrease the amount of chamber storage, as well as change the performance tier.  

This article explains how Chamber Admins and Workbench Owners manage chamber storage

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Modeling and Simulation Design Workbench installed with at least one chamber.
- You must be a Chamber Admin or Workbench Owner to manage chamber storage.

## Sign in to Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Access storage options in chamber

If you're a Workbench Owner or Chamber Admin, complete the following steps to access the chamber storage options:

1. Enter *Modeling and Simulation Workbench* in the global search and select **Modeling and Simulation Workbench** under **Services**.

1. Select your Modeling and Simulation Workbench from the resource list.

1. Select **Settings > Chamber** in the left side menu. A resource list displays. Select the chamber where you want to manage the storage for.

1. Select **Settings > Storage** in the left side menu. A resource list displays. Select the displayed storage.

<!---    [!div class="mx-imgBorder"]
   ![Screenshot of the Azure portal chamber storage overview screen](./media/howtoguide-manage-storage/storage-overview.png)
--->
### Resize chamber storage

Workbench Owners and Chamber Admins can increase or decrease your chamber's storage capacity by resizing the storage size.  

The storage size can't be changed to less than what's currently being used for that storage instance.  In addition, the storage size can't be changed to more than the available capacity for the region your workbench is installed in.  The default storage quota limit is 25 TB across all workbenches installed in your subscription per region. Contact your Microsoft account manager for additional information about regional capacity resource limits.

**Complete the following steps to increase or decrease the storage size:**

1. Select **Resize** option chamber storage overview.
1. Enter desired storage size in the Resize popup.
1. Select **Change** button to confirm resize request.
1. Select **Refresh** to show the new size in the storage overview display.

  > [!IMPORTANT]
  > Azure Net App Files Capacity availability is limited per region.
  > In addition, Azure Net App Files Quota availability is limited per region and customer customer subscription.
  > Contact your Microsoft account manager to request an increase in storage quota.

### Change performance tier

Workbench Owners and Chamber Admins can change the performance tier for your storage.

The storage performance tier can be changed to a higher tier, such as from standard to ultra, at any time.  The storage performance tier can be changed to a lower tier, such as from ultra to standard, after the cool-down period.  The Azure Net App Files cool-down period is one week from when the storage was created or one week from the last time the storage tier was increased.

**Complete the following steps to change the performance tier:**

1. Select **Change tier** option chamber storage overview.
1. Select from combo box the desired storage tier in the Change tier popup.
1. Select **Update** button to confirm change tier request.
1. Select **Refresh** to show the new tier in the storage overview display.
