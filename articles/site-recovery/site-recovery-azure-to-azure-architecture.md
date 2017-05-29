---
title: Azure Site Recovery architecture for replicating Azure virtual machines | Microsoft Docs
description: Azure Site Recovery architecture for replicating Azure virtual machines
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
ms.date: 05/13/2017
ms.author: sujayt

---

# Azure Site Recovery architecture for replicating Azure virtual machines

> [!div class="op_single_selector"]
> * [Replicate Azure virtual machines](site-recovery-azure-to-azure-architecture.md)
> * [Replicate on-premises machines](site-recovery-components.md)

>[!NOTE]
>
> Site Recovery replication for Azure virtual machines is currently in preview.

This article details Azure Site Recovery architecture and various components involved when replicating and recovering Azure virtual machines from one region to another region. For more about Azure Site Recovery requirements, see the [prerequisites](site-recovery-prereq.md).

## Prerequisites

Refer to [support matrix for replicating Azure virtual machines.](site-recovery-support-matrix-azure-to-azure.md)

## Customer scenario

The below picture illustrates the high-level view of your virtual machine environment in Azure (for example: East US location). You can have applications running on virtual machines with disks spread across storage accounts. The virtual machines can be part of one or more subnets within a virtual network.

![customer-environment](./media/site-recovery-azure-to-azure-architecture/source-environment.png)

## Enable replication - Step 1

When you enable replication of the virtual machines in Azure portal, the below resources are automatically created in target region (for example: Central US location) based on the source region configuration if you chose the default option. You can customize and select the setting of your choice based on the need. You can refer to [Replication of applications running on Azure virtual machines](site-recovery-replicate-azure-to-azure.md) document for more details.

![enable-rep-1](./media/site-recovery-azure-to-azure-architecture/enable-replication-step-1.png)

**Resource** | **Purpose**
--- | ---
Target resource group | It is the resource group to which all your replicated virtual machines will belong to post failover
Target Virtual Network | It is the virtual network where your virtual machines will come up post failover. A network mapping will be created between source and target virtual networks and vice versa.
Cache Storage accounts | All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target storage account in target location. This is to ensure that the impact on production application running on the virtual machine is minimal.
Target Storage accounts  | These are the storage accounts in target location where the data will be replicated to.
Target Availability set  | These are the availability sets where the VM will come up post failover.

## Enable replication - Step 2

As part of 'enable replication' flow, 'Site Recovery extension mobility service' is installed on the virtual machine automatically. As part of the extension configuration process, below happens.

1. Virtual machine is registered with Site Recovery.

2. Continuous replication is configured for the virtual machine so that any data writes on the disks on the virtual machines are continuously transferred to the cache storage account in the source location.

![enable-rep-2](./media/site-recovery-azure-to-azure-architecture/enable-replication-step-2.png)

>[!IMPORTANT]
>
> Note that Site Recovery will never require any inbound connectivity to the virtual machine. Only outbound connectivity to Site Recovery service URLs/IPs, Office-365 authentication URLs/IPs and cache storage account IPs is required from the virtual machine. You can follow the [networking guidance document](site-recovery-azure-to-azure-networking-guidance.md)  for more details.

## Steady state continuous replication

Once the continuous replication is configured, any write on the disk is immediately transferred to cache storage account. Site recovery service processes the data and sends it to target storage account in target location. Once the data is processed, recovery points are generated in the target storage account every few minutes. You can use any recovery point during a 'Test failover' or a 'Failover'.

## Failover

When you initiate a failover, the virtual machines are created in the configured target resource group, target virtual network, target subnet and the target availability set. You can select any recovery point during the failover.

![enable-rep-2](./media/site-recovery-azure-to-azure-architecture/failover.png)

## Next steps
- Start protecting your workloads by [replicating Azure virtual machines.](site-recovery-azure-to-azure.md)
- Refer to [networking guidance document](site-recovery-azure-to-azure-networking-guidance.md) for more details on setting up networking for replicating Azure VMs.
