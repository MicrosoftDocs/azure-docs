<properties
   pageTitle="Add custom Service Fabric health reports | Microsoft Azure"
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
   ms.date="07/11/2016"
   ms.author="oanapl"/>

# Add custom Service Fabric health reports
Azure Service Fabric introduces a [health model](service-fabric-health-introduction.md) designed to flag unhealthy cluster and application conditions on specific entities. This is accomplished by using **health reporters** (system components and watchdogs). The goal is easy and fast diagnosis and repair. Service writers need to think upfront about health. Any condition that can impact health should be reported on, especially if it can help flag problems close to the root. This can save a lot of time and effort on debugging and investigation once the service is up and running at scale in the cloud (private or Azure).

The Service Fabric reporters monitor identified conditions of interest. They report on those conditions based on their local view. The [health store](service-fabric-health-introduction.md#Health-Store) aggregates health data sent by all reporters to determine whether entities are globally healthy. The model is intended to be rich, flexible, and easy to use. The quality of the health reports determines the accuracy of the health view of the cluster. False positives that wrongly show unhealthy issues can negatively impact upgrades or other services that use health data. These can include repair services and alerting mechanisms. Therefore, some thought is needed to provide reports that capture conditions of interest in the best possible way.

To design and implement health reporting, watchdogs and system components must:

- Define the condition they are interested in, the way it is monitored, and the impact on the cluster or application functionality. This defines the health report property and health state.

- Determine the [entity](service-fabric-health-introduction.md#health-entities-and-hierarchy) that the report applies to.

- Determine where the reporting is done, from within the service or from an internal or external watchdog.

- Define a source used to identify the reporter.

- Choose a reporting strategy, either periodically or on transitions. The recommended way is periodically, as it requires simpler code and is less prone to errors.

- Determine how long the report for unhealthy conditions should stay in the health store and how it should be cleared. This defines the report's time to live and remove-on-expiration behavior.

As mentioned above, reporting can be done from:

- The monitored Service Fabric service replica.

- Internal watchdogs deployed as a Service Fabric service (e.g. a Service Fabric stateless service that monitors conditions and issues reports). The watchdogs can be deployed an all nodes or can be affinitized to the monitored service.

- Internal watchdogs that run on the Service Fabric nodes but are *not* implemented as Service Fabric services.

- External watchdogs that probe the resource from *outside* the Service Fabric cluster (e.g. a Gomez-like monitoring service).

> [AZURE.NOTE] Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Using system health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md). The user reports must be sent on [health entities](service-fabric-health-introduction.md#health-entities-and-hierarchy) that have already been created by the system.

Once the health reporting design is clear, health reports can be sent easily. You can use `FabricClient` to report health if the cluster is not [secure](service-fabric-cluster-security.md) or if the fabric client has admin privileges. This can be done through the API by using [FabricClient.HealthManager.ReportHealth](https://msdn.microsoft.com/library/system.fabric.fabricclient.healthclient.reporthealth.aspx), through PowerShell, or through REST. Configuration knobs batch reports for improved performance.

> [AZURE.NOTE] Report health is synchronous, and it represents only the validation work on the client side. The fact that the report is accepted by the health client or the `Partition` or `CodePackageActivationContext` objects doesn't mean that it is applied in the store. It will be sent asynchronously and possibly batched with other reports. The processing on the server may still fail (e.g. a sequence number is stale, the entity on which the report must be applied has been deleted, etc.).

## Health client
The health reports are sent to the health store through a health client, which lives inside the fabric client. The health client can be configured with the following:

- **HealthReportSendInterval**: The delay between the time the report is added to the client and the time it is sent to the health store. This is used to batch reports into a single message, rather than sending one message for each report. This improves performance. Default: 30 seconds.

- **HealthReportRetrySendInterval**: The interval at which the health client resends accumulated health reports to the health store. Default: 30 seconds.

- **HealthOperationTimeout**: The timeout period for a report message sent to the health store. If a message times out, the health client retries it until the health store confirms that the report has been processed. Default: two minutes.

> [AZURE.NOTE] When the reports are batched, the fabric client must be kept alive for at least the HealthReportSendInterval to ensure that they are sent. If the message is lost or the health store cannot apply them due to transient errors, the fabric client must be kept alive longer to give it a chance to retry.

The buffering on the client takes the uniqueness of the reports into consideration. For example, if a particular bad reporter is reporting 100 reports per second on the same property of the same entity, the reports will be replaced with the last version. Only one such report exists in the client queue at most. If batching is configured, the number of reports sent to the health store is just one per send interval. This is the last added report, which reflects the most current state of the entity.
All configuration parameters can be specified when `FabricClient` is created by passing [FabricClientSettings](https://msdn.microsoft.com/library/azure/system.fabric.fabricclientsettings.aspx) with the desired values for health-related entries.

The following creates a fabric client and specifies that the reports should be sent as soon as they are added. On timeouts and errors that can be retried, retries happen every 40 seconds.

```csharp
var clientSettings = new FabricClientSettings()
{
    HealthOperationTimeout = TimeSpan.FromSeconds(120),
    HealthReportSendInterval = TimeSpan.FromSeconds(0),
    HealthReportRetrySendInterval = TimeSpan.FromSeconds(40),
};
var fabricClient = new FabricClient(clientSettings);
```

Same parameters can be specified when a connection to a cluster is created through PowerShell. The following starts a connection to a local cluster:

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

> [AZURE.NOTE] To ensure that unauthorized services can't report health against the entities in the cluster, the server can be configured to accept requests only from secured clients. Since the reporting is done through `FabricClient`, this means that `FabricClient` must have security enabled to be able to communicate with the cluster (e.g. with Kerberos or certificate authentication). Read more about [cluster security](service-fabric-cluster-security.md).

## Report from within low privilege services
From within Service Fabric services that do not have admin access to the cluster, you can report health on entities from the current context through `Partition` or `CodePackageActivationContext`.

- For stateless services, use [IStatelessServicePartition.ReportInstanceHealth](https://msdn.microsoft.com/library/system.fabric.istatelessservicepartition.reportinstancehealth.aspx) to report on the current service instance.

- For stateful services, use  [IStatefulServicePartition.ReportReplicaHealth](https://msdn.microsoft.com/library/system.fabric.istatefulservicepartition.reportreplicahealth.aspx) to report on current replica.

- Use [IServicePartition.ReportPartitionHealth](https://msdn.microsoft.com//library/system.fabric.iservicepartition.reportpartitionhealth.aspx) to report on the current partition entity.

- Use [CodePackageActivationContext.ReportApplicationHealth](https://msdn.microsoft.com/library/system.fabric.codepackageactivationcontext.reportapplicationhealth.aspx) to report on current application.

- Use [CodePackageActivationContext.ReportDeployedApplicationHealth](https://msdn.microsoft.com/library/system.fabric.codepackageactivationcontext.reportdeployedapplicationhealth.aspx) to report on the current application deployed on the current node.

- Use [CodePackageActivationContext.ReportDeployedServicePackageHealth](https://msdn.microsoft.com/library/system.fabric.codepackageactivationcontext.reportdeployedservicepackagehealth.aspx) to report on a service package for the current application deployed on the current node.

> [AZURE.NOTE] Internally, the `Partition` and the `CodePackageActivationContext` hold a health client which is configured with default settings. The same considerations explained for [health client](service-fabric-report-health.md#health-client) apply - reports are batched and sent on a timer, so the objects should be kept alive to have a chance to send the report.

## Design health reporting
The first step in generating high-quality reports is identifying the conditions that can impact the health of the service. Any condition that can help flag problems in the service or cluster when it starts--or even better, before a problem happens--can potentially save billions of dollars. The benefits include less down time, fewer night hours spent investigating and repairing issues, and higher customer satisfaction.

Once the conditions are identified, watchdog writers need to figure out the best way to monitor them for balance between overhead and usefulness. For example, consider a service that does complex calculations that use some temporary files on a share. A watchdog could monitor the share to ensure that enough space is available. It could listen for notifications of file or directory changes. It could report a warning if an upfront threshold is reached and report an error if the share is full. On a warning, a repair system could start cleaning up older files on the share. On an error, a repair system could move the service replica to another node. Note how the condition states are described in terms of health: the state of the condition that can be considered healthy or unhealthy (warning or error).

Once the monitoring details are set, a watchdog writer needs to figure out how to implement the watchdog. If the conditions can be determined from within the service, the watchdog can be part of the monitored service itself. For example, the service code can check the share usage, and then report by using a local fabric client every time it tries to write a file. The advantage of this approach is that reporting is simple. Care must be taken to prevent watchdog bugs from impacting the service functionality, though.

Reporting from within the monitored service is not always an option. A watchdog within the service may not be able to detect the conditions. It may not have the logic or data to make the determination. The overhead of monitoring the conditions may be high. The conditions also may not be specific to a service, but instead affect interactions between services. Another option is to have watchdogs in the cluster as separate processes. The watchdogs simply monitor the conditions and report, without affecting the main services in any way. For example, these watchdogs could be implemented as stateless services in the same application, deployed on all nodes or on the same nodes as the service.

Sometimes, a watchdog running in the cluster is not an option either. If the monitored condition is the availability or functionality of the service as users see it, it's best to have the watchdogs in the same place as the user clients. There, they can test the operations in the same way users call them. For example, you can have a watchdog that lives outside the cluster and issues requests to the service, and then checks the latency and correctness of the result. (For a calculator service, for example, does 2+2 return 4 in a reasonable amount of time?)

Once the watchdog details have been finalized, you should decide on a source ID that uniquely identifies it. If multiple watchdogs of the same type are living in the cluster, either they must report on different entities, or, if they report on the same entity, they must ensure that the source ID or the property is different. This way, their reports can coexist. The property of the health report should capture the monitored condition. (For the example above, the property could be **ShareSize**.) If multiple reports apply to the same condition, the property should contain some dynamic information that allows reports to coexist. For example, if multiple shares need to be monitored, the property name can be **ShareSize-sharename**.

> [AZURE.NOTE] The health store should *not* be used to keep status information. Only health-related information should be reported as health, as this information impacts the health evaluation of an entity. The health store was not designed as a general-purpose store. It uses health evaluation logic to aggregate all data into the health state. Sending information unrelated to health (e.g. reporting status with a health state of OK) will not impact the aggregated health state, but it can negatively affect the performance of the health store.

The next decision point is which entity to report on. Most of the time, this is obvious, based on the condition. You should choose the entity with best possible granularity. If a condition impacts all replicas in a partition, report on the partition, not on the service. There are corner cases where more thought is needed, though. If the condition impacts an entity, such as a replica, but the desire is to have the condition flagged for more than the duration of replica life, then it should be reported on the partition. Otherwise, when the replica is deleted, all reports associated with it will be cleaned up from the store. This means that watchdog writers must also think about the lifetimes of the entity and the report. It must be clear when a report should be cleaned up from a store (e.g. when an error reported on an entity no longer applies).

Let's look at an example that puts together the points above. Consider a Service Fabric application composed of a master stateful persistent service and secondary stateless services deployed on all nodes (one secondary service type for each type of task). The master has a processing queue that contains commands to be executed by secondaries. The secondaries execute the incoming requests and send back acknowledgement signals. One condition that could be monitored is the length of the master processing queue. If the master queue length reaches a threshold, a warning is reported. This indicates that the secondaries can't handle the load. If the queue reaches the maximum length and commands are dropped, an error is reported, as the service can't recover. The reports can be on the property **QueueStatus**. The watchdog lives inside the service, and it's sent periodically on the master primary replica. The time to live is two minutes, and it's sent periodically every 30 seconds. If the primary goes down, the report is cleaned up automatically from store. If the service replica is up, but it is deadlocked or having other issues, the report will expire in the health store. In this case, the entity will be evaluated at error.

Another condition that can be monitored is task execution time. The master distributes tasks to the secondaries based on the task type. Depending on the design, the master could poll the secondaries for task status. It could also wait for secondaries to send back acknowledgement signals when they are done. In the second case, care must be taken to detect situations where secondaries die or messages are lost. One option is for the master to send a ping request to the same secondary, which sends back its status. If no status is received, the master considers this a failure and reschedules the task. This assumes that the tasks are idempotent.

We can translate the monitored condition as a warning if the task is not done in a certain time (**t1**, e.g. 10 minutes); and as an error if the task is not completed in time (**t2**, e.g. 20 minutes). This reporting can be done in multiple ways:

- The master primary replica reports on itself periodically. You can have one property for all pending tasks in the queue. If at least one task takes longer, the report status on the property **PendingTasks** is a warning or error, as appropriate. If there are no pending tasks or all have just started, the report status is OK. The tasks are persistent, so if the primary goes down, the newly promoted primary can continue to report properly.

- Another watchdog process (in the cloud or external) checks the tasks (from outside, based on the desired task result) to see if they are completed. If they do not respect the thresholds, a report is sent on the master service. A report is also sent on each task that includes the task identifier (e.g. **PendingTask+taskid**). Reports should be sent only on unhealthy states. Time to live should be set to a few minutes, and the reports should be marked to be removed when they expire to ensure cleanup.

- The secondary that is executing a task reports if it takes longer than expected to run it. It reports on the service instance on the property **PendingTasks**. This pinpoints the service instance that has issues, but it doesn't capture the situation where the instance dies. The reports are cleaned up at that time. It could report on the secondary service. If the secondary completes the task, the secondary instance clears the report from the store. This doesn't capture the situation where the acknowledgement message is lost and the task is not finished from the master's point of view.

However the reporting is done in the cases described above, the reports will be captured in application health when health is evaluated.

## Report periodically vs. on transition
By using the health reporting model, watchdogs can send reports periodically or on transitions. The recommended way for watchdog reporting is periodically, because the code is much simpler and less prone to errors. The watchdogs must strive to be as simple as possible to avoid bugs that trigger incorrect reports. Incorrect *unhealthy* reports impact health evaluations and scenarios based on health, including upgrades. Incorrect *healthy* reports hide issues in the cluster, which is not desired.

For periodic reporting, the watchdog can be implemented with a timer. On a timer callback, the watchdog can check the state and send a report based on the current state. There is no need to see which report was sent previously or make any optimizations in terms of messaging. The health client has batching logic to help with that. As long as the health client is kept alive, it will retry internally until the report is acknowledged by the health store or until the watchdog generates a newer report with the same entity, property, and source.

Reporting on transitions requires careful handling of state. The watchdog monitors some conditions and reports only when the conditions change. The upside side of this approach is that fewer reports are needed. The downside is that the logic of the watchdog is complex. The conditions or the reports must also be maintained, so that they can be inspected to determine state changes. On failover, care must be taken when a report is sent that may have not be sent previously (queued, but not yet sent to the health store). The sequence number must be ever-increasing. If not, the reports will be rejected as stale. In the rare cases where data loss is incurred, synchronization may be needed between the state of the reporter and the state of the health store.

Reporting on transitions makes sense for services reporting on themselves, through `Partition` or `CodePackageActivationContext`. When the local object (replica or deployed service package / deployed application) is removed, all its reports are also removed. This relaxes the need for synchronization between reporter and health store. If the report is for parent partition or parent application, care must be taken on failover to avoid stale reports in the health store. Logic must be added to maintain the correct state and clear the report from store when not needed anymore.

## Implement health reporting
Once the entity and report details are clear, sending health reports can be done through the API, PowerShell, or REST.

### API
In order to report through the API, users need to create a health report specific to the entity type they want to report on. They then give the report to a health client. Alternatively, users need to create a health information and pass it to correct reporting methods on `Partition` or `CodePackageActivationContext` to report on current entities.

The following example shows periodic reporting from a watchdog within the cluster. The watchdog checks whether an external resource can be accessed from within a node. The resource is needed by a service manifest within the application. If the resource is unavailable, the other services within the application can still function properly. Therefore, the report is sent on the deployed service package entity every 30 seconds.

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

    // TODO: handle exception. Code omitted for snippet brevity.
    // Possible exceptions: FabricException with error codes
    // FabricHealthStaleReport (non-retryable, the report is already queued on the health client),
    // FabricHealthMaxReportsReached (retryable; user should retry with exponential delay until the report is accepted).
    Client.HealthManager.ReportHealth(deployedServicePackageHealthReport);
}
```

### PowerShell
Users can send health reports by using **Send-ServiceFabric*EntityType*HealthReport**.

The following example shows periodic reporting on CPU values on a node. The reports should be sent every 30 seconds, and they have a time to live of two minutes. If they expire, the reporter has issues, so the node is evaluated at error. When the CPU is above a threshold, the report has a health state of warning. When the CPU remains above a threshold for more than the configured time, it's reported as an error. Otherwise, the reporter sends a health state of OK.

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

The following example reports a transient warning on a replica. It first gets the partition ID and then the replica ID for the service it is interested in. It then sends a report from **PowershellWatcher** on the property **ResourceDependency**. The report is of interest for only two minutes, and it will be removed from the store automatically.

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

Based on the health data, service writers and cluster/application administrators can think of ways to consume the information. For example, they can set up alerts based on health status to catch severe issues before they provoke outages. Administrators can also set up repair systems to fix issues automatically.

[Introduction to Service Fabric health Monitoring](service-fabric-health-introduction.md)

[View Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)

[How to report and check service health](service-fabric-diagnostics-how-to-report-and-check-service-health.md)

[Use system health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

[Monitor and diagnose services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric application upgrade](service-fabric-application-upgrade.md)
