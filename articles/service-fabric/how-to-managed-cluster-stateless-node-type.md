---
title: Deploy a Service Fabric managed cluster with stateless node types
description: Learn how to create and deploy stateless node types in Service Fabric managed clusters
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Deploy a Service Fabric managed cluster with stateless node types

Service Fabric node types come with an inherent assumption that at some point of time, stateful services might be placed on the nodes. Stateless node types change this assumption for a node type. This allows the node type to benefit from features such as faster scale-out operations, support for Automatic OS Upgrades, Spot VMs, and scaling out to more than 100 nodes in a node type.

* Primary node types can't be configured to be stateless.
* Stateless node types require an API version of **2021-05-01** or later.
* This will automatically set the **multipleplacementgroup** property to **true** which you can [learn more about here](how-to-managed-cluster-large-virtual-machine-scale-sets.md).
* This enables support for up to 1000 nodes for the given node type.
* Stateless node types can utilize a VM SKU temporary disk.

## Enabling stateless node types in a Service Fabric managed cluster

To set one or more node types as stateless in a node type resource, set the **isStateless** property to **true**. When deploying a Service Fabric cluster with stateless node types, it's required to have at least one primary node type, which is not stateless in the cluster.

Sample templates are available: [Service Fabric Stateless Node types template](https://github.com/Azure-Samples/service-fabric-cluster-templates)

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

## Enabling stateless node types using Spot VMs in a Service Fabric managed cluster (Preview)

[Azure Spot Virtual Machines on scale sets](../virtual-machine-scale-sets/use-spot.md) enables users to take advantage of unused compute capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict these Azure Spot Virtual Machine instances. Therefore, Spot VM node types are great for workloads that can handle interruptions and don't need to be completed within a specific time frame. Recommended workloads include development, testing, batch processing jobs, big data, or other large-scale stateless scenarios.

To set one or more stateless node types to use Spot VM, set both **isStateless** and **IsSpotVM** properties to true. When deploying a Service Fabric cluster with stateless node types, it's required to have at least one primary node type, which is not stateless in the cluster. Stateless node types configured to use Spot VMs have Eviction Policy set to 'Delete' by default. Customers can configure the 'evictionPolicy' to be 'Delete' or 'Deallocate' but this can only be defined at the time of nodetype creation.

Sample templates are available: [Service Fabric Spot Node types template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Spot)

* The Service Fabric managed cluster resource apiVersion should be **2022-06-01-preview** or later.

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
    "IsSpotVM": true,
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

## Enabling Spot VMs with Try & Restore

This configuration enables the platform to automatically try to restore the evicted Spot VMs. Refer to the virtual machine scale set doc for [details](../virtual-machine-scale-sets/use-spot.md#try--restore).
This configuration can only be enabled on new Spot nodetypes by specifying the **spotRestoreTimeout**, which is an ISO 8601 time duration having a value between 30 & 2880 mins. The platform will try to restore the VMs for this duration, after eviction.

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
    "IsSpotVM": true,
    "evictionPolicy": "deallocate",
    "spotRestoreTimeout": "PT30M",
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

## Configure stateless node types for zone resiliency
To configure a Stateless node type for zone resiliency you must [configure managed cluster zone spanning](how-to-managed-cluster-availability-zones.md) at the cluster level. 

>[!NOTE]
> The zonal resiliency property must be set at the cluster level, and this property can't be changed in place.

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
For all migration scenarios, a new stateless node type needs to be added. An existing node type can't be migrated to be stateless. You can add a new stateless node type to an existing Service Fabric managed cluster, and remove any original node types from the cluster. 

## Next steps 

To learn more about Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Service Fabric managed clusters frequently asked questions](./faq-managed-cluster.yml)
