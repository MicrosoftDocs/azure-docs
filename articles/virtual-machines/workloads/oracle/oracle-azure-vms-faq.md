---
title: FAQs - Oracle on Azure VMs | Microsoft Docs
description: FAQs - Oracle on Azure VMs 
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: oracle
ms.topic: article
ms.date: 06/12/2023
---

# FAQs - Oracle on Azure VMs

**What are the recommended Azure VM types for Oracle on Azure?** 
- **M Series**: high memory requirements, CPU performance, Lower IO limits, host level caching is low, accelerated networking options. 
- **E series** - Availability in all regions, allows for Premium SSD for OS Disk, ephemeral storage to be used for swap.
 
**What is the role of an Oracle Data Guard on Azure?**    
Data Guard is more focused on disaster recovery (DR) in an on-premises Oracle solution in Azure. It’s central to high availability and disaster recovery. It applies mainly to Fast-Start Failover and the DG Broker & Observer. Data Guard provides a high-availability-based Architecture.

**Does having a Oracle Data Guard setup on Azure VM between Availability Set/Zones or regions subject to ingress/egress cost?**   
Yes. There's US$0.02/GB charge for the Data Guard redo transport for a remote standby database in another region. There's no cost for the Data Guard redo transport to a local standby database in another availability zone in the same region. 

**What are the different design options for Oracle migration to Azure?**   
- **Good & Fast**: You can choose a solution involving Data Guard or Golden Gate, but that's not cost effective. 
- **Good & Cost effective**: You can choose this option with non-Oracle solutions like Azure VM backup cross-region restore, or the Azure NetApp Files cross-region replication but it won't be fast, and you need to give some slacks in their RPO/RTO requirements. Both the Azure NetApp Files cross-region replication has cross-region transport of data included in the product cost. 

**What is the simple bare minimal Oracle reference architecture on Azure?**   
Two (2) Azure availability Zone architecture with VM. 
