---
title: Plan networking for Hyper-V replication to a secondary VMM site with Azure Site Recovery | Microsoft Docs
description: This article discusses network planning when replicating Hyper-V VMs to a secondary System Center VMM site with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 095f2d73-994e-4fc0-96f2-e03a7d72e492
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/27/2017
ms.author: raynew

---
# Step 3: Plan networking for Hyper-V VM replication to a secondary VMM site

After reviewing deployment prerequisites, read this article to plan networking when replicating Hyper-V virtual machines (VMs) managed in System Center Virtual Machine Manager (VMM) clouds, to a secondary site using [Azure Site Recovery](site-recovery-overview.md) in the Azure portal. 

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Network mapping overview

Network mapping is used when replicating Hyper-V VMs (managed in VMM) to a secondary datacenter. Network mapping maps between VM networks on a source VMM server, and VM networks on a target VMM server. Mapping does the following:

- **Network connection**—Connects VMs to appropriate networks after failover. The replica VM will be connected to the target network that's mapped to the source network.
- **Optimal placement**—Optimally places the replica VMs on Hyper-V host servers. Replica VMs are placed on hosts that can access the mapped VM networks.
- **No network mapping**—If you don’t configure network mapping, replica VMs won’t be connected to any VM networks after failover.


### Example

Here’s an example to illustrate this mechanism. Let’s take an organization with two locations in New York and Chicago.

**Location** | **VMM server** | **VM networks** | **Mapped to**
---|---|---|---
New York | VMM-NewYork| VMNetwork1-NewYork | Mapped to VMNetwork1-Chicago
 |  | VMNetwork2-NewYork | Not mapped
Chicago | VMM-Chicago| VMNetwork1-Chicago | Mapped to VMNetwork1-NewYork
 | | VMNetwork1-Chicago | Not mapped

In this example:

- When a replica virtual machine is created for any virtual machine that is connected to VMNetwork1-NewYork, it will be connected to VMNetwork1-Chicago.
- When a replica virtual machine is created for VMNetwork2-NewYork or VMNetwork2-Chicago, it will not be connected to any network.

Here's how VMM clouds are set up in our example organization, and the logical networks associated with the clouds.

#### Cloud protection settings

**Protected cloud** | **Protecting cloud** | **Logical network (New York)**  
---|---|---
GoldCloud1 | GoldCloud2 |
SilverCloud1| SilverCloud2 |
GoldCloud2 | <p>NA</p><p></p> | <p>LogicalNetwork1-NewYork</p><p>LogicalNetwork1-Chicago</p>
SilverCloud2 | <p>NA</p><p></p> | <p>LogicalNetwork1-NewYork</p><p>LogicalNetwork1-Chicago</p>

#### Logical and VM network settings

**Location** | **Logical network** | **Associated VM network**
---|---|---
New York | LogicalNetwork1-NewYork | VMNetwork1-NewYork
Chicago | LogicalNetwork1-Chicago | VMNetwork1-Chicago
 | LogicalNetwork2Chicago | VMNetwork2-Chicago

#### Target network settings

Based on these settings, when you select the target VM network, the following table shows the choices that will be available.

**Select** | **Protected cloud** | **Protecting cloud** | **Target network available**
---|---|---|---
VMNetwork1-Chicago | SilverCloud1 | SilverCloud2 | Available
 | GoldCloud1 | GoldCloud2 | Available
VMNetwork2-Chicago | SilverCloud1 | SilverCloud2 | Not available
 | GoldCloud1 | GoldCloud2 | Available


If the target network has multiple subnets and one of those subnets has the same name as the subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.


#### Failback behavior

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



## Prepare for network mapping

1. On the source and target VMM servers, you should have a logical network associated with the source and target clouds. 
2. In the source and target servers, you should have a VM network linked to the logical network.
3. VMs on Hyper-V hosts in the source location should be linked to the source VM network. If you're only using a single VMM server, you can configure mapping between VM networks on the same server.

Here's what happens when you set up network mapping during Site Recovery deployment:

- When you set up network mapping and select a target VM network, the VMM source clouds that use the source VM network will be displayed, along with the available target VM networks on the target clouds.
- - When mapping is configured correctly and replication is enabled, a source VM will be connected to its source VM network, and its replica at the target location will be connected to its mapped VM network.
- If the target network has multiple subnets, and one of those subnets has the same name as the subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the VM will be connected to the first subnet in the network.

## Connect to VMs after failover

When planning your replication and failover strategy, one of the key questions is how to connect to the replica after failover. There are a couple of choices: 

- **Use a different IP address**: You can select to use a different IP address for the replicated VM. In this scenario the VM gets a new IP address after failover, and a DNS update is required.
- **Retain the same IP address**: You might want to use the same IP address for the replica VM. Keeping the same IP addresses simplifies the recovery by reducing network related issues after failover. 

## Retain IP addresses

