---
title: How does Azure virtual machine replication between Azure regions work in Azure Site Recovery?  | Microsoft Docs
description: This article provides an overview of components and architecture used when replicating Azure VMs between Azure regions by using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/29/2017
ms.author: sujayt

---

# How does Azure VM replication work in Site Recovery?


This article describes the components and processes involved in replicating and recovering Azure virtual machines (VMs) from one region to another by using the [Azure Site Recovery](site-recovery-overview.md) service.

>[!NOTE]
>Azure VM replication with the Site Recovery service is currently in preview.

Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Architectural components

The following diagram provides a high-level view of an Azure VM environment in a specific region (in this example, the East US location). In an Azure VM environment:
- Apps can be running on VMs with disks spread across storage accounts.
- The VMs can be included in one or more subnets within a virtual network.

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment.png)

Learn about the deployment prerequisites and requirements in the [support matrix](site-recovery-support-matrix-azure-to-azure.md).

## Replication process

### Step 1

When you enable Azure VM replication in the Azure portal, the resources shown in the following diagram and table are automatically created in the target region. By default, resources are created based on source region settings. You can customize the target settings as required. [Learn more](site-recovery-replicate-azure-to-azure.md).

![Enable replication process, step 1](./media/site-recovery-azure-to-azure-architecture/enable-replication-step-1.png)

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

   ![Enable replication process, step 2](./media/site-recovery-azure-to-azure-architecture/enable-replication-step-2.png)

   >[!IMPORTANT]
   > Site Recovery never needs inbound connectivity to the VM. The VM needs only outbound connectivity to Site Recovery service URLs/IP addresses, Office 365 authentication URLs/IP addresses, and cache storage account IP addresses. For more information, see the [Networking guidance for replicating Azure virtual machines](site-recovery-azure-to-azure-networking-guidance.md) article.

## Continuous replication process

After continuous replication is working, disk writes are immediately transferred to the cache storage account. Site Recovery processes the data and sends it to the target storage account. After the data is processed, recovery points are generated in the target storage account every few minutes.

## Failover process

When you initiate a failover, the VMs are created in the target resource group, target virtual network, target subnet, and the target availability set. During a failover, you can use any recovery point.

![Failover process](./media/site-recovery-azure-to-azure-architecture/failover.png)

## Next steps

- Learn about [networking](site-recovery-azure-to-azure-networking-guidance.md) for Azure VM replication.
- Follow a walkthrough to [replicate Azure VMs.](site-recovery-azure-to-azure.md)
