---
title: Default Outbound Access in Azure
titleSuffix: Azure Virtual Network
description: Learn about default outbound access in Azure.
services: virtual-network
author: anavinahar
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 07/13/2021
ms.author: anavin
---

# Default Outbound Access

## What is Default Outbound Access?
In Azure, VMs (without explicit outbound connectivity defined) created in a VNet prior are assigned a default outbound Public IP address. This IP address enables outbound connectivity from these resources to the Internet. This is known as Default Outbound Access. 

> [!NOTE]
> Examples of explicit outbound connectivity are VMs created within a subnet associated to a NAT Gateway, VMs in the backend pool of Standrd Load Balancer, Basic Public Load Balancer, VMs with Public IP addresses exlicitly associated to them, etc.

## How is Default Outbound Access provided?
The Public IPv4 address used for this is called the Default Outbound Access IP.
This IP is implicit and belongs to Microsoft. Further, this IP address is subject to change and it is not recommended to depend on it for production workloads.

## When is Default Outbound Access provided?
If you deploy a VM in Azure and it does not have a Public IP on the NIC, or a NAT Gateway on the subnet it as deployed in or a Standard Public Load Balancer associated with it, it gets assigned a Default Outbound Access IP.

## Why is turning default outbound access off recommended?
- Secure by default: Per the secure by default principle in zero trust network security, it is not recommended to open to the internet by default. 

- Explicit vs implicit: When it comes to access to resources in your virtual network, it is always to recommended to hve explicit methods of connectivity instead of implicit.

- Loss of IP address: Since this IP is not owned by customers and is subject to change, any dependency on this IP could cause issues in future.

## How can I turn default outbound access off?
There are multiple ways to turn off default outbound access:
1.	Add an explicit outbound connectivity method
    * Associate a NAT Gateway to the subnet your VM resides in 
    * Associate a Standard Load Balancer with Outbound Rules configured
    * Associate a Public IP to the virtual machine's network interfcer
2.	Leverage VMSS Flex
    * VMSS Flex is secure by default as a result, any instances created via Flex will not have this default outbound access IP associated to it

## If I need outbound access, what is the recommended way?
NAT Gateway is the recommended approach to have explicit outbound connectivity when needed. 
Another option could be leveraging your Firewall for outbound connectivity

## Limitations
* Connectivity maybe needed for Windows Updates, etc.
* Default Outbound Access IP does not support fragmented packets. 
