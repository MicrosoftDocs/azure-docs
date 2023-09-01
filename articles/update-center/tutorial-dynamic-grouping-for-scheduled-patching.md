---
title: Schedule updates on Dynamic scoping (preview).
description: In this tutorial, you learn how to group machines, dynamically apply the updates at scale.
ms.service: update-management-center
ms.date: 07/05/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want dynamically apply patches on the machines as per a schedule.
---

# Tutorial: Schedule updates on Dynamic scopes (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.
 
This tutorial explains how you can create a dynamic scope, and apply patches based on the criteria. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create and edit groups
> - Associate a schedule


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Patch Orchestration must be set to Customer Managed Schedules (Preview). This sets patch mode to AutomaticByPlatform and the **BypassPlatformSafetyChecksOnUserSchedule** = *True*.
- Associate a Schedule with the VM.

## Create a Dynamic scope

To create a dynamic scope, follow the steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview).
1. Select **Overview** > **Schedule updates** > **Create a maintenance configuration**.
1. In the **Create a maintenance configuration** page, enter the details in the **Basics** tab and select **Maintenance scope** as *Guest* (Azure VM, Arc-enabled VMs/servers).
1. Select **Dynamic Scopes** and follow the steps to [Add Dynamic scope](manage-dynamic-scoping.md#add-a-dynamic-scope-preview). 
1. In **Machines** tab, select **Add machines** to add any individual machines to the maintenance configuration and select **Updates**.
1. In the **Updates** tab, select the patch classification that you want to include/exclude and select **Tags**.
1. Provide the tags in **Tags** tab.
1. Select  **Review** and then **Review + Create**.

>[!NOTE]
> A dynamic scope exists within the context of a schedule only. You can use one schedule to link to a machine, dynamic scope, or both. One dynamic scope cannot have more than one schedule.

## Provide the consent
Obtaining consent to apply updates is an important step in the workflow of scheduled patching and follow the steps on various ways to [provide the consent](manage-dynamic-scoping.md#provide-consent-to-apply-updates).



## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
