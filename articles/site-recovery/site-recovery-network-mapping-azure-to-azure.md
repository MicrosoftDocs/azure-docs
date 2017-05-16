---
title: Network mapping between two Azure regions in Azure Site Recovery | Microsoft Docs
description: Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers. Learn about failover to Azure or a secondary datacenter.
services: site-recovery
documentationcenter: ''
author: prateek9us
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 5/15/2017
ms.author: pratshar

---
# Network mapping between two Azure regions
This article describes how to map Azure virtual networks of two Azure regions with each other. Network mapping ensures that when replicated virtual machine is created in the target Azure region, it is created on the virtual network that is mapped to virtual network of the source virtual machine.  

## Prerequisites
Before you map networks make sure, you have created [Azure virtual networks](../virtual-network/virtual-networks-overview.md) in both source and target Azure regions. 

## Map networks

To map an Azure virtual network in one Azure region to another virtual network in another region, go to Site Recovery Infrastructure -> Network Mapping (For Azure Virtual Machines) and create a new network mapping.

![Network Mapping](./media/site-recovery-network-mapping-azure-to-azure/network-mapping1.png)


In the example below my virtual machine is running in East Asia region and is being replicated to Southeast Asia. 

Select the source and target network and then click OK to create a network mapping from East Asia to Southeast Asia.

![Network Mapping](./media/site-recovery-network-mapping-azure-to-azure/network-mapping2.png)


Do the same thing to create a network mapping from Southeast Asia to East Asia.  
![Network Mapping](./media/site-recovery-network-mapping-azure-to-azure/network-mapping3.png)


## Mapping network when enabling replication

If network mapping is not done when you are replicating a virtual machine for the first time form one Azure region to another, then you can choose target network as part of the same process. Site Recovery creates network mappings from source region to target region and from target region to source region based on this selection.   

![Network Mapping](./media/site-recovery-network-mapping-azure-to-azure/network-mapping4.png)

By default, Site Recovery creates a network in the target region that is identical to the source network and by adding '-asr' as a suffix to the name of the source network. You can choose an already created network by clicking Customize.

![Network Mapping](./media/site-recovery-network-mapping-azure-to-azure/network-mapping5.png)


If the network mapping is already done, you can't change the target virtual network while enabling replication. To change it, modify existing network mapping.  

![Network Mapping](./media/site-recovery-network-mapping-azure-to-azure/network-mapping6.png)

![Network Mapping](./media/site-recovery-network-mapping-azure-to-azure/modify-network-mapping.png)

> [!IMPORTANT]
> If you modify a network mapping from region-1 to region-2, make sure you modify the network mapping for region-2 to region-1 as well. 
>
> 



