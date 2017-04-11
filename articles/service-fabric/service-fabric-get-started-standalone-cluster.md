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
Several sample cluster configuration files are installed with the setup package. *ClusterConfig.Unsecure.DevCluster.json* is the simplest cluster configuration: an unsecure, three-node cluster running on a single computer. Other config files describe single or multi-machine clusters secured with X.509 certificates or Windows security.  Read [Secure a cluster](service-fabric-cluster-security.md) to learn more about Service Fabric cluster security. 

Run the *CreateServiceFabricCluster.ps1* script from an administrator PowerShell session to create the three-node development cluster:

```powershell
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json -AcceptEULA
```

The Service Fabric runtime package is automatically downloaded and installed at time of cluster creation.

## Connect to the cluster


## Deploy an application

## Visualize the cluster using Service Fabric explorer

## Remove the cluster

## Next steps
