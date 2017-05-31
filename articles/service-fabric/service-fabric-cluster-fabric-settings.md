
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
ms.date: 02/15/2017
ms.author: chackdan

---
# Customize Service Fabric cluster settings and Fabric Upgrade policy
This document tells you how to customize the various fabric settings and the fabric upgrade policy for your Service Fabric cluster. You can customize them on the portal or using an Azure Resource Manager template.

> [!NOTE]
> Not all settings may be available via the portal. In case a setting listed below is not available via the portal customize it using an Azure Resource Manager template.
> 

## Customizing Service Fabric cluster settings using Azure Resource Manager templates
The steps below illustrate how to add a new setting *MaxDiskQuotaInMB* to the *Diagnostics* section.

1. Go to https://resources.azure.com
2. Navigate to your subscription by expanding subscriptions -> resource groups -> Microsoft.ServiceFabric -> Your Cluster Name
3. In the top right corner, select "Read/Write"
4. Select Edit and update the `fabricSettings` JSON element and add a new element

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

## Fabric settings that you can customize
Here are the Fabric settings that you can customize:

### Section Name: Diagnostics
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ConsumerInstances |String |The list of DCA consumer instances. |
| ProducerInstances |String |The list of DCA producer instances. |
| AppEtwTraceDeletionAgeInDays |Int, default is 3 |Number of days after which we delete old ETL files containing application ETW traces. |
| AppDiagnosticStoreAccessRequiresImpersonation |Bool, default is true |Whether or not impersonation is required when accessing diagnostic stores on behalf of the application. |
| MaxDiskQuotaInMB |Int, default is 65536 |Disk quota in MB for Windows Fabric log files. |
| DiskFullSafetySpaceInMB |Int, default is 1024 |Remaining disk space in MB to protect from use by DCA. |
| ApplicationLogsFormatVersion |Int, default is 0 |Version for application logs format. Supported values are 0 and 1. Version 1 includes more fields from the ETW event record than version 0. |
| ClusterId |String |The unique id of the cluster. This is generated when the cluster is created. |
| EnableTelemetry |Bool, default is true |This is going to enable or disable telemetry. |
| EnableCircularTraceSession |Bool, default is false |Flag indicates whether circular trace sessions should be used. |

### Section Name: Trace/Etw
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| Level |Int, default is 4 |Trace etw level can take values 1, 2, 3, 4. To be supported you must keep the trace level at 4 |

### Section Name: PerformanceCounterLocalStore
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| IsEnabled |Bool, default is true |Flag indicates whether performance counter collection on local node is enabled. |
| SamplingIntervalInSeconds |Int, default is 60 |Sampling interval for performance counters being collected. |
| Counters |String |Comma-separated list of performance counters to collect. |
| MaxCounterBinaryFileSizeInMB |Int, default is 1 |Maximum size (in MB) for each performance counter binary file. |
| NewCounterBinaryFileCreationIntervalInMinutes |Int, default is 10 |Maximum interval (in seconds) after which a new performance counter binary file is created. |

### Section Name: Setup
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| FabricDataRoot |String |Service Fabric data root directory. Default for Azure is d:\svcfab |
| FabricLogRoot |String |Service fabric log root directory. This is where SF logs and traces are placed. |
| ServiceRunAsAccountName |String |The account name under which to run fabric host service. |
| ServiceStartupType |String |The startup type of the fabric host service. |
| SkipFirewallConfiguration |Bool, default is false |Specifies if firewall settings need to be set by the system or not. This applies only if you are using windows firewall. If you are using third party firewalls, then you must open the ports for the system and applications to use |

### Section Name: TransactionalReplicator
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| MaxCopyQueueSize |Uint, default is 16384 |This is the maximum value defines the initial size for the queue which maintains replication operations. Note that it must be a power of 2. If during runtime the queue grows to this size operations will be throttled between the primary and secondary replicators. |
| BatchAcknowledgementInterval | Time in seconds, default is 0.015 | Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before sending back an acknowledgement. Other operations received during this time period will have their acknowledgements sent back in a single message-> reducing network traffic but potentially reducing the throughput of the replicator. |
| MaxReplicationMessageSize |Uint, default is 52428800 | Maximum message size of replication operations. Default is 50MB. |
| ReplicatorAddress |string, default is "localhost:0" | The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to establish connections with other replicas in order to send/receive operations. |
| InitialPrimaryReplicationQueueSize |Uint, default is 64 | This value defines the initial size for the queue which maintains the replication operations on the primary. Note that it must be a power of 2.|
| MaxPrimaryReplicationQueueSize |Uint, default is 8192 |This is the maximum number of operations that could exist in the primary replication queue. Note that it must be a power of 2. |
| MaxPrimaryReplicationQueueMemorySize |Uint, default is 0 |This is the maximum value of the primary replication queue in bytes. |
| InitialSecondaryReplicationQueueSize |Uint, default is 64 |This value defines the initial size for the queue which maintains the replication operations on the secondary. Note that it must be a power of 2. |
| MaxSecondaryReplicationQueueSize |Uint, default is 16384 |This is the maximum number of operations that could exist in the secondary replication queue. Note that it must be a power of 2. |
| MaxSecondaryReplicationQueueMemorySize |Uint, default is 0 |This is the maximum value of the secondary replication queue in bytes. |
| SecondaryClearAcknowledgedOperations |Bool, default is false |Bool which controls if the operations on the secondary replicator are cleared once they are acknowledged to the primary(flushed to the disk). Settings this to TRUE can result in additional disk reads on the new primary, while catching up replicas after a failover. |
| MaxMetadataSizeInKB |Int, default is 4 |Maximum size of the log stream metadata. |
| MaxRecordSizeInKB |Uint, default is 1024 | Maximum size of a log stream record. |
| CheckpointThresholdInMB |Int, default is 50 |A checkpoint will be initiated when the log usage exceeds this value. |
| MaxAccumulatedBackupLogSizeInMB |Int, default is 800 |Max accumulated size (in MB) of backup logs in a given backup log chain. An incremental backup requests will fail if the incremental backup would generate a backup log that would cause the accumulated backup logs since the relevant full backup to be larger than this size. In such cases, user is required to take a full backup. |
| MaxWriteQueueDepthInKB |Int, default is 0 | Int for maximum write queue depth that the core logger can use as specified in kilobytes for the log that is associated with this replica. This value is the maximum number of bytes that can be outstanding during core logger updates. It may be 0 for the core logger to compute an appropriate value or a multiple of 4. |
| SharedLogId |String |Shared log identifier. This is a guid and should be unique for each shared log. |
| SharedLogPath |String |Path to the shared log. If this value is empty then the default shared log is used. |
| SlowApiMonitoringDuration |Time in seconds, default is 300 | Specify duration for api before warning health event is fired.|
| MinLogSizeInMB |Int, default is 0 |Minimum size of the transactional log. The log will not be allowed to truncate to a size below this setting. 0 indicates that the replicator will determine the minimum log size according to other settings. Increasing this value increases the possibility of doing partial copies and incremental backups since chances of relevant log records being truncated is lowered. |

