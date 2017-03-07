---
title: Set up your development environment on Linux | Microsoft Docs
description: Install the runtime and SDK and create a local development cluster on Linux. After completing this setup, you will be ready to build applications.
services: service-fabric
documentationcenter: .net
author: seanmck
manager: timlt
editor: ''

ms.assetid: d552c8cd-67d1-45e8-91dc-871853f44fc6
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: seanmck

---
# Prepare your development environment on Linux
> [!div class="op_single_selector"]
> * [Windows](service-fabric-get-started.md)
> * [Linux](service-fabric-get-started-linux.md)
> * [OSX](service-fabric-get-started-mac.md)
>
>  

 To deploy and run [Azure Service Fabric applications](service-fabric-application-model.md) on your Linux development machine, install the runtime and common SDK. You can also install optional SDKs for Java and .NET Core.

## Prerequisites

### Supported operating system versions
The following operating system versions are supported for development:

* Ubuntu 16.04 ("Xenial Xerus")

## Update your apt sources
To install the SDK and the associated runtime package via apt-get, you must first update your apt sources.

1. Open a terminal.
2. Add the Service Fabric repo to your sources list.

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] http://apt-mo.trafficmanager.net/repos/servicefabric/ trusty main" > /etc/apt/sources.list.d/servicefabric.list'
    ```
3. Add the new GPG key to your apt keyring.

    ```bash
    sudo apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893
    ```
4. Refresh your package lists based on the newly added repositories.

    ```bash
    sudo apt-get update
    ```

## Install and set up the SDK
Once your sources are updated, you can install the SDK.

1. Install the Service Fabric SDK package. You are asked to confirm the installation and to agree to a license agreement.

    ```bash
    sudo apt-get install servicefabricsdkcommon
    ```
2. Run the SDK setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/sdkcommonsetup.sh
    ```


## Set up the Azure cross-platform CLI
The [Azure cross-platform CLI][azure-xplat-cli-github] includes commands for interacting with Service Fabric entities, including clusters and applications. It is based on Node.js so [ensure that you have installed Node][install-node] before proceeding with the following instructions:

1. Clone the github repo to your development machine.

    ```bash
    git clone https://github.com/Azure/azure-xplat-cli.git
    ```
2. Switch into the cloned repo and install the CLI's dependencies using the Node Package Manager (npm).

    ```bash
    cd azure-xplat-cli
    npm install
    ```
3. Create a symlink from the bin/azure folder of the cloned repo to /usr/bin/azure so that it's added to your path and commands are available from any directory.

    ```bash
    sudo ln -s $(pwd)/bin/azure /usr/bin/azure
    ```
4. Finally, enable auto-completion Service Fabric commands.

    ```bash
    azure --completion >> ~/azure.completion.sh
    echo 'source ~/azure.completion.sh' >> ~/.bash_profile
    source ~/azure.completion.sh
    ```

> [!NOTE]
> Service Fabric commands are not yet available in Azure CLI 2.0.

## Set up a local cluster
If everything has installed successfully, you should be able to start a local cluster.

1. Run the cluster setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/clustersetup/devclustersetup.sh
    ```
2. Open a web browser and navigate to http://localhost:19080/Explorer. If the cluster has started, you should see the Service Fabric Explorer dashboard.

    ![Service Fabric Explorer on Linux][sfx-linux]

At this point, you are able to deploy pre-built Service Fabric application packages or new ones based on guest containers or guest executables. To build new services using the Java or .NET Core SDKs, follow the optional setup steps provided in subsequent sections.


> [!NOTE]
> Stand alone clusters aren't supported in Linux - only one box and Azure Linux multi-machine clusters are supported in the preview.
>
>

## Install the Java SDK and Eclipse Neon plugin (optional)
The Java SDK provides the libraries and templates required to build Service Fabric services using Java.

1. Install the Java SDK package.

    ```bash
    sudo apt-get install servicefabricsdkjava
    ```
2. Run the SDK setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/java/sdkjavasetup.sh
    ```

You can install the Eclipse plugin for Service Fabric from within the **Eclipse IDE for Java Developers**.

1. In Eclipse, ensure that you have latest eclipse **Neon** and latest Buildship version (1.0.17 or later) installed. You can check the versions of installed components by choosing **Help > Installation Details**. You can update Buildship using the instructions [here][buildship-update].
2. To install the Service Fabric plugin, choose **Help > Install New Software...**
3. In the "Work with" textbox, enter: http://dl.windowsazure.com/eclipse/servicefabric
4. Click Add.
    ![Eclipse plugin][sf-eclipse-plugin]
5. Choose the Service Fabric plugin and click next.
6. Proceed through the installation and accept the end-user license agreement.

If you already have the Service Fabric Eclipse plugin installed, make sure you are on the latest version. You can check if it can be updated any further be following - ``Help => Installation Details``. Then search for Service fabric in the list of installed plugin and click on update. If there is any pending update, it will be fetched and installed.

For more details on how to use Service Fabric Eclipse Plugin to create, build, deploy, upgrade a Service Fabric java application, please refer to our detailed guide - [Service fabric getting started with eclipse](service-fabric-get-started-eclipse.md).

## Install the .NET Core SDK (optional)
The .NET Core SDK provides the libraries and templates required to build Service Fabric services using cross-platform .NET Core.

1. Install the .NET Core SDK package.

   ```bash
   sudo apt-get install servicefabricsdkcsharp
   ```

2. Run the SDK setup script.

   ```bash
   sudo /opt/microsoft/sdk/servicefabric/csharp/sdkcsharpsetup.sh
   ```

## Updating the SDK and Runtime

To update to the latest version of the SDK and runtime, run the following steps (remove SDKs from the list that you don't want to update or install):

   ```bash
   sudo apt-get update
   sudo apt-get install servicefabric, servicefabricsdkcommon, servicefabricsdkcsharp, servicefabricsdkjava
   ```

For updating the CLI, navigate to the directory where you cloned the CLI and run `git pull` for updating.

## Next steps
* [Create and deploy your first Service Fabric Java application on Linux using yeoman](service-fabric-create-your-first-linux-application-with-java.md)
* [Create and deploy your first Service Fabric Java application on Linux using Service Fabric Plugin for Eclipse](service-fabric-get-started-eclipse.md)
* [Create your first CSharp application on Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
* [Prepare your development environment on OSX](service-fabric-get-started-mac.md)
* [Use the Azure CLI to manage your Service Fabric applications](service-fabric-azure-cli.md)

<!-- Links -->

[azure-xplat-cli-github]: https://github.com/Azure/azure-xplat-cli
[install-node]: https://nodejs.org/en/download/package-manager/#installing-node-js-via-package-manager
[buildship-update]: https://projects.eclipse.org/projects/tools.buildship

<!--Images -->

[sf-eclipse-plugin]: ./media/service-fabric-get-started-linux/service-fabric-eclipse-plugin.png
[sfx-linux]: ./media/service-fabric-get-started-linux/sfx-linux.png
