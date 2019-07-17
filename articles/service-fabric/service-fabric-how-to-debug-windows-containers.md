---
title: Debug Windows containers with Service Fabric and VS | Microsoft Docs
description: Learn how to debug Windows containers in Azure Service Fabric using Visual Studio 2019.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: msfussell
editor: ''
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/14/2019
ms.author: mikhegn
---
# How to: Debug Windows containers in Azure Service Fabric using Visual Studio 2019

With Visual Studio 2019, you can debug .NET applications in containers as Service Fabric services. This article shows you how to configure your environment and then debug a .NET application in a container running in a local Service Fabric cluster.

## Prerequisites

* On Windows 10, follow this quickstart to [Configure Windows 10 to run Windows containers](https://docs.microsoft.com/virtualization/windowscontainers/quick-start/quick-start-windows-10)
* On Windows Server 2016, follow this quickstart to [Configure Windows 2016 to run Windows containers](https://docs.microsoft.com/virtualization/windowscontainers/quick-start/quick-start-windows-server)
* Set up your local Service Fabric environment by following [Prepare your development environment on Windows](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started)

## Configure your developer environment to debug containers

1. Make sure the Docker for Window service is running before proceeding with the next step.

1. To support DNS resolution between containers, you'll have to set up your local development cluster, using the machine name. These steps are also necessary if you want to address services through the reverse proxy.
   1. Open PowerShell as administrator
   2. Navigate to the SDK Cluster setup folder, typically `C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup`.
   3. Run the script `DevClusterSetup.ps1`

      ``` PowerShell
        C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\DevClusterSetup.ps1
      ```

      > [!NOTE]
      > You can use the `-CreateOneNodeCluster` to setup a one-node cluster. The default will create a local five-node cluster.
      >

      To learn more about the DNS Service in Service Fabric, see [DNS Service in Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-dnsservice). To learn more about using Service Fabric reverse proxy from services running in a container, see [Reverse proxy special handling for services running in containers](service-fabric-reverseproxy.md#special-handling-for-services-running-in-containers).

### Known limitations when debugging containers in Service Fabric

Below is a list of known limitations with debugging containers in Service Fabric and possible resolutions:

* Using localhost for ClusterFQDNorIP won't support DNS resolution in containers.
    * Resolution: Set up the local cluster using machine name (see above)
* Running Windows10 in a Virtual Machine won't get DNS reply back to the container.
    * Resolution: Disable UDP checksum offload for IPv4 on the Virtual Machines NIC
    * Running Windows10 will degrade networking performance on the machine.
    * https://github.com/Azure/service-fabric-issues/issues/1061
* Resolving services in same application using DNS service name doesn't work on Windows10, if the application was deployed using Docker Compose
    * Resolution: Use servicename.applicationname to resolve service endpoints
    * https://github.com/Azure/service-fabric-issues/issues/1062
* If using IP-address for ClusterFQDNorIP, changing primary IP on the host will break DNS functionality.
    * Resolution: Recreate the cluster using the new primary IP on the host or use machine name. This breakage is by design.
* If the FQDN the cluster was created with isn't resolvable on the network, DNS will fail.
    * Resolution: Recreate the local cluster using the primary IP of the host. This failure is by design.
* When debugging a container, docker logs will only be available in the Visual Studio output window, not through Service Fabric APIs, including Service Fabric Explorer

## Debug a .NET application running in docker containers on Service Fabric

1. Run Visual Studio as an administrator.

1. Open an existing .NET application or create a new one.

1. Right-click the project and select **Add -> Container Orchestrator Support -> Service Fabric**

1. Press **F5** to start debugging the application.

    Visual Studio supports console and ASP.NET project types for .NET and .NET Core.

## Next steps
To learn more about the capabilities of Service Fabric and containers, see Service Fabric containers overview](service-fabric-containers-overview.md).
