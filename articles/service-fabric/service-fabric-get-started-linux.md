---
title: Set up your development environment on Linux | Microsoft Docs
description: Install the runtime and SDK and create a local development cluster on Linux. After completing this setup, you will be ready to build applications.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: d552c8cd-67d1-45e8-91dc-871853f44fc6
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 7/27/2017
ms.author: subramar

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

The following operating system versions are supported for development:

* Ubuntu 16.04 (`Xenial Xerus`)

## Update your APT sources
To install the SDK and the associated runtime package via the apt-get command-line tool, you must first update your Advanced Packaging Tool (APT) sources.

1. Open a terminal.
2. Add the Service Fabric repo to your sources list.

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] http://apt-mo.trafficmanager.net/repos/servicefabric/ trusty main" > /etc/apt/sources.list.d/servicefabric.list'
    ```

3. Add the `dotnet` repo to your sources list.

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
    ```

4. Add the new Gnu Privacy Guard (GnuPG, or GPG) key to your APT keyring.

    ```bash
    sudo apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
    ```

5. Add the official Docker GPG key to your APT keyring.

    ```bash
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    ```

6. Set up the Docker repository.

    ```bash
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    ```

7. Refresh your package lists based on the newly added repositories.

    ```bash
    sudo apt-get update
    ```

## Install and set up the SDK for containers and guest executables

After you have updated your sources, you can install the SDK.

1. Install the Service Fabric SDK package, confirm the installation, and agree to the license agreement.

    ```bash
    sudo apt-get install servicefabricsdkcommon
    ```

	>   [!TIP]
	>   The following commands automate accepting the license for Service Fabric packages:
	>   ```bash
	>   echo "servicefabric servicefabric/accepted-eula-v1 select true" | debconf-set-selections
	>   echo "servicefabricsdkcommon servicefabricsdkcommon/accepted-eula-v1 select true" | debconf-set-selections
	>   ```
	
2. Run the SDK setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/sdkcommonsetup.sh
    ```

After you have installed the common SDK package, you should be able to create apps with guest executable or container services by running `yo azuresfguest` or `yo azuresfcontainer`. You might need to set your $NODE_PATH environment variable to the location of the node modules. 


```bash
    export NODE_PATH=$NODE_PATH:$HOME/.node/lib/node_modules 
```

If you are using the environment as root, you might need to set the variable with the following command:

```bash
    export NODE_PATH=$NODE_PATH:/root/.node/lib/node_modules 
```


> [!TIP]
> You might want to add these commands to your ~/.bashrc file so that you don't have to set the environment variable at every login.
>

## Set up the XPlat Service Fabric CLI
The [XPlat CLI][azure-xplat-cli-github] includes commands for interacting with Service Fabric entities, including clusters and applications. It is based on Node.js, so [ensure that you have installed Node][install-node] before you proceed with the following instructions:

1. Clone the GitHub repo to your development machine.

    ```bash
    git clone https://github.com/Azure/azure-xplat-cli.git
    ```

2. Switch to the cloned repo and install the CLI dependencies by using the node package manager (npm).

    ```bash
    cd azure-xplat-cli
    npm install
    ```

3. Create a symlink from the `bin/azure` folder of the cloned repo to `/usr/bin/azure`.

    ```bash
    sudo ln -s $(pwd)/bin/azure /usr/bin/azure
    ```

4. Finally, enable auto-completion Service Fabric commands.

    ```bash
    azure --completion >> ~/azure.completion.sh
    echo 'source ~/azure.completion.sh' >> ~/.bash_profile
    source ~/azure.completion.sh
    ```

### Set up Azure CLI 2.0

As an alternative to the XPlat CLI, there is now a Service Fabric command module included in Azure CLI.

For more information about installing Azure CLI 2.0 and using the Service Fabric commands, see [Get started with Service Fabric and Azure CLI 2.0](service-fabric-azure-cli-2-0.md).

## Set up a local cluster
If the installation is successful, you should be able to start a local cluster.

1. Run the cluster setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/clustersetup/devclustersetup.sh
    ```

