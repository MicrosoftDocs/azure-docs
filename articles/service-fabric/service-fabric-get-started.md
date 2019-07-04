---
title: Set up a Windows development environment for Azure microservices | Microsoft Docs
description: Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications on Windows.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: ''

ms.assetid: b94e2d2e-435c-474a-ae34-4adecd0e6f8f
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/03/2019
ms.author: aljo

---
# Prepare your development environment on Windows
> [!div class="op_single_selector"]
> * [Windows](service-fabric-get-started.md) 
> * [Linux](service-fabric-get-started-linux.md)
> * [OSX](service-fabric-get-started-mac.md)
> 
> 

To build and run [Azure Service Fabric applications][1] on your Windows development machine, install the Service Fabric runtime, SDK, and tools. You also need to [enable execution of the Windows PowerShell scripts](#enable-powershell-script-execution) included in the SDK.

## Prerequisites
### Supported operating system versions
The following operating system versions are supported for development:

* Windows 7
* Windows 8/Windows 8.1
* Windows Server 2012 R2
* Windows Server 2016
* Windows 10

> [!NOTE]
> Windows 7 support:
> - Windows 7 only includes Windows PowerShell 2.0 by default. Service Fabric PowerShell cmdlets requires PowerShell 3.0 or higher. You can [download Windows PowerShell 5.0][powershell5-download] from the Microsoft Download Center.
> - Service Fabric Reverse Proxy is not available on Windows 7.
>

## Install the SDK and tools
Web Platform Installer (WebPI) is the recommended way to install the SDK and tools. If you receive runtime errors using WebPI, you can also find direct links to the installers in the release notes for a specific Service Fabric release. The release notes can be found in the various release announcements on the [Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/).

> [!NOTE]
> Local Service Fabric development cluster upgrades are not supported.

### To use Visual Studio 2017
The Service Fabric Tools are part of the Azure Development workload in Visual Studio 2017. Enable this workload as part of your Visual Studio installation.
In addition, you need to install the Microsoft Azure Service Fabric SDK and runtime using Web Platform Installer.

* [Install the Microsoft Azure Service Fabric SDK][core-sdk]

### To use Visual Studio 2015 (requires Visual Studio 2015 Update 2 or later)
For Visual Studio 2015, the Service Fabric tools are installed together with the SDK and runtime using the Web Platform Installer:

* [Install the Microsoft Azure Service Fabric SDK and Tools][full-bundle-vs2015]

### SDK installation only
If you only need the SDK, you can install this package:
* [Install the Microsoft Azure Service Fabric SDK][core-sdk]

The current versions are:
* Service Fabric SDK and Tools 3.4.641
* Service Fabric runtime 6.5.641
* Service Fabric Tools for Visual Studio 2015 2.5.20615.1
* Visual Studio 2017 15.9 includes Service Fabric Tools for Visual Studio 2.4.11024.1 

For a list of supported versions, see [Service Fabric versions](service-fabric-versions.md)

> [!NOTE]
> Single machine clusters (OneBox) are not supported for Application or Cluster upgrades; delete the OneBox cluster and recreate it if you need to perform a Cluster upgrade, or have any issues performing an Application upgrade. 

## Enable PowerShell script execution
Service Fabric uses Windows PowerShell scripts for creating a local development cluster and for deploying applications from Visual Studio. By default, Windows blocks these scripts from running. To enable them, you must modify your PowerShell execution policy. Open PowerShell as an administrator and enter the following command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Force -Scope CurrentUser
```
## Install Docker (optional)
[Service Fabric is a container orchestrator](service-fabric-containers-overview.md) for deploying microservices across a cluster of machines. To run Windows container applications on your local development cluster, you must first install Docker for Windows. Get [Docker CE for Windows (stable)](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description). After installing and starting Docker, right-click on the tray icon and select **Switch to Windows containers**. This step is required to run Docker images based on Windows.

## Next steps
Now that you've finished setting up your development environment, start building and running apps.

* [Learn how to create, deploy, and manage applications](service-fabric-tutorial-create-dotnet-app.md)
* [Learn about the programming models: Reliable Services and Reliable Actors](service-fabric-choose-framework.md)
* [Check out the Service Fabric code samples on GitHub](https://aka.ms/servicefabricsamples)
* [Visualize your cluster by using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[1]: https://azure.microsoft.com/campaigns/service-fabric/ "Service Fabric campaign page"
[2]: https://go.microsoft.com/fwlink/?LinkId=517106 "VS RC"
[full-bundle-vs2015]:https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-VS2015 "VS 2015 WebPI link"
[full-bundle-dev15]:https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-Dev15 "Dev15 WebPI link"
[core-sdk]:https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-CoreSDK "Core SDK WebPI link"
[powershell5-download]:https://www.microsoft.com/en-us/download/details.aspx?id=50395
