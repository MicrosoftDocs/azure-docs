---
title: Scale to zero nodes for Service Fabric managed clusters
description: Learn how to scale your Service Fabric managed clusters to zero nodes for cost saving during downtime.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 05/24/2024
---

# Scale to zero nodes for Service Fabric managed clusters

The scale to zero feature allows customers to create clusters that have one or more node types with zero nodes. Customers who have test clusters that do not need nodes on an ongoing basis will benefit from lower cost by scaling down to zero. Also, customers who wish to prep their cluster with all necessary configuration before adding nodes will benefit from scale to zero.

## Limitations

* Scaling to zero only work for **secondary node types**.

## Scale to zero in your ARM template

You can modify the `vmInstanceCount` property to scale your managed cluster to zero nodes:

```json
{  
  "apiVersion": "2024-06-01-preview",  
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",  
  "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",  
  "location": "[parameters('clusterLocation')]",  
  "dependsOn": [  
    "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"  
  ],  
  "properties": {  
    "isPrimary": false,  
    "dataDiskSizeGB": "[parameters('dataDiskSizeGB')]",  
    "vmImagePublisher": "[parameters('vmImagePublisher')]",  
    "vmImageOffer": "[parameters('vmImageOffer')]",  
    "vmImageSku": "[parameters('vmImageSku')]",  
    "vmImageVersion": "[parameters('vmImageVersion')]",  
    "vmSize": "[parameters('vmSize')]",  
    "vmInstanceCount": 0  
  }  
} 
```

## Next steps

* [Customize your Service Fabric managed cluster configuration](how-to-managed-cluster-configuration.md)
* [Configure autoscaling on your Service Fabric managed cluster](how-to-managed-cluster-autoscale.md)
