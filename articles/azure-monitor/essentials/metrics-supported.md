---
title: Azure Monitor supported metrics by resource type
description: List of metrics available for each resource type with Azure Monitor.
author: EdB-MSFT
services: azure-monitor
ms.topic: reference
ms.custom: ignite-2022
ms.date: 04/13/2023
ms.author: edbaynash
ms.reviewer: priyamishra
---

# Supported metrics with Azure Monitor

> [!NOTE]
> This list is largely auto-generated. Any modification made to this list via GitHub might be written over without warning. Contact the author of this article for details on how to make permanent updates.

Date list was last updated: 04/13/2023.

Azure Monitor provides several ways to interact with metrics, including charting them in the Azure portal, accessing them through the REST API, or querying them by using PowerShell or the Azure CLI (Command Line Interface).  

This article is a complete list of all platform (that is, automatically collected) metrics currently available with the consolidated metric pipeline in Azure Monitor. Metrics changed or added after the date at the top of this article might not yet appear in the list. To query for and access the list of metrics programmatically, use the [2018-01-01 api-version](/rest/api/monitor/metricdefinitions). Other metrics not in this list might be available in the portal or through legacy APIs.

The metrics are organized by resource provider and resource type. For a list of services and the resource providers and types that belong to them, see [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md).  

## Exporting platform metrics to other locations

You can export the platform metrics from the Azure monitor pipeline to other locations in one of two ways:

- Use the [metrics REST API](/rest/api/monitor/metrics/list).
- Use [diagnostic settings](../essentials/diagnostic-settings.md) to route platform metrics to: 
    - Azure Storage.
    - Azure Monitor Logs (and thus Log Analytics).
    - Event hubs, which is how you get them to non-Microsoft systems. 

Using diagnostic settings is the easiest way to route the metrics, but there are some limitations: 

- **Exportability**. All metrics are exportable through the REST API, but some can't be exported through diagnostic settings because of intricacies in the Azure Monitor back end. The column "Exportable via Diagnostic Settings" in the following tables lists which metrics can be exported in this way.  

- **Multi-dimensional metrics**. Sending multi-dimensional metrics to other locations via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single-dimensional metrics, aggregated across dimension values. 

  For example, the *Incoming Messages* metric on an event hub can be explored and charted on a per-queue level. But when the metric is exported via diagnostic settings, it will be represented as all incoming messages across all queues in the event hub.

## Guest OS and host OS metrics

Metrics for the guest operating system (guest OS) that runs in Azure Virtual Machines, Service Fabric, and Cloud Services are *not* listed here. Guest OS metrics must be collected through one or more agents that run on or as part of the guest operating system. Guest OS metrics include performance counters that track guest CPU percentage or memory usage, both of which are frequently used for autoscaling or alerting. 

Host OS metrics *are* available and listed in the tables. Host OS metrics relate to the Hyper-V session that's hosting your guest OS session. 

> [!TIP]
> A best practice is to use and configure the Azure Monitor agent to send guest OS performance metrics into the same Azure Monitor metric database where platform metrics are stored. The agent routes guest OS metrics through the [custom metrics](../essentials/metrics-custom-overview.md) API. You can then chart, alert, and otherwise use guest OS metrics like platform metrics. 
>
> Alternatively or in addition, you can send the guest OS metrics to Azure Monitor Logs by using the same agent. There you can query on those metrics in combination with non-metric data by using Log Analytics. Standard [Log Analytics workspace costs](https://azure.microsoft.com/pricing/details/monitor/) would then apply.  

The Azure Monitor agent replaces the Azure Diagnostics extension and Log Analytics agent, which were previously used for guest OS routing. For important additional information, see [Overview of Azure Monitor agents](../agents/agents-overview.md).

## Table formatting

This latest update adds a new column and reorders the metrics to be alphabetical. The additional information means that the tables might have a horizontal scroll bar at the bottom, depending on the width of your browser window. If you seem to be missing information, use the scroll bar to see the entirety of the table.

## Microsoft.AAD/DomainServices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|\DirectoryServices(NTDS)\LDAP Searches/sec |Yes |NTDS - LDAP Searches/sec |CountPerSecond |Average |This metric indicates the average number of searches per second for the NTDS object. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\DirectoryServices(NTDS)\LDAP Successful Binds/sec |Yes |NTDS - LDAP Successful Binds/sec |CountPerSecond |Average |This metric indicates the number of LDAP successful binds per second for the NTDS object. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\DNS\Total Query Received/sec |Yes |DNS - Total Query Received/sec |CountPerSecond |Average |This metric indicates the average number of queries received by DNS server in each second. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\DNS\Total Response Sent/sec |Yes |Total Response Sent/sec |CountPerSecond |Average |This metric indicates the average number of reponses sent by DNS server in each second. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\Memory\% Committed Bytes In Use |Yes |% Committed Bytes In Use |Percent |Average |This metric indicates the ratio of Memory\Committed Bytes to the Memory\Commit Limit. Committed memory is the physical memory in use for which space has been reserved in the paging file should it need to be written to disk. The commit limit is determined by the size of the paging file. If the paging file is enlarged, the commit limit increases, and the ratio is reduced. This counter displays the current percentage value only; it is not an average. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\Process(dns)\% Processor Time |Yes |% Processor Time (dns) |Percent |Average |This metric indicates the percentage of elapsed time that all of dns process threads used the processor to execute instructions. An instruction is the basic unit of execution in a computer, a thread is the object that executes instructions, and a process is the object created when a program is run. Code executed to handle some hardware interrupts and trap conditions are included in this count. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\Process(lsass)\% Processor Time |Yes |% Processor Time (lsass) |Percent |Average |This metric indicates the percentage of elapsed time that all of lsass process threads used the processor to execute instructions. An instruction is the basic unit of execution in a computer, a thread is the object that executes instructions, and a process is the object created when a program is run. Code executed to handle some hardware interrupts and trap conditions are included in this count. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\Processor(_Total)\% Processor Time |Yes |Total Processor Time |Percent |Average |This metric indicates the percentage of elapsed time that the processor spends to execute a non-Idle thread. It is calculated by measuring the percentage of time that the processor spends executing the idle thread and then subtracting that value from 100%. (Each processor has an idle thread that consumes cycles when no other threads are ready to run). This counter is the primary indicator of processor activity, and displays the average percentage of busy time observed during the sample interval. It should be noted that the accounting calculation of whether the processor is idle is performed at an internal sampling interval of the system clock (10ms). On todays fast processors, % Processor Time can therefore underestimate the processor utilization as the processor may be spending a lot of time servicing threads between the system clock sampling interval. Workload based timer applications are one example  of applications  which are more likely to be measured inaccurately as timers are signaled just after the sample is taken. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\Security System-Wide Statistics\Kerberos Authentications |Yes |Kerberos Authentications |CountPerSecond |Average |This metric indicates the number of times that clients use a ticket to authenticate to this computer per second. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |
|\Security System-Wide Statistics\NTLM Authentications |Yes |NTLM Authentications |CountPerSecond |Average |This metric indicates the number of NTLM authentications processed per second for the Active Directory on this domain contrller or for local accounts on this member server. It is backed by performance counter data from the domain controller, and can be filtered or splitted by role instance. |DataCenter, Tenant, Role, RoleInstance, ScaleUnit |

## microsoft.aadiam/azureADMetrics  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CACompliantDeviceSuccessCount |Yes |CACompliantDeviceSuccessCount |Count |Count |CA comliant device scuccess count for Azure AD |No Dimensions |
|CAManagedDeviceSuccessCount |No |CAManagedDeviceSuccessCount |Count |Count |CA domain join device success count for Azure AD |No Dimensions |
|MFAAttemptCount |No |MFAAttemptCount |Count |Count |MFA attempt count for Azure AD |No Dimensions |
|MFAFailureCount |No |MFAFailureCount |Count |Count |MFA failure count for Azure AD |No Dimensions |
|MFASuccessCount |No |MFASuccessCount |Count |Count |MFA success count for Azure AD |No Dimensions |
|SamlFailureCount |Yes |SamlFailureCount |Count |Count |Saml token failure count for relying party scenario |No Dimensions |
|SamlSuccessCount |Yes |SamlSuccessCount |Count |Count |Saml token scuccess count for relying party scenario |No Dimensions |

## Microsoft.AnalysisServices/servers  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CleanerCurrentPrice |Yes |Memory: Cleaner Current Price |Count |Average |Current price of memory, $/byte/time, normalized to 1000. |ServerResourceType |
|CleanerMemoryNonshrinkable |Yes |Memory: Cleaner Memory nonshrinkable |Bytes |Average |Amount of memory, in bytes, not subject to purging by the background cleaner. |ServerResourceType |
|CleanerMemoryShrinkable |Yes |Memory: Cleaner Memory shrinkable |Bytes |Average |Amount of memory, in bytes, subject to purging by the background cleaner. |ServerResourceType |
|CommandPoolBusyThreads |Yes |Threads: Command pool busy threads |Count |Average |Number of busy threads in the command thread pool. |ServerResourceType |
|CommandPoolIdleThreads |Yes |Threads: Command pool idle threads |Count |Average |Number of idle threads in the command thread pool. |ServerResourceType |
|CommandPoolJobQueueLength |Yes |Command Pool Job Queue Length |Count |Average |Number of jobs in the queue of the command thread pool. |ServerResourceType |
|CurrentConnections |Yes |Connection: Current connections |Count |Average |Current number of client connections established. |ServerResourceType |
|CurrentUserSessions |Yes |Current User Sessions |Count |Average |Current number of user sessions established. |ServerResourceType |
|LongParsingBusyThreads |Yes |Threads: Long parsing busy threads |Count |Average |Number of busy threads in the long parsing thread pool. |ServerResourceType |
|LongParsingIdleThreads |Yes |Threads: Long parsing idle threads |Count |Average |Number of idle threads in the long parsing thread pool. |ServerResourceType |
|LongParsingJobQueueLength |Yes |Threads: Long parsing job queue length |Count |Average |Number of jobs in the queue of the long parsing thread pool. |ServerResourceType |
|mashup_engine_memory_metric |Yes |M Engine Memory |Bytes |Average |Memory usage by mashup engine processes |ServerResourceType |
|mashup_engine_private_bytes_metric |Yes |M Engine Private Bytes |Bytes |Average |Private bytes usage by mashup engine processes. |ServerResourceType |
|mashup_engine_qpu_metric |Yes |M Engine QPU |Count |Average |QPU usage by mashup engine processes |ServerResourceType |
|mashup_engine_virtual_bytes_metric |Yes |M Engine Virtual Bytes |Bytes |Average |Virtual bytes usage by mashup engine processes. |ServerResourceType |
|memory_metric |Yes |Memory |Bytes |Average |Memory. Range 0-25 GB for S1, 0-50 GB for S2 and 0-100 GB for S4 |ServerResourceType |
|memory_thrashing_metric |Yes |Memory Thrashing |Percent |Average |Average memory thrashing. |ServerResourceType |
|MemoryLimitHard |Yes |Memory: Memory Limit Hard |Bytes |Average |Hard memory limit, from configuration file. |ServerResourceType |
|MemoryLimitHigh |Yes |Memory: Memory Limit High |Bytes |Average |High memory limit, from configuration file. |ServerResourceType |
|MemoryLimitLow |Yes |Memory: Memory Limit Low |Bytes |Average |Low memory limit, from configuration file. |ServerResourceType |
|MemoryLimitVertiPaq |Yes |Memory: Memory Limit VertiPaq |Bytes |Average |In-memory limit, from configuration file. |ServerResourceType |
|MemoryUsage |Yes |Memory: Memory Usage |Bytes |Average |Memory usage of the server process as used in calculating cleaner memory price. Equal to counter Process\PrivateBytes plus the size of memory-mapped data, ignoring any memory which was mapped or allocated by the xVelocity in-memory analytics engine (VertiPaq) in excess of the xVelocity engine Memory Limit. |ServerResourceType |
|private_bytes_metric |Yes |Private Bytes |Bytes |Average |Private bytes. |ServerResourceType |
|ProcessingPoolBusyIOJobThreads |Yes |Threads: Processing pool busy I/O job threads |Count |Average |Number of threads running I/O jobs in the processing thread pool. |ServerResourceType |
|ProcessingPoolBusyNonIOThreads |Yes |Threads: Processing pool busy non-I/O threads |Count |Average |Number of threads running non-I/O jobs in the processing thread pool. |ServerResourceType |
|ProcessingPoolIdleIOJobThreads |Yes |Threads: Processing pool idle I/O job threads |Count |Average |Number of idle threads for I/O jobs in the processing thread pool. |ServerResourceType |
|ProcessingPoolIdleNonIOThreads |Yes |Threads: Processing pool idle non-I/O threads |Count |Average |Number of idle threads in the processing thread pool dedicated to non-I/O jobs. |ServerResourceType |
|ProcessingPoolIOJobQueueLength |Yes |Threads: Processing pool I/O job queue length |Count |Average |Number of I/O jobs in the queue of the processing thread pool. |ServerResourceType |
|ProcessingPoolJobQueueLength |Yes |Processing Pool Job Queue Length |Count |Average |Number of non-I/O jobs in the queue of the processing thread pool. |ServerResourceType |
|qpu_metric |Yes |QPU |Count |Average |QPU. Range 0-100 for S1, 0-200 for S2 and 0-400 for S4 |ServerResourceType |
|QueryPoolBusyThreads |Yes |Query Pool Busy Threads |Count |Average |Number of busy threads in the query thread pool. |ServerResourceType |
|QueryPoolIdleThreads |Yes |Threads: Query pool idle threads |Count |Average |Number of idle threads for I/O jobs in the processing thread pool. |ServerResourceType |
|QueryPoolJobQueueLength |Yes |Threads: Query pool job queue lengt |Count |Average |Number of jobs in the queue of the query thread pool. |ServerResourceType |
|Quota |Yes |Memory: Quota |Bytes |Average |Current memory quota, in bytes. Memory quota is also known as a memory grant or memory reservation. |ServerResourceType |
|QuotaBlocked |Yes |Memory: Quota Blocked |Count |Average |Current number of quota requests that are blocked until other memory quotas are freed. |ServerResourceType |
|RowsConvertedPerSec |Yes |Processing: Rows converted per sec |CountPerSecond |Average |Rate of rows converted during processing. |ServerResourceType |
|RowsReadPerSec |Yes |Processing: Rows read per sec |CountPerSecond |Average |Rate of rows read from all relational databases. |ServerResourceType |
|RowsWrittenPerSec |Yes |Processing: Rows written per sec |CountPerSecond |Average |Rate of rows written during processing. |ServerResourceType |
|ShortParsingBusyThreads |Yes |Threads: Short parsing busy threads |Count |Average |Number of busy threads in the short parsing thread pool. |ServerResourceType |
|ShortParsingIdleThreads |Yes |Threads: Short parsing idle threads |Count |Average |Number of idle threads in the short parsing thread pool. |ServerResourceType |
|ShortParsingJobQueueLength |Yes |Threads: Short parsing job queue length |Count |Average |Number of jobs in the queue of the short parsing thread pool. |ServerResourceType |
|SuccessfullConnectionsPerSec |Yes |Successful Connections Per Sec |CountPerSecond |Average |Rate of successful connection completions. |ServerResourceType |
|TotalConnectionFailures |Yes |Total Connection Failures |Count |Average |Total failed connection attempts. |ServerResourceType |
|TotalConnectionRequests |Yes |Total Connection Requests |Count |Average |Total connection requests. These are arrivals. |ServerResourceType |
|VertiPaqNonpaged |Yes |Memory: VertiPaq Nonpaged |Bytes |Average |Bytes of memory locked in the working set for use by the in-memory engine. |ServerResourceType |
|VertiPaqPaged |Yes |Memory: VertiPaq Paged |Bytes |Average |Bytes of paged memory in use for in-memory data. |ServerResourceType |
|virtual_bytes_metric |Yes |Virtual Bytes |Bytes |Average |Virtual bytes. |ServerResourceType |

## Microsoft.ApiManagement/service  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BackendDuration |Yes |Duration of Backend Requests |MilliSeconds |Average |Duration of Backend Requests in milliseconds |Location, Hostname |
|Capacity |Yes |Capacity |Percent |Average |Utilization metric for ApiManagement service. Note: For skus other than Premium, 'Max' aggregation will show the value as 0. |Location |
|ConnectionAttempts |Yes |WebSocket Connection Attempts (Preview) |Count |Total |Count of WebSocket connection attempts based on selected source and destination |Location, Source, Destination, State |
|Duration |Yes |Overall Duration of Gateway Requests |MilliSeconds |Average |Overall Duration of Gateway Requests in milliseconds |Location, Hostname |
|EventHubDroppedEvents |Yes |Dropped EventHub Events |Count |Total |Number of events skipped because of queue size limit reached |Location |
|EventHubRejectedEvents |Yes |Rejected EventHub Events |Count |Total |Number of rejected EventHub events (wrong configuration or unauthorized) |Location |
|EventHubSuccessfulEvents |Yes |Successful EventHub Events |Count |Total |Number of successful EventHub events |Location |
|EventHubThrottledEvents |Yes |Throttled EventHub Events |Count |Total |Number of throttled EventHub events |Location |
|EventHubTimedoutEvents |Yes |Timed Out EventHub Events |Count |Total |Number of timed out EventHub events |Location |
|EventHubTotalBytesSent |Yes |Size of EventHub Events |Bytes |Total |Total size of EventHub events in bytes |Location |
|EventHubTotalEvents |Yes |Total EventHub Events |Count |Total |Number of events sent to EventHub |Location |
|EventHubTotalFailedEvents |Yes |Failed EventHub Events |Count |Total |Number of failed EventHub events |Location |
|FailedRequests |Yes |Failed Gateway Requests (Deprecated) |Count |Total |Number of failures in gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead |Location, Hostname |
|NetworkConnectivity |Yes |Network Connectivity Status of Resources (Preview) |Count |Average |Network Connectivity status of dependent resource types from API Management service |Location, ResourceType |
|OtherRequests |Yes |Other Gateway Requests (Deprecated) |Count |Total |Number of other gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead |Location, Hostname |
|Requests |Yes |Requests |Count |Total |Gateway request metrics with multiple dimensions |Location, Hostname, LastErrorReason, BackendResponseCode, GatewayResponseCode, BackendResponseCodeCategory, GatewayResponseCodeCategory |
|SuccessfulRequests |Yes |Successful Gateway Requests (Deprecated) |Count |Total |Number of successful gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead |Location, Hostname |
|TotalRequests |Yes |Total Gateway Requests (Deprecated) |Count |Total |Number of gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead |Location, Hostname |
|UnauthorizedRequests |Yes |Unauthorized Gateway Requests (Deprecated) |Count |Total |Number of unauthorized gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead |Location, Hostname |
|WebSocketMessages |Yes |WebSocket Messages (Preview) |Count |Total |Count of WebSocket messages based on selected source and destination |Location, Source, Destination |

## Microsoft.App/containerapps  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CoresQuotaUsed |Yes |Reserved Cores |Count |Maximum |Number of reserved cores for container app revisions |revisionName |
|Replicas |Yes |Replica Count |Count |Maximum |Number of replicas count of container app |revisionName |
|Requests |Yes |Requests |Count |Total |Requests processed |revisionName, podName, statusCodeCategory, statusCode |
|RestartCount |Yes |Replica Restart Count |Count |Maximum |Restart count of container app replicas |revisionName, podName |
|RxBytes |Yes |Network In Bytes |Bytes |Total |Network received bytes |revisionName, podName |
|TotalCoresQuotaUsed |Yes |Total Reserved Cores |Count |Average |Number of total reserved cores for the container app |No Dimensions |
|TxBytes |Yes |Network Out Bytes |Bytes |Total |Network transmitted bytes |revisionName, podName |
|UsageNanoCores |Yes |CPU Usage |NanoCores |Average |CPU consumed by the container app, in nano cores. 1,000,000,000 nano cores = 1 core |revisionName, podName |
|WorkingSetBytes |Yes |Memory Working Set Bytes |Bytes |Average |Container App working set memory used in bytes. |revisionName, podName |

## Microsoft.App/managedEnvironments  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|EnvCoresQuotaLimit |Yes |Cores Quota Limit |Count |Average |The cores quota limit of managed environment |No Dimensions |
|EnvCoresQuotaUtilization |Yes |Percentage Cores Used Out Of Limit |Percent |Average |The cores quota utilization of managed environment |No Dimensions |

## Microsoft.AppConfiguration/configurationStores  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DailyStorageUsage |Yes |DailyStorageUsage |Percent |Maximum |Total storage usage of the store in percentage. Updated at minimum every 24 hours. |No Dimensions |
|HttpIncomingRequestCount |Yes |HttpIncomingRequestCount |Count |Total |Total number of incoming http requests. |StatusCode, Authentication, Endpoint |
|HttpIncomingRequestDuration |Yes |HttpIncomingRequestDuration |Count |Average |Latency on an http request. |StatusCode, Authentication, Endpoint |
|ThrottledHttpRequestCount |Yes |ThrottledHttpRequestCount |Count |Total |Throttled http requests. |Endpoint |

## Microsoft.AppPlatform/Spring  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active-timer-count |Yes |active-timer-count |Count |Average |Number of timers that are currently active |Deployment, AppName, Pod |
|alloc-rate |Yes |alloc-rate |Bytes |Average |Number of bytes allocated in the managed heap |Deployment, AppName, Pod |
|AppCpuUsage |Yes |App CPU Usage (Deprecated) |Percent |Average |The recent CPU usage for the app. This metric is being deprecated. Please use "App CPU Usage" with metric id "PodCpuUsage". |Deployment, AppName, Pod |
|assembly-count |Yes |assembly-count |Count |Average |Number of Assemblies Loaded |Deployment, AppName, Pod |
|cpu-usage |Yes |cpu-usage |Percent |Average |% time the process has utilized the CPU |Deployment, AppName, Pod |
|current-requests |Yes |current-requests |Count |Average |Total number of requests in processing in the lifetime of the process |Deployment, AppName, Pod |
|exception-count |Yes |exception-count |Count |Total |Number of Exceptions |Deployment, AppName, Pod |
|failed-requests |Yes |failed-requests |Count |Average |Total number of failed requests in the lifetime of the process |Deployment, AppName, Pod |
|GatewayHttpServerRequestsMilliSecondsMax |Yes |Max time of requests |Milliseconds |Maximum |The max time of requests |Pod, httpStatusCode, outcome, httpMethod |
|GatewayHttpServerRequestsMilliSecondsSum |Yes |Total time of requests |Milliseconds |Total |The total time of requests |Pod, httpStatusCode, outcome, httpMethod |
|GatewayHttpServerRequestsSecondsCount |Yes |Request count |Count |Total |The number of requests |Pod, httpStatusCode, outcome, httpMethod |
|GatewayJvmGcLiveDataSizeBytes |Yes |jvm.gc.live.data.size |Bytes |Average |Size of old generation memory pool after a full GC |Pod |
|GatewayJvmGcMaxDataSizeBytes |Yes |jvm.gc.max.data.size |Bytes |Maximum |Max size of old generation memory pool |Pod |
|GatewayJvmGcMemoryAllocatedBytesTotal |Yes |jvm.gc.memory.allocated |Bytes |Maximum |Incremented for an increase in the size of the young generation memory pool after one GC to before the next |Pod |
|GatewayJvmGcMemoryPromotedBytesTotal |Yes |jvm.gc.memory.promoted |Bytes |Maximum |Count of positive increases in the size of the old generation memory pool before GC to after GC |Pod |
|GatewayJvmGcPauseSecondsCount |Yes |jvm.gc.pause.total.count |Count |Total |GC Pause Count |Pod |
|GatewayJvmGcPauseSecondsMax |Yes |jvm.gc.pause.max.time |Seconds |Maximum |GC Pause Max Time |Pod |
|GatewayJvmGcPauseSecondsSum |Yes |jvm.gc.pause.total.time |Seconds |Total |GC Pause Total Time |Pod |
|GatewayJvmMemoryCommittedBytes |Yes |jvm.memory.committed |Bytes |Average |Memory assigned to JVM in bytes |Pod |
|GatewayJvmMemoryUsedBytes |Yes |jvm.memory.used |Bytes |Average |Memory Used in bytes |Pod |
|GatewayProcessCpuUsage |Yes |process.cpu.usage |Percent |Average |The recent CPU usage for the JVM process |Pod |
|GatewayRatelimitThrottledCount |Yes |Throttled requests count |Count |Total |The count of the throttled requests |Pod |
|GatewaySystemCpuUsage |Yes |system.cpu.usage |Percent |Average |The recent CPU usage for the whole system |Pod |
|gc-heap-size |Yes |gc-heap-size |Count |Average |Total heap size reported by the GC (MB) |Deployment, AppName, Pod |
|gen-0-gc-count |Yes |gen-0-gc-count |Count |Average |Number of Gen 0 GCs |Deployment, AppName, Pod |
|gen-0-size |Yes |gen-0-size |Bytes |Average |Gen 0 Heap Size |Deployment, AppName, Pod |
|gen-1-gc-count |Yes |gen-1-gc-count |Count |Average |Number of Gen 1 GCs |Deployment, AppName, Pod |
|gen-1-size |Yes |gen-1-size |Bytes |Average |Gen 1 Heap Size |Deployment, AppName, Pod |
|gen-2-gc-count |Yes |gen-2-gc-count |Count |Average |Number of Gen 2 GCs |Deployment, AppName, Pod |
|gen-2-size |Yes |gen-2-size |Bytes |Average |Gen 2 Heap Size |Deployment, AppName, Pod |
|IngressBytesReceived |Yes |Bytes Received |Bytes |Average |Count of bytes received by Azure Spring Apps from the clients |Hostname, HttpStatus |
|IngressBytesReceivedRate |Yes |Throughput In (bytes/s) |BytesPerSecond |Average |Bytes received per second by Azure Spring Apps from the clients |Hostname, HttpStatus |
|IngressBytesSent |Yes |Bytes Sent |Bytes |Average |Count of bytes sent by Azure Spring Apps to the clients |Hostname, HttpStatus |
|IngressBytesSentRate |Yes |Throughput Out (bytes/s) |BytesPerSecond |Average |Bytes sent per second by Azure Spring Apps to the clients |Hostname, HttpStatus |
|IngressFailedRequests |Yes |Failed Requests |Count |Average |Count of failed requests by Azure Spring Apps from the clients |Hostname, HttpStatus |
|IngressRequests |Yes |Requests |Count |Average |Count of requests by Azure Spring Apps from the clients |Hostname, HttpStatus |
|IngressResponseStatus |Yes |Response Status |Count |Average |HTTP response status returned by Azure Spring Apps. The response status code distribution can be further categorized to show responses in 2xx, 3xx, 4xx, and 5xx categories |Hostname, HttpStatus |
|IngressResponseTime |Yes |Response Time |Seconds |Average |Http response time return by Azure Spring Apps |Hostname, HttpStatus |
|jvm.gc.live.data.size |Yes |jvm.gc.live.data.size |Bytes |Average |Size of old generation memory pool after a full GC |Deployment, AppName, Pod |
|jvm.gc.max.data.size |Yes |jvm.gc.max.data.size |Bytes |Average |Max size of old generation memory pool |Deployment, AppName, Pod |
|jvm.gc.memory.allocated |Yes |jvm.gc.memory.allocated |Bytes |Maximum |Incremented for an increase in the size of the young generation memory pool after one GC to before the next |Deployment, AppName, Pod |
|jvm.gc.memory.promoted |Yes |jvm.gc.memory.promoted |Bytes |Maximum |Count of positive increases in the size of the old generation memory pool before GC to after GC |Deployment, AppName, Pod |
|jvm.gc.pause.total.count |Yes |jvm.gc.pause.total.count |Count |Total |GC Pause Count |Deployment, AppName, Pod |
|jvm.gc.pause.total.time |Yes |jvm.gc.pause.total.time |Milliseconds |Total |GC Pause Total Time |Deployment, AppName, Pod |
|jvm.memory.committed |Yes |jvm.memory.committed |Bytes |Average |Memory assigned to JVM in bytes |Deployment, AppName, Pod |
|jvm.memory.max |Yes |jvm.memory.max |Bytes |Maximum |The maximum amount of memory in bytes that can be used for memory management |Deployment, AppName, Pod |
|jvm.memory.used |Yes |jvm.memory.used |Bytes |Average |App Memory Used in bytes |Deployment, AppName, Pod |
|loh-size |Yes |loh-size |Bytes |Average |LOH Heap Size |Deployment, AppName, Pod |
|monitor-lock-contention-count |Yes |monitor-lock-contention-count |Count |Average |Number of times there were contention when trying to take the monitor lock |Deployment, AppName, Pod |
|PodCpuUsage |Yes |App CPU Usage |Percent |Average |The recent CPU usage for the app |Deployment, AppName, Pod |
|PodMemoryUsage |Yes |App Memory Usage |Percent |Average |The recent Memory usage for the app |Deployment, AppName, Pod |
|PodNetworkIn |Yes |App Network In |Bytes |Average |Cumulative count of bytes received in the app |Deployment, AppName, Pod |
|PodNetworkOut |Yes |App Network Out |Bytes |Average |Cumulative count of bytes sent from the app |Deployment, AppName, Pod |
|process.cpu.usage |Yes |process.cpu.usage |Percent |Average |The recent CPU usage for the JVM process |Deployment, AppName, Pod |
|Requests |Yes |Requests |Count |Total |Requests processed |containerAppName, podName, statusCodeCategory, statusCode |
|requests-per-second |Yes |requests-rate |Count |Average |Request rate |Deployment, AppName, Pod |
|RestartCount |Yes |Restart Count |Count |Maximum |Restart count of Spring App |containerAppName, podName |
|RxBytes |Yes |Network In Bytes |Bytes |Total |Network received bytes |containerAppName, podName |
|system.cpu.usage |Yes |system.cpu.usage |Percent |Average |The recent CPU usage for the whole system |Deployment, AppName, Pod |
|threadpool-completed-items-count |Yes |threadpool-completed-items-count |Count |Average |ThreadPool Completed Work Items Count |Deployment, AppName, Pod |
|threadpool-queue-length |Yes |threadpool-queue-length |Count |Average |ThreadPool Work Items Queue Length |Deployment, AppName, Pod |
|threadpool-thread-count |Yes |threadpool-thread-count |Count |Average |Number of ThreadPool Threads |Deployment, AppName, Pod |
|time-in-gc |Yes |time-in-gc |Percent |Average |% time in GC since the last GC |Deployment, AppName, Pod |
|tomcat.global.error |Yes |tomcat.global.error |Count |Total |Tomcat Global Error |Deployment, AppName, Pod |
|tomcat.global.received |Yes |tomcat.global.received |Bytes |Total |Tomcat Total Received Bytes |Deployment, AppName, Pod |
|tomcat.global.request.avg.time |Yes |tomcat.global.request.avg.time |Milliseconds |Average |Tomcat Request Average Time |Deployment, AppName, Pod |
|tomcat.global.request.max |Yes |tomcat.global.request.max |Milliseconds |Maximum |Tomcat Request Max Time |Deployment, AppName, Pod |
|tomcat.global.request.total.count |Yes |tomcat.global.request.total.count |Count |Total |Tomcat Request Total Count |Deployment, AppName, Pod |
|tomcat.global.request.total.time |Yes |tomcat.global.request.total.time |Milliseconds |Total |Tomcat Request Total Time |Deployment, AppName, Pod |
|tomcat.global.sent |Yes |tomcat.global.sent |Bytes |Total |Tomcat Total Sent Bytes |Deployment, AppName, Pod |
|tomcat.sessions.active.current |Yes |tomcat.sessions.active.current |Count |Total |Tomcat Session Active Count |Deployment, AppName, Pod |
|tomcat.sessions.active.max |Yes |tomcat.sessions.active.max |Count |Total |Tomcat Session Max Active Count |Deployment, AppName, Pod |
|tomcat.sessions.alive.max |Yes |tomcat.sessions.alive.max |Milliseconds |Maximum |Tomcat Session Max Alive Time |Deployment, AppName, Pod |
|tomcat.sessions.created |Yes |tomcat.sessions.created |Count |Total |Tomcat Session Created Count |Deployment, AppName, Pod |
|tomcat.sessions.expired |Yes |tomcat.sessions.expired |Count |Total |Tomcat Session Expired Count |Deployment, AppName, Pod |
|tomcat.sessions.rejected |Yes |tomcat.sessions.rejected |Count |Total |Tomcat Session Rejected Count |Deployment, AppName, Pod |
|tomcat.threads.config.max |Yes |tomcat.threads.config.max |Count |Total |Tomcat Config Max Thread Count |Deployment, AppName, Pod |
|tomcat.threads.current |Yes |tomcat.threads.current |Count |Total |Tomcat Current Thread Count |Deployment, AppName, Pod |
|total-requests |Yes |total-requests |Count |Average |Total number of requests in the lifetime of the process |Deployment, AppName, Pod |
|TxBytes |Yes |Network Out Bytes |Bytes |Total |Network transmitted bytes |containerAppName, podName |
|UsageNanoCores |Yes |CPU Usage |NanoCores |Average |CPU consumed by Spring App, in nano cores. 1,000,000,000 nano cores = 1 core |containerAppName, podName |
|working-set |Yes |working-set |Count |Average |Amount of working set used by the process (MB) |Deployment, AppName, Pod |
|WorkingSetBytes |Yes |Memory Working Set Bytes |Bytes |Average |Spring App working set memory used in bytes. |containerAppName, podName |

## Microsoft.Automation/automationAccounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|HybridWorkerPing |Yes |Hybrid Worker Ping |Count |Count |The number of pings from the hybrid worker |HybridWorkerGroup, HybridWorker, HybridWorkerVersion |
|TotalJob |Yes |Total Jobs |Count |Total |The total number of jobs |Runbook, Status |
|TotalUpdateDeploymentMachineRuns |Yes |Total Update Deployment Machine Runs |Count |Total |Total software update deployment machine runs in a software update deployment run |Status, TargetComputer, SoftwareUpdateConfigurationName, SoftwareUpdateConfigurationRunId |
|TotalUpdateDeploymentRuns |Yes |Total Update Deployment Runs |Count |Total |Total software update deployment runs |Status, SoftwareUpdateConfigurationName |

## microsoft.avs/privateClouds  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CapacityLatest |Yes |Datastore Disk Total Capacity |Bytes |Average |The total capacity of disk in the datastore |dsname |
|DiskUsedPercentage |Yes | Percentage Datastore Disk Used |Percent |Average |Percent of available disk used in Datastore |dsname |
|EffectiveCpuAverage |Yes |Percentage CPU |Percent |Average |Percentage of Used CPU resources in Cluster |clustername |
|EffectiveMemAverage |Yes |Average Effective Memory |Bytes |Average |Total available amount of machine memory in cluster |clustername |
|OverheadAverage |Yes |Average Memory Overhead |Bytes |Average |Host physical memory consumed by the virtualization infrastructure |clustername |
|TotalMbAverage |Yes |Average Total Memory |Bytes |Average |Total memory in cluster |clustername |
|UsageAverage |Yes |Average Memory Usage |Percent |Average |Memory usage as percentage of total configured or available memory |clustername |
|UsedLatest |Yes |Datastore Disk Used |Bytes |Average |The total amount of disk used in the datastore |dsname |

## microsoft.azuresphere/catalogs  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeviceAttestationCount |Yes |Device Attestation Requests |Count |Count |Count of all the requests sent by an Azure Sphere device for authentication and attestation. |DeviceId, CatalogId, StatusCodeClass |
|DeviceErrorCount |Yes |Device Errors |Count |Count |Count of all the errors encountered by an Azure Sphere device. |DeviceId, CatalogId, ErrorCategory, ErrorClass, ErrorType |

## Microsoft.Batch/batchaccounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CoreCount |No |Dedicated Core Count |Count |Total |Total number of dedicated cores in the batch account |No Dimensions |
|CreatingNodeCount |No |Creating Node Count |Count |Total |Number of nodes being created |No Dimensions |
|IdleNodeCount |No |Idle Node Count |Count |Total |Number of idle nodes |No Dimensions |
|JobDeleteCompleteEvent |Yes |Job Delete Complete Events |Count |Total |Total number of jobs that have been successfully deleted. |jobId |
|JobDeleteStartEvent |Yes |Job Delete Start Events |Count |Total |Total number of jobs that have been requested to be deleted. |jobId |
|JobDisableCompleteEvent |Yes |Job Disable Complete Events |Count |Total |Total number of jobs that have been successfully disabled. |jobId |
|JobDisableStartEvent |Yes |Job Disable Start Events |Count |Total |Total number of jobs that have been requested to be disabled. |jobId |
|JobStartEvent |Yes |Job Start Events |Count |Total |Total number of jobs that have been successfully started. |jobId |
|JobTerminateCompleteEvent |Yes |Job Terminate Complete Events |Count |Total |Total number of jobs that have been successfully terminated. |jobId |
|JobTerminateStartEvent |Yes |Job Terminate Start Events |Count |Total |Total number of jobs that have been requested to be terminated. |jobId |
|LeavingPoolNodeCount |No |Leaving Pool Node Count |Count |Total |Number of nodes leaving the Pool |No Dimensions |
|LowPriorityCoreCount |No |LowPriority Core Count |Count |Total |Total number of low-priority cores in the batch account |No Dimensions |
|OfflineNodeCount |No |Offline Node Count |Count |Total |Number of offline nodes |No Dimensions |
|PoolCreateEvent |Yes |Pool Create Events |Count |Total |Total number of pools that have been created |poolId |
|PoolDeleteCompleteEvent |Yes |Pool Delete Complete Events |Count |Total |Total number of pool deletes that have completed |poolId |
|PoolDeleteStartEvent |Yes |Pool Delete Start Events |Count |Total |Total number of pool deletes that have started |poolId |
|PoolResizeCompleteEvent |Yes |Pool Resize Complete Events |Count |Total |Total number of pool resizes that have completed |poolId |
|PoolResizeStartEvent |Yes |Pool Resize Start Events |Count |Total |Total number of pool resizes that have started |poolId |
|PreemptedNodeCount |No |Preempted Node Count |Count |Total |Number of preempted nodes |No Dimensions |
|RebootingNodeCount |No |Rebooting Node Count |Count |Total |Number of rebooting nodes |No Dimensions |
|ReimagingNodeCount |No |Reimaging Node Count |Count |Total |Number of reimaging nodes |No Dimensions |
|RunningNodeCount |No |Running Node Count |Count |Total |Number of running nodes |No Dimensions |
|StartingNodeCount |No |Starting Node Count |Count |Total |Number of nodes starting |No Dimensions |
|StartTaskFailedNodeCount |No |Start Task Failed Node Count |Count |Total |Number of nodes where the Start Task has failed |No Dimensions |
|TaskCompleteEvent |Yes |Task Complete Events |Count |Total |Total number of tasks that have completed |poolId, jobId |
|TaskFailEvent |Yes |Task Fail Events |Count |Total |Total number of tasks that have completed in a failed state |poolId, jobId |
|TaskStartEvent |Yes |Task Start Events |Count |Total |Total number of tasks that have started |poolId, jobId |
|TotalLowPriorityNodeCount |No |Low-Priority Node Count |Count |Total |Total number of low-priority nodes in the batch account |No Dimensions |
|TotalNodeCount |No |Dedicated Node Count |Count |Total |Total number of dedicated nodes in the batch account |No Dimensions |
|UnusableNodeCount |No |Unusable Node Count |Count |Total |Number of unusable nodes |No Dimensions |
|WaitingForStartTaskNodeCount |No |Waiting For Start Task Node Count |Count |Total |Number of nodes waiting for the Start Task to complete |No Dimensions |

## microsoft.bing/accounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BlockedCalls |Yes |Blocked Calls |Count |Total |Number of calls that exceeded the rate or quota limit |ApiName, ServingRegion, StatusCode |
|ClientErrors |Yes |Client Errors |Count |Total |Number of calls with any client error (HTTP status code 4xx) |ApiName, ServingRegion, StatusCode |
|DataIn |Yes |Data In |Bytes |Total |Incoming request Content-Length in bytes |ApiName, ServingRegion, StatusCode |
|DataOut |Yes |Data Out |Bytes |Total |Outgoing response Content-Length in bytes |ApiName, ServingRegion, StatusCode |
|Latency |Yes |Latency |Milliseconds |Average |Latency in milliseconds |ApiName, ServingRegion, StatusCode |
|ServerErrors |Yes |Server Errors |Count |Total |Number of calls with any server error (HTTP status code 5xx) |ApiName, ServingRegion, StatusCode |
|SuccessfulCalls |Yes |Successful Calls |Count |Total |Number of successful calls (HTTP status code 2xx) |ApiName, ServingRegion, StatusCode |
|TotalCalls |Yes |Total Calls |Count |Total |Total number of calls |ApiName, ServingRegion, StatusCode |
|TotalErrors |Yes |Total Errors |Count |Total |Number of calls with any error (HTTP status code 4xx or 5xx) |ApiName, ServingRegion, StatusCode |

## microsoft.botservice/botservices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency |Yes |Request Latency |Milliseconds |Total |Time taken by the server to process the request |Operation, Authentication, Protocol, DataCenter |
|RequestsTraffic |Yes |Requests Traffic |Percent |Count |Number of Requests Made |Operation, Authentication, Protocol, StatusCode, StatusCodeClass, DataCenter |

## Microsoft.BotService/botServices/channels  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency |Yes |Requests Latencies |Milliseconds |Average |How long it takes to get request response |Operation, Authentication, Protocol, ResourceId, Region |
|RequestsTraffic |Yes |Requests Traffic |Count |Average |Number of requests within a given period of time |Operation, Authentication, Protocol, ResourceId, Region, StatusCode, StatusCodeClass, StatusText |

## Microsoft.BotService/botServices/connections  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency |Yes |Requests Latencies |Milliseconds |Average |How long it takes to get request response |Operation, Authentication, Protocol, ResourceId, Region |
|RequestsTraffic |Yes |Requests Traffic |Count |Average |Number of requests within a given period of time |Operation, Authentication, Protocol, ResourceId, Region, StatusCode, StatusCodeClass, StatusText |

## Microsoft.BotService/checknameavailability  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency |Yes |Requests Latencies |Milliseconds |Average |How long it takes to get request response |Operation, Authentication, Protocol, ResourceId, Region |
|RequestsTraffic |Yes |Requests Traffic |Count |Average |Number of requests within a given period of time |Operation, Authentication, Protocol, ResourceId, Region, StatusCode, StatusCodeClass, StatusText |

## Microsoft.BotService/hostsettings  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency |Yes |Requests Latencies |Milliseconds |Average |How long it takes to get request response |Operation, Authentication, Protocol, ResourceId, Region |
|RequestsTraffic |Yes |Requests Traffic |Count |Average |Number of requests within a given period of time |Operation, Authentication, Protocol, ResourceId, Region, StatusCode, StatusCodeClass, StatusText |

## Microsoft.BotService/listauthserviceproviders  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency |Yes |Requests Latencies |Milliseconds |Average |How long it takes to get request response |Operation, Authentication, Protocol, ResourceId, Region |
|RequestsTraffic |Yes |Requests Traffic |Count |Average |Number of requests within a given period of time |Operation, Authentication, Protocol, ResourceId, Region, StatusCode, StatusCodeClass, StatusText |

## Microsoft.BotService/listqnamakerendpointkeys  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency |Yes |Requests Latencies |Milliseconds |Average |How long it takes to get request response |Operation, Authentication, Protocol, ResourceId, Region |
|RequestsTraffic |Yes |Requests Traffic |Count |Average |Number of requests within a given period of time |Operation, Authentication, Protocol, ResourceId, Region, StatusCode, StatusCodeClass, StatusText |

## Microsoft.Cache/redis  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|allcachehits |Yes |Cache Hits (Instance Based) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allcachemisses |Yes |Cache Misses (Instance Based) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allcacheRead |Yes |Cache Read (Instance Based) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allcacheWrite |Yes |Cache Write (Instance Based) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allconnectedclients |Yes |Connected Clients (Instance Based) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allConnectionsClosedPerSecond |Yes |Connections Closed Per Second (Instance Based) |CountPerSecond |Maximum |The number of instantaneous connections closed per second on the cache via port 6379 or 6380 (SSL). For more details, see https://aka.ms/redis/metrics. |ShardId, Primary, Ssl |
|allConnectionsCreatedPerSecond |Yes |Connections Created Per Second (Instance Based) |CountPerSecond |Maximum |The number of instantaneous connections created per second on the cache via port 6379 or 6380 (SSL). For more details, see https://aka.ms/redis/metrics. |ShardId, Primary, Ssl |
|allevictedkeys |Yes |Evicted Keys (Instance Based) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allexpiredkeys |Yes |Expired Keys (Instance Based) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allgetcommands |Yes |Gets (Instance Based) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|alloperationsPerSecond |Yes |Operations Per Second (Instance Based) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allpercentprocessortime |Yes |CPU (Instance Based) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allserverLoad |Yes |Server Load (Instance Based) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allsetcommands |Yes |Sets (Instance Based) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|alltotalcommandsprocessed |Yes |Total Operations  (Instance Based) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|alltotalkeys |Yes |Total Keys (Instance Based) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allusedmemory |Yes |Used Memory (Instance Based) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allusedmemorypercentage |Yes |Used Memory Percentage (Instance Based) |Percent |Maximum |The percentage of cache memory used for key/value pairs. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|allusedmemoryRss |Yes |Used Memory RSS (Instance Based) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |ShardId, Port, Primary |
|cachehits |Yes |Cache Hits |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |ShardId |
|cachehits0 |Yes |Cache Hits (Shard 0) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits1 |Yes |Cache Hits (Shard 1) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits2 |Yes |Cache Hits (Shard 2) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits3 |Yes |Cache Hits (Shard 3) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits4 |Yes |Cache Hits (Shard 4) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits5 |Yes |Cache Hits (Shard 5) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits6 |Yes |Cache Hits (Shard 6) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits7 |Yes |Cache Hits (Shard 7) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits8 |Yes |Cache Hits (Shard 8) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachehits9 |Yes |Cache Hits (Shard 9) |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheLatency |Yes |Cache Latency Microseconds (Preview) |Count |Average |The latency to the cache in microseconds. For more details, see https://aka.ms/redis/metrics. |ShardId |
|cachemisses |Yes |Cache Misses |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |ShardId |
|cachemisses0 |Yes |Cache Misses (Shard 0) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses1 |Yes |Cache Misses (Shard 1) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses2 |Yes |Cache Misses (Shard 2) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses3 |Yes |Cache Misses (Shard 3) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses4 |Yes |Cache Misses (Shard 4) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses5 |Yes |Cache Misses (Shard 5) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses6 |Yes |Cache Misses (Shard 6) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses7 |Yes |Cache Misses (Shard 7) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses8 |Yes |Cache Misses (Shard 8) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemisses9 |Yes |Cache Misses (Shard 9) |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cachemissrate |Yes |Cache Miss Rate |Percent |Total |The % of get requests that miss. For more details, see https://aka.ms/redis/metrics. |ShardId |
|cacheRead |Yes |Cache Read |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |ShardId |
|cacheRead0 |Yes |Cache Read (Shard 0) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead1 |Yes |Cache Read (Shard 1) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead2 |Yes |Cache Read (Shard 2) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead3 |Yes |Cache Read (Shard 3) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead4 |Yes |Cache Read (Shard 4) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead5 |Yes |Cache Read (Shard 5) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead6 |Yes |Cache Read (Shard 6) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead7 |Yes |Cache Read (Shard 7) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead8 |Yes |Cache Read (Shard 8) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheRead9 |Yes |Cache Read (Shard 9) |BytesPerSecond |Maximum |The amount of data read from the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite |Yes |Cache Write |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |ShardId |
|cacheWrite0 |Yes |Cache Write (Shard 0) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite1 |Yes |Cache Write (Shard 1) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite2 |Yes |Cache Write (Shard 2) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite3 |Yes |Cache Write (Shard 3) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite4 |Yes |Cache Write (Shard 4) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite5 |Yes |Cache Write (Shard 5) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite6 |Yes |Cache Write (Shard 6) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite7 |Yes |Cache Write (Shard 7) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite8 |Yes |Cache Write (Shard 8) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|cacheWrite9 |Yes |Cache Write (Shard 9) |BytesPerSecond |Maximum |The amount of data written to the cache in bytes per second. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients |Yes |Connected Clients |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |ShardId |
|connectedclients0 |Yes |Connected Clients (Shard 0) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients1 |Yes |Connected Clients (Shard 1) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients2 |Yes |Connected Clients (Shard 2) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients3 |Yes |Connected Clients (Shard 3) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients4 |Yes |Connected Clients (Shard 4) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients5 |Yes |Connected Clients (Shard 5) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients6 |Yes |Connected Clients (Shard 6) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients7 |Yes |Connected Clients (Shard 7) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients8 |Yes |Connected Clients (Shard 8) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|connectedclients9 |Yes |Connected Clients (Shard 9) |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|errors |Yes |Errors |Count |Maximum |The number errors that occured on the cache. For more details, see https://aka.ms/redis/metrics. |ShardId, ErrorType |
|evictedkeys |Yes |Evicted Keys |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |ShardId |
|evictedkeys0 |Yes |Evicted Keys (Shard 0) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys1 |Yes |Evicted Keys (Shard 1) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys2 |Yes |Evicted Keys (Shard 2) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys3 |Yes |Evicted Keys (Shard 3) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys4 |Yes |Evicted Keys (Shard 4) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys5 |Yes |Evicted Keys (Shard 5) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys6 |Yes |Evicted Keys (Shard 6) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys7 |Yes |Evicted Keys (Shard 7) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys8 |Yes |Evicted Keys (Shard 8) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|evictedkeys9 |Yes |Evicted Keys (Shard 9) |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys |Yes |Expired Keys |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |ShardId |
|expiredkeys0 |Yes |Expired Keys (Shard 0) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys1 |Yes |Expired Keys (Shard 1) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys2 |Yes |Expired Keys (Shard 2) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys3 |Yes |Expired Keys (Shard 3) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys4 |Yes |Expired Keys (Shard 4) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys5 |Yes |Expired Keys (Shard 5) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys6 |Yes |Expired Keys (Shard 6) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys7 |Yes |Expired Keys (Shard 7) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys8 |Yes |Expired Keys (Shard 8) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|expiredkeys9 |Yes |Expired Keys (Shard 9) |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|GeoReplicationConnectivityLag |Yes |Geo-replication Connectivity Lag |Seconds |Average |Time in seconds since last successful data synchronization with geo-primary cache. Value will continue to increase if the link status is down. For more details, see https://aka.ms/redis/georeplicationmetrics. |ShardId |
|GeoReplicationDataSyncOffset |Yes |Geo-replication Data Sync Offset |Bytes |Average |Approximate amount of data in bytes that needs to be synchronized to geo-secondary cache. For more details, see https://aka.ms/redis/georeplicationmetrics. |ShardId |
|GeoReplicationFullSyncEventFinished |Yes |Geo-replication Full Sync Event Finished |Count |Count |Fired on completion of a full synchronization event between geo-replicated caches. This metric reports 0 most of the time because geo-replication uses partial resynchronizations for any new data added after the initial full synchronization. For more details, see https://aka.ms/redis/georeplicationmetrics. |ShardId |
|GeoReplicationFullSyncEventStarted |Yes |Geo-replication Full Sync Event Started |Count |Count |Fired on initiation of a full synchronization event between geo-replicated caches. This metric reports 0 most of the time because geo-replication uses partial resynchronizations for any new data added after the initial full synchronization. For more details, see https://aka.ms/redis/georeplicationmetrics. |ShardId |
|GeoReplicationHealthy |Yes |Geo-replication Healthy |Count |Minimum |The health status of geo-replication link. 1 if healthy and 0 if disconnected or unhealthy. For more details, see https://aka.ms/redis/georeplicationmetrics. |ShardId |
|getcommands |Yes |Gets |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |ShardId |
|getcommands0 |Yes |Gets (Shard 0) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands1 |Yes |Gets (Shard 1) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands2 |Yes |Gets (Shard 2) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands3 |Yes |Gets (Shard 3) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands4 |Yes |Gets (Shard 4) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands5 |Yes |Gets (Shard 5) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands6 |Yes |Gets (Shard 6) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands7 |Yes |Gets (Shard 7) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands8 |Yes |Gets (Shard 8) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|getcommands9 |Yes |Gets (Shard 9) |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond |Yes |Operations Per Second |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |ShardId |
|operationsPerSecond0 |Yes |Operations Per Second (Shard 0) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond1 |Yes |Operations Per Second (Shard 1) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond2 |Yes |Operations Per Second (Shard 2) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond3 |Yes |Operations Per Second (Shard 3) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond4 |Yes |Operations Per Second (Shard 4) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond5 |Yes |Operations Per Second (Shard 5) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond6 |Yes |Operations Per Second (Shard 6) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond7 |Yes |Operations Per Second (Shard 7) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond8 |Yes |Operations Per Second (Shard 8) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|operationsPerSecond9 |Yes |Operations Per Second (Shard 9) |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime |Yes |CPU |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |ShardId |
|percentProcessorTime0 |Yes |CPU (Shard 0) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime1 |Yes |CPU (Shard 1) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime2 |Yes |CPU (Shard 2) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime3 |Yes |CPU (Shard 3) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime4 |Yes |CPU (Shard 4) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime5 |Yes |CPU (Shard 5) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime6 |Yes |CPU (Shard 6) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime7 |Yes |CPU (Shard 7) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime8 |Yes |CPU (Shard 8) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|percentProcessorTime9 |Yes |CPU (Shard 9) |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad |Yes |Server Load |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |ShardId |
|serverLoad0 |Yes |Server Load (Shard 0) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad1 |Yes |Server Load (Shard 1) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad2 |Yes |Server Load (Shard 2) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad3 |Yes |Server Load (Shard 3) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad4 |Yes |Server Load (Shard 4) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad5 |Yes |Server Load (Shard 5) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad6 |Yes |Server Load (Shard 6) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad7 |Yes |Server Load (Shard 7) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad8 |Yes |Server Load (Shard 8) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|serverLoad9 |Yes |Server Load (Shard 9) |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands |Yes |Sets |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |ShardId |
|setcommands0 |Yes |Sets (Shard 0) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands1 |Yes |Sets (Shard 1) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands2 |Yes |Sets (Shard 2) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands3 |Yes |Sets (Shard 3) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands4 |Yes |Sets (Shard 4) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands5 |Yes |Sets (Shard 5) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands6 |Yes |Sets (Shard 6) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands7 |Yes |Sets (Shard 7) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands8 |Yes |Sets (Shard 8) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|setcommands9 |Yes |Sets (Shard 9) |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed |Yes |Total Operations |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |ShardId |
|totalcommandsprocessed0 |Yes |Total Operations (Shard 0) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed1 |Yes |Total Operations (Shard 1) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed2 |Yes |Total Operations (Shard 2) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed3 |Yes |Total Operations (Shard 3) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed4 |Yes |Total Operations (Shard 4) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed5 |Yes |Total Operations (Shard 5) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed6 |Yes |Total Operations (Shard 6) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed7 |Yes |Total Operations (Shard 7) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed8 |Yes |Total Operations (Shard 8) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalcommandsprocessed9 |Yes |Total Operations (Shard 9) |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys |Yes |Total Keys |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |ShardId |
|totalkeys0 |Yes |Total Keys (Shard 0) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys1 |Yes |Total Keys (Shard 1) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys2 |Yes |Total Keys (Shard 2) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys3 |Yes |Total Keys (Shard 3) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys4 |Yes |Total Keys (Shard 4) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys5 |Yes |Total Keys (Shard 5) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys6 |Yes |Total Keys (Shard 6) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys7 |Yes |Total Keys (Shard 7) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys8 |Yes |Total Keys (Shard 8) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|totalkeys9 |Yes |Total Keys (Shard 9) |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory |Yes |Used Memory |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |ShardId |
|usedmemory0 |Yes |Used Memory (Shard 0) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory1 |Yes |Used Memory (Shard 1) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory2 |Yes |Used Memory (Shard 2) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory3 |Yes |Used Memory (Shard 3) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory4 |Yes |Used Memory (Shard 4) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory5 |Yes |Used Memory (Shard 5) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory6 |Yes |Used Memory (Shard 6) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory7 |Yes |Used Memory (Shard 7) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory8 |Yes |Used Memory (Shard 8) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemory9 |Yes |Used Memory (Shard 9) |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemorypercentage |Yes |Used Memory Percentage |Percent |Maximum |The percentage of cache memory used for key/value pairs. For more details, see https://aka.ms/redis/metrics. |ShardId |
|usedmemoryRss |Yes |Used Memory RSS |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |ShardId |
|usedmemoryRss0 |Yes |Used Memory RSS (Shard 0) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss1 |Yes |Used Memory RSS (Shard 1) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss2 |Yes |Used Memory RSS (Shard 2) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss3 |Yes |Used Memory RSS (Shard 3) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss4 |Yes |Used Memory RSS (Shard 4) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss5 |Yes |Used Memory RSS (Shard 5) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss6 |Yes |Used Memory RSS (Shard 6) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss7 |Yes |Used Memory RSS (Shard 7) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss8 |Yes |Used Memory RSS (Shard 8) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |
|usedmemoryRss9 |Yes |Used Memory RSS (Shard 9) |Bytes |Maximum |The amount of cache memory used in MB, including fragmentation and metadata. For more details, see https://aka.ms/redis/metrics. |No Dimensions |

## Microsoft.Cache/redisEnterprise  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|cachehits |Yes |Cache Hits |Count |Total |The number of successful key lookups. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|cacheLatency |Yes |Cache Latency Microseconds (Preview) |Count |Average |The latency to the cache in microseconds. For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId |
|cachemisses |Yes |Cache Misses |Count |Total |The number of failed key lookups. For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId |
|cacheRead |Yes |Cache Read |BytesPerSecond |Maximum |The amount of data read from the cache in Megabytes per second (MB/s). For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId |
|cacheWrite |Yes |Cache Write |BytesPerSecond |Maximum |The amount of data written to the cache in Megabytes per second (MB/s). For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId |
|connectedclients |Yes |Connected Clients |Count |Maximum |The number of client connections to the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId |
|errors |Yes |Errors |Count |Maximum |The number errors that occured on the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId, ErrorType |
|evictedkeys |Yes |Evicted Keys |Count |Total |The number of items evicted from the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|expiredkeys |Yes |Expired Keys |Count |Total |The number of items expired from the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|geoReplicationHealthy |Yes |Geo Replication Healthy |Count |Maximum |The health of geo replication in an Active Geo-Replication group. 0 represents Unhealthy and 1 represents Healthy. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|getcommands |Yes |Gets |Count |Total |The number of get operations from the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|operationsPerSecond |Yes |Operations Per Second |Count |Maximum |The number of instantaneous operations per second executed on the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|percentProcessorTime |Yes |CPU |Percent |Maximum |The CPU utilization of the Azure Redis Cache server as a percentage. For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId |
|serverLoad |Yes |Server Load |Percent |Maximum |The percentage of cycles in which the Redis server is busy processing and not waiting idle for messages. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|setcommands |Yes |Sets |Count |Total |The number of set operations to the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|totalcommandsprocessed |Yes |Total Operations |Count |Total |The total number of commands processed by the cache server. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|totalkeys |Yes |Total Keys |Count |Maximum |The total number of items in the cache. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|usedmemory |Yes |Used Memory |Bytes |Maximum |The amount of cache memory used for key/value pairs in the cache in MB. For more details, see https://aka.ms/redis/enterprise/metrics. |No Dimensions |
|usedmemorypercentage |Yes |Used Memory Percentage |Percent |Maximum |The percentage of cache memory used for key/value pairs. For more details, see https://aka.ms/redis/enterprise/metrics. |InstanceId |

## Microsoft.Cdn/cdnwebapplicationfirewallpolicies  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|WebApplicationFirewallRequestCount |Yes |Web Application Firewall Request Count |Count |Total |The number of client requests processed by the Web Application Firewall |PolicyName, RuleName, Action |

## Microsoft.Cdn/profiles  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ByteHitRatio |Yes |Byte Hit Ratio |Percent |Average |This is the ratio of the total bytes served from the cache compared to the total response bytes |Endpoint |
|OriginHealthPercentage |Yes |Origin Health Percentage |Percent |Average |The percentage of successful health probes from AFDX to backends. |Origin, OriginGroup |
|OriginLatency |Yes |Origin Latency |MilliSeconds |Average |The time calculated from when the request was sent by AFDX edge to the backend until AFDX received the last response byte from the backend. |Origin, Endpoint |
|OriginRequestCount |Yes |Origin Request Count |Count |Total |The number of requests sent from AFDX to origin. |HttpStatus, HttpStatusGroup, Origin, Endpoint |
|Percentage4XX |Yes |Percentage of 4XX |Percent |Average |The percentage of all the client requests for which the response status code is 4XX |Endpoint, ClientRegion, ClientCountry |
|Percentage5XX |Yes |Percentage of 5XX |Percent |Average |The percentage of all the client requests for which the response status code is 5XX |Endpoint, ClientRegion, ClientCountry |
|RequestCount |Yes |Request Count |Count |Total |The number of client requests served by the HTTP/S proxy |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint |
|RequestSize |Yes |Request Size |Bytes |Total |The number of bytes sent as requests from clients to AFDX. |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint |
|ResponseSize |Yes |Response Size |Bytes |Total |The number of bytes sent as responses from HTTP/S proxy to clients |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint |
|TotalLatency |Yes |Total Latency |MilliSeconds |Average |The time calculated from when the client request was received by the HTTP/S proxy until the client acknowledged the last response byte from the HTTP/S proxy |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint |
|WebApplicationFirewallRequestCount |Yes |Web Application Firewall Request Count |Count |Total |The number of client requests processed by the Web Application Firewall |PolicyName, RuleName, Action |

## Microsoft.ClassicCompute/domainNames/slots/roles  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Disk Read Bytes/Sec |No |Disk Read |BytesPerSecond |Average |Average bytes read from disk during monitoring period. |RoleInstanceId |
|Disk Read Operations/Sec |Yes |Disk Read Operations/Sec |CountPerSecond |Average |Disk Read IOPS. |RoleInstanceId |
|Disk Write Bytes/Sec |No |Disk Write |BytesPerSecond |Average |Average bytes written to disk during monitoring period. |RoleInstanceId |
|Disk Write Operations/Sec |Yes |Disk Write Operations/Sec |CountPerSecond |Average |Disk Write IOPS. |RoleInstanceId |
|Network In |Yes |Network In |Bytes |Total |The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic). |RoleInstanceId |
|Network Out |Yes |Network Out |Bytes |Total |The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic). |RoleInstanceId |
|Percentage CPU |Yes |Percentage CPU |Percent |Average |The percentage of allocated compute units that are currently in use by the Virtual Machine(s). |RoleInstanceId |

## Microsoft.ClassicCompute/virtualMachines  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Disk Read Bytes/Sec |No |Disk Read |BytesPerSecond |Average |Average bytes read from disk during monitoring period. |No Dimensions |
|Disk Read Operations/Sec |Yes |Disk Read Operations/Sec |CountPerSecond |Average |Disk Read IOPS. |No Dimensions |
|Disk Write Bytes/Sec |No |Disk Write |BytesPerSecond |Average |Average bytes written to disk during monitoring period. |No Dimensions |
|Disk Write Operations/Sec |Yes |Disk Write Operations/Sec |CountPerSecond |Average |Disk Write IOPS. |No Dimensions |
|Network In |Yes |Network In |Bytes |Total |The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic). |No Dimensions |
|Network Out |Yes |Network Out |Bytes |Total |The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic). |No Dimensions |
|Percentage CPU |Yes |Percentage CPU |Percent |Average |The percentage of allocated compute units that are currently in use by the Virtual Machine(s). |No Dimensions |

## Microsoft.ClassicStorage/storageAccounts  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|SuccessE2ELatency |Yes |Success E2E Latency |Milliseconds |Average |The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |Milliseconds |Average |The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication |
|UsedCapacity |No |Used capacity |Bytes |Average |Account used capacity |No Dimensions |

## Microsoft.ClassicStorage/storageAccounts/blobServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|BlobCapacity |No |Blob Capacity |Bytes |Average |The amount of storage used by the storage account's Blob service in bytes. |BlobType, Tier |
|BlobCount |No |Blob Count |Count |Average |The number of Blob in the storage account's Blob service. |BlobType, Tier |
|ContainerCount |No |Blob Container Count |Count |Average |The number of containers in the storage account's Blob service. |No Dimensions |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|IndexCapacity |No |Index Capacity |Bytes |Average |The amount of storage used by ADLS Gen2 (Hierarchical) Index in bytes. |No Dimensions |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|SuccessE2ELatency |Yes |Success E2E Latency |Milliseconds |Average |The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |Milliseconds |Average |The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication |

## Microsoft.ClassicStorage/storageAccounts/fileServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication, FileShare |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication, FileShare |
|FileCapacity |No |File Capacity |Bytes |Average |The amount of storage used by the storage account's File service in bytes. |FileShare |
|FileCount |No |File Count |Count |Average |The number of file in the storage account's File service. |FileShare |
|FileShareCount |No |File Share Count |Count |Average |The number of file shares in the storage account's File service. |No Dimensions |
|FileShareQuota |No |File share quota size |Bytes |Average |The upper limit on the amount of storage that can be used by Azure Files Service in bytes. |FileShare |
|FileShareSnapshotCount |No |File Share Snapshot Count |Count |Average |The number of snapshots present on the share in storage account's Files Service. |FileShare |
|FileShareSnapshotSize |No |File Share Snapshot Size |Bytes |Average |The amount of storage used by the snapshots in storage account's File service in bytes. |FileShare |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication, FileShare |
|SuccessE2ELatency |Yes |Success E2E Latency |Milliseconds |Average |The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication, FileShare |
|SuccessServerLatency |Yes |Success Server Latency |Milliseconds |Average |The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication, FileShare |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication, FileShare |

## Microsoft.ClassicStorage/storageAccounts/queueServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|QueueCapacity |Yes |Queue Capacity |Bytes |Average |The amount of storage used by the storage account's Queue service in bytes. |No Dimensions |
|QueueCount |Yes |Queue Count |Count |Average |The number of queue in the storage account's Queue service. |No Dimensions |
|QueueMessageCount |Yes |Queue Message Count |Count |Average |The approximate number of queue messages in the storage account's Queue service. |No Dimensions |
|SuccessE2ELatency |Yes |Success E2E Latency |Milliseconds |Average |The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |Milliseconds |Average |The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication |

## Microsoft.ClassicStorage/storageAccounts/tableServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|SuccessE2ELatency |Yes |Success E2E Latency |Milliseconds |Average |The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |Milliseconds |Average |The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|TableCapacity |No |Table Capacity |Bytes |Average |The amount of storage used by the storage account's Table service in bytes. |No Dimensions |
|TableCount |No |Table Count |Count |Average |The number of table in the storage account's Table service. |No Dimensions |
|TableEntityCount |No |Table Entity Count |Count |Average |The number of table entities in the storage account's Table service. |No Dimensions |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication |

## Microsoft.Cloudtest/hostedpools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Allocated |Yes |Allocated |Count |Average |Resources that are allocated |PoolId, SKU, Images, ProviderName |
|AllocationDurationMs |Yes |AllocationDurationMs |Milliseconds |Average |Average time to allocate requests (ms) |PoolId, Type, ResourceRequestType, Image |
|Count |Yes |Count |Count |Count |Number of requests in last dump |RequestType, Status, PoolId, Type, ErrorCode, FailureStage |
|NotReady |Yes |NotReady |Count |Average |Resources that are not ready to be used |PoolId, SKU, Images, ProviderName |
|PendingReimage |Yes |PendingReimage |Count |Average |Resources that are pending reimage |PoolId, SKU, Images, ProviderName |
|PendingReturn |Yes |PendingReturn |Count |Average |Resources that are pending return |PoolId, SKU, Images, ProviderName |
|Provisioned |Yes |Provisioned |Count |Average |Resources that are provisioned |PoolId, SKU, Images, ProviderName |
|Ready |Yes |Ready |Count |Average |Resources that are ready to be used |PoolId, SKU, Images, ProviderName |
|Starting |Yes |Starting |Count |Average |Resources that are starting |PoolId, SKU, Images, ProviderName |
|Total |Yes |Total |Count |Average |Total Number of Resources |PoolId, SKU, Images, ProviderName |

## Microsoft.Cloudtest/pools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Allocated |Yes |Allocated |Count |Average |Resources that are allocated |PoolId, SKU, Images, ProviderName |
|AllocationDurationMs |Yes |AllocationDurationMs |Milliseconds |Average |Average time to allocate requests (ms) |PoolId, Type, ResourceRequestType, Image |
|Count |Yes |Count |Count |Count |Number of requests in last dump |RequestType, Status, PoolId, Type, ErrorCode, FailureStage |
|NotReady |Yes |NotReady |Count |Average |Resources that are not ready to be used |PoolId, SKU, Images, ProviderName |
|PendingReimage |Yes |PendingReimage |Count |Average |Resources that are pending reimage |PoolId, SKU, Images, ProviderName |
|PendingReturn |Yes |PendingReturn |Count |Average |Resources that are pending return |PoolId, SKU, Images, ProviderName |
|Provisioned |Yes |Provisioned |Count |Average |Resources that are provisioned |PoolId, SKU, Images, ProviderName |
|Ready |Yes |Ready |Count |Average |Resources that are ready to be used |PoolId, SKU, Images, ProviderName |
|Starting |Yes |Starting |Count |Average |Resources that are starting |PoolId, SKU, Images, ProviderName |
|Total |Yes |Total |Count |Average |Total Number of Resources |PoolId, SKU, Images, ProviderName |

## Microsoft.ClusterStor/nodes  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|TotalCapacityAvailable |No |TotalCapacityAvailable |Bytes |Average |The total capacity available in lustre file system |filesystem_name, category, system |
|TotalCapacityUsed |No |TotalCapacityUsed |Bytes |Average |The total capacity used in lustre file system |filesystem_name, category, system |
|TotalRead |No |TotalRead |BytesPerSecond |Average |The total lustre file system read per second |filesystem_name, category, system |
|TotalWrite |No |TotalWrite |BytesPerSecond |Average |The total lustre file system write per second |filesystem_name, category, system |

## Microsoft.CodeSigning/codesigningaccounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|SignCompleted |Yes |SignCompleted |Count |Count |Completed Sign Request |CertType, Region, TenantId |

## Microsoft.CognitiveServices/accounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActionFeatureIdOccurrences |Yes |Action Feature Occurrences |Count |Total |Number of times each action feature appears. |FeatureId, Mode, RunId |
|ActionFeaturesPerEvent |Yes |Action Features Per Event |Count |Average |Average number of action features per event. |Mode, RunId |
|ActionIdOccurrences |Yes |Action Occurences |Count |Total |Number of times each action appears. |ActionId, Mode, RunId |
|ActionNamespacesPerEvent |Yes |Action Namespaces Per Event |Count |Average |Average number of action namespaces per event. |Mode, RunId |
|ActionsPerEvent |Yes |Actions Per Event |Count |Average |Number of actions per event. |Mode, RunId |
|AudioSecondsTranscribed |Yes |Audio Seconds Transcribed |Count |Total |Number of seconds transcribed |ApiName, FeatureName, UsageChannel, Region |
|AudioSecondsTranslated |Yes |Audio Seconds Translated |Count |Total |Number of seconds translated |ApiName, FeatureName, UsageChannel, Region |
|BaselineEstimatorOverallReward |Yes |Baseline Estimator Overall Reward |Count |Average |Baseline Estimator Overall Reward. |Mode, RunId |
|BaselineEstimatorSlotReward |Yes |Baseline Estimator Slot Reward |Count |Average |Baseline Estimator Reward by slot. |SlotId, SlotIndex, Mode, RunId |
|BaselineRandomEstimatorOverallReward |Yes |Baseline Random Estimator Overall Reward |Count |Average |Baseline Random Estimator Overall Reward. |Mode, RunId |
|BaselineRandomEstimatorSlotReward |Yes |Baseline Random Estimator Slot Reward |Count |Average |Baseline Random Estimator Reward by slot. |SlotId, SlotIndex, Mode, RunId |
|BaselineRandomEventCount |Yes |Baseline Random Event count |Count |Total |Estimation for baseline random event count. |Mode, RunId |
|BaselineRandomReward |Yes |Baseline Random Reward |Count |Total |Estimation for baseline random reward. |Mode, RunId |
|BlockedCalls |Yes |Blocked Calls |Count |Total |Number of calls that exceeded rate or quota limit. |ApiName, OperationName, Region, RatelimitKey |
|CarnegieInferenceCount |Yes |Inference Count |Count |Total |Inference Count of Carnegie Frontdoor Service |Region, Modality, Category, Language, SeverityLevel, UseCustomList |
|CharactersTrained |Yes |Characters Trained (Deprecated) |Count |Total |Total number of characters trained. |ApiName, OperationName, Region |
|CharactersTranslated |Yes |Characters Translated (Deprecated) |Count |Total |Total number of characters in incoming text request. |ApiName, OperationName, Region |
|ClientErrors |Yes |Client Errors |Count |Total |Number of calls with client side error (HTTP response code 4xx). |ApiName, OperationName, Region, RatelimitKey |
|ComputerVisionTransactions |Yes |Computer Vision Transactions |Count |Total |Number of Computer Vision Transactions |ApiName, FeatureName, UsageChannel, Region |
|ContextFeatureIdOccurrences |Yes |Context Feature Occurrences |Count |Total |Number of times each context feature appears. |FeatureId, Mode, RunId |
|ContextFeaturesPerEvent |Yes |Context Features Per Event |Count |Average |Number of context features per event. |Mode, RunId |
|ContextNamespacesPerEvent |Yes |Context Namespaces Per Event |Count |Average |Number of context namespaces per event. |Mode, RunId |
|CustomVisionTrainingTime |Yes |Custom Vision Training Time |Seconds |Total |Custom Vision training time |ApiName, FeatureName, UsageChannel, Region |
|CustomVisionTransactions |Yes |Custom Vision Transactions |Count |Total |Number of Custom Vision prediction transactions |ApiName, FeatureName, UsageChannel, Region |
|DataIn |Yes |Data In |Bytes |Total |Size of incoming data in bytes. |ApiName, OperationName, Region |
|DataOut |Yes |Data Out |Bytes |Total |Size of outgoing data in bytes. |ApiName, OperationName, Region |
|DocumentCharactersTranslated |Yes |Document Characters Translated |Count |Total |Number of characters in document translation request. |ApiName, FeatureName, UsageChannel, Region |
|DocumentCustomCharactersTranslated |Yes |Document Custom Characters Translated |Count |Total |Number of characters in custom document translation request. |ApiName, FeatureName, UsageChannel, Region |
|FaceImagesTrained |Yes |Face Images Trained |Count |Total |Number of images trained. 1,000 images trained per transaction. |ApiName, FeatureName, UsageChannel, Region |
|FacesStored |Yes |Faces Stored |Count |Total |Number of faces stored, prorated daily. The number of faces stored is reported daily. |ApiName, FeatureName, UsageChannel, Region |
|FaceTransactions |Yes |Face Transactions |Count |Total |Number of API calls made to Face service |ApiName, FeatureName, UsageChannel, Region |
|FeatureCardinality_Action |Yes |Feature Cardinality by Action |Count |Average |Feature Cardinality based on Action. |FeatureId, Mode, RunId |
|FeatureCardinality_Context |Yes |Feature Cardinality by Context |Count |Average |Feature Cardinality based on Context. |FeatureId, Mode, RunId |
|FeatureCardinality_Slot |Yes |Feature Cardinality by Slot |Count |Average |Feature Cardinality based on Slot. |FeatureId, Mode, RunId |
|FineTunedTrainingHours |Yes |Processed FineTuned Training Hours |Count |Total |Number of Training Hours Processed on an OpenAI FineTuned Model |ApiName, ModelDeploymentName, FeatureName, UsageChannel, Region |
|ImagesStored |Yes |Images Stored |Count |Total |Number of Custom Vision images stored. |ApiName, FeatureName, UsageChannel, Region |
|Latency |Yes |Latency |MilliSeconds |Average |Latency in milliseconds. |ApiName, OperationName, Region, RatelimitKey |
|LearnedEvents |Yes |Learned Events |Count |Total |Number of Learned Events. |IsMatchBaseline, Mode, RunId |
|LUISSpeechRequests |Yes |LUIS Speech Requests |Count |Total |Number of LUIS speech to intent understanding requests |ApiName, FeatureName, UsageChannel, Region |
|LUISTextRequests |Yes |LUIS Text Requests |Count |Total |Number of LUIS text requests |ApiName, FeatureName, UsageChannel, Region |
|MatchedRewards |Yes |Matched Rewards |Count |Total |Number of Matched Rewards. |Mode, RunId |
|NonActivatedEvents |Yes |Non Activated Events |Count |Total |Number of skipped events. |Mode, RunId |
|NumberOfSlots |Yes |Slots |Count |Average |Number of slots per event. |Mode, RunId |
|NumberofSpeakerProfiles |Yes |Number of Speaker Profiles |Count |Total |Number of speaker profiles enrolled. Prorated hourly. |ApiName, FeatureName, UsageChannel, Region |
|ObservedRewards |Yes |Observed Rewards |Count |Total |Number of Observed Rewards. |Mode, RunId |
|OnlineEstimatorOverallReward |Yes |Online Estimator Overall Reward |Count |Average |Online Estimator Overall Reward. |Mode, RunId |
|OnlineEstimatorSlotReward |Yes |Online Estimator Slot Reward |Count |Average |Online Estimator Reward by slot. |SlotId, SlotIndex, Mode, RunId |
|OnlineEventCount |Yes |Online Event Count |Count |Total |Estimation for online event count. |Mode, RunId |
|OnlineReward |Yes |Online Reward |Count |Total |Estimation for online reward. |Mode, RunId |
|ProcessedCharacters |Yes |Processed Characters |Count |Total |Number of Characters processed by Immersive Reader. |ApiName, FeatureName, UsageChannel, Region |
|ProcessedHealthTextRecords |Yes |Processed Health Text Records |Count |Total |Number of health text records processed |ApiName, FeatureName, UsageChannel, Region |
|ProcessedImages |Yes |Processed Images |Count |Total |Number of images processed |ApiName, FeatureName, UsageChannel, Region |
|ProcessedPages |Yes |Processed Pages |Count |Total |Number of pages processed |ApiName, FeatureName, UsageChannel, Region |
|ProcessedTextRecords |Yes |Processed Text Records |Count |Total |Count of Text Records. |ApiName, FeatureName, UsageChannel, Region |
|QuestionAnsweringTextRecords |Yes |QA Text Records |Count |Total |Number of text records processed |ApiName, FeatureName, UsageChannel, Region |
|Ratelimit |Yes |Ratelimit |Count |Total |The current ratelimit of the ratelimit key. |Region, RatelimitKey |
|Reward |Yes |Average Reward Per Event |Count |Average |Average reward per event. |BaselineAction, ChosenActionId, MatchesBaseline, NonDefaultReward, Mode, RunId |
|ServerErrors |Yes |Server Errors |Count |Total |Number of calls with service internal error (HTTP response code 5xx). |ApiName, OperationName, Region, RatelimitKey |
|SlotFeatureIdOccurrences |Yes |Slot Feature Occurrences |Count |Total |Number of times each slot feature appears. |FeatureId, Mode, RunId |
|SlotFeaturesPerEvent |Yes |Slot Features Per Event |Count |Average |Average number of slot features per event. |Mode, RunId |
|SlotIdOccurrences |Yes |Slot Occurrences |Count |Total |Number of times each slot appears. |SlotId, SlotIndex, Mode, RunId |
|SlotNamespacesPerEvent |Yes |Slot Namespaces Per Event |Count |Average |Average number of slot namespaces per event. |Mode, RunId |
|SlotReward |Yes |Slot Reward |Count |Average |Reward per slot. |BaselineActionId, ChosenActionId, MatchesBaseline, NonDefaultReward, SlotId, SlotIndex, Mode, RunId |
|SpeakerRecognitionTransactions |Yes |Speaker Recognition Transactions |Count |Total |Number of speaker recognition transactions |ApiName, FeatureName, UsageChannel, Region |
|SpeechModelHostingHours |Yes |Speech Model Hosting Hours |Count |Total |Number of speech model hosting hours |ApiName, FeatureName, UsageChannel, Region |
|SpeechSessionDuration |Yes |Speech Session Duration (Deprecated) |Seconds |Total |Total duration of speech session in seconds. |ApiName, OperationName, Region |
|SuccessfulCalls |Yes |Successful Calls |Count |Total |Number of successful calls. |ApiName, OperationName, Region, RatelimitKey |
|SuccessRate |No |Availability |Percent |Average |Availability percentage with the following calculation: (Total Calls - Server Errors)/Total Calls. Server Errors include any HTTP responses >=500. |ApiName, OperationName, Region, RatelimitKey |
|SynthesizedCharacters |Yes |Synthesized Characters |Count |Total |Number of Characters. |ApiName, FeatureName, UsageChannel, Region |
|TextCharactersTranslated |Yes |Text Characters Translated |Count |Total |Number of characters in incoming text translation request. |ApiName, FeatureName, UsageChannel, Region |
|TextCustomCharactersTranslated |Yes |Text Custom Characters Translated |Count |Total |Number of characters in incoming custom text translation request. |ApiName, FeatureName, UsageChannel, Region |
|TextTrainedCharacters |Yes |Text Trained Characters |Count |Total |Number of characters trained using text translation. |ApiName, FeatureName, UsageChannel, Region |
|TokenTransaction |Yes |Processed Inference Tokens |Count |Total |Number of Inference Tokens Processed on an OpenAI Model |ApiName, ModelDeploymentName, FeatureName, UsageChannel, Region |
|TotalCalls |Yes |Total Calls |Count |Total |Total number of calls. |ApiName, OperationName, Region, RatelimitKey |
|TotalErrors |Yes |Total Errors |Count |Total |Total number of calls with error response (HTTP response code 4xx or 5xx). |ApiName, OperationName, Region, RatelimitKey |
|TotalEvents |Yes |Total Events |Count |Total |Number of events. |Mode, RunId |
|TotalTokenCalls |Yes |Total Token Calls |Count |Total |Total number of token calls. |ApiName, OperationName, Region |
|TotalTransactions |Yes |Total Transactions (Deprecated) |Count |Total |Total number of transactions. |No Dimensions |
|UserBaselineEventCount |Yes |User Baseline Event Count |Count |Total |Estimation for user defined baseline event count. |Mode, RunId |
|UserBaselineReward |Yes |User Baseline Reward |Count |Total |Estimation for user defined baseline reward. |Mode, RunId |
|VoiceModelHostingHours |Yes |Voice Model Hosting Hours |Count |Total |Number of Hours. |ApiName, FeatureName, UsageChannel, Region |
|VoiceModelTrainingMinutes |Yes |Voice Model Training Minutes |Count |Total |Number of Minutes. |ApiName, FeatureName, UsageChannel, Region |

## Microsoft.Communication/CommunicationServices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|APIRequestAuthentication |No |Authentication API Requests |Count |Count |Count of all requests against the Communication Services Authentication endpoint. |Operation, StatusCode, StatusCodeClass |
|APIRequestCallAutomation |Yes |Call Automation API Requests |Count |Count |Count of all requests against the Communication Call Automation endpoint. |Operation, StatusCode, StatusCodeClass |
|APIRequestCallRecording |Yes |Call Recording API Requests |Count |Count |Count of all requests against the Communication Services Call Recording endpoint. |Operation, StatusCode, StatusCodeClass |
|APIRequestChat |Yes |Chat API Requests |Count |Count |Count of all requests against the Communication Services Chat endpoint. |Operation, StatusCode, StatusCodeClass |
|APIRequestNetworkTraversal |No |Network Traversal API Requests |Count |Count |Count of all requests against the Communication Services Network Traversal endpoint. |Operation, StatusCode, StatusCodeClass |
|ApiRequestRooms |Yes |Rooms API Requests |Count |Count |Count of all requests against the Communication Services Rooms endpoint. |Operation, StatusCode, StatusCodeClass |
|ApiRequestRouter |Yes |Job Router API Requests |Count |Count |Count of all requests against the Communication Services Job Router endpoint. |OperationName, StatusCode, StatusCodeSubClass, ApiVersion |
|ApiRequests |Yes |Email Service API Requests |Count |Count |Email Communication Services API request metric for the data-plane API surface. |Operation, StatusCode, StatusCodeClass, StatusCodeReason |
|APIRequestSMS |Yes |SMS API Requests |Count |Count |Count of all requests against the Communication Services SMS endpoint. |Operation, StatusCode, StatusCodeClass, ErrorCode, NumberType, Country, OptAction |
|DeliveryStatusUpdate |Yes |Email Service Delivery Status Updates |Count |Count |Email Communication Services message delivery results. |MessageStatus, Result |
|UserEngagement |Yes |Email Service User Engagement |Count |Count |Email Communication Services user engagement metrics. |EngagementType |

## Microsoft.Compute/cloudservices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Available Memory Bytes |Yes |Available Memory Bytes (Preview) |Bytes |Average |Amount of physical memory, in bytes, immediately available for allocation to a process or for system use in the Virtual Machine |RoleInstanceId, RoleId |
|Disk Read Bytes |Yes |Disk Read Bytes |Bytes |Total |Bytes read from disk during monitoring period |RoleInstanceId, RoleId |
|Disk Read Operations/Sec |Yes |Disk Read Operations/Sec |CountPerSecond |Average |Disk Read IOPS |RoleInstanceId, RoleId |
|Disk Write Bytes |Yes |Disk Write Bytes |Bytes |Total |Bytes written to disk during monitoring period |RoleInstanceId, RoleId |
|Disk Write Operations/Sec |Yes |Disk Write Operations/Sec |CountPerSecond |Average |Disk Write IOPS |RoleInstanceId, RoleId |
|Network In Total |Yes |Network In Total |Bytes |Total |The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) |RoleInstanceId, RoleId |
|Network Out Total |Yes |Network Out Total |Bytes |Total |The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) |RoleInstanceId, RoleId |
|Percentage CPU |Yes |Percentage CPU |Percent |Average |The percentage of allocated compute units that are currently in use by the Virtual Machine(s) |RoleInstanceId, RoleId |

## Microsoft.Compute/cloudServices/roles  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Available Memory Bytes |Yes |Available Memory Bytes (Preview) |Bytes |Average |Amount of physical memory, in bytes, immediately available for allocation to a process or for system use in the Virtual Machine |RoleInstanceId, RoleId |
|Disk Read Bytes |Yes |Disk Read Bytes |Bytes |Total |Bytes read from disk during monitoring period |RoleInstanceId, RoleId |
|Disk Read Operations/Sec |Yes |Disk Read Operations/Sec |CountPerSecond |Average |Disk Read IOPS |RoleInstanceId, RoleId |
|Disk Write Bytes |Yes |Disk Write Bytes |Bytes |Total |Bytes written to disk during monitoring period |RoleInstanceId, RoleId |
|Disk Write Operations/Sec |Yes |Disk Write Operations/Sec |CountPerSecond |Average |Disk Write IOPS |RoleInstanceId, RoleId |
|Network In Total |Yes |Network In Total |Bytes |Total |The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) |RoleInstanceId, RoleId |
|Network Out Total |Yes |Network Out Total |Bytes |Total |The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) |RoleInstanceId, RoleId |
|Percentage CPU |Yes |Percentage CPU |Percent |Average |The percentage of allocated compute units that are currently in use by the Virtual Machine(s) |RoleInstanceId, RoleId |

## microsoft.compute/disks  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Composite Disk Read Bytes/sec |No |Disk Read Bytes/sec(Preview) |BytesPerSecond |Average |Bytes/sec read from disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available |No Dimensions |
|Composite Disk Read Operations/sec |No |Disk Read Operations/sec(Preview) |CountPerSecond |Average |Number of read IOs performed on a disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available |No Dimensions |
|Composite Disk Write Bytes/sec |No |Disk Write Bytes/sec(Preview) |BytesPerSecond |Average |Bytes/sec written to disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available |No Dimensions |
|Composite Disk Write Operations/sec |No |Disk Write Operations/sec(Preview) |CountPerSecond |Average |Number of Write IOs performed on a disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available |No Dimensions |
|DiskPaidBurstIOPS |No |Disk On-demand Burst Operations(Preview) |Count |Average |The accumulated operations of burst transactions used for disks with on-demand burst enabled. Emitted on an hour interval |No Dimensions |

## Microsoft.Compute/virtualMachines  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Available Memory Bytes |Yes |Available Memory Bytes (Preview) |Bytes |Average |Amount of physical memory, in bytes, immediately available for allocation to a process or for system use in the Virtual Machine |No Dimensions |
|CPU Credits Consumed |Yes |CPU Credits Consumed |Count |Average |Total number of credits consumed by the Virtual Machine. Only available on B-series burstable VMs |No Dimensions |
|CPU Credits Remaining |Yes |CPU Credits Remaining |Count |Average |Total number of credits available to burst. Only available on B-series burstable VMs |No Dimensions |
|Data Disk Bandwidth Consumed Percentage |Yes |Data Disk Bandwidth Consumed Percentage |Percent |Average |Percentage of data disk bandwidth consumed per minute. Only available on VM series that support premium storage. |LUN |
|Data Disk IOPS Consumed Percentage |Yes |Data Disk IOPS Consumed Percentage |Percent |Average |Percentage of data disk I/Os consumed per minute. Only available on VM series that support premium storage. |LUN |
|Data Disk Max Burst Bandwidth |Yes |Data Disk Max Burst Bandwidth |Count |Average |Maximum bytes per second throughput Data Disk can achieve with bursting |LUN |
|Data Disk Max Burst IOPS |Yes |Data Disk Max Burst IOPS |Count |Average |Maximum IOPS Data Disk can achieve with bursting |LUN |
|Data Disk Queue Depth |Yes |Data Disk Queue Depth |Count |Average |Data Disk Queue Depth(or Queue Length) |LUN |
|Data Disk Read Bytes/sec |Yes |Data Disk Read Bytes/Sec |BytesPerSecond |Average |Bytes/Sec read from a single disk during monitoring period |LUN |
|Data Disk Read Operations/Sec |Yes |Data Disk Read Operations/Sec |CountPerSecond |Average |Read IOPS from a single disk during monitoring period |LUN |
|Data Disk Target Bandwidth |Yes |Data Disk Target Bandwidth |Count |Average |Baseline bytes per second throughput Data Disk can achieve without bursting |LUN |
|Data Disk Target IOPS |Yes |Data Disk Target IOPS |Count |Average |Baseline IOPS Data Disk can achieve without bursting |LUN |
|Data Disk Used Burst BPS Credits Percentage |Yes |Data Disk Used Burst BPS Credits Percentage |Percent |Average |Percentage of Data Disk burst bandwidth credits used so far |LUN |
|Data Disk Used Burst IO Credits Percentage |Yes |Data Disk Used Burst IO Credits Percentage |Percent |Average |Percentage of Data Disk burst I/O credits used so far |LUN |
|Data Disk Write Bytes/sec |Yes |Data Disk Write Bytes/Sec |BytesPerSecond |Average |Bytes/Sec written to a single disk during monitoring period |LUN |
|Data Disk Write Operations/Sec |Yes |Data Disk Write Operations/Sec |CountPerSecond |Average |Write IOPS from a single disk during monitoring period |LUN |
|Disk Read Bytes |Yes |Disk Read Bytes |Bytes |Total |Bytes read from disk during monitoring period |No Dimensions |
|Disk Read Operations/Sec |Yes |Disk Read Operations/Sec |CountPerSecond |Average |Disk Read IOPS |No Dimensions |
|Disk Write Bytes |Yes |Disk Write Bytes |Bytes |Total |Bytes written to disk during monitoring period |No Dimensions |
|Disk Write Operations/Sec |Yes |Disk Write Operations/Sec |CountPerSecond |Average |Disk Write IOPS |No Dimensions |
|Inbound Flows |Yes |Inbound Flows |Count |Average |Inbound Flows are number of current flows in the inbound direction (traffic going into the VM) |No Dimensions |
|Inbound Flows Maximum Creation Rate |Yes |Inbound Flows Maximum Creation Rate |CountPerSecond |Average |The maximum creation rate of inbound flows (traffic going into the VM) |No Dimensions |
|Network In |Yes |Network In Billable (Deprecated) |Bytes |Total |The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated) |No Dimensions |
|Network In Total |Yes |Network In Total |Bytes |Total |The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) |No Dimensions |
|Network Out |Yes |Network Out Billable (Deprecated) |Bytes |Total |The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated) |No Dimensions |
|Network Out Total |Yes |Network Out Total |Bytes |Total |The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) |No Dimensions |
|OS Disk Bandwidth Consumed Percentage |Yes |OS Disk Bandwidth Consumed Percentage |Percent |Average |Percentage of operating system disk bandwidth consumed per minute. Only available on VM series that support premium storage. |LUN |
|OS Disk IOPS Consumed Percentage |Yes |OS Disk IOPS Consumed Percentage |Percent |Average |Percentage of operating system disk I/Os consumed per minute. Only available on VM series that support premium storage. |LUN |
|OS Disk Max Burst Bandwidth |Yes |OS Disk Max Burst Bandwidth |Count |Average |Maximum bytes per second throughput OS Disk can achieve with bursting |LUN |
|OS Disk Max Burst IOPS |Yes |OS Disk Max Burst IOPS |Count |Average |Maximum IOPS OS Disk can achieve with bursting |LUN |
|OS Disk Queue Depth |Yes |OS Disk Queue Depth |Count |Average |OS Disk Queue Depth(or Queue Length) |No Dimensions |
|OS Disk Read Bytes/sec |Yes |OS Disk Read Bytes/Sec |BytesPerSecond |Average |Bytes/Sec read from a single disk during monitoring period for OS disk |No Dimensions |
|OS Disk Read Operations/Sec |Yes |OS Disk Read Operations/Sec |CountPerSecond |Average |Read IOPS from a single disk during monitoring period for OS disk |No Dimensions |
|OS Disk Target Bandwidth |Yes |OS Disk Target Bandwidth |Count |Average |Baseline bytes per second throughput OS Disk can achieve without bursting |LUN |
|OS Disk Target IOPS |Yes |OS Disk Target IOPS |Count |Average |Baseline IOPS OS Disk can achieve without bursting |LUN |
|OS Disk Used Burst BPS Credits Percentage |Yes |OS Disk Used Burst BPS Credits Percentage |Percent |Average |Percentage of OS Disk burst bandwidth credits used so far |LUN |
|OS Disk Used Burst IO Credits Percentage |Yes |OS Disk Used Burst IO Credits Percentage |Percent |Average |Percentage of OS Disk burst I/O credits used so far |LUN |
|OS Disk Write Bytes/sec |Yes |OS Disk Write Bytes/Sec |BytesPerSecond |Average |Bytes/Sec written to a single disk during monitoring period for OS disk |No Dimensions |
|OS Disk Write Operations/Sec |Yes |OS Disk Write Operations/Sec |CountPerSecond |Average |Write IOPS from a single disk during monitoring period for OS disk |No Dimensions |
|Outbound Flows |Yes |Outbound Flows |Count |Average |Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM) |No Dimensions |
|Outbound Flows Maximum Creation Rate |Yes |Outbound Flows Maximum Creation Rate |CountPerSecond |Average |The maximum creation rate of outbound flows (traffic going out of the VM) |No Dimensions |
|Percentage CPU |Yes |Percentage CPU |Percent |Average |The percentage of allocated compute units that are currently in use by the Virtual Machine(s) |No Dimensions |
|Premium Data Disk Cache Read Hit |Yes |Premium Data Disk Cache Read Hit |Percent |Average |Premium Data Disk Cache Read Hit |LUN |
|Premium Data Disk Cache Read Miss |Yes |Premium Data Disk Cache Read Miss |Percent |Average |Premium Data Disk Cache Read Miss |LUN |
|Premium OS Disk Cache Read Hit |Yes |Premium OS Disk Cache Read Hit |Percent |Average |Premium OS Disk Cache Read Hit |No Dimensions |
|Premium OS Disk Cache Read Miss |Yes |Premium OS Disk Cache Read Miss |Percent |Average |Premium OS Disk Cache Read Miss |No Dimensions |
|VM Cached Bandwidth Consumed Percentage |Yes |VM Cached Bandwidth Consumed Percentage |Percent |Average |Percentage of cached disk bandwidth consumed by the VM. Only available on VM series that support premium storage. |No Dimensions |
|VM Cached IOPS Consumed Percentage |Yes |VM Cached IOPS Consumed Percentage |Percent |Average |Percentage of cached disk IOPS consumed by the VM. Only available on VM series that support premium storage. |No Dimensions |
|VM Local Used Burst BPS Credits Percentage |Yes |VM Cached Used Burst BPS Credits Percentage |Percent |Average |Percentage of Cached Burst BPS Credits used by the VM. |No Dimensions |
|VM Local Used Burst IO Credits Percentage |Yes |VM Cached Used Burst IO Credits Percentage |Percent |Average |Percentage of Cached Burst IO Credits used by the VM. |No Dimensions |
|VM Remote Used Burst BPS Credits Percentage |Yes |VM Uncached Used Burst BPS Credits Percentage |Percent |Average |Percentage of Uncached Burst BPS Credits used by the VM. |No Dimensions |
|VM Remote Used Burst IO Credits Percentage |Yes |VM Uncached Used Burst IO Credits Percentage |Percent |Average |Percentage of Uncached Burst IO Credits used by the VM. |No Dimensions |
|VM Uncached Bandwidth Consumed Percentage |Yes |VM Uncached Bandwidth Consumed Percentage |Percent |Average |Percentage of uncached disk bandwidth consumed by the VM. Only available on VM series that support premium storage. |No Dimensions |
|VM Uncached IOPS Consumed Percentage |Yes |VM Uncached IOPS Consumed Percentage |Percent |Average |Percentage of uncached disk IOPS consumed by the VM. Only available on VM series that support premium storage. |No Dimensions |
|VmAvailabilityMetric |Yes |VM Availability Metric (Preview) |Count |Average |Measure of Availability of Virtual machines over time. |No Dimensions |

## Microsoft.Compute/virtualmachineScaleSets  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Available Memory Bytes |Yes |Available Memory Bytes (Preview) |Bytes |Average |Amount of physical memory, in bytes, immediately available for allocation to a process or for system use in the Virtual Machine |VMName |
|CPU Credits Consumed |Yes |CPU Credits Consumed |Count |Average |Total number of credits consumed by the Virtual Machine. Only available on B-series burstable VMs |No Dimensions |
|CPU Credits Remaining |Yes |CPU Credits Remaining |Count |Average |Total number of credits available to burst. Only available on B-series burstable VMs |No Dimensions |
|Data Disk Bandwidth Consumed Percentage |Yes |Data Disk Bandwidth Consumed Percentage |Percent |Average |Percentage of data disk bandwidth consumed per minute |LUN, VMName |
|Data Disk IOPS Consumed Percentage |Yes |Data Disk IOPS Consumed Percentage |Percent |Average |Percentage of data disk I/Os consumed per minute |LUN, VMName |
|Data Disk Max Burst Bandwidth |Yes |Data Disk Max Burst Bandwidth |Count |Average |Maximum bytes per second throughput Data Disk can achieve with bursting |LUN, VMName |
|Data Disk Max Burst IOPS |Yes |Data Disk Max Burst IOPS |Count |Average |Maximum IOPS Data Disk can achieve with bursting |LUN, VMName |
|Data Disk Queue Depth |Yes |Data Disk Queue Depth |Count |Average |Data Disk Queue Depth(or Queue Length) |LUN, VMName |
|Data Disk Read Bytes/sec |Yes |Data Disk Read Bytes/Sec |BytesPerSecond |Average |Bytes/Sec read from a single disk during monitoring period |LUN, VMName |
|Data Disk Read Operations/Sec |Yes |Data Disk Read Operations/Sec |CountPerSecond |Average |Read IOPS from a single disk during monitoring period |LUN, VMName |
|Data Disk Target Bandwidth |Yes |Data Disk Target Bandwidth |Count |Average |Baseline bytes per second throughput Data Disk can achieve without bursting |LUN, VMName |
|Data Disk Target IOPS |Yes |Data Disk Target IOPS |Count |Average |Baseline IOPS Data Disk can achieve without bursting |LUN, VMName |
|Data Disk Used Burst BPS Credits Percentage |Yes |Data Disk Used Burst BPS Credits Percentage |Percent |Average |Percentage of Data Disk burst bandwidth credits used so far |LUN, VMName |
|Data Disk Used Burst IO Credits Percentage |Yes |Data Disk Used Burst IO Credits Percentage |Percent |Average |Percentage of Data Disk burst I/O credits used so far |LUN, VMName |
|Data Disk Write Bytes/sec |Yes |Data Disk Write Bytes/Sec |BytesPerSecond |Average |Bytes/Sec written to a single disk during monitoring period |LUN, VMName |
|Data Disk Write Operations/Sec |Yes |Data Disk Write Operations/Sec |CountPerSecond |Average |Write IOPS from a single disk during monitoring period |LUN, VMName |
|Disk Read Bytes |Yes |Disk Read Bytes |Bytes |Total |Bytes read from disk during monitoring period |VMName |
|Disk Read Operations/Sec |Yes |Disk Read Operations/Sec |CountPerSecond |Average |Disk Read IOPS |VMName |
|Disk Write Bytes |Yes |Disk Write Bytes |Bytes |Total |Bytes written to disk during monitoring period |VMName |
|Disk Write Operations/Sec |Yes |Disk Write Operations/Sec |CountPerSecond |Average |Disk Write IOPS |VMName |
|Inbound Flows |Yes |Inbound Flows |Count |Average |Inbound Flows are number of current flows in the inbound direction (traffic going into the VM) |VMName |
|Inbound Flows Maximum Creation Rate |Yes |Inbound Flows Maximum Creation Rate |CountPerSecond |Average |The maximum creation rate of inbound flows (traffic going into the VM) |VMName |
|Network In |Yes |Network In Billable (Deprecated) |Bytes |Total |The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated) |VMName |
|Network In Total |Yes |Network In Total |Bytes |Total |The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) |VMName |
|Network Out |Yes |Network Out Billable (Deprecated) |Bytes |Total |The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated) |VMName |
|Network Out Total |Yes |Network Out Total |Bytes |Total |The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) |VMName |
|OS Disk Bandwidth Consumed Percentage |Yes |OS Disk Bandwidth Consumed Percentage |Percent |Average |Percentage of operating system disk bandwidth consumed per minute |LUN, VMName |
|OS Disk IOPS Consumed Percentage |Yes |OS Disk IOPS Consumed Percentage |Percent |Average |Percentage of operating system disk I/Os consumed per minute |LUN, VMName |
|OS Disk Max Burst Bandwidth |Yes |OS Disk Max Burst Bandwidth |Count |Average |Maximum bytes per second throughput OS Disk can achieve with bursting |LUN, VMName |
|OS Disk Max Burst IOPS |Yes |OS Disk Max Burst IOPS |Count |Average |Maximum IOPS OS Disk can achieve with bursting |LUN, VMName |
|OS Disk Queue Depth |Yes |OS Disk Queue Depth |Count |Average |OS Disk Queue Depth(or Queue Length) |VMName |
|OS Disk Read Bytes/sec |Yes |OS Disk Read Bytes/Sec |BytesPerSecond |Average |Bytes/Sec read from a single disk during monitoring period for OS disk |VMName |
|OS Disk Read Operations/Sec |Yes |OS Disk Read Operations/Sec |CountPerSecond |Average |Read IOPS from a single disk during monitoring period for OS disk |VMName |
|OS Disk Target Bandwidth |Yes |OS Disk Target Bandwidth |Count |Average |Baseline bytes per second throughput OS Disk can achieve without bursting |LUN, VMName |
|OS Disk Target IOPS |Yes |OS Disk Target IOPS |Count |Average |Baseline IOPS OS Disk can achieve without bursting |LUN, VMName |
|OS Disk Used Burst BPS Credits Percentage |Yes |OS Disk Used Burst BPS Credits Percentage |Percent |Average |Percentage of OS Disk burst bandwidth credits used so far |LUN, VMName |
|OS Disk Used Burst IO Credits Percentage |Yes |OS Disk Used Burst IO Credits Percentage |Percent |Average |Percentage of OS Disk burst I/O credits used so far |LUN, VMName |
|OS Disk Write Bytes/sec |Yes |OS Disk Write Bytes/Sec |BytesPerSecond |Average |Bytes/Sec written to a single disk during monitoring period for OS disk |VMName |
|OS Disk Write Operations/Sec |Yes |OS Disk Write Operations/Sec |CountPerSecond |Average |Write IOPS from a single disk during monitoring period for OS disk |VMName |
|Outbound Flows |Yes |Outbound Flows |Count |Average |Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM) |VMName |
|Outbound Flows Maximum Creation Rate |Yes |Outbound Flows Maximum Creation Rate |CountPerSecond |Average |The maximum creation rate of outbound flows (traffic going out of the VM) |VMName |
|Percentage CPU |Yes |Percentage CPU |Percent |Average |The percentage of allocated compute units that are currently in use by the Virtual Machine(s) |VMName |
|Premium Data Disk Cache Read Hit |Yes |Premium Data Disk Cache Read Hit |Percent |Average |Premium Data Disk Cache Read Hit |LUN, VMName |
|Premium Data Disk Cache Read Miss |Yes |Premium Data Disk Cache Read Miss |Percent |Average |Premium Data Disk Cache Read Miss |LUN, VMName |
|Premium OS Disk Cache Read Hit |Yes |Premium OS Disk Cache Read Hit |Percent |Average |Premium OS Disk Cache Read Hit |VMName |
|Premium OS Disk Cache Read Miss |Yes |Premium OS Disk Cache Read Miss |Percent |Average |Premium OS Disk Cache Read Miss |VMName |
|VM Cached Bandwidth Consumed Percentage |Yes |VM Cached Bandwidth Consumed Percentage |Percent |Average |Percentage of cached disk bandwidth consumed by the VM |VMName |
|VM Cached IOPS Consumed Percentage |Yes |VM Cached IOPS Consumed Percentage |Percent |Average |Percentage of cached disk IOPS consumed by the VM |VMName |
|VM Local Used Burst BPS Credits Percentage |Yes |VM Cached Used Burst BPS Credits Percentage |Percent |Average |Percentage of Cached Burst BPS Credits used by the VM. |VMName |
|VM Local Used Burst IO Credits Percentage |Yes |VM Cached Used Burst IO Credits Percentage |Percent |Average |Percentage of Cached Burst IO Credits used by the VM. |VMName |
|VM Remote Used Burst BPS Credits Percentage |Yes |VM Uncached Used Burst BPS Credits Percentage |Percent |Average |Percentage of Uncached Burst BPS Credits used by the VM. |VMName |
|VM Remote Used Burst IO Credits Percentage |Yes |VM Uncached Used Burst IO Credits Percentage |Percent |Average |Percentage of Uncached Burst IO Credits used by the VM. |VMName |
|VM Uncached Bandwidth Consumed Percentage |Yes |VM Uncached Bandwidth Consumed Percentage |Percent |Average |Percentage of uncached disk bandwidth consumed by the VM |VMName |
|VM Uncached IOPS Consumed Percentage |Yes |VM Uncached IOPS Consumed Percentage |Percent |Average |Percentage of uncached disk IOPS consumed by the VM |VMName |
|VmAvailabilityMetric |Yes |VM Availability Metric (Preview) |Count |Average |Measure of Availability of Virtual machines over time. |VMName |

## Microsoft.Compute/virtualMachineScaleSets/virtualMachines  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Available Memory Bytes |Yes |Available Memory Bytes (Preview) |Bytes |Average |Amount of physical memory, in bytes, immediately available for allocation to a process or for system use in the Virtual Machine |No Dimensions |
|CPU Credits Consumed |Yes |CPU Credits Consumed |Count |Average |Total number of credits consumed by the Virtual Machine. Only available on B-series burstable VMs |No Dimensions |
|CPU Credits Remaining |Yes |CPU Credits Remaining |Count |Average |Total number of credits available to burst. Only available on B-series burstable VMs |No Dimensions |
|Data Disk Bandwidth Consumed Percentage |Yes |Data Disk Bandwidth Consumed Percentage |Percent |Average |Percentage of data disk bandwidth consumed per minute |LUN |
|Data Disk IOPS Consumed Percentage |Yes |Data Disk IOPS Consumed Percentage |Percent |Average |Percentage of data disk I/Os consumed per minute |LUN |
|Data Disk Max Burst Bandwidth |Yes |Data Disk Max Burst Bandwidth |Count |Average |Maximum bytes per second throughput Data Disk can achieve with bursting |LUN |
|Data Disk Max Burst IOPS |Yes |Data Disk Max Burst IOPS |Count |Average |Maximum IOPS Data Disk can achieve with bursting |LUN |
|Data Disk Queue Depth |Yes |Data Disk Queue Depth |Count |Average |Data Disk Queue Depth(or Queue Length) |LUN |
|Data Disk Read Bytes/sec |Yes |Data Disk Read Bytes/Sec |BytesPerSecond |Average |Bytes/Sec read from a single disk during monitoring period |LUN |
|Data Disk Read Operations/Sec |Yes |Data Disk Read Operations/Sec |CountPerSecond |Average |Read IOPS from a single disk during monitoring period |LUN |
|Data Disk Target Bandwidth |Yes |Data Disk Target Bandwidth |Count |Average |Baseline bytes per second throughput Data Disk can achieve without bursting |LUN |
|Data Disk Target IOPS |Yes |Data Disk Target IOPS |Count |Average |Baseline IOPS Data Disk can achieve without bursting |LUN |
|Data Disk Used Burst BPS Credits Percentage |Yes |Data Disk Used Burst BPS Credits Percentage |Percent |Average |Percentage of Data Disk burst bandwidth credits used so far |LUN |
|Data Disk Used Burst IO Credits Percentage |Yes |Data Disk Used Burst IO Credits Percentage |Percent |Average |Percentage of Data Disk burst I/O credits used so far |LUN |
|Data Disk Write Bytes/sec |Yes |Data Disk Write Bytes/Sec |BytesPerSecond |Average |Bytes/Sec written to a single disk during monitoring period |LUN |
|Data Disk Write Operations/Sec |Yes |Data Disk Write Operations/Sec |CountPerSecond |Average |Write IOPS from a single disk during monitoring period |LUN |
|Disk Read Bytes |Yes |Disk Read Bytes |Bytes |Total |Bytes read from disk during monitoring period |No Dimensions |
|Disk Read Operations/Sec |Yes |Disk Read Operations/Sec |CountPerSecond |Average |Disk Read IOPS |No Dimensions |
|Disk Write Bytes |Yes |Disk Write Bytes |Bytes |Total |Bytes written to disk during monitoring period |No Dimensions |
|Disk Write Operations/Sec |Yes |Disk Write Operations/Sec |CountPerSecond |Average |Disk Write IOPS |No Dimensions |
|Inbound Flows |Yes |Inbound Flows |Count |Average |Inbound Flows are number of current flows in the inbound direction (traffic going into the VM) |No Dimensions |
|Inbound Flows Maximum Creation Rate |Yes |Inbound Flows Maximum Creation Rate |CountPerSecond |Average |The maximum creation rate of inbound flows (traffic going into the VM) |No Dimensions |
|Network In |Yes |Network In Billable (Deprecated) |Bytes |Total |The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated) |No Dimensions |
|Network In Total |Yes |Network In Total |Bytes |Total |The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) |No Dimensions |
|Network Out |Yes |Network Out Billable (Deprecated) |Bytes |Total |The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated) |No Dimensions |
|Network Out Total |Yes |Network Out Total |Bytes |Total |The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) |No Dimensions |
|OS Disk Bandwidth Consumed Percentage |Yes |OS Disk Bandwidth Consumed Percentage |Percent |Average |Percentage of operating system disk bandwidth consumed per minute |LUN |
|OS Disk IOPS Consumed Percentage |Yes |OS Disk IOPS Consumed Percentage |Percent |Average |Percentage of operating system disk I/Os consumed per minute |LUN |
|OS Disk Max Burst Bandwidth |Yes |OS Disk Max Burst Bandwidth |Count |Average |Maximum bytes per second throughput OS Disk can achieve with bursting |LUN |
|OS Disk Max Burst IOPS |Yes |OS Disk Max Burst IOPS |Count |Average |Maximum IOPS OS Disk can achieve with bursting |LUN |
|OS Disk Queue Depth |Yes |OS Disk Queue Depth |Count |Average |OS Disk Queue Depth(or Queue Length) |No Dimensions |
|OS Disk Read Bytes/sec |Yes |OS Disk Read Bytes/Sec |BytesPerSecond |Average |Bytes/Sec read from a single disk during monitoring period for OS disk |No Dimensions |
|OS Disk Read Operations/Sec |Yes |OS Disk Read Operations/Sec |CountPerSecond |Average |Read IOPS from a single disk during monitoring period for OS disk |No Dimensions |
|OS Disk Target Bandwidth |Yes |OS Disk Target Bandwidth |Count |Average |Baseline bytes per second throughput OS Disk can achieve without bursting |LUN |
|OS Disk Target IOPS |Yes |OS Disk Target IOPS |Count |Average |Baseline IOPS OS Disk can achieve without bursting |LUN |
|OS Disk Used Burst BPS Credits Percentage |Yes |OS Disk Used Burst BPS Credits Percentage |Percent |Average |Percentage of OS Disk burst bandwidth credits used so far |LUN |
|OS Disk Used Burst IO Credits Percentage |Yes |OS Disk Used Burst IO Credits Percentage |Percent |Average |Percentage of OS Disk burst I/O credits used so far |LUN |
|OS Disk Write Bytes/sec |Yes |OS Disk Write Bytes/Sec |BytesPerSecond |Average |Bytes/Sec written to a single disk during monitoring period for OS disk |No Dimensions |
|OS Disk Write Operations/Sec |Yes |OS Disk Write Operations/Sec |CountPerSecond |Average |Write IOPS from a single disk during monitoring period for OS disk |No Dimensions |
|Outbound Flows |Yes |Outbound Flows |Count |Average |Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM) |No Dimensions |
|Outbound Flows Maximum Creation Rate |Yes |Outbound Flows Maximum Creation Rate |CountPerSecond |Average |The maximum creation rate of outbound flows (traffic going out of the VM) |No Dimensions |
|Percentage CPU |Yes |Percentage CPU |Percent |Average |The percentage of allocated compute units that are currently in use by the Virtual Machine(s) |No Dimensions |
|Premium Data Disk Cache Read Hit |Yes |Premium Data Disk Cache Read Hit |Percent |Average |Premium Data Disk Cache Read Hit |LUN |
|Premium Data Disk Cache Read Miss |Yes |Premium Data Disk Cache Read Miss |Percent |Average |Premium Data Disk Cache Read Miss |LUN |
|Premium OS Disk Cache Read Hit |Yes |Premium OS Disk Cache Read Hit |Percent |Average |Premium OS Disk Cache Read Hit |No Dimensions |
|Premium OS Disk Cache Read Miss |Yes |Premium OS Disk Cache Read Miss |Percent |Average |Premium OS Disk Cache Read Miss |No Dimensions |
|VM Cached Bandwidth Consumed Percentage |Yes |VM Cached Bandwidth Consumed Percentage |Percent |Average |Percentage of cached disk bandwidth consumed by the VM |No Dimensions |
|VM Cached IOPS Consumed Percentage |Yes |VM Cached IOPS Consumed Percentage |Percent |Average |Percentage of cached disk IOPS consumed by the VM |No Dimensions |
|VM Uncached Bandwidth Consumed Percentage |Yes |VM Uncached Bandwidth Consumed Percentage |Percent |Average |Percentage of uncached disk bandwidth consumed by the VM |No Dimensions |
|VM Uncached IOPS Consumed Percentage |Yes |VM Uncached IOPS Consumed Percentage |Percent |Average |Percentage of uncached disk IOPS consumed by the VM |No Dimensions |

## Microsoft.ConnectedCache/CacheNodes  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|egressbps |Yes |Egress Mbps |BitsPerSecond |Average |Egress Throughput |cachenodeid |
|hitRatio |Yes |Cache Efficiency |Percent |Average |Cache Efficiency |cachenodeid |
|hits |Yes |Hits |Count |Count |Count of hits |cachenodeid |
|hitsbps |Yes |Hit Mbps |BitsPerSecond |Average |Hit Throughput |cachenodeid |
|misses |Yes |Misses |Count |Count |Count of misses |cachenodeid |
|missesbps |Yes |Miss Mbps |BitsPerSecond |Average |Miss Throughput |cachenodeid |

## Microsoft.ConnectedCache/ispCustomers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|egressbps |Yes |Egress Mbps |BitsPerSecond |Average |Egress Throughput |cachenodeid |
|hitRatio |Yes |Hit Ratio |Percent |Average |Cache hit ratio is a measurement of how many content requests a cache is able to fill successfully, compared to how many requests it receives. |cachenodeid |
|hits |Yes |Hits |Count |Count |Count of hits |cachenodeid |
|hitsbps |Yes |Hit Mbps |BitsPerSecond |Average |Hit Throughput |cachenodeid |
|inboundbps |Yes |Inbound |BitsPerSecond |Average |Inbound Throughput |cachenodeid |
|misses |Yes |Misses |Count |Count |Count of misses |cachenodeid |
|missesbps |Yes |Miss Mbps |BitsPerSecond |Average |Miss Throughput |cachenodeid |
|outboundbps |Yes |Outbound |BitsPerSecond |Average |Outbound Throughput |cachenodeid |

## Microsoft.ConnectedVehicle/platformAccounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ClaimsProviderRequestLatency |Yes |Claims request execution time |Milliseconds |Average |The average execution time of requests to the customer claims provider endpoint in milliseconds. |IsSuccessful, FailureCategory |
|ClaimsProviderRequests |Yes |Claims provider requests |Count |Total |Number of requests to claims provider |IsSuccessful, FailureCategory |
|ConnectionServiceRequestRuntime |Yes |Vehicle connection service request execution time |Milliseconds |Average |Vehicle conneciton request execution time average in milliseconds |IsSuccessful, FailureCategory |
|ConnectionServiceRequests |Yes |Vehicle connection service requests |Count |Total |Total number of vehicle connection requests |IsSuccessful, FailureCategory |
|DataPipelineMessageCount |Yes |Data pipeline message count |Count |Total |The total number of messages sent to the MCVP data pipeline for storage. |IsSuccessful, FailureCategory |
|ExtensionInvocationCount |Yes |Extension invocation count |Count |Total |Total number of times an extension was called. |ExtensionName, IsSuccessful, FailureCategory |
|ExtensionInvocationRuntime |Yes |Extension invocation execution time |Milliseconds |Average |Average execution time spent inside an extension in milliseconds. |ExtensionName, IsSuccessful, FailureCategory |
|MessagesInCount |Yes |Messages received count |Count |Total |The total number of vehicle-sourced publishes. |IsSuccessful, FailureCategory |
|MessagesOutCount |Yes |Messages sent count |Count |Total |The total number of cloud-sourced publishes. |IsSuccessful, FailureCategory |
|ProvisionerServiceRequestRuntime |Yes |Vehicle provision execution time |Milliseconds |Average |The average execution time of vehicle provision requests in milliseconds |IsSuccessful, FailureCategory |
|ProvisionerServiceRequests |Yes |Vehicle provision service requests |Count |Total |Total number of vehicle provision requests |IsSuccessful, FailureCategory |
|StateStoreReadRequestLatency |Yes |State store read execution time |Milliseconds |Average |State store read request execution time average in milliseconds. |ExtensionName, IsSuccessful, FailureCategory |
|StateStoreReadRequests |Yes |State store read requests |Count |Total |Number of read requests to state store |ExtensionName, IsSuccessful, FailureCategory |
|StateStoreWriteRequestLatency |Yes |State store write execution time |Milliseconds |Average |State store write request execution time average in milliseconds. |ExtensionName, IsSuccessful, FailureCategory |
|StateStoreWriteRequests |Yes |State store write requests |Count |Total |Number of write requests to state store |ExtensionName, IsSuccessful, FailureCategory |

## Microsoft.ContainerInstance/containerGroups  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CpuUsage |Yes |CPU Usage |Count |Average |CPU usage on all cores in millicores. |containerName |
|MemoryUsage |Yes |Memory Usage |Bytes |Average |Total memory usage in byte. |containerName |
|NetworkBytesReceivedPerSecond |Yes |Network Bytes Received Per Second |Bytes |Average |The network bytes received per second. |No Dimensions |
|NetworkBytesTransmittedPerSecond |Yes |Network Bytes Transmitted Per Second |Bytes |Average |The network bytes transmitted per second. |No Dimensions |

## Microsoft.ContainerRegistry/registries  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AgentPoolCPUTime |Yes |AgentPool CPU Time |Seconds |Total |AgentPool CPU Time in seconds |No Dimensions |
|RunDuration |Yes |Run Duration |MilliSeconds |Total |Run Duration in milliseconds |No Dimensions |
|StorageUsed |Yes |Storage used |Bytes |Average |The amount of storage used by the container registry. For a registry account, it's the sum of capacity used by all the repositories within a registry. It's sum of capacity used by shared layers, manifest files, and replica copies in each of its repositories. |Geolocation |
|SuccessfulPullCount |Yes |Successful Pull Count |Count |Total |Number of successful image pulls |No Dimensions |
|SuccessfulPushCount |Yes |Successful Push Count |Count |Total |Number of successful image pushes |No Dimensions |
|TotalPullCount |Yes |Total Pull Count |Count |Total |Number of image pulls in total |No Dimensions |
|TotalPushCount |Yes |Total Push Count |Count |Total |Number of image pushes in total |No Dimensions |

## Microsoft.ContainerService/managedClusters  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|apiserver_current_inflight_requests |No |Inflight Requests |Count |Average |Maximum number of currently used inflight requests on the apiserver per request kind in the last second |requestKind |
|cluster_autoscaler_cluster_safe_to_autoscale |No |Cluster Health |Count |Average |Determines whether or not cluster autoscaler will take action on the cluster |No Dimensions |
|cluster_autoscaler_scale_down_in_cooldown |No |Scale Down Cooldown |Count |Average |Determines if the scale down is in cooldown - No nodes will be removed during this timeframe |No Dimensions |
|cluster_autoscaler_unneeded_nodes_count |No |Unneeded Nodes |Count |Average |Cluster auotscaler marks those nodes as candidates for deletion and are eventually deleted |No Dimensions |
|cluster_autoscaler_unschedulable_pods_count |No |Unschedulable Pods |Count |Average |Number of pods that are currently unschedulable in the cluster |No Dimensions |
|kube_node_status_allocatable_cpu_cores |No |Total number of available cpu cores in a managed cluster |Count |Average |Total number of available cpu cores in a managed cluster |No Dimensions |
|kube_node_status_allocatable_memory_bytes |No |Total amount of available memory in a managed cluster |Bytes |Average |Total amount of available memory in a managed cluster |No Dimensions |
|kube_node_status_condition |No |Statuses for various node conditions |Count |Average |Statuses for various node conditions |condition, status, status2, node |
|kube_pod_status_phase |No |Number of pods by phase |Count |Average |Number of pods by phase |phase, namespace, pod |
|kube_pod_status_ready |No |Number of pods in Ready state |Count |Average |Number of pods in Ready state |namespace, pod, condition |
|node_cpu_usage_millicores |Yes |CPU Usage Millicores |MilliCores |Average |Aggregated measurement of CPU utilization in millicores across the cluster |node, nodepool |
|node_cpu_usage_percentage |Yes |CPU Usage Percentage |Percent |Average |Aggregated average CPU utilization measured in percentage across the cluster |node, nodepool |
|node_disk_usage_bytes |Yes |Disk Used Bytes |Bytes |Average |Disk space used in bytes by device |node, nodepool, device |
|node_disk_usage_percentage |Yes |Disk Used Percentage |Percent |Average |Disk space used in percent by device |node, nodepool, device |
|node_memory_rss_bytes |Yes |Memory RSS Bytes |Bytes |Average |Container RSS memory used in bytes |node, nodepool |
|node_memory_rss_percentage |Yes |Memory RSS Percentage |Percent |Average |Container RSS memory used in percent |node, nodepool |
|node_memory_working_set_bytes |Yes |Memory Working Set Bytes |Bytes |Average |Container working set memory used in bytes |node, nodepool |
|node_memory_working_set_percentage |Yes |Memory Working Set Percentage |Percent |Average |Container working set memory used in percent |node, nodepool |
|node_network_in_bytes |Yes |Network In Bytes |Bytes |Average |Network received bytes |node, nodepool |
|node_network_out_bytes |Yes |Network Out Bytes |Bytes |Average |Network transmitted bytes |node, nodepool |

## Microsoft.CustomProviders/resourceproviders  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|FailedRequests |Yes |Failed Requests |Count |Total |Gets the available logs for Custom Resource Providers |HttpMethod, CallPath, StatusCode |
|SuccessfullRequests |Yes |Successful Requests |Count |Total |Successful requests made by the custom provider |HttpMethod, CallPath, StatusCode |

## Microsoft.Dashboard/grafana  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|HttpRequestCount |No |HttpRequestCount |Count |Count |Number of HTTP requests to Azure Managed Grafana server |No Dimensions |

## Microsoft.DataBoxEdge/dataBoxEdgeDevices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AvailableCapacity |Yes |Available Capacity |Bytes |Average |The available capacity in bytes during the reporting period. |No Dimensions |
|BytesUploadedToCloud |Yes |Cloud Bytes Uploaded (Device) |Bytes |Average |The total number of bytes that is uploaded to Azure from a device during the reporting period. |No Dimensions |
|BytesUploadedToCloudPerShare |Yes |Cloud Bytes Uploaded (Share) |Bytes |Average |The total number of bytes that is uploaded to Azure from a share during the reporting period. |Share |
|CloudReadThroughput |Yes |Cloud Download Throughput |BytesPerSecond |Average |The cloud download throughput to Azure during the reporting period. |No Dimensions |
|CloudReadThroughputPerShare |Yes |Cloud Download Throughput (Share) |BytesPerSecond |Average |The download throughput to Azure from a share during the reporting period. |Share |
|CloudUploadThroughput |Yes |Cloud Upload Throughput |BytesPerSecond |Average |The cloud upload throughput  to Azure during the reporting period. |No Dimensions |
|CloudUploadThroughputPerShare |Yes |Cloud Upload Throughput (Share) |BytesPerSecond |Average |The upload throughput to Azure from a share during the reporting period. |Share |
|HyperVMemoryUtilization |Yes |Edge Compute - Memory Usage |Percent |Average |Amount of RAM in Use |InstanceName |
|HyperVVirtualProcessorUtilization |Yes |Edge Compute - Percentage CPU |Percent |Average |Percent CPU Usage |InstanceName |
|NICReadThroughput |Yes |Read Throughput (Network) |BytesPerSecond |Average |The read throughput of the network interface on the device in the reporting period for all volumes in the gateway. |InstanceName |
|NICWriteThroughput |Yes |Write Throughput (Network) |BytesPerSecond |Average |The write throughput of the network interface on the device in the reporting period for all volumes in the gateway. |InstanceName |
|TotalCapacity |Yes |Total Capacity |Bytes |Average |The total capacity of the device in bytes during the reporting period. |No Dimensions |

## Microsoft.DataCollaboration/workspaces  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ComputationCount |Yes |Created Computations |Count |Maximum |Number of created computations |ComputationName |
|DataAssetCount |Yes |Created Data Assets |Count |Maximum |Number of created data assets |DataAssetName |
|PipelineCount |Yes |Created Pipelines |Count |Maximum |Number of created pipelines |PipelineName |
|PipelineCount |Yes |Created Pipelines |Count |Maximum |Number of created pipelines |PipelineName |
|ProposalCount |Yes |Created Proposals |Count |Maximum |Number of created proposals |ProposalName |
|ScriptCount |Yes |Created Scripts |Count |Maximum |Number of created scripts |ScriptName |

## Microsoft.DataFactory/datafactories  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|FailedRuns |Yes |Failed Runs |Count |Total |Failed Runs |pipelineName, activityName |
|SuccessfulRuns |Yes |Successful Runs |Count |Total |Successful Runs |pipelineName, activityName |

## Microsoft.DataFactory/factories  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActivityCancelledRuns |Yes |Cancelled activity runs metrics |Count |Total |Cancelled activity runs metrics |ActivityType, PipelineName, FailureType, Name |
|ActivityFailedRuns |Yes |Failed activity runs metrics |Count |Total |Failed activity runs metrics |ActivityType, PipelineName, FailureType, Name |
|ActivitySucceededRuns |Yes |Succeeded activity runs metrics |Count |Total |Succeeded activity runs metrics |ActivityType, PipelineName, FailureType, Name |
|AirflowIntegrationRuntimeCeleryTaskTimeoutError |No |Airflow Integration Runtime Celery Task Timeout Error |Count |Total |Airflow Integration Runtime Celery Task Timeout Error |IntegrationRuntimeName |
|AirflowIntegrationRuntimeCollectDBDags |No |Airflow Integration Runtime Collect DB Dags |Milliseconds |Average |Airflow Integration Runtime Collect DB Dags |IntegrationRuntimeName |
|AirflowIntegrationRuntimeCpuPercentage |No |Airflow Integration Runtime Cpu Percentage |Percent |Average |Airflow Integration Runtime Cpu Percentage |IntegrationRuntimeName, ContainerName |
|AirflowIntegrationRuntimeCpuUsage |Yes |Airflow Integration Runtime Memory Usage |Millicores |Average |Airflow Integration Runtime Memory Usage |IntegrationRuntimeName, ContainerName |
|AirflowIntegrationRuntimeDagBagSize |No |Airflow Integration Runtime Dag Bag Size |Count |Total |Airflow Integration Runtime Dag Bag Size |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDagCallbackExceptions |No |Airflow Integration Runtime Dag Callback Exceptions |Count |Total |Airflow Integration Runtime Dag Callback Exceptions |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDAGFileRefreshError |No |Airflow Integration Runtime DAG File Refresh Error |Count |Total |Airflow Integration Runtime DAG File Refresh Error |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDAGProcessingImportErrors |No |Airflow Integration Runtime DAG Processing Import Errors |Count |Total |Airflow Integration Runtime DAG Processing Import Errors |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDAGProcessingLastDuration |No |Airflow Integration Runtime DAG Processing Last Duration |Milliseconds |Average |Airflow Integration Runtime DAG Processing Last Duration |IntegrationRuntimeName, DagFile |
|AirflowIntegrationRuntimeDAGProcessingLastRunSecondsAgo |No |Airflow Integration Runtime DAG Processing Last Run Seconds Ago |Seconds |Average |Airflow Integration Runtime DAG Processing Last Run Seconds Ago |IntegrationRuntimeName, DagFile |
|AirflowIntegrationRuntimeDAGProcessingManagerStalls |No |Airflow Integration Runtime DAG ProcessingManager Stalls |Count |Total |Airflow Integration Runtime DAG ProcessingManager Stalls |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDAGProcessingProcesses |No |Airflow Integration Runtime DAG Processing Processes |Count |Total |Airflow Integration Runtime DAG Processing Processes |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDAGProcessingProcessorTimeouts |No |Airflow Integration Runtime DAG Processing Processor Timeouts |Seconds |Average |Airflow Integration Runtime DAG Processing Processor Timeouts |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDAGProcessingTotalParseTime |No |Airflow Integration Runtime DAG Processing Total Parse Time |Seconds |Average |Airflow Integration Runtime DAG Processing Total Parse Time |IntegrationRuntimeName |
|AirflowIntegrationRuntimeDAGRunDependencyCheck |No |Airflow Integration Runtime DAG Run Dependency Check |Milliseconds |Average |Airflow Integration Runtime DAG Run Dependency Check |IntegrationRuntimeName, DagId |
|AirflowIntegrationRuntimeDAGRunDurationFailed |No |Airflow Integration Runtime DAG Run Duration Failed |Milliseconds |Average |Airflow Integration Runtime DAG Run Duration Failed |IntegrationRuntimeName, DagId |
|AirflowIntegrationRuntimeDAGRunDurationSuccess |No |Airflow Integration Runtime DAG Run Duration Success |Milliseconds |Average |Airflow Integration Runtime DAG Run Duration Success |IntegrationRuntimeName, DagId |
|AirflowIntegrationRuntimeDAGRunFirstTaskSchedulingDelay |No |Airflow Integration Runtime DAG Run First Task Scheduling Delay |Milliseconds |Average |Airflow Integration Runtime DAG Run First Task Scheduling Delay |IntegrationRuntimeName, DagId |
|AirflowIntegrationRuntimeDAGRunScheduleDelay |No |Airflow Integration Runtime DAG Run Schedule Delay |Milliseconds |Average |Airflow Integration Runtime DAG Run Schedule Delay |IntegrationRuntimeName, DagId |
|AirflowIntegrationRuntimeExecutorOpenSlots |No |Airflow Integration Runtime Executor Open Slots |Count |Total |Airflow Integration Runtime Executor Open Slots |IntegrationRuntimeName |
|AirflowIntegrationRuntimeExecutorQueuedTasks |No |Airflow Integration Runtime Executor Queued Tasks |Count |Total |Airflow Integration Runtime Executor Queued Tasks |IntegrationRuntimeName |
|AirflowIntegrationRuntimeExecutorRunningTasks |No |Airflow Integration Runtime Executor Running Tasks |Count |Total |Airflow Integration Runtime Executor Running Tasks |IntegrationRuntimeName |
|AirflowIntegrationRuntimeJobEnd |No |Airflow Integration Runtime Job End |Count |Total |Airflow Integration Runtime Job End |IntegrationRuntimeName, Job |
|AirflowIntegrationRuntimeJobHeartbeatFailure |No |Airflow Integration Runtime Heartbeat Failure |Count |Total |Airflow Integration Runtime Heartbeat Failure |IntegrationRuntimeName, Job |
|AirflowIntegrationRuntimeJobStart |No |Airflow Integration Runtime Job Start |Count |Total |Airflow Integration Runtime Job Start |IntegrationRuntimeName, Job |
|AirflowIntegrationRuntimeMemoryPercentage |Yes |Airflow Integration Runtime Memory Percentage |Percent |Average |Airflow Integration Runtime Memory Percentage |IntegrationRuntimeName, ContainerName |
|AirflowIntegrationRuntimeOperatorFailures |No |Airflow Integration Runtime Operator Failures |Count |Total |Airflow Integration Runtime Operator Failures |IntegrationRuntimeName, Operator |
|AirflowIntegrationRuntimeOperatorSuccesses |No |Airflow Integration Runtime Operator Successes |Count |Total |Airflow Integration Runtime Operator Successes |IntegrationRuntimeName, Operator |
|AirflowIntegrationRuntimePoolOpenSlots |No |Airflow Integration Runtime Pool Open Slots |Count |Total |Airflow Integration Runtime Pool Open Slots |IntegrationRuntimeName, Pool |
|AirflowIntegrationRuntimePoolQueuedSlots |No |Airflow Integration Runtime Pool Queued Slots |Count |Total |Airflow Integration Runtime Pool Queued Slots |IntegrationRuntimeName, Pool |
|AirflowIntegrationRuntimePoolRunningSlots |No |Airflow Integration Runtime Pool Running Slots |Count |Total |Airflow Integration Runtime Pool Running Slots |IntegrationRuntimeName, Pool |
|AirflowIntegrationRuntimePoolStarvingTasks |No |Airflow Integration Runtime Pool Starving Tasks |Count |Total |Airflow Integration Runtime Pool Starving Tasks |IntegrationRuntimeName, Pool |
|AirflowIntegrationRuntimeSchedulerCriticalSectionBusy |No |Airflow Integration Runtime Scheduler Critical Section Busy |Count |Total |Airflow Integration Runtime Scheduler Critical Section Busy |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerCriticalSectionDuration |No |Airflow Integration Runtime Scheduler Critical Section Duration |Milliseconds |Average |Airflow Integration Runtime Scheduler Critical Section Duration |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerFailedSLAEmailAttempts |No |Airflow Integration Runtime Scheduler Failed SLA Email Attempts |Count |Total |Airflow Integration Runtime Scheduler Failed SLA Email Attempts |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerHeartbeat |No |Airflow Integration Runtime Scheduler Heartbeats |Count |Total |Airflow Integration Runtime Scheduler Heartbeats |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerOrphanedTasksAdopted |No |Airflow Integration Runtime Scheduler Orphaned Tasks Adopted |Count |Total |Airflow Integration Runtime Scheduler Orphaned Tasks Adopted |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerOrphanedTasksCleared |No |Airflow Integration Runtime Scheduler Orphaned Tasks Cleared |Count |Total |Airflow Integration Runtime Scheduler Orphaned Tasks Cleared |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerTasksExecutable |No |Airflow Integration Runtime Scheduler Tasks Executable |Count |Total |Airflow Integration Runtime Scheduler Tasks Executable |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerTasksKilledExternally |No |Airflow Integration Runtime Scheduler Tasks Killed Externally |Count |Total |Airflow Integration Runtime Scheduler Tasks Killed Externally |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerTasksRunning |No |Airflow Integration Runtime Scheduler Tasks Running |Count |Total |Airflow Integration Runtime Scheduler Tasks Running |IntegrationRuntimeName |
|AirflowIntegrationRuntimeSchedulerTasksStarving |No |Airflow Integration Runtime Scheduler Tasks Starving |Count |Total |Airflow Integration Runtime Scheduler Tasks Starving |IntegrationRuntimeName |
|AirflowIntegrationRuntimeStartedTaskInstances |No |Airflow Integration Runtime Started Task Instances |Count |Total |Airflow Integration Runtime Started Task Instances |IntegrationRuntimeName, DagId, TaskId |
|AirflowIntegrationRuntimeTaskInstanceCreatedUsingOperator |No |Airflow Integration Runtime Task Instance Created Using Operator |Count |Total |Airflow Integration Runtime Task Instance Created Using Operator |IntegrationRuntimeName, Operator |
|AirflowIntegrationRuntimeTaskInstanceDuration |No |Airflow Integration Runtime Task Instance Duration |Milliseconds |Average |Airflow Integration Runtime Task Instance Duration |IntegrationRuntimeName, DagId, TaskID |
|AirflowIntegrationRuntimeTaskInstanceFailures |No |Airflow Integration Runtime Task Instance Failures |Count |Total |Airflow Integration Runtime Task Instance Failures |IntegrationRuntimeName |
|AirflowIntegrationRuntimeTaskInstanceFinished |No |Airflow Integration Runtime Task Instance Finished |Count |Total |Airflow Integration Runtime Task Instance Finished |IntegrationRuntimeName, DagId, TaskId, State |
|AirflowIntegrationRuntimeTaskInstancePreviouslySucceeded |No |Airflow Integration Runtime Task Instance Previously Succeeded |Count |Total |Airflow Integration Runtime Task Instance Previously Succeeded |IntegrationRuntimeName |
|AirflowIntegrationRuntimeTaskInstanceSuccesses |No |Airflow Integration Runtime Task Instance Successes |Count |Total |Airflow Integration Runtime Task Instance Successes |IntegrationRuntimeName |
|AirflowIntegrationRuntimeTaskRemovedFromDAG |No |Airflow Integration Runtime Task Removed From DAG |Count |Total |Airflow Integration Runtime Task Removed From DAG |IntegrationRuntimeName, DagId |
|AirflowIntegrationRuntimeTaskRestoredToDAG |No |Airflow Integration Runtime Task Restored To DAG |Count |Total |Airflow Integration Runtime Task Restored To DAG |IntegrationRuntimeName, DagId |
|AirflowIntegrationRuntimeTriggersBlockedMainThread |No |Airflow Integration Runtime Triggers Blocked Main Thread |Count |Total |Airflow Integration Runtime Triggers Blocked Main Thread |IntegrationRuntimeName |
|AirflowIntegrationRuntimeTriggersFailed |No |Airflow Integration Runtime Triggers Failed |Count |Total |Airflow Integration Runtime Triggers Failed |IntegrationRuntimeName |
|AirflowIntegrationRuntimeTriggersRunning |No |Airflow Integration Runtime Triggers Running |Count |Total |Airflow Integration Runtime Triggers Running |IntegrationRuntimeName |
|AirflowIntegrationRuntimeTriggersSucceeded |No |Airflow Integration Runtime Triggers Succeeded |Count |Total |Airflow Integration Runtime Triggers Succeeded |IntegrationRuntimeName |
|AirflowIntegrationRuntimeZombiesKilled |No |Airflow Integration Runtime Zombie Tasks Killed |Count |Total |Airflow Integration Runtime Zombie Tasks Killed |IntegrationRuntimeName |
|FactorySizeInGbUnits |Yes |Total factory size (GB unit) |Count |Maximum |Total factory size (GB unit) |No Dimensions |
|IntegrationRuntimeAvailableMemory |Yes |Integration runtime available memory |Bytes |Average |Integration runtime available memory |IntegrationRuntimeName, NodeName |
|IntegrationRuntimeAvailableNodeNumber |Yes |Integration runtime available node count |Count |Average |Integration runtime available node count |IntegrationRuntimeName |
|IntegrationRuntimeAverageTaskPickupDelay |Yes |Integration runtime queue duration |Seconds |Average |Integration runtime queue duration |IntegrationRuntimeName |
|IntegrationRuntimeCpuPercentage |Yes |Integration runtime CPU utilization |Percent |Average |Integration runtime CPU utilization |IntegrationRuntimeName, NodeName |
|IntegrationRuntimeQueueLength |Yes |Integration runtime queue length |Count |Average |Integration runtime queue length |IntegrationRuntimeName |
|MaxAllowedFactorySizeInGbUnits |Yes |Maximum allowed factory size (GB unit) |Count |Maximum |Maximum allowed factory size (GB unit) |No Dimensions |
|MaxAllowedResourceCount |Yes |Maximum allowed entities count |Count |Maximum |Maximum allowed entities count |No Dimensions |
|PipelineCancelledRuns |Yes |Cancelled pipeline runs metrics |Count |Total |Cancelled pipeline runs metrics |FailureType, CancelledBy, Name |
|PipelineElapsedTimeRuns |Yes |Elapsed Time Pipeline Runs Metrics |Count |Total |Elapsed Time Pipeline Runs Metrics |RunId, Name |
|PipelineFailedRuns |Yes |Failed pipeline runs metrics |Count |Total |Failed pipeline runs metrics |FailureType, Name |
|PipelineSucceededRuns |Yes |Succeeded pipeline runs metrics |Count |Total |Succeeded pipeline runs metrics |FailureType, Name |
|ResourceCount |Yes |Total entities count |Count |Maximum |Total entities count |No Dimensions |
|SSISIntegrationRuntimeStartCancel |Yes |Cancelled SSIS integration runtime start metrics |Count |Total |Cancelled SSIS integration runtime start metrics |IntegrationRuntimeName |
|SSISIntegrationRuntimeStartFailed |Yes |Failed SSIS integration runtime start metrics |Count |Total |Failed SSIS integration runtime start metrics |IntegrationRuntimeName |
|SSISIntegrationRuntimeStartSucceeded |Yes |Succeeded SSIS integration runtime start metrics |Count |Total |Succeeded SSIS integration runtime start metrics |IntegrationRuntimeName |
|SSISIntegrationRuntimeStopStuck |Yes |Stuck SSIS integration runtime stop metrics |Count |Total |Stuck SSIS integration runtime stop metrics |IntegrationRuntimeName |
|SSISIntegrationRuntimeStopSucceeded |Yes |Succeeded SSIS integration runtime stop metrics |Count |Total |Succeeded SSIS integration runtime stop metrics |IntegrationRuntimeName |
|SSISPackageExecutionCancel |Yes |Cancelled SSIS package execution metrics |Count |Total |Cancelled SSIS package execution metrics |IntegrationRuntimeName |
|SSISPackageExecutionFailed |Yes |Failed SSIS package execution metrics |Count |Total |Failed SSIS package execution metrics |IntegrationRuntimeName |
|SSISPackageExecutionSucceeded |Yes |Succeeded SSIS package execution metrics |Count |Total |Succeeded SSIS package execution metrics |IntegrationRuntimeName |
|TriggerCancelledRuns |Yes |Cancelled trigger runs metrics |Count |Total |Cancelled trigger runs metrics |Name, FailureType |
|TriggerFailedRuns |Yes |Failed trigger runs metrics |Count |Total |Failed trigger runs metrics |Name, FailureType |
|TriggerSucceededRuns |Yes |Succeeded trigger runs metrics |Count |Total |Succeeded trigger runs metrics |Name, FailureType |

## Microsoft.DataLakeAnalytics/accounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|JobAUEndedCancelled |Yes |Cancelled AU Time |Seconds |Total |Total AU time for cancelled jobs. |No Dimensions |
|JobAUEndedFailure |Yes |Failed AU Time |Seconds |Total |Total AU time for failed jobs. |No Dimensions |
|JobAUEndedSuccess |Yes |Successful AU Time |Seconds |Total |Total AU time for successful jobs. |No Dimensions |
|JobEndedCancelled |Yes |Cancelled Jobs |Count |Total |Count of cancelled jobs. |No Dimensions |
|JobEndedFailure |Yes |Failed Jobs |Count |Total |Count of failed jobs. |No Dimensions |
|JobEndedSuccess |Yes |Successful Jobs |Count |Total |Count of successful jobs. |No Dimensions |
|JobStage |Yes |Jobs in Stage |Count |Total |Number of jobs in each stage. |No Dimensions |

## Microsoft.DataLakeStore/accounts  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DataRead |Yes |Data Read |Bytes |Total |Total amount of data read from the account. |No Dimensions |
|DataWritten |Yes |Data Written |Bytes |Total |Total amount of data written to the account. |No Dimensions |
|ReadRequests |Yes |Read Requests |Count |Total |Count of data read requests to the account. |No Dimensions |
|TotalStorage |Yes |Total Storage |Bytes |Maximum |Total amount of data stored in the account. |No Dimensions |
|WriteRequests |Yes |Write Requests |Count |Total |Count of data write requests to the account. |No Dimensions |

## Microsoft.DataProtection/BackupVaults  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BackupHealthEvent |Yes |Backup Health Events (preview) |Count |Count |The count of health events pertaining to backup job health |dataSourceURL, backupInstanceUrl, dataSourceType, healthStatus, backupInstanceName |
|RestoreHealthEvent |Yes |Restore Health Events (preview) |Count |Count |The count of health events pertaining to restore job health |dataSourceURL, backupInstanceUrl, dataSourceType, healthStatus, backupInstanceName |

## Microsoft.DataShare/accounts  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|FailedShareSubscriptionSynchronizations |Yes |Received Share Failed Snapshots |Count |Count |Number of received share failed snapshots in the account |No Dimensions |
|FailedShareSynchronizations |Yes |Sent Share Failed Snapshots |Count |Count |Number of sent share failed snapshots in the account |No Dimensions |
|ShareCount |Yes |Sent Shares |Count |Maximum |Number of sent shares in the account |ShareName |
|ShareSubscriptionCount |Yes |Received Shares |Count |Maximum |Number of received shares in the account |ShareSubscriptionName |
|SucceededShareSubscriptionSynchronizations |Yes |Received Share Succeeded Snapshots |Count |Count |Number of received share succeeded snapshots in the account |No Dimensions |
|SucceededShareSynchronizations |Yes |Sent Share Succeeded Snapshots |Count |Count |Number of sent share succeeded snapshots in the account |No Dimensions |

## Microsoft.DBforMariaDB/servers  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections |Yes |Active Connections |Count |Average |Active Connections |No Dimensions |
|backup_storage_used |Yes |Backup Storage used |Bytes |Average |Backup Storage used |No Dimensions |
|connections_failed |Yes |Failed Connections |Count |Total |Failed Connections |No Dimensions |
|cpu_percent |Yes |CPU percent |Percent |Average |CPU percent |No Dimensions |
|io_consumption_percent |Yes |IO percent |Percent |Average |IO percent |No Dimensions |
|memory_percent |Yes |Memory percent |Percent |Average |Memory percent |No Dimensions |
|network_bytes_egress |Yes |Network Out |Bytes |Total |Network Out across active connections |No Dimensions |
|network_bytes_ingress |Yes |Network In |Bytes |Total |Network In across active connections |No Dimensions |
|seconds_behind_master |Yes |Replication lag in seconds |Count |Maximum |Replication lag in seconds |No Dimensions |
|serverlog_storage_limit |Yes |Server Log storage limit |Bytes |Maximum |Server Log storage limit |No Dimensions |
|serverlog_storage_percent |Yes |Server Log storage percent |Percent |Average |Server Log storage percent |No Dimensions |
|serverlog_storage_usage |Yes |Server Log storage used |Bytes |Average |Server Log storage used |No Dimensions |
|storage_limit |Yes |Storage limit |Bytes |Maximum |Storage limit |No Dimensions |
|storage_percent |Yes |Storage percent |Percent |Average |Storage percent |No Dimensions |
|storage_used |Yes |Storage used |Bytes |Average |Storage used |No Dimensions |

## Microsoft.DBforMySQL/flexibleServers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|aborted_connections |Yes |Aborted Connections |Count |Total |Aborted Connections |No Dimensions |
|active_connections |Yes |Active Connections |Count |Maximum |Active Connections |No Dimensions |
|backup_storage_used |Yes |Backup Storage Used |Bytes |Maximum |Backup Storage Used |No Dimensions |
|Com_alter_table |Yes |Com Alter Table |Count |Total |The number of times ALTER TABLE statement has been executed. |No Dimensions |
|Com_create_db |Yes |Com Create DB |Count |Total |The number of times CREATE DB statement has been executed. |No Dimensions |
|Com_create_table |Yes |Com Create Table |Count |Total |The number of times CREATE TABLE statement has been executed. |No Dimensions |
|Com_delete |Yes |Com Delete |Count |Total |The number of times DELETE statement has been executed. |No Dimensions |
|Com_drop_db |Yes |Com Drop DB |Count |Total |The number of times DROP DB statement has been executed. |No Dimensions |
|Com_drop_table |Yes |Com Drop Table |Count |Total |The number of times DROP TABLE statement has been executed. |No Dimensions |
|Com_insert |Yes |Com Insert |Count |Total |The number of times INSERT statement has been executed. |No Dimensions |
|Com_select |Yes |Com Select |Count |Total |The number of times SELECT statement has been executed. |No Dimensions |
|Com_update |Yes |Com Update |Count |Total |The number of times UPDATE statement has been executed. |No Dimensions |
|cpu_credits_consumed |Yes |CPU Credits Consumed |Count |Maximum |CPU Credits Consumed |No Dimensions |
|cpu_credits_remaining |Yes |CPU Credits Remaining |Count |Maximum |CPU Credits Remaining |No Dimensions |
|cpu_percent |Yes |Host CPU Percent |Percent |Maximum |Host CPU Percent |No Dimensions |
|HA_IO_status |Yes |HA IO Status |Count |Maximum |Status for replication IO thread running  |No Dimensions |
|HA_replication_lag |Yes |HA Replication Lag |Seconds |Maximum |HA Replication lag in seconds |No Dimensions |
|HA_SQL_status |Yes |HA SQL Status |Count |Maximum |Status for replication SQL thread running  |No Dimensions |
|Innodb_buffer_pool_pages_data |Yes |InnoDB Buffer Pool Pages Data |Count |Total |The number of pages in the InnoDB buffer pool containing data. |No Dimensions |
|Innodb_buffer_pool_pages_dirty |Yes |InnoDB Buffer Pool Pages Dirty |Count |Total |The current number of dirty pages in the InnoDB buffer pool. |No Dimensions |
|Innodb_buffer_pool_pages_free |Yes |InnoDB Buffer Pool Pages Free |Count |Total |The number of free pages in the InnoDB buffer pool. |No Dimensions |
|Innodb_buffer_pool_read_requests |Yes |InnoDB Buffer Pool Read Requests |Count |Total |The number of logical read requests. |No Dimensions |
|Innodb_buffer_pool_reads |Yes |InnoDB Buffer Pool Reads |Count |Total |The number of logical reads that InnoDB could not satisfy from the buffer pool, and had to read directly from disk. |No Dimensions |
|io_consumption_percent |Yes |Storage IO Percent |Percent |Maximum |Storage I/O consumption percent |No Dimensions |
|memory_percent |Yes |Host Memory Percent |Percent |Maximum |Host Memory Percent |No Dimensions |
|network_bytes_egress |Yes |Host Network Out |Bytes |Total |Host Network egress in bytes |No Dimensions |
|network_bytes_ingress |Yes |Host Network In |Bytes |Total |Host Network ingress in bytes |No Dimensions |
|Queries |Yes |Queries |Count |Total |Queries |No Dimensions |
|Replica_IO_Running |No |Replica IO Status |Count |Maximum |Status for replication IO thread running  |No Dimensions |
|Replica_SQL_Running |No |Replica SQL Status |Count |Maximum |Status for replication SQL thread running  |No Dimensions |
|replication_lag |Yes |Replication Lag In Seconds |Seconds |Maximum |Replication lag in seconds |No Dimensions |
|serverlog_storage_limit |Yes |Serverlog Storage Limit |Bytes |Maximum |Serverlog Storage Limit |No Dimensions |
|serverlog_storage_percent |Yes |Serverlog Storage Percent |Percent |Maximum |Serverlog Storage Percent |No Dimensions |
|serverlog_storage_usage |Yes |Serverlog Storage Used |Bytes |Maximum |Serverlog Storage Used |No Dimensions |
|Slow_queries |Yes |Slow Queries |Count |Total |The number of queries that have taken more than long_query_time seconds. |No Dimensions |
|storage_io_count |Yes |IO Count |Count |Total |The number of I/O consumed. |No Dimensions |
|storage_limit |Yes |Storage Limit |Bytes |Maximum |Storage Limit |No Dimensions |
|storage_percent |Yes |Storage Percent |Percent |Maximum |Storage Percent |No Dimensions |
|storage_throttle_count |Yes |Storage Throttle Count |Count |Maximum |Storage IO requests throttled in the selected time range. |No Dimensions |
|storage_used |Yes |Storage Used |Bytes |Maximum |Storage Used |No Dimensions |
|total_connections |Yes |Total Connections |Count |Total |Total Connections |No Dimensions |

## Microsoft.DBforMySQL/servers  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections |Yes |Active Connections |Count |Average |Active Connections |No Dimensions |
|backup_storage_used |Yes |Backup Storage used |Bytes |Average |Backup Storage used |No Dimensions |
|connections_failed |Yes |Failed Connections |Count |Total |Failed Connections |No Dimensions |
|cpu_percent |Yes |CPU percent |Percent |Average |CPU percent |No Dimensions |
|io_consumption_percent |Yes |IO percent |Percent |Average |IO percent |No Dimensions |
|memory_percent |Yes |Memory percent |Percent |Average |Memory percent |No Dimensions |
|network_bytes_egress |Yes |Network Out |Bytes |Total |Network Out across active connections |No Dimensions |
|network_bytes_ingress |Yes |Network In |Bytes |Total |Network In across active connections |No Dimensions |
|seconds_behind_master |Yes |Replication lag in seconds |Count |Maximum |Replication lag in seconds |No Dimensions |
|serverlog_storage_limit |Yes |Server Log storage limit |Bytes |Maximum |Server Log storage limit |No Dimensions |
|serverlog_storage_percent |Yes |Server Log storage percent |Percent |Average |Server Log storage percent |No Dimensions |
|serverlog_storage_usage |Yes |Server Log storage used |Bytes |Average |Server Log storage used |No Dimensions |
|storage_limit |Yes |Storage limit |Bytes |Maximum |Storage limit |No Dimensions |
|storage_percent |Yes |Storage percent |Percent |Average |Storage percent |No Dimensions |
|storage_used |Yes |Storage used |Bytes |Average |Storage used |No Dimensions |

## Microsoft.DBforPostgreSQL/flexibleServers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections |Yes |Active Connections |Count |Average |Active Connections |No Dimensions |
|analyze_count_user_tables |Yes |Analyze Counter User Tables (Preview) |Count |Maximum |Number of times user only tables have been manually analyzed in this database |DatabaseName |
|autoanalyze_count_user_tables |Yes |AutoAnalyze Counter User Tables (Preview) |Count |Maximum |Number of times user only tables have been analyzed by the autovacuum daemon in this database |DatabaseName |
|autovacuum_count_user_tables |Yes |AutoVacuum Counter User Tables (Preview) |Count |Maximum |Number of times user only tables have been vacuumed by the autovacuum daemon in this database |DatabaseName |
|backup_storage_used |Yes |Backup Storage Used |Bytes |Average |Backup Storage Used |No Dimensions |
|blks_hit |Yes |Disk Blocks Hit (Preview) |Count |Total |Number of times disk blocks were found already in the buffer cache, so that a read was not necessary |DatabaseName |
|blks_read |Yes |Disk Blocks Read (Preview) |Count |Total |Number of disk blocks read in this database |DatabaseName |
|client_connections_active |Yes |Active client connections (Preview) |Count |Maximum |Connections from clients which are associated with a PostgreSQL connection |DatabaseName |
|client_connections_waiting |Yes |Waiting client connections (Preview) |Count |Maximum |Connections from clients that are waiting for a PostgreSQL connection to service them |DatabaseName |
|connections_failed |Yes |Failed Connections |Count |Total |Failed Connections |No Dimensions |
|connections_succeeded |Yes |Succeeded Connections |Count |Total |Succeeded Connections |No Dimensions |
|cpu_credits_consumed |Yes |CPU Credits Consumed |Count |Average |Total number of credits consumed by the database server |No Dimensions |
|cpu_credits_remaining |Yes |CPU Credits Remaining |Count |Average |Total number of credits available to burst |No Dimensions |
|cpu_percent |Yes |CPU percent |Percent |Average |CPU percent |No Dimensions |
|deadlocks |Yes |Deadlocks (Preview) |Count |Total |Number of deadlocks detected in this database |DatabaseName |
|disk_bandwidth_consumed_percentage |Yes |Disk Bandwidth Consumed Percentage (Preview) |Percent |Average |Percentage of disk bandwidth consumed per minute |No Dimensions |
|disk_iops_consumed_percentage |Yes |Disk IOPS Consumed Percentage (Preview) |Percent |Average |Percentage of disk I/Os consumed per minute |No Dimensions |
|disk_queue_depth |Yes |Disk Queue Depth |Count |Average |Number of outstanding I/O operations to the data disk |No Dimensions |
|iops |Yes |IOPS |Count |Average |IO Operations per second |No Dimensions |
|logical_replication_delay_in_bytes |Yes |Max Logical Replication Lag (Preview) |Bytes |Maximum |Maximum lag across all logical replication slots |No Dimensions |
|longest_query_time_sec |Yes |Oldest Query (Preview) |Seconds |Maximum |The age in seconds of the longest query that is currently running |No Dimensions |
|longest_transaction_time_sec |Yes |Oldest Transaction (Preview) |Seconds |Maximum |The age in seconds of the longest transaction (including idle transactions) |No Dimensions |
|max_connections |Yes |Max Connections (Preview) |Count |Maximum |Max connections |No Dimensions |
|maximum_used_transactionIDs |Yes |Maximum Used Transaction IDs |Count |Average |Maximum Used Transaction IDs |No Dimensions |
|memory_percent |Yes |Memory percent |Percent |Average |Memory percent |No Dimensions |
|n_dead_tup_user_tables |Yes |Estimated Dead Rows User Tables (Preview) |Count |Maximum |Estimated number of dead rows for user only tables in this database |DatabaseName |
|n_live_tup_user_tables |Yes |Estimated Live Rows User Tables (Preview) |Count |Maximum |Estimated number of live rows for user only tables in this database |DatabaseName |
|n_mod_since_analyze_user_tables |Yes |Estimated Modifications User Tables (Preview) |Count |Maximum |Estimated number of rows modified since user only tables were last analyzed |DatabaseName |
|network_bytes_egress |Yes |Network Out |Bytes |Total |Network Out across active connections |No Dimensions |
|network_bytes_ingress |Yes |Network In |Bytes |Total |Network In across active connections |No Dimensions |
|num_pools |Yes |Number of connection pools (Preview) |Count |Maximum |Total number of connection pools |DatabaseName |
|numbackends |Yes |Backends (Preview) |Count |Maximum |Number of backends connected to this database |DatabaseName |
|oldest_backend_time_sec |Yes |Oldest Backend (Preview) |Seconds |Maximum |The age in seconds of the oldest backend (irrespective of the state) |No Dimensions |
|oldest_backend_xmin |Yes |Oldest xmin (Preview) |Count |Maximum |The actual value of the oldest xmin. |No Dimensions |
|oldest_backend_xmin_age |Yes |Oldest xmin Age (Preview) |Count |Maximum |Age in units of the oldest xmin. It indicated how many transactions passed since oldest xmin |No Dimensions |
|physical_replication_delay_in_bytes |Yes |Max Physical Replication Lag (Preview) |Bytes |Maximum |Maximum lag across all asynchronous physical replication slots |No Dimensions |
|physical_replication_delay_in_seconds |Yes |Read Replica Lag (Preview) |Seconds |Maximum |Read Replica lag in seconds |No Dimensions |
|read_iops |Yes |Read IOPS |Count |Average |Number of data disk I/O read operations per second |No Dimensions |
|read_throughput |Yes |Read Throughput Bytes/Sec |Count |Average |Bytes read per second from the data disk during monitoring period |No Dimensions |
|server_connections_active |Yes |Active server connections (Preview) |Count |Maximum |Connections to PostgreSQL that are in use by a client connection |DatabaseName |
|server_connections_idle |Yes |Idle server connections (Preview) |Count |Maximum |Connections to PostgreSQL that are idle, ready to service a new client connection |DatabaseName |
|sessions_by_state |Yes |Sessions by State (Preview) |Count |Maximum |Overall state of the backends |State |
|sessions_by_wait_event_type |Yes |Sessions by WaitEventType (Preview) |Count |Maximum |Sessions by the type of event for which the backend is waiting |WaitEventType |
|storage_free |Yes |Storage Free |Bytes |Average |Storage Free |No Dimensions |
|storage_percent |Yes |Storage percent |Percent |Average |Storage percent |No Dimensions |
|storage_used |Yes |Storage used |Bytes |Average |Storage used |No Dimensions |
|tables_analyzed_user_tables |Yes |User Tables Analyzed (Preview) |Count |Maximum |Number of user only tables that have been analyzed in this database |DatabaseName |
|tables_autoanalyzed_user_tables |Yes |User Tables AutoAnalyzed (Preview) |Count |Maximum |Number of user only tables that have been analyzed by the autovacuum daemon in this database |DatabaseName |
|tables_autovacuumed_user_tables |Yes |User Tables AutoVacuumed (Preview) |Count |Maximum |Number of user only tables that have been vacuumed by the autovacuum daemon in this database |DatabaseName |
|tables_counter_user_tables |Yes |User Tables Counter (Preview) |Count |Maximum |Number of user only tables in this database |DatabaseName |
|tables_vacuumed_user_tables |Yes |User Tables Vacuumed (Preview) |Count |Maximum |Number of user only tables that have been vacuumed in this database |DatabaseName |
|temp_bytes |Yes |Temporary Files Size (Preview) |Bytes |Total |Total amount of data written to temporary files by queries in this database |DatabaseName |
|temp_files |Yes |Temporary Files (Preview) |Count |Total |Number of temporary files created by queries in this database |DatabaseName |
|total_pooled_connections |Yes |Total pooled connections (Preview) |Count |Maximum |Current number of pooled connections |DatabaseName |
|tup_deleted |Yes |Tuples Deleted (Preview) |Count |Total |Number of rows deleted by queries in this database |DatabaseName |
|tup_fetched |Yes |Tuples Fetched (Preview) |Count |Total |Number of rows fetched by queries in this database |DatabaseName |
|tup_inserted |Yes |Tuples Inserted (Preview) |Count |Total |Number of rows inserted by queries in this database |DatabaseName |
|tup_returned |Yes |Tuples Returned (Preview) |Count |Total |Number of rows returned by queries in this database |DatabaseName |
|tup_updated |Yes |Tuples Updated (Preview) |Count |Total |Number of rows updated by queries in this database |DatabaseName |
|txlogs_storage_used |Yes |Transaction Log Storage Used |Bytes |Average |Transaction Log Storage Used |No Dimensions |
|vacuum_count_user_tables |Yes |Vacuum Counter User Tables (Preview) |Count |Maximum |Number of times user only tables have been manually vacuumed in this database (not counting VACUUM FULL) |DatabaseName |
|write_iops |Yes |Write IOPS |Count |Average |Number of data disk I/O write operations per second |No Dimensions |
|write_throughput |Yes |Write Throughput Bytes/Sec |Count |Average |Bytes written per second to the data disk during monitoring period |No Dimensions |
|xact_commit |Yes |Transactions Committed (Preview) |Count |Total |Number of transactions in this database that have been committed |DatabaseName |
|xact_rollback |Yes |Transactions Rolled Back (Preview) |Count |Total |Number of transactions in this database that have been rolled back |DatabaseName |
|xact_total |Yes |Total Transactions (Preview) |Count |Total |Number of total transactions executed in this database |DatabaseName |

## Microsoft.DBForPostgreSQL/serverGroupsv2  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections |Yes |Active Connections |Count |Average |Active Connections |ServerName |
|apps_reserved_memory_percent |Yes |Reserved Memory percent |Percent |Average |Percentage of Commit Memory Limit Reserved by Applications |ServerName |
|cpu_credits_consumed |Yes |CPU Credits Consumed |Count |Average |Total number of credits consumed by the node. Only available when burstable compute is provisioned on the node. |ServerName |
|cpu_credits_remaining |Yes |CPU Credits Remaining |Count |Average |Total number of credits available to burst. Only available when burstable compute is provisioned on the node. |ServerName |
|cpu_percent |Yes |CPU percent |Percent |Average |CPU percent |ServerName |
|iops |Yes |IOPS |Count |Average |IO operations per second |ServerName |
|memory_percent |Yes |Memory percent |Percent |Average |Memory percent |ServerName |
|network_bytes_egress |Yes |Network Out |Bytes |Total |Network Out across active connections |ServerName |
|network_bytes_ingress |Yes |Network In |Bytes |Total |Network In across active connections |ServerName |
|replication_lag |Yes |Replication lag |MilliSeconds |Average |Allows to see how much read replica nodes are behind their counterparts in the primary cluster |ServerName |
|storage_percent |Yes |Storage percent |Percent |Average |Storage percent |ServerName |
|storage_used |Yes |Storage used |Bytes |Average |Storage used |ServerName |
|vm_cached_bandwidth_percent |Yes |VM Cached Bandwidth Consumed Percentage |Percent |Average |Percentage of cached disk bandwidth consumed by the VM |ServerName |
|vm_cached_iops_percent |Yes |VM Cached IOPS Consumed Percentage |Percent |Average |Percentage of cached disk IOPS consumed by the VM |ServerName |
|vm_uncached_bandwidth_percent |Yes |VM Uncached Bandwidth Consumed Percentage |Percent |Average |Percentage of uncached disk bandwidth consumed by the VM |ServerName |
|vm_uncached_iops_percent |Yes |VM Uncached IOPS Consumed Percentage |Percent |Average |Percentage of uncached disk IOPS consumed by the VM |ServerName |

## Microsoft.DBforPostgreSQL/servers  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections |Yes |Active Connections |Count |Average |Active Connections |No Dimensions |
|backup_storage_used |Yes |Backup Storage Used |Bytes |Average |Backup Storage Used |No Dimensions |
|connections_failed |Yes |Failed Connections |Count |Total |Failed Connections |No Dimensions |
|cpu_percent |Yes |CPU percent |Percent |Average |CPU percent |No Dimensions |
|io_consumption_percent |Yes |IO percent |Percent |Average |IO percent |No Dimensions |
|memory_percent |Yes |Memory percent |Percent |Average |Memory percent |No Dimensions |
|network_bytes_egress |Yes |Network Out |Bytes |Total |Network Out across active connections |No Dimensions |
|network_bytes_ingress |Yes |Network In |Bytes |Total |Network In across active connections |No Dimensions |
|pg_replica_log_delay_in_bytes |Yes |Max Lag Across Replicas |Bytes |Maximum |Lag in bytes of the most lagging replica |No Dimensions |
|pg_replica_log_delay_in_seconds |Yes |Replica Lag |Seconds |Maximum |Replica lag in seconds |No Dimensions |
|serverlog_storage_limit |Yes |Server Log storage limit |Bytes |Maximum |Server Log storage limit |No Dimensions |
|serverlog_storage_percent |Yes |Server Log storage percent |Percent |Average |Server Log storage percent |No Dimensions |
|serverlog_storage_usage |Yes |Server Log storage used |Bytes |Average |Server Log storage used |No Dimensions |
|storage_limit |Yes |Storage limit |Bytes |Maximum |Storage limit |No Dimensions |
|storage_percent |Yes |Storage percent |Percent |Average |Storage percent |No Dimensions |
|storage_used |Yes |Storage used |Bytes |Average |Storage used |No Dimensions |

## Microsoft.DBforPostgreSQL/serversv2  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections |Yes |Active Connections |Count |Average |Active Connections |No Dimensions |
|cpu_percent |Yes |CPU percent |Percent |Average |CPU percent |No Dimensions |
|iops |Yes |IOPS |Count |Average |IO Operations per second |No Dimensions |
|memory_percent |Yes |Memory percent |Percent |Average |Memory percent |No Dimensions |
|network_bytes_egress |Yes |Network Out |Bytes |Total |Network Out across active connections |No Dimensions |
|network_bytes_ingress |Yes |Network In |Bytes |Total |Network In across active connections |No Dimensions |
|storage_percent |Yes |Storage percent |Percent |Average |Storage percent |No Dimensions |
|storage_used |Yes |Storage used |Bytes |Average |Storage used |No Dimensions |

## Microsoft.Devices/IotHubs  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|c2d.commands.egress.abandon.success |Yes |C2D messages abandoned |Count |Total |Number of cloud-to-device messages abandoned by the device |No Dimensions |
|c2d.commands.egress.complete.success |Yes |C2D message deliveries completed |Count |Total |Number of cloud-to-device message deliveries completed successfully by the device |No Dimensions |
|c2d.commands.egress.reject.success |Yes |C2D messages rejected |Count |Total |Number of cloud-to-device messages rejected by the device |No Dimensions |
|c2d.methods.failure |Yes |Failed direct method invocations |Count |Total |The count of all failed direct method calls. |No Dimensions |
|c2d.methods.requestSize |Yes |Request size of direct method invocations |Bytes |Average |The average, min, and max of all successful direct method requests. |No Dimensions |
|c2d.methods.responseSize |Yes |Response size of direct method invocations |Bytes |Average |The average, min, and max of all successful direct method responses. |No Dimensions |
|c2d.methods.success |Yes |Successful direct method invocations |Count |Total |The count of all successful direct method calls. |No Dimensions |
|c2d.twin.read.failure |Yes |Failed twin reads from back end |Count |Total |The count of all failed back-end-initiated twin reads. |No Dimensions |
|c2d.twin.read.size |Yes |Response size of twin reads from back end |Bytes |Average |The average, min, and max of all successful back-end-initiated twin reads. |No Dimensions |
|c2d.twin.read.success |Yes |Successful twin reads from back end |Count |Total |The count of all successful back-end-initiated twin reads. |No Dimensions |
|c2d.twin.update.failure |Yes |Failed twin updates from back end |Count |Total |The count of all failed back-end-initiated twin updates. |No Dimensions |
|c2d.twin.update.size |Yes |Size of twin updates from back end |Bytes |Average |The average, min, and max size of all successful back-end-initiated twin updates. |No Dimensions |
|c2d.twin.update.success |Yes |Successful twin updates from back end |Count |Total |The count of all successful back-end-initiated twin updates. |No Dimensions |
|C2DMessagesExpired |Yes |C2D Messages Expired |Count |Total |Number of expired cloud-to-device messages |No Dimensions |
|configurations |Yes |Configuration Metrics |Count |Total |Metrics for Configuration Operations |No Dimensions |
|connectedDeviceCount |No |Connected devices |Count |Average |Number of devices connected to your IoT hub |No Dimensions |
|d2c.endpoints.egress.builtIn.events |Yes |Routing: messages delivered to messages/events |Count |Total |The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events). |No Dimensions |
|d2c.endpoints.egress.eventHubs |Yes |Routing: messages delivered to Event Hub |Count |Total |The number of times IoT Hub routing successfully delivered messages to Event Hub endpoints. |No Dimensions |
|d2c.endpoints.egress.serviceBusQueues |Yes |Routing: messages delivered to Service Bus Queue |Count |Total |The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints. |No Dimensions |
|d2c.endpoints.egress.serviceBusTopics |Yes |Routing: messages delivered to Service Bus Topic |Count |Total |The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints. |No Dimensions |
|d2c.endpoints.egress.storage |Yes |Routing: messages delivered to storage |Count |Total |The number of times IoT Hub routing successfully delivered messages to storage endpoints. |No Dimensions |
|d2c.endpoints.egress.storage.blobs |Yes |Routing: blobs delivered to storage |Count |Total |The number of times IoT Hub routing delivered blobs to storage endpoints. |No Dimensions |
|d2c.endpoints.egress.storage.bytes |Yes |Routing: data delivered to storage |Bytes |Total |The amount of data (bytes) IoT Hub routing delivered to storage endpoints. |No Dimensions |
|d2c.endpoints.latency.builtIn.events |Yes |Routing: message latency for messages/events |MilliSeconds |Average |The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into the built-in endpoint (messages/events). |No Dimensions |
|d2c.endpoints.latency.eventHubs |Yes |Routing: message latency for Event Hub |MilliSeconds |Average |The average latency (milliseconds) between message ingress to IoT Hub and message ingress into an Event Hub endpoint. |No Dimensions |
|d2c.endpoints.latency.serviceBusQueues |Yes |Routing: message latency for Service Bus Queue |MilliSeconds |Average |The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus queue endpoint. |No Dimensions |
|d2c.endpoints.latency.serviceBusTopics |Yes |Routing: message latency for Service Bus Topic |MilliSeconds |Average |The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus topic endpoint. |No Dimensions |
|d2c.endpoints.latency.storage |Yes |Routing: message latency for storage |MilliSeconds |Average |The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a storage endpoint. |No Dimensions |
|d2c.telemetry.egress.dropped |Yes |Routing: telemetry messages dropped  |Count |Total |The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value does not count messages delivered to fallback route as dropped messages are not delivered there. |No Dimensions |
|d2c.telemetry.egress.fallback |Yes |Routing: messages delivered to fallback |Count |Total |The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route. |No Dimensions |
|d2c.telemetry.egress.invalid |Yes |Routing: telemetry messages incompatible |Count |Total |The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. This value does not include retries. |No Dimensions |
|d2c.telemetry.egress.orphaned |Yes |Routing: telemetry messages orphaned  |Count |Total |The number of times messages were orphaned by IoT Hub routing because they didn't match any routing rules (including the fallback rule).  |No Dimensions |
|d2c.telemetry.egress.success |Yes |Routing: telemetry messages delivered |Count |Total |The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery. |No Dimensions |
|d2c.telemetry.ingress.allProtocol |Yes |Telemetry message send attempts |Count |Total |Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub |No Dimensions |
|d2c.telemetry.ingress.sendThrottle |Yes |Number of throttling errors |Count |Total |Number of throttling errors due to device throughput throttles |No Dimensions |
|d2c.telemetry.ingress.success |Yes |Telemetry messages sent |Count |Total |Number of device-to-cloud telemetry messages sent successfully to your IoT hub |No Dimensions |
|d2c.twin.read.failure |Yes |Failed twin reads from devices |Count |Total |The count of all failed device-initiated twin reads. |No Dimensions |
|d2c.twin.read.size |Yes |Response size of twin reads from devices |Bytes |Average |The average, min, and max of all successful device-initiated twin reads. |No Dimensions |
|d2c.twin.read.success |Yes |Successful twin reads from devices |Count |Total |The count of all successful device-initiated twin reads. |No Dimensions |
|d2c.twin.update.failure |Yes |Failed twin updates from devices |Count |Total |The count of all failed device-initiated twin updates. |No Dimensions |
|d2c.twin.update.size |Yes |Size of twin updates from devices |Bytes |Average |The average, min, and max size of all successful device-initiated twin updates. |No Dimensions |
|d2c.twin.update.success |Yes |Successful twin updates from devices |Count |Total |The count of all successful device-initiated twin updates. |No Dimensions |
|dailyMessageQuotaUsed |Yes |Total number of messages used |Count |Maximum |Number of total messages used today |No Dimensions |
|deviceDataUsage |Yes |Total device data usage |Bytes |Total |Bytes transferred to and from any devices connected to IotHub |No Dimensions |
|deviceDataUsageV2 |Yes |Total device data usage (preview) |Bytes |Total |Bytes transferred to and from any devices connected to IotHub |No Dimensions |
|devices.connectedDevices.allProtocol |Yes |Connected devices (deprecated)  |Count |Total |Number of devices connected to your IoT hub |No Dimensions |
|devices.totalDevices |Yes |Total devices (deprecated) |Count |Total |Number of devices registered to your IoT hub |No Dimensions |
|EventGridDeliveries |Yes |Event Grid deliveries |Count |Total |The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid). |Result, EventType |
|EventGridLatency |Yes |Event Grid latency |MilliSeconds |Average |The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event. |EventType |
|jobs.cancelJob.failure |Yes |Failed job cancellations |Count |Total |The count of all failed calls to cancel a job. |No Dimensions |
|jobs.cancelJob.success |Yes |Successful job cancellations |Count |Total |The count of all successful calls to cancel a job. |No Dimensions |
|jobs.completed |Yes |Completed jobs |Count |Total |The count of all completed jobs. |No Dimensions |
|jobs.createDirectMethodJob.failure |Yes |Failed creations of method invocation jobs |Count |Total |The count of all failed creation of direct method invocation jobs. |No Dimensions |
|jobs.createDirectMethodJob.success |Yes |Successful creations of method invocation jobs |Count |Total |The count of all successful creation of direct method invocation jobs. |No Dimensions |
|jobs.createTwinUpdateJob.failure |Yes |Failed creations of twin update jobs |Count |Total |The count of all failed creation of twin update jobs. |No Dimensions |
|jobs.createTwinUpdateJob.success |Yes |Successful creations of twin update jobs |Count |Total |The count of all successful creation of twin update jobs. |No Dimensions |
|jobs.failed |Yes |Failed jobs |Count |Total |The count of all failed jobs. |No Dimensions |
|jobs.listJobs.failure |Yes |Failed calls to list jobs |Count |Total |The count of all failed calls to list jobs. |No Dimensions |
|jobs.listJobs.success |Yes |Successful calls to list jobs |Count |Total |The count of all successful calls to list jobs. |No Dimensions |
|jobs.queryJobs.failure |Yes |Failed job queries |Count |Total |The count of all failed calls to query jobs. |No Dimensions |
|jobs.queryJobs.success |Yes |Successful job queries |Count |Total |The count of all successful calls to query jobs. |No Dimensions |
|RoutingDataSizeInBytesDelivered |Yes |Routing Delivery Message Size in Bytes (preview) |Bytes |Total |The total size in bytes of messages delivered by IoT hub to an endpoint. You can use the EndpointName and EndpointType dimensions to view the size of the messages in bytes delivered to your different endpoints. The metric value increases for every message delivered, including if the message is delivered to multiple endpoints or if the message is delivered to the same endpoint multiple times. |EndpointType, EndpointName, RoutingSource |
|RoutingDeliveries |Yes |Routing Deliveries (preview) |Count |Total |The number of times IoT Hub attempted to deliver messages to all endpoints using routing. To see the number of successful or failed attempts, use the Result dimension. To see the reason of failure, like invalid, dropped, or orphaned, use the FailureReasonCategory dimension. You can also use the EndpointName and EndpointType dimensions to understand how many messages were delivered to your different endpoints. The metric value increases by one for each delivery attempt, including if the message is delivered to multiple endpoints or if the message is delivered to the same endpoint multiple times. |EndpointType, EndpointName, FailureReasonCategory, Result, RoutingSource |
|RoutingDeliveryLatency |Yes |Routing Delivery Latency (preview) |MilliSeconds |Average |The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into an endpoint. You can use the EndpointName and EndpointType dimensions to understand the latency to your different endpoints. |EndpointType, EndpointName, RoutingSource |
|totalDeviceCount |No |Total devices |Count |Average |Number of devices registered to your IoT hub |No Dimensions |
|twinQueries.failure |Yes |Failed twin queries |Count |Total |The count of all failed twin queries. |No Dimensions |
|twinQueries.resultSize |Yes |Twin queries result size |Bytes |Average |The average, min, and max of the result size of all successful twin queries. |No Dimensions |
|twinQueries.success |Yes |Successful twin queries |Count |Total |The count of all successful twin queries. |No Dimensions |

## Microsoft.Devices/provisioningServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AttestationAttempts |Yes |Attestation attempts |Count |Total |Number of device attestations attempted |ProvisioningServiceName, Status, Protocol |
|DeviceAssignments |Yes |Devices assigned |Count |Total |Number of devices assigned to an IoT hub |ProvisioningServiceName, IotHubName |
|RegistrationAttempts |Yes |Registration attempts |Count |Total |Number of device registrations attempted |ProvisioningServiceName, IotHubName, Status |

## Microsoft.DigitalTwins/digitalTwinsInstances  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ApiRequests |Yes |API Requests |Count |Total |The number of API requests made for Digital Twins read, write, delete and query operations. |Operation, Authentication, Protocol, StatusCode, StatusCodeClass, StatusText |
|ApiRequestsFailureRate |Yes |API Requests Failure Rate |Percent |Average |The percentage of API requests that the service receives for your instance that return an internal error (500) response code for Digital Twins read, write, delete and query operations. |Operation, Authentication, Protocol |
|ApiRequestsLatency |Yes |API Requests Latency |Milliseconds |Average |The response time for API requests, i.e. from when the request is received by Azure Digital Twins until the service sends a success/fail result for Digital Twins read, write, delete and query operations. |Operation, Authentication, Protocol, StatusCode, StatusCodeClass, StatusText |
|BillingApiOperations |Yes |Billing API Operations |Count |Total |Billing metric for the count of all API requests made against the Azure Digital Twins service. |MeterId |
|BillingMessagesProcessed |Yes |Billing Messages Processed |Count |Total |Billing metric for the number of messages sent out from Azure Digital Twins to external endpoints. |MeterId |
|BillingQueryUnits |Yes |Billing Query Units |Count |Total |The number of Query Units, an internally computed measure of service resource usage, consumed to execute queries. |MeterId |
|BulkOperationEntityCount |Yes |Bulk Operation Entity Count (preview) |Count |Total |The number of twins, models, or relationships processed by a bulk operation. |Operation, Result |
|BulkOperationLatency |Yes |Bulk Operation Latency (preview) |Milliseconds |Average |Total time taken for a bulk operation to complete. |Operation, Authentication, Protocol |
|DataHistoryRouting |Yes |Data History Messages Routed (preview) |Count |Total |The number of messages routed to a time series database. |EndpointType, Result |
|DataHistoryRoutingFailureRate |Yes |Data History Routing Failure Rate (preview) |Percent |Average |The percentage of events that result in an error as they are routed from Azure Digital Twins to a time series database. |EndpointType |
|DataHistoryRoutingLatency |Yes |Data History Routing Latency (preview) |Milliseconds |Average |Time elapsed between an event getting routed from Azure Digital Twins to when it is posted to a time series database. |EndpointType, Result |
|IngressEvents |Yes |Ingress Events |Count |Total |The number of incoming telemetry events into Azure Digital Twins. |Result |
|IngressEventsFailureRate |Yes |Ingress Events Failure Rate |Percent |Average |The percentage of incoming telemetry events for which the service returns an internal error (500) response code. |No Dimensions |
|IngressEventsLatency |Yes |Ingress Events Latency |Milliseconds |Average |The time from when an event arrives to when it is ready to be egressed by Azure Digital Twins, at which point the service sends a success/fail result. |Result |
|ModelCount |Yes |Model Count |Count |Total |Total number of models in the Azure Digital Twins instance. Use this metric to determine if you are approaching the service limit for max number of models allowed per instance. |No Dimensions |
|Routing |Yes |Messages Routed |Count |Total |The number of messages routed to an endpoint Azure service such as Event Hub, Service Bus or Event Grid. |EndpointType, Result |
|RoutingFailureRate |Yes |Routing Failure Rate |Percent |Average |The percentage of events that result in an error as they are routed from Azure Digital Twins to an endpoint Azure service such as Event Hub, Service Bus or Event Grid. |EndpointType |
|RoutingLatency |Yes |Routing Latency |Milliseconds |Average |Time elapsed between an event getting routed from Azure Digital Twins to when it is posted to the endpoint Azure service such as Event Hub, Service Bus or Event Grid. |EndpointType, Result |
|TwinCount |Yes |Twin Count |Count |Total |Total number of twins in the Azure Digital Twins instance. Use this metric to determine if you are approaching the service limit for max number of twins allowed per instance. |No Dimensions |

## Microsoft.DocumentDB/cassandraClusters  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|cassandra_cache_capacity |No |capacity |Bytes |Total |Cache capacity in bytes. |cassandra_datacenter, cassandra_node, cache_name |
|cassandra_cache_entries |No |entries |Count |Total |Total number of cache entries. |cassandra_datacenter, cassandra_node, cache_name |
|cassandra_cache_hit_rate |No |hit rate |Percent |Average |All time cache hit rate. |cassandra_datacenter, cassandra_node, cache_name |
|cassandra_cache_hits |No |hits |Count |Total |Total number of cache hits. |cassandra_datacenter, cassandra_node, cache_name |
|cassandra_cache_miss_latency_histogram |No |cache miss latency average (microseconds) |Count |Average |Average cache miss latency (in microseconds). |cassandra_datacenter, cassandra_node, quantile |
|cassandra_cache_miss_latency_p99 |No |cache miss latency p99 (microseconds) |Count |Average |p99 Latency of misses. |cassandra_datacenter, cassandra_node, cache_name |
|cassandra_cache_requests |No |requests |Count |Total |Total number of cache requests. |cassandra_datacenter, cassandra_node, cache_name |
|cassandra_cache_size |No |occupied cache size |Bytes |Total |Total size of occupied cache, in bytes. |cassandra_datacenter, cassandra_node, cache_name |
|cassandra_client_auth_failure |No |auth failure (deprecated) |Count |Total |Number of failed client authentication requests. |cassandra_datacenter, cassandra_node |
|cassandra_client_auth_failure2 |No |auth failure |Count |Total |Number of failed client authentication requests. |cassandra_datacenter, cassandra_node |
|cassandra_client_auth_success |No |auth success |Count |Total |Number of successful client authentication requests. |cassandra_datacenter, cassandra_node |
|cassandra_client_request_condition_not_met |No |condition not met |Count |Total |Number of transaction preconditions did not match current values. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_contention_histogram |No |contention average |Count |Average |How many contended reads/writes were encountered in average. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_contention_histogram_p99 |No |contention p99 |Count |Average |p99 How many contended writes were encountered. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_failures |No |failures (deprecated) |Count |Total |Number of transaction failures encountered. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_failures2 |No |failures |Count |Total |Number of transaction failures encountered. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_latency_histogram |No |client request latency average (microseconds) |Count |Average |Average client request latency (in microseconds). |cassandra_datacenter, cassandra_node, quantile, request_type |
|cassandra_client_request_latency_p99 |No |client request latency p99 (microseconds) |Count |Average |p99 client request latency (in microseconds). |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_timeouts |No |timeouts (deprecated) |Count |Total |Number of timeouts encountered. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_timeouts2 |No |timeouts |Count |Total |Number of timeouts encountered. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_client_request_unfinished_commit |No |unfinished commit |Count |Total |Number of transactions that were committed on write. |cassandra_datacenter, cassandra_node, request_type |
|cassandra_commit_log_waiting_on_commit_latency_histogram |No |commit latency on waiting average (microseconds) |Count |Average |Average time spent waiting on CL fsync (in microseconds); for Periodic this is only occurs when the sync is lagging its sync interval. |cassandra_datacenter, cassandra_node, quantile |
|cassandra_cql_prepared_statements_executed |No |prepared statements executed |Count |Total |Number of prepared statements executed. |cassandra_datacenter, cassandra_node |
|cassandra_cql_regular_statements_executed |No |regular statements executed |Count |Total |Number of non prepared statements executed. |cassandra_datacenter, cassandra_node |
|cassandra_jvm_gc_count |No |gc count |Count |Total |Total number of collections that have occurred. |cassandra_datacenter, cassandra_node |
|cassandra_jvm_gc_time |No |gc time |MilliSeconds |Average |Approximate accumulated collection elapsed time. |cassandra_datacenter, cassandra_node |
|cassandra_table_all_memtables_live_data_size |No |all memtables live data size |Bytes |Total |Total amount of live data stored in the memtables (2i and pending flush memtables included) that resides off-heap, excluding any data structure overhead. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_all_memtables_off_heap_size |No |all memtables off heap size |Bytes |Total |Total amount of data stored in the memtables (2i and pending flush memtables included) that resides off-heap. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_bloom_filter_disk_space_used |No |bloom filter disk space used |Bytes |Total |Disk space used by bloom filter (in bytes). |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_bloom_filter_false_positives |No |bloom filter false positives |Count |Total |Number of false positives on table's bloom filter. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_bloom_filter_false_ratio |No |bloom filter false ratio |Percent |Average |False positive ratio of table's bloom filter. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_bloom_filter_off_heap_memory_used |No |bloom filter off-heap memory used |Bytes |Total |Off-heap memory used by bloom filter. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_bytes_flushed |No |bytes flushed |Bytes |Total |Total number of bytes flushed since server [re]start. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_cas_commit |No |cas commit average (microseconds) |Count |Average |Average latency of paxos commit round. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_cas_commit_p99 |No |cas commit p99 (microseconds) |Count |Average |p99 Latency of paxos commit round. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_cas_prepare |No |cas prepare average (microseconds) |Count |Average |Average latency of paxos prepare round. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_cas_prepare_p99 |No |cas prepare p99 (microseconds) |Count |Average |p99 Latency of paxos prepare round. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_cas_propose |No |cas propose average (microseconds) |Count |Average |Average latency of paxos propose round. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_cas_propose_p99 |No |cas propose p99 (microseconds) |Count |Average |p99 Latency of paxos propose round. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_col_update_time_delta_histogram |No |col update time delta average |Count |Average |Average column update time delta on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_col_update_time_delta_histogram_p99 |No |col update time delta p99 |Count |Average |p99 Column update time delta on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_compaction_bytes_written |No |compaction bytes written |Bytes |Total |Total number of bytes written by compaction since server [re]start. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_compression_metadata_off_heap_memory_used |No |compression metadata off-heap memory used |Bytes |Total |Off-heap memory used by compression metadata. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_compression_ratio |No |compression ratio |Percent |Average |Current compression ratio for all SSTables. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_coordinator_read_latency |No |coordinator read latency average (microseconds) |Count |Average |Average coordinator read latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_coordinator_read_latency_p99 |No |coordinator read latency p99 (microseconds) |Count |Average |p99 Coordinator read latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_coordinator_scan_latency |No |coordinator scan latency average (microseconds) |Count |Average |Average coordinator range scan latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_coordinator_scan_latency_p99 |No |coordinator scan latency p99 (microseconds) |Count |Average |p99 Coordinator range scan latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_dropped_mutations |No |dropped mutations (deprecated) |Count |Total |Number of dropped mutations on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_dropped_mutations2 |No |dropped mutations |Count |Total |Number of dropped mutations on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_estimated_column_count_histogram |No |estimated column count average |Count |Average |Estimated number of columns in average. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_estimated_column_count_histogram_p99 |No |estimated column count p99 |Count |Average |p99 Estimated number of columns. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_estimated_partition_count |No |estimated partition count |Count |Total |Approximate number of keys in table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_estimated_partition_size_histogram |No |estimated partition size average |Bytes |Average |Estimated partition size in average. |cassandra_datacenter, cassandra_node, quantile, table, keyspace |
|cassandra_table_estimated_partition_size_histogram_p99 |No |estimated partition size p99 |Bytes |Average |p99 Estimated partition size (in bytes). |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_index_summary_off_heap_memory_used |No |index summary off-heap memory used |Bytes |Total |Off-heap memory used by index summary. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_key_cache_hit_rate |No |key cache hit rate |Percent |Average |Key cache hit rate for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_live_disk_space_used |No |live disk space used |Bytes |Total |Disk space used by SSTables belonging to this table (in bytes). |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_live_scanned_histogram |No |live scanned average |Count |Average |Average live cells scanned in queries on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_live_scanned_histogram_p99 |No |live scanned p99 |Count |Average |p99 Live cells scanned in queries on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_live_sstable_count |No |live sstable count |Count |Total |Number of SSTables on disk for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_max_partition_size |No |max partition size |Bytes |Maximum |Size of the largest compacted partition (in bytes). |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_mean_partition_size |No |mean partition size |Bytes |Average |Size of the average compacted partition (in bytes). |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_memtable_columns_count |No |memtable columns count |Count |Total |Total number of columns present in the memtable. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_memtable_off_heap_size |No |memtable off heap size |Bytes |Total |Total amount of data stored in the memtable that resides off-heap, including column related overhead and partitions overwritten. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_memtable_on_heap_size |No |memtable on heap size |Bytes |Total |Total amount of data stored in the memtable that resides on-heap, including column related overhead and partitions overwritten. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_memtable_switch_count |No |memtable switch count |Count |Total |Number of times flush has resulted in the memtable being switched out. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_min_partition_size |No |min partition size |Bytes |Minimum |Size of the smallest compacted partition (in bytes). |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_pending_compactions |No |pending compactions (deprecated) |Count |Total |Estimate of number of pending compactions for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_pending_compactions2 |No |pending compactions |Count |Total |Estimate of number of pending compactions for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_pending_flushes |No |pending flushes (deprecated) |Count |Total |Estimated number of flush tasks pending for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_pending_flushes2 |No |pending flushes |Count |Total |Estimated number of flush tasks pending for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_percent_repaired |No |percent repaired |Percent |Average |Percent of table data that is repaired on disk. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_range_latency |No |range latency average (microseconds) |Count |Average |Average local range scan latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_range_latency_p99 |No |range latency p99 (microseconds) |Count |Average |p99 Local range scan latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_read_latency |No |read latency average (microseconds) |Count |Average |Average local read latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_read_latency_p99 |No |read latency p99 (microseconds) |Count |Average |p99 Local read latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_row_cache_hit |No |row cache hit |Count |Total |Number of table row cache hits. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_row_cache_hit_out_of_range |No |row cache hit out of range |Count |Total |Number of table row cache hits that do not satisfy the query filter, thus went to disk. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_row_cache_miss |No |row cache miss |Count |Total |Number of table row cache misses. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_speculative_retries |No |speculative retries |Count |Total |Number of times speculative retries were sent for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_sstables_per_read_histogram |No |sstables per read average |Count |Average |Average number of sstable data files accessed per single partition read. SSTables skipped due to Bloom Filters, min-max key or partition index lookup are not taken into account. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_sstables_per_read_histogram_p99 |No |sstables per read p99 |Count |Average |p99 Number of sstable data files accessed per single partition read. SSTables skipped due to Bloom Filters, min-max key or partition index lookup are not taken into account. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_tombstone_scanned_histogram |No |tombstone scanned average |Count |Average |Average tombstones scanned in queries on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_tombstone_scanned_histogram_p99 |No |tombstone scanned p99 |Count |Average |p99 Tombstones scanned in queries on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_total_disk_space_used |No |total disk space used (deprecated) |Bytes |Total |Total disk space used by SSTables belonging to this table, including obsolete ones waiting to be GC'd. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_total_disk_space_used2 |No |total disk space used |Bytes |Total |Total disk space used by SSTables belonging to this table, including obsolete ones waiting to be GC'd. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_view_lock_acquire_time |No |view lock acquire time average |Count |Average |Average time taken acquiring a partition lock for materialized view updates on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_view_lock_acquire_time_p99 |No |view lock acquire time p99 |Count |Average |p99 Time taken acquiring a partition lock for materialized view updates on this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_view_read_time |No |view read time average |Count |Average |Average time taken during the local read of a materialized view update. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_view_read_time_p99 |No |view read time p99 |Count |Average |p99 Time taken during the local read of a materialized view update. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_waiting_on_free_memtable_space |No |waiting on free memtable space average |Count |Average |Average time spent waiting for free memtable space, either on- or off-heap. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_waiting_on_free_memtable_space_p99 |No |waiting on free memtable space p99 |Count |Average |p99 Time spent waiting for free memtable space, either on- or off-heap. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_write_latency |No |write latency average (microseconds) |Count |Average |Average local write latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_table_write_latency_p99 |No |write latency p99 (microseconds) |Count |Average |p99 Local write latency for this table. |cassandra_datacenter, cassandra_node, table, keyspace |
|cassandra_thread_pools_active_tasks |No |active tasks |Count |Total |Number of tasks being actively worked on by this pool. |cassandra_datacenter, cassandra_node, pool_name, pool_type |
|cassandra_thread_pools_currently_blocked_tasks |No |currently blocked tasks (deprecated) |Count |Total |Number of tasks that are currently blocked due to queue saturation but on retry will become unblocked. |cassandra_datacenter, cassandra_node, pool_name, pool_type |
|cassandra_thread_pools_currently_blocked_tasks2 |No |currently blocked tasks |Count |Total |Number of tasks that are currently blocked due to queue saturation but on retry will become unblocked. |cassandra_datacenter, cassandra_node, pool_name, pool_type |
|cassandra_thread_pools_max_pool_size |No |max pool size |Count |Maximum |The maximum number of threads in this pool. |cassandra_datacenter, cassandra_node, pool_name, pool_type |
|cassandra_thread_pools_pending_tasks |No |pending tasks |Count |Total |Number of queued tasks queued up on this pool. |cassandra_datacenter, cassandra_node, pool_name, pool_type |
|cassandra_thread_pools_total_blocked_tasks |No |total blocked tasks |Count |Total |Number of tasks that were blocked due to queue saturation. |cassandra_datacenter, cassandra_node, pool_name, pool_type |
|cpu |No |CPU usage active |Percent |Average |CPU active usage rate |ClusterResourceName, DataCenterResourceName, Address, Kind, CPU |
|disk_utilization |Yes |disk utilization |Percent |Average |Disk utilization rate |ClusterResourceName, DataCenterResourceName, Address |
|diskio_merged_reads |No |disk I/O merged reads |Count |Total |disk I/O merged reads |ClusterResourceName, DataCenterResourceName, Address, Kind |
|diskio_merged_writes |No |disk I/O merged writes |Count |Total |disk I/O merged writes |ClusterResourceName, DataCenterResourceName, Address, Kind |
|diskio_read_bytes |No |disk I/O read bytes |Bytes |Total |disk I/O read bytes |ClusterResourceName, DataCenterResourceName, Address, Kind |
|diskio_read_time |No |disk I/O read time (milliseconds) |MilliSeconds |Total |disk I/O read time (milliseconds) |ClusterResourceName, DataCenterResourceName, Address, Kind |
|diskio_reads |No |disk I/O read counts |Count |Total |disk I/O read counts |ClusterResourceName, DataCenterResourceName, Address, Kind |
|diskio_write_bytes |No |disk I/O write bytes |Bytes |Total |disk I/O write bytes |ClusterResourceName, DataCenterResourceName, Address, Kind |
|diskio_write_time |No |disk I/O write time (milliseconds) |MilliSeconds |Total |disk I/O write time (milliseconds) |ClusterResourceName, DataCenterResourceName, Address, Kind |
|diskio_writes |No |disk I/O write counts |Count |Total |disk I/O write counts |ClusterResourceName, DataCenterResourceName, Address, Kind |
|ethtool_rx_bytes |No |network received bytes |Bytes |Total |network received bytes |ClusterResourceName, DataCenterResourceName, Address, Kind |
|ethtool_rx_packets |No |network received packets |Count |Total |network received packets |ClusterResourceName, DataCenterResourceName, Address, Kind |
|ethtool_tx_bytes |No |network transmitted bytes |Bytes |Total |network transmitted bytes |ClusterResourceName, DataCenterResourceName, Address, Kind |
|ethtool_tx_packets |No |network transmitted packets |Count |Total |network transmitted packets |ClusterResourceName, DataCenterResourceName, Address, Kind |
|percent_mem |Yes |memory utilization |Percent |Average |Memory utilization rate |ClusterResourceName, DataCenterResourceName, Address |

## Microsoft.DocumentDB/DatabaseAccounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AddRegion |Yes |Region Added |Count |Count |Region Added |Region |
|AutoscaleMaxThroughput |No |Autoscale Max Throughput |Count |Maximum |Autoscale Max Throughput |DatabaseName, CollectionName |
|AvailableStorage |No |(deprecated) Available Storage |Bytes |Total |"Available Storage"will be removed from Azure Monitor at the end of September 2023. Cosmos DB collection storage size is now unlimited. The only restriction is that the storage size for each logical partition key is 20GB. You can enable PartitionKeyStatistics in Diagnostic Log to know the storage consumption for top partition keys. For more info about Cosmos DB storage quota, please check this doc https://docs.microsoft.com/azure/cosmos-db/concepts-limits. After deprecation, the remaining alert rules still defined on the deprecated metric will be automatically disabled post the deprecation date. |CollectionName, DatabaseName, Region |
|CassandraConnectionClosures |No |Cassandra Connection Closures |Count |Total |Number of Cassandra connections that were closed, reported at a 1 minute granularity |APIType, Region, ClosureReason |
|CassandraConnectorAvgReplicationLatency |No |Cassandra Connector Average ReplicationLatency |MilliSeconds |Average |Cassandra Connector Average ReplicationLatency |No Dimensions |
|CassandraConnectorReplicationHealthStatus |No |Cassandra Connector Replication Health Status |Count |Count |Cassandra Connector Replication Health Status |NotStarted, ReplicationInProgress, Error |
|CassandraKeyspaceCreate |No |Cassandra Keyspace Created |Count |Count |Cassandra Keyspace Created |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|CassandraKeyspaceDelete |No |Cassandra Keyspace Deleted |Count |Count |Cassandra Keyspace Deleted |ResourceName, ApiKind, ApiKindResourceType, OperationType |
|CassandraKeyspaceThroughputUpdate |No |Cassandra Keyspace Throughput Updated |Count |Count |Cassandra Keyspace Throughput Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|CassandraKeyspaceUpdate |No |Cassandra Keyspace Updated |Count |Count |Cassandra Keyspace Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|CassandraRequestCharges |No |Cassandra Request Charges |Count |Total |RUs consumed for Cassandra requests made |APIType, DatabaseName, CollectionName, Region, OperationType, ResourceType |
|CassandraRequests |No |Cassandra Requests |Count |Count |Number of Cassandra requests made |APIType, DatabaseName, CollectionName, Region, OperationType, ResourceType, ErrorCode |
|CassandraTableCreate |No |Cassandra Table Created |Count |Count |Cassandra Table Created |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|CassandraTableDelete |No |Cassandra Table Deleted |Count |Count |Cassandra Table Deleted |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, OperationType |
|CassandraTableThroughputUpdate |No |Cassandra Table Throughput Updated |Count |Count |Cassandra Table Throughput Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|CassandraTableUpdate |No |Cassandra Table Updated |Count |Count |Cassandra Table Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|CreateAccount |Yes |Account Created |Count |Count |Account Created |No Dimensions |
|DataUsage |No |Data Usage |Bytes |Total |Total data usage reported at 5 minutes granularity |CollectionName, DatabaseName, Region |
|DedicatedGatewayAverageCPUUsage |No |DedicatedGatewayAverageCPUUsage |Percent |Average |Average CPU usage across dedicated gateway instances |Region, MetricType |
|DedicatedGatewayAverageMemoryUsage |No |DedicatedGatewayAverageMemoryUsage |Bytes |Average |Average memory usage across dedicated gateway instances, which is used for both routing requests and caching data |Region |
|DedicatedGatewayCPUUsage |No |DedicatedGatewayCPUUsage |Percent |Average |CPU usage across dedicated gateway instances |Region, ApplicationType |
|DedicatedGatewayMaximumCPUUsage |No |DedicatedGatewayMaximumCPUUsage |Percent |Average |Average Maximum CPU usage across dedicated gateway instances |Region, MetricType |
|DedicatedGatewayMemoryUsage |No |DedicatedGatewayMemoryUsage |Bytes |Average |Memory usage across dedicated gateway instances |Region, ApplicationType |
|DedicatedGatewayRequests |Yes |DedicatedGatewayRequests |Count |Count |Requests at the dedicated gateway |DatabaseName, CollectionName, CacheExercised, OperationName, Region, CacheHit |
|DeleteAccount |Yes |Account Deleted |Count |Count |Account Deleted |No Dimensions |
|DocumentCount |No |Document Count |Count |Total |Total document count reported at 5 minutes, 1 hour and 1 day granularity |CollectionName, DatabaseName, Region |
|DocumentQuota |No |Document Quota |Bytes |Total |Total storage quota reported at 5 minutes granularity |CollectionName, DatabaseName, Region |
|GremlinDatabaseCreate |No |Gremlin Database Created |Count |Count |Gremlin Database Created |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|GremlinDatabaseDelete |No |Gremlin Database Deleted |Count |Count |Gremlin Database Deleted |ResourceName, ApiKind, ApiKindResourceType, OperationType |
|GremlinDatabaseThroughputUpdate |No |Gremlin Database Throughput Updated |Count |Count |Gremlin Database Throughput Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|GremlinDatabaseUpdate |No |Gremlin Database Updated |Count |Count |Gremlin Database Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|GremlinGraphCreate |No |Gremlin Graph Created |Count |Count |Gremlin Graph Created |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|GremlinGraphDelete |No |Gremlin Graph Deleted |Count |Count |Gremlin Graph Deleted |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, OperationType |
|GremlinGraphThroughputUpdate |No |Gremlin Graph Throughput Updated |Count |Count |Gremlin Graph Throughput Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|GremlinGraphUpdate |No |Gremlin Graph Updated |Count |Count |Gremlin Graph Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|GremlinRequestCharges |No |Gremlin Request Charges |Count |Total |Request Units consumed for Gremlin requests made |APIType, DatabaseName, CollectionName, Region |
|GremlinRequests |No |Gremlin Requests |Count |Count |Number of Gremlin requests made |APIType, DatabaseName, CollectionName, Region, ErrorCode |
|IndexUsage |No |Index Usage |Bytes |Total |Total index usage reported at 5 minutes granularity |CollectionName, DatabaseName, Region |
|IntegratedCacheEvictedEntriesSize |No |IntegratedCacheEvictedEntriesSize |Bytes |Average |Size of the entries evicted from the integrated cache |Region |
|IntegratedCacheItemExpirationCount |No |IntegratedCacheItemExpirationCount |Count |Average |Number of items evicted from the integrated cache due to TTL expiration |Region, CacheEntryType |
|IntegratedCacheItemHitRate |No |IntegratedCacheItemHitRate |Percent |Average |Number of point reads that used the integrated cache divided by number of point reads routed through the dedicated gateway with eventual consistency |Region, CacheEntryType |
|IntegratedCacheQueryExpirationCount |No |IntegratedCacheQueryExpirationCount |Count |Average |Number of queries evicted from the integrated cache due to TTL expiration |Region, CacheEntryType |
|IntegratedCacheQueryHitRate |No |IntegratedCacheQueryHitRate |Percent |Average |Number of queries that used the integrated cache divided by number of queries routed through the dedicated gateway with eventual consistency |Region, CacheEntryType |
|MaterializedViewCatchupGapInMinutes |No |Materialized View Catchup Gap In Minutes |Count |Maximum |Maximum time difference in minutes between data in source container and data propagated to materialized view |Region, TargetContainerName, BuildType |
|MaterializedViewsBuilderAverageCPUUsage |No |Materialized Views Builder Average CPU Usage |Percent |Average |Average CPU usage across materialized view builder instances, which are used for populating data in materialized views |Region, MetricType |
|MaterializedViewsBuilderAverageMemoryUsage |No |Materialized Views Builder Average Memory Usage |Bytes |Average |Average memory usage across materialized view builder instances, which are used for populating data in materialized views |Region |
|MaterializedViewsBuilderMaximumCPUUsage |No |Materialized Views Builder Maximum CPU Usage |Percent |Average |Average Maximum CPU usage across materialized view builder instances, which are used for populating data in materialized views |Region, MetricType |
|MetadataRequests |No |Metadata Requests |Count |Count |Count of metadata requests. Cosmos DB maintains system metadata collection for each account, that allows you to enumerate collections, databases, etc, and their configurations, free of charge. |DatabaseName, CollectionName, Region, StatusCode, Role |
|MongoCollectionCreate |No |Mongo Collection Created |Count |Count |Mongo Collection Created |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|MongoCollectionDelete |No |Mongo Collection Deleted |Count |Count |Mongo Collection Deleted |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, OperationType |
|MongoCollectionThroughputUpdate |No |Mongo Collection Throughput Updated |Count |Count |Mongo Collection Throughput Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|MongoCollectionUpdate |No |Mongo Collection Updated |Count |Count |Mongo Collection Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|MongoDatabaseDelete |No |Mongo Database Deleted |Count |Count |Mongo Database Deleted |ResourceName, ApiKind, ApiKindResourceType, OperationType |
|MongoDatabaseThroughputUpdate |No |Mongo Database Throughput Updated |Count |Count |Mongo Database Throughput Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|MongoDBDatabaseCreate |No |Mongo Database Created |Count |Count |Mongo Database Created |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|MongoDBDatabaseUpdate |No |Mongo Database Updated |Count |Count |Mongo Database Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|MongoRequestCharge |Yes |Mongo Request Charge |Count |Total |Mongo Request Units Consumed |DatabaseName, CollectionName, Region, CommandName, ErrorCode, Status |
|MongoRequests |Yes |Mongo Requests |Count |Count |Number of Mongo Requests Made |DatabaseName, CollectionName, Region, CommandName, ErrorCode, Status |
|NormalizedRUConsumption |No |Normalized RU Consumption |Percent |Maximum |Max RU consumption percentage per minute |CollectionName, DatabaseName, Region, PartitionKeyRangeId, CollectionRid, PhysicalPartitionId |
|OfflineRegion |No |Region Offlined |Count |Count |Region Offlined |Region, StatusCode, Role, OperationName |
|OnlineRegion |No |Region Onlined |Count |Count |Region Onlined |Region, StatusCode, Role, OperationName |
|PhysicalPartitionSizeInfo |No |Physical Partition Size |Bytes |Maximum |Physical Partition Size in bytes |CollectionName, DatabaseName, PhysicalPartitionId, OfferOwnerRid, Region |
|PhysicalPartitionThroughputInfo |No |Physical Partition Throughput |Count |Maximum |Physical Partition Throughput |CollectionName, DatabaseName, PhysicalPartitionId, OfferOwnerRid, Region |
|ProvisionedThroughput |No |Provisioned Throughput |Count |Maximum |Provisioned Throughput |DatabaseName, CollectionName, AllowWrite |
|RegionFailover |Yes |Region Failed Over |Count |Count |Region Failed Over |No Dimensions |
|RemoveRegion |Yes |Region Removed |Count |Count |Region Removed |Region |
|ReplicationLatency |Yes |P99 Replication Latency |MilliSeconds |Average |P99 Replication Latency across source and target regions for geo-enabled account |SourceRegion, TargetRegion |
|ServerSideLatency |No |Server Side Latency |MilliSeconds |Average |Server Side Latency |DatabaseName, CollectionName, Region, ConnectionMode, OperationType, PublicAPIType |
|ServerSideLatencyDirect |No |Server Side Latency Direct |MilliSeconds |Average |Server Side Latency in Direct Connection Mode |DatabaseName, CollectionName, Region, ConnectionMode, OperationType, PublicAPIType, APIType |
|ServerSideLatencyGateway |No |Server Side Latency Gateway |MilliSeconds |Average |Server Side Latency in Gateway Connection Mode |DatabaseName, CollectionName, Region, ConnectionMode, OperationType, PublicAPIType, APIType |
|ServiceAvailability |No |Service Availability |Percent |Average |Account requests availability at one hour, day or month granularity |No Dimensions |
|SqlContainerCreate |No |Sql Container Created |Count |Count |Sql Container Created |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|SqlContainerDelete |No |Sql Container Deleted |Count |Count |Sql Container Deleted |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, OperationType |
|SqlContainerThroughputUpdate |No |Sql Container Throughput Updated |Count |Count |Sql Container Throughput Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|SqlContainerUpdate |No |Sql Container Updated |Count |Count |Sql Container Updated |ResourceName, ChildResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|SqlDatabaseCreate |No |Sql Database Created |Count |Count |Sql Database Created |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|SqlDatabaseDelete |No |Sql Database Deleted |Count |Count |Sql Database Deleted |ResourceName, ApiKind, ApiKindResourceType, OperationType |
|SqlDatabaseThroughputUpdate |No |Sql Database Throughput Updated |Count |Count |Sql Database Throughput Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|SqlDatabaseUpdate |No |Sql Database Updated |Count |Count |Sql Database Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|TableTableCreate |No |AzureTable Table Created |Count |Count |AzureTable Table Created |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|TableTableDelete |No |AzureTable Table Deleted |Count |Count |AzureTable Table Deleted |ResourceName, ApiKind, ApiKindResourceType, OperationType |
|TableTableThroughputUpdate |No |AzureTable Table Throughput Updated |Count |Count |AzureTable Table Throughput Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest |
|TableTableUpdate |No |AzureTable Table Updated |Count |Count |AzureTable Table Updated |ResourceName, ApiKind, ApiKindResourceType, IsThroughputRequest, OperationType |
|TotalRequests |Yes |Total Requests |Count |Count |Number of requests made |DatabaseName, CollectionName, Region, StatusCode, OperationType, Status, CapacityType |
|TotalRequestsPreview |No |Total Requests (Preview) |Count |Count |Number of SQL requests |DatabaseName, CollectionName, Region, StatusCode, OperationType, Status, IsExternal |
|TotalRequestUnits |Yes |Total Request Units |Count |Total |SQL Request Units consumed |DatabaseName, CollectionName, Region, StatusCode, OperationType, Status, CapacityType |
|TotalRequestUnitsPreview |No |Total Request Units (Preview) |Count |Total |Request Units consumed with CapacityType |DatabaseName, CollectionName, Region, StatusCode, OperationType, Status, CapacityType |
|UpdateAccountKeys |Yes |Account Keys Updated |Count |Count |Account Keys Updated |KeyType |
|UpdateAccountNetworkSettings |Yes |Account Network Settings Updated |Count |Count |Account Network Settings Updated |No Dimensions |
|UpdateAccountReplicationSettings |Yes |Account Replication Settings Updated |Count |Count |Account Replication Settings Updated |No Dimensions |
|UpdateDiagnosticsSettings |No |Account Diagnostic Settings Updated |Count |Count |Account Diagnostic Settings Updated |DiagnosticSettingsName, ResourceGroupName |

## Microsoft.DocumentDB/mongoClusters  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CommittedMemoryPercent |No |Committed Memory percent |Percent |Average |Percentage of Commit Memory Limit allocated by applications on node |ServerName |
|CpuPercent |No |CPU percent |Percent |Average |Percent CPU utilization on node |ServerName |
|IOPS |Yes |IOPS |Count |Average |Disk IO operations per second on node |ServerName |
|MemoryPercent |No |Memory percent |Percent |Average |Percent memory utilization on node |ServerName |
|StoragePercent |No |Storage percent |Percent |Average |Percent of available storage used on node |ServerName |
|StorageUsed |No |Storage used |Bytes |Average |Quantity of available storage used on node |ServerName |

## microsoft.edgezones/edgezones  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DiskStorageIOPSUsage |No |Disk IOPS |CountPerSecond |Average |The total IOPS generated by Managed Disks in Azure Edge Zone Enterprise site. |No Dimensions |
|DiskStorageUsedSizeUsage |Yes |Disk Usage Percentage |Percent |Average |The utilization of the Managed Disk capacity in Azure Edge Zone Enterprise site. |No Dimensions |
|RegionSiteConnectivity |Yes |Region Site Connectivity |Count |Average |The status of an Edge Zone Enterprise link connection to its Azure region |No Dimensions |
|TotalDiskStorageSizeCapacity |Yes |Total Disk Capacity |Bytes |Average |The total capacity of Managed Disk in Azure Edge Zone Enterprise site. |No Dimensions |
|TotalVcoreCapacity |Yes |Total VCore Capacity |Count |Average |The total capacity of the General-Purpose Compute vcore in Edge Zone Enterprise site.  |No Dimensions |
|VcoresUsage |Yes |Vcore Usage Percentage |Percent |Average |The utilization of the General-Purpose Compute vcores in Edge Zone Enterprise site  |No Dimensions |

## Microsoft.EventGrid/domains  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this topic. |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName, DeadLetterReason |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName, Error, ErrorType |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |MilliSeconds |Average |Destination processing duration in milliseconds |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName, DropReason |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |Topic, EventSubscriptionName, DomainEventSubscriptionName |
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |Topic, ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |Topic |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |MilliSeconds |Total |Publish success latency in milliseconds |No Dimensions |

## Microsoft.EventGrid/eventSubscriptions  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |No Dimensions |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |Milliseconds |Average |Destination processing duration in milliseconds |No Dimensions |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |No Dimensions |

## Microsoft.EventGrid/extensionTopics  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |Milliseconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this topic |No Dimensions |

## Microsoft.EventGrid/partnerNamespaces  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this partner namespace |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this partner namespace |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |MilliSeconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the partner topics |No Dimensions |

## Microsoft.EventGrid/partnerTopics  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this partner topic. |EventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason, EventSubscriptionName |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType, EventSubscriptionName |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |EventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |MilliSeconds |Average |Destination processing duration in milliseconds |EventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason, EventSubscriptionName |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |EventSubscriptionName |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this partner topic |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this partner topic |No Dimensions |

## Microsoft.EventGrid/systemTopics  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this topic. |EventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason, EventSubscriptionName |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType, EventSubscriptionName |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |EventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |Milliseconds |Average |Destination processing duration in milliseconds |EventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason, EventSubscriptionName |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |EventSubscriptionName |
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |Milliseconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this topic |No Dimensions |

## Microsoft.EventGrid/topics  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount |Yes |Advanced Filter Evaluations |Count |Total |Total advanced filters evaluated across event subscriptions for this topic. |EventSubscriptionName |
|DeadLetteredCount |Yes |Dead Lettered Events |Count |Total |Total dead lettered events matching to this event subscription |DeadLetterReason, EventSubscriptionName |
|DeliveryAttemptFailCount |No |Delivery Failed Events |Count |Total |Total events failed to deliver to this event subscription |Error, ErrorType, EventSubscriptionName |
|DeliverySuccessCount |Yes |Delivered Events |Count |Total |Total events delivered to this event subscription |EventSubscriptionName |
|DestinationProcessingDurationInMs |No |Destination Processing Duration |MilliSeconds |Average |Destination processing duration in milliseconds |EventSubscriptionName |
|DroppedEventCount |Yes |Dropped Events |Count |Total |Total dropped events matching to this event subscription |DropReason, EventSubscriptionName |
|MatchedEventCount |Yes |Matched Events |Count |Total |Total events matched to this event subscription |EventSubscriptionName |
|PublishFailCount |Yes |Publish Failed Events |Count |Total |Total events failed to publish to this topic |ErrorType, Error |
|PublishSuccessCount |Yes |Published Events |Count |Total |Total events published to this topic |No Dimensions |
|PublishSuccessLatencyInMs |Yes |Publish Success Latency |MilliSeconds |Total |Publish success latency in milliseconds |No Dimensions |
|UnmatchedEventCount |Yes |Unmatched Events |Count |Total |Total events not matching any of the event subscriptions for this topic |No Dimensions |

## Microsoft.EventHub/clusters  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections |No |ActiveConnections |Count |Average |Total Active Connections for Microsoft.EventHub. |No Dimensions |
|AvailableMemory |No |Available Memory |Percent |Maximum |Available memory for the Event Hub Cluster as a percentage of total memory. |Role |
|CaptureBacklog |No |Capture Backlog. |Count |Total |Capture Backlog for Microsoft.EventHub. |No Dimensions |
|CapturedBytes |No |Captured Bytes. |Bytes |Total |Captured Bytes for Microsoft.EventHub. |No Dimensions |
|CapturedMessages |No |Captured Messages. |Count |Total |Captured Messages for Microsoft.EventHub. |No Dimensions |
|ConnectionsClosed |No |Connections Closed. |Count |Average |Connections Closed for Microsoft.EventHub. |No Dimensions |
|ConnectionsOpened |No |Connections Opened. |Count |Average |Connections Opened for Microsoft.EventHub. |No Dimensions |
|CPU |No |CPU |Percent |Maximum |CPU utilization for the Event Hub Cluster as a percentage |Role |
|IncomingBytes |Yes |Incoming Bytes. |Bytes |Total |Incoming Bytes for Microsoft.EventHub. |No Dimensions |
|IncomingMessages |Yes |Incoming Messages |Count |Total |Incoming Messages for Microsoft.EventHub. |No Dimensions |
|IncomingRequests |Yes |Incoming Requests |Count |Total |Incoming Requests for Microsoft.EventHub. |No Dimensions |
|OutgoingBytes |Yes |Outgoing Bytes. |Bytes |Total |Outgoing Bytes for Microsoft.EventHub. |No Dimensions |
|OutgoingMessages |Yes |Outgoing Messages |Count |Total |Outgoing Messages for Microsoft.EventHub. |No Dimensions |
|QuotaExceededErrors |No |Quota Exceeded Errors. |Count |Total |Quota Exceeded Errors for Microsoft.EventHub. |OperationResult |
|ServerErrors |No |Server Errors. |Count |Total |Server Errors for Microsoft.EventHub. |OperationResult |
|Size |No |Size |Bytes |Average |Size of an EventHub in Bytes. |Role |
|SuccessfulRequests |No |Successful Requests |Count |Total |Successful Requests for Microsoft.EventHub. |OperationResult |
|ThrottledRequests |No |Throttled Requests. |Count |Total |Throttled Requests for Microsoft.EventHub. |OperationResult |
|UserErrors |No |User Errors. |Count |Total |User Errors for Microsoft.EventHub. |OperationResult |

## Microsoft.EventHub/Namespaces  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections |No |ActiveConnections |Count |Maximum |Total Active Connections for Microsoft.EventHub. |No Dimensions |
|CaptureBacklog |No |Capture Backlog. |Count |Total |Capture Backlog for Microsoft.EventHub. |EntityName |
|CapturedBytes |No |Captured Bytes. |Bytes |Total |Captured Bytes for Microsoft.EventHub. |EntityName |
|CapturedMessages |No |Captured Messages. |Count |Total |Captured Messages for Microsoft.EventHub. |EntityName |
|ConnectionsClosed |No |Connections Closed. |Count |Maximum |Connections Closed for Microsoft.EventHub. |EntityName |
|ConnectionsOpened |No |Connections Opened. |Count |Maximum |Connections Opened for Microsoft.EventHub. |EntityName |
|EHABL |Yes |Archive backlog messages (Deprecated) |Count |Total |Event Hub archive messages in backlog for a namespace (Deprecated) |No Dimensions |
|EHAMBS |Yes |Archive message throughput (Deprecated) |Bytes |Total |Event Hub archived message throughput in a namespace (Deprecated) |No Dimensions |
|EHAMSGS |Yes |Archive messages (Deprecated) |Count |Total |Event Hub archived messages in a namespace (Deprecated) |No Dimensions |
|EHINBYTES |Yes |Incoming bytes (Deprecated) |Bytes |Total |Event Hub incoming message throughput for a namespace (Deprecated) |No Dimensions |
|EHINMBS |Yes |Incoming bytes (obsolete) (Deprecated) |Bytes |Total |Event Hub incoming message throughput for a namespace. This metric is deprecated. Please use Incoming bytes metric instead (Deprecated) |No Dimensions |
|EHINMSGS |Yes |Incoming Messages (Deprecated) |Count |Total |Total incoming messages for a namespace (Deprecated) |No Dimensions |
|EHOUTBYTES |Yes |Outgoing bytes (Deprecated) |Bytes |Total |Event Hub outgoing message throughput for a namespace (Deprecated) |No Dimensions |
|EHOUTMBS |Yes |Outgoing bytes (obsolete) (Deprecated) |Bytes |Total |Event Hub outgoing message throughput for a namespace. This metric is deprecated. Please use Outgoing bytes metric instead (Deprecated) |No Dimensions |
|EHOUTMSGS |Yes |Outgoing Messages (Deprecated) |Count |Total |Total outgoing messages for a namespace (Deprecated) |No Dimensions |
|FAILREQ |Yes |Failed Requests (Deprecated) |Count |Total |Total failed requests for a namespace (Deprecated) |No Dimensions |
|IncomingBytes |Yes |Incoming Bytes. |Bytes |Total |Incoming Bytes for Microsoft.EventHub. |EntityName |
|IncomingMessages |Yes |Incoming Messages |Count |Total |Incoming Messages for Microsoft.EventHub. |EntityName |
|IncomingRequests |Yes |Incoming Requests |Count |Total |Incoming Requests for Microsoft.EventHub. |EntityName |
|INMSGS |Yes |Incoming Messages (obsolete) (Deprecated) |Count |Total |Total incoming messages for a namespace. This metric is deprecated. Please use Incoming Messages metric instead (Deprecated) |No Dimensions |
|INREQS |Yes |Incoming Requests (Deprecated) |Count |Total |Total incoming send requests for a namespace (Deprecated) |No Dimensions |
|INTERR |Yes |Internal Server Errors (Deprecated) |Count |Total |Total internal server errors for a namespace (Deprecated) |No Dimensions |
|MISCERR |Yes |Other Errors (Deprecated) |Count |Total |Total failed requests for a namespace (Deprecated) |No Dimensions |
|NamespaceCpuUsage |No |CPU |Percent |Maximum |CPU usage metric for Premium SKU namespaces. |Replica |
|NamespaceMemoryUsage |No |Memory Usage |Percent |Maximum |Memory usage metric for Premium SKU namespaces. |Replica |
|OutgoingBytes |Yes |Outgoing Bytes. |Bytes |Total |Outgoing Bytes for Microsoft.EventHub. |EntityName |
|OutgoingMessages |Yes |Outgoing Messages |Count |Total |Outgoing Messages for Microsoft.EventHub. |EntityName |
|OUTMSGS |Yes |Outgoing Messages (obsolete) (Deprecated) |Count |Total |Total outgoing messages for a namespace. This metric is deprecated. Please use Outgoing Messages metric instead (Deprecated) |No Dimensions |
|QuotaExceededErrors |No |Quota Exceeded Errors. |Count |Total |Quota Exceeded Errors for Microsoft.EventHub. |EntityName, OperationResult |
|ServerErrors |No |Server Errors. |Count |Total |Server Errors for Microsoft.EventHub. |EntityName, OperationResult |
|Size |No |Size |Bytes |Average |Size of an EventHub in Bytes. |EntityName |
|SuccessfulRequests |No |Successful Requests |Count |Total |Successful Requests for Microsoft.EventHub. |EntityName, OperationResult |
|SUCCREQ |Yes |Successful Requests (Deprecated) |Count |Total |Total successful requests for a namespace (Deprecated) |No Dimensions |
|SVRBSY |Yes |Server Busy Errors (Deprecated) |Count |Total |Total server busy errors for a namespace (Deprecated) |No Dimensions |
|ThrottledRequests |No |Throttled Requests. |Count |Total |Throttled Requests for Microsoft.EventHub. |EntityName, OperationResult |
|UserErrors |No |User Errors. |Count |Total |User Errors for Microsoft.EventHub. |EntityName, OperationResult |

## Microsoft.HDInsight/clusters  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CategorizedGatewayRequests |Yes |Categorized Gateway Requests |Count |Total |Number of gateway requests by categories (1xx/2xx/3xx/4xx/5xx) |HttpStatus |
|GatewayRequests |Yes |Gateway Requests |Count |Total |Number of gateway requests |HttpStatus |
|KafkaRestProxy.ConsumerRequest.m1_delta |Yes |REST proxy Consumer RequestThroughput |CountPerSecond |Total |Number of consumer requests to Kafka REST proxy |Machine, Topic |
|KafkaRestProxy.ConsumerRequestFail.m1_delta |Yes |REST proxy Consumer Unsuccessful Requests |CountPerSecond |Total |Consumer request exceptions |Machine, Topic |
|KafkaRestProxy.ConsumerRequestTime.p95 |Yes |REST proxy Consumer RequestLatency |Milliseconds |Average |Message latency in a consumer request through Kafka REST proxy |Machine, Topic |
|KafkaRestProxy.ConsumerRequestWaitingInQueueTime.p95 |Yes |REST proxy Consumer Request Backlog |Milliseconds |Average |Consumer REST proxy queue length |Machine, Topic |
|KafkaRestProxy.MessagesIn.m1_delta |Yes |REST proxy Producer MessageThroughput |CountPerSecond |Total |Number of producer messages through Kafka REST proxy |Machine, Topic |
|KafkaRestProxy.MessagesOut.m1_delta |Yes |REST proxy Consumer MessageThroughput |CountPerSecond |Total |Number of consumer messages through Kafka REST proxy |Machine, Topic |
|KafkaRestProxy.OpenConnections |Yes |REST proxy ConcurrentConnections |Count |Total |Number of concurrent connections through Kafka REST proxy |Machine, Topic |
|KafkaRestProxy.ProducerRequest.m1_delta |Yes |REST proxy Producer RequestThroughput |CountPerSecond |Total |Number of producer requests to Kafka REST proxy |Machine, Topic |
|KafkaRestProxy.ProducerRequestFail.m1_delta |Yes |REST proxy Producer Unsuccessful Requests |CountPerSecond |Total |Producer request exceptions |Machine, Topic |
|KafkaRestProxy.ProducerRequestTime.p95 |Yes |REST proxy Producer RequestLatency |Milliseconds |Average |Message latency in a producer request through Kafka REST proxy |Machine, Topic |
|KafkaRestProxy.ProducerRequestWaitingInQueueTime.p95 |Yes |REST proxy Producer Request Backlog |Milliseconds |Average |Producer REST proxy queue length |Machine, Topic |
|NumActiveWorkers |Yes |Number of Active Workers |Count |Maximum |Number of Active Workers |MetricName |
|PendingCPU |Yes |Pending CPU |Count |Maximum |Pending CPU Requests in YARN |No Dimensions |
|PendingMemory |Yes |Pending Memory |Count |Maximum |Pending Memory Requests in YARN |No Dimensions |

## Microsoft.HealthcareApis/services  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The availability rate of the service. |No Dimensions |
|CosmosDbCollectionSize |Yes |Cosmos DB Collection Size |Bytes |Total |The size of the backing Cosmos DB collection, in bytes. |No Dimensions |
|CosmosDbIndexSize |Yes |Cosmos DB Index Size |Bytes |Total |The size of the backing Cosmos DB collection's index, in bytes. |No Dimensions |
|CosmosDbRequestCharge |Yes |Cosmos DB RU usage |Count |Total |The RU usage of requests to the service's backing Cosmos DB. |Operation, ResourceType |
|CosmosDbRequests |Yes |Service Cosmos DB requests |Count |Sum |The total number of requests made to a service's backing Cosmos DB. |Operation, ResourceType |
|CosmosDbThrottleRate |Yes |Service Cosmos DB throttle rate |Count |Sum |The total number of 429 responses from a service's backing Cosmos DB. |Operation, ResourceType |
|IoTConnectorDeviceEvent |Yes |Number of Incoming Messages |Count |Sum |The total number of messages received by the Azure IoT Connector for FHIR prior to any normalization. |Operation, ConnectorName |
|IoTConnectorDeviceEventProcessingLatencyMs |Yes |Average Normalize Stage Latency |Milliseconds |Average |The average time between an event's ingestion time and the time the event is processed for normalization. |Operation, ConnectorName |
|IoTConnectorMeasurement |Yes |Number of Measurements |Count |Sum |The number of normalized value readings received by the FHIR conversion stage of the Azure IoT Connector for FHIR. |Operation, ConnectorName |
|IoTConnectorMeasurementGroup |Yes |Number of Message Groups |Count |Sum |The total number of unique groupings of measurements across type, device, patient, and configured time period generated by the FHIR conversion stage. |Operation, ConnectorName |
|IoTConnectorMeasurementIngestionLatencyMs |Yes |Average Group Stage Latency |Milliseconds |Average |The time period between when the IoT Connector received the device data and when the data is processed by the FHIR conversion stage. |Operation, ConnectorName |
|IoTConnectorNormalizedEvent |Yes |Number of Normalized Messages |Count |Sum |The total number of mapped normalized values outputted from the normalization stage of the the Azure IoT Connector for FHIR. |Operation, ConnectorName |
|IoTConnectorTotalErrors |Yes |Total Error Count |Count |Sum |The total number of errors logged by the Azure IoT Connector for FHIR |Name, Operation, ErrorType, ErrorSeverity, ConnectorName |
|TotalErrors |Yes |Total Errors |Count |Sum |The total number of internal server errors encountered by the service. |Protocol, StatusCode, StatusCodeClass, StatusCodeText |
|TotalLatency |Yes |Total Latency |Milliseconds |Average |The response latency of the service. |Protocol |
|TotalRequests |Yes |Total Requests |Count |Sum |The total number of requests received by the service. |Protocol |

## Microsoft.HealthcareApis/workspaces/analyticsconnectors  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AnalyticsConnectorHealthStatus |Yes |Analytics Connector Health Status |Count |Sum |The health status of analytics connector |Operation, Component |
|AnalyticsConnectorResourceLatency |Yes |Analytics Connector Process Latency |Milliseconds |Average |The response latency of the service. |No Dimensions |
|AnalyticsConnectorSuccessfulDataSize |Yes |Analytics Connector Successful Data Size |Count |Sum |The size of data successfully processed by the analytics connector |No Dimensions |
|AnalyticsConnectorSuccessfulResourceCount |Yes |Analytics Connector Successful Resource Count |Count |Sum |The amount of data successfully processed by the analytics connector |No Dimensions |
|AnalyticsConnectorTotalError |Yes |Analytics Connector Total Error Count |Count |Sum |The total number of errors logged by the analytics connector |ErrorType, Operation |

## Microsoft.HealthcareApis/workspaces/fhirservices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The availability rate of the service. |No Dimensions |
|TotalDataSize |Yes |Total Data Size |Bytes |Total |Total size of the data in the backing database, in bytes. |No Dimensions |
|TotalErrors |Yes |Total Errors |Count |Sum |The total number of internal server errors encountered by the service. |Protocol, StatusCode, StatusCodeClass, StatusCodeText |
|TotalLatency |Yes |Total Latency |Milliseconds |Average |The response latency of the service. |Protocol |
|TotalRequests |Yes |Total Requests |Count |Sum |The total number of requests received by the service. |Protocol |

## Microsoft.HealthcareApis/workspaces/iotconnectors  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeviceEvent |Yes |Number of Incoming Messages |Count |Sum |The total number of messages received by the MedTech service prior to any normalization |Operation, ResourceName |
|DeviceEventProcessingLatencyMs |Yes |Average Normalize Stage Latency |Milliseconds |Average |The average time between an event's ingestion time and the time the event is processed for normalization. |Operation, ResourceName |
|DroppedEvent |Yes |Number of Dropped Events |Count |Sum |The number of input device events with no normalized events |Operation, ResourceName |
|FhirResourceSaved |Yes |Number of FHIR resources saved |Count |Sum |The total number of FHIR resources saved by the MedTech service |Operation, ResourceName, Name |
|IotConnectorStatus |Yes |MedTech Service Health Status |Percent |Average |Health checks which indicate the overall health of the MedTech service |Operation, ResourceName, HealthCheckName |
|Measurement |Yes |Number of Measurements |Count |Sum |The number of normalized value readings received by the FHIR conversion stage of the MedTech service |Operation, ResourceName |
|MeasurementGroup |Yes |Number of Message Groups |Count |Sum |The total number of unique groupings of measurements across type, device, patient, and configured time period generated by the FHIR conversion stage. |Operation, ResourceName |
|MeasurementIngestionLatencyMs |Yes |Average Group Stage Latency |Milliseconds |Average |The time period between when the MedTech service received the device data and when the data is processed by the FHIR conversion stage. |Operation, ResourceName |
|NormalizedEvent |Yes |Number of Normalized Messages |Count |Sum |The total number of mapped normalized values outputted from the normalization stage of the MedTech service |Operation, ResourceName |
|TotalErrors |Yes |Total Error Count |Count |Sum |The total number of errors logged by the MedTech service |Name, Operation, ErrorType, ErrorSeverity, ResourceName |

## Microsoft.HybridContainerService/provisionedClusters  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|capacity_cpu_cores |Yes |Total number of cpu cores in a provisioned cluster |Count |Average |Total number of cpu cores in a provisioned cluster |No Dimensions |

## microsoft.hybridnetwork/networkfunctions  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|HyperVVirtualProcessorUtilization |Yes |Average CPU Utilization |Percent |Average |Total average percentage of virtual CPU utilization at one minute interval. The total number of virtual CPU is based on user configured value in SKU definition. Further filter can be applied based on RoleName defined in SKU. |InstanceName |

## microsoft.hybridnetwork/virtualnetworkfunctions  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|HyperVVirtualProcessorUtilization |Yes |Average CPU Utilization |Percent |Average |Total average percentage of virtual CPU utilization at one minute interval. The total number of virtual CPU is based on user configured value in SKU definition. Further filter can be applied based on RoleName defined in SKU. |InstanceName |

## microsoft.insights/autoscalesettings  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|MetricThreshold |Yes |Metric Threshold |Count |Average |The configured autoscale threshold when autoscale ran. |MetricTriggerRule |
|ObservedCapacity |Yes |Observed Capacity |Count |Average |The capacity reported to autoscale when it executed. |No Dimensions |
|ObservedMetricValue |Yes |Observed Metric Value |Count |Average |The value computed by autoscale when executed |MetricTriggerSource |
|ScaleActionsInitiated |Yes |Scale Actions Initiated |Count |Total |The direction of the scale operation. |ScaleDirection |

## microsoft.insights/components  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|availabilityResults/availabilityPercentage |Yes |Availability |Percent |Average |Percentage of successfully completed availability tests |availabilityResult/name, availabilityResult/location |
|availabilityResults/count |No |Availability tests |Count |Count |Count of availability tests |availabilityResult/name, availabilityResult/location, availabilityResult/success |
|availabilityResults/duration |Yes |Availability test duration |MilliSeconds |Average |Availability test duration |availabilityResult/name, availabilityResult/location, availabilityResult/success |
|browserTimings/networkDuration |Yes |Page load network connect time |MilliSeconds |Average |Time between user request and network connection. Includes DNS lookup and transport connection. |No Dimensions |
|browserTimings/processingDuration |Yes |Client processing time |MilliSeconds |Average |Time between receiving the last byte of a document until the DOM is loaded. Async requests may still be processing. |No Dimensions |
|browserTimings/receiveDuration |Yes |Receiving response time |MilliSeconds |Average |Time between the first and last bytes, or until disconnection. |No Dimensions |
|browserTimings/sendDuration |Yes |Send request time |MilliSeconds |Average |Time between network connection and receiving the first byte. |No Dimensions |
|browserTimings/totalDuration |Yes |Browser page load time |MilliSeconds |Average |Time from user request until DOM, stylesheets, scripts and images are loaded. |No Dimensions |
|dependencies/count |No |Dependency calls |Count |Count |Count of calls made by the application to external resources. |dependency/type, dependency/performanceBucket, dependency/success, dependency/target, dependency/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName |
|dependencies/duration |Yes |Dependency duration |MilliSeconds |Average |Duration of calls made by the application to external resources. |dependency/type, dependency/performanceBucket, dependency/success, dependency/target, dependency/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName |
|dependencies/failed |No |Dependency call failures |Count |Count |Count of failed dependency calls made by the application to external resources. |dependency/type, dependency/performanceBucket, dependency/success, dependency/target, dependency/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName |
|exceptions/browser |No |Browser exceptions |Count |Count |Count of uncaught exceptions thrown in the browser. |client/isServer, cloud/roleName |
|exceptions/count |Yes |Exceptions |Count |Count |Combined count of all uncaught exceptions. |cloud/roleName, cloud/roleInstance, client/type |
|exceptions/server |No |Server exceptions |Count |Count |Count of uncaught exceptions thrown in the server application. |client/isServer, cloud/roleName, cloud/roleInstance |
|pageViews/count |Yes |Page views |Count |Count |Count of page views. |operation/synthetic, cloud/roleName |
|pageViews/duration |Yes |Page view load time |MilliSeconds |Average |Page view load time |operation/synthetic, cloud/roleName |
|performanceCounters/exceptionsPerSecond |Yes |Exception rate |CountPerSecond |Average |Count of handled and unhandled exceptions reported to windows, including .NET exceptions and unmanaged exceptions that are converted into .NET exceptions. |cloud/roleInstance |
|performanceCounters/memoryAvailableBytes |Yes |Available memory |Bytes |Average |Physical memory immediately available for allocation to a process or for system use. |cloud/roleInstance |
|performanceCounters/processCpuPercentage |Yes |Process CPU |Percent |Average |The percentage of elapsed time that all process threads used the processor to execute instructions. This can vary between 0 to 100. This metric indicates the performance of w3wp process alone. |cloud/roleInstance |
|performanceCounters/processIOBytesPerSecond |Yes |Process IO rate |BytesPerSecond |Average |Total bytes per second read and written to files, network and devices. |cloud/roleInstance |
|performanceCounters/processorCpuPercentage |Yes |Processor time |Percent |Average |The percentage of time that the processor spends in non-idle threads. |cloud/roleInstance |
|performanceCounters/processPrivateBytes |Yes |Process private bytes |Bytes |Average |Memory exclusively assigned to the monitored application's processes. |cloud/roleInstance |
|performanceCounters/requestExecutionTime |Yes |HTTP request execution time |MilliSeconds |Average |Execution time of the most recent request. |cloud/roleInstance |
|performanceCounters/requestsInQueue |Yes |HTTP requests in application queue |Count |Average |Length of the application request queue. |cloud/roleInstance |
|performanceCounters/requestsPerSecond |Yes |HTTP request rate |CountPerSecond |Average |Rate of all requests to the application per second from ASP.NET. |cloud/roleInstance |
|requests/count |No |Server requests |Count |Count |Count of HTTP requests completed. |request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName |
|requests/duration |Yes |Server response time |MilliSeconds |Average |Time between receiving an HTTP request and finishing sending the response. |request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName |
|requests/failed |No |Failed requests |Count |Count |Count of HTTP requests marked as failed. In most cases these are requests with a response code >= 400 and not equal to 401. |request/performanceBucket, request/resultCode, request/success, operation/synthetic, cloud/roleInstance, cloud/roleName |
|requests/rate |No |Server request rate |CountPerSecond |Average |Rate of server requests per second |request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName |
|traces/count |Yes |Traces |Count |Count |Trace document count |trace/severityLevel, operation/synthetic, cloud/roleName, cloud/roleInstance |

## Microsoft.IoTCentral/IoTApps  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|c2d.commands.failure |Yes |Failed command invocations |Count |Total |The count of all failed command requests initiated from IoT Central |No Dimensions |
|c2d.commands.requestSize |Yes |Request size of command invocations |Bytes |Total |Request size of all command requests initiated from IoT Central |No Dimensions |
|c2d.commands.responseSize |Yes |Response size of command invocations |Bytes |Total |Response size of all command responses initiated from IoT Central |No Dimensions |
|c2d.commands.success |Yes |Successful command invocations |Count |Total |The count of all successful command requests initiated from IoT Central |No Dimensions |
|c2d.property.read.failure |Yes |Failed Device Property Reads from IoT Central |Count |Total |The count of all failed property reads initiated from IoT Central |No Dimensions |
|c2d.property.read.success |Yes |Successful Device Property Reads from IoT Central |Count |Total |The count of all successful property reads initiated from IoT Central |No Dimensions |
|c2d.property.update.failure |Yes |Failed Device Property Updates from IoT Central |Count |Total |The count of all failed property updates initiated from IoT Central |No Dimensions |
|c2d.property.update.success |Yes |Successful Device Property Updates from IoT Central |Count |Total |The count of all successful property updates initiated from IoT Central |No Dimensions |
|connectedDeviceCount |No |Total Connected Devices |Count |Average |Number of devices connected to IoT Central |No Dimensions |
|d2c.property.read.failure |Yes |Failed Device Property Reads from Devices |Count |Total |The count of all failed property reads initiated from devices |No Dimensions |
|d2c.property.read.success |Yes |Successful Device Property Reads from Devices |Count |Total |The count of all successful property reads initiated from devices |No Dimensions |
|d2c.property.update.failure |Yes |Failed Device Property Updates from Devices |Count |Total |The count of all failed property updates initiated from devices |No Dimensions |
|d2c.property.update.success |Yes |Successful Device Property Updates from Devices |Count |Total |The count of all successful property updates initiated from devices |No Dimensions |
|d2c.telemetry.ingress.allProtocol |Yes |Total Telemetry Message Send Attempts |Count |Total |Number of device-to-cloud telemetry messages attempted to be sent to the IoT Central application |No Dimensions |
|d2c.telemetry.ingress.success |Yes |Total Telemetry Messages Sent |Count |Total |Number of device-to-cloud telemetry messages successfully sent to the IoT Central application |No Dimensions |
|dataExport.error |Yes |Data Export Errors |Count |Total |Number of errors encountered for data export |exportId, exportDisplayName, destinationId, destinationDisplayName |
|dataExport.messages.filtered |Yes |Data Export Messages Filtered |Count |Total |Number of messages that have passed through filters in data export |exportId, exportDisplayName, destinationId, destinationDisplayName |
|dataExport.messages.received |Yes |Data Export Messages Received |Count |Total |Number of messages incoming to data export, before filtering and enrichment processing |exportId, exportDisplayName, destinationId, destinationDisplayName |
|dataExport.messages.written |Yes |Data Export Messages Written |Count |Total |Number of messages written to a destination |exportId, exportDisplayName, destinationId, destinationDisplayName |
|dataExport.statusChange |Yes |Data Export Status Change |Count |Total |Number of status changes |exportId, exportDisplayName, destinationId, destinationDisplayName, status |
|deviceDataUsage |Yes |Total Device Data Usage |Bytes |Total |Bytes transferred to and from any devices connected to IoT Central application |No Dimensions |
|provisionedDeviceCount |No |Total Provisioned Devices |Count |Average |Number of devices provisioned in IoT Central application |No Dimensions |

## microsoft.keyvault/managedhsms  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |No |Overall Service Availability |Percent |Average |Service requests availability |ActivityType, ActivityName, StatusCode, StatusCodeClass |
|ServiceApiHit |Yes |Total Service Api Hits |Count |Count |Number of total service api hits |ActivityType, ActivityName |
|ServiceApiLatency |No |Overall Service Api Latency |Milliseconds |Average |Overall latency of service api requests |ActivityType, ActivityName, StatusCode, StatusCodeClass |

## Microsoft.KeyVault/vaults  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Overall Vault Availability |Percent |Average |Vault requests availability |ActivityType, ActivityName, StatusCode, StatusCodeClass |
|SaturationShoebox |No |Overall Vault Saturation |Percent |Average |Vault capacity used |ActivityType, ActivityName, TransactionType |
|ServiceApiHit |Yes |Total Service Api Hits |Count |Count |Number of total service api hits |ActivityType, ActivityName |
|ServiceApiLatency |Yes |Overall Service Api Latency |MilliSeconds |Average |Overall latency of service api requests |ActivityType, ActivityName, StatusCode, StatusCodeClass |
|ServiceApiResult |Yes |Total Service Api Results |Count |Count |Number of total service api results |ActivityType, ActivityName, StatusCode, StatusCodeClass |

## microsoft.kubernetes/connectedClusters  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|capacity_cpu_cores |Yes |Total number of cpu cores in a connected cluster |Count |Total |Total number of cpu cores in a connected cluster |No Dimensions |

## microsoft.kubernetesconfiguration/extensions  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AuthAttempt |Yes |Authentication Attempts |Count |Total |Authentication attempts rate (per minute) |3gppGen, PccpId, SiteId |
|AuthFailure |Yes |Authentication Failures |Count |Total |Authentication failure rate (per minute) |3gppGen, PccpId, SiteId, Result |
|AuthSuccess |Yes |Authentication Successes |Count |Total |Authentication success rate (per minute) |3gppGen, PccpId, SiteId |
|ConnectedNodebs |Yes |Connected NodeBs |Count |Total |Number of connected gNodeBs or eNodeBs |3gppGen, PccpId, SiteId |
|DeRegistrationAttempt |Yes |DeRegistration Attempts |Count |Total |UE deregistration attempts rate (per minute) |3gppGen, PccpId, SiteId |
|DeRegistrationSuccess |Yes |DeRegistration Successes |Count |Total |UE deregistration success rate (per minute) |3gppGen, PccpId, SiteId |
|PagingAttempt |Yes |Paging Attempts |Count |Total |Paging attempts rate (per minute) |3gppGen, PccpId, SiteId |
|PagingFailure |Yes |Paging Failures |Count |Total |Paging failure rate (per minute) |3gppGen, PccpId, SiteId |
|ProvisionedSubscribers |No |Provisioned Subscribers |Count |Total |Number of provisioned subscribers |PccpId, SiteId |
|RanSetupFailure |Yes |RAN Setup Failures |Count |Total |RAN setup failure rate (per minute) |3gppGen, PccpId, SiteId, Cause |
|RanSetupRequest |Yes |RAN Setup Requests |Count |Total |RAN setup reuests rate (per minute) |3gppGen, PccpId, SiteId |
|RanSetupResponse |Yes |RAN Setup Responses |Count |Total |RAN setup response rate (per minute) |3gppGen, PccpId, SiteId |
|RegisteredSubscribers |Yes |Registered Subscribers |Count |Total |Number of registered subscribers |3gppGen, PccpId, SiteId |
|RegisteredSubscribersConnected |Yes |Registered Subscribers Connected |Count |Total |Number of registered and connected subscribers |3gppGen, PccpId, SiteId |
|RegisteredSubscribersIdle |Yes |Registered Subscribers Idle |Count |Total |Number of registered and idle subscribers |3gppGen, PccpId, SiteId |
|RegistrationAttempt |Yes |Registration Attempts |Count |Total |Registration attempts rate (per minute) |3gppGen, PccpId, SiteId |
|RegistrationFailure |Yes |Registration Failures |Count |Total |Registration failure rate (per minute) |3gppGen, PccpId, SiteId, Result |
|RegistrationSuccess |Yes |Registration Successes |Count |Total |Registration success rate (per minute) |3gppGen, PccpId, SiteId |
|ServiceRequestAttempt |Yes |Service Request Attempts |Count |Total |Service request attempts rate (per minute) |3gppGen, PccpId, SiteId |
|ServiceRequestFailure |Yes |Service Request Failures |Count |Total |Service request failure rate (per minute) |3gppGen, PccpId, SiteId, Result, Tai |
|ServiceRequestSuccess |Yes |Service Request Successes |Count |Total |Service request success rate (per minute) |3gppGen, PccpId, SiteId |
|SessionEstablishmentAttempt |Yes |Session Establishment Attempts |Count |Total |PDU session establishment attempts rarte (per minute) |3gppGen, PccpId, SiteId |
|SessionEstablishmentFailure |Yes |Session Establishment Failures |Count |Total |PDU session establishment failure rate (per minute) |3gppGen, PccpId, SiteId |
|SessionEstablishmentSuccess |Yes |Session Establishment Successes |Count |Total |PDU session establishment success rate (per minute) |3gppGen, PccpId, SiteId |
|SessionRelease |Yes |Session Releases |Count |Total |Session release rate (per minute) |3gppGen, PccpId, SiteId |
|UeContextReleaseCommand |Yes |UE Context Release Commands |Count |Total |UE context release command message rate (per minute) |3gppGen, PccpId, SiteId |
|UeContextReleaseComplete |Yes |UE Context Release Completes |Count |Total |UE context release complete message rate (per minute) |3gppGen, PccpId, SiteId |
|UeContextReleaseRequest |Yes |UE Context Release Requests |Count |Total |UE context release request message rate (per minute) |3gppGen, PccpId, SiteId |
|UserPlaneBandwidth |No |User Plane Bandwidth |BitsPerSecond |Total |User plane bandwidth in bits/second. |PcdpId, SiteId, Direction, Interface |
|UserPlanePacketDropRate |No |User Plane Packet Drop Rate |CountPerSecond |Total |User plane packet drop rate (packets/sec) |PcdpId, SiteId, Cause, Direction, Interface |
|UserPlanePacketRate |No |User Plane Packet Rate |CountPerSecond |Total |User plane packet rate (packets/sec) |PcdpId, SiteId, Direction, Interface |
|XnHandoverAttempt |Yes |Xn Handover Attempts |Count |Total |Handover attempts rate (per minute) |3gppGen, PccpId, SiteId |
|XnHandoverFailure |Yes |Xn Handover Failures |Count |Total |Handover failure rate (per minute) |3gppGen, PccpId, SiteId |
|XnHandoverSuccess |Yes |Xn Handover Successes |Count |Total |Handover success rate (per minute) |3gppGen, PccpId, SiteId |

## Microsoft.Kusto/clusters  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BatchBlobCount |Yes |Batch Blob Count |Count |Average |Number of data sources in an aggregated batch for ingestion. |Database |
|BatchDuration |Yes |Batch Duration |Seconds |Average |The duration of the aggregation phase in the ingestion flow. |Database |
|BatchesProcessed |Yes |Batches Processed |Count |Total |Number of batches aggregated for ingestion. Batching Type: whether the batch reached batching time, data size or number of files limit set by batching policy |Database, SealReason |
|BatchSize |Yes |Batch Size |Bytes |Average |Uncompressed expected data size in an aggregated batch for ingestion. |Database |
|BlobsDropped |Yes |Blobs Dropped |Count |Total |Number of blobs permanently rejected by a component. |Database, ComponentType, ComponentName |
|BlobsProcessed |Yes |Blobs Processed |Count |Total |Number of blobs processed by a component. |Database, ComponentType, ComponentName |
|BlobsReceived |Yes |Blobs Received |Count |Total |Number of blobs received from input stream by a component. |Database, ComponentType, ComponentName |
|CacheUtilization |Yes |Cache utilization (deprecated) |Percent |Average |Utilization level in the cluster scope. The metric is deprecated and presented for backward compatibility only, you should use the 'Cache utilization factor' metric instead. |No Dimensions |
|CacheUtilizationFactor |Yes |Cache utilization factor |Percent |Average |Percentage of utilized disk space dedicated for hot cache in the cluster. 100% means that the disk space assigned to hot data is optimally utilized. No action is needed in terms of the cache size. More than 100% means that the cluster's disk space is not large enough to accommodate the hot data, as defined by your caching policies. To ensure that sufficient space is available for all the hot data, the amount of hot data needs to be reduced or the cluster needs to be scaled out. Enabling auto scale is recommended. |No Dimensions |
|ContinuousExportMaxLatenessMinutes |Yes |Continuous Export Max Lateness |Count |Maximum |The lateness (in minutes) reported by the continuous export jobs in the cluster |No Dimensions |
|ContinuousExportNumOfRecordsExported |Yes |Continuous export – num of exported records |Count |Total |Number of records exported, fired for every storage artifact written during the export operation |ContinuousExportName, Database |
|ContinuousExportPendingCount |Yes |Continuous Export Pending Count |Count |Maximum |The number of pending continuous export jobs ready for execution |No Dimensions |
|ContinuousExportResult |Yes |Continuous Export Result |Count |Count |Indicates whether Continuous Export succeeded or failed |ContinuousExportName, Result, Database |
|CPU |Yes |CPU |Percent |Average |CPU utilization level |No Dimensions |
|DiscoveryLatency |Yes |Discovery Latency |Seconds |Average |Reported by data connections (if exist). Time in seconds from when a message is enqueued or event is created until it is discovered by data connection. This time is not included in the Azure Data Explorer total ingestion duration. |ComponentType, ComponentName |
|EventsDropped |Yes |Events Dropped |Count |Total |Number of events dropped permanently by data connection. An Ingestion result metric with a failure reason will be sent. |ComponentType, ComponentName |
|EventsProcessed |Yes |Events Processed |Count |Total |Number of events processed by the cluster |ComponentType, ComponentName |
|EventsProcessedForEventHubs |Yes |Events Processed (for Event/IoT Hubs) |Count |Total |Number of events processed by the cluster when ingesting from Event/IoT Hub |EventStatus |
|EventsReceived |Yes |Events Received |Count |Total |Number of events received by data connection. |ComponentType, ComponentName |
|ExportUtilization |Yes |Export Utilization |Percent |Maximum |Export utilization |No Dimensions |
|FollowerLatency |Yes |FollowerLatency |MilliSeconds |Average |The follower databases synchronize changes in the leader databases. Because of the synchronization, there's a data lag of a few seconds to a few minutes in data availability.This metric measures the length of the time lag. The time lag depends on the overall size of the leader database metadata.This is a cluster level metrics: the followers catch metadata of all databases that are followed. This metric represents the latency of the process. |State, RoleInstance |
|IngestionLatencyInSeconds |Yes |Ingestion Latency |Seconds |Average |Latency of data ingested, from the time the data was received in the cluster until it's ready for query. The ingestion latency period depends on the ingestion scenario. |No Dimensions |
|IngestionResult |Yes |Ingestion result |Count |Total |Total number of sources that either failed or succeeded to be ingested. Splitting the metric by status, you can get detailed information about the status of the ingestion operations. |IngestionResultDetails, FailureKind |
|IngestionUtilization |Yes |Ingestion utilization |Percent |Average |Ratio of used ingestion slots in the cluster |No Dimensions |
|IngestionVolumeInMB |Yes |Ingestion Volume |Bytes |Total |Overall volume of ingested data to the cluster |Database |
|InstanceCount |Yes |Instance Count |Count |Average |Total instance count |No Dimensions |
|KeepAlive |Yes |Keep alive |Count |Average |Sanity check indicates the cluster responds to queries |No Dimensions |
|MaterializedViewAgeMinutes |Yes |Materialized View Age |Count |Average |The materialized view age in minutes |Database, MaterializedViewName |
|MaterializedViewAgeSeconds |Yes |Materialized View Age |Seconds |Average |The materialized view age in seconds |Database, MaterializedViewName |
|MaterializedViewDataLoss |Yes |Materialized View Data Loss |Count |Maximum |Indicates potential data loss in materialized view |Database, MaterializedViewName, Kind |
|MaterializedViewExtentsRebuild |Yes |Materialized View Extents Rebuild |Count |Average |Number of extents rebuild |Database, MaterializedViewName |
|MaterializedViewHealth |Yes |Materialized View Health |Count |Average |The health of the materialized view (1 for healthy, 0 for non-healthy) |Database, MaterializedViewName |
|MaterializedViewRecordsInDelta |Yes |Materialized View Records In Delta |Count |Average |The number of records in the non-materialized part of the view |Database, MaterializedViewName |
|MaterializedViewResult |Yes |Materialized View Result |Count |Average |The result of the materialization process |Database, MaterializedViewName, Result |
|QueryDuration |Yes |Query duration |MilliSeconds |Average |Queries' duration in seconds |QueryStatus |
|QueryResult |No |Query Result |Count |Count |Total number of queries. |QueryStatus |
|QueueLength |Yes |Queue Length |Count |Average |Number of pending messages in a component's queue. |ComponentType |
|QueueOldestMessage |Yes |Queue Oldest Message |Count |Average |Time in seconds from when the oldest message in queue was inserted. |ComponentType |
|ReceivedDataSizeBytes |Yes |Received Data Size Bytes |Bytes |Average |Size of data received by data connection. This is the size of the data stream, or of raw data size if provided. |ComponentType, ComponentName |
|StageLatency |Yes |Stage Latency |Seconds |Average |Cumulative time from when a message is discovered until it is received by the reporting component for processing (discovery time is set when message is enqueued for ingestion queue, or when discovered by data connection). |Database, ComponentType |
|StreamingIngestDataRate |Yes |Streaming Ingest Data Rate |Bytes |Average |Streaming ingest data rate |No Dimensions |
|StreamingIngestDuration |Yes |Streaming Ingest Duration |MilliSeconds |Average |Streaming ingest duration in milliseconds |No Dimensions |
|StreamingIngestResults |Yes |Streaming Ingest Result |Count |Count |Streaming ingest result |Result |
|TotalNumberOfConcurrentQueries |Yes |Total number of concurrent queries |Count |Maximum |Total number of concurrent queries |No Dimensions |
|TotalNumberOfExtents |Yes |Total number of extents |Count |Average |Total number of data extents |No Dimensions |
|TotalNumberOfThrottledCommands |Yes |Total number of throttled commands |Count |Total |Total number of throttled commands |CommandType |
|TotalNumberOfThrottledQueries |Yes |Total number of throttled queries |Count |Maximum |Total number of throttled queries |No Dimensions |
|WeakConsistencyLatency |Yes |Weak consistency latency |Seconds |Average |The max latency between the previous metadata sync and the next one (in DB/node scope) |Database, RoleInstance |

## Microsoft.Logic/IntegrationServiceEnvironments  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActionLatency |Yes |Action Latency  |Seconds |Average |Latency of completed workflow actions. |No Dimensions |
|ActionsCompleted |Yes |Actions Completed  |Count |Total |Number of workflow actions completed. |No Dimensions |
|ActionsFailed |Yes |Actions Failed  |Count |Total |Number of workflow actions failed. |No Dimensions |
|ActionsSkipped |Yes |Actions Skipped  |Count |Total |Number of workflow actions skipped. |No Dimensions |
|ActionsStarted |Yes |Actions Started  |Count |Total |Number of workflow actions started. |No Dimensions |
|ActionsSucceeded |Yes |Actions Succeeded  |Count |Total |Number of workflow actions succeeded. |No Dimensions |
|ActionSuccessLatency |Yes |Action Success Latency  |Seconds |Average |Latency of succeeded workflow actions. |No Dimensions |
|IntegrationServiceEnvironmentConnectorMemoryUsage |Yes |Connector Memory Usage for Integration Service Environment |Percent |Average |Connector memory usage for integration service environment. |No Dimensions |
|IntegrationServiceEnvironmentConnectorProcessorUsage |Yes |Connector Processor Usage for Integration Service Environment |Percent |Average |Connector processor usage for integration service environment. |No Dimensions |
|IntegrationServiceEnvironmentWorkflowMemoryUsage |Yes |Workflow Memory Usage for Integration Service Environment |Percent |Average |Workflow memory usage for integration service environment. |No Dimensions |
|IntegrationServiceEnvironmentWorkflowProcessorUsage |Yes |Workflow Processor Usage for Integration Service Environment |Percent |Average |Workflow processor usage for integration service environment. |No Dimensions |
|RunLatency |Yes |Run Latency |Seconds |Average |Latency of completed workflow runs. |No Dimensions |
|RunsCancelled |Yes |Runs Cancelled |Count |Total |Number of workflow runs cancelled. |No Dimensions |
|RunsCompleted |Yes |Runs Completed |Count |Total |Number of workflow runs completed. |No Dimensions |
|RunsFailed |Yes |Runs Failed |Count |Total |Number of workflow runs failed. |No Dimensions |
|RunsStarted |Yes |Runs Started |Count |Total |Number of workflow runs started. |No Dimensions |
|RunsSucceeded |Yes |Runs Succeeded |Count |Total |Number of workflow runs succeeded. |No Dimensions |
|RunSuccessLatency |Yes |Run Success Latency |Seconds |Average |Latency of succeeded workflow runs. |No Dimensions |
|TriggerFireLatency |Yes |Trigger Fire Latency  |Seconds |Average |Latency of fired workflow triggers. |No Dimensions |
|TriggerLatency |Yes |Trigger Latency  |Seconds |Average |Latency of completed workflow triggers. |No Dimensions |
|TriggersCompleted |Yes |Triggers Completed  |Count |Total |Number of workflow triggers completed. |No Dimensions |
|TriggersFailed |Yes |Triggers Failed  |Count |Total |Number of workflow triggers failed. |No Dimensions |
|TriggersFired |Yes |Triggers Fired  |Count |Total |Number of workflow triggers fired. |No Dimensions |
|TriggersSkipped |Yes |Triggers Skipped |Count |Total |Number of workflow triggers skipped. |No Dimensions |
|TriggersStarted |Yes |Triggers Started  |Count |Total |Number of workflow triggers started. |No Dimensions |
|TriggersSucceeded |Yes |Triggers Succeeded  |Count |Total |Number of workflow triggers succeeded. |No Dimensions |
|TriggerSuccessLatency |Yes |Trigger Success Latency  |Seconds |Average |Latency of succeeded workflow triggers. |No Dimensions |

## Microsoft.Logic/Workflows  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActionLatency |Yes |Action Latency  |Seconds |Average |Latency of completed workflow actions. |No Dimensions |
|ActionsCompleted |Yes |Actions Completed  |Count |Total |Number of workflow actions completed. |No Dimensions |
|ActionsFailed |Yes |Actions Failed  |Count |Total |Number of workflow actions failed. |No Dimensions |
|ActionsSkipped |Yes |Actions Skipped  |Count |Total |Number of workflow actions skipped. |No Dimensions |
|ActionsStarted |Yes |Actions Started  |Count |Total |Number of workflow actions started. |No Dimensions |
|ActionsSucceeded |Yes |Actions Succeeded  |Count |Total |Number of workflow actions succeeded. |No Dimensions |
|ActionSuccessLatency |Yes |Action Success Latency  |Seconds |Average |Latency of succeeded workflow actions. |No Dimensions |
|ActionThrottledEvents |Yes |Action Throttled Events |Count |Total |Number of workflow action throttled events.. |No Dimensions |
|BillableActionExecutions |Yes |Billable Action Executions |Count |Total |Number of workflow action executions getting billed. |No Dimensions |
|BillableTriggerExecutions |Yes |Billable Trigger Executions |Count |Total |Number of workflow trigger executions getting billed. |No Dimensions |
|BillingUsageNativeOperation |Yes |Billing Usage for Native Operation Executions |Count |Total |Number of native operation executions getting billed. |No Dimensions |
|BillingUsageStandardConnector |Yes |Billing Usage for Standard Connector Executions |Count |Total |Number of standard connector executions getting billed. |No Dimensions |
|BillingUsageStorageConsumption |Yes |Billing Usage for Storage Consumption Executions |Count |Total |Number of storage consumption executions getting billed. |No Dimensions |
|RunFailurePercentage |Yes |Run Failure Percentage |Percent |Total |Percentage of workflow runs failed. |No Dimensions |
|RunLatency |Yes |Run Latency |Seconds |Average |Latency of completed workflow runs. |No Dimensions |
|RunsCancelled |Yes |Runs Cancelled |Count |Total |Number of workflow runs cancelled. |No Dimensions |
|RunsCompleted |Yes |Runs Completed |Count |Total |Number of workflow runs completed. |No Dimensions |
|RunsFailed |Yes |Runs Failed |Count |Total |Number of workflow runs failed. |No Dimensions |
|RunsStarted |Yes |Runs Started |Count |Total |Number of workflow runs started. |No Dimensions |
|RunsSucceeded |Yes |Runs Succeeded |Count |Total |Number of workflow runs succeeded. |No Dimensions |
|RunStartThrottledEvents |Yes |Run Start Throttled Events |Count |Total |Number of workflow run start throttled events. |No Dimensions |
|RunSuccessLatency |Yes |Run Success Latency |Seconds |Average |Latency of succeeded workflow runs. |No Dimensions |
|RunThrottledEvents |Yes |Run Throttled Events |Count |Total |Number of workflow action or trigger throttled events. |No Dimensions |
|TotalBillableExecutions |Yes |Total Billable Executions |Count |Total |Number of workflow executions getting billed. |No Dimensions |
|TriggerFireLatency |Yes |Trigger Fire Latency  |Seconds |Average |Latency of fired workflow triggers. |No Dimensions |
|TriggerLatency |Yes |Trigger Latency  |Seconds |Average |Latency of completed workflow triggers. |No Dimensions |
|TriggersCompleted |Yes |Triggers Completed  |Count |Total |Number of workflow triggers completed. |No Dimensions |
|TriggersFailed |Yes |Triggers Failed  |Count |Total |Number of workflow triggers failed. |No Dimensions |
|TriggersFired |Yes |Triggers Fired  |Count |Total |Number of workflow triggers fired. |No Dimensions |
|TriggersSkipped |Yes |Triggers Skipped |Count |Total |Number of workflow triggers skipped. |No Dimensions |
|TriggersStarted |Yes |Triggers Started  |Count |Total |Number of workflow triggers started. |No Dimensions |
|TriggersSucceeded |Yes |Triggers Succeeded  |Count |Total |Number of workflow triggers succeeded. |No Dimensions |
|TriggerSuccessLatency |Yes |Trigger Success Latency  |Seconds |Average |Latency of succeeded workflow triggers. |No Dimensions |
|TriggerThrottledEvents |Yes |Trigger Throttled Events |Count |Total |Number of workflow trigger throttled events. |No Dimensions |

## Microsoft.MachineLearningServices/workspaces  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Active Cores |Yes |Active Cores |Count |Average |Number of active cores |Scenario, ClusterName |
|Active Nodes |Yes |Active Nodes |Count |Average |Number of Acitve nodes. These are the nodes which are actively running a job. |Scenario, ClusterName |
|Cancel Requested Runs |Yes |Cancel Requested Runs |Count |Total |Number of runs where cancel was requested for this workspace. Count is updated when cancellation request has been received for a run. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Cancelled Runs |Yes |Cancelled Runs |Count |Total |Number of runs cancelled for this workspace. Count is updated when a run is successfully cancelled. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Completed Runs |Yes |Completed Runs |Count |Total |Number of runs completed successfully for this workspace. Count is updated when a run has completed and output has been collected. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|CpuCapacityMillicores |Yes |CpuCapacityMillicores |Count |Average |Maximum capacity of a CPU node in millicores. Capacity is aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|CpuMemoryCapacityMegabytes |Yes |CpuMemoryCapacityMegabytes |Count |Average |Maximum memory utilization of a CPU node in megabytes. Utilization is aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|CpuMemoryUtilizationMegabytes |Yes |CpuMemoryUtilizationMegabytes |Count |Average |Memory utilization of a CPU node in megabytes. Utilization is aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|CpuMemoryUtilizationPercentage |Yes |CpuMemoryUtilizationPercentage |Count |Average |Memory utilization percentage of a CPU node. Utilization is aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|CpuUtilization |Yes |CpuUtilization |Count |Average |Percentage of utilization on a CPU node. Utilization is reported at one minute intervals. |Scenario, runId, NodeId, ClusterName |
|CpuUtilizationMillicores |Yes |CpuUtilizationMillicores |Count |Average |Utilization of a CPU node in millicores. Utilization is aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|CpuUtilizationPercentage |Yes |CpuUtilizationPercentage |Count |Average |Utilization percentage of a CPU node. Utilization is aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|DiskAvailMegabytes |Yes |DiskAvailMegabytes |Count |Average |Available disk space in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|DiskReadMegabytes |Yes |DiskReadMegabytes |Count |Average |Data read from disk in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|DiskUsedMegabytes |Yes |DiskUsedMegabytes |Count |Average |Used disk space in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|DiskWriteMegabytes |Yes |DiskWriteMegabytes |Count |Average |Data written into disk in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName |
|Errors |Yes |Errors |Count |Total |Number of run errors in this workspace. Count is updated whenever run encounters an error. |Scenario |
|Failed Runs |Yes |Failed Runs |Count |Total |Number of runs failed for this workspace. Count is updated when a run fails. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Finalizing Runs |Yes |Finalizing Runs |Count |Total |Number of runs entered finalizing state for this workspace. Count is updated when a run has completed but output collection still in progress. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|GpuCapacityMilliGPUs |Yes |GpuCapacityMilliGPUs |Count |Average |Maximum capacity of a GPU device in milli-GPUs. Capacity is aggregated in one minute intervals. |RunId, InstanceId, DeviceId, ComputeName |
|GpuEnergyJoules |Yes |GpuEnergyJoules |Count |Total |Interval energy in Joules on a GPU node. Energy is reported at one minute intervals. |Scenario, runId, rootRunId, InstanceId, DeviceId, ComputeName |
|GpuMemoryCapacityMegabytes |Yes |GpuMemoryCapacityMegabytes |Count |Average |Maximum memory capacity of a GPU device in megabytes. Capacity aggregated in at one minute intervals. |RunId, InstanceId, DeviceId, ComputeName |
|GpuMemoryUtilization |Yes |GpuMemoryUtilization |Count |Average |Percentage of memory utilization on a GPU node. Utilization is reported at one minute intervals. |Scenario, runId, NodeId, DeviceId, ClusterName |
|GpuMemoryUtilizationMegabytes |Yes |GpuMemoryUtilizationMegabytes |Count |Average |Memory utilization of a GPU device in megabytes. Utilization aggregated in at one minute intervals. |RunId, InstanceId, DeviceId, ComputeName |
|GpuMemoryUtilizationPercentage |Yes |GpuMemoryUtilizationPercentage |Count |Average |Memory utilization percentage of a GPU device. Utilization aggregated in at one minute intervals. |RunId, InstanceId, DeviceId, ComputeName |
|GpuUtilization |Yes |GpuUtilization |Count |Average |Percentage of utilization on a GPU node. Utilization is reported at one minute intervals. |Scenario, runId, NodeId, DeviceId, ClusterName |
|GpuUtilizationMilliGPUs |Yes |GpuUtilizationMilliGPUs |Count |Average |Utilization of a GPU device in milli-GPUs. Utilization is aggregated in one minute intervals. |RunId, InstanceId, DeviceId, ComputeName |
|GpuUtilizationPercentage |Yes |GpuUtilizationPercentage |Count |Average |Utilization percentage of a GPU device. Utilization is aggregated in one minute intervals. |RunId, InstanceId, DeviceId, ComputeName |
|IBReceiveMegabytes |Yes |IBReceiveMegabytes |Count |Average |Network data received over InfiniBand in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName, DeviceId |
|IBTransmitMegabytes |Yes |IBTransmitMegabytes |Count |Average |Network data sent over InfiniBand in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName, DeviceId |
|Idle Cores |Yes |Idle Cores |Count |Average |Number of idle cores |Scenario, ClusterName |
|Idle Nodes |Yes |Idle Nodes |Count |Average |Number of idle nodes. Idle nodes are the nodes which are not running any jobs but can accept new job if available. |Scenario, ClusterName |
|Leaving Cores |Yes |Leaving Cores |Count |Average |Number of leaving cores |Scenario, ClusterName |
|Leaving Nodes |Yes |Leaving Nodes |Count |Average |Number of leaving nodes. Leaving nodes are the nodes which just finished processing a job and will go to Idle state. |Scenario, ClusterName |
|Model Deploy Failed |Yes |Model Deploy Failed |Count |Total |Number of model deployments that failed in this workspace |Scenario, StatusCode |
|Model Deploy Started |Yes |Model Deploy Started |Count |Total |Number of model deployments started in this workspace |Scenario |
|Model Deploy Succeeded |Yes |Model Deploy Succeeded |Count |Total |Number of model deployments that succeeded in this workspace |Scenario |
|Model Register Failed |Yes |Model Register Failed |Count |Total |Number of model registrations that failed in this workspace |Scenario, StatusCode |
|Model Register Succeeded |Yes |Model Register Succeeded |Count |Total |Number of model registrations that succeeded in this workspace |Scenario |
|NetworkInputMegabytes |Yes |NetworkInputMegabytes |Count |Average |Network data received in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName, DeviceId |
|NetworkOutputMegabytes |Yes |NetworkOutputMegabytes |Count |Average |Network data sent in megabytes. Metrics are aggregated in one minute intervals. |RunId, InstanceId, ComputeName, DeviceId |
|Not Responding Runs |Yes |Not Responding Runs |Count |Total |Number of runs not responding for this workspace. Count is updated when a run enters Not Responding state. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Not Started Runs |Yes |Not Started Runs |Count |Total |Number of runs in Not Started state for this workspace. Count is updated when a request is received to create a run but run information has not yet been populated.  |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Preempted Cores |Yes |Preempted Cores |Count |Average |Number of preempted cores |Scenario, ClusterName |
|Preempted Nodes |Yes |Preempted Nodes |Count |Average |Number of preempted nodes. These nodes are the low priority nodes which are taken away from the available node pool. |Scenario, ClusterName |
|Preparing Runs |Yes |Preparing Runs |Count |Total |Number of runs that are preparing for this workspace. Count is updated when a run enters Preparing state while the run environment is being prepared. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Provisioning Runs |Yes |Provisioning Runs |Count |Total |Number of runs that are provisioning for this workspace. Count is updated when a run is waiting on compute target creation or provisioning. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Queued Runs |Yes |Queued Runs |Count |Total |Number of runs that are queued for this workspace. Count is updated when a run is queued in compute target. Can occure when waiting for required compute nodes to be ready. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Quota Utilization Percentage |Yes |Quota Utilization Percentage |Count |Average |Percent of quota utilized |Scenario, ClusterName, VmFamilyName, VmPriority |
|Started Runs |Yes |Started Runs |Count |Total |Number of runs running for this workspace. Count is updated when run starts running on required resources. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|Starting Runs |Yes |Starting Runs |Count |Total |Number of runs started for this workspace. Count is updated after request to create run and run info, such as the Run Id, has been populated |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName |
|StorageAPIFailureCount |Yes |StorageAPIFailureCount |Count |Total |Azure Blob Storage API calls failure count. |RunId, InstanceId, ComputeName |
|StorageAPISuccessCount |Yes |StorageAPISuccessCount |Count |Total |Azure Blob Storage API calls success count. |RunId, InstanceId, ComputeName |
|Total Cores |Yes |Total Cores |Count |Average |Number of total cores |Scenario, ClusterName |
|Total Nodes |Yes |Total Nodes |Count |Average |Number of total nodes. This total includes some of Active Nodes, Idle Nodes, Unusable Nodes, Premepted Nodes, Leaving Nodes |Scenario, ClusterName |
|Unusable Cores |Yes |Unusable Cores |Count |Average |Number of unusable cores |Scenario, ClusterName |
|Unusable Nodes |Yes |Unusable Nodes |Count |Average |Number of unusable nodes. Unusable nodes are not functional due to some unresolvable issue. Azure will recycle these nodes. |Scenario, ClusterName |
|Warnings |Yes |Warnings |Count |Total |Number of run warnings in this workspace. Count is updated whenever a run encounters a warning. |Scenario |

## Microsoft.MachineLearningServices/workspaces/onlineEndpoints  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ConnectionsActive |No |Connections Active |Count |Average |The total number of concurrent TCP connections active from clients. |No Dimensions |
|DataCollectionErrorsPerMinute |No |Data Collection Errors Per Minute |Count |Average |The number of data collection events dropped per minute. |deployment, reason, type |
|DataCollectionEventsPerMinute |No |Data Collection Events Per Minute |Count |Average |The number of data collection events processed per minute. |deployment, type |
|NetworkBytes |No |Network Bytes |BytesPerSecond |Average |The bytes per second served for the endpoint. |No Dimensions |
|NewConnectionsPerSecond |No |New Connections Per Second |CountPerSecond |Average |The average number of new TCP connections per second established from clients. |No Dimensions |
|RequestLatency |Yes |Request Latency |Milliseconds |Average |The average complete interval of time taken for a request to be responded in milliseconds |deployment |
|RequestLatency_P50 |Yes |Request Latency P50 |Milliseconds |Average |The average P50 request latency aggregated by all request latency values collected over the selected time period |deployment |
|RequestLatency_P90 |Yes |Request Latency P90 |Milliseconds |Average |The average P90 request latency aggregated by all request latency values collected over the selected time period |deployment |
|RequestLatency_P95 |Yes |Request Latency P95 |Milliseconds |Average |The average P95 request latency aggregated by all request latency values collected over the selected time period |deployment |
|RequestLatency_P99 |Yes |Request Latency P99 |Milliseconds |Average |The average P99 request latency aggregated by all request latency values collected over the selected time period |deployment |
|RequestsPerMinute |No |Requests Per Minute |Count |Average |The number of requests sent to online endpoint within a minute |deployment, statusCode, statusCodeClass, modelStatusCode |

## Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CpuMemoryUtilizationPercentage |Yes |CPU Memory Utilization Percentage |Percent |Average |Percentage of memory utilization on an instance. Utilization is reported at one minute intervals. |instanceId |
|CpuUtilizationPercentage |Yes |CPU Utilization Percentage |Percent |Average |Percentage of CPU utilization on an instance. Utilization is reported at one minute intervals. |instanceId |
|DataCollectionErrorsPerMinute |No |Data Collection Errors Per Minute |Count |Average |The number of data collection events dropped per minute. |instanceId, reason, type |
|DataCollectionEventsPerMinute |No |Data Collection Events Per Minute |Count |Average |The number of data collection events processed per minute. |instanceId, type |
|DeploymentCapacity |No |Deployment Capacity |Count |Average |The number of instances in the deployment. |instanceId, State |
|DiskUtilization |Yes |Disk Utilization |Percent |Maximum |Percentage of disk utilization on an instance. Utilization is reported at one minute intervals. |instanceId, disk |
|GpuEnergyJoules |No |GPU Energy in Joules |Count |Average |Interval energy in Joules on a GPU node. Energy is reported at one minute intervals. |instanceId |
|GpuMemoryUtilizationPercentage |Yes |GPU Memory Utilization Percentage |Percent |Average |Percentage of GPU memory utilization on an instance. Utilization is reported at one minute intervals. |instanceId |
|GpuUtilizationPercentage |Yes |GPU Utilization Percentage |Percent |Average |Percentage of GPU utilization on an instance. Utilization is reported at one minute intervals. |instanceId |

## Microsoft.ManagedNetworkFabric/networkDevices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BgpPeerStatus |Yes |BGP Peer Status |Unspecified |Minimum |Operational state of the BGP peer. State is represented in numerical form. Idle : 1, Connect : 2, Active : 3, Opensent : 4, Openconfirm : 5, Established : 6 |FabricId, RegionName, IpAddress |
|CpuUtilizationMax |Yes |Cpu Utilization Max |Percent |Average |Max cpu utilization. The maximum value of the percentage measure of the statistic over the time interval. |FabricId, RegionName, ComponentName |
|CpuUtilizationMin |Yes |Cpu Utilization Min |Percent |Average |Min cpu utilization. The minimum value of the percentage measure of the statistic over the time interval. |FabricId, RegionName, ComponentName |
|FanSpeed |Yes |Fan Speed |Unspecified |Average |Current fan speed. |FabricId, RegionName, ComponentName |
|IfEthInCrcErrors |Yes |Ethernet Interface In CRC Errors |Count |Average |The total number of frames received that had a length (excluding framing bits, but including FCS octets) of between 64 and 1518 octets, inclusive, but had either a bad Frame Check Sequence (FCS) with an integral number of octets (FCS Error) or a bad FCS with a non-integral number of octets (Alignment Error) |FabricId, RegionName, InterfaceName |
|IfEthInFragmentFrames |Yes |Ethernet Interface In Fragment Frames |Count |Average |The total number of frames received that were less than 64 octets in length (excluding framing bits but including FCS octets) and had either a bad Frame Check Sequence (FCS) with an integral number of octets (FCS Error) or a bad FCS with a non-integral number of octets (Alignment Error). |FabricId, RegionName, InterfaceName |
|IfEthInJabberFrames |Yes |Ethernet Interface In Jabber Frames |Count |Average |Number of jabber frames received on the interface. Jabber frames are typically defined as oversize frames which also have a bad CRC. |FabricId, RegionName, InterfaceName |
|IfEthInMacControlFrames |Yes |Ethernet Interface In MAC Control Frames |Count |Average |MAC layer control frames received on the interface |FabricId, RegionName, InterfaceName |
|IfEthInMacPauseFrames |Yes |Ethernet Interface In MAC Pause Frames |Count |Average |MAC layer PAUSE frames received on the interface |FabricId, RegionName, InterfaceName |
|IfEthInOversizeFrames |Yes |Ethernet Interface In Oversize Frames |Count |Average |The total number of frames received that were longer than 1518 octets (excluding framing bits, but including FCS octets) and were otherwise well formed. |FabricId, RegionName, InterfaceName |
|IfEthOutMacControlFrames |Yes |Ethernet Interface Out MAC Control Frames |Count |Average |MAC layer control frames sent on the interface. |FabricId, RegionName, InterfaceName |
|IfEthOutMacPauseFrames |Yes |Ethernet Interface Out MAC Pause Frames |Count |Average |MAC layer PAUSE frames sent on the interface. |FabricId, RegionName, InterfaceName |
|IfInBroadcastPkts |Yes |Interface In Broadcast Pkts |Count |Average |The number of packets, delivered by this sub-layer to a higher (sub-)layer, that were addressed to a broadcast address at this sub-layer. |FabricId, RegionName, InterfaceName |
|IfInDiscards |Yes |Interface In Discards |Count |Average |The number of inbound packets that were chosen to be discarded even though no errors had been detected to prevent their being deliverable to a higher-layer protocol. |FabricId, RegionName, InterfaceName |
|IfInErrors |Yes |Interface In Errors |Count |Average |For packet-oriented interfaces, the number of inbound packets that contained errors preventing them from being deliverable to a higher-layer protocol. |FabricId, RegionName, InterfaceName |
|IfInFcsErrors |Yes |Interface In FCS Errors |Count |Average |Number of received packets which had errors in the frame check sequence (FCS), i.e., framing errors. |FabricId, RegionName, InterfaceName |
|IfInMulticastPkts |Yes |Interface In Multicast Pkts |Count |Average |The number of packets, delivered by this sub-layer to a higher (sub-)layer, that were addressed to a multicast address at this sub-layer. For a MAC-layer protocol, this includes both Group and Functional addresses. |FabricId, RegionName, InterfaceName |
|IfInOctets |Yes |Interface In Octets |Count |Average |The total number of octets received on the interface, including framing characters. |FabricId, RegionName, InterfaceName |
|IfInPkts |Yes |Interface In Pkts |Count |Average |The total number of packets received on the interface, including all unicast, multicast, broadcast and bad packets etc. |FabricId, RegionName, InterfaceName |
|IfInUnicastPkts |Yes |Interface In Unicast Pkts |Count |Average |The number of packets, delivered by this sub-layer to a higher (sub-)layer, that were not addressed to a multicast or broadcast address at this sub-layer. |FabricId, RegionName, InterfaceName |
|IfOutBroadcastPkts |Yes |Interface Out Broadcast Pkts |Count |Average |The total number of packets that higher-level protocols requested be transmitted, and that were addressed to a broadcast address at this sub-layer, including those that were discarded or not sent. |FabricId, RegionName, InterfaceName |
|IfOutDiscards |Yes |Interface Out Discards |Count |Average |The number of outbound packets that were chosen to be discarded even though no errors had been detected to prevent their being transmitted. |FabricId, RegionName, InterfaceName |
|IfOutErrors |Yes |Interface Out Errors |Count |Average |For packet-oriented interfaces, the number of outbound packets that could not be transmitted because of errors. |FabricId, RegionName, InterfaceName |
|IfOutMulticastPkts |Yes |Interface Out Multicast Pkts |Count |Average |The total number of packets that higher-level protocols requested be transmitted, and that were addressed to a multicast address at this sub-layer, including those that were discarded or not sent. For a MAC-layer protocol, this includes both Group and Functional addresses. |FabricId, RegionName, InterfaceName |
|IfOutOctets |Yes |Interface Out Octets |Count |Average |The total number of octets transmitted out of the interface, including framing characters. |FabricId, RegionName, InterfaceName |
|IfOutPkts |Yes |Interface Out Pkts |Count |Average |The total number of packets transmitted out of the interface, including all unicast, multicast, broadcast, and bad packets etc. |FabricId, RegionName, InterfaceName |
|IfOutUnicastPkts |Yes |Interface Out Unicast Pkts |Count |Average |The total number of packets that higher-level requested be transmitted, and that were not addressed to a multicast or broadcast address at this sub-layer, including those that were discarded or not sent. |FabricId, RegionName, InterfaceName |
|InterfaceOperStatus |Yes |Interface Operational State |Unspecified |Minimum |The current operational state of the interface. State is represented in numerical form. Up: 0, Down: 1, Lower_layer_down: 2, Testing: 3, Unknown: 4, Dormant: 5, Not_present: 6. |FabricId, RegionName, InterfaceName |
|LacpErrors |Yes |Lacp Errors |Count |Average |Number of LACPDU illegal packet errors. |FabricId, RegionName, InterfaceName |
|LacpInPkts |Yes |Lacp In Pkts |Count |Average |Number of LACPDUs received. |FabricId, RegionName, InterfaceName |
|LacpOutPkts |Yes |Lacp Out Pkts |Count |Average |Number of LACPDUs transmitted. |FabricId, RegionName, InterfaceName |
|LacpRxErrors |Yes |Lacp Rx Errors |Count |Average |Number of LACPDU receive packet errors. |FabricId, RegionName, InterfaceName |
|LacpTxErrors |Yes |Lacp Tx Errors |Count |Average |Number of LACPDU transmit packet errors. |FabricId, RegionName, InterfaceName |
|LacpUnknownErrors |Yes |Lacp Unknown Errors |Count |Average |Number of LACPDU unknown packet errors. |FabricId, RegionName, InterfaceName |
|LldpFrameIn |Yes |Lldp Frame In |Count |Average |The number of lldp frames received. |FabricId, RegionName, InterfaceName |
|LldpFrameOut |Yes |Lldp Frame Out |Count |Average |The number of frames transmitted out. |FabricId, RegionName, InterfaceName |
|LldpTlvUnknown |Yes |Lldp Tlv Unknown |Count |Average |The number of frames received with unknown TLV. |FabricId, RegionName, InterfaceName |
|MemoryAvailable |Yes |Memory Available |Bytes |Average |The available memory physically installed, or logically allocated to the component. |FabricId, RegionName, ComponentName |
|MemoryUtilized |Yes |Memory Utilized |Bytes |Average |The memory currently in use by processes running on the component, not considering reserved memory that is not available for use. |FabricId, RegionName, ComponentName |
|PowerSupplyCapacity |Yes |Power Supply Maximum Power Capacity |Unspecified |Average |Maximum power capacity of the power supply (watts). |FabricId, RegionName, ComponentName |
|PowerSupplyInputCurrent |Yes |Power Supply Input Current |Unspecified |Average |The input current draw of the power supply (amps). |FabricId, RegionName, ComponentName |
|PowerSupplyInputVoltage |Yes |Power Supply Input Voltage |Unspecified |Average |Input voltage to the power supply (volts). |FabricId, RegionName, ComponentName |
|PowerSupplyOutputCurrent |Yes |Power Supply Output Current |Unspecified |Average |The output current supplied by the power supply (amps) |FabricId, RegionName, ComponentName |
|PowerSupplyOutputPower |Yes |Power Supply Output Power |Unspecified |Average |Output power supplied by the power supply (watts) |FabricId, RegionName, ComponentName |
|PowerSupplyOutputVoltage |Yes |Power Supply Output Voltage |Unspecified |Average |Output voltage supplied by the power supply (volts). |FabricId, RegionName, ComponentName |

## Microsoft.Maps/accounts  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |Availability of the APIs |ApiCategory, ApiName |
|CreatorUsage |No |Creator Usage |Bytes |Average |Azure Maps Creator usage statistics |ServiceName |
|Usage |No |Usage |Count |Count |Count of API calls |ApiCategory, ApiName, ResultType, ResponseCode |

## Microsoft.Media/mediaservices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AssetCount |Yes |Asset count |Count |Average |How many assets are already created in current media service account |No Dimensions |
|AssetQuota |Yes |Asset quota |Count |Average |How many assets are allowed for current media service account |No Dimensions |
|AssetQuotaUsedPercentage |Yes |Asset quota used percentage |Percent |Average |Asset used percentage in current media service account |No Dimensions |
|ChannelsAndLiveEventsCount |Yes |Live event count |Count |Average |The total number of live events in the current media services account |No Dimensions |
|ContentKeyPolicyCount |Yes |Content Key Policy count |Count |Average |How many content key policies are already created in current media service account |No Dimensions |
|ContentKeyPolicyQuota |Yes |Content Key Policy quota |Count |Average |How many content key polices are allowed for current media service account |No Dimensions |
|ContentKeyPolicyQuotaUsedPercentage |Yes |Content Key Policy quota used percentage |Percent |Average |Content Key Policy used percentage in current media service account |No Dimensions |
|JobQuota |Yes |Job quota |Count |Average |The Job quota for the current media service account. |No Dimensions |
|JobsScheduled |Yes |Jobs Scheduled |Count |Average |The number of Jobs in the Scheduled state. Counts on this metric only reflect jobs submitted through the v3 API. Jobs submitted through the v2 (Legacy) API are not counted. |No Dimensions |
|KeyDeliveryRequests |No |Key request time |Count |Average |The key delivery request status and latency in milliseconds for the current Media Service account. |KeyType, HttpStatusCode |
|MaxChannelsAndLiveEventsCount |Yes |Max live event quota |Count |Average |The maximum number of live events allowed in the current media services account |No Dimensions |
|MaxRunningChannelsAndLiveEventsCount |Yes |Max running live event quota |Count |Average |The maximum number of running live events allowed in the current media services account |No Dimensions |
|RunningChannelsAndLiveEventsCount |Yes |Running live event count |Count |Average |The total number of running live events in the current media services account |No Dimensions |
|StreamingPolicyCount |Yes |Streaming Policy count |Count |Average |How many streaming policies are already created in current media service account |No Dimensions |
|StreamingPolicyQuota |Yes |Streaming Policy quota |Count |Average |How many streaming policies are allowed for current media service account |No Dimensions |
|StreamingPolicyQuotaUsedPercentage |Yes |Streaming Policy quota used percentage |Percent |Average |Streaming Policy used percentage in current media service account |No Dimensions |
|TransformQuota |Yes |Transform quota |Count |Average |The Transform quota for the current media service account. |No Dimensions |

## Microsoft.Media/mediaservices/liveEvents  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|IngestBitrate |Yes |Live Event ingest bitrate |BitsPerSecond |Average |The incoming bitrate ingested for a live event, in bits per second. |TrackName |
|IngestDriftValue |Yes |Live Event ingest drift value |Seconds |Maximum |Drift between the timestamp of the ingested content and the system clock, measured in seconds per minute. A non zero value indicates that the ingested content is arriving slower than system clock time. |TrackName |
|IngestLastTimestamp |Yes |Live Event ingest last timestamp |Milliseconds |Maximum |Last timestamp ingested for a live event. |TrackName |
|LiveOutputLastTimestamp |Yes |Last output timestamp |Milliseconds |Maximum |Timestamp of the last fragment uploaded to storage for a live event output. |TrackName |

## Microsoft.Media/mediaservices/streamingEndpoints  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU |Yes |CPU usage |Percent |Average |CPU usage for premium streaming endpoints. This data is not available for standard streaming endpoints. |No Dimensions |
|Egress |Yes |Egress |Bytes |Total |The amount of Egress data, in bytes. |OutputFormat |
|EgressBandwidth |No |Egress bandwidth |BitsPerSecond |Average |Egress bandwidth in bits per second. |No Dimensions |
|Requests |Yes |Requests |Count |Total |Requests to a Streaming Endpoint. |OutputFormat, HttpStatusCode, ErrorCode |
|SuccessE2ELatency |Yes |Success end to end Latency |MilliSeconds |Average |The average latency for successful requests in milliseconds. |OutputFormat |

## Microsoft.Media/videoanalyzers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|IngressBytes |Yes |Ingress Bytes |Bytes |Total |The number of bytes ingressed by the pipeline node. |PipelineKind, PipelineTopology, Pipeline, Node |
|Pipelines |Yes |Pipelines |Count |Total |The number of pipelines of each kind and state |PipelineKind, PipelineTopology, PipelineState |

## Microsoft.MixedReality/remoteRenderingAccounts  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveRenderingSessions |Yes |Active Rendering Sessions |Count |Average |Total number of active rendering sessions |SessionType, SDKVersion |
|AssetsConverted |Yes |Assets Converted |Count |Total |Total number of assets converted |SDKVersion |

## Microsoft.MixedReality/spatialAnchorsAccounts  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AnchorsCreated |Yes |Anchors Created |Count |Total |Number of Anchors created |DeviceFamily, SDKVersion |
|AnchorsDeleted |Yes |Anchors Deleted |Count |Total |Number of Anchors deleted |DeviceFamily, SDKVersion |
|AnchorsQueried |Yes |Anchors Queried |Count |Total |Number of Spatial Anchors queried |DeviceFamily, SDKVersion |
|AnchorsUpdated |Yes |Anchors Updated |Count |Total |Number of Anchors updated |DeviceFamily, SDKVersion |
|PosesFound |Yes |Poses Found |Count |Total |Number of Poses returned |DeviceFamily, SDKVersion |
|TotalDailyAnchors |Yes |Total Daily Anchors |Count |Average |Total number of Anchors - Daily |DeviceFamily, SDKVersion |

## Microsoft.Monitor/accounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveTimeSeries |No |Active Time Series |Count |Maximum | The number of unique time series recently ingested into the account over the previous 12 hours |StampColor |
|ActiveTimeSeriesLimit |No |Active Time Series Limit |Count |Maximum |The limit on the number of unique time series which can be actively ingested into the account |StampColor |
|ActiveTimeSeriesPercentUtilization |No | Active Time Series % Utilization |Percent |Average |The percentage of current active time series account limit being utilized |StampColor |
|EventsPerMinuteIngested |No |Events Per Minute Ingested |Count |Maximum |The number of events per minute recently received |StampColor |
|EventsPerMinuteIngestedLimit |No |Events Per Minute Ingested Limit |Count |Maximum |The maximum number of events per minute which can be received before events become throttled |StampColor |
|EventsPerMinuteIngestedPercentUtilization |No |Events Per Minute Ingested % Utilization |Percent |Average |The percentage of the current metric ingestion rate limit being utilized |StampColor |
|SimpleSamplesStored |No |Simple Data Samples Stored |Count |Maximum |The total number of samples stored for simple sampling types (like sum, count). For Prometheus this is equivalent to the number of samples scraped and ingested. |StampColor |

## Microsoft.NetApp/netAppAccounts/capacityPools  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|VolumePoolAllocatedSize |Yes |Pool Allocated Size |Bytes |Average |Provisioned size of this pool |No Dimensions |
|VolumePoolAllocatedToVolumeThroughput |Yes |Pool allocated throughput |BytesPerSecond |Average |Sum of the throughput of all the volumes belonging to the pool |No Dimensions |
|VolumePoolAllocatedUsed |Yes |Pool Allocated To Volume Size |Bytes |Average |Allocated used size of the pool |No Dimensions |
|VolumePoolProvisionedThroughput |Yes |Provisioned throughput for the pool |BytesPerSecond |Average |Provisioned throughput of this pool |No Dimensions |
|VolumePoolTotalLogicalSize |Yes |Pool Consumed Size |Bytes |Average |Sum of the logical size of all the volumes belonging to the pool |No Dimensions |
|VolumePoolTotalSnapshotSize |Yes |Total Snapshot size for the pool |Bytes |Average |Sum of snapshot size of all volumes in this pool |No Dimensions |

## Microsoft.NetApp/netAppAccounts/capacityPools/volumes  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageReadLatency |Yes |Average read latency |MilliSeconds |Average |Average read latency in milliseconds per operation |No Dimensions |
|AverageWriteLatency |Yes |Average write latency |MilliSeconds |Average |Average write latency in milliseconds per operation |No Dimensions |
|CbsVolumeBackupActive |Yes |Is Volume Backup suspended |Count |Average |Is the backup policy suspended for the volume? 0 if yes, 1 if no. |No Dimensions |
|CbsVolumeLogicalBackupBytes |Yes |Volume Backup Bytes |Bytes |Average |Total bytes backed up for this Volume. |No Dimensions |
|CbsVolumeOperationBackupTransferredBytes |Yes |Volume Backup Operation Last Transferred Bytes |Bytes |Average |Total bytes transferred for last backup operation. |No Dimensions |
|CbsVolumeOperationComplete |Yes |Is Volume Backup Operation Complete |Count |Average |Did the last volume backup or restore operation complete successfully? 1 if yes, 0 if no. |No Dimensions |
|CbsVolumeOperationRestoreTransferredBytes |Yes |Volume Backup Restore Operation Last Transferred Bytes |Bytes |Average |Total bytes transferred for last backup restore operation. |No Dimensions |
|CbsVolumeOperationTransferredBytes |Yes |Volume Backup Last Transferred Bytes |Bytes |Average |Total bytes transferred for last backup or restore operation. |No Dimensions |
|CbsVolumeProtected |Yes |Is Volume Backup Enabled |Count |Average |Is backup enabled for the volume? 1 if yes, 0 if no. |No Dimensions |
|OtherThroughput |Yes |Other throughput |BytesPerSecond |Average |Other throughput (that is not read or write) in bytes per second |No Dimensions |
|ReadIops |Yes |Read iops |CountPerSecond |Average |Read In/out operations per second |No Dimensions |
|ReadThroughput |Yes |Read throughput |BytesPerSecond |Average |Read throughput in bytes per second |No Dimensions |
|TotalThroughput |Yes |Total throughput |BytesPerSecond |Average |Sum of all throughput in bytes per second |No Dimensions |
|VolumeAllocatedSize |Yes |Volume allocated size |Bytes |Average |The provisioned size of a volume |No Dimensions |
|VolumeConsumedSizePercentage |Yes |Percentage Volume Consumed Size |Percent |Average |The percentage of the volume consumed including snapshots. |No Dimensions |
|VolumeCoolTierDataReadSize |Yes |Volume cool tier data read size |Bytes |Average |Data read in using GET per volume |No Dimensions |
|VolumeCoolTierDataWriteSize |Yes |Volume cool tier data write size |Bytes |Average |Data tiered out using PUT per volume |No Dimensions |
|VolumeCoolTierSize |Yes |Volume cool tier size |Bytes |Average |Volume Footprint for Cool Tier |No Dimensions |
|VolumeLogicalSize |Yes |Volume Consumed Size |Bytes |Average |Logical size of the volume (used bytes) |No Dimensions |
|VolumeSnapshotSize |Yes |Volume snapshot size |Bytes |Average |Size of all snapshots in volume |No Dimensions |
|WriteIops |Yes |Write iops |CountPerSecond |Average |Write In/out operations per second |No Dimensions |
|WriteThroughput |Yes |Write throughput |BytesPerSecond |Average |Write throughput in bytes per second |No Dimensions |
|XregionReplicationHealthy |Yes |Is volume replication status healthy |Count |Average |Condition of the relationship, 1 or 0. |No Dimensions |
|XregionReplicationLagTime |Yes |Volume replication lag time |Seconds |Average |The amount of time in seconds by which the data on the mirror lags behind the source. |No Dimensions |
|XregionReplicationLastTransferDuration |Yes |Volume replication last transfer duration |Seconds |Average |The amount of time in seconds it took for the last transfer to complete. |No Dimensions |
|XregionReplicationLastTransferSize |Yes |Volume replication last transfer size |Bytes |Average |The total number of bytes transferred as part of the last transfer. |No Dimensions |
|XregionReplicationRelationshipProgress |Yes |Volume replication progress |Bytes |Average |Total amount of data transferred for the current transfer operation. |No Dimensions |
|XregionReplicationRelationshipTransferring |Yes |Is volume replication transferring |Count |Average |Whether the status of the Volume Replication is 'transferring'. |No Dimensions |
|XregionReplicationTotalTransferBytes |Yes |Volume replication total transfer |Bytes |Average |Cumulative bytes transferred for the relationship. |No Dimensions |

## Microsoft.Network/applicationgateways  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ApplicationGatewayTotalTime |No |Application Gateway Total Time |MilliSeconds |Average |Average time that it takes for a request to be processed and its response to be sent. This is calculated as average of the interval from the time when Application Gateway receives the first byte of an HTTP request to the time when the response send operation finishes. It's important to note that this usually includes the Application Gateway processing time, time that the request and response packets are traveling over the network and the time the backend server took to respond. |Listener |
|AvgRequestCountPerHealthyHost |No |Requests per minute per Healthy Host |Count |Average |Average request count per minute per healthy backend host in a pool |BackendSettingsPool |
|AzwafBotProtection |Yes |WAF Bot Protection Matches |Count |Total |Matched Bot Rules |Action, Category, Mode, CountryCode, PolicyName, PolicyScope |
|AzwafCustomRule |Yes |WAF Custom Rule Matches |Count |Total |Matched Custom Rules |Action, CustomRuleID, Mode, CountryCode, PolicyName, PolicyScope |
|AzwafSecRule |Yes |WAF Managed Rule Matches |Count |Total |Matched Managed Rules |Action, Mode, RuleGroupID, RuleID, CountryCode, PolicyName, PolicyScope, RuleSetName |
|AzwafTotalRequests |Yes |WAF Total Requests |Count |Total |Total number of requests evaluated by WAF |Action, CountryCode, Method, Mode, PolicyName, PolicyScope |
|BackendConnectTime |No |Backend Connect Time |MilliSeconds |Average |Time spent establishing a connection with a backend server |Listener, BackendServer, BackendPool, BackendHttpSetting |
|BackendFirstByteResponseTime |No |Backend First Byte Response Time |MilliSeconds |Average |Time interval between start of establishing a connection to backend server and receiving the first byte of the response header, approximating processing time of backend server |Listener, BackendServer, BackendPool, BackendHttpSetting |
|BackendLastByteResponseTime |No |Backend Last Byte Response Time |MilliSeconds |Average |Time interval between start of establishing a connection to backend server and receiving the last byte of the response body |Listener, BackendServer, BackendPool, BackendHttpSetting |
|BackendResponseStatus |Yes |Backend Response Status |Count |Total |The number of HTTP response codes generated by the backend members. This does not include any response codes generated by the Application Gateway. |BackendServer, BackendPool, BackendHttpSetting, HttpStatusGroup |
|BlockedCount |Yes |Web Application Firewall Blocked Requests Rule Distribution |Count |Total |Web Application Firewall blocked requests rule distribution |RuleGroup, RuleId |
|BytesReceived |Yes |Bytes Received |Bytes |Total |The total number of bytes received by the Application Gateway from the clients |Listener |
|BytesSent |Yes |Bytes Sent |Bytes |Total |The total number of bytes sent by the Application Gateway to the clients |Listener |
|CapacityUnits |No |Current Capacity Units |Count |Average |Capacity Units consumed |No Dimensions |
|ClientRtt |No |Client RTT |MilliSeconds |Average |Average round trip time between clients and Application Gateway. This metric indicates how long it takes to establish connections and return acknowledgements |Listener |
|ComputeUnits |No |Current Compute Units |Count |Average |Compute Units consumed |No Dimensions |
|CpuUtilization |No |CPU Utilization |Percent |Average |Current CPU utilization of the Application Gateway |No Dimensions |
|CurrentConnections |Yes |Current Connections |Count |Total |Count of current connections established with Application Gateway |No Dimensions |
|EstimatedBilledCapacityUnits |No |Estimated Billed Capacity Units |Count |Average |Estimated capacity units that will be charged |No Dimensions |
|FailedRequests |Yes |Failed Requests |Count |Total |Count of failed requests that Application Gateway has served |BackendSettingsPool |
|FixedBillableCapacityUnits |No |Fixed Billable Capacity Units |Count |Average |Minimum capacity units that will be charged |No Dimensions |
|HealthyHostCount |Yes |Healthy Host Count |Count |Average |Number of healthy backend hosts |BackendSettingsPool |
|MatchedCount |Yes |Web Application Firewall Total Rule Distribution |Count |Total |Web Application Firewall Total Rule Distribution for the incoming traffic |RuleGroup, RuleId |
|NewConnectionsPerSecond |No |New connections per second |CountPerSecond |Average |New connections per second established with Application Gateway |No Dimensions |
|ResponseStatus |Yes |Response Status |Count |Total |Http response status returned by Application Gateway |HttpStatusGroup |
|Throughput |No |Throughput |BytesPerSecond |Average |Number of bytes per second the Application Gateway has served |No Dimensions |
|TlsProtocol |Yes |Client TLS Protocol |Count |Total |The number of TLS and non-TLS requests initiated by the client that established connection with the Application Gateway. To view TLS protocol distribution, filter by the dimension TLS Protocol. |Listener, TlsProtocol |
|TotalRequests |Yes |Total Requests |Count |Total |Count of successful requests that Application Gateway has served |BackendSettingsPool |
|UnhealthyHostCount |Yes |Unhealthy Host Count |Count |Average |Number of unhealthy backend hosts |BackendSettingsPool |

## Microsoft.Network/azureFirewalls  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ApplicationRuleHit |Yes |Application rules hit count |Count |Total |Number of times Application rules were hit |Status, Reason, Protocol |
|DataProcessed |Yes |Data processed |Bytes |Total |Total amount of data processed by this firewall |No Dimensions |
|FirewallHealth |Yes |Firewall health state |Percent |Average |Indicates the overall health of this firewall |Status, Reason |
|FirewallLatencyPng |Yes |Latency Probe (Preview) |Milliseconds |Average |Estimate of the average latency of the Firewall as measured by latency probe |No Dimensions |
|NetworkRuleHit |Yes |Network rules hit count |Count |Total |Number of times Network rules were hit |Status, Reason, Protocol |
|SNATPortUtilization |Yes |SNAT port utilization |Percent |Average |Percentage of outbound SNAT ports currently in use |Protocol |
|Throughput |No |Throughput |BitsPerSecond |Average |Throughput processed by this firewall |No Dimensions |

## microsoft.network/bastionHosts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|pingmesh |No |Bastion Communication Status |Count |Average |Communication status shows 1 if all communication is good and 0 if its bad. |No Dimensions |
|sessions |No |Session Count |Count |Total |Sessions Count for the Bastion. View in sum and per instance. |host |
|total |Yes |Total Memory |Count |Average |Total memory stats. |host |
|usage_user |No |CPU Usage |Count |Average |CPU Usage stats. |cpu, host |
|used |Yes |Memory Usage |Count |Average |Memory Usage stats. |host |

## Microsoft.Network/connections  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BitsInPerSecond |Yes |BitsInPerSecond |BitsPerSecond |Average |Bits ingressing Azure per second |No Dimensions |
|BitsOutPerSecond |Yes |BitsOutPerSecond |BitsPerSecond |Average |Bits egressing Azure per second |No Dimensions |

## Microsoft.Network/dnsForwardingRulesets  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ForwardingRuleCount |No |Forwarding Rule Count |Count |Maximum |This metric indicates the number of forwarding rules present in each DNS forwarding ruleset. |No Dimensions |
|VirtualNetworkLinkCount |No |Virtual Network Link Count |Count |Maximum |This metric indicates the number of associated virtual network links to a DNS forwarding ruleset. |No Dimensions |

## Microsoft.Network/dnsResolvers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|InboundEndpointCount |No |Inbound Endpoint Count |Count |Maximum |This metric indicates the number of inbound endpoints created for a DNS Resolver. |No Dimensions |
|OutboundEndpointCount |No |Outbound Endpoint Count |Count |Maximum |This metric indicates the number of outbound endpoints created for a DNS Resolver. |No Dimensions |
|QPS |No |Queries Per Second |Count |Average |This metric indicates the queries per second for a DNS Resolver. (Can be aggregated per EndpointId) |EndpointId |

## Microsoft.Network/dnszones  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|QueryVolume |No |Query Volume |Count |Total |Number of queries served for a DNS zone |No Dimensions |
|RecordSetCapacityUtilization |No |Record Set Capacity Utilization |Percent |Maximum |Percent of Record Set capacity utilized by a DNS zone |No Dimensions |
|RecordSetCount |No |Record Set Count |Count |Maximum |Number of Record Sets in a DNS zone |No Dimensions |

## Microsoft.Network/expressRouteCircuits  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ArpAvailability |Yes |Arp Availability |Percent |Average |ARP Availability from MSEE towards all peers. |PeeringType, Peer |
|BgpAvailability |Yes |Bgp Availability |Percent |Average |BGP Availability from MSEE towards all peers. |PeeringType, Peer |
|BitsInPerSecond |Yes |BitsInPerSecond |BitsPerSecond |Average |Bits ingressing Azure per second |PeeringType, DeviceRole |
|BitsOutPerSecond |Yes |BitsOutPerSecond |BitsPerSecond |Average |Bits egressing Azure per second |PeeringType, DeviceRole |
|FastPathRoutesCountForCircuit |Yes |FastPathRoutesCount |Count |Maximum |Count of fastpath routes configured on circuit |No Dimensions |
|GlobalReachBitsInPerSecond |No |GlobalReachBitsInPerSecond |BitsPerSecond |Average |Bits ingressing Azure per second |PeeredCircuitSKey |
|GlobalReachBitsOutPerSecond |No |GlobalReachBitsOutPerSecond |BitsPerSecond |Average |Bits egressing Azure per second |PeeredCircuitSKey |
|QosDropBitsInPerSecond |Yes |DroppedInBitsPerSecond |BitsPerSecond |Average |Ingress bits of data dropped per second |No Dimensions |
|QosDropBitsOutPerSecond |Yes |DroppedOutBitsPerSecond |BitsPerSecond |Average |Egress bits of data dropped per second |No Dimensions |

## Microsoft.Network/expressRouteCircuits/peerings  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BitsInPerSecond |Yes |BitsInPerSecond |BitsPerSecond |Average |Bits ingressing Azure per second |No Dimensions |
|BitsOutPerSecond |Yes |BitsOutPerSecond |BitsPerSecond |Average |Bits egressing Azure per second |No Dimensions |

## microsoft.network/expressroutegateways  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ErGatewayConnectionBitsInPerSecond |No |Bits In Per Second |BitsPerSecond |Average |Bits per second ingressing Azure via ExpressRoute Gateway which can be further split for specific connections |ConnectionName |
|ErGatewayConnectionBitsOutPerSecond |No |Bits Out Per Second |BitsPerSecond |Average |Bits per second egressing Azure via ExpressRoute Gateway which can be further split for specific connections |ConnectionName |
|ExpressRouteGatewayActiveFlows |No |Active Flows |Count |Average |Number of Active Flows on ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayBitsPerSecond |No |Bits Received Per second |BitsPerSecond |Average |Total Bits received on ExpressRoute Gateway per second |roleInstance |
|ExpressRouteGatewayCountOfRoutesAdvertisedToPeer |Yes |Count Of Routes Advertised to Peer |Count |Maximum |Count Of Routes Advertised To Peer by ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayCountOfRoutesLearnedFromPeer |Yes |Count Of Routes Learned from Peer |Count |Maximum |Count Of Routes Learned From Peer by ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayCpuUtilization |Yes |CPU utilization |Percent |Average |CPU Utilization of the ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayFrequencyOfRoutesChanged |No |Frequency of Routes change |Count |Total |Frequency of Routes change in ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayMaxFlowsCreationRate |No |Max Flows Created Per Second |CountPerSecond |Maximum |Maximum Number of Flows Created Per Second on ExpressRoute Gateway |roleInstance, direction |
|ExpressRouteGatewayNumberOfVmInVnet |No |Number of VMs in the Virtual Network |Count |Maximum |Number of VMs in the Virtual Network |No Dimensions |
|ExpressRouteGatewayPacketsPerSecond |No |Packets received per second |CountPerSecond |Average |Total Packets received on ExpressRoute Gateway per second |roleInstance |

## Microsoft.Network/expressRoutePorts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdminState |Yes |AdminState |Count |Average |Admin state of the port |Link |
|FastPathRoutesCountForDirectPort |Yes |FastPathRoutesCount |Count |Maximum |Count of fastpath routes configured on port |No Dimensions |
|LineProtocol |Yes |LineProtocol |Count |Average |Line protocol status of the port |Link |
|PortBitsInPerSecond |No |BitsInPerSecond |BitsPerSecond |Average |Bits ingressing Azure per second |Link |
|PortBitsOutPerSecond |No |BitsOutPerSecond |BitsPerSecond |Average |Bits egressing Azure per second |Link |
|RxLightLevel |Yes |RxLightLevel |Count |Average |Rx Light level in dBm |Link, Lane |
|TxLightLevel |Yes |TxLightLevel |Count |Average |Tx light level in dBm |Link, Lane |

## Microsoft.Network/frontdoors  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BackendHealthPercentage |Yes |Backend Health Percentage |Percent |Average |The percentage of successful health probes from the HTTP/S proxy to backends |Backend, BackendPool |
|BackendRequestCount |Yes |Backend Request Count |Count |Total |The number of requests sent from the HTTP/S proxy to backends |HttpStatus, HttpStatusGroup, Backend |
|BackendRequestLatency |Yes |Backend Request Latency |MilliSeconds |Average |The time calculated from when the request was sent by the HTTP/S proxy to the backend until the HTTP/S proxy received the last response byte from the backend |Backend |
|BillableResponseSize |Yes |Billable Response Size |Bytes |Total |The number of billable bytes (minimum 2KB per request) sent as responses from HTTP/S proxy to clients. |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry |
|RequestCount |Yes |Request Count |Count |Total |The number of client requests served by the HTTP/S proxy |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry |
|RequestSize |Yes |Request Size |Bytes |Total |The number of bytes sent as requests from clients to the HTTP/S proxy |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry |
|ResponseSize |Yes |Response Size |Bytes |Total |The number of bytes sent as responses from HTTP/S proxy to clients |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry |
|TotalLatency |Yes |Total Latency |MilliSeconds |Average |The time calculated from when the client request was received by the HTTP/S proxy until the client acknowledged the last response byte from the HTTP/S proxy |HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry |
|WebApplicationFirewallRequestCount |Yes |Web Application Firewall Request Count |Count |Total |The number of client requests processed by the Web Application Firewall |PolicyName, RuleName, Action |

## Microsoft.Network/loadBalancers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AllocatedSnatPorts |No |Allocated SNAT Ports |Count |Average |Total number of SNAT ports allocated within time period |FrontendIPAddress, BackendIPAddress, ProtocolType, IsAwaitingRemoval |
|ByteCount |Yes |Byte Count |Bytes |Total |Total number of Bytes transmitted within time period |FrontendIPAddress, FrontendPort, Direction |
|DipAvailability |Yes |Health Probe Status |Count |Average |Average Load Balancer health probe status per time duration |ProtocolType, BackendPort, FrontendIPAddress, FrontendPort, BackendIPAddress |
|GlobalBackendAvailability |Yes |Health Probe Status |Count |Average |Azure Cross-region Load Balancer backend health and status per time duration |FrontendIPAddress, FrontendPort, BackendIPAddress, ProtocolType, FrontendRegion, BackendRegion |
|PacketCount |Yes |Packet Count |Count |Total |Total number of Packets transmitted within time period |FrontendIPAddress, FrontendPort, Direction |
|SnatConnectionCount |Yes |SNAT Connection Count |Count |Total |Total number of new SNAT connections created within time period |FrontendIPAddress, BackendIPAddress, ConnectionState |
|SYNCount |Yes |SYN Count |Count |Total |Total number of SYN Packets transmitted within time period |FrontendIPAddress, FrontendPort, Direction |
|UsedSnatPorts |No |Used SNAT Ports |Count |Average |Total number of SNAT ports used within time period |FrontendIPAddress, BackendIPAddress, ProtocolType, IsAwaitingRemoval |
|VipAvailability |Yes |Data Path Availability |Count |Average |Average Load Balancer data path availability per time duration |FrontendIPAddress, FrontendPort |

## Microsoft.Network/natGateways  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ByteCount |No |Bytes |Bytes |Total |Total number of Bytes transmitted within time period |Protocol, Direction |
|DatapathAvailability |No |Datapath Availability (Preview) |Count |Average |NAT Gateway Datapath Availability |No Dimensions |
|PacketCount |No |Packets |Count |Total |Total number of Packets transmitted within time period |Protocol, Direction |
|PacketDropCount |No |Dropped Packets |Count |Total |Count of dropped packets |No Dimensions |
|SNATConnectionCount |No |SNAT Connection Count |Count |Total |Total concurrent active connections |Protocol, ConnectionState |
|TotalConnectionCount |No |Total SNAT Connection Count |Count |Total |Total number of active SNAT connections |Protocol |

## Microsoft.Network/networkInterfaces  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesReceivedRate |Yes |Bytes Received |Bytes |Total |Number of bytes the Network Interface received |No Dimensions |
|BytesSentRate |Yes |Bytes Sent |Bytes |Total |Number of bytes the Network Interface sent |No Dimensions |
|PacketsReceivedRate |Yes |Packets Received |Count |Total |Number of packets the Network Interface received |No Dimensions |
|PacketsSentRate |Yes |Packets Sent |Count |Total |Number of packets the Network Interface sent |No Dimensions |

## Microsoft.Network/networkWatchers/connectionMonitors  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageRoundtripMs |Yes |Avg. Round-trip Time (ms) (classic) |MilliSeconds |Average |Average network round-trip time (ms) for connectivity monitoring probes sent between source and destination |No Dimensions |
|ChecksFailedPercent |Yes |Checks Failed Percent |Percent |Average |% of connectivity monitoring checks failed |SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName, SourceIP, DestinationIP, SourceSubnet, DestinationSubnet |
|ProbesFailedPercent |Yes |% Probes Failed (classic) |Percent |Average |% of connectivity monitoring probes failed |No Dimensions |
|RoundTripTimeMs |Yes |Round-Trip Time (ms) |MilliSeconds |Average |Round-trip time in milliseconds for the connectivity monitoring checks |SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName, SourceIP, DestinationIP, SourceSubnet, DestinationSubnet |
|TestResult |Yes |Test Result |Count |Average |Connection monitor test result |SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName, TestResultCriterion, SourceIP, DestinationIP, SourceSubnet, DestinationSubnet |

## microsoft.network/p2svpngateways  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|P2SBandwidth |Yes |Gateway P2S Bandwidth |BytesPerSecond |Average |Point-to-site bandwidth of a gateway in bytes per second |Instance |
|P2SConnectionCount |Yes |P2S Connection Count |Count |Total |Point-to-site connection count of a gateway |Protocol, Instance |
|UserVpnRouteCount |No |User Vpn Route Count |Count |Total |Count of P2S User Vpn routes learned by gateway |RouteType, Instance |

## Microsoft.Network/privateDnsZones  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|QueryVolume |No |Query Volume |Count |Total |Number of queries served for a Private DNS zone |No Dimensions |
|RecordSetCapacityUtilization |No |Record Set Capacity Utilization |Percent |Maximum |Percent of Record Set capacity utilized by a Private DNS zone |No Dimensions |
|RecordSetCount |No |Record Set Count |Count |Maximum |Number of Record Sets in a Private DNS zone |No Dimensions |
|VirtualNetworkLinkCapacityUtilization |No |Virtual Network Link Capacity Utilization |Percent |Maximum |Percent of Virtual Network Link capacity utilized by a Private DNS zone |No Dimensions |
|VirtualNetworkLinkCount |No |Virtual Network Link Count |Count |Maximum |Number of Virtual Networks linked to a Private DNS zone |No Dimensions |
|VirtualNetworkWithRegistrationCapacityUtilization |No |Virtual Network Registration Link Capacity Utilization |Percent |Maximum |Percent of Virtual Network Link with auto-registration capacity utilized by a Private DNS zone |No Dimensions |
|VirtualNetworkWithRegistrationLinkCount |No |Virtual Network Registration Link Count |Count |Maximum |Number of Virtual Networks linked to a Private DNS zone with auto-registration enabled |No Dimensions |

## Microsoft.Network/privateEndpoints  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PEBytesIn |Yes |Bytes In |Count |Total |Total number of Bytes Out |No Dimensions |
|PEBytesOut |Yes |Bytes Out |Count |Total |Total number of Bytes Out |No Dimensions |

## Microsoft.Network/privateLinkServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PLSBytesIn |Yes |Bytes In |Count |Total |Total number of Bytes Out |PrivateLinkServiceId |
|PLSBytesOut |Yes |Bytes Out |Count |Total |Total number of Bytes Out |PrivateLinkServiceId |
|PLSNatPortsUsage |Yes |Nat Ports Usage |Percent |Average |Nat Ports Usage |PrivateLinkServiceId, PrivateLinkServiceIPAddress |

## Microsoft.Network/publicIPAddresses  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ByteCount |Yes |Byte Count |Bytes |Total |Total number of Bytes transmitted within time period |Port, Direction |
|BytesDroppedDDoS |Yes |Inbound bytes dropped DDoS |BytesPerSecond |Maximum |Inbound bytes dropped DDoS |No Dimensions |
|BytesForwardedDDoS |Yes |Inbound bytes forwarded DDoS |BytesPerSecond |Maximum |Inbound bytes forwarded DDoS |No Dimensions |
|BytesInDDoS |Yes |Inbound bytes DDoS |BytesPerSecond |Maximum |Inbound bytes DDoS |No Dimensions |
|DDoSTriggerSYNPackets |Yes |Inbound SYN packets to trigger DDoS mitigation |CountPerSecond |Maximum |Inbound SYN packets to trigger DDoS mitigation |No Dimensions |
|DDoSTriggerTCPPackets |Yes |Inbound TCP packets to trigger DDoS mitigation |CountPerSecond |Maximum |Inbound TCP packets to trigger DDoS mitigation |No Dimensions |
|DDoSTriggerUDPPackets |Yes |Inbound UDP packets to trigger DDoS mitigation |CountPerSecond |Maximum |Inbound UDP packets to trigger DDoS mitigation |No Dimensions |
|IfUnderDDoSAttack |Yes |Under DDoS attack or not |Count |Maximum |Under DDoS attack or not |No Dimensions |
|PacketCount |Yes |Packet Count |Count |Total |Total number of Packets transmitted within time period |Port, Direction |
|PacketsDroppedDDoS |Yes |Inbound packets dropped DDoS |CountPerSecond |Maximum |Inbound packets dropped DDoS |No Dimensions |
|PacketsForwardedDDoS |Yes |Inbound packets forwarded DDoS |CountPerSecond |Maximum |Inbound packets forwarded DDoS |No Dimensions |
|PacketsInDDoS |Yes |Inbound packets DDoS |CountPerSecond |Maximum |Inbound packets DDoS |No Dimensions |
|SynCount |Yes |SYN Count |Count |Total |Total number of SYN Packets transmitted within time period |Port, Direction |
|TCPBytesDroppedDDoS |Yes |Inbound TCP bytes dropped DDoS |BytesPerSecond |Maximum |Inbound TCP bytes dropped DDoS |No Dimensions |
|TCPBytesForwardedDDoS |Yes |Inbound TCP bytes forwarded DDoS |BytesPerSecond |Maximum |Inbound TCP bytes forwarded DDoS |No Dimensions |
|TCPBytesInDDoS |Yes |Inbound TCP bytes DDoS |BytesPerSecond |Maximum |Inbound TCP bytes DDoS |No Dimensions |
|TCPPacketsDroppedDDoS |Yes |Inbound TCP packets dropped DDoS |CountPerSecond |Maximum |Inbound TCP packets dropped DDoS |No Dimensions |
|TCPPacketsForwardedDDoS |Yes |Inbound TCP packets forwarded DDoS |CountPerSecond |Maximum |Inbound TCP packets forwarded DDoS |No Dimensions |
|TCPPacketsInDDoS |Yes |Inbound TCP packets DDoS |CountPerSecond |Maximum |Inbound TCP packets DDoS |No Dimensions |
|UDPBytesDroppedDDoS |Yes |Inbound UDP bytes dropped DDoS |BytesPerSecond |Maximum |Inbound UDP bytes dropped DDoS |No Dimensions |
|UDPBytesForwardedDDoS |Yes |Inbound UDP bytes forwarded DDoS |BytesPerSecond |Maximum |Inbound UDP bytes forwarded DDoS |No Dimensions |
|UDPBytesInDDoS |Yes |Inbound UDP bytes DDoS |BytesPerSecond |Maximum |Inbound UDP bytes DDoS |No Dimensions |
|UDPPacketsDroppedDDoS |Yes |Inbound UDP packets dropped DDoS |CountPerSecond |Maximum |Inbound UDP packets dropped DDoS |No Dimensions |
|UDPPacketsForwardedDDoS |Yes |Inbound UDP packets forwarded DDoS |CountPerSecond |Maximum |Inbound UDP packets forwarded DDoS |No Dimensions |
|UDPPacketsInDDoS |Yes |Inbound UDP packets DDoS |CountPerSecond |Maximum |Inbound UDP packets DDoS |No Dimensions |
|VipAvailability |Yes |Data Path Availability |Count |Average |Average IP Address availability per time duration |Port |

## Microsoft.Network/trafficManagerProfiles  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ProbeAgentCurrentEndpointStateByProfileResourceId |Yes |Endpoint Status by Endpoint |Count |Maximum |1 if an endpoint's probe status is "Enabled", 0 otherwise. |EndpointName |
|QpsByEndpoint |Yes |Queries by Endpoint Returned |Count |Total |Number of times a Traffic Manager endpoint was returned in the given time frame |EndpointName |

## Microsoft.Network/virtualHubs  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BgpPeerStatus |No |Bgp Peer Status |Count |Maximum |1 - Connected, 0 - Not connected |routeserviceinstance, bgppeerip, bgppeertype |
|CountOfRoutesAdvertisedToPeer |No |Count Of Routes Advertised To Peer |Count |Maximum |Total number of routes advertised to peer |routeserviceinstance, bgppeerip, bgppeertype |
|CountOfRoutesLearnedFromPeer |No |Count Of Routes Learned From Peer |Count |Maximum |Total number of routes learned from peer |routeserviceinstance, bgppeerip, bgppeertype |
|VirtualHubDataProcessed |No |Data Processed by the Virtual Hub Router |Bytes |Total |Data Processed by the Virtual Hub Router |No Dimensions |

## microsoft.network/virtualnetworkgateways  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageBandwidth |Yes |Gateway S2S Bandwidth |BytesPerSecond |Average |Site-to-site bandwidth of a gateway in bytes per second |Instance |
|BgpPeerStatus |No |BGP Peer Status |Count |Average |Status of BGP peer |BgpPeerAddress, Instance |
|BgpRoutesAdvertised |Yes |BGP Routes Advertised |Count |Total |Count of Bgp Routes Advertised through tunnel |BgpPeerAddress, Instance |
|BgpRoutesLearned |Yes |BGP Routes Learned |Count |Total |Count of Bgp Routes Learned through tunnel |BgpPeerAddress, Instance |
|ExpressRouteGatewayActiveFlows |No |Active Flows |Count |Average |Number of Active Flows on ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayBitsPerSecond |No |Bits Received Per second |BitsPerSecond |Average |Total Bits received on ExpressRoute Gateway per second |roleInstance |
|ExpressRouteGatewayCountOfRoutesAdvertisedToPeer |Yes |Count Of Routes Advertised to Peer |Count |Maximum |Count Of Routes Advertised To Peer by ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayCountOfRoutesLearnedFromPeer |Yes |Count Of Routes Learned from Peer |Count |Maximum |Count Of Routes Learned From Peer by ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayCpuUtilization |Yes |CPU utilization |Percent |Average |CPU Utilization of the ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayFrequencyOfRoutesChanged |No |Frequency of Routes change |Count |Total |Frequency of Routes change in ExpressRoute Gateway |roleInstance |
|ExpressRouteGatewayMaxFlowsCreationRate |No |Max Flows Created Per Second |CountPerSecond |Maximum |Maximum Number of Flows Created Per Second on ExpressRoute Gateway |roleInstance, direction |
|ExpressRouteGatewayNumberOfVmInVnet |No |Number of VMs in the Virtual Network |Count |Maximum |Number of VMs in the Virtual Network |roleInstance |
|ExpressRouteGatewayPacketsPerSecond |No |Packets received per second |CountPerSecond |Average |Total Packets received on ExpressRoute Gateway per second |roleInstance |
|MmsaCount |Yes |Tunnel MMSA Count |Count |Total |MMSA Count |ConnectionName, RemoteIP, Instance |
|P2SBandwidth |Yes |Gateway P2S Bandwidth |BytesPerSecond |Average |Point-to-site bandwidth of a gateway in bytes per second |Instance |
|P2SConnectionCount |Yes |P2S Connection Count |Count |Total |Point-to-site connection count of a gateway |Protocol, Instance |
|QmsaCount |Yes |Tunnel QMSA Count |Count |Total |QMSA Count |ConnectionName, RemoteIP, Instance |
|TunnelAverageBandwidth |Yes |Tunnel Bandwidth |BytesPerSecond |Average |Average bandwidth of a tunnel in bytes per second |ConnectionName, RemoteIP, Instance |
|TunnelEgressBytes |Yes |Tunnel Egress Bytes |Bytes |Total |Outgoing bytes of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelEgressPacketDropCount |Yes |Tunnel Egress Packet Drop Count |Count |Total |Count of outgoing packets dropped by tunnel |ConnectionName, RemoteIP, Instance |
|TunnelEgressPacketDropTSMismatch |Yes |Tunnel Egress TS Mismatch Packet Drop |Count |Total |Outgoing packet drop count from traffic selector mismatch of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelEgressPackets |Yes |Tunnel Egress Packets |Count |Total |Outgoing packet count of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressBytes |Yes |Tunnel Ingress Bytes |Bytes |Total |Incoming bytes of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressPacketDropCount |Yes |Tunnel Ingress Packet Drop Count |Count |Total |Count of incoming packets dropped by tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressPacketDropTSMismatch |Yes |Tunnel Ingress TS Mismatch Packet Drop |Count |Total |Incoming packet drop count from traffic selector mismatch of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressPackets |Yes |Tunnel Ingress Packets |Count |Total |Incoming packet count of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelNatAllocations |No |Tunnel NAT Allocations |Count |Total |Count of allocations for a NAT rule on a tunnel |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelNatedBytes |No |Tunnel NATed Bytes |Bytes |Total |Number of bytes that were NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelNatedPackets |No |Tunnel NATed Packets |Count |Total |Number of packets that were NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelNatFlowCount |No |Tunnel NAT Flows |Count |Total |Number of NAT flows on a tunnel by flow type and NAT rule |NatRule, FlowType, ConnectionName, RemoteIP, Instance |
|TunnelNatPacketDrop |No |Tunnel NAT Packet Drops |Count |Total |Number of NATed packets on a tunnel that dropped by drop type and NAT rule |NatRule, DropType, ConnectionName, RemoteIP, Instance |
|TunnelPeakPackets |Yes |Tunnel Peak PPS |Count |Maximum |Tunnel Peak Packets Per Second |ConnectionName, RemoteIP, Instance |
|TunnelReverseNatedBytes |No |Tunnel Reverse NATed Bytes |Bytes |Total |Number of bytes that were reverse NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelReverseNatedPackets |No |Tunnel Reverse NATed Packets |Count |Total |Number of packets on a tunnel that were reverse NATed by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelTotalFlowCount |Yes |Tunnel Total Flow Count |Count |Total |Total flow count on a tunnel |ConnectionName, RemoteIP, Instance |
|UserVpnRouteCount |No |User Vpn Route Count |Count |Total |Count of P2S User Vpn routes learned by gateway |RouteType, Instance |
|VnetAddressPrefixCount |Yes |VNet Address Prefix Count |Count |Total |Count of Vnet address prefixes behind gateway |Instance |

## Microsoft.Network/virtualNetworks  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesDroppedDDoS |Yes |Inbound bytes dropped DDoS |BytesPerSecond |Maximum |Inbound bytes dropped DDoS |ProtectedIPAddress |
|BytesForwardedDDoS |Yes |Inbound bytes forwarded DDoS |BytesPerSecond |Maximum |Inbound bytes forwarded DDoS |ProtectedIPAddress |
|BytesInDDoS |Yes |Inbound bytes DDoS |BytesPerSecond |Maximum |Inbound bytes DDoS |ProtectedIPAddress |
|DDoSTriggerSYNPackets |Yes |Inbound SYN packets to trigger DDoS mitigation |CountPerSecond |Maximum |Inbound SYN packets to trigger DDoS mitigation |ProtectedIPAddress |
|DDoSTriggerTCPPackets |Yes |Inbound TCP packets to trigger DDoS mitigation |CountPerSecond |Maximum |Inbound TCP packets to trigger DDoS mitigation |ProtectedIPAddress |
|DDoSTriggerUDPPackets |Yes |Inbound UDP packets to trigger DDoS mitigation |CountPerSecond |Maximum |Inbound UDP packets to trigger DDoS mitigation |ProtectedIPAddress |
|IfUnderDDoSAttack |Yes |Under DDoS attack or not |Count |Maximum |Under DDoS attack or not |ProtectedIPAddress |
|PacketsDroppedDDoS |Yes |Inbound packets dropped DDoS |CountPerSecond |Maximum |Inbound packets dropped DDoS |ProtectedIPAddress |
|PacketsForwardedDDoS |Yes |Inbound packets forwarded DDoS |CountPerSecond |Maximum |Inbound packets forwarded DDoS |ProtectedIPAddress |
|PacketsInDDoS |Yes |Inbound packets DDoS |CountPerSecond |Maximum |Inbound packets DDoS |ProtectedIPAddress |
|PingMeshAverageRoundtripMs |Yes |Round trip time for Pings to a VM |MilliSeconds |Average |Round trip time for Pings sent to a destination VM |SourceCustomerAddress, DestinationCustomerAddress |
|PingMeshProbesFailedPercent |Yes |Failed Pings to a VM |Percent |Average |Percent of number of failed Pings to total sent Pings of a destination VM |SourceCustomerAddress, DestinationCustomerAddress |
|TCPBytesDroppedDDoS |Yes |Inbound TCP bytes dropped DDoS |BytesPerSecond |Maximum |Inbound TCP bytes dropped DDoS |ProtectedIPAddress |
|TCPBytesForwardedDDoS |Yes |Inbound TCP bytes forwarded DDoS |BytesPerSecond |Maximum |Inbound TCP bytes forwarded DDoS |ProtectedIPAddress |
|TCPBytesInDDoS |Yes |Inbound TCP bytes DDoS |BytesPerSecond |Maximum |Inbound TCP bytes DDoS |ProtectedIPAddress |
|TCPPacketsDroppedDDoS |Yes |Inbound TCP packets dropped DDoS |CountPerSecond |Maximum |Inbound TCP packets dropped DDoS |ProtectedIPAddress |
|TCPPacketsForwardedDDoS |Yes |Inbound TCP packets forwarded DDoS |CountPerSecond |Maximum |Inbound TCP packets forwarded DDoS |ProtectedIPAddress |
|TCPPacketsInDDoS |Yes |Inbound TCP packets DDoS |CountPerSecond |Maximum |Inbound TCP packets DDoS |ProtectedIPAddress |
|UDPBytesDroppedDDoS |Yes |Inbound UDP bytes dropped DDoS |BytesPerSecond |Maximum |Inbound UDP bytes dropped DDoS |ProtectedIPAddress |
|UDPBytesForwardedDDoS |Yes |Inbound UDP bytes forwarded DDoS |BytesPerSecond |Maximum |Inbound UDP bytes forwarded DDoS |ProtectedIPAddress |
|UDPBytesInDDoS |Yes |Inbound UDP bytes DDoS |BytesPerSecond |Maximum |Inbound UDP bytes DDoS |ProtectedIPAddress |
|UDPPacketsDroppedDDoS |Yes |Inbound UDP packets dropped DDoS |CountPerSecond |Maximum |Inbound UDP packets dropped DDoS |ProtectedIPAddress |
|UDPPacketsForwardedDDoS |Yes |Inbound UDP packets forwarded DDoS |CountPerSecond |Maximum |Inbound UDP packets forwarded DDoS |ProtectedIPAddress |
|UDPPacketsInDDoS |Yes |Inbound UDP packets DDoS |CountPerSecond |Maximum |Inbound UDP packets DDoS |ProtectedIPAddress |

## Microsoft.Network/virtualRouters  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PeeringAvailability |Yes |Bgp Availability |Percent |Average |BGP Availability between VirtualRouter and remote peers |Peer |

## microsoft.network/vpngateways  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageBandwidth |Yes |Gateway S2S Bandwidth |BytesPerSecond |Average |Site-to-site bandwidth of a gateway in bytes per second |Instance |
|BgpPeerStatus |No |BGP Peer Status |Count |Average |Status of BGP peer |BgpPeerAddress, Instance |
|BgpRoutesAdvertised |Yes |BGP Routes Advertised |Count |Total |Count of Bgp Routes Advertised through tunnel |BgpPeerAddress, Instance |
|BgpRoutesLearned |Yes |BGP Routes Learned |Count |Total |Count of Bgp Routes Learned through tunnel |BgpPeerAddress, Instance |
|MmsaCount |Yes |Tunnel MMSA Count |Count |Total |MMSA Count |ConnectionName, RemoteIP, Instance |
|QmsaCount |Yes |Tunnel QMSA Count |Count |Total |QMSA Count |ConnectionName, RemoteIP, Instance |
|TunnelAverageBandwidth |Yes |Tunnel Bandwidth |BytesPerSecond |Average |Average bandwidth of a tunnel in bytes per second |ConnectionName, RemoteIP, Instance |
|TunnelEgressBytes |Yes |Tunnel Egress Bytes |Bytes |Total |Outgoing bytes of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelEgressPacketDropCount |Yes |Tunnel Egress Packet Drop Count |Count |Total |Count of outgoing packets dropped by tunnel |ConnectionName, RemoteIP, Instance |
|TunnelEgressPacketDropTSMismatch |Yes |Tunnel Egress TS Mismatch Packet Drop |Count |Total |Outgoing packet drop count from traffic selector mismatch of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelEgressPackets |Yes |Tunnel Egress Packets |Count |Total |Outgoing packet count of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressBytes |Yes |Tunnel Ingress Bytes |Bytes |Total |Incoming bytes of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressPacketDropCount |Yes |Tunnel Ingress Packet Drop Count |Count |Total |Count of incoming packets dropped by tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressPacketDropTSMismatch |Yes |Tunnel Ingress TS Mismatch Packet Drop |Count |Total |Incoming packet drop count from traffic selector mismatch of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelIngressPackets |Yes |Tunnel Ingress Packets |Count |Total |Incoming packet count of a tunnel |ConnectionName, RemoteIP, Instance |
|TunnelNatAllocations |No |Tunnel NAT Allocations |Count |Total |Count of allocations for a NAT rule on a tunnel |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelNatedBytes |No |Tunnel NATed Bytes |Bytes |Total |Number of bytes that were NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelNatedPackets |No |Tunnel NATed Packets |Count |Total |Number of packets that were NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelNatFlowCount |No |Tunnel NAT Flows |Count |Total |Number of NAT flows on a tunnel by flow type and NAT rule |NatRule, FlowType, ConnectionName, RemoteIP, Instance |
|TunnelNatPacketDrop |No |Tunnel NAT Packet Drops |Count |Total |Number of NATed packets on a tunnel that dropped by drop type and NAT rule |NatRule, DropType, ConnectionName, RemoteIP, Instance |
|TunnelPeakPackets |Yes |Tunnel Peak PPS |Count |Maximum |Tunnel Peak Packets Per Second |ConnectionName, RemoteIP, Instance |
|TunnelReverseNatedBytes |No |Tunnel Reverse NATed Bytes |Bytes |Total |Number of bytes that were reverse NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelReverseNatedPackets |No |Tunnel Reverse NATed Packets |Count |Total |Number of packets on a tunnel that were reverse NATed by a NAT rule |NatRule, ConnectionName, RemoteIP, Instance |
|TunnelTotalFlowCount |Yes |Tunnel Total Flow Count |Count |Total |Total flow count on a tunnel |ConnectionName, RemoteIP, Instance |
|VnetAddressPrefixCount |Yes |VNet Address Prefix Count |Count |Total |Count of Vnet address prefixes behind gateway |Instance |

## Microsoft.NetworkAnalytics/DataConnectors  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DataIngested |No |Data Ingested |Bytes |Total |The volume of data ingested by the pipeline (bytes). |No Dimensions |
|MalformedData |Yes |Malformed Data |Count |Total |The number of files unable to be processed by the pipeline. |No Dimensions |
|ProcessedFileCount |Yes |Processed File Count |Count |Total |The number of files processed by the data connector. |No Dimensions |
|Running |Yes |Running |Unspecified |Count |Values greater than 0 indicate that the pipeline is ready to process data. |No Dimensions |

## Microsoft.NetworkFunction/azureTrafficCollectors  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|count |Yes |Flow Records |Count |Total |Flow Records Processed by ATC. |RoleInstance |
|usage_active |Yes |CPU Usage |Percent |Average |CPU Usage Percentage. |Hostname |
|used_percent |Yes |Memory Usage |Percent |Average |Memory Usage Percentage. |Hostname |

## Microsoft.NotificationHubs/Namespaces/NotificationHubs  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|incoming |Yes |Incoming Messages |Count |Total |The count of all successful send API calls.  |No Dimensions |
|incoming.all.failedrequests |Yes |All Incoming Failed Requests |Count |Total |Total incoming failed requests for a notification hub |No Dimensions |
|incoming.all.requests |Yes |All Incoming Requests |Count |Total |Total incoming requests for a notification hub |No Dimensions |
|incoming.scheduled |Yes |Scheduled Push Notifications Sent |Count |Total |Scheduled Push Notifications Sent |No Dimensions |
|incoming.scheduled.cancel |Yes |Scheduled Push Notifications Cancelled |Count |Total |Scheduled Push Notifications Cancelled |No Dimensions |
|installation.all |Yes |Installation Management Operations |Count |Total |Installation Management Operations |No Dimensions |
|installation.delete |Yes |Delete Installation Operations |Count |Total |Delete Installation Operations |No Dimensions |
|installation.get |Yes |Get Installation Operations |Count |Total |Get Installation Operations |No Dimensions |
|installation.patch |Yes |Patch Installation Operations |Count |Total |Patch Installation Operations |No Dimensions |
|installation.upsert |Yes |Create or Update Installation Operations |Count |Total |Create or Update Installation Operations |No Dimensions |
|notificationhub.pushes |Yes |All Outgoing Notifications |Count |Total |All outgoing notifications of the notification hub |No Dimensions |
|outgoing.allpns.badorexpiredchannel |Yes |Bad or Expired Channel Errors |Count |Total |The count of pushes that failed because the channel/token/registrationId in the registration was expired or invalid. |No Dimensions |
|outgoing.allpns.channelerror |Yes |Channel Errors |Count |Total |The count of pushes that failed because the channel was invalid not associated with the correct app throttled or expired. |No Dimensions |
|outgoing.allpns.invalidpayload |Yes |Payload Errors |Count |Total |The count of pushes that failed because the PNS returned a bad payload error. |No Dimensions |
|outgoing.allpns.pnserror |Yes |External Notification System Errors |Count |Total |The count of pushes that failed because there was a problem communicating with the PNS (excludes authentication problems). |No Dimensions |
|outgoing.allpns.success |Yes |Successful notifications |Count |Total |The count of all successful notifications. |No Dimensions |
|outgoing.apns.badchannel |Yes |APNS Bad Channel Error |Count |Total |The count of pushes that failed because the token is invalid (APNS status code: 8). |No Dimensions |
|outgoing.apns.expiredchannel |Yes |APNS Expired Channel Error |Count |Total |The count of token that were invalidated by the APNS feedback channel. |No Dimensions |
|outgoing.apns.invalidcredentials |Yes |APNS Authorization Errors |Count |Total |The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. |No Dimensions |
|outgoing.apns.invalidnotificationsize |Yes |APNS Invalid Notification Size Error |Count |Total |The count of pushes that failed because the payload was too large (APNS status code: 7). |No Dimensions |
|outgoing.apns.pnserror |Yes |APNS Errors |Count |Total |The count of pushes that failed because of errors communicating with APNS. |No Dimensions |
|outgoing.apns.success |Yes |APNS Successful Notifications |Count |Total |The count of all successful notifications. |No Dimensions |
|outgoing.gcm.authenticationerror |Yes |GCM Authentication Errors |Count |Total |The count of pushes that failed because the PNS did not accept the provided credentials the credentials are blocked or the SenderId is not correctly configured in the app (GCM result: MismatchedSenderId). |No Dimensions |
|outgoing.gcm.badchannel |Yes |GCM Bad Channel Error |Count |Total |The count of pushes that failed because the registrationId in the registration was not recognized (GCM result: Invalid Registration). |No Dimensions |
|outgoing.gcm.expiredchannel |Yes |GCM Expired Channel Error |Count |Total |The count of pushes that failed because the registrationId in the registration was expired (GCM result: NotRegistered). |No Dimensions |
|outgoing.gcm.invalidcredentials |Yes |GCM Authorization Errors (Invalid Credentials) |Count |Total |The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. |No Dimensions |
|outgoing.gcm.invalidnotificationformat |Yes |GCM Invalid Notification Format |Count |Total |The count of pushes that failed because the payload was not formatted correctly (GCM result: InvalidDataKey or InvalidTtl). |No Dimensions |
|outgoing.gcm.invalidnotificationsize |Yes |GCM Invalid Notification Size Error |Count |Total |The count of pushes that failed because the payload was too large (GCM result: MessageTooBig). |No Dimensions |
|outgoing.gcm.pnserror |Yes |GCM Errors |Count |Total |The count of pushes that failed because of errors communicating with GCM. |No Dimensions |
|outgoing.gcm.success |Yes |GCM Successful Notifications |Count |Total |The count of all successful notifications. |No Dimensions |
|outgoing.gcm.throttled |Yes |GCM Throttled Notifications |Count |Total |The count of pushes that failed because GCM throttled this app (GCM status code: 501-599 or result:Unavailable). |No Dimensions |
|outgoing.gcm.wrongchannel |Yes |GCM Wrong Channel Error |Count |Total |The count of pushes that failed because the registrationId in the registration is not associated to the current app (GCM result: InvalidPackageName). |No Dimensions |
|outgoing.mpns.authenticationerror |Yes |MPNS Authentication Errors |Count |Total |The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. |No Dimensions |
|outgoing.mpns.badchannel |Yes |MPNS Bad Channel Error |Count |Total |The count of pushes that failed because the ChannelURI in the registration was not recognized (MPNS status: 404 not found). |No Dimensions |
|outgoing.mpns.channeldisconnected |Yes |MPNS Channel Disconnected |Count |Total |The count of pushes that failed because the ChannelURI in the registration was disconnected (MPNS status: 412 not found). |No Dimensions |
|outgoing.mpns.dropped |Yes |MPNS Dropped Notifications |Count |Total |The count of pushes that were dropped by MPNS (MPNS response header: X-NotificationStatus: QueueFull or Suppressed). |No Dimensions |
|outgoing.mpns.invalidcredentials |Yes |MPNS Invalid Credentials |Count |Total |The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. |No Dimensions |
|outgoing.mpns.invalidnotificationformat |Yes |MPNS Invalid Notification Format |Count |Total |The count of pushes that failed because the payload of the notification was too large. |No Dimensions |
|outgoing.mpns.pnserror |Yes |MPNS Errors |Count |Total |The count of pushes that failed because of errors communicating with MPNS. |No Dimensions |
|outgoing.mpns.success |Yes |MPNS Successful Notifications |Count |Total |The count of all successful notifications. |No Dimensions |
|outgoing.mpns.throttled |Yes |MPNS Throttled Notifications |Count |Total |The count of pushes that failed because MPNS is throttling this app (WNS MPNS: 406 Not Acceptable). |No Dimensions |
|outgoing.wns.authenticationerror |Yes |WNS Authentication Errors |Count |Total |Notification not delivered because of errors communicating with Windows Live invalid credentials or wrong token. |No Dimensions |
|outgoing.wns.badchannel |Yes |WNS Bad Channel Error |Count |Total |The count of pushes that failed because the ChannelURI in the registration was not recognized (WNS status: 404 not found). |No Dimensions |
|outgoing.wns.channeldisconnected |Yes |WNS Channel Disconnected |Count |Total |The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-DeviceConnectionStatus: disconnected). |No Dimensions |
|outgoing.wns.channelthrottled |Yes |WNS Channel Throttled |Count |Total |The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-NotificationStatus:channelThrottled). |No Dimensions |
|outgoing.wns.dropped |Yes |WNS Dropped Notifications |Count |Total |The notification was dropped because the ChannelURI in the registration is throttled (X-WNS-NotificationStatus: dropped but not X-WNS-DeviceConnectionStatus: disconnected). |No Dimensions |
|outgoing.wns.expiredchannel |Yes |WNS Expired Channel Error |Count |Total |The count of pushes that failed because the ChannelURI is expired (WNS status: 410 Gone). |No Dimensions |
|outgoing.wns.invalidcredentials |Yes |WNS Authorization Errors (Invalid Credentials) |Count |Total |The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. (Windows Live does not recognize the credentials). |No Dimensions |
|outgoing.wns.invalidnotificationformat |Yes |WNS Invalid Notification Format |Count |Total |The format of the notification is invalid (WNS status: 400). Note that WNS does not reject all invalid payloads. |No Dimensions |
|outgoing.wns.invalidnotificationsize |Yes |WNS Invalid Notification Size Error |Count |Total |The notification payload is too large (WNS status: 413). |No Dimensions |
|outgoing.wns.invalidtoken |Yes |WNS Authorization Errors (Invalid Token) |Count |Total |The token provided to WNS is not valid (WNS status: 401 Unauthorized). |No Dimensions |
|outgoing.wns.pnserror |Yes |WNS Errors |Count |Total |Notification not delivered because of errors communicating with WNS. |No Dimensions |
|outgoing.wns.success |Yes |WNS Successful Notifications |Count |Total |The count of all successful notifications. |No Dimensions |
|outgoing.wns.throttled |Yes |WNS Throttled Notifications |Count |Total |The count of pushes that failed because WNS is throttling this app (WNS status: 406 Not Acceptable). |No Dimensions |
|outgoing.wns.tokenproviderunreachable |Yes |WNS Authorization Errors (Unreachable) |Count |Total |Windows Live is not reachable. |No Dimensions |
|outgoing.wns.wrongtoken |Yes |WNS Authorization Errors (Wrong Token) |Count |Total |The token provided to WNS is valid but for another application (WNS status: 403 Forbidden). This can happen if the ChannelURI in the registration is associated with another app. Check that the client app is associated with the same app whose credentials are in the notification hub. |No Dimensions |
|registration.all |Yes |Registration Operations |Count |Total |The count of all successful registration operations (creations updates queries and deletions).  |No Dimensions |
|registration.create |Yes |Registration Create Operations |Count |Total |The count of all successful registration creations. |No Dimensions |
|registration.delete |Yes |Registration Delete Operations |Count |Total |The count of all successful registration deletions. |No Dimensions |
|registration.get |Yes |Registration Read Operations |Count |Total |The count of all successful registration queries. |No Dimensions |
|registration.update |Yes |Registration Update Operations |Count |Total |The count of all successful registration updates. |No Dimensions |
|scheduled.pending |Yes |Pending Scheduled Notifications |Count |Total |Pending Scheduled Notifications |No Dimensions |

## Microsoft.OperationalInsights/workspaces  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Average_% Available Memory |Yes |% Available Memory |Count |Average |Average_% Available Memory. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Available Swap Space |Yes |% Available Swap Space |Count |Average |Average_% Available Swap Space. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Committed Bytes In Use |Yes |% Committed Bytes In Use |Count |Average |Average_% Committed Bytes In Use. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% DPC Time |Yes |% DPC Time |Count |Average |Average_% DPC Time. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Free Inodes |Yes |% Free Inodes |Count |Average |Average_% Free Inodes. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Free Space |Yes |% Free Space |Count |Average |Average_% Free Space. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Idle Time |Yes |% Idle Time |Count |Average |Average_% Idle Time. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Interrupt Time |Yes |% Interrupt Time |Count |Average |Average_% Interrupt Time. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% IO Wait Time |Yes |% IO Wait Time |Count |Average |Average_% IO Wait Time. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Nice Time |Yes |% Nice Time |Count |Average |Average_% Nice Time. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Privileged Time |Yes |% Privileged Time |Count |Average |Average_% Privileged Time. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Processor Time |Yes |% Processor Time |Count |Average |Average_% Processor Time. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Used Inodes |Yes |% Used Inodes |Count |Average |Average_% Used Inodes. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Used Memory |Yes |% Used Memory |Count |Average |Average_% Used Memory. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Used Space |Yes |% Used Space |Count |Average |Average_% Used Space. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% Used Swap Space |Yes |% Used Swap Space |Count |Average |Average_% Used Swap Space. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_% User Time |Yes |% User Time |Count |Average |Average_% User Time. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Available MBytes |Yes |Available MBytes |Count |Average |Average_Available MBytes. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Available MBytes Memory |Yes |Available MBytes Memory |Count |Average |Average_Available MBytes Memory. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Available MBytes Swap |Yes |Available MBytes Swap |Count |Average |Average_Available MBytes Swap. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Avg. Disk sec/Read |Yes |Avg. Disk sec/Read |Count |Average |Average_Avg. Disk sec/Read. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Avg. Disk sec/Transfer |Yes |Avg. Disk sec/Transfer |Count |Average |Average_Avg. Disk sec/Transfer. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Avg. Disk sec/Write |Yes |Avg. Disk sec/Write |Count |Average |Average_Avg. Disk sec/Write. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric).  |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Bytes Received/sec |Yes |Bytes Received/sec |Count |Average |Average_Bytes Received/sec. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Bytes Sent/sec |Yes |Bytes Sent/sec |Count |Average |Average_Bytes Sent/sec. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Bytes Total/sec |Yes |Bytes Total/sec |Count |Average |Average_Bytes Total/sec. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Current Disk Queue Length |Yes |Current Disk Queue Length |Count |Average |Average_Current Disk Queue Length. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Disk Read Bytes/sec |Yes |Disk Read Bytes/sec |Count |Average |Average_Disk Read Bytes/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Disk Reads/sec |Yes |Disk Reads/sec |Count |Average |Average_Disk Reads/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Disk Transfers/sec |Yes |Disk Transfers/sec |Count |Average |Average_Disk Transfers/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Disk Write Bytes/sec |Yes |Disk Write Bytes/sec |Count |Average |Average_Disk Write Bytes/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Disk Writes/sec |Yes |Disk Writes/sec |Count |Average |Average_Disk Writes/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Free Megabytes |Yes |Free Megabytes |Count |Average |Average_Free Megabytes. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Free Physical Memory |Yes |Free Physical Memory |Count |Average |Average_Free Physical Memory. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric).  |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Free Space in Paging Files |Yes |Free Space in Paging Files |Count |Average |Average_Free Space in Paging Files. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Free Virtual Memory |Yes |Free Virtual Memory |Count |Average |Average_Free Virtual Memory. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Logical Disk Bytes/sec |Yes |Logical Disk Bytes/sec |Count |Average |Average_Logical Disk Bytes/sec. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Page Reads/sec |Yes |Page Reads/sec |Count |Average |Average_Page Reads/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Page Writes/sec |Yes |Page Writes/sec |Count |Average |Average_Page Writes/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Pages/sec |Yes |Pages/sec |Count |Average |Average_Pages/sec. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Pct Privileged Time |Yes |Pct Privileged Time |Count |Average |Average_Pct Privileged Time. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Pct User Time |Yes |Pct User Time |Count |Average |Average_Pct User Time. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Physical Disk Bytes/sec |Yes |Physical Disk Bytes/sec |Count |Average |Average_Physical Disk Bytes/sec. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Processes |Yes |Processes |Count |Average |Average_Processes. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Processor Queue Length |Yes |Processor Queue Length |Count |Average |Average_Processor Queue Length. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric).  |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Size Stored In Paging Files |Yes |Size Stored In Paging Files |Count |Average |Average_Size Stored In Paging Files. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Bytes |Yes |Total Bytes |Count |Average |Average_Total Bytes. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Bytes Received |Yes |Total Bytes Received |Count |Average |Average_Total Bytes Received. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Bytes Transmitted |Yes |Total Bytes Transmitted |Count |Average |Average_Total Bytes Transmitted. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Collisions |Yes |Total Collisions |Count |Average |Average_Total Collisions. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Packets Received |Yes |Total Packets Received |Count |Average |Average_Total Packets Received. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Packets Transmitted |Yes |Total Packets Transmitted |Count |Average |Average_Total Packets Transmitted. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Rx Errors |Yes |Total Rx Errors |Count |Average |Average_Total Rx Errors. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Total Tx Errors |Yes |Total Tx Errors |Count |Average |Average_Total Tx Errors. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Uptime |Yes |Uptime |Count |Average |Average_Uptime. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Used MBytes Swap Space |Yes |Used MBytes Swap Space |Count |Average |. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Used Memory kBytes |Yes |Used Memory kBytes |Count |Average |Average_Used Memory kBytes. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Used Memory MBytes |Yes |Used Memory MBytes |Count |Average |Average_Used Memory MBytes. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Users |Yes |Users |Count |Average |Average_Users. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Average_Virtual Shared Memory |Yes |Virtual Shared Memory |Count |Average |Average_Virtual Shared Memory. Supported for: Linux. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, ObjectName, InstanceName, CounterPath, SourceSystem |
|Event |Yes |Event |Count |Average |Event. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Source, EventLog, Computer, EventCategory, EventLevel, EventLevelName, EventID |
|Heartbeat |Yes |Heartbeat |Count |Total |Heartbeat. Supported for: Linux, Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, OSType, Version, SourceComputerId |
|Query Count |No |Query Count |Count |Count |Total number of user queries for this workspace. |IsUserQuery |
|Query Failure Count |No |Query Failure Count |Count |Count |Total number of failed user queries for this workspace. |IsUserQuery |
|Query Success Rate |No |Query Success Rate |Percent |Average |User query success rate for this workspace. |IsUserQuery |
|Update |Yes |Update |Count |Average |Update. Supported for: Windows. Part of [metric alerts for logs feature](https://aka.ms/am-log-to-metric). |Computer, Product, Classification, UpdateState, Optional, Approved |

## Microsoft.Orbital/contactProfiles  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ContactFailure |Yes |Contact Failure Count |Count |Count |Denotes the number of failed Contacts for a specific Contact Profile |No Dimensions |
|ContactSuccess |Yes |Contact Success Count |Count |Count |Denotes the number of successful Contacts for a specific Contact Profile |No Dimensions |

## Microsoft.Orbital/l2Connections  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|InBitsRate |Yes |In Bits Rate |BitsPerSecond |Average |Ingress Bit Rate for the L2 connection |No Dimensions |
|InBroadcastPktCount |Yes |In Broadcast Packet Count |Count |Average |Ingress Broadcast Packet Count for the L2 connection |No Dimensions |
|InBytesPerVLAN |Yes |In Bytes Count Per Vlan |Count |Average |Ingress Subinterface Byte Count for the L2 connection |VLANID |
|InInterfaceBytes |Yes |In Bytes Count |Count |Average |Ingress Bytes Count for the L2 connection |No Dimensions |
|InMulticastPktCount |Yes |In Multicast Packet Count |Count |Average |Ingress Multicast Packet Count for the L2 connection |No Dimensions |
|InPktErrorCount |Yes |In Packet Error Count |Count |Average |Ingress Packet Error Count for the L2 connection |No Dimensions |
|InPktsRate |Yes |In Packets Rate |CountPerSecond |Average |Ingress Packet Rate for the L2 connection |No Dimensions |
|InTotalPktCount |Yes |In Packet Count |Count |Average |Ingress Packet Count for the L2 connection |No Dimensions |
|InUcastPktCount |Yes |In Unicast Packet Count |Count |Average |Ingress Unicast Packet Count for the L2 connection |No Dimensions |
|InUCastPktsPerVLAN |Yes |In Unicast Packet Count Per Vlan |Count |Average |Ingress Subinterface Unicast Packet Count for the L2 connection |VLANID |
|OutBitsRate |Yes |Out Bits Rate |BitsPerSecond |Average |Egress Bit Rate for the L2 connection |No Dimensions |
|OutBroadcastPktCount |Yes |Out Broadcast Packet Count Per Vlan |Count |Average |Egress Broadcast Packet Count for the L2 connection |No Dimensions |
|OutBytesPerVLAN |Yes |Out Bytes Count Per Vlan |Count |Average |Egress Subinterface Byte Count for the L2 connection |VLANID |
|OutInterfaceBytes |Yes |Out Bytes Count |Count |Average |Egress Bytes Count for the L2 connection |No Dimensions |
|OutMulticastPktCount |Yes |Out Multicast Packet Count |Count |Average |Egress Multicast Packet Count for the L2 connection |No Dimensions |
|OutPktErrorCount |Yes |Out Packet Error Count |Count |Average |Egress Packet Error Count for the L2 connection |No Dimensions |
|OutPktsRate |Yes |Out Packets Rate |CountPerSecond |Average |Egress Packet Rate for the L2 connection |No Dimensions |
|OutUcastPktCount |Yes |Out Unicast Packet Count |Count |Average |Egress Unicast Packet Count for the L2 connection |No Dimensions |
|OutUCastPktsPerVLAN |Yes |Out Unicast Packet Count Per Vlan |Count |Average |Egress Subinterface Unicast Packet Count for the L2 connection |VLANID |

## Microsoft.Orbital/spacecrafts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ContactFailure |Yes |Contact Failure Count |Count |Count |Denotes the number of failed Contacts for a specific Spacecraft |No Dimensions |
|ContactSuccess |Yes |Contact Success Count |Count |Count |Denotes the number of successful Contacts for a specific Spacecraft |No Dimensions |

## Microsoft.Peering/peerings  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageCustomerPrefixLatency |Yes |Average Customer Prefix Latency |Milliseconds |Average |Average of median Customer prefix latency |RegisteredAsnName |
|EgressTrafficRate |Yes |Egress Traffic Rate |BitsPerSecond |Average |Egress traffic rate in bits per second |ConnectionId, SessionIp, TrafficClass |
|FlapCounts |Yes |Connection Flap Events Count |Count |Sum |Flap Events Count in all the connection |ConnectionId, SessionIp |
|IngressTrafficRate |Yes |Ingress Traffic Rate |BitsPerSecond |Average |Ingress traffic rate in bits per second |ConnectionId, SessionIp, TrafficClass |
|PacketDropRate |Yes |Packets Drop Rate |BitsPerSecond |Average |Packets Drop rate in bits per second |ConnectionId, SessionIp, TrafficClass |
|RegisteredPrefixLatency |Yes |Prefix Latency |Milliseconds |Average |Median prefix latency |RegisteredPrefixName |
|SessionAvailability |Yes |Session Availability |Count |Average |Availability of the peering session |ConnectionId, SessionIp |

## Microsoft.Peering/peeringServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RoundTripTime |Yes |Round Trip Time |Milliseconds |Average |Average round trip time |ConnectionMonitorTestName |

## Microsoft.PlayFab/titles  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PlayerLoggedInCount |Yes |PlayerLoggedInCount |Count |Count |Number of logins by any player in a given title |TitleId |

## Microsoft.PowerBIDedicated/capacities  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|cpu_metric |Yes |CPU (Gen2) |Percent |Average |CPU Utilization. Supported only for Power BI Embedded Generation 2 resources. |No Dimensions |
|overload_metric |Yes |Overload (Gen2) |Count |Average |Resource Overload, 1 if resource is overloaded, otherwise 0. Supported only for Power BI Embedded Generation 2 resources. |No Dimensions |

## microsoft.purview/accounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DataMapCapacityUnits |Yes |Data Map Capacity Units |Count |Total |Indicates Data Map Capacity Units. |No Dimensions |
|DataMapStorageSize |Yes |Data Map Storage Size |Bytes |Total |Indicates the data map storage size. |No Dimensions |
|ScanCancelled |Yes |Scan Cancelled |Count |Total |Indicates the number of scans cancelled. |No Dimensions |
|ScanCompleted |Yes |Scan Completed |Count |Total |Indicates the number of scans completed successfully. |No Dimensions |
|ScanFailed |Yes |Scan Failed |Count |Total |Indicates the number of scans failed. |No Dimensions |
|ScanTimeTaken |Yes |Scan time taken |Seconds |Total |Indicates the total scan time in seconds. |No Dimensions |

## Microsoft.RecoveryServices/Vaults  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BackupHealthEvent |Yes |Backup Health Events (preview) |Count |Count |The count of health events pertaining to backup job health |dataSourceURL, backupInstanceUrl, dataSourceType, healthStatus, backupInstanceName |
|RestoreHealthEvent |Yes |Restore Health Events (preview) |Count |Count |The count of health events pertaining to restore job health |dataSourceURL, backupInstanceUrl, dataSourceType, healthStatus, backupInstanceName |

## Microsoft.Relay/namespaces  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections |No |ActiveConnections |Count |Total |Total ActiveConnections for Microsoft.Relay. |EntityName |
|ActiveListeners |No |ActiveListeners |Count |Total |Total ActiveListeners for Microsoft.Relay. |EntityName |
|BytesTransferred |Yes |BytesTransferred |Bytes |Total |Total BytesTransferred for Microsoft.Relay. |EntityName |
|ListenerConnections-ClientError |No |ListenerConnections-ClientError |Count |Total |ClientError on ListenerConnections for Microsoft.Relay. |EntityName, OperationResult |
|ListenerConnections-ServerError |No |ListenerConnections-ServerError |Count |Total |ServerError on ListenerConnections for Microsoft.Relay. |EntityName, OperationResult |
|ListenerConnections-Success |No |ListenerConnections-Success |Count |Total |Successful ListenerConnections for Microsoft.Relay. |EntityName, OperationResult |
|ListenerConnections-TotalRequests |No |ListenerConnections-TotalRequests |Count |Total |Total ListenerConnections for Microsoft.Relay. |EntityName |
|ListenerDisconnects |No |ListenerDisconnects |Count |Total |Total ListenerDisconnects for Microsoft.Relay. |EntityName |
|SenderConnections-ClientError |No |SenderConnections-ClientError |Count |Total |ClientError on SenderConnections for Microsoft.Relay. |EntityName, OperationResult |
|SenderConnections-ServerError |No |SenderConnections-ServerError |Count |Total |ServerError on SenderConnections for Microsoft.Relay. |EntityName, OperationResult |
|SenderConnections-Success |No |SenderConnections-Success |Count |Total |Successful SenderConnections for Microsoft.Relay. |EntityName, OperationResult |
|SenderConnections-TotalRequests |No |SenderConnections-TotalRequests |Count |Total |Total SenderConnections requests for Microsoft.Relay. |EntityName |
|SenderDisconnects |No |SenderDisconnects |Count |Total |Total SenderDisconnects for Microsoft.Relay. |EntityName |

## microsoft.resources/subscriptions  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Latency |No |Latency |Seconds |Average |Latency data for all requests to Azure Resource Manager |IsCustomerOriginated, Method, Namespace, RequestRegion, ResourceType, StatusCode, StatusCodeClass, Microsoft.SubscriptionId |
|Traffic |No |Traffic |Count |Count |Traffic data for all requests to Azure Resource Manager |IsCustomerOriginated, Method, Namespace, RequestRegion, ResourceType, StatusCode, StatusCodeClass, Microsoft.SubscriptionId |

## Microsoft.Search/searchServices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DocumentsProcessedCount |Yes |Document processed count |Count |Total |Number of documents processed |DataSourceName, Failed, IndexerName, IndexName, SkillsetName |
|SearchLatency |Yes |Search Latency |Seconds |Average |Average search latency for the search service |No Dimensions |
|SearchQueriesPerSecond |Yes |Search queries per second |CountPerSecond |Average |Search queries per second for the search service |No Dimensions |
|SkillExecutionCount |Yes |Skill execution invocation count |Count |Total |Number of skill executions |DataSourceName, Failed, IndexerName, SkillName, SkillsetName, SkillType |
|ThrottledSearchQueriesPercentage |Yes |Throttled search queries percentage |Percent |Average |Percentage of search queries that were throttled for the search service |No Dimensions |

## microsoft.securitydetonation/chambers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CapacityUtilization |No |Capacity Utilization |Percent |Maximum |The percentage of the allocated capacity the resource is actively using. |Region |
|CpuUtilization |No |CPU Utilization |Percent |Average |The percentage of the CPU that is being utilized across the resource. |Region |
|CreateSubmissionApiResult |No |CreateSubmission Api Results |Count |Count |The total number of CreateSubmission API requests, with return code. |OperationName, ServiceTypeName, Region, HttpReturnCode |
|PercentFreeDiskSpace |No |Available Disk Space |Percent |Average |The percent amount of available disk space across the resource. |Region |
|SubmissionDuration |No |Submission Duration |MilliSeconds |Maximum |The submission duration (processing time), from creation to completion. |Region |
|SubmissionsCompleted |No |Completed Submissions / Hr |Count |Maximum |The number of completed submissions / Hr. |Region |
|SubmissionsFailed |No |Failed Submissions / Hr |Count |Maximum |The number of failed submissions / Hr. |Region |
|SubmissionsOutstanding |No |Outstanding Submissions |Count |Average |The average number of outstanding submissions that are queued for processing. |Region |
|SubmissionsSucceeded |No |Successful Submissions / Hr |Count |Maximum |The number of successful submissions / Hr. |Region |

## Microsoft.SecurityDetonation/SecurityDetonationChambers  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|% Processor Time |Yes |% CPU |Percent |Average |Percent CPU utilization |No Dimensions |

## Microsoft.ServiceBus/Namespaces  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AbandonMessage |Yes |Abandoned Messages |Count |Total |Count of messages abandoned on a Queue/Topic. |EntityName |
|ActiveConnections |No |ActiveConnections |Count |Total |Total Active Connections for Microsoft.ServiceBus. |No Dimensions |
|ActiveMessages |No |Count of active messages in a Queue/Topic. |Count |Average |Count of active messages in a Queue/Topic. |EntityName |
|CompleteMessage |Yes |Completed Messages |Count |Total |Count of messages completed on a Queue/Topic. |EntityName |
|ConnectionsClosed |No |Connections Closed. |Count |Average |Connections Closed for Microsoft.ServiceBus. |EntityName |
|ConnectionsOpened |No |Connections Opened. |Count |Average |Connections Opened for Microsoft.ServiceBus. |EntityName |
|CPUXNS |No |CPU (Deprecated) |Percent |Maximum |Service bus premium namespace CPU usage metric. This metric is depricated. Please use the CPU metric (NamespaceCpuUsage) instead. |Replica |
|DeadletteredMessages |No |Count of dead-lettered messages in a Queue/Topic. |Count |Average |Count of dead-lettered messages in a Queue/Topic. |EntityName |
|IncomingMessages |Yes |Incoming Messages |Count |Total |Incoming Messages for Microsoft.ServiceBus. |EntityName |
|IncomingRequests |Yes |Incoming Requests |Count |Total |Incoming Requests for Microsoft.ServiceBus. |EntityName |
|Messages |No |Count of messages in a Queue/Topic. |Count |Average |Count of messages in a Queue/Topic. |EntityName |
|NamespaceCpuUsage |No |CPU |Percent |Maximum |Service bus premium namespace CPU usage metric. |Replica |
|NamespaceMemoryUsage |No |Memory Usage |Percent |Maximum |Service bus premium namespace memory usage metric. |Replica |
|OutgoingMessages |Yes |Outgoing Messages |Count |Total |Outgoing Messages for Microsoft.ServiceBus. |EntityName |
|PendingCheckpointOperationCount |No |Pending Checkpoint Operations Count. |Count |Total |Pending Checkpoint Operations Count. |No Dimensions |
|ScheduledMessages |No |Count of scheduled messages in a Queue/Topic. |Count |Average |Count of scheduled messages in a Queue/Topic. |EntityName |
|ServerErrors |No |Server Errors. |Count |Total |Server Errors for Microsoft.ServiceBus. |EntityName, OperationResult |
|ServerSendLatency |Yes |Server Send Latency. |MilliSeconds |Average |Latency of Send Message operations for Service Bus resources. |EntityName |
|Size |No |Size |Bytes |Average |Size of an Queue/Topic in Bytes. |EntityName |
|SuccessfulRequests |No |Successful Requests |Count |Total |Total successful requests for a namespace |EntityName, OperationResult |
|ThrottledRequests |No |Throttled Requests. |Count |Total |Throttled Requests for Microsoft.ServiceBus. |EntityName, OperationResult, MessagingErrorSubCode |
|UserErrors |No |User Errors. |Count |Total |User Errors for Microsoft.ServiceBus. |EntityName, OperationResult |
|WSXNS |No |Memory Usage (Deprecated) |Percent |Maximum |Service bus premium namespace memory usage metric. This metric is deprecated. Please use the  Memory Usage (NamespaceMemoryUsage) metric instead. |Replica |

## Microsoft.SignalRService/SignalR  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ConnectionCloseCount |Yes |Connection Close Count |Count |Total |The count of connections closed by various reasons. |Endpoint, ConnectionCloseCategory |
|ConnectionCount |Yes |Connection Count |Count |Maximum |The amount of user connection. |Endpoint |
|ConnectionOpenCount |Yes |Connection Open Count |Count |Total |The count of new connections opened. |Endpoint |
|ConnectionQuotaUtilization |Yes |Connection Quota Utilization |Percent |Maximum |The percentage of connection connected relative to connection quota. |No Dimensions |
|InboundTraffic |Yes |Inbound Traffic |Bytes |Total |The inbound traffic of service |No Dimensions |
|MessageCount |Yes |Message Count |Count |Total |The total amount of messages. |No Dimensions |
|OutboundTraffic |Yes |Outbound Traffic |Bytes |Total |The outbound traffic of service |No Dimensions |
|ServerLoad |No |Server Load |Percent |Maximum |SignalR server load. |No Dimensions |
|SystemErrors |Yes |System Errors |Percent |Maximum |The percentage of system errors |No Dimensions |
|UserErrors |Yes |User Errors |Percent |Maximum |The percentage of user errors |No Dimensions |

## Microsoft.SignalRService/WebPubSub  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ConnectionCloseCount |Yes |Connection Close Count |Count |Total |The count of connections closed by various reasons. |ConnectionCloseCategory |
|ConnectionOpenCount |Yes |Connection Open Count |Count |Total |The count of new connections opened. |No Dimensions |
|ConnectionQuotaUtilization |Yes |Connection Quota Utilization |Percent |Maximum |The percentage of connection connected relative to connection quota. |No Dimensions |
|InboundTraffic |Yes |Inbound Traffic |Bytes |Total |The traffic originating from outside to inside of the service. It is aggregated by adding all the bytes of the traffic. |No Dimensions |
|OutboundTraffic |Yes |Outbound Traffic |Bytes |Total |The traffic originating from inside to outside of the service. It is aggregated by adding all the bytes of the traffic. |No Dimensions |
|ServerLoad |No |Server Load |Percent |Maximum |SignalR server load. |No Dimensions |
|TotalConnectionCount |Yes |Connection Count |Count |Maximum |The number of user connections established to the service. It is aggregated by adding all the online connections. |No Dimensions |

## microsoft.singularity/accounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|GpuUtilizationPercentage |Yes |GpuUtilizationPercentage |Percent |Average |GPU utilization percentage |accountname, ClusterName, Environment, instance, jobContainerId, jobInstanceId, jobname, Region |

## Microsoft.Sql/managedInstances  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|avg_cpu_percent |Yes |Average CPU percentage |Percent |Average |Average CPU percentage |No Dimensions |
|io_bytes_read |Yes |IO bytes read |Bytes |Average |IO bytes read |No Dimensions |
|io_bytes_written |Yes |IO bytes written |Bytes |Average |IO bytes written |No Dimensions |
|io_requests |Yes |IO requests count |Count |Average |IO requests count |No Dimensions |
|reserved_storage_mb |Yes |Storage space reserved |Count |Average |Storage space reserved |No Dimensions |
|storage_space_used_mb |Yes |Storage space used |Count |Average |Storage space used |No Dimensions |
|virtual_core_count |Yes |Virtual core count |Count |Average |Virtual core count |No Dimensions |

## Microsoft.Sql/servers/databases  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_queries |Yes |Active queries |Count |Total |Active queries across all workload groups. Applies only to data warehouses. |No Dimensions |
|allocated_data_storage |Yes |Data space allocated |Bytes |Average |Allocated data storage. Not applicable to data warehouses. |No Dimensions |
|app_cpu_billed |Yes |App CPU billed |Count |Total |App CPU billed. Applies to serverless databases. |No Dimensions |
|app_cpu_billed_ha_replicas |Yes |App CPU billed HA replicas |Count |Total |Sum of app CPU billed across all HA replicas associated with the primary replica or a named replica. |No Dimensions |
|app_cpu_percent |Yes |App CPU percentage |Percent |Average |App CPU percentage. Applies to serverless databases. |No Dimensions |
|app_memory_percent |Yes |App memory percentage |Percent |Average |App memory percentage. Applies to serverless databases. |No Dimensions |
|base_blob_size_bytes |Yes |Data storage size |Bytes |Maximum |Data storage size. Applies to Hyperscale databases. |No Dimensions |
|blocked_by_firewall |Yes |Blocked by Firewall |Count |Total |Blocked by Firewall |No Dimensions |
|cache_hit_percent |Yes |Cache hit percentage |Percent |Maximum |Cache hit percentage. Applies only to data warehouses. |No Dimensions |
|cache_used_percent |Yes |Cache used percentage |Percent |Maximum |Cache used percentage. Applies only to data warehouses. |No Dimensions |
|connection_failed |Yes |Failed Connections : System Errors |Count |Total |Failed Connections |Error |
|connection_failed_user_error |Yes |Failed Connections : User Errors |Count |Total |Failed Connections : User Errors |Error |
|connection_successful |Yes |Successful Connections |Count |Total |Successful Connections |SslProtocol |
|cpu_limit |Yes |CPU limit |Count |Average |CPU limit. Applies to vCore-based databases. |No Dimensions |
|cpu_percent |Yes |CPU percentage |Percent |Average |CPU percentage |No Dimensions |
|cpu_used |Yes |CPU used |Count |Average |CPU used. Applies to vCore-based databases. |No Dimensions |
|deadlock |Yes |Deadlocks |Count |Total |Deadlocks. Not applicable to data warehouses. |No Dimensions |
|diff_backup_size_bytes |Yes |Differential backup storage size |Bytes |Maximum |Cumulative differential backup storage size. Applies to vCore-based databases. Not applicable to Hyperscale databases. |No Dimensions |
|dtu_consumption_percent |Yes |DTU percentage |Percent |Average |DTU Percentage. Applies to DTU-based databases. |No Dimensions |
|dtu_limit |Yes |DTU Limit |Count |Average |DTU Limit. Applies to DTU-based databases. |No Dimensions |
|dtu_used |Yes |DTU used |Count |Average |DTU used. Applies to DTU-based databases. |No Dimensions |
|dwu_consumption_percent |Yes |DWU percentage |Percent |Maximum |DWU percentage. Applies only to data warehouses. |No Dimensions |
|dwu_limit |Yes |DWU limit |Count |Maximum |DWU limit. Applies only to data warehouses. |No Dimensions |
|dwu_used |Yes |DWU used |Count |Maximum |DWU used. Applies only to data warehouses. |No Dimensions |
|full_backup_size_bytes |Yes |Full backup storage size |Bytes |Maximum |Cumulative full backup storage size. Applies to vCore-based databases. Not applicable to Hyperscale databases. |No Dimensions |
|ledger_digest_upload_failed |Yes |Failed Ledger Digest Uploads |Count |Count |Ledger digests that failed to be uploaded. |No Dimensions |
|ledger_digest_upload_success |Yes |Successful Ledger Digest Uploads |Count |Count |Ledger digests that were successfully uploaded. |No Dimensions |
|local_tempdb_usage_percent |Yes |Local tempdb percentage |Percent |Average |Local tempdb percentage. Applies only to data warehouses. |No Dimensions |
|log_backup_size_bytes |Yes |Log backup storage size |Bytes |Maximum |Cumulative log backup storage size. Applies to vCore-based and Hyperscale databases. |No Dimensions |
|log_write_percent |Yes |Log IO percentage |Percent |Average |Log IO percentage. Not applicable to data warehouses. |No Dimensions |
|memory_usage_percent |Yes |Memory percentage |Percent |Maximum |Memory percentage. Applies only to data warehouses. |No Dimensions |
|physical_data_read_percent |Yes |Data IO percentage |Percent |Average |Data IO percentage |No Dimensions |
|queued_queries |Yes |Queued queries |Count |Total |Queued queries across all workload groups. Applies only to data warehouses. |No Dimensions |
|sessions_count |Yes |Sessions count |Count |Average |Number of active sessions. Not applicable to Synapse DW Analytics. |No Dimensions |
|sessions_percent |Yes |Sessions percentage |Percent |Average |Sessions percentage. Not applicable to data warehouses. |No Dimensions |
|snapshot_backup_size_bytes |Yes |Data backup storage size |Bytes |Maximum |Cumulative data backup storage size. Applies to Hyperscale databases. |No Dimensions |
|sqlserver_process_core_percent |Yes |SQL Server process core percent |Percent |Maximum |CPU usage as a percentage of the SQL DB process. Not applicable to data warehouses. |No Dimensions |
|sqlserver_process_memory_percent |Yes |SQL Server process memory percent |Percent |Maximum |Memory usage as a percentage of the SQL DB process. Not applicable to data warehouses. |No Dimensions |
|storage |Yes |Data space used |Bytes |Maximum |Data space used. Not applicable to data warehouses. |No Dimensions |
|storage_percent |Yes |Data space used percent |Percent |Maximum |Data space used percent. Not applicable to data warehouses or hyperscale databases. |No Dimensions |
|tempdb_data_size |Yes |Tempdb Data File Size Kilobytes |Count |Maximum |Space used in tempdb data files in kilobytes. Not applicable to data warehouses. |No Dimensions |
|tempdb_log_size |Yes |Tempdb Log File Size Kilobytes |Count |Maximum |Space used in tempdb transaction log file in kilobytes. Not applicable to data warehouses. |No Dimensions |
|tempdb_log_used_percent |Yes |Tempdb Percent Log Used |Percent |Maximum |Space used percentage in tempdb transaction log file. Not applicable to data warehouses. |No Dimensions |
|wlg_active_queries |Yes |Workload group active queries |Count |Total |Active queries within the workload group. Applies only to data warehouses. |WorkloadGroupName, IsUserDefined |
|wlg_active_queries_timeouts |Yes |Workload group query timeouts |Count |Total |Queries that have timed out for the workload group. Applies only to data warehouses. |WorkloadGroupName, IsUserDefined |
|wlg_allocation_relative_to_system_percent |Yes |Workload group allocation by system percent |Percent |Maximum |Allocated percentage of resources relative to the entire system per workload group. Applies only to data warehouses. |WorkloadGroupName, IsUserDefined |
|wlg_allocation_relative_to_wlg_effective_cap_percent |Yes |Workload group allocation by cap resource percent |Percent |Maximum |Allocated percentage of resources relative to the specified cap resources per workload group. Applies only to data warehouses. |WorkloadGroupName, IsUserDefined |
|wlg_effective_cap_resource_percent |Yes |Effective cap resource percent |Percent |Maximum |A hard limit on the percentage of resources allowed for the workload group, taking into account Effective Min Resource Percentage allocated for other workload groups. Applies only to data warehouses. |WorkloadGroupName, IsUserDefined |
|wlg_effective_min_resource_percent |Yes |Effective min resource percent |Percent |Maximum |Minimum percentage of resources reserved and isolated for the workload group, taking into account the service level minimum. Applies only to data warehouses. |WorkloadGroupName, IsUserDefined |
|wlg_queued_queries |Yes |Workload group queued queries |Count |Total |Queued queries within the workload group. Applies only to data warehouses. |WorkloadGroupName, IsUserDefined |
|workers_percent |Yes |Workers percentage |Percent |Average |Workers percentage. Not applicable to data warehouses. |No Dimensions |
|xtp_storage_percent |Yes |In-Memory OLTP storage percent |Percent |Average |In-Memory OLTP storage percent. Not applicable to data warehouses. |No Dimensions |

## Microsoft.Sql/servers/elasticpools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|allocated_data_storage |Yes |Data space allocated |Bytes |Average |Data space allocated. Not applicable to hyperscale |No Dimensions |
|allocated_data_storage_percent |Yes |Data space allocated percent |Percent |Maximum |Data space allocated percent. Not applicable to hyperscale |No Dimensions |
|app_cpu_billed |Yes |App CPU billed |Count |Total |App CPU billed. Applies to serverless elastic pools. |No Dimensions |
|app_cpu_percent |Yes |App CPU percentage |Percent |Average |App CPU percentage. Applies to serverless elastic pools. |No Dimensions |
|app_memory_percent |Yes |App memory percentage |Percent |Average |App memory percentage. Applies to serverless elastic pools. |No Dimensions |
|cpu_limit |Yes |CPU limit |Count |Average |CPU limit. Applies to vCore-based elastic pools. |No Dimensions |
|cpu_percent |Yes |CPU percentage |Percent |Average |CPU percentage |No Dimensions |
|cpu_used |Yes |CPU used |Count |Average |CPU used. Applies to vCore-based elastic pools. |No Dimensions |
|dtu_consumption_percent |Yes |DTU percentage |Percent |Average |DTU Percentage. Applies to DTU-based elastic pools. |No Dimensions |
|eDTU_limit |Yes |eDTU limit |Count |Average |eDTU limit. Applies to DTU-based elastic pools. |No Dimensions |
|eDTU_used |Yes |eDTU used |Count |Average |eDTU used. Applies to DTU-based elastic pools. |No Dimensions |
|log_write_percent |Yes |Log IO percentage |Percent |Average |Log IO percentage |No Dimensions |
|physical_data_read_percent |Yes |Data IO percentage |Percent |Average |Data IO percentage |No Dimensions |
|sessions_count |Yes |Sessions Count |Count |Average |Number of active sessions |No Dimensions |
|sessions_percent |Yes |Sessions percentage |Percent |Average |Sessions percentage |No Dimensions |
|sqlserver_process_core_percent |Yes |SQL Server process core percent |Percent |Maximum |CPU usage as a percentage of the SQL DB process. Applies to elastic pools. |No Dimensions |
|sqlserver_process_memory_percent |Yes |SQL Server process memory percent |Percent |Maximum |Memory usage as a percentage of the SQL DB process. Applies to elastic pools. |No Dimensions |
|storage_limit |Yes |Data max size |Bytes |Average |Data max size. Not applicable to hyperscale |No Dimensions |
|storage_percent |Yes |Data space used percent |Percent |Average |Data space used percent. Not applicable to hyperscale |No Dimensions |
|storage_used |Yes |Data space used |Bytes |Average |Data space used. Not applicable to hyperscale |No Dimensions |
|tempdb_data_size |Yes |Tempdb Data File Size Kilobytes |Count |Maximum |Space used in tempdb data files in kilobytes. |No Dimensions |
|tempdb_log_size |Yes |Tempdb Log File Size Kilobytes |Count |Maximum |Space used in tempdb transaction log file in kilobytes. |No Dimensions |
|tempdb_log_used_percent |Yes |Tempdb Percent Log Used |Percent |Maximum |Space used percentage in tempdb transaction log file |No Dimensions |
|workers_percent |Yes |Workers percentage |Percent |Average |Workers percentage |No Dimensions |
|xtp_storage_percent |Yes |In-Memory OLTP storage percent |Percent |Average |In-Memory OLTP storage percent. Not applicable to hyperscale |No Dimensions |

## Microsoft.Storage/storageAccounts  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|SuccessE2ELatency |Yes |Success E2E Latency |MilliSeconds |Average |The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |MilliSeconds |Average |The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication, TransactionType |
|UsedCapacity |No |Used capacity |Bytes |Average |The amount of storage used by the storage account. For standard storage accounts, it's the sum of capacity used by blob, table, file, and queue. For premium storage accounts and Blob storage accounts, it is the same as BlobCapacity or FileCapacity. |No Dimensions |

## Microsoft.Storage/storageAccounts/blobServices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|BlobCapacity |No |Blob Capacity |Bytes |Average |The amount of storage used by the storage account's Blob service in bytes. |BlobType, Tier |
|BlobCount |No |Blob Count |Count |Average |The number of blob objects stored in the storage account. |BlobType, Tier |
|BlobProvisionedSize |No |Blob Provisioned Size |Bytes |Average |The amount of storage provisioned in the storage account's Blob service in bytes. |BlobType, Tier |
|ContainerCount |Yes |Blob Container Count |Count |Average |The number of containers in the storage account. |No Dimensions |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|IndexCapacity |No |Index Capacity |Bytes |Average |The amount of storage used by Azure Data Lake Storage Gen2 hierarchical index. |No Dimensions |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|SuccessE2ELatency |Yes |Success E2E Latency |MilliSeconds |Average |The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |MilliSeconds |Average |The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication, TransactionType |

## Microsoft.Storage/storageAccounts/fileServices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication, FileShare |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication, FileShare |
|FileCapacity |No |File Capacity |Bytes |Average |The amount of File storage used by the storage account. |FileShare, Tier |
|FileCount |No |File Count |Count |Average |The number of files in the storage account. |FileShare, Tier |
|FileShareCapacityQuota |No |File Share Capacity Quota |Bytes |Average |The upper limit on the amount of storage that can be used by Azure Files Service in bytes. |FileShare |
|FileShareCount |No |File Share Count |Count |Average |The number of file shares in the storage account. |No Dimensions |
|FileShareProvisionedIOPS |No |File Share Provisioned IOPS |CountPerSecond |Average |The baseline number of provisioned IOPS for the premium file share in the premium files storage account. This number is calculated based on the provisioned size (quota) of the share capacity. |FileShare |
|FileShareSnapshotCount |No |File Share Snapshot Count |Count |Average |The number of snapshots present on the share in storage account's Files Service. |FileShare |
|FileShareSnapshotSize |No |File Share Snapshot Size |Bytes |Average |The amount of storage used by the snapshots in storage account's File service in bytes. |FileShare |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication, FileShare |
|SuccessE2ELatency |Yes |Success E2E Latency |MilliSeconds |Average |The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication, FileShare |
|SuccessServerLatency |Yes |Success Server Latency |MilliSeconds |Average |The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication, FileShare |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication, FileShare, TransactionType |

## Microsoft.Storage/storageAccounts/objectReplicationPolicies  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PendingBytesForReplication |No |Pending Bytes for Replication (PREVIEW) |Bytes |Average |The size in bytes of the blob object pending for replication, please note, this metric is in preview and is subject to change before becoming generally available |TimeBucket |
|PendingOperationsForReplication |No |Pending Operations for Replication (PREVIEW) |Count |Average |The count of pending operations for replication, please note, this metric is in preview and is subject to change before becoming generally available |TimeBucket |

## Microsoft.Storage/storageAccounts/queueServices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|QueueCapacity |Yes |Queue Capacity |Bytes |Average |The amount of Queue storage used by the storage account. |No Dimensions |
|QueueCount |Yes |Queue Count |Count |Average |The number of queues in the storage account. |No Dimensions |
|QueueMessageCount |Yes |Queue Message Count |Count |Average |The number of unexpired queue messages in the storage account. |No Dimensions |
|SuccessE2ELatency |Yes |Success E2E Latency |MilliSeconds |Average |The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |MilliSeconds |Average |The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication, TransactionType |

## Microsoft.Storage/storageAccounts/storageTasks  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ObjectsOperatedCount |Yes |Objects operated count |Count |Total |The number of objects operated in storage task |AccountName, TaskAssignmentId |
|ObjectsOperationFailedCount |Yes |Objects failed count |Count |Total |The number of objects failed in storage task |AccountName, TaskAssignmentId |
|ObjectsTargetedCount |Yes |Objects targed count |Count |Total |The number of objects targeted in storage task |AccountName, TaskAssignmentId |

## Microsoft.Storage/storageAccounts/tableServices  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability |Yes |Availability |Percent |Average |The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. |GeoType, ApiName, Authentication |
|Egress |Yes |Egress |Bytes |Total |The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress. |GeoType, ApiName, Authentication |
|Ingress |Yes |Ingress |Bytes |Total |The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. |GeoType, ApiName, Authentication |
|SuccessE2ELatency |Yes |Success E2E Latency |MilliSeconds |Average |The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. |GeoType, ApiName, Authentication |
|SuccessServerLatency |Yes |Success Server Latency |MilliSeconds |Average |The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. |GeoType, ApiName, Authentication |
|TableCapacity |Yes |Table Capacity |Bytes |Average |The amount of Table storage used by the storage account. |No Dimensions |
|TableCount |Yes |Table Count |Count |Average |The number of tables in the storage account. |No Dimensions |
|TableEntityCount |Yes |Table Entity Count |Count |Average |The number of table entities in the storage account. |No Dimensions |
|Transactions |Yes |Transactions |Count |Total |The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response. |ResponseType, GeoType, ApiName, Authentication, TransactionType |

## Microsoft.Storage/storageTasks  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ObjectsOperatedCount |Yes |Objects operated count |Count |Total |The number of objects operated in storage task |AccountName, TaskAssignmentId |
|ObjectsOperationFailedCount |Yes |Objects failed count |Count |Total |The number of objects failed in storage task |AccountName, TaskAssignmentId |
|ObjectsTargetedCount |Yes |Objects targed count |Count |Total |The number of objects targeted in storage task |AccountName, TaskAssignmentId |

## Microsoft.StorageCache/amlFilesystems  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ClientReadOps |No |Client Read Ops |Count |Average |Number of client read ops performed. |ostnum |
|ClientReadThroughput |No |Client Read Throughput |BytesPerSecond |Average |Client read data transfer rate. |ostnum |
|ClientWriteOps |No |Client Write Ops |Count |Average |Number of client write ops performed. |ostnum |
|ClientWriteThroughput |No |Client Write Throughput |BytesPerSecond |Average |Client write data transfer rate. |ostnum |
|MDTBytesAvailable |No |MDT Bytes Available |Bytes |Average |Number of bytes marked as available on the MDT. |mdtnum |
|MDTBytesTotal |No |MDT Bytes Total |Bytes |Average |Total number of bytes supported on the MDT. |mdtnum |
|MDTBytesUsed |No |MDT Bytes Used |Bytes |Average |Number of bytes available for use minus the number of bytes marked as free on the MDT. |mdtnum |
|MDTClientLatency |No |MDT Client Latency |MilliSeconds |Average |Client latency for all operations to MDTs. |mdtnum, operation |
|MDTClientOps |No |Client MDT Ops |Count |Average |Number of client MDT metadata ops performed. |mdtnum, operation |
|MDTConnectedClients |No |MDT Connected Clients |Count |Average |Number of client connections (exports) to the MDT |mdtnum |
|MDTFilesFree |No |MDT Files Free |Count |Average |Count of free files (inodes) on the MDT. |mdtnum |
|MDTFilesTotal |No |MDT Files Total |Count |Average |Total number of files supported on the MDT. |mdtnum |
|MDTFilesUsed |No |MDT Files Used |Count |Average |Number of total supported files minus the number of free files on the MDT. |mdtnum |
|OSTBytesAvailable |No |OST Bytes Available |Bytes |Average |Number of bytes marked as available on the OST. |ostnum |
|OSTBytesTotal |No |OST Bytes Total |Bytes |Average |Total number of bytes supported on the OST. |ostnum |
|OSTBytesUsed |No |OST Bytes Used |Bytes |Average |Number of bytes available for use minus the number of bytes marked as free on the OST. |ostnum |
|OSTClientLatency |No |OST Client Latency |MilliSeconds |Average |Client latency for all operations to OSTs. |ostnum, operation |
|OSTClientOps |No |Client OST Ops |Count |Average |Number of client OST metadata ops performed. |ostnum, operation |
|OSTConnectedClients |No |OST Connected Clients |Count |Average |Number of client connections (exports) to the OST |ostnum |
|OSTFilesFree |No |OST Files Free |Count |Average |Count of free files (inodes) on the OST. |ostnum |
|OSTFilesTotal |No |OST Files Total |Count |Average |Total number of files supported on the OST. |ostnum |
|OSTFilesUsed |No |OST Files Used |Count |Average |Number of total supported files minus the number of free files on the OST. |ostnum |

## Microsoft.StorageCache/caches  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ClientIOPS |Yes |Total Client IOPS |Count |Average |The rate of client file operations processed by the Cache. |No Dimensions |
|ClientLatency |Yes |Average Client Latency |MilliSeconds |Average |Average latency of client file operations to the Cache. |No Dimensions |
|ClientLockIOPS |Yes |Client Lock IOPS |CountPerSecond |Average |Client file locking operations per second. |No Dimensions |
|ClientMetadataReadIOPS |Yes |Client Metadata Read IOPS |CountPerSecond |Average |The rate of client file operations sent to the Cache, excluding data reads, that do not modify persistent state. |No Dimensions |
|ClientMetadataWriteIOPS |Yes |Client Metadata Write IOPS |CountPerSecond |Average |The rate of client file operations sent to the Cache, excluding data writes, that modify persistent state. |No Dimensions |
|ClientReadIOPS |Yes |Client Read IOPS |CountPerSecond |Average |Client read operations per second. |No Dimensions |
|ClientReadThroughput |Yes |Average Cache Read Throughput |BytesPerSecond |Average |Client read data transfer rate. |No Dimensions |
|ClientStatus |Yes |Client Status |Count |Total |Client connection information. |ClientSource, CacheAddress, ClientAddress, Protocol, ConnectionType |
|ClientWriteIOPS |Yes |Client Write IOPS |CountPerSecond |Average |Client write operations per second. |No Dimensions |
|ClientWriteThroughput |Yes |Average Cache Write Throughput |BytesPerSecond |Average |Client write data transfer rate. |No Dimensions |
|FileOps |Yes |File Operations |CountPerSecond |Average |Number of file operations per second. |SourceFile, Rank, FileType |
|FileReads |Yes |File Reads |BytesPerSecond |Average |Number of bytes per second read from a file. |SourceFile, Rank, FileType |
|FileUpdates |Yes |File Updates |CountPerSecond |Average |Number of directory updates and metadata operations per second. |SourceFile, Rank, FileType |
|FileWrites |Yes |File Writes |BytesPerSecond |Average |Number of bytes per second written to a file. |SourceFile, Rank, FileType |
|StorageTargetAsyncWriteThroughput |Yes |StorageTarget Asynchronous Write Throughput |BytesPerSecond |Average |The rate the Cache asynchronously writes data to a particular StorageTarget. These are opportunistic writes that do not cause clients to block. |StorageTarget |
|StorageTargetBlocksRecycled |Yes |Storage Target Blocks Recycled |Count |Average |Total number of 16k cache blocks recycled (freed) per Storage Target. |StorageTarget |
|StorageTargetFillThroughput |Yes |StorageTarget Fill Throughput |BytesPerSecond |Average |The rate the Cache reads data from the StorageTarget to handle a cache miss. |StorageTarget |
|StorageTargetFreeReadSpace |Yes |Storage Target Free Read Space |Bytes |Average |Read space available for caching files associated with a storage target. |StorageTarget |
|StorageTargetFreeWriteSpace |Yes |Storage Target Free Write Space |Bytes |Average |Write space available for changed files associated with a storage target. |StorageTarget |
|StorageTargetHealth |Yes |Storage Target Health |Count |Average |Boolean results of connectivity test between the Cache and Storage Targets. |No Dimensions |
|StorageTargetIOPS |Yes |Total StorageTarget IOPS |Count |Average |The rate of all file operations the Cache sends to a particular StorageTarget. |StorageTarget |
|StorageTargetLatency |Yes |StorageTarget Latency |MilliSeconds |Average |The average round trip latency of all the file operations the Cache sends to a partricular StorageTarget. |StorageTarget |
|StorageTargetMetadataReadIOPS |Yes |StorageTarget Metadata Read IOPS |CountPerSecond |Average |The rate of file operations that do not modify persistent state, and excluding the read operation, that the Cache sends to a particular StorageTarget. |StorageTarget |
|StorageTargetMetadataWriteIOPS |Yes |StorageTarget Metadata Write IOPS |CountPerSecond |Average |The rate of file operations that do modify persistent state and excluding the write operation, that the Cache sends to a particular StorageTarget. |StorageTarget |
|StorageTargetReadAheadThroughput |Yes |StorageTarget Read Ahead Throughput |BytesPerSecond |Average |The rate the Cache opportunisticly reads data from the StorageTarget. |StorageTarget |
|StorageTargetReadIOPS |Yes |StorageTarget Read IOPS |CountPerSecond |Average |The rate of file read operations the Cache sends to a particular StorageTarget. |StorageTarget |
|StorageTargetRecycleRate |Yes |Storage Target Recycle Rate |BytesPerSecond |Average |Cache space recycle rate associated with a storage target in the HPC Cache. This is the rate at which existing data is cleared from the cache to make room for new data. |StorageTarget |
|StorageTargetSpaceAllocation |Yes |Storage Target Space Allocation |Bytes |Average |Total space (read and write) allocated for a storage target. |StorageTarget |
|StorageTargetSyncWriteThroughput |Yes |StorageTarget Synchronous Write Throughput |BytesPerSecond |Average |The rate the Cache synchronously writes data to a particular StorageTarget. These are writes that do cause clients to block. |StorageTarget |
|StorageTargetTotalReadSpace |Yes |Storage Target Total Read Space |Bytes |Average |Total read space allocated for caching files associated with a storage target. |StorageTarget |
|StorageTargetTotalReadThroughput |Yes |StorageTarget Total Read Throughput |BytesPerSecond |Average |The total rate that the Cache reads data from a particular StorageTarget. |StorageTarget |
|StorageTargetTotalWriteSpace |Yes |Storage Target Total Write Space |Bytes |Average |Total write space allocated for changed files associated with a storage target. |StorageTarget |
|StorageTargetTotalWriteThroughput |Yes |StorageTarget Total Write Throughput |BytesPerSecond |Average |The total rate that the Cache writes data to a particular StorageTarget. |StorageTarget |
|StorageTargetUsedReadSpace |Yes |Storage Target Used Read Space |Bytes |Average |Read space used by cached files associated with a storage target. |StorageTarget |
|StorageTargetUsedWriteSpace |Yes |Storage Target Used Write Space |Bytes |Average |Write space used by changed files associated with a storage target. |StorageTarget |
|StorageTargetWriteIOPS |Yes |StorageTarget Write IOPS |Count |Average |The rate of the file write operations the Cache sends to a particular StorageTarget. |StorageTarget |
|TotalBlocksRecycled |Yes |Total Blocks Recycled |Count |Average |Total number of 16k cache blocks recycled (freed) for the HPC Cache. |No Dimensions |
|TotalFreeReadSpace |Yes |Free Read Space |Bytes |Average |Total space available for caching read files. |No Dimensions |
|TotalFreeWriteSpace |Yes |Free Write Read Space |Bytes |Average |Total write space available to store changed data in the cache. |No Dimensions |
|TotalRecycleRate |Yes |Recycle Rate |BytesPerSecond |Average |Total cache space recycle rate in the HPC Cache. This is the rate at which existing data is cleared from the cache to make room for new data. |No Dimensions |
|TotalUsedReadSpace |Yes |Used Read Space |Bytes |Average |Total read space used by changed files for the HPC Cache. |No Dimensions |
|TotalUsedWriteSpace |Yes |Used Write Space |Bytes |Average |Total write space used by changed files for the HPC Cache. |No Dimensions |
|Uptime |Yes |Uptime |Count |Average |Boolean results of connectivity test between the Cache and monitoring system. |No Dimensions |

## Microsoft.StorageMover/storageMovers  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|JobRunScanThroughputItems |Yes |Job Run Scan Throughput Items |CountPerSecond |Average |Job Run scan throughput in items/sec |JobRunName |
|JobRunTransferThroughputBytes |Yes |Job Run Transfer Throughput Bytes |BytesPerSecond |Average |Job Run transfer throughput in bytes/sec |JobRunName |
|JobRunTransferThroughputItems |Yes |Job Run Transfer Throughput Items |CountPerSecond |Average |Job Run transfer throughput in items/sec |JobRunName |

## Microsoft.StorageSync/storageSyncServices  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ServerSyncSessionResult |Yes |Sync Session Result |Count |Average |Metric that logs a value of 1 each time the Server Endpoint successfully completes a Sync Session with the Cloud Endpoint |SyncGroupName, ServerEndpointName, SyncDirection |
|StorageSyncBatchTransferredFileBytes |Yes |Bytes synced |Bytes |Total |Total file size transferred for Sync Sessions |SyncGroupName, ServerEndpointName, SyncDirection |
|StorageSyncComputedCacheHitRate |Yes |Cloud tiering cache hit rate |Percent |Average |Percentage of bytes that were served from the cache |SyncGroupName, ServerName, ServerEndpointName |
|StorageSyncDataSizeByAccessPattern |No |Cache data size by last access time |Bytes |Average |Size of data by last access time |SyncGroupName, ServerName, ServerEndpointName, LastAccessTime |
|StorageSyncIncrementalTieredDataSizeBytes |Yes |Cloud tiering size of data tiered by last maintenance job |Bytes |Total |Size of data tiered during last maintenance job |SyncGroupName, ServerName, ServerEndpointName, TieringReason |
|StorageSyncRecallComputedSuccessRate |Yes |Cloud tiering recall success rate |Percent |Average |Percentage of all recalls that were successful |SyncGroupName, ServerName, ServerEndpointName |
|StorageSyncRecalledNetworkBytesByApplication |Yes |Cloud tiering recall size by application |Bytes |Total |Size of data recalled by application |SyncGroupName, ServerName, ApplicationName |
|StorageSyncRecalledTotalNetworkBytes |Yes |Cloud tiering recall size |Bytes |Total |Size of data recalled |SyncGroupName, ServerName, ServerEndpointName |
|StorageSyncRecallThroughputBytesPerSecond |Yes |Cloud tiering recall throughput |BytesPerSecond |Average |Size of data recall throughput |SyncGroupName, ServerName, ServerEndpointName |
|StorageSyncServerHeartbeat |Yes |Server Online Status |Count |Maximum |Metric that logs a value of 1 each time the resigtered server successfully records a heartbeat with the Cloud Endpoint |ServerName |
|StorageSyncSyncSessionAppliedFilesCount |Yes |Files Synced |Count |Total |Count of Files synced |SyncGroupName, ServerEndpointName, SyncDirection |
|StorageSyncSyncSessionPerItemErrorsCount |Yes |Files not syncing |Count |Average |Count of files failed to sync |SyncGroupName, ServerEndpointName, SyncDirection |
|StorageSyncTieredDataSizeBytes |Yes |Cloud tiering size of data tiered |Bytes |Average |Size of data tiered to Azure file share |SyncGroupName, ServerName, ServerEndpointName |
|StorageSyncTieringCacheSizeBytes |Yes |Server cache size |Bytes |Average |Size of data cached on the server |SyncGroupName, ServerName, ServerEndpointName |

## Microsoft.StreamAnalytics/streamingjobs  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AMLCalloutFailedRequests |Yes |Failed Function Requests |Count |Total |Failed Function Requests |LogicalName, PartitionId, ProcessorInstance, NodeName |
|AMLCalloutInputEvents |Yes |Function Events |Count |Total |Function Events |LogicalName, PartitionId, ProcessorInstance, NodeName |
|AMLCalloutRequests |Yes |Function Requests |Count |Total |Function Requests |LogicalName, PartitionId, ProcessorInstance, NodeName |
|ConversionErrors |Yes |Data Conversion Errors |Count |Total |Data Conversion Errors |LogicalName, PartitionId, ProcessorInstance, NodeName |
|DeserializationError |Yes |Input Deserialization Errors |Count |Total |Input Deserialization Errors |LogicalName, PartitionId, ProcessorInstance, NodeName |
|DroppedOrAdjustedEvents |Yes |Out of order Events |Count |Total |Out of order Events |LogicalName, PartitionId, ProcessorInstance, NodeName |
|EarlyInputEvents |Yes |Early Input Events |Count |Total |Early Input Events |LogicalName, PartitionId, ProcessorInstance, NodeName |
|Errors |Yes |Runtime Errors |Count |Total |Runtime Errors |LogicalName, PartitionId, ProcessorInstance, NodeName |
|InputEventBytes |Yes |Input Event Bytes |Bytes |Total |Input Event Bytes |LogicalName, PartitionId, ProcessorInstance, NodeName |
|InputEvents |Yes |Input Events |Count |Total |Input Events |LogicalName, PartitionId, ProcessorInstance, NodeName |
|InputEventsSourcesBacklogged |Yes |Backlogged Input Events |Count |Maximum |Backlogged Input Events |LogicalName, PartitionId, ProcessorInstance, NodeName |
|InputEventsSourcesPerSecond |Yes |Input Sources Received |Count |Total |Input Sources Received |LogicalName, PartitionId, ProcessorInstance, NodeName |
|LateInputEvents |Yes |Late Input Events |Count |Total |Late Input Events |LogicalName, PartitionId, ProcessorInstance, NodeName |
|OutputEvents |Yes |Output Events |Count |Total |Output Events |LogicalName, PartitionId, ProcessorInstance, NodeName |
|OutputWatermarkDelaySeconds |Yes |Watermark Delay |Seconds |Maximum |Watermark Delay |LogicalName, PartitionId, ProcessorInstance, NodeName |
|ProcessCPUUsagePercentage |Yes |CPU % Utilization |Percent |Maximum |CPU % Utilization |LogicalName, PartitionId, ProcessorInstance, NodeName |
|ResourceUtilization |Yes |SU (Memory) % Utilization |Percent |Maximum |SU (Memory) % Utilization |LogicalName, PartitionId, ProcessorInstance, NodeName |

## Microsoft.Synapse/workspaces  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BuiltinSqlPoolDataProcessedBytes |No |Data processed (bytes) |Bytes |Total |Amount of data processed by queries |No Dimensions |
|BuiltinSqlPoolLoginAttempts |No |Login attempts |Count |Total |Count of login attempts that succeded or failed |Result |
|BuiltinSqlPoolRequestsEnded |No |Requests ended |Count |Total |Count of Requests that succeeded, failed, or were cancelled |Result |
|IntegrationActivityRunsEnded |No |Activity runs ended |Count |Total |Count of integration activities that succeeded, failed, or were cancelled |Result, FailureType, Activity, ActivityType, Pipeline |
|IntegrationLinkConnectionEvents |No |Link connection events |Count |Total |Number of Synapse Link connection events including start, stop and failure. |EventType, LinkConnectionName |
|IntegrationLinkProcessedChangedRows |No |Link processed rows |Count |Total |Changed row count processed by Synapse Link. |TableName, LinkConnectionName |
|IntegrationLinkProcessedDataVolume |No |Link processed data volume (bytes) |Bytes |Total |Data volume in bytes processed by Synapse Link. |TableName, LinkTableStatus, LinkConnectionName |
|IntegrationLinkProcessingLatencyInSeconds |No |Link latency in seconds |Count |Maximum |Synapse Link data processing latency in seconds. |LinkConnectionName |
|IntegrationLinkTableEvents |No |Link table events |Count |Total |Number of Synapse Link table events including snapshot, removal and failure. |TableName, EventType, LinkConnectionName |
|IntegrationPipelineRunsEnded |No |Pipeline runs ended |Count |Total |Count of integration pipeline runs that succeeded, failed, or were cancelled |Result, FailureType, Pipeline |
|IntegrationTriggerRunsEnded |No |Trigger Runs ended |Count |Total |Count of integration triggers that succeeded, failed, or were cancelled |Result, FailureType, Trigger |
|SQLStreamingBackloggedInputEventSources |No |Backlogged input events (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of input events sources backlogged. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingConversionErrors |No |Data conversion errors (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of output events that could not be converted to the expected output schema. Error policy can be changed to 'Drop' to drop events that encounter this scenario. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingDeserializationError |No |Input deserialization errors (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of input events that could not be deserialized. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingEarlyInputEvents |No |Early input events (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of input events which application time is considered early compared to arrival time, according to early arrival policy. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingInputEventBytes |No |Input event bytes (preview) |Count |Total |This is a preview metric available in East US, West Europe. Amount of data received by the streaming job, in bytes. This can be used to validate that events are being sent to the input source. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingInputEvents |No |Input events (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of input events. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingInputEventsSourcesPerSecond |No |Input sources received (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of input events sources per second. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingLateInputEvents |No |Late input events (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of input events which application time is considered late compared to arrival time, according to late arrival policy. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingOutOfOrderEvents |No |Out of order events (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of Event Hub Events (serialized messages) received by the Event Hub Input Adapter, received out of order that were either dropped or given an adjusted timestamp, based on the Event Ordering Policy. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingOutputEvents |No |Output events (preview) |Count |Total |This is a preview metric available in East US, West Europe. Number of output events. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingOutputWatermarkDelaySeconds |No |Watermark delay (preview) |Count |Maximum |This is a preview metric available in East US, West Europe. Output watermark delay in seconds. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingResourceUtilization |No |Resource % utilization (preview) |Percent |Maximum |This is a preview metric available in East US, West Europe.
 Resource utilization expressed as a percentage. High utilization indicates that the job is using close to the maximum allocated resources. |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |
|SQLStreamingRuntimeErrors |No |Runtime errors (preview) |Count |Total |This is a preview metric available in East US, West Europe. Total number of errors related to query processing (excluding errors found while ingesting events or outputting results). |SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance |

## Microsoft.Synapse/workspaces/bigDataPools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BigDataPoolAllocatedCores |No |vCores allocated |Count |Maximum |Allocated vCores for an Apache Spark Pool |SubmitterId |
|BigDataPoolAllocatedMemory |No |Memory allocated (GB) |Count |Maximum |Allocated Memory for Apach Spark Pool (GB) |SubmitterId |
|BigDataPoolApplicationsActive |No |Active Apache Spark applications |Count |Maximum |Total Active Apache Spark Pool Applications |JobState |
|BigDataPoolApplicationsEnded |No |Ended Apache Spark applications |Count |Total |Count of Apache Spark pool applications ended |JobType, JobResult |

## Microsoft.Synapse/workspaces/scopePools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ScopePoolJobPNMetric |Yes |PN duration of SCOPE job |Milliseconds |Average |PN (process node) duration (Milliseconds) used by each SCOPE job |JobType, JobResult |
|ScopePoolJobQueuedDurationMetric |Yes |Queued duration of SCOPE job |Milliseconds |Average |Queued duration (Milliseconds) used by each SCOPE job |JobType |
|ScopePoolJobRunningDurationMetric |Yes |Running duration of SCOPE job |Milliseconds |Average |Running duration (Milliseconds) used by each SCOPE job |JobType, JobResult |

## Microsoft.Synapse/workspaces/sqlPools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveQueries |No |Active queries |Count |Total |The active queries. Using this metric unfiltered and unsplit displays all active queries running on the system |IsUserDefined |
|AdaptiveCacheHitPercent |No |Adaptive cache hit percentage |Percent |Maximum |Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache hit percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache |No Dimensions |
|AdaptiveCacheUsedPercent |No |Adaptive cache used percentage |Percent |Maximum |Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache used percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache |No Dimensions |
|Connections |Yes |Connections |Count |Total |Count of Total logins to the SQL pool |Result |
|ConnectionsBlockedByFirewall |No |Connections blocked by firewall |Count |Total |Count of connections blocked by firewall rules. Revisit access control policies for your SQL pool and monitor these connections if the count is high |No Dimensions |
|CPUPercent |No |CPU used percentage |Percent |Maximum |CPU utilization across all nodes in the SQL pool |No Dimensions |
|DWULimit |No |DWU limit |Count |Maximum |Service level objective of the SQL pool |No Dimensions |
|DWUUsed |No |DWU used |Count |Maximum |Represents a high-level representation of usage across the SQL pool. Measured by DWU limit * DWU percentage |No Dimensions |
|DWUUsedPercent |No |DWU used percentage |Percent |Maximum |Represents a high-level representation of usage across the SQL pool. Measured by taking the maximum between CPU percentage and Data IO percentage |No Dimensions |
|LocalTempDBUsedPercent |No |Local tempdb used percentage |Percent |Maximum |Local tempdb utilization across all compute nodes - values are emitted every five minute |No Dimensions |
|MemoryUsedPercent |No |Memory used percentage |Percent |Maximum |Memory utilization across all nodes in the SQL pool |No Dimensions |
|QueuedQueries |No |Queued queries |Count |Total |Cumulative count of requests queued after the max concurrency limit was reached |IsUserDefined |
|WLGActiveQueries |No |Workload group active queries |Count |Total |The active queries within the workload group. Using this metric unfiltered and unsplit displays all active queries running on the system |IsUserDefined, WorkloadGroup |
|WLGActiveQueriesTimeouts |No |Workload group query timeouts |Count |Total |Queries for the workload group that have timed out. Query timeouts reported by this metric are only once the query has started executing (it does not include wait time due to locking or resource waits) |IsUserDefined, WorkloadGroup |
|WLGAllocationByEffectiveCapResourcePercent |No |Workload group allocation by max resource percent |Percent |Maximum |Displays the percentage allocation of resources relative to the Effective cap resource percent per workload group. This metric provides the effective utilization of the workload group |IsUserDefined, WorkloadGroup |
|WLGAllocationBySystemPercent |No |Workload group allocation by system percent |Percent |Maximum |The percentage allocation of resources relative to the entire system |IsUserDefined, WorkloadGroup |
|WLGEffectiveCapResourcePercent |No |Effective cap resource percent |Percent |Maximum |The effective cap resource percent for the workload group. If there are other workload groups with min_percentage_resource > 0, the effective_cap_percentage_resource is lowered proportionally |IsUserDefined, WorkloadGroup |
|WLGEffectiveMinResourcePercent |No |Effective min resource percent |Percent |Maximum |The effective min resource percentage setting allowed considering the service level and the workload group settings. The effective min_percentage_resource can be adjusted higher on lower service levels |IsUserDefined, WorkloadGroup |
|WLGQueuedQueries |No |Workload group queued queries |Count |Total |Cumulative count of requests queued after the max concurrency limit was reached |IsUserDefined, WorkloadGroup |

## Microsoft.TimeSeriesInsights/environments  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|IngressReceivedBytes |Yes |Ingress Received Bytes |Bytes |Total |Count of bytes read from all event sources |No Dimensions |
|IngressReceivedInvalidMessages |Yes |Ingress Received Invalid Messages |Count |Total |Count of invalid messages read from all Event hub or IoT hub event sources |No Dimensions |
|IngressReceivedMessages |Yes |Ingress Received Messages |Count |Total |Count of messages read from all Event hub or IoT hub event sources |No Dimensions |
|IngressReceivedMessagesCountLag |Yes |Ingress Received Messages Count Lag |Count |Average |Difference between the sequence number of last enqueued message in the event source partition and sequence number of messages being processed in Ingress |No Dimensions |
|IngressReceivedMessagesTimeLag |Yes |Ingress Received Messages Time Lag |Seconds |Maximum |Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress |No Dimensions |
|IngressStoredBytes |Yes |Ingress Stored Bytes |Bytes |Total |Total size of events successfully processed and available for query |No Dimensions |
|IngressStoredEvents |Yes |Ingress Stored Events |Count |Total |Count of flattened events successfully processed and available for query |No Dimensions |
|WarmStorageMaxProperties |Yes |Warm Storage Max Properties |Count |Maximum |Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU |No Dimensions |
|WarmStorageUsedProperties |Yes |Warm Storage Used Properties  |Count |Maximum |Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU |No Dimensions |

## Microsoft.TimeSeriesInsights/environments/eventsources  
<!-- Data source : arm-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|IngressReceivedBytes |Yes |Ingress Received Bytes |Bytes |Total |Count of bytes read from the event source |No Dimensions |
|IngressReceivedInvalidMessages |Yes |Ingress Received Invalid Messages |Count |Total |Count of invalid messages read from the event source |No Dimensions |
|IngressReceivedMessages |Yes |Ingress Received Messages |Count |Total |Count of messages read from the event source |No Dimensions |
|IngressReceivedMessagesCountLag |Yes |Ingress Received Messages Count Lag |Count |Average |Difference between the sequence number of last enqueued message in the event source partition and sequence number of messages being processed in Ingress |No Dimensions |
|IngressReceivedMessagesTimeLag |Yes |Ingress Received Messages Time Lag |Seconds |Maximum |Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress |No Dimensions |
|IngressStoredBytes |Yes |Ingress Stored Bytes |Bytes |Total |Total size of events successfully processed and available for query |No Dimensions |
|IngressStoredEvents |Yes |Ingress Stored Events |Count |Total |Count of flattened events successfully processed and available for query |No Dimensions |
|WarmStorageMaxProperties |Yes |Warm Storage Max Properties |Count |Maximum |Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU |No Dimensions |
|WarmStorageUsedProperties |Yes |Warm Storage Used Properties  |Count |Maximum |Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU |No Dimensions |

## Microsoft.Web/containerapps  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Replicas |Yes |Replica Count |Count |Maximum |Number of replicas count of container app |revisionName, deploymentName |
|Requests |Yes |Requests |Count |Total |Requests processed |revisionName, podName, statusCodeCategory, statusCode |
|RestartCount |Yes |Replica Restart Count |Count |Maximum |Restart count of container app replicas |revisionName, podName |
|RxBytes |Yes |Network In Bytes |Bytes |Total |Network received bytes |revisionName, podName |
|TxBytes |Yes |Network Out Bytes |Bytes |Total |Network transmitted bytes |revisionName, podName |
|UsageNanoCores |Yes |CPU Usage Nanocores |NanoCores |Average |CPU consumed by the container app, in nano cores. 1,000,000,000 nano cores = 1 core |revisionName, podName |
|WorkingSetBytes |Yes |Memory Working Set Bytes |Bytes |Average |Container App working set memory used in bytes. |revisionName, podName |

## Microsoft.Web/hostingEnvironments  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveRequests |Yes |Active Requests (deprecated) |Count |Total |Number of requests being actively handled by the App Service Environment at any given time |Instance |
|AverageResponseTime |Yes |Average Response Time (deprecated) |Seconds |Average |Average time taken for the ASE to serve requests |Instance |
|BytesReceived |Yes |Data In |Bytes |Total |Incoming bandwidth used across all front end instances |Instance |
|BytesSent |Yes |Data Out |Bytes |Total |Outgoing bandwidth used across all front end instances |Instance |
|CpuPercentage |Yes |CPU Percentage |Percent |Average |CPU used across all front end instances |Instance |
|DiskQueueLength |Yes |Disk Queue Length |Count |Average |Number of both read and write requests that were queued on storage |Instance |
|Http101 |Yes |Http 101 |Count |Total |Number of requests resulting in an HTTP 101 status code |Instance |
|Http2xx |Yes |Http 2xx |Count |Total |Number of requests resulting in an HTTP status code ≥ 200 but < 300 |Instance |
|Http3xx |Yes |Http 3xx |Count |Total |Number of requests resulting in an HTTP status code ≥ 300 but < 400 |Instance |
|Http401 |Yes |Http 401 |Count |Total |Number of requests resulting in an HTTP 401 status code |Instance |
|Http403 |Yes |Http 403 |Count |Total |Number of requests resulting in an HTTP 403 status code |Instance |
|Http404 |Yes |Http 404 |Count |Total |Number of requests resulting in an HTTP 404 status code |Instance |
|Http406 |Yes |Http 406 |Count |Total |Number of requests resulting in an HTTP 406 status code |Instance |
|Http4xx |Yes |Http 4xx |Count |Total |Number of requests resulting in an HTTP status code ≥ 400 but < 500 |Instance |
|Http5xx |Yes |Http Server Errors |Count |Total |Number of requests resulting in an HTTP status code ≥ 500 but < 600 |Instance |
|HttpQueueLength |Yes |Http Queue Length |Count |Average |Number of HTTP requests that had to sit on the queue before being fulfilled |Instance |
|HttpResponseTime |Yes |Response Time |Seconds |Average |Time taken for the ASE to serve requests |Instance |
|LargeAppServicePlanInstances |Yes |Large App Service Plan Workers |Count |Average |Number of large App Service Plan worker instances |No Dimensions |
|MediumAppServicePlanInstances |Yes |Medium App Service Plan Workers |Count |Average |Number of medium App Service Plan worker instances |No Dimensions |
|MemoryPercentage |Yes |Memory Percentage |Percent |Average |Memory used across all front end instances |Instance |
|Requests |Yes |Requests |Count |Total |Number of web requests served |Instance |
|SmallAppServicePlanInstances |Yes |Small App Service Plan Workers |Count |Average |Number of small App Service Plan worker instances |No Dimensions |
|TotalFrontEnds |Yes |Total Front Ends |Count |Average |Number of front end instances |No Dimensions |

## Microsoft.Web/hostingenvironments/multirolepools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveRequests |Yes |Active Requests (deprecated) |Count |Total |Active Requests |Instance |
|AverageResponseTime |Yes |Average Response Time (deprecated) |Seconds |Average |The average time taken for the front end to serve requests, in seconds. |Instance |
|BytesReceived |Yes |Data In |Bytes |Total |The average incoming bandwidth used across all front ends, in MiB. |Instance |
|BytesSent |Yes |Data Out |Bytes |Total |The average incoming bandwidth used across all front end, in MiB. |Instance |
|CpuPercentage |Yes |CPU Percentage |Percent |Average |The average CPU used across all instances of front end. |Instance |
|DiskQueueLength |Yes |Disk Queue Length |Count |Average |The average number of both read and write requests that were queued on storage. A high disk queue length is an indication of an app that might be slowing down because of excessive disk I/O. |Instance |
|Http101 |Yes |Http 101 |Count |Total |The count of requests resulting in an HTTP status code 101. |Instance |
|Http2xx |Yes |Http 2xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 200 but < 300. |Instance |
|Http3xx |Yes |Http 3xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 300 but < 400. |Instance |
|Http401 |Yes |Http 401 |Count |Total |The count of requests resulting in HTTP 401 status code. |Instance |
|Http403 |Yes |Http 403 |Count |Total |The count of requests resulting in HTTP 403 status code. |Instance |
|Http404 |Yes |Http 404 |Count |Total |The count of requests resulting in HTTP 404 status code. |Instance |
|Http406 |Yes |Http 406 |Count |Total |The count of requests resulting in HTTP 406 status code. |Instance |
|Http4xx |Yes |Http 4xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 400 but < 500. |Instance |
|Http5xx |Yes |Http Server Errors |Count |Total |The count of requests resulting in an HTTP status code ≥ 500 but < 600. |Instance |
|HttpQueueLength |Yes |Http Queue Length |Count |Average |The average number of HTTP requests that had to sit on the queue before being fulfilled. A high or increasing HTTP Queue length is a symptom of a plan under heavy load. |Instance |
|HttpResponseTime |Yes |Response Time |Seconds |Average |The time taken for the front end to serve requests, in seconds. |Instance |
|LargeAppServicePlanInstances |Yes |Large App Service Plan Workers |Count |Average |Large App Service Plan Workers |No Dimensions |
|MediumAppServicePlanInstances |Yes |Medium App Service Plan Workers |Count |Average |Medium App Service Plan Workers |No Dimensions |
|MemoryPercentage |Yes |Memory Percentage |Percent |Average |The average memory used across all instances of front end. |Instance |
|Requests |Yes |Requests |Count |Total |The total number of requests regardless of their resulting HTTP status code. |Instance |
|SmallAppServicePlanInstances |Yes |Small App Service Plan Workers |Count |Average |Small App Service Plan Workers |No Dimensions |
|TotalFrontEnds |Yes |Total Front Ends |Count |Average |Total Front Ends |No Dimensions |

## Microsoft.Web/hostingenvironments/workerpools  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CpuPercentage |Yes |CPU Percentage |Percent |Average |The average CPU used across all instances of the worker pool. |Instance |
|MemoryPercentage |Yes |Memory Percentage |Percent |Average |The average memory used across all instances of the worker pool. |Instance |
|WorkersAvailable |Yes |Available Workers |Count |Average |Available Workers |No Dimensions |
|WorkersTotal |Yes |Total Workers |Count |Average |Total Workers |No Dimensions |
|WorkersUsed |Yes |Used Workers |Count |Average |Used Workers |No Dimensions |

## Microsoft.Web/serverfarms  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesReceived |Yes |Data In |Bytes |Total |The average incoming bandwidth used across all instances of the plan. |Instance |
|BytesSent |Yes |Data Out |Bytes |Total |The average outgoing bandwidth used across all instances of the plan. |Instance |
|CpuPercentage |Yes |CPU Percentage |Percent |Average |The average CPU used across all instances of the plan. |Instance |
|DiskQueueLength |Yes |Disk Queue Length |Count |Average |The average number of both read and write requests that were queued on storage. A high disk queue length is an indication of an app that might be slowing down because of excessive disk I/O. |Instance |
|HttpQueueLength |Yes |Http Queue Length |Count |Average |The average number of HTTP requests that had to sit on the queue before being fulfilled. A high or increasing HTTP Queue length is a symptom of a plan under heavy load. |Instance |
|MemoryPercentage |Yes |Memory Percentage |Percent |Average |The average memory used across all instances of the plan. |Instance |
|SocketInboundAll |Yes |Socket Count for Inbound Requests |Count |Average |The average number of sockets used for incoming HTTP requests across all the instances of the plan. |Instance |
|SocketLoopback |Yes |Socket Count for Loopback Connections |Count |Average |The average number of sockets used for loopback connections across all the instances of the plan. |Instance |
|SocketOutboundAll |Yes |Socket Count of Outbound Requests |Count |Average |The average number of sockets used for outbound connections across all the instances of the plan irrespective of their TCP states. Having too many outbound connections can cause connectivity errors. |Instance |
|SocketOutboundEstablished |Yes |Established Socket Count for Outbound Requests |Count |Average |The average number of sockets in ESTABLISHED state used for outbound connections across all the instances of the plan. |Instance |
|SocketOutboundTimeWait |Yes |Time Wait Socket Count for Outbound Requests |Count |Average |The average number of sockets in TIME_WAIT state used for outbound connections across all the instances of the plan. High or increasing outbound socket counts in TIME_WAIT state can cause connectivity errors. |Instance |
|TcpCloseWait |Yes |TCP Close Wait |Count |Average |The average number of sockets in CLOSE_WAIT state across all the instances of the plan. |Instance |
|TcpClosing |Yes |TCP Closing |Count |Average |The average number of sockets in CLOSING state across all the instances of the plan. |Instance |
|TcpEstablished |Yes |TCP Established |Count |Average |The average number of sockets in ESTABLISHED state across all the instances of the plan. |Instance |
|TcpFinWait1 |Yes |TCP Fin Wait 1 |Count |Average |The average number of sockets in FIN_WAIT_1 state across all the instances of the plan. |Instance |
|TcpFinWait2 |Yes |TCP Fin Wait 2 |Count |Average |The average number of sockets in FIN_WAIT_2 state across all the instances of the plan. |Instance |
|TcpLastAck |Yes |TCP Last Ack |Count |Average |The average number of sockets in LAST_ACK state across all the instances of the plan. |Instance |
|TcpSynReceived |Yes |TCP Syn Received |Count |Average |The average number of sockets in SYN_RCVD state across all the instances of the plan. |Instance |
|TcpSynSent |Yes |TCP Syn Sent |Count |Average |The average number of sockets in SYN_SENT state across all the instances of the plan. |Instance |
|TcpTimeWait |Yes |TCP Time Wait |Count |Average |The average number of sockets in TIME_WAIT state across all the instances of the plan. |Instance |

## Microsoft.Web/sites  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AppConnections |Yes |Connections |Count |Average |The number of bound sockets existing in the sandbox (w3wp.exe and its child processes). A bound socket is created by calling bind()/connect() APIs and remains until said socket is closed with CloseHandle()/closesocket(). For WebApps and FunctionApps. |Instance |
|AverageMemoryWorkingSet |Yes |Average memory working set |Bytes |Average |The average amount of memory used by the app, in megabytes (MiB). For WebApps and FunctionApps. |Instance |
|AverageResponseTime |Yes |Average Response Time (deprecated) |Seconds |Average |The average time taken for the app to serve requests, in seconds. For WebApps and FunctionApps. |Instance |
|BytesReceived |Yes |Data In |Bytes |Total |The amount of incoming bandwidth consumed by the app, in MiB. For WebApps and FunctionApps. |Instance |
|BytesSent |Yes |Data Out |Bytes |Total |The amount of outgoing bandwidth consumed by the app, in MiB. For WebApps and FunctionApps. |Instance |
|CpuTime |Yes |CPU Time |Seconds |Total |The amount of CPU consumed by the app, in seconds. For more information about this metric. Please see https://aka.ms/website-monitor-cpu-time-vs-cpu-percentage (CPU time vs CPU percentage). For WebApps only. |Instance |
|CurrentAssemblies |Yes |Current Assemblies |Count |Average |The current number of Assemblies loaded across all AppDomains in this application. For WebApps and FunctionApps. |Instance |
|FileSystemUsage |Yes |File System Usage |Bytes |Average |Percentage of filesystem quota consumed by the app. For WebApps and FunctionApps. |No Dimensions |
|FunctionExecutionCount |Yes |Function Execution Count |Count |Total |Function Execution Count. For FunctionApps only. |Instance |
|FunctionExecutionUnits |Yes |Function Execution Units |Count |Total |Function Execution Units. For FunctionApps only. |Instance |
|Gen0Collections |Yes |Gen 0 Garbage Collections |Count |Total |The number of times the generation 0 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs. For WebApps and FunctionApps. |Instance |
|Gen1Collections |Yes |Gen 1 Garbage Collections |Count |Total |The number of times the generation 1 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs. For WebApps and FunctionApps. |Instance |
|Gen2Collections |Yes |Gen 2 Garbage Collections |Count |Total |The number of times the generation 2 objects are garbage collected since the start of the app process. For WebApps and FunctionApps. |Instance |
|Handles |Yes |Handle Count |Count |Average |The total number of handles currently open by the app process. For WebApps and FunctionApps. |Instance |
|HealthCheckStatus |Yes |Health check status |Count |Average |Health check status. For WebApps and FunctionApps. |Instance |
|Http101 |Yes |Http 101 |Count |Total |The count of requests resulting in an HTTP status code 101. For WebApps and FunctionApps. |Instance |
|Http2xx |Yes |Http 2xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 200 but < 300. For WebApps and FunctionApps. |Instance |
|Http3xx |Yes |Http 3xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 300 but < 400. For WebApps and FunctionApps. |Instance |
|Http401 |Yes |Http 401 |Count |Total |The count of requests resulting in HTTP 401 status code. For WebApps and FunctionApps. |Instance |
|Http403 |Yes |Http 403 |Count |Total |The count of requests resulting in HTTP 403 status code. For WebApps and FunctionApps. |Instance |
|Http404 |Yes |Http 404 |Count |Total |The count of requests resulting in HTTP 404 status code. For WebApps and FunctionApps. |Instance |
|Http406 |Yes |Http 406 |Count |Total |The count of requests resulting in HTTP 406 status code. For WebApps and FunctionApps. |Instance |
|Http4xx |Yes |Http 4xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 400 but < 500. For WebApps and FunctionApps. |Instance |
|Http5xx |Yes |Http Server Errors |Count |Total |The count of requests resulting in an HTTP status code ≥ 500 but < 600. For WebApps and FunctionApps. |Instance |
|HttpResponseTime |Yes |Response Time |Seconds |Average |The time taken for the app to serve requests, in seconds. For WebApps and FunctionApps. |Instance |
|IoOtherBytesPerSecond |Yes |IO Other Bytes Per Second |BytesPerSecond |Total |The rate at which the app process is issuing bytes to I/O operations that don't involve data, such as control operations. For WebApps and FunctionApps. |Instance |
|IoOtherOperationsPerSecond |Yes |IO Other Operations Per Second |BytesPerSecond |Total |The rate at which the app process is issuing I/O operations that aren't read or write operations. For WebApps and FunctionApps. |Instance |
|IoReadBytesPerSecond |Yes |IO Read Bytes Per Second |BytesPerSecond |Total |The rate at which the app process is reading bytes from I/O operations. For WebApps and FunctionApps. |Instance |
|IoReadOperationsPerSecond |Yes |IO Read Operations Per Second |BytesPerSecond |Total |The rate at which the app process is issuing read I/O operations. For WebApps and FunctionApps. |Instance |
|IoWriteBytesPerSecond |Yes |IO Write Bytes Per Second |BytesPerSecond |Total |The rate at which the app process is writing bytes to I/O operations. For WebApps and FunctionApps. |Instance |
|IoWriteOperationsPerSecond |Yes |IO Write Operations Per Second |BytesPerSecond |Total |The rate at which the app process is issuing write I/O operations. For WebApps and FunctionApps. |Instance |
|MemoryWorkingSet |Yes |Memory working set |Bytes |Average |The current amount of memory used by the app, in MiB. For WebApps and FunctionApps. |Instance |
|PrivateBytes |Yes |Private Bytes |Bytes |Average |Private Bytes is the current size, in bytes, of memory that the app process has allocated that can't be shared with other processes. For WebApps and FunctionApps. |Instance |
|Requests |Yes |Requests |Count |Total |The total number of requests regardless of their resulting HTTP status code. For WebApps and FunctionApps. |Instance |
|RequestsInApplicationQueue |Yes |Requests In Application Queue |Count |Average |The number of requests in the application request queue. For WebApps and FunctionApps. |Instance |
|Threads |Yes |Thread Count |Count |Average |The number of threads currently active in the app process. For WebApps and FunctionApps. |Instance |
|TotalAppDomains |Yes |Total App Domains |Count |Average |The current number of AppDomains loaded in this application. For WebApps and FunctionApps. |Instance |
|TotalAppDomainsUnloaded |Yes |Total App Domains Unloaded |Count |Average |The total number of AppDomains unloaded since the start of the application. For WebApps and FunctionApps. |Instance |
|WorkflowActionsCompleted |Yes |Workflow Action Completed Count |Count |Total |Workflow Action Completed Count. For LogicApps only. |workflowName, status |
|WorkflowJobExecutionDelay |Yes |Workflow Job Execution Delay |Seconds |Average |Workflow Job Execution Delay. For LogicApps only. |workflowName |
|WorkflowJobExecutionDuration |Yes |Workflow Job Execution Duration |Seconds |Average |Workflow Job Execution Duration. For LogicApps only. |workflowName |
|WorkflowRunsCompleted |Yes |Workflow Runs Completed Count |Count |Total |Workflow Runs Completed Count. For LogicApps only. |workflowName, status |
|WorkflowRunsDispatched |Yes |Workflow Runs dispatched Count |Count |Total |Workflow Runs Dispatched Count. For LogicApps only. |workflowName |
|WorkflowRunsStarted |Yes |Workflow Runs Started Count |Count |Total |Workflow Runs Started Count. For LogicApps only. |workflowName |
|WorkflowTriggersCompleted |Yes |Workflow Triggers Completed Count |Count |Total |Workflow Triggers Completed Count. For LogicApps only. |workflowName, status |

## Microsoft.Web/sites/slots  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AppConnections |Yes |Connections |Count |Average |The number of bound sockets existing in the sandbox (w3wp.exe and its child processes). A bound socket is created by calling bind()/connect() APIs and remains until said socket is closed with CloseHandle()/closesocket(). |Instance |
|AverageMemoryWorkingSet |Yes |Average memory working set |Bytes |Average |The average amount of memory used by the app, in megabytes (MiB). |Instance |
|AverageResponseTime |Yes |Average Response Time (deprecated) |Seconds |Average |The average time taken for the app to serve requests, in seconds. |Instance |
|BytesReceived |Yes |Data In |Bytes |Total |The amount of incoming bandwidth consumed by the app, in MiB. |Instance |
|BytesSent |Yes |Data Out |Bytes |Total |The amount of outgoing bandwidth consumed by the app, in MiB. |Instance |
|CpuTime |Yes |CPU Time |Seconds |Total |The amount of CPU consumed by the app, in seconds. For more information about this metric. Please see https://aka.ms/website-monitor-cpu-time-vs-cpu-percentage (CPU time vs CPU percentage). |Instance |
|CurrentAssemblies |Yes |Current Assemblies |Count |Average |The current number of Assemblies loaded across all AppDomains in this application. |Instance |
|FileSystemUsage |Yes |File System Usage |Bytes |Average |Percentage of filesystem quota consumed by the app. |No Dimensions |
|FunctionExecutionCount |Yes |Function Execution Count |Count |Total |Function Execution Count |Instance |
|FunctionExecutionUnits |Yes |Function Execution Units |Count |Total |Function Execution Units |Instance |
|Gen0Collections |Yes |Gen 0 Garbage Collections |Count |Total |The number of times the generation 0 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs. |Instance |
|Gen1Collections |Yes |Gen 1 Garbage Collections |Count |Total |The number of times the generation 1 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs. |Instance |
|Gen2Collections |Yes |Gen 2 Garbage Collections |Count |Total |The number of times the generation 2 objects are garbage collected since the start of the app process. |Instance |
|Handles |Yes |Handle Count |Count |Average |The total number of handles currently open by the app process. |Instance |
|HealthCheckStatus |Yes |Health check status |Count |Average |Health check status |Instance |
|Http101 |Yes |Http 101 |Count |Total |The count of requests resulting in an HTTP status code 101. |Instance |
|Http2xx |Yes |Http 2xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 200 but < 300. |Instance |
|Http3xx |Yes |Http 3xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 300 but < 400. |Instance |
|Http401 |Yes |Http 401 |Count |Total |The count of requests resulting in HTTP 401 status code. |Instance |
|Http403 |Yes |Http 403 |Count |Total |The count of requests resulting in HTTP 403 status code. |Instance |
|Http404 |Yes |Http 404 |Count |Total |The count of requests resulting in HTTP 404 status code. |Instance |
|Http406 |Yes |Http 406 |Count |Total |The count of requests resulting in HTTP 406 status code. |Instance |
|Http4xx |Yes |Http 4xx |Count |Total |The count of requests resulting in an HTTP status code ≥ 400 but < 500. |Instance |
|Http5xx |Yes |Http Server Errors |Count |Total |The count of requests resulting in an HTTP status code ≥ 500 but < 600. |Instance |
|HttpResponseTime |Yes |Response Time |Seconds |Average |The time taken for the app to serve requests, in seconds. |Instance |
|IoOtherBytesPerSecond |Yes |IO Other Bytes Per Second |BytesPerSecond |Total |The rate at which the app process is issuing bytes to I/O operations that don't involve data, such as control operations. |Instance |
|IoOtherOperationsPerSecond |Yes |IO Other Operations Per Second |BytesPerSecond |Total |The rate at which the app process is issuing I/O operations that aren't read or write operations. |Instance |
|IoReadBytesPerSecond |Yes |IO Read Bytes Per Second |BytesPerSecond |Total |The rate at which the app process is reading bytes from I/O operations. |Instance |
|IoReadOperationsPerSecond |Yes |IO Read Operations Per Second |BytesPerSecond |Total |The rate at which the app process is issuing read I/O operations. |Instance |
|IoWriteBytesPerSecond |Yes |IO Write Bytes Per Second |BytesPerSecond |Total |The rate at which the app process is writing bytes to I/O operations. |Instance |
|IoWriteOperationsPerSecond |Yes |IO Write Operations Per Second |BytesPerSecond |Total |The rate at which the app process is issuing write I/O operations. |Instance |
|MemoryWorkingSet |Yes |Memory working set |Bytes |Average |The current amount of memory used by the app, in MiB. |Instance |
|PrivateBytes |Yes |Private Bytes |Bytes |Average |Private Bytes is the current size, in bytes, of memory that the app process has allocated that can't be shared with other processes. |Instance |
|Requests |Yes |Requests |Count |Total |The total number of requests regardless of their resulting HTTP status code. |Instance |
|RequestsInApplicationQueue |Yes |Requests In Application Queue |Count |Average |The number of requests in the application request queue. |Instance |
|Threads |Yes |Thread Count |Count |Average |The number of threads currently active in the app process. |Instance |
|TotalAppDomains |Yes |Total App Domains |Count |Average |The current number of AppDomains loaded in this application. |Instance |
|TotalAppDomainsUnloaded |Yes |Total App Domains Unloaded |Count |Average |The total number of AppDomains unloaded since the start of the application. |Instance |

## NGINX.NGINXPLUS/nginxDeployments  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|nginx |Yes |nginx |Count |Total |The NGINX metric. |No Dimensions |

## Wandisco.Fusion/migrators  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesPerSecond |Yes |Bytes per Second. |BytesPerSecond |Average |Throughput speed of Bytes/second being utilised for a migrator. |No Dimensions |
|DirectoriesCreatedCount |Yes |Directories Created Count |Count |Total |This provides a running view of how many directories have been created as part of a migration. |No Dimensions |
|FileMigrationCount |Yes |Files Migration Count |Count |Total |This provides a running total of how many files have been migrated. |No Dimensions |
|InitialScanDataMigratedInBytes |Yes |Initial Scan Data Migrated in Bytes |Bytes |Total |This provides the view of the total bytes which have been transferred in a new migrator as a result of the initial scan of the On-Premises file system. Any data which is added to the migration after the initial scan migration, is NOT included in this metric. |No Dimensions |
|LiveDataMigratedInBytes |Yes |Live Data Migrated in Bytes |Count |Total |Provides a running total of LiveData which has been changed due to Client activity, since the migration started. |No Dimensions |
|MigratorCPULoad |Yes |Migrator CPU Load |Percent |Average |CPU consumption by the migrator process. |No Dimensions |
|NumberOfExcludedPaths |Yes |Number of Excluded Paths |Count |Total |Provides a running count of the paths which have been excluded from the migration due to Exclusion Rules. |No Dimensions |
|NumberOfFailedPaths |Yes |Number of Failed Paths |Count |Total |A count of which paths have failed to migrate. |No Dimensions |
|SystemCPULoad |Yes |System CPU Load |Percent |Average |Total CPU consumption. |No Dimensions |
|TotalMigratedDataInBytes |Yes |Total Migrated Data in Bytes |Bytes |Total |This provides a view of the successfully migrated Bytes for a given migrator |No Dimensions |
|TotalTransactions |Yes |Total Transactions |Count |Total |This provides a running total of the Data Transactions for which the user could be billed. |No Dimensions |

## Wandisco.Fusion/migrators/liveDataMigrations  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesMigratedByMigration |Yes |Bytes Migrated by Migration |Bytes |Total |Provides a detailed view of a migration's Bytes Transferred |No Dimensions |
|DataTransactionsByMigration |Yes |Data Transactions by Migration |Count |Total |Provides a detailed view of a migration's Data Transactions |No Dimensions |
|DirectoriesCreatedCount |Yes |Directories Created Count |Count |Total |This provides a running view of how many directories have been created as part of a migration. |No Dimensions |
|FileMigrationCount |Yes |Files Migration Count |Count |Total |This provides a running total of how many files have been migrated. |No Dimensions |
|InitialScanDataMigratedInBytes |Yes |Initial Scan Data Migrated in Bytes |Bytes |Total |This provides the view of the total bytes which have been transferred in a new migrator as a result of the initial scan of the On-Premises file system. Any data which is added to the migration after the initial scan migration, is NOT included in this metric. |No Dimensions |
|LiveDataMigratedInBytes |Yes |Live Data Migrated in Bytes |Count |Total |Provides a running total of LiveData which has been changed due to Client activity, since the migration started. |No Dimensions |
|NumberOfExcludedPaths |Yes |Number of Excluded Paths |Count |Total |Provides a running count of the paths which have been excluded from the migration due to Exclusion Rules. |No Dimensions |
|NumberOfFailedPaths |Yes |Number of Failed Paths |Count |Total |A count of which paths have failed to migrate. |No Dimensions |
|TotalBytesTransferred |Yes |Total Bytes Transferred |Bytes |Total |This metric covers how many bytes have been transferred (does not reflect how many have successfully migrated, only how much has been transferred). |No Dimensions |

## Wandisco.Fusion/migrators/metadataMigrations  
<!-- Data source : naam-->

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|LiveHiveAddedAfterScan |Yes |Hive Items Added After Scan |Count |Total |Provides a running total of how many items have been added after the initial scan. |No Dimensions |
|LiveHiveDiscoveredItems |Yes |Discovered Hive Items |Count |Total |Provides a running total of how many items have been discovered. |No Dimensions |
|LiveHiveInitiallyDiscoveredItems |Yes |Initially Discovered Hive Items |Count |Total |This provides the view of the total items discovered as a result of the initial scan of the On-Premises file system. Any items that are discovered after the initial scan, are NOT included in this metric. |No Dimensions |
|LiveHiveInitiallyMigratedItems |Yes |Initially Migrated Hive Items |Count |Total |This provides the view of the total items migrated as a result of the initial scan of the On-Premises file system. Any items that are added after the initial scan, are NOT included in this metric. |No Dimensions |
|LiveHiveMigratedItems |Yes |Migrated Hive Items |Count |Total |Provides a running total of how many items have been migrated. |No Dimensions |


## Next steps

- [Read about metrics in Azure Monitor](../data-platform.md)
- [Create alerts on metrics](../alerts/alerts-overview.md)
- [Export metrics to storage, Event Hub, or Log Analytics](../essentials/platform-logs-overview.md)


<!--Gen Date:  Thu Apr 13 2023 22:24:40 GMT+0300 (Israel Daylight Time)-->