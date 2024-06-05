---
title: Deploy a Service Fabric managed cluster with a subnet per NodeType
description: This article provides the configuration necessary to deploy a Service Fabric managed cluster with different subnets per secondary NodeType.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 05/17/2024
---

# Deploy a Service Fabric managed cluster with a subnet per NodeType

Service Fabric managed clusters now supports different subnets per secondary NodeType in a [Bring-Your-Own-Virtual-Network scenario](how-to-managed-cluster-networking.md#bring-your-own-virtual-network). With different subnets per NodeType, customers can have specific applications deployed to specific subnets and utilize traffic management via Network Security Group (NSG) rules. Customers can expect increased network isolation for their deployments through this configuration.

## Prerequisites

Configure your managed cluster's network properly for your scenario. You can use subnets per NodeType in a Bring-Your-Own-Virtual-Network scenario. You can additionally bring your own Azure Load Balancer, if necessary. Following the appropriate steps for your cluster:
* [Bring-Your-Own-Virtual-Network scenario](how-to-managed-cluster-networking.md#bring-your-own-virtual-network)
* [Bring-Your-Own-Azure-Load-Balancer scenario](how-to-managed-cluster-networking.md#bring-your-own-azure-load-balancer)

Subnet per NodeType only works for Service Fabric API version `2022-10-01 preview` or later.

## Considerations and limitations

* **Only secondary NodeTypes** can support subnet per NodeType.
* For existing clusters in a Bring-Your-Own-Virtual-Network configuration with a `subnetId` specified, enabling subnet per NodeType overrides the existing value for the current NodeType.
* For new clusters, customers need to specify `useCustomVNet : true` at the cluster level. This setting indicates that the cluster uses Bring-Your-Own-Virtual-Network but that the subnet is specified at the NodeType level. For such clusters, a virtual network isn't created in the managed resource group. For such clusters, the `subnetId` property is required for NodeTypes.

## Include the subnetId property in your ARM template

When you create a new NodeType, you need to modify your ARM template with the new `subnetId` property.

```json
{
  "apiVersion": "2022-10-01-preview",
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
  "location": "[parameters('clusterLocation')]",
  "dependsOn": [
    "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
  ],
  "properties": {
    "isPrimary": false,
    "subnetId": "[parameters('nodeTypeSubnetId')]",
    "dataDiskSizeGB": "[parameters('dataDiskSizeGB')]",
    "vmImagePublisher": "[parameters('vmImagePublisher')]",
    "vmImageOffer": "[parameters('vmImageOffer')]",
    "vmImageSku": "[parameters('vmImageSku')]",
    "vmImageVersion": "[parameters('vmImageVersion')]",
    "vmSize": "[parameters('vmSize')]",
    "vmInstanceCount": "[parameters('vmInstanceCount')]"
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy a Service Fabric managed cluster via ARM template](quickstart-managed-cluster-template.md)
> [Configure network settings for Service Fabric managed clusters](how-to-managed-cluster-networking.md)