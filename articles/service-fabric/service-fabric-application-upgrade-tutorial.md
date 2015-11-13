<properties
   pageTitle="Service Fabric App upgrade tutorial| Microsoft Azure"
   description="This article walks through the experience of deploying a Service Fabric application, changing the code, and rolling out an upgrade using Visual Studio."
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
   ms.date="07/17/2015"
   ms.author="subramar"/>



# Service Fabric Application Upgrade Tutorial using Visual Studio

The most frequently used and recommended upgrade approach is the monitored rolling upgrade.  Service Fabric monitors the health of the application being upgraded based on a set of health policies. When the applications in an upgrade domain (UD) have been upgraded, Service Fabric evaluates the application health and determines whether to proceed to the next upgrade domain or fail the upgrade based on the health policies. A monitored application upgrade can be performed using the managed or native APIs, PowerShell, or REST. For instructions on performing an upgrade using PowerShell, please see [uprading your application with powershell](service-fabric-application-upgrade-tutorial-powershell.md).

Service Fabric monitored rolling upgrade allows the application administrator to configure the health evaluation policy that Service Fabric uses to determine the application is healthy. In addition, it also allows the administrator to configure the action to be taken when the health evaluation fails such as automatically roll-back. This section walkthrough a monitored upgrade for one of the SDK samples using PowerShell.

## Step 1: Build and Publish the Visual Objects sample

These steps can be done by downloading the application from github, and adding the **webgl-utils.js** and **gl-matrix-min.js** files into the project as mentioned in the sample's readme file. Without that the application will not work. After adding these to the project, build and publish the application by right clicking on the application project, **VisualObjectsApplication** and selecting the publish command in the Service Fabric menu item as follows. 

![Context Menu for a Service Fabric Application][image1]

This will bring up another popup, and you can set the **Connection Endpoint** to **Local Cluster**. The window should look like the following before you hit **Publish**.

![Publishing a Service Fabric Application][image2]

Now, you can use [Service Fabric Explorer to view the cluster and the application](service-fabric-visualizing-your-cluster.md). The Visual Objects application has a web service that can be navigated to in Internet Explorer by typing [http://localhost:8081/visualobjects](http://localhost:8081/visualobjects) in the address bar.  You should see ten floating visual objects moving around in the screen. 

## Step 2: Update the Visual Objects sample

You might notice that with the version that was deployed in Step 1, the visual objects do not rotate. Let us upgrade this application to one where the visual objects also rotate.

Select the VisualObjects.ActorService project within the VisualObjects solution, and open the StatefulVisualObjectActor.cs file. Within that file navigate to the method `MoveObject`, and comment out `this.State.Move()` and uncomment `this.State.Move(true)`. This change will make the objects rotate after the service is upgraded.  Now, build the project by selecting just the **ActorService** project and right clicking and selecting build in Visual Studio (if you select Rebuild all, you will have to update the versions for all the projects). 

We also need to version our application. You can use the Visual Studio **Edit Manifest Files** option after you right-click on the solution to make the version changes. This will bring up the dialog box for edition versions as follows:

![Versioning Dialog Box][image3]

Select the **Manifest Versions** tab and update the versions for the modified projects and their code packages, along with the application to version 2.0.0.0. After the changes are made, the manifest should look like the following (bold portions show the changes):

![Updating Versions][image4]

Save the changes, and now check the **Upgrade the Application** box.


## Step 3:  Upgrade your application

Please familiarize yourself with the [application upgrade parameters](service-fabric-application-upgrade-parameters.md) and the [upgrade process](service-fabric-application-upgrade.md) to get a good understanding of the various upgrade parameters, timeouts and health criterion applied. For this walkthrough, we will leave the service health evaluation criterion to be the default (UnMonitored Mode). You can set these by selecting **Configure Upgrade Settings** and modifying the parameters as desired.

Now, we are all set to start the application upgrade by selecting **Publish**. This will upgrade your application to version 2.0.0.0 in which the objects rotate. You will find that Service Fabric upgrades one upgrade domain at a time (some objects will be updated first, followed by others), and the service is accessible during this time through your client (browser).  


Now, as the application upgrade proceeds, you can monitor it using Service Fabric Explorer (**Upgrades in Progress** tab under the applications).

In a few minutes, all upgrade domains should be upgraded (completed), and the Visual Studio output window should also state that the upgrade is completed. And you should find that *all* the visual objects in your browser window will now have started rotating!

You may want to try changing the versions and moving from version 2 to version 3 as an exercise, or even from version 2 back to version 1 (yes, you can upgrade from v2 to v1). Play with timeouts and health policies to make yourself familiar. When you are deploying to an Azure cluster, the parameters used will be different than those that worked when deploying to a local cluster - it is recommended to set the timeouts conservatively.


## Next steps

[Uprading your Application Using Powershell](service-fabric-application-upgrade-tutorial.md).

[Upgrade Parameters](service-fabric-application-upgrade-parameters.md)

[Data Serialization](service-fabric-application-upgrade-data-serialization.md)

[Advanced Topics](service-fabric-application-upgrade-advanced.md)

[Troubleshooting Application Upgrade ](service-fabric-application-upgrade-troubleshooting.md)
 


[image1]: media/service-fabric-application-upgrade-tutorial/upgrade7.png
[image2]: media/service-fabric-application-upgrade-tutorial/upgrade1.png
[image3]: media/service-fabric-application-upgrade-tutorial/upgrade5.png
[image4]: media/service-fabric-application-upgrade-tutorial/upgrade6.png
