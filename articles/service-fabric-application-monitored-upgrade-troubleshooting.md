<properties
   pageTitle="Service Fabric monitored application upgrade troubleshooting"
   description="How to troubleshoot monitored application upgrades in Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="alexwun"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/23/2015"
   ms.author="alexwun"/>

# Troubleshooting a failed application upgrade

When an upgrade fails, the output of the **Get-ServiceFabricApplicationUpgrade** command will contain some additional information for debugging the failure. This information can be used to:

1. Identify the failure type
2. Identify the failure reason
3. Isolate the failing component(s) for further investigation

This information will be available as soon as Service Fabric detects the failure regardless of whether the **FailureAction** is to rollback or suspend the upgrade.

## Identify the failure type

In the output of **Get-ServiceFabricApplicationUpgrade**, **FailureTimestampUtc** identifies the timestamp (in UTC) at which an upgrade failure was detected by Service Fabric and the **FailureAction** was triggered. The **FailureReason** identifies one of three potential high-level causes of the failure:

1. UpgradeDomainTimeout - Indicates that a particular upgrade domain took too long to complete and **UpgradeDomainTimeout** expired.
2. OverallUpgradeTimeout - Indicates that the overall upgrade took too long to complete and **UpgradeTimeout** expired.
3. HealthCheck - Indicates that after upgrading an Upgrade Domain, the application remained unhealthy according to the specified health policies and **HealthCheckRetryTimeout** expired.

These entries will only show up in the output when the upgrade fails and starts rolling back. Further information will be displayed depending on the type of the failure.

## Investigate upgrade timeouts

Upgrade timeout failures are most commonly caused by service availability issues. The output below is typical of upgrades where service replicas or instances fail to start in the new code version. The **UpgradeDomainProgressAtFailure** field captures a snapshot of any pending upgrade work at the time of failure.

~~~
PS D:\temp> Get-ServiceFabricApplicationUpgrade fabric:/DemoApp

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
~~~

In this example, we can see that the upgrade failed at upgrade domain *MYUD1* and two partitions (*744c8d9f-1d26-417e-a60e-cd48f5c098f0* and *4b43f4d8-b26b-424e-9307-7a7a62e79750*) were stuck, unable to place primary replicas (*WaitForPrimaryPlacement*) on target nodes *Node1* and *Node4*. The **Get-ServiceFabricNode** command can be used to verify that these two nodes are in upgrade domain *MYUD1*. The *UpgradePhase* says *PostUpgradeSafetyCheck*, which means that these safety checks are occurring after all nodes in the upgrade domain had finished upgrading. All this information combined points to a potential issue with the new version of the application code. The most common issues are service errors in the open or promotion to primary code paths.

An *UpgradePhase* of *PreUpgradeSafetyCheck* means there were issues preparing the upgrade domain before actually performing the upgrade. The most common issues in this case are service errors in the close or demotion from primary code paths.

The current **UpgradeState** is *RollingBackCompleted*, so the original upgrade must have been performed with a rollback **FailureAction**, which automatically rolled back the upgrade upon failure. If the original upgrade had been performed with a manual **FailureAction**, then the upgrade would instead be in a suspended state to allow live debugging of the application.

## Investigate health check failures

Health check failures can be triggered by a variety of additional issues that can happen after all nodes in an upgrade domain finish upgrading, passing all safety checks. The output below is typical of an upgrade failure due to failed health checks. The **UnhealthyEvaluations** field captures a snapshot of all failing health checks at the time of the upgrade failure according the user-specified [Health Policy](service-fabric-health-introduction.md).

~~~
PS D:\temp> Get-ServiceFabricApplicationUpgrade fabric:/DemoApp

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
~~~

Investigating health check failures first requires an understanding of the Service Fabric health model, but even without such an in-depth understanding, we can see that two services are unhealthy: *fabric:/DemoApp/Svc3* and *fabric:/DemoApp/Svc2* along with the error health reports ("InjectedFault" in this case). In this example, 2 out of 4 services are unhealthy, below the default target of 0% unhealthy (*MaxPercentUnhealthyServices*).

The upgrade was suspended upon failing by specifying a **FailureAction** of manual when starting the upgrade, so we can investigate the live system in the failed state if desired before taking any further actions.

## Recover from a suspended upgrade

With a rollback **FailureAction**, there is no recovery needed since the upgrade will automatically rollback upon failing. With a manual **FailureAction**, there are several recovery options:

1. Manually trigger a rollback
2. Proceed through the remainder of the upgrade manually
3. Resume the monitored upgrade

The **Start-ServiceFabricApplicationRollback** command can be used at any time to start rolling back the application. Once the command returns successfully, the rollback request has been registered in the system and will start shortly.

The **Resume-ServiceFabricApplicationUpgrade** command can be used to proceed through the remainder of the upgrade manually, one upgrade domain at a time. In this mode, only safety checks will be performed by the system - no more health checks will be performed. The command can only be used when the *UpgradeState* shows *RollingForwardPending*, which means that the current upgrade domain has finished upgrading and the next upgrade domain is still pending.

The **Update-ServiceFabricApplicationUpgrade** command can be used to resume the monitored upgrade with both safety and health checks being performed.

~~~
PS D:\temp> Update-ServiceFabricApplicationUpgrade fabric:/DemoApp -UpgradeMode Monitored

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

PS D:\temp>
~~~

The upgrade will continue from the upgrade domain where it was suspended and use the same upgrade parameters and health policies as before. If needed, any of the upgrade parameters and health policies shown in the output above can be changed in the same command when resuming the upgrade. In this example, the upgrade was resumed in Monitored mode using the same parameters and health policies as before.


## Next steps

[More application upgrade troubleshooting](service-fabric-application-upgrade-troubleshooting.md)
