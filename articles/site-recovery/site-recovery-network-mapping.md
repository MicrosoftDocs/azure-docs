<properties
	pageTitle="Site Recovery network mapping"
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers located on on-premises to Azure or to a secondary on-premises site."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="08/05/2015"
	ms.author="raynew"/>


# Site Recovery network mapping


Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Read about possible deployment scenarios in the [Site Recovery Overview](site-recovery-overview.md).


## About this article

Network mapping is an important element when you deploy VMM and Site Recovery. It optimally places replicated virtual machines on target Hyper-V host servers, and ensures your replicated virtual machines are connected to appropriate networks after failover. This article describes network mapping and provides a couple of examples to help you understand how network mapping works.


Post any questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview

The way in which you set up network mapping depends on your Site Recovery deployment scenario.



- **On-premises to on-premises VMM servers**—Network mapping maps between VM networks on a source VMM server and VM networks on a target VMM server to do the following:

	- **Connect virtual machines after failover**—Ensures that virtual machines will be connected to appropriate networks after failover. The replica virtual machine will be connected to the target network that is mapped to the source network.
	- **Place replica virtual machines on host servers**—Optimally place replica virtual machines on Hyper-V host servers. Replica virtual machines will be placed on hosts that can access the mapped VM networks.
	- **No network mapping**—Uf you don’t configure network mapping replicated virtual machines won’t be connected to any VM networks after failover.

- **On-premises VMM server to Azure**—Network mapping maps between VM networks on the source VMM server and target Azure networks to do the following:
	- **Connect virtual machines after failover**—All machines which failover on the same network can connect to each other, irrespective of which recovery plan they are in.
	- **Network gateway**—If a network gateway is setup on the target Azure network, virtual machines can connect to other on-premises virtual machines.
	- **No network mapping**—If you don’t configure network mapping only virtual machines that fail over in the same recovery plan will be able to connect to each other after failover to Azure.

## VM networks

VMM logical network provides an abstract view of the physical network infrastructure. VM networks provide a network interface so that virtual machines can connect to logical networks. A logical network needs at least one VM network. When you place a virtual machine in a cloud for protection it must be connected to a VM networks that links to a logical network associated with the cloud. Learn more at:

- [Logical Networks (Part 1)](http://blogs.technet.com/b/scvmm/archive/2013/02/14/networking-in-vmm-2012-sp1-logical-networks-part-i.aspx)
- [Virtual Networking in VMM 2012 SP1](http://blogs.technet.com/b/scvmm/archive/2013/01/08/virtual-networking-in-vmm-2012-sp1.aspx)

## Example

Network mapping can be configured between VM networks on two VMM servers, or on a single VMM server if two sites are managed by the same server. When mapping is configured correctly and replication is enabled, a virtual machine at the primary location will be connected to a network, and its replica at the target location will be connected to its mapped network.

If networks have been set up correctly in VMM, when you select a target VM network during network mapping, the VMM source clouds that use the source VM network will be displayed, along with the available target VM networks on the target clouds that are used for protection.

Here’s an example to illustrate this mechanism. Let’s take an organization with two locations in New York and Chicago.

**Location** | **VMM server** | **VM networks** | **Mapped to**
---|---|---|---
New York | VMM-NewYork| VMNetwork1-NewYork | Mapped to VMNetwork1-Chicago
 |  | VMNetwork2-NewYork | Not mapped
Chicago | VMM-Chicago| VMNetwork1-Chicago | Mapped to VMNetwork1-NewYork
 | | VMNetwork1-Chicago | Not mapped

With this example:

- When a replica virtual machine is created for any virtual machine that is connected to VMNetwork1-NewYork, it will be connected to VMNetwork1-Chicago.
- When a replica virtual machine is created for VMNetwork2-NewYork or VMNetwork2-Chicago, it will not be connected to any network.

Here's how VMM clouds are set up in our example organization, and the logical netowrks associated with the clouds.

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

If the target network has multiple subnets and one of those subnets has the same name as subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.


### Failback

To see what happens in the case of failback (reverse replication), let’s assume that VMNetwork1-NewYork is mapped to VMNetwork1-Chicago, with the following settings.


**Virtual machine** | **Connected to VM network**
---|---
VM1 | VMNetwork1-Network
VM2 (replica of VM1) | VMNetwork1-Chicago

With these settings let's review what happens in a couple of possible scenarios.

**Scenario** | **Outcome**
---|---
No change in the network properties of VM-2 after failover | VM-1 remains connected to the source network.
Network properties of VM-2 are changed after failover and is disconnected | VM-1 is disconnected
Network properties of VM-2 are changed after failover and is connected to VMNetwork2-Chicago | If VMNetwork2-Chicago isn’t mapped, VM-1 will be disconnected
Network mapping of VMNetwork1-Chicago is changed | VM-1 will be connected to the network now mapped to VMNetwork1-Chicago


## Next steps

Now that you have a better understanding of network mapping start reading the [best practices](site-recovery-best-practices.md) to prepare for deployment.
 