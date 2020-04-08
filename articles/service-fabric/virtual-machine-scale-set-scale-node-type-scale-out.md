---
title: Add a node type to an Azure Service Fabric cluster 
description: Learn how to scale out a Service Fabric cluster by adding a Virtual Machine Scale Set.

ms.topic: article
ms.date: 02/13/2019
---
# Scale a Service Fabric cluster out by adding a virtual machine scale set
This article describes how to scale an Azure Service Fabric cluster by adding a new node type to an existing cluster. A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Virtual machine scale sets are an Azure compute resource that you use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately. After creating a Service Fabric cluster, you can scale a cluster horizontally by adding a new node type (virtual machine scale set) to an existing cluster.  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

## Add an additional scale set to an existing cluster
Adding a new node type (which is backed by a virtual machine scale set) to an existing cluster is similar to [upgrading of the primary node type](service-fabric-scale-up-node-type.md), except you won't use the same NodeTypeRef; obviously won't be disabling any actively used virtual machine scale sets, and you won't lose cluster availability if you do not update the primary node type. 

NodeTypeRef property is declared within the virtual machine scale set Service Fabric extension properties:
```json
<snip>
"publisher": "Microsoft.Azure.ServiceFabric",
     "settings": {
     "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
     "nodeTypeRef": "[parameters('vmNodeType2Name')]",
     "dataPath": "D:\\\\SvcFab",
     "durabilityLevel": "Silver",
<snip>
```

Additionally you will need to add this new node type to your Service Fabric cluster resource:

```json
<snip>
"nodeTypes": [
      {
      "name": "[parameters('vmNodeType2Name')]",
      "applicationPorts": {
                "endPort": "[parameters('nt2applicationEndPort')]",
                "startPort": "[parameters('nt2applicationStartPort')]"
      },
      "clientConnectionEndpointPort": "[parameters('nt2fabricTcpGatewayPort')]",
      "durabilityLevel": "Silver",
       "ephemeralPorts": {
                "endPort": "[parameters('nt2ephemeralEndPort')]",
                "startPort": "[parameters('nt2ephemeralStartPort')]"
      },
      "httpGatewayEndpointPort": "[parameters('nt2fabricHttpGatewayPort')]",
      "isPrimary": false,
      "vmInstanceCount": "[parameters('nt2InstanceCount')]"
},
<snip>
```

## Next steps
* Learn how to [scale up the primary node type](service-fabric-scale-up-node-type.md)
* Learn about [application scalability](service-fabric-concepts-scalability.md).
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md).
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md) using the fluent Azure compute SDK.
* [Scale a standalone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md).

