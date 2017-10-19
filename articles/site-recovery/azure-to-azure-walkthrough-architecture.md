---
title: Review the architecture for replication of Azure VMs between Azure regions  | Microsoft Docs
description: This article provides an overview of components and architecture used when replicating Azure VMs between Azure regions using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 07/12/2017
ms.author: raynew

---

# Step 1: Review the architecture for Azure VM replication between Azure regions


After reviewing the [overview steps](azure-to-azure-walkthrough-overview.md) for this deployment, read this article to understand the components and processes used when replicating and recovering Azure virtual machines (VMs) from one Azure region to another, using [Azure Site Recovery](site-recovery-overview.md).

- When you finish the article, you should have a clear understanding of how Azure VM replication to another region works.
- Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

>[!NOTE]
>Azure VM replication with the Site Recovery service is currently in preview.



## Architectural components

The following diagram provides a high-level view of an Azure VM environment in a specific region (in this example, the East US location). In an Azure VM environment:
- Apps can be running on VMs with disks spread across storage accounts.
- The VMs can be included in one or more subnets within a virtual network.

![customer-environment](./media/azure-to-azure-walkthrough-architecture/source-environment.png)

## Replication process

### Step 1

When you enable Azure VM replication in the Azure portal, the resources shown in the following diagram and table are automatically created in the target region. By default, resources are created based on source region settings. You can customize the target settings as required. [Learn more](site-recovery-replicate-azure-to-azure.md).

![Enable replication process, step 1](./media/azure-to-azure-walkthrough-architecture/enable-replication-step-1.png)

**Resource** | **Details**
--- | ---
**Target resource group** | The resource group to which replicated VMs belong after failover.
**Target virtual network** | The virtual network in which replicated VMs are located after failover. A network mapping is created between source and target virtual networks, and vice versa.
**Cache storage accounts** | Before changes on source VMs are replicated to the target storage account, they are tracked and sent to the cache storage account in the target location. This ensures minimal impact on production apps running on the VM.
**Target storage accounts**  | Storage accounts in the target location to which the data is replicated.
**Target availability sets**  | Availability sets in which the replicated VMs are located after failover.

### Step 2

As replication is enabled, the Site Recovery extension Mobility service is automatically installed on the VM. The following occurs:

1. The VM is registered with Site Recovery.

2. Continuous replication is configured for the VM. Data writes on the VM disks are continuously transferred to the cache storage account in the source location.

   ![Enable replication process, step 2](./media/azure-to-azure-walkthrough-architecture/enable-replication-step-2.png)

  
  Note that Site Recovery never needs inbound connectivity to the VM. Only outbound connectivity to Site Recovery service URLs/IP addresses, Office 365 authentication URLs/IP addresses, and cache storage account IP addresses is needed. 

## Continuous replication process

After continuous replication is working, disk writes are immediately transferred to the cache storage account. Site Recovery processes the data and sends it to the target storage account. After the data is processed, recovery points are generated in the target storage account every few minutes.

## Failover process

When you initiate a failover, the VMs are created in the target resource group, target virtual network, target subnet, and the target availability set. During a failover, you can use any recovery point.

![Failover process](./media/azure-to-azure-walkthrough-architecture/failover.png)

## Next steps

Go to [Step 2: Verify prerequisites and limitations](azure-to-azure-walkthrough-prerequisites.md)
