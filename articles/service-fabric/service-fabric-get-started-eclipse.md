---
title: Getting Started with Eclipse Plugin for Azure Service Fabric | Microsoft Docs
description: Getting Started with Eclipse Plugin for Azure Service Fabric.
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
ms.date: 12/27/2016
ms.author: saysa

---

# Getting started with Eclipse Plugin for Service Fabric Java application development
Eclipse is one of the most used IDEs for Java Developers. In this article we discuss how you can set up your Eclipse development environment to work with Service Fabric. This article will help you install the plugin, create Service fabric applications and deploy your Service Fabric application to local or remote Service Fabric cluster.

## Install or update Service Fabric Plugin on Eclipse Neon
Service Fabric provides a plugin for the **Eclipse IDE for Java Developers** that can simplify the process of building and deploying Java services.

1. Ensure that you have latest Eclipse **Neon** and latest Buildship version (1.0.17 or later) installed. You can check the versions of installed components by choosing ``Help => Installation Details``. You can update Buildship using the instructions [here][buildship-update]. To check and update if your Eclipse Neon is on latest version, you can go to ``Help => Check for Updates``.

2. To install the Service Fabric plugin, choose ``Help => Install New Software...``.
  1. In the "Work with" textbox, enter: ``http://dl.windowsazure.com/eclipse/servicefabric``.
  2. Click Add.

  ![Eclipse Neon plugin for Service Fabric][sf-eclipse-plugin-install]

  3. Choose the Service Fabric plugin and click next.
  4. Proceed through the installation and accept the end-user license agreement.

If you already have the Service Fabric Eclipse plugin installed, make sure you are on the latest version. You can check if it can be updated any further be following - ``Help => Installation Details``. Then search for Service fabric in the list of installed plugin and click on update. If there is any pending update, it will be fetched and installed.

> [!NOTE]
> In case of install or update of Service Fabric Eclipse plugin is taking a lot of time, on your Eclipse, it is because, every-time Eclipse tries to fetch metadata of all new changes that has happened to all the update-sites registered with your Eclipse instance. So, to make it faster you can use this small trick - you can go to `Available Software Sites` and uncheck everything other than the one pointing to Service Fabric plugin location `http://dl.windowsazure.com/eclipse/servicefabric`.
>

## Create Service Fabric application using Eclipse

1. Go to ``File => New => Other``. Select  ``Service Fabric Project``. Click ``Next``.

    ![Service Fabric New Project Page 1][create-application/p1]

2. Give a name to your project. Click ``Next``.

    ![Service Fabric New Project Page 2][create-application/p2]

3. Select Service Template from the available set of templates (Actor, Stateless, Container or Guest-executable). Click ``Next``.

    ![Service Fabric New Project Page 3][create-application/p3]

4. Enter the Service Name and/or the relevant Service details on this page and click ``Finish``.

    ![Service Fabric New Project Page 4][create-application/p4]

5. When you create your first Service Fabric project, it will ask if it would want to set the Service Fabric perspective, please select ``yes`` to continue.

    ![Service Fabric New Project Page 5][create-application/p5]

6. After successful creation the project looks like -

    ![Service Fabric New Project Page 6][create-application/p6]

## Build and deploy the Service Fabric application using Eclipse

* Right click on the Service Fabric application you just created above. Select option ``Service Fabric`` in the context menu. This would bring up a submenu with multiple options. which would look like -

    ![Service Fabric Right Click Menu][publish/RightClick]

  Once you click on the options for build, rebuild, and clean, it will perform the intended actions.
  - ``Build Application`` will build the application without cleaning
  - ``Rebuild Application`` will do a clean-build of the application
  - ``Clean Application`` will clean the application of the built artifacts


* You can choose to deploy, undeploy and publish your application too from this menu.
  - ``Deploy Application`` will deploy to your local cluster
  - ``Publish Application...`` will ask for which publish profile you want to select between ``Local.json`` and ``Cloud.json``. These JSON files are used to store information (such as connection end-points and security information) required to connect to local or cloud (Azure) cluster.

  ![Service Fabric Right Click Menu][publish/Publish]

