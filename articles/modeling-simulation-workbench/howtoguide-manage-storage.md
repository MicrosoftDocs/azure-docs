---
title: How to manage chamber storage in an Azure Modeling and Simulation Workbench chamber
description: Learn how to manage chamber storage within a Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Chamber Admin, I want to manage chamber storage
---

# How to manage chamber storage in an Azure Modeling and Simulation Workbench chamber

This article explains how to manage chamber storage.
<!--- SCREENSHOT OF CHAMBER --->

This guide shows you how to use the Azure portal to manage chamber storage within a Modeling and Simulation Workbench chamber.

You need to be a Chamber Admin or your organization's Workbench Owner to complete this process.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Modeling and Simulation Design Workbench installed with at least one chamber
- A user who is provisioned as a Chamber Admin or a Workbench Owner (Subscription Owner/Contributor)

## Sign in to Azure portal

Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Browse to your chamber's storage resource

As a Chamber User or a Chamber Admin, perform the following steps.

1. Type *Modeling and Simulation Workbench* in the global search and select **Modeling and Simulation Workbench** under **Services**.

1. Choose your Modeling and Simulation Workbench from the resource list.

1. On the page, select the left side menu item **Chamber**, and choose the chamber where you want to download the data from, from the resource list shown.

1. Select the left side menu item for storage.

1. Select the storage instance you would like to manage.

1. In the storage overview section, note the options to: resize, change tier, and delete.

<!--    [!div class="mx-imgBorder"]
   ![Screenshot of the Azure portal chamber storage overview screen](./media/howtoguide-manage-storage/storageoverview.png)
-->
### Resize your chamber storage

As a Chamber Admin, you can resize your storage to increase or decrease the storage size.

- You can't set the new size to less than what is currently being utilized for that storage instance.
- You can't set the new size to more than available capacity for the region your workbench is installed in. Contact your account manager to understand regional capacity resource limits.
- Default storage quota limit is 25 TB across all workbenches installed in your subscription per region.

  > [!IMPORTANT]
  > Azure Net App Files Capacity availability per region is limited.
  > Azure Net App Files Quota availability per region and customer subscription is limited.
  > Work with your account manager to request an increase in storage quota.

### Change the performance tier for your chamber storage

As a Chamber Admin, you can change the performance tier for your storage.

- You can set storage performance tier to a 'higher' performance tier at any time, for example, from standard to premium, or premium to ultra is allowed.
- You can set the storage performance tier to a 'lower' tier, for example, from ultra to premium or premium to standard, after the cool-down period. The Azure Net App Files cool-down period is one week from time storage was created, or from the time the storage tier was last increased.
