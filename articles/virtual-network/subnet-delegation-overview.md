---
title: What is subnet delegation in Azure virtual network?
description: Learn about subnet delegation in Azure virtual network
services: virtual-network
documentationcenter: na
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/20/2019
ms.author: kumud

---
# What is subnet delegation?

Subnet delegation enables you to designate a specific subnet for an Azure PaaS service of your choice that needs to be injected into your virtual network. Subnet delegation provides full control to the customer on managing the integration of Azure services into their virtual networks.

When you delegate a subnet to an Azure service, you allow that service to establish some basic network configuration rules for that subnet, which help the Azure service operate their instances in a stable manner. As a result, the Azure service may establish some pre or post deployment conditions, such as:
- deploy the service in a shared versus dedicated subnet.
- add to the service a set of Network Intent Policies post deployment that is required for the service to work properly.

##  Advantages of subnet delegation

Delegating a subnet to specific services provides the following advantages:

- helps to designate a subnet for one or more Azure services and manage the instances in the subnet as per requirements. For example, the virtual network owner can define the following for a delegated subnet to better manage resources and access as follows:
    - network filtering traffic policies with network security groups.
    - routing policies with user-defined routes.
    - services integration with service endpoints configurations.
- helps injected services to better integrate with the virtual network by defining their pre-conditions of deployments in the form of Network Intent Policies. This ensures any actions that can affect functioning of the injected service can be blocked at PUT.


## Who can delegate?
Subnet delegation is an exercise that the virtual network owners need to perform to designate one of the subnets for a specific Azure Service. Azure Service in turn deploys the instances into this subnet for consumption by the customer workloads.

## Impact of subnet delegation on your subnet
Each Azure service defines their own deployment model, where they can define what properties they do or do not support in a delegated subnet for injection purposes, such as follows:
- shared subnet with other Azure Services or VM / virtual machine scale set in the same subnet, or it only supports a dedicated subnet with only instances of this service in it.
- supports NSG association with the delegated subnet.
- supports NSG associated with the delegated subnet can be also associated with any other subnet.
- allows route table association with the delegated subnet.
- allows the route table associated with the delegated subnet to be associated with any other subnet.
- dictates the minimum number of IP Addresses in the delegated subnet.
- dictates the IP Address space in the delegated subnet to be from Private IP Address space (10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12).
- dictates that the custom DNS configuration has an Azure DNS entry.

Injected services can also add their own policies as follows:
- **Security policies**: Collection of security rules required for a given service to work.
- **Route policies**: Collection of routes required for a given service to work.

## What subnet delegation does not do

The Azure services being injected into a delegated subnet still have the basic set of properties that are available for non-delegated subnets, such as:
-  Azure services can inject instances into customer subnets, but cannot impact the existing workloads.
-  The policies or routes that these services apply are flexible and can be overridden by the customer.

## Next steps

- [Delegate a subnet](manage-subnet-delegation.md)