### Section Name: FabricClient
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| NodeAddresses |string, default is "" |A collection of addresses (connection strings) on different nodes that can be used to communicate with the the Naming Service. Initially the Client connects selecting one of the addresses randomly. If more than one connection string is supplied and a connection fails because of a communication or timeout error; the Client switches to use the next address sequentially. See the Naming Service Address retry section for details on retries semantics. |
| ConnectionInitializationTimeout |Time in seconds, default is 2 |Specify timespan in seconds. Connection timeout interval for each time client tries to open a connection to the gateway. |
| PartitionLocationCacheLimit |Int, default is 100000 |Number of partitions cached for service resolution (set to 0 for no limit). |
| ServiceChangePollInterval |Time in seconds, default is 120 |Specify timespan in seconds. The interval between consecutive polls for service changes from the client to the gateway for registered service change notifications callbacks. |
| KeepAliveIntervalInSeconds |Int, default is 20 |The interval at which the FabricClient transport sends keep-alive messages to the gateway. For 0; keepAlive is disabled. Must be a positive value. |
| HealthOperationTimeout |Time in seconds, default is 120 |Specify timespan in seconds. The timeout for a report message sent to Health Manager. |
| HealthReportSendInterval |Time in seconds, default is 30 |Specify timespan in seconds. The interval at which reporting component sends accumulated health reports to Health Manager. |
| HealthReportRetrySendInterval |Time in seconds, default is 30 |Specify timespan in seconds. The interval at which reporting component re-sends accumulated health reports to Health Manager. |
| RetryBackoffInterval |Time in seconds, default is 3 |Specify timespan in seconds. The back-off interval before retrying the operation. |
| MaxFileSenderThreads |Uint, default is 10 |The max number of files that are transferred in parallel. |

### Section Name: Common
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| PerfMonitorInterval |Time in seconds, default is 1 |Specify timespan in seconds. Performance monitoring interval. Setting to 0 or negative value disables monitoring. |

### Section Name: HealthManager
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| EnableApplicationTypeHealthEvaluation |Bool, default is false |Cluster health evaluation policy: enable per application type health evaluation. |

### Section Name: FabricNode
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| StateTraceInterval |Time in seconds, default is 300 |Specify timespan in seconds. The interval for tracing node status on each node and up nodes on FM/FMM. |

### Section Name: NodeDomainIds
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| UpgradeDomainId |string, default is "" |Describes the upgrade domain a node belongs to. |
| PropertyGroup |NodeFaultDomainIdCollection |Describes the fault domains a node belongs to. The fault domain is defined through a URI that describes the location of the node in the datacenter.  Fault Domain URIs are of the format fd:/fd/ followed by a URI path segment.|

### Section Name: NodeProperties
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| PropertyGroup |NodePropertyCollectionMap |A collection of string key-value pairs for node properties. |

### Section Name: NodeCapacities
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| PropertyGroup |NodeCapacityCollectionMap |A collection of node capacities for different metrics. |

### Section Name: FabricNode
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| StartApplicationPortRange |Int, default is 0 |Start of the application ports managed by hosting subsystem. Required if EndpointFilteringEnabled is true in Hosting. |
| EndApplicationPortRange |Int, default is 0 |End (no inclusive) of the application ports managed by hosting subsystem. Required if EndpointFilteringEnabled is true in Hosting. |
| ClusterX509StoreName |string, default is "My" |Name of X.509 certificate store that contains cluster certificate for securing intra-cluster communication. |
| ClusterX509FindType |string, default is "FindByThumbprint" |Indicates how to search for cluster certificate in the store specified by ClusterX509StoreName Supported values: "FindByThumbprint"; "FindBySubjectName" With "FindBySubjectName"; when there are multiple matches; the one with the furthest expiration is used. |
| ClusterX509FindValue |string, default is "" |Search filter value used to locate cluster certificate. |
| ClusterX509FindValueSecondary |string, default is "" |Search filter value used to locate cluster certificate. |
| ServerAuthX509StoreName |string, default is "My" |Name of X.509 certificate store that contains server certificate for entree service. |
| ServerAuthX509FindType |string, default is "FindByThumbprint" |Indicates how to search for server certificate in the store specified by ServerAuthX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
| ServerAuthX509FindValue |string, default is "" |Search filter value used to locate server certificate. |
| ServerAuthX509FindValueSecondary |string, default is "" |Search filter value used to locate server certificate. |
| ClientAuthX509StoreName |string, default is "My" |Name of the X.509 certificate store that contains certificate for default admin role FabricClient. |
| ClientAuthX509FindType |string, default is "FindByThumbprint" |Indicates how to search for certificate in the store specified by ClientAuthX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
| ClientAuthX509FindValue |string, default is "" | Search filter value used to locate certificate for default admin role FabricClient. |
| ClientAuthX509FindValueSecondary |string, default is "" |Search filter value used to locate certificate for default admin role FabricClient. |
| UserRoleClientX509StoreName |string, default is "My" |Name of the X.509 certificate store that contains certificate for default user role FabricClient. |
| UserRoleClientX509FindType |string, default is "FindByThumbprint" |Indicates how to search for certificate in the store specified by UserRoleClientX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
| UserRoleClientX509FindValue |string, default is "" |Search filter value used to locate certificate for default user role FabricClient. |
| UserRoleClientX509FindValueSecondary |string, default is "" |Search filter value used to locate certificate for default user role FabricClient. |

### Section Name: Paas
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ClusterId |string, default is "" |X509 certificate store used by fabric for configuration protection. |

### Section Name: FabricHost
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| StopTimeout |Time in seconds, default is 300 |Specify timespan in seconds. The timeout for hosted service activation; deactivation and upgrade. |
| StartTimeout |Time in seconds, default is 300 |Specify timespan in seconds. Timeout for fabricactivationmanager startup. |
| ActivationRetryBackoffInterval |Time in seconds, default is 5 |Specify timespan in seconds. Backoff interval on every activation failure;On every continuous activation failure the system will retry the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval. |
| ActivationMaxRetryInterval |Time in seconds, default is 300 |Specify timespan in seconds. Max retry interval for Activation. On every continuous failure the retry interval is calculated as Min( ActivationMaxRetryInterval; Continuous Failure Count * ActivationRetryBackoffInterval). |
| ActivationMaxFailureCount |Int, default is 10 |This is the maximum count for which system will retry failed activation before giving up. |
| EnableServiceFabricAutomaticUpdates |Bool, default is false |This is to enable fabric automatic update via Windows Update. |
| EnableServiceFabricBaseUpgrade |Bool, default is false |This is to enable base update for server. |
| EnableRestartManagement |Bool, default is false |This is to enable server restart. |


### Section Name: FailoverManager
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| UserReplicaRestartWaitDuration |Time in seconds, default is 60.0 * 30 |Specify timespan in seconds. When a persisted replica goes down; Windows Fabric waits for this duration for the replica to come back up before creating new replacement  replicas (which would require a copy of the state). |
| QuorumLossWaitDuration |Time in seconds, default is MaxValue |Specify timespan in seconds. This is the max duration for which we allow a partition to be in a state of quorum loss. If the partition is still in quorum loss after this duration; the partition is recovered from quorum loss by considering the down replicas as lost. Note that this can potentially incur data loss. |
| UserStandByReplicaKeepDuration |Time in seconds, default is 3600.0 * 24 * 7 |Specify timespan in seconds. When a persisted replica come back from a down state; it may have already been replaced. This timer determines how long the FM will keep the standby replica before discarding it. |
| UserMaxStandByReplicaCount |Int, default is 1 |The default max number of StandBy replicas that the system keeps for user services. |

