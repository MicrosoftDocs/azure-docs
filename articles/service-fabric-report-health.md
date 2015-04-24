<properties
   pageTitle="Adding custom Service Fabric health reports"
   description="Describes how to send custom health reports to Azure Service Fabric health entities. Gives recommendations for designing and implementing quality health reports."
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

# Adding custom Service Fabric health reports
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) designed to flag unhealthy cluster or application conditions on specific entities. This is accomplished by using **health reporters** (System components and watchdogs). The goal is easy and fast diagnosis and repair. Service writers need to think upfront about health. Any condition that can impact health should be reported on, especially if it can help flagging problems close to the root. This can save a lot of debugging and investigation once the service is up and running at scale in the cloud (private or Azure).

The Service Fabric reporters monitor identified conditions of interest. They report on those conditions based on their local view. The [Health Store](service-fabric-health-introduction.md#Health-Store) aggregates health data sent by all reporters to determine whether entities are globally healthy. The model is intended to be rich, flexible and easy to use. The quality of the health reports determines how accurate the health view of the cluster is. False positives that show unhealthy issues wrongly can negatively impact upgrades or other services that use health data, like repair services or alerting mechanisms. Therefore, some thought is needed to provide reports that capture conditions of interest in the best possible way.

To design and implement health reporting, watchdogs and System components must:

- Define the condition they are interested in, the way it is monitored and the impact on the cluster/application functionality. This defines the health report property and health state.

- Determine the [entity](service-fabric-health-introduction.md#health-entities-and-hierarchy) the report applies to.

- Determine where the reporting is done from, either from within service, internal or external watchdog.

- Define a source used to identify the reporter.

- Choose a reporting strategy, either periodically or on transitions. The recommended way is periodically, as it requires simpler code and is therefore less prone to errors.

- Determine how long the report for unhealthy conditions should stay in health store and how it should be cleared. This defines the report time to live and remove on expiration behavior.

As mentioned above, reporting can be done from:

- The monitored Service Fabric service replica.

- Internal watchdogs deployed as a Service Fabric service. Eg. a Service Fabric stateless service that monitors conditions and issues report. The watchdogs can be deployed an all nodes or can be affinitized to the monitored service.

- Internal Watchdogs that run on the Service Fabric nodes but are **not** implemented as Service Fabric services.

- External watchdogs that are probing the resource from **outside** the Service Fabric cluster. Eg. Gomez like monitoring service.

> [AZURE.NOTE] Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Using System health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md). The user reports must be sent on [health entities](service-fabric-health-introduction.md#health-entities-and-hierarchy) already created by the system.

Once the health reporting design is clear, sending health reports is easy. It can be done through API using FabricClient.HealthManager.ReportHealth, through Powershell or through REST. Internally, all methods use a health client contained inside a fabric client. There are configuration knobs to batch reports for improved performance.

> [AZURE.NOTE] Report health is sync and only represents the validation work on client side. The fact that the report is accepted by the health client doesn't mean it is applied in store; it will be sent asynchronously, possibly batched with other reports and the processing on the server may fail (eg. stale sequence number, the entity on which the report must be applied has been deleted etc).

## Health client
The health reports are sent to the Health Store using a health client, which lives inside the fabric client. The health client can be configured with the following:

- HealthReportSendInterval. The delay between the time the report is added to the client and the time it is sent to Health Store. This is used to batch reports in a single message rather than send one message per each report, for improved performance. Default: 30 seconds.

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
PS C:\> Connect-ServiceFabricCluster -HealthOperationTimeoutInSec 120 -HealthReportSendIntervalInSec 0 -HealthReportRetrySendIntervalInSec 40
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

## Design health reporting
The first step in generating high quality reports is identifying conditions that can impact the health of the service. Any condition that can help flag problems in the service or cluster when they start or even better, before they happen, can potentially save billions of dollars. Think less down time, less night hours spent investigating and repairing issues, high customer satisfaction.

Once the conditions are identified, watchdog writers need to figure out the best way to monitor them for best balance between overhead and usefulness. For example, consider a service that does some complex calculations using some temporary files on a share. A watchdog could monitor the share to make sure enough space is available. It could listen for notifications for file/directory changes. It can report an warning if an up-front threshold is reached and error if the share is full. On warning, a repair system could start clean up of older files on the share. On error, a repair system could move the service replica to another node. Note how the condition states are described in terms of health: what is the state of the condition that can be considered healthy or unhealthy (warning or error).

Once the monitoring details are set, watchdog writer need to figure out how to implement the watchdog. If the conditions can be determined from within the service, the watchdog can be part of the monitored service itself. For example, the service code can check the share usage and report using a local fabric client every time it tries to write a file. The advantage of this approach is that reporting is simple. Care must be taken to prevent watchdog bugs from impacting the service functionality.

Reporting from within the monitored service is not always an option. An watchdog within the service may not be able to detect the conditions: either it doesn't have the logic or data to make the determination, or the overhead of monitoring the conditions is high, or the conditions are not specific to a service, but affect interactions between services. Another option is to have watchogs in the cluster as separate processes. The watchdogs simply monitor the conditions and report, without affecting the main services in any way. These watchdogs could for example be implemented as stateless services in the same application, deployed on all nodes or on the same nodes as the service.

Sometimes, an watchdog running in the cluster is not an option either. If the monitored conditions are the availability or the functionality of the service as users see it, it's best to have the watchdogs in the same place as the user clients, testing the operations in the same way users call them. For example, we can have a watchog leaving outside the cluster and issuing requests to the service, checking the latency and the correctness of the result (for a calculator service, does 2+2 return 4 in a reasonable time?).

Once the watchdog details have been finalized, decide a source id that uniquely identifies it. If multiple watchdogs of the same type are living in the cluster, they must either report on different entities, or if they report on the same entity, make sure the source id or the property is different, so reports can coexist. The property of the health report should capture the monitored condition. Eg. for the example above, the property could be ShareSize. If multiple data applied to the same condition, the property should contain some dynamic information to allow reports to coexist. For example, if there are multiple shares that need to be monitored, the property name can be ShareSize-sharename.

> [AZURE.NOTE] The health store should **not** be used to keep status information. Only health related information should be reported as health, information that impacts the health evaluation of an entity. The health store was not designed as a general purpose store. It uses health evaluation logic to aggregate all data into health state. Sending non-health related information (eg. reporting status with health state Ok) will not impact aggregated health state, but can negatively affect the performance of the health store.

The next decision point is what entity to report on. Most of the time, this is obvious based on the condition. Choose the entity with best granularity possible. If a condition impacts all replicas in a partition, report on the partition, not on the service. There are corner cases where more thought is needed. If the condition impacts an entity (eg. replica) but the desire is to have the condition flagged for more than replica life duration, they it should be reported on partition. Otherwise, when the replica is deleted, all reports associated with it are cleaned up from store. This means watchdog writers needs to also think about the lifetime of the entity and of the report. It must be clear when a report should be cleaned up from a store (eg. when an Error reported on an entity is not applying anymore).

Let's look at an example to put together the above points. Consider a Service Fabric application composed of a Master stateful persisted service and Slaves stateless services deployed on all nodes (one Slave service type for a type of task). The Master has a processing queue with commands to be executed by slaves. The slaves execute the incoming requests and send back Acks. One condition that could be monitored is Master processing queue length. If the master queue length reaches a threshold, report Warning, as that means the slaves can't handle the load. If the queue reached max length and commands are dropped, report Error as the service can't recover. The reports can be on property "QueueStatus". The watchdog lives inside the service and it's sent periodically on the Master primary replica. The TTL is 2 minutes and it's sent periodically every 30 seconds. If the primary goes down, the report is cleaned up automatically from store. If the service replica is up but deadlocked or having other issues, the report will expire in the health store and the entity will be evaluated at error.

Other condition that can be monitored is task execution time. The Master distributes the tasks to the slaves based on the task type. Depending on the design, the Master could poll the slaves for task status or it could wait for slaves to send back ACKs when done. In the second case, care must be taken to detect situations where slaves die or messages get lost. One option is for Master to send a ping request to the same Slave, which sends back the status. If no status is received, consider failure and re-schedule the task. This assumes that the tasks are idempotent.
We can translate the monitored condition as warning if task is not done in a certain time t1 (eg. 10 minutes); and error if the task is not completed in time t2 (eg. 20 minutes). This reporting can be done in multiple ways:

- The Master primary replica reports periodically on itself. We can have one property for all pending tasks in the queue: if at least one task takes longer, report on property "PendingTasks" warning or error, as appropriate. If there are no pending tasks or all are just started, report Ok. The tasks are persisted, so if primary goes down, the new promoted primary can continue to report properly.

- Another watchdog process (in the cloud or external) checks the tasks (from outside, based on desired task result) to see if they are completed. If they do not respect the thresholds, report on Master service. Report on each task and include the task identifier (eg: PendingTask+taskid). Report only on unhealthy states. Set TTL to a few minutes and mark the reports to be removed when expired to ensure cleanup.

- The slave that is executing a task is reporting if it takes longer than expected to run it. It reports on the service instance on property "PendingTasks". This pinpoints the service instance that has issues, but it doesn't capture the situation where the instance dies. The reports are cleaned up at that time. It could report on the Slave service; if the Slave completes the task, the slave instance clears the report from store. This doesn't capture the situation where the ack message is lost and the task is not finished from Master point of view.

However the reporting is done in the cases described above, they will be captured in application health when health is evaluated.

## Report periodically vs. on transition
Using the health reporting model, watchdogs can send reports periodically or on transitions. The recommended way is periodically, because the code is much simpler, therefore less error prone. The watchdogs must strive to be as simple as possible to avoid bugs which trigger wrong reports. Incorrect unhealthy report will impact health evaluation and scenarios based on health, like upgrades. Incorrect healthy reports hide issues in the cluster, which is not desired.

For periodic reporting, the watchdog can be implemented with a timer. On timer callback, the watchdog can check the state and send an report based on current state. There is no need to see what report was sent previously or make any optimization in terms of messaging. The health client has batching logic to help with that. As long as the health client is kept alive, it will retry internally until the report is ACKed by the health store or the watchdog generates a newer report with the same entity, property and source.

Reporting on transition requires careful state handling. The watchdog monitors some conditions and only reports when the conditions change. The plus side is that less reports are needed. The minus is that the logic of the watchdog is complex. The conditions or the reports must be maintained so they can be inspected to determine state changes. On failover, care must be taken to send a report which may have not be sent previously (queued, but not yet sent to health store). The sequence number must be always increasing, or the reports will be rejected due to staleness. In the rare cases where data loss is incurred, there may be synchronization needed between the state of the reporter and the state of the health store.

## Implement health reporting
Once the entity and report details are clear, sending health reports can be done though API, Powershell or REST.

### API
In order to report through API, users need to create a health report specific to the entity type they want to report on and then give it to a health client.

The following example shows periodic reporting from a watchdog from within the cluster. The watcher checks whether an external resource can be accessed from within a node. The resource is needed by a service manifest within the application. If the resource is unavailable, the other services within the application can function properly. Therefore, the report is sent on the deployed service package entity, periodically, every 30 seconds.

```csharp
private static Uri ApplicationName = new Uri("fabric:/WordCount");
private static string ServiceManifestName = "WordCount.Service";
private static string NodeName = FabricRuntime.GetNodeContext().NodeName;
private static Timer ReportTimer = new Timer(new TimerCallback(SendReport), null, 30 * 1000, 30 * 1000);
private static FabricClient Client = new FabricClient(new FabricClientSettings() { HealthReportSendInterval = TimeSpan.FromSeconds(0) });

public static void SendReport(object obj)
{
    // Test whether the resource can be accessed from the node
    HealthState healthState = this.TestConnectivityToExternalResource();

    // Send report on deployed service package, as the connectivity is needed by the specific service manifest
    // and can be different on different nodes
    var deployedServicePackageHealthReport = new DeployedServicePackageHealthReport(
        ApplicationName,
        ServiceManifestName,
        NodeName,
        new HealthInformation("ExternalSourceWatcher", "Connectivity", healthState));

    // TODO: handle exception. Code omitted for snipet brevity.
    Client.HealthManager.ReportHealth(deployedServicePackageHealthReport);
}
```

### Powershell
Users can send health reports with Send-ServiceFabric*EntityType*HealthReport.

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

Based on the health data, service writers and cluster/application administrators can think of ways to consume the information. For example, they can set up alerts based on health status to catch severe issues before provoking outages. They can set up automatic repair systems to fix issues automatically.

[Introduction to Service Fabric Health Monitoring](service-fabric-health-introduction.md)

[How to view Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)

[Using System health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

[How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric Application Upgrade](service-fabric-application-upgrade.md)
