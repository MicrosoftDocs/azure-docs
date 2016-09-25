<properties
   pageTitle="Locally monitor and diagnose services written with Azure Service Fabric | Microsoft Azure"
   description="Learn how to monitor and diagnose your services written using Microsoft Azure Service Fabric on a local development machine."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/24/2016"
   ms.author="subramar"/>


# Monitor and diagnose services in a local machine development setup


> [AZURE.SELECTOR]
- [Windows](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
- [Linux](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md)

Monitoring, detecting, diagnosing, and troubleshooting allow for services to continue with minimal disruption to the user experience. While monitoring and diagnostics are critical in an actual deployed production environment, the efficacy will depend on adopting a similar model during development of services to ensure they work when you move to a real-world setup. Service Fabric makes it easy for service developers to implement diagnostics that can seamlessly work across both single-machine local development setups and real-world production cluster setups.


Please refer to the code examples in github on using the Java.Util.Logging framework for Java applications, and EventSource for C# applications.


## Next steps
The same tracing code that you added to your application above for local diagnostics will work with tools that you can use to view these events when running your application on an Azure cluster. Check out these articles that discuss the different options for the tools and describe how you can set them up.
* [How to collect logs with Azure Diagnostics](service-fabric-diagnostics-how-to-setup-lad.md)
