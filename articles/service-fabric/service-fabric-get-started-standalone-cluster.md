---
title: Set up a standalone Azure Service Fabric cluster | Microsoft Docs
description: Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications.
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

# Create your first Service Fabric standalone cluster and deploy an app
You can create a Service Fabric standalone cluster on any virtual machines or computers running Windows Server, on-premises or in the cloud. This quickstart helps you to create a development standalone cluster, a three-node cluster running on a single computer, in just a few minutes.  When you're finished, you'll have a standalone cluster up and running with a deployed application.

## Before you begin
Service Fabric provides a setup package to create Service Fabric standalone clusters.  [Download the setup package](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip it to a folder on the computer or virtual machine on which you will setup the development cluster, for example *C:\temp\Microsoft.Azure.ServiceFabric.WindowsServer*.  The contents of the setup package are described in detail [here](service-fabric-cluster-standalone-package-contents.md).

The cluster administrator deploying and configuring the cluster must have administrator privileges on each of the machines. You cannot install Service Fabric on a domain controller.

## Validate the environment
The *TestConfiguration.ps1* script in the standalone package is used as a best practices analyzer to validate whether a cluster can be deployed on a given environment. [Environment setup](service-fabric-cluster-standalone-deployment-preparation.md) lists the requirements. Run the script to verify if you can create the development cluster:

```powershell
PS C:\temp\Microsoft.Azure.ServiceFabric.WindowsServer> .\TestConfiguration.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json
```
## Create the cluster
Several sample cluster configuration files are installed with the setup package. *ClusterConfig.Unsecure.DevCluster.json* is the simplest cluster configuration: an unsecure, three-node cluster running on a single computer. You don't need to modify any of the default config settings for this tutorial.  Other config files describe single or multi-machine clusters secured with X.509 certificates or Windows security.  Read [Secure a cluster](service-fabric-cluster-security.md) to learn more about Service Fabric cluster security. 

Run the *CreateServiceFabricCluster.ps1* script from an administrator PowerShell session to create the three-node development cluster:

```powershell
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json -AcceptEULA
```

The Service Fabric runtime package is automatically downloaded and installed at time of cluster creation.

## Connect to the cluster
Your three-node development cluster is now running. The ServiceFabric PowerShell module is installed with the runtime.  You can check on the cluster from the computer running the cluster or from a remote computer with the Service Fabric runtime installed.  The [Connect-ServiceFabricCluster](/powershell/module/ServiceFabric/Connect-ServiceFabricCluster) cmdlet establishes a connection to the cluster.  The [Get-ServiceFabricNode](/powershell/module/servicefabric/get-servicefabricnode) cmdlet displays a list of nodes in the cluster and some status information for each node. 

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint localhost:19000
Get-ServiceFabricNode
```

## Visualize the cluster using Service Fabric explorer
[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) is a good tool for visualizing your cluster and managing applications.  Service Fabric Explorer is a service that runs in the cluster.  You can access Service Fabric Explorer using a browser by navigating to [http://<your-cluster-endpoint>:19080/Explorer](http://<your-cluster-endpoint>:19080/Explorer).

## Deploy an application

## Remove the cluster

## Next steps
