
<properties
   pageTitle="Service Fabric Application Upgrade: Upgrade Parameters"
   description="This article describes the various parameters related to upgrading a Service Fabric application."
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
   ms.date="07/17/2015"
   ms.author="subramar"/>



# Application Upgrade Parameters

This article describes the various parameters that apply during the upgrade of a Service Fabric application.  The parameters include the name and version of the application, and are knobs that control the timeouts and health checks that are applied during the upgrade and specify the policies must be applied when an upgrade fails.


<br>

| Parameter | Description |
| --- | --- |
| ApplicationName | Name of the application that is being upgraded. Examples:fabric:/VisualObjects, fabric:/ClusterMonitor  |
| TargetApplicationTypeVersion | The version of the application type that the upgrade targets. |
| FailureAction | The FailureAction property describes the action to be taken by Service Fabric if the upgrade fails. The application may be rolled back to the last version prior to the update (Rollback), or stop the application upgrade at the current upgrade domain and change the upgrade mode to manual.  Allowed values are Rollback and Manual. |
| HealthCheckWaitDurationSec | The time to wait (in seconds) after the upgrade has completed on the upgrade domain before Service Fabric evaluates the health of the application. This duration can also be considered as the time an application should be running before it can be considered healthy. If the health check passes, the upgrade process proceeds to the next upgrade domain.  If the health check fails, Service Fabric waits for an interval (the UpgradeHealthCheckInterval) before retrying the health check again until the HealthCheckRetryTimeout is reached. The default and recommended value is 0 seconds. |
| HealthCheckRetryTimeoutSec | The duration (in seconds) that Service Fabric continues to perform health evaluation before declaring the upgrade as failed. The default is 600 seconds. This duration starts after HealthCheckWaitDuration is reached. Within this HealthCheckRetryTimeout, Service Fabric might perform multiple health checks of the application health. The default value is 10 minutes and is recommended to be customized appropriately for your application. |
| HealthCheckStableDurationSec | The duration (in seconds) to wait in order to verify that the application is stable before moving to the next upgrade domain or completing the upgrade. This wait duration is used to prevent undetected changes of health right after the health check is performed. The default value is 0 seconds, and is recommended to be customized appropriately for your application. |
| UpgradeDomainTimeoutSec | Maximum time (in seconds) for upgrading a single upgrade domain. If this time-out is reach, the upgrade stops and takes the action specified by UpgradeFailureAction. The default value is never (infinite) and is recommended to be customized appropriately for your application. |
| UpgradeTimeout | A timeout (in seconds) that applies for the entire upgrade. If this time-out is reached, the upgrade stops and the UpgradeFailureAction is triggered. The default value is never (infinite) and is recommended to be customized appropriately for your application. |
| UpgradeHealthCheckInterval | Specified in the ClusterManager section of the _cluster_ _manifest_ (this is not specified as part of the upgrade cmdlet), this setting specifies the frequency that the health status is checked (the default is 60 seconds).  |






<br>
## Service health evaluation during application upgrade

<br>
The health evaluation criteria are optional. If the health evaluation criteria are not specified when starting an upgrade, Service Fabric uses the application health policies specified in the ApplicationManifest.xml of the application instance that is being upgraded.


<br>

| Parameter | Description |
| --- | --- |
| ConsiderWarningAsError | Default value is False. Treat the warning health events for the application as error when evaluating the health of the application during upgrade. By default, Service Fabric does not evaluate warning health events to be a failure (error), so the upgrade can proceed even if there are warning events.   |
| MaxPercentUnhealthyDeployedApplications | Default and recommended value is 0. Specify the maximum number of deployed applications (see the [Health section](service-fabric-health-introduction.md))that can be unhealthy before the application is consider unhealthy and fail the upgrade. This is the health of the application packaged that is on the node, hence this is useful to detect immediate issue during upgrade, and where the application package deployed on the node is unhealthy (crashing and etc). In a typical case, the replicas of the application will get load balanced to the other node, hence makes the application appear healthy, thus allowing upgrade to proceed. By specifying a strict MaxPercentUnhealthyDeployedApplications health, Service Fabric can detect a problem with the application package fast and result in a fail fast upgrade. |
| MaxPercentUnhealthyServices | Default and recommended value is 0. Specify the maximum number of services in the application instance can be unhealthy before the application is consider unhealthy and fails the upgrade. |
| MaxPercentUnhealthyPartitionsPerService | Default and recommended value is 0. Specify the maximum number of partitions in a service can be unhealthy before the service is considered unhealthy. |
| MaxPercentUnhealthyReplicasPerPartition | Default and recommended value is 0. Specify the maximum number of replicas in partition that be unhealthy before the partition is consider unhealthy. |
| UpgradeReplicaSetCheckTimeout | Stateless service - Within a single upgrade domain, Service Fabric tries to ensure that additional instances of the service are available. If the target instance count is more than one, Service Fabric waits for more than one instance to be available, up to a maximum timeout value (specified by the UpgradeReplicaSetCheckTimeout property). If the timeout expires, Service Fabric proceeds with the upgrade, regardless of the number of service instances. If the target instance count is one, Service Fabric does not wait, and immediately proceeds with the upgrade. Stateful service- Within a single upgrade domain, Service Fabric tries to ensure that the replica set has a quorum. Service Fabric waits for a quorum to be available, up to a maximum timeout value (specified by the UpgradeReplicaSetCheckTimeout property). If the timeout expires, Service Fabric proceeds with the upgrade, regardless of quorum. This setting is set as never (infinite) when rolling forward (applied when upgrade proceeding as expected), and 900 seconds when rolling back (applied when upgrade ran into errors and is rolling back). |
| ForceRestart | If you update a configuration or data package, without updating the service code, Service Fabric does not restart the service unless the ForceRestart property is set to true as part of the API call. When the update is complete, Service Fabric notifies the service that a new configuration package or data package is available. The service is responsible for applying the changes. If necessary, the service can restart itself. |



<br>
<br>
The MaxPercentUnhealthyServices, MaxPercentUnhealthyPartitionsPerService and MaxPercentUnhealthyReplicasPerPartition criteria can be specified per service type for an application instance. This is to ensure that an application that contains different services types can have different evaluation policies for each of the service types. As an example, a stateless gateway service type can have a different MaxPercentUnhealthyPartitionsPerService that is different from a stateful engine service type for a particular application instance.

## Next steps


[Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md)

[Advanced Topics](service-fabric-application-upgrade-advanced.md)

[Troubleshooting Application Upgrade ](service-fabric-application-upgrade-troubleshooting.md)

[Data Serialization](service-fabric-application-upgrade-data-serialization.md)
 
