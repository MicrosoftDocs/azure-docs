---
title: Manage network adapters for on-premises disaster recovery with Azure Site Recovery
description: Describes how to manage network interfaces for on-premises disaster recovery to Azure with Azure Site Recovery
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 02/13/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.custom: sfi-image-nochange

# Customer intent: As an IT administrator, I want to manage network interfaces for virtual machines during on-premises disaster recovery, so that I can ensure proper network configurations and prevent redundant interfaces when migrating to Azure.
---
# Manage VM network interfaces for on-premises disaster recovery to Azure

An Azure virtual machine (VM) needs at least one network interface. It can have more network interfaces, up to the limit supported by the VM size.

By default, the first network interface you attach to an Azure virtual machine is the primary network interface. All other network interfaces are secondary. Also by default, all outbound traffic from the virtual machine goes through the IP address assigned to the primary IP configuration of the primary network interface.

In an on-premises environment, virtual machines or servers can have multiple network interfaces for different networks within the environment. Different networks typically serve specific operations such as upgrades, maintenance, and internet access. When you migrate or fail over to Azure from an on-premises environment, remember that all network interfaces in the same virtual machine must connect to the same virtual network.

By default, Azure Site Recovery creates as many network interfaces on an Azure virtual machine as are connected to the on-premises server. You can avoid creating redundant network interfaces during migration or failover by editing the network interface settings under the settings for the replicated virtual machine.

## Select the target network

For VMware and physical machines, and for Hyper-V (without System Center Virtual Machine Manager) virtual machines, specify the target virtual network for individual virtual machines. For Hyper-V virtual machines managed by using Virtual Machine Manager, use [network mapping](./hyper-v-vmm-network-mapping.md) to map VM networks on a source Virtual Machine Manager server and target Azure networks.

1. Under **Replicated items** in a Recovery Services vault, select any replicated item to access the settings for that replicated item.

1. Select the **Compute and Network** tab to access the network settings for the replicated item.

1. Under **Network properties**, choose a virtual network from the list of available network interfaces.

	:::image type="content" source="./media/site-recovery-manage-network-interfaces-on-premises-to-azure/compute-and-networks.png" alt-text="Screenshot of network settings.":::

Modifying the target network affects all network interfaces for that specific virtual machine.

For Virtual Machine Manager clouds, modifying network mapping affects all virtual machines and their network interfaces.

## Select the target interface type

Under the **Network interfaces** section of the **Compute and Network** pane, you can view and edit network interface settings. You can also specify the target network interface type.

- A **Primary** network interface is required for failover.
- All other selected network interfaces, if any, are **Secondary** network interfaces.
- Select **Do not use** to exclude a network interface from creation at failover.

By default, when you enable replication, Site Recovery selects all detected network interfaces on the on-premises server. It marks one as **Primary** and all others as **Secondary**. Any subsequent interfaces you add on the on-premises server are marked **Do not use** by default. When you add more network interfaces, ensure that you select the correct Azure virtual machine target size to accommodate all required network interfaces.

## Modify network interface settings

You can modify the subnet and IP address for a replicated item's network interfaces. If you don't specify an IP address, Site Recovery assigns the next available IP address from the subnet to the network interface at failover.

1. Select any available network interface to open the network interface settings.

1. Choose the desired subnet from the list of available subnets.

1. Enter the desired IP address (as required).

	:::image type="content" source="./media/site-recovery-manage-network-interfaces-on-premises-to-azure/network-interface-setting.png" alt-text="Screenshot of network interface settings.":::

1. Select **OK** to finish editing and return to the **Compute and Network** pane.

1. Repeat steps 1-4 for other network interfaces.

1. Select **Save** to save all changes.

## Next steps

[Learn more](../virtual-network/virtual-network-network-interface-vm.yml) about network interfaces for Azure virtual machines.
