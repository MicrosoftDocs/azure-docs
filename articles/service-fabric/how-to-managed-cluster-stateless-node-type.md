---
title: Deploy a Service Fabric managed cluster with stateless node types
description: Learn how to create and deploy stateless node types in Service Fabric managed clusters
ms.topic: how-to
ms.date: 2/14/2022
---
# Deploy a Service Fabric managed cluster with stateless node types

Service Fabric node types come with an inherent assumption that at some point of time, stateful services might be placed on the nodes. Stateless node types relax this assumption for a node type. Relaxing this assumption enables node stateless node types to benefit from faster scale-out operations by removing some of the restrictions on repair and maintenance operations.

* Primary node types cannot be configured to be stateless.
* Stateless node types require an API version of **2021-05-01** or later.
* This will automatically set the **multipleplacementgroup** property to **true** which you can [learn more here](how-to-managed-cluster-large-virtual-machine-scale-sets.md).
* This enables support for up to 1000 nodes for the given node type.
* Stateless node types can utilize a VM SKU temporary disk.

Sample templates are available: [Service Fabric Stateless Node types template](https://github.com/Azure-Samples/service-fabric-cluster-templates)

## Enable stateless node types in a Service Fabric managed cluster
To set one or more node types as stateless in a node type resource, set the **isStateless** property to **true**. When deploying a Service Fabric cluster with stateless node types, it is required to have at least one primary node type, which is not stateless in the cluster.

* The Service Fabric managed cluster resource apiVersion should be **2021-05-01** or later.

```json
{
  "apiVersion": "[variables('sfApiVersion')]",
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
  "location": "[resourcegroup().location]",
  "dependsOn": [
    "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
  ],
  "properties": {
    "isStateless": true,
    "isPrimary": false,
    "vmImagePublisher": "[parameters('vmImagePublisher')]",
    "vmImageOffer": "[parameters('vmImageOffer')]",
    "vmImageSku": "[parameters('vmImageSku')]",
    "vmImageVersion": "[parameters('vmImageVersion')]",
    "vmSize": "[parameters('nodeTypeSize')]",
    "vmInstanceCount": "[parameters('nodeTypeVmInstanceCount')]",
    "dataDiskSizeGB": "[parameters('nodeTypeDataDiskSizeGB')]"
  }
}
```

## Configure stateless node types with multiple Availability Zones
To configure a Stateless node type spanning across multiple availability zones follow [Service Fabric clusters across availability zones](.\service-fabric-cross-availability-zones.md). 

>[!NOTE]
> The zonal resiliency property must be set at the cluster level, and this property cannot be changed in place.

## Temporary disk support
Stateless node types can be configured to use temporary disk as the data disk instead of a Managed Disk. Using a temporary disk can reduce costs for stateless workloads. To configure a stateless node type to use the temporary disk set the **useTempDataDisk** property to **true**. 

* Temporary disk size must be 32GB or more. The size of the temporary disk depends on the VM size.
* The temporary disk is not encrypted by server side encryption unless you enable encryption at host.
* The Service Fabric managed cluster resource apiVersion should be **2022-01-01** or later.

```json
{
  "apiVersion": "[variables('sfApiVersion')]",
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
  "location": "[resourcegroup().location]",
  "dependsOn": [
    "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
  ],
  "properties": {
    "isStateless": true,
    "isPrimary": false,
    "vmImagePublisher": "[parameters('vmImagePublisher')]",
    "vmImageOffer": "[parameters('vmImageOffer')]",
    "vmImageSku": "[parameters('vmImageSku')]",
    "vmImageVersion": "[parameters('vmImageVersion')]",
    "vmSize": "[parameters('nodeTypeSize')]",
    "vmInstanceCount": "[parameters('nodeTypeVmInstanceCount')]",
    "useTempDataDisk": true
  }
}
```


## Migrate to using stateless node types in a cluster
For all migration scenarios, a new stateless node type needs to be added. Existing node type cannot be migrated to be stateless. You can add a new stateless node type to an existing Service Fabric managed cluster, and remove any original node types from the cluster. 

## Next steps 

To learn more about Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Service Fabric managed clusters frequently asked questions](./faq-managed-cluster.yml)
