
---
title: Change Azure Service Fabric cluster settings | Microsoft Docs
description: This article describes the fabric settings and the fabric upgrade policies that you can customize.
services: service-fabric
documentationcenter: .net
author: chackdan
manager: timlt
editor: ''

ms.assetid: 7ced36bf-bd3f-474f-a03a-6ebdbc9677e2
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/15/2017
ms.author: chackdan

---
# Customize Service Fabric cluster settings and Fabric Upgrade policy
This document tells you how to customize the various fabric settings and the fabric upgrade policy for your Service Fabric cluster. You can customize them through the [Azure portal](https://portal.azure.com) or using an Azure Resource Manager template.

> [!NOTE]
> Not all settings are available in the portal. In case a setting listed below is not available via the portal customize it using an Azure Resource Manager template.
> 

## Customize cluster settings using Resource Manager templates
The steps below illustrate how to add a new setting *MaxDiskQuotaInMB* to the *Diagnostics* section.

1. Go to https://resources.azure.com
2. Navigate to your subscription by expanding **subscriptions** -> **resource groups** -> **Microsoft.ServiceFabric** -> **\<Your Cluster Name>**
3. In the top right corner, select **Read/Write.**
4. Select **Edit** and update the `fabricSettings` JSON element and add a new element:

```
      {
        "name": "Diagnostics",
        "parameters": [
          {
            "name": "MaxDiskQuotaInMB",
            "value": "65536"
          }
        ]
      }
```

The following is a list of Fabric settings that you can customize, organized by section.

### Section Name: Diagnostics
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| ConsumerInstances |String | Dynamic |The list of DCA consumer instances. |
| ProducerInstances |String | Dynamic |The list of DCA producer instances. |
| AppEtwTraceDeletionAgeInDays |Int, default is 3 | Dynamic |Number of days after which we delete old ETL files containing application ETW traces. |
| AppDiagnosticStoreAccessRequiresImpersonation |Bool, default is true | Dynamic |Whether or not impersonation is required when accessing diagnostic stores on behalf of the application. |
| MaxDiskQuotaInMB |Int, default is 65536 | Dynamic |Disk quota in MB for Windows Fabric log files. |
| DiskFullSafetySpaceInMB |Int, default is 1024 | Dynamic |Remaining disk space in MB to protect from use by DCA. |
| ApplicationLogsFormatVersion |Int, default is 0 | Dynamic |Version for application logs format. Supported values are 0 and 1. Version 1 includes more fields from the ETW event record than version 0. |
| ClusterId |String | Dynamic |The unique id of the cluster. This is generated when the cluster is created. |
| EnableTelemetry |Bool, default is true | Dynamic |This is going to enable or disable telemetry. |
| EnableCircularTraceSession |Bool, default is false | Static |Flag indicates whether circular trace sessions should be used. |

### Section Name: Trace/Etw
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| Level |Int, default is 4 | Dynamic |Trace etw level can take values 1, 2, 3, 4. To be supported you must keep the trace level at 4 |

### Section Name: PerformanceCounterLocalStore
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| IsEnabled |Bool, default is true | Dynamic |Flag indicates whether performance counter collection on local node is enabled. |
| SamplingIntervalInSeconds |Int, default is 60 | Dynamic |Sampling interval for performance counters being collected. |
| Counters |String | Dynamic |Comma-separated list of performance counters to collect. |
| MaxCounterBinaryFileSizeInMB |Int, default is 1 | Dynamic |Maximum size (in MB) for each performance counter binary file. |
| NewCounterBinaryFileCreationIntervalInMinutes |Int, default is 10 | Dynamic |Maximum interval (in seconds) after which a new performance counter binary file is created. |

### Section Name: Setup
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| FabricDataRoot |String | Not Allowed |Service Fabric data root directory. Default for Azure is d:\svcfab |
| FabricLogRoot |String | Not Allowed |Service fabric log root directory. This is where SF logs and traces are placed. |
| ServiceRunAsAccountName |String | Not Allowed |The account name under which to run fabric host service. |
| SkipFirewallConfiguration |Bool, default is false | Not Allowed |Specifies if firewall settings need to be set by the system or not. This applies only if you are using windows firewall. If you are using third party firewalls, then you must open the ports for the system and applications to use |
|NodesToBeRemoved|string, default is ""| Dynamic |The nodes which should be removed as part of configuration upgrade. (Only for Standalone Deployments)|
|ContainerNetworkSetup|bool, default is FALSE| Static |Whether to set up a container network.|
|ContainerNetworkName|string, default is L""| Static |The network name to use when setting up a container network.|

### Section Name: TransactionalReplicator
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| MaxCopyQueueSize |Uint, default is 16384 | Static |This is the maximum value defines the initial size for the queue which maintains replication operations. Note that it must be a power of 2. If during runtime the queue grows to this size operation will be throttled between the primary and secondary replicators. |
| BatchAcknowledgementInterval | Time in seconds, default is 0.015 | Static | Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before sending back an acknowledgement. Other operations received during this time period will have their acknowledgements sent back in a single message-> reducing network traffic but potentially reducing the throughput of the replicator. |
| MaxReplicationMessageSize |Uint, default is 52428800 | Static | Maximum message size of replication operations. Default is 50MB. |
| ReplicatorAddress |string, default is "localhost:0" | Static | The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to establish connections with other replicas in order to send/receive operations. |
| InitialPrimaryReplicationQueueSize |Uint, default is 64 | Static |This value defines the initial size for the queue which maintains the replication operations on the primary. Note that it must be a power of 2.|
| MaxPrimaryReplicationQueueSize |Uint, default is 8192 | Static |This is the maximum number of operations that could exist in the primary replication queue. Note that it must be a power of 2. |
| MaxPrimaryReplicationQueueMemorySize |Uint, default is 0 | Static |This is the maximum value of the primary replication queue in bytes. |
| InitialSecondaryReplicationQueueSize |Uint, default is 64 | Static |This value defines the initial size for the queue which maintains the replication operations on the secondary. Note that it must be a power of 2. |
| MaxSecondaryReplicationQueueSize |Uint, default is 16384 | Static |This is the maximum number of operations that could exist in the secondary replication queue. Note that it must be a power of 2. |
| MaxSecondaryReplicationQueueMemorySize |Uint, default is 0 | Static |This is the maximum value of the secondary replication queue in bytes. |
| SecondaryClearAcknowledgedOperations |Bool, default is false | Static |Bool which controls if the operations on the secondary replicator are cleared once they are acknowledged to the primary(flushed to the disk). Settings this to TRUE can result in additional disk reads on the new primary, while catching up replicas after a failover. |
| MaxMetadataSizeInKB |Int, default is 4 |Not Allowed|Maximum size of the log stream metadata. |
| MaxRecordSizeInKB |Uint, default is 1024 |Not Allowed| Maximum size of a log stream record. |
| CheckpointThresholdInMB |Int, default is 50 |Static|A checkpoint will be initiated when the log usage exceeds this value. |
| MaxAccumulatedBackupLogSizeInMB |Int, default is 800 |Static|Max accumulated size (in MB) of backup logs in a given backup log chain. An incremental backup requests will fail if the incremental backup would generate a backup log that would cause the accumulated backup logs since the relevant full backup to be larger than this size. In such cases, user is required to take a full backup. |
| MaxWriteQueueDepthInKB |Int, default is 0 |Not Allowed| Int for maximum write queue depth that the core logger can use as specified in kilobytes for the log that is associated with this replica. This value is the maximum number of bytes that can be outstanding during core logger updates. It may be 0 for the core logger to compute an appropriate value or a multiple of 4. |
| SharedLogId |String |Not Allowed|Shared log identifier. This is a guid and should be unique for each shared log. |
| SharedLogPath |String |Not Allowed|Path to the shared log. If this value is empty then the default shared log is used. |
| SlowApiMonitoringDuration |Time in seconds, default is 300 |Static| Specify duration for api before warning health event is fired.|
| MinLogSizeInMB |Int, default is 0 |Static|Minimum size of the transactional log. The log will not be allowed to truncate to a size below this setting. 0 indicates that the replicator will determine the minimum log size according to other settings. Increasing this value increases the possibility of doing partial copies and incremental backups since chances of relevant log records being truncated is lowered. |

### Section Name: FabricClient
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| NodeAddresses |string, default is "" |Static|A collection of addresses (connection strings) on different nodes that can be used to communicate with the the Naming Service. Initially the Client connects selecting one of the addresses randomly. If more than one connection string is supplied and a connection fails because of a communication or timeout error; the Client switches to use the next address sequentially. See the Naming Service Address retry section for details on retries semantics. |
| ConnectionInitializationTimeout |Time in seconds, default is 2 |Dynamic|Specify timespan in seconds. Connection timeout interval for each time client tries to open a connection to the gateway. |
| PartitionLocationCacheLimit |Int, default is 100000 |Static|Number of partitions cached for service resolution (set to 0 for no limit). |
| ServiceChangePollInterval |Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. The interval between consecutive polls for service changes from the client to the gateway for registered service change notifications callbacks. |
| KeepAliveIntervalInSeconds |Int, default is 20 |Static|The interval at which the FabricClient transport sends keep-alive messages to the gateway. For 0; keepAlive is disabled. Must be a positive value. |
| HealthOperationTimeout |Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. The timeout for a report message sent to Health Manager. |
| HealthReportSendInterval |Time in seconds, default is 30 |Dynamic|Specify timespan in seconds. The interval at which reporting component sends accumulated health reports to Health Manager. |
| HealthReportRetrySendInterval |Time in seconds, default is 30 |Dynamic|Specify timespan in seconds. The interval at which reporting component re-sends accumulated health reports to Health Manager. |
| RetryBackoffInterval |Time in seconds, default is 3 |Dynamic|Specify timespan in seconds. The back-off interval before retrying the operation. |
| MaxFileSenderThreads |Uint, default is 10 |Static|The max number of files that are transferred in parallel. |

### Section Name: Common
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| PerfMonitorInterval |Time in seconds, default is 1 |Dynamic|Specify timespan in seconds. Performance monitoring interval. Setting to 0 or negative value disables monitoring. |

### Section Name: HealthManager
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| EnableApplicationTypeHealthEvaluation |Bool, default is false |Static|Cluster health evaluation policy: enable per application type health evaluation. |

### Section Name: NodeDomainIds
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| UpgradeDomainId |string, default is "" |Static|Describes the upgrade domain a node belongs to. |
| PropertyGroup |NodeFaultDomainIdCollection |Static|Describes the fault domains a node belongs to. The fault domain is defined through a URI that describes the location of the node in the datacenter.  Fault Domain URIs are of the format fd:/fd/ followed by a URI path segment.|

### Section Name: NodeProperties
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| PropertyGroup |NodePropertyCollectionMap |Static|A collection of string key-value pairs for node properties. |

### Section Name: NodeCapacities
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| PropertyGroup |NodeCapacityCollectionMap |Static|A collection of node capacities for different metrics. |

### Section Name: FabricNode
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| StateTraceInterval |Time in seconds, default is 300 |Static|Specify timespan in seconds. The interval for tracing node status on each node and up nodes on FM/FMM. |
| StartApplicationPortRange |Int, default is 0 |Static|Start of the application ports managed by hosting subsystem. Required if EndpointFilteringEnabled is true in Hosting. |
| EndApplicationPortRange |Int, default is 0 |Static|End (no inclusive) of the application ports managed by hosting subsystem. Required if EndpointFilteringEnabled is true in Hosting. |
| ClusterX509StoreName |string, default is "My" |Dynamic|Name of X.509 certificate store that contains cluster certificate for securing intra-cluster communication. |
| ClusterX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for cluster certificate in the store specified by ClusterX509StoreName Supported values: "FindByThumbprint"; "FindBySubjectName" With "FindBySubjectName"; when there are multiple matches; the one with the furthest expiration is used. |
| ClusterX509FindValue |string, default is "" |Dynamic|Search filter value used to locate cluster certificate. |
| ClusterX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate cluster certificate. |
| ServerAuthX509StoreName |string, default is "My" |Dynamic|Name of X.509 certificate store that contains server certificate for entree service. |
| ServerAuthX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for server certificate in the store specified by ServerAuthX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
| ServerAuthX509FindValue |string, default is "" |Dynamic|Search filter value used to locate server certificate. |
| ServerAuthX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate server certificate. |
| ClientAuthX509StoreName |string, default is "My" |Dynamic|Name of the X.509 certificate store that contains certificate for default admin role FabricClient. |
| ClientAuthX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for certificate in the store specified by ClientAuthX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
| ClientAuthX509FindValue |string, default is "" | Dynamic|Search filter value used to locate certificate for default admin role FabricClient. |
| ClientAuthX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate certificate for default admin role FabricClient. |
| UserRoleClientX509StoreName |string, default is "My" |Dynamic|Name of the X.509 certificate store that contains certificate for default user role FabricClient. |
| UserRoleClientX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for certificate in the store specified by UserRoleClientX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
| UserRoleClientX509FindValue |string, default is "" |Dynamic|Search filter value used to locate certificate for default user role FabricClient. |
| UserRoleClientX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate certificate for default user role FabricClient. |

### Section Name: Paas
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| ClusterId |string, default is "" |Not Allowed|X509 certificate store used by fabric for configuration protection. |

### Section Name: FabricHost
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| StopTimeout |Time in seconds, default is 300 |Dynamic|Specify timespan in seconds. The timeout for hosted service activation; deactivation and upgrade. |
| StartTimeout |Time in seconds, default is 300 |Dynamic|Specify timespan in seconds. Time out for fabricactivationmanager startup. |
| ActivationRetryBackoffInterval |Time in seconds, default is 5 |Dynamic|Specify timespan in seconds. Backoff interval on every activation failure;On every continuous activation failure the system will retry the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval. |
| ActivationMaxRetryInterval |Time in seconds, default is 300 |Dynamic|Specify timespan in seconds. Max retry interval for Activation. On every continuous failure the retry interval is calculated as Min( ActivationMaxRetryInterval; Continuous Failure Count * ActivationRetryBackoffInterval). |
| ActivationMaxFailureCount |Int, default is 10 |Dynamic|This is the maximum count for which system will retry failed activation before giving up. |
| EnableServiceFabricAutomaticUpdates |Bool, default is false |Dynamic|This is to enable fabric automatic update via Windows Update. |
| EnableServiceFabricBaseUpgrade |Bool, default is false |Dynamic|This is to enable base update for server. |
| EnableRestartManagement |Bool, default is false |Dynamic|This is to enable server restart. |


### Section Name: FailoverManager
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| UserReplicaRestartWaitDuration |Time in seconds, default is 60.0 * 30 |Dynamic|Specify timespan in seconds. When a persisted replica goes down; Windows Fabric waits for this duration for the replica to come back up before creating new replacement  replicas (which would require a copy of the state). |
| QuorumLossWaitDuration |Time in seconds, default is MaxValue |Dynamic|Specify timespan in seconds. This is the max duration for which we allow a partition to be in a state of quorum loss. If the partition is still in quorum loss after this duration; the partition is recovered from quorum loss by considering the down replicas as lost. Note that this can potentially incur data loss. |
| UserStandByReplicaKeepDuration |Time in seconds, default is 3600.0 * 24 * 7 |Dynamic|Specify timespan in seconds. When a persisted replica come back from a down state; it may have already been replaced. This timer determines how long the FM will keep the standby replica before discarding it. |
| UserMaxStandByReplicaCount |Int, default is 1 |Dynamic|The default max number of StandBy replicas that the system keeps for user services. |
| ExpectedClusterSize|int, default is 1|Dynamic|When the cluster is initially started up; the FM will wait for this many nodes to report themselves up before it begins placing other services; including the system services like naming.  Increasing this value increases the time it takes a cluster to start up; but prevents the early nodes from becoming overloaded and also the additional moves that will be necessary as more nodes come online.  This value should generally be set to some small fraction of the initial cluster size. |
|ClusterPauseThreshold|int, default is 1|Dynamic|If the number of nodes in system go below this value then placement; load balancing; and failover is stopped. |
|TargetReplicaSetSize|int, default is 7|Not Allowed|This is the target number of FM replicas that Windows Fabric will maintain.  A higher number results in higher reliability of the FM data; with a small performance tradeoff. |
|MinReplicaSetSize|int, default is 3|Not Allowed|This is the minimum replica set size for the FM.  If the number of active FM replicas drops below this value; the FM will reject changes to the cluster until at least the min number of replicas is recovered |
|ReplicaRestartWaitDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 * 30)|Not Allowed|Specify timespan in seconds. This is the ReplicaRestartWaitDuration for the FMService |
|StandByReplicaKeepDuration|Timespan, default is Common::TimeSpan::FromSeconds(3600.0 * 24 * 7)|Not Allowed|Specify timespan in seconds. This is the StandByReplicaKeepDuration for the FMService |
|PlacementConstraints|string, default is L""|Not Allowed|Any placement constraints for the failover manager replicas |
|ExpectedNodeFabricUpgradeDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 * 30)|Dynamic|Specify timespan in seconds. This is the expected duration for a node to be upgraded during Windows Fabric upgrade. |
|ExpectedReplicaUpgradeDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 * 30)|Dynamic|Specify timespan in seconds. This is the expected duration for all the replicas to be upgraded on a node during application upgrade. |
|ExpectedNodeDeactivationDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 * 30)|Dynamic|Specify timespan in seconds. This is the expected duration for a node to complete deactivation in. |
|IsSingletonReplicaMoveAllowedDuringUpgrade|bool, default is TRUE|Dynamic|If set to true; replicas with a target replica set size of 1 will be permitted to move during upgrade. |
|ReconfigurationTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(300)|Dynamic|Specify timespan in seconds. The time limit for reconfiguration; after which a warning health report will be initiated |
|BuildReplicaTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(3600)|Dynamic|Specify timespan in seconds. The time limit for building a stateful replica; after which a warning health report will be initiated |
|CreateInstanceTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(300)|Dynamic|Specify timespan in seconds. The time limit for creating a stateless instance; after which a warning health report will be initiated |
|PlacementTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(600)|Dynamic|Specify timespan in seconds. The time limit for reaching target replica count; after which a warning health report will be initiated |

