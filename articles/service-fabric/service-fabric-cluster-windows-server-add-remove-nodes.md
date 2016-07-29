<properties
   pageTitle="Add or remove nodes to your on-premises or any-cloud Azure Service Fabric cluster | Microsoft Azure"
   description="Learn how to add or remove nodes to an Azure Service Fabric cluster on a physical or virtual machine running Windows Server, which could be on-premises or in any cloud."
   services="service-fabric"
   documentationCenter=".net"
   authors="dsk-2015"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/29/2016"
   ms.author="dkshir;chackdan"/>


# Add or remove nodes to a cluster running on Windows Server

After you have [created your standalone Service Fabric cluster on Windows Server machines](service-fabric-cluster-creation-for-windows-server.md), your business needs may change so that you might need to add or remove multiple nodes to your cluster. This article provides detailed steps to achieve this goal. 


## Add nodes to your cluster

1. Prepare the VM/machine you want to add to your cluster by following the steps mentioned in the [Prepare the machines to meet the pre-requisites for cluster deployment](service-fabric-cluster-creation-for-windows-server.md#preparemachines) section.
2. Plan which fault domain and upgrade domain you are going to add this VM/machine to.
3. Remote desktop (RDP) into the VM/machine that you want to add to the cluster.
4. Copy or [download the standalone package for Service Fabric for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) to this VM/machine and unzip the package.
5. Open up a Powershell admin prompt, and navigate to the location of the unzipped package.
6. Run *AddNode.ps1* Powershell with the parameters describing the new node to add. The example below adds a new node called VM5, with type NodeType0, IP address 182.17.34.52 into UD1 and FD1. The *ExistingClusterConnectionEndPoint* is a connection endpoint for a node already in the existing cluster. You can choose *any* node's IP address in the cluster, for this endpoint.

```
.\AddNode.ps1 -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -NodeName VM5 -NodeType NodeType0 -NodeIPAddressorFQDN 182.17.34.52 -ExistingClusterConnectionEndPoint 182.17.34.50:19000 -UpgradeDomain UD1 -FaultDomain FD1
```

## Remove nodes from your cluster

1. Remote desktop (RDP) into the VM/machine that you want to remove from the cluster.
2. Copy or [download the standalone package for Service Fabric for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the package to this VM/machine.
3. Open up a Powershell admin prompt and navigate to the location of the unzipped package.
4. Run *RemoveNode.ps1* Powershell. The example below removes the current node from the cluster. The *ExistingClusterConnectionEndPoint* is a connection endpoint for a node already in the existing cluster. You can choose *any* node's IP address in the cluster, for this endpoint.

```
.\RemoveNode.ps1 -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -ExistingClusterConnectionEndPoint 182.17.34.50:19000
```


## Next steps
- [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md)
- [Secure a standalone cluster on Windows using Windows security](service-fabric-windows-cluster-windows-security.md)
- [Secure a standalone cluster on Windows using X509 certificates](service-fabric-windows-cluster-x509-security.md)
