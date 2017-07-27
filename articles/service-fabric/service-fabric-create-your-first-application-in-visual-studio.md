---
title: Create an Azure Service Fabric reliable service with C#
description: Create, deploy, and debug a Reliable Service application built on Azure Service Fabric, with Visual Studio.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: vturecek

ms.assetid: c3655b7b-de78-4eac-99eb-012f8e042109
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/28/2017
ms.author: ryanwi
---

# Create your first C# Service Fabric stateful reliable services application

Learn how to deploy your first Service Fabric application for .NET on Windows in just a few minutes. When you're finished, you'll have a local cluster running with a reliable service application.

## Prerequisites

Before you get started, make sure that you have [set up your development environment](service-fabric-get-started.md). This includes installing the Service Fabric SDK and Visual Studio 2017 or 2015.

## Create the application

Launch Visual Studio as an **administrator**.

Create a project with `CTRL`+`SHIFT`+`N`

In the **New Project** dialog, choose **Cloud > Service Fabric Application**.

Name the application **MyApplication** and press **OK**.

   
![New project dialog in Visual Studio][1]

You can create any type of Service Fabric application from the next dialog. For this Quickstart, choose **Stateful Service**.

Name the service **MyStatefulService** and press **OK**.

![New service dialog in Visual Studio][2]


Visual Studio creates the application project and the stateful service project and displays them in Solution Explorer.

![Solution Explorer following creation of application with stateful service][3]

The application project (**MyApplication**) does not contain any code directly. Instead, it references a set of service projects. In addition, it contains three other types of content:

* **Publish profiles**  
Profiles for deploying to different environments.

* **Scripts**  
PowerShell script for deploying/upgrading your application.

* **Application definition**  
Includes the ApplicationManifest.xml file under *ApplicationPackageRoot* which describes your application's composition. Associated application parameter files are under *ApplicationParameters*, which can be used to specify environment-specific parameters. Visual Studio selects an application parameter file that's specified in the associated publish profile during deployment to a specific environment.
    
For an overview of the contents of the service project, see [Getting started with Reliable Services](service-fabric-reliable-services-quick-start.md).

## Deploy and debug the application

Now that you have an application, run it.

In Visual Studio, press `F5` to deploy the application for debugging.

>[!NOTE]
>The first time you run and deploy the application locally, Visual Studio creates a local cluster for debugging. This may take some time. The cluster creation status is displayed in the Visual Studio output window.

When the cluster is ready, you get a notification from the local cluster system tray manager application included with the SDK.
   
![Local cluster system tray notification][4]

Once the application starts, Visual Studio automatically brings up the **Diagnostics Event Viewer**, where you can see trace output from your services.
   
![Diagnostic events viewer][5]

The stateful service template we used simply shows a counter value incrementing in the `RunAsync` method of **MyStatefulService.cs**.

Expand one of the events to see more details, including the node where the code is running. In this case, it is \_Node\_2, though it may differ on your machine.
   
![Diagnostic events viewer detail][6]

The local cluster contains five nodes hosted on a single machine. In a production environment, each node is hosted on a distinct physical or virtual machine. To simulate the loss of a machine while exercising the Visual Studio debugger at the same time, let's take down one of the nodes on the local cluster.

In the **Solution Explorer** window, open **MyStatefulService.cs**. 

Find the `RunAsync` method and set a breakpoint on the first line of the method.

![Breakpoint in stateful service RunAsync method][7]

Launch the **Service Fabric Explorer** tool by right-clicking on the **Local Cluster Manager** system tray application and choose **Manage Local Cluster**.

![Launch Service Fabric Explorer from the Local Cluster Manager][systray-launch-sfx]

[**Service Fabric Explorer**](service-fabric-visualizing-your-cluster.md) offers a visual representation of a cluster. It includes the set of applications deployed to it and the set of physical nodes that make it up.

In the left pane, expand **Cluster > Nodes** and find the node where your code is running.

Click **Actions > Deactivate (Restart)** to simulate a machine restarting.

![Stop a node in Service Fabric Explorer][sfx-stop-node]

Momentarily, you should see your breakpoint hit in Visual Studio as the computation you were doing on one node seamlessly fails over to another.


Next, return to the Diagnostic Events Viewer and observe the messages. The counter has continued incrementing, even though the events are actually coming from a different node.

![Diagnostic events viewer after failover][diagnostic-events-viewer-detail-post-failover]

## Cleaning up the local cluster (optional)

Remember, this local cluster is real. Stopping the debugger removes your application instance and unregisters the application type. However, the cluster continues to run in the background. When you're ready to stop the local cluster, there are a couple options.

### Keep application and trace data

Shut down the cluster by right-clicking on the **Local Cluster Manager** system tray application and then choose **Stop Local Cluster**.

### Delete the cluster and all data

Remove the cluster by right-clicking on the **Local Cluster Manager** system tray application and then choose **Remove Local Cluster**. 

If you choose this option, Visual Studio will redeploy the cluster the next time your run the application. Choose this option if you don't intend to use the local cluster for some time or if you need to reclaim resources.

## Next steps
Read more about [reliable services](service-fabric-reliable-services-introduction.md).
<!-- Image References -->

[1]: ./media/service-fabric-create-your-first-application-in-visual-studio/new-project-dialog.png
[2]: ./media/service-fabric-create-your-first-application-in-visual-studio/new-project-dialog-2.png
[3]: ./media/service-fabric-create-your-first-application-in-visual-studio/solution-explorer-stateful-service-template.png
[4]: ./media/service-fabric-create-your-first-application-in-visual-studio/local-cluster-manager-notification.png
[5]: ./media/service-fabric-create-your-first-application-in-visual-studio/diagnostic-events-viewer.png
[6]: ./media/service-fabric-create-your-first-application-in-visual-studio/diagnostic-events-viewer-detail.png
[7]: ./media/service-fabric-create-your-first-application-in-visual-studio/runasync-breakpoint.png
[sfx-stop-node]: ./media/service-fabric-create-your-first-application-in-visual-studio/sfe-deactivate-node.png
[systray-launch-sfx]: ./media/service-fabric-create-your-first-application-in-visual-studio/launch-sfx.png
[diagnostic-events-viewer-detail-post-failover]: ./media/service-fabric-create-your-first-application-in-visual-studio/diagnostic-events-viewer-detail-post-failover.png
[sfe-delete-application]: ./media/service-fabric-create-your-first-application-in-visual-studio/sfe-delete-application.png
[switch-cluster-mode]: ./media/service-fabric-create-your-first-application-in-visual-studio/switch-cluster-mode.png
[cluster-setup-success-1-node]: ./media/service-fabric-get-started-with-a-local-cluster/cluster-setup-success-1-node.png
