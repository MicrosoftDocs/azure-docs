<properties
	pageTitle="Viewing Public IP Address Consumption in TP2 | Microsoft Azure"
	description="Administrators can view the consumption of Public IP Addresses in a Region."
	services="azure-stack"
	documentationCenter=""
	authors="ScottNapolitan"
	manager="darmour"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/26/2016"
	ms.author="scottnap"/>

Viewing Public IP Address Consumption in Azure Stack TP2
========================================================

As a Service Administrator, you can view the number of Public IP
Addresses that have been allocated to tenants, the number of Public IP
Addresses that are still available to be allocated to tenants and the
percentage of Public IP Addresses that have been allocated of the total
in that Location.

The **Public IP Address Usage** tile shows the total number of Public IP
Addresses consumed across all Public IP Address pools on the fabric,
regardless of whether they are used for tenant IaaS VM instances, Fabric
infrastructure services, or Public IP Address resources that were
explicitly created by tenants. The purpose of this tile is to give the
Azure Stack Administrator a sense of the overall number of Public IP
Addresses consumed in this location, so that they can tell whether or
not they are running low on this resource.

The **Public IP Addresses** menu item under **Tenant resources** in the
Settings blade lists only those Public IP Addresses that have been
*explicitly created by tenants*. As such, the number of **Used** Public
IP Addresses on the **Public IP Address Usage** tile will always be
different (larger) than the number on the **Public IP Addresses** tile
under Tenant resources.

Understanding the Public IP Address Usage information
-----------------------------------------------------

To view the total number of Public IP addresses that have been consumed
in the region

1.  In the Azure Stack Portal, click on **Browse** and select **Resource
    Providers**.

2.  Select **Network** **Resource Provider Admin** from the list of
    **Resource Providers**.

3.  Alternately you can click on **Browse** | **Locations** and select
    the location you want to view from the list. Then select **Network**
    from the **Resource Providers** tile.

4.  The Network Resource Provider landing blade will display the
    **Public IP Address Usage** tile in the **Overview** section.

![](media/azure-stack-viewing-public-ip-address-consumption in-tp2/image1.png)

1.  Keep in mind that the **Used** number represents the number of
    Public IP Addresses from all Public IP Address pools in that
    location that are assigned. The **Available** number represents the
    number of Public IP Addresses from all Public IP Address pools that
    have not been assigned and are still available. The % Used
    represents the number of used or assigned addresses as a percentage
    of the total number of Public IP Addresses in all Public IP Address
    pools in that location.

Public IP Addresses list – Tenant Resources
-------------------------------------------

If you want to look at a list of Public IP addresses that were
explicitly created by tenant subscriptions in a Region, you can click on
the **Public IP Addresses** menu item in the **Settings** blade of the
**Network Resource Provider Admin**.

![](media/azure-stack-viewing-public-ip-address-consumption in-tp2/image2.png)

You may notice that some Public IP Addresses that have been dynamically
allocated show up in the list but do not have an address associated with
them yet. This is because the address resource has been created in the
Network Resource Provider, but not in the Network Controller yet. The
Network Controller does not assign an address to this resource until it
is actually bound to an interface, either a Network Interface Card
(NIC), a Load Balancer or a Virtual Network Gateway. When the Public IP
address is bound to an interface, the Network Controller allocates an IP
address to it and it will appear in the **Address** field.

Public IP Address information summary table
-------------------------------------------

There are a number of different cases in which Public IP addresses are
assigned that determine whether or not the address will appear in one
list or another.

 | **Public IP Address assignment case** | **Appears in Usage Summary** | **Appears in Tenant Public IP addresses list** |
 |---------------------------------------|:----------------------------:| :----------------------------------------------:|
 | Dynamic Public IP address not yet assigned to a NIC or Load Balancer (temporary) | No | Yes |
 | Dynamic Public IP address that has been assigned to a NIC or Load Balancer | Yes | Yes |
 | Static Public IP address that has been assigned to a tenant NIC or load balancer | Yes | Yes |
 | Static Public IP Address that has been assigned to a fabric infrastructure service endpoint | Yes | No |
 | Public IP Address implicitly created for IaaS VM instances used for Outbound NAT on the VNET. These are created behind the scenes whenever a tenant creates a VM instance so that VMs can send information out to the Internet. | Yes | No |
