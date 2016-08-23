<properties
   pageTitle="Set up your development environment | Microsoft Azure"
   description="Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications."
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="06/16/2016"
   ms.author="ryanwi"/>

# Prepare your development environment
 To build and run [Azure Service Fabric applications][1] on your development machine, install the runtime, SDK, and tools. You also need to enable execution of the Windows PowerShell scripts included in the SDK.

## Prerequisites
### Supported operating system versions
The following operating system versions are supported for development:

- Windows 7
- Windows 8/Windows 8.1
- Windows Server 2012 R2
- Windows 10

>[AZURE.NOTE] Windows 7 only includes Windows PowerShell 2.0 by default. Service Fabric PowerShell cmdlets requires PowerShell 3.0 or higher. You can [download Windows PowerShell 5.0][powershell5-download] from the Microsoft Download Center.

## Install the runtime, SDK, and tools

The Web Platform Installer offers three configurations for Service Fabric development:

- [Install the Service Fabric runtime, SDK, and tools for Visual Studio 2015 Update 2][full-bundle-vs2015]
- [Install the Service Fabric runtime, SDK, and tools for Visual Studio "15" Preview][full-bundle-dev15]
- [Install the Service Fabric runtime and SDK only (no Visual Studio tools)][core-sdk]


## Enable PowerShell script execution

Service Fabric uses Windows PowerShell scripts for creating a local development cluster and for deploying applications from Visual Studio. By default, Windows blocks these scripts from running. To enable them, you must modify your PowerShell execution policy. Open PowerShell as an administrator and enter the following command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Force -Scope CurrentUser
```

## Next steps
Now that you've finished setting up your development environment, start building and running apps.

- [Create your first Service Fabric application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md)
- [Learn how to deploy and manage applications on your local cluster](service-fabric-get-started-with-a-local-cluster.md)
- [Learn about the programming models: Reliable Services and Reliable Actors](service-fabric-choose-framework.md)
- [Check out the Service Fabric code samples on GitHub](https://aka.ms/servicefabricsamples)
- [Visualize your cluster by using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
- [Follow the Service Fabric learning path to get a broad introduction to the platform](https://azure.microsoft.com/documentation/learning-paths/service-fabric/)

[1]: http://azure.microsoft.com/en-us/campaigns/service-fabric/ "Service Fabric campaign page"
[2]: http://go.microsoft.com/fwlink/?LinkId=517106 "VS RC"
[full-bundle-vs2015]:http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-VS2015-2_1 "VS 2015 WebPI link"
[full-bundle-dev15]:http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-Dev15-2_1 "Dev15 WebPI link"
[core-sdk]:http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=ServiceFabricSDK_2_1 "Core SDK WebPI link"
[powershell5-download]:https://www.microsoft.com/en-us/download/details.aspx?id=50395