### Section Name: NamingService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| TargetReplicaSetSize |Int, default is 7 |Not Allowed|The number of replica sets for each partition of the Naming Service store. Increasing the number of replica sets increases the level of reliability for the information in the Naming Service Store; decreasing the change that the information will be lost as a result of node failures; at a cost of increased load on Windows Fabric and the amount of time it takes to perform updates to the naming data.|
|MinReplicaSetSize | Int, default is 3 |Not Allowed| The minimum number of Naming Service replicas required to write into to complete an update. If there are fewer replicas than this active in the system the Reliability System denies updates to the Naming Service Store until replicas are restored. This value should never be more than the TargetReplicaSetSize. |
|ReplicaRestartWaitDuration | Time in seconds, default is (60.0 * 30)|Not Allowed| Specify timespan in seconds. When a Naming Service replica goes down; this timer starts.  When it expires the FM will begin to replace the replicas which are down (it does not yet consider them lost). |
|QuorumLossWaitDuration | Time in seconds, default is MaxValue |Not Allowed| Specify timespan in seconds. When a Naming Service gets into quorum loss; this timer starts.  When it expires the FM will consider the down replicas as lost; and attempt to recover quorum. Not that this may result in data loss. |
|StandByReplicaKeepDuration | Time in seconds, default is 3600.0 * 2 |Not Allowed| Specify timespan in seconds. When a Naming Service replica come back from a down state; it may have already been replaced.  This timer determines how long the FM will keep the standby replica before discarding it. |
|PlacementConstraints | string, default is "" |Not Allowed| Placement constraint for the Naming Service. |
|ServiceDescriptionCacheLimit | Int, default is 0 |Static| The maximum number of entries maintained in the LRU service description cache at the Naming Store Service (set to 0 for no limit). |
|RepairInterval | Time in seconds, default is 5 |Static| Specify timespan in seconds. Interval in which the naming inconsistency repair between the authority owner and name owner will start. |
|MaxNamingServiceHealthReports | Int, default is 10 |Dynamic|The maximum number of slow operations that Naming store service reports unhealthy at one time. If 0; all slow operations are sent. |
| MaxMessageSize |Int, default is 4\*1024\*1024 |Static|The maximum message size for client node communication when using naming. DOS attack alleviation; default value is 4MB. |
| MaxFileOperationTimeout |Time in seconds, default is 30 |Dynamic|Specify timespan in seconds. The maximum timeout allowed for file store service operation. Requests specifying a larger timeout will be rejected. |
| MaxOperationTimeout |Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum timeout allowed for client operations. Requests specifying a larger timeout will be rejected. |
| MaxClientConnections |Int, default is 1000 |Dynamic|The maximum allowed number of client connections per gateway. |
| ServiceNotificationTimeout |Time in seconds, default is 30 |Dynamic|Specify timespan in seconds. The timeout used when delivering service notifications to the client. |
| MaxOutstandingNotificationsPerClient |Int, default is 1000 |Dynamic|The maximum number of outstanding notifications before a client registration is forcibly closed by the gateway. |
| MaxIndexedEmptyPartitions |Int, default is 1000 |Dynamic|The maximum number of empty partitions that will remain indexed in the notification cache for synchronizing reconnecting clients. Any empty partitions above this number will be removed from the index in ascending lookup version order. Reconnecting clients can still synchronize and receive missed empty partition updates; but the synchronization protocol becomes more expensive. |
| GatewayServiceDescriptionCacheLimit |Int, default is 0 |Static|The maximum number of entries maintained in the LRU service description cache at the Naming Gateway (set to 0 for no limit). |
| PartitionCount |Int, default is 3 |Not Allowed|The number of partitions of the Naming Service store to be created. Each partition owns a single partition key that corresponds to its index; so partition keys [0; PartitionCount) exist. Increasing the number of Naming Service partitions increases the scale that the Naming Service can perform at by decreasing the average amount of data held by any backing replica set; at a cost of increased utilization of resources (since PartitionCount*ReplicaSetSize service replicas must be maintained).|