### Section Name: NamingService
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| TargetReplicaSetSize |Int, default is 7 |The number of replica sets for each partition of the Naming Service store. Increasing the number of replica sets increases the level of reliability for the information in the Naming Service Store; decreasing the change that the information will be lost as a result of node failures; at a cost of increased load on Windows Fabric and the amount of time it takes to perform updates to the naming data.|
|MinReplicaSetSize | Int, default is 3 | The minimum number of Naming Service replicas required to write into to complete an update. If there are fewer replicas than this active in the system the Reliability System denies updates to the Naming Service Store until replicas are restored. This value should never be more than the TargetReplicaSetSize. |
|ReplicaRestartWaitDuration | Time in seconds, default is (60.0 * 30)| Specify timespan in seconds. When a Naming Service replica goes down; this timer starts.  When it expires the FM will begin to replace the replicas which are down (it does not yet consider them lost). |
|QuorumLossWaitDuration | Time in seconds, default is MaxValue | Specify timespan in seconds. When a Naming Service gets into quorum loss; this timer starts.  When it expires the FM will consider the down replicas as lost; and attempt to recover quorum. Not that this may result in data loss. |
|StandByReplicaKeepDuration | Time in seconds, default is 3600.0 * 2 | Specify timespan in seconds. When a Naming Service replicas come back from a down state; it may have already been replaced.  This timer determines how long the FM will keep the standby replica before discarding it. |
|PlacementConstraints | string, default is "" | Placement constraint for the Naming Service. |
|ServiceDescriptionCacheLimit | Int, default is 0 | The maximum number of entries maintained in the LRU service description cache at the Naming Store Service (set to 0 for no limit). |
|RepairInterval | Time in seconds, default is 5 | Specify timespan in seconds. Interval in which the naming inconsistency repair between the authority owner and name owner will start. |
|MaxNamingServiceHealthReports | Int, default is 10 | The maximum number of slow operations that Naming store service reports unhealthy at one time. If 0; all slow operations are sent. |
| MaxMessageSize |Int, default is 4*1024*1024 |The maximum message size for client node communication when using naming. DOS attack alleviation; default value is 4MB. |
| MaxFileOperationTimeout |Time in seconds, default is 30 |Specify timespan in seconds. The maximum timeout allowed for file store service operation. Requests specifying a larger timeout will be rejected. |
| MaxOperationTimeout |Time in seconds, default is 600 |Specify timespan in seconds. The maximum timeout allowed for client operations. Requests specifying a larger timeout will be rejected. |
| MaxClientConnections |Int, default is 1000 |The maximum allowed number of client connections per gateway. |
| ServiceNotificationTimeout |Time in seconds, default is 30 |Specify timespan in seconds. The timeout used when delivering service notifications to the client. |
| MaxOutstandingNotificationsPerClient |Int, default is 1000 |The maximum number of outstanding notifications before a client registration is forcibly closed by the gateway. |
| MaxIndexedEmptyPartitions |Int, default is 1000 |The maximum number of empty partitions that will remain indexed in the notification cache for synchronizing reconnecting clients. Any empty partitions above this number will be removed from the index in ascending lookup version order. Reconnecting clients can still synchronize and receive missed empty partition updates; but the synchronization protocol becomes more expensive. |
| GatewayServiceDescriptionCacheLimit |Int, default is 0 |The maximum number of entries maintained in the LRU service description cache at the Naming Gateway (set to 0 for no limit). |
| PartitionCount |Int, default is 3 |The number of partitions of the Naming Service store to be created. Each partition owns a single partition key that corresponds to its index; so partition keys [0; PartitionCount) exist. Increasing the number of Naming Service partitions increases the scale that the Naming Service can perform at by decreasing the average amount of data held by any backing replica set; at a cost of increased utilization of resources (since PartitionCount*ReplicaSetSize service replicas must be maintained).|

### Section Name: RunAs
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| RunAsAccountName |string, default is "" |Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Indicates the RunAs account type. This is needed for any RunAs section Valid values are "DomainUser/NetworkService/ManagedServiceAccount/LocalSystem".|
|RunAsPassword|string, default is "" |Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: RunAs_Fabric
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| RunAsAccountName |string, default is "" |Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: RunAs_HttpGateway
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| RunAsAccountName |string, default is "" |Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: RunAs_DCA
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| RunAsAccountName |string, default is "" |Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

### Section Name: HttpGateway
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
|IsEnabled|Bool, default is false | Enables/Disables the httpgateway. Httpgateway is disabled by default and this config needs to be set to enable it. |
|ActiveListeners |Uint, default is 50 | Number of reads to post to the http server queue. This controls the number of concurrent requests that can be satisfied by the HttpGateway. |
|MaxEntityBodySize |Uint, default is 4194304 |  Gives the maximum size of the body that can be expected from a http request. Default value is 4MB. Httpgateway will fail a request if it has a body of size > this value. Minimum read chunk size is 4096 bytes. So this has to be >= 4096. |

### Section Name: KtlLogger
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
|AutomaticMemoryConfiguration |Int, default is 1 | Flag that indicates if the memory settings should be automatically and dynamically configured. If zero then the memory configuration settings are used directly and do not change based on system conditions. If one then the memory settings are configured automatically and may change based on system conditions. |
|WriteBufferMemoryPoolMinimumInKB |Int, default is 8388608 |The number of KB to initially allocate for the write buffer memory pool. Use 0 to indicate no limit Default should be consistent with SharedLogSizeInMB below. |
|WriteBufferMemoryPoolMaximumInKB | Int, default is 0 |The number of KB to allow the write buffer memory pool to grow up to. Use 0 to indicate no limit. |
|MaximumDestagingWriteOutstandingInKB | Int, default is 0 | The number of KB to allow the shared log to advance ahead of the dedicated log. Use 0 to indicate no limit.
|SharedLogPath |string, default is "" | Path and file name to location to place shared log container. Use "" for using default path under fabric data root. |
|SharedLogId |string, default is "" |Unique guid for shared log container. Use "" if using default path under fabric data root. |
|SharedLogSizeInMB |Int, default is 8192 | The number of MB to allocate in the shared log container. |

### Section Name: ApplicationGateway/Http
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
|IsEnabled |Bool, default is false | Enables/Disables the HttpApplicationGateway. HttpApplicationGateway is disabled by default and this config needs to be set to enable it. |
|NumberOfParallelOperations | Uint, default is 1000 | Number of reads to post to the http server queue. This controls the number of concurrent requests that can be satisfied by the HttpGateway. |
|DefaultHttpRequestTimeout |Time in seconds. default is 60 |Specify timespan in seconds.  Gives the default request timeout for the http requests being processed in the http app gateway. |
|ResolveServiceBackoffInterval |Time in seconds, default is 5 |Specify timespan in seconds.  Gives the default back-off interval before retrying a failed resolve service operation. |
|BodyChunkSize |Uint, default is 4096 |  Gives the size of for the chunk in bytes used to read the body. |
|GatewayAuthCredentialType |string, default is "None" | Indicates the type of security credentials to use at the http app gateway endpoint Valid values are "None/X509. |
|GatewayX509CertificateStoreName |string, default is "My" | Name of X.509 certificate store that contains certificate for http app gateway. |
|GatewayX509CertificateFindType |string, default is "FindByThumbprint" | Indicates how to search for certificate in the store specified by GatewayX509CertificateStoreName Supported value: FindByThumbprint; FindBySubjectName. |
|GatewayX509CertificateFindValue | string, default is "" | Search filter value used to locate the http app gateway certificate. This certificate is configured on the https endpoint and can also be used to verify the identity of the app if needed by the services. FindValue is looked up first; and if that doesnt exist; FindValueSecondary is looked up. |
|GatewayX509CertificateFindValueSecondary | string, default is "" |Search filter value used to locate the http app gateway certificate. This certificate is configured on the https endpoint and can also be used to verify the identity of the app if needed by the services. FindValue is looked up first; and if that doesnt exist; FindValueSecondary is looked up.|

