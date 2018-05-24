---
title: Setup new Windows environment for Service Fabric Mesh on Azure
description: Details all of the prerequisites required to create a Service Fabric Application to deploy to Azure Service Fabric Mesh.
services: Azure Service Fabric Mesh
keywords: 
author: thraka
ms.author: adegeo
ms.date: 05/24/2018
ms.topic: get-started-article
ms.service: service-fabric-mesh
manager: timlt
#Customer intent: As a developer, I need to prepare install the prerequisites to enable service fabric mesh development in visual studio.
---

# Setup your Windows environment for Service Fabric Mesh

To build and run Azure Service Fabric applications on your Windows development machine, install the Service Fabric runtime, SDK, and tools. You also need to enable use of the Windows PowerShell scripts.

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Supported operating system versions
The following operating system versions are supported for development:

* Windows 10 (Enterprise, Professional, or Education)
* Windows Server 2016

## Enable PowerShell script execution

Service Fabric uses Windows PowerShell scripts for creating a local development cluster and for deploying applications from Visual Studio. By default, Windows blocks these scripts from running. To enable them, you must modify your PowerShell execution policy. Open PowerShell as an administrator and enter the following command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Force -Scope CurrentUser
```

## Visual Studio

Deploying Service Fabric Applications to Service Fabric Mesh requires Visual Studio 2017. [Install version 15.6.0][download-visual-studio] or greater and enable the following workloads:

- ASP.NET and Web Development
- Azure Development

## Docker

You'll need to install Docker to support the containerized Service Fabric applications used by Service Fabric Mesh.

If you're installing Docker on **Windows Server 2016**, use the following PowerShell commands to install Docker. For more information, see [Docker Enterprise Edition for Windows Server][download-docker-server].

```powershell
Install-Module DockerMsftProvider -Force
Install-Package Docker -ProviderName DockerMsftProvider -Force

# The -Restart parameter will automatically restart your computer if needed.
Install-WindowsFeature Containers -Restart
```

If you're installing Docker for **Windows 10**, install the latest version of [Docker Community Edition for Windows][download-docker]. During the installation, select **Use Windows containers instead of Linux containers** when asked. You'll be required to log off and log back in. After logging back in, you may be prompted to enable Hyper-V, enable it. When you enable Hyper-V, you'll have to restart your computer.

## SDK and tools

Install the SDK and Visual Studio tools to create new Service Fabric Applications. Currently, you must remove any existing Service Fabric runtime and SDK from your system. Service Fabric Mesh components can't be installed alongside the current Service Fabric components.

1. Install the [Service Fabric Runtime][download-runtime] with the **/AcceptEULA** flag on the command line.
2. Install the [Service Fabric SDK][download-sdk].
3. Install the [Service Fabric Mesh SDK][download-sdkmesh].
4. Install the [Visual Studio Service Fabric Tools (preview)][download-tools].

# Build a cluster

To create and run Service Fabric applications, you must have a single-node local development cluster. This cluster must be running whenever you use Visual Studio with a Service Fabric Mesh project. 

Docker **must** be running before you can build a cluster. Test that Docker is running by opening a terminal window and running `docker ps` to see if an error occurs. If the response does not indicate an error, Docker is running and you're ready to build a cluster.

After you install the SDK and Visual Studio tools, create a development cluster. Open a **new**, **elevated**, PowerShell window and run the following PowerShell commands:

```powershell
# Create a single-node local cluster
"C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\DevClusterSetup.ps1" -CreateOneNodeCluster -UseMachineName

# Start the local cluster manager
"C:\Program Files\Microsoft SDKs\Service Fabric\Tools\ServiceFabricLocalClusterManager\ServiceFabricLocalClusterManager.exe"
```

## Next steps

Read through the [Create a .NET Core app to Service Fabric Mesh](service-fabric-mesh-tutorial-create-dotnetcore.md) tutorial.

[download-docker]: https://store.docker.com/editions/community/docker-ce-desktop-windows
[download-docker-server]: https://docs.docker.com/install/windows/docker-ee/
[download-runtime]: http://aka.ms/sfruntime
[download-sdk]: http://aka.ms/sfsdk
[download-sdkmesh]: http://aka.ms/sfmeshsdk
[download-tools]: https://aka.ms/sfapptools
[download-visual-studio]: https://www.visualstudio.com/downloads/