2. Open a web browser and go to [Service Fabric Explorer](http://localhost:19080/Explorer). If the cluster has started, you should see the Service Fabric Explorer dashboard.

    ![Service Fabric Explorer on Linux][sfx-linux]

At this point, you can deploy pre-built Service Fabric application packages or new ones based on guest containers or guest executables. To build new services by using the Java or .NET Core SDKs, follow the optional setup steps that are provided in subsequent sections.


> [!NOTE]
> Standalone clusters aren't supported in Linux. The preview supports only one-box and Azure Linux multi-machine clusters.
>

## Install the Java SDK (optional, if you want to use the Java programming models)
The Java SDK provides the libraries and templates that are required to build Service Fabric services by using Java.

1. Install the Java SDK package.

    ```bash
    sudo apt-get install servicefabricsdkjava
    ```

2. Run the SDK setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/java/sdkjavasetup.sh
    ```

## Install the Eclipse Neon plug-in (optional)

You can install the Eclipse plug-in for Service Fabric from within the **Eclipse IDE for Java Developers**. You can use Eclipse to create Service Fabric guest executable applications and container applications in addition to Service Fabric Java applications.

> [!NOTE]
> The Java SDK is a prerequisite to using the Eclipse plug-in, even if you use it only for guest executables and container applications.
>

1. In Eclipse, ensure that you have latest Eclipse Neon and the latest Buildship version (1.0.17 or later) installed. You can check the versions of installed components by selecting **Help** > **Installation Details**. You can update Buildship by using the instructions at [Eclipse Buildship: Eclipse Plug-ins for Gradle][buildship-update].

2. To install the Service Fabric plug-in, select **Help** > **Install New Software**.

3. In the **Work with** box, type **http://dl.microsoft.com/eclipse**.

4. Click **Add**.

    ![The Available Software page][sf-eclipse-plugin]

5. Select the **ServiceFabric** plug-in, and then click **Next**.

6. Complete the installation steps, and then accept the end-user license agreement.

If you already have the Service Fabric Eclipse plug-in installed, make sure that you have the latest version. You can check by selecting **Help** > **Installation Details** and then searching for Service Fabric in the list of installed plug-ins. If a newer version is available, select **Update**.

For more information, see [Service Fabric plug-in for Eclipse Java application development](service-fabric-get-started-eclipse.md).


## Install the .NET Core SDK (optional, if you want to use the .NET Core programming models)
The .NET Core SDK provides the libraries and templates that are required to build Service Fabric services with .NET Core.

1. Install the .NET Core SDK package.

   ```bash
   sudo apt-get install servicefabricsdkcsharp
   ```

2. Run the SDK setup script.

   ```bash
   sudo /opt/microsoft/sdk/servicefabric/csharp/sdkcsharpsetup.sh
   ```

## Update the SDK and runtime

To update to the latest version of the SDK and runtime, run the following commands (deselect the SDKs that you don't want):

```bash
sudo apt-get update
sudo apt-get install servicefabric servicefabricsdkcommon servicefabricsdkcsharp servicefabricsdkjava
```


> [!NOTE]
> Updating the packages might cause your local development cluster to stop running. Restart your local cluster after an upgrade by following the instructions on this page.

## Next steps
* [Create and deploy your first Service Fabric Java application on Linux by using Yeoman](service-fabric-create-your-first-linux-application-with-java.md)
* [Create and deploy your first Service Fabric Java application on Linux by using Service Fabric Plugin for Eclipse](service-fabric-get-started-eclipse.md)
* [Create your first CSharp application on Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
* [Prepare your development environment on OSX](service-fabric-get-started-mac.md)
* [Use the XPlat CLI to manage your Service Fabric applications](service-fabric-azure-cli.md)
* [Service Fabric Windows/Linux differences](service-fabric-linux-windows-differences.md)

## Related articles

* [Get started with Service Fabric and Azure CLI 2.0](service-fabric-azure-cli-2-0.md)
* [Get started with Service Fabric XPlat CLI](service-fabric-azure-cli.md)

<!-- Links -->

[azure-xplat-cli-github]: https://github.com/Azure/azure-xplat-cli
[install-node]: https://nodejs.org/en/download/package-manager/#installing-node-js-via-package-manager
[buildship-update]: https://projects.eclipse.org/projects/tools.buildship

<!--Images -->

[sf-eclipse-plugin]: ./media/service-fabric-get-started-linux/service-fabric-eclipse-plugin.png
[sfx-linux]: ./media/service-fabric-get-started-linux/sfx-linux.png
