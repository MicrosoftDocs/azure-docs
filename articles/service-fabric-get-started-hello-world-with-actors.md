<properties 
   pageTitle="hello-world-with-actors"
   description="This tutorial walks through the steps of creating a Microsoft Azure Service Fabric application that provides a 'HelloWorldActor' service utilizing the Actor programming model"
   services="service-fabric" 
   documentationCenter=".net" 
   authors="zbrad" 
   manager="mike.andrews" 
   editor="vturcek" />

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="multiple" 
   ms.date="04/13/15"
   ms.author="brad.merrill"/>

# Hello World with Actors

This tutorial walks through the steps of creating a Microsoft Azure Service Fabric application that provides a 'HelloWorldActor' service utilizing the Actor programming model.

The actor programming model allows you to design your system as a number of "Actors".  These actors run in parallel, independent from each other.  They communicate by sending and receiving messages. Upon receiving a message, an actor makes local decisions, sends messages, and decides how to respond to the next message. This model maps naturally to many problem domains that have many self-contained agents, such as gamers in an online game, trucks in a fleet tracking system, and users in a social-network. 

Tutorial segments

- [How to implement a simple Actor service](#implement-the-service)
- [How to test and debug your service locally using a development cluster](#test-locally) 

## Prerequisites

- Download and unpack the March Preview zip file to a local folder of your choice. This folder will be referred as _DropFolder_ hereafter in this tutoral. Then, follow the steps in the **Service Fabric - Getting Started Guide - v0.3.docx** file to configure your development environment. 
- Install and configure [Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/).
- If you want to deploy the service to Azure, you need an active Azure subscription. If you don't have one, you can get a free trial at [azure.microsoft.com](http://azure.microsoft.com/en-gb/pricing/free-trial/).

## Implement the service

With Actor programming model, you define your system by creating different types of actors. This tutorial shows you how to create a new Actor service and how to send a test message to it using a test client.

1. Launch **Visual Studio 2015 CTP 6** as **Administrator**, and create a new **Windows Fabric Actor Service** Project named _HelloWorldActor_.

![][12]
    
  You will see 3 projects in the created solution. The first project is the application project (_HelloWorldActorApplication_), which
  contains the application manifest and a number of PowerShell scripts that help you to deploy your application. The second
  is the service project (_HelloWorldActor_), which contains the actual service implementation. The third
  project (_HelloWorldActor.Interfaces_) contains the actor interface. The interfaces are separate from actor implementations so that
  a client program can  be decoupled from the actual implementation. The separation also allows mocked actors to be used for testing purposes. 

![][13]

2. Edit **IHelloWorldActor.cs** in the **HelloWorldActor.Interfaces** project and rename **DoWorkAsync** to **SayHelloAsync**:
    ```c#
    Task<string> SayHelloAsync(string name);
    ```

3. Edit **HelloWorldActor.cs** in the **HelloWorldActor** project. Replace the **DoWorkAsync** method with a new **SayHelloAsync** method:
    ```c#
    public async Task<string> SayHelloAsync(string name)
    {
        ServiceEventSource.Current.ActorRequestStart(this, "SayHello");
        string result = await Task.FromResult(string.Format("Hello, {0}!", name));
        ServiceEventSource.Current.ActorRequestStop(this, "SayHello");
        return result;
    }
    ```

4. Right-click the solution and add a new C# console project called _ActorClient_
![][10]

1. Change the build platform target of the **ActorClient** project to **x64** by following these instructions:
  1) Right-click on the project and select **Properties**.
  1) Select the **Build** panel.
  1) Change **Platform Target** from _Any CPU_ to _x64_.
  1) Change configuration to **Active (Debug)** to **Release**.
  1) Change **Platform Target** from _Any CPU_ to _x64_.
  1) Change configuration back to **Active (Debug)**.
  1) Save changes.

1. Add a reference to the **System.Fabric.Services** assembly as well as the **System.Fabric.Common.Internal** assembly under the *%SystemDrive%\_FabActSdk_\bin* folder.

1. Add a project reference to the **HelloWorldActor.Interfaces** project.

1. Open the **Program.cs** file in the **ActorClient** project.

1. Replace the existing using statements with:
    ```c#
    using System;
    using System.Fabric.Services;
    using System.Fabric.Actors;
    ```

