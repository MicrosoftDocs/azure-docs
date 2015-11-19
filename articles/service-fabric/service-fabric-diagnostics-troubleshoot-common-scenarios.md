<properties
   pageTitle="Troubleshoot Common Issues | Microsoft Azure"
   description="The most common issues encountered while deploying services on Microsoft Azure Service Fabric."
   services="service-fabric"
   documentationCenter=".net"
   authors="mattrowmsft"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/10/2015"
   ms.author="mattrow"/>


# Troubleshooting Common Issues
When running services on your developer machine it is easy to use [Visual Studio's debugging tools](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md). For remote clusters, [health reports](service-fabric-view-entities-aggregated-health.md) are always a good place to start. The easiest ways to access these reports are through powershell or [SFX](service-fabric-visualizing-your-cluster.md). This article assumes you are debugging a remote cluster and have a basic understanding of how to use either of these tools.

##Application Crash
The 'Partition is below target replica or instance count' report is a good indication that your service is crashing. To find out where your service is crashing takes a little more investigation. When running at scale, your best friend will be a set of well thought out traces.  We suggest you try [WAD](service-fabric-diagnostics-how-to-setup-wad-operational-insights.md) for collecting and viewing those traces.

![SFX Partition Health](./media/service-fabric-diagnostics-troubleshoot-common-scenarios/crashNewApp.png)

###During Service or Actor Initialization
Any exceptions before the service type is initialized will cause the process to crash. For these types of crashes the Application Event Log will show the error from your service.
These are the most common exceptions to see before the service is initialized.

| Error | Description |
| --- | --- |
| System.IO.FileNotFoundException | These are often due to missing assembly dependencies. Check the CopyLocal property in Visual Studio or the GAC for the node.
| System.Runtime.InteropServices.COMException at System.Fabric.Interop.NativeRuntime+IFabricRuntime.RegisterStatefulServiceFactory(IntPtr, IFabricStatefulServiceFactory)|This indicates the service type name registered does not match with the service manifest. |

[WAD](service-fabric-diagnostics-how-to-setup-wad-operational-insights.md) can be configured to upload the Application Event Log for all your nodes automatically.

###RunAsync() or OnActivateAsync()
If the crash happens during the initialization or running of your registered service type or actor, the exception will be caught by Service Fabric. You can view these from the EventSource providers detailed in Next Steps.

## Next steps

Learn more about existing diagnostics provided by Service Fabric:

* [Actors Diagnostics](service-fabric-reliable-actors-diagnostics.md)
* [Reliable Services Diagnostics](service-fabric-reliable-services-diagnostics.md)
