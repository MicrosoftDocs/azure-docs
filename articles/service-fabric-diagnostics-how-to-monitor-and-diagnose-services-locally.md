<properties
   pageTitle="Microsoft Azure Service Fabric How to monitor and diagnose services locally"
   description="This article describes how you can monitor and diagnose your services written using Microsoft Azure Service Fabric on a local development machine."
   services="service-fabric"
   documentationCenter=".net"
   authors="kunaldsingh"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/10/2015"
   ms.author="kunalds"/>


# Monitoring and Diagnosing Services in a local machine development setup
Monitoring, detecting, diagnosing and troubleshooting allows for services to continue with minimal disruption to user experience. While it is critical in an actual deployed production environment, the efficacy will depend on adopting a similar model during development of services to ensure that it works when you move to a real world setup. Service Fabric makes it easy for service developers to implement diagnostics that can seamlessly work across single machine local development and real world production cluster setups.

## Tracing and logging
ETW is the recommended technology for tracing messages in Service Fabric, some reasons for this are:

- There is built-in support in Service Fabric Visual Studio tools to view ETW events

- ETW tracing works seamlessly across local development environments and also real world cluster setups which means you don't have to rewrite your tracing code when you are ready to deploy your code to a real cluster.

- ETW is fast, it was built as a tracing technology that has a minimal impact on your code execution times.

- Service Fabric system code also traces messages as ETW thus allowing you to view your application traces interleaved with Service Fabric system traces which makes it easier to understand the sequence of operations and the interrelationship between what your application code is doing and what is happening in the underlying system.

## View Service Fabric system events in Visual Studio
Service Fabric emits ETW events to help application developers understand what is happening in the platform. To view these events follow these steps:

1. Launch Visual Studio with the installed Service Fabric tools.

2. Create or open an existing Service Fabric project.

3. Go to Server Explorer tab in Visual Studio, right-click the Service Fabric cluster and choose "View Diagnostic Events" in the context menu.

4. Run the application and observe as events emitted from Service Fabric show up in the Diagnostics Events window. Notice how each event has standard metadata information which tells you the node, application and service the event is coming from.

## Add your own custom traces to the application code
There is sample code in the templates that shows you how to easily add custom ETW traces from your application code that show up in the Visual Studio ETW viewer alongside system traces from Service Fabric. Just follow these steps to add your first custom trace and view it.
If you created a project from the stateful or stateless service templates (for Actor templates see instructions further below):

1. Open the Service.cs file and you will see a call to "ServiceEventSource.Current.Message" in the RunAsync method. This is an example of a custom ETW trace from the application code.

2. If you open the ServiceEventSource.cs file you will find to overloads for the ServiceEventSource.Message method that you can choose from to write the custom ETW traces.

3. The advantage of using these ServiceEventSource.Message methods for tracing is that the traces have helpful metadata automatically added to them and also the Visual Studio Diagnostic Viewer is already configured to display these.

If you created a project from the Actor stateful or stateless service templates:

1. Open the "ProjectName".cs file and you will see a call to "ActorEventSource.Current.ActorMessage" in the DoWorkAsync method. This is an example of a custom ETW trace from the application code.

2. If you open the ActorEventSource.cs file you will find to overloads for the ActorEventSource.ActorMessage method that you can choose from to write the custom ETW traces.

3. The advantage of using these ActorEventSource.ActorMessage methods for tracing is that the traces have helpful metadata automatically added to them and also the Visual Studio Diagnostic Viewer is already configured to display these.

After you have added a custom ETW trace in your service code you can build, deploy and run the application again to see your event(s)in the Diagnostic Viewer. If you debug the application with F5, the Diagnostic Viewer will be opened up automatically.

## Next steps

- [Service Fabric Health Introduction](service-fabric-health-introduction.md)

- <Application Insights setup>

- [Azure Service Fabric Actors Diagnostics and Performance Monitoring](service-fabric-fabact-diagnostics.md)

- [Stateful Reliable Service Diagnostics](service-fabric-fabsrv-diagnostics.md)