### Section Name: Management
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ImageStoreConnectionString |SecureString | Connection string to the Root for ImageStore. |
| ImageStoreMinimumTransferBPS | Int, default is 1024 |The minimum transfer rate between the cluster and ImageStore. This value is used to determine the timeout when accessing the external ImageStore. Change this value only if the latency between the cluster and ImageStore is high to allow more time for the cluster to download from the external ImageStore. |
|AzureStorageMaxWorkerThreads | Int, default is 25 | The maximum number of worker threads in parallel. |
|AzureStorageMaxConnections | Int, default is 5000 | The maximum number of concurrent connections to azure storage. |
|AzureStorageOperationTimeout | Time in seconds, default is 6000 | Specify timespan in seconds. Timeout for xstore operation to complete. |
|ImageCachingEnabled | Bool, default is true | This configuration allows us to enable or disable caching. |
|DisableChecksumValidation | Bool, default is false | This configuration allows us to enable or disable checksum validation during application provisioning. |
|DisableServerSideCopy | Bool, default is false | This configuration enables or disables server side copy of application package on the ImageStore during application provisioning. |

### Section Name: HealthManager/ClusterHealthPolicy
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ConsiderWarningAsError |Bool, default is false |Cluster health evaluation policy: warnings are treated as errors. |
| MaxPercentUnhealthyNodes | Int, default is 0 |Cluster health evaluation policy: maximum percent of unhealthy nodes allowed for the cluster to be healthy. |
| MaxPercentUnhealthyApplications | Int, default is 0 |Cluster health evaluation policy: maximum percent of unhealthy applications allowed for the cluster to be healthy. |
|MaxPercentDeltaUnhealthyNodes | Int, default is 10 |Cluster upgrade health evaluation policy: maximum percent of delta unhealthy nodes allowed for the cluster to be healthy. |
|MaxPercentUpgradeDomainDeltaUnhealthyNodes | Int, default is 15 |Cluster upgrade health evaluation policy: maximum percent of delta of unhealthy nodes in an upgrade domain allowed for the cluster to be healthy.|

### Section Name: FaultAnalysisService
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| TargetReplicaSetSize |Int, default is 0 |NOT_PLATFORM_UNIX_START The TargetReplicaSetSize for FaultAnalysisService. |
| MinReplicaSetSize |Int, default is 0 |The MinReplicaSetSize for FaultAnalysisService. |
| ReplicaRestartWaitDuration |Time in seconds, default is 60 minutes|Specify timespan in seconds. The ReplicaRestartWaitDuration for FaultAnalysisService. |
| QuorumLossWaitDuration | Time in seconds, default is MaxValue |Specify timespan in seconds. The QuorumLossWaitDuration for FaultAnalysisService. |
| StandByReplicaKeepDuration| Time in seconds, default is (60*24*7) minutes |Specify timespan in seconds. The StandByReplicaKeepDuration for FaultAnalysisService. |
| PlacementConstraints | string, default is ""| The PlacementConstraints for FaultAnalysisService. |
| StoredActionCleanupIntervalInSeconds | Int, default is 3600 |This is how often the store will be cleaned up.  Only actions in a terminal state; and that completed at least CompletedActionKeepDurationInSeconds ago will be removed. |
| CompletedActionKeepDurationInSeconds | Int, default is 604800 | This is approximately how long to keep actions that are in a terminal state.  This also depends on StoredActionCleanupIntervalInSeconds; since the work to cleanup is only done on that interval. 604800 is 7 days. |
| StoredChaosEventCleanupIntervalInSeconds | Int, default is 3600 |This is how often the store will be audited for cleanup; if the number of events is more than 30000; the cleanup will kick in. |

### Section Name: FileStoreService
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| NamingOperationTimeout |Time in seconds, default is 60 |Specify timespan in seconds. The timeout for performing naming operation. |
| QueryOperationTimeout | Time in seconds, default is 60 |Specify timespan in seconds. The timeout for performing query operation. |
| MaxCopyOperationThreads | Uint, default is 0 | The maximum number of parallel files that secondary can copy from primary. '0' == number of cores. |
| MaxFileOperationThreads | Uint, default is 100 | The maximum number of parallel threads allowed to perform FileOperations (Copy/Move) in the primary. '0' == number of cores. |
| MaxStoreOperations | Uint, default is 4096 |The maximum number of parallel store transcation operations allowed on primary. '0' == number of cores. |
| MaxRequestProcessingThreads | Uint, default is 200 |The maximum number of parallel threads allowed to process requests in the primary. '0' == number of cores. |
| MaxSecondaryFileCopyFailureThreshold | Uint, default is 25| The maximum number of file copy retries on the secondary before giving up. |
| AnonymousAccessEnabled | Bool, default is true |Enable/Disable anonymous access to the FileStoreService shares. |
| PrimaryAccountType | string, default is "" |The primary AccountType of the principal to ACL the FileStoreService shares. |
| PrimaryAccountUserName | string, default is "" |The primary account Username of the principal to ACL the FileStoreService shares. |
| PrimaryAccountUserPassword | SecureString, default is empty |The primary account password of the principal to ACL the FileStoreService shares. |
| FileStoreService | PrimaryAccountNTLMPasswordSecret | SecureString, default is empty | The password secret which used as seed to generated same password when using NTLM authentication. |
| PrimaryAccountNTLMX509StoreLocation | string, default is "LocalMachine"| The store location of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| PrimaryAccountNTLMX509StoreName | string, default is "MY"| The store name of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| PrimaryAccountNTLMX509Thumbprint | string, default is ""|The thumbprint of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| SecondaryAccountType | string, default is ""| The secondary AccountType of the principal to ACL the FileStoreService shares. |
| SecondaryAccountUserName | string, default is ""| The secondary account Username of the principal to ACL the FileStoreService shares. |
| SecondaryAccountUserPassword | SecureString, default is empty |The secondary account password of the principal to ACL the FileStoreService shares.  |
| SecondaryAccountNTLMPasswordSecret | SecureString, default is empty | The password secret which used as seed to generated same password when using NTLM authentication. |
| SecondaryAccountNTLMX509StoreLocation | string, default is "LocalMachine" |The store location of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| SecondaryAccountNTLMX509StoreName | string, default is "MY" |The store name of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret  when using NTLM authentication. |
| SecondaryAccountNTLMX509Thumbprint | string, default is ""| The thumbprint of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret  when using NTLM authentication. |