* There is an alternate way in which you can deploy your Service Fabric application using Eclipse Run Configurations.

  1. Choose ``Run => Run Configurations``. Select the ``ServiceFabricDeployer`` run configuration, under ``Grade Project``.
  2. Under the ``Arguments`` tab on the right pane, specify **local** or **cloud** as the ``publishProfile``. The default setup is **local**. For deploying to a remote/cloud cluster, select **cloud**.
  3. Ensure the proper information is populated in the publish profiles, by editing the `Local.json` or `Cloud.json` as appropriate, with end-point details, and security credentials, if any.
  4. Ensure that ``Working Directory`` on the right pane under ``Grade Project`` points to the application you want to deploy. If not, just click on the ``Workspace...`` button and select the application you want.
  5. Click **Apply** and **Run**.

Your application builds and deploys within a few moments. You can monitor its status from Service Fabric Explorer.  

## Add new Service Fabric service to your Service Fabric application

Adding a new Service Fabric service to an existing Service Fabric application is possible using the following steps:

1. Right click on the project, you want to add a service to open the context menu and select the option 'Service Fabric'. This brings up a submenu with multiple options.

    ![Service Fabric Add Service page 1][add-service/p1]

2. Select the `Add ServiceFabric Service` option and it will guide you through the next set of steps to add a service to the project.
3. Select the Service template you want to add to your project and click 'Next'.

    ![Service Fabric Add Service page 2][add-service/p2]

4. Enter the Service Name (and other necessary details as and when required) and click "Add Service" button below.  

    ![Service Fabric Add Service page 3][add-service/p3]

5. After the service gets added successfully, the entire project structure now looks like something as below -

    ![Service Fabric Add Service page 4][add-service/p4]

## Upgrade your Service Fabric Java application

Let's assume that you have created the ``App1`` project using your the Service Fabric Eclipse plugin and deployed it using the plugin to create an application named ``fabric:/App1Application`` of application-type ``App1AppicationType`` and application-version 1.0. Now you want to upgrade your application without taking it down.

Make the change to your application and rebuild the modified service.  Update the modified service’s manifest file (``ServiceManifest.xml``) with the updated versions for the service (and Code or Config or Data as appropriate). Also modify the application’s manifest (``ApplicationManifest.xml``) with the updated version number for the application, and the modified service.  

To upgrade your application using Eclipse, you can create a duplicate run-configuration, and use it to upgrade your application as and when you need, using the following steps -
1. Choose ``Run => Run Configurations``. Click the small-arrow on the left of ``Grade Project`` in the left pane.
2. Right click on ``ServiceFabricDeployer`` and select ``Duplicate``. Give a new name to this configuration, say ``ServiceFabricUpgrader``.
3. On the right panel, under the ``Arguments`` tab, change ``-Pconfig='deploy'`` to ``-Pconfig=upgrade`` and click on ``Apply``.
4. Now, you created and saved a run-configuration for upgrading your application, which you can ``Run`` when you want. This will take care of getting the latest updated application-type version from the application-manifest file.

You can now monitor the application upgrade using Service Fabric Explorer. In a few minutes, the application would have been updated.

<!-- Images -->

[sf-eclipse-plugin-install]: ./media/service-fabric-get-started-mac/sf-eclipse-plugin-install.png

[create-application/p1]:./media/service-fabric-get-started-eclipse/create-application/p1.png
[create-application/p2]:./media/service-fabric-get-started-eclipse/create-application/p2.png
[create-application/p3]:./media/service-fabric-get-started-eclipse/create-application/p3.png
[create-application/p4]:./media/service-fabric-get-started-eclipse/create-application/p4.png
[create-application/p5]:./media/service-fabric-get-started-eclipse/create-application/p5.png
[create-application/p6]:./media/service-fabric-get-started-eclipse/create-application/p6.png

[publish/Publish]: ./media/service-fabric-get-started-eclipse/publish/Publish.png
[publish/RightClick]: ./media/service-fabric-get-started-eclipse/publish/RightClick.png

[add-service/p1]: ./media/service-fabric-get-started-eclipse/add-service/p1.png
[add-service/p2]: ./media/service-fabric-get-started-eclipse/add-service/p2.png
[add-service/p3]: ./media/service-fabric-get-started-eclipse/add-service/p3.png
[add-service/p4]: ./media/service-fabric-get-started-eclipse/add-service/p4.png

<!-- Links -->
[buildship-update]: https://projects.eclipse.org/projects/tools.buildship
