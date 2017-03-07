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

 >[Note] You need to use mutually supported versions of Vagrant and VirtualBox. Vagrant might behave erratically on an unsupported VirtualBox version.
>

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

Service Fabric provides a plugin for the **Eclipse Neon for Java IDE** that can simplify the process of creating, building and deploying Java services. You can follow the installation steps mentioned in this general  [documentation](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started-eclipse#install-or-update-service-fabric-plugin-on-eclipse-neon) about installing or updating Service Fabric Eclipse plugin.

## Using Service Fabric Eclipse plugin on Mac

Ensure you have gone through the steps mentioned in the [Service Fabric Eclipse plugin documentation](service-fabric-get-started-eclipse.md). The steps for creating, building and deploying Service Fabric Java application using vagrant-guest container on a Mac host, is mostly same as the general documentation, apart from few points, you need to keep in mind, as mentioned below -
* Since the Service Fabric libraries will be required by your Service Fabric Java application to be built successfully, the eclipse project needs to be created in a shared path. By default, the contents at the path on your host where the ``Vagrantfile`` exists, is shared with the ``/vagrant`` path on the guest.
* So to put it simply, if you have the ``Vagrantfile`` in a path, say, ``~/home/john/allprojects/``, then you need to create the your service-fabric project ``MyActor`` in location ``~/home/john/allprojects/MyActor`` and the path to your eclipse workspace would be ``~/home/john/allprojects``.

## Import and Deploy Github Java samples on Mac using Service Fabric Eclipse plugin

The steps mentioned in the main [documentation](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started-eclipse#import-and-deploy-github-java-samples-using-service-fabric-eclipse-plugin) regarding building and deploying GitHub samples using Service Fabric Eclipse plugin hold true here as well, with minor modifications as mentioned below.

Few things we need to keep in mind here.
  - As mentioned in the section above, you need to have your ``Vagrantfile`` to be present in a path parallel to the project you are deploying for sharing of library artifacts i.e. for example, if you are deploying ``VisualObjectActor``, then your vagrant environment should be up from the path `~/githubsamples/service-fabric-java-getting-started/Actors/`
  - In the ``build.gradle`` files of your interface(for actors) and implementations (for both Services and Actors), where ever you see the path to out java library artifacts i.e. `/opt/microsoft/sdk/servicefabric/java/packages/lib/`, replace it with a path relative to your project and vagrant-environment - `${projectDir}/../../tmp/lib/`.
  - In the root level ``build.gradle`` file, the tasks, which call the shell-scripts to connect, deploy or uninstall internally, you need the update the lines as follows -
    - In `task deploy`, the line `commandLine '/bin/bash','Scripts/deploy.sh'` needs to be changed to: `commandLine '/bin/bash','Scripts/VagrantSSHCaller.sh','Scripts/deploy.sh'`
    - Same holds true for tasks `upgrade`, `undeploy`, `clusterconnect`.


## Next steps
<!-- Links -->
* [Create and deploy your first Service Fabric Java application on Linux using yeoman](service-fabric-create-your-first-linux-application-with-java.md)
* [Create and deploy your first Service Fabric Java application on Linux using Service Fabric Plugin for Eclipse](service-fabric-get-started-eclipse.md)
* [Create a Service Fabric cluster in the Azure portal](service-fabric-cluster-creation-via-portal.md)
* [Create a Service Fabric cluster using the Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
* [Understand the Service Fabric application model](service-fabric-application-model.md)

<!-- Images -->
[cluster-setup-script]: ./media/service-fabric-get-started-mac/cluster-setup-mac.png
[sfx-mac]: ./media/service-fabric-get-started-mac/sfx-mac.png
[sf-eclipse-plugin-install]: ./media/service-fabric-get-started-mac/sf-eclipse-plugin-install.png
[buildship-update]: https://projects.eclipse.org/projects/tools.buildship
