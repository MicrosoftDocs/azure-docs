<properties
   pageTitle="Create your first Service Fabric application in Visual Studio | Microsoft Azure"
   description="This topic how to create, deploy, and degug a Service Fabric application using Visual Studio"
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/30/2015"
   ms.author="seanmck"/>

# Create your first Service Fabric application in Visual Studio

The Service Fabric SDK includes an add-in for Visual Studio that provides templates and tools for creating, debugging, and deploying Service Fabric applications. This topic walks you through the process of creating your first application in Visual Studio.

## Prerequisites

Before getting started, make sure you have [set up your development environment](service-fabric-get-started.md).

## Create the application

A Service Fabric application can contain one or more services, each with a specific role in delivering the application's functionality. The New Project wizard lets you create an application project along with your first service project. You can add more services later.

1. Launch Visual Studio as an Administrator.

2. Click **File > New Project > Cloud > Service Fabric Application**.

3. Name the application and click OK.

	![New project dialog in Visual Studio][1]

4. In the next dialog, you will be asked to choose the first service type to include in your application. For the purposes of this tutorial, we will choose "Stateful Service". Name it and click OK.

	![New service dialog in Visual Studio][2]

	>[AZURE.NOTE] For more information about the options, see [Choosing a Framework](service-fabric-choose-framework.md).

	Visual Studio creates the application project and the stateful service project and displays them in Solution Explorer.

	![Solution Explorer following creation of application with stateful service][3]

	The Application project does not contain any code directly; instead, it references a set of service projects. In addition, it contains three other types of content:

	- **Publish Profiles**: Used to manage tooling preferences for different environments.

	- **Scripts**: A PowerShell script for deploying/upgrading your application. This script is used behind-the-scenes by Visual Studio and can be invoked directly at the command line.

	- **Application definition**: The application manifest and associated application parameter files define the application and allow you to configure it specifically for a given environment.

  For an overview of the contents of the service project, see [Getting Started with Reliable Services](service-fabric-reliable-services-quick-start.md).

## Deploy and debug the application

Now that we have an application, let's try running it.

1. Hit F5 in Visual Studio to deploy the application for debugging.

	>[AZURE.NOTE] This will take a while the first time as Visual Studio is creating a local cluster for development. A local cluster runs the same platform code that you will build on in a multi-machine cluster, just on a single machine. You will see cluster creation status in the Visual Studio output window.

	When the cluster is ready, you will get a notification from the local cluster system tray manager application included with the SDK.

	![Local cluster system tray notification][4]

2. Once the application starts, Visual Studio will automatically bring up the Diagnostics Event Viewer, where you can see trace output from the service.

	![Diagnostic events viewer][5]

	In the case of the stateful service template, the messages simply show the counter value that is being incremented in the `RunAsync` method of MyStatefulService.cs.

3. Expand one of the events to see more detail, including the node where the code is running - in this case, it is node 2 though it may differ on your machine.

	![Diagnostic events viewer detail][6]

	The local cluster is made up of five nodes, mimicking a cluster of five distinct machines. Let's simulate the loss of one of those machines and exercise the Visual Studio debugger at the same time.

    >[AZURE.NOTE] The application diagnostic events emitted by the project template use the included `ServiceEventSource` class. For more information, see [How to monitor and diagnose services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally)

4. Find the class in your service project that derives from StatefulService (eg. MyStatefulService) and set a breakpoint on the first line of the `RunAsync` method.

	![Breakpoint in stateful service RunAsync method][7]

5. Launch the Service Fabric Explorer tool from %programfiles%\Microsoft SDKs\Service Fabric\Tools\ServiceFabricExplorer\. Service Fabric Explorer offers a visual representation of a cluster, including the set of deployed applications deployed to it and the set of physical nodes that make it up.

6. In the left pane, expand **One/Local cluster > Node View** and find the node where your code is running.

7. Right-click the node and choose **Activate/Deactivate > Deactivate (remove data)** and confirm the action. This simulates a machine going down unexpectedly.

	![Deactivate a node in Service Fabric Explorer][8]

	Momentarily, you should see your breakpoint hit in Visual Studio as the computation you were doing on one node seamlessly fails over to another.

8. Return to the Diagnostic Events Viewer and observe the messages. Note that the counter has continued incrementing even though the events are actually coming from a different node.

## Next Steps

- [Learn how to create a cluster in Azure](service-fabric-cluster-creation-via-portal.md)
- [Learn more about creating Reliable Services](service-fabric-reliable-services-quick-start.md)
- [See how you can expose your services to the internet with WebAPI](service-fabric-reliable-services-communication-webapi.md)
- [Try creating a service using the Reliable Actor programming model](service-fabric-reliable-actors-get-started.md)

<!-- Image References -->

[1]: ./media/service-fabric-create-your-first-application-in-visual-studio/new-project-dialog.png
[2]: ./media/service-fabric-create-your-first-application-in-visual-studio/new-project-dialog-2.png
[3]: ./media/service-fabric-create-your-first-application-in-visual-studio/solution-explorer-stateful-service-template.png
[4]: ./media/service-fabric-create-your-first-application-in-visual-studio/local-cluster-manager-notification.png
[5]: ./media/service-fabric-create-your-first-application-in-visual-studio/diagnostic-events-viewer.png
[6]: ./media/service-fabric-create-your-first-application-in-visual-studio/diagnostic-events-viewer-detail.png
[7]: ./media/service-fabric-create-your-first-application-in-visual-studio/runasync-breakpoint.png
[8]: ./media/service-fabric-create-your-first-application-in-visual-studio/sfe-deactivate-node.png
