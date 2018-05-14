---
title: Setup new Windows environment for Service Fabric Mesh on Azure
description: Details all of the prerequisites required to create a Service Fabric Application to deploy to Azure Service Fabric Mesh.
services: Azure Service Fabric Mesh
keywords: 
author: thraka
ms.author: adegeo
ms.date: 05/04/2018
ms.topic: get-started-article
ms.service: service-fabric-mesh
manager: timlt
#Customer intent: As a developer, I need to prepare install the prerequisites to enable service fabric mesh development in visual studio.
---

# Setup your Windows environment for Service Fabric Mesh

To build and run Azure Service Fabric applications on your Windows development machine, install the Service Fabric runtime, SDK, and tools. You also need to enable execution of the Windows PowerShell scripts included in the SDK.

|     |
| --- |
| Service Fabric Mesh is in currently in preview, and only supports the **East US** region. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). |

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

Deploying Service Fabric Applications to Service Fabric Mesh requires Visual Studio 2017. Install version 15.6.0 or greater and enable the following workloads:

- ASP.NET and Web Development
- Azure Development

## Docker

You'll need to install Docker to support the containerized Service Fabric applications used by Service Fabric Mesh.

If you're installing Docker on **Windows Server 2016**, use the following PowerShell commands to install Docker. For more information, see [Docker Enterprise Edition for Windows Server][download-docker-server].

```powershell
Install-Module DockerMsftProvider -Force
Install-Package Docker -ProviderName DockerMsftProvider -Force

# This next command will restart the server if needed
Install-WindowsFeature Containers -Restart
```

If you're installing Docker for **Windows 10**, install the latest version of [Docker Community Edition for Windows][download-docker]. During the installation, select **Use Windows containers instead of Linux containers** when asked. You'll be required to log off and log back in. After logging back in, you may be prompted to enable Hyper-V, enable it. When you enable Hyper-V, you'll have to restart your computer.

## SDK and tools

Install the SDK and Visual Studio tools to create new Service Fabric Applications. Currently, you must remove any existing Service Fabric runtime and SDK from your system. Service Fabric Mesh components can't be installed alongside the current Service Fabric components.

1. If necessary, remove any existing Service Fabric SDK and runtime.
2. Install the [Service Fabric Mesh Runtime][download-runtime] with the **/AcceptEULA** flag on the command line.
5. Install the [Service Fabric Mesh SDK][download-sdk].
3. Install the [Visual Studio Service Fabric Mesh tools][download-tools].
4. Open a **new** elevated PowerShell window and run  
`"C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\DevClusterSetup.ps1" -CreateOneNodeCluster -UseMachineName`
5. (Optional) Start the local Cluster Manager tool:  
`"C:\Program Files\Microsoft SDKs\Service Fabric\Tools\ServiceFabricLocalClusterManager\ServiceFabricLocalClusterManager.exe"`
6. Reboot your computer.

## Next steps

Read through the [Deploy a .NET Core app to Service Fabric Mesh](service-fabric-mesh-tutorial-deploy-dotnetcore.md) tutorial.

[download-docker]: https://store.docker.com/editions/community/docker-ce-desktop-windows
[download-docker-server]: https://docs.docker.com/install/windows/docker-ee/
[download-runtime]: http://aka.ms/meshdlruntime
[download-sdk]: http://aka.ms/meshdlsdk
[download-tools]: https://aka.ms/sfapptools
[powershell5-download]: https://www.microsoft.com/download/details.aspx?id=50395