### Section Name: ImageStoreService
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| Enabled |Bool, default is false |The Enabled flag for ImageStoreService. |
| TargetReplicaSetSize | Int, default is 7 |The TargetReplicaSetSize for ImageStoreService. |
| MinReplicaSetSize | Int, default is 3 |The MinReplicaSetSize for ImageStoreService. |
| ReplicaRestartWaitDuration | Time in seconds, default is 60.0 * 30 | Specify timespan in seconds. The ReplicaRestartWaitDuration for ImageStoreService. |
| QuorumLossWaitDuration | Time in seconds, default is MaxValue | Specify timespan in seconds. The QuorumLossWaitDuration for ImageStoreService. |
| StandByReplicaKeepDuration | Time in seconds, default is 3600.0 * 2 | Specify timespan in seconds. The StandByReplicaKeepDuration for ImageStoreService. |
| PlacementConstraints | string, default is "" | The PlacementConstraints for ImageStoreService. |
| ClientUploadTimeout | Time in seconds, default is 1800 |Specify timespan in seconds. Timeout value for top-level upload request to Image Store Service. |
| ClientCopyTimeout | Time in seconds, default is 1800 | Specify timespan in seconds. Timeout value for top-level copy request to Image Store Service. |
| ClientDownloadTimeout | Time in seconds, default is 1800 | Specify timespan in seconds. Timeout value for top-level download request to Image Store Service |
| ClientListTimeout | Time in seconds, default is 600 | Specify timespan in seconds. Timeout value for top-level list request to Image Store Service. |
| ClientDefaultTimeout | Time in seconds, default is 180 | Specify timespan in seconds. Timeout value for all non-upload/non-download requests (e.g. exists; delete) to Image Store Service. |

### Section Name: ImageStoreClient
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ClientUploadTimeout |Time in seconds, default is 1800 | Specify timespan in seconds. Timeout value for top-level upload request to Image Store Service. |
| ClientCopyTimeout | Time in seconds, default is 1800 | Specify timespan in seconds. Timeout value for top-level copy request to Image Store Service. |
|ClientDownloadTimeout | Time in seconds, default is 1800 | Specify timespan in seconds. Timeout value for top-level download request to Image Store Service. |
|ClientListTimeout | Time in seconds, default is 600 |Specify timespan in seconds. Timeout value for top-level list request to Image Store Service. |
|ClientDefaultTimeout | Time in seconds, default is 180 | Specify timespan in seconds. Timeout value for all non-upload/non-download requests (e.g. exists; delete) to Image Store Service. |

### Section Name: TokenValidationService
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| Providers |string, default is "DSTS" |Comma separated list of token validation providers to enable (valid providers are: DSTS; AAD). Currently only a single provider can be enabled at any time. |

### Section Name: UpgradeOrchestrationService
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| TargetReplicaSetSize |Int, default is 0 |The TargetReplicaSetSize for UpgradeOrchestrationService. |
| MinReplicaSetSize |Int, default is 0 | The MinReplicaSetSize for UpgradeOrchestrationService.
| ReplicaRestartWaitDuration | Time in seconds, default is 60 minutes| Specify timespan in seconds. The ReplicaRestartWaitDuration for UpgradeOrchestrationService. |
| QuorumLossWaitDuration | Time in seconds, default is MaxValue | Specify timespan in seconds. The QuorumLossWaitDuration for UpgradeOrchestrationService. |
| StandByReplicaKeepDuration | Time in seconds, default is 60*24*7 minutes | Specify timespan in seconds. The StandByReplicaKeepDuration for UpgradeOrchestrationService. |
| PlacementConstraints | string, default is "" | The PlacementConstraints for UpgradeOrchestrationService. |
| AutoupgradeEnabled | Bool, default is true | Automatic polling and upgrade action based on a goal-state file. |
| UpgradeApprovalRequired | Bool, default is false | Setting to make code upgrade require administrator approval before proceeding. |

### Section Name: UpgradeService
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| PlacementConstraints |string, default is "" |The PlacementConstraints for Upgrade service. |
| TargetReplicaSetSize | Int, default is 3 | The TargetReplicaSetSize for UpgradeService. |
| MinReplicaSetSize | Int, default is 2 | The MinReplicaSetSize for UpgradeService. |
| CoordinatorType | string, default is "WUTest"| The CoordinatorType for UpgradeService. |
| BaseUrl | string, default is "" |BaseUrl for UpgradeService. |
| ClusterId | string, default is "" | ClusterId for UpgradeService. |
| X509StoreName | string, default is "My"| X509StoreName for UpgradeService. |
| X509StoreLocation | string, default is "" | X509StoreLocation for UpgradeService. |
| X509FindType | string, default is ""| X509FindType for UpgradeService. |
| X509FindValue | string, default is "" | X509FindValue for UpgradeService. |
| X509SecondaryFindValue | string, default is "" | X509SecondaryFindValue for UpgradeService. |
| OnlyBaseUpgrade | Bool, default is false | OnlyBaseUpgrade for UpgradeService. |
| TestCabFolder | string, default is "" | TestCabFolder for UpgradeService. |

