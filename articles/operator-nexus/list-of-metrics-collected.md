---
title: List of Metrics Collected in Azure Operator Nexus.
description: List of metrics collected in Azure Operator Nexus.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 02/03/2023
ms.custom: template-reference
---

# List of metrics collected in Azure Operator Nexus

This section provides the list of metrics collected from the different components.

**Nexus Cluster**
- [List of metrics collected in Azure Operator Nexus](#list-of-metrics-collected-in-azure-operator-nexus)
  - [Nexus Cluster](#nexus-cluster)
    - [***Kubernetes API server***](#kubernetes-api-server)
    - [***calico-felix***](#calico-felix)
    - [***calico-typha***](#calico-typha)
    - [***Kubernetes Containers***](#kubernetes-containers)
    - [***Kubernetes Controllers***](#kubernetes-controllers)
    - [***coreDNS***](#coredns)
    - [***Kubernetes Daemonset***](#kubernetes-daemonset)
    - [***Kubernetes Deployment***](#kubernetes-deployment)
    - [***etcD***](#etcd)
    - [***Kubernetes Job***](#kubernetes-job)
    - [***kubelet***](#kubelet)
    - [***Kubernetes Node***](#kubernetes-node)
    - [***Kubernetes Pod***](#kubernetes-pod)
    - [***Kuberenetes StatefulSet***](#kuberenetes-statefulset)
    - [***Virtual Machine Orchestrator***](#virtual-machine-orchestrator)
  - [Baremetal servers](#baremetal-servers)
    - [***node metrics***](#node-metrics)
  - [Storage Appliances](#storage-appliances)
    - [***pure storage***](#pure-storage)
  - [Network Fabric Metrics](#network-fabric-metrics)
    - [Network Devices Metrics](#network-devices-metrics)

## Nexus Cluster
### ***Kubernetes API server***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|ApiserverAuditRequestsRejectedTotal|API Server|API Server Audit Requests Rejected Total|Count|Counter of API server requests rejected due to an error in the audit logging backend|Component,Pod Name|
|ApiserverClientCertificateExpirationSecondsSum|API Server|API Server Client Certificate Expiration Seconds Sum (Preview)|Seconds|Sum of API server client certificate expiration (seconds)|Component,Pod Name|
|ApiserverStorageDataKeyGenerationFailuresTotal|API Server|API Server Storage Data Key Generation Failures Total|Count|Total number of operations that failed Data Encryption Key (DEK) generation|Component,Pod Name|
|ApiserverTlsHandshakeErrorsTotal|API Server|API Server TLS Handshake Errors Total (Preview)|Count|Number of requests dropped with 'TLS handshake' error|Component,Pod Name|

### ***calico-felix***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|FelixActiveLocalEndpoints|Calico|Felix Active Local Endpoints|Count|Number of active endpoints on this host|Host|
|FelixClusterNumHostEndpoints|Calico|Felix Cluster Num Host Endpoints|Count|Total number of host endpoints cluster-wide|Host|
|FelixClusterNumHosts|Calico|Felix Cluster Number of Hosts|Count|Total number of Calico hosts in the cluster|Host|
|FelixClusterNumWorkloadEndpoints|Calico|Felix Cluster Number of Workload Endpoints|Count|Total number of workload endpoints cluster-wide|Host|
|FelixIntDataplaneFailures|Calico|Felix Interface Dataplane Failures|Count|Number of times dataplane updates failed and will be retried|Host|
|FelixIpsetErrors|Calico|Felix Ipset Errors|Count|Number of 'ipset' command failures|Host|
|FelixIpsetsCalico|Calico|Felix Ipsets Calico|Count|Number of active Calico IP sets|Host|
|FelixIptablesRestoreErrors|Calico|Felix IP Tables Restore Errors|Count|Number of 'iptables-restore' errors|Host|
|FelixIptablesSaveErrors|Calico|Felix IP Tables Save Errors|Count|Number of 'iptables-save' errors|Host|
|FelixResyncState|Calico|Felix Resync State|Unspecified|Current datastore state|Host|
|FelixResyncsStarted|Calico|Felix Resyncs Started|Count|Number of times Felix has started resyncing with the datastore|Host|

### ***calico-typha***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|TyphaClientLatencySecsCount|Calico|Typha Client Latency Secs|Count|Per-client latency. I.e. how far behind the current state each client is.|Pod Name|
|TyphaConnectionsAccepted|Calico|Typha Connections Accepted|Count|Total number of connections accepted over time|Pod Name|
|TyphaConnectionsDropped|Calico|Typha Connections Dropped|Count|Total number of connections dropped due to rebalancing|Pod Name|
|TyphaPingLatencyCount|Calico|Typha Ping Latency|Count|Round-trip ping/pong latency to client. Typha's protocol includes a regular ping/pong keepalive to verify that the connection is still up|Pod Name|

### ***Kubernetes Containers***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|ContainerFsIoTimeSecondsTotal|Container|Container FS I/O Time Seconds Total (Preview)|Seconds|Time taken for container Input/Output (I/O) operations|Device,Host|
|ContainerMemoryFailcnt|Container|Container Memory Fail Count|Count|Number of times a container's memory usage limit is hit|Container,Host,Namespace,Pod|
|ContainerMemoryUsageBytes|Container|Container Memory Usage Bytes|Bytes|Current memory usage, including all memory regardless of when it was accessed|Container,Host,Namespace,Pod|
|ContainerNetworkReceiveErrorsTotal|Container|Container Network Receive Errors Total (Preview)|Count|Number of errors encountered while receiving bytes over the network|Interface,Namespace,Pod|
|ContainerNetworkTransmitErrorsTotal|Container|Container Network Transmit Errors Total (Preview)|Count|Count of errors that happened while transmitting|Interface,Namespace,Pod|
|ContainerScrapeError|Container|Container Scrape Error|Unspecified|Indicates whether there was an error while getting container metrics|Host|
|ContainerTasksState|Container|Container Tasks State|Count|Number of tasks or processes in a given state (sleeping, running, stopped, uninterruptible, or waiting) in a container|Container,Host,Namespace,Pod,State|

### ***Kubernetes Controllers***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|ControllerRuntimeReconcileErrorsTotal|Controller|Controller Reconcile Errors Total|Count|Total number of reconciliation errors per controller|Controller,Namespace,Pod Name|
|ControllerRuntimeReconcileTotal|Controller|Controller Reconciliations Total|Count|Total number of reconciliations per controller|Controller,Namespace,Pod Name|

### ***coreDNS***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|CorednsDnsRequestsTotal|CoreDNS|CoreDNS Requests Total|Count|Total number of DNS requests|Family,Pod Name,Proto,Server,Type|
|CorednsDnsResponsesTotal|CoreDNS|CoreDNS Responses Total|Count|Total number of DNS responses|Pod Name,Server,Rcode|
|CorednsForwardHealthcheckBrokenTotal|CoreDNS|CoreDNS Forward Healthcheck Broken Total (Preview)|Count|Total number of times all upstreams are unhealthy|Pod Name,Namespace|
|CorednsForwardMaxConcurrentRejectsTotal|CoreDNS|CoreDNS Forward Max Concurrent Rejects Total (Preview)|Count|Total number of rejected queries because concurrent queries were at the maximum limit|Pod Name,Namespace|
|CorednsHealthRequestFailuresTotal|CoreDNS|CoreDNS Health Request Failures Total|Count|The number of times the self health check failed|Pod Name|
|CorednsPanicsTotal|CoreDNS|CoreDNS Panics Total|Count|Total number of panics|Pod Name|
|CorednsReloadFailedTotal|CoreDNS|CoreDNS Reload Failed Total|Count|Total number of failed reload attempts|Pod Name,Namespace|

### ***Kubernetes Daemonset***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeDaemonsetStatusCurrentNumberScheduled|Daemonset|Daemonsets Current Number Scheduled|Count|Number of daemonsets currently scheduled|Daemonset,Namespace|
|KubeDaemonsetStatusDesiredNumberScheduled|Daemonset|Daemonsets Desired Number Scheduled|Count|Number of daemonsets desired scheduled|Daemonset,Namespace|

### ***Kubernetes Deployment***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeDeploymentStatusReplicasAvailable|Deployment|Deployment Replicas Available|Count|Number of deployment replicas available|Deployment,Namespace|
|KubeDeploymentStatusReplicasReady|Deployment|Deployment Replicas Ready|Count|Number of deployment replicas ready|Deployment,Namespace|

### ***etcD***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|EtcdDiskBackendCommitDurationSecondsSum|Etcd|Etcd Disk Backend Commit Duration Seconds Sum|Seconds|The latency distribution of commits called by the backend|Component,Pod Name,Tier|
|EtcdDiskWalFsyncDurationSecondsSum|Etcd|Etcd Disk WAL Fsync Duration Seconds Sum|Seconds|The sum of latency distributions of 'fsync' called by the write-ahead log (WAL)|Component,Pod Name,Tier|
|EtcdServerHealthFailures|Etcd|Etcd Server Health Failures|Count|Total server health failures|Pod Name|
|EtcdServerIsLeader|Etcd|Etcd Server Is Leader|Unspecified|Whether or not this member is a leader; 1 if is, 0 otherwise|Component,Pod Name,Tier|
|EtcdServerIsLearner|Etcd|Etcd Server Is Learner|Unspecified|Whether or not this member is a learner; 1 if is, 0 otherwise|Component,Pod Name,Tier|
|EtcdServerLeaderChangesSeenTotal|Etcd|Etcd Server Leader Changes Seen Total|Count|The number of leader changes seen|Component,Pod Name,Tier|
|EtcdServerProposalsAppliedTotal|Etcd|Etcd Server Proposals Applied Total|Count|The total number of consensus proposals applied|Component,Pod Name,Tier|
|EtcdServerProposalsCommittedTotal|Etcd|Etcd Server Proposals Committed Total|Count|The total number of consensus proposals committed|Component,Pod Name,Tier|
|EtcdServerProposalsFailedTotal|Etcd|Etcd Server Proposals Failed Total|Count|The total number of failed proposals|Component,Pod Name,Tier|
|EtcdServerSlowApplyTotal|Etcd|Etcd Server Slow Apply Total (Preview)|Count|The total number of slow apply requests|Pod Name,Tier|

### ***Kubernetes Job***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeJobStatusActive|Job|Jobs Active|Count|Number of jobs active|Job,Namespace|
|KubeJobStatusFailed|Job|Jobs Failed|Count|Number and reason of jobs failed|Job,Namespace,Reason|
|KubeJobStatusSucceeded|Job|Jobs Succeeded|Count|Number of jobs succeeded|Job,Namespace|

### ***kubelet***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeletRunningContainers|Kubelet|Kubelet Running Containers|Count|Number of containers currently running|Container State,Host|
|KubeletRunningPods|Kubelet|Kubelet Running Pods|Count|Number of pods running on the node|Host|
|KubeletRuntimeOperationsErrorsTotal|Kubelet|Kubelet Runtime Operations Errors Total|Count|Cumulative number of runtime operation errors by operation type|Host,Operation Type|
|KubeletStartedPodsErrorsTotal|Kubelet|Kubelet Started Pods Errors Total|Count|Cumulative number of errors when starting pods|Host|
|KubeletVolumeStatsAvailableBytes|Kubelet|Volume Available Bytes|Bytes|Number of available bytes in the volume|Host,Namespace,Persistent Volume Claim|
|KubeletVolumeStatsCapacityBytes|Kubelet|Volume Capacity Bytes|Bytes|Capacity (in bytes) of the volume|Host,Namespace,Persistent Volume Claim|
|KubeletVolumeStatsUsedBytes|Kubelet|Volume Used Bytes|Bytes|Number of used bytes in the volume|Host,Namespace,Persistent Volume Claim|

### ***Kubernetes Node***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeNodeStatusAllocatable|Node|Node Resources Allocatable|Count|Node resources allocatable for pods|Node,resource,unit|
|KubeNodeStatusCapacity|Node|Node Resources Capacity|Count|Total amount of node resources available|Node,resource,unit|
|KubeNodeStatusCondition|Node|Node Status Condition|Count|The condition of a node|Condition,Node,Status|

### ***Kubernetes Pod***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubePodContainerResourceLimits|Pod|Container Resources Limits|Count|The container's resources limits|Container,Namespace,Node,Pod,Resource,Unit|
|KubePodContainerResourceRequests|Pod|Container Resources Requests|Count|The container's resources requested|Container,Namespace,Node,Pod,Resource,Unit|
|KubePodContainerStateStarted|Pod|Container State Started (Preview)|Count|Unix timestamp start time of a container|Container,Namespace,Pod|
|KubePodContainerStatusLastTerminatedReason|Pod|Container Status Last Terminated Reason|Count|The reason of a container's last terminated status|Container,Namespace,Pod,Reason|
|KubePodContainerStatusReady|Pod|Container Status Ready|Count|Describes whether the container's readiness check succeeded|Container,Namespace,Pod|
|KubePodContainerStatusRestartsTotal|Pod|Container Restarts|Count|The number of container restarts|Container,Namespace,Pod|
|KubePodContainerStatusRunning|Pod|Container Status Running|Count|The number of containers with a status of 'running'|Container,Namespace,Pod|
|KubePodContainerStatusTerminated|Pod|Container Status Terminated|Count|The number of containers with a status of 'terminated'|Container,Namespace,Pod|
|KubePodContainerStatusTerminatedReason|Pod|Container Status Terminated Reason|Count|The number and reason of containers with a status of 'terminated'|Container,Namespace,Pod,Reason|
|KubePodContainerStatusWaiting|Pod|Container Status Waiting|Count|The number of containers with a status of 'waiting'|Container,Namespace,Pod|
|KubePodContainerStatusWaitingReason|Pod|Container Status Waiting Reason|Count|The number and reason of containers with a status of 'waiting'|Container,Namespace,Pod,Reason|
|KubePodDeletionTimestamp|Pod|Pod Deletion Timestamp (Preview)|Count|The timestamp of the pod's deletion|Namespace,Pod|
|KubePodInitContainerStatusReady|Pod|Pod Init Container Ready|Count|The number of ready pod init containers|Namespace,Container,Pod|
|KubePodInitContainerStatusRestartsTotal|Pod|Pod Init Container Restarts|Count|The number of pod init containers restarts|Namespace,Container,Pod|
|KubePodInitContainerStatusRunning|Pod|Pod Init Container Running|Count|The number of running pod init containers|Namespace,Container,Pod|
|KubePodInitContainerStatusTerminated|Pod|Pod Init Container Terminated|Count|The number of terminated pod init containers|Namespace,Container,Pod|
|KubePodInitContainerStatusTerminatedReason|Pod|Pod Init Container Terminated Reason|Count|The number of pod init containers with terminated reason|Namespace,Container,Pod,Reason|
|KubePodInitContainerStatusWaiting|Pod|Pod Init Container Waiting|Count|The number of pod init containers waiting|Namespace,Container,Pod|
|KubePodInitContainerStatusWaitingReason|Pod|Pod Init Container Waiting Reason|Count|The reason the pod init container is waiting|Namespace,Container,Pod,Reason|
|KubePodStatusPhase|Pod|Pod Status Phase|Count|The pod status phase|Namespace,Pod,Phase|
|KubePodStatusReady|Pod|Pod Ready State|Count|Signifies if the pod is in ready state|Namespace,Pod|
|KubePodStatusReason|Pod|Pod Status Reason|Count|The pod status reason <Evicted\|NodeAffinity\|NodeLost\|Shutdown\|UnexpectedAdmissionError>|Namespace,Pod,Reason|

### ***Kuberenetes StatefulSet***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeStatefulsetReplicas|Statefulset|Statefulset Desired Replicas Number|Count|The desired number of statefulset replicas|Namespace,Statefulset|
|KubeStatefulsetStatusReplicas|Statefulset|Statefulset Replicas Number|Count|The number of replicas per statefulset|Namespace,Statefulset|

### ***Virtual Machine Orchestrator***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubevirtInfo|VMOrchestrator|Kubevirt Info|Unspecified|Kubevirt version information|Kube Version|
|KubevirtVirtControllerLeading|VMOrchestrator|Kubevirt Virt Controller Leading|Unspecified|Indication for an operating virt-controller|Pod Name|
|KubevirtVirtControllerReady|VMOrchestrator|Kubevirt Virt Controller Ready|Unspecified|Indication for a virt-controller that is ready to take the lead|Pod Name|
|KubevirtVirtOperatorReady|VMOrchestrator|Kubevirt Virt Operator Ready|Unspecified|Indication for a virt operator being ready|Pod Name|
|KubevirtVmiMemoryActualBalloonBytes|VMOrchestrator|Kubevirt VMI Memory Actual BalloonBytes|Bytes|Current balloon size (in bytes)|Name,Node|
|KubevirtVmiMemoryAvailableBytes|VMOrchestrator|Kubevirt VMI Memory Available Bytes|Bytes|Amount of usable memory as seen by the domain. This value may not be accurate if a balloon driver is in use or if the guest OS does not initialize all assigned pages|Name,Node|
|KubevirtVmiMemorySwapInTrafficBytesTotal|VMOrchestrator|Kubevirt VMI Memory Swap In Traffic Bytes Total|Bytes|The total amount of data read from swap space of the guest (in bytes)|Name,Node|
|KubevirtVmiMemoryDomainBytesTotal|VMOrchestrator|Kubevirt VMI Memory Domain Bytes Total (Preview)|Bytes|The amount of memory (in bytes) allocated to the domain. The memory value in domain XML file|Node|
|KubevirtVmiMemorySwapOutTrafficBytesTotal|VMOrchestrator|Kubevirt VMI Memory Swap Out Traffic Bytes Total|Bytes|The total amount of memory written out to swap space of the guest (in bytes)|Name,Node|
|KubevirtVmiMemoryUnusedBytes|VMOrchestrator|Kubevirt VMI Memory Unused Bytes|Bytes|The amount of memory left completely unused by the system. Memory that is available but used for reclaimable caches should NOT be reported as free|Name,Node|
|KubevirtVmiNetworkReceivePacketsTotal|VMOrchestrator|Kubevirt VMI Network Receive Packets Total|Bytes|Total network traffic received packets|Interface,Name,Node|
|KubevirtVmiNetworkTransmitPacketsDroppedTotal|VMOrchestrator|Kubevirt VMI Network Transmit Packets Dropped Total|Bytes|The total number of transmit packets dropped on virtual NIC (vNIC) interfaces|Interface,Name,Node|
|KubevirtVmiNetworkTransmitPacketsTotal|VMOrchestrator|Kubevirt VMI Network Transmit Packets Total|Bytes|Total network traffic transmitted packets|Interface,Name,Node|
|KubevirtVmiOutdatedCount|VMOrchestrator|Kubevirt VMI Outdated Count|Count|Indication for the total number of VirtualMachineInstance (VMI) workloads that are not running within the most up-to-date version of the virt-launcher environment|Name|
|KubevirtVmiPhaseCount|VMOrchestrator|Kubevirt VMI Phase Count|Count|Sum of VirtualMachineInstances (VMIs) per phase and node|Node,Phase,Workload|
|KubevirtVmiStorageIopsReadTotal|VMOrchestrator|Kubevirt VMI Storage IOPS Read Total|Count|Total number of Input/Output (I/O) read operations|Drive,Name,Node|
|KubevirtVmiStorageIopsWriteTotal|VMOrchestrator|Kubevirt VMI Storage IOPS Write Total|Count|Total number of Input/Output (I/O) write operations|Drive,Name,Node|
|KubevirtVmiStorageReadTimesMsTotal|VMOrchestrator|Kubevirt VMI Storage Read Times Total (Preview)|Milliseconds|Total time in milliseconds (ms) spent on read operations|Drive,Name,Node|
|KubevirtVmiStorageWriteTimesMsTotal|VMOrchestrator|Kubevirt VMI Storage Write Times Total (Preview)|Milliseconds|Total time in milliseconds (ms) spent on write operations|Drive,Name,Node|
|NcVmiCpuAffinity|Network Cloud|CPU Pinning Map (Preview)|Count|Pinning map of virtual CPUs (vCPUs) to CPUs|CPU,NUMA Node,VMI Namespace,VMI Node,VMI Name|

## Baremetal servers
### ***node metrics***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
HostDiskReadCompleted|Disk|Host Disk Reads Completed|Count|Disk reads completed by node|Device,Host|
HostDiskReadSeconds|Disk|Host Disk Read Seconds (Preview)|Seconds|Disk read time by node|Device,Host|
HostDiskWriteCompleted|Disk|Total Number of Writes Completed|Count|Disk writes completed by node|Device,Host|
HostDiskWriteSeconds|Disk|Host Disk Write Seconds (Preview)|Seconds|Disk write time by node|Device,Host|
HostDmiInfo|System|Host DMI Info (Preview)|Unspecified|Host Desktop Management Interface (DMI) environment information|Bios Date,Bios Release,Bios Vendor,Bios Version,Board Asset Tag,Board Name,Board Vendor,Board Version,Chassis Asset Tag,Chassis Vendor,Chassis Version,Host,Product Family,Product Name,Product Sku,Product Uuid,Product Version,System Vendor|
HostEntropyAvailableBits|Filesystem|Host Entropy Available Bits (Preview)|Count|Available bits in node entropy|Host|
HostFilesystemAvailBytes|Filesystem|Host Filesystem Available Bytes|Count|Available filesystem size by node|Device,FS Type,Host,Mount Point|
HostFilesystemDeviceError|Filesystem|Host Filesystem Device Errors|Count|Indicates if there was a problem getting information for the filesystem|Device,FS Type,Host,Mount Point|
HostFilesystemFiles|Filesystem|Host Filesystem Files|Count|Total number of permitted inodes|Device,FS Type,Host,Mount Point|
HostFilesystemFilesFree|Filesystem|Total Number of Free inodes|Count|Total number of free inodes|Device,FS Type,Host,Mount Point|
HostFilesystemReadOnly|Filesystem|Host Filesystem Read Only|Unspecified|Indicates if the filesystem is readonly|Device,FS Type,Host,Mount Point|
HostFilesystemSizeBytes|Filesystem|Host Filesystem Size In Bytes|Count|Filesystem size by node|Device,FS Type,Host,Mount Point|
HostHwmonTempCelsius|HardwareMonitor|Host Hardware Monitor Temp|Count|Hardware monitor for temperature (celsius)|Chip,Host,Sensor|
HostHwmonTempMax|HardwareMonitor|Host Hardware Monitor Temp Max|Count|Hardware monitor for maximum temperature (celsius)|Chip,Host,Sensor|
HostLoad1|Memory|Average Load In 1 Minute (Preview)|Count|1 minute load average|Host|
HostLoad15|Memory|Average Load In 15 Minutes (Preview)|Count|15 minute load average|Host|
HostLoad5|Memory|Average load in 5 minutes (Preview)|Count|5 minute load average|Host|
HostMemAvailBytes|Memory|Host Memory Available Bytes|Count|Available memory in bytes by node|Host|
HostMemHWCorruptedBytes|Memory|Total Amount of Memory In Corrupted Pages|Count|Corrupted bytes in hardware by node|Host|
HostMemTotalBytes|Memory|Host Memory Total Bytes|Bytes|Total bytes of memory by node|Host|
HostSpecificCPUUtilization|CPU|Host Specific CPU Utilization (Preview)|Seconds|A counter metric that counts the number of seconds the CPU has been running in a particular mode|Cpu,Host,Mode|
IdracPowerCapacityWatts|HardwareMonitor|IDRAC Power Capacity Watts|Unspecified|Power Capacity|Host,PSU|
IdracPowerInputWatts|HardwareMonitor|IDRAC Power Input Watts|Unspecified|Power Input|Host,PSU|
IdracPowerOn|HardwareMonitor|IDRAC Power On|Unspecified|IDRAC Power On Status|Host|
IdracPowerOutputWatts|HardwareMonitor|IDRAC Power Output Watts|Unspecified|Power Output|Host,PSU|
IdracSensorsTemperature|HardwareMonitor|IDRAC Sensors Temperature|Unspecified|IDRAC sensor temperature|Host,Name,Units|
NcNodeNetworkReceiveErrsTotal|Network|Network Device Receive Errors|Count|Total network device errors received|Hostname,Interface Name|
NcNodeNetworkTransmitErrsTotal|Network|Network Device Transmit Errors|Count|Total network device errors transmitted|Hostname,Interface Name|
NcTotalCpusPerNuma|CPU|Total CPUs Available to Nexus per NUMA|Count|Total number of CPUs available to Nexus per NUMA|Hostname,NUMA Node|
NcTotalWorkloadCpusAllocatedPerNuma|CPU|CPUs per NUMA Allocated for Nexus Kubernetes|Count|Total number of CPUs per NUMA allocated for Nexus Kubernetes and Tenant Workloads|Hostname,NUMA Node|
NcTotalWorkloadCpusAvailablePerNuma|CPU|CPUs per NUMA Available for Nexus Kubernetes|Count|Total number of CPUs per NUMA available to Nexus Kubernetes and Tenant Workloads|Hostname,NUMA Node|
NodeBondingActive|Network|Node Bonding Active (Preview)|Count|Number of active interfaces per bonding interface|Primary|
NodeMemHugePagesFree|Memory|Node Memory Huge Pages Free (Preview)|Bytes|NUMA hugepages free by node|Host,Node|
NodeMemHugePagesTotal|Memory|Node Memory Huge Pages Total|Bytes|NUMA huge pages total by node|Host,Node|
NodeMemNumaFree|Memory|Node Memory NUMA (Free Memory)|Bytes|NUMA memory free|Name,Host|
NodeMemNumaShem|Memory|Node Memory NUMA (Shared Memory)|Bytes|NUMA shared memory|Host,Node|
NodeMemNumaUsed|Memory|Node Memory NUMA (Used Memory)|Bytes|NUMA memory used|Host,Node|
NodeNetworkCarrierChanges|Network|Node Network Carrier Changes|Count|Node network carrier changes|Device,Host|
NodeNetworkMtuBytes|Network|Node Network Maximum Transmission Unit Bytes|Bytes|Node network Maximum Transmission Unit (mtu_bytes) value of /sys/class/net/\<iface\>|Device,Host|
NodeNetworkReceiveMulticastTotal|Network|Node Network Received Multicast Total|Bytes|Network device statistic receive_multicast|Device,Host|
NodeNetworkReceivePackets|Network|Node Network Received Packets|Count|Network device statistic receive_packets|Device,Host|
NodeNetworkSpeedBytes|Network|Node Network Speed Bytes|Bytes|speed_bytes value of /sys/class/net/\<iface\>|Device,Host|
NodeNetworkTransmitPackets|Network|Node Network Transmited Packets|Count|Network device statistic transmit_packets|Device,Host|
NodeNetworkUp|Network|Node Network Up|Count|Value is 1 if operstate is 'up', 0 otherwise.|Device,Host|
NodeNvmeInfo|Disk|Node NVMe Info (Preview)|Count|Non-numeric data from /sys/class/nvme/\<device\>, value is always 1. Provides firmware, model, state and serial for a device|Device,State|
NodeOsInfo|System|Node OS Info|Count|Node OS information|Host,Name,Version|
NodeTimexMaxErrorSeconds|System|Node Timex Max Error Seconds|Seconds|Maximum time error between the local system and reference clock|Host|
NodeTimexOffsetSeconds|System|Node Timex Offset Seconds|Seconds|Time offset in between the local system and reference clock|Host|
NodeTimexSyncStatus|System|Node Timex Sync Status|Count|Is clock synchronized to a reliable server (1 = yes, 0 = no)|Host|
NodeVmOomKill|VM Stat|Node VM Out Of Memory Kill|Count|Information in /proc/vmstat pertaining to the field oom_kill|Host|
NodeVmstatPswpIn|VM Stat|Node VM PSWP In|Count|Information in /proc/vmstat pertaining to the field pswpin|Host|
NodeVmstatPswpout|VM Stat|Node VM PSWP Out|Count|Information in /proc/vmstat pertaining to the field pswpout|Host|

## Storage Appliances
### ***pure storage***


| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
PurefaAlertsTotal|Storage Array|Nexus Storage Alerts Total|Count|Number of alert events|Severity|
PurefaArrayPerformanceAvgBlockBytes|Storage Array|Nexus Storage Array Avg Block Bytes|Bytes|Average block size|Dimension|
PurefaArrayPerformanceBandwidthBytes|Storage Array|Nexus Storage Array Bandwidth Bytes|Bytes|Array throughput in bytes per second|Dimension|
PurefaArrayPerformanceIOPS|Storage Array|Nexus Storage Array IOPS|Count|Storage array IOPS|Dimension|
PurefaArrayPerformanceLatencyUsec|Storage Array|Nexus Storage Array Latency (Microseconds)|MilliSeconds|Storage array latency in microseconds|Dimension|
PurefaArrayPerformanceQdepth|Storage Array|Nexus Storage Array Queue Depth|Bytes|Storage array queue depth|
PurefaArraySpaceCapacityBytes|Storage Array|Nexus Storage Array Capacity Bytes|Bytes|Storage array overall space capacity|
PurefaArraySpaceDatareductionRatio|Storage Array|Nexus Storage Array Space Datareduction Ratio|Percent|Storage array overall data reduction|
PurefaArraySpaceProvisionedBytes|Storage Array|Nexus Storage Array Space Provisioned Bytes|Bytes|Storage array overall provisioned space|
PurefaArraySpaceUsedBytes|Storage Array|Nexus Storage Array Space Used Bytes|Bytes|Storage Array overall used space|Dimension|
PurefaHardwareComponentHealth|Storage Array|Nexus Storage Hardware Component Health|Count|Storage array hardware component health status|Component,Controller,Index|
PurefaHardwarePowerVolts|Storage Array|Nexus Storage Hardware Power Volts|Unspecified|Storage array hardware power supply voltage|Power Supply|
PurefaHardwareTemperatureCelsius|Storage Array|Nexus Storage Hardware Temperature Celsius|Unspecified|Storage array hardware temperature sensors|Controller,Sensor|
PurefaHostPerformanceBandwidthBytes|Host|Nexus Storage Host Bandwidth Bytes|Bytes|Storage array host bandwidth in bytes per second|Dimension,Host|
PurefaHostPerformanceIOPS|Host|Nexus Storage Host IOPS|Count|Storage array host IOPS|Dimension,Host|
PurefaHostPerformanceLatencyUsec|Host|Nexus Storage Host Latency (Microseconds)|MilliSeconds|Storage array host latency in microseconds|Dimension,Host|
PurefaHostSpaceBytes|Host|Nexus Storage Host Space Bytes|Bytes|Storage array host space in bytes|Dimension,Host|
PurefaHostSpaceDatareductionRatio|Host|Nexus Storage Host Space Datareduction Ratio|Percent|Storage array host volumes data reduction ratio|Host|
PurefaHostSpaceSizeBytes|Host|Nexus Storage Host Space Size Bytes|Bytes|Storage array host volumes size|Host|
PurefaInfo|Storage Array|Nexus Storage Info (Preview)|Unspecified|Storage array system information|Array Name|
PurefaVolumePerformanceIOPS|Volume|Nexus Storage Volume Performance IOPS|Count|Storage array volume IOPS|Dimension,Volume|
PurefaVolumePerformanceLatencyUsec|Volume|Nexus Storage Volume Performance Latency (Microseconds)|MilliSeconds|Storage array volume latency in microseconds|Dimension,Volume|
PurefaVolumePerformanceThroughputBytes|Volume|Nexus Storage Volume Performance Throughput Bytes|Bytes|Storage array volume throughput|Dimension,Volume|
PurefaVolumeSpaceBytes|Volume|Nexus Storage Volume Space Bytes|Bytes|Storage array volume space in bytes|Dimension,Volume|
PurefaVolumeSpaceDatareductionRatio|Volume|Nexus Storage Volume Space Datareduction Ratio|Percent|Storage array overall data reduction|Volume|
PurefaVolumeSpaceSizeBytes|Volume|Nexus Storage Volume Space Size Bytes|Bytes|Storage array volumes size|Volume|

## Network Fabric Metrics
### Network Devices Metrics

| Metric Name     | Metric Display Name| Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| CpuUtilizationMax | Cpu Utilization Max | Resource Utilization | % | Average | Maximum CPU utilization of the device over a given interval | CPU Cores | No* |
| CpuUtilizationMin | Cpu Utilization Min | Resource Utilization | % | Average | Minimum CPU utilization of the device over a given interval | CPU Cores | No* |
| FanSpeed | Fan Speed | Resource Utilization | RPM | Average | Running speed of the fan at any given point of time | Fan number | No* |
| MemoryAvailable | Memory Available | Resource Utilization | GiB | Average | The amount of memory available or allocated to the device at a given point in time | NA | No* |
| MemoryUtilized | Memory Utilized | Resource Utilization | GiB | Average | The amount of memory utilized by the device at a given point in time | NA | No* |
| PowerSupplyInputCurrent | Power Supply Input Current | Resource Utilization | Amps | Average | The input current draw of the power supply | NA | No* |
| PowerSupplyInputVoltage | Power Supply Input Voltage | Resource Utilization | Volts | Average | The input voltage of the power supply | NA | No* |
| PowerSupplyMaximumPowerCapacity | Power Supply Maximum Power Capacity | Resource Utilization | Watts | Average | Maximum power capacity of the power supply | NA | No* |
| PowerSupplyOutputCurrent | Power Supply Output Current | Resource Utilization | Amps | Average | The output current supplied by the power supply | NA | No* |
| PowerSupplyOutputPower| Power Supply Output Power | Resource Utilization | Watts | Average | The output power supplied by the power supply | NA | No* |
| PowerSupplyOutputVoltage | Power Supply Output Voltage | Resource Utilization | Volts | Average | The output voltage supplied the power supply | NA | No* |
| BgpPeerStatus | BGP Peer Status | BGP Status | Count | Average | Operational state of the BGP Peer represented in numerical form. 1-Idle, 2-Connect, 3-Active, 4-OpenSent, 5-OpenConfirm, 6-Established | NA | No* |
| InterfaceOperStatus | Interface Operational State | Interface Operational State | Count | Average | Operational state of the Interface represented in numerical form. 0-Up, 1-Down, 2-Lower Layer Down, 3-Testing, 4-Unknown, 5-Dormant, 6-Not Present | NA | No* |
| IfEthInCrcErrors | Ethernet Interface In CRC Errors | Interface State Counters | Count | Average | The count of incoming CRC errors caused by several factors for an ethernet interface over a given interval of time | Interface name | No* |
| IfEthInFragmentFrames | Ethernet Interface In Fragment Frames | Interface State Counters | Count | Average | The count of incoming fragmented frames for an ethernet interface over a given interval of time | Interface name | No* |
| IfEthInJabberFrames | Ethernet Interface In Jabber Frames | Interface State Counters | Count | Average | The count of incoming jabber frames. Jabber frames are typically oversized frames with invalid CRC | Interface name | No* |
| IfEthInMacControlFrames | Ethernet Interface In MAC Control Frames | Interface State Counters | Count | Average | The count of incoming MAC layer control frames for an ethernet interface over a given interval of time | Interface name | No* |
| IfEthInMacPauseFrames | Ethernet Interface In MAC Pause Frames | Interface State Counters | Count | Average | The count of incoming MAC layer pause frames for an ethernet interface over a given interval of time | Interface name | No* |
| IfEthInOversizeFrames | Ethernet Interface In Oversize Frames | Interface State Counters | Count | Average | The count of incoming oversized frames (larger than 1518 octets) for an ethernet interface over a given interval of time | Interface name | No* |
| IfEthOutMacControlFrames | Ethernet Interface Out MAC Control Frames | Interface State Counters | Count | Average | The count of outgoing MAC layer control frames for an ethernet interface over a given interval of time | Interface name | No* |
| IfEthOutMacPauseFrames | Ethernet Interface Out MAC Pause Frames | Interface State Counters | Count | Average | Shows the count of outgoing MAC layer pause frames for an ethernet interface over a given interval of time | Interface name | No* |
| IfInBroadcastPkts | Interface In Broadcast Pkts | Interface State Counters | Count | Average | The count of incoming broadcast packets for an interface over a given interval of time | Interface name | No* |
| IfInDiscards | Interface In Discards | Interface State Counters | Count | Average | The count of incoming discarded packets for an interface over a given interval of time | Interface name | No* |
| IfInErrors | Interface In Errors | Interface State Counters | Count | Average | The count of incoming packets with errors for an interface over a given interval of time | Interface name | No* |
| IfInFcsErrors | Interface In FCS Errors | Interface State Counters | Count | Average | The count of incoming packets with FCS (Frame Check Sequence) errors for an interface over a given interval of time | Interface name | No* |
| IfInMulticastPkts | Interface In Multicast Pkts | Interface State Counters | Count | Average | The count of incoming multicast packets for an interface over a given interval of time | Interface name | No* |
| IfInOctets | Interface In Octets | Interface State Counters | Count | Average | The total number of incoming octets received by an interface over a given interval of time | Interface name | No* |
| IfInUnicastPkts | Interface In Unicast Pkts | Interface State Counters | Count | Average | The count of incoming unicast packets for an interface over a given interval of time | Interface name | No* |
| IfInPkts | Interface In Pkts | Interface State Counters | Count | Average | The total number of incoming packets received by an interface over a given interval of time. Includes all packets - unicast, multicast, broadcast, bad packets, etc. | Interface name | No* |
| IfOutBroadcastPkts | Interface Out Broadcast Pkts | Interface State Counters | Count | Average | The count of outgoing broadcast packets for an interface over a given interval of time | Interface name | No* |
| IfOutDiscards | Interface Out Discards | Interface State Counters | Count | Average | The count of outgoing discarded packets for an interface over a given interval of time | Interface name | No* |
| IfOutErrors | Interface Out Errors | Interface State Counters | Count | Average | The count of outgoing packets with errors for an interface over a given interval of time | Interface name | No* |
| IfOutMulticastPkts | Interface Out Multicast Pkts | Interface State Counters | Count | Average | The count of outgoing multicast packets for an interface over a given interval of time | Interface name | No* |
| IfOutOctets | Interface Out Octets | Interface State Counters | Count | Average | The total number of outgoing octets sent from an interface over a given interval of time | Interface name | No* |
| IfOutUnicastPkts | Interface Out Unicast Pkts | Interface State Counters | Count | Average | The count of outgoing unicast packets for an interface over a given interval of time | Interface name | No* |
| IfOutPkts | Interface Out Pkts | Interface State Counters | Count | Average | The total number of outgoing packets sent from an interface over a given interval of time. Includes all packets - unicast, multicast, broadcast, bad packets, etc. | Interface name | No* |
| LacpErrors | LACP Errors | LACP State Counters | Count | Average | The count of LACPDU illegal packet errors | Interface name | No* |
| LacpInPkts | LACP In Pkts | LACP State Counters | Count | Average | The count of LACPDU packets received by an interface over a given interval of time | Interface name | No* |
| LacpOutPkts | LACP Out Pkts | LACP State Counters | Count | Average | The count of LACPDU packets sent by an interface over a given interval of time | Interface name | No* |
| LacpRxErrors | LACP Rx Errors | LACP State Counters | Count | Average | The count of LACPDU packets with errors received by an interface over a given interval of time | Interface name | No* |
| LacpTxErrors | LACP Tx Errors | LACP State Counters | Count | Average | The count of LACPDU packets with errors transmitted by an interface over a given interval of time | Interface name | No* |
| LacpUnknownErrors | LACP Unknown Errors | LACP State Counters | Count | Average | The count of LACPDU packets with unknown errors over a given interval of time | Interface name | No* |
| LldpFrameIn | LLDP Frame In | LLDP State Counters | Count | Average | The count of LLDP frames received by an interface over a given interval of time | Interface name | No* |
| LldpFrameOut | LLDP Frame Out | LLDP State Counters | Count | Average | The count of LLDP frames trasmitted from an interface over a given interval of time | Interface name | No* |
| LldpTlvUnknown | LLDP Tlv Unknown | LLDP State Counters | Count | Average | The count of LLDP frames received with unknown TLV by an interface over a given interval of time | Interface name | No* |

\*Network Devices Metrics streaming via Diagnostic Setting is a work in progress and will be enabled in an upcoming release.