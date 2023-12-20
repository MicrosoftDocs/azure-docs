---
title: Set up a Windows development environment
description: Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications on Windows.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 03/02/2023
---

# Prepare your development environment on Windows

> [!div class="op_single_selector"]
> * [Windows](service-fabric-get-started.md) 
> * [Linux](service-fabric-get-started-linux.md)
> * [Mac OS X](service-fabric-get-started-mac.md)
>
>

To build and run [Azure Service Fabric applications][1] on your Windows development machine, install the Service Fabric runtime, SDK, and tools. You also need to [enable execution of the Windows PowerShell scripts](#enable-powershell-script-execution) included in the SDK.

## Prerequisites

Ensure you are using a supported [Windows version](service-fabric-versions.md#supported-windows-versions-and-support-end-date).

## Install the SDK and tools
> [!NOTE]
> WebPI used previously for SDK/Tools installation was deprecated on July 1 2022 

For latest Runtime and SDK you can download from below:

| Package |Version|
| --- | --- |
|[Install Service Fabric Runtime for Windows](https://download.microsoft.com/download/b/8/a/b8a2fb98-0ec1-41e5-be98-9d8b5abf7856/MicrosoftServiceFabric.10.0.1949.9590.exe) | 10.0.1949.9590 |
|[Install Service Fabric SDK](https://download.microsoft.com/download/b/8/a/b8a2fb98-0ec1-41e5-be98-9d8b5abf7856/MicrosoftServiceFabricSDK.7.0.1949.msi) | 7.0.1949 |

You can find direct links to the installers for previous releases on [Service Fabric Releases](https://github.com/microsoft/service-fabric/tree/master/release_notes)

For supported versions, see [Service Fabric versions](service-fabric-versions.md)

> [!NOTE]
> Single machine clusters (OneBox) are not supported for Application or Cluster upgrades; delete the OneBox cluster and recreate it if you need to perform a Cluster upgrade, or have any issues performing an Application upgrade.

### To use Visual Studio 2017 or 2019 

The Service Fabric Tools are part of the Azure Development workload in Visual Studio 2019 and 2017. Enable this workload as part of your Visual Studio installation. In addition, you need to install the Microsoft Azure Service Fabric SDK and runtime as described above [Install the SDK and tools](#install-the-sdk-and-tools)

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
* [Check out the Service Fabric code samples on GitHub](/samples/browse/?products=azure)
* [Visualize your cluster by using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
* [Prepare a Linux development environment on Windows](service-fabric-local-linux-cluster-windows.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[1]: https://azure.microsoft.com/campaigns/service-fabric/ "Service Fabric campaign page"
[2]: https://go.microsoft.com/fwlink/?LinkId=517106 "VS RC"
[full-bundle-vs2015]:https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-VS2015 "VS 2015 WebPI link"
[full-bundle-dev15]:https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-Dev15 "Dev15 WebPI link"
[core-sdk]:https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-CoreSDK "Core SDK WebPI link"
[powershell5-download]:https://www.microsoft.com/download/details.aspx?id=54616
