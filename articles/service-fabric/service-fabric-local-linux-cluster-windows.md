---
title: Set up Azure Service Fabric Linux cluster on Windows | Microsoft Docs
description: This article covers how to set up Service Fabric Linux clusters running on Windows development machines. This is particularly useful for cross platform development.  
services: service-fabric
documentationcenter: .net
author: suhuruli
manager: mfussell
editor: ''

ms.assetid: bf84458f-4b87-4de1-9844-19909e368deb
ms.service: service-fabric
ms.devlang: java
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/20/2017
ms.author: suhuruli

---
# Set up a Linux Service Fabric cluster on your Windows developer machine

This document covers how to set up a local Linux Service Fabric on Windows development machines. Setting up a local Linux cluster is useful to quickly test applications targeted for Linux clusters but are developed on a Windows machine.

## Prerequisites
Linux-based Service Fabric clusters do not run natively on Windows. To run a local Service Fabric cluster, a pre-configured Docker container image is provided. Before you get started, you need:

* At least 4-GB RAM
* Latest version of [Docker](https://store.docker.com/editions/community/docker-ce-desktop-windows)

>[!TIP]
> * You can follow the steps mentioned in the official Docker [documentation](https://store.docker.com/editions/community/docker-ce-desktop-windows/plans/docker-ce-desktop-windows-tier?tab=instructions) to install Docker on your Windows. 
> * Once you are done installing, validate if it got installed properly following the steps mentioned [here](https://docs.docker.com/docker-for-windows/#check-versions-of-docker-engine-compose-and-machine)


## Create a local container and setup Service Fabric
To set up a local Docker container and have a service fabric cluster running on it, perform the following steps in PowerShell:

1. Pull the image from Docker hub repository:

    ```powershell
    docker pull microsoft/service-fabric-onebox
    ```

2. Update the Docker daemon configuration on your host with the following and restart the Docker daemon: 

    ```json
    {
      "ipv6": true,
      "fixed-cidr-v6": "2001:db8:1::/64"
    }
    ```
    The advised way to update is - go to Docker Icon > Settings > Daemon > Advanced and update it there. Next, restart the Docker daemon for the changes to take effect. 

3. Start a Service Fabric One-box container instance with the image:

    ```powershell
    docker run -itd -p 19080:19080 --name sfonebox microsoft/service-fabric-onebox
    ```
    >[!TIP]
    > * By specifying a name for your container instance, you can handle it in a more readable manner. 
    > * If your application is listening on certain ports, it must be specified using additional -p tags. For example, if your application is listening on port 8080, run docker run -itd -p 19080:19080 -p 8080:8080 --name sfonebox microsoft/service-fabric-onebox

4. Log in to the Docker container in interactive ssh mode:

    ```powershell
    docker exec -it sfonebox bash
    ```

5. Run the setup script, that will fetch the required dependencies and after that start the cluster on the container.

    ```bash
    ./setup.sh     # Fetches and installs the dependencies required for Service Fabric to run
    ./run.sh       # Starts the local cluster
    ```

6. After step 5 is completed successfully, you can go to ``http://localhost:19080`` from your Windows and you would be able to see the Service Fabric explorer. At this point, you can connect to this cluster using any tools from your Windows developer machine and deploy application targeted for Linux Service Fabric clusters. 

    > [!NOTE]
    > The Eclipse plugin is currently not supported on Windows. 

## Next steps
* Get started with [Eclipse](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-eclipse)
* Check out other [Java samples](https://github.com/Azure-Samples/service-fabric-java-getting-started)


<!-- Image references -->

[publishdialog]: ./media/service-fabric-manage-multiple-environment-app-configuration/publish-dialog-choose-app-config.png
[app-parameters-solution-explorer]:./media/service-fabric-manage-multiple-environment-app-configuration/app-parameters-in-solution-explorer.png