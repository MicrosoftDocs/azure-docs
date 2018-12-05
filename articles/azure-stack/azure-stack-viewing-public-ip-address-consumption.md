---
title: View public IP address consumption in Azure Stack | Microsoft Docs
description: Administrators can view the consumption of public IP addresses in a region
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/10/2018
ms.author: mabrigg

---
# View public IP address consumption in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

As a cloud administrator, you can view:
 - The number of public IP addresses that have been allocated to tenants.
 - The number of public IP addresses that are still available for allocation.
 - The percentage of public IP addresses that have been allocated in that location.

The **Public IP pools usage** tile shows the number of public IP addresses consumed across public IP address pools. For each IP address, the tile shows usage for tenant IaaS VM instances, fabric infrastructure services, and public IP address resources that were explicitly created by tenants.

The purpose of the tile is to give Azure Stack operators a sense of the number of public IP
addresses used in this location. The number helps administrators determine whether
they are running low on this resource.

The **Public IP addresses** menu item under **Tenant Resources** lists only those public IP addresses that have been *explicitly created by tenants*. You can find the menu item on the **Resource providers**, **Network** pane. The number of **Used** public IP addresses on the **Public IP pools usage** tile is always different from (larger than) the number on the **Public IP Addresses** tile
under **Tenant Resources**.

## View the public IP address usage information
To view the total number of public IP addresses that have been consumed
in the region:

1. In the Azure Stack administrator portal, select **All services**. Then, under the **ADMINISTRATION** category select **Network**.
1. The **Network** pane displays the **Public IP pools usage** tile in the **Overview** section.

![Network Resource Provider pane](media/azure-stack-viewing-public-ip-address-consumption/image01.png)

The **Used** number represents the number of assigned public IP addresses from public IP address pools. The **Free** number represents the number of public IP addresses from public IP address pools that have not been assigned and are still available. The **% Used** number represents the number of used or assigned addresses as a percentage of the total number of public IP addresses in public IP address pools in that location.

## View the public IP addresses that were created by tenant subscriptions
Select **Public IP addresses** under **Tenant Resources**. Review the list of public IP addresses explicitly created by tenant subscriptions in a specific region.

![Tenant public IP addresses](media/azure-stack-viewing-public-ip-address-consumption/image02.png)

You might notice that some public IP addresses that have been dynamically allocated appear in the list. However, an address hasn't been associated with them yet. The address resource has been created in the Network Resource Provider, but not yet in the Network Controller.

The Network Controller does not assign an address to the resource until it
binds to an interface, a network interface card
(NIC), a load balancer, or a virtual network gateway. When the public IP
address binds to an interface, the Network Controller allocates an IP
address. The address appears in the **Address** field.

## View the public IP address information summary table
In different cases, public IP addresses are
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