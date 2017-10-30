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
ms.date: 09/26/2017
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
Service Fabric does not run natively on OS X. To run a local Service Fabric cluster, we provide a pre-configured Ubuntu virtual machine using Vagrant and VirtualBox. Before you get started, you need:

* [Vagrant (v1.8.4 or later)](http://www.vagrantup.com/downloads.html)
* [VirtualBox](http://www.virtualbox.org/wiki/Downloads)

>[!NOTE]
> You need to use mutually supported versions of Vagrant and VirtualBox. Vagrant might behave erratically on an unsupported VirtualBox version.
>

## Create the local VM
To create the local VM containing a 5-node Service Fabric cluster, perform the following steps:

1. Clone the `Vagrantfile` repo

    ```bash
    git clone https://github.com/azure/service-fabric-linux-vagrant-onebox.git
    ```
    This steps downloads the file `Vagrantfile` containing the VM configuration along with the location the VM is downloaded from.  The file points to a stock Ubuntu image.

2. Navigate to the local clone of the repo

    ```bash
    cd service-fabric-linux-vagrant-onebox
    ```
3. (Optional) Modify the default VM settings

    By default, the local VM is configured as follows:

   * 3 GB of memory allocated
   * Private host network configured at IP 192.168.50.50 enabling passthrough of traffic from the Mac host

     You can change either of these settings or add other configuration to the VM in the `Vagrantfile`. See the [Vagrant documentation](http://www.vagrantup.com/docs) for the full list of configuration options.
4. Create the VM

    ```bash
    vagrant up
    ```


5. Log into the VM and install the Service Fabric SDK

    ```bash
    vagrant ssh
    ```

   Install the SDK as described in [SDK installation](service-fabric-get-started-linux.md).  The script below is provided for convenience for installing the Service Fabric runtime and the Service Fabric common SDK along with sfctl CLI. Running the script assumes you have read and agreed to the licenses for all the software that is being installed.

    ```bash
    sudo curl -s https://raw.githubusercontent.com/Azure/service-fabric-scripts-and-templates/master/scripts/SetupServiceFabric/SetupServiceFabric.sh | sudo bash
    ```

5.  Start the Service Fabric cluster

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/clustersetup/devclustersetup.sh
    ```

    >[!TIP]
    > If the VM download is taking a long time, you can download it using wget or curl or through a browser by navigating to the link specified by **config.vm.box_url** in the file `Vagrantfile`. After downloading it locally, edit `Vagrantfile` to point to the local path where you downloaded the image. For example if you downloaded the image to /home/users/test/azureservicefabric.tp8.box, then set **config.vm.box_url** to that path.
    >

5. Test that the cluster has been set up correctly by navigating to Service Fabric Explorer at http://192.168.50.50:19080/Explorer (assuming you kept the default private network IP).

    ![Service Fabric Explorer viewed from the host Mac][sfx-mac]

## Install the necessary Java artifacts on Vagrant to use Service Fabric Java programming model

To build Service Fabric services using Java, ensure you have JDK 1.8 installed along with Gradle which is used for running build tasks. The following snippet installs Open JDK 1.8 along with Gradle. The Service Fabric Java libraries are pulled from Maven.

  ```bash
  vagrant ssh
  sudo apt-get install openjdk-8-jdk-headless
  sudo apt-get install gradle
```

## Set up the Service Fabric CLI (sfctl) on your Mac

Follow the instructions at [Service Fabric CLI](service-fabric-cli.md#cli-mac) to install the Service Fabric CLI (`sfctl`) on your Mac.
The CLI commands for interacting with Service Fabric entities, including clusters, applications and services.

## Create application on you Mac using Yeoman

Service Fabric provides scaffolding tools which will help you create a Service Fabric application from terminal using Yeoman template generator. Please follow the steps below to ensure you have the Service Fabric yeoman template generator working on your machine.

1. You need to have Node.js and NPM installed on you mac. If not you can install Node.js and NPM using Homebrew using the following. To check the versions of Node.js and NPM installed on your Mac, you can use the ``-v`` option.

  ```bash
  brew install node
  node -v
  npm -v
  ```
2. Install [Yeoman](http://yeoman.io/) template generator on your machine from NPM

  ```bash
  npm install -g yo
  ```
3. Install the Yeoman generator you want to use, following the steps in the getting started [documentation](service-fabric-get-started-linux.md). To create Service Fabric Applications using Yeoman, follow the steps -

  ```bash
  npm install -g generator-azuresfjava       # for Service Fabric Java Applications
  npm install -g generator-azuresfguest      # for Service Fabric Guest executables
  npm install -g generator-azuresfcontainer  # for Service Fabric Container Applications
  ```
4. To build a Service Fabric Java application on Mac, you would need - JDK 1.8 and Gradle installed on the machine.

## Set up .NET Core 2.0 development

Install the [.NET Core 2.0 SDK for Mac](https://www.microsoft.com/net/core#macos) to start [creating C# Service Fabric applications](service-fabric-create-your-first-linux-application-with-csharp.md). Packages for .NET Core 2.0 Service Fabric applications are hosted on NuGet.org, currently in preview.


## Install the Service Fabric plugin for Eclipse Neon

Service Fabric provides a plugin for the **Eclipse Neon for Java IDE** that can simplify the process of creating, building, and deploying Java services. You can follow the installation steps mentioned in this general [documentation](service-fabric-get-started-eclipse.md#install-or-update-the-service-fabric-plug-in-in-eclipse-neon) about installing or updating Service Fabric Eclipse plugin.

>[!TIP]
> By default we support the default IP as mentioned in the ``Vagrantfile`` in the ``Local.json`` of the generated application. In case you change that and deploy Vagrant with a different IP, please update the corresponding IP in ``Local.json`` of your application as well.

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
