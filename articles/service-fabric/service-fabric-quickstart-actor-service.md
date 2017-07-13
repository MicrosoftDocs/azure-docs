---
title: Create an Azure Service Fabric reliable actors application in C# | Microsoft Docs
description: Create, deploy, and debug a C# reliable actors application built on Azure Service Fabric, with Visual Studio.
services: service-fabric
documentationcenter: .net
author: thraka
manager: timlt
editor: 'vturecek'

ms.assetid: ''
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/29/2017
ms.author: adegeo
---

# Create your first C# Service Fabric reliable actors application on Windows

> [!div class="op_single_selector"]
> * [First C# reliable actors application](service-fabric-quickstart-actor-service.md)
> * [First Java reliable actors application](service-fabric-create-your-first-linux-application-with-java.md)
>

This quickstart helps you locally deploy your first .NET Service Fabric actor service in just a few minutes. When you're finished, you'll have a local cluster running your service.

## Prerequisites

Before you get started, make sure that you have [set up your development environment](service-fabric-get-started.md). Which includes installing the Service Fabric SDK and Visual Studio 2017 or 2015.

## Create the service

Launch Visual Studio as an **administrator**.

Create a project with `CTRL`+`SHIFT`+`N`

In the **New Project** dialog, choose **Cloud > Service Fabric Application**.

Name the application **MyApplication** and press **OK**.

   
![New project dialog in Visual Studio][1]

You can create any type of Service Fabric service from the next dialog. For this Quickstart, choose **Actor Service**.

Name the service **MyActorService** and press **OK**.

![New service dialog in Visual Studio][2]


Visual Studio creates the application project and the actor service project and displays them in Solution Explorer.

![Solution Explorer following creation of application with actor service][3]

The application project (**MyApplication**) does not contain any code directly. Instead, it references a set of service projects. In addition, it contains three other types of content:

* **Publish profiles**  
Profiles for deploying to different environments.

* **Scripts**  
PowerShell script for deploying/upgrading your application.

* **Application definition**  
Includes the ApplicationManifest.xml file under *ApplicationPackageRoot* which describes your application's composition. Associated application parameter files are under *ApplicationParameters*, which can be used to specify environment-specific parameters. Visual Studio selects an application parameter file that's specified in the associated publish profile during deployment to a specific environment.
    
For an overview of the contents of the service project, see [Getting started with Reliable Services](service-fabric-reliable-services-quick-start.md).

## Create a test client

At this point when you run the service, it's ready to create and run actor instances. Now you need a client to send messages to the service to create actor instances. Normally, the client would be another service that sends messages to the actor service to perform some work, but for this quick-start we'll create a simple console application to do the job.

Create a console project and add it to the solution with `CTRL`+`SHIFT`+`N`.

Name the project **MyActorClient** and press **OK**.

In **Solution Explorer**, right-click **MyActorClient** > **Properties**.

Choose the **Build** tab and set **Platform target** to **x64**.

Press `CTRL`+`SHIFT`+`S` to save, and then, close the properties tab.

![Set x64 as target platform][prop-page-build]

### NuGet packages

In **Solution Explorer**, right-click **MyActorClient** > **Manage NuGet Packages...**

Select the **Browse** tab and type **Microsoft.ServiceFabric.Actors** into the search box.

Select **Microsoft.ServiceFabric.Actors**. Choose the latest stable release, and press **Install**.

### References

In **Solution Explorer**, under the **MyActorClient** project, right-click **References** > **Add Reference...**

On the left-side, navigate to **Projects** > **Solution**.

Check **MyActorService.Interfaces** and press OK.

### Configure solution startup

In **Solution Explorer**, right-click the **MyApplication** solution and choose **Properties**.

On the left-side, choose **Common Properties** > **Startup Project**.

Make sure that **Multiple startup projects** is selected.

Reorder the projects and set the *Action* to match the following table:

| Project                   | Action |
| ------------------------- | ------ |
| MyApplication             | Start |
| MyActorClient             | Start |
| MyActorService            | None |
| MyActorService.Interfaces | None |

### Program code

In **Solution Explorer**, under the **MyActorClient** project, open **Program.cs**. Replace the code with the following.

```csharp
using System;

namespace MyActorClient
{
    class Program
    {
        static void Main(string[] args)
        {
            System.Threading.CancellationToken token = new System.Threading.CancellationToken();

            var service = Microsoft.ServiceFabric.Actors.Client.ActorProxy.Create<MyActorService.Interfaces.IMyActorService>(
                            new Microsoft.ServiceFabric.Actors.ActorId("actor1"),
                            new Uri("fabric:/MyApplication/MyActorServiceActorService"));

            int counter = 0;

            while (counter != 100)
            {
                Console.WriteLine("Sending counter...");
                service.SetCountAsync(counter, token);

                counter = service.GetCountAsync(token).Result;

                Console.WriteLine($"Received counter {counter}");

                counter += 1;

                System.Threading.Thread.Sleep(1000);
            }
        }
    }
}

```

The test program is complete and you can now run the project.

## Deploy and debug the application

Now that you have an application, run it.

In Visual Studio, press `F5` to deploy the application for debugging.

>[!NOTE]
>Visual Studio creates a local cluster for debugging the first time you (locally) run and deploy. This deployment may take some time. The cluster creation status is displayed in the Visual Studio output window.

When the cluster is ready, you get a notification from the Service Fabric system tray manager application.
   
![Local cluster system tray notification][4]

Once the application starts, Visual Studio automatically opens the **Diagnostics Event Viewer** tab, where you can see the trace output from the service.
   
![Diagnostic events viewer][5]

The actor method is shown in the diagnostic viewer each time the test client sends an actor to the service.

Expand one of the events to see more details, including the node where the code is running. In this case, it is \_Node\_2, though it may differ on your machine.
   
![Diagnostic events viewer detail][6]

## Resiliency

The local cluster contains five nodes hosted on a single machine. It mimics a five-node cluster, where each node is on a different machine. To simulate the loss of a machine, let's take down one of the nodes on the local cluster.

Run the visual studio project and wait for the counter to start incrementing. Once the counter begins to increment, launch the [**Service Fabric Explorer**](service-fabric-visualizing-your-cluster.md) tool by right-clicking on the **Local Cluster Manager** system tray application and choose **Manage Local Cluster**.

![Launch Service Fabric Explorer from the Local Cluster Manager][systray-launch-sfx]

In the left pane, expand **Cluster > Nodes** and expand **Cluster > Applications > MyApplicationType > fabric:/MyApplication > fabric:/MyActorServiceActorService > [GUID]**.

Find the node listed as the primary, and click the **... > Deactivate (Restart)**.

![Service fabric explorer menu to deactivate the node][manager-deactivate]

The node deactivates and a new node becomes primary.

![Service fabric explorer active primary changed to a new node][manager-new-primary]

Notice that the test client counter continues to increment even though the node running the code disappeared.

## Cleaning up the local cluster (optional)

Remember, this local cluster is real. Stopping the debugger removes your application instance and unregisters the application type. However, the cluster continues to run in the background.

### Keep application and trace data

Shut down the cluster by right-clicking on the **Local Cluster Manager** system tray application and then choose **Stop Local Cluster**.

### Delete the cluster

Remove the cluster by right-clicking on the **Local Cluster Manager** system tray application and then choose **Remove Local Cluster**. 

If you choose this option, Visual Studio will redeploy the cluster the next time your run the application. Choose this option if you don't intend to use the local cluster for some time, or if you need to reclaim resources.

## Next steps

Read more about [reliable actors](service-fabric-reliable-actors-introduction.md).


<!-- Image References -->

[1]: ./media/service-fabric-quickstart-actor-service/new-project.png
[2]: ./media/service-fabric-quickstart-actor-service/new-service.png
[3]: ./media/service-fabric-quickstart-actor-service/solution-explorer.png
[prop-page-build]: ./media/service-fabric-quickstart-actor-service/build-x64-page.png
[4]: ./media/service-fabric-quickstart-actor-service/local-cluster-manager-notification.png
[5]: ./media/service-fabric-quickstart-actor-service/diagnostic-sample.png
[6]: ./media/service-fabric-quickstart-actor-service/diagnostic-sample-expand.png
[manager-deactivate]: ./media/service-fabric-quickstart-actor-service/service-fabric-explorer-deactivate.png
[manager-new-primary]: ./media/service-fabric-quickstart-actor-service/service-fabric-explorer-new-primary.png
[systray-launch-sfx]: ./media/service-fabric-quickstart-actor-service/launch-sfx.png