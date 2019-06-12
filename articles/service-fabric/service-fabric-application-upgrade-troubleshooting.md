---
title: Troubleshooting application upgrades | Microsoft Docs
description: This article covers some common issues around upgrading a Service Fabric application and how to resolve them.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: chackdan
editor: ''

ms.assetid: 19ad152e-ec50-4327-9f19-065c875c003c
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 2/23/2018
ms.author: subramar

---
# Troubleshoot application upgrades

This article covers some of the common issues around upgrading an Azure Service Fabric application and how to resolve them.

## Troubleshoot a failed application upgrade

When an upgrade fails, the output of the **Get-ServiceFabricApplicationUpgrade** command contains additional information for debugging the failure.  The following list specifies how the additional information can be used:

1. Identify the failure type.
2. Identify the failure reason.
3. Isolate one or more failing components for further investigation.

This information is available when Service Fabric detects the failure regardless of whether the **FailureAction** is to roll back or suspend the upgrade.

### Identify the failure type

In the output of **Get-ServiceFabricApplicationUpgrade**, **FailureTimestampUtc** identifies the timestamp (in UTC) at which an upgrade failure was detected by Service Fabric and **FailureAction** was triggered. **FailureReason** identifies one of three potential high-level causes of the failure:

1. UpgradeDomainTimeout - Indicates that a particular upgrade domain took too long to complete and **UpgradeDomainTimeout** expired.
2. OverallUpgradeTimeout - Indicates that the overall upgrade took too long to complete and **UpgradeTimeout** expired.
3. HealthCheck - Indicates that after upgrading an update domain, the application remained unhealthy according to the specified health policies and **HealthCheckRetryTimeout** expired.

These entries only show up in the output when the upgrade fails and starts rolling back. Further information is displayed depending on the type of the failure.

### Investigate upgrade timeouts

Upgrade timeout failures are most commonly caused by service availability issues. The output following this paragraph is typical of upgrades where service replicas or instances fail to start in the new code version. The **UpgradeDomainProgressAtFailure** field captures a snapshot of any pending upgrade work at the time of failure.

```powershell
Get-ServiceFabricApplicationUpgrade fabric:/DemoApp
```

```Output
ApplicationName                : fabric:/DemoApp
ApplicationTypeName            : DemoAppType
TargetApplicationTypeVersion   : v2
ApplicationParameters          : {}
StartTimestampUtc              : 4/14/2015 9:26:38 PM
FailureTimestampUtc            : 4/14/2015 9:27:05 PM
FailureReason                  : UpgradeDomainTimeout
UpgradeDomainProgressAtFailure : MYUD1

                                 NodeName            : Node4
                                 UpgradePhase        : PostUpgradeSafetyCheck
                                 PendingSafetyChecks :
                                     WaitForPrimaryPlacement - PartitionId: 744c8d9f-1d26-417e-a60e-cd48f5c098f0

                                 NodeName            : Node1
                                 UpgradePhase        : PostUpgradeSafetyCheck
                                 PendingSafetyChecks :
                                     WaitForPrimaryPlacement - PartitionId: 4b43f4d8-b26b-424e-9307-7a7a62e79750
UpgradeState                   : RollingBackCompleted
UpgradeDuration                : 00:00:46
CurrentUpgradeDomainDuration   : 00:00:00
NextUpgradeDomain              :
UpgradeDomainsStatus           : { "MYUD1" = "Completed";
                                 "MYUD2" = "Completed";
                                 "MYUD3" = "Completed" }
UpgradeKind                    : Rolling
RollingUpgradeMode             : UnmonitoredAuto
ForceRestart                   : False
UpgradeReplicaSetCheckTimeout  : 00:00:00
```

In this example, the upgrade failed at upgrade domain *MYUD1* and two partitions (*744c8d9f-1d26-417e-a60e-cd48f5c098f0* and *4b43f4d8-b26b-424e-9307-7a7a62e79750*) were stuck. The partitions were stuck because the runtime was unable to place primary replicas (*WaitForPrimaryPlacement*) on target nodes *Node1* and *Node4*.

The **Get-ServiceFabricNode** command can be used to verify that these two nodes are in upgrade domain *MYUD1*. The *UpgradePhase* says *PostUpgradeSafetyCheck*, which means that these safety checks are occurring after all nodes in the upgrade domain have finished upgrading. All this information points to a potential issue with the new version of the application code. The most common issues are service errors in the open or promotion to primary code paths.

An *UpgradePhase* of *PreUpgradeSafetyCheck* means there were issues preparing the upgrade domain before it was performed. The most common issues in this case are service errors in the close or demotion from primary code paths.