1. Add the following code to the **Main** method:
    ```c#
    var actorId = ActorId.NewId();
    var appName = "fabric:/HelloWorldActorApplication";
    var actor = ActorProxy.Create<HelloWorldActor.Interfaces.IHelloWorldActor>(actorId, appName);
    var response = actor.SayHelloAsync("John").Result;
    Console.WriteLine("Actor Response: " + response);
    Console.ReadLine();
    ```

1. Open the **ApplicationManifest.xml** file in the **HelloWorldActorApplication** project.

1. Remove the existing entry in the **DefaultServices** tag

1. Save changes and rebuild the solution to make sure everything builds correctly. The **ApplicationManifest.xml** file will be automatically modified to include the new service entry.


## Test locally

1. If you haven't done so, you need to launch a local cluster first. Launch **Windows PowerShell** as **administrator** and execute the **DevClusterSetup.ps1** script under the _DropFolder_**\ClusterSetup\Local** folder.

    >**NOTE**: Your local cluster might be already running, in which case the script will fail with many errors. If you want to clean up the local cluster, run the **CleanCluster.ps1** script under the same folder.

2. Right-click on the **ActorClient** project and select **Rebuild**. The Output window will indicate where the ActorClient.exe file is located. Browse to this location using Windows Explorer.
![][2]

3. With the **HelloWorldActorApplication** project set as the StartUp project press **F5**. The service will be deployed and started. You should expect to see a message indicating the application is ready. 
![][17]

5. Switch to the Windows Explorer that was opened in step 1. Double-click on ActorClient.exe. A command window should pop up with the following output. Once you have seen it, click any key to dismiss it.
![][4]

6. Set a break point in the **SayHelloAsync** method. Launch the client again and observe the break point being hit:
![][5]

7. Press **F5** to continue execution. Dismiss the client and then stop debugging.


## Conclusion

In this tutorial, you created a simple Actor service and a test client. You then tested and debugged the service locally.

The actor programming model is one of the programming models supported by Service Fabric. If you want to program directly against the service fabric framework API, please see [Tutorial: Getting Started with Service Fabric Stateless Service (HelloWorldStateless)](service-fabric-get-started-hello-world-stateless.md) and [Tutorial: Getting Started with Service Fabric Stateful Service (HelloWorldStateful)](service-fabric-get-started-hello-world-stateful.md). And then, please see [Tutorial: Getting Started with Service Fabric Web API Service (HelloWorldWebAPI)](service-fabric-get-started-echo-service-using-web-api.md) for a tutorial of using a communication listener to take client requests.

<!--image references-->
[1]: ./media/service-fabric-get-started-hello-world-with-actors/app-output.png
[2]: ./media/service-fabric-get-started-hello-world-with-actors/build-client.png
[3]: ./media/service-fabric-get-started-hello-world-with-actors/change.png
[4]: ./media/service-fabric-get-started-hello-world-with-actors/client-output.png
[5]: ./media/service-fabric-get-started-hello-world-with-actors/debug.png
[6]: ./media/service-fabric-get-started-hello-world-with-actors/deploy.png
[7]: ./media/service-fabric-get-started-hello-world-with-actors/health-output.png
[8]: ./media/service-fabric-get-started-hello-world-with-actors/info.png
[9]: ./media/service-fabric-get-started-hello-world-with-actors/new-app-output.png
[10]: ./media/service-fabric-get-started-hello-world-with-actors/new-client-project.png
[11]: ./media/service-fabric-get-started-hello-world-with-actors/new-container.png
[12]: ./media/service-fabric-get-started-hello-world-with-actors/new-project.png
[13]: ./media/service-fabric-get-started-hello-world-with-actors/new-sln.png
[14]: ./media/service-fabric-get-started-hello-world-with-actors/new-storage.png
[15]: ./media/service-fabric-get-started-hello-world-with-actors/replace-ref-actor.png
[16]: ./media/service-fabric-get-started-hello-world-with-actors/replace-ref-iactor.png
[17]: ./media/service-fabric-get-started-hello-world-with-actors/trace-output.png
[18]: ./media/service-fabric-get-started-hello-world-with-actors/warn.png

