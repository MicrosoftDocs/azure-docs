---
title: Set up your development environment on Mac OS X | Microsoft Docs
description: Install the runtime, SDK, and tools and create a local development cluster. After completing this setup, you will be ready to build applications on Mac OS X.
services: service-fabric
documentationcenter: java
author: saysa
manager: raunakp
editor: ''

ms.assetid: bf84458f-4b87-4de1-9844-19909e368deb
ms.service: service-fabric
ms.devlang: java
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/27/2016
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

Please note that, you need to use mutually supported versions of Vagrant and VirtualBox. Vagrant might behave erratically on an unsupported VirtualBox version.

## Create the local VM
To create the local VM containing a 5-node Service Fabric cluster, perform the following steps:

1. Clone the **Vagrantfile** repo

    ```bash
    git clone https://github.com/azure/service-fabric-linux-vagrant-onebox.git
    ```
2. Navigate to the local clone of the repo

    ```bash
    cd service-fabric-linux-vagrant-onebox
    ```
3. (Optional) Modify the default VM settings

    By default, the local VM is configured as follows:

   * 3 GB of memory allocated
   * Private host network configured at IP 192.168.50.50 enabling passthrough of traffic from the Mac host

     You can change either of these settings or add other configuration to the VM in the Vagrantfile. See the [Vagrant documentation](http://www.vagrantup.com/docs) for the full list of configuration options.
4. Create the VM

    ```bash
    vagrant up
    ```

   This step downloads the preconfigured VM image, boot it locally, and then set up a local Service Fabric cluster in it. You should expect it to take a few minutes. If setup completes successfully, you see a message in the output indicating that the cluster is starting up.

    ![Cluster setup starting following VM provisioning][cluster-setup-script]

5. Test that the cluster has been set up correctly by navigating to Service Fabric Explorer at http://192.168.50.50:19080/Explorer (assuming you kept the default private network IP).

    ![Service Fabric Explorer viewed from the host Mac][sfx-mac]

## Install the Service Fabric plugin for Eclipse Neon

Service Fabric provides a plugin for the Eclipse Neon IDE that can simplify the process of building and deploying Java services. You can follow the installation steps mentioned in [Service Fabric Eclipse Plugin Installation documentation](service-fabric-get-started-eclipse#install-service-fabric-plugin-eclipse-neon).

## Using Service Fabric Eclipse plugin on Mac

Ensure you have gone through the steps mentioned in the [Service Fabric Eclipse Plugin documentation](service-fabric-get-started-eclipse.md). The steps for creating, building and deploying Service fabric java application using vagrant-guest container on a Mac host, is mostly same as the general documentation, apart from few points, you need to keep in mind, as mentioned below -
* Since the Service Fabric libraries will be required by your Service-fabric java application to be built successfully, the eclipse project needs to be created in a shared path. By default, the contents at the path on your host where the ``Vagrantfile`` exists, is shared with the ``/vagrant`` path on the guest.
* So to put it simply, if you have the ``Vagrantfile`` in a path, say, ``~/home/john/allprojects/``, then you need to create the your service-fabric project ``MyActor`` in location ``~/home/john/allprojects/MyActor`` and the path to your eclipse workspace would be ``~/home/john/allprojects``.


## Next steps
<!-- Links -->
* [Set up and deploy your first Service Fabric Java application using Service Fabric Plugin for Eclipse on Linux](service-fabric-get-started-eclipse.md)
* [Create your first Service Fabric application for Linux](service-fabric-create-your-first-linux-application-with-java.md)
* [Create a Service Fabric cluster in the Azure portal](service-fabric-cluster-creation-via-portal.md)
* [Create a Service Fabric cluster using the Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
* [Understand the Service Fabric application model](service-fabric-application-model.md)

<!-- Images -->
[cluster-setup-script]: ./media/service-fabric-get-started-mac/cluster-setup-mac.png
[sfx-mac]: ./media/service-fabric-get-started-mac/sfx-mac.png
[sf-eclipse-plugin-install]: ./media/service-fabric-get-started-mac/sf-eclipse-plugin-install.png
[buildship-update]: https://projects.eclipse.org/projects/tools.buildship