### Section Name: RunAs
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "DomainUser/NetworkService/ManagedServiceAccount/LocalSystem".|
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: RunAs_Fabric
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: RunAs_HttpGateway
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: RunAs_DCA
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: HttpGateway
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
|IsEnabled|Bool, default is false |Static| Enables/Disables the HttpGateway. HttpGateway is disabled by default. |
|ActiveListeners |Uint, default is 50 |Static| Number of reads to post to the http server queue. This controls the number of concurrent requests that can be satisfied by the HttpGateway. |
|MaxEntityBodySize |Uint, default is 4194304 |Dynamic|Gives the maximum size of the body that can be expected from an http request. Default value is 4MB. Httpgateway will fail a request if it has a body of size > this value. Minimum read chunk size is 4096 bytes. So this has to be >= 4096. |
|HttpGatewayHealthReportSendInterval |Time in seconds, default is 30 |Static|Specify timespan in seconds. The interval at which the Http Gateway sends accumulated health reports to the Health Manager. |

### Section Name: KtlLogger
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
|AutomaticMemoryConfiguration |Int, default is 1 |Dynamic|Flag that indicates if the memory settings should be automatically and dynamically configured. If zero then the memory configuration settings are used directly and do not change based on system conditions. If one then the memory settings are configured automatically and may change based on system conditions. |
|WriteBufferMemoryPoolMinimumInKB |Int, default is 8388608 |Dynamic|The number of KB to initially allocate for the write buffer memory pool. Use 0 to indicate no limit Default should be consistent with SharedLogSizeInMB below. |
|WriteBufferMemoryPoolMaximumInKB | Int, default is 0 |Dynamic|The number of KB to allow the write buffer memory pool to grow up to. Use 0 to indicate no limit. |
|MaximumDestagingWriteOutstandingInKB | Int, default is 0 |Dynamic|The number of KB to allow the shared log to advance ahead of the dedicated log. Use 0 to indicate no limit.
|SharedLogPath |string, default is "" |Static|Path and file name to location to place shared log container. Use "" for using default path under fabric data root. |
|SharedLogId |string, default is "" |Static|Unique guid for shared log container. Use "" if using default path under fabric data root. |
|SharedLogSizeInMB |Int, default is 8192 |Static|The number of MB to allocate in the shared log container. |

### Section Name: ApplicationGateway/Http
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
|IsEnabled |Bool, default is false |Static| Enables/Disables the HttpApplicationGateway. HttpApplicationGateway is disabled by default and this config needs to be set to enable it. |
|NumberOfParallelOperations | Uint, default is 5000 |Static|Number of reads to post to the http server queue. This controls the number of concurrent requests that can be satisfied by the HttpGateway. |
|DefaultHttpRequestTimeout |Time in seconds. default is 120 |Dynamic|Specify timespan in seconds.  Gives the default request timeout for the http requests being processed in the http app gateway. |
|ResolveServiceBackoffInterval |Time in seconds, default is 5 |Dynamic|Specify timespan in seconds.  Gives the default back-off interval before retrying a failed resolve service operation. |
|BodyChunkSize |Uint, default is 16384 |Dynamic| Gives the size of for the chunk in bytes used to read the body. |
|GatewayAuthCredentialType |string, default is "None" |Static| Indicates the type of security credentials to use at the http app gateway endpoint Valid values are "None/X509. |
|GatewayX509CertificateStoreName |string, default is "My" |Dynamic| Name of X.509 certificate store that contains certificate for http app gateway. |
|GatewayX509CertificateFindType |string, default is "FindByThumbprint" |Dynamic| Indicates how to search for certificate in the store specified by GatewayX509CertificateStoreName Supported value: FindByThumbprint; FindBySubjectName. |
|GatewayX509CertificateFindValue | string, default is "" |Dynamic| Search filter value used to locate the http app gateway certificate. This certificate is configured on the https endpoint and can also be used to verify the identity of the app if needed by the services. FindValue is looked up first; and if that does not exist; FindValueSecondary is looked up. |
|GatewayX509CertificateFindValueSecondary | string, default is "" |Dynamic|Search filter value used to locate the http app gateway certificate. This certificate is configured on the https endpoint and can also be used to verify the identity of the app if needed by the services. FindValue is looked up first; and if that does not exist; FindValueSecondary is looked up.|
|HttpRequestConnectTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(5)|Dynamic|Specify timespan in seconds.  Gives the connect timeout for the http requests being sent from the http app gateway.  |
|RemoveServiceResponseHeaders|string, default is L"Date; Server"|Static|Semi colon/ comma-separated list of response headers that will be removed from the service response; before forwarding it to the client. If this is set to empty string; pass all the headers returned by the service as-is. i.e do not overwrite the Date and Server |
|ApplicationCertificateValidationPolicy|string, default is L"None"|Static| ApplicationCertificateValidationPolicy: None: Do not validate server certificate; succeed the request. ServiceCertificateThumbprints: Refer to config ServiceCertificateThumbprints for the comma-separated list of thumbprints of the remote certs that the reverse proxy can trust. ServiceCommonNameAndIssuer:  Refer to config ServiceCommonNameAndIssuer for the subject name and issuer thumbprint of the remote certs that the reverse proxy can trust. |
|ServiceCertificateThumbprints|string, default is L""|Dynamic| |
|CrlCheckingFlag|uint, default is 0x40000000 |Dynamic| Flags for application/service certificate chain validation; e.g. CRL checking 0x10000000 CERT_CHAIN_REVOCATION_CHECK_END_CERT 0x20000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN 0x40000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN_EXCLUDE_ROOT 0x80000000 CERT_CHAIN_REVOCATION_CHECK_CACHE_ONLY Setting to 0 disables CRL checking Full list of supported values is documented by dwFlags of CertGetCertificateChain: http://msdn.microsoft.com/library/windows/desktop/aa376078(v=vs.85).aspx  |
|IgnoreCrlOfflineError|bool, default is TRUE|Dynamic|Whether to ignore CRL offline error for application/service certificate verification. |
|SecureOnlyMode|bool, default is FALSE|Dynamic| SecureOnlyMode: true: Reverse Proxy will only forward to services that publish secure endpoints. false: Reverse Proxy can forward requests to secure/non-secure endpoints.  |
|ForwardClientCertificate|bool, default is FALSE|Dynamic| |

### Section Name: ApplicationGateway/Http/ServiceCommonNameAndIssuer
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|X509NameMap, default is None|Dynamic|  |

### Section Name: Management
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| ImageStoreConnectionString |SecureString |Static|Connection string to the Root for ImageStore. |
| ImageStoreMinimumTransferBPS | Int, default is 1024 |Dynamic|The minimum transfer rate between the cluster and ImageStore. This value is used to determine the timeout when accessing the external ImageStore. Change this value only if the latency between the cluster and ImageStore is high to allow more time for the cluster to download from the external ImageStore. |
|AzureStorageMaxWorkerThreads | Int, default is 25 |Dynamic|The maximum number of worker threads in parallel. |
|AzureStorageMaxConnections | Int, default is 5000 |Dynamic|The maximum number of concurrent connections to azure storage. |
|AzureStorageOperationTimeout | Time in seconds, default is 6000 |Dynamic|Specify timespan in seconds. Time out for xstore operation to complete. |
|ImageCachingEnabled | Bool, default is true |Static|This configuration allows us to enable or disable caching. |
|DisableChecksumValidation | Bool, default is false |Static| This configuration allows us to enable or disable checksum validation during application provisioning. |
|DisableServerSideCopy | Bool, default is false |Static|This configuration enables or disables server-side copy of application package on the ImageStore during application provisioning. |

### Section Name: HealthManager/ClusterHealthPolicy
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| ConsiderWarningAsError |Bool, default is false |Static|Cluster health evaluation policy: warnings are treated as errors. |
| MaxPercentUnhealthyNodes | Int, default is 0 |Static|Cluster health evaluation policy: maximum percent of unhealthy nodes allowed for the cluster to be healthy. |
| MaxPercentUnhealthyApplications | Int, default is 0 |Static|Cluster health evaluation policy: maximum percent of unhealthy applications allowed for the cluster to be healthy. |

### Section Name: HealthManager/ClusterUpgradeHealthPolicy
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
|MaxPercentDeltaUnhealthyNodes|int, default is 10|Static|Cluster upgrade health evaluation policy: maximum percent of delta unhealthy nodes allowed for the cluster to be healthy |
|MaxPercentUpgradeDomainDeltaUnhealthyNodes|int, default is 15|Static|Cluster upgrade health evaluation policy: maximum percent of delta of unhealthy nodes in an upgrade domain allowed for the cluster to be healthy |

