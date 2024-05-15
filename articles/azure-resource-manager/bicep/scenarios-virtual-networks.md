---
title: Create virtual network resources by using Bicep
description: Describes how to create virtual networks, network security groups, and route tables by using Bicep.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Create virtual network resources by using Bicep

Many Azure deployments require networking resources to be deployed and configured. You can use Bicep to define your Azure networking resources.

## Virtual networks and subnets

Define your virtual networks by creating a resource with the type [`Microsoft.Network/virtualNetworks`](/azure/templates/microsoft.network/virtualnetworks?tabs=bicep).

### Configure subnets by using the subnets property

Virtual networks contain subnets, which are logical groups of IP addresses within the virtual network. There are two ways to define subnets in Bicep: by using the `subnets` property on the virtual network resource, and by creating a [child resource](child-resource-name-type.md) with type `Microsoft.Network/virtualNetworks/subnets`.

> [!WARNING]
> Avoid defining subnets as child resources. This approach can result in downtime for your resources during subsequent deployments, or failed deployments.

It's best to define your subnets within the virtual network definition, as in this example:

> The following example is part of a larger example. For a Bicep file that you can deploy, [see the complete file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/scenarios-virtual-networks/vnet.bicep).

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-virtual-networks/vnet.bicep" range="7-30, 39" :::

Although both approaches enable you to define and create your subnets, there is an important difference. When you define subnets by using child resources, the first time your Bicep file is deployed, the virtual network is deployed. Then, after the virtual network deployment is complete, each subnet is deployed. This sequencing occurs because Azure Resource Manager deploys each individual resource separately.

When you redeploy the same Bicep file, the same deployment sequence occurs. However, the virtual network is deployed without any subnets configured on it because the `subnets` property is effectively empty. Then, after the virtual network is reconfigured, the subnet resources are redeployed, which re-establishes each subnet. In some situations, this behavior causes the resources within your virtual network to lose connectivity during your deployment. In other situations, Azure prevents you from modifying the virtual network and your deployment fails.

### Access subnet resource IDs

You often need to refer to a subnet's resource ID. When you use the `subnets` property to define your subnet, [you can use the `existing` keyword](existing-resource.md) to also obtain a strongly typed reference to the subnet, and then access the subnet's `id` property:

> The following example is part of a larger example. For a Bicep file that you can deploy, [see the complete file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/scenarios-virtual-networks/vnet.bicep).

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-virtual-networks/vnet.bicep" range="7-42" highlight="26-28, 30-32, 35-36" :::

Because this example uses the `existing` keyword to access the subnet resource, instead of defining the complete subnet resource, it doesn't have the risks outlined in the previous section.

You can also combine the `existing` and `scope` keywords to refer to a virtual network or subnet resource in another resource group.

## Network security groups

Network security groups are frequently used to apply rules controlling the inbound and outbound flow of traffic from a subnet or network interface. It can become cumbersome to define large numbers of rules within a Bicep file, and to share rules across multiple Bicep files. Consider using the [Shared variable file pattern](patterns-shared-variable-file.md) when you work with complex or large network security groups.

## Private endpoints

Private endpoints [must be approved](../../private-link/manage-private-endpoint.md). In some situations, approval happens automatically. But in other scenarios, you need to approve the endpoint before it's usable.

Private endpoint approval is an operation, so you can't perform it directly within your Bicep code. However, you can use a [deployment script](../templates/deployment-script-template.md) to invoke the operation. Alternatively, you can invoke the operation outside of your Bicep file, such as in a pipeline script.

## Related resources

- Resource documentation
  - [`Microsoft.Network/virtualNetworks`](/azure/templates/microsoft.network/virtualNetworks?tabs=bicep)
  - [`Microsoft.Network/networkSecurityGroups`](/azure/templates/microsoft.network/networksecuritygroups?tabs=bicep)
- [Child resources](child-resource-name-type.md)
- Quickstart templates
  - [Create a Virtual Network with two Subnets](https://azure.microsoft.com/resources/templates/vnet-two-subnets/)
  - [Virtual Network with diagnostic logs](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/vnet-create-with-diagnostic-logs)
 
