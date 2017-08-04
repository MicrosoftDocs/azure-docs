---
title: Review the prerequisites for Hyper-V replication to a secondary VMM site with Azure Site Recovery | Microsoft Docs
description: Describes the prerequisites for replicating Hyper-V VMs to a secondary VMM site with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 21ff0545-8be5-4495-9804-78ab6e24add6
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2017
ms.author: raynew

---
# Step 2: Review the prerequisites and limitations for Hyper-V VM replication to a secondary VMM site


After you've reviewed the [scenario architecture](vmm-to-vmm-walkthrough-architecture.md), read this article to make sure you understand the deployment prerequisites, when replicating on-premises Hyper-V virtual machines (VMs) managed in System Center Virtual Machine Manager (VMM) clouds, to a secondary site using [Azure Site Recovery](site-recovery-overview.md) in the Azure portal.

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Prerequisites and limitations

**Requirement** | **Details**
--- | ---
**Azure** | A [Microsoft Azure](http://azure.microsoft.com/) subscription.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).<br/><br/> [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.<br/><br/> Check the supported regions for Site Recovery, Under Geographic Availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
**VMM servers** | We recommend you have two VMM servers, one in the primary site, and one in the secondary.<br/><br/> Replicate between clouds on a single VMM server is supported.<br/><br/> VMM servers should be running at least System Center 2012 SP1 with the latest updates.<br/><br/> VMM servers need internet access.
**VMM clouds** | Each VMM server must have at one or more clouds, and all clouds must have the Hyper-V Capacity profile set. <br/><br/>Clouds must contain one or more VMM host groups.<br/><br/> If you only have one VMM server, it needs at least two clouds, to act as primary and secondary.
**Hyper-V** | Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role, and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/>  Hyper-V host servers should be located in host groups in the primary and secondary VMM clouds.<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 R2, install [update 2961977](https://support.microsoft.com/kb/2961977)<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012, cluster broker isn't created automatically if you have a static IP address-based cluster. Configure the cluster broker manually. [Read more](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx).<br/><br/> Hyper-V servers need internet access.




## Next steps

Go to [Step 3: Plan networking](vmm-to-vmm-walkthrough-network.md).
