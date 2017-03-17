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
ms.author: kumud
---

# Advisor High Availability recommendations

Advisor helps you ensure and improve the continuity of your business-critical applications. You can get high availability recommendations by Advisor from the **High Availability** tab of the Advisor dashboard.

![](./media/advisor-high-availability-recommendations/advisor-high-availability-tab.png)


## Virtual machines without an availability set

Advisor identifies virtual machines that are not part of an availability set and recommends moving them into an availability set. To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine is available and meets the Azure virtual machine SLA. You can choose to either create an availability set for the virtual machine or add the virtual machine to an existing availability set.

> [!NOTE]
> If you choose to create an availability set, you must add at least one more virtual machine into that availability set after creating it. We recommend grouping two or more virtual machines in an availability set to ensure that at least one machine is available during an outage.

![](./media/advisor-high-availability-recommendations/advisor-high-availability-create-availability-set.png)

## Availability sets with a single virtual machine 

Advisor identifies availability sets that contain a single virtual machine and recommends adding one or more virtual machines to it. To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine is available and meets the Azure virtual machine SLA. You can choose to either create a virtual machine or use an existing virtual machine, and add it to the availability set.  

![](./media/advisor-high-availability-recommendations/advisor-high-availability-add-vm-to-availability-set.png)

## Virtual machines with Standard Disks

Advisor identifies virtual machines that have Standard Disks and recommends upgrading to Premium Disks.  

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines that run I/O-intensive workloads. Virtual-machine disks that use Premium Storage store data on solid-state drives (SSDs). For the best performance for your application, we recommend that you migrate any virtual-machine disk that requires high input/output operations per second (IOPS) to Premium Storage. If your disk does not require high IOPS, you can limit costs by maintaining it in Standard Storage. Standard Storage stores virtual-machine disk data on hard disk drives (HDDs) instead of SSDs. You can choose to migrate your virtual-machine disks to Premium Disks. Premium Disks are supported on most virtual machine SKUs. In some cases, however, if you want to use Premium Disks, you might need to upgrade your virtual-machine SKU as well.   

![](./media/advisor-high-availability-recommendations/advisor-high-availability-upgrade-to-premium-disks.png) 

## Your application gateway is not configured for fault tolerance
To ensure the business continuity of your mission critical applications powered by application gateways, Advisor identifies application gateway instances that are not configured for fault tolerance, and suggests actions you can take to fix this. Advisor identifies medium or large single instance application gateways, and recommends adding at least one more instance. It also identifies single or multi-instance small application gateways and recommends migrating to a medium or large SKU size. We recommend these actions to ensure your application gateway instances are configured to satisfy the current SLA requirements for these resources.


## Improve the reliability of your availability set disks
Advisor identifies availability sets where virtual machines disks are placed in a single storage account, and recommends migrating to Managed Disks. Virtual machine disks placed in the same storage account are located on same storage scale unit, and are impacted by single storage scale unit failure. Managed Disks ensure disks of virtual machines in an availability set are sufficiently isolated from each other, by automatically placing disks in different storage scale units. This ensures data redundancy by avoiding a single point of failure during an outage.


## Your virtual machine disks susceptible to I/O throttling
Advisor identifies virtual machines susceptible to disk performance degradation due to I/O throttling, and recommends migrating to Managed Disks. Placing multiple virtual machine disks running I/O intensive workloads in the same storage account will cause the storage account to reach its scalability limits, which can lead to throttling. Throttling can degrade the overall performance of virtual machines, and also cause other potential issues.  Managed Disks handle storage account placement for disks behind the scenes, so you are no longer limited by storage account scalability limits.


## Your virtual machine is not configured for backup
Advisor identifies virtual machines where backup is not enabled, and recommends enabling backup. Setting up virtual machine backup ensures availability of your business critical data and offers protection against accidental deletion or corruption.


## How to access High Availability recommendations in Advisor

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the left-navigation pane, click **More services**, in the service menu pane, scroll down to **Monitoring and Management**, and then click **Azure Advisor**. This launches the Advisor dashboard. 
3. On the Advisor dashboard, click the **High Availability** tab, and select the subscription for which you’d like to receive recommendations.

> [!NOTE]
> To access Advisor recommendations, you must first **register** your subscription with Advisor. A subscription is registered when a **subscription Owner** launches the Advisor dashboard and clicks on the **Get recommendations** button. This is a **one-time operation**. Once a subscription is registered, Advisor recommendations can be accessed by **Owner**s, **Contributor**s, or **Reader**s for a subscription, resource group or a specific resource.

## Next steps

See these resources to learn more about Advisor recommendations:
-  [Introduction to Azure Advisor](advisor-overview.md)
-  [Get started with Advisor](advisor-get-started.md)
-  [Advisor Security recommendations](advisor-security-recommendations.md)
-  [Advisor Performance recommendations](advisor-performance-recommendations.md)
-  [Advisor Cost recommendations](advisor-performance-recommendations.md)