### Section Name: FaultAnalysisService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| TargetReplicaSetSize |Int, default is 0 |Not Allowed|NOT_PLATFORM_UNIX_START The TargetReplicaSetSize for FaultAnalysisService. |
| MinReplicaSetSize |Int, default is 0 |Not Allowed|The MinReplicaSetSize for FaultAnalysisService. |
| ReplicaRestartWaitDuration |Time in seconds, default is 60 minutes|Static|Specify timespan in seconds. The ReplicaRestartWaitDuration for FaultAnalysisService. |
| QuorumLossWaitDuration | Time in seconds, default is MaxValue |Static|Specify timespan in seconds. The QuorumLossWaitDuration for FaultAnalysisService. |
| StandByReplicaKeepDuration| Time in seconds, default is (60*24*7) minutes |Static|Specify timespan in seconds. The StandByReplicaKeepDuration for FaultAnalysisService. |
| PlacementConstraints | string, default is ""|Static| The PlacementConstraints for FaultAnalysisService. |
| StoredActionCleanupIntervalInSeconds | Int, default is 3600 |Static|This is how often the store will be cleaned up.  Only actions in a terminal state; and that completed at least CompletedActionKeepDurationInSeconds ago will be removed. |
| CompletedActionKeepDurationInSeconds | Int, default is 604800 |Static| This is approximately how long to keep actions that are in a terminal state.  This also depends on StoredActionCleanupIntervalInSeconds; since the work to cleanup is only done on that interval. 604800 is 7 days. |
| StoredChaosEventCleanupIntervalInSeconds | Int, default is 3600 |Static|This is how often the store will be audited for cleanup; if the number of events is more than 30000; the cleanup will kick in. |
|DataLossCheckWaitDurationInSeconds|int, default is 25|Static|The total amount of time; in seconds; that the system will wait for data loss to happen.  This is internally used when the StartPartitionDataLossAsync() api is called. |
|DataLossCheckPollIntervalInSeconds|int, default is 5|Static|This is the time between the checks the system performs  while waiting for data loss to happen.  The number of times the data loss number will be checked per internal iteration is DataLossCheckWaitDurationInSeconds/this. |
|ReplicaDropWaitDurationInSeconds|int, default is 600|Static|This parameter is used when the data loss api is called.  It controls how long the system will wait for a replica to get dropped after remove replica is internally invoked on it. |

### Section Name: FileStoreService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| NamingOperationTimeout |Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The timeout for performing naming operation. |
| QueryOperationTimeout | Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The timeout for performing query operation. |
| MaxCopyOperationThreads | Uint, default is 0 |Dynamic| The maximum number of parallel files that secondary can copy from primary. '0' == number of cores. |
| MaxFileOperationThreads | Uint, default is 100 |Static| The maximum number of parallel threads allowed to perform FileOperations (Copy/Move) in the primary. '0' == number of cores. |
| MaxStoreOperations | Uint, default is 4096 |Static|The maximum number of parallel store transaction operations allowed on primary. '0' == number of cores. |
| MaxRequestProcessingThreads | Uint, default is 200 |Static|The maximum number of parallel threads allowed to process requests in the primary. '0' == number of cores. |
| MaxSecondaryFileCopyFailureThreshold | Uint, default is 25|Dynamic|The maximum number of file copy retries on the secondary before giving up. |
| AnonymousAccessEnabled | Bool, default is true |Static|Enable/Disable anonymous access to the FileStoreService shares. |
| PrimaryAccountType | string, default is "" |Static|The primary AccountType of the principal to ACL the FileStoreService shares. |
| PrimaryAccountUserName | string, default is "" |Static|The primary account Username of the principal to ACL the FileStoreService shares. |
| PrimaryAccountUserPassword | SecureString, default is empty |Static|The primary account password of the principal to ACL the FileStoreService shares. |
| PrimaryAccountNTLMPasswordSecret | SecureString, default is empty |Static| The password secret which used as seed to generated same password when using NTLM authentication. |
| PrimaryAccountNTLMX509StoreLocation | string, default is "LocalMachine"|Static| The store location of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| PrimaryAccountNTLMX509StoreName | string, default is "MY"|Static| The store name of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| PrimaryAccountNTLMX509Thumbprint | string, default is ""|Static|The thumbprint of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| SecondaryAccountType | string, default is ""|Static| The secondary AccountType of the principal to ACL the FileStoreService shares. |
| SecondaryAccountUserName | string, default is ""| Static|The secondary account Username of the principal to ACL the FileStoreService shares. |
| SecondaryAccountUserPassword | SecureString, default is empty |Static|The secondary account password of the principal to ACL the FileStoreService shares.  |
| SecondaryAccountNTLMPasswordSecret | SecureString, default is empty |Static| The password secret which used as seed to generated same password when using NTLM authentication. |
| SecondaryAccountNTLMX509StoreLocation | string, default is "LocalMachine" |Static|The store location of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| SecondaryAccountNTLMX509StoreName | string, default is "MY" |Static|The store name of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| SecondaryAccountNTLMX509Thumbprint | string, default is ""| Static|The thumbprint of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret  when using NTLM authentication. |
|CommonNameNtlmPasswordSecret|SecureString, default is Common::SecureString(L"")| Static|The password secret which used as seed to generated same password when using NTLM authentication |
|CommonName1Ntlmx509StoreLocation|string, default is L"LocalMachine"|Static|The store location of the X509 certificate used to generate HMAC on the CommonName1NtlmPasswordSecret  when using NTLM authentication |
|CommonName1Ntlmx509StoreName|string, default is L"MY"| Static|The store name of the X509 certificate used to generate HMAC on the CommonName1NtlmPasswordSecret  when using NTLM authentication |
|CommonName1Ntlmx509CommonName|string, default is L""|Static| The common name of the X509 certificate used to generate HMAC on the CommonName1NtlmPasswordSecret  when using NTLM authentication |
|CommonName2Ntlmx509StoreLocation|string, default is L"LocalMachine"| Static|The store location of the X509 certificate used to generate HMAC on the CommonName2NtlmPasswordSecret  when using NTLM authentication |
|CommonName2Ntlmx509StoreName|string, default is L"MY"|Static| The store name of the X509 certificate used to generate HMAC on the CommonName2NtlmPasswordSecret  when using NTLM authentication |
|CommonName2Ntlmx509CommonName|string, default is L""|Static|The common name of the X509 certificate used to generate HMAC on the CommonName2NtlmPasswordSecret  when using NTLM authentication |

### Section Name: ImageStoreService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| Enabled |Bool, default is false |Static|The Enabled flag for ImageStoreService. Default: false |
| TargetReplicaSetSize | Int, default is 7 |Not Allowed|The TargetReplicaSetSize for ImageStoreService. |
| MinReplicaSetSize | Int, default is 3 |Not Allowed|The MinReplicaSetSize for ImageStoreService. |
| ReplicaRestartWaitDuration | Time in seconds, default is 60.0 * 30 |Static|Specify timespan in seconds. The ReplicaRestartWaitDuration for ImageStoreService. |
| QuorumLossWaitDuration | Time in seconds, default is MaxValue |Static| Specify timespan in seconds. The QuorumLossWaitDuration for ImageStoreService. |
| StandByReplicaKeepDuration | Time in seconds, default is 3600.0 * 2 |Static| Specify timespan in seconds. The StandByReplicaKeepDuration for ImageStoreService. |
| PlacementConstraints | string, default is "" |Static| The PlacementConstraints for ImageStoreService. |

### Section Name: ImageStoreClient
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| ClientUploadTimeout |Time in seconds, default is 1800 |Dynamic|Specify timespan in seconds. Time out value for top-level upload request to Image Store Service. |
| ClientCopyTimeout | Time in seconds, default is 1800 |Dynamic| Specify timespan in seconds. Time out value for top-level copy request to Image Store Service. |
|ClientDownloadTimeout | Time in seconds, default is 1800 |Dynamic| Specify timespan in seconds. Time out value for top-level download request to Image Store Service. |
|ClientListTimeout | Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. Time out value for top-level list request to Image Store Service. |
|ClientDefaultTimeout | Time in seconds, default is 180 |Dynamic| Specify timespan in seconds. Time out value for all non-upload/non-download requests (e.g. exists; delete) to Image Store Service. |

### Section Name: TokenValidationService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| Providers |string, default is "DSTS" |Static|Comma separated list of token validation providers to enable (valid providers are: DSTS; AAD). Currently only a single provider can be enabled at any time. |

### Section Name: UpgradeOrchestrationService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| TargetReplicaSetSize |Int, default is 0 |Not Allowed|The TargetReplicaSetSize for UpgradeOrchestrationService. |
| MinReplicaSetSize |Int, default is 0 |Not Allowed|The MinReplicaSetSize for UpgradeOrchestrationService.
| ReplicaRestartWaitDuration | Time in seconds, default is 60 minutes|Static| Specify timespan in seconds. The ReplicaRestartWaitDuration for UpgradeOrchestrationService. |
| QuorumLossWaitDuration | Time in seconds, default is MaxValue |Static| Specify timespan in seconds. The QuorumLossWaitDuration for UpgradeOrchestrationService. |
| StandByReplicaKeepDuration | Time in seconds, default is 60*24*7 minutes |Static| Specify timespan in seconds. The StandByReplicaKeepDuration for UpgradeOrchestrationService. |
| PlacementConstraints | string, default is "" |Static| The PlacementConstraints for UpgradeOrchestrationService. |
| AutoupgradeEnabled | Bool, default is true |Static| Automatic polling and upgrade action based on a goal-state file. |
| UpgradeApprovalRequired | Bool, default is false | Static|Setting to make code upgrade require administrator approval before proceeding. |

### Section Name: UpgradeService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| PlacementConstraints |string, default is "" |Not Allowed|The PlacementConstraints for Upgrade service. |
| TargetReplicaSetSize | Int, default is 3 |Not Allowed| The TargetReplicaSetSize for UpgradeService. |
| MinReplicaSetSize | Int, default is 2 |Not Allowed| The MinReplicaSetSize for UpgradeService. |
| CoordinatorType | string, default is "WUTest"|Not Allowed|The CoordinatorType for UpgradeService. |
| BaseUrl | string, default is "" |Static|BaseUrl for UpgradeService. |
| ClusterId | string, default is "" |Static|ClusterId for UpgradeService. |
| X509StoreName | string, default is "My"|Dynamic|X509StoreName for UpgradeService. |
| X509StoreLocation | string, default is "" |Dynamic| X509StoreLocation for UpgradeService. |
| X509FindType | string, default is ""|Dynamic| X509FindType for UpgradeService. |
| X509FindValue | string, default is "" |Dynamic| X509FindValue for UpgradeService. |
| X509SecondaryFindValue | string, default is "" |Dynamic| X509SecondaryFindValue for UpgradeService. |
| OnlyBaseUpgrade | Bool, default is false |Dynamic|OnlyBaseUpgrade for UpgradeService. |
| TestCabFolder | string, default is "" |Static| TestCabFolder for UpgradeService. |

