---
title: Add or remove nodes to a standalone Service Fabric cluster | Microsoft Docs
description: Learn how to add or remove nodes to an Azure Service Fabric cluster on a physical or virtual machine running Windows Server, which could be on-premises or in any cloud.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid: bc6b8fc0-d2af-42f8-a164-58538be38d02
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/02/2017
ms.author: dekapur

---
# Add or remove nodes to a standalone Service Fabric cluster running on Windows Server
After you have [created your standalone Service Fabric cluster on Windows Server machines](service-fabric-cluster-creation-for-windows-server.md), your (business) needs may change and you will need to add or remove nodes to your cluster. This article provides detailed steps to achieve this. Please note that add/remove node functionality is not supported in local development clusters.

## Add nodes to your cluster

1. Prepare the VM/machine you want to add to your cluster by following the steps outlined in [Plan and prepare your Service Fabric cluster deployment](service-fabric-cluster-creation-for-windows-server.md)
2. Identify which fault domain and upgrade domain you are going to add this VM/machine to
3. Remote desktop (RDP) into the VM/machine that you want to add to the cluster
4. Copy or [download the standalone package for Service Fabric for Windows Server](https://go.microsoft.com/fwlink/?LinkId=730690) to the VM/machine and unzip the package
5. Run Powershell with elevated privileges, and navigate to the location of the unzipped package
6. Run the *AddNode.ps1* script with the parameters describing the new node to add. The example below adds a new node called VM5, with type NodeType0 and IP address 182.17.34.52, into UD1 and fd:/dc1/r0. The *ExistingClusterConnectionEndPoint* is a connection endpoint for a node already in the existing cluster, which can be the IP address of *any* node in the cluster.

	```
	.\AddNode.ps1 -NodeName VM5 -NodeType NodeType0 -NodeIPAddressorFQDN 182.17.34.52 -ExistingClientConnectionEndpoint 182.17.34.50:19000 -UpgradeDomain UD1 -FaultDomain fd:/dc1/r0 -AcceptEULA
	```
	Once the script finishes running, you can check if the new node has been added by running the [Get-ServiceFabricNode](/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) cmdlet.

7. To ensure consistency across different nodes in the cluster, you must initiate a configuration upgrade. Run [Get-ServiceFabricClusterConfiguration](/powershell/module/servicefabric/get-servicefabricclusterconfiguration?view=azureservicefabricps) to get the latest configuration file and add the newly added node to "Nodes" section. It is also recommended to always have the latest cluster configuration available in the case that you need to redeploy a cluster with the same configuration.

	```
		{
		    "nodeName": "vm5",
		    "iPAddress": "182.17.34.52",
		    "nodeTypeRef": "NodeType0",
		    "faultDomain": "fd:/dc1/r0",
		    "upgradeDomain": "UD1"
		}
	```
8. Run [Start-ServiceFabricClusterConfigurationUpgrade](/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade?view=azureservicefabricps) to begin the upgrade.

	```
	Start-ServiceFabricClusterConfigurationUpgrade -ClusterConfigPath <Path to Configuration File>

	```
	You can monitor the progress of the upgrade on Service Fabric Explorer. Alternatively, you can run [Get-​Service​Fabric​Cluster​Upgrade](/powershell/module/servicefabric/get-servicefabricclusterupgrade?view=azureservicefabricps)

### Add nodes to clusters configured with Windows Security using gMSA
For clusters configured with Group Managed Service Account(gMSA)(https://technet.microsoft.com/library/hh831782.aspx), a new node can be added using a configuration upgrade:
1. Run [Get-ServiceFabricClusterConfiguration](/powershell/module/servicefabric/get-servicefabricclusterconfiguration?view=azureservicefabricps) on any of the existing nodes to get the latest configuration file and add details about the new node you want to add in the "Nodes" section. Make sure the new node is part of the same group managed account. This account should be an Administrator on all machines.

	```
		{
		    "nodeName": "vm5",
		    "iPAddress": "182.17.34.52",
		    "nodeTypeRef": "NodeType0",
		    "faultDomain": "fd:/dc1/r0",
		    "upgradeDomain": "UD1"
		}
	```
2. Run [Start-ServiceFabricClusterConfigurationUpgrade](/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade?view=azureservicefabricps) to begin the upgrade.

	```
	Start-ServiceFabricClusterConfigurationUpgrade -ClusterConfigPath <Path to Configuration File>
	```
	You can monitor the progress of the upgrade on Service Fabric Explorer. Alternatively, you can run [Get-​Service​Fabric​Cluster​Upgrade](/powershell/module/servicefabric/get-servicefabricclusterupgrade?view=azureservicefabricps)

### Add node types to your cluster
In order to add a new node type, modify your configuration to include the new node type in "NodeTypes" section under "Properties" and begin a configuration upgrade using [Start-ServiceFabricClusterConfigurationUpgrade](/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade?view=azureservicefabricps). Once the upgrade completes, you can add new nodes to your cluster with this node type.

## Remove nodes from your cluster
A node can be removed from a cluster using a configuration upgrade, in the following manner:

1. Run [Get-ServiceFabricClusterConfiguration](/powershell/module/servicefabric/get-servicefabricclusterconfiguration?view=azureservicefabricps) to get the latest configuration file and *remove* the node from "Nodes" section.
Add the "NodesToBeRemoved" parameter to "Setup" section inside "FabricSettings" section. The "value" should be a comma separated list of node names of nodes that need to be removed.

	```
		 "fabricSettings": [
		    {
			"name": "Setup",
			"parameters": [
			    {
				"name": "FabricDataRoot",
				"value": "C:\\ProgramData\\SF"
			    },
			    {
				"name": "FabricLogRoot",
				"value": "C:\\ProgramData\\SF\\Log"
			    },
			    {
				"name": "NodesToBeRemoved",
				"value": "vm0, vm1"
			    }
			]
		    }
		]
	```
2. Run [Start-ServiceFabricClusterConfigurationUpgrade](/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade?view=azureservicefabricps) to begin the upgrade.

	```
	Start-ServiceFabricClusterConfigurationUpgrade -ClusterConfigPath <Path to Configuration File>

	```
	You can monitor the progress of the upgrade on Service Fabric Explorer. Alternatively, you can run [Get-​Service​Fabric​Cluster​Upgrade](/powershell/module/servicefabric/get-servicefabricclusterupgrade?view=azureservicefabricps)

> [!NOTE]
> Removal of nodes may initiate multiple upgrades. Some nodes are marked with `IsSeedNode=”true”` tag and can be identified by querying the cluster manifest using `Get-ServiceFabricClusterManifest`. Removal of such nodes may take longer than others since the seed nodes will have to be moved around in such scenarios. The cluster must maintain a minimum of 3 primary node type nodes.
> 
> 

### Remove node types from your cluster
Before removing a node type, please double check if there are any nodes referencing the node type. Remove these nodes before removing the corresponding node type. Once all corresponding nodes are removed, you can remove the NodeType from the cluster configuration and begin a configuration upgrade using [Start-ServiceFabricClusterConfigurationUpgrade](/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade?view=azureservicefabricps).


### Replace primary nodes of your cluster
The replacement of primary nodes should be performed one node after another, instead of removing and then adding in batches.


## Next steps
* [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md)
* [Secure a standalone cluster on Windows using X509 certificates](service-fabric-windows-cluster-x509-security.md)
* [Create a standalone Service Fabric cluster with Azure VMs running Windows](service-fabric-cluster-creation-with-windows-azure-vms.md)

