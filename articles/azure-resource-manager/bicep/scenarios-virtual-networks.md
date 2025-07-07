---
title: Create virtual network resources by using Bicep
description: Describes how to create virtual networks, network security groups, and route tables by using Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 04/25/2025
---

# Create virtual network resources by using Bicep

Many Azure deployments require networking resources to be deployed and configured. You can use Bicep to define your Azure networking resources.

## Virtual networks and subnets

Define your virtual networks by creating a resource with the type [`Microsoft.Network/virtualNetworks`](/azure/templates/microsoft.network/virtualnetworks?tabs=bicep).

### Configure subnets by using the subnets property

Virtual networks contain subnets, which are logical groupings of IP addresses within the network. Subnets should always be managed as child resources, and the **subnets** property should never be defined within the virtual network resource. This approach ensures a safe and independent lifecycle for both resource types.

> [!NOTE]
> The Azure Virtual Network API is updated to allow modifications to virtual networks without requiring the inclusion of the subnet property in PUT requests. Previously, omitting the subnet property would result in the deletion of existing subnets. With the new behavior, if the subnet property isn't included in a PUT request, the existing subnets remain unchanged. Explicitly setting the subnet property to an empty value deletes all existing subnets, while providing specific subnet configurations creates or updates subnets accordingly. This change simplifies virtual network management by preventing unintended subnet deletions during updates. For more information, see [Azure Virtual Network now supports updates without subnet property](https://techcommunity.microsoft.com/blog/azurenetworkingblog/azure-virtual-network-now-supports-updates-without-subnet-property/4067952).

It's best to define your subnets as [child resources](./child-resource-name-type.md#within-parent-resource), as in this example:

```bicep
param location string = resourceGroup().location

var virtualNetworkName = 'my-vnet'
var subnet1Name = 'Subnet-1'
var subnet2Name = 'Subnet-2'

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2024-05-01' = {
  name: virtualNetworkName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
  }

  resource subnet1 'subnets' = {
    name: subnet1Name
    properties: {
      addressPrefix: '10.0.0.0/24'
    }  }

  resource subnet2 'subnets' = {
    name: subnet2Name
    properties: {
      addressPrefix: '10.0.1.0/24'
    }    
  }
}

output subnet1ResourceId string = virtualNetwork::subnet1.id
output subnet2ResourceId string = virtualNetwork::subnet2.id
```

To reference a nested resource outside the parent resource, it must be qualified with the containing resource name and the :: operator as shown in the preceding example.

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
