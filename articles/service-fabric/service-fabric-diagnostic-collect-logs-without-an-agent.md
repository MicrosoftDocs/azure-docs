---
title: Collect logs directly from an Azure Service Fabric service process | Microsoft Azure
description: Describes Service Fabric applications can send logs directly to a central location like Azure Application Insights or Elasticsearch, without relying on Azure Diagnostics agent.
services: service-fabric
documentationcenter: .net
author: karolz-ms
manager: rwike77
editor: ''

ms.assetid: ab92c99b-1edd-4677-8c28-4e591d909b47
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/18/2017
ms.author: karolz

redirect_url: /azure/service-fabric/service-fabric-diagnostics-event-aggregation-eventflow

---
# Collect logs directly from an Azure Service Fabric service process
## In-process log collection
Collecting application logs using [Azure Diagnostics extension](service-fabric-diagnostics-how-to-setup-wad.md) is a good option for **Azure Service Fabric** services if the set of log sources and destinations is small, does not change often, and there is a straightforward mapping between the sources and their destinations. If not, an alternative is to have services send their logs directly to a central location. This process is known as **in-process log collection** and has several potential advantages:

* *Easy configuration and deployment*

    * The configuration of diagnostic data collection is just part of the service configuration. It is easy to always keep it "in sync" with the rest of the application.
    * Per-application or per-service configuration is easily achievable.
        * Agent-based log collection usually requires a separate deployment and configuration of the diagnostic agent, which is an extra administrative task and a potential source of errors. Often there is only one instance of the agent allowed per virtual machine (node) and the agent configuration is shared among all applications and services running on that node. 

* *Flexibility*
   
    * The application can send the data wherever it needs to go, as long as there is a client library that supports the targeted data storage system. New destinations can be added as desired.
    * Complex capture, filtering, and data-aggregation rules can be implemented.
    * Agent-based log collection is often limited by the data sinks that the agent supports. Some agents are extensible.

* *Access to internal application data and context*
   
    * The diagnostic subsystem running inside the application/service process can easily augment the traces with contextual information.
    * With agent-based log collection, the data must be sent to an agent via some inter-process communication mechanism, such as Event Tracing for Windows. This mechanism could impose additional limitations.

It is possible to combine and benefit from both collection methods. Indeed, it might be the best solution for many applications. Agent-based collection is a natural solution for collecting logs related to the whole cluster and individual cluster nodes. It is much more reliable way, than in-process log collection, to diagnose service startup problems and crashes. Also, with many services running inside a Service Fabric cluster, each service doing its own in-process log collection results in numerous outgoing connections from the cluster. Large number of outgoing connections is taxing both for the network subsystem and for the log destination. An agent such as [**Azure Diagnostics**](../cloud-services/cloud-services-dotnet-diagnostics.md) can gather data from multiple services and send all data through a few connections, improving throughput. 

