---
title: About Hyper-V (with VMM) network mapping with Site Recovery
description: Describes how to set up network mapping for disaster recovery of Hyper-V VMs (managed in VMM clouds) to Azure, with Azure Site Recovery.
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 02/13/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
author: Jeronika-MS
# Customer intent: As a cloud administrator, I want to configure network mapping for Hyper-V VM disaster recovery to Azure, so that I can ensure seamless VM connectivity during failover.
---

# Prepare network mapping for Hyper-V VM disaster recovery to Azure

This article helps you understand and prepare for network mapping when you replicate Hyper-V VMs in System Center Virtual Machine Manager (VMM) clouds to Azure, or to a secondary site, by using the [Azure Site Recovery](site-recovery-overview.md) service.

## Prepare network mapping for replication to Azure

When you replicate to Azure, network mapping maps between VM networks on a source VMM server, and target Azure virtual networks. Mapping does the following:
-  **Network connection**—Ensures that replicated Azure VMs are connected to the mapped network. All machines that fail over on the same network can connect to each other, even if they failed over in different recovery plans.
- **Network gateway**—If you set up a network gateway on the target Azure network, VMs can connect to other on-premises virtual machines.

Network mapping works as follows:

- You map a source VMM VM network to an Azure virtual network.
- After failover, Azure VMs in the source network connect to the mapped target virtual network.
- New VMs added to the source VM network connect to the mapped Azure network when replication occurs.
- If the target network has multiple subnets, and one of those subnets has the same name as the subnet on which the source virtual machine is located, the replica virtual machine connects to that target subnet after failover.
- If there’s no target subnet with a matching name, the virtual machine connects to the first subnet in the network.

## Example

Here's an example to illustrate this mechanism. Take an organization with two locations in New York and Chicago.

**Location** | **VMM server** | **VM networks** | **Mapped to**
---|---|---|---
New York | VMM-NewYork| VMNetwork1-NewYork | Mapped to VMNetwork1-Chicago
 |  | VMNetwork2-NewYork | Not mapped
Chicago | VMM-Chicago| VMNetwork1-Chicago | Mapped to VMNetwork1-NewYork
 | | VMNetwork2-Chicago | Not mapped

In this example:

- When you create a replica VM for any VM that's connected to `VMNetwork1-NewYork`, the replica connects to `VMNetwork1-Chicago`.
- When you create a replica VM for `VMNetwork2-NewYork` or `VMNetwork2-Chicago`, the replica doesn't connect to any network.

Here's how VMM clouds are set up in the example organization, and the logical networks associated with the clouds.

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

Based on these settings, when you select the target VM network, the following table shows the choices that are available.

**Select** | **Protected cloud** | **Protecting cloud** | **Target network available**
---|---|---|---
VMNetwork1-Chicago | SilverCloud1 | SilverCloud2 | Available
 | GoldCloud1 | GoldCloud2 | Available
VMNetwork2-Chicago | SilverCloud1 | SilverCloud2 | Not available
 | GoldCloud1 | GoldCloud2 | Available


If the target network has multiple subnets and one of those subnets has the same name as the subnet on which the source virtual machine is located, the replica virtual machine connects to that target subnet after failover. If there's no target subnet with a matching name, the virtual machine connects to the first subnet in the network.


### Failback behavior

To understand what happens during failback (reverse replication), assume that VMNetwork1-NewYork maps to VMNetwork1-Chicago, with the following settings.


**VM** | **Connected to VM network**
---|---
VM1 | VMNetwork1-Network
VM2 (replica of VM1) | VMNetwork1-Chicago

With these settings, review what happens in a couple of possible scenarios.

**Scenario** | **Outcome**
---|---
No change in the network properties of VM-2 after failover. | VM-1 stays connected to the source network.
Network properties of VM-2 change after failover and disconnect. | VM-1 disconnects.
Network properties of VM-2 change after failover and connect to VMNetwork2-Chicago. | If VMNetwork2-Chicago isn't mapped, VM-1 disconnects.
Network mapping of VMNetwork1-Chicago changes. | VM-1 connects to the network now mapped to VMNetwork1-Chicago.



## Next steps

- [Learn about](hyper-v-vmm-networking.md) IP addressing after failover to a secondary VMM site.
- [Learn about](concepts-on-premises-to-azure-networking.md) IP addressing after failover to Azure.
