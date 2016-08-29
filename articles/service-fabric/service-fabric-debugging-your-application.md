<properties
   pageTitle="Debug your application in Visual Studio | Microsoft Azure"
   description="Improve the reliability and performance of your services by developing and debugging them in Visual Studio on a local development cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/21/2016"
   ms.author="vturecek;mikhegn"/>

# Debug your Service Fabric application by using Visual Studio

## Debug a local Service Fabric application

You can save time and money by deploying and debugging your Azure Service Fabric application in a local computer development cluster. Visual Studio can deploy the application to the local cluster and automatically connect the debugger to all instances of your application.

1. Start a local development cluster by following the steps in [Setting up your Service Fabric development environment](service-fabric-get-started.md).

2. Press **F5** or click **Debug** > **Start Debugging**.

    ![Start debugging an application][startdebugging]

3. Set breakpoints in your code and step through the application by clicking commands in the **Debug** menu.

    > [AZURE.NOTE] Visual Studio attaches to all instances of your application. While you're stepping through code, breakpoints may get hit by multiple processes resulting in concurrent sessions. Try disabling the breakpoints after they're hit, by making each breakpoint conditional on the thread ID or by using diagnostic events.

4. The **Diagnostic Events** window will automatically open so you can view diagnostic events in real-time.

    ![View diagnostic events in real time][diagnosticevents]

5. You can also open the **Diagnostic Events** window in Cloud Explorer.  Under **Service Fabric**, right-click any node and choose **View Streaming Traces**.

    ![Open the diagnostic events window][viewdiagnosticevents]

    If you want to filter your traces to a specific service or application, simply enable streaming traces on that specific service or application.

6. The diagnostic events can be seen in the automatically generated **ServiceEventSource.cs** file and are called from application code.

    ```csharp
    ServiceEventSource.Current.ServiceMessage(this, "My ServiceMessage with a parameter {0}", result.Value.ToString());
    ```

7. The **Diagnostic Events** window supports filtering, pausing, and inspecting events in real-time.  The filter is a simple string search of the event message, including its contents.

    ![Filter, pause and resume, or inspect events in real-time][diagnosticeventsactions]

8. Debugging services is like debugging any other application. You will normally set Breakpoints through Visual Studio for easy debugging. Even though Reliable Collections replicate across multiple nodes, they still implement IEnumerable. This means that you can use the Results View in Visual Studio while debugging to see what you've stored inside. Simply set a breakpoint anywhere in your code.

    ![Start debugging an application][breakpoint]

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->

## Debug a remote Service Fabric application

If your Service Fabric applications are running on a Service Fabric cluster in Azure, you are able to remotely debug these, directly from Visual Studio.

> [AZURE.NOTE] The feature requires [Service Fabric SDK 2.0](http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-VS2015) and [Azure SDK for .NET 2.9](https://azure.microsoft.com/downloads/).    

<!-- -->
> [AZURE.WARNING] Remote debugging is meant for dev/test scenarios and not to be used in production environments, because of the impact on the running applications.

1. Navigate to your cluster in **Cloud Explorer**, right-click and choose **Enable Debugging**

    ![Enable remote debugging][enableremotedebugging]

    This will kick-off the process of enabling the remote debugging extension on your cluster nodes, as well as required network configurations.

2. Right-click the cluster node in **Cloud Explorer**, and choose **Attach Debugger**

    ![Attach debugger][attachdebugger]

3. In the **Attach to process** dialog, choose the process you want to debug, and click **Attach**

    ![Choose process][chooseprocess]

    The name of the process you want to attach to, equals the name of your service project assembly name.

    The debugger will attach to all nodes running the process.
    - In the case where you are debugging a stateless service, all instances of the service on all nodes are part of the debug session.
    - If you are debugging a stateful service, only the primary replica of any partition will be active and therefore caught by the debugger. If the primary replica moves during the debug session, the processing of that replica will still be part of the debug session.
    - In order to only catch relevant partitions or instances of a given service, you can use conditional breakpoints to only break a specific partition or instance.

    ![Conditional breakpoint][conditionalbreakpoint]

    > [AZURE.NOTE] Currently we do not support debugging a Service Fabric cluster with multiple instances of the same service executable name.

4. Once you finish debugging your application, you can disable the remote debugging extension by right-clicking the cluster in **Cloud Explorer** and choose **Disable Debugging**

    ![Disable remote debugging][disableremotedebugging]

## Streaming traces from a remote cluster node

You are also able to stream traces directly from a remote cluster node to Visual Studio. This feature allows you to stream ETW trace events, produced on a Service Fabric cluster node, directly in Visual Studio.

> [AZURE.NOTE] The feature requires [Service Fabric SDK 2.0](http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric-VS2015) and [Azure SDK for .NET 2.9](https://azure.microsoft.com/downloads/).

<!-- -->
> [AZURE.WARNING] Streaming traces is meant for dev/test scenarios and not to be used in production environments, because of the impact on the running applications.
> In a production scenario, you should rely on forwarding events using Azure Diagnostics.

1. Navigate to your cluster in **Cloud Explorer**, right-click and choose **Enable Streaming Traces**

    ![Enable remote streaming traces][enablestreamingtraces]

    This will kick-off the process of enabling the streaming traces extension on your cluster nodes, as well as required network configurations.

2. Expand the **Nodes** element in **Cloud Explorer**, right-click the node you want to stream traces from and choose **View Streaming Traces**

    ![View remote streaming traces][viewremotestreamingtraces]

    Repeat step 2 for as many nodes as you want to see traces from. Each nodes stream will show up in a dedicated window.

    You are now able to see the traces emitted by Service Fabric, and your services. If you want to filter the events to only show a specific application, simply type in the name of the application in the filter.

    ![Viewing streaming traces][viewingstreamingtraces]

4. Once you are done streaming traces from your cluster, you can disable remote streaming traces, by right-clicking the cluster in **Cloud Explorer** and choose **Disable Streaming Traces**

    ![Disable remote streaming traces][disablestreamingtraces]

## Next steps

- [Test a Service Fabric service](service-fabric-testability-overview.md).
- [Manage your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).

<!--Image references-->
[startdebugging]: ./media/service-fabric-debugging-your-application/startdebugging.png
[diagnosticevents]: ./media/service-fabric-debugging-your-application/diagnosticevents.png
[viewdiagnosticevents]: ./media/service-fabric-debugging-your-application/viewdiagnosticevents.png
[diagnosticeventsactions]: ./media/service-fabric-debugging-your-application/diagnosticeventsactions.png
[breakpoint]: ./media/service-fabric-debugging-your-application/breakpoint.png
[enableremotedebugging]: ./media/service-fabric-debugging-your-application/enableremotedebugging.png
[attachdebugger]: ./media/service-fabric-debugging-your-application/attachdebugger.png
[chooseprocess]: ./media/service-fabric-debugging-your-application/chooseprocess.png
[conditionalbreakpoint]: ./media/service-fabric-debugging-your-application/conditionalbreakpoint.png
[disableremotedebugging]: ./media/service-fabric-debugging-your-application/disableremotedebugging.png
[enablestreamingtraces]: ./media/service-fabric-debugging-your-application/enablestreamingtraces.png
[viewingstreamingtraces]: ./media/service-fabric-debugging-your-application/viewingstreamingtraces.png
[viewremotestreamingtraces]: ./media/service-fabric-debugging-your-application/viewremotestreamingtraces.png
[disablestreamingtraces]: ./media/service-fabric-debugging-your-application/disablestreamingtraces.png
