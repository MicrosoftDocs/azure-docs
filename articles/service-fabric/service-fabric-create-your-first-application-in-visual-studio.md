---
title: Create an Azure Service Fabric reliable service with C#
description: Create, deploy, and debug a Reliable Services application built on Azure Service Fabric, with Visual Studio.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: vturecek

ms.assetid: c3655b7b-de78-4eac-99eb-012f8e042109
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/21/2018
ms.author: ryanwi
---

# Create your first C# Service Fabric stateful Reliable Services application

Learn how to deploy your first Azure Service Fabric application for .NET on Windows in just a few minutes. When you're finished, you'll have a local cluster that's running with a Reliable Services application.

## Prerequisites

Before you get started, make sure that you've [set up your development environment](service-fabric-get-started.md). This process includes installing the Service Fabric SDK and Visual Studio 2017 or 2015.

## Create the application

1. Start Visual Studio as an administrator.

2. Create a project by selecting Ctrl+Shift+N.

3. In the **New Project** dialog box, select **Cloud** > **Service Fabric Application**.

4. Name the application **MyApplication**. Then select **OK**.

   ![New project dialog box in Visual Studio][1]

5. You can create any type of Service Fabric application from the next dialog box. For this quickstart, choose **.Net Core 2.0** > **Stateful Service**.

6. Name the service **MyStatefulService**. Then select **OK**.

    ![New service dialog box in Visual Studio][2]

    Visual Studio creates the application project and the stateful service project. Then it displays them in Solution Explorer.

    ![Solution Explorer following creation of an application with stateful service][3]

    The application project (**MyApplication**) does not have any code. Instead, it references a set of service projects. It also has three other types of content:

    * **Publish profiles**  
    Profiles for deploying to different environments.

    * **Scripts**  
    PowerShell scripts for deploying or upgrading your application.

    * **Application definition**  
Includes the ApplicationManifest.xml file under *ApplicationPackageRoot*, which describes your application's composition. Associated application parameter files are under *ApplicationParameters*, which can be used to specify environment-specific parameters. Visual Studio selects an application parameter file that's specified in the associated publish profile.
    
For an overview of the contents of the service project, see [Getting started with Reliable Services](service-fabric-reliable-services-quick-start.md).

## Deploy and debug the application

Now that you have an application, run, deploy, and debug it by taking the following steps.

1. In Visual Studio, select **F5** to deploy the application for debugging.  Click **Yes** if presented with a message box asking to grant 'ServiceFabricAllowedUsers' group read and execute permissions to your Visual Studio project directory.

    >[!NOTE]
    >The first time you run and deploy the application locally, Visual Studio creates a local cluster for debugging. This might take some time. The cluster creation status is displayed in the Visual Studio output window.
    
     When the cluster is ready, you get a notification from the local cluster system tray manager application that's included with the SDK.
     
    >[!NOTE]
    >This exercise reqires a 5 Node (vs. 1 Node) cluster. You can verify this as follows:
    >Start the Service Fabric Explorer tool by right-clicking the **Service Fabric Local Cluster Manager** system tray application and then click **Switch Cluster Mode**. Click **5 Node** if 1 Node is currently selected.
    
    ![Local cluster system tray notification][4]

    After the application starts, Visual Studio automatically brings up the Diagnostics Event Viewer, where you can see trace output from your services.
    
    ![Diagnostic events viewer][5]

    >[!NOTE]
    >Events should automatically start tracking in the Diagnostic Events Viewer. If you need to manually configure the Diagnostic Events Viewer, first open the `ServiceEventSource.cs` file, which is located in the project **MyStatefulService**. Copy the value of the `EventSource` attribute at the top of the `ServiceEventSource` class. In the following example, the event source is called `"MyCompany-MyApplication-MyStatefulService"`, which might be different in your situation.
>
    >![Locating Service Event Source Name][service-event-source-name]


2. Next, open the **ETW Providers** dialog box. Then select the gear icon that's located on the **Diagnostics Events** tab. Paste the name of the event source that you copied into the **ETW Providers** input box. Then select the **Apply** button. This automatically starts tracing events.

    ![Setting Diagnostics Event source name][setting-event-source-name]

    You should now see events appear in the Diagnostics Events window.

    The stateful service template shows a counter value that's incrementing in the `RunAsync` method of **MyStatefulService.cs**.

3. Expand one of the events to see more details, including the node where the code is running. In this case, it is **\_Node\_0,** though it might differ on your machine.
   
    ![Diagnostic events viewer detail][6]

4. The local cluster contains five nodes that are hosted on a single machine. In a production environment, each node is hosted on a distinct physical or virtual machine. To simulate the loss of a machine while you're exercising the Visual Studio debugger, take down one of the nodes on the local cluster.

5. In the **Solution Explorer** window, open **MyStatefulService.cs**. 

6. Find the `RunAsync` method, and then set a breakpoint on the first line of the method.

    ![Breakpoint in stateful service RunAsync method][7]

7. Start the Service Fabric Explorer tool by right-clicking the **Service Fabric Local Cluster Manager** system tray application and then selecting **Manage Local Cluster**.

    ![Start Service Fabric Explorer from the local cluster manager][systray-launch-sfx]

    [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) offers a visual representation of a cluster. It includes the set of applications that is deployed to it and the set of physical nodes that make it up.

8. In the left pane, expand **Cluster** > **Nodes**, and find the node where your code is running. Then, to simulate a machine restarting, select **Actions** > **Deactivate (Restart)**.

    ![Stop a node in Service Fabric Explorer][sfx-stop-node]

    Momentarily, you should see your breakpoint hit in Visual Studio as the computation you were doing on one node seamlessly fails over to another. Press **F5** to continue.

9. Next, return to the Diagnostic Events Viewer and observe the messages. The counter has continued incrementing, even though the events are actually coming from a different node.

    ![Diagnostic events viewer after failover][diagnostic-events-viewer-detail-post-failover]

## Clean up the local cluster (optional)

Remember, this local cluster is real. Stopping the debugger removes your application instance and unregisters the application type. However, the cluster continues to run in the background. When you're ready to stop the local cluster, there are a couple options.

### Keep application and trace data

Shut down the cluster by right-clicking the **Local Cluster Manager** system tray application and then selecting **Stop Local Cluster**.

### Delete the cluster and all data

Remove the cluster by right-clicking the **Local Cluster Manager** system tray application. Then choose **Remove Local Cluster**. 

If you choose this option, Visual Studio redeploys the cluster the next time you run the application. Choose this option if you don't intend to use the local cluster for a while or if you need to reclaim resources.

## Next steps
Read more about [Reliable Services](service-fabric-reliable-services-introduction.md).
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
[service-event-source-name]: ./media/service-fabric-create-your-first-application-in-visual-studio/event-source-attribute-value.png
[setting-event-source-name]: ./media/service-fabric-create-your-first-application-in-visual-studio/setting-event-source-name.png
[switch-cluster-mode]: ./media/service-fabric-create-your-first-application-in-visual-studio/switch-cluster-mode.png
[cluster-setup-success-1-node]: ./media/service-fabric-get-started-with-a-local-cluster/cluster-setup-success-1-node.png
[service-event-source-name]: ./media/service-fabric-create-your-first-application-in-visual-studio/event-source-attribute-value.png
[setting-event-source-name]: ./media/service-fabric-create-your-first-application-in-visual-studio/setting-event-source-name.png
