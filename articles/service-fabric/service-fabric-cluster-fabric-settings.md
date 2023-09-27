---
title: Change Azure Service Fabric cluster settings 
description: This article describes the fabric settings and the fabric upgrade policies that you can customize.
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Customize Service Fabric cluster settings
This article describes the various fabric settings for your Service Fabric cluster that you can customize. For clusters hosted in Azure, you can customize settings through the [Azure portal](https://portal.azure.com) or by using an Azure Resource Manager template. For more information, see [Upgrade the configuration of an Azure cluster](service-fabric-cluster-config-upgrade-azure.md). For standalone clusters, you customize settings by updating the *ClusterConfig.json* file and performing a configuration upgrade on your cluster. For more information, see [Upgrade the configuration of a standalone cluster](service-fabric-cluster-config-upgrade-windows-server.md).

There are three different upgrade policies:

- **Dynamic** – Changes to a dynamic configuration don't cause any process restarts of either Service Fabric processes or your service host processes. 
- **Static** – Changes to a static configuration cause the Service Fabric node to restart in order to consume the change. Services on the nodes is restarted.
- **NotAllowed** – These settings cannot be modified. Changing these settings requires that the cluster be destroyed and a new cluster created. 

The following is a list of Fabric settings that you can customize, organized by section.

## ApplicationGateway/Http

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ApplicationCertificateValidationPolicy|string, default is "None"|Static| This doesn't validate the server certificate; succeed the request. Refer to config ServiceCertificateThumbprints for the comma-separated list of thumbprints of the remote certs that the reverse proxy can trust. Refer to config ServiceCommonNameAndIssuer for the subject name and issuer thumbprint of the remote certs that the reverse proxy can trust. To learn more, see [Reverse proxy secure connection](service-fabric-reverseproxy-configure-secure-communication.md#secure-connection-establishment-between-the-reverse-proxy-and-services). |
|BodyChunkSize |Uint, default is 16384 |Dynamic| Gives the size of for the chunk in bytes used to read the body. |
|CrlCheckingFlag|uint, default is 0x40000000 |Dynamic| Flags for application/service certificate chain validation; e.g. CRL checking 0x10000000 CERT_CHAIN_REVOCATION_CHECK_END_CERT 0x20000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN 0x40000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN_EXCLUDE_ROOT 0x80000000 CERT_CHAIN_REVOCATION_CHECK_CACHE_ONLY Setting to 0 disables CRL checking Full list of supported values is documented by dwFlags of CertGetCertificateChain: https://msdn.microsoft.com/library/windows/desktop/aa376078(v=vs.85).aspx  |
|DefaultHttpRequestTimeout |Time in seconds. default is 120 |Dynamic|Specify timespan in seconds.  Gives the default request timeout for the http requests being processed in the http app gateway. |
|ForwardClientCertificate|bool, default is FALSE|Dynamic|When set to false, reverse proxy won't request for the client certificate. When set to true, reverse proxy requests for the client certificate during the TLS handshake and forward the base64 encoded PEM format string to the service in a header named X-Client-Certificate. The service can fail the request with appropriate status code after inspecting the certificate data. If this is true and client doesn't present a certificate, reverse proxy forwards an empty header and let the service handle the case. Reverse proxy acts as a transparent layer. To learn more, see [Set up client certificate authentication](service-fabric-reverseproxy-configure-secure-communication.md#setting-up-client-certificate-authentication-through-the-reverse-proxy). |
|GatewayAuthCredentialType |string, default is "None" |Static| Indicates the type of security credentials to use at the http app gateway endpoint Valid values are None/X509. |
|GatewayX509CertificateFindType |string, default is "FindByThumbprint" |Dynamic| Indicates how to search for certificate in the store specified by GatewayX509CertificateStoreName Supported value: FindByThumbprint; FindBySubjectName. |
|GatewayX509CertificateFindValue | string, default is "" |Dynamic| Search filter value used to locate the http app gateway certificate. This certificate is configured on the https endpoint and can also be used to verify the identity of the app if needed by the services. FindValue is looked up first; and if that doesn't exist; FindValueSecondary is looked up. |
|GatewayX509CertificateFindValueSecondary | string, default is "" |Dynamic|Search filter value used to locate the http app gateway certificate. This certificate is configured on the https endpoint and can also be used to verify the identity of the app if needed by the services. FindValue is looked up first; and if that doesn't exist; FindValueSecondary is looked up.|
|GatewayX509CertificateStoreName |string, default is "My" |Dynamic| Name of X.509 certificate store that contains certificate for http app gateway. |
|HttpRequestConnectTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(5)|Dynamic|Specify timespan in seconds.  Gives the connect timeout for the http requests being sent from the http app gateway.  |
|IgnoreCrlOfflineError|bool, default is TRUE|Dynamic|Whether to ignore CRL offline error for application/service certificate verification. |
|IsEnabled |Bool, default is false |Static| Enables/Disables the HttpApplicationGateway. HttpApplicationGateway is disabled by default and this config needs to be set to enable it. |
|NumberOfParallelOperations | Uint, default is 5000 |Static|Number of reads to post to the http server queue. This controls the number of concurrent requests that can be satisfied by the HttpGateway. |
|RemoveServiceResponseHeaders|string, default is "Date; Server"|Static|Semi colon/ comma-separated list of response headers that is removed from the service response; before forwarding it to the client. If this is set to empty string; pass all the headers returned by the service as-is. i.e don't overwrite the Date and Server |
|ResolveServiceBackoffInterval |Time in seconds, default is 5 |Dynamic|Specify timespan in seconds.  Gives the default back-off interval before retrying a failed resolve service operation. |
|SecureOnlyMode|bool, default is FALSE|Dynamic| SecureOnlyMode: true: Reverse Proxy will only forward to services that publish secure endpoints. false: Reverse Proxy can forward requests to secure/non-secure endpoints. To learn more, see [Reverse proxy endpoint selection logic](service-fabric-reverseproxy-configure-secure-communication.md#endpoint-selection-logic-when-services-expose-secure-as-well-as-unsecured-endpoints).  |
|ServiceCertificateThumbprints|string, default is ""|Dynamic|The comma-separated list of thumbprints of the remote certs that the reverse proxy can trust. To learn more, see [Reverse proxy secure connection](service-fabric-reverseproxy-configure-secure-communication.md#secure-connection-establishment-between-the-reverse-proxy-and-services). |

## ApplicationGateway/Http/ServiceCommonNameAndIssuer

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|X509NameMap, default is None|Dynamic| Subject name and issuer thumbprint of the remote certs that the reverse proxy can trust. To learn more, see [Reverse proxy secure connection](service-fabric-reverseproxy-configure-secure-communication.md#secure-connection-establishment-between-the-reverse-proxy-and-services). |

## BackupRestoreService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|MinReplicaSetSize|int, default is 0|Static|The MinReplicaSetSize for BackupRestoreService |
|PlacementConstraints|string, default is    ""|Static|    The PlacementConstraints for BackupRestore service |
|SecretEncryptionCertThumbprint|string, default is    ""|Dynamic|Thumbprint of the Secret encryption X509 certificate |
|SecretEncryptionCertX509StoreName|string, recommended value is "My" (no default) |    Dynamic|    This indicates the certificate to use for encryption and decryption of creds Name of X.509 certificate store that is used for encrypting decrypting store credentials used by Backup Restore service |
|TargetReplicaSetSize|int, default is    0|Static| The TargetReplicaSetSize for BackupRestoreService |

## CentralSecretService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|DeployedState |wstring, default is L"Disabled" |Static |2-stage removal of CSS. |
|EnableSecretMonitoring|bool, default is FALSE |Static |Must be enabled to use Managed KeyVaultReferences. Default may become true in the future. For more information, see [KeyVaultReference support for Azure-deployed Service Fabric Applications](./service-fabric-keyvault-references.md)|
|SecretMonitoringInterval|TimeSpan, default is Common::TimeSpan::FromMinutes(15) |Static |The rate at which Service Fabric polls Key Vault for changes when using Managed KeyVaultReferences. This rate is a best effort, and changes in Key Vault may be reflected in the cluster earlier or later than the interval. For more information, see [KeyVaultReference support for Azure-deployed Service Fabric Applications](./service-fabric-keyvault-references.md) |
|UpdateEncryptionCertificateTimeout |TimeSpan, default is Common::TimeSpan::MaxValue |Static |Specify timespan in seconds. The default has changed to TimeSpan::MaxValue; but overrides are still respected. May be deprecated in the future. |

## CentralSecretService/Replication

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ReplicationBatchSize|uint, default is 1|Static|Specifies the number of operations to be sent between primary and secondary replicas. If zero the primary sends one record per operation to the secondary. Otherwise the primary replica aggregates log records until the config value is reached.  This reduces network traffic.|

## ClusterManager

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AllowCustomUpgradeSortPolicies | Bool, default is false |Dynamic|Whether or not custom upgrade sort policies are allowed. This is used to perform 2-phase upgrade enabling this feature. Service Fabric 6.5 adds support for specifying sort policy for upgrade domains during cluster- or application upgrades. Supported policies are Numeric, Lexicographical, ReverseNumeric and ReverseLexicographical. The default is Numeric. To be able to use this feature, the cluster manifest setting ClusterManager/ AllowCustomUpgradeSortPolicies must be set to True as a second config upgrade step after the SF 6.5 code has completed upgrade. It is important that this is done on two phases, otherwise the code upgrade may get confused about the upgrade order during the first upgrade.|
|EnableDefaultServicesUpgrade | Bool, default is false |Dynamic|Enable upgrading default services during application upgrade. Default service descriptions would be overwritten after upgrade. |
|FabricUpgradeHealthCheckInterval |Time in seconds, default is 60 |Dynamic|The frequency of health status check during a monitored Fabric upgrade |
|FabricUpgradeStatusPollInterval |Time in seconds, default is 60 |Dynamic|The frequency of polling for Fabric upgrade status. This value determines the rate of update for any GetFabricUpgradeProgress call |
|ImageBuilderTimeoutBuffer |Time in seconds, default is 3 |Dynamic|Specify timespan in seconds. The amount of time to allow for Image Builder specific timeout errors to return to the client. If this buffer is too small; then the client times out before the server and gets a generic timeout error. |
|InfrastructureTaskHealthCheckRetryTimeout | Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The amount of time to spend retrying failed health checks while post-processing an infrastructure task. Observing a passed health check resets this timer. |
|InfrastructureTaskHealthCheckStableDuration | Time in seconds, default is 0|Dynamic| Specify timespan in seconds. The amount of time to observe consecutive passed health checks before post-processing of an infrastructure task finishes successfully. Observing a failed health check resets this timer. |
|InfrastructureTaskHealthCheckWaitDuration |Time in seconds, default is 0|Dynamic| Specify timespan in seconds. The amount of time to wait before starting health checks after post-processing an infrastructure task. |
|InfrastructureTaskProcessingInterval | Time in seconds, default is 10 |Dynamic|Specify timespan in seconds. The processing interval used by the infrastructure task processing state machine. |
|MaxCommunicationTimeout |Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum timeout for internal communications between ClusterManager and other system services (i.e.; Naming Service; Failover Manager and etc.). This timeout should be smaller than global MaxOperationTimeout (as there might be multiple communications between system components for each client operation). |
|MaxDataMigrationTimeout |Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum timeout for data migration recovery operations after a Fabric upgrade has taken place. |
|MaxOperationRetryDelay |Time in seconds, default is 5|Dynamic| Specify timespan in seconds. The maximum delay for internal retries when failures are encountered. |
|MaxOperationTimeout |Time in seconds, default is MaxValue |Dynamic| Specify timespan in seconds. The maximum global timeout for internally processing operations on ClusterManager. |
|MaxTimeoutRetryBuffer | Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum operation timeout when internally retrying due to timeouts is `<Original Time out> + <MaxTimeoutRetryBuffer>`. Additional timeout is added in increments of MinOperationTimeout. |
|MinOperationTimeout | Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The minimum global timeout for internally processing operations on ClusterManager. |
|MinReplicaSetSize |Int, default is 3 |Not Allowed|The MinReplicaSetSize for ClusterManager. |
|PlacementConstraints | string, default is "" |Not Allowed|The PlacementConstraints for ClusterManager. |
|QuorumLossWaitDuration |Time in seconds, default is MaxValue |Not Allowed| Specify timespan in seconds. The QuorumLossWaitDuration for ClusterManager. |
|ReplicaRestartWaitDuration |Time in seconds, default is (60.0 \* 30)|Not Allowed|Specify timespan in seconds. The ReplicaRestartWaitDuration for ClusterManager. |
|ReplicaSetCheckTimeoutRollbackOverride |Time in seconds, default is 1200 |Dynamic| Specify timespan in seconds. If ReplicaSetCheckTimeout is set to the maximum value of DWORD; then it's overridden with the value of this config for the purposes of rollback. The value used for roll-forward is never overridden. |
|SkipRollbackUpdateDefaultService | Bool, default is false |Dynamic|The CM skips reverting updated default services during application upgrade rollback. |
|StandByReplicaKeepDuration | Time in seconds, default is (3600.0 \* 2)|Not Allowed|Specify timespan in seconds. The StandByReplicaKeepDuration for ClusterManager. |
|TargetReplicaSetSize |Int, default is 7 |Not Allowed|The TargetReplicaSetSize for ClusterManager. |
|UpgradeHealthCheckInterval |Time in seconds, default is 60 |Dynamic|The frequency of health status checks during a monitored application upgrades |
|UpgradeStatusPollInterval |Time in seconds, default is 60 |Dynamic|The frequency of polling for application upgrade status. This value determines the rate of update for any GetApplicationUpgradeProgress call |
|CompleteClientRequest | Bool, default is false |Dynamic| Complete client request when accepted by CM. |

## ClusterManager/Replication

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ReplicationBatchSize|uint, default is 1|Static|Specifies the number of operations to be sent between primary and secondary replicas. If zero the primary sends one record per operation to the secondary. Otherwise the primary replica aggregates log records until the config value is reached.  This reduces network traffic.|

## Common

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AllowCreateUpdateMultiInstancePerNodeServices |Bool, default is false |Dynamic|Allows creation of multiple stateless instances of a service per node. This feature is currently in preview. |
|EnableAuxiliaryReplicas |Bool, default is false |Dynamic|Enable creation or update of auxiliary replicas on services. If true; upgrades from SF version 8.1+ to lower targetVersion is blocked. |
|PerfMonitorInterval |Time in seconds, default is 1 |Dynamic|Specify timespan in seconds. Performance monitoring interval. Setting to 0 or negative value disables monitoring. |

## DefragmentationEmptyNodeDistributionPolicy
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyIntegerValueMap, default is None|Dynamic|Specifies the policy defragmentation follows when emptying nodes. For a given metric 0 indicates that SF should try to defragment nodes evenly across UDs and FDs; 1 indicates only that the nodes must be defragmented |

## DefragmentationMetrics
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyBoolValueMap, default is None|Dynamic|Determines the set of metrics that should be used for defragmentation and not for load balancing. |

## DefragmentationMetricsPercentOrNumberOfEmptyNodesTriggeringThreshold
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyDoubleValueMap, default is None|Dynamic|Determines the number of free nodes which are needed to consider cluster defragmented by specifying either percent in range [0.0 - 1.0] or number of empty nodes as number >= 1.0 |

## Diagnostics

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AdminOnlyHttpAudit |Bool, default is true | Dynamic | Exclude HTTP requests, which doesn't impact the state of the cluster from auditing. Currently; only requests of "GET" type are excluded; but this is subject to change. |
|AppDiagnosticStoreAccessRequiresImpersonation |Bool, default is true | Dynamic |Whether or not impersonation is required when accessing diagnostic stores on behalf of the application. |
|AppEtwTraceDeletionAgeInDays |Int, default is 3 | Dynamic |Number of days after which we delete old ETL files containing application ETW traces. |
|ApplicationLogsFormatVersion |Int, default is 0 | Dynamic |Version for application logs format. Supported values are 0 and 1. Version 1 includes more fields from the ETW event record than version 0. |
|AuditHttpRequests |Bool, default is false | Dynamic | Turn HTTP auditing on or off. The purpose of auditing is to see the activities that have been performed against the cluster; including who initiated the request. Note that this is a best attempt logging; and trace loss may occur. HTTP requests with "User" authentication is not recorded. |
|CaptureHttpTelemetry|Bool, default is true | Dynamic | Turn HTTP telemetry on or off. The purpose of telemetry is for Service Fabric to be able to capture telemetry data to help plan future work and identify problem areas. Telemetry doesn't record any personal data or the request body. Telemetry captures all HTTP requests unless otherwise configured. |
|ClusterId |String | Dynamic |The unique ID of the cluster. This is generated when the cluster is created. |
|ConsumerInstances |String | Dynamic |The list of DCA consumer instances. |
|DiskFullSafetySpaceInMB |Int, default is 1024 | Dynamic |Remaining disk space in MB to protect from use by DCA. |
|EnableCircularTraceSession |Bool, default is false | Static |Flag indicates whether circular trace sessions should be used. |
|EnablePlatformEventsFileSink |Bool, default is false | Static |Enable/Disable platform events being written to disk |
|EnableTelemetry |Bool, default is true | Dynamic |This is going to enable or disable telemetry. |
|FailuresOnlyHttpTelemetry | Bool, default is false | Dynamic | If HTTP telemetry capture is enabled; capture only failed requests. This is to help cut down on the number of events generated for telemetry. |
|HttpTelemetryCapturePercentage | int, default is 50 | Dynamic | If HTTP telemetry capture is enabled; capture only a random percentage of requests. This is to help cut down on the number of events generated for telemetry. |
|MaxDiskQuotaInMB |Int, default is 65536 | Dynamic |Disk quota in MB for Windows and Linux Fabric log files. |
|ProducerInstances |String | Dynamic |The list of DCA producer instances. |

## DnsService
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|EnablePartitionedQuery|bool, default is FALSE|Static|The flag to enable support for DNS queries for partitioned services. The feature is turned off by default. For more information, see [Service Fabric DNS Service.](service-fabric-dnsservice.md)|
|ForwarderPoolSize|Int, default is 20|Static|The number of forwarders in the forwarding pool.|
|ForwarderPoolStartPort|Int, default is 16700|Static|The start address for the forwarding pool that is used for recursive queries.|
|InstanceCount|int, default is -1|Static|Default value is -1 which means that DnsService is running on every node. OneBox needs this to be set to 1 since DnsService uses well known port 53, so it cannot have multiple instances on the same machine.|
|IsEnabled|bool, default is FALSE|Static|Enables/Disables DnsService. DnsService is disabled by default and this config needs to be set to enable it. |
|PartitionPrefix|string, default is "--"|Static|Controls the partition prefix string value in DNS queries for partitioned services. The value: <ul><li>Should be RFC-compliant as it will be part of a DNS query.</li><li>Shouldn't contain a dot, '.', as dot interferes with DNS suffix behavior.</li><li>Shouldn't be longer than 5 characters.</li><li>Cannot be an empty string.</li><li>If the PartitionPrefix setting is overridden, then PartitionSuffix must be overridden, and vice-versa.</li></ul>For more information, see [Service Fabric DNS Service.](service-fabric-dnsservice.md).|
|PartitionSuffix|string, default is ""|Static|Controls the partition suffix string value in DNS queries for partitioned services. The value: <ul><li>Should be RFC-compliant as it will be part of a DNS query.</li><li>Shouldn't contain a dot, '.', as dot interferes with DNS suffix behavior.</li><li>Shouldn't be longer than 5 characters.</li><li>If the PartitionPrefix setting is overridden, then PartitionSuffix must be overridden, and vice-versa.</li></ul>For more information, see [Service Fabric DNS Service.](service-fabric-dnsservice.md). |
|RecursiveQueryParallelMaxAttempts|Int, default is 0|Static|The number of times parallel queries are attempted. Parallel queries are executed after the max attempts for serial queries have been exhausted.|
|RecursiveQueryParallelTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(5)|Static|The timeout value in seconds for each attempted parallel query.|
|RecursiveQuerySerialMaxAttempts|Int, default is 2|Static|The number of serial queries that are attempted, at most. If this number is higher than the number of forwarding DNS servers, querying stops once all the servers have been attempted exactly once.|
|RecursiveQuerySerialTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(5)|Static|The timeout value in seconds for each attempted serial query.|
|TransientErrorMaxRetryCount|Int, default is 3|Static|Controls the number of times SF DNS will retry when a transient error occurs while calling SF APIs (e.g. when retrieving names and endpoints).|
|TransientErrorRetryIntervalInMillis|Int, default is 0|Static|Sets the delay in milliseconds between retries for when SF DNS calls SF APIs.|

## EventStoreService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|MinReplicaSetSize|int, default is 0|Static|The MinReplicaSetSize for EventStore service |
|PlacementConstraints|string, default is    ""|Static|    The PlacementConstraints for EventStore service |
|TargetReplicaSetSize|int, default is    0|Static| The TargetReplicaSetSize for EventStore service |

## FabricClient

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ConnectionInitializationTimeout |Time in seconds, default is 2 |Dynamic|Specify timespan in seconds. Connection timeout interval for each time client tries to open a connection to the gateway.|
|HealthOperationTimeout |Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. The timeout for a report message sent to Health Manager. |
|HealthReportRetrySendInterval |Time in seconds, default is 30, minimum is 1 |Dynamic|Specify timespan in seconds. The interval at which the reporting component resends accumulated health reports to Health Manager. |
|HealthReportSendInterval |Time in seconds, default is 30 |Dynamic|Specify timespan in seconds. The interval at which the reporting component sends accumulated health reports to Health Manager. |
|KeepAliveIntervalInSeconds |Int, default is 20 |Static|The interval at which the FabricClient transport sends keep-alive messages to the gateway. For 0; keepAlive is disabled. Must be a positive value. |
|MaxFileSenderThreads |Uint, default is 10 |Static|The max number of files that are transferred in parallel. |
|NodeAddresses |string, default is "" |Static|A collection of addresses (connection strings) on different nodes that can be used to communicate with the Naming Service. Initially the Client connects selecting one of the addresses randomly. If more than one connection string is supplied and a connection fails because of a communication or timeout error; the Client switches to use the next address sequentially. See the Naming Service Address retry section for details on retries semantics. |
|PartitionLocationCacheLimit |Int, default is 100000 |Static|Number of partitions cached for service resolution (set to 0 for no limit). |
|RetryBackoffInterval |Time in seconds, default is 3 |Dynamic|Specify timespan in seconds. The back-off interval before retrying the operation. |
|ServiceChangePollInterval |Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. The interval between consecutive polls for service changes from the client to the gateway for registered service change notifications callbacks. |

## FabricHost

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ActivationMaxFailureCount |Int, default is 10 |Dynamic|This is the maximum count for which system will retry failed activation before giving up. |
|ActivationMaxRetryInterval |Time in seconds, default is 300 |Dynamic|Specify timespan in seconds. Max retry interval for Activation. On every continuous failure the retry interval is calculated as Min( ActivationMaxRetryInterval; Continuous Failure Count * ActivationRetryBackoffInterval). |
|ActivationRetryBackoffInterval |Time in seconds, default is 5 |Dynamic|Specify timespan in seconds. Backoff interval on every activation failure; On every continuous activation failure the system will retry the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval. |
|EnableRestartManagement |Bool, default is false |Dynamic|This is to enable server restart. |
|EnableServiceFabricAutomaticUpdates |Bool, default is false |Dynamic|This is to enable fabric automatic update via Windows Update. |
|EnableServiceFabricBaseUpgrade |Bool, default is false |Dynamic|This is to enable base update for server. |
|FailureReportingExpeditedReportingIntervalEnabled | Bool, default is true | Static | Enables faster uploading rates in DCA when FabricHost is in Failure Reporting mode. |
|FailureReportingTimeout | TimeSpan, default is Common::TimeSpan::FromSeconds(60) | Static |Specify timespan in seconds. Timeout for DCA failure reporting in the case FabricHost encounters an early stage startup failure. | 
|RunDCAOnStartupFailure | Bool, default is true | Static |Determines whether to launch DCA to upload logs when facing startup issues in FabricHost. | 
|StartTimeout |Time in seconds, default is 300 |Dynamic|Specify timespan in seconds. Time out for fabricactivationmanager startup. |
|StopTimeout |Time in seconds, default is 300 |Dynamic|Specify timespan in seconds. The timeout for hosted service activation; deactivation and upgrade. |

## FabricNode

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ClientAuthX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for certificate in the store specified by ClientAuthX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
|ClientAuthX509FindValue |string, default is "" | Dynamic|Search filter value used to locate certificate for default admin role FabricClient. |
|ClientAuthX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate certificate for default admin role FabricClient. |
|ClientAuthX509StoreName |string, default is "My" |Dynamic|Name of the X.509 certificate store that contains certificate for default admin role FabricClient. |
|ClusterX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for cluster certificate in the store specified by ClusterX509StoreName Supported values: "FindByThumbprint"; "FindBySubjectName" With "FindBySubjectName"; when there are multiple matches; the one with the furthest expiration is used. |
|ClusterX509FindValue |string, default is "" |Dynamic|Search filter value used to locate cluster certificate. |
|ClusterX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate cluster certificate. |
|ClusterX509StoreName |string, default is "My" |Dynamic|Name of X.509 certificate store that contains cluster certificate for securing intra-cluster communication. |
|EndApplicationPortRange |Int, default is 0 |Static|End (no inclusive) of the application ports managed by hosting subsystem. Required if EndpointFilteringEnabled is true in Hosting. |
|ServerAuthX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for server certificate in the store specified by ServerAuthX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
|ServerAuthX509FindValue |string, default is "" |Dynamic|Search filter value used to locate server certificate. |
|ServerAuthX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate server certificate. |
|ServerAuthX509StoreName |string, default is "My" |Dynamic|Name of X.509 certificate store that contains server certificate for entree service. |
|StartApplicationPortRange |Int, default is 0 |Static|Start of the application ports managed by hosting subsystem. Required if EndpointFilteringEnabled is true in Hosting. |
|StateTraceInterval |Time in seconds, default is 300 |Static|Specify timespan in seconds. The interval for tracing node status on each node and up nodes on FM/FMM. |
|UserRoleClientX509FindType |string, default is "FindByThumbprint" |Dynamic|Indicates how to search for certificate in the store specified by UserRoleClientX509StoreName Supported value: FindByThumbprint; FindBySubjectName. |
|UserRoleClientX509FindValue |string, default is "" |Dynamic|Search filter value used to locate certificate for default user role FabricClient. |
|UserRoleClientX509FindValueSecondary |string, default is "" |Dynamic|Search filter value used to locate certificate for default user role FabricClient. |
|UserRoleClientX509StoreName |string, default is "My" |Dynamic|Name of the X.509 certificate store that contains certificate for default user role FabricClient. |

## Failover/Replication

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ReplicationBatchSize|uint, default is 1|Static|Specifies the number of operations to be sent between primary and secondary replicas. If zero the primary sends one record per operation to the secondary. Otherwise the primary replica aggregates log records until the config value is reached.  This reduces network traffic.|

## FailoverManager

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AllowNodeStateRemovedForSeedNode|Bool, default is FALSE |Dynamic|Flag to indicate if it's allowed to remove node state for a seed node |
|BuildReplicaTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(3600)|Dynamic|Specify timespan in seconds. The time limit for building a stateful replica; after which a warning health report will be initiated |
|ClusterPauseThreshold|int, default is 1|Dynamic|If the number of nodes in system go below this value then placement; load balancing; and failover is stopped. |
|CreateInstanceTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(300)|Dynamic|Specify timespan in seconds. The time limit for creating a stateless instance; after which a warning health report will be initiated |
|ExpectedClusterSize|int, default is 1|Dynamic|When the cluster is initially started up; the FM will wait for this many nodes to report themselves up before it begins placing other services; including the system services like naming. Increasing this value increases the time it takes a cluster to start up; but prevents the early nodes from becoming overloaded and also the additional moves that will be necessary as more nodes come online. This value should generally be set to some small fraction of the initial cluster size. |
|ExpectedNodeDeactivationDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 \* 30)|Dynamic|Specify timespan in seconds. This is the expected duration for a node to complete deactivation in. |
|ExpectedNodeFabricUpgradeDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 \* 30)|Dynamic|Specify timespan in seconds. This is the expected duration for a node to be upgraded during Windows Fabric upgrade. |
|ExpectedReplicaUpgradeDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 \* 30)|Dynamic|Specify timespan in seconds. This is the expected duration for all the replicas to be upgraded on a node during application upgrade. |
|IgnoreReplicaRestartWaitDurationWhenBelowMinReplicaSetSize|bool, default is FALSE|Dynamic|If IgnoreReplicaRestartWaitDurationWhenBelowMinReplicaSetSize is set to:<br>- false: Windows Fabric will wait for fixed time specified in ReplicaRestartWaitDuration for a replica to come back up.<br>- true: Windows Fabric will wait for fixed time specified in ReplicaRestartWaitDuration for a replica to come back up if partition is above or at Min Replica Set Size. If partition is below Min Replica Set Size new replica will be created right away.|
|IsSingletonReplicaMoveAllowedDuringUpgrade|bool, default is TRUE|Dynamic|If set to true; replicas with a target replica set size of 1 will be permitted to move during upgrade. |
|MaxInstanceCloseDelayDurationInSeconds|uint, default is 1800|Dynamic|Maximum value of InstanceCloseDelay that can be configured to be used for FabricUpgrade/ApplicationUpgrade/NodeDeactivations |
|MinReplicaSetSize|int, default is 3|Not Allowed|This is the minimum replica set size for the FM. If the number of active FM replicas drops below this value; the FM will reject changes to the cluster until at least the min number of replicas is recovered |
|PlacementConstraints|string, default is ""|Not Allowed|Any placement constraints for the failover manager replicas |
|PlacementTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(600)|Dynamic|Specify timespan in seconds. The time limit for reaching target replica count; after which a warning health report will be initiated |
|QuorumLossWaitDuration |Time in seconds, default is MaxValue |Dynamic|Specify timespan in seconds. This is the max duration for which we allow a partition to be in a state of quorum loss. If the partition is still in quorum loss after this duration; the partition is recovered from quorum loss by considering the down replicas as lost. Note that this can potentially incur data loss. |
|ReconfigurationTimeLimit|TimeSpan, default is Common::TimeSpan::FromSeconds(300)|Dynamic|Specify timespan in seconds. The time limit for reconfiguration; after which a warning health report will be initiated |
|ReplicaRestartWaitDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(60.0 \* 30)|Not Allowed|Specify timespan in seconds. This is the ReplicaRestartWaitDuration for the FMService |
| SeedNodeQuorumAdditionalBufferNodes | int, default is 0 | Dynamic | Buffer of seed nodes that is needed to be up (together with quorum of seed nodes) FM should allow a maximum of (totalNumSeedNodes - (seedNodeQuorum + SeedNodeQuorumAdditionalBufferNodes)) seed nodes to go down. |
|StandByReplicaKeepDuration|Timespan, default is Common::TimeSpan::FromSeconds(3600.0 \* 24 \* 7)|Not Allowed|Specify timespan in seconds. This is the StandByReplicaKeepDuration for the FMService |
|TargetReplicaSetSize|int, default is 7|Not Allowed|This is the target number of FM replicas that Windows Fabric will maintain. A higher number results in higher reliability of the FM data; with a small performance tradeoff. |
|UserMaxStandByReplicaCount |Int, default is 1 |Dynamic|The default max number of StandBy replicas that the system keeps for user services. |
|UserReplicaRestartWaitDuration |Time in seconds, default is 60.0 \* 30 |Dynamic|Specify timespan in seconds. When a persisted replica goes down; Windows Fabric waits for this duration for the replica to come back up before creating new replacement replicas (which would require a copy of the state). |
|UserStandByReplicaKeepDuration |Time in seconds, default is 3600.0 \* 24 \* 7 |Dynamic|Specify timespan in seconds. When a persisted replica come back from a down state; it may have already been replaced. This timer determines how long the FM will keep the standby replica before discarding it. |

## FaultAnalysisService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|CompletedActionKeepDurationInSeconds | Int, default is 604800 |Static| This is approximately how long to keep actions that are in a terminal state. This also depends on StoredActionCleanupIntervalInSeconds; since the work to clean up is only done on that interval. 604800 is 7 days. |
|DataLossCheckPollIntervalInSeconds|int, default is 5|Static|This is the time between the checks the system performs while waiting for data loss to happen. The number of times the data loss number will be checked per internal iteration is DataLossCheckWaitDurationInSeconds/this. |
|DataLossCheckWaitDurationInSeconds|int, default is 25|Static|The total amount of time; in seconds; that the system will wait for data loss to happen. This is internally used when the StartPartitionDataLossAsync() api is called. |
|MinReplicaSetSize |Int, default is 0 |Static|The MinReplicaSetSize for FaultAnalysisService. |
|PlacementConstraints | string, default is ""|Static| The PlacementConstraints for FaultAnalysisService. |
|QuorumLossWaitDuration | Time in seconds, default is MaxValue |Static|Specify timespan in seconds. The QuorumLossWaitDuration for FaultAnalysisService. |
|ReplicaDropWaitDurationInSeconds|int, default is 600|Static|This parameter is used when the data loss api is called. It controls how long the system will wait for a replica to get dropped after remove replica is internally invoked on it. |
|ReplicaRestartWaitDuration |Time in seconds, default is 60 minutes|Static|Specify timespan in seconds. The ReplicaRestartWaitDuration for FaultAnalysisService. |
|StandByReplicaKeepDuration| Time in seconds, default is (60*24*7) minutes |Static|Specify timespan in seconds. The StandByReplicaKeepDuration for FaultAnalysisService. |
|StoredActionCleanupIntervalInSeconds | Int, default is 3600 |Static|This is how often the store is cleaned up. Only actions in a terminal state; and that completed at least CompletedActionKeepDurationInSeconds ago will be removed. |
|StoredChaosEventCleanupIntervalInSeconds | Int, default is 3600 |Static|This is how often the store will be audited for cleanup; if the number of events is more than 30000; the cleanup will kick in. |
|TargetReplicaSetSize |Int, default is 0 |Static|NOT_PLATFORM_UNIX_START The TargetReplicaSetSize for FaultAnalysisService. |

## Federation

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|LeaseDuration |Time in seconds, default is 30 |Dynamic|Duration that a lease lasts between a node and its neighbors. |
|LeaseDurationAcrossFaultDomain |Time in seconds, default is 30 |Dynamic|Duration that a lease lasts between a node and its neighbors across fault domains. |

## FileStoreService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AcceptChunkUpload|Bool, default is TRUE|Dynamic|Config to determine whether file store service accepts chunk based file upload or not during copy application package. |
|AnonymousAccessEnabled | Bool, default is true |Static|Enable/Disable anonymous access to the FileStoreService shares. |
|CommonName1Ntlmx509CommonName|string, default is ""|Static| The common name of the X509 certificate used to generate HMAC on the CommonName1NtlmPasswordSecret when using NTLM authentication |
|CommonName1Ntlmx509StoreLocation|string, default is "LocalMachine"|Static|The store location of the X509 certificate used to generate HMAC on the CommonName1NtlmPasswordSecret when using NTLM authentication |
|CommonName1Ntlmx509StoreName|string, default is "MY"| Static|The store name of the X509 certificate used to generate HMAC on the CommonName1NtlmPasswordSecret when using NTLM authentication |
|CommonName2Ntlmx509CommonName|string, default is ""|Static|The common name of the X509 certificate used to generate HMAC on the CommonName2NtlmPasswordSecret when using NTLM authentication |
|CommonName2Ntlmx509StoreLocation|string, default is "LocalMachine"| Static|The store location of the X509 certificate used to generate HMAC on the CommonName2NtlmPasswordSecret when using NTLM authentication |
|CommonName2Ntlmx509StoreName|string, default is "MY"|Static| The store name of the X509 certificate used to generate HMAC on the CommonName2NtlmPasswordSecret when using NTLM authentication |
|CommonNameNtlmPasswordSecret|SecureString, default is Common::SecureString("")| Static|The password secret which used as seed to generated same password when using NTLM authentication |
|DiskSpaceHealthReportingIntervalWhenCloseToOutOfDiskSpace |TimeSpan, default is Common::TimeSpan::FromMinutes(5)|Dynamic|Specify timespan in seconds. The time interval between checking of disk space for reporting health event when disk is close to out of space. |
|DiskSpaceHealthReportingIntervalWhenEnoughDiskSpace |TimeSpan, default is Common::TimeSpan::FromMinutes(15)|Dynamic|Specify timespan in seconds. The time interval between checking of disk space for reporting health event when there is enough space on disk. |
|EnableImageStoreHealthReporting |bool, default is TRUE    |Static|Config to determine whether file store service should report its health. |
|FreeDiskSpaceNotificationSizeInKB|int64, default is 25\*1024 |Dynamic|The size of free disk space below which health warning may occur. Minimum values of this config and FreeDiskSpaceNotificationThresholdPercentage config are used to determine sending of the health warning. |
|FreeDiskSpaceNotificationThresholdPercentage|double, default is 0.02 |Dynamic|The percentage of free disk space below which health warning may occur. Minimum value of this config and FreeDiskSpaceNotificationInMB config are used to determine sending of health warning. |
|GenerateV1CommonNameAccount| bool, default is TRUE|Static|Specifies whether to generate an account with user name V1 generation algorithm. Starting with Service Fabric version 6.1; an account with v2 generation is always created. The V1 account is necessary for upgrades from/to versions that don't support V2 generation (prior to 6.1).|
|MaxCopyOperationThreads | Uint, default is 0 |Dynamic| The maximum number of parallel files that secondary can copy from primary. '0' == number of cores. |
|MaxFileOperationThreads | Uint, default is 100 |Static| The maximum number of parallel threads allowed to perform FileOperations (Copy/Move) in the primary. '0' == number of cores. |
|MaxRequestProcessingThreads | Uint, default is 200 |Static|The maximum number of parallel threads allowed to process requests in the primary. '0' == number of cores. |
|MaxSecondaryFileCopyFailureThreshold | Uint, default is 25|Dynamic|The maximum number of file copy retries on the secondary before giving up. |
|MaxStoreOperations | Uint, default is 4096 |Static|The maximum number of parallel store transaction operations allowed on primary. '0' == number of cores. |
|NamingOperationTimeout |Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The timeout for performing naming operation. |
|PrimaryAccountNTLMPasswordSecret | SecureString, default is empty |Static| The password secret which used as seed to generated same password when using NTLM authentication. |
|PrimaryAccountNTLMX509StoreLocation | string, default is "LocalMachine"|Static| The store location of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret when using NTLM authentication. |
|PrimaryAccountNTLMX509StoreName | string, default is "MY"|Static| The store name of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret when using NTLM authentication. |
|PrimaryAccountNTLMX509Thumbprint | string, default is ""|Static|The thumbprint of the X509 certificate used to generate HMAC on the PrimaryAccountNTLMPasswordSecret when using NTLM authentication. |
|PrimaryAccountType | string, default is "" |Static|The primary AccountType of the principal to ACL the FileStoreService shares. |
|PrimaryAccountUserName | string, default is "" |Static|The primary account Username of the principal to ACL the FileStoreService shares. |
|PrimaryAccountUserPassword | SecureString, default is empty |Static|The primary account password of the principal to ACL the FileStoreService shares. |
|QueryOperationTimeout | Time in seconds, default is 60 |Dynamic|Specify timespan in seconds. The timeout for performing query operation. |
|SecondaryAccountNTLMPasswordSecret | SecureString, default is empty |Static| The password secret which used as seed to generated same password when using NTLM authentication. |
|SecondaryAccountNTLMX509StoreLocation | string, default is "LocalMachine" |Static|The store location of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret when using NTLM authentication. |
|SecondaryAccountNTLMX509StoreName | string, default is "MY" |Static|The store name of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret when using NTLM authentication. |
|SecondaryAccountNTLMX509Thumbprint | string, default is ""| Static|The thumbprint of the X509 certificate used to generate HMAC on the SecondaryAccountNTLMPasswordSecret when using NTLM authentication. |
|SecondaryAccountType | string, default is ""|Static| The secondary AccountType of the principal to ACL the FileStoreService shares. |
|SecondaryAccountUserName | string, default is ""| Static|The secondary account Username of the principal to ACL the FileStoreService shares. |
|SecondaryAccountUserPassword | SecureString, default is empty |Static|The secondary account password of the principal to ACL the FileStoreService shares. |
|SecondaryFileCopyRetryDelayMilliseconds|uint, default is 500|Dynamic|The file copy retry delay (in milliseconds).|
|UseChunkContentInTransportMessage|bool, default is TRUE|Dynamic|The flag for using the new version of the upload protocol introduced in v6.4. This protocol version uses service fabric transport to upload files to image store which provides better performance than SMB protocol used in previous versions. |

## FileStoreService/Replication

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ReplicationBatchSize|uint, default is 1|Static|Specifies the number of operations to be sent between primary and secondary replicas. If zero the primary sends one record per operation to the secondary. Otherwise the primary replica aggregates log records until the config value is reached.  This will reduce network traffic.|

## HealthManager

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|EnableApplicationTypeHealthEvaluation |Bool, default is false |Static|Cluster health evaluation policy: enable per application type health evaluation. |
|EnableNodeTypeHealthEvaluation |Bool, default is false |Static|Cluster health evaluation policy: enable per node type health evaluation. |
|MaxSuggestedNumberOfEntityHealthReports|Int, default is 100 |Dynamic|The maximum number of health reports that an entity can have before raising concerns about the watchdog's health reporting logic. Each health entity is supposed to have a relatively small number of health reports. If the report count goes above this number; there may be issues with the watchdog's implementation. An entity with too many reports is flagged through a Warning health report when the entity is evaluated. |

## HealthManager/ClusterHealthPolicy

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ConsiderWarningAsError |Bool, default is false |Static|Cluster health evaluation policy: warnings are treated as errors. |
|MaxPercentUnhealthyApplications | Int, default is 0 |Static|Cluster health evaluation policy: maximum percent of unhealthy applications allowed for the cluster to be healthy. |
|MaxPercentUnhealthyNodes | Int, default is 0 |Static|Cluster health evaluation policy: maximum percent of unhealthy nodes allowed for the cluster to be healthy. |

## HealthManager/ClusterUpgradeHealthPolicy

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|MaxPercentDeltaUnhealthyNodes|int, default is 10|Static|Cluster upgrade health evaluation policy: maximum percent of delta unhealthy nodes allowed for the cluster to be healthy |
|MaxPercentUpgradeDomainDeltaUnhealthyNodes|int, default is 15|Static|Cluster upgrade health evaluation policy: maximum percent of delta of unhealthy nodes in an upgrade domain allowed for the cluster to be healthy |

## Hosting

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ActivationMaxFailureCount |Whole number, default is 10 |Dynamic|Number of times system retries failed activation before giving up |
|ActivationMaxRetryInterval |Time in seconds, default is 300 |Dynamic|On every continuous activation failure, the system retries the activation for up to ActivationMaxFailureCount. ActivationMaxRetryInterval specifies Wait time interval before retry after every activation failure |
|ActivationRetryBackoffInterval |Time in Seconds, default is 5 |Dynamic|Backoff interval on every activation failure; On every continuous activation failure, the system retries the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval. |
|ActivationTimeout| TimeSpan, default is Common::TimeSpan::FromSeconds(180)|Dynamic| Specify timespan in seconds. The timeout for application activation; deactivation and upgrade. |
|ApplicationHostCloseTimeout| TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic| Specify timespan in seconds. When Fabric exit is detected in a self activated processes; FabricRuntime closes all of the replicas in the user's host (applicationhost) process. This is the timeout for the close operation. |
| CnsNetworkPluginCnmUrlPort | wstring, default is L"48080" | Static | Azure cnm api url port |
| CnsNetworkPluginCnsUrlPort | wstring, default is L"10090" | Static | Azure cns url port |
|ContainerServiceArguments|string, default is "-H localhost:2375 -H npipe://"|Static|Service Fabric (SF) manages docker daemon (except on windows client machines like Windows 10). This configuration allows user to specify custom arguments that should be passed to docker daemon when starting it. When custom arguments are specified, Service Fabric doesn't pass any other argument to Docker engine except '--pidfile' argument. Hence users shouldn't specify '--pidfile' argument as part of their customer arguments. Also, the custom arguments should ensure that docker daemon listens on default name pipe on Windows (or Unix domain socket on Linux) for Service Fabric to be able to communicate with it.|
|ContainerServiceLogFileMaxSizeInKb|int, default is 32768|Static|Maximum file size of log file generated by docker containers.  Windows only.|
|ContainerImageDownloadTimeout|int, number of seconds, default is 1200 (20 mins)|Dynamic|Number of seconds before download of image times out.|
|ContainerImagesToSkip|string, image names separated by vertical line character, default is ""|Static|Name of one or more container images that shouldn't be deleted.  Used with the PruneContainerImages parameter.|
|ContainerServiceLogFileNamePrefix|string, default is "sfcontainerlogs"|Static|File name prefix for log files generated by docker containers.  Windows only.|
|ContainerServiceLogFileRetentionCount|int, default is 10|Static|Number of log files generated by docker containers before log files are overwritten.  Windows only.|
|CreateFabricRuntimeTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic| Specify timespan in seconds. The timeout value for the sync FabricCreateRuntime call |
|DefaultContainerRepositoryAccountName|string, default is ""|Static|Default credentials used instead of credentials specified in ApplicationManifest.xml |
|DefaultContainerRepositoryPassword|string, default is ""|Static|Default password credentials used instead of credentials specified in ApplicationManifest.xml|
|DefaultContainerRepositoryPasswordType|string, default is ""|Static|When not empty string, the value can be "Encrypted" or "SecretsStoreRef".|
|DefaultDnsSearchSuffixEmpty|bool, default is FALSE|Static|By default the service name is appended to the SF DNS name for container services. This feature stops this behavior so that nothing is appended to the SF DNS name by default in the resolution pathway.|
|DeploymentMaxFailureCount|int, default is 20| Dynamic|Application deployment will be retried for DeploymentMaxFailureCount times before failing the deployment of that application on the node.| 
|DeploymentMaxRetryInterval| TimeSpan, default is Common::TimeSpan::FromSeconds(3600)|Dynamic| Specify timespan in seconds. Max retry interval for the deployment. On every continuous failure the retry interval is calculated as Min( DeploymentMaxRetryInterval; Continuous Failure Count * DeploymentRetryBackoffInterval) |
|DeploymentRetryBackoffInterval| TimeSpan, default is Common::TimeSpan::FromSeconds(10)|Dynamic|Specify timespan in seconds. Back-off interval for the deployment failure. On every continuous deployment failure the system will retry the deployment for up to the MaxDeploymentFailureCount. The retry interval is a product of continuous deployment failure and the deployment backoff interval. |
|DisableContainers|bool, default is FALSE|Static|Config for disabling containers - used instead of DisableContainerServiceStartOnContainerActivatorOpen which is deprecated config |
|DisableDockerRequestRetry|bool, default is FALSE |Dynamic| By default SF communicates with DD (docker daemon) with a timeout of 'DockerRequestTimeout' for each http request sent to it. If DD doesn't responds within this time period; SF resends the request if top level operation still has remaining time.  With Hyper-V container; DD sometimes takes much more time to bring up the container or deactivate it. In such cases DD request times out from SF perspective and SF retries the operation. Sometimes this seems to add more pressure on DD. This config allows you to disable this retry and wait for DD to respond. |
|DisableLivenessProbes | wstring, default is L"" | Static | Config to disable Liveness probes in cluster. You can specify any non-empty value for SF to disable probes. |
|DisableReadinessProbes | wstring, default is L"" | Static | Config to disable Readiness probes in cluster. You can specify any non-empty value for SF to disable probes. |
|DnsServerListTwoIps | Bool, default is FALSE | Static | This flag adds the local dns server twice to help alleviate intermittent resolve issues. |
| DockerTerminateOnLastHandleClosed | bool, default is TRUE | Static | By default if FabricHost is managing the 'dockerd' (based on: SkipDockerProcessManagement == false) this setting configures what happens when either FabricHost or dockerd crash. When set to `true` if either process crashes all running containers will be forcibly terminated by the HCS. If set to `false` the containers will continue to keep running. Note: Previous to 8.0 this behavior was unintentionally the equivalent of `false`. The default setting of `true` here is what we expect to happen by default moving forward for our cleanup logic to be effective on restart of these processes. |
| DoNotInjectLocalDnsServer | bool, default is FALSE | Static | Prevents the runtime to injecting the local IP as DNS server for containers. |
|EnableActivateNoWindow| bool, default is FALSE|Dynamic| The activated process is created in the background without any console. |
|EnableContainerServiceDebugMode|bool, default is TRUE|Static|Enable/disable logging for docker containers.  Windows only.|
|EnableDockerHealthCheckIntegration|bool, default is TRUE|Static|Enables integration of docker HEALTHCHECK events with Service Fabric system health report |
|EnableProcessDebugging|bool, default is FALSE|Dynamic| Enables launching application hosts under debugger |
|EndpointProviderEnabled| bool, default is FALSE|Static| Enables management of Endpoint resources by Fabric. Requires specification of start and end application port range in FabricNode. |
|FabricContainerAppsEnabled| bool, default is FALSE|Static| |
|FirewallPolicyEnabled|bool, default is FALSE|Static| Enables opening firewall ports for Endpoint resources with explicit ports specified in ServiceManifest |
|GetCodePackageActivationContextTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic|Specify timespan in seconds. The timeout value for the CodePackageActivationContext calls. This is not applicable to ad hoc services. |
|GovernOnlyMainMemoryForProcesses|bool, default is FALSE|Static|Default behavior of Resource Governance is to put limit specified in MemoryInMB on amount of total memory (RAM + swap) that process uses. If the limit is exceeded; the process will receive OutOfMemory exception. If this parameter is set to true; limit will be applied only to the amount of RAM memory that a process will use. If this limit is exceeded; and if this setting is true; then OS will swap the main memory to disk. |
|IPProviderEnabled|bool, default is FALSE|Static|Enables management of IP addresses. |
|IsDefaultContainerRepositoryPasswordEncrypted|bool, default is FALSE|Static|Whether the DefaultContainerRepositoryPassword is encrypted or not.|
|LinuxExternalExecutablePath|string, default is "/usr/bin/" |Static|The primary directory of external executable commands on the node.|
|NTLMAuthenticationEnabled|bool, default is FALSE|Static| Enables support for using NTLM by the code packages that are running as other users so that the processes across machines can communicate securely. |
|NTLMAuthenticationPasswordSecret|SecureString, default is Common::SecureString("")|Static|Is an encryption that is used to generate the password for NTLM users. Has to be set if NTLMAuthenticationEnabled is true. Validated by the deployer. |
|NTLMSecurityUsersByX509CommonNamesRefreshInterval|TimeSpan, default is Common::TimeSpan::FromMinutes(3)|Dynamic|Specify timespan in seconds. Environment-specific settings The periodic interval at which Hosting scans for new certificates to be used for FileStoreService NTLM configuration. |
|NTLMSecurityUsersByX509CommonNamesRefreshTimeout|TimeSpan, default is Common::TimeSpan::FromMinutes(4)|Dynamic| Specify timespan in seconds. The timeout for configuring NTLM users using certificate common names. The NTLM users are needed for FileStoreService shares. |
|PruneContainerImages|bool, default is FALSE|Dynamic| Remove unused application container images from nodes. When an ApplicationType is unregistered from the Service Fabric cluster, the container images that were used by this application will be removed on nodes where it was downloaded by Service Fabric. The pruning runs every hour, so it may take up to one hour (plus time to prune the image) for images to be removed from the cluster.<br>Service Fabric will never download or remove images not related to an application.  Unrelated images that were downloaded manually or otherwise must be removed explicitly.<br>Images that shouldn't be deleted can be specified in the ContainerImagesToSkip parameter.| 
|RegisterCodePackageHostTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic| Specify timespan in seconds. The timeout value for the FabricRegisterCodePackageHost sync call. This is applicable for only multi code package application hosts like FWP |
|RequestTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(30)|Dynamic| Specify timespan in seconds. This represents the timeout for communication between the user's application host and Fabric process for various hosting related operations such as factory registration; runtime registration. |
|RunAsPolicyEnabled| bool, default is FALSE|Static| Enables running code packages as local user other than the user under which fabric process is running. In order to enable this policy Fabric must be running as SYSTEM or as user who has SeAssignPrimaryTokenPrivilege. |
|ServiceFactoryRegistrationTimeout| TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic|Specify timespan in seconds. The timeout value for the sync Register(Stateless/Stateful)ServiceFactory call |
|ServiceTypeDisableFailureThreshold |Whole number, default is 1 |Dynamic|This is the threshold for the failure count after which FailoverManager (FM) is notified to disable the service type on that node and try a different node for placement. |
|ServiceTypeDisableGraceInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(30)|Dynamic|Specify timespan in seconds. Time interval after which the service type can be disabled |
|ServiceTypeRegistrationTimeout |Time in Seconds, default is 300 |Dynamic|Maximum time allowed for the ServiceType to be registered with fabric |
|UseContainerServiceArguments|bool, default is TRUE|Static|This config tells hosting to skip passing arguments (specified in config ContainerServiceArguments) to docker daemon.|

## HttpGateway

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ActiveListeners |Uint, default is 50 |Static| Number of reads to post to the http server queue. This controls the number of concurrent requests that can be satisfied by the HttpGateway. |
|HttpGatewayHealthReportSendInterval |Time in seconds, default is 30 |Static|Specify timespan in seconds. The interval at which the Http Gateway sends accumulated health reports to the Health Manager. |
|HttpStrictTransportSecurityHeader|string, default is ""|Dynamic| Specify the HTTP Strict Transport Security header value to be included in every response sent by the HttpGateway. When set to empty string; this header will not be included in the gateway response.|
|IsEnabled|Bool, default is false |Static| Enables/Disables the HttpGateway. HttpGateway is disabled by default. |
|MaxEntityBodySize |Uint, default is 4194304 |Dynamic|Gives the maximum size of the body that can be expected from an http request. Default value is 4MB. Httpgateway will fail a request if it has a body of size > this value. Minimum read chunk size is 4096 bytes. So this has to be >= 4096. |

## ImageStoreService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|Enabled |Bool, default is false |Static|The Enabled flag for ImageStoreService. Default: false |
|MinReplicaSetSize | Int, default is 3 |Static|The MinReplicaSetSize for ImageStoreService. |
|PlacementConstraints | string, default is "" |Static| The PlacementConstraints for ImageStoreService. |
|QuorumLossWaitDuration | Time in seconds, default is MaxValue |Static| Specify timespan in seconds. The QuorumLossWaitDuration for ImageStoreService. |
|ReplicaRestartWaitDuration | Time in seconds, default is 60.0 \* 30 |Static|Specify timespan in seconds. The ReplicaRestartWaitDuration for ImageStoreService. |
|StandByReplicaKeepDuration | Time in seconds, default is 3600.0 \* 2 |Static| Specify timespan in seconds. The StandByReplicaKeepDuration for ImageStoreService. |
|TargetReplicaSetSize | Int, default is 7 |Static|The TargetReplicaSetSize for ImageStoreService. |

## KtlLogger

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AutomaticMemoryConfiguration |Int, default is 1 |Dynamic|Flag that indicates if the memory settings should be automatically and dynamically configured. If zero then the memory configuration settings are used directly and don't change based on system conditions. If one then the memory settings are configured automatically and may change based on system conditions. |
|MaximumDestagingWriteOutstandingInKB | Int, default is 0 |Dynamic|The number of KB to allow the shared log to advance ahead of the dedicated log. Use 0 to indicate no limit.
|SharedLogId |string, default is "" |Static|Unique guid for shared log container. Use "" if using default path under fabric data root. |
|SharedLogPath |string, default is "" |Static|Path and file name to location to place shared log container. Use "" for using default path under fabric data root. |
|SharedLogSizeInMB |Int, default is 8192 |Static|The number of MB to allocate in the shared log container. |
|SharedLogThrottleLimitInPercentUsed|int, default is 0 | Static | The percentage of usage of the shared log that will induce throttling. Value should be between 0 and 100. A value of 0 implies using the default percentage value. A value of 100 implies no throttling at all. A value between 1 and 99 specifies the percentage of log usage above which throttling will occur; for example if the shared log is 10GB and the value is 90 then throttling will occur once 9GB is in use. Using the default value is recommended.|
|WriteBufferMemoryPoolMaximumInKB | Int, default is 0 |Dynamic|The number of KB to allow the write buffer memory pool to grow up to. Use 0 to indicate no limit. |
|WriteBufferMemoryPoolMinimumInKB |Int, default is 8388608 |Dynamic|The number of KB to initially allocate for the write buffer memory pool. Use 0 to indicate no limit Default should be consistent with SharedLogSizeInMB below. |

## ManagedIdentityTokenService
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|IsEnabled|bool, default is FALSE|Static|Flag controlling the presence and status of the Managed Identity Token Service in the cluster; this is a prerequisite for using the managed identity functionality of Service Fabric applications.|
| RunInStandaloneMode |bool, default is FALSE |Static|The RunInStandaloneMode for ManagedIdentityTokenService. |
| StandalonePrincipalId |wstring, default is "" |Static|The StandalonePrincipalId for ManagedIdentityTokenService. |
| StandaloneSendX509 |bool, default is FALSE |Static|The StandaloneSendX509 for ManagedIdentityTokenService. |
| StandaloneTenantId |wstring, default is "" |Static|The StandaloneTenantId for ManagedIdentityTokenService. |
| StandaloneX509CredentialFindType |wstring, default is "" |Static|The StandaloneX509CredentialFindType for ManagedIdentityTokenService. |
| StandaloneX509CredentialFindValue |wstring, default is "" |Static|The StandaloneX509CredentialFindValue for ManagedIdentityTokenService |

## Management

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AutomaticUnprovisionInterval|TimeSpan, default is Common::TimeSpan::FromMinutes(5)|Dynamic|Specify timespan in seconds. The cleanup interval for allowed for unregister application type during automatic application type cleanup.|
|AzureStorageMaxConnections | Int, default is 5000 |Dynamic|The maximum number of concurrent connections to Azure storage. |
|AzureStorageMaxWorkerThreads | Int, default is 25 |Dynamic|The maximum number of worker threads in parallel. |
|AzureStorageOperationTimeout | Time in seconds, default is 6000 |Dynamic|Specify timespan in seconds. Time out for xstore operation to complete. |
|CleanupApplicationPackageOnProvisionSuccess|bool, default is true |Dynamic|Enables or disables the automatic cleanup of application package on successful provision.
|CleanupUnusedApplicationTypes|Bool, default is FALSE |Dynamic|This configuration if enabled, allows you to automatically unregister unused application type versions skipping the latest three unused versions, thereby trimming the disk space occupied by image store. The automatic cleanup will be triggered at the end of successful provision for that specific app type and also runs periodically once a day for all the application types. Number of unused versions to skip is configurable using parameter "MaxUnusedAppTypeVersionsToKeep". <br/> *Best practice is to use `true`.*
|DisableChecksumValidation | Bool, default is false |Static| This configuration allows us to enable or disable checksum validation during application provisioning. |
|DisableServerSideCopy | Bool, default is false |Static|This configuration enables or disables server-side copy of application package on the ImageStore during application provisioning. |
|ImageCachingEnabled | Bool, default is true |Static|This configuration allows us to enable or disable caching. |
|ImageStoreConnectionString |SecureString |Static|Connection string to the Root for ImageStore. |
|ImageStoreMinimumTransferBPS | Int, default is 1024 |Dynamic|The minimum transfer rate between the cluster and ImageStore. This value is used to determine the timeout when accessing the external ImageStore. Change this value only if the latency between the cluster and ImageStore is high to allow more time for the cluster to download from the external ImageStore. |
|MaxUnusedAppTypeVersionsToKeep | Int, default is 3 |Dynamic|This configuration defines the number of unused application type versions to be skipped for cleanup. This parameter is applicable only if parameter CleanupUnusedApplicationTypes is enabled. <br/>*General best practice is to use the default (`3`). Values less than 1 are not valid.*|


## MetricActivityThresholds
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyIntegerValueMap, default is None|Dynamic|Determines the set of MetricActivityThresholds for the metrics in the cluster. Balancing will work if maxNodeLoad is greater than MetricActivityThresholds. For defrag metrics it defines the amount of load equal to or below which Service Fabric will consider the node empty |

## MetricActivityThresholdsPerNodeType
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyStringValueMap, default is None|Static|Configuration that specifies metric activity thresholds per node type. |

## MetricBalancingThresholds
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyDoubleValueMap, default is None|Dynamic|Determines the set of MetricBalancingThresholds for the metrics in the cluster. Balancing will work if maxNodeLoad/minNodeLoad is greater than MetricBalancingThresholds. Defragmentation will work if maxNodeLoad/minNodeLoad in at least one FD or UD is smaller than MetricBalancingThresholds. |

## MetricBalancingThresholdsPerNodeType
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyStringValueMap, default is None|Static|Configuration that specifies metric balancing thresholds per node type. |

## MetricLoadStickinessForSwap
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyDoubleValueMap, default is None|Dynamic|Determines the part of the load that sticks with replica when swapped. It takes value between 0 (load doesn't stick with replica) and 1 (load sticks with replica - default) |

## Naming/Replication

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ReplicationBatchSize|uint, default is 1|Static|Specifies the number of operations to be sent between primary and secondary replicas. If zero the primary sends one record per operation to the secondary. Otherwise the primary replica aggregates log records until the config value is reached.  This will reduce network traffic.|

## NamingService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|GatewayServiceDescriptionCacheLimit |Int, default is 0 |Static|The maximum number of entries maintained in the LRU service description cache at the Naming Gateway (set to 0 for no limit). |
|MaxClientConnections |Int, default is 1000 |Dynamic|The maximum allowed number of client connections per gateway. |
|MaxFileOperationTimeout |Time in seconds, default is 30 |Dynamic|Specify timespan in seconds. The maximum timeout allowed for file store service operation. Requests specifying a larger timeout will be rejected. |
|MaxIndexedEmptyPartitions |Int, default is 1000 |Dynamic|The maximum number of empty partitions that will remain indexed in the notification cache for synchronizing reconnecting clients. Any empty partitions above this number will be removed from the index in ascending lookup version order. Reconnecting clients can still synchronize and receive missed empty partition updates; but the synchronization protocol becomes more expensive. |
|MaxMessageSize |Int, default is 4\*1024\*1024 |Static|The maximum message size for client node communication when using naming. DOS attack alleviation; default value is 4MB. |
|MaxNamingServiceHealthReports | Int, default is 10 |Dynamic|The maximum number of slow operations that Naming store service reports unhealthy at one time. If 0; all slow operations are sent. |
|MaxOperationTimeout |Time in seconds, default is 600 |Dynamic|Specify timespan in seconds. The maximum timeout allowed for client operations. Requests specifying a larger timeout will be rejected. |
|MaxOutstandingNotificationsPerClient |Int, default is 1000 |Dynamic|The maximum number of outstanding notifications before a client registration is forcibly closed by the gateway. |
|MinReplicaSetSize | Int, default is 3 |Not Allowed| The minimum number of Naming Service replicas required to write into to complete an update. If there are fewer replicas than this active in the system the Reliability System denies updates to the Naming Service Store until replicas are restored. This value should never be more than the TargetReplicaSetSize. |
|PartitionCount |Int, default is 3 |Not Allowed|The number of partitions of the Naming Service store to be created. Each partition owns a single partition key that corresponds to its index; so partition keys [0; PartitionCount] exist. Increasing the number of Naming Service partitions increases the scale that the Naming Service can perform at by decreasing the average amount of data held by any backing replica set; at a cost of increased utilization of resources (since PartitionCount*ReplicaSetSize service replicas must be maintained).|
|PlacementConstraints | string, default is "" |Not Allowed| Placement constraint for the Naming Service. |
|QuorumLossWaitDuration | Time in seconds, default is MaxValue |Not Allowed| Specify timespan in seconds. When a Naming Service gets into quorum loss; this timer starts. When it expires the FM will consider the down replicas as lost; and attempt to recover quorum. Not that this may result in data loss. |
|RepairInterval | Time in seconds, default is 5 |Static| Specify timespan in seconds. Interval in which the naming inconsistency repair between the authority owner and name owner will start. |
|ReplicaRestartWaitDuration | Time in seconds, default is (60.0 * 30)|Not Allowed| Specify timespan in seconds. When a Naming Service replica goes down; this timer starts. When it expires the FM will begin to replace the replicas which are down (it does not yet consider them lost). |
|ServiceDescriptionCacheLimit | Int, default is 0 |Static| The maximum number of entries maintained in the LRU service description cache at the Naming Store Service (set to 0 for no limit). |
|ServiceNotificationTimeout |Time in seconds, default is 30 |Dynamic|Specify timespan in seconds. The timeout used when delivering service notifications to the client. |
|StandByReplicaKeepDuration | Time in seconds, default is 3600.0 * 2 |Not Allowed| Specify timespan in seconds. When a Naming Service replica come back from a down state; it may have already been replaced. This timer determines how long the FM will keep the standby replica before discarding it. |
|TargetReplicaSetSize |Int, default is 7 |Not Allowed|The number of replica sets for each partition of the Naming Service store. Increasing the number of replica sets increases the level of reliability for the information in the Naming Service Store; decreasing the change that the information will be lost as a result of node failures; at a cost of increased load on Windows Fabric and the amount of time it takes to perform updates to the naming data.|

## NodeBufferPercentage
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|KeyDoubleValueMap, default is None|Dynamic|Node capacity percentage per metric name; used as a buffer in order to keep some free place on a node for the failover case. |

## NodeCapacities

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup |NodeCapacityCollectionMap | Static |A collection of node capacities for different metrics.|

## NodeDomainIds

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup |NodeFaultDomainIdCollection |Static|Describes the fault domains a node belongs to. The fault domain is defined through a URI that describes the location of the node in the datacenter.  Fault Domain URIs are of the format fd:/fd/ followed by a URI path segment.|
|UpgradeDomainId |string, default is "" |Static|Describes the upgrade domain a node belongs to. |

## NodeProperties

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup |NodePropertyCollectionMap | Static |A collection of string key-value pairs for node properties.|

## Paas

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ClusterId |string, default is "" |Not Allowed|X509 certificate store used by fabric for configuration protection. |

## PerformanceCounterLocalStore

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|Counters |String | Dynamic |Comma-separated list of performance counters to collect. |
|IsEnabled |Bool, default is true | Dynamic |Flag indicates whether performance counter collection on local node is enabled. |
|MaxCounterBinaryFileSizeInMB |Int, default is 1 | Dynamic |Maximum size (in MB) for each performance counter binary file. |
|NewCounterBinaryFileCreationIntervalInMinutes |Int, default is 10 | Dynamic |Maximum interval (in seconds) after which a new performance counter binary file is created. |
|SamplingIntervalInSeconds |Int, default is 60 | Dynamic |Sampling interval for performance counters being collected. |

## MinLoadBalancingIntervalsPerNodeType

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup |KeyStringValueMap, default is None | Static |Configuration that specifies min load balancing intervals per node type. |

## PlacementAndLoadBalancing

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AffinityConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of affinity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|ApplicationCapacityConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of capacity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|AutoDetectAvailableResources|bool, default is TRUE|Static|This config will trigger auto detection of available resources on node (CPU and Memory) When this config is set to true - we will read real capacities and correct them if user specified bad node capacities or didn't define them at all If this config is set to false - we will trace a warning that user specified bad node capacities; but we will not correct them; meaning that user wants to have the capacities specified as > than the node really has or if capacities are undefined; it will assume unlimited capacity |
|BalancingDelayAfterNewNode | Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. Don't start balancing activities within this period after adding a new node. |
|BalancingDelayAfterNodeDown | Time in seconds, default is 120 |Dynamic|Specify timespan in seconds. Don't start balancing activities within this period after a node down event. |
|BlockNodeInUpgradeConstraintPriority | Int, default is -1 |Dynamic|Determines the priority of capacity constraint: 0: Hard; 1: Soft; negative: Ignore  |
|CapacityConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of capacity constraint: 0: Hard; 1: Soft; negative: Ignore. |
|ConsecutiveDroppedMovementsHealthReportLimit | Int, default is 20 | Dynamic|Defines the number of consecutive times that ResourceBalancer-issued Movements are dropped before diagnostics are conducted and health warnings are emitted. Negative: No Warnings Emitted under this condition. |
|ConstraintFixPartialDelayAfterNewNode | Time in seconds, default is 120 |Dynamic| Specify timespan in seconds. Don't Fix FaultDomain and UpgradeDomain constraint violations within this period after adding a new node. |
|ConstraintFixPartialDelayAfterNodeDown | Time in seconds, default is 120 |Dynamic| Specify timespan in seconds. Don't Fix FaultDomain and UpgradeDomain constraint violations within this period after a node down event. |
|ConstraintViolationHealthReportLimit | Int, default is 50 |Dynamic| Defines the number of times constraint violating replica has to be persistently unfixed before diagnostics are conducted and health reports are emitted. |
|DecisionOperationalTracingEnabled | bool, default is FALSE |Dynamic| Config that enables CRM Decision operational structural trace in the event store. |
|DetailedConstraintViolationHealthReportLimit | Int, default is 200 |Dynamic| Defines the number of times constraint violating replica has to be persistently unfixed before diagnostics are conducted and detailed health reports are emitted. |
|DetailedDiagnosticsInfoListLimit | Int, default is 15 |Dynamic| Defines the number of diagnostic entries (with detailed information) per constraint to include before truncation in Diagnostics.|
|DetailedNodeListLimit | Int, default is 15 |Dynamic| Defines the number of nodes per constraint to include before truncation in the Unplaced Replica reports. |
|DetailedPartitionListLimit | Int, default is 15 |Dynamic| Defines the number of partitions per diagnostic entry for a constraint to include before truncation in Diagnostics. |
|DetailedVerboseHealthReportLimit | Int, default is 200 | Dynamic|Defines the number of times an unplaced replica has to be persistently unplaced before detailed health reports are emitted. |
|EnforceUserServiceMetricCapacities|bool, default is FALSE | Static |Enables fabric services protection. All user services are under one job object/cgroup and limited to specified amount of resources. This needs to be static (requires restart of FabricHost) as creation/removal of user job object and setting limits in done during open of Fabric Host. |
|FaultDomainConstraintPriority | Int, default is 0 |Dynamic| Determines the priority of fault domain constraint: 0: Hard; 1: Soft; negative: Ignore. |
|GlobalMovementThrottleCountingInterval | Time in seconds, default is 600 |Static| Specify timespan in seconds. Indicate the length of the past interval for which to track per domain replica movements (used along with GlobalMovementThrottleThreshold). Can be set to 0 to ignore global throttling altogether. |
|GlobalMovementThrottleThreshold | Uint, default is 1000 |Dynamic| Maximum number of movements allowed in the Balancing Phase in the past interval indicated by GlobalMovementThrottleCountingInterval. |
|GlobalMovementThrottleThresholdForBalancing | Uint, default is 0 | Dynamic|Maximum number of movements allowed in Balancing Phase in the past interval indicated by GlobalMovementThrottleCountingInterval. 0 indicates no limit. |
|GlobalMovementThrottleThresholdForPlacement | Uint, default is 0 |Dynamic| Maximum number of movements allowed in Placement Phase in the past interval indicated by GlobalMovementThrottleCountingInterval.0 indicates no limit.|
|GlobalMovementThrottleThresholdPercentage|double, default is 0|Dynamic|Maximum number of total movements allowed in Balancing and Placement phases (expressed as percentage of total number of replicas in the cluster) in the past interval indicated by GlobalMovementThrottleCountingInterval. 0 indicates no limit. If both this and GlobalMovementThrottleThreshold are specified; then more conservative limit is used.|
|GlobalMovementThrottleThresholdPercentageForBalancing|double, default is 0|Dynamic|Maximum number of movements allowed in Balancing Phase (expressed as percentage of total number of replicas in PLB) in the past interval indicated by GlobalMovementThrottleCountingInterval. 0 indicates no limit. If both this and GlobalMovementThrottleThresholdForBalancing are specified; then more conservative limit is used.|
|InBuildThrottlingAssociatedMetric | string, default is "" |Static| The associated metric name for this throttling. |
|InBuildThrottlingEnabled | Bool, default is false |Dynamic| Determine whether the in-build throttling is enabled. |
|InBuildThrottlingGlobalMaxValue | Int, default is 0 |Dynamic|The maximal number of in-build replicas allowed globally. |
|InterruptBalancingForAllFailoverUnitUpdates | Bool, default is false | Dynamic|Determines if any type of failover unit update should interrupt fast or slow balancing run. With specified "false" balancing run will be interrupted if FailoverUnit: is created/deleted; has missing replicas; changed primary replica location or changed number of replicas. Balancing run will NOT be interrupted in other cases - if FailoverUnit: has extra replicas; changed any replica flag; changed only partition version or any other case. |
|MinConstraintCheckInterval | Time in seconds, default is 1 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive constraint check rounds. |
|MinLoadBalancingInterval | Time in seconds, default is 5 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive balancing rounds. |
|MinPlacementInterval | Time in seconds, default is 1 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before two consecutive placement rounds. |
|MoveExistingReplicaForPlacement | Bool, default is true |Dynamic|Setting which determines if to move existing replica during placement. |
|MovementPerPartitionThrottleCountingInterval | Time in seconds, default is 600 |Static| Specify timespan in seconds. Indicate the length of the past interval for which to track replica movements for each partition (used along with MovementPerPartitionThrottleThreshold). |
|MovementPerPartitionThrottleThreshold | Uint, default is 50 |Dynamic| No balancing-related movement will occur for a partition if the number of balancing related movements for replicas of that partition has reached or exceeded MovementPerFailoverUnitThrottleThreshold in the past interval indicated by MovementPerPartitionThrottleCountingInterval. |
|MoveParentToFixAffinityViolation | Bool, default is false |Dynamic| Setting which determines if parent replicas can be moved to fix affinity constraints.|
|NodeTaggingEnabled | Bool, default is false |Dynamic| If true; NodeTagging feature will be enabled. |
|NodeTaggingConstraintPriority | Int, default is 0 |Dynamic| Configurable priority of node tagging. |
|PartiallyPlaceServices | Bool, default is true |Dynamic| Determines if all service replicas in cluster will be placed "all or nothing" given limited suitable nodes for them.|
|PlaceChildWithoutParent | Bool, default is true | Dynamic|Setting which determines if child service replica can be placed if no parent replica is up. |
|PlacementConstraintPriority | Int, default is 0 | Dynamic|Determines the priority of placement constraint: 0: Hard; 1: Soft; negative: Ignore. |
|PlacementConstraintValidationCacheSize | Int, default is 10000 |Dynamic| Limits the size of the table used for quick validation and caching of Placement Constraint Expressions. |
|PlacementSearchTimeout | Time in seconds, default is 0.5 |Dynamic| Specify timespan in seconds. When placing services; search for at most this long before returning a result. |
|PLBRefreshGap | Time in seconds, default is 1 |Dynamic| Specify timespan in seconds. Defines the minimum amount of time that must pass before PLB refreshes state again. |
|PreferredLocationConstraintPriority | Int, default is 2| Dynamic|Determines the priority of preferred location constraint: 0: Hard; 1: Soft; 2: Optimization; negative: Ignore |
|PreferredPrimaryDomainsConstraintPriority| Int, default is 1 | Dynamic| Determines the priority of preferred primary domain constraint: 0: Hard; 1: Soft; negative: Ignore |
|PreferUpgradedUDs|bool, default is FALSE|Dynamic|Turns on and off logic which prefers moving to already upgraded UDs. Starting with SF 7.0, the default value for this parameter is changed from TRUE to FALSE.|
|PreventTransientOvercommit | Bool, default is false | Dynamic|Determines should PLB immediately count on resources that will be freed up by the initiated moves. By default; PLB can initiate move out and move in on the same node which can create transient overcommit. Setting this parameter to true will prevent those kinds of overcommits and on-demand defrag (also known as placementWithMove) will be disabled. |
|RelaxUnlimitedPartitionBasedAutoScaling | Bool, default is false | Dynamic|Allow partition based auto-scaling for -1 upper scaling limit exceeds number of available nodes. If config is enabled; maximum partition count is calculated as ratio of available load and default partition load. If RelaxUnlimitedPartitionBasedAutoScaling is enabled; maximum partition count won't be less than number of available nodes. |
|RelaxUnlimitedInstanceBasedAutoScaling | Bool, default is false | Dynamic|Allow instance based auto-scaling for -1 upper scaling limit exceeds number of available nodes. If config is enabled; maximum partition count is calculated as ratio of available load and default instance load. If RelaxUnlimitedInstanceBasedAutoScaling is enabled; maximum instance count won't be less than number of available nodes. If service doesn't allow multi-instance on the same node; enabling RelaxUnlimitedInstanceBasedAutoScaling config doesn't have impact on that service. If AllowCreateUpdateMultiInstancePerNodeServices config is disabled; enabling RelaxUnlimitedInstanceBasedAutoScaling config doesn't have impact. |
|ScaleoutCountConstraintPriority | Int, default is 0 |Dynamic| Determines the priority of scaleout count constraint: 0: Hard; 1: Soft; negative: Ignore. |
|SeparateBalancingStrategyPerNodeType | Bool, default is false |Dynamic| Balancing configuration per node type Enable or disable balancing per node type feature. |
|SubclusteringEnabled|Bool, default is FALSE | Dynamic |Acknowledge subclustering when calculating standard deviation for balancing |
|SubclusteringReportingPolicy| Int, default is 1 |Dynamic|Defines how and if the subclustering health reports are sent: 0: Don't report; 1: Warning; 2: OK |
|SwapPrimaryThrottlingAssociatedMetric | string, default is ""|Static| The associated metric name for this throttling. |
|SwapPrimaryThrottlingEnabled | Bool, default is false|Dynamic| Determine whether the swap-primary throttling is enabled. |
|SwapPrimaryThrottlingGlobalMaxValue | Int, default is 0 |Dynamic| The maximal number of swap-primary replicas allowed globally. |
|TraceCRMReasons |Bool, default is true |Dynamic|Specifies whether to trace reasons for CRM issued movements to the operational events channel. |
|UpgradeDomainConstraintPriority | Int, default is 1| Dynamic|Determines the priority of upgrade domain constraint: 0: Hard; 1: Soft; negative: Ignore. |
|UseMoveCostReports | Bool, default is false | Dynamic|Instructs the LB to ignore the cost element of the scoring function; resulting potentially large number of moves for better balanced placement. |
|UseSeparateAuxiliaryLoad | Bool, default is true | Dynamic|Setting which determines if PLB should use different load for auxiliary on each node. If UseSeparateAuxiliaryLoad is turned off: - Reported load for auxiliary on one node will result in overwriting load for each auxiliary (on all other nodes) If UseSeparateAuxiliaryLoad is turned on: - Reported load for auxiliary on one node will take effect only on that auxiliary (no effect on auxiliaries on other nodes) - If replica crash happens - new replica is created with average load of all the rest auxiliaries - If PLB moves existing replica - load goes with it. |
|UseSeparateAuxiliaryMoveCost | Bool, default is false | Dynamic|Setting which determines if PLB should use different move cost for auxiliary on each node. If UseSeparateAuxiliaryMoveCost is turned off: - Reported move cost for auxiliary on one node will result in overwriting move cost for each auxiliary (on all other nodes) If UseSeparateAuxiliaryMoveCost is turned on: - Reported move cost for auxiliary on one node will take effect only on that auxiliary (no effect on auxiliaries on other nodes) - If replica crash happens - new replica is created with default move cost specified on service level - If PLB moves existing replica - move cost goes with it. |
|UseSeparateSecondaryLoad | Bool, default is true | Dynamic|Setting which determines if separate load should be used for secondary replicas. |
|UseSeparateSecondaryMoveCost | Bool, default is true | Dynamic|Setting which determines if PLB should use different move cost for secondary on each node. If UseSeparateSecondaryMoveCost is turned off: - Reported move cost for secondary on one node will result in overwriting move cost for each secondary (on all other nodes) If UseSeparateSecondaryMoveCost is turned on: - Reported move cost for secondary on one node will take effect only on that secondary (no effect on secondaries on other nodes) - If replica crash happens - new replica is created with default move cost specified on service level - If PLB moves existing replica - move cost goes with it. |
|ValidatePlacementConstraint | Bool, default is true |Dynamic| Specifies whether or not the PlacementConstraint expression for a service is validated when a service's ServiceDescription is updated. |
|ValidatePrimaryPlacementConstraintOnPromote| Bool, default is TRUE |Dynamic|Specifies whether or not the PlacementConstraint expression for a service is evaluated for primary preference on failover. |
|VerboseHealthReportLimit | Int, default is 20 | Dynamic|Defines the number of times a replica has to go unplaced before a health warning is reported for it (if verbose health reporting is enabled). |
|NodeLoadsOperationalTracingEnabled | Bool, default is true |Dynamic|Config that enables Node Load operational structural trace in the event store. |
|NodeLoadsOperationalTracingInterval | TimeSpan, default is Common::TimeSpan::FromSeconds(20) | Dynamic|Specify timespan in seconds. The interval with which to trace node loads to event store for each service domain. |

## ReconfigurationAgent

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ApplicationUpgradeMaxReplicaCloseDuration | Time in seconds, default is 900 |Dynamic|Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close during Application Upgrade.|
|FabricUpgradeMaxReplicaCloseDuration | Time in seconds, default is 900 |Dynamic| Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close during fabric upgrade. |
|GracefulReplicaShutdownMaxDuration|TimeSpan, default is Common::TimeSpan::FromSeconds(120)|Dynamic|Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close. If this value is set to 0, replicas will not be instructed to close.|
|NodeDeactivationMaxReplicaCloseDuration | Time in seconds, default is 900 |Dynamic|Specify timespan in seconds. The duration for which the system will wait before terminating service hosts that have replicas that are stuck in close during node deactivation. |
|PeriodicApiSlowTraceInterval | Time in seconds, default is 5 minutes |Dynamic| Specify timespan in seconds. PeriodicApiSlowTraceInterval defines the interval over which slow API calls will be retraced by the API monitor. |
|ReplicaChangeRoleFailureRestartThreshold|int, default is 10|Dynamic| Integer. Specify the number of API failures during primary promotion after which auto-mitigation action (replica restart) will be applied. |
|ReplicaChangeRoleFailureWarningReportThreshold|int, default is 2147483647|Dynamic| Integer. Specify the number of API failures during primary promotion after which warning health report will be raised.|
|ServiceApiHealthDuration | Time in seconds, default is 30 minutes |Dynamic| Specify timespan in seconds. ServiceApiHealthDuration defines how long do we wait for a service API to run before we report it unhealthy. |
|ServiceReconfigurationApiHealthDuration | Time in seconds, default is 30 |Dynamic| Specify timespan in seconds. ServiceReconfigurationApiHealthDuration defines how long do we wait for a service API to run before we report unhealthy. This applies to API calls that impact availability.|

## RepairManager/Replication
| **Parameter** | **Allowed Values** | **Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ReplicationBatchSize|uint, default is 1|Static|Specifies the number of operations to be sent between primary and secondary replicas. If zero the primary sends one record per operation to the secondary. Otherwise the primary replica aggregates log records until the config value is reached.  This will reduce network traffic.|

## Replication
<i> **Warning Note** : Changing Replication/TranscationalReplicator settings at cluster level changes settings for all stateful services include system services. This is generally not recommended. See this document [Configure Azure Service Fabric Reliable Services - Azure Service Fabric | Microsoft Docs](./service-fabric-reliable-services-configuration.md) to configure services at app level.</i>


| **Parameter** | **Allowed Values** | **Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|BatchAcknowledgementInterval|TimeSpan, default is Common::TimeSpan::FromMilliseconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before sending back an acknowledgment. Other operations received during this time period will have their acknowledgments sent back in a single message-> reducing network traffic but potentially reducing the throughput of the replicator.|
|MaxCopyQueueSize|uint, default is 1024|Static|This is the maximum value defines the initial size for the queue which maintains replication operations. Note that it must be a power of 2. If during runtime the queue grows to this size operation will be throttled between the primary and secondary replicators.|
|MaxPrimaryReplicationQueueMemorySize|uint, default is 0|Static|This is the maximum value of the primary replication queue in bytes.|
|MaxPrimaryReplicationQueueSize|uint, default is 1024|Static|This is the maximum number of operations that could exist in the primary replication queue. Note that it must be a power of 2.|
|MaxReplicationMessageSize|uint, default is 52428800|Static|Maximum message size of replication operations. Default is 50MB.|
|MaxSecondaryReplicationQueueMemorySize|uint, default is 0|Static|This is the maximum value of the secondary replication queue in bytes.|
|MaxSecondaryReplicationQueueSize|uint, default is 2048|Static|This is the maximum number of operations that could exist in the secondary replication queue. Note that it must be a power of 2.|
|QueueHealthMonitoringInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(30)|Static|Specify timespan in seconds. This value determines the time period used by the Replicator to monitor any warning/error health events in the replication operation queues. A value of '0' disables health monitoring |
|QueueHealthWarningAtUsagePercent|uint, default is 80|Static|This value determines the replication queue usage(in percentage) after which we report warning about high queue usage. We do so after a grace interval of QueueHealthMonitoringInterval. If the queue usage falls below this percentage in the grace interval|
|ReplicatorAddress|string, default is "localhost:0"|Static|The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to establish connections with other replicas in order to send/receive operations.|
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(15)|Static|Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ReplicationBatchSize|uint, default is 1|Static|Specifies the number of operations to be sent between primary and secondary replicas. If zero the primary sends one record per operation to the secondary. Otherwise the primary replica aggregates log records until the config value is reached.  This will reduce network traffic.|
|ReplicatorListenAddress|string, default is "localhost:0"|Static|The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to receive operations from other replicas.|
|ReplicatorPublishAddress|string, default is "localhost:0"|Static|The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to send operations to other replicas.|
|RetryInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(5)|Static|Specify timespan in seconds. When an operation is lost or rejected this timer determines how often the replicator will retry sending the operation.|

## ResourceMonitorService
| **Parameter** | **Allowed Values** | **Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|IsEnabled|bool, default is FALSE |Static|Controls if the service is enabled in the cluster or not. |

## RunAs

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "DomainUser/NetworkService/ManagedServiceAccount/LocalSystem".|
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

## RunAs_DCA

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

## RunAs_Fabric

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

## RunAs_HttpGateway

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|RunAsAccountName |string, default is "" |Dynamic|Indicates the RunAs account name. This is only needed for "DomainUser" or "ManagedServiceAccount" account type. Valid values are "domain\user" or "user@domain". |
|RunAsAccountType|string, default is "" |Dynamic|Indicates the RunAs account type. This is needed for any RunAs section Valid values are "LocalUser/DomainUser/NetworkService/ManagedServiceAccount/LocalSystem". |
|RunAsPassword|string, default is "" |Dynamic|Indicates the RunAs account password. This is only needed for "DomainUser" account type. |

## Security
| **Parameter** | **Allowed Values** |**Upgrade Policy**| **Guidance or Short Description** |
| --- | --- | --- | --- |
|AADCertEndpointFormat|string, default is ""|Static|Azure Active Directory Cert Endpoint Format, default Azure Commercial, specified for non-default environment such as Azure Government "https:\//login.microsoftonline.us/{0}/federationmetadata/2007-06/federationmetadata.xml" |
|AADClientApplication|string, default is ""|Static|Native Client application name or ID representing Fabric Clients |
|AADClusterApplication|string, default is ""|Static|Web API application name or ID representing the cluster |
|AADLoginEndpoint|string, default is ""|Static|Azure Active Directory Login Endpoint, default Azure Commercial, specified for non-default environment such as Azure Government "https:\//login.microsoftonline.us" |
|AADTenantId|string, default is ""|Static|Tenant ID (GUID) |
|AcceptExpiredPinnedClusterCertificate|bool, default is FALSE|Dynamic|Flag indicating whether to accept expired cluster certificates declared by thumbprint Applies only to cluster certificates; so as to keep the cluster alive. |
|AdminClientCertThumbprints|string, default is ""|Dynamic|Thumbprints of certificates used by clients in admin role. It's a comma-separated name list. |
|AADTokenEndpointFormat|string, default is ""|Static|Azure Active Directory Token Endpoint, default Azure Commercial, specified for non-default environment such as Azure Government "https:\//login.microsoftonline.us/{0}" |
|AdminClientClaims|string, default is ""|Dynamic|All possible claims expected from admin clients; the same format as ClientClaims; this list internally gets added to ClientClaims; so no need to also add the same entries to ClientClaims. |
|AdminClientIdentities|string, default is ""|Dynamic|Windows identities of fabric clients in admin role; used to authorize privileged fabric operations. It's a comma-separated list; each entry is a domain account name or group name. For convenience; the account that runs fabric.exe is automatically assigned admin role; so is group ServiceFabricAdministrators. |
|AppRunAsAccountGroupX509Folder|string, default is /home/sfuser/sfusercerts |Static|Folder where AppRunAsAccountGroup X509 certificates and private keys are located |
|CertificateExpirySafetyMargin|TimeSpan, default is Common::TimeSpan::FromMinutes(43200)|Static|Specify timespan in seconds. Safety margin for certificate expiration; certificate health report status changes from OK to Warning when expiration is closer than this. Default is 30 days. |
|CertificateHealthReportingInterval|TimeSpan, default is Common::TimeSpan::FromSeconds(3600 * 8)|Static|Specify timespan in seconds. Specify interval for certificate health reporting; default to 8 hours; setting to 0 disables certificate health reporting |
|ClientCertThumbprints|string, default is ""|Dynamic|Thumbprints of certificates used by clients to talk to the cluster; cluster uses this to authorize incoming connection. It's a comma-separated name list. |
|ClientClaimAuthEnabled|bool, default is FALSE|Static|Indicates if claim-based authentication is enabled on clients; setting this true implicitly sets ClientRoleEnabled. |
|ClientClaims|string, default is ""|Dynamic|All possible claims expected from clients for connecting to gateway. This is a 'OR' list: ClaimsEntry \|\| ClaimsEntry \|\| ClaimsEntry ... each ClaimsEntry is an "AND" list: ClaimType=ClaimValue && ClaimType=ClaimValue && ClaimType=ClaimValue ... |
|ClientIdentities|string, default is ""|Dynamic|Windows identities of FabricClient; naming gateway uses this to authorize incoming connections. It's a comma-separated list; each entry is a domain account name or group name. For convenience; the account that runs fabric.exe is automatically allowed; so are group ServiceFabricAllowedUsers and ServiceFabricAdministrators. |
|ClientRoleEnabled|bool, default is FALSE|Static|Indicates if client role is enabled; when set to true; clients are assigned roles based on their identities. For V2; enabling this means client not in AdminClientCommonNames/AdminClientIdentities can only execute read-only operations. |
|ClusterCertThumbprints|string, default is ""|Dynamic|Thumbprints of certificates allowed to join the cluster; a comma-separated name list. |
|ClusterCredentialType|string, default is "None"|Not Allowed|Indicates the type of security credentials to use in order to secure the cluster. Valid values are "None/X509/Windows" |
|ClusterIdentities|string, default is ""|Dynamic|Windows identities of cluster nodes; used for cluster membership authorization. It's a comma-separated list; each entry is a domain account name or group name |
|ClusterSpn|string, default is ""|Not Allowed|Service principal name of the cluster; when fabric runs as a single domain user (gMSA/domain user account). It's the SPN of lease listeners and listeners in fabric.exe: federation listeners; internal replication listeners; runtime service listener and naming gateway listener. This should be left empty when fabric runs as machine accounts; in which case connecting side compute listener SPN from listener transport address. |
|CrlCheckingFlag|uint, default is 0x40000000|Dynamic|Default certificate chain validation flag; may be overridden by component-specific flag; e.g. Federation/X509CertChainFlags 0x10000000 CERT_CHAIN_REVOCATION_CHECK_END_CERT 0x20000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN 0x40000000 CERT_CHAIN_REVOCATION_CHECK_CHAIN_EXCLUDE_ROOT 0x80000000 CERT_CHAIN_REVOCATION_CHECK_CACHE_ONLY Setting to 0 disables CRL checking Full list of supported values is documented by dwFlags of CertGetCertificateChain: https://msdn.microsoft.com/library/windows/desktop/aa376078(v=vs.85).aspx |
|CrlDisablePeriod|TimeSpan, default is Common::TimeSpan::FromMinutes(15)|Dynamic|Specify timespan in seconds. How long CRL checking is disabled for a given certificate after encountering offline error; if CRL offline error can be ignored. |
|CrlOfflineHealthReportTtl|TimeSpan, default is Common::TimeSpan::FromMinutes(1440)|Dynamic|Specify timespan in seconds. |
|DisableFirewallRuleForDomainProfile| bool, default is TRUE |Static| Indicates if firewall rule shouldn't be enabled for domain profile |
|DisableFirewallRuleForPrivateProfile| bool, default is TRUE |Static| Indicates if firewall rule shouldn't be enabled for private profile | 
|DisableFirewallRuleForPublicProfile| bool, default is TRUE | Static|Indicates if firewall rule shouldn't be enabled for public profile |
| EnforceLinuxMinTlsVersion | bool, default is FALSE | Static | If set to true; only TLS version 1.2+ is supported.  If false; support earlier TLS versions. Applies to Linux only |
| EnforcePrevalidationOnSecurityChanges | bool, default is FALSE| Dynamic | Flag controlling the behavior of cluster upgrade upon detecting changes of its security settings. If set to 'true', the cluster upgrade will attempt to ensure that at least one of the certificates matching any of the presentation rules can pass a corresponding validation rule. The pre-validation is executed before the new settings are applied to any node, but runs only on the node hosting the primary replica of the Cluster Manager service at the time of initiating the upgrade. The default is currently set to 'false'; starting with release 7.1, the setting will be set to 'true' for new Azure Service Fabric clusters.|
|FabricHostSpn| string, default is "" |Static| Service principal name of FabricHost; when fabric runs as a single domain user (gMSA/domain user account) and FabricHost runs under machine account. It's the SPN of IPC listener for FabricHost; which by default should be left empty since FabricHost runs under machine account |
|IgnoreCrlOfflineError|bool, default is FALSE|Dynamic|Whether to ignore CRL offline error when server-side verifies incoming client certificates |
|IgnoreSvrCrlOfflineError|bool, default is TRUE|Dynamic|Whether to ignore CRL offline error when client side verifies incoming server certificates; default to true. Attacks with revoked server certificates require compromising DNS; harder than with revoked client certificates. |
|ServerAuthCredentialType|string, default is "None"|Static|Indicates the type of security credentials to use in order to secure the communication between FabricClient and the Cluster. Valid values are "None/X509/Windows" |
|ServerCertThumbprints|string, default is ""|Dynamic|Thumbprints of server certificates used by cluster to talk to clients; clients use this to authenticate the cluster. It's a comma-separated name list. |
|SettingsX509StoreName| string, default is "MY"| Dynamic|X509 certificate store used by fabric for configuration protection |
|UseClusterCertForIpcServerTlsSecurity|bool, default is FALSE|Static|Whether to use cluster certificate to secure IPC Server TLS transport unit |
|X509Folder|string, default is /var/lib/waagent|Static|Folder where X509 certificates and private keys are located |
|TLS1_2_CipherList| string| Static|If set to a non-empty string; overrides the supported cipher list for TLS1.2 and below. See the 'openssl-ciphers' documentation for retrieving the supported cipher list and the list format Example of strong cipher list for TLS1.2: "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES-128-GCM-SHA256:ECDHE-ECDSA-AES256-CBC-SHA384:ECDHE-ECDSA-AES128-CBC-SHA256:ECDHE-RSA-AES256-CBC-SHA384:ECDHE-RSA-AES128-CBC-SHA256" Applies to Linux only. |

## Security/AdminClientX509Names

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|X509NameMap, default is None|Dynamic|This is a list of "Name" and "Value" pair. Each "Name" is of subject common name or DnsName of X509 certificates authorized for admin client operations. For a given "Name", "Value" is a comma separate list of certificate thumbprints for issuer pinning, if not empty, the direct issuer of admin client certificates must be in the list. |

## Security/ClientAccess

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|ActivateNode |string, default is "Admin" |Dynamic| Security configuration for activation a node. |
|AddRemoveConfigurationParameterOverrides |wstring, default is L"Admin" |Dynamic|Add/remove configuration parameter overrides|
|CancelTestCommand |string, default is "Admin" |Dynamic| Cancels a specific TestCommand - if it's in flight. |
|CodePackageControl |string, default is "Admin" |Dynamic| Security configuration for restarting code packages. |
|CreateApplication |string, default is "Admin" | Dynamic|Security configuration for application creation. |
|CreateComposeDeployment|string, default is "Admin"| Dynamic|Creates a compose deployment described by compose files |
|CreateGatewayResource|string, default is "Admin"| Dynamic|Create a gateway resource |
|CreateName |string, default is "Admin" |Dynamic|Security configuration for Naming URI creation. |
|CreateNetwork|string, default is "Admin" |Dynamic|Creates a container network |
|CreateService |string, default is "Admin" |Dynamic| Security configuration for service creation. |
|CreateServiceFromTemplate |string, default is "Admin" |Dynamic|Security configuration for service creation from template. |
|CreateVolume|string, default is "Admin"|Dynamic|Creates a volume |
|DeactivateNode |string, default is "Admin" |Dynamic| Security configuration for deactivating a node. |
|DeactivateNodesBatch |string, default is "Admin" |Dynamic| Security configuration for deactivating multiple nodes. |
|Delete |string, default is "Admin" |Dynamic| Security configurations for image store client delete operation. |
|DeleteApplication |string, default is "Admin" |Dynamic| Security configuration for application deletion. |
|DeleteComposeDeployment|string, default is "Admin"| Dynamic|Deletes the compose deployment |
|DeleteGatewayResource|string, default is "Admin"| Dynamic|Deletes a gateway resource |
|DeleteName |string, default is "Admin" |Dynamic|Security configuration for Naming URI deletion. |
|DeleteNetwork|string, default is "Admin" |Dynamic|Deletes a container network |
|DeleteService |string, default is "Admin" |Dynamic|Security configuration for service deletion. |
|DeleteVolume|string, default is "Admin"|Dynamic|Deletes a volume.| 
|EnumerateProperties |string, default is "Admin\|\|User" | Dynamic|Security configuration for Naming property enumeration. |
|EnumerateSubnames |string, default is "Admin\|\|User" |Dynamic| Security configuration for Naming URI enumeration. |
|FileContent |string, default is "Admin" |Dynamic| Security configuration for image store client file transfer (external to cluster). |
|FileDownload |string, default is "Admin" |Dynamic| Security configuration for image store client file download initiation (external to cluster). |
|FinishInfrastructureTask |string, default is "Admin" |Dynamic| Security configuration for finishing infrastructure tasks. |
|GetChaosReport | string, default is "Admin\|\|User" |Dynamic| Fetches the status of Chaos within a given time range. |
|GetClusterConfiguration | string, default is "Admin\|\|User" | Dynamic|Induces GetClusterConfiguration on a partition. |
|GetClusterConfigurationUpgradeStatus | string, default is "Admin\|\|User" |Dynamic| Induces GetClusterConfigurationUpgradeStatus on a partition. |
|GetFabricUpgradeStatus |string, default is "Admin\|\|User" |Dynamic| Security configuration for polling cluster upgrade status. |
|GetFolderSize |string, default is "Admin" |Dynamic|Security configuration for FileStoreService's getting folder size |
|GetNodeDeactivationStatus |string, default is "Admin" |Dynamic| Security configuration for checking deactivation status. |
|GetNodeTransitionProgress | string, default is "Admin\|\|User" |Dynamic| Security configuration for getting progress on a node transition command. |
|GetPartitionDataLossProgress | string, default is "Admin\|\|User" | Dynamic|Fetches the progress for an invoke data loss api call. |
|GetPartitionQuorumLossProgress | string, default is "Admin\|\|User" |Dynamic| Fetches the progress for an invoke quorum loss api call. |
|GetPartitionRestartProgress | string, default is "Admin\|\|User" |Dynamic| Fetches the progress for a restart partition api call. |
|GetSecrets|string, default is "Admin"|Dynamic|Get secret values |
|GetServiceDescription |string, default is "Admin\|\|User" |Dynamic| Security configuration for long-poll service notifications and reading service descriptions. |
|GetStagingLocation |string, default is "Admin" |Dynamic| Security configuration for image store client staging location retrieval. |
|GetStoreLocation |string, default is "Admin" |Dynamic| Security configuration for image store client store location retrieval. |
|GetUpgradeOrchestrationServiceState|string, default is "Admin"| Dynamic|Induces GetUpgradeOrchestrationServiceState on a partition |
|GetUpgradesPendingApproval |string, default is "Admin" |Dynamic| Induces GetUpgradesPendingApproval on a partition. |
|GetUpgradeStatus |string, default is "Admin\|\|User" |Dynamic| Security configuration for polling application upgrade status. |
|InternalList |string, default is "Admin" | Dynamic|Security configuration for image store client file list operation (internal). |
|InvokeContainerApi|string, default is "Admin"|Dynamic|Invoke container API |
|InvokeInfrastructureCommand |string, default is "Admin" |Dynamic| Security configuration for infrastructure task management commands. |
|InvokeInfrastructureQuery |string, default is "Admin\|\|User" | Dynamic|Security configuration for querying infrastructure tasks. |
|List |string, default is "Admin\|\|User" | Dynamic|Security configuration for image store client file list operation. |
|MoveNextFabricUpgradeDomain |string, default is "Admin" |Dynamic| Security configuration for resuming cluster upgrades with an explicit Upgrade Domain. |
|MoveNextUpgradeDomain |string, default is "Admin" |Dynamic| Security configuration for resuming application upgrades with an explicit Upgrade Domain. |
|MoveReplicaControl |string, default is "Admin" | Dynamic|Move replica. |
|NameExists |string, default is "Admin\|\|User" | Dynamic|Security configuration for Naming URI existence checks. |
|NodeControl |string, default is "Admin" |Dynamic| Security configuration for starting; stopping; and restarting nodes. |
|NodeStateRemoved |string, default is "Admin" |Dynamic| Security configuration for reporting node state removed. |
|Ping |string, default is "Admin\|\|User" |Dynamic| Security configuration for client pings. |
|PredeployPackageToNode |string, default is "Admin" |Dynamic| Predeployment api. |
|PrefixResolveService |string, default is "Admin\|\|User" |Dynamic| Security configuration for complaint-based service prefix resolution. |
|PropertyReadBatch |string, default is "Admin\|\|User" |Dynamic| Security configuration for Naming property read operations. |
|PropertyWriteBatch |string, default is "Admin" |Dynamic|Security configurations for Naming property write operations. |
|ProvisionApplicationType |string, default is "Admin" |Dynamic| Security configuration for application type provisioning. |
|ProvisionFabric |string, default is "Admin" |Dynamic| Security configuration for MSI and/or Cluster Manifest provisioning. |
|Query |string, default is "Admin\|\|User" |Dynamic| Security configuration for queries. |
|RecoverPartition |string, default is "Admin" | Dynamic|Security configuration for recovering a partition. |
|RecoverPartitions |string, default is "Admin" | Dynamic|Security configuration for recovering partitions. |
|RecoverServicePartitions |string, default is "Admin" |Dynamic| Security configuration for recovering service partitions. |
|RecoverSystemPartitions |string, default is "Admin" |Dynamic| Security configuration for recovering system service partitions. |
|RegisterAuthorizedConnection |wstring, default is L"Admin" | Dynamic |Register authorized connection. |
|RemoveNodeDeactivations |string, default is "Admin" |Dynamic| Security configuration for reverting deactivation on multiple nodes. |
|ReportCompletion |wstring, default is L"Admin" |Dynamic| Security configuration for reporting completion. |
|ReportFabricUpgradeHealth |string, default is "Admin" |Dynamic| Security configuration for resuming cluster upgrades with the current upgrade progress. |
|ReportFault |string, default is "Admin" |Dynamic| Security configuration for reporting fault. |
|ReportHealth |string, default is "Admin" |Dynamic| Security configuration for reporting health. |
|ReportUpgradeHealth |string, default is "Admin" |Dynamic| Security configuration for resuming application upgrades with the current upgrade progress. |
|ResetPartitionLoad |string, default is "Admin\|\|User" |Dynamic| Security configuration for reset load for a failoverUnit. |
|ResolveNameOwner |string, default is "Admin\|\|User" | Dynamic|Security configuration for resolving Naming URI owner. |
|ResolvePartition |string, default is "Admin\|\|User" | Dynamic|Security configuration for resolving system services. |
|ResolveService |string, default is "Admin\|\|User" |Dynamic| Security configuration for complaint-based service resolution. |
|ResolveSystemService|string, default is "Admin\|\|User"|Dynamic| Security configuration for resolving system services |
|RollbackApplicationUpgrade |string, default is "Admin" |Dynamic| Security configuration for rolling back application upgrades. |
|RollbackFabricUpgrade |string, default is "Admin" |Dynamic| Security configuration for rolling back cluster upgrades. |
|ServiceNotifications |string, default is "Admin\|\|User" |Dynamic| Security configuration for event-based service notifications. |
|SetUpgradeOrchestrationServiceState|string, default is "Admin"| Dynamic|Induces SetUpgradeOrchestrationServiceState on a partition |
|StartApprovedUpgrades |string, default is "Admin" |Dynamic| Induces StartApprovedUpgrades on a partition. |
|StartChaos |string, default is "Admin" |Dynamic| Starts Chaos - if it's not already started. |
|StartClusterConfigurationUpgrade |string, default is "Admin" |Dynamic| Induces StartClusterConfigurationUpgrade on a partition. |
|StartInfrastructureTask |string, default is "Admin" | Dynamic|Security configuration for starting infrastructure tasks. |
|StartNodeTransition |string, default is "Admin" |Dynamic| Security configuration for starting a node transition. |
|StartPartitionDataLoss |string, default is "Admin" |Dynamic| Induces data loss on a partition. |
|StartPartitionQuorumLoss |string, default is "Admin" |Dynamic| Induces quorum loss on a partition. |
|StartPartitionRestart |string, default is "Admin" |Dynamic| Simultaneously restarts some or all the replicas of a partition. |
|StopChaos |string, default is "Admin" |Dynamic| Stops Chaos - if it has been started. |
|ToggleVerboseServicePlacementHealthReporting | string, default is "Admin\|\|User" |Dynamic| Security configuration for Toggling Verbose ServicePlacement HealthReporting. |
|UnprovisionApplicationType |string, default is "Admin" |Dynamic| Security configuration for application type unprovisioning. |
|UnprovisionFabric |string, default is "Admin" |Dynamic| Security configuration for MSI and/or Cluster Manifest unprovisioning. |
|UnreliableLeaseBehavior |wstring, default is L"Admin" |Dynamic| Adding/Removing unreliable Lease behavior |
|UnreliableTransportControl |string, default is "Admin" |Dynamic| Unreliable Transport for adding and removing behaviors. |
|UpdateService |string, default is "Admin" |Dynamic|Security configuration for service updates. |
|UpgradeApplication |string, default is "Admin" |Dynamic| Security configuration for starting or interrupting application upgrades. |
|UpgradeComposeDeployment|string, default is "Admin"| Dynamic|Upgrades the compose deployment |
|UpgradeFabric |string, default is "Admin" |Dynamic| Security configuration for starting cluster upgrades. |
|Upload |string, default is "Admin" | Dynamic|Security configuration for image store client upload operation. |

## Security/ClientCertificateIssuerStores

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|IssuerStoreKeyValueMap, default is None |Dynamic|X509 issuer certificate stores for client certificates; Name = clientIssuerCN; Value = comma separated list of stores |

## Security/ClientX509Names

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|X509NameMap, default is None|Dynamic|This is a list of "Name" and "Value" pair. Each "Name" is of subject common name or DnsName of X509 certificates authorized for client operations. For a given "Name", "Value" is a comma separate list of certificate thumbprints for issuer pinning, if not empty, the direct issuer of client certificates must be in the list.|

## Security/ClusterCertificateIssuerStores

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|IssuerStoreKeyValueMap, default is None |Dynamic|X509 issuer certificate stores for cluster certificates; Name = clusterIssuerCN; Value = comma separated list of stores |

## Security/ClusterX509Names

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|X509NameMap, default is None|Dynamic|This is a list of "Name" and "Value" pair. Each "Name" is of subject common name or DnsName of X509 certificates authorized for cluster operations. For a given "Name","Value" is a comma separate list of certificate thumbprints for issuer pinning, if not empty, the direct issuer of cluster certificates must be in the list.|

## Security/ServerCertificateIssuerStores

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|IssuerStoreKeyValueMap, default is None |Dynamic|X509 issuer certificate stores for server certificates; Name = serverIssuerCN; Value = comma separated list of stores |

## Security/ServerX509Names

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup|X509NameMap, default is None|Dynamic|This is a list of "Name" and "Value" pair. Each "Name" is of subject common name or DnsName of X509 certificates authorized for server operations. For a given "Name", "Value" is a comma separate list of certificate thumbprints for issuer pinning, if not empty, the direct issuer of server certificates must be in the list.|

## Setup

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|BlockAccessToWireServer|bool, default is FALSE| Static |Blocks access to ports of the WireServer endpoint from Docker containers deployed as Service Fabric applications. This parameter is supported for Service Fabric clusters deployed on Azure Virtual Machines, Windows and Linux, and defaults to 'false' (access is permitted).|
|ContainerNetworkName|string, default is ""| Static |The network name to use when setting up a container network.|
|ContainerNetworkSetup|bool, default is FALSE (Linux) and default is TRUE (Windows)| Static |Whether to set up a container network.|
|FabricDataRoot |String | Not Allowed |Service Fabric data root directory. Default for Azure is d:\svcfab (Only for Standalone Deployments)|
|FabricLogRoot |String | Not Allowed |Service fabric log root directory. This is where SF logs and traces are placed. (Only for Standalone Deployments)|
|NodesToBeRemoved|string, default is ""| Dynamic |The nodes which should be removed as part of configuration upgrade. (Only for Standalone Deployments)|
|ServiceRunAsAccountName |String | Not Allowed |The account name under which to run fabric host service. |
|SkipContainerNetworkResetOnReboot|bool, default is FALSE|NotAllowed|Whether to skip resetting container network on reboot.|
|SkipFirewallConfiguration |Bool, default is false | Dynamic |Specifies if firewall settings need to be set by the system or not. This applies only if you're using Windows Defender Firewall. If you're using third-party firewalls, then you must open the ports for the system and applications to use |

## TokenValidationService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|Providers |string, default is "DSTS" |Static|Comma separated list of token validation providers to enable (valid providers are: DSTS; Azure Active Directory). Currently only a single provider can be enabled at any time. |

## Trace/Etw

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|Level |Int, default is 4 | Dynamic |Trace etw level can take values 1, 2, 3, 4. To be supported you must keep the trace level at 4 |

## TransactionalReplicator
<i> **Warning Note** : Changing Replication/TranscationalReplicator settings at cluster level changes settings for all stateful services include system services. This is generally not recommended. See this document [Configure Azure Service Fabric Reliable Services - Azure Service Fabric | Microsoft Docs](./service-fabric-reliable-services-configuration.md) to configure services at app level.</i>

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|BatchAcknowledgementInterval | Time in seconds, default is 0.015 | Static | Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before sending back an acknowledgment. Other operations received during this time period will have their acknowledgments sent back in a single message-> reducing network traffic but potentially reducing the throughput of the replicator. |
|MaxCopyQueueSize |Uint, default is 16384 | Static |This is the maximum value defines the initial size for the queue which maintains replication operations. Note that it must be a power of 2. If during runtime the queue grows to this size operation will be throttled between the primary and secondary replicators. |
|MaxPrimaryReplicationQueueMemorySize |Uint, default is 0 | Static |This is the maximum value of the primary replication queue in bytes. |
|MaxPrimaryReplicationQueueSize |Uint, default is 8192 | Static |This is the maximum number of operations that could exist in the primary replication queue. Note that it must be a power of 2. |
|MaxReplicationMessageSize |Uint, default is 52428800 | Static | Maximum message size of replication operations. Default is 50MB. |
|MaxSecondaryReplicationQueueMemorySize |Uint, default is 0 | Static |This is the maximum value of the secondary replication queue in bytes. |
|MaxSecondaryReplicationQueueSize |Uint, default is 16384 | Static |This is the maximum number of operations that could exist in the secondary replication queue. Note that it must be a power of 2. |
|ReplicatorAddress |string, default is "localhost:0" | Static | The endpoint in form of a string -'IP:Port' which is used by the Windows Fabric Replicator to establish connections with other replicas in order to send/receive operations. |
|ReplicationBatchSendInterval|TimeSpan, default is Common::TimeSpan::FromMilliseconds(15) | Static | Specify timespan in seconds. Determines the amount of time that the replicator waits after receiving an operation before force sending a batch.|
|ShouldAbortCopyForTruncation |bool, default is FALSE | Static | Allow pending log truncation to go through during copy. With this enabled the copy stage of builds can be canceled if the log is full and they are block truncation. |

## Transport
| **Parameter** | **Allowed Values** |**Upgrade policy** |**Guidance or Short Description** |
| --- | --- | --- | --- |
|ConnectionOpenTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(60)|Static|Specify timespan in seconds. Time out for connection setup on both incoming and accepting side (including security negotiation in secure mode) |
|FrameHeaderErrorCheckingEnabled|bool, default is TRUE|Static|Default setting for error checking on frame header in non-secure mode; component setting overrides this. |
|MessageErrorCheckingEnabled|bool, default is TRUE|Static|Default setting for error checking on message header and body in non-secure mode; component setting overrides this. |
|ResolveOption|string, default is "unspecified"|Static|Determines how FQDN is resolved.  Valid values are "unspecified/ipv4/ipv6". |
|SendTimeout|TimeSpan, default is Common::TimeSpan::FromSeconds(300)|Dynamic|Specify timespan in seconds. Send timeout for detecting stuck connection. TCP failure reports are not reliable in some environment. This may need to be adjusted according to available network bandwidth and size of outbound data (\*MaxMessageSize\/\*SendQueueSizeLimit). |

## UpgradeOrchestrationService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|AutoupgradeEnabled | Bool, default is true |Static| Automatic polling and upgrade action based on a goal-state file. |
|AutoupgradeInstallEnabled|Bool, default is FALSE|Static|Automatic polling, provisioning and install of code upgrade action based on a goal-state file.|
|GoalStateExpirationReminderInDays|int, default is 30|Static|Sets the number of remaining days after which goal state reminder should be shown.|
|MinReplicaSetSize |Int, default is 0 |Static |The MinReplicaSetSize for UpgradeOrchestrationService.|
|PlacementConstraints | string, default is "" |Static| The PlacementConstraints for UpgradeOrchestrationService. |
|QuorumLossWaitDuration | Time in seconds, default is MaxValue |Static| Specify timespan in seconds. The QuorumLossWaitDuration for UpgradeOrchestrationService. |
|ReplicaRestartWaitDuration | Time in seconds, default is 60 minutes|Static| Specify timespan in seconds. The ReplicaRestartWaitDuration for UpgradeOrchestrationService. |
|StandByReplicaKeepDuration | Time in seconds, default is 60*24*7 minutes |Static| Specify timespan in seconds. The StandByReplicaKeepDuration for UpgradeOrchestrationService. |
|TargetReplicaSetSize |Int, default is 0 |Static |The TargetReplicaSetSize for UpgradeOrchestrationService. |
|UpgradeApprovalRequired | Bool, default is false | Static|Setting to make code upgrade require administrator approval before proceeding. |

## UpgradeService

| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|BaseUrl | string, default is "" |Static|BaseUrl for UpgradeService. |
|ClusterId | string, default is "" |Static|ClusterId for UpgradeService. |
|CoordinatorType | string, default is "WUTest"|Not Allowed|The CoordinatorType for UpgradeService. |
|MinReplicaSetSize | Int, default is 2 |Not Allowed| The MinReplicaSetSize for UpgradeService. |
|OnlyBaseUpgrade | Bool, default is false |Dynamic|OnlyBaseUpgrade for UpgradeService. |
|PlacementConstraints |string, default is "" |Not Allowed|The PlacementConstraints for Upgrade service. |
|PollIntervalInSeconds|Timespan, default is Common::TimeSpan::FromSeconds(60) |Dynamic|Specify timespan in seconds. The interval between UpgradeService poll for ARM management operations. |
|TargetReplicaSetSize | Int, default is 3 |Not Allowed| The TargetReplicaSetSize for UpgradeService. |
|TestCabFolder | string, default is "" |Static| TestCabFolder for UpgradeService. |
|X509FindType | string, default is ""|Dynamic| X509FindType for UpgradeService. |
|X509FindValue | string, default is "" |Dynamic| X509FindValue for UpgradeService. |
|X509SecondaryFindValue | string, default is "" |Dynamic| X509SecondaryFindValue for UpgradeService. |
|X509StoreLocation | string, default is "" |Dynamic| X509StoreLocation for UpgradeService. |
|X509StoreName | string, default is "My"|Dynamic|X509StoreName for UpgradeService. |

## UserServiceMetricCapacities
| **Parameter** | **Allowed Values** | **Upgrade Policy** | **Guidance or Short Description** |
| --- | --- | --- | --- |
|PropertyGroup| UserServiceMetricCapacitiesMap, default is None | Static | A collection of user services resource governance limits Needs to be static as it affects Auto-Detection logic |

## Next steps
For more information, see [Upgrade the configuration of an Azure cluster](service-fabric-cluster-config-upgrade-azure.md) and [Upgrade the configuration of a standalone cluster](service-fabric-cluster-config-upgrade-windows-server.md).
