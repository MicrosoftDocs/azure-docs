---
title: Service Fabric Azure Resource Manager deployment guardrails 
description: This article provides an overview of common mistakes made when deploying a Service Fabric cluster through Azure Resource Manager and how to avoid them. 
services: service-fabric
documentationcenter: .net
author: peterpogorski

ms.topic: conceptual
ms.date: 10/30/2019
ms.author: pepogors
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

## Next steps
* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Troubleshoot Service Fabric: [Troubleshooting guides](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides)
