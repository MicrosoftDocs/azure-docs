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
In Azure, VMs (without explicit outbound connectivity defined) created in a VNet prior to API version 2020-05-01, are assigned a default outbound Public IP address. This IP address enables outbound connectivity from these resources to the Internet. This is known as Default Outbound Access. 

> [!NOTE]
> Examples of explicit outbound connectivity are VMs created within a subnet associated to a NAT Gateway, VMs in the backend pool of Standrd Load Balancer, Basic Public Load Balancer, VMs with Public IP addresses exlicitly associated to them, etc.

Based on the **secure by default** approach in zero trust network security, it is not recommended to have such an implicit IP as this IP cannot be locked down via Network Security Groups (NSGs). As a result, starting with API version 2020-05-01, Azure provides a way to turn off this default outbound access at the subnet level.


## How is Default Outbound Access provided?
The Public IPv4 address used for this is called the Default Outbound Access IP.
This IP is implicit and belongs to Microsoft. Further, this IP address is subject to change and it is not recommended to depend on it for production workloads.

## When is Default Outbound Access provided?
If you deploy a VM in Azure and it does not have a Public IP on the NIC, or a NAT Gateway on the subnet it as deployed in or a Standard Public Load Balancer associated with it, it gets assigned a Default Outbound Access IP.

## Why is turning default outbound access off recommended?
### Secure by default

### Explicit vs implicit

### NSGs

### Loss of IP address

### SNAT port exhaustion

## How can I turn default outbound access off?
There are multiple ways to turn off default outbound access:
1.	Add an explicit outbound connectivity method
    * Associate a NAT Gateway to the subnet your VM resides in 
    * Associate a Standard Load Balancer with Outbound Rules configured
    * Associate a Public IP to the virtual machine's network interfcer
2.	Leverage VMSS Flex
    * VMSS Flex is secure by default as a result, any instances created via Flex will not have this default outbound access IP associated to it
3.	If creating a new subnet, use API version 2021-05-01 or above and turn off the default outbound access property.
    * A subnet with Default Outbound Access set to false is known as a private subnet

## If I need outbound access, what is the recommended way?
NAT Gateway is the recommended approach to have explicit outbound connectivity when needed. 
Another option could be leveraging your Firewall for outbound connectivity

## Limitations
* Only upon creation of subnet, cannot be changed after
* Connectivity maybe needed for Windows Updates, etc.
* Default Outbound Access IP does not support fragmented packets. 
* API version 2021-05-01 is expected to go live in October 2021
* Subnets created with prior API versions are not able to turn this proerty off at this time

## Next steps
* Create a private subnet
