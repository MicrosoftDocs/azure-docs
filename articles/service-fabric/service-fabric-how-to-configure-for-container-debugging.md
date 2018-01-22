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
ms.date: 01/19/2018
ms.author: mikhegn

---
# How to configure your developer environment to debug containers in Azure Service Fabric on Windows

Using the alpha pack of the Service Fabric Tools for Visual Stuido 2017, you can debug .NET applications running in containers running in Service Fabric on Windows 10. This article shows you how to configure your environment to support this scenario.

## Procedure for configuring Windows 10, Docker Community Edition for Windows and Service Fabric on Windows

1. Follow the guidelines in this article to [configure your Windows 10 computer to run Windows containers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/quick-start-windows-10)

1. Install the Service Fabric Tools for Visual Stuido 2017 Alpha Pack
    1. Download the alpha pack from here -  ----LINK----.
    1. Run the installer.
    1. When running the installer, choose the Visual Stuido 2017 instance to install the tool with. - What's supported?

1. Change you Docker Community Edition for Windows to expose the daemon without TLS
    1. Start Docker for Windows.
    1. Right-click the taskbar icon and select **Settings**.
    1. Check the **Expose daemon on tcp://localhost:2375 without TLS** chekc-box.

    > [!NOTE]
    > To ensure the security of your Windows 10 computer, make sure this port is blocked by your firewall.
    >
    >

1. Configure you local Service Fabric development cluster for Docker Community Edition for Windows
    1. Change the clustermanifest for you dev cluster, by navigating to the SDK folder **C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup** folder.
    1. In the folder hierarchy, you'll find four cluster manifest template files, ordered by the type of cluster you are using locally. The default configuration will use the manifest template from the this folder: **C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\NonSecure\OneNode**.
    1. For each of the relevant files, which you plan to use, add the following settings to the ClusterManifestTemplate file under the **properties/fabricSettings/"name": "Hosting"** paramters array:
        ```json
              {
                "name": "SkipDockerProcessManagement",
                "value": "true"
              },
              {
                "name": "ContainerHostAddress",
                "value": "http://localhost:2375"
              }
        ```

        The new configuration should look like this:
        ```json
          {
            "name": "Hosting",
            "parameters": [
              {
                "name": "SkipDockerProcessManagement",
                "value": "true"
              },
              {
                "name": "ContainerHostAddress",
                "value": "http://localhost:2375"
              },
        ```

    1. Reset or setup your local development cluster, using the configuration matching the confgiuration file you've changed.

## Next steps
To learn how to debug a .NET application in a container, see the [Debug a .NET application in Windows containers with Service Fabric](service-fabric-how-to-debug-containers.md).