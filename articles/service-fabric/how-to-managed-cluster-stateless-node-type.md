---
title: Deploy a Service Fabric managed cluster with stateless node types
description: Learn how to create and deploy stateless node types in Service Fabric managed clusters
ms.topic: how-to
ms.date: 5/10/2021
---
# Deploy a Service Fabric managed cluster with stateless node types

Service Fabric node types come with an inherent assumption that at some point of time, stateful services might be placed on the nodes. Stateless node types relax this assumption for a node type. Relaxing this assumption enables node stateless node types to benefit from faster scale-out operations by removing some of the restrictions on repair and maintenance operations.

* Primary node types cannot be configured to be stateless
* Stateless node types require an API version of **2021-05-01** or later


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
}
```

## Configure stateless node types with multiple Availability Zones
To configure a Stateless node type spanning across multiple availability zones follow [Service Fabric clusters across availability zones](.\service-fabric-cross-availability-zones.md). 

>[!NOTE]
> The zonal resiliency property must be set at the cluster level, and this property cannot be changed in place.

## Migrate to using stateless node types in a cluster
For all migration scenarios, a new stateless node type needs to be added. Existing node type cannot be migrated to be stateless. You can add a new stateless node type to an existing Service Fabric managed cluster, and remove any original node types from the cluster. 

## Next steps 

To learn more about Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Service Fabric managed clusters frequently asked questions](./faq-managed-cluster.yml)