The current **UpgradeState** is *RollingBackCompleted*, so the original upgrade must have been performed with a rollback **FailureAction**, which automatically rolled back the upgrade upon failure. If the original upgrade was performed with a manual **FailureAction**, then the upgrade would instead be in a suspended state to allow live debugging of the application.

In rare cases, the **UpgradeDomainProgressAtFailure** field may be empty if the overall upgrade times out just as the system completes all work for the current upgrade domain. If this happens, try increasing the **UpgradeTimeout** and **UpgradeDomainTimeout** upgrade parameter values and retry the upgrade.

### Investigate health check failures

Health check failures can be triggered by various issues that can happen after all nodes in an upgrade domain finish upgrading and passing all safety checks. The output following this paragraph is typical of an upgrade failure due to failed health checks. The **UnhealthyEvaluations** field captures a snapshot of health checks that failed at the time of the upgrade according to the specified [health policy](service-fabric-health-introduction.md).

```powershell
Get-ServiceFabricApplicationUpgrade fabric:/DemoApp
```

```Output
ApplicationName                         : fabric:/DemoApp
ApplicationTypeName                     : DemoAppType
TargetApplicationTypeVersion            : v4
ApplicationParameters                   : {}
StartTimestampUtc                       : 4/24/2015 2:42:31 AM
UpgradeState                            : RollingForwardPending
UpgradeDuration                         : 00:00:27
CurrentUpgradeDomainDuration            : 00:00:27
NextUpgradeDomain                       : MYUD2
UpgradeDomainsStatus                    : { "MYUD1" = "Completed";
                                          "MYUD2" = "Pending";
                                          "MYUD3" = "Pending" }
UnhealthyEvaluations                    :
                                          Unhealthy services: 50% (2/4), ServiceType='PersistedServiceType', MaxPercentUnhealthyServices=0%.

                                          Unhealthy service: ServiceName='fabric:/DemoApp/Svc3', AggregatedHealthState='Error'.

                                              Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                                              Unhealthy partition: PartitionId='3a9911f6-a2e5-452d-89a8-09271e7e49a8', AggregatedHealthState='Error'.

                                                  Error event: SourceId='Replica', Property='InjectedFault'.

                                          Unhealthy service: ServiceName='fabric:/DemoApp/Svc2', AggregatedHealthState='Error'.

                                              Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                                              Unhealthy partition: PartitionId='744c8d9f-1d26-417e-a60e-cd48f5c098f0', AggregatedHealthState='Error'.

                                                  Error event: SourceId='Replica', Property='InjectedFault'.

UpgradeKind                             : Rolling
RollingUpgradeMode                      : Monitored
FailureAction                           : Manual
ForceRestart                            : False
UpgradeReplicaSetCheckTimeout           : 49710.06:28:15
HealthCheckWaitDuration                 : 00:00:00
HealthCheckStableDuration               : 00:00:10
HealthCheckRetryTimeout                 : 00:00:10
UpgradeDomainTimeout                    : 10675199.02:48:05.4775807
UpgradeTimeout                          : 10675199.02:48:05.4775807
ConsiderWarningAsError                  :
MaxPercentUnhealthyPartitionsPerService :
MaxPercentUnhealthyReplicasPerPartition :
MaxPercentUnhealthyServices             :
MaxPercentUnhealthyDeployedApplications :
ServiceTypeHealthPolicyMap              :
```

Investigating health check failures first requires an understanding of the Service Fabric health model. But even without such an in-depth understanding, we can see that two services are unhealthy: *fabric:/DemoApp/Svc3* and *fabric:/DemoApp/Svc2*, along with the error health reports ("InjectedFault" in this case). In this example, two out of four services are unhealthy, which is below the default target of 0% unhealthy (*MaxPercentUnhealthyServices*).

The upgrade was suspended upon failing by specifying a **FailureAction** of manual when starting the upgrade. This mode allows us to investigate the live system in the failed state before taking any further action.

### Recover from a suspended upgrade

With a rollback **FailureAction**, there is no recovery needed since the upgrade automatically rolls back upon failing. With a manual **FailureAction**, there are several recovery options:

1.  trigger a rollback
2. Proceed through the remainder of the upgrade manually
3. Resume the monitored upgrade

The **Start-ServiceFabricApplicationRollback** command can be used at any time to start rolling back the application. Once the command returns successfully, the rollback request has been registered in the system and starts shortly thereafter.

The **Resume-ServiceFabricApplicationUpgrade** command can be used to proceed through the remainder of the upgrade manually, one upgrade domain at a time. In this mode, only safety checks are performed by the system. No more health checks are performed. This command can only be used when the *UpgradeState* shows *RollingForwardPending*, which means that the current upgrade domain has finished upgrading but the next one has not started (pending).

