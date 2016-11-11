---
title: Azure Advisor High Availability Recommendations | Microsoft Docs
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

# Azure Advisor High Availability Recommendations

Azure Advisor analyzes single instance virtual machines and availibility sets to help optimize your Azure deployments for high availability. You can get high availability recommendations by Advisor from the **High Availability** tab of the Advisor dashboard.

![](./media/advisor-high-availability-recommendations/advisor-high-availability-tab.png)

## Virtual machines without an availability set

Advisor identifies virtual machines that are not part of an availability set and recommends moving them into an availability set.  
 
**Recommended Actions** You can choose to either create a new availability set for the virtual machine or add the virtual machine to an existing availability set.

> [!NOTE]
> If you choose to create a new availability set, you must add at least one more virtual machine into that availability set after creating it. We recommend grouping two or more virtual machines in an availability set to ensure that one of the machines is available during an outage.

![](./media/advisor-high-availability-recommendations/advisor-high-availability-create-availability-set.png)

## Availability sets with a single virtual machine 

Advisor identifies availability sets containing a single virtual machine and recommends adding one or more virtual machines to it.  
To provide redundancy to your application, we recommend that you group two or more virtual machines in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one virtual machine will be available and meet the Azure VM SLA.  
 You can choose to either create a new virtual machine or use an existing virtual machine, and add it to the availability set.  


![](./media/advisor-high-availability-recommendations/advisor-high-availability-add-vm-to-availability-set.png)



## Virtual machines with Standard Disks

Advisor identifies virtual machines with Standard Disks and recommends upgrading to Premium Disks.  
Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads. Virtual machine (VM) disks that use Premium Storage store data on solid state drives (SSDs). We recommend migrating any virtual machine disk requiring high IOPS to Azure Premium Storage for the best performance for your application. If your disk does not require high IOPS, you can limit costs by maintaining it in Standard Storage, which stores virtual machine disk data on Hard Disk Drives (HDDs) instead of SSDs. 
You can choose to migrate your virtual machine disks to Premium Disks. Premium Disks are supported on most virtual machine SKUs, however in some cases, you may need to upgrade your virtual machine SKU as well if you wish to use Premium Disks.  

![](./media/advisor-high-availability-recommendations/advisor-high-availability-upgrade-to-premium-disks.png) 

## Next Steps

See these resources to learn more about Advisor recommendations:
-  [Introduction to Advisor](advisor-overview.md)
-  [Advisor FAQs](advisor-faqs.md)
-  [Get Started with Advisor](advisor-get-started.md)
-  [Advisor Security Recommendations](advisor-security-recommendations.md)
-  [Advisor Performance Recommendations](advisor-performance-recommendations.md)
-  [Advisor Cost Recommendations](advisor-performance-recommendations.md)
