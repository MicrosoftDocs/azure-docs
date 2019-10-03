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
* Docker must be running on Linux mode

>[!TIP]
> * You can follow the steps mentioned in the official Docker [documentation](https://store.docker.com/editions/community/docker-ce-desktop-windows/plans/docker-ce-desktop-windows-tier?tab=instructions) to install Docker on your Windows. 
> * Once you are done installing, validate if it got installed properly following the steps mentioned [here](https://docs.docker.com/docker-for-windows/#check-versions-of-docker-engine-compose-and-machine)


## Create a local container and setup Service Fabric
To set up a local Docker container and have a service fabric cluster running on it, perform the following steps in PowerShell:


1. Update the Docker daemon configuration on your host with the following and restart the Docker daemon: 

    ```json
    {
      "ipv6": true,
      "fixed-cidr-v6": "2001:db8:1::/64"
    }
    ```
    The advised way to update is - go to Docker Icon > Settings > Daemon > Advanced and update it there. Next, restart the Docker daemon for the changes to take effect. 

2. In a new directory create a file called `Dockerfile` to build your Service Fabric Image:

    ```Dockerfile
    FROM microsoft/service-fabric-onebox
    WORKDIR /home/ClusterDeployer
    RUN ./setup.sh
    #Generate the local
    RUN locale-gen en_US.UTF-8
    #Set environment variables
    ENV LANG=en_US.UTF-8
    ENV LANGUAGE=en_US:en
    ENV LC_ALL=en_US.UTF-8
    EXPOSE 19080 19000 80 443
    #Start SSH before running the cluster
    CMD /etc/init.d/ssh start && ./run.sh
    ```

    >[!NOTE]
    >You can adapt this file to add additional programs or dependencies into your container.
    >For example, adding `RUN apt-get install nodejs -y` will allow support for `nodejs` applications as guest executables.
    
    >[!TIP]
    > By default, this will pull the image with the latest version of Service Fabric. For particular revisions, please visit the [Docker Hub](https://hub.docker.com/r/microsoft/service-fabric-onebox/) page

3. To build your reusable image from the `Dockerfile` open a terminal and `cd` to the directly holding your `Dockerfile` then run:

    ```powershell 
    docker build -t mysfcluster .
    ```
    
    >[!NOTE]
    >This operation will take some time but is only needed once.

4. Now you can quickly start a local copy of Service Fabric, whenever you need it, by running:

    ```powershell 
    docker run --name sftestcluster -d -v //var/run/docker.sock:/var/run/docker.sock -p 19080:19080 -p 19000:19000 -p 25100-25200:25100-25200 mysfcluster
    ```

    >[!TIP]
    >Provide a name for your container instance so it can be handled in a more readable manner. 
    >
    >If your application is listening on certain ports, the ports must be specified by using additional `-p` tags. For example, if your application is listening on port 8080, add the following `-p` tag:
    >
    >`docker run -itd -p 19080:19080 -p 8080:8080 --name sfonebox microsoft/service-fabric-onebox`
    >

5. The cluster will take a short amount of time to start, you can view logs using the following command or jump to the dashboard to view the clusters health [http://localhost:19080](http://localhost:19080):

    ```powershell 
    docker logs sftestcluster
    ```

6. After step 5 is completed successfully, you can go to ``http://localhost:19080`` from your Windows and you would be able to see the Service Fabric explorer. At this point, you can connect to this cluster using any tools from your Windows developer machine and deploy application targeted for Linux Service Fabric clusters. 

    > [!NOTE]
    > The Eclipse plugin is currently not supported on Windows. 

7. When you are done, stop and cleanup the container with this command:

    ```powershell 
    docker rm -f sftestcluster
    ```

### Known Limitations 
 
 The following are known limitations of the local cluster running in a container for Mac's: 
 
 * DNS service does not run and is not supported [Issue #132](https://github.com/Microsoft/service-fabric/issues/132)

## Next steps
* Get started with [Eclipse](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-eclipse)
* Check out other [Java samples](https://github.com/Azure-Samples/service-fabric-java-getting-started)


<!-- Image references -->

[publishdialog]: ./media/service-fabric-manage-multiple-environment-app-configuration/publish-dialog-choose-app-config.png
[app-parameters-solution-explorer]:./media/service-fabric-manage-multiple-environment-app-configuration/app-parameters-in-solution-explorer.png
