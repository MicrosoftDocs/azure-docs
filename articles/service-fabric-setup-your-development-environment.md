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
   ms.date="03/17/2015"
   ms.author="seanmck"/>

# Setting up your Service Fabric development environment

 This article covers everything you need to start building Service Fabric apps, including installing the runtime, SDK, and tools and setting up a local cluster.

** Prerequisites **

The Service Fabric tools depend on Visual Studio 2015. To install Visual Studio 2015 CTP6, go <a href="https://www.visualstudio.com/en-us/news/vs2015-vs.aspx">here</a>.

## Installing the runtime, SDK, and tools

Installation of the Service Fabric components is handled by the Web Platform Installer. Follow these instructions to install:

1. Launch the Web Platform Installer by clicking <a href="http://replacewiththeresultwebpiuri.com">here</a>.

2. Click Add to include Service Fabric in the cart.

3. Click Install to begin the install process.

4. Review and accept the EULA.

Installation will proceed automatically.

  > [AZURE.NOTE] In some cases, installation may appear to be stuck at more than 90% completeness for several minutes. Please be patient. Installation will eventually finish.

## Installing and starting a local cluster

A local cluster simulates the multi-machine topology that you will eventually use in production on your development machine. To setup the local cluster, follow these steps:

1.  Launch a new Powershell window as an Adminstator.
2.	Navigate to %systemdrive%\FabActSDK\ClusterSetup\Local
3.	Run DevClusterSetup.ps1 -Secure

In a few moments you should see output that shows node information and confirmation that the cluster was created successfully.

## Next steps

Now that your development environment is set up, you can start building and running apps.

- [Create and run your first Service Fabric app using Visual Studio](service-fabric-stateless-helloworld.md)
- [Learn the core concepts of a Service Fabric app in the WordCount tutorial](service-fabric-wordcount-tutorial.md)
- [Create a cluster in Microsoft Azure to enable deployment to the cloud](service-fabric-create-an-azure-cluster.md)
- [Visualizing your cluster using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
