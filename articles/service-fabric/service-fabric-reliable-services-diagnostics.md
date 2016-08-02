<properties
   pageTitle="Stateful Reliable Services diagnostics | Microsoft Azure"
   description="Diagnostic functionality for Stateful Reliable Services"
   services="service-fabric"
   documentationCenter=".net"
   authors="AlanWarwick"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/17/2016"
   ms.author="alanwar"/>

# Diagnostic functionality for Stateful Reliable Services
The Stateful Reliable Services StatefulServiceBase class emits [EventSource](https://msdn.microsoft.com/library/system.diagnostics.tracing.eventsource.aspx) events that can be used to debug the service, provide insights into how the runtime is operating, and help with troubleshooting.

## EventSource events
The EventSource name for the Stateful Reliable Services StatefulServiceBase class is "Microsoft-ServiceFabric-Services". Events from this event source appear in the
[Diagnostics Events](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md#view-service-fabric-system-events-in-visual-studio) window when the service is being [debugged in Visual Studio](service-fabric-debugging-your-application.md).

Examples of tools and technologies that help in collecting and/or viewing EventSource events are [PerfView](http://www.microsoft.com/download/details.aspx?id=28567),
[Microsoft Azure Diagnostics](../cloud-services/cloud-services-dotnet-diagnostics.md), and the
[Microsoft TraceEvent Library](http://www.nuget.org/packages/Microsoft.Diagnostics.Tracing.TraceEvent).

## Events

|Event name|Event ID|Level|Event description|
|----------|--------|-----|-----------------|
|StatefulRunAsyncInvocation|1|Informational|Emitted when service RunAsync task is started|
|StatefulRunAsyncCancellation|2|Informational|Emitted when service RunAsync task is cancelled|
|StatefulRunAsyncCompletion|3|Informational|Emitted when service RunAsync task is completed|
|StatefulRunAsyncSlowCancellation|4|Warning|Emitted when service RunAsync task takes too long to complete cancellation|
|StatefulRunAsyncFailure|5|Error|Emitted when service RunAsync task throws an exception|

## Interpret events

StatefulRunAsyncInvocation, StatefulRunAsyncCompletion, and StatefulRunAsyncCancellation events are useful to the service writer to understand the lifecycle of a service--as well as the timing for when a service is started, cancelled, or completed. This can be useful when debugging service issues or understanding the service lifecycle.

Service writers should pay close attention
to StatefulRunAsyncSlowCancellation and StatefulRunAsyncFailure events because they indicate issues with the service.

StatefulRunAsyncFailure is emitted whenever
the service RunAsync() task throws an exception. Typically, an exception thrown indicates an error or bug in the service. Additionally, the exception causes the service to fail, so it is moved to a different node. This can be an expensive operation and can delay incoming requests while the service is moved. Service writers should determine the cause of the exception and, if possible, mitigate it.

StatefulRunAsyncSlowCancellation is emitted whenever a cancellation request for the RunAsync task takes longer than four seconds. When a service takes too long to complete cancellation, it impacts
the ability for the service to be quickly restarted on another node. This may impact the overall availability of the service.
