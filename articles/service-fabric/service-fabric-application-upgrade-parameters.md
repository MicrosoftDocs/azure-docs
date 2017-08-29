---
title: 'Application upgrade: upgrade parameters | Microsoft Docs'
description: Describes parameters related to upgrading a Service Fabric application, including health checks to perform and policies to automatically undo the upgrade.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: a4170ac6-192e-44a8-b93d-7e39c92a347e
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/28/2017
ms.author: subramar

---
# Application upgrade parameters
This article describes the various parameters that apply during the upgrade of an Azure Service Fabric application. The parameters include the name and version of the application. They are knobs that control the time-outs and health checks that are applied during the upgrade, and they specify the policies that must be applied when an upgrade fails.

<br>

| Parameter | Description |
| --- | --- |
| ApplicationName |Name of the application that is being upgraded. Examples: fabric:/VisualObjects, fabric:/ClusterMonitor |
| TargetApplicationTypeVersion |The version of the application type that the upgrade targets. |
| FailureAction |The action taken by Service Fabric when the upgrade fails. The application may be rolled back to the pre-update version (rollback), or the upgrade may be stopped at the current upgrade domain. In the latter case, the upgrade mode is also changed to Manual. Allowed values are Rollback and Manual. |
| HealthCheckWaitDurationSec |The time to wait (in seconds) after the upgrade has finished on the upgrade domain before Service Fabric evaluates the health of the application. This duration can also be considered as the time an application should be running before it can be considered healthy. If the health check passes, the upgrade process proceeds to the next upgrade domain.  If the health check fails, Service Fabric waits for an interval (the UpgradeHealthCheckInterval) before retrying the health check again until the HealthCheckRetryTimeout is reached. The default and recommended value is 0 seconds. |
| HealthCheckRetryTimeoutSec |The duration (in seconds) that Service Fabric continues to perform health evaluation before declaring the upgrade as failed. The default is 600 seconds. This duration starts after HealthCheckWaitDuration is reached. Within this HealthCheckRetryTimeout, Service Fabric might perform multiple health checks of the application health. The default value is 10 minutes and should be customized appropriately for your application. |
| HealthCheckStableDurationSec |The duration (in seconds) to verify that the application is stable before moving to the next upgrade domain or completing the upgrade. This wait duration is used to prevent undetected changes of health right after the health check is performed. The default value is 120 seconds, and should be customized appropriately for your application. |
| UpgradeDomainTimeoutSec |Maximum time (in seconds) for upgrading a single upgrade domain. If this time-out is reached, the upgrade stops and proceeds based on the setting for UpgradeFailureAction. The default value is never (Infinite) and should be customized appropriately for your application. |
| UpgradeTimeout |A time-out (in seconds) that applies for the entire upgrade. If this time-out is reached, the upgrade stops and UpgradeFailureAction is triggered. The default value is never (Infinite) and should be customized appropriately for your application. |
| UpgradeHealthCheckInterval |The frequency that the health status is checked. This parameter is specified in the ClusterManager section of the *cluster* *manifest*, and is not specified as part of the upgrade cmdlet. The default value is 60 seconds. |

<br>

## Service health evaluation during application upgrade
<br>
The health evaluation criteria are optional. If the health evaluation criteria are not specified when an upgrade starts, Service Fabric uses the application health policies specified in the ApplicationManifest.xml of the application instance.

<br>

| Parameter | Description |
| --- | --- |
| ConsiderWarningAsError |Default value is False. Treat the warning health events for the application as errors when evaluating the health of the application during upgrade. By default, Service Fabric does not evaluate warning health events to be failures (errors), so the upgrade can proceed even if there are warning events. |
| MaxPercentUnhealthyDeployedApplications |Default and recommended value is 0. Specify the maximum number of deployed applications (see the [Health section](service-fabric-health-introduction.md)) that can be unhealthy before the application is considered unhealthy and fails the upgrade. This parameter defines the application health on the node and helps detect issues during upgrade. Typically, the replicas of the application get load-balanced to the other node, which allows the application to appear healthy, thus allowing the upgrade to proceed. By specifying a strict MaxPercentUnhealthyDeployedApplications health, Service Fabric can detect a problem with the application package quickly and help produce a fail fast upgrade. |
| MaxPercentUnhealthyServices |Default and recommended value is 0. Specify the maximum number of services in the application instance that can be unhealthy before the application is considered unhealthy and fails the upgrade. |
| MaxPercentUnhealthyPartitionsPerService |Default and recommended value is 0. Specify the maximum number of partitions in a service that can be unhealthy before the service is considered unhealthy. |
| MaxPercentUnhealthyReplicasPerPartition |Default and recommended value is 0. Specify the maximum number of replicas in partition that can be unhealthy before the partition is considered unhealthy. |
| UpgradeReplicaSetCheckTimeout |**Stateless service**--Within a single upgrade domain, Service Fabric tries to ensure that additional instances of the service are available. If the target instance count is more than one, Service Fabric waits for more than one instance to be available, up to a maximum time-out value. This time-out is specified by using the UpgradeReplicaSetCheckTimeout property. If the time-out expires, Service Fabric proceeds with the upgrade, regardless of the number of service instances. If the target instance count is one, Service Fabric does not wait, and immediately proceeds with the upgrade. **Stateful service**--Within a single upgrade domain, Service Fabric tries to ensure that the replica set has a quorum. Service Fabric waits for a quorum to be available, up to a maximum time-out value (specified by the UpgradeReplicaSetCheckTimeout property). If the time-out expires, Service Fabric proceeds with the upgrade, regardless of quorum. This setting is set as never (infinite) when rolling forward, and 900 seconds when rolling back. |
| ForceRestart |If you update a configuration or data package without updating the service code, the service is restarted only if the ForceRestart property is set to true. When the update is complete, Service Fabric notifies the service that a new configuration package or data package is available. The service is responsible for applying the changes. If necessary, the service can restart itself. |

<br>
<br>
The MaxPercentUnhealthyServices, MaxPercentUnhealthyPartitionsPerService, and MaxPercentUnhealthyReplicasPerPartition criteria can be specified per service type for an application instance. Setting these parameters per-service allows for an application to contain different services types with different evaluation policies. For example, a stateless gateway service type can have a MaxPercentUnhealthyPartitionsPerService that is different from a stateful engine service type for a particular application instance.

## Next steps
[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

[Upgrading your Application using Azure CLI on Linux](service-fabric-azure-cli.md#upgrading-your-application) walks you through an application upgrade using Azure CLI.

[Upgrading your application using Service Fabric Eclipse Plugin](service-fabric-get-started-eclipse.md#upgrade-your-service-fabric-java-application)

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).
