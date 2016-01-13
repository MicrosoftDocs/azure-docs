<properties
   pageTitle="Set up your development environment | Microsoft Azure"
   description="Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/17/2015"
   ms.author="seanmck"/>

# Prepare your development environment
 In order to build and run [Azure Service Fabric applications][1] on your development machine, you need to install the runtime, SDK, and tools. You also need to set up a local cluster.

## Prerequisites
### Supported operating system versions
The following operating system versions are supported:

- Windows 8/Windows 8.1
- Windows Server 2012 R2
- Windows 10

### Visual Studio 2015

The tools for Service Fabric depend on Visual Studio 2015, which you can find on the [Visual Studio website][2].

> [AZURE.NOTE] If you aren't running one of the supported OS versions or would prefer not to install Visual Studio 2015 on your computer, you can set up an Azure virtual machine with Windows Server 2012 R2 and Visual Studio 2015 preinstalled. You can do this by using an image from the Azure virtual machine gallery.

## Install the runtime, SDK, and tools

The Web Platform Installer performs the installation of the Service Fabric components. Follow these instructions to install:

1. [Download the SDK][3] by using the Web Platform Installer.

2. Click **Install** to begin the installation process.

3. Review and accept the EULA.

Installation will proceed automatically.

## Enable PowerShell script execution

Service Fabric uses Windows PowerShell scripts for creating a local development cluster and for deploying applications from Visual Studio. By default, Windows will block these scripts from running. To enable them, you must modify your PowerShell execution policy. Open PowerShell as an administrator and enter the following command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Force -Scope CurrentUser
```

## Next steps
Now that your development environment is set up, you can start building and running apps.

- [Create your first Service Fabric application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md)
- [Learn how to deploy and manage applications on your local cluster](service-fabric-get-started-with-a-local-cluster.md)
- [Learn about the programming models: Reliable Actors and Reliable Services](service-fabric-choose-framework.md)
- [Check out the Service Fabric code samples on GitHub](https://aka.ms/servicefabricsamples)
- [Visualize your cluster by using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)

[1]: http://azure.microsoft.com/en-us/campaigns/service-fabric/ "Service Fabric campaign page"
[2]: http://go.microsoft.com/fwlink/?LinkId=517106 "VS RC"
[3]:http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric "WebPI link"
