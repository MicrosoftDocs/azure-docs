---
title: Create virtual network resources by using Bicep
description: Describes how to create virtual networks, network security groups. and route tables by using Bicep.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.date: 11/10/2021
---
# Create virtual network resources by using Bicep

Many Azure deployments require networking resources to be deployed and configured. You can use Bicep to define your Azure networking resources.

## Virtual networks and subnets

Define your virtual networks by creating a resource with the type `Microsoft.Network/virtualNetworks`.

Virtual networks contain subnets, which are logical groups of IP addresses within the virtual network. There are two ways to define subnets in Bicep: by using the `subnets` property on the virtual network resource, and by creating a [child resource](child-resource-name-type.md) with type `Microsoft.Network/virtualNetworks/subnets`. We generally advise defining your subnets within the virtual network definition, as in this example:

::: code language="bicep" source="code/scenarios-virtual-networks/vnet.bicep" range="5-29" :::
<!-- TODO move to correct repo -->

Although both approaches enable you to define and create your subnets, there is an important difference to be aware of. When you define subnets by using child resources, the first time your Bicep file is deployed, the virtual network is deployed. Then, after the virtual network deployment is complete, each subnet is deployed. This sequencing occurs because Azure Resource Manager deploys each individual resource separately.

When you redeploy the same Bicep file, the same deployment sequence occurs. However, the virtual network is deployed without any subnets configured on it. Then, after the virtual network is reconfigured, the subnet resources are redeployed, which re-establishes each subnet. In some situations, this behavior causes the resources within your virtual network to lose connectivity for a short period of time during your deployment. In other situations, Azure prevents you from modifying the virtual network and your deployment fails.

## Network security groups

TODO shared variable file

## Private endpoints

Need to authorize cross-sub endpoints by using an operation. Can use a deployment script, or do it outside of your Bicep file

## Other networking resources

You can define almost all of your Azure networking resources in Bicep. TODO is there a list somewhere

## Related resources

- Resource documentation
  - [`Microsoft.Network/virtualNetworks`](/azure/templates/microsoft.network/virtualNetworks?tabs=bicep)
- [Child resources](child-resource-name-type.md)
