---
title: Node types and virtual machine scale sets 
description: Learn how Azure Service Fabric node types relate to virtual machine scale sets and how to remotely connect to a scale set instance or cluster node.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Azure Service Fabric node types and virtual machine scale sets

[Virtual machine scale sets](../virtual-machine-scale-sets/index.yml) are an Azure compute resource. You can use scale sets to deploy and manage a collection of virtual machines as a set. Each node type that you define in an Azure Service Fabric cluster sets up exactly one scale set: multiple node types cannot be backed by the same scale set and one node type should not be backed by multiple scale sets.

The Service Fabric runtime is installed on each virtual machine in the scale set by the *Microsoft.Azure.ServiceFabric* Virtual Machine extension. You can independently scale each node type up or down, change the OS SKU running on each cluster node, have different sets of ports open, and use different capacity metrics.

The following figure shows a cluster that has two node types, named *FrontEnd* and *BackEnd*. Each node type has five nodes.

![A cluster that has two node types][NodeTypes]

## Map virtual machine scale set instances to nodes

As shown in the preceding figure, scale set instances start at instance 0, and then increase by 1. The numbering is reflected in the node names. For example, node BackEnd_0 is instance 0 of the BackEnd scale set. This particular scale set has five instances, named BackEnd_0, BackEnd_1, BackEnd_2, BackEnd_3, and BackEnd_4.

When you scale out a scale set, a new instance is created. The new scale set instance name typically is the scale set name plus the next instance number. In our example, it is BackEnd_5.

## Map scale set load balancers to node types and scale sets

If you deployed your cluster in the Azure portal or used the sample Azure Resource Manager template, all resources under a resource group are listed. You can see the load balancers for each scale set or node type. The load balancer name uses the following format: **LB-&lt;node type name&gt;**. An example is LB-sfcluster4doc-0, as shown in the following figure:

![Screenshot shows a resource group with two load balancers highlighted.][Resources]

## Service Fabric Virtual Machine Extension

Service Fabric Virtual Machine Extension is used to bootstrap Service Fabric to Azure Virtual Machines, and configure the Node Security.

The following is a snippet of Service Fabric Virtual Machine extension:

```json
"extensions": [
  {
    "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
    "properties": {
      "type": "ServiceFabricLinuxNode",
      "autoUpgradeMinorVersion": true,
      "protectedSettings": {
        "StorageAccountKey1": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('supportLogStorageAccountName')),'2015-05-01-preview').key1]",
       },
       "publisher": "Microsoft.Azure.ServiceFabric",
       "settings": {
         "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
         "nodeTypeRef": "[variables('vmNodeType0Name')]",
         "durabilityLevel": "Silver",
         "enableParallelJobs": true,
         "nicPrefixOverride": "[variables('subnet0Prefix')]",
         "dataPath": "D:\\\\SvcFab",
         "certificate": {
           "commonNames": [
             "[parameters('certificateCommonName')]"
           ],
           "x509StoreName": "[parameters('certificateStoreValue')]"
         }
       },
       "typeHandlerVersion": "1.1"
     }
   },
```

The following are the property descriptions:

| **Name** | **Allowed Values** | **Guidance or Short Description** |
| --- | --- | --- | --- |
| name | string | Unique name for extension |
| type | "ServiceFabricLinuxNode" or "ServiceFabricWindowsNode" | Identifies OS Service Fabric is bootstrapping to |
| autoUpgradeMinorVersion | true or false | Enable Auto Upgrade of SF Runtime Minor Versions |
| publisher | Microsoft.Azure.ServiceFabric | Name of the Service Fabric extension publisher |
| clusterEndpoint | string | URI:PORT to Management endpoint |
| nodeTypeRef | string | Name of nodeType |
| durabilityLevel | bronze, silver, gold, platinum | Time allowed to pause immutable Azure Infrastructure |
| enableParallelJobs | true or false | Enable Compute ParallelJobs like remove VM and reboot VM in the same scale set in parallel |
| nicPrefixOverride | string | Subnet Prefix like "10.0.0.0/24" |
| commonNames | string[] | Common Names of installed cluster certificates |
| x509StoreName | string | Name of Store where installed cluster certificate is located |
| typeHandlerVersion | 1.1 | Version of Extension. 1.0 classic versions of extension are recommended to upgrade to 1.1 |
| dataPath | string | Path to the drive used to save state for Service Fabric system services and application data.

## Next steps

* See the [overview of the "Deploy anywhere" feature and a comparison with Azure-managed clusters](service-fabric-deploy-anywhere.md).
* Learn about [cluster security](service-fabric-cluster-security.md).
* [Remote connect](service-fabric-cluster-remote-connect-to-azure-cluster-node.md) to a specific scale set instance
* [Update the RDP port range values](./scripts/service-fabric-powershell-change-rdp-port-range.md) on cluster VMs after deployment
* [Change the admin username and password](./scripts/service-fabric-powershell-change-rdp-user-and-pw.md) for cluster VMs

<!--Image references-->
[NodeTypes]: ./media/service-fabric-cluster-nodetypes/NodeTypes.png
[Resources]: ./media/service-fabric-cluster-nodetypes/Resources.png
[InboundNatPools]: ./media/service-fabric-cluster-nodetypes/InboundNatPools.png