The **Update-ServiceFabricApplicationUpgrade** command can be used to resume the monitored upgrade with both safety and health checks being performed.

```powershell
Update-ServiceFabricApplicationUpgrade fabric:/DemoApp -UpgradeMode Monitored
```

```Output
UpgradeMode                             : Monitored
ForceRestart                            :
UpgradeReplicaSetCheckTimeout           :
FailureAction                           :
HealthCheckWaitDuration                 :
HealthCheckStableDuration               :
HealthCheckRetryTimeout                 :
UpgradeTimeout                          :
UpgradeDomainTimeout                    :
ConsiderWarningAsError                  :
MaxPercentUnhealthyPartitionsPerService :
MaxPercentUnhealthyReplicasPerPartition :
MaxPercentUnhealthyServices             :
MaxPercentUnhealthyDeployedApplications :
ServiceTypeHealthPolicyMap              :
```

The upgrade continues from the upgrade domain where it was last suspended and use the same upgrade parameters and health policies as before. If needed, any of the upgrade parameters and health policies shown in the preceding output can be changed in the same command when the upgrade resumes. In this example, the upgrade was resumed in Monitored mode, with the parameters and the health policies unchanged.

## Further troubleshooting

### Service Fabric is not following the specified health policies

Possible Cause 1:

Service Fabric translates all percentages into actual numbers of entities (for example, replicas, partitions, and services) for health evaluation and always rounds up to whole entities. For example, if the maximum *MaxPercentUnhealthyReplicasPerPartition* is 21% and there are five replicas, then Service Fabric allows up to two unhealthy replicas (that is,`Math.Ceiling (5*0.21)`). Thus, health policies should be set accordingly.

Possible Cause 2:

Health policies are specified in terms of percentages of total services and not specific service instances. For example, before an upgrade, if an application has four service instances A, B, C, and D, where service D is unhealthy but with little impact to the application. We want to ignore the known unhealthy service D during upgrade and set the parameter *MaxPercentUnhealthyServices* to be 25%, assuming only A, B, and C need to be healthy.

However, during the upgrade, D may become healthy while C becomes unhealthy. The upgrade would still succeed because only 25% of the services are unhealthy. However, it might result in unanticipated errors due to C being unexpectedly unhealthy instead of D. In this situation, D should be modeled as a different service type from A, B, and C. Since health policies are specified per service type, different unhealthy percentage thresholds can be applied to different services. 

### I did not specify a health policy for application upgrade, but the upgrade still fails for some time-outs that I never specified

When health policies aren't provided to the upgrade request, they are taken from the *ApplicationManifest.xml* of the current application version. For example, if you're upgrading Application X from version 1.0 to version 2.0, application health policies specified for in version 1.0 are used. If a different health policy should be used for the upgrade, then the policy needs to be specified as part of the application upgrade API call. The policies specified as part of the API call only apply during the upgrade. Once the upgrade is complete, the policies specified in the *ApplicationManifest.xml* are used.

### Incorrect time-outs are specified

You may have wondered about what happens when time-outs are set inconsistently. For example, you may have an *UpgradeTimeout* that's less than the *UpgradeDomainTimeout*. The answer is that an error is returned. Errors are returned if the *UpgradeDomainTimeout* is less than the sum of *HealthCheckWaitDuration* and *HealthCheckRetryTimeout*, or if *UpgradeDomainTimeout* is less than the sum of *HealthCheckWaitDuration* and *HealthCheckStableDuration*.

### My upgrades are taking too long

The time for an upgrade to complete depends on the health checks and time-outs specified. Health checks and time-outs depend on how long it takes to copy, deploy, and stabilize the application. Being too aggressive with time-outs might mean more failed upgrades, so we recommend starting conservatively with longer time-outs.

Here's a quick refresher on how the time-outs interact with the upgrade times:

Upgrades for an upgrade domain cannot complete faster than *HealthCheckWaitDuration* + *HealthCheckStableDuration*.

Upgrade failure cannot occur faster than *HealthCheckWaitDuration* + *HealthCheckRetryTimeout*.

The upgrade time for an upgrade domain is limited by *UpgradeDomainTimeout*.  If *HealthCheckRetryTimeout* and *HealthCheckStableDuration* are both non-zero and the health of the application keeps switching back and forth, then the upgrade eventually times out on *UpgradeDomainTimeout*. *UpgradeDomainTimeout* starts counting down once the upgrade for the current upgrade domain begins.

## Next steps

[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Control how your application upgrades by using [Upgrade Parameters](service-fabric-application-upgrade-parameters.md).

Make your application upgrades compatible by learning how to use [Data Serialization](service-fabric-application-upgrade-data-serialization.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).