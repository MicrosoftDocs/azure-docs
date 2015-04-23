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
   ms.date="04/21/2015"
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
A local cluster represents the multi-machine topology that you will eventually use in production on a single development machine. To setup the local cluster, follow these steps:
1. Launch a new Powershell window as an Adminstator.
2. Navigate to %programfiles%\Microsoft SDKs\Service Fabric\ClusterSetup\
3. Run ./DevClusterSetup.ps1

In a few moments you should see output that shows node information and confirmation that the cluster was created successfully. In some cases, you may see warnings while the Service Fabric Host Service and Naming Services start up. These are normal and will be followed momentarily by some basic information about the cluster.

> [AZURE.NOTE] Your local cluster uses exactly the same runtime as what will run in Azure. It is not simulated or emulated in any way. The only difference is that all of your nodes run on a single machine, rather than being distributed across multiple machines as they will be in Azure.

## Validate your cluster setup

You can check that your cluster was created successfully using the Service Fabric Explorer tool that ships with the SDK.

1. Launch ServiceFabricExplorer.exe from %programfiles%\Microsoft SDKs\Service Fabric\Tools\ServiceFabricExplorer\

2. Expand the Onebox/Local Cluster node in the top left corner.

3. Ensure that all child elements are green.

If any element is not green or you see an error, wait a few moments and click the refresh button. If you still have issues, check out the [setup troubleshooting steps](service-fabric-troubleshoot-local-cluster-setup.md).

## Next steps
Now that your development environment is set up, you can start building and running apps.

- [Learn about the high-level frameworks: reliable actors and reliable services](service-fabric-choose-framework.md)
- [Get started with reliable services](service-fabric-reliable-services-quick-start.md)
- [Get started with reliable actors](service-fabric-fabact-get-started.md)
- [Visualizing your cluster using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