### Section Name: Security/ClientAccess
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| CreateName |string, default is "Admin" |Security configuration for Naming URI creation. |
| DeleteName |string, default is "Admin" |Security configuration for Naming URI deletion. |
| PropertyWriteBatch |string, default is "Admin" |Security configuration for Naming property write operations. |
| CreateService |string, default is "Admin" | Security configuration for service creation. |
| CreateServiceFromTemplate |string, default is "Admin" |Security configuration for service creatin from template. |
| UpdateService |string, default is "Admin" |Security configuration for service updates. |
| DeleteService  |string, default is "Admin" |Security configuration for service deletion. |
| ProvisionApplicationType |string, default is "Admin" | Security configuration for application type provisioning. |
| CreateApplication |string, default is "Admin" | Security configuration for application creation. |
| DeleteApplication |string, default is "Admin" | Security configuration for application deletion. |
| UpgradeApplication |string, default is "Admin" | Security configuration for starting or interrupting application upgrades. |
| RollbackApplicationUpgrade |string, default is "Admin" | Security configuration for rolling back application upgrades. |
| UnprovisionApplicationType |string, default is "Admin" | Security configuration for application type unprovisioning. |
| MoveNextUpgradeDomain |string, default is "Admin" | Security configuration for resuming application upgrades with an explicit Upgrade Domain. |
| ReportUpgradeHealth |string, default is "Admin" | Security configuration for resuming application upgrades with the current upgrade progress. |
| ReportHealth |string, default is "Admin" | Security configuration for reporting health. |
| ProvisionFabric |string, default is "Admin" | Security configuration for MSI and/or Cluster Manifest provisioning. |
| UpgradeFabric |string, default is "Admin" | Security configuration for starting cluster upgrades. |
| RollbackFabricUpgrade |string, default is "Admin" | Security configuration for rolling back cluster upgrades. |
| UnprovisionFabric |string, default is "Admin" | Security configuration for MSI and/or Cluster Manifest unprovisioning. |
| MoveNextFabricUpgradeDomain |string, default is "Admin" | Security configuration for resuming cluster upgrades with an explicity Upgrade Domain. |
| ReportFabricUpgradeHealth |string, default is "Admin" | Security configuration for resuming cluster upgrades with the current upgrade progress. |
| StartInfrastructureTask |string, default is "Admin" | Security configuration for starting infrastructure tasks. |
| FinishInfrastructureTask |string, default is "Admin" | Security configuration for finishing infrastructure tasks. |
| ActivateNode |string, default is "Admin" | Security configuration for activation a node. |
| DeactivateNode |string, default is "Admin" | Security configuration for deactivating a node. |
| DeactivateNodesBatch |string, default is "Admin" | Security configuration for deactivating multiple nodes. |
| RemoveNodeDeactivations |string, default is "Admin" | Security configuration for reverting deactivation on multiple nodes. |
| GetNodeDeactivationStatus |string, default is "Admin" | Security configuration for checking deactivation status. |
| NodeStateRemoved |string, default is "Admin" | Security configuration for reporting node state removed. |
| RecoverPartition |string, default is "Admin" | Security configuration for recovering a partition. |
| RecoverPartitions |string, default is "Admin" | Security configuration for recovering partitions. |
| RecoverServicePartitions |string, default is "Admin" | Security configuration for recovering service partitions. |
| RecoverSystemPartitions |string, default is "Admin" | Security configuration for recovering system service partitions. |
| ReportFault |string, default is "Admin" | Security configuration for reporting fault. |
| InvokeInfrastructureCommand |string, default is "Admin" | Security configuration for infrastructure task management commands. |
| FileContent |string, default is "Admin" | Security configuration for image store client file transfer (external to cluster). |
| FileDownload |string, default is "Admin" | Security configuration for image store client file download initiation (external to cluster). |
| InternalList |string, default is "Admin" | Security configuration for image store client file list operation (internal). |
| Delete |string, default is "Admin" | Security configuration for image store client delete operation. |
| Upload |string, default is "Admin" | Security configuration for image store client upload operation. |
| GetStagingLocation |string, default is "Admin" | Security configuration for image store client staging location retrieval. |
| GetStoreLocation |string, default is "Admin" | Security configuration for image store client store location retrieval. |
| NodeControl |string, default is "Admin" | Security configuration for starting; stopping; and restarting nodes. |
| CodePackageControl |string, default is "Admin" | Security configuration for restarting code packages. |
| UnreliableTransportControl |string, default is "Admin" | Unreliable Transport for adding and removing behaviors. |
| MoveReplicaControl |string, default is "Admin" | Move replica. |
| PredeployPackageToNode |string, default is "Admin" | Predeployment api. |
| StartPartitionDataLoss |string, default is "Admin" | Induces data loss on a partition. |
| StartPartitionQuorumLoss |string, default is "Admin" | Induces quorum loss on a partition. |
| StartPartitionRestart |string, default is "Admin" | Simultaneously restarts some or all the replicas of a partition. |
| CancelTestCommand |string, default is "Admin" | Cancels a specific TestCommand - if it is in flight. |
| StartChaos |string, default is "Admin" | Starts Chaos - if it is not already started. |
| StopChaos |string, default is "Admin" | Stops Chaos - if it has been started. |
| StartNodeTransition |string, default is "Admin" | Security configuration for starting a node transition. |
| StartClusterConfigurationUpgrade |string, default is "Admin" | Induces StartClusterConfigurationUpgrade on a partition. |
| GetUpgradesPendingApproval |string, default is "Admin" | Induces GetUpgradesPendingApproval on a partition. |
| StartApprovedUpgrades |string, default is "Admin" | Induces StartApprovedUpgrades on a partition. |
| Ping |string, default is "Admin\|\|User" | Security configuration for client pings. |
| Query |string, default is "Admin\|\|User" | Security configuration for queries. |
| NameExists |string, default is "Admin\|\|User" | Security configuration for Naming URI existence checks. |
| EnumerateSubnames |string, default is "Admin\|\|User" | Security configuration for Naming URI enumeration. |
| EnumerateProperties |string, default is "Admin\|\|User" | Security configuration for Naming property enumeration. |
| PropertyReadBatch |string, default is "Admin\|\|User" | Security configuration for Naming property read operations. |
| GetServiceDescription |string, default is "Admin\|\|User" | Security configuration for long-poll service notifications and reading service descriptions. |
| ResolveService |string, default is "Admin\|\|User" | Security configuration for complaint-based service resolution. |
| ResolveNameOwner |string, default is "Admin\|\|User" | Security configuration for resolving Naming URI owner. |
| ResolvePartition |string, default is "Admin\|\|User" | Security configuration for resolving system services. |
| ServiceNotifications |string, default is "Admin\|\|User" | Security configuration for event-based service notifications. |
| PrefixResolveService |string, default is "Admin\|\|User" | Security configuration for complaint-based service prefix resolution. |
| GetUpgradeStatus |string, default is "Admin\|\|User" | Security configuration for polling application upgrade status. |
| GetFabricUpgradeStatus |string, default is "Admin\|\|User" | Security configuration for polling cluster upgrade status. |
| InvokeInfrastructureQuery |string, default is "Admin\|\|User" | Security configuration for querying infrastructure tasks. |
| List |string, default is "Admin\|\|User" | Security configuration for image store client file list operation. |
| ResetPartitionLoad |string, default is "Admin\|\|User" | Security configuration for reset load for a failoverUnit. |
| ToggleVerboseServicePlacementHealthReporting | string, default is "Admin\|\|User" | Security configuration for Toggling Verbose ServicePlacement HealthReporting. |
| GetPartitionDataLossProgress | string, default is "Admin\|\|User" | Fetches the progress for an invoke data loss api call. |
| GetPartitionQuorumLossProgress | string, default is "Admin\|\|User" | Fetches the progress for an invoke quorum loss api call. |
| GetPartitionRestartProgress | string, default is "Admin\|\|User" | Fetches the progress for a restart partition api call. |
| GetChaosReport | string, default is "Admin\|\|User" | Fetches the status of Chaos within a given time range. |
| GetNodeTransitionProgress | string, default is "Admin\|\|User" | Security configuration for getting progress on a node transition command. |
| GetClusterConfigurationUpgradeStatus | string, default is "Admin\|\|User" | Induces GetClusterConfigurationUpgradeStatus on a partition. |
| GetClusterConfiguration | string, default is "Admin\|\|User" | Induces GetClusterConfiguration on a partition. |

### Section Name: ReconfigurationAgent
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ApplicationUpgradeMaxReplicaCloseDuration | Time in seconds, default is 900 |Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close. |
| ServiceApiHealthDuration | Time in seconds, default is 30 minutes | Specify timespan in seconds. ServiceApiHealthDuration defines how long do we wait for a service API to run before we report it unhealthy. |
| ServiceReconfigurationApiHealthDuration | Time in seconds, default is 30 | Specify timespan in seconds. ServiceReconfigurationApiHealthDuration defines how long the before a service in reconfiguration is reported as unhealthy. |
| PeriodicApiSlowTraceInterval | Time in seconds, default is 5 minutes | Specify timespan in seconds. PeriodicApiSlowTraceInterval defines the interval over which slow API calls will be retraced by the API monitor. |
| NodeDeactivationMaxReplicaCloseDuration | Time in seconds, default is 900 | Specify timespan in seconds. The maximum time to wait before terminating a service host that is blocking node deactivation. |
| FabricUpgradeMaxReplicaCloseDuration | Time in seconds, default is 900 | Specify timespan in seconds. The maximum duration RA will wait before terminating service host of replica that is not closing. |
| IsDeactivationInfoEnabled | Bool, default is true | Determines whether RA will use deactivation info for performing primary re-election For new clusters this configuration should be set to true For existing clusters that are being upgraded please see the release notes on how to enable this. |

