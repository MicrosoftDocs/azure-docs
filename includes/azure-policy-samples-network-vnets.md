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

### Virtual Networks

|  |  |
|---------|---------|
| [Allowed Application Gateway SKUs](../articles/governance/policy/samples/allowed-app-gateway-sku.md) | Requires that application gateways use an approved SKU. You specify an array of approved SKUs. |
| [Allowed vNet Gateway SKUs](../articles/governance/policy/samples/allowed-vnet-gateway-sku.md) | Requires that virtual network gateways use an approved SKU. You specify an array of approved SKUs. |
| [Allowed Load Balancer SKUs](../articles/governance/policy/samples/allowed-load-balancer-skus.md) | Requires that virtual network load balancers use an approved SKU. You specify an array of approved SKUs. |
| [No network peering to Express Route network](../articles/governance/policy/samples/no-peering-express-route-network.md) | Prohibits a network peering from being associated to a network in a specified resource group. Use to prevent connection with central managed network infrastructure. You specify the name of the resource group to prevent association. |
| [No User Defined Route Table](../articles/governance/policy/samples/no-user-defined-route-table.md)  | Prohibits virtual networks from being deployed with a user-defined route table. |
| [NSG X on every subnet](../articles/governance/policy/samples/nsg-on-subnet.md) | Requires that a specific network security group is used with every virtual subnet. You specify the ID of the network security group to use. |
| [Use approved subnet for VM network interfaces](../articles/governance/policy/samples/use-approved-subnet-vm-nics.md) | Requires that network interfaces use an approved subnet. You specify the ID of the approved subnet. |
| [Use approved vNet for VM network interfaces](../articles/governance/policy/samples/use-approved-vnet-vm-nics.md) | Requires that network interfaces use an approved virtual network. You specify the ID of the approved virtual network. |