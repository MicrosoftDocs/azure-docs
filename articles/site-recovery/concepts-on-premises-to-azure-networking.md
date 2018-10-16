---
title: Set up IP addressing to connect after failover to Azure with Azure Site Recovery | Microsoft Docs
description: Describes how to set up IP addressing to connect to Azure VMs after failover from on-premises with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: mayurigupta13
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 10/16/2018
ms.author: mayg

---
# Set up IP addressing to connect after failover to Azure

This article explains the networking requirements for connecting to Azure VMs, after using the [Azure Site Recovery](site-recovery-overview.md) service for replication and failover to Azure.

In this article you'll learn about:

> [!div class="checklist"]
> * The connection methods you can use
> * How to use a different IP address for replicated Azure VMs
> * How to retain IP addresses for Azure VMs after failover

## Connecting to replica VMs

When planning your replication and failover strategy, one of the key questions is how to connect to the Azure VM after failover. There are a couple of choices when designing your network strategy for replica Azure VMs:

- **Use different IP address**: You can select to use a different IP address range for the replicated Azure VM network. In this scenario the VM gets a new IP address after failover, and a DNS update is required.
- **Retain same IP address**: You might want to use the same IP address range as that in your primary on-premises site, for the Azure network after failover. Keeping the same IP addresses simplifies the recovery by reducing network related issues after failover. However, when you're replicating to Azure, you will need to update routes with the new location of the IP addresses after failover.

## Retaining IP addresses

Site Recovery provides the capability to retain fixed IP addresses when failing over to Azure, with a subnet failover.

- With subnet failover, a specific subnet is present at Site 1 or Site 2, but never at both sites simultaneously.
- In order to maintain the IP address space in the event of a failover, you programmatically arrange for the router infrastructure to move the subnets from one site to another.
- During failover, the subnets move with the associated protected VMs. The main drawback is that in the event of a failure, you have to move the whole subnet.


### Failover example

Let's look at an example for failover to Azure using a fictitious company, Woodgrove Bank.

- Woodgrove Bank hosts their business apps in an on-premises site. They host their mobile apps on Azure.
- There's VPN site-to-site connectivity between their on-premises edge network and the Azure virtual network. Because of the VPN connection, the virtual network in Azure appears as an extension of the on-premises network.
- Woodgrove wants to replicate on-premises workloads to Azure with Site Recovery.
 - Woodgrove has apps which depend on hard-coded IP addresses, so they need to retain IP addresses for the apps, after failover to Azure.
 - Resources running in Azure use the IP address range 172.16.1.0/24, 172.16.2.0/24.

![Before subnet failover](./media/site-recovery-network-design/network-design7.png)

**Infrastructure before failover**


For Woodgrove to be able to replicate its VMs to Azure while retaining the IP addresses, here's what the company needs to do:


1. Create Azure virtual network in which the Azure VMs will be created after failover of on-premises machines. It should be an extension of the on-premises network, so that applications can fail over seamlessly.
2. Before failover, in Site Recovery, they assign the same IP address in the machine properties. After failover, Site Recovery assigns this address to the Azure VM.
3. After failover runs and the Azure VMs are created with the same IP address, they connect to the network using a [Vnet to Vnet connection](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md). This action can be scripted.
4. They need to modify routes, to reflect that 192.168.1.0/24 has now moved to Azure.


**Infrastructure after failover**

![After subnet failover](./media/site-recovery-network-design/network-design9.png)

#### Site-to-site connection

In addition to the vnet-to-vnet connection, after failover, Woodgrove can set up site-to-site VPN connectivity:
- When you set up a site-to-site connection, in the Azure network you can only route traffic to the on-premises location (local-ntwork) if the IP address range is different from the on-premises IP address range. This is because Azure doesn’t support stretched subnets. So, if you have subnet 192.168.1.0/24 on-premises, you can’t add a local-network 192.168.1.0/24 in the Azure network. This is expected because Azure doesn’t know that there are no active VMs in the subnet, and that the subnet is being created for disaster recovery only.
- To be able to correctly route network traffic out of an Azure network, the subnets in the network and the local-network mustn't conflict.




## Assigning new IP addresses

This [blog post](http://azure.microsoft.com/blog/2014/09/04/networking-infrastructure-setup-for-microsoft-azure-as-a-disaster-recovery-site/) explains how to set up the Azure networking infrastructure when you don't need to retain IP addresses after failover. It starts with an application description, looks at how to set up networking on-premises and in Azure, and concludes with information about running failovers.

## Next steps
[Run a failover](site-recovery-failover.md)
