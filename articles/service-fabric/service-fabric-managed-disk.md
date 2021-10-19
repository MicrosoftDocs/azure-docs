---
title: Deploy Service fabric node-types with Managed Disk support
description: Learn how to create and deploy Service fabric node-types with Managed data disks attached
author: micraft

ms.topic: conceptual
ms.date: 10/19/2021
ms.author: micraft

---

# Deploy an Azure Service Fabric cluster node-type with Managed data disks

Service Fabric node types  generally use the temporary disk attached with the underlying virtual machine scale set for its purposes.  However, for higher resiliency and data storage requirements customers might want to use  Managed data disks as the  dataPath for the node-type.  The following document provides steps to leverage native support from Service fabric to use and configure Managed data disks as default data Path. Using this, Service Fabric will automatically take care of formatting the disk drive, mounting it to correct location, and using it. It also takes care of situations where VM's or the virutal machine scale set is Reimaged.

* Minimum size requirements for the managed data disk still remains to to atleast 50GB.
* In scenarios where more than 1 managed data disk is attached, customer needs to manage the data disks on their own.

Sample templates are available: [Service Fabric template to support Managed disks ](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/10-VM-2-NodeTypes-Windows-Stateless-Secure)

## Configuring virtual machine scale set to use managed data disks in Service fabric
To enable using managed data disks in node types, you should configure the underlying virtual machine scale set resource in the following way:

* Add a managed disk in the data disks section of the ARM template for the virtual machine scale set. 
* Update the Service fabric extension with following settings: 
    * For Windows - **useManagedDataDisk: true** and **dataPath: 'K:\\\\SvcFab'** .  Note, the drive letter "K" is just a representation, it can be any drive Letter lexicographically greater than all the drive Letter present in the virtual machine scale set SKU.
    * For Linux - **useManagedDataDisk:true** and **dataPath: '\mnt\sfdataroot'** .


Service Fabric Extension ARM template
```json
{
    "virtualMachineProfile": {
        "extensionProfile": {
            "extensions": [
                {
                    "name": "[concat(parameters('vmNodeType1Name'),'_ServiceFabricNode')]",
                    "properties": {
                        "type": "ServiceFabricNode",
                        "autoUpgradeMinorVersion": false,
                        "publisher": "Microsoft.Azure.ServiceFabric",
                        "settings": {
                            "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
                            "nodeTypeRef": "[parameters('vmNodeType1Name')]",
                            "dataPath": "K:\\\\SvcFab",
                            "useManagedDataDisk": true,
                            "durabilityLevel": "Bronze",
                            "certificate": {
                                "thumbprint": "[parameters('certificateThumbprint')]",
                                "x509StoreName": "[parameters('certificateStoreValue')]"
                            },
                            "systemLogUploadSettings": {
                                "Enabled": true
                            },
                        },
                        "typeHandlerVersion": "1.1"
                    }
                },
            ]
        },
        "storageProfile": 
        {
            "datadisks": [
                {
                    "lun": "1",
                    "createOption": "empty",
                    "diskSizeGB": "100",
                    "managedDisk": { "storageAccountType": "[parameters('storageAccountType')]" }
                }
            ]
        }
    }
}
```

## Migrate to using Stateless node types in a cluster
For all migration scenarios, a new stateless-only node type needs to be added. Existing node type cannot be migrated to be stateless-only.

To migrate a cluster, which was using a Load Balancer and IP with a basic SKU, you must first create an entirely new Load Balancer and IP resource using the standard SKU. It is not possible to update these resources in-place.

The new LB and IP should be referenced in the new Stateless node types that you would like to use. In the example above, a new virtual machine scale set resources is added to be used for Stateless node types. These virtual machine scale sets reference the newly created LB and IP and are marked as stateless node types in the Service Fabric Cluster Resource.

To begin, you will need to add the new resources to your existing Resource Manager template. These resources include:
* A Public IP Resource using Standard SKU.
* A Load Balancer Resource using Standard SKU.
* A NSG referenced by the subnet in which you deploy your virtual machine scale sets.

Once the resources have finished deploying, you can begin to disable the nodes in the node type that you want to remove from the original cluster.

## Next steps 
* [Reliable Services](service-fabric-reliable-services-introduction.md)
* [Node types and virtual machine scale sets](service-fabric-cluster-nodetypes.md)