---
title: View public IP address consumption in Azure Stack | Microsoft Docs
description: Administrators can view the consumption of public IP addresses in a region
services: azure-stack
documentationcenter: ''
author: ScottNapolitan
manager: darmour
editor: ''

ms.assetid: 0f77be49-eafe-4886-8c58-a17061e8120f
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 7/18/2017
ms.author: scottnap

---
# View public IP address consumption in Azure Stack
As a cloud administrator, you can view the number of public IP addresses that have been allocated to tenants, the number of public IP addresses that are still available for allocation, and the percentage of public IP addresses that have been allocated in that location.

The **Public IP pools usage** tile shows the total number of public IP
addresses that have been consumed across all public IP address pools on the fabric, whether
they have been used for tenant IaaS VM instances, fabric
infrastructure services, or public IP address resources that were explicitly created by tenants.

The purpose of this tile is to give Azure Stack administrators a sense of the overall number of public IP
addresses that have been consumed in this location. This helps administrators determine whether
they are running low on this resource.

On the **Resource providers**, **Network** blade, the **Public IP addresses** menu item under **Tenant Resources** lists only those public IP addresses that have been
*explicitly created by tenants*. As such, the number of **Used** public
IP addresses on the **Public IP pools usage** tile is always
different from (larger than) the number on the **Public IP Addresses** tile
under **Tenant Resources**.

## View the public IP address usage information
To view the total number of public IP addresses that have been consumed
in the region:

1. In the Azure Stack administrator portal, click **More services**, under **Administrative Resources**, click **Resource providers**.
2. From the list of **Resource Providers**, select **Network**.
3. The **Network** blade displays the **Public IP pools usage** tile in the **Overview** section.

![Network Resource Provider blade](media/azure-stack-viewing-public-ip-address-consumption/image01.png)

Keep in mind that the **Used** number represents the number of public IP addresses from all public IP address pools in that location that are assigned. The **Free** number represents the number of public IP addresses from all public IP address pools that have not been assigned and are still available. The **% Used** number represents the number of used or assigned addresses as a percentage of the total number of public IP addresses in all public IP address pools in that location.

## View the public IP addresses that were created by tenant subscriptions
To see a list of public IP addresses that were explicitly created by tenant subscriptions in a specific region, click **Public IP addresses** under **Tenant Resources**.

![Tenant public IP addresses](media/azure-stack-viewing-public-ip-address-consumption/image02.png)

You might notice that some public IP addresses that have been dynamically
allocated appear in the list but do not have an address associated with
them yet. This is because the address resource has been created in the
Network Resource Provider, but not in the Network Controller yet.

The Network Controller does not assign an address to this resource until it
is actually bound to an interface, a network interface card
(NIC), a load balancer, or a virtual network gateway. When the public IP
address is bound to an interface, the Network Controller allocates an IP
address to it, and it appears in the **Address** field.

## View the public IP address information summary table
There are a number of different cases in which public IP addresses are
assigned that determine whether the address appears in one
list or another.

| **Public IP address assignment case** | **Appears in usage summary** | **Appears in tenant public IP addresses list** |
| --- | --- | --- |
| Dynamic public IP address not yet assigned to an NIC or load balancer (temporary) |No |Yes |
| Dynamic public IP address assigned to an NIC or load balancer. |Yes |Yes |
| Static public IP address assigned to a tenant NIC or load balancer. |Yes |Yes |
| Static public IP address assigned to a fabric infrastructure service endpoint. |Yes |No |
| Public IP address implicitly created for IaaS VM instances and used for outbound NAT on the virtual network. These are created behind the scenes whenever a tenant creates a VM instance so that VMs can send information out to the Internet. |Yes |No |

## Next steps
[Manage Storage Accounts in Azure Stack](azure-stack-manage-storage-accounts.md)