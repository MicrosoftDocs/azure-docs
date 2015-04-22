<properties
   pageTitle="Service Fabric Application Upgrade: Data Serialization"
   description="Best practices for data serialization to ensure successful application upgrades."
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/22/2015"
   ms.author="jesseb"/>


# Service Fabric Application Upgrade: Data Serialization

In a rolling application upgrade, the upgrade is performed in stages. At each stage, the upgrade is applied to a subset of nodes in the cluster, called an upgrade domain. As a result, the application remains available throughout the upgrade. During the upgrade, the cluster may contain a mix of the old and new versions. For that reason, the two versions must be forward and backward compatible. If they are not compatible, the application administrator is responsible for staging a multiple-phase upgrade to maintain availability. This is done by doing an upgrade with an intermediate version of the application that is compatible with the previous version before upgrading to the final version.

## Next steps

[Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md)

[Upgrade Parameters](service-fabric-application-upgrade-parameters.md)

[Advanced Topics](service-fabric-application-upgrade-advanced.md)