### Section Name: PlacementAndLoadBalancing
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| TraceCRMReasons |Bool, default is true |Specifies whether to trace reasons for CRM issued movements to the operational events channel. |
| ValidatePlacementConstraint | Bool, default is true | Specifies whether or not the PlacementConstraint expression for a service is validated when a service's ServiceDescription is updated. |
| PlacementConstraintValidationCacheSize | Int, default is 10000 | Limits the size of the table used for quick validation and caching of Placement Constraint Expressions. |
|VerboseHealthReportLimit | Int, default is 20 | Defines the number of times a replica has to go unplaced before a health warning is reported for it (if verbose health reporting is enabled). |
|ConstraintViolationHealthReportLimit | Int, default is 50 | Defines the number of times constraint violating replica has to be persistently unfixed before diagnostics are conducted and health reports are emitted. |
|DetailedConstraintViolationHealthReportLimit | Int, default is 200 | Defines the number of times constraint violating replica has to be persistently unfixed before diagnostics are conducted and detailed health reports are emitted. |
|DetailedVerboseHealthReportLimit | Int, default is 200 | Defines the number of times an unplaced replica has to be persistently unplaced before detailed health reports are emitted. |
|ConsecutiveDroppedMovementsHealthReportLimit | Int, default is 20 | Defines the number of consecutive times that ResourceBalancer-issued Movements are dropped before diagnostics are conducted and health warnings are emitted. Negative: No Warnings Emitted under this condition. |
|DetailedNodeListLimit | Int, default is 15 | Defines the number of nodes per constraint to include before truncation in the Unplaced Replica reports. |
|DetailedPartitionListLimit | Int, default is 15 | Defines the number of partitions per diagnostic entry for a constraint to include before truncation in  Diagnostics. |
|DetailedDiagnosticsInfoListLimit | Int, default is 15 | Defines the number of diagnostic entries (with detailed information) per constraint to include before truncation in  Diagnostics.|
|PLBRefreshGap | Time in seconds, default is 1 | Specify timespan in seconds. Defines the minimum amount of time that must pass before PLB refreshes state again. |
|MinPlacementInterval | Time in seconds, default is 1 | Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive placement rounds. |
|MinConstraintCheckInterval | Time in seconds, default is 1 | Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive constraint check rounds. |
|MinLoadBalancingInterval | Time in seconds, default is 5 | Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive balancing rounds. |
|BalancingDelayAfterNodeDown | Time in seconds, default is 120 |Specify timespan in seconds. Do not start balancing activities within this period after a node down event. |
|BalancingDelayAfterNewNode | Time in seconds, default is 120 |Specify timespan in seconds. Do not start balancing activities within this period after adding a new node. |
|ConstraintFixPartialDelayAfterNodeDown | Time in seconds, default is 120 | Specify timespan in seconds. Do not Fix FaultDomain and UpgradeDomain constraint violations within this period after a node down event. |
|ConstraintFixPartialDelayAfterNewNode | Time in seconds, default is 120 | Specify timespan in seconds. DDo not Fix FaultDomain and UpgradeDomain constraint violations within this period after adding a new node. |
|GlobalMovementThrottleThreshold | Uint, default is 1000 | Maximum number of movements allowed in the Balancing Phase in the past interval indicated by GlobalMovementThrottleCountingInterval. |
|GlobalMovementThrottleThresholdForPlacement | Uint, default is 0 | Maximum number of movements allowed in Placement Phase in the past interval indicated by GlobalMovementThrottleCountingInterval.0 indicates no limit.|
|GlobalMovementThrottleThresholdForBalancing | Uint, default is 0 | Maximum number of movements allowed in Balancing Phase in the past interval indicated by GlobalMovementThrottleCountingInterval. 0 indicates no limit. |
|GlobalMovementThrottleCountingInterval | Time in seconds, default is 600 | Specify timespan in seconds. Indicate the length of the past interval for which to track per domain replica movements (used along with GlobalMovementThrottleThreshold). Can be set to 0 to ignore global throttling altogether. |
|MovementPerPartitionThrottleThreshold | Uint, default is 50 | No balancing related movement will occur for a partition if the number of balancing related movements for replicas of that partition has reached or exceeded MovementPerFailoverUnitThrottleThreshold in the past interval indicated by MovementPerPartitionThrottleCountingInterval. |
|MovementPerPartitionThrottleCountingInterval | Time in seconds, default is 600 | Specify timespan in seconds. Indicate the length of the past interval for which to track replica movements for each partition (used along with MovementPerPartitionThrottleThreshold). |
|PlacementSearchTimeout | Time in seconds, default is 0.5 | Specify timespan in seconds. When placing services; search for at most this long before returning a result. |
|UseMoveCostReports | Bool, default is false | Instructs the LB to ignore the cost element of the scoring function; resulting potentially large number of moves for better balanced placement. |
|PreventTransientOvercommit | Bool, default is false | Determines should PLB immediately count on resources that will be freed up by the initiated moves. By default; PLB can initiate move out and move in on the same node which can create transient overcommit. Setting this parameter to true will prevent those kind of overcommits and on-demand defrag (aka placementWithMove) will be disabled. |
|InBuildThrottlingEnabled | Bool, default is false | Determine whether the in-build throttling is enabled. |
|InBuildThrottlingAssociatedMetric | string, default is "" | The associated metric name for this throttling. |
|InBuildThrottlingGlobalMaxValue | Int, default is 0 |The maximal number of in-build replicas allowed globally. |
|SwapPrimaryThrottlingEnabled | Bool, default is false| Determine whether the swap-primary throttling is enabled. |
|SwapPrimaryThrottlingAssociatedMetric | string, default is ""| The associated metric name for this throttling. |
|SwapPrimaryThrottlingGlobalMaxValue | Int, default is 0 | The maximal number of swap-primary replicas allowed globally. |
|PlacementConstraintPriority | Int, default is 0 | Determines the priority of placement constraint: 0: Hard; 1: Soft; negative: Ignore. |
|PreferredLocationConstraintPriority | Int, default is 2| Determines the priority of preferred location constraint: 0: Hard; 1: Soft; 2: Optimization; negative: Ignore |
|CapacityConstraintPriority | Int, default is 0 | Determines the priority of capacity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|AffinityConstraintPriority | Int, default is 0 | Determines the priority of affinity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|FaultDomainConstraintPriority | Int, default is 0 | Determines the priority of fault domain constraint: 0: Hard; 1: Soft; negative: Ignore. |
|UpgradeDomainConstraintPriority | Int, default is 1| Determines the priority of upgrade domain constraint: 0: Hard; 1: Soft; negative: Ignore. |
|ScaleoutCountConstraintPriority | Int, default is 0 | Determines the priority of scaleout count constraint: 0: Hard; 1: Soft; negative: Ignore. |
|ApplicationCapacityConstraintPriority | Int, default is 0 | Determines the priority of capacity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|MoveParentToFixAffinityViolation | Bool, default is false | Setting which determines if parent replicas can be moved to fix affinity constraints.|
|MoveExistingReplicaForPlacement | Bool, default is true |Setting which determines if to move existing replica during placement. |
|UseSeparateSecondaryLoad | Bool, default is true | Setting which determines if use different secondary load. |
|PlaceChildWithoutParent | Bool, default is true | Setting which determines if child service replica can be placed if no parent replica is up. |
|PartiallyPlaceServices | Bool, default is true | Determines if all service replicas in cluster will be placed "all or nothing" given limited suitable nodes for them.|
|InterruptBalancingForAllFailoverUnitUpdates | Bool, default is false | Determines if any type of failover unit update should interrupt fast or slow balancing run. With specified "false" balancing run will be interrupted if FailoverUnit:  is created/deleted; has missing replicas; changed primary replica location or changed number of replicas. Balancing run will NOT be interrupted in other cases - if FailoverUnit:  has extra replicas; changed any replica flag; changed only partition version or any other case. |

