<properties
   pageTitle="Create your first Service Fabric application in Visual Studio | Microsoft Azure"
   description="Create, deploy, and debug a Service Fabric application using Visual Studio"
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="06/10/2016"
   ms.author="ryanwi"/>

# Create your first Azure Service Fabric application in Visual Studio

The Service Fabric SDK includes an add-in for Visual Studio that provides templates and tools for creating, deploying, and debugging Service Fabric applications. This topic walks you through the process of creating your first application in Visual Studio.

## Prerequisites

Before you get started, make sure that you have [set up your development environment](service-fabric-get-started.md).

## Video walkthrough

The following video walks through the steps in this tutorial:

>[AZURE.VIDEO creating-your-first-service-fabric-application-in-visual-studio]

## Create the application

A Service Fabric application can contain one or more services, each with a specific role in delivering the application's functionality. By using the New Project wizard, you can create an application project, along with your first service project. You can add more services later.

1. Launch Visual Studio as an administrator.

2. Click **File > New Project > Cloud > Service Fabric Application**.

3. Name the application and click **OK**.

	![New project dialog in Visual Studio][1]

4. On the next page, choose **Stateful** as the first service type to include in your application. Name it and click **OK**.

	![New service dialog in Visual Studio][2]

	>[AZURE.NOTE] For more information about the options, see [Service Fabric programming model overview](service-fabric-choose-framework.md).

	Visual Studio creates the application project and the stateful service project and displays them in Solution Explorer.

	![Solution Explorer following creation of application with stateful service][3]

	The application project does not contain any code directly. Instead, it references a set of service projects. In addition, it contains three other types of content:

	- **Publish profiles**: Used to manage tooling preferences for different environments.

	- **Scripts**: Includes a PowerShell script for deploying/upgrading your application. Visual Studio uses the script behind-the-scenes by Visual Studio. The script can also be invoked directly at the command line.

	- **Application definition**: Includes the application manifest under *ApplicationPackageRoot*. Associated application parameter files are under *ApplicationParameters*, which define the application and allow you to configure it specifically for a given environment.

    For an overview of the contents of the service project, see [Getting started with Reliable Services](service-fabric-reliable-services-quick-start.md).

## Deploy and debug the application

Now that you have an application, try running it.

1. Press F5 in Visual Studio to deploy the application for debugging.

	>[AZURE.NOTE] Deploying takes a while the first time, as Visual Studio is creating a local cluster for development. A local cluster runs the same platform code that you will build on in a multi-machine cluster, just on a single machine. The cluster creation status displays in the Visual Studio output window.

	When the cluster is ready, you will get a notification from the local cluster system tray manager application included with the SDK.

	![Local cluster system tray notification][4]

2. Once the application starts, Visual Studio automatically brings up the Diagnostics Event Viewer, where you can see trace output from the service.

	![Diagnostic events viewer][5]

	In the case of the stateful service template, the messages simply show the counter value incrementing in the `RunAsync` method of MyStatefulService.cs.

3. Expand one of the events to see more details, including the node where the code is running. In this case, it is _Node_2, though it may differ on your machine.

	![Diagnostic events viewer detail][6]

	The local cluster contains five nodes hosted on a single machine. It mimics a five-node cluster, where nodes are on distinct machines. Let's take down one of the nodes on the local cluster in order to simulate the loss of a machine while exercising the Visual Studio debugger at the same time.

    >[AZURE.NOTE] The application diagnostic events emitted by the project template use the included `ServiceEventSource` class. For more information, see [How to monitor and diagnose services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md).

4. Find the class in your service project that derives from StatefulService (for example, MyStatefulService) and set a breakpoint on the first line of the `RunAsync` method.

	![Breakpoint in stateful service RunAsync method][7]

5. Right-click the Local Cluster Manager system tray app and choose **Manage Local Cluster** in order to launch Service Fabric Explorer.

    ![Launch Service Fabric Explorer from the Local Cluster Manager][systray-launch-sfx]

    Service Fabric Explorer offers a visual representation of a cluster--including the set of applications deployed to it and the set of physical nodes that make it up. To learn more about Service Fabric Explorer, see [Visualizing your cluster](service-fabric-visualizing-your-cluster.md).

6. In the left pane, expand **Cluster > Nodes** and find the node where your code is running.

7. Click **Actions > Deactivate (Restart)** to simulate a machine restarting. (Note you can also deactivate from the context menu in the node list view in the left pane.)

	![Stop a node in Service Fabric Explorer][sfx-stop-node]

	Momentarily, you should see your breakpoint hit in Visual Studio as the computation you were doing on one node seamlessly fails over to another.

8. Return to the Diagnostic Events Viewer and observe the messages. Note that the counter has continued incrementing, even though the events are actually coming from a different node.

    ![Diagnostic events viewer after failover][diagnostic-events-viewer-detail-post-failover]

## Cleaning up

  Before wrapping up, it's important to remember that the local cluster is very real. Stopping the debugger removes your application instance and unregisters the application type. The cluster continues to run in the background, however. You have several options to manage the cluster:

  1. To shut down the cluster but keep the application data and traces, click **Stop Local Cluster** in the system tray app.

  2. To delete the cluster entirely, click **Remove Local Cluster** in the system tray app. Note that this option will result in another slow deployment the next time you press F5 in Visual Studio. Delete the cluster only if you don't intend to use the local cluster for some time or if you need to reclaim resources.

## Next steps

- Learn how to create a [cluster in Azure](service-fabric-cluster-creation-via-portal.md) or a [standalone cluster on Windows](service-fabric-cluster-creation-for-windows-server.md).
- Try creating a service using the [Reliable Services](service-fabric-reliable-services-quick-start.md) or [Reliable Actors](service-fabric-reliable-actors-get-started.md) programming models.
- Learn how you can expose your services to the Internet with a [web service front end](service-fabric-add-a-web-frontend.md).

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