### Section Name: Security
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|ClusterCredentialType|string, default is L"None"|Not Allowed|Indicates the type of security credentials to use in order to secure the cluster. Valid values are "None/X509/Windows" |
|ServerAuthCredentialType|string, default is L"None"|Static|Indicates the type of security credentials to use in order to secure the communication between FabricClient and the Cluster. Valid values are "None/X509/Windows" |
|ClientRoleEnabled|bool, default is FALSE|Static|Indicates if client role is enabled; when set to true; clients are assigned roles based on their identities. For V2; enabling this means client not in AdminClientCommonNames/AdminClientIdentities can only execute read-only operations. |
|ClusterCertThumbprints|string, default is L""|Dynamic|Thumbprints of certificates allowed to join the cluster; a comma-separated name list. |
|ServerCertThumbprints|string, default is L""|Dynamic|Thumbprints of server certificates used by cluster to talk to clients; clients use this to authenticate the cluster. It is a comma-separated name list. |
|ClientCertThumbprints|string, default is L""|Dynamic|Thumbprints of certificates used by clients to talk to the cluster; cluster uses this authorize incoming connection. It is a comma-separated name list. |
|AdminClientCertThumbprints|string, default is L""|Dynamic|Thumbprints of certificates used by clients in admin role. It is a comma-separated name list. |
|CrlCheckingFlag|uint, default is 0x40000000|Dynamic|Default certificate chain validation flag; may be overridden by component-specific flag; e.g. Federation/X509CertChainFlags 0x10000000 CERT_CHAIN_REVOCATION_CHECK_END_CERT 0x20000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN 0x40000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN_EXCLUDE_ROOT 0x80000000 CERT_CHAIN_REVOCATION_CHECK_CACHE_ONLY Setting to 0 disables CRL checking Full list of supported values is documented by dwFlags of CertGetCertificateChain: http://msdn.microsoft.com/library/windows/desktop/aa376078(v=vs.85).aspx |
|IgnoreCrlOfflineError|bool, default is FALSE|Dynamic|Whether to ignore CRL offline error when server-side verifies incoming client certificates |
|IgnoreSvrCrlOfflineError|bool, default is TRUE|Dynamic|Whether to ignore CRL offline error when client side verifies incoming server certificates; default to true. Attacks with revoked server certificates require compromising DNS; harder than with revoked client certificates. |
|CrlDisablePeriod|TimeSpan, default is Common::TimeSpan::FromMinutes(15)|Dynamic|Specify timespan in seconds. How long CRL checking is disabled for a given certificate after encountering offline error; if CRL offline error can be ignored. |
|CrlOfflineHealthReportTtl|TimeSpan, default is Common::TimeSpan::FromMinutes(1440)|Dynamic|Specify timespan in seconds. |
|CertificateHealthReportingInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(3600 * 8)|Static|Specify timespan in seconds. Specify interval for certificate health reporting; default to 8 hours; setting to 0 disables certificate health reporting |
|CertificateExpirySafetyMargin|TimeSpan, default is Common::TimeSpan::FromMinutes(43200)|Static|Specify timespan in seconds. Safety margin for certificate expiration; certificate health report status changes from OK to Warning when expiration is closer than this. Default is 30 days. |
|ClientClaimAuthEnabled|bool, default is FALSE|Static|Indicates if claim-based authentication is enabled on clients; setting this true implicitly sets ClientRoleEnabled. |
|ClientClaims|string, default is L""|Dynamic|All possible claims expected from clients for connecting to gateway. This is a 'OR' list: ClaimsEntry || ClaimsEntry || ClaimsEntry ... each ClaimsEntry is a "AND" list: ClaimType=ClaimValue && ClaimType=ClaimValue && ClaimType=ClaimValue ... |
|AdminClientClaims|string, default is L""|Dynamic|All possible claims expected from admin clients; the same format as ClientClaims; this list internally gets added to ClientClaims; so no need to also add the same entries to ClientClaims. |
|ClusterSpn|string, default is L""|Not Allowed|Service principal name of the cluster; when fabric runs as a single domain user (gMSA/domain user account). It is the SPN of lease listeners and listeners in fabric.exe: federation listeners; internal replication listeners; runtime service listener and naming gateway listener. This should be left empty when fabric runs as machine accounts; in which case connecting side compute listener SPN from listener transport address. |
|ClusterIdentities|string, default is L""|Dynamic|Windows identities of cluster nodes; used for cluster membership authorization. It is a comma-separated list; each entry is a domain account name or group name |
|ClientIdentities|string, default is L""|Dynamic|Windows identities of FabricClient; naming gateway uses this to authorize incoming connections. It is a comma-separated list; each entry is a domain account name or group name. For convenience; the account that runs fabric.exe is automatically allowed; so are group ServiceFabricAllowedUsers and ServiceFabricAdministrators. |
|AdminClientIdentities|string, default is L""|Dynamic|Windows identities of fabric clients in admin role; used to authorize privileged fabric operations. It is a comma-separated list; each entry is a domain account name or group name. For convenience; the account that runs fabric.exe is automatically assigned admin role; so is group ServiceFabricAdministrators. |
|AADTenantId|string, default is L""|Static|Tenant ID (GUID) |
|AADClusterApplication|string, default is L""|Static|Web API application name or ID representing the cluster |
|AADClientApplication|string, default is L""|Static|Native Client application name or ID representing Fabric Clients |
|X509Folder|string, default is /var/lib/waagent|Static|Folder where X509 certificates and private keys are located |
|FabricHostSpn| string, default is L"" |Static| Service principal name of FabricHost; when fabric runs as a single domain user (gMSA/domain user account) and FabricHost runs under machine account. It is the SPN of IPC listener for FabricHost; which by default should be left empty since FabricHost runs under machine account |
|DisableFirewallRuleForPublicProfile| bool, default is TRUE | Static|Indicates if firewall rule should not be enabled for public profile |
|DisableFirewallRuleForPrivateProfile| bool, default is TRUE |Static| Indicates if firewall rule should not be enabled for private profile | 
|DisableFirewallRuleForDomainProfile| bool, default is TRUE |Static| Indicates if firewall rule should not be enabled for domain profile |
|SettingsX509StoreName| string, default is L"MY"| Dynamic|X509 certificate store used by fabric for configuration protection |

### Section Name: Security/AdminClientX509Names
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|X509NameMap, default is None|Dynamic| |

### Section Name: Security/ClientX509Names
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
PropertyGroup|X509NameMap, default is None|Dynamic| |

### Section Name: Security/ClusterX509Names
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
PropertyGroup|X509NameMap, default is None|Dynamic| |

### Section Name: Security/ServerX509Names
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
PropertyGroup|X509NameMap, default is None|Dynamic| |