### Section Name: Security
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ClusterProtectionLevel |None or EncryptAndSign |None (default) for unsecured clusters, EncryptAndSign for secure clusters. |

### Section Name: Hosting
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| ServiceTypeRegistrationTimeout |Time in Seconds, default is 300 |Maximum time allowed for the ServiceType to be  registered with fabric |
| ServiceTypeDisableFailureThreshold |Whole number, default is 1 |This is the threshold for the failure count after which FailoverManager (FM) is notified to disable the service type on that node and try a different node for placement. |
| ActivationRetryBackoffInterval |Time in Seconds, default is 5 |Backoff interval on every activation failure; On every continuous activation failure, the system retries the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval. |
| ActivationMaxRetryInterval |Time in seconds, default is 300 |On every continuous activation failure, the system retries the activation for up to ActivationMaxFailureCount. ActivationMaxRetryInterval specifies Wait time interval before retry after every activation failure |
| ActivationMaxFailureCount |Whole number, default is 10 |Number of times system retries failed activation before giving up |

### Section Name: FailoverManager
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| PeriodicLoadPersistInterval |Time in seconds, default is 10 |This determines how often the FM check for new load reports |

### Section Name: Federation
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| LeaseDuration |Time in seconds, default is 30 |Duration that a lease lasts between a node and its neighbors. |
| LeaseDurationAcrossFaultDomain |Time in seconds, default is 30 |Duration that a lease lasts between a node and its neighbors across fault domains. |

### Section Name: ClusterManager
| **Parameter** | **Allowed Values** | **Guidance or short Description** |
| --- | --- | --- |
| UpgradeStatusPollInterval |Time in seconds, default is 60 |The frequency of polling for application upgrade status. This value determines the rate of update for any GetApplicationUpgradeProgress call |
| UpgradeHealthCheckInterval |Time in seconds, default is 60 |The frequency of health status checks during a monitored application upgrades |
| FabricUpgradeStatusPollInterval |Time in seconds, default is 60 |The frequency of polling for Fabric upgrade status. This value determines the rate of update for any GetFabricUpgradeProgress call |
| FabricUpgradeHealthCheckInterval |Time in seconds, default is 60 |The frequency of health status check during a  monitored Fabric upgrade |
|InfrastructureTaskProcessingInterval | Time in seconds, default is 10 |Specify timespan in seconds. The processing interval used by the infrastructure task processing state machine. |
|TargetReplicaSetSize |Int, default is 7 |The TargetReplicaSetSize for ClusterManager. |
|MinReplicaSetSize |Int, default is 3 |The MinReplicaSetSize for ClusterManager. |
|ReplicaRestartWaitDuration |Time in seconds, default is (60.0 * 30)|Specify timespan in seconds. The ReplicaRestartWaitDuration for ClusterManager. |
|QuorumLossWaitDuration |Time in seconds, default is MaxValue | Specify timespan in seconds. The QuorumLossWaitDuration for ClusterManager. |
|StandByReplicaKeepDuration | Time in seconds, default is (3600.0 * 2)|Specify timespan in seconds. The StandByReplicaKeepDuration for ClusterManager. |
|PlacementConstraints | string, default is "" |The PlacementConstraints for ClusterManager. |
|SkipRollbackUpdateDefaultService | Bool, default is false |The CM will skip reverting updated default services during application upgrade rollback. |
|EnableDefaultServicesUpgrade | Bool, default is false |Enable upgrading default services during application upgrade. Default service descriptions would be overwritten after upgrade. |
|InfrastructureTaskHealthCheckWaitDuration |Time in seconds, default is 0| Specify timespan in seconds. The amount of time to wait before starting health checks after post-processing an infrastructure task. |
|InfrastructureTaskHealthCheckStableDuration | Time in seconds, default is 0| Specify timespan in seconds. The amount of time to observe consecutive passed health checks before post-processing of an infrastructure task finishes successfully. Observing a failed health check will reset this timer. |
|InfrastructureTaskHealthCheckRetryTimeout | Time in seconds, default is 60 |Specify timespan in seconds. The amount of time to spend retrying failed health checks while post-processing an infrastructure task. Observing a passed health check will reset this timer. |
|ImageBuilderTimeoutBuffer |Time in seconds, default is 3 |Specify timespan in seconds. The amount of time to allow for Image Builder specific timeout errors to return to the client. If this buffer is too small; then the client times out before the server and gets a generic timeout error. |
|MinOperationTimeout | Time in seconds, default is 60 |Specify timespan in seconds. The minimum global timeout for internally processing operations on ClusterManager. |
|MaxOperationTimeout |Time in seconds, default is MaxValue | Specify timespan in seconds. The maximum global timeout for internally processing operations on ClusterManager. |
|MaxTimeoutRetryBuffer | Time in seconds, default is 600 |Specify timespan in seconds. The maximum operation timeout when internally retrying due to timeouts is <Original Timeout> + <MaxTimeoutRetryBuffer>. Additional timeout is added in increments of MinOperationTimeout. |
|MaxCommunicationTimeout |Time in seconds, default is 600 |Specify timespan in seconds. The maximum timeout for internal communications between ClusterManager and other system services (i.e.; Naming Service; Failover Manager and etc). This timeout should be smaller than global MaxOperationTimeout (as there might be multiple communications between system components for each client operation). |
|MaxDataMigrationTimeout |Time in seconds, default is 600 |Specify timespan in seconds. The maximum timeout for data migration recovery operations after a Fabric upgrade has taken place. |
|MaxOperationRetryDelay |Time in seconds, default is 5| Specify timespan in seconds. The maximum delay for internal retries when failures are encountered. |
|ReplicaSetCheckTimeoutRollbackOverride |Time in seconds, default is 1200 | Specify timespan in seconds. If ReplicaSetCheckTimeout is set to the maximum value of DWORD; then it's overridden with the value of this config for the purposes of rollback. The value used for rollforward is never overridden. |
|ImageBuilderJobQueueThrottle |Int, default is 10 |Thread count throttle for Image Builder proxy job queue on application requests. |

## Next steps
Read these articles for more information on cluster management:

[Add, Roll over, remove certificates from your Azure cluster ](service-fabric-cluster-security-update-certs-azure.md) 

