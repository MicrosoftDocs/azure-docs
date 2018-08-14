---
title: Set up a Windows development environment to build Service Fabric Mesh apps | Microsoft Docs
description: Set up your Windows development environment so you can create a Service Fabric Mesh application and deploy it to Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords:  
author: tylermsft
ms.author: twhitney
ms.date: 08/08/2018
ms.topic: get-started-article
ms.service: service-fabric-mesh
manager: jeconnoc
#Customer intent: As a developer, I need to install the prerequisites to enable service fabric mesh development in visual studio.
---

# Set up your Windows development environment to build Service Fabric Mesh apps

To build and run Azure Service Fabric Mesh applications on your Windows development machine, install the Service Fabric Mesh runtime, SDK, and tools.

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Supported operating system versions

The following operating system versions are supported for development:

* Windows 10 (Enterprise, Professional, or Education)
* Windows Server 2016

## Visual Studio

Visual Studio 2017 is required to deploy Service Fabric Mesh applications. [Install version 15.6.0][download-visual-studio] or greater and enable the following workloads:

* ASP.NET and web development
* Azure Development

## Install Docker

#### Windows 10

Download and install the latest version of [Docker Community Edition for Windows][download-docker] to support the containerized Service Fabric apps used by Service Fabric Mesh.

During installation, select **Use Windows containers instead of Linux containers** when asked.

If Hyper-V is not enabled on your machine, Docker's installer will offer to enable it. Click **OK** to do so if prompted.

#### Windows Server 2016

If you don't have the Hyper-V role enabled, open PowerShell as an administrator and run the following command to enable Hyper-V, and then restart your computer. For more information, see [Docker Enterprise Edition for Windows Server][download-docker-server].

```powershell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools
```

Restart your computer.

Open PowerShell as an administrator and run the following commands to install Docker:

```powershell
Install-Module DockerMsftProvider -Force
Install-Package Docker -ProviderName DockerMsftProvider -Force
Install-WindowsFeature Containers
```

## SDK and tools

Install the Service Fabric Mesh runtime, SDK, and tools in the following order.

1. Install the [Service Fabric Mesh SDK][download-sdkmesh] using Web Platform Installer. This will also install the Microsoft Azure Service Fabric SDK and runtime.
2. Install the [Visual Studio Service Fabric Tools (preview) extension][download-tools] from Visual Studio Marketplace.

## Build a cluster

If you are using Visual Studio, you can skip this section because Visual Studio will create a local cluster for you if you don't have one.

For the best debugging performance when you create and run Service Fabric apps, we recommend creating a single-node local development cluster. This cluster must be running whenever you deploy or debug a Service Fabric Mesh project.

Docker **must** be running before you can build a cluster. Test that Docker is running by opening a terminal window and running `docker ps` to see if an error occurs. If the response does not indicate an error, Docker is running and you're ready to build a cluster.

After you install the runtime, SDKs, and Visual Studio tools, create a development cluster.

1. Close your PowerShell window.
2. Open a new, elevated PowerShell window as an administrator. This step is necessary to load the Service Fabric modules that were recently installed.
3. Run the following PowerShell command to create a development cluster:

    ```powershell
    . "C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\DevClusterSetup.ps1" -CreateOneNodeCluster -UseMachineName
    ```

4. To start the local cluster manager tool, run the following PowerShell command:

    ```powershell
    . "C:\Program Files\Microsoft SDKs\Service Fabric\Tools\ServiceFabricLocalClusterManager\ServiceFabricLocalClusterManager.exe"
    ```

You're now ready to create Service Fabric Mesh applications!

## Next steps

Read through the [Create an Azure Service Fabric app](service-fabric-mesh-tutorial-create-dotnetcore.md) tutorial.

[azure-cli-install]: https://docs.microsoft.com/cli/azure/install-azure-cli
[download-docker]: https://store.docker.com/editions/community/docker-ce-desktop-windows
[download-docker-server]: https://docs.docker.com/install/windows/docker-ee/
[download-runtime]: https://aka.ms/sfruntime
[download-sdk]: https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-CoreSDK
[download-sdkmesh]: https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-SDK-Mesh
[download-tools]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.ServiceFabricMesh
[download-visual-studio]: https://www.visualstudio.com/downloads/