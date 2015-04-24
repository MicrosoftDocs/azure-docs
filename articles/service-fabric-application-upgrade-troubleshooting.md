<properties
   pageTitle="Service Fabric Application Upgrade: Troubleshooting"
   description="This article covers some common errors related to upgrading a Service Fabric application and how to resolve them."
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

# Troubleshooting Application Upgrades

This article covers some of the common errors related to upgrading a Service Fabric application and how to resolve them. Errors during upgrade commonly occur due to setting timeouts that are too restrictive and health policies as too lax.


## Service Fabric is not following the health policies specified:

Possible Cause 1:

For all the percentages of health evaluation criteria, Service Fabric translate the percentages to the actual number of entities (i.e., replicas, partitions and services) in the systems and perform evaluation. During the translation Service Fabric always round up to the nearest number of whole entity when performing the evaluation. For example, if the maximum _MaxPercentUnhealthyReplicasPerPartition_ is 21% and there are 5 replicas for the services, Service Fabric will allow up to "2" replicas (i.e., `Math.Ceiling (5\*0.21)`) to be unhealthy when evaluating the partition health.  Please tweak the health policy parameters accordingly to get around this issue.

Possible Cause 2:

The health policies are specified in terms of percentages, and not actual services. For example, before an upgrade, assume that an application had four services A, B, C and D and one service, service D was unhealthy (and the unhealthy service wasn't impactful). For the upgrade, one sets the parameter *MaxPercentUnhealthyServices* to be 25% assuming only A, B and C needed to be healthy. However, during the upgrade Service Fabric found A, B, and D to be healthy and C to be unhealthy but completed the upgrade successfully (25% of services are unhealthy).  This might result in unanticipated errors since C being unhealthy may lead to serious errors.   The takeaway is that it is always beneficial to have a clean slate before starting an upgrade and set *MaxUnhealthyServices* and similar parameters to be 0%, so the application is health before an upgrade. In the above example, a first upgrade which removes Service D from the application, followed by the upgrade (the actual desired upgrade) would solve this problem.


## I did not specify a health policy for application upgrade. But, the upgrade still fails for some timeouts which I never specified.

Possible Cause:

As mentioned earlier, if the health evaluation criteria is not supplied, the application health policy specified in the pre-upgraded *ApplicationManifest.xml* of the application instance is used (for example, if upgrading Application X from v1 to v2, application health policies specified for Application X in v1 is used). If a different policy should be used for the upgrade, the policy (health evaluation criteria) needs to be specified as part of the application upgrade API call. The criteria specified as part of the APIs are transient and are only valid for that particular upgrade. Once the upgrade is completed, the policy specifies in the *ApplicationManifest.xml* is used.


## Incorrect Timeouts specified.

Possible Cause:

Users may have wondered about what happens if the timeouts are set inconsistently, for example, having an *UpgradeDomainTimeout* less than the *UpgradeTimeout*. The answer is that an error is returned. Other cases where this may happen is if *UpgradeDomainTimeout* is less than the sum of *HealthCheckWaitDuration* and *HealthCheckRetryTimeout* or if *UpgradeDomainTimeout* is less than the sum of *HealthCheckWaitDuration* and *HealthCheckStableDuration*.


## My upgrades are taking too long.

Possible Cause:

The time it takes for an upgrade to complete is dependent on the times specified for the various health checks and timeouts specified, which in turn are dependent on the time it takes for your application to upgrade (including copying the package, deploying and stabilizing). Being too aggressive with the timeouts might mean more failed upgrades, and thus starting conservatively is recommended and following the duration times for the upgrade domains and complete upgrade in the `Get-ServiceFabricApplicationUpgrade` to shorten as required. Generally, there shouldn't be any reason why one would want to optimize the upgrade cycle other than there being a critical bug fix that needs rapid deployment or such.

A quick refresher on how the timeouts interact with the upgrade times:

Upgrade for a upgrade domain cannot complete faster than *HealthCheckWaitDuration* + *HealthCheckStableDuration*.

Upgrade rollback cannot occur faster than *HealthCheckWaitDuration* + *HealthCheckRetryTimeout*.

The upgrade time for a upgrade domain is limited by *UpgradeDomainTimeout*.  If *HealthCheckRetryTimeout* and *HealthCheckStableDuration* are both non-zero and the health of the application keeps switching back and forth, then the upgrade will eventually timeout on *UpgradeDomainTimeout*. *UpgradeDomainTimeout* starts counting down once the upgrade for the current upgrade domain begins.


## Next steps

[Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md)

[Upgrade Parameters](service-fabric-application-upgrade-parameters.md)

[Advanced Topics](service-fabric-application-upgrade-advanced.md)

[Upgrade Flowchart](service-fabric-application-upgrade-flowchart.md)

[Data Serialization](service-fabric-application-upgrade-data-serialization.md)
