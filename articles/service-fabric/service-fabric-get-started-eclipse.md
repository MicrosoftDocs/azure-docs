---
title: Get started with the Azure Service Fabric plug-in for Eclipse | Microsoft Docs
description:  Get started with the Service Fabric plug-in for Eclipse.
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

# Service Fabric and the Eclipse Java application development
Eclipse is one of the most widely used integrated development environments (IDEs) for Java developers. In this article, we describe how to set up your Eclipse development environment to work with Azure Service Fabric. This article can help you install the Service Fabric plug-in, create Service Fabric applications, and deploy your Service Fabric application to a local or remote Service Fabric cluster from Eclipse Neon.

## Install or update the Service Fabric plug-in in Eclipse Neon
You can install a Service Fabric plug-in in Eclipse Neon. The plug-in can help simplify the process of building and deploying Java services. To install the Service Fabric plug-in, you need the latest version of Eclipse Neon, and the latest version of Buildship.

1. Ensure that you have the latest version of Eclipse Neon and the latest version of Buildship (1.0.17 or a later version) installed: 
    1.  To check the versions of installed components, in Neon, go to **Help** > **Installation Details**. 
    2.  To update Buildship, see [Eclipse Buildship: Eclipse Plug-ins for Gradle][buildship-update]. 
    3.  To check for and install updates for Eclipse Neon, go to **Help** > **Check for Updates**.

2. To install the Service Fabric plug-in, in Eclipse Neon, go to **Help** > **Install New Software**.
  1. In the **Work with** box, enter **http://dl.windowsazure.com/eclipse/servicefabric**.
  2. Click **Add**.

  ![Service Fabric plug-in for Eclipse Neon][sf-eclipse-plugin-install]

  3. Select the Service Fabric plug-in, and then click **Next**.
  4. Complete the installation steps, and then accept the end-user license agreement.

If you already have the Service Fabric plug-in installed, make sure you have the latest version. To check for available updates, go to **Help** > **Installation Details**. In the list of installed plug-ins, select Service Fabrice, and then click **Update**. Any available updates will be installed.

> [!NOTE]
> If installing or updating the Service Fabric plug-in is slow, it might be an Eclipse setting. Eclipse collects metadata on all changes to the update sites that are registered with your Eclipse instance. To speed up the process of checking for and installing a Service Fabrice plug-in update, go to **Available Software Sites**. Uncheck all sites except for the one that points to the Service Fabric plug-in location, http://dl.windowsazure.com/eclipse/servicefabric.
>

## Create a Service Fabric application by using Eclipse

1. In Eclipse Neon, go to **File** > **New** > **Other**. Select  **Service Fabric Project, and then click **Next**.

    ![Service Fabric New Project page 1][create-application/p1]

2. Enter a name for your project, and then click **Next**.

    ![Service Fabric New Project page 2][create-application/p2]

3. In the list of templates, select **Service Template** (Actor, Stateless, Container, or Guest-executable), and then click **Next**.

    ![Service Fabric New Project page 3][create-application/p3]

4. Enter the service name and relevant service details, and then click **Finish**.

    ![Service Fabric New Project page 4][create-application/p4]

5. When you create your first Service Fabric project, in the **Open Associated Perspective** dialog box, click **Yes**.

    ![Service Fabric New Project page 5][create-application/p5]

6. Your new project looks like this:

    ![Service Fabric New Project page 6][create-application/p6]

## Build and deploy the Service Fabric application by using Eclipse

1.  Right-click the new Service Fabric application, and then select **Service Fabric**. A submenu, with multiple options, appears.

    ![Service Fabric right-click menu][publish/RightClick]

 2. Select the option you want:
  - To build the applicationt without cleaning, click **Build Application**.
  - To do a clean-build of the application, click **Rebuild Application**. 
  - To clean the application of the built artifacts, click **Clean Application**. 

3.  In this menu, you can deploy, undeploy, and publish your application:
  - To deploy to your local cluster, click **Deploy Application**.
  - In the **Publish Application** dialog box, select a publish profile: 
    -  **Local.json**
     - **Cloud.json**
    
     These JavaScript Object Notation (JSON) files  store information (such as connection endpoints and security information) that is required to connect to your local or cloud (Azure) cluster.

  ![Service Fabric publish menu][publish/Publish]

An alternate way to deploy your Service Fabric application is by using Eclipse Run Configurations:

  1.    Click **Run**.
  2.    Click **Run Configurations**.
  3.    Under **Grade Project**, select the ``ServiceFabricDeployer`` run configuration.
  4.    On the **Arguments** tab in the right pane, for **publishProfile**, select **local** or **cloud**. The default is **local**. To deploy to a remote or cloud cluster, select **cloud**.
  5. To ensure that the proper information is populated in the publish profiles, edit **Local.json** or **Cloud.json** as needed, with endpoint details and security credentials, if any.
  6.    Ensure that **Working Directory** points to the application you want to deploy. To change the application, click the **Workspace** button and select the application you want.
  7.    Click **Apply**, and then click **Run**.

Your application builds and deploys within a few moments. You can monitor its status in Service Fabric Explorer.  

## Add a new Service Fabric service to your Service Fabric application

To add a new Service Fabric service to an existing Service Fabric application, do the following steps:

1. Right-click the project you want to add a service to, and then click **Service Fabric**. 

    ![Service Fabric Add Service page 1][add-service/p1]

2. Select the **Add ServiceFabric Service** option, and complete the set of steps to add a service to the project.
3. Select the Service template you want to add to your project, and then click **Next**.

    ![Service Fabric Add Service page 2][add-service/p2]

4. Enter the Service Name (and other details, as required), and then click the **Add Service** button.  

    ![Service Fabric Add Service page 3][add-service/p3]

5. After the service is added, your overall project structure will look similar to the following project:

    ![Service Fabric Add Service page 4][add-service/p4]

## Upgrade your Service Fabric Java application

For an upgrade example, say you created the **App1** project by using your the Service Fabric plug-in in Eclipse. You deployed it by using the plug-in to create an application named **fabric:/App1Application**, with an application-type ``App1AppicationType`` and application-version 1.0. Now, you want to upgrade your application without taking it down.

First, make any changes to your application, and rebuild the modified service. Update the modified service’s manifest file (ServiceManifest.xml) with the updated versions for the service (and Code, Config, or Data, as relevant). Also, modify the application’s manifest (ApplicationManifest.xml) with the updated version number for the application and the modified service.  

To upgrade your application by using Eclipse, you can create a duplicate run-configuration, and use it to upgrade your application as needed by doing the following steps:
1. Click **Run** > **Run Configurations**. In the left pane, click the small arrow to the left of **Grade Project**.
2. Right-click **ServiceFabricDeployer**, and then select **Duplicate**. Enter a new name for this configuration, for example, **ServiceFabricUpgrader**.
3. in the right panel, on the **Arguments** tab, change `-Pconfig='deploy'` to `-Pconfig=upgrade`, and click **Apply**.
4. This creates and saves a run configuration profile you can use at any time to upgrade your application. This also gets the latest updated application type version from the application manifest file.

You can monitor the application upgrade in Service Fabric Explorer. The application updates in a few minutes.

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
