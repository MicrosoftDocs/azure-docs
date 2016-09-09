 <properties
   pageTitle="Service Fabric app upgrade tutorial| Microsoft Azure"
   description="This article walks through the experience of deploying a Service Fabric application, changing the code, and rolling out an upgrade by using Visual Studio."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/18/2016"
   ms.author="subramar"/>



# Service Fabric application upgrade tutorial using Visual Studio

Azure Service Fabric simplifies the process of upgrading cloud applications by ensuring that only changed services are upgraded, and that application health is monitored throughout the upgrade process. It also automatically rolls back the application to the previous version if it encounters any issues. Service Fabric application upgrades are *Zero Downtime*, since the application can be upgraded with no downtime. This tutorial covers how to complete a simple rolling upgrade from Visual Studio.


## Step 1: Build and publish the Visual Objects sample

You can take these steps by downloading the [Visual Objects](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/tree/master/Actors/VisualObjects) application from GitHub, then build and publish the application by right-clicking on the application project, **VisualObjects**, and then selecting the **Publish** command in the Service Fabric menu item as follows.

![Context menu for a Service Fabric application][image1]

This will bring up another popup, and you can set the **Target profile** to **PublishProfiles\Local.xml**. The window should look like the following before you click **Publish**.

![Publishing a Service Fabric application][image2]

Now you can click **Publish** in the dialog box. You can use [Service Fabric Explorer to view the cluster and the application](service-fabric-visualizing-your-cluster.md). The Visual Objects application has a web service that you can go to by typing [http://localhost:8082/visualobjects/](http://localhost:8082/visualobjects/) in the address bar of your browser.  You should see 10 floating visual objects moving around on the screen.

## Step 2: Update the Visual Objects sample

You might notice that with the version that was deployed in step 1, the visual objects do not rotate. Let's upgrade this application to one where the visual objects also rotate.

Select the VisualObjects.ActorService project within the VisualObjects solution, and open the **VisualObjectActor.cs** file. Within that file, go to the method `MoveObject`,  comment out `visualObject.Move(false)`, and uncomment `visualObject.Move(true)`. This change will make the objects rotate after the service is upgraded.  **Now you can build (not rebuild) the solution**, which will build the modified projects. If you select *Rebuild all*, you will have to update the versions for all the projects.

We also need to version our application. To make the version changes after you right-click on the **VisualObjects** project, you can use the Visual Studio **Edit Manifest Versions** option. This will bring up the dialog box for edition versions as follows:

![Versioning dialog box][image3]

Update the versions for the modified projects and their code packages, along with the application to version 2.0.0. After the changes are made, the manifest should look like the following (bold portions show the changes):

![Updating versions][image4]

The Visual Studio tools can do automatic rollups of versions if you select **Automatically update application and service versions**. If you use [SemVer](http://www.semver.org), you need to update the code and/or configuration package version alone if that option is selected.

Save the changes, and now check the **Upgrade the Application** box.


## Step 3:  Upgrade your application

Please familiarize yourself with the [application upgrade parameters](service-fabric-application-upgrade-parameters.md) and the [upgrade process](service-fabric-application-upgrade.md) to get a good understanding of the various upgrade parameters, time-outs, and health criterion that can be applied. For this walkthrough, we will leave the service health evaluation criterion to be the default (unmonitored mode). You can configure these settings by selecting **Configure Upgrade Settings** and then modifying the parameters as desired.

Now we are all set to start the application upgrade by selecting **Publish**. This will upgrade your application to version 2.0.0, in which the objects rotate. You will find that Service Fabric upgrades one update domain at a time (some objects will be updated first, followed by others), and the service is accessible during this time through your client (browser).  


Now, as the application upgrade proceeds, you can monitor it with Service Fabric Explorer, by using the **Upgrades in Progress** tab under the applications.

In a few minutes, all update domains should be upgraded (completed), and the Visual Studio output window should also state that the upgrade is completed. And you should find that *all* the visual objects in your browser window are now  rotating!

You may want to try changing the versions, and moving from version 2.0.0 to version 3.0.0 as an exercise, or even from version 2.0.0 back to version 1.0.0. Play with time-outs and health policies to make yourself familiar with them. When you are deploying to an Azure cluster, the parameters that you use will be different from the parameters that you use when you're deploying to a local cluster; we recommend that you set the time-outs conservatively.


## Next steps

[Upgrading your application using PowerShell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Control how your application is upgraded by using [upgrade parameters](service-fabric-application-upgrade-parameters.md).

Make your application upgrades compatible by learning how to use [data serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting application upgrades ](service-fabric-application-upgrade-troubleshooting.md).



[image1]: media/service-fabric-application-upgrade-tutorial/upgrade7.png
[image2]: media/service-fabric-application-upgrade-tutorial/upgrade1.png
[image3]: media/service-fabric-application-upgrade-tutorial/upgrade5.png
[image4]: media/service-fabric-application-upgrade-tutorial/upgrade6.png
