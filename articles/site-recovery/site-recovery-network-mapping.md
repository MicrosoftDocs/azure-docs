<properties
	pageTitle="Prepare network mapping for Hyper-V virtual machine protection with VMM in Azure Site Recovery  | Microsoft Azure"
	description="Set up network mapping for Hyper-V virtual machine replication from an on-premises datacenter to Azure, or to a secondary site."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="07/06/2016"
	ms.author="raynew"/>


# Prepare network mapping for Hyper-V virtual machine protection with VMM in Azure Site Recovery

Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover, and recovery of virtual machines and physical servers.

This article describes network mapping, which helps you optimally configure network settings when you're using Site Recovery to replicate Hyper-V virtual machines located in VMM clouds between two on-premises datacenters, or between an on-premises datacenter and Azure. Note that if you're replicating Hyper-V VMs without a VMM cloud, or replicating VMware VMs or physical servers, this article isn't relevant.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Overview

Network mapping is used when Azure Site Recovery is deployed to replicate Hyper-V virtual machines to Azure or to a secondary datacenter, using Hyper-V Replica or SAN replication.

- **Replicating Hyper-V virtual machines in VMM clouds between two on-premises datacenters**—Network mapping maps between VM networks on a source VMM server and VM networks on a target VMM server to do the following:

	- **Connect virtual machines after failover**—Ensures that virtual machines will be connected to appropriate networks after failover. The replica virtual machine will be connected to the target network that is mapped to the source network.
	- **Place replica virtual machines on host servers**—Optimally place replica virtual machines on Hyper-V host servers. Replica virtual machines will be placed on hosts that can access the mapped VM networks.
	- **No network mapping**—If you don’t configure network mapping, replicated virtual machines won’t be connected to any VM networks after failover.

- **Replicating Hyper-V virtual machines in an on-premises VMM cloud to Azure**—Network mapping maps between VM networks on the source VMM server and target Azure networks to do the following:
	- **Connect virtual machines after failover**—All machines which failover on the same network can connect to each other, irrespective of which recovery plan they are in.
	- **Network gateway**—If a network gateway is set up on the target Azure network, virtual machines can connect to other on-premises virtual machines.
	- **No network mapping**—If you don’t configure network mapping, only virtual machines that failover in the same recovery plan will be able to connect to each other after fail over to Azure.


## Network mapping example

Network mapping can be configured between VM networks on two VMM servers, or on a single VMM server if two sites are managed by the same server. When mapping is configured correctly and replication is enabled, a virtual machine at the primary location will be connected to a network, and its replica at the target location will be connected to its mapped network.

If networks have been set up correctly in VMM, when you select a target VM network during network mapping, the VMM source clouds that use the source VM network will be displayed, along with the available target VM networks on the target clouds that are used for protection.

Here’s an example to illustrate this mechanism. Let’s take an organization with two locations in New York and Chicago.

**Location** | **VMM server** | **VM networks** | **Mapped to**
---|---|---|---
New York | VMM-NewYork| VMNetwork1-NewYork | Mapped to VMNetwork1-Chicago
 |  | VMNetwork2-NewYork | Not mapped
Chicago | VMM-Chicago| VMNetwork1-Chicago | Mapped to VMNetwork1-NewYork
 | | VMNetwork2-Chicago | Not mapped

With this example:

- When a replica virtual machine is created for any virtual machine that is connected to VMNetwork1-NewYork, it will be connected to VMNetwork1-Chicago.
- When a replica virtual machine is created for VMNetwork2-NewYork or VMNetwork2-Chicago, it will not be connected to any network.

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

### Target networks

Based on these settings, when you select the target VM network, the following table shows the choices that will be available.

**Select** | **Protected cloud** | **Protecting cloud** | **Target network available**
---|---|---|---
VMNetwork1-Chicago | SilverCloud1 | SilverCloud2 | Available
 | GoldCloud1 | GoldCloud2 | Available
VMNetwork2-Chicago | SilverCloud1 | SilverCloud2 | Not available
 | GoldCloud1 | GoldCloud2 | Available



## Multiple subnets

If the target network has multiple subnets and one of those subnets has the same name as the subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.


### Failback

To see what happens in the case of failback (reverse replication), let’s assume that VMNetwork1-NewYork is mapped to VMNetwork1-Chicago, with the following settings.


**Virtual machine** | **Connected to VM network**
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

Now that you have a better understanding of network mapping, [get started with Site Recovery deployment](site-recovery-best-practices.md).
