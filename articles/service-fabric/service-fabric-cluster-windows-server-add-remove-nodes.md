---
title: Add or remove nodes to a standalone Service Fabric cluster | Microsoft Docs
description: Learn how to add or remove nodes to an Azure Service Fabric cluster on a physical or virtual machine running Windows Server, which could be on-premises or in any cloud.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: bc6b8fc0-d2af-42f8-a164-58538be38d02
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 2/02/2017
ms.author: chackdan

---
# Add or remove nodes to a standalone Service Fabric cluster running on Windows Server
After you have [created your standalone Service Fabric cluster on Windows Server machines](service-fabric-cluster-creation-for-windows-server.md), your business needs may change so that you might need to add or remove multiple nodes to your cluster. This article provides detailed steps to achieve this goal.

## Add nodes to your cluster
1. Prepare the VM/machine you want to add to your cluster by following the steps mentioned in the [Prepare the machines to meet the prerequisites for cluster deployment](service-fabric-cluster-creation-for-windows-server.md) section.
2. Plan which fault domain and upgrade domain you are going to add this VM/machine to.
3. Remote desktop (RDP) into the VM/machine that you want to add to the cluster.
4. Copy or [download the standalone package for Service Fabric for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) to this VM/machine and unzip the package.
5. Run Powershell as an administrator, and navigate to the location of the unzipped package.
6. Run *AddNode.ps1* Powershell with the parameters describing the new node to add. The example below adds a new node called VM5, with type NodeType0, IP address 182.17.34.52 into UD1 and fd:/dc1/r0. The *ExistingClusterConnectionEndPoint* is a connection endpoint for a node already in the existing cluster. For this endpoint, you can choose the IP address of *any* node in the cluster.

```
.\AddNode.ps1 -NodeName VM5 -NodeType NodeType0 -NodeIPAddressorFQDN 182.17.34.52 -ExistingClientConnectionEndpoint 182.17.34.50:19000 -UpgradeDomain UD1 -FaultDomain fd:/dc1/r0 -AcceptEULA

```
You can check if the new node is added by running the cmdlet [Get-ServiceFabricNode](/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps).


## Remove nodes from your cluster
Depending on the Reliability level chosen for the cluster, you cannot remove the first n (3/5/7/9) nodes of the primary node type. Also note that running RemoveNode command on a dev cluster is not supported.

1. Remote desktop (RDP) into the VM/machine that you want to remove from the cluster.
2. Copy or [download the standalone package for Service Fabric for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the package to this VM/machine.
3. Run Powershell as an administrator, and navigate to the location of the unzipped package.
4. Run *RemoveNode.ps1* in PowerShell. The example below removes the current node from the cluster. The *ExistingClientConnectionEndpoint* is a client connection endpoint for any node that will remain in the cluster. Choose the IP address and the endpoint port of *any* **other node** in the cluster. This **other node** will in turn update the cluster configuration for the removed node. 

```

.\RemoveNode.ps1 -ExistingClientConnectionEndpoint 182.17.34.50:19000

```

> [!NOTE]
> Some nodes may not be removed due to system services dependencies. These nodes are primary nodes and can be identified by querying the cluster manifest using `Get-ServiceFabricClusterManifest` and finding node entries marked with `IsSeedNode=”true”`. 
> 
> 

Even after removing a node, if it shows up as being down in queries and SFX, please note that this is a known defect. It will be fixed in an upcoming release. 


## Remove node types from your cluster
Removing a node type requires extra caution. Before removing a node type, please double check if there is any node referencing the node type.


## Replace primary nodes of your cluster
The replacement of primary nodes should be performed one node after another, instead of removing and then adding in batches.


## Next steps
* [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md)
* [Secure a standalone cluster on Windows using X509 certificates](service-fabric-windows-cluster-x509-security.md)
* [Create a standalone Service Fabric cluster with Azure VMs running Windows](service-fabric-cluster-creation-with-windows-azure-vms.md)

