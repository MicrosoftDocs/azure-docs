<properties
   pageTitle="Setting up your Service Fabric development environment"
   description="Install the Service Fabric runtime, SDK, and tools and create a local development cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/20/2015"
   ms.author="seanmck"/>

# Setting up your Service Fabric development environment
 This article covers everything you need to start building Service Fabric apps, including installing the runtime, SDK, and tools and setting up a local cluster.

## Prerequisites

The tools for Service Fabric Preview 1 depend on Visual Studio 2015 RC. To install Visual Studio 2015 RC, go [here](https://www.visualstudio.com/en-us/news/vs2015-vs.aspx).

## Installing the runtime, SDK, and tools
Installation of the Service Fabric components is handled by the Web Platform Installer. Follow these instructions to install:
1. Launch the Web Platform Installer by clicking [here](http://replacewiththeresultwebpiuri.com).
2. Click Add to include Service Fabric in the cart.
3. Click Install to begin the install process.
4. Review and accept the EULA.

Installation will proceed automatically.

## Installing and starting a local cluster
A local cluster mimics the multi-machine topology that you will eventually use in production on a single development machine. To setup the local cluster, follow these steps:
1. Launch a new Powershell window as an Adminstator.
2. Navigate to %programfiles%\Microsoft SDKs\Service Fabric\ClusterSetup\
3. Run ./DevClusterSetup.ps1

In a few moments you should see output that shows node information and confirmation that the cluster was created successfully. In some cases, you may see warnings while the Service Fabric Host Service and Naming Services start up. These are normal and will be followed momentarily by some basic information about the cluster.

> [AZURE.NOTE] Your local cluster uses exactly the same runtime as what will run in Azure. It is not simulated or emulated in any way. The only difference is that all of your nodes run on a single host, rather than being distributed across multiple machines as they will be in Azure.

## Next steps
Now that your development environment is set up, you can start building and running apps.

- [Create and run your first Service Fabric app using Visual Studio](../service-fabric-stateless-helloworld.md)
- [Learn the core concepts of a Service Fabric app in the WordCount tutorial](../service-fabric-wordcount-tutorial.md)
