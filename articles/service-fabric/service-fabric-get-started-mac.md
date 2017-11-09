---
title: Set up your development environment on Mac OS X to work with Azure Service Fabric| Microsoft Docs
description: Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications on Mac OS X.
services: service-fabric
documentationcenter: java
author: sayantancs
manager: timlt
editor: ''

ms.assetid: bf84458f-4b87-4de1-9844-19909e368deb
ms.service: service-fabric
ms.devlang: java
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/31/2017
ms.author: saysa

---
# Set up your development environment on Mac OS X
> [!div class="op_single_selector"]
> * [Windows](service-fabric-get-started.md)
> * [Linux](service-fabric-get-started-linux.md)
> * [OSX](service-fabric-get-started-mac.md)
>
>  

You can build Service Fabric applications to run on Linux clusters using Mac OS X. This article covers how to set up your Mac for development.

## Prerequisites
Service Fabric does not run natively on OS X. To run a local Service Fabric cluster, we provide a pre-configured Docker container image. Before you get started, you need:

* At least 4 GB RAM
* Latest version of [Docker](https://www.docker.com/)
* Access to Service Fabric One-box Docker container [image](https://hub.docker.com/r/servicefabricoss/service-fabric-onebox/)

>[!TIP]
> * You can follow the steps mentioned in the official Docker [documentation](https://docs.docker.com/docker-for-mac/install/#what-to-know-before-you-install) to install Docker on your Mac. 
> * Once you are done installing, validate if it got installed properly following the steps mentioned [here](https://docs.docker.com/docker-for-mac/#check-versions-of-docker-engine-compose-and-machine)

## Setup IPv6 in the host

Update the docker daemon on the Mac so that it is configured for IPv6. This is achieved by updating the `daemon.json` file by appending the two entries as follows:

    ```json
    {
    "ipv6": true,
    "fixed-cidr-v6": "fd00::/64"
    }
    ```

The `daemon.json` file location is either `/etc/docker/daemon.json` or under your user directory at `~/.docker/daemon.json. You will have to restart the docker daemon after the change to the config by running :wq!


## Create a local container and setup Service Fabric
To setup a local Docker container and have a service fabric cluster running on it, perform the following steps:

1. Pull the image from Docker hub repository:

    ```bash
    docker pull servicefabricoss/service-fabric-onebox
    ```

2. Start a Service Fabric One-box container instance with the image:

    ```bash
    docker run -itd -p 19080:19080 --name sfonebox servicefabricoss/service-fabric-onebox
    ```
    >[!TIP]
    >By specifying a name for your container instance, you can handle it in a more readable manner. 

3. Login to the Docker container in interactive ssh mode:

    ```bash
    docker exec -it sfonebox bash
    ```

4. Run the setup script, that will fetch the required dependencies and after that start the cluster on the container.

    ```bash
    ./setup.sh     # Fetches and installs the dependencies required for Service Fabric to run
    ./run.sh       # Starts the local cluster
    ```

5. After step 4 is completed successfully, you can go to ``http://localhoist:19080`` from your Mac and you would be able to see the Service Fabric explorer.


## Set up the Service Fabric CLI (sfctl) on your Mac

Follow the instructions at [Service Fabric CLI](service-fabric-cli.md#cli-mac) to install the Service Fabric CLI (`sfctl`) on your Mac.
The CLI commands for interacting with Service Fabric entities, including clusters, applications, and services.

## Create application on your Mac using Yeoman

Service Fabric provides scaffolding tools, which helps you create a Service Fabric application from terminal using Yeoman template generator. Follow the steps below to ensure you have the Service Fabric yeoman template generator working on your machine.

1. You need to have Node.js and NPM installed on your Mac. If not, you can install Node.js and NPM using Homebrew using the following step. To check the versions of Node.js and NPM installed on your Mac, you can use the ``-v`` option.

    ```bash
    brew install node
    node -v
    npm -v
    ```
2. Install [Yeoman](http://yeoman.io/) template generator on your machine from NPM.

    ```bash
    npm install -g yo
    ```
3. Install the Yeoman generator you want to use, following the steps in the getting started [documentation](service-fabric-get-started-linux.md). To create Service Fabric Applications using Yeoman, follow the steps:

    ```bash
    npm install -g generator-azuresfjava       # for Service Fabric Java Applications
    npm install -g generator-azuresfguest      # for Service Fabric Guest executables
    npm install -g generator-azuresfcontainer  # for Service Fabric Container Applications
    ```
4. To build a Service Fabric Java application on Mac, you would need - JDK 1.8 and Gradle installed on the host machine. If it is not there already, you can install it using [HomeBrew](https://brew.sh/). 

    ```bash
    brew update
    brew cask install java
    brew install gradle
    ```

## Deploy application on your Mac from terminal

Once you create and build your Service Fabric application, you can deploy your application using [Service Fabric CLI](service-fabric-cli.md#cli-mac), by following the steps:

1. Connect to Service Fabric cluster running inside the container instance on your Mac.

    ```bash
    sfctl cluster select --endpoint http://localhost:19080
    ```

2. Go inside your project directory and run the install script.

    ```bash
    cd MyProject
    bash install.sh
    ```

## Set up .NET Core 2.0 development

Install the [.NET Core 2.0 SDK for Mac](https://www.microsoft.com/net/core#macos) to start [creating C# Service Fabric applications](service-fabric-create-your-first-linux-application-with-csharp.md). Packages for .NET Core 2.0 Service Fabric applications are hosted on NuGet.org, currently in preview.

## Install the Service Fabric plugin for Eclipse Neon on your Mac

Service Fabric provides a plugin for the **Eclipse Neon for Java IDE** that can simplify the process of creating, building, and deploying Java services. You can follow the installation steps mentioned in this general [documentation](service-fabric-get-started-eclipse.md#install-or-update-the-service-fabric-plug-in-in-eclipse-neon) about installing or updating Service Fabric Eclipse plugin to the latest version.

All other steps mentioned in the [Service Fabric Eclipse documentation](service-fabric-get-started-eclipse.md) to build an application, add service to application, install/uninstall application etc. will be applicable here as well.

Apart from the above steps, to have Service Fabric Eclipse plugin to work with the Docker container on your Mac, you should instantiate the container with a path shared with your host, as follows:
```bash
docker run -itd -p 19080:19080 -v /Users/sayantan/work/workspaces/mySFWorkspace:/tmp/mySFWorkspace --name sfonebox servicefabricoss/service-fabric-onebox
```
where ``/Users/sayantan/work/workspaces/mySFWorkspace`` is the fully qualified path of the workspace on Mac and ``/tmp/mySFWorkspace`` is the path inside container, where it would be mapped to.

> [!NOTE]
>1. If your workspace name/path is different, update the same accordingly in the ``docker run`` command above.
>2. If you start the container with a different name other than ``sfonebox``, please update the same in the ``testclient.sh`` file in your Service Fabric actor Java application.

## Next steps
<!-- Links -->
* [Create and deploy your first Service Fabric Java application on Linux using Yeoman](service-fabric-create-your-first-linux-application-with-java.md)
* [Create and deploy your first Service Fabric Java application on Linux using Service Fabric Plugin for Eclipse](service-fabric-get-started-eclipse.md)
* [Create a Service Fabric cluster in the Azure portal](service-fabric-cluster-creation-via-portal.md)
* [Create a Service Fabric cluster using the Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
* [Understand the Service Fabric application model](service-fabric-application-model.md)
* [Use the Service Fabric CLI to manage your applications](service-fabric-application-lifecycle-sfctl.md)

<!-- Images -->
[cluster-setup-script]: ./media/service-fabric-get-started-mac/cluster-setup-mac.png
[sfx-mac]: ./media/service-fabric-get-started-mac/sfx-mac.png
[sf-eclipse-plugin-install]: ./media/service-fabric-get-started-mac/sf-eclipse-plugin-install.png
[buildship-update]: https://projects.eclipse.org/projects/tools.buildship