### Section Name: Security/ClientAccess
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| CreateName |string, default is "Admin" |Dynamic|Security configuration for Naming URI creation. |
| DeleteName |string, default is "Admin" |Dynamic|Security configuration for Naming URI deletion. |
| PropertyWriteBatch |string, default is "Admin" |Dynamic|Security configurations for Naming property write operations. |
| CreateService |string, default is "Admin" |Dynamic| Security configuration for service creation. |
| CreateServiceFromTemplate |string, default is "Admin" |Dynamic|Security configuration for service creation from template. |
| UpdateService |string, default is "Admin" |Dynamic|Security configuration for service updates. |
| DeleteService  |string, default is "Admin" |Dynamic|Security configuration for service deletion. |
| ProvisionApplicationType |string, default is "Admin" |Dynamic| Security configuration for application type provisioning. |
| CreateApplication |string, default is "Admin" | Dynamic|Security configuration for application creation. |
| DeleteApplication |string, default is "Admin" |Dynamic| Security configuration for application deletion. |
| UpgradeApplication |string, default is "Admin" |Dynamic| Security configuration for starting or interrupting application upgrades. |
| RollbackApplicationUpgrade |string, default is "Admin" |Dynamic| Security configuration for rolling back application upgrades. |
| UnprovisionApplicationType |string, default is "Admin" |Dynamic| Security configuration for application type unprovisioning. |
| MoveNextUpgradeDomain |string, default is "Admin" |Dynamic| Security configuration for resuming application upgrades with an explicit Upgrade Domain. |
| ReportUpgradeHealth |string, default is "Admin" |Dynamic| Security configuration for resuming application upgrades with the current upgrade progress. |
| ReportHealth |string, default is "Admin" |Dynamic| Security configuration for reporting health. |
| ProvisionFabric |string, default is "Admin" |Dynamic| Security configuration for MSI and/or Cluster Manifest provisioning. |
| UpgradeFabric |string, default is "Admin" |Dynamic| Security configuration for starting cluster upgrades. |
| RollbackFabricUpgrade |string, default is "Admin" |Dynamic| Security configuration for rolling back cluster upgrades. |
| UnprovisionFabric |string, default is "Admin" |Dynamic| Security configuration for MSI and/or Cluster Manifest unprovisioning. |
| MoveNextFabricUpgradeDomain |string, default is "Admin" |Dynamic| Security configuration for resuming cluster upgrades with an explicity Upgrade Domain. |
| ReportFabricUpgradeHealth |string, default is "Admin" |Dynamic| Security configuration for resuming cluster upgrades with the current upgrade progress. |
| StartInfrastructureTask |string, default is "Admin" | Dynamic|Security configuration for starting infrastructure tasks. |
| FinishInfrastructureTask |string, default is "Admin" |Dynamic| Security configuration for finishing infrastructure tasks. |
| ActivateNode |string, default is "Admin" |Dynamic| Security configuration for activation a node. |
| DeactivateNode |string, default is "Admin" |Dynamic| Security configuration for deactivating a node. |
| DeactivateNodesBatch |string, default is "Admin" |Dynamic| Security configuration for deactivating multiple nodes. |
| RemoveNodeDeactivations |string, default is "Admin" |Dynamic| Security configuration for reverting deactivation on multiple nodes. |
| GetNodeDeactivationStatus |string, default is "Admin" |Dynamic| Security configuration for checking deactivation status. |
| NodeStateRemoved |string, default is "Admin" |Dynamic| Security configuration for reporting node state removed. |
| RecoverPartition |string, default is "Admin" | Dynamic|Security configuration for recovering a partition. |
| RecoverPartitions |string, default is "Admin" | Dynamic|Security configuration for recovering partitions. |
| RecoverServicePartitions |string, default is "Admin" |Dynamic| Security configuration for recovering service partitions. |
| RecoverSystemPartitions |string, default is "Admin" |Dynamic| Security configuration for recovering system service partitions. |
| ReportFault |string, default is "Admin" |Dynamic| Security configuration for reporting fault. |
| InvokeInfrastructureCommand |string, default is "Admin" |Dynamic| Security configuration for infrastructure task management commands. |
| FileContent |string, default is "Admin" |Dynamic| Security configuration for image store client file transfer (external to cluster). |
| FileDownload |string, default is "Admin" |Dynamic| Security configuration for image store client file download initiation (external to cluster). |
| InternalList |string, default is "Admin" | Dynamic|Security configuration for image store client file list operation (internal). |
| Delete |string, default is "Admin" |Dynamic| Security configurations for image store client delete operation. |
| Upload |string, default is "Admin" | Dynamic|Security configuration for image store client upload operation. |
| GetStagingLocation |string, default is "Admin" |Dynamic| Security configuration for image store client staging location retrieval. |
| GetStoreLocation |string, default is "Admin" |Dynamic| Security configuration for image store client store location retrieval. |
| NodeControl |string, default is "Admin" |Dynamic| Security configuration for starting; stopping; and restarting nodes. |
| CodePackageControl |string, default is "Admin" |Dynamic| Security configuration for restarting code packages. |
| UnreliableTransportControl |string, default is "Admin" |Dynamic| Unreliable Transport for adding and removing behaviors. |
| MoveReplicaControl |string, default is "Admin" | Dynamic|Move replica. |
| PredeployPackageToNode |string, default is "Admin" |Dynamic| Predeployment api. |
| StartPartitionDataLoss |string, default is "Admin" |Dynamic| Induces data loss on a partition. |
| StartPartitionQuorumLoss |string, default is "Admin" |Dynamic| Induces quorum loss on a partition. |
| StartPartitionRestart |string, default is "Admin" |Dynamic| Simultaneously restarts some or all the replicas of a partition. |
| CancelTestCommand |string, default is "Admin" |Dynamic| Cancels a specific TestCommand - if it is in flight. |
| StartChaos |string, default is "Admin" |Dynamic| Starts Chaos - if it is not already started. |
| StopChaos |string, default is "Admin" |Dynamic| Stops Chaos - if it has been started. |
| StartNodeTransition |string, default is "Admin" |Dynamic| Security configuration for starting a node transition. |
| StartClusterConfigurationUpgrade |string, default is "Admin" |Dynamic| Induces StartClusterConfigurationUpgrade on a partition. |
| GetUpgradesPendingApproval |string, default is "Admin" |Dynamic| Induces GetUpgradesPendingApproval on a partition. |
| StartApprovedUpgrades |string, default is "Admin" |Dynamic| Induces StartApprovedUpgrades on a partition. |
| Ping |string, default is "Admin\|\|User" |Dynamic| Security configuration for client pings. |
| Query |string, default is "Admin\|\|User" |Dynamic| Security configuration for queries. |
| NameExists |string, default is "Admin\|\|User" | Dynamic|Security configuration for Naming URI existence checks. |
| EnumerateSubnames |string, default is "Admin\|\|User" |Dynamic| Security configuration for Naming URI enumeration. |
| EnumerateProperties |string, default is "Admin\|\|User" | Dynamic|Security configuration for Naming property enumeration. |
| PropertyReadBatch |string, default is "Admin\|\|User" |Dynamic| Security configuration for Naming property read operations. |
| GetServiceDescription |string, default is "Admin\|\|User" |Dynamic| Security configuration for long-poll service notifications and reading service descriptions. |
| ResolveService |string, default is "Admin\|\|User" |Dynamic| Security configuration for complaint-based service resolution. |
| ResolveNameOwner |string, default is "Admin\|\|User" | Dynamic|Security configuration for resolving Naming URI owner. |
| ResolvePartition |string, default is "Admin\|\|User" | Dynamic|Security configuration for resolving system services. |
| ServiceNotifications |string, default is "Admin\|\|User" |Dynamic| Security configuration for event-based service notifications. |
| PrefixResolveService |string, default is "Admin\|\|User" |Dynamic| Security configuration for complaint-based service prefix resolution. |
| GetUpgradeStatus |string, default is "Admin\|\|User" |Dynamic| Security configuration for polling application upgrade status. |
| GetFabricUpgradeStatus |string, default is "Admin\|\|User" |Dynamic| Security configuration for polling cluster upgrade status. |
| InvokeInfrastructureQuery |string, default is "Admin\|\|User" | Dynamic|Security configuration for querying infrastructure tasks. |
| List |string, default is "Admin\|\|User" | Dynamic|Security configuration for image store client file list operation. |
| ResetPartitionLoad |string, default is "Admin\|\|User" |Dynamic| Security configuration for reset load for a failoverUnit. |
| ToggleVerboseServicePlacementHealthReporting | string, default is "Admin\|\|User" |Dynamic| Security configuration for Toggling Verbose ServicePlacement HealthReporting. |
| GetPartitionDataLossProgress | string, default is "Admin\|\|User" | Dynamic|Fetches the progress for an invoke data loss api call. |
| GetPartitionQuorumLossProgress | string, default is "Admin\|\|User" |Dynamic| Fetches the progress for an invoke quorum loss api call. |
| GetPartitionRestartProgress | string, default is "Admin\|\|User" |Dynamic| Fetches the progress for a restart partition api call. |
| GetChaosReport | string, default is "Admin\|\|User" |Dynamic| Fetches the status of Chaos within a given time range. |
| GetNodeTransitionProgress | string, default is "Admin\|\|User" |Dynamic| Security configuration for getting progress on a node transition command. |
| GetClusterConfigurationUpgradeStatus | string, default is "Admin\|\|User" |Dynamic| Induces GetClusterConfigurationUpgradeStatus on a partition. |
| GetClusterConfiguration | string, default is "Admin\|\|User" | Dynamic|Induces GetClusterConfiguration on a partition. |
|CreateComposeDeployment|string, default is L"Admin"| Dynamic|Creates a compose deployment described by compose files |
|DeleteComposeDeployment|string, default is L"Admin"| Dynamic|Deletes the compose deployment |
|UpgradeComposeDeployment|string, default is L"Admin"| Dynamic|Upgrades the compose deployment |
|ResolveSystemService|string, default is L"Admin\|\|User"|Dynamic| Security configuration for resolving system services |
|GetUpgradeOrchestrationServiceState|string, default is L"Admin"| Dynamic|Induces GetUpgradeOrchestrationServiceState on a partition |
|SetUpgradeOrchestrationServiceState|string, default is L"Admin"| Dynamic|Induces SetUpgradeOrchestrationServiceState on a partition |

### Section Name: ReconfigurationAgent
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| ApplicationUpgradeMaxReplicaCloseDuration | Time in seconds, default is 900 |Dynamic|Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close during Application Upgrade.|
| ServiceApiHealthDuration | Time in seconds, default is 30 minutes |Dynamic| Specify timespan in seconds. ServiceApiHealthDuration defines how long do we wait for a service API to run before we report it unhealthy. |
| ServiceReconfigurationApiHealthDuration | Time in seconds, default is 30 |Dynamic| Specify timespan in seconds. ServiceReconfigurationApiHealthDuration defines how long do we wait for a service API to run before we report unhealthy. This applies to API calls that impact availability.|
| PeriodicApiSlowTraceInterval | Time in seconds, default is 5 minutes |Dynamic| Specify timespan in seconds. PeriodicApiSlowTraceInterval defines the interval over which slow API calls will be retraced by the API monitor. |
| NodeDeactivationMaxReplicaCloseDuration | Time in seconds, default is 900 |Dynamic|Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close during node deactivation. |
| FabricUpgradeMaxReplicaCloseDuration | Time in seconds, default is 900 |Dynamic| Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close during fabric upgrade. |
|GracefulReplicaShutdownMaxDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic|Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close. If this value is set to 0, replicas will not be instructed to close.|
|ReplicaChangeRoleFailureRestartThreshold|int, default is 10|Dynamic| Integer. Specify the number of API failures during primary promotion after which auto-mitigation action (replica restart) will be applied. |
|ReplicaChangeRoleFailureWarningReportThreshold|int, default is 2147483647|Dynamic| Integer. Specify the number of API failures during primary promotion after which warning health report will be raised.|

