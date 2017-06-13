---
title: Set up a standalone Azure Service Fabric cluster | Microsoft Docs
description: Create a development standalone cluster with three nodes running on the same computer. After completing this setup, you will be ready to create a multi-machine cluster.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/11/2017
ms.author: ryanwi

---

# Create your first Service Fabric standalone cluster
You can create a Service Fabric standalone cluster on any virtual machines or computers running Windows Server 2012 R2 or Windows Server 2016, on-premises or in the cloud. This quickstart helps you to create a development standalone cluster in just a few minutes.  When you're finished, you have a three-node cluster running on a single computer that you can deploy apps to.

## Before you begin
Service Fabric provides a setup package to create Service Fabric standalone clusters.  [Download the setup package](http://go.microsoft.com/fwlink/?LinkId=730690).  Unzip the setup package to a folder on the computer or virtual machine where you are setting up the development cluster.  The contents of the setup package are described in detail [here](service-fabric-cluster-standalone-package-contents.md).

The cluster administrator deploying and configuring the cluster must have administrator privileges on the computer. You cannot install Service Fabric on a domain controller.

## Validate the environment
The *TestConfiguration.ps1* script in the standalone package is used as a best practices analyzer to validate whether a cluster can be deployed on a given environment. [Deployment preparation](service-fabric-cluster-standalone-deployment-preparation.md) lists the pre-requisites and environment requirements. Run the script to verify if you can create the development cluster:

```powershell
.\TestConfiguration.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json
```
## Create the cluster
Several sample cluster configuration files are installed with the setup package. *ClusterConfig.Unsecure.DevCluster.json* is the simplest cluster configuration: an unsecure, three-node cluster running on a single computer.  Other config files describe single or multi-machine clusters secured with X.509 certificates or Windows security.  You don't need to modify any of the default config settings for this tutorial, but look through the config file and get familiar with the settings.  The **nodes** section describes the three nodes in the cluster: name, IP address, [node type, fault domain, and upgrade domain](service-fabric-cluster-manifest.md#nodes-on-the-cluster).  The **properties** section defines the [security, reliability level, diagnostics collection, and types of nodes](service-fabric-cluster-manifest.md#cluster-properties) for the cluster.

This cluster is unsecure.  Anyone can connect anonymously and perform management operations, so production clusters should always be secured using X.509 certificates or Windows security.  Security is only configured at cluster creation time and it is not possible to enable security after the cluster is created.  Read [Secure a cluster](service-fabric-cluster-security.md) to learn more about Service Fabric cluster security.  

To create the three-node development cluster, run the *CreateServiceFabricCluster.ps1* script from an administrator PowerShell session:

```powershell
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json -AcceptEULA
```

The Service Fabric runtime package is automatically downloaded and installed at time of cluster creation.

## Connect to the cluster
Your three-node development cluster is now running. The ServiceFabric PowerShell module is installed with the runtime.  You can verify that the cluster is running from the same computer or from a remote computer with the Service Fabric runtime.  The [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster?view=azureservicefabricps) cmdlet establishes a connection to the cluster.   

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint localhost:19000
```
See [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md) for other examples of connecting to a cluster. After connecting to the cluster, use the [Get-ServiceFabricNode](/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) cmdlet to display a list of nodes in the cluster and status information for each node. **HealthState** should be *OK* for each node.

```powershell
PS C:\temp\Microsoft.Azure.ServiceFabric.WindowsServer> Get-ServiceFabricNode |Format-Table

NodeDeactivationInfo NodeName IpAddressOrFQDN NodeType  CodeVersion ConfigVersion NodeStatus NodeUpTime NodeDownTime HealthState
-------------------- -------- --------------- --------  ----------- ------------- ---------- ---------- ------------ -----------
                     vm2      localhost       NodeType2 5.5.216.0   0                     Up 03:00:07   00:00:00              Ok
                     vm1      localhost       NodeType1 5.5.216.0   0                     Up 03:00:02   00:00:00              Ok
                     vm0      localhost       NodeType0 5.5.216.0   0                     Up 03:00:01   00:00:00              Ok
```

## Visualize the cluster using Service Fabric explorer
[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) is a good tool for visualizing your cluster and managing applications.  Service Fabric Explorer is a service that runs in the cluster, which you access using a browser by navigating to [http://localhost:19080/Explorer](http://localhost:19080/Explorer). 

The cluster dashboard provides an overview of your cluster, including a summary of application and node health. The node view shows the physical layout of the cluster. For a given node, you can inspect which applications have code deployed on that node.

![Service Fabric Explorer][service-fabric-explorer]

## Remove the cluster
To remove a cluster, run the *RemoveServiceFabricCluster.ps1* PowerShell script from the package folder and pass in the path to the JSON configuration file. You can optionally specify a location for the log of the deletion.

```powershell
# Removes Service Fabric cluster nodes from each computer in the configuration file.
.\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json -Force
```

To remove the Service Fabric runtime from the computer, run the following PowerShell script from the package folder.

```powershell
# Removes Service Fabric from the current computer.
.\CleanFabric.ps1
```

## Next steps
Now that you have set up a development standalone cluster, try the following articles:
* [Set up a multi-machine standalone cluster](service-fabric-cluster-creation-for-windows-server.md) and enable security.
* [Deploy apps using PowerShell](service-fabric-deploy-remove-applications.md)

[service-fabric-explorer]: ./media/service-fabric-get-started-standalone-cluster/sfx.png
