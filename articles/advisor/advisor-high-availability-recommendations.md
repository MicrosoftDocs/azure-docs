---
title: Azure Advisor High Availability recommendations | Microsoft Docs
description: Use Azure Advisor to improve high availability of your Azure deployments.
services: advisor
documentationcenter: NA
author: kumudd
manager: carmonm
editor: ''

ms.assetid: 
ms.service: advisor
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/16/2016
ms.author: kumudd
---

# Advisor High Availability recommendations

Advisor helps you ensure and improve the continuity of your business-critical applications. You can get high availability recommendations by Advisor from the **High Availability** tab of the Advisor dashboard.

![](./media/advisor-high-availability-recommendations/advisor-high-availability-tab.png)


## Virtual machines without an availability set

Advisor identifies virtual machines that are not part of an availability set and recommends moving them into an availability set. To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine will be available and meet the Azure virtual machine SLA. You can choose to either create an availability set for the virtual machine, or, add the virtual machine to an existing availability set.

> [!NOTE]
> If you choose to create an availability set, you must add at least one more virtual machine into that availability set after creating it. We recommend grouping two or more virtual machines in an availability set to ensure that one of the machines is available during an outage.

![](./media/advisor-high-availability-recommendations/advisor-high-availability-create-availability-set.png)

## Availability sets with a single virtual machine 

Advisor identifies availability sets containing a single virtual machine and recommends adding one or more virtual machines to it. To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine is available and meet the Azure virtual machine SLA. You can choose to either create a virtual machine or use an existing virtual machine, and add it to the availability set.  


![](./media/advisor-high-availability-recommendations/advisor-high-availability-add-vm-to-availability-set.png)



## Virtual machines with Standard Disks

Advisor identifies virtual machines with Standard Disks and recommends upgrading to Premium Disks.  
Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads. Virtual machine disks that use Premium Storage store data on solid-state drives (SSDs). We recommend migrating any virtual machine disk requiring high IOPS to Azure Premium Storage for the best performance for your application. If your disk does not require high IOPS, you can limit costs by maintaining it in Standard Storage. Standard Storage stores virtual machine disk data on Hard Disk Drives (HDDs) instead of SSDs. You can choose to migrate your virtual machine disks to Premium Disks. Premium Disks are supported on most virtual machine SKUs. However in some cases, if you want to use Premium Disks, you may need to upgrade your virtual machine SKU as well.   

![](./media/advisor-high-availability-recommendations/advisor-high-availability-upgrade-to-premium-disks.png) 

## How to access High Availability recommendations in Azure Advisor

1. Sign in into the [Azure portal](https://portal.azure.com).
2. In the left-navigation pane, click **More services**, in the service menu pane, scroll down to **Monitoring and Management**, and then click **Azure Advisor**. This launches the Advisor dashboard. 
3. On the Advisor dashboard, click the **High Availability** tab, and select the subscription for which you’d like to receive recommendations.
   > [!NOTE]
   > Advisor generates recommendations for subscriptions where you have been assigned the role of **Owner, Contributor, or Reader**.

## Next steps

See these resources to learn more about Advisor recommendations:
-  [Introduction to Azure Advisor](advisor-overview.md)
-  [Get started with Advisor](advisor-get-started.md)
-  [Advisor Security recommendations](advisor-security-recommendations.md)
-  [Advisor Performance recommendations](advisor-performance-recommendations.md)
-  [Advisor Cost recommendations](advisor-performance-recommendations.md)
