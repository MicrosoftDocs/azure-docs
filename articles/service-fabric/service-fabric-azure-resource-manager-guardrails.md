---
title: Service Fabric Azure Resource Manager deployment guardrails 
description: This article provides an overview of common mistakes made when deploying a Service Fabric cluster through Azure Resource Manager and how to avoid them. 
documentationcenter: .net
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-arm-template
services: service-fabric
ms.date: 07/14/2022
---

# Service Fabric guardrails 
When deploying a Service Fabric cluster, guardrails are put in place, which will fail an Azure Resource Manager deployment in the case of an invalid cluster configuration. The following sections provide an overview of common cluster configuration issues and the steps required to mitigate these issues. 

## Durability mismatch
### Overview
The durability value for a Service Fabric node type is defined in two different sections of an Azure Resource Manager template. The Virtual Machine Scale Set extension section of the Virtual Machine Scale Set resource, and the Node Type section of the Service Fabric cluster resource. It is a requirement that the durability value in these sections match, otherwise the resource deployment will fail.

The following section contains an example of a durability mismatch between the Virtual Machine Scale Set extension durability setting and the Service Fabric Node Type durability setting:  

**Virtual Machine Scale Set durability setting**
```json 
{
  "extensions": [
    {
      "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
      "properties": {
        "type": "ServiceFabricNode",
        "publisher": "Microsoft.Azure.ServiceFabric",
        "settings": {
          "durabilityLevel": "Silver",
        }
      }
    }
  ]
}
```

**Service Fabric node type durability setting** 
```json
{
  "nodeTypes": [
    {
      "name": "[variables('vmNodeType0Name')]",
      "durabilityLevel": "Bronze",
      "isPrimary": true,
      "vmInstanceCount": "[parameters('nt0InstanceCount')]"
    }
  ]
}
```

### Error messages
* Virtual Machine Scale Set durability mismatch does not match the current Service Fabric Node Type durability level
* Virtual Machine Scale Set durability does not match the target Service Fabric Node Type durability level
* Virtual Machine Scale Set durability does match the current Service Fabric durability level or the target Service Fabric Node Type durability level 

### Mitigation
To fix a durability mismatch, which is indicated by any of the above error messages:
1. Update the durability level in either the Virtual Machine Scale Set extension or Service Fabric Node Type section of the Azure Resource Manager template to ensure that the values match.
2. Redeploy the Azure Resource Manager template with the updated values.


## Seed node deletion 
### Overview
A Service Fabric cluster has a [reliability tier](./service-fabric-cluster-capacity.md#reliability-characteristics-of-the-cluster) property which is used to determine the number of replicas of system services that run on the primary node type of the cluster. The number of required replicas will determine the minimum number of nodes that must be maintained in the primary node type of the cluster. If the number of nodes in the primary node type goes below the required minimum for the reliability tier, the cluster will become unstable.  

### Error messages 
Seed node removal operation has been detected, and will be rejected. 
* This operation would result in only {0} potential seed nodes to remain in the cluster, while {1} are needed as a minimum.
* Removing {0} seed nodes out of {1} would result in the cluster going down due to loss of seed node quorum. Maximum number of seed nodes that can be removed at a time is {2}.
 
### Mitigation 
Ensure that your primary node type has enough Virtual Machines for the reliability specified on your cluster. You will not be able to remove a Virtual Machine if it will bring the Virtual Machine Scale Set below the minimum number of nodes for the given reliability tier.
* If the reliability tier is correctly specified, make sure that you have enough nodes in the primary node type as needed for the reliability tier. 
* If the reliability tier is incorrect, initiate a change on the Service Fabric resource to lower the reliability level first before initiating any Virtual Machine Scale Set operations, and wait for it to complete.
* If the reliability tier is Bronze, please follow these [steps](./service-fabric-cluster-scale-in-out.md#manually-remove-vms-from-a-node-typevirtual-machine-scale-set) to scale in your cluster gracefully.

## Next steps
* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Troubleshoot Service Fabric: [Troubleshooting guides](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides)