### Section Name: PlacementAndLoadBalancing
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| TraceCRMReasons |Bool, default is true |Dynamic|Specifies whether to trace reasons for CRM issued movements to the operational events channel. |
| ValidatePlacementConstraint | Bool, default is true |Dynamic| Specifies whether or not the PlacementConstraint expression for a service is validated when a service's ServiceDescription is updated. |
| PlacementConstraintValidationCacheSize | Int, default is 10000 |Dynamic| Limits the size of the table used for quick validation and caching of Placement Constraint Expressions. |
|VerboseHealthReportLimit | Int, default is 20 | Dynamic|Defines the number of times a replica has to go unplaced before a health warning is reported for it (if verbose health reporting is enabled). |
|ConstraintViolationHealthReportLimit | Int, default is 50 |Dynamic| Defines the number of times constraint violating replica has to be persistently unfixed before diagnostics are conducted and health reports are emitted. |
|DetailedConstraintViolationHealthReportLimit | Int, default is 200 |Dynamic| Defines the number of times constraint violating replica has to be persistently unfixed before diagnostics are conducted and detailed health reports are emitted. |
|DetailedVerboseHealthReportLimit | Int, default is 200 | Dynamic|Defines the number of times an unplaced replica has to be persistently unplaced before detailed health reports are emitted. |
|ConsecutiveDroppedMovementsHealthReportLimit | Int, default is 20 | Dynamic|Defines the number of consecutive times that ResourceBalancer-issued Movements are dropped before diagnostics are conducted and health warnings are emitted. Negative: No Warnings Emitted under this condition. |
|DetailedNodeListLimit | Int, default is 15 |Dynamic| Defines the number of nodes per constraint to include before truncation in the Unplaced Replica reports. |
|DetailedPartitionListLimit | Int, default is 15 |Dynamic| Defines the number of partitions per diagnostic entry for a constraint to include before truncation in  Diagnostics. |
|DetailedDiagnosticsInfoListLimit | Int, default is 15 |Dynamic| Defines the number of diagnostic entries (with detailed information) per constraint to include before truncation in  Diagnostics.|
|PLBRefreshGap | Time in seconds, default is 1 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before PLB refreshes state again. |
|MinPlacementInterval | Time in seconds, default is 1 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive placement rounds. |
|MinConstraintCheckInterval | Time in seconds, default is 1 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive constraint check rounds. |
|MinLoadBalancingInterval | Time in seconds, default is 5 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive balancing rounds. |
|BalancingDelayAfterNodeDown | Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. Do not start balancing activities within this period after a node down event. |
|BalancingDelayAfterNewNode | Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. Do not start balancing activities within this period after adding a new node. |
|ConstraintFixPartialDelayAfterNodeDown | Time in seconds, default is 120 |Dynamic| Specify timespan in seconds. Do not Fix FaultDomain and UpgradeDomain constraint violations within this period after a node down event. |
|ConstraintFixPartialDelayAfterNewNode | Time in seconds, default is 120 |Dynamic| Specify timespan in seconds. DDo not Fix FaultDomain and UpgradeDomain constraint violations within this period after adding a new node. |
|GlobalMovementThrottleThreshold | Uint, default is 1000 |Dynamic| Maximum number of movements allowed in the Balancing Phase in the past interval indicated by GlobalMovementThrottleCountingInterval. |
|GlobalMovementThrottleThresholdForPlacement | Uint, default is 0 |Dynamic| Maximum number of movements allowed in Placement Phase in the past interval indicated by GlobalMovementThrottleCountingInterval.0 indicates no limit.|
|GlobalMovementThrottleThresholdForBalancing | Uint, default is 0 | Dynamic|Maximum number of movements allowed in Balancing Phase in the past interval indicated by GlobalMovementThrottleCountingInterval. 0 indicates no limit. |
|GlobalMovementThrottleCountingInterval | Time in seconds, default is 600 |Static| Specify timespan in seconds. Indicate the length of the past interval for which to track per domain replica movements (used along with GlobalMovementThrottleThreshold). Can be set to 0 to ignore global throttling altogether. |
|MovementPerPartitionThrottleThreshold | Uint, default is 50 |Dynamic| No balancing-related movement will occur for a partition if the number of balancing related movements for replicas of that partition has reached or exceeded MovementPerFailoverUnitThrottleThreshold in the past interval indicated by MovementPerPartitionThrottleCountingInterval. |
|MovementPerPartitionThrottleCountingInterval | Time in seconds, default is 600 |Static| Specify timespan in seconds. Indicate the length of the past interval for which to track replica movements for each partition (used along with MovementPerPartitionThrottleThreshold). |
|PlacementSearchTimeout | Time in seconds, default is 0.5 |Dynamic| Specify timespan in seconds. When placing services; search for at most this long before returning a result. |
|UseMoveCostReports | Bool, default is false | Dynamic|Instructs the LB to ignore the cost element of the scoring function; resulting potentially large number of moves for better balanced placement. |
|PreventTransientOvercommit | Bool, default is false | Dynamic|Determines should PLB immediately count on resources that will be freed up by the initiated moves. By default; PLB can initiate move out and move in on the same node which can create transient overcommit. Setting this parameter to true will prevent those kinds of overcommits and on-demand defrag (aka placementWithMove) will be disabled. |
|InBuildThrottlingEnabled | Bool, default is false |Dynamic| Determine whether the in-build throttling is enabled. |
|InBuildThrottlingAssociatedMetric | string, default is "" |Static| The associated metric name for this throttling. |
|InBuildThrottlingGlobalMaxValue | Int, default is 0 |Dynamic|The maximal number of in-build replicas allowed globally. |
|SwapPrimaryThrottlingEnabled | Bool, default is false|Dynamic| Determine whether the swap-primary throttling is enabled. |
|SwapPrimaryThrottlingAssociatedMetric | string, default is ""|Static| The associated metric name for this throttling. |
|SwapPrimaryThrottlingGlobalMaxValue | Int, default is 0 |Dynamic| The maximal number of swap-primary replicas allowed globally. |
|PlacementConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of placement constraint: 0: Hard; 1: Soft; negative: Ignore. |
|PreferredLocationConstraintPriority | Int, default is 2| Dynamic|Determines the priority of preferred location constraint: 0: Hard; 1: Soft; 2: Optimization; negative: Ignore |
|CapacityConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of capacity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|AffinityConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of affinity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|FaultDomainConstraintPriority | Int, default is 0 |Dynamic| Determines the priority of fault domain constraint: 0: Hard; 1: Soft; negative: Ignore. |
|UpgradeDomainConstraintPriority | Int, default is 1| Dynamic|Determines the priority of upgrade domain constraint: 0: Hard; 1: Soft; negative: Ignore. |
|ScaleoutCountConstraintPriority | Int, default is 0 |Dynamic| Determines the priority of scaleout count constraint: 0: Hard; 1: Soft; negative: Ignore. |
|ApplicationCapacityConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of capacity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|MoveParentToFixAffinityViolation | Bool, default is false |Dynamic| Setting which determines if parent replicas can be moved to fix affinity constraints.|
|MoveExistingReplicaForPlacement | Bool, default is true |Dynamic|Setting which determines if to move existing replica during placement. |
|UseSeparateSecondaryLoad | Bool, default is true | Dynamic|Setting which determines if use different secondary load. |
|PlaceChildWithoutParent | Bool, default is true | Dynamic|Setting which determines if child service replica can be placed if no parent replica is up. |
|PartiallyPlaceServices | Bool, default is true |Dynamic| Determines if all service replicas in cluster will be placed "all or nothing" given limited suitable nodes for them.|
|InterruptBalancingForAllFailoverUnitUpdates | Bool, default is false | Dynamic|Determines if any type of failover unit update should interrupt fast or slow balancing run. With specified "false" balancing run will be interrupted if FailoverUnit:  is created/deleted; has missing replicas; changed primary replica location or changed number of replicas. Balancing run will NOT be interrupted in other cases - if FailoverUnit:  has extra replicas; changed any replica flag; changed only partition version or any other case. |
|GlobalMovementThrottleThresholdPercentage|double, default is 0|Dynamic|Maximum number of total movements allowed in Balancing and Placement phases (expressed as percentage of total number of replicas in the cluster) in the past interval indicated by GlobalMovementThrottleCountingInterval. 0 indicates no limit. If both this and GlobalMovementThrottleThreshold are specified; then more conservative limit is used.|
|GlobalMovementThrottleThresholdPercentageForBalancing|double, default is 0|Dynamic|Maximum number of movements allowed in Balancing Phase (expressed as percentage of total number of replicas in PLB) in the past interval indicated by GlobalMovementThrottleCountingInterval. 0 indicates no limit. If both this and GlobalMovementThrottleThresholdForBalancing are specified; then more conservative limit is used.|
|AutoDetectAvailableResources|bool, default is TRUE|Static|This config will trigger auto detection of available resources on node (CPU and Memory) When this config is set to true - we will read real capacities and correct them if user specified bad node capacities or didn't define them at all If this config is set to false - we will trace a warning that user specified bad node capacities; but we will not correct them; meaning that user wants to have the capacities specified as > than the node really has or if capacities are undefined; it will assume unlimited capacity |

### Section Name: Hosting
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| ServiceTypeRegistrationTimeout |Time in Seconds, default is 300 |Dynamic|Maximum time allowed for the ServiceType to be  registered with fabric |
| ServiceTypeDisableFailureThreshold |Whole number, default is 1 |Dynamic|This is the threshold for the failure count after which FailoverManager (FM) is notified to disable the service type on that node and try a different node for placement. |
| ActivationRetryBackoffInterval |Time in Seconds, default is 5 |Dynamic|Backoff interval on every activation failure; On every continuous activation failure, the system retries the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval. |
| ActivationMaxRetryInterval |Time in seconds, default is 300 |Dynamic|On every continuous activation failure, the system retries the activation for up to ActivationMaxFailureCount. ActivationMaxRetryInterval specifies Wait time interval before retry after every activation failure |
| ActivationMaxFailureCount |Whole number, default is 10 |Dynamic|Number of times system retries failed activation before giving up |
|ActivationTimeout| TimeSpan, default is Common::TimeSpan::FromSeconds(180)|Dynamic| Specify timespan in seconds. The timeout for application activation; deactivation and upgrade. |
|ApplicationHostCloseTimeout| TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic| Specify timespan in seconds. When Fabric exit is detected in a self activated processes; FabricRuntime closes all of the replicas in the user's host (applicationhost) process. This is the timeout for the close operation. |
|ApplicationUpgradeTimeout| TimeSpan, default is Common::TimeSpan::FromSeconds(360)|Dynamic| Specify timespan in seconds. The timeout for application upgrade. If the timeout is less than the "ActivationTimeout" deployer will fail. |
|CreateFabricRuntimeTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic| Specify timespan in seconds. The timeout value for the sync FabricCreateRuntime call |
|DeploymentMaxFailureCount|int, default is 20| Dynamic|Application deployment will be retried for DeploymentMaxFailureCount times before failing the deployment of that application on the node.| 
|DeploymentMaxRetryInterval| TimeSpan, default is Common::TimeSpan::FromSeconds(3600)|Dynamic| Specify timespan in seconds. Max retry interval for the deployment. On every continuous failure the retry interval is calculated as Min( DeploymentMaxRetryInterval; Continuous Failure Count * DeploymentRetryBackoffInterval) |
|DeploymentRetryBackoffInterval| TimeSpan, default is Common::TimeSpan::FromSeconds(10)|Dynamic|Specify timespan in seconds. Back-off interval for the deployment failure. On every continuous deployment failure the system will retry the deployment for up to the MaxDeploymentFailureCount. The retry interval is a product of continuous deployment failure and the deployment backoff interval. |
|EnableActivateNoWindow| bool, default is FALSE|Dynamic| The activated process is created in the background without any console. |
|EnableProcessDebugging|bool, default is FALSE|Dynamic| Enables launching application hosts under debugger |
|EndpointProviderEnabled| bool, default is FALSE|Static| Enables management of Endpoint resources by Fabric. Requires specification of start and end application port range in FabricNode. |
|FabricContainerAppsEnabled| bool, default is FALSE|Static| |
|FirewallPolicyEnabled|bool, default is FALSE|Static| Enables opening firewall ports for Endpoint resources with explicit ports specified in ServiceManifest |
|GetCodePackageActivationContextTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic|Specify timespan in seconds. The timeout value for the CodePackageActivationContext calls. This is not applicable to ad-hoc services. |
|IPProviderEnabled|bool, default is FALSE|Static|Enables management of IP addresses. |
|NTLMAuthenticationEnabled|bool, default is FALSE|Static| Enables support for using NTLM by the code packages that are running as other users so that the processes across machines can communicate securely. |
|NTLMAuthenticationPasswordSecret|SecureString, default is Common::SecureString(L"")|Static|Is an encrypted has that is used to generate the password for NTLM users. Has to be set if NTLMAuthenticationEnabled is true. Validated by the deployer. |
|NTLMSecurityUsersByX509CommonNamesRefreshInterval|TimeSpan, default is Common::TimeSpan::FromMinutes(3)|Dynamic|Specify timespan in seconds. Environment-specific settings The periodic interval at which Hosting scans for new certificates to be used for FileStoreService NTLM configuration. |
|NTLMSecurityUsersByX509CommonNamesRefreshTimeout|TimeSpan, default is Common::TimeSpan::FromMinutes(4)|Dynamic| Specify timespan in seconds. The timeout for configuring NTLM users using certificate common names. The NTLM users are needed for FileStoreService shares. |
|RegisterCodePackageHostTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic| Specify timespan in seconds. The timeout value for the FabricRegisterCodePackageHost sync call. This is applicable for only multi code package application hosts like FWP |
|RequestTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(30)|Dynamic| Specify timespan in seconds. This represents the timeout for communication between the user's application host and Fabric process for various hosting related operations such as factory registration; runtime registration. |
|RunAsPolicyEnabled| bool, default is FALSE|Static| Enables running code packages as local user other than the user under which fabric process is running. In order to enable this policy Fabric must be running as SYSTEM or as user who has SeAssignPrimaryTokenPrivilege. |
|ServiceFactoryRegistrationTimeout| TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic|Specify timespan in seconds. The timeout value for the sync Register(Stateless/Stateful)ServiceFactory call |
|ServiceTypeDisableGraceInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(30)|Dynamic|Specify timespan in seconds. Time interval after which the service type can be disabled |

