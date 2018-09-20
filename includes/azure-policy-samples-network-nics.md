---
title: include file
description: include file
services: azure-policy
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 09/18/2018
ms.author: dacoulte
ms.custom: include file
---

### Network Interfaces

|  |  |
|---------|---------|
| [NSG X on every NIC](../articles/governance/policy/samples/nsg-on-nic.md) | Requires that a specific network security group is used with every virtual network interface. You specify the ID of the network security group to use. |
| [Use approved subnet for VM network interfaces](../articles/governance/policy/samples/use-approved-subnet-vm-nics.md) | Requires that network interfaces use an approved subnet. You specify the ID of the approved subnet. |
| [Use approved vNet for VM network interfaces](../articles/governance/policy/samples/use-approved-vnet-vm-nics.md) | Requires that network interfaces use an approved virtual network. You specify the ID of the approved virtual network. |