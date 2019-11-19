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
ms.date: 11/19/2019
ms.author: kumud

---
# What is subnet delegation in Azure virtual network?

Subnet delegation is a mechanism, by which the customers can designate a specific subnet for an Azure PaaS service of their choice, that needs to be injected into your virtual network. Subnet delegation provides full control to the customer on managing the integration of Azure services into their virtual networks.

When you delegate a subnet to an Azure service, you are allowing that service to establish some basic network configuration rules for that subnet, which help the Azure Service operate their instances in a stable manner. This might mean that the Azure service establishes some pre or post deployment conditions, such as: 
- whether the service can be deployed in a shared versus dedicated subnet.
- whether the service adds a set of Network Intent Policies post deployment, that are required for the service to work properly.

##  Advantages of subnet delegation

Delegating a subnet to specific services provide the following advantages:

- Subnet delegation can be used to designate a subnet for one or more Azure services and manage the instances in the subnet as per requirements. For example, the virtual network owner can define the following for a delegated subnet to better manage resources & access:
    - Network filtering traffic policies with network security groups.
    - Routing policies with user defined routes.
    - Services integration with Service Endpoints configurations.
- Injected services can better integrate with the virtual network by defining their pre-conditions of deployments in the form of Network Intent Policies. This ensures any actions that can affect functioning of the injected service can be blocked at PUT.


## Who can delegate?
Subnet delegation is an exercise that the virtual network owners need to perform to designate one of the subnets for a specific Azure Service. Azure Service in turn deploys the instances into this subnet for consumption by the customer workloads.

## What subnet delegation can do to your subnet?
Each Azure service defines their own deployment model, where they can define what properties they do or do not support in a delegated subnet for injection purposes:
-  whether an Azure service supports shared subnet with other Azure Services or VM / VMSS in the same subnet, or it only supports a dedicated subnet with only instances of this service in it.
- whether or not an Azure service allows NSG association with the delegated subnet.
- whether or not an NSG associated with the delegated subnet can be associated with any other subnet.
- Whether or not an Azure service allows Route Table association with the delegated subnet.
- Whether or not a Route table associated with the delegated subnet can be associated with any other subnet.
- An Azure service can dictate the minimum number of IP Addresses in the delegated subnet.
- An Azure service can dictate the IP Address space in the delegated subnet to be from Private IP Address space (10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12).
- It can dictate that the Custom DNS configuration have an Azure DNS entry.
- Injected services can also add their own:
    - Security policies - Collection of security rules required for a given service to work.
    - Route policies – collection of routes required for a given service to work.

## What subnet delegation cannot do to your subnet?

The Azure services being injected into a delegated subnet still has the basic set of properties as available for non-delegated subnets, such as:
-  Azure services can inject instances into customer subnets, but cannot impact the existing workloads.
-  The policies or routes that these services apply are flexible and can be overridden by the customer.

## Next steps

- [Delegate a subnet](manage-subnet-delegation.md)
