---
title: About Hyper-V (with VMM) network mapping with Site Recovery 
description: Describes how to set up network mapping for disaster recovery of Hyper-V VMs (managed in VMM clouds) to Azure, with Azure Site Recovery.
ms.service: site-recovery
ms.topic: conceptual
ms.date: 11/14/2019
ms.author: ankitadutta
author: ankitaduttaMSFT
---


# Prepare network mapping for Hyper-V VM disaster recovery to Azure


This article helps you to understand and prepare for network mapping when you replicate Hyper-V VMs in System Center Virtual Machine Manager (VMM) clouds to Azure, or to a secondary site, using the [Azure Site Recovery](site-recovery-overview.md) service.


## Prepare network mapping for replication to Azure

When you're replicating to Azure, network mapping maps between VM networks on a source VMM server, and target Azure virtual networks. Mapping does the following:
-  **Network connection**—Ensures that replicated Azure VMs are connected to the mapped network. All machines which fail over on the same network can connect to each other, even if they failed over in different recovery plans.
- **Network gateway**—If a network gateway is set up on the target Azure network, VMs can connect to other on-premises virtual machines.

Network mapping works as follows:

- You map a source VMM VM network to an Azure virtual network.
- After failover Azure VMs in the source network will be connected to the mapped target virtual network.
- New VMs added to the source VM network are connected to the mapped Azure network when replication occurs.
- If the target network has multiple subnets, and one of those subnets has the same name as subnet on which the source virtual machine is located, then the replica virtual machine connects to that target subnet after failover.
- If there’s no target subnet with a matching name, the virtual machine connects to the first subnet in the network.

## Prepare network mapping for replication to a secondary site

When you're replicating to a secondary site, network mapping maps between VM networks on a source VMM server, and VM networks on a target VMM server. Mapping does the following:

- **Network connection**—Connects VMs to appropriate networks after failover. The replica VM will be connected to the target network that's mapped to the source network.
- **Optimal VM placement**—Optimally places the replica VMs on Hyper-V host servers. Replica VMs are placed on hosts that can access the mapped VM networks.
- **No network mapping**—If you don’t configure network mapping, replica VMs won’t be connected to any VM networks after failover.

Network mapping works as follows:

- Network mapping can be configured between VM networks on two VMM servers, or on a single VMM server if two sites are managed by the same server.
- When mapping is configured correctly and replication is enabled, a VM at the primary location will be connected to a network, and its replica at the target location will be connected to its mapped network.
- When you select a target VM network during network mapping in Site Recovery, the VMM source clouds that use the source VM network will be displayed, along with the available target VM networks on the target clouds that are used for protection.
- If the target network has multiple subnets and one of those subnets has the same name as the subnet on which the source virtual machine is located, then the replica VM will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the VM will be connected to the first subnet in the network.

## Example

Here’s an example to illustrate this mechanism. Let’s take an organization with two locations in New York and Chicago.

**Location** | **VMM server** | **VM networks** | **Mapped to**
---|---|---|---
New York | VMM-NewYork| VMNetwork1-NewYork | Mapped to VMNetwork1-Chicago
 |  | VMNetwork2-NewYork | Not mapped
Chicago | VMM-Chicago| VMNetwork1-Chicago | Mapped to VMNetwork1-NewYork
 | | VMNetwork2-Chicago | Not mapped

In this example:

- When a replica VM is created for any VM that's connected to VMNetwork1-NewYork, it will be connected to VMNetwork1-Chicago.
- When a replica VM is created for VMNetwork2-NewYork or VMNetwork2-Chicago, it won't be connected to any network.

Here's how VMM clouds are set up in our example organization, and the logical networks associated with the clouds.

### Cloud protection settings

**Protected cloud** | **Protecting cloud** | **Logical network (New York)**  
---|---|---
GoldCloud1 | GoldCloud2 |
SilverCloud1| SilverCloud2 |
GoldCloud2 | <p>NA</p><p></p> | <p>LogicalNetwork1-NewYork</p><p>LogicalNetwork1-Chicago</p>
SilverCloud2 | <p>NA</p><p></p> | <p>LogicalNetwork1-NewYork</p><p>LogicalNetwork1-Chicago</p>

### Logical and VM network settings

**Location** | **Logical network** | **Associated VM network**
---|---|---
New York | LogicalNetwork1-NewYork | VMNetwork1-NewYork
Chicago | LogicalNetwork1-Chicago | VMNetwork1-Chicago
 | LogicalNetwork2Chicago | VMNetwork2-Chicago

### Target network settings

Based on these settings, when you select the target VM network, the following table shows the choices that will be available.

**Select** | **Protected cloud** | **Protecting cloud** | **Target network available**
---|---|---|---
VMNetwork1-Chicago | SilverCloud1 | SilverCloud2 | Available
 | GoldCloud1 | GoldCloud2 | Available
VMNetwork2-Chicago | SilverCloud1 | SilverCloud2 | Not available
 | GoldCloud1 | GoldCloud2 | Available


If the target network has multiple subnets and one of those subnets has the same name as the subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.


### Failback behavior

To see what happens in the case of failback (reverse replication), let’s assume that VMNetwork1-NewYork is mapped to VMNetwork1-Chicago, with the following settings.


**VM** | **Connected to VM network**
---|---
VM1 | VMNetwork1-Network
VM2 (replica of VM1) | VMNetwork1-Chicago

With these settings, let's review what happens in a couple of possible scenarios.

**Scenario** | **Outcome**
---|---
No change in the network properties of VM-2 after failover. | VM-1 remains connected to the source network.
Network properties of VM-2 are changed after failover and is disconnected. | VM-1 is disconnected.
Network properties of VM-2 are changed after failover and is connected to VMNetwork2-Chicago. | If VMNetwork2-Chicago isn’t mapped, VM-1 will be disconnected.
Network mapping of VMNetwork1-Chicago is changed. | VM-1 will be connected to the network now mapped to VMNetwork1-Chicago.



## Next steps

- [Learn about](hyper-v-vmm-networking.md) IP addressing after failover to a secondary VMM site.
- [Learn about](concepts-on-premises-to-azure-networking.md) IP addressing after failover to Azure.
