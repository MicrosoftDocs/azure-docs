---
title: How to configure your developer environment to debug containers with Azure Service Fabric and Visual Studio 2017 | Microsoft Docs
description: Shows you how to configure your developer environment to debug containers in Azure Service Fabric and Visual Studio 2017
documentationcenter: .net
author: mikkelhegn
manager: msfussell
editor: ''

ms.service: service-fabric

ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA

ms.workload: NA
ms.date: 05/14/2018
ms.author: mikhegn

---
# How to configure your developer environment to debug containers in Azure Service Fabric on Windows

With Visual Studio 2017 Update 7 (15.7), you can debug .NET applications in containers as Service Fabric services. This article shows you how to configure your environment for this scenario.

## Procedure for configuring Windows to run docker contaienrs with Service Fabric

1. Follow the guidelines on this page to [configure your Windows computer to run Windows containers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start)
> [!NOTE]
> Both Windows 10 and Windows Server 2016 are supported.
>

1. Set up your local Service Fabric environment following these instructions: [Prepare your development environment on Windows](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started)

1. Make sure the Docker for Window service is running before proceeding with the next step.

1. In order to support DNS resolution between containers, you will have to set up your local development cluster, using the machine name.
    1. Open PowerShell as administrator
    1. Navigate to the SDK Cluster setup folder, typically `C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup`
    1. Run the script `DevClusterSetup.ps1` with the parameter `-UseMachineName`

    ``` PowerShell
      C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\DevClusterSetup.ps1 -UseMachineName
    ```

    > [!NOTE]
    > You can use the `-CreateOneNodeCluster` to setup a one-node cluster. The default will create a local five-node cluster.
    >

    > [!NOTE]
    > To learn more about the DNS Service in Service Fabric see here: [DNS Service in Azure Service Fabric](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-dnsservice)
    >

## Known limitations with the Service Fabric DNS Service

The below is a list of known issue with the DNS Service in Service Fabric:

1.	Using localhost for ClusterFQDNotIP will not support DNS resolution in containers
    -	Resolution: Setup the local cluster using machine name (see above)
1.	Running Windows10 in a Virutal Machine will not get DNS reply back to the container 
    -	Resolution: Disable UDP checksum offload for IPv4 on the Virtual Machines NIC
1.	Resolving services in same application using service name does not work 
    - Resolution: Use servicename.applicationinstancename to resolve service endpoints
1.	If using IP-address for ClusterFQDNorIP, changing primary IP on the host will break functionality 
    - Resolution: Recreate the cluster using the new primary IP on the host or use machine name
1.	If the FQDN machine name the cluster was created with is not resolvable on the network, DNS will fail 
    -	Resolution: Recreate the local cluster using the primary IP of the host

## Next steps
To learn how to debug a .NET application in a container, see the [Debug a .NET application in Windows containers with Service Fabric](service-fabric-how-to-debug-containers.md).