### Section Name: Federation
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| LeaseDuration |Time in seconds, default is 30 |Dynamic|Duration that a lease lasts between a node and its neighbors. |
| LeaseDurationAcrossFaultDomain |Time in seconds, default is 30 |Dynamic|Duration that a lease lasts between a node and its neighbors across fault domains. |

### Section Name: ClusterManager
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or short Description** |
| --- | --- | --- | --- |
| UpgradeStatusPollInterval |Time in seconds, default is 60 |Dynamic|The frequency of polling for application upgrade status. This value determines the rate of update for any GetApplicationUpgradeProgress call |
| UpgradeHealthCheckInterval |Time in seconds, default is 60 |Dynamic|The frequency of health status checks during a monitored application upgrades |
| FabricUpgradeStatusPollInterval |Time in seconds, default is 60 |Dynamic|The frequency of polling for Fabric upgrade status. This value determines the rate of update for any GetFabricUpgradeProgress call |
| FabricUpgradeHealthCheckInterval |Time in seconds, default is 60 |Dynamic|The frequency of health status check during a  monitored Fabric upgrade |
|InfrastructureTaskProcessingInterval | Time in seconds, default is 10 |Dynamic|Specify timespan in seconds. The processing interval used by the infrastructure task processing state machine. |
|TargetReplicaSetSize |Int, default is 7 |Not Allowed|The TargetReplicaSetSize for ClusterManager. |
|MinReplicaSetSize |Int, default is 3 |Not Allowed|The MinReplicaSetSize for ClusterManager. |
|ReplicaRestartWaitDuration |Time in seconds, default is (60.0 * 30)|Not Allowed|Specify timespan in seconds. The ReplicaRestartWaitDuration for ClusterManager. |
|QuorumLossWaitDuration |Time in seconds, default is MaxValue |Not Allowed| Specify timespan in seconds. The QuorumLossWaitDuration for ClusterManager. |
|StandByReplicaKeepDuration | Time in seconds, default is (3600.0 * 2)|Not Allowed|Specify timespan in seconds. The StandByReplicaKeepDuration for ClusterManager. |
|PlacementConstraints | string, default is "" |Not Allowed|The PlacementConstraints for ClusterManager. |
|SkipRollbackUpdateDefaultService | Bool, default is false |Dynamic|The CM will skip reverting updated default services during application upgrade rollback. |
|EnableDefaultServicesUpgrade | Bool, default is false |Dynamic|Enable upgrading default services during application upgrade. Default service descriptions would be overwritten after upgrade. |
|InfrastructureTaskHealthCheckWaitDuration |Time in seconds, default is 0|Dynamic| Specify timespan in seconds. The amount of time to wait before starting health checks after post-processing an infrastructure task. |
|InfrastructureTaskHealthCheckStableDuration | Time in seconds, default is 0|Dynamic| Specify timespan in seconds. The amount of time to observe consecutive passed health checks before post-processing of an infrastructure task finishes successfully. Observing a failed health check will reset this timer. |
|InfrastructureTaskHealthCheckRetryTimeout | Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The amount of time to spend retrying failed health checks while post-processing an infrastructure task. Observing a passed health check will reset this timer. |
|ImageBuilderTimeoutBuffer |Time in seconds, default is 3 |Dynamic|Specify timespan in seconds. The amount of time to allow for Image Builder specific timeout errors to return to the client. If this buffer is too small; then the client times out before the server and gets a generic timeout error. |
|MinOperationTimeout | Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The minimum global timeout for internally processing operations on ClusterManager. |
|MaxOperationTimeout |Time in seconds, default is MaxValue |Dynamic| Specify timespan in seconds. The maximum global timeout for internally processing operations on ClusterManager. |
|MaxTimeoutRetryBuffer | Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum operation timeout when internally retrying due to timeouts is <Original Time out> + <MaxTimeoutRetryBuffer>. Additional timeout is added in increments of MinOperationTimeout. |
|MaxCommunicationTimeout |Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum timeout for internal communications between ClusterManager and other system services (i.e.; Naming Service; Failover Manager and etc.). This timeout should be smaller than global MaxOperationTimeout (as there might be multiple communications between system components for each client operation). |
|MaxDataMigrationTimeout |Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum timeout for data migration recovery operations after a Fabric upgrade has taken place. |
|MaxOperationRetryDelay |Time in seconds, default is 5|Dynamic| Specify timespan in seconds. The maximum delay for internal retries when failures are encountered. |
|ReplicaSetCheckTimeoutRollbackOverride |Time in seconds, default is 1200 |Dynamic| Specify timespan in seconds. If ReplicaSetCheckTimeout is set to the maximum value of DWORD; then it's overridden with the value of this config for the purposes of rollback. The value used for roll-forward is never overridden. |
|ImageBuilderJobQueueThrottle |Int, default is 10 |Dynamic|Thread count throttle for Image Builder proxy job queue on application requests. |
|MaxExponentialOperationRetryDelay|TimeSpan, default is Common::TimeSpan::FromSeconds(30)|Dynamic|Specify timespan in seconds. The maximum exponential delay for internal retries when failures are encountered repeatedly |

### Section Name: DefragmentationEmptyNodeDistributionPolicy
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyIntegerValueMap, default is None|Dynamic|Specifies the policy defragmentation follows when emptying nodes. For a given metric 0 indicates that SF should try to defragment nodes evenly across UDs and FDs; 1 indicates only that the nodes must be defragmented |

### Section Name: DefragmentationMetrics
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyBoolValueMap, default is None|Dynamic|Determines the set of metrics that should be used for defragmentation and not for load balancing. |

### Section Name: DefragmentationMetricsPercentOrNumberOfEmptyNodesTriggeringThreshold
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyDoubleValueMap, default is None|Dynamic|Determines the number of free nodes which are needed to consider cluster defragmented by specifying either percent in range [0.0 - 1.0) or number of empty nodes as number >= 1.0 |

### Section Name: DnsService
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|IsEnabled|bool, default is FALSE|Static| |
|InstanceCount|int, default is -1|Static|  |

### Section Name: MetricActivityThresholds
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyIntegerValueMap, default is None|Dynamic|Determines the set of MetricActivityThresholds for the metrics in the cluster. Balancing will work if maxNodeLoad is greater than MetricActivityThresholds. For defrag metrics it defines the amount of load equal to or below which Service Fabric will consider the node empty |

### Section Name: MetricBalancingThresholds
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyDoubleValueMap, default is None|Dynamic|Determines the set of MetricBalancingThresholds for the metrics in the cluster. Balancing will work if maxNodeLoad/minNodeLoad is greater than MetricBalancingThresholds. Defragmentation will work if maxNodeLoad/minNodeLoad in at least one FD or UD is smaller than MetricBalancingThresholds. |

### Section Name: NodeBufferPercentage
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyDoubleValueMap, default is None|Dynamic|Node capacity percentage per metric name; used as a buffer in order to keep some free place on a node for the failover case. |

### Section Name: Replication
| **Parameter** | **Allowed Values** | **Upgrade Policy**| **Guidance or short Description** |
| --- | --- | --- | --- |
|MaxCopyQueueSize|uint, default is 1024|Static|This is the maximum value defines the initial size for the queue which maintains replication operations.  Note that it must be a power of 2.  If during runtime the queue grows to this size operation will be throttled between the primary and secondary replicators.|
|BatchAcknowledgementInterval|TimeSpan, default is Common::TimeSpan::FromMilliseconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before sending back an acknowledgement. Other operations received during this time period will have their acknowledgements sent back in a single message-> reducing network traffic but potentially reducing the throughput of the replicator.|
|MaxReplicationMessageSize|uint, default is 52428800|Static|Maximum message size of replication operations. Default is 50MB.|
|ReplicatorAddress|string, default is L"localhost:0"|Static|The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to establish connections with other replicas in order to send/receive operations.|
|ReplicatorListenAddress|string, default is L"localhost:0"|Static|The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to receive operations from other replicas.|
|ReplicatorPublishAddress|string, default is L"localhost:0"|Static|The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to send operations to other replicas.|
|MaxPrimaryReplicationQueueSize|uint, default is 1024|Static|This is the maximum number of operations that could exist in the primary replication queue. Note that it must be a power of 2.|
|MaxPrimaryReplicationQueueMemorySize|uint, default is 0|Static|This is the maximum value of the primary replication queue in bytes.|
|MaxSecondaryReplicationQueueSize|uint, default is 2048|Static|This is the maximum number of operations that could exist in the secondary replication queue. Note that it must be a power of 2.|
|MaxSecondaryReplicationQueueMemorySize|uint, default is 0|Static|This is the maximum value of the secondary replication queue in bytes.|
|QueueHealthMonitoringInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(30)|Static|Specify timespan in seconds. This value determines the time period used by the Replicator to monitor any warning/error health events in the replication operation queues. A value of '0' disables health monitoring |
|QueueHealthWarningAtUsagePercent|uint, default is 80|Static|This value determines the replication queue usage(in percentage) after which we report warning about high queue usage. We do so after a grace interval of QueueHealthMonitoringInterval. If the queue usage falls below this percentage in the grace interval|
|RetryInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(5)|Static|Specify timespan in seconds. When an operation is lost or rejected this timer determines how often the replicator will retry sending the operation.|

### Section Name: Transport
| **Parameter** | **Allowed Values** |**Upgrade policy** |**Guidance or short Description** |
| --- | --- | --- | --- |
|ResolveOption|string, default is L"unspecified"|Static|Determines how FQDN is resolved.  Valid values are "unspecified/ipv4/ipv6". |
|ConnectionOpenTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(60)|Static|Specify timespan in seconds. Time out for connection setup on both incoming and accepting side (including security negotiation in secure mode) |

## Next steps
Read these articles for more information on cluster management:

[Add, Roll over, remove certificates from your Azure cluster ](service-fabric-cluster-security-update-certs-azure.md) 

