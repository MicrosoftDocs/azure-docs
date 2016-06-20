
<properties
   pageTitle="Application upgrade: upgrade parameters | Microsoft Azure"
   description="Describes parameters related to upgrading a Service Fabric application, including health checks to perform and policies to automatically undo the upgrade."
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
   ms.date="05/18/2016"
   ms.author="subramar"/>



# Application upgrade parameters

This article describes the various parameters that apply during the upgrade of an Azure Service Fabric application. The parameters include the name and version of the application. They are knobs that control the time-outs and health checks that are applied during the upgrade, and they specify the policies that must be applied when an upgrade fails.


<br>

| Parameter | Description |
| --- | --- |
| ApplicationName | Name of the application that is being upgraded. Examples:fabric:/VisualObjects, fabric:/ClusterMonitor  |
| TargetApplicationTypeVersion | The version of the application type that the upgrade targets. |
| FailureAction | The action to be taken by Service Fabric if the upgrade fails. The application may be rolled back to the last version prior to the update (rollback), or the application upgrade may be stopped at the current upgrade domain and the upgrade mode changed to Manual. Allowed values are Rollback and Manual. |
| HealthCheckWaitDurationSec | The time to wait (in seconds) after the upgrade has finished on the upgrade domain before Service Fabric evaluates the health of the application. This duration can also be considered as the time an application should be running before it can be considered healthy. If the health check passes, the upgrade process proceeds to the next upgrade domain.  If the health check fails, Service Fabric waits for an interval (the UpgradeHealthCheckInterval) before retrying the health check again until the HealthCheckRetryTimeout is reached. The default and recommended value is 0 seconds. |
| HealthCheckRetryTimeoutSec | The duration (in seconds) that Service Fabric continues to perform health evaluation before declaring the upgrade as failed. The default is 600 seconds. This duration starts after HealthCheckWaitDuration is reached. Within this HealthCheckRetryTimeout, Service Fabric might perform multiple health checks of the application health. The default value is 10 minutes and should be customized appropriately for your application. |
| HealthCheckStableDurationSec | The duration (in seconds) to wait in order to verify that the application is stable before moving to the next upgrade domain or completing the upgrade. This wait duration is used to prevent undetected changes of health right after the health check is performed. The default value is 0 seconds, and should be customized appropriately for your application. |
| UpgradeDomainTimeoutSec | Maximum time (in seconds) for upgrading a single upgrade domain. If this time-out is reached, the upgrade stops and takes the action specified by UpgradeFailureAction. The default value is never (Infinite) and should be customized appropriately for your application. |
| UpgradeTimeout | A time-out (in seconds) that applies for the entire upgrade. If this time-out is reached, the upgrade stops and  UpgradeFailureAction is triggered. The default value is never (Infinite) and should be customized appropriately for your application. |
| UpgradeHealthCheckInterval | The frequency that the health status is checked. This parameter is specified in the ClusterManager section of the _cluster_ _manifest_ .(This is not specified as part of the upgrade cmdlet.) The default value is 60 seconds.  |






<br>
## Service health evaluation during application upgrade

<br>
The health evaluation criteria are optional. If the health evaluation criteria are not specified when an upgrade starts, Service Fabric uses the application health policies specified in the ApplicationManifest.xml of the application instance that is being upgraded.


<br>

| Parameter | Description |
| --- | --- |
| ConsiderWarningAsError | Default value is False. Treat the warning health events for the application as errors when evaluating the health of the application during upgrade. By default, Service Fabric does not evaluate warning health events to be failures (errors), so the upgrade can proceed even if there are warning events.   |
| MaxPercentUnhealthyDeployedApplications | Default and recommended value is 0. Specify the maximum number of deployed applications (see the [Health section](service-fabric-health-introduction.md)) that can be unhealthy before the application is considered unhealthy and fails the upgrade. This is the health of the application package on the node, so it's useful for detecting immediate issues during upgrade,  when the application package deployed on the node is unhealthy (crashing, etc). In a typical case, the replicas of the application will get load-balanced to the other node, thus making the application appear healthy and allowing the upgrade to proceed. By specifying a strict MaxPercentUnhealthyDeployedApplications health, Service Fabric can detect a problem with the application package quickly and help produce a fail fast upgrade. |
| MaxPercentUnhealthyServices | Default and recommended value is 0. Specify the maximum number of services in the application instance that can be unhealthy before the application is considered unhealthy and fails the upgrade. |
| MaxPercentUnhealthyPartitionsPerService | Default and recommended value is 0. Specify the maximum number of partitions in a service that can be unhealthy before the service is considered unhealthy. |
| MaxPercentUnhealthyReplicasPerPartition | Default and recommended value is 0. Specify the maximum number of replicas in partition that can be unhealthy before the partition is considered unhealthy. |
| UpgradeReplicaSetCheckTimeout | **Stateless service**--Within a single upgrade domain, Service Fabric tries to ensure that additional instances of the service are available. If the target instance count is more than one, Service Fabric waits for more than one instance to be available, up to a maximum time-out value (specified by the UpgradeReplicaSetCheckTimeout property). If the time-out expires, Service Fabric proceeds with the upgrade, regardless of the number of service instances. If the target instance count is one, Service Fabric does not wait, and immediately proceeds with the upgrade. **Stateful service**--Within a single upgrade domain, Service Fabric tries to ensure that the replica set has a quorum. Service Fabric waits for a quorum to be available, up to a maximum time-out value (specified by the UpgradeReplicaSetCheckTimeout property). If the time-out expires, Service Fabric proceeds with the upgrade, regardless of quorum. This setting is set as never (infinite) when rolling forward (applied when the upgrade is proceeding as expected), and 900 seconds when rolling back (applied when the upgrade runs into errors and is rolling back). |
| ForceRestart | If you update a configuration or data package without updating the service code, Service Fabric does not restart the service unless the ForceRestart property is set to true as part of the API call. When the update is complete, Service Fabric notifies the service that a new configuration package or data package is available. The service is responsible for applying the changes. If necessary, the service can restart itself. |



<br>
<br>
The MaxPercentUnhealthyServices, MaxPercentUnhealthyPartitionsPerService, and MaxPercentUnhealthyReplicasPerPartition criteria can be specified per service type for an application instance. This is to ensure that an application that contains different services types can have different evaluation policies for each of the service types. For example, a stateless gateway service type can have a  MaxPercentUnhealthyPartitionsPerService that is different from a stateful engine service type for a particular application instance.

## Next steps

[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades ](service-fabric-application-upgrade-troubleshooting.md).
 
