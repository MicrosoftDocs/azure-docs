---
title: Plan networking for physical server replication to Azure | Microsoft Docs
description: This article discusses network planning required when replicating physical servers to Azure
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 71db2435-b5ce-4263-83f6-093d10d1d4e1
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/27/2017
ms.author: raynew

---

# Step 4: Plan networking for physical server replication to Azure

This article summarizes network planning considerations when replicating on-premises physical servers to Azure using the [Azure Site Recovery](site-recovery-overview.md) service.

Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Connect to replica Azure VMs

When planning your replication and failover strategy, one of the key questions is how to connect to the Azure VM after failover. There are a couple of choices when designing your network strategy for replica Azure VMs:

- **Use a different IP address**: You can select to use a different IP address range for the replicated Azure VM network. In this scenario, the machine gets a new IP address after failover, and a DNS update is required.
- **Use the same IP address**: You might want to use the same IP address range as that in your primary on-premises site, for the Azure network after failover. Keeping the same IP addresses simplifies the recovery by reducing network related issues after failover. However, when you're replicating to Azure, you will need to update routes with the new location of the IP addresses after failover.

## Retain IP addresses

Site Recovery provides the capability to retain fixed IP addresses when failing over to Azure, with a subnet failover.
With subnet failover, a specific subnet is present at Site 1 or Site 2, but never at both sites simultaneously. In order to maintain the IP address space in the event of a failover, you programmatically arrange for the router infrastructure to move the subnets from one site to another. During failover, the subnets move with the associated protected VMs. The main drawback is that in the event of a failure, you have to move the whole subnet.

### Failover example

Let's look at an example for failover to Azure.

- A ficticious company, Woodgrove Bank, has an on-premises infrastructure hosting their business apps. Their mobile applications are hosted on Azure.
- Connectivity between Woodgrove Bank VMs in Azure and on-premises servers is provided by a site-to-site (VPN) connection between the on-premises edge network and the Azure virtual network.
- This VPN means that the company's virtual network in Azure appears as an extension of their on-premises network.
- Woodgrove wants to use Site Recovery to replicate on-premises workloads to Azure.
 - Woodgrove has to deal with applications and configurations which depend on hard-coded IP addresses, and thus need to retain IP addresses for their applications after failover to Azure.
 - Woodgrove has assigned IP addresses from range 172.16.1.0/24, 172.16.2.0/24 to its resources running in Azure.


For Woodgrove to be able to replicate its servers to Azure while retaining the IP addresses, here's what the company needs to do:

1. Create an Azure virtual network. It should be an extension of the on-premises network, so that applications can fail over
seamlessly.
2. Azure allows you to add site-to-site VPN connectivity, in addition to point-to-site connectivity to the virtual networks created in Azure.
3. When setting up the site-to-site connection, in the Azure network, you can route traffic to the on-premises location (local-network) only if the IP address range is different from the on-premises IP address range.
    - This is because Azure doesn’t support stretched subnets. So if you have subnet 192.168.1.0/24 on-premises, you can’t add a local-network 192.168.1.0/24 in the Azure network.
    - This is expected because Azure doesn’t know that there are no active machines in the subnet, and that the subnet is being created for disaster recovery only.
    - To be able to correctly route network traffic out of an Azure network the subnets in the network and the local-network mustn't conflict.

![Before subnet failover](./media/physical-walkthrough-network/network-design7.png)

#### Before failover

1. Create an additional network (for example Recovery Network). This is the network in which failed over VMs are created.
2. To ensure that the IP address for a machine is retained after a failover, in the machine properties > **Configure**, specify the same IP address that the server has on-premises, and click **Save**.
3. When the machine is failed over, Azure Site Recovery will assign the provided IP address to it.
4. After failover is trigger is triggered, and the VMs are created in Azure with the required IP address, you can connect to the network using a [Vnet to Vnet connection](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md). This action can be scripted.
5. Routes need to be appropriately modified, to reflect that 192.168.1.0/24 has now moved to Azure.

    ![After subnet failover](./media/physical-walkthrough-network/network-design9.png)

#### After failover

If you don't have an Azure network as illustrated above, you can create a site-to-site VPN connection between your primary site and Azure, after failover.

## Change IP addresses

This [blog post](http://azure.microsoft.com/blog/2014/09/04/networking-infrastructure-setup-for-microsoft-azure-as-a-disaster-recovery-site/) explains how to set up the Azure networking infrastructure when you don't need to retain IP addresses after failover. It starts with an application description, looks at how to set up networking on-premises and in Azure, and concludes with information about running failovers.  

## Next steps

Go to [Step 5: Prepare Azure](physical-walkthrough-prepare-azure.md)
