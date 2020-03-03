---
title: 'Application upgrade: upgrade parameters' 
description: Describes parameters related to upgrading a Service Fabric application, including health checks to perform and policies to automatically undo the upgrade.

ms.topic: conceptual
ms.date: 11/08/2018
---
# Application upgrade parameters
This article describes the various parameters that apply during the upgrade of an Azure Service Fabric application. Application upgrade parameters control the time-outs and health checks that are applied during the upgrade, and they specify the policies that must be applied when an upgrade fails. Application parameters apply to upgrades using:
- PowerShell
- Visual Studio
- SFCTL
- [REST](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-startapplicationupgrade)

Application upgrades are initiated via one of three user-selectable upgrade modes. Each mode has its own set of application parameters:
- Monitored
- Unmonitored Auto
- Unmonitored Manual

The applicable required and optional parameters are described in each section as follows.

## Visual Studio and PowerShell parameters

Service Fabric application upgrades using PowerShell use the [Start-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/start-servicefabricapplicationupgrade) command. The upgrade mode is selected by passing either the **Monitored**, **UnmonitoredAuto**, or **UnmonitoredManual** parameter to [Start-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/start-servicefabricapplicationupgrade).

Visual Studio Service Fabric application upgrade parameters are set via the Visual Studio Upgrade Settings dialog. The Visual Studio upgrade mode is selected using the **Upgrade Mode** dropdown box to either **Monitored**, **UnmonitoredAuto**, or **UnmonitoredManual**. For more information, see [Configure the upgrade of a Service Fabric application in Visual Studio](service-fabric-visualstudio-configure-upgrade.md).

### Required parameters
(PS=PowerShell, VS=Visual Studio)

| Parameter | Applies To | Description |
| --- | --- | --- |
ApplicationName |PS| Name of the application that is being upgraded. Examples: fabric:/VisualObjects, fabric:/ClusterMonitor. |
ApplicationTypeVersion|PS|The version of the application type that the upgrade targets. |
FailureAction |PS, VS|Allowed values are **Rollback**, **Manual**, and **Invalid**. The compensating action to perform when a *Monitored* upgrade encounters monitoring policy or health policy violations. <br>**Rollback** specifies that the upgrade will automatically roll back to the pre-upgrade version. <br>**Manual** indicates that the upgrade will switch to the *UnmonitoredManual* upgrade mode. <br>**Invalid** indicates that the failure action is invalid.|
Monitored |PS|Indicates that the upgrade mode is monitored. After the cmdlet finishes an upgrade for an upgrade domain, if the health of the upgrade domain and the cluster meet the health policies that you define, Service Fabric upgrades the next upgrade domain. If the upgrade domain or cluster fails to meet health policies, the upgrade fails and Service Fabric rolls back the upgrade for the upgrade domain or reverts to manual mode per the policy specified. This is the recommended mode for application upgrades in a production environment. |
UpgradeMode | VS | Allowed values are **Monitored** (default), **UnmonitoredAuto**, or **UnmonitoredManual**. See PowerShell parameters for each mode in this article for details. |
UnmonitoredAuto | PS | Indicates that the upgrade mode is unmonitored automatic. After Service Fabric upgrades an upgrade domain, Service Fabric upgrades the next upgrade domain irrespective of the application health state. This mode is not recommended for production, and is only useful during development of an application. |
UnmonitoredManual | PS | Indicates that the upgrade mode is unmonitored manual. After Service Fabric upgrades an upgrade domain, it waits for you to upgrade the next upgrade domain by using the *Resume-ServiceFabricApplicationUpgrade* cmdlet. |

### Optional parameters

The health evaluation parameters are optional. If the health evaluation criteria are not specified when an upgrade starts, Service Fabric uses the application health policies specified in the ApplicationManifest.xml of the application instance.

