<properties
   pageTitle="Set up your development environment on Linux | Microsoft Azure"
   description="Install the runtime and SDK and create a local development cluster on Linux. After completing this setup, you will be ready to build applications."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/26/2016"
   ms.author="seanmck"/>

# Prepare your development environment on Linux

 To deploy and run [Azure Service Fabric applications](service-fabric-application-model.md) on your Linux development machine, install the runtime and common SDK. You can also install optional SDKs for Java and .NET Core.

## Prerequisites
### Supported operating system versions
The following operating system versions are supported for development:

- Ubuntu 16.04 (Xenial Xerus)

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

1. Install the Service Fabric SDK package. You will be asked to confirm the installation and to agree to a license agreement.

    ```bash
    sudo apt-get install servicefabricsdkcommon
    ```

2. Run the SDK setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/sdkcommonsetup.sh
    ```

## Set up the Azure cross-platform CLI

The [Azure cross-platform CLI][azure-xplat-cli-github] includes commands for interacting with Service Fabric entities, including clusters and applications. It is based on Node.js so [ensure that you have installed Node][install-node] before proceeding with the instructions below.

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
    sudo ln -s $(pwd)/bin/azure /usr/bin/azure/
    ```

4. Finally, enable auto-completion Service Fabric commands.

    ```bash
    azure --completion >> ~/azure.completion.sh
    echo 'source ~/azure.completion.sh' >> ~/.bash_profile
    source ~/azure.completion.sh
    ```

## Set up a local cluster

If everything has installed successfully, you should be able to start a local cluster.

1. Run the cluster setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/common/clustersetup/devclustersetup.sh
    ```

2. Open a web browser and navigate to http://localhost:19080/Explorer. If the cluster has started, you should see the Service Fabric Explorer dashboard.

    ![Service Fabric Explorer on Linux][sfx-linux]

At this point, you are able to deploy pre-built Service Fabric application packages or new ones based on guest containers or guest executables. To build new services using the Java or .NET Core SDKs, follow the optional setup steps below.

## Install the Java SDK and Eclipse plugin (optional)

The Java SDK provides the libraries and templates required to build Service Fabric services using Java.

1. Install the Java SDK package.

    ```bash
    sudo apt-get install servicefabricsdkjava
    ```

2. Run the SDK setup script.

    ```bash
    sudo /opt/microsoft/sdk/servicefabric/java/servicefabricsdkjava.sh
    ```

You can install the Eclipse plugin for Service Fabric from within the Eclipse IDE.

1. In Eclipse, choose **Help > Install New Software...**

2. In the "Work with" textbox, enter: http://dl.windowsazure.com/eclipse/servicefabric

3. Click Add.

    ![Eclipse plugin][sf-eclipse-plugin]

4. Choose the Service Fabric plugin and click next.

5. Proceed through the installation and accept the end-user license agreement.

## Install the .NET Core SDK (optional)

The .NET Core SDK provides the libraries and templates required to build Service Fabric services using cross-platform .NET Core.

1. Install the .NET Core SDK package.

    ```bash
    $ sudo apt-get install servicefabricsdkcsharp
    ```

2. Run the SDK setup script.

    ```bash
    sudo  /opt/microsoft/sdk/servicefabric/csharp/servicefabricsdkcsharp.sh
    ```

## Next steps

- [Create your first Java application on Linux](service-fabric-create-your-first-linux-application-with-java.md)


<!-- Links -->

[azure-xplat-cli-github]: https://github.com/Azure/azure-xplat-cli
[install-node]: https://nodejs.org/en/download/package-manager/#installing-node-js-via-package-manager

<!--Images -->

[sf-eclipse-plugin]: ./media/service-fabric-get-started-linux/service-fabric-eclipse-plugin.png
[sfx-linux]: ./media/service-fabric-get-started-linux/sfx-linux.png