In this article, we show how to set up an in-process log collection using [**EventFlow open-source library**](https://github.com/Azure/diagnostics-eventflow). Other libraries might be used for the same purpose, but EventFlow has the benefit of having been designed specifically for in-process log collection and to support Service Fabric services. We use [**Azure Application Insights**](https://azure.microsoft.com/services/application-insights/) as the log destination. Other destinations such as [**Event Hubs**](https://azure.microsoft.com/services/event-hubs/) or [**Elasticsearch**](https://www.elastic.co/products/elasticsearch) are also supported. It is just a question of installing appropriate NuGet package and configuring the destination in the EventFlow configuration file. For more information on log destinations other than Application Insights, see [EventFlow documentation](https://github.com/Azure/diagnostics-eventflow).

## Adding EventFlow library to a Service Fabric service project
EventFlow binaries are available as a set of NuGet packages. To add EventFlow to a Service Fabric service project, right-click the project in the Solution Explorer and choose "Manage NuGet packages." Switch to the "Browse" tab and search for "`Diagnostics.EventFlow`":

![EventFlow NuGet packages in Visual Studio NuGet package manager UI][1]

The service hosting EventFlow should include appropriate packages depending on the source and destination for the application logs. Add the following packages: 

* `Microsoft.Diagnostics.EventFlow.Inputs.EventSource` 
    * (to capture data from the service's EventSource class, and from standard EventSources such as *Microsoft-ServiceFabric-Services* and *Microsoft-ServiceFabric-Actors*)
* `Microsoft.Diagnostics.EventFlow.Outputs.ApplicationInsights` 
    * (we are going to send the logs to an Azure Application Insights resource)  
* `Microsoft.Diagnostics.EventFlow.ServiceFabric` 
    * (enables initialization of the EventFlow pipeline from Service Fabric service configuration and reports any problems with sending diagnostic data as Service Fabric health reports)

> [!NOTE]
> `Microsoft.Diagnostics.EventFlow.Inputs.EventSource` package requires the service project to target .NET Framework 4.6 or newer. Make sure you set the appropriate target framework in project properties before installing this package. 

After all the packages are installed, the next step is to configure and enable EventFlow in the service.

## Configuring and enabling log collection
EventFlow pipeline, responsible for sending the logs, is created from a specification stored in a configuration file. `Microsoft.Diagnostics.EventFlow.ServiceFabric` package installs a starting EventFlow configuration file under `PackageRoot\Config` solution folder. The file name is `eventFlowConfig.json`. This configuration file needs to be modified to capture data from the default service `EventSource` class and send data to Application Insights service.

> [!NOTE]
> We assume that you are familiar with **Azure Application Insights** service and that you have an Application Insights resource that you plan to use to monitor your Service Fabric service. If you need more information, please see [Create an Application Insights resource](../application-insights/app-insights-create-new-resource.md).

Open the `eventFlowConfig.json` file in the editor and change its content as shown below. Make sure to replace the ServiceEventSource name and Application Insights instrumentation key according to comments. 

```json
{
  "inputs": [
    {
      "type": "EventSource",
      "sources": [
        { "providerName": "Microsoft-ServiceFabric-Services" },
        { "providerName": "Microsoft-ServiceFabric-Actors" },
        // (replace the following value with your service's ServiceEventSource name)
        { "providerName": "your-service-EventSource-name" }
      ]
    }
  ],
  "filters": [
    {
      "type": "drop",
      "include": "Level == Verbose"
    }
  ],
  "outputs": [
    {
      "type": "ApplicationInsights",
      // (replace the following value with your AI resource's instrumentation key)
      "instrumentationKey": "00000000-0000-0000-0000-000000000000"
    }
  ],
  "schemaVersion": "2016-08-11"
}
```

> [!NOTE]
> The name of service's ServiceEventSource is the value of the Name property of the `EventSourceAttribute` applied to the ServiceEventSource class. It is all specified in the `ServiceEventSource.cs` file, which is part of the service code. For example, in the following code snippet the name of the ServiceEventSource is *MyCompany-Application1-Stateless1*:
> ```csharp
> [EventSource(Name = "MyCompany-Application1-Stateless1")]
> internal sealed class ServiceEventSource : EventSource
> {
>    // (rest of ServiceEventSource implementation)
>} 
> ```

Note that `eventFlowConfig.json` file is part of service configuration package. Changes to this file can be included in full- or configuration-only upgrades of the service, subject to Service Fabric upgrade health checks and automatic rollback if there is upgrade failure. For more information, see [Service Fabric application upgrade](service-fabric-application-upgrade.md).

The final step is to instantiate EventFlow pipeline in your service's startup code, located in `Program.cs` file. In the following example  EventFlow-related additions are marked with comments starting with `****`:

```csharp
using System;
using System.Diagnostics;
using System.Threading;
using Microsoft.ServiceFabric;
using Microsoft.ServiceFabric.Services.Runtime;

// **** EventFlow namespace
using Microsoft.Diagnostics.EventFlow.ServiceFabric;

namespace Stateless1
{
    internal static class Program
    {
        /// <summary>
        /// This is the entry point of the service host process.
        /// </summary>
        private static void Main()
        {
            try
            {
                // **** Instantiate log collection via EventFlow
                using (var diagnosticsPipeline = ServiceFabricDiagnosticPipelineFactory.CreatePipeline("MyApplication-MyService-DiagnosticsPipeline"))
                {

                    
                    ServiceRuntime.RegisterServiceAsync("Stateless1Type",
                    context => new Stateless1(context)).GetAwaiter().GetResult();

                    ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, typeof(Stateless1).Name);

                    Thread.Sleep(Timeout.Infinite);
                }
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
                throw;
            }
        }
    }
}
```

The name passed as the parameter of the `CreatePipeline` method of the `ServiceFabricDiagnosticsPipelineFactory` is the name of the *health entity* representing the EventFlow log collection pipeline. This name is used if EventFlow encounters and error and reports it through the Service Fabric health subsystem.

## Verification
Start your service and observe the Debug output window in Visual Studio. After the service is started, you should start seeing evidence that your service is sending "Application Insights Telemetry" records. Open a web browser and navigate go to your Application Insights resource. Open "Search" tab (at the top of the default "Overview" blade). After a short delay you should start seeing your traces in the Application Insights portal:

![Application Insights portal showing logs from a Service Fabric application][2]

## Next steps
* [Learn more about diagnosing and monitoring a Service Fabric service](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
* [EventFlow documentation](https://github.com/Azure/diagnostics-eventflow)


<!--Image references-->
[1]: ./media/service-fabric-diagnostics-collect-logs-without-an-agent/eventflow-nugets.png
[2]: ./media/service-fabric-diagnostics-collect-logs-without-an-agent/ai-traces.png