> [!div class="mx-tdBreakAll"]
> | Parameter | Applies To | Description |
> | --- | --- | --- |
> | ApplicationParameter |PS, VS| Specifies the overrides for application parameters.<br>PowerShell application parameters are specified as hashtable name/value pairs. For example, @{ "VotingData_MinReplicaSetSize" = "3"; "VotingData_PartitionCount" = "1" }.<br>Visual Studio application parameters can be specified in the Publish Service Fabric Application dialog in the **Application Parameters File** field.
> | Confirm |PS| Allowed values are **True** and **False**. Prompts for confirmation before running the cmdlet. |
> | ConsiderWarningAsError |PS, VS |Allowed values are **True** and **False**. Default value is **False**. Treat the warning health events for the application as errors when evaluating the health of the application during upgrade. By default, Service Fabric does not evaluate warning health events to be failures (errors), so the upgrade can proceed even if there are warning events. |
> | DefaultServiceTypeHealthPolicy | PS, VS |Specifies the health policy for the default service type to use for the monitored upgrade in the format MaxPercentUnhealthyPartitionsPerService, MaxPercentUnhealthyReplicasPerPartition, MaxPercentUnhealthyServices. For example, 5,10,15 indicates the following values: MaxPercentUnhealthyPartitionsPerService = 5, MaxPercentUnhealthyReplicasPerPartition = 10, MaxPercentUnhealthyServices = 15. |
> | Force | PS, VS | Allowed values are **True** and **False**. Indicates that the upgrade process skips the warning message and forces the upgrade even when the version number hasn’t changed. This is useful for local testing but is not recommended for use in a production environment as it requires removing the existing deployment which causes down-time and potential data loss. |
> | ForceRestart |PS, VS |If you update a configuration or data package without updating the service code, the service is restarted only if the ForceRestart property is set to **True**. When the update is complete, Service Fabric notifies the service that a new configuration package or data package is available. The service is responsible for applying the changes. If necessary, the service can restart itself. |
> | HealthCheckRetryTimeoutSec |PS, VS |The duration (in seconds) that Service Fabric continues to perform health evaluation before declaring the upgrade as failed. The default is 600 seconds. This duration starts after *HealthCheckWaitDurationSec* is reached. Within this *HealthCheckRetryTimeout*, Service Fabric might perform multiple health checks of the application health. The default value is 10 minutes and should be customized appropriately for your application. |
> | HealthCheckStableDurationSec |PS, VS |The duration (in seconds) to verify that the application is stable before moving to the next upgrade domain or completing the upgrade. This wait duration is used to prevent undetected changes of health right after the health check is performed. The default value is 120 seconds, and should be customized appropriately for your application. |
> | HealthCheckWaitDurationSec |PS, VS | The time to wait (in seconds) after the upgrade has finished on the upgrade domain before Service Fabric evaluates the health of the application. This duration can also be considered as the time an application should be running before it can be considered healthy. If the health check passes, the upgrade process proceeds to the next upgrade domain.  If the health check fails, Service Fabric waits for [UpgradeHealthCheckInterval](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-fabric-settings#clustermanager) before retrying the health check again until the *HealthCheckRetryTimeoutSec* is reached. The default and recommended value is 0 seconds. |
> | MaxPercentUnhealthyDeployedApplications|PS, VS |Default and recommended value is 0. Specify the maximum number of deployed applications (see the [Health section](service-fabric-health-introduction.md)) that can be unhealthy before the application is considered unhealthy and fails the upgrade. This parameter defines the application health on the node and helps detect issues during upgrade. Typically, the replicas of the application get load-balanced to the other node, which allows the application to appear healthy, thus allowing the upgrade to proceed. By specifying a strict *MaxPercentUnhealthyDeployedApplications* health, Service Fabric can detect a problem with the application package quickly and help produce a fail fast upgrade. |
> | MaxPercentUnhealthyServices |PS, VS |A parameter to *DefaultServiceTypeHealthPolicy* and *ServiceTypeHealthPolicyMap*. Default and recommended value is 0. Specify the maximum number of services in the application instance that can be unhealthy before the application is considered unhealthy and fails the upgrade. |
> | MaxPercentUnhealthyPartitionsPerService|PS, VS |A parameter to *DefaultServiceTypeHealthPolicy* and *ServiceTypeHealthPolicyMap*. Default and recommended value is 0. Specify the maximum number of partitions in a service that can be unhealthy before the service is considered unhealthy. |
> | MaxPercentUnhealthyReplicasPerPartition|PS, VS |A parameter to *DefaultServiceTypeHealthPolicy* and *ServiceTypeHealthPolicyMap*. Default and recommended value is 0. Specify the maximum number of replicas in partition that can be unhealthy before the partition is considered unhealthy. |
> | ServiceTypeHealthPolicyMap | PS, VS | Represents the health policy used to evaluate the health of services belonging to a service type. Takes a hash table input in the following format: @ {"ServiceTypeName" : "MaxPercentUnhealthyPartitionsPerService,MaxPercentUnhealthyReplicasPerPartition,MaxPercentUnhealthyServices"} For example: @{ "ServiceTypeName01" = "5,10,5"; "ServiceTypeName02" = "5,5,5" } |
> | TimeoutSec | PS, VS | Specifies the time-out period in seconds for the operation. |
> | UpgradeDomainTimeoutSec |PS, VS |Maximum time (in seconds) for upgrading a single upgrade domain. If this time-out is reached, the upgrade stops and proceeds based on the setting for *FailureAction*. The default value is never (Infinite) and should be customized appropriately for your application. |
> | UpgradeReplicaSetCheckTimeoutSec |PS, VS |Measured in seconds.<br>**Stateless service**--Within a single upgrade domain, Service Fabric tries to ensure that additional instances of the service are available. If the target instance count is more than one, Service Fabric waits for more than one instance to be available, up to a maximum time-out value. This time-out is specified by using the *UpgradeReplicaSetCheckTimeoutSec* property. If the time-out expires, Service Fabric proceeds with the upgrade, regardless of the number of service instances. If the target instance count is one, Service Fabric does not wait, and immediately proceeds with the upgrade.<br><br>**Stateful service**--Within a single upgrade domain, Service Fabric tries to ensure that the replica set has a quorum. Service Fabric waits for a quorum to be available, up to a maximum time-out value (specified by the *UpgradeReplicaSetCheckTimeoutSec* property). If the time-out expires, Service Fabric proceeds with the upgrade, regardless of quorum. This setting is set as never (infinite) when rolling forward, and 1200 seconds when rolling back. |
> | UpgradeTimeoutSec |PS, VS |A time-out (in seconds) that applies for the entire upgrade. If this time-out is reached, the upgrade stops and *FailureAction* is triggered. The default value is never (Infinite) and should be customized appropriately for your application. |
> | WhatIf | PS | Allowed values are **True** and **False**. Shows what would happen if the cmdlet runs. The cmdlet is not run. |

The *MaxPercentUnhealthyServices*, *MaxPercentUnhealthyPartitionsPerService*, and *MaxPercentUnhealthyReplicasPerPartition* criteria can be specified per service type for an application instance. Setting these parameters per-service allows for an application to contain different services types with different evaluation policies. For example, a stateless gateway service type can have a *MaxPercentUnhealthyPartitionsPerService* that is different from a stateful engine service type for a particular application instance.

## SFCTL parameters

Service Fabric application upgrades using the Service Fabric CLI use the [sfctl application upgrade](https://docs.microsoft.com/azure/service-fabric/service-fabric-sfctl-application#sfctl-application-upgrade) command along with the following required and optional parameters.

### Required parameters

| Parameter | Description |
| --- | --- |
| application-id  |ID of the application that is being upgraded. <br> This is typically the full name of the application without the 'fabric:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the '\~' character. For example, if the application name is 'fabric:/myapp/app1', the application identity would be 'myapp\~app1' in 6.0+ and 'myapp/app1' in previous versions.|
application-version |The version of the application type that the upgrade targets.|
parameters  |A JSON encoded list of application parameter overrides to be applied when upgrading the application.|

### Optional parameters

| Parameter | Description |
| --- | --- |
default-service-health-policy | [JSON](https://docs.microsoft.com/rest/api/servicefabric/sfclient-model-servicetypehealthpolicy) encoded specification of the health policy used by default to evaluate the health of a service type. The map is empty by default. |
failure-action | Allowed values are **Rollback**, **Manual**, and **Invalid**. The compensating action to perform when a *Monitored* upgrade encounters monitoring policy or health policy violations. <br>**Rollback** specifies that the upgrade will automatically roll back to the pre-upgrade version. <br>**Manual** indicates that the upgrade will switch to the *UnmonitoredManual* upgrade mode. <br>**Invalid** indicates that the failure action is invalid.|
force-restart | If you update a configuration or data package without updating the service code, the service is restarted only if the ForceRestart property is set to **True**. When the update is complete, Service Fabric notifies the service that a new configuration package or data package is available. The service is responsible for applying the changes. If necessary, the service can restart itself. |
health-check-retry-timeout | The amount of time to retry health evaluation when the application or cluster is unhealthy before *FailureAction* is executed. It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. Default: PT0H10M0S. |
health-check-stable-duration | The amount of time that the application or cluster must remain healthy before the upgrade proceeds to the next upgrade domain. It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. Default: PT0H2M0S. |
health-check-wait-duration | The amount of time to wait after completing an upgrade domain before applying health policies. It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. Default: 0.|
max-unhealthy-apps | Default and recommended value is 0. Specify the maximum number of deployed applications (see the [Health section](service-fabric-health-introduction.md)) that can be unhealthy before the application is considered unhealthy and fails the upgrade. This parameter defines the application health on the node and helps detect issues during upgrade. Typically, the replicas of the application get load-balanced to the other node, which allows the application to appear healthy, thus allowing the upgrade to proceed. By specifying a strict *max-unhealthy-apps* health, Service Fabric can detect a problem with the application package quickly and help produce a fail fast upgrade. Represented as a number between 0 and 100. |
mode | Allowed values are **Monitored**, **UpgradeMode**, **UnmonitoredAuto**, **UnmonitoredManual**. Default is **UnmonitoredAuto**. See the Visual Studio and PowerShell *Required Parameters* section for descriptions of these values.|
replica-set-check-timeout |Measured in seconds. <br>**Stateless service**--Within a single upgrade domain, Service Fabric tries to ensure that additional instances of the service are available. If the target instance count is more than one, Service Fabric waits for more than one instance to be available, up to a maximum time-out value. This time-out is specified by using the *replica-set-check-timeout* property. If the time-out expires, Service Fabric proceeds with the upgrade, regardless of the number of service instances. If the target instance count is one, Service Fabric does not wait, and immediately proceeds with the upgrade.<br><br>**Stateful service**--Within a single upgrade domain, Service Fabric tries to ensure that the replica set has a quorum. Service Fabric waits for a quorum to be available, up to a maximum time-out value (specified by the *replica-set-check-timeout* property). If the time-out expires, Service Fabric proceeds with the upgrade, regardless of quorum. This setting is set as never (infinite) when rolling forward, and 1200 seconds when rolling back. |
service-health-policy | JSON encoded map with service type health policy per service type name. The map is empty be default. [Parameter JSON format.](https://docs.microsoft.com/rest/api/servicefabric/sfclient-model-applicationhealthpolicy#servicetypehealthpolicymap). The JSON for the “Value” portion contains **MaxPercentUnhealthyServices**, **MaxPercentUnhealthyPartitionsPerService**, and **MaxPercentUnhealthyReplicasPerPartition**. See the Visual Studio and PowerShell Optional Parameters section for descriptions of these parameters.
timeout | Specifies the time-out period in seconds for the operation. Default: 60. |
upgrade-domain-timeout | The amount of time each upgrade domain has to complete before *FailureAction* is executed. It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. The default value is never (Infinite) and should be customized appropriately for your application. Default: P10675199DT02H48M05.4775807S. |
upgrade-timeout | The amount of time each upgrade domain has to complete before *FailureAction* is executed. It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. The default value is never (Infinite) and should be customized appropriately for your application. Default: P10675199DT02H48M05.4775807S.|
warning-as-error | Allowed values are **True** and **False**. Default value is **False**. Can be passed in as a flag. Treat the warning health events for the application as errors when evaluating the health of the application during upgrade. By default, Service Fabric does not evaluate warning health events to be failures (errors), so the upgrade can proceed even if there are warning events. |

## Next steps
[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

[Upgrading your Application using Service Fabric CLI on Linux](service-fabric-application-lifecycle-sfctl.md#upgrade-application) walks you through an application upgrade using Service Fabric CLI.

[Upgrading your application using Service Fabric Eclipse Plugin](service-fabric-get-started-eclipse.md#upgrade-your-service-fabric-java-application)

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).
