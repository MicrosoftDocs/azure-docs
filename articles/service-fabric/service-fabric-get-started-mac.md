<properties
   pageTitle="Set up your development environment on Mac OS X | Microsoft Azure"
   description="Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications on Mac OS X."
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
   ms.date="09/25/2016"
   ms.author="seanmck"/>

# Set up your development environment on Mac OS X

> [AZURE.SELECTOR]
-[ Windows](service-fabric-get-started.md)
- [Linux](service-fabric-get-started-linux.md)
- [OSX](service-fabric-get-started-mac.md)

You can build Service Fabric applications to run on Linux clusters using Mac OS X. This article covers how to set up your Mac for development.

## Prerequisites

Service Fabric does not run natively on OS X. To run a local Service Fabric cluster, we provide a pre-configured Ubuntu virtual machine using Vagrant and VirtualBox. Before you get started, you need:

- [Vagrant (v1.8.4 or later)](http://wwww.vagrantup.com/downloads)
- [VirtualBox](http://www.virtualbox.org/wiki/Downloads)

## Create the local VM

To create the local VM containing a 5-node Service Fabric cluster, do the following:

1. Clone the Vagrantfile repo

    ```bash
    git clone https://github.com/azure/service-fabric-linux-vagrant-onebox.git
    ```

2. Navigate to the local clone of the repo

    ```bash
    cd service-fabric-linux-vagrant-onebox
    ```

3. (Optional) Modify the default VM settings

    By default, the local VM is configured as follows:

    - 3 GB of memory allocated
    - Private host network configured at IP 192.168.50.50 enabling passthrough of traffic from the Mac host

    You can change either of these settings or add other configuration to the VM in the Vagrantfile. See the [Vagrant documentation](http://www.vagrantup.com/docs) for the full list of configuration options.

4. Create the VM

    ```bash
    vagrant up
    ```

    This step downloads the preconfigured VM image, boot it locally, and then set up a local Service Fabric cluster in it. You should expect it to take a few minutes. If setup completes successfully, you will see a message in the output indicating that the cluster is starting up.

    ![Cluster setup starting following VM provisioning][cluster-setup-script]

5. Test that the cluster has been set up correctly by navigating to Service Fabric Explorer at http://192.168.50.50:19080/Explorer (assuming you kept the default private network IP).

    ![Service Fabric Explorer viewed from the host Mac][sfx-mac]


## Install the Service Fabric plugin for Eclipse Neon (optional)

Service Fabric provides a plugin for the Eclipse Neon IDE that can simplify the process of building and deploying Java services.

1. In Eclipse, ensure that you have Buildship version 1.0.17 or later installed. You can check the versions of installed components by choosing **Help > Installation Details**. You can update Buildship using the instructions [here][buildship-update].

2. To install the Service Fabric plugin, choose **Help > Install New Software...**

3. In the "Work with" textbox, enter: http://dl.windowsazure.com/eclipse/servicefabric.

4. Click Add.

    ![Eclipse Neon plugin for Service Fabric][sf-eclipse-plugin-install]

5. Choose the Service Fabric plugin and click next.

6. Proceed through the installation and accept the end-user license agreement.

## Next steps

- [Create your first Service Fabric application for Linux](service-fabric-create-your-first-linux-application-with-java.md)

<!-- Links -->

- [Create a Service Fabric cluster in the Azure portal](service-fabric-cluster-creation-via-portal.md)
- [Create a Service Fabric cluster using the Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
- [Understand the Service Fabric application model](service-fabric-application-model.md)

<!-- Images -->
[cluster-setup-script]: ./media/service-fabric-get-started-mac/cluster-setup-mac.png
[sfx-mac]: ./media/service-fabric-get-started-mac/sfx-mac.png
[sf-eclipse-plugin-install]: ./media/service-fabric-get-started-mac/sf-eclipse-plugin-install.png
[buildship-update]: https://projects.eclipse.org/projects/tools.buildship
