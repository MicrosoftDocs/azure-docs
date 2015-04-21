<properties
   pageTitle="Report Health on Azure Service Fabric entities"
   description="Describes how to send Azure Service Fabric health reports against health entities: design and implementation"
   services="service-fabric"
   documentationCenter=".net"
   authors="oanapl"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/15/2015"
   ms.author="oanapl"/>

# Report Health on Azure Service Fabric entities
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) designed to flag unhealthy cluster or application conditions on specific entities to allow easy and fast diagnosis and repair. This is accomplished by using **health reporters** (System components and watchdogs). The reporters are monitoring conditions of interest to them. They report on those conditions based on their local view. The [Health Store](service-fabric-health-introduction.md#Health-Store) aggregates health data sent by all reporters to determine whether entities are globally healthy. The model is intended to be rich, flexible and easy to use.
The quality of the health reports determines how accurate the health view of the cluster is. Therefore, some thought is needed to provide reports that capture conditions of interest in the best possible way.

To design and implement health reporting, watchdogs and System components must:

- Define the condition they are interested in, the way it is monitored and the impact on the cluster/application functionality. This defines the health report property and health state.
- Determine the [entity](service-fabric-health-introduction.md#health-entities-and-hierarchy) the report applies to.
- Determine the report source, either from within service, internal or external watchdog.
- Define a source used to identify the reporter.
- Determine how they prefer to report, either periodically or on transitions. The recommended way is periodically, as it requires simpler code and is therefore less prone to errors.
- Determine how long the report for unhealthy conditions should stay in health store and how it should be cleared. This defines the report time to live and remove on expiration behavior.

As mentioned above, reporting can be done from:

- The monitored Service Fabric service replica.
- Internal watchdogs deployed as a Service Fabric service. Eg. a Service Fabric stateless service that monitors conditions and issues report. The watchdogs can be deployed an all nodes or can be affinitized to the monitored service).
- Internal Watchdogs that run on the Service Fabric nodes but are **not** implemented as Service Fabric services.
- External watchdogs that are probing the resource from **outside** the Service Fabric cluster. Eg. Gomez like monitoring service.

> [AZURE.NOTE] Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md). The user reports must be sent on [health entities](service-fabric-health-introduction.md#health-entities-and-hierarchy) already created by the system.

Once the health reporting design is clear, sending health reports is easy. It can be done through API using FabricClient.HealthManager.ReportHealth, through Powershell or through REST. Internally, all methods use a health client contained inside a fabric client. There are configuration knobs to batch reports for improved performance.

> [AZURE.NOTE] Report health is sync and only represents the validation work on client side. The fact that the report is accepted by the health client doesn't mean it is applied in store; it will be sent asynchronously, possibly batched with other reports and the processing on the server may fail (eg. stale sequence number, the entity on which the report must be applied has been deleted etc).

## Health client
The health reports are sent to the Health Store using a health client, which lives inside the fabric client. The health client can be configured with the following:

- HealthReportSendInterval. The delay between the time the report is added to the client and the time it is sent to Health Store. This is used to batch reports and not send one message for each, for improved performance. Default: 30 seconds.
- HealthReportRetrySendInterval. The interval at which the health client re-sends accumulated health reports to Health Store. Default: 30 seconds.
- HealthOperationTimeout. The timeout for a report message sent to Health Store. If a message times out, the health client retries until the Health Store confirms that the reports have been processed. Default: 2 minutes.

> [AZURE.NOTE] When the reports are batched, the fabric client must be kept alive for at least HealthReportSendInterval to ensure they are sent. If the message is lost or Health Store is not able to apply them due to transient errors, the fabric client must be kept alive longer to give it a chance to retry.

The buffering on the client takes the uniqueness of the reports into consideration. For example, if a particular bad reporter is reporting 100 reports per second on the same property of the same entity, the reports will get replaced with last version. At most one such report exists in the client queue. If batching is configured, the number of reports sent to the Health Store is just one per send interval, the last added report, which reflects the most current state of the entity.
All configuration parameters can be specified when creating the FabricClient, by passing FabricClientSettings with desired values for health related entries.

The following creates a fabric client and specifies that the reports should be sent as soon as they are added. On retryable errors or timeouts, retries happen every 40 seconds.

```csharp
var clientSettings = new FabricClientSettings()
{
    HealthOperationTimeout = TimeSpan.FromSeconds(120),
    HealthReportSendInterval = TimeSpan.FromSeconds(0),
    HealthReportRetrySendInterval = TimeSpan.FromSeconds(40),
};
var fabricClient = new FabricClient(clientSettings);
```

Same parameters can be specified when creating a connection to a cluster through Powershell. The following starts a connection to a local cluster:

```powershell
PS C:\Windows\System32\WindowsPowerShell\v1.0> Connect-ServiceFabricCluster -HealthOperationTimeoutInSec 120 -HealthReportSendIntervalInSec 0 -HealthReportRetrySendIntervalInSec 40
True

ConnectionEndpoint   :
FabricClientSettings : {
                       ClientFriendlyName                   : PowerShell-1944858a-4c6d-465f-89c7-9021c12ac0bb
                       PartitionLocationCacheLimit          : 100000
                       PartitionLocationCacheBucketCount    : 1024
                       ServiceChangePollInterval            : 00:02:00
                       ConnectionInitializationTimeout      : 00:00:02
                       KeepAliveInterval                    : 00:00:20
                       HealthOperationTimeout               : 00:02:00
                       HealthReportSendInterval             : 00:00:00
                       HealthReportRetrySendInterval        : 00:00:40
                       NotificationGatewayConnectionTimeout : 00:00:00
                       NotificationCacheUpdateTimeout       : 00:00:00
                       }
GatewayInformation   : {
                       NodeAddress                          : localhost:19000
                       NodeId                               : 1880ec88a3187766a6da323399721f53
                       NodeInstanceId                       : 130729063464981219
                       NodeName                             : Node.1
                       }
```

> [AZURE.NOTE] To ensure that unauthorized services can't report health against the entities in the cluster, the server can be configured to accept only requests from secured clients. Since the reporting is done through FabricClient, this means the FabricClient must have security enabled in order to be able to communicate with the cluster eg. with Kerberos or certificate authentication.

## Implement health reporting
Once the entity and report details are clear, sending health reports can be done programmatically, through Powershell or REST.

### API
In order to report through API, users need to create a health report specific to the entity type they want to report on and then give it to a health client.

### Powershell
Users can send health reports with Send-ServiceFabric<EntityType>HealthReport.

The following example shows periodic reporting on CPU values on a node. The reports should be sent every 30 seconds, they have a TTL of 2 minute. If they expire, it means the reporter has issues, so the node is evaluated at error. When the CPU is above a threshold, the report has health state Warning, if CPU is above threshold for more than a configured time it's reported as Error. Otherwise, the reporter sends Ok.

```powershell
PS C:\> Send-ServiceFabricNodeHealthReport -NodeName Node.1 -HealthState Warning -SourceId PowershellWatcher -HealthProperty CPU -Description "CPU is above 80% threshold" -TimeToLiveSec 120

PS C:\> Get-ServiceFabricNodeHealth -NodeName Node.1
NodeName              : Node.1
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='PowershellWatcher', Property='CPU', HealthState='Warning', ConsiderWarningAsError=false.

HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 5
                        SentAt                : 4/21/2015 8:01:17 AM
                        ReceivedAt            : 4/21/2015 8:02:12 AM
                        TTL                   : Infinite
                        Description           : Fabric node is up.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/21/2015 8:02:12 AM

                        SourceId              : PowershellWatcher
                        Property              : CPU
                        HealthState           : Warning
                        SequenceNumber        : 130741236814913394
                        SentAt                : 4/21/2015 9:01:21 PM
                        ReceivedAt            : 4/21/2015 9:01:21 PM
                        TTL                   : 00:02:00
                        Description           : CPU is above 80% threshold
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Warning = 4/21/2015 9:01:21 PM
```

The following example reports a transient Warning on a replica. It first get the partition id and the replica id for the service it is interested in, then sends a report from PowershellWatcher on property ResourceDependency. The report is only of interest for 2 minutes, and it will be automatically removed from store.

```powershell
PS C:\> $partitionId = (Get-ServiceFabricPartition -ServiceName fabric:/WordCount/WordCount.Service).PartitionId

PS C:\> $replicaId = (Get-ServiceFabricReplica -PartitionId $partitionId | where {$_.ReplicaRole -eq "Primary"}).ReplicaId

PS C:\> Send-ServiceFabricReplicaHealthReport -PartitionId $partitionId -ReplicaId $replicaId -HealthState Warning -SourceId PowershellWatcher -HealthProperty ResourceDependency -Description "The external resource that the primary is using has been rebooted at 4/21/2015 9:01:21 PM. Expect processing delays for a few minutes." -TimeToLiveSec 120 -RemoveWhenExpired

PS C:\> Get-ServiceFabricReplicaHealth  -PartitionId $partitionId -ReplicaOrInstanceId $replicaId


PartitionId           : 8f82daff-eb68-4fd9-b631-7a37629e08c0
ReplicaId             : 130740415594605869
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='PowershellWatcher', Property='ResourceDependency', HealthState='Warning', ConsiderWarningAsError=false.

HealthEvents          :
                        SourceId              : System.RA
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 130740768777734943
                        SentAt                : 4/21/2015 8:01:17 AM
                        ReceivedAt            : 4/21/2015 8:02:12 AM
                        TTL                   : Infinite
                        Description           : Replica has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/21/2015 8:02:12 AM

                        SourceId              : PowershellWatcher
                        Property              : ResourceDependency
                        HealthState           : Warning
                        SequenceNumber        : 130741243777723555
                        SentAt                : 4/21/2015 9:12:57 PM
                        ReceivedAt            : 4/21/2015 9:12:57 PM
                        TTL                   : 00:02:00
                        Description           : The external resource that the primary is using has been rebooted at 4/21/2015 9:01:21 PM. Expect processing delays for a few minutes.
                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : ->Warning = 4/21/2015 9:12:32 PM
```

## Next steps
[View Azure Service Fabric entities aggregated health](service-fabric-view-entities-aggregated-health.md)

[Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

[How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric Application Upgrade](service-fabric-application-upgrade.md)