If you want to retain the IP addresses from the primary site after failover to the secondary site, you can do a full subnet failover, and update routes to indicate the new location of the IP addresses, or alternative deploy a stretched subnet between the primary and the recovery sites.

### Stretched subnet

In a stretched subnet, the subnet is available simultaneously in both the primary and secondary site. If you move a server and its IP (Layer 3) configuration to the secondary site, the network will route the traffic to the new location automatically. 

From a Layer 2 (data link layer) perspective, you need networking equipment that can manage a stretched VLAN. In addition, by stretching the VLAN, the potential fault domain extends to both sites, essentially becoming a single point of failure. While this is an unlikely, it could happen that a broadcast storm started and cannot be isolated. 


### Subnet failover

You can run a subnet failover to obtain the benefits of the stretched subnet, without actually stretching it. In this solution, a subnet will be available in the source or target site, but not at both simultaneously. To maintain the IP address space in the event of a failover, you can programmatically arrange for the router infrastructure to move the subnets from one site to another. After when failover occurs, subnets would move with the associated VMs. The main drawback is that in the event of a failure, you have to move the whole subnet.

### Example

Here's an example of complete subnet failover. The primary site has applications running in subnet 192.168.1.0/24. At failover, all the VMs in this subnet are failed over to the secondary site, and retain their IP addresses. Routes need to be modified to reflect the fact that all the VM virtual machines belonging to subnet 192.168.1.0/24 have now moved to the secondary site.

The following graphics show the subnets before and after failover:

- Before failover, subnet 192.168.0.1/24 is active on the source site, become active on the secondary site after failover.
- The routes between primary site and recovery site, third site and primary site, and third site and recovery site will have to be appropriately modified.

**Before failover**

![Before Failover](./media/vmm-to-vmm-walkthrough-network/network-design2.png)

**After failover**

![After Failover](./media/vmm-to-vmm-walkthrough-network/network-design3.png)

After failover, here's what happens:

- Site Recovery allocates an IP address for each network interface on the VM, from the static IP address pool in the relevant network, for each VMM instance.
- If the IP address pool in the secondary site is the same as that on the source site, Site Recovery allocates the same IP address (of the source VM) to the replica VM. The IP address is reserved in VMM, but it isn't set as the failover IP address on the Hyper-V host. The failover IP address on a Hyper-v host is set just before the failover.
- If the same IP address isn't available, Site Recovery allocates another available IP address from the pool.
- If VMs use DHCP, Site Recovery doesn't manage the IP addresses. You need to check that the DHCP server on the secondary site can allocate address from the same range as the source site.

### Validate the IP address

After you enable protection for a VM, you can use following sample script to verify the address assigned to the VM. The same IP address will be set as the failover IP address, and assigned to the VM at the time of failover:

    ```
    $vm = Get-SCVirtualMachine -Name <VM_NAME>
    $na = $vm[0].VirtualNetworkAdapters>
    $ip = Get-SCIPAddress -GrantToObjectID $na[0].id
    $ip.address 
    ```

## Changing IP addresses

In this scenario, the IP addresses of VMs that fail over are changed. The drawback of this solution is the maintenance required. Typically, DNS will be updated after replica VMs start. DNS entries might need to be changed or fluster in thenetwork, and cached entries updated. This can result in downtime. Downtime can be mitigated as follows:

- Use low TTL values for intranet applications.
- Use the following script in a Site Recovery recovery plan, to update the DNS server to ensure a timely update. You don't need the script if you use dynamic DNS registration.

    ```
    param(
    string]$Zone,
    [string]$name,
    [string]$IP
    )
    $Record = Get-DnsServerResourceRecord -ZoneName $zone -Name $name
    $newrecord = $record.clone()
    $newrecord.RecordData[0].IPv4Address  =  $IP
    Set-DnsServerResourceRecord -zonename $zone -OldInputObject $record -NewInputObject $Newrecord
    ```
    
### Example 

Let's look at a scenario in which you're planning to use different IP addresses across the primary and the recovery sites.In this example we have different IP addresses across primary and secondary sites, and there;s a third site from which applications hosted on the primary or recovery site can be accessed.

- Before failover, apps are hosted subnet 192.168.1.0/24 on the primary site, and are configured to be in subnet 172.16.1.0/24 on the secondary site after a failover.
- VPN connections/network routes have been configured appropriately so that all three sites can access each other.
- After failover, apps will be restored in the recovery subnet. In this scenario there's no need to fail over the entire subnet, and no changes are needed to reconfigure VPN or network routes. The failover, and some DNS updates, ensure that applications remain accessible.
- If DNS is configured to allow dynamic updates, then the VMs will register themselves using the new IP address, when they start after failover.

**Before failover**

![Different IP - Before Failover](./media/vmm-to-vmm-walkthrough-network/network-design10.png)

**After failover**

![Different IP - After Failover](./media/vmm-to-vmm-walkthrough-network/network-design11.png)



## Next steps

Go to [Step 4: Prepare VMM and Hyper-V](vmm-to-vmm-walkthrough-vmm-hyper-v.md).


