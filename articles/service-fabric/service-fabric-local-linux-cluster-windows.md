---
title: Set up Azure Service Fabric Linux cluster on Windows 
description: This article covers how to set up Service Fabric Linux clusters running on Windows development machines. This approach is useful for cross platform development.  
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022

# Maintainer notes: Keep these documents in sync:
# service-fabric-get-started-linux.md
# service-fabric-get-started-mac.md
# service-fabric-local-linux-cluster-windows.md
# service-fabric-local-linux-cluster-windows-wsl2.md
---

# Set up a Linux Service Fabric cluster on your Windows developer machine

This document covers how to set up a local Linux Service Fabric cluster on a Windows development machine. Setting up a local Linux cluster is useful to quickly test applications targeted for Linux clusters but are developed on a Windows machine.

## Prerequisites
Linux-based Service Fabric clusters do not run on Windows, but to enable cross-platform prototyping we have provided a Linux Service Fabric one box cluster docker container, which may be deployed via Docker for Windows.

Before you get started, you need:

* At least 4-GB RAM
* Latest version of [Docker for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows)
* Docker must be running in Linux containers mode

>[!TIP]
> To install Docker on your Windows machine, follow the steps in the [Docker documentation](https://store.docker.com/editions/community/docker-ce-desktop-windows/plans/docker-ce-desktop-windows-tier?tab=instructions). After installing, [verify your installation](https://docs.docker.com/docker-for-windows/#check-versions-of-docker-engine-compose-and-machine).
>

## Create a local container and setup Service Fabric
To set up a local Docker container and have a Service Fabric cluster running on it, run the following steps:


1. Update the Docker daemon configuration on your host with the following and restart the Docker daemon: 

    ```json
    {
      "ipv6": true,
      "fixed-cidr-v6": "2001:db8:1::/64"
    }
    ```
    The advised way to update is to go to: 

    * Docker Icon > Settings > Docker Engine
    * Add the new fields listed above
    * Apply & Restart - restart the Docker daemon for the changes to take effect.

2. Start the cluster via PowerShell.<br/>
    <b>Ubuntu 20.04 LTS:</b>
    ```bash
    docker run --name sftestcluster -d -v /var/run/docker.sock:/var/run/docker.sock -p 19080:19080 -p 19000:19000 -p 25100-25200:25100-25200 mcr.microsoft.com/service-fabric/onebox:u20
    ```

    <b>Ubuntu 18.04 LTS:</b>
    ```powershell
    docker run --name sftestcluster -d -v /var/run/docker.sock:/var/run/docker.sock -p 19080:19080 -p 19000:19000 -p 25100-25200:25100-25200 mcr.microsoft.com/service-fabric/onebox:u18
    ```

    >[!TIP]
    > By default, this will pull the image with the latest version of Service Fabric. For particular revisions, see the [Service Fabric Onebox](https://hub.docker.com/_/microsoft-service-fabric-onebox) page on Docker Hub.



3. Optional: Build your extended Service Fabric image.

    In a new directory, create a file called `Dockerfile` to build your customized image:

    >[!NOTE]
    >You can adapt the image above with a Dockerfile to add additional programs or dependencies into your container.
    >For example, adding `RUN apt-get install nodejs -y` will allow support for `nodejs` applications as guest executables.
    ```Dockerfile
    FROM mcr.microsoft.com/service-fabric/onebox:u18
    RUN apt-get install nodejs -y
    EXPOSE 19080 19000 80 443
    WORKDIR /home/ClusterDeployer
    CMD ["./ClusterDeployer.sh"]
    ```
    
    >[!TIP]
    > By default, this will pull the image with the latest version of Service Fabric. For particular revisions, please visit the [Docker Hub](https://hub.docker.com/r/microsoft/service-fabric-onebox/) page.

    To build your reusable image from the `Dockerfile`, open a terminal and `cd` to the directly holding your `Dockerfile` then run:

    ```powershell 
    docker build -t mysfcluster .
    ```
    
    >[!NOTE]
    >This operation will take some time but is only needed once.

    Now you can quickly start a local copy of Service Fabric whenever you need it by running:

    ```powershell 
    docker run --name sftestcluster -d -v /var/run/docker.sock:/var/run/docker.sock -p 19080:19080 -p 19000:19000 -p 25100-25200:25100-25200 mysfcluster
    ```

    >[!TIP]
    >Provide a name for your container instance so it can be handled in a more readable manner. 
    >
    >If your application is listening on certain ports, the ports must be specified by using additional `-p` tags. For example, if your application is listening on port 8080, add the following `-p` tag:
    >
    >`docker run -itd -p 19000:19000 -p 19080:19080 -p 8080:8080 --name sfonebox mcr.microsoft.com/service-fabric/onebox:u18`
    >


4. The cluster will take a short amount of time to start, you can view logs using the following command or jump to the dashboard to view the clusters health `http://localhost:19080`:

    ```powershell 
    docker logs sftestcluster
    ```

5. After the cluster is deployed successfully as observed in step 4, you can go to ``http://localhost:19080`` from your Windows machine to find the Service Fabric Explorer dashboard. At this point, you can connect to this cluster using tools from your Windows developer machine and deploy applications targeted for Linux Service Fabric clusters. 

    > [!NOTE]
    > The Eclipse plugin is currently not supported on Windows. 

6. When you are done, stop and clean up the container with this command:

    ```powershell 
    docker rm -f sftestcluster
    ```

### Known Limitations 
 
 The following are known limitations of the local cluster running in a container for Mac's: 
 
 * DNS service does not run and is currently not supported within the container. [Issue #132](https://github.com/Microsoft/service-fabric/issues/132)
 * Running container-based apps requires running SF on a Linux host. Nested container applications are currently not supported.

## Next steps
* [Set up a Linux cluster on Windows via WSL2](service-fabric-local-linux-cluster-windows-wsl2.md)
* [Create and deploy your first Service Fabric Java application on Linux using Yeoman](service-fabric-create-your-first-linux-application-with-java.md)
* Get started with [Eclipse](./service-fabric-get-started-eclipse.md)
* Check out other [Java samples](https://github.com/Azure-Samples/service-fabric-java-getting-started)
* Learn about [Service Fabric support options](service-fabric-support.md)


<!-- Image references -->

[publishdialog]: ./media/service-fabric-manage-multiple-environment-app-configuration/publish-dialog-choose-app-config.png
[app-parameters-solution-explorer]:./media/service-fabric-manage-multiple-environment-app-configuration/app-parameters-in-solution-explorer.png
