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
ms.date: 09/26/2016
ms.author: scottnap

---
# View public IP address consumption in Azure Stack TP2
As a cloud administrator, you can view the number of public IP addresses that have been allocated to tenants, the number of public IP addresses that are still available for allocation, and the percentage of public IP addresses that have been allocated in that location.

The **Public IP Address Usage** tile shows the total number of public IP
addresses that have been consumed across all public IP address pools on the fabric, whether
they have been used for tenant IaaS VM instances, fabric
infrastructure services, or public IP address resources that were explicitly created by tenants.

The purpose of this tile is to give Azure Stack administrators a sense of the overall number of public IP
addresses that have been consumed in this location. This helps administrators determine whether
they are running low on this resource.

On the **Settings** blade, the **Public IP Addresses** menu item under **Tenant resources** lists only those public IP addresses that have been
*explicitly created by tenants*. As such, the number of **Used** public
IP addresses on the **Public IP Address Usage** tile is always
different from (larger than) the number on the **Public IP Addresses** tile
under **Tenant resources**.

## View the public IP address usage information
To view the total number of public IP addresses that have been consumed
in the region:

1. In the Azure Stack portal, click **Browse**, and then select **Resource
   Providers**.
2. From the list of **Resource Providers**, select **Network Resource Provider Admin**.
3. Alternately, you can click **Browse | Locations** and select
   the location that you want to view from the list. Then, on the **Resource Providers** tile, select **Network Resource Provider Admin**.
4. The **Network Resource Provider** landing blade displays the
   **Public IP Address Usage** tile in the **Overview** section.

![Network Resource Provider blade](media/azure-stack-viewing-public-ip-address-consumption-in-tp2/image1.png)

Keep in mind that the **Used** number represents the number of public IP addresses from all public IP address pools in that location that are assigned. The **Available** number represents the number of public IP addresses from all public IP address pools that have not been assigned and are still available. The **% Used** number represents the number of used or assigned addresses as a percentage of the total number of public IP addresses in all public IP address
pools in that location.

## View the public IP addresses that were created by tenant subscriptions
To see a list of public IP addresses that were explicitly created by tenant subscriptions in a specific region, go to the **Settings** blade of the
**Network Resource Provider Admin**, and then select **Public IP Addresses**.

![Settings blade of the Network Resource Provider Admin](media/azure-stack-viewing-public-ip-address-consumption-in-tp2/image2.png)

You might notice that some public IP addresses that have been dynamically
allocated appear in the list but do not have an address associated with
them yet. This is because the address resource has been created in the
Network Resource Provider, but not in the Network Controller yet.

The
Network Controller does not assign an address to this resource until it
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

