<properties
   pageTitle="Debugging your Service Fabric Application in Visual Studio"
   description="Improve the reliability and performance of your services using Visual Studio."
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/13/2015"
   ms.author="jesseb"/>

# Debugging your Service Fabric Application in Visual Studio

Visual Studio provides different options to debug your Service Fabric application.

- [Debugging your Service Fabric application on your local computer](#debuglocal)
- [Diagnostic tracing your Service Fabric application on your local computer](#tracelocal)

## <a name="debuglocal"></a>Debugging your Service Fabric application on your local computer

You can save time and money by deploying and debugging your Service Fabric application in a local computer development cluster. Visual Studio can deploy the application and automatically connect the debugger to all instances of your application.

1. Start a local development cluster by following the steps in [Setting up your Service Fabric development environment](../service-fabric-setup-your-development-environment)

2. Press **F5** or click **Debug** > **Start Debugging**

    ![Start debugging an application][startdebugging]

3. Set breakpoints in your code and step through the application by clicking on commands in the **Debug** menu.

  > [AZURE.NOTE] Visual Studio attaches to all instances of your application. While stepping through code, breakpoints may get hit by multiple processes resulting in concurrent sessions. Try disabling the breakpoint(s) after being hit or reducing the input to the services.


## <a name="tracelocal"></a>Diagnostic tracing your Service Fabric application on your local computer

1. In the automatically generated **ServiceEventSource.cs**, add a diagnostic **Event** method to trace information about the application event.

    ```
    [Event(2, Level = EventLevel.Informational, Message = "Service host {0} registered service type {1}")]
    public void ServiceTypeRegistered(int processId, string serviceType)
    {
        WriteEvent(2, processId, serviceType);
    }
    ```

2. In your application code, call the method to trace the application event.

    ```
    ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, Service.ServiceTypeName);
    ```

3. Start a local development cluster by following the steps in [Setting up your Service Fabric development environment](../service-fabric-setup-your-development-environment)

4. Press **F5** or click **Debug** > **Start Debugging** to deploy your application.

    ![Start debugging an application][startdebugging]

5. The **Diagnostic Events** window will automatically open to view diagnostic events in real time.  

    ![View diagnostic events in real time][diagnosticevents]

6. You can also open the **Diagnostic Events** window in the Server Explorer.  Under **Azure**, right click on **Service Fabric Cluster** > **View Diagnostic Events...**

    ![Open the diagnostic events window][viewdiagnosticevents]

7. The **Diagnostic Events** window supports filtering, pausing, and viewing events in real time.

    ![][diagnosticeventsactions]

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

- [Importance of testability](../service-fabric-testability-importance).
- [Managing your service](../service-fabric-fabsrv-managing-your-service).

<!--Image references-->
[startdebugging]: ./media/service-fabric-debugging-your-application/startdebugging.png
[diagnosticevents]: ./media/service-fabric-debugging-your-application/diagnosticevents.png
[viewdiagnosticevents]: ./media/service-fabric-debugging-your-application/viewdiagnosticevents.png
[diagnosticeventsactions]: ./media/service-fabric-debugging-your-application/diagnosticeventsactions.png
