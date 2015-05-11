<properties
   pageTitle="Set up your Service Fabric development environment"
   description="Install the Service Fabric runtime, SDK, and tools and create a local development cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="samgeo"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/04/2015"
   ms.author="seanmck"/>

# Set up your Service Fabric development environment
 This article covers everything you need to start building [Service Fabric][1] apps, including installing the runtime, SDK, and tools and setting up a local cluster.

## Prerequisites
### Supported Operating System Versions
The following operating system versions are supported:

- Windows 8/8.1
- Windows Server 2012 R2
- Windows 10 Technical Preview

### Visual Studio 2015

The tools for Service Fabric Preview 1 depend on Visual Studio 2015 RC, which you can find [here][2].

> [AZURE.NOTE] If you aren't running one of the supported OS versions or would prefer not to install Visual Studio 2015 RC on your PC, you can [set up an Azure virtual machine][3] with Windows Server 2012 R2 and Visual Studio 2015 pre-installed using an image from the VM Gallery.

## Install the runtime, SDK, and tools

Installation of the Service Fabric components is done by the Web Platform Installer. Follow these instructions to install:

1. Click [here][4] to download the SDK using the Web Platform Installer.

2. Click Install to begin the install process.

3. Review and accept the EULA.

Installation will proceed automatically.

## Enable PowerShell script execution

Service Fabric uses Windows PowerShell scripts for creating a local development cluster and for deploying applications from Visual Studio. By default, Windows will block these scripts from running. To enable them, you must modify your PowerShell execution policy. Open PowerShell as an administrator and enter the following command:

    Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Force -Scope CurrentUser


## Install and start a local cluster
A local cluster represents the multi-machine topology that you will eventually use in production on a single development machine. To setup the local cluster, follow these steps:


1. Launch a new PowerShell window as an administrator.

2. Navigate to the cluster setup directory with cd "$env:ProgramFiles\Microsoft SDKs\Service Fabric\ClusterSetup"

3. Run ./DevClusterSetup.ps1

In a few moments you should see output that shows node information and confirmation that the cluster was created successfully. In some cases, you may see warnings while the Service Fabric Host Service and Naming Services start up. These are normal and will be followed momentarily by some basic information about the cluster.

> [AZURE.NOTE] Your local cluster uses exactly the same runtime as what will run in Azure. It is not simulated or emulated in any way. The only difference is that all of your nodes run on a single machine, rather than being distributed across multiple machines as they will be in Azure.

## Validate your cluster setup

You can check that your cluster was created successfully using the Service Fabric Explorer tool that ships with the SDK.

1. Launch ServiceFabricExplorer.exe from %programfiles%\Microsoft SDKs\Service Fabric\Tools\ServiceFabricExplorer\

2. Expand the Onebox/Local Cluster node in the top left corner.

3. Ensure that the Application and Node views are green.

If any element is not green or you see an error, wait a few moments and click the refresh button. If you still have issues, check out the [setup troubleshooting steps](service-fabric-troubleshoot-local-cluster-setup.md).

## Next steps
Now that your development environment is set up, you can start building and running apps.

- [Learn about the programming models: Reliable Actors and Reliable Services](service-fabric-choose-framework.md)
- [Get started with the Reliable Services API](service-fabric-reliable-services-quick-start.md)
- [Get started with the Reliable Actors API](service-fabric-reliable-actors-get-started.md)
- [Check out the Service Fabric samples on GitHub](https://github.com/azure/servicefabric-samples)
- [Visualize your cluster using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)

[1]: http://azure.microsoft.com/en-us/campaigns/service-fabric/ "Service Fabric campaign page"
[2]: http://go.microsoft.com/fwlink/?LinkId=517106 "VS RC"
[3]: http://blogs.msdn.com/b/visualstudioalm/archive/2014/06/04/visual-studio-14-ctp-now-available-in-the-virtual-machine-azure-gallery.aspx "Azure VM"
[4]:http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric "WebPI link"
