---
title: Manage network interfaces in Azure Site Recovery for on-premises to Azure scenarios | Microsoft Docs
description: Describes how to manage network interfaces for on-premises to Azure scenarios with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: mayanknayar
manager: rochakm
editor: ''

ms.assetid: ''
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/22/2017
ms.author: manayar

---
# Manage virtual machine network interfaces for on-premises to Azure scenarios

A virtual machine in Azure must have at least one network interface attached to it, and can have as many network interfaces attached to it as the VM size supports. By default, the first network interface attached to an Azure virtual machine is defined as the primary network interface. All other network interfaces in the virtual machine are secondary network interfaces.

Though you can control which network interface you sent outbound traffic to, by default, all outbound traffic from the virtual machine is sent out the IP address assigned to the primary IP configuration of the primary network interface. This makes assigning the right IP for the primary network very important from an application management perspective.

In an on-premises environment, virtual machines/servers can have multiple network interfaces for different networks within the environment. Different networks are typically used for performing specific operations such as upgrades, maintenance, internet access, etc. When migrating or failing over to Azure from an on-premises environment, it is important to keep in mind that while network interfaces in the same virtual machine can be connected to different subnets within an Azure virtual network, the network interfaces must all be connected to the same virtual network. This can often make multiple network interfaces redundant.

By default, Site Recovery will create as many network interfaces on an Azure virtual machine as are connected to the on-premises server. You can avoid creating redundant network interfaces during migration or failover by editing the network interface settings under settings for the replicated virtual machine.

## Select the target network

For VMware & Physical machines, and for Hyper-V (without VMM) Virtual machines, you can specify the target virtual network for individual virtual machines. For Hyper-V virtual machines managed with VMM, [network mapping](site-recovery-network-mapping.md) is used to map VM networks on a source VMM server, and target Azure networks.

1. Under 'Replicated items' in a Recovery Services vault, click on any replicated item to access the settings for that replicated item.

2. Click on the 'Compute and Network' tab to access the network settings for the replicated item.

3. Under 'Network properties', choose a virtual network from the list of available network interfaces for protected VMware & Physical machines, and for Hyper-V (without VMM) Virtual machines.

	![Compute and Network](./media/site-recovery-manage-network-interfaces-on-premises-to-azure/compute-and-network.png)

Modifying the target network affects all network interfaces for that specific virtual machine.

For VMM clouds, modifying network mapping affects all virtual machines and their network interfaces.

## Select the target interface type

Under the 'Network interfaces' section of the 'Compute and Network' blade, you can view and edit network interface settings, and specify the target network interface type.

- A **Primary** network interface is required for failover.
- All other selected network interfaces, if any, are **Secondary** network interfaces.
- Select **Do not use** to exclude a network interface from creation at failover.

By default, when enabling replication, Site Recovery will select all detected network interfaces on the on-premises server, marking one as 'Primary', and all others as 'Secondary' network interfaces. Any subsequent interfaces added on the on-premises server will be marked 'Do not use' by default. When adding more network interfaces, ensure that the correct Azure virtual machine target size is selected to accommodate all required network interfaces.

## Modifying network interface settings

You can modify the subnet and IP for a replicated item's network interfaces. If an IP is not specified, Site Recovery will assign the next available IP from the subnet to the network interface at failover.

1. Click on any available network interface to open the network interface settings blade.

2. Choose the desired subnet from the list of available subnets.

3. Enter the desired IP (if required).

	![Network interface settings](./media/site-recovery-manage-network-interfaces-on-premises-to-azure/network-interface-settings.png)

4. Click OK to finish editing and return to the 'Compute and Network' blade.

5. Repeat steps 1-4 for other network interfaces.

6. Click 'Save' to save all changes.

## Next steps
  [Learn more](../virtual-network/virtual-network-network-interface-vm.md) about network interfaces for Azure virtual machines.
