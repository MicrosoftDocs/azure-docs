<properties
   pageTitle="Service Fabric Application Upgrade: The End-to-End Flow"
   description="This article depicts the end to end flow for upgrading a Service Fabric application."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="samgeo"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/15/2015"
   ms.author="subramar"/>



# Application Upgrade Flowchart

The flowchart below aids with the understanding of the upgrade process of a Service Fabric application. In particular, the flow describes how the timeouts including *HealthCheckStableDuration*, *HealthCheckRetryTimeout* and *UpgradeHealthCheckInterval* help control when the upgrade in one upgrade domain is considered a success or a failure. 

![The Upgrade Process for a Service Fabric Application][image]

## Next steps

[Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md)

[Upgrade Parameters](service-fabric-application-upgrade-parameters.md)

[Advanced Topics](service-fabric-application-upgrade-advanced.md)

[Troubleshooting Application Upgrade ](service-fabric-application-upgrade-troubleshooting.md)



[image]: media/service-fabric-application-upgrade-flowchart/service-fabric-application-upgrade-flowchart.png
