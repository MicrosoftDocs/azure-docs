---
title: FAQs - Oracle on Azure VMs | Microsoft Docs
description: FAQs - Oracle on Azure VMs 
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: oracle
ms.topic: article
ms.date: 06/5/2023
---

# FAQs - Oracle on Azure VMs

**What are the recommended Azure VM types for Oracle on Azure?** 
- M Series [high memory requirements, CPU performance, Lower IO limits, host level caching is low, accelerated networking options] 
- E series - Availability in all regions, Allows for Premium SSD for OS Disk, ephemeral storage to be used for swap.
 
**What is the role of a Oracle Data Guard on Azure?**    
Data Guard is more focused on disaster recovery (DR) in an on-premises Oracle solution in Azure. It’s front and centre for High Availability and DR, leveraging Fast-Start Failover, the DG Broker & Observer. Fundamentally Data Guard provides HA based Architecture.

**Does having a Oracle Data Guard setup on Azure VM between Availability Set/Zones or regions subject to ingress/egress cost?**   
At present Azure treats Oracle like any other non-Microsoft service in IaaS, thus there is US$0.02/GB cost for the Data Guard redo transport for a remote standby database in another region, and no cost for the Data Guard redo transport to a local standby database in another availability zone in the same region. 

**What is the different design approach for Oracle migration to Azure?**   
Good & Fast: You can choose a solution involving Data Guard or Golden Gate, but it won’t be cost effective. 
Good & Cost effective: You can choose this approach with non-Oracle solutions like Azure VM Backup cross-region restore, or Azure NetApp Files cross-region replication (both of which have cross-region transport of data included in the product cost), but it won't be fast, and you need to provide some slack in their RPO/RTO requirements. 

**What is the simple bare minimal Oracle reference architecture on Azure?**   
Two (2) Azure availability Zone architecture with VM. 
