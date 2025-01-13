---
title: List of Metrics Collected in Azure Operator Nexus.
description: List of metrics emitted by the resource types in Azure Operator Nexus and observed in Azure Monitor.
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
    - [***Kubernetes StatefulSet***](#kubernetes-statefulset)
    - [***Virtual Machine Orchestrator***](#virtual-machine-orchestrator)
    - [***sharedVolume***](#sharedvolume)
    - [***Platform Cluster***](#platform-cluster)
  - [Baremetal servers](#baremetal-servers)
    - [***node metrics***](#node-metrics)
  - [Storage Appliances](#storage-appliances)
    - [***pure storage***](#pure-storage)
  - [Cluster Management](#cluster-management)
    - [***cluster management metrics***](#cluster-management-metrics)
  - [Network Fabric Metrics](#network-fabric-metrics)
    - [Network Devices Metrics](#network-devices-metrics)

## Nexus Cluster
All these metrics for Nexus Cluster are collected and delivered to Azure Monitor per minute.

### ***Kubernetes API server***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|ApiserverAuditRequestsRejectedTotal|API Server|APIServer Audit Requests Rejected Total|Count|Counter of API server requests rejected due to an error in the audit logging backend. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name|
|ApiserverClientCertificateExpirationSecondsSum|API Server|APIServer Clnt Cert Exp Sec Sum (Preview)|Seconds|Sum of API server client certificate expiration. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name|
|ApiserverStorageDataKeyGenerationFailuresTotal|API Server|APIServer Storage Data Key Gen Fail|Count|Total number of operations that failed Data Encryption Key (DEK) generation. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name|
|ApiserverTlsHandshakeErrorsTotal|API Server|APIServer TLS Handshake Err (Preview)|Count|Number of requests dropped with 'TLS handshake' error. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name|

### ***calico-felix***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|FelixActiveLocalEndpoints|Calico|Felix Active Local Endpoints|Count|Number of active endpoints on this host. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixClusterNumHostEndpoints|Calico|Felix Cluster Num Host Endpoints|Count|Total number of host endpoints cluster-wide. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixClusterNumHosts|Calico|Felix Cluster Number of Hosts|Count|Total number of Calico hosts in the cluster. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixClusterNumWorkloadEndpoints|Calico|Felix Cluster Nmbr Workload Endpoints|Count|Total number of workload endpoints cluster-wide. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixIntDataplaneFailures|Calico|Felix Interface Dataplane Failures|Count|Number of times dataplane updates failed and will be retried. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixIpsetErrors|Calico|Felix Ipset Errors|Count|Number of 'ipset' command failures. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixIpsetsCalico|Calico|Felix Ipsets Calico|Count|Number of active Calico IP sets. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixIptablesRestoreErrors|Calico|Felix IP Tables Restore Errors|Count|Number of 'iptables-restore' errors. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixIptablesSaveErrors|Calico|Felix IP Tables Save Errors|Count|Number of 'iptables-save' errors. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixResyncState|Calico|Felix Resync State|Unspecified|Current datastore state. In the absence of data, this metric will retain the most recent value emitted|Host|
|FelixResyncsStarted|Calico|Felix Resyncs Started|Count|Number of times Felix has started resyncing with the datastore. In the absence of data, this metric will retain the most recent value emitted|Host|

### ***calico-typha***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|TyphaClientLatencySecsCount|Calico|Typha Client Latency Secs|Count|Per-client latency: how far behind the current state each client is. In the absence of data, this metric will retain the most recent value emitted|Pod Name|
|TyphaConnectionsAccepted|Calico|Typha Connections Accepted|Count|Total number of connections accepted over time. In the absence of data, this metric will retain the most recent value emitted|Pod Name|
|TyphaConnectionsDropped|Calico|Typha Connections Dropped|Count|Total number of connections dropped due to rebalancing. In the absence of data, this metric will retain the most recent value emitted|Pod Name|
|TyphaPingLatencyCount|Calico|Typha Ping Latency|Count|Round-trip ping latency to client. Typha's protocol includes a regular ping keepalive to verify that the connection is still up. In the absence of data, this metric will retain the most recent value emitted|Pod Name|

### ***Kubernetes Containers***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|ContainerFsIoTimeSecondsTotal|Container|Container FS I/O Time Seconds Total (Preview)|Seconds|Time taken for container Input/Output (I/O) operations. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|ContainerMemoryFailcnt|Container|Container Memory Fail Count|Count|Number of times a container's memory usage limit is hit. In the absence of data, this metric will default to 0|Container, Host, Namespace, Pod|
|ContainerMemoryUsageBytes|Container|Container Memory Usage Bytes|Bytes|Current memory usage, including all memory regardless of when it was accessed. In the absence of data, this metric will default to 0|Container, Host, Namespace, Pod|
|ContainerNetworkReceiveErrorsTotal|Container|Container Net Rx Errors (Preview)|Count|Number of errors encountered while receiving bytes over the network. In the absence of data, this metric will retain the most recent value emitted|Interface, Namespace, Pod|
|ContainerNetworkTransmitErrorsTotal|Container|Container Net Tx Err Total (Preview)|Count|Number of errors encountered while transmitting bytes over the network. In the absence of data, this metric will retain the most recent value emitted|Interface, Namespace, Pod|
|ContainerScrapeError|Container|Container Scrape Error|Unspecified|Indicates whether there was an error while getting container metrics. In the absence of data, this metric will retain the most recent value emitted|Host|
|ContainerTasksState|Container|Container Tasks State|Count|Number of tasks or processes in a given state (sleeping, running, stopped, uninterruptible, or waiting) in a container. In the absence of data, this metric will retain the most recent value emitted|Container, Host, Namespace, Pod, State|

### ***Kubernetes Controllers***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|ControllerRuntimeReconcileErrorsTotal|Controller|Controller Reconcile Errors Total (Deprecated)|Count|Total number of reconciliation errors per controller. In the absence of data, this metric will retain the most recent value emitted|Controller, Namespace, Pod Name|
|ControllerRuntimeReconcileErrorsTotal2|Controller|Controller Reconcile Errors Total|Count|Total number of reconciliation errors per controller. In the absence of data, this metric will retain the most recent value emitted|Controller, Namespace, Pod Name|
|ControllerRuntimeReconcileTotal|Controller|Controller Reconciliations Total (Deprecated)|Count|Total number of reconciliations per controller. In the absence of data, this metric will retain the most recent value emitted|Controller, Namespace, Pod Name|
|ControllerRuntimeReconcileTotal2|Controller|Controller Reconciliations Total|Count|Total number of reconciliations per controller. In the absence of data, this metric will retain the most recent value emitted|Controller, Namespace, Pod Name|

### ***coreDNS***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|CorednsDnsRequestsTotal|CoreDNS|CoreDNS Requests Total|Count|Total number of DNS requests received by a CoreDNS server. In the absence of data, this metric will retain the most recent value emitted|Family, Pod Name,Proto,Server,Type|
|CorednsDnsResponsesTotal|CoreDNS|CoreDNS Responses Total|Count|Total number of DNS responses sent by a CoreDNS server. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Server, Rcode|
|CorednsForwardHealthcheckBrokenTotal|CoreDNS|CoreDNS Frwd Hlthchk Broken (Deprecated)|Count|Total number of times the health checks for all upstream DNS servers has failed. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Namespace|
|CorednsForwardHealthcheckBrokenTotal2|CoreDNS|CoreDNS Frwd Hlthchk Broken|Count|Total number of times the health checks for all upstream DNS servers has failed. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Namespace|
|CorednsForwardMaxConcurrentRejectsTotal|CoreDNS|CoreDNS Frwd Max Concurrent Rejects (Deprecated)|Count|Total number of rejected queries due to concurrent queries reaching the maximum limit. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Namespace|
|CorednsForwardMaxConcurrentRejectsTotal2|CoreDNS|CoreDNS Frwd Max Concurrent Rejects|Count|Total number of rejected queries due to concurrent queries reaching the maximum limit. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Namespace|
|CorednsHealthRequestFailuresTotal|CoreDNS|CoreDNS Health Request Failures Total|Count|The number of times the self health check failed for a CoreDNS server. In the absence of data, this metric will retain the most recent value emitted|Pod Name|
|CorednsPanicsTotal|CoreDNS|CoreDNS Panics Total|Count|Total number of unexpected errors (panics) that have occurred in a CoreDNS server. In the absence of data, this metric will retain the most recent value emitted|Pod Name|
|CorednsReloadFailedTotal|CoreDNS|CoreDNS Reload Failed Total (Deprecated)|Count|Total number of failed attempts CoreDNS has had when reloading its configuration. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Namespace|
|CorednsReloadFailedTotal2|CoreDNS|CoreDNS Reload Failed Total|Count|Total number of failed attempts CoreDNS has had when reloading its configuration. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Namespace|

### ***Kubernetes Daemonset***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeDaemonsetStatusCurrentNumberScheduled|Daemonset|Daemonsets Current Number Scheduled|Count|Number of daemonsets currently scheduled. In the absence of data, this metric will default to 0|Daemonset, Namespace|
|KubeDaemonsetStatusDesiredNumberScheduled|Daemonset|Daemonsets Desired Number Scheduled|Count|Number of daemonsets desired scheduled. In the absence of data, this metric will default to 0|Daemonset, Namespace|
|KubeDaemonsetStatusNotScheduled|Daemonset|Daemonsets Not Scheduled|Count|Number of daemonsets not scheduled. In the absence of data, this metric will default to 0|Daemonset, Namespace|

### ***Kubernetes Deployment***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeDeploymentStatusReplicasAvailable|Deployment|Deployment Replicas Available|Count|Number of deployment replicas available.|Deployment, Namespace|
|KubeDeploymentStatusReplicasUnavailable|Deployment|Deployment Replicas Unavailable|Count|Number of deployment replicas unavailable.|Deployment, Namespace|
|KubeDeploymentStatusReplicasReady|Deployment|Deployment Replicas Ready|Count|Number of deployment replicas ready. In the absence of data, this metric will default to 0|Deployment, Namespace|
|KubeDeploymentStatusReplicasAvailablePercent|Deployment|Deployment Replicas Available Percent|Percent|Percentage of deployment replicas available. In the absence of data, this metric will default to 0|Deployment, Namespace|

### ***etcD***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|EtcdDBUtilizationPercent|Etcd|Etcd Database Utilization Percentage|Percent|The percentage of the Etcd Database utilized. In the absence of data, this metric will default to 0|Pod Name|
|EtcdDiskBackendCommitDurationSecondsSum|Etcd|Etcd Disk Backend Commit Duration Sec|Seconds|The cumulative sum of the time taken for etcd to commit transactions to its backend disk storage. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name, Tier|
|EtcdDiskWalFsyncDurationSecondsSum|Etcd|Etcd Disk WAL Fsync Duration Sec|Seconds|The cumulative sum of the time that etcd has spent performing fsync operations on the write-ahead log (WAL) file. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name, Tier|
|EtcdServerHealthFailures|Etcd|Etcd Server Health Failures|Count|Total number of failed health checks performed on an etcd server. In the absence of data, this metric will default to 0|Pod Name|
|EtcdServerIsLeader|Etcd|Etcd Server Is Leader|Unspecified|Indicates whether an etcd server is the leader of the cluster; 1, 0 otherwise.|Component, Pod Name, Tier|
|EtcdServerIsLearner|Etcd|Etcd Server Is Learner|Unspecified|Indicates whether an etcd server is a learner within the cluster; 1, 0 otherwise.|Component, Pod Name, Tier|
|EtcdServerLeaderChangesSeenTotal|Etcd|Etcd Server Leader Changes Seen Total|Count|The number of leader changes seen within the etcd cluster. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name, Tier|
|EtcdServerProposalsAppliedTotal|Etcd|Etcd Server Proposals Applied Total|Count|The total number of consensus proposals that have been successfully applied. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name, Tier|
|EtcdServerProposalsCommittedTotal|Etcd|Etcd Server Proposals Committed Total|Count|The total number of consensus proposals that have been committed. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name, Tier|
|EtcdServerProposalsFailedTotal|Etcd|Etcd Server Proposals Failed Total|Count|The total number of failed consensus proposals. In the absence of data, this metric will retain the most recent value emitted|Component, Pod Name, Tier|
|EtcdServerSlowApplyTotal|Etcd|Etcd Server Slow Apply Total (Preview)|Count|The total number of etcd apply requests that took longer than expected. In the absence of data, this metric will retain the most recent value emitted|Pod Name, Tier|

### ***Kubernetes Job***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeJobStatusActive|Job|Jobs Active|Count|Number of jobs active. In the absence of data, this metric will default to 0|Job, Namespace|
|KubeJobStatusFailedReasons|Job|Jobs Failed|Count|Number and reason of jobs failed.|Job, Namespace, Reason|
|KubeJobStatusSucceeded|Job|Jobs Succeeded|Count|Number of jobs succeeded. In the absence of data, this metric will default to 0|Job, Namespace|

### ***kubelet***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeletRunningContainers|Kubelet|Kubelet Running Containers|Count|Number of containers currently running. In the absence of data, this metric will retain the most recent value emitted|Container State, Host|
|KubeletRunningPods|Kubelet|Kubelet Running Pods|Count|Number of pods running on the node. In the absence of data, this metric will retain the most recent value emitted|Host|
|KubeletRuntimeOperationsErrorsTotal|Kubelet|Kubelet Runtime Operations Errors Total|Count|Cumulative number of runtime operation errors by operation type. In the absence of data, this metric will retain the most recent value emitted|Host, Operation Type|
|KubeletStartedPodsErrorsTotal|Kubelet|Kubelet Started Pods Errors Total|Count|Cumulative number of errors when starting pods. In the absence of data, this metric will retain the most recent value emitted|Host|

### ***Kubernetes Node***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeNodeStatusAllocatable|Node|Node Resources Allocatable|Count|Node resources allocatable for pods. In the absence of data, this metric will retain the most recent value emitted|Node, resource, unit|
|KubeNodeStatusCapacity|Node|Node Resources Capacity|Count|Total amount of node resources available. In the absence of data, this metric will retain the most recent value emitted|Node, resource, unit|
|KubeNodeStatusCondition|Node|Node Status Condition|Count|The condition of a node. In the absence of data, this metric will retain the most recent value emitted|Condition, Node, Status|

### ***Kubernetes Pod***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubePodContainerResourceLimits|Pod|Container Resources Limits|Count|The container's resources limits. In the absence of data, this metric will default to 0|Container, Namespace, Node, Pod, Resource, Unit|
|KubePodContainerResourceRequests|Pod|Container Resources Requests|Count|The container's resources requested. In the absence of data, this metric will default to 0|Container, Namespace, Node, Pod, Resource, Unit|
|KubePodContainerStateStarted|Pod|Container State Started (Preview)|Count|Unix timestamp start time of a container. In the absence of data, this metric will default to 0|Container, Namespace, Pod|
|KubePodContainerStatusLastTerminatedReason|Pod|Container Status Last Terminated Reason|Count|The reason of a container's last terminated status. In the absence of data, this metric will default to 0|Container, Namespace, Pod, Reason|
|KubePodContainerStatusReady|Pod|Container Status Ready|Count|Describes whether the container's readiness check succeeded. In the absence of data, this metric will default to 0|Container, Namespace, Pod|
|KubePodContainerStatusRestartsTotal|Pod|Container Restarts|Count|The number of container restarts. In the absence of data, this metric will retain the most recent value emitted|Container, Namespace, Pod|
|KubePodContainerStatusRunning|Pod|Container Status Running|Count|The number of containers with a status of 'running'. In the absence of data, this metric will default to 0|Container, Namespace, Pod|
|KubePodContainerStatusTerminated|Pod|Container Status Terminated|Count|The number of containers with a status of 'terminated'. In the absence of data, this metric will default to 0|Container, Namespace, Pod|
|KubePodContainerStatusTerminatedReasons|Pod|Container Status Terminated Reason|Count|The number and reason of containers with a status of 'terminated'.|Container, Namespace, Pod, Reason|
|KubePodContainerStatusWaiting|Pod|Container Status Waiting|Count|The number of containers with a status of 'waiting'. In the absence of data, this metric will default to 0|Container, Namespace, Pod|
|KubePodContainerStatusWaitingReason|Pod|Container Status Waiting Reason|Count|The number and reason of containers with a status of 'waiting'.|Container, Namespace, Pod, Reason|
|KubePodDeletionTimestamp|Pod|Pod Deletion Timestamp (Preview)|Count|The timestamp of the pod's deletion. In the absence of data, this metric will default to 0|Namespace, Pod|
|KubePodInitContainerStatusReady|Pod|Pod Init Container Ready|Count|The number of ready pod init containers. In the absence of data, this metric will default to 0|Namespace, Container, Pod|
|KubePodInitContainerStatusRestartsTotal|Pod|Pod Init Container Restarts|Count|The number of pod init containers restarts. In the absence of data, this metric will retain the most recent value emitted|Namespace, Container, Pod|
|KubePodInitContainerStatusRunning|Pod|Pod Init Container Running|Count|The number of running pod init containers. In the absence of data, this metric will default to 0|Namespace, Container, Pod|
|KubePodInitContainerStatusTerminated|Pod|Pod Init Container Terminated|Count|The number of terminated pod init containers. In the absence of data, this metric will default to 0|Namespace, Container, Pod|
|KubePodInitContainerStatusTerminatedReason|Pod|Pod Init Container Terminated Reason|Count|The number of pod init containers with terminated reason. In the absence of data, this metric will default to 0|Namespace, Container, Pod, Reason|
|KubePodInitContainerStatusWaiting|Pod|Pod Init Container Waiting|Count|The number of pod init containers waiting. In the absence of data, this metric will default to 0|Namespace, Container, Pod|
|KubePodInitContainerStatusWaitingReason|Pod|Pod Init Container Waiting Reason|Count|The reason the pod init container is waiting. In the absence of data, this metric will default to 0|Namespace, Container, Pod, Reason|
|KubePodStatusPhases|Pod|Pod Status Phase|Count|The pod status phase. In the absence of data, this metric will default to 0|Namespace, Pod, Phase|
|KubePodStatusReady|Pod|Pod Ready State|Count|Signifies if the pod is in ready state. In the absence of data, this metric will default to 0|Namespace, Pod, Condition|
|KubePodStatusReason|Pod|Pod Status Reason|Count|The pod status reason <Evicted/NodeAffinity/NodeLost/Shutdown/UnexpectedAdmissionError>. In the absence of data, this metric will default to 0|NamespacePod, Reason|

### ***Kubernetes StatefulSet***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubeStatefulsetReplicas|Statefulset|Statefulset Desired Replicas Number|Count|The desired number of statefulset replicas.|Namespace, Statefulset|
|KubeStatefulsetStatusReplicas|Statefulset|Statefulset Replicas Number|Count|The number of replicas per statefulset. In the absence of data, this metric will default to 0|Namespace, Statefulset|
|KubeStatefulsetStatusReplicaDifference|Statefulset|Statefulset Replicas Difference|Count|The difference between desired and current number of replicas per statefulset. In the absence of data, this metric will default to 0|Namespace, Statefulset|
|KubeletRunningContainers|Kubelet|Kubelet Running Containers|Count|Number of containers currently running. In the absence of data, this metric will retain the most recent value emitted|Container State, Host|

### ***Virtual Machine Orchestrator***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|KubevirtInfo|VMOrchestrator|Kubevirt Info|Unspecified|Kubevirt version information. In the absence of data, this metric will retain the most recent value emitted|Kube Version|
|KubevirtVirtControllerLeading|VMOrchestrator|Kubevirt Virt Controller Leading|Unspecified|Indication of whether the virt-controller is leading. The value is 1 if the virt-controller is leading, 0 otherwise. In the absence of data, this metric will default to 0|Pod Name|
|KubevirtVirtControllerReady|VMOrchestrator|Kubevirt Virt Controller Ready|Unspecified|Indication for a virt-controller that is ready to take the lead. The value is 1 if the virt-controller is ready, 0 otherwise. In the absence of data, this metric will default to 0|Pod Name|
|KubevirtVirtOperatorReady|VMOrchestrator|Kubevirt Virt Operator Ready|Unspecified|Indication for a virt operator being ready. The value is 1 if the virt operator is ready, 0 otherwise. In the absence of data, this metric will default to 0|Pod Name|
|KubevirtVmiMemoryActualBalloonBytes|VMOrchestrator|Kubevirt VMI Memory Balloon Bytes|Bytes|Current balloon size. In the absence of data, this metric will default to 0|Name, Node|
|KubevirtVmiMemoryAvailableBytes|VMOrchestrator|Kubevirt VMI Memory Available Bytes|Bytes|Amount of usable memory as seen by the domain. This value may not be accurate if a balloon driver is in use or if the guest OS doesn't initialize all assigned pages. In the absence of data, this metric will default to 0|Name, Node|
|KubevirtVmiMemorySwapInTrafficBytesTotal|VMOrchestrator|Kubevirt VMI Mem Swp In Traffic Bytes|Bytes|The total amount of data read from swap space of the guest. In the absence of data, this metric will retain the most recent value emitted|Name, Node|
|KubevirtVmiMemoryDomainBytesTotal|VMOrchestrator|Kubevirt VMI Mem Dom Bytes (Preview)|Bytes|The amount of memory allocated to the domain. The memory value in the domain XML file. In the absence of data, this metric will retain the most recent value emitted|Node|
|KubevirtVmiMemorySwapOutTrafficBytesTotal|VMOrchestrator|Kubevirt VMI Mem Swp Out Traffic Bytes|Bytes|The total amount of memory written out to swap space of the guest. In the absence of data, this metric will retain the most recent value emitted|Name, Node|
|KubevirtVmiMemoryUnusedBytes|VMOrchestrator|Kubevirt VMI Memory Unused Bytes|Bytes|The amount of memory left unused by the system. Memory that is available but used for reclaimable caches should NOT be reported as free. In the absence of data, this metric will default to 0|Name, Node|
|KubevirtVmiMemoryUsage|VMOrchestrator|Kubevirt VMI Memory Usage|Percent|The amount of memory used as a percentage. In the absence of data, this metric will default to 0|Name, Node|
|KubevirtVmiNetworkReceivePacketsTotal|VMOrchestrator|Kubevirt VMI Net Rx Packets|Bytes|Total network traffic received packets. In the absence of data, this metric will retain the most recent value emitted|Interface, Name, Node|
|KubevirtVmiNetworkTransmitPacketsDroppedTotal|VMOrchestrator|Kubevirt VMI Net Tx Packets Drop|Bytes|The total number of transmit packets dropped on virtual NIC (vNIC) interfaces. In the absence of data, this metric will retain the most recent value emitted|Interface, Name, Node|
|KubevirtVmiNetworkTransmitPacketsTotal|VMOrchestrator|Kubevirt VMI Net Tx Packets Total|Bytes|Total network traffic transmitted packets. In the absence of data, this metric will retain the most recent value emitted|Interface, Name, Node|
|KubevirtVmiOutdatedInstances|VMOrchestrator|Kubevirt VMI Outdated Count|Count|Indication for the total number of VirtualMachineInstance (VMI) workloads that aren't running within the most up-to-date version of the virt-launcher environment. In the absence of data, this metric will default to 0||
|KubevirtVmiPhaseCount|VMOrchestrator|Kubevirt VMI Phase Count|Count|Sum of Virtual Machine Instances (VMIs) per phase and node. Phase can be one of the following values: Pending, Scheduling, Scheduled, Running, Succeeded, Failed, Unknown. In the absence of data, this metric will retain the most recent value emitted|Node, Phase, Workload|
|KubevirtVmiStorageIopsReadTotal|VMOrchestrator|Kubevirt VMI Storage IOPS Read Total|Count|Total number of Input/Output (I/O) read operations. In the absence of data, this metric will retain the most recent value emitted|Drive, Name, Node|
|KubevirtVmiStorageIopsWriteTotal|VMOrchestrator|Kubevirt VMI Storage IOPS Write Total|Count|Total number of Input/Output (I/O) write operations. In the absence of data, this metric will retain the most recent value emitted|Drive, Name, Node|
|KubevirtVmiStorageReadTimesMsTotal|VMOrchestrator|Kubevirt VMI Storage Read Times Total (Preview)|Milliseconds|Total time spent on read operations from storage. In the absence of data, this metric will retain the most recent value emitted|Drive, Name, Node|
|KubevirtVmiStorageWriteTimesMsTotal|VMOrchestrator|Kubevirt VMI Storage Write Times Total (Preview)|Milliseconds|Total time spent on write operations to storage. In the absence of data, this metric will retain the most recent value emitted|Drive, Name, Node|
|NcVmiCpuAffinity|Network Cloud|CPU Pinning Map (Preview)|Count|Pinning map of virtual CPUs (vCPUs) to CPUs. In the absence of data, this metric will retain the most recent value emitted|CPU, NUMA Node, VMI Namespace, VMI Node, VMI Name|

### ***sharedVolume***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|NfsVolumeSizeBytes|Deployment|NFS Volume Size Bytes|Bytes|Total Size of the NFS volume. In the absence of data, this metric will retain the most recent value emitted|CSN Name|
|NfsVolumeUsedBytes|Deployment|NFS Volume Used Bytes|Bytes|Size of NFS volume used. In the absence of data, this metric will retain the most recent value emitted|CSN Name|

### ***Platform Cluster***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|NexusClusterHeartbeatConnectionStatus|Nexus Cluster|Cluster Heartbeat Connection Status|Count|Indicates whether the Cluster is having issues communicating with the Cluster Manager. The value of the metric is 0 when the connection is healthy and 1 when it's unhealthy. In the absence of data, this metric will retain the most recent value emitted|Reason|
|NexusClusterMachineGroupUpgrade|Nexus Cluster|Cluster Machine Group Upgrade|Count|Tracks Cluster Machine Group Upgrades performed. The value of the metric is 0 when the result is successful and 1 for all other results. In the absence of data, this metric will retain the most recent value emitted|Machine Group, Result, Upgraded From Version, Upgraded To Version|

## Baremetal servers
Baremetal server metrics are collected and delivered to Azure Monitor per minute, metrics of category HardwareMonitor are collected every 5 minutes.

### ***node metrics***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|HostBootTimeSeconds|System|Host Boot Seconds (Preview)|Seconds|Unix timestamp of the last boot of the host. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostDiskReadCompleted|Disk|Host Disk Reads Completed|Count|Total number of disk reads completed successfully. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|HostDiskReadSeconds|Disk|Host Disk Read Seconds (Preview)|Seconds|Total time spent reading from disk. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|HostDiskWriteCompleted|Disk|Total Number of Writes Completed|Count|Total number of disk writes completed successfully. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|HostDiskWriteSeconds|Disk|Host Disk Write Seconds (Preview)|Seconds|Total time spent writing to disk. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|HostDmiInformation|System|Host DMI Info|Unspecified|Environment information about the Desktop Management Interface (DMI), value is always 1. Includes labels about the system's manufacturer, model, version, serial number and UUID. In the absence of data, this metric will default to 0.|Bios Date, Bios Release, Bios Vendor, Bios Version, Board Name, Board Vendor, Board Version, Host, Product Family, Product Name, Product Sku, System Vendor|
|HostEntropyAvailableBits|Filesystem|Host Entropy Available Bits (Preview)|Count|Available node entropy, in bits. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostFilesystemAvailBytes|Filesystem|Host Filesystem Available Bytes|Count|Bytes in the filesystem on nodes which are available to non-root users. In the absence of data, this metric will default to 0|Device, FS Type, Host, Mount Point|
|HostFilesystemDeviceError|Filesystem|Host Filesystem Device Errors|Count|Indicates if there was an error getting information from the filesystem. Value is 1 if there was an error, 0 otherwise. In the absence of data, this metric will default to 0|Device, FS Type, Host, Mount Point|
|HostFilesystemFiles|Filesystem|Host Filesystem Files|Count|Total number of permitted inodes (file nodes). In the absence of data, this metric will default to 0.|Device, FS Type, Host, Mount Point|
|HostFilesystemFilesFree|Filesystem|Total Number of Free inodes|Count|Total number of free (not occupied or reserved) inodes (file nodes). In the absence of data, this metric will default to 0.|Device, FS Type, Host, Mount Point|
|HostFilesystemFilesPercentFree|Filesystem|Host Filesystem Files Percent Free|Percent|Percentage of permitted inodes which are free to be used. In the absence of data, this metric will default to 0.|Device, FS Type, Host, Mount Point|
|HostFilesystemReadOnly|Filesystem|Host Filesystem Read Only|Unspecified|Indication of whether a filesystem is readonly or not. Value is 1 if readonly, 0 otherwise. In the absence of data, this metric will retain the most recent value emitted|Device, FS Type, Host, Mount Point|
|HostFilesystemSizeBytes|Filesystem|Host Filesystem Size In Bytes|Count|Host filesystem size in bytes. In the absence of data, this metric will retain the most recent value emitted|Device, FS Type, Host, Mount Point|
|HostFilesystemUsage|Filesystem|Host Filesystem Usage In Percentage|Percent|Percentage of filesystem which is in use. In the absence of data, this metric will default to 0.|Device, FS Type, Host, Mount Point|
|HostHwmonTempCelsius|HardwareMonitor|Host Hardware Monitor Temp|Count|Temperature (in Celsius) of different hardware components. In the absence of data, this metric will retain the most recent value emitted|Chip, Host, Sensor|
|HostHwmonTempMax|HardwareMonitor|Host Hardware Monitor Temp Max|Count|Maximum temperature (in Celsius) of different hardware components. In the absence of data, this metric will retain the most recent value emitted|Chip, Host, Sensor|
|HostInletTemp|HardwareMonitor|Host Hardware Inlet Temp|Count|Inlet temperature for hardware nodes (in Celsius). In the absence of data, this metric will retain the most recent value emitted|Host|
|HostLoad1|Memory|Average Load In 1 Minute (Preview)|Count|1-minute load average of the system, as a measure of the system activity over the last minute, expressed as a fractional number (values >1.0 may indicate overload). In the absence of data, this metric will retain the most recent value emitted|Host|
|HostLoad15|Memory|Average Load In 15 Minutes (Preview)|Count|15-minute load average of the system, as a measure of the system activity over the last 15 minutes, expressed as a fractional number (values >1.0 may indicate overload). In the absence of data, this metric will retain the most recent value emitted|Host|
|HostLoad5|Memory|Average load in 5 minutes (Preview)|Count|5-minute load average of the system, as a measure of the system activity over the last 5 minutes, expressed as a fractional number (values >1.0 may indicate overload). In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemAvailBytes|Memory|Host Memory Available Bytes|Count|Memory available, in bytes. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemHWCorruptedBytes|Memory|Total Memory In Corrupted Pages|Count|Memory corrupted due to hardware issues, in bytes. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemHugePagesFree|Memory|Memory Free Huge Pages|Bytes|Total memory in huge pages that is free. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemHugePagesTotal|Memory|Memory Total Huge Pages|Bytes|Total memory in huge pages on nodes. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemTotalBytes|Memory|Host Memory Total Bytes|Bytes|Total amount of physical memory on nodes. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemSwapFreeBytes|Memory|Host Memory Swap Free Bytes|Bytes|Total swap memory that is free. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemSwapTotalBytes|Memory|Host Memory Swap Total Bytes|Bytes|Total amount of swap memory. In the absence of data, this metric will retain the most recent value emitted|Host|
|HostMemSwapAvailableSpace|Memory|Host Memory Swap Available Percentage|Percent|Percentage of swap memory that is available. In the absence of data, this metric will default to 0|Host|
|HostSpecificCPUUtilization|CPU|Host Specific CPU Utilization (Preview)|Seconds|A counter metric quantifying the CPU time that each CPU has spent in different states (or 'modes'). In the absence of data, this metric will retain the most recent value emitted|Cpu, Host, Mode|
|IdracPowerCapacityWatts|HardwareMonitor|IDRAC Power Capacity Watts|Unspecified|IDRAC Power Capacity in Watts. In the absence of data, this metric will default to 0|Host, PSU|
|IdracPowerInputWatts|HardwareMonitor|IDRAC Power Input Watts|Unspecified|IDRAC Power Input in Watts. In the absence of data, this metric will default to 0|Host, PSU|
|IdracPowerOn|HardwareMonitor|IDRAC Power On|Unspecified|IDRAC Power On Status. Value is 1 if on, 0 otherwise. In the absence of data, this metric will default to 0|Host|
|IdracPowerOutputWatts|HardwareMonitor|IDRAC Power Output Watts|Unspecified|IDRAC Power Output in Watts. In the absence of data, this metric will default to 0|Host, PSU|
|IdracSensorsTemperature|HardwareMonitor|IDRAC Sensors Temperature|Unspecified|IDRAC sensor temperature (in Celsius). In the absence of data, this metric will retain the most recent value emitted|Host, Name, Units|
|NcNodeNetworkReceiveErrsTotal|Network|Network Device Receive Errors|Count|Total number of errors encountered by network devices while receiving data. In the absence of data, this metric will retain the most recent value emitted|Hostname, Interface Name|
|NcNodeNetworkTransmitErrsTotal|Network|Network Device Transmit Errors|Count|Total number of errors encountered by network devices while transmitting data. In the absence of data, this metric will retain the most recent value emitted|Hostname, Interface Name|
|NcTotalCpusPerNuma|CPU|Total CPUs Available to Nexus per NUMA|Count|Total number of CPUs available to Nexus per NUMA. In the absence of data, this metric will retain the most recent value emitted|Hostname, NUMA Node|
|NcTotalWorkloadCpusAllocatedPerNuma|CPU|CPUs per NUMA Allocated for Nexus K8s|Count|Total number of CPUs per NUMA allocated for Nexus Kubernetes and Tenant Workloads. In the absence of data, this metric will retain the most recent value emitted|Hostname, NUMA Node|
|NcTotalWorkloadCpusAvailablePerNuma|CPU|CPUs per NUMA Available for Nexus K8s|Count|Total number of CPUs per NUMA available for use by Nexus Kubernetes and Tenant Workloads. In the absence of data, this metric will retain the most recent value emitted|Hostname, NUMA Node|
|NodeBondingActive|Network|Node Bonding Active (Preview)|Count|Total number of active network interfaces per bonding interface. In the absence of data, this metric will retain the most recent value emitted|Primary|
|NodeBondingAggregateIdMismatch|Network|Node Bond Aggregate ID Mismatch|Count|Total number of mismatches between the expected and actual link-aggregator ids. In the absence of data, this metric will retain the most recent value emitted|Host, Interface Name|
|NodeMemHugePagesFree|Memory|Node Memory Huge Pages Free (Preview)|Bytes|Free memory in NUMA huge pages. In the absence of data, this metric will retain the most recent value emitted|Host, Node|
|NodeMemHugePagesTotal|Memory|Node Memory Huge Pages Total|Bytes|Total memory in NUMA huge pages. In the absence of data, this metric will retain the most recent value emitted|Host, Node|
|NodeMemNumaFree|Memory|Node Memory NUMA (Free Memory)|Bytes|Total amount of free NUMA memory. In the absence of data, this metric will retain the most recent value emitted|Host, Node|
|NodeMemNumaShem|Memory|Node Memory NUMA (Shared Memory)|Bytes|Total amount of NUMA memory that is shared between nodes. In the absence of data, this metric will retain the most recent value emitted|Host, Node|
|NodeMemNumaUsed|Memory|Node Memory NUMA (Used Memory)|Bytes|Total amount of used NUMA memory. In the absence of data, this metric will retain the most recent value emitted|Host, Node|
|NodeNetworkCarrierChanges|Network|Node Network Carrier Changes|Count|Total number of network carrier changes. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|NodeNetworkMtuBytes|Network|Node Network Max Transmission|Bytes|Maximum Transmission Unit (MTU) for node network interfaces. In the absence of data, this metric will default to 0|Device, Host|
|NodeNetworkReceiveMulticastTotal|Network|Node Network Received Multicast Total|Bytes|Total amount of multicast traffic received by the node network interfaces. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|NodeNetworkReceivePackets|Network|Node Network Received Packets|Count|Total number of packets received by the node network interfaces. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|NodeNetworkSpeedBytes|Network|Node Network Speed Bytes|Bytes|Current network speed, in bytes per second, for the node network interfaces. In the absence of data, this metric will default to 0|Device, Host|
|NodeNetworkTransmitPackets|Network|Node Network Transmited Packets|Count|Total number of packets transmitted by the node network interfaces. In the absence of data, this metric will retain the most recent value emitted|Device, Host|
|NodeNetworkStatus|Network|Node Network Up|Count|Indicates the operational status of the nodes network interfaces. Value is 1 if operational state is 'up', 0 otherwise.|Device, Host|
|NodeNtpLeap|System|Node NTP Leap|Count|The raw leap flag value of the local NTP daemon. This indicates the status of leap seconds. Value is 0 if no adjustment is needed, 1 to add a leap second, 2 to delete a leap second, and 3 if the clock is unsynchronized. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeNtpRootDelaySeconds|System|Node NTP Root Delay Seconds|Seconds|Indicates the delay to synchronize with the root server. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeNtpRtt (Deprecated)|System|Node NTP RTT|Seconds|Deprecated - Round-trip time from node exporter collector to local NTP daemon. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeNtpSanity|System|Node NTP Sanity|Count|The aggregate health of the local NTP daemon. This includes checks for stratum, leap flag, freshness, root distance, and causality violations. Value is 1 if all checks pass, 0 otherwise. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeNtpStratum|System|Node NTP Stratum|Count|The stratum level of the local NTP daemon. This indicates the distance from the reference clock, with lower numbers representing closer proximity and higher accuracy. Values range from 1 (directly connected to reference clock) to 15 (further away), with 16 indicating the clock is unsynchronized. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeNvmeInfo|Disk|Node NVMe Info (Preview)|Count|Non-Volatile Memory express (NVMe) information, value is always 1. Provides state for a device. In the absence of data, this metric will default to 0|Device, State|
|NodeOsInfo|System|Node OS Info|Count|Node OS information, value is always 1. Provides name and version for a device. In the absence of data, this metric will retain the most recent value emitted|Host, Name, Version|
|NodeProcessState|System|Node Processes State|Count|The number of processes in each state. The possible states are D (UNINTERRUPTABLE_SLEEP), R (RUNNING & RUNNABLE), S (INTERRUPTABLE_SLEEP), T (STOPPED) and Z (ZOMBIE).|Host, State|
|NodeTimexMaxErrorSeconds|System|Node Timex Max Error Seconds|Seconds|Maximum time error between the local system and reference clock. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeTimexOffsetSeconds|System|Node Timex Offset Seconds|Seconds|Time offset between the local system and reference clock. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeTimexSyncStatus|System|Node Timex Sync Status|Count|Indicates whether the clock is synchronized to a reliable server. Value is 1 if synchronized, 0 if unsynchronized. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeVmOomKill|VM Stat|Node VM Out Of Memory Kill|Count|Total number of times a process has been terminated due to a critical lack of memory. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeVmstatPswpIn|VM Stat|Node VM PSWP In|Count|Total number of pages swapped in from disk to memory on the node. In the absence of data, this metric will retain the most recent value emitted|Host|
|NodeVmstatPswpout|VM Stat|Node VM PSWP Out|Count|Total number of pages swapped out from memory to disk on the node. In the absence of data, this metric will retain the most recent value emitted|Host|
|CpuUsageGuest|CPU|CPU Guest Usage|Count|Percentage of time that the CPU is running a virtual CPU for a guest operating system. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageGuestNice|CPU|CPU Guest Nice Usage|Count|Percentage of time that the CPU is running low-priority processes on a virtual CPU for a guest operating system. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageIdle|CPU|CPU Usage Idle|Count|Percentage of time that the CPU is idle. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageIowait|CPU|CPU Usage IO Wait|Count|Percentage of time that the CPU is waiting for I/O operations to complete. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageIrq|CPU|CPU Usage IRQ|Count|Percentage of time that the CPU is servicing hardware interrupt requests. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageNice|CPU|CPU Usage Nice|Count|Percentage of time that the CPU is in user mode, running low-priority processes. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageSoftirq|CPU|CPU Usage Soft IRQ|Count|Percentage of time that the CPU is servicing software interrupt requests. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageSteal|CPU|CPU Usage Steal|Count|Percentage of time that the CPU is in stolen time, which is time spent in other operating systems in a virtualized environment. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageSystem|CPU|CPU Usage System|Count|Percentage of time that the CPU is in system mode. In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageTotal|CPU|CPU Usage Total|Percent|Percentage of time that the CPU is active (not idle). In the absence of data, this metric will default to 0|Host, CPU|
|CpuUsageUser|CPU|CPU Usage User|Count|Percentage of time that the CPU is in user mode. In the absence of data, this metric will default to 0|Host, CPU|

## Storage Appliances
All the metrics from Storage appliance are collected and delivered to Azure Monitor per minute.

### ***pure storage***


| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|PurefaAlertsOpen|Storage Array|Nexus Storage Alerts Open|Count|Number of open alert events. In the absence of data, this metric will retain the most recent value emitted|Code, Component Type, Issue, Severity, Summary|
|PurefaAlertsTotal|Storage Array|Nexus Storage Alerts Total (Deprecated)|Count|Deprecated - Total number of alerts generated by the pure storage array. In the absence of data, this metric will retain the most recent value emitted|Severity|
|PurefaArrayPerformanceAverageBytes|Storage Array|Nexus Storage Array Performance Average Bytes|Bytes|The average operations size by dimension, where dimension can be mirrored_write_bytes_per_sec, read_bytes_per_sec or write_bytes_per_sec. In the absence of data, this metric will retain the most recent value emitted|Dimension|
|PurefaArrayPerformanceAvgBlockBytes|Storage Array|Nexus Storage Array Avg Block Bytes (Deprecated)|Bytes|Deprecated - The average block size processed by the array. In the absence of data, this metric will retain the most recent value emitted|Dimension|
|PurefaArrayPerformanceBandwidthBytes|Storage Array|Nexus Storage Array Bandwidth Bytes|Bytes|Performance of the pure storage array bandwidth in bytes per second. In the absence of data, this metric will retain the most recent value emitted|Dimension|
|PurefaArrayPerformanceIOPS|Storage Array|Nexus Storage Array IOPS (Deprecated)|Count|Deprecated - Performance of pure storage array based on input/output processing per second. In the absence of data, this metric will default to 0|Dimension|
|PurefaArrayPerformanceLatencyMs|Storage Array|Nexus Storage Array Latency|MilliSeconds|Latency of the pure storage array. In the absence of data, this metric will default to 0|Dimension|
|PurefaArrayPerformanceQdepth|Storage Array|Nexus Storage Array Queue Depth (Deprecated)|Bytes|Deprecated - Queue depth of the pure storage array. In the absence of data, this metric will retain the most recent value emitted||
|PurefaArrayPerformanceQueueDepthOps|Storage Array|Nexus Storage Array Performance Queue Depth Operations|Count|The array queue depth size by number of operations. In the absence of data, this metric will retain the most recent value emitted||
|PurefaArrayPerformanceThroughputIops|Storage Array|Nexus Storage Array Performance Throughput Iops|Count|The array throughput in operations per second. In the absence of data, this metric will retain the most recent value emitted|Dimension|
|PurefaArraySpaceBytes|Storage Array|Nexus Storage Array Space Bytes|Bytes|The amount of array space. The space filter can be used to filter the space by type. In the absence of data, this metric will retain the most recent value emitted|Space|
|PurefaArraySpaceCapacityBytes|Storage Array|Nexus Storage Array Capacity Bytes (Deprecated)|Bytes|Deprecated - Capacity of the pure storage array. In the absence of data, this metric will retain the most recent value emitted||
|PurefaArraySpaceDataReductionRatioV2|Storage Array|Nexus Storage Array Space Data Reduction Ratio|Count|Storage array overall data reduction ratio. In the absence of data, this metric will retain the most recent value emitted||
|PurefaArraySpaceDatareductionRatio|Storage Array|Nexus Storage Array Space DRR (Deprecated)|Count|Deprecated - Data reduction ratio of the pure storage array. In the absence of data, this metric will retain the most recent value emitted||
|PurefaArraySpaceProvisionedBytes|Storage Array|Nexus Storage Array Space Prov (Deprecated)|Bytes|Deprecated - Overall space provisioned for the pure storage array. In the absence of data, this metric will retain the most recent value emitted||
|PurefaArraySpaceUsage|Storage Array|Nexus Storage Array Space Used (Deprecated)|Percent|Deprecated - Space usage of the pure storage array in percentage. In the absence of data, this metric will default to 0||
|PurefaArraySpaceUsedBytes|Storage Array|Nexus Storage Array Space Used Bytes (Deprecated)|Bytes|Deprecated - Overall space used for the pure storage array. In the absence of data, this metric will retain the most recent value emitted|Dimension|
|PurefaHardwareChassisHealth|Storage Array|Nexus Storage HW Chassis Health (Deprecated)|Count|Deprecated - Denotes whether a hardware chassis of the pure storage array is healthy or not. A value of 0 means the chassis is healthy, a value of 1 means it's unhealthy. In the absence of data, this metric will default to 0||
|PurefaHardwareControllerHealth|Storage Array|Nexus Storage HW Controller Health (Deprecated)|Count|Deprecated - Denotes whether a hardware controller of the pure storage array is healthy or not. A value of 0 means the controller is healthy, a value of 1 means it's unhealthy. In the absence of data, this metric will default to 0|Controller|
|PurefaHardwarePowerVolt|Storage Array|Nexus Storage Hardware Power Volts (Deprecated)|Unspecified|Deprecated - Hardware power supply voltage of the pure storage array. In the absence of data, this metric will default to 0|Power Supply|
|PurefaHardwareTemperatureCelsiusByChassis|Storage Array|Nexus Storage Hardware Temp Celsius By Chassis (Deprecated)|Unspecified|Deprecated - Hardware temperature, in Celsius, of the controller in the pure storage array. In the absence of data, this metric will retain the most recent value emitted|Sensor, Chassis|
|PurefaHardwareTemperatureCelsiusByController|Storage Array|Nexus Storage Hardware Temp Celsius By Controller (Deprecated)|Unspecified|Deprecated - Hardware temperature, in Celsius, of the controller in the pure storage array. In the absence of data, this metric will retain the most recent value emitted|Controller, Sensor|
|PurefaHostPerformanceBandwidthBytes|Host|Nexus Storage Host Bandwidth Bytes|Bytes|Host bandwidth of the pure storage array in bytes per second. In the absence of data, this metric will retain the most recent value emitted|Dimension, Host|
|PurefaHostPerformanceIOPS|Host|Nexus Storage Host IOPS (Deprecated)|Count|Deprecated - Performance of pure storage array hosts in I/O operations per second. In the absence of data, this metric will default to 0|Dimension, Host|
|PurefaHostPerformanceLatencyMs|Host|Nexus Storage Host Latency|MilliSeconds|Latency of the pure storage array hosts. In the absence of data, this metric will default to 0|Dimension, Host|
|PurefaHostPerformanceThroughputIops|Host|Nexus Storage Host Performance Throughput Iops|Count|The host throughput in I/O operations per second. In the absence of data, this metric will retain the most recent value emitted|Host, Dimension|
|PurefaHostSpaceBytes|Host|Nexus Storage Host Space Bytes (Deprecated)|Bytes|Deprecated - Storage array host space. In the absence of data, this metric will retain the most recent value emitted|Dimension, Host|
|PurefaHostSpaceBytesV2|Host|Nexus Storage Host Space Bytes|Bytes|Storage array host space. In the absence of data, this metric will retain the most recent value emitted|Host, Space|
|PurefaHostSpaceDataReductionRatioV2|Host|Nexus Storage Host Space Data Reduction Ratio|Count|Host space data reduction ratio. In the absence of data, this metric will retain the most recent value emitted|Host|
|PurefaHostSpaceDatareductionRatio|Host|Nexus Storage Host Space DRR (Deprecated)|Count|Deprecated - Data reduction ratio of the pure storage array hosts. In the absence of data, this metric will retain the most recent value emitted|Host|
|PurefaHostSpaceSizeBytes|Host|Nexus Storage Host Space Size Bytes (Deprecated)|Bytes|Deprecated - Pure storage array hosts space size. In the absence of data, this metric will retain the most recent value emitted|Host|
|PurefaHostSpaceUsage|Host|Nexus Storage Host Space Used (Deprecated)|Percent|Deprecated - Space usage of the pure storage array's host. In the absence of data, this metric will default to 0|Host|
|PurefaHwComponentStatus|Storage Array|Nexus Storage Hardware Component Status|Count|Status of a hardware component. In the absence of data, this metric will retain the most recent value emitted|Component Name, Component Type, Component Status|
|PurefaHwComponentTemperatureCelsius|Storage Array|Nexus Storage Hardware Component Temperature Celsius|Unspecified|Temperature of the temperature sensor component in Celsius. In the absence of data, this metric will retain the most recent value emitted|Component Name|
|PurefaHwComponentVoltageVolt|Storage Array|Nexus Storage Hardware Component Voltage|Unspecified|Voltage used by the power supply component in volts. In the absence of data, this metric will retain the most recent value emitted|Component Name|
|PurefaInfo|Storage Array|Nexus Storage Info (Preview)|Unspecified|Storage array system information. In the absence of data, this metric will default to 0|Array Name|
|PurefaNetworkInterfacePerformanceErrors|Storage Array|Nexus Storage Network Interface Performance Errors|Count|The number of network interface errors per second. In the absence of data, this metric will retain the most recent value emitted|Dimension, Name, Type|
|PurefaVolumePerformanceBandwidthBytesV2|Volume|Nexus Storage Volume Performance Bandwidth Bytes|Bytes|Volume throughput in bytes per second. In the absence of data, this metric will retain the most recent value emitted|Name, Dimension|
|PurefaVolumePerformanceIOPS|Volume|Nexus Storage Volume Performance IOPS (Deprecated)|Count|Deprecated - Performance of pure storage array volumes based on input/output processing per second. In the absence of data, this metric will default to 0|Dimension, Volume|
|PurefaVolumePerformanceLatencyMs|Volume|Nexus Storage Vol Perf Latency (Deprecated)|MilliSeconds|Deprecated - Latency of the pure storage array volumes. In the absence of data, this metric will default to 0|Dimension, Volume|
|PurefaVolumePerformanceLatencyMsV2|Volume|Nexus Storage Volume Latency|MilliSeconds|Latency of the pure storage array volumes. In the absence of data, this metric will default to 0|Dimension, Name|
|PurefaVolumePerformanceThroughputBytes|Volume|Nexus Storage Vol Perf Throughput (Deprecated)|Bytes|Deprecated - Pure storage array volume throughput. In the absence of data, this metric will retain the most recent value emitted|Dimension, Volume|
|PurefaVolumePerformanceThroughputIops|Volume|Nexus Storage Volume Performance Throughput Iops|Count|Volume throughput in operations per second. In the absence of data, this metric will retain the most recent value emitted|Name, Dimension|
|PurefaVolumeSpaceBytes|Volume|Nexus Storage Volume Space Bytes (Deprecated)|Bytes|Deprecated - Pure storage array volume space. In the absence of data, this metric will retain the most recent value emitted|Dimension, Volume|
|PurefaVolumeSpaceBytesV2|Volume|Nexus Storage Volume Space Bytes|Bytes|Pure storage array volume space. In the absence of data, this metric will retain the most recent value emitted|Name, Space|
|PurefaVolumeSpaceDataReductionRatioV2|Volume|Nexus Storage Volume Space Data Reduction Ratio|Unspecified|Volume space data reduction ratio. In the absence of data, this metric will retain the most recent value emitted|Name|
|PurefaVolumeSpaceDatareductionRatio|Volume|Nexus Storage Vol Space DRR (Deprecated)|Count|Deprecated - Data reduction ratio of the pure storage array volumes. In the absence of data, this metric will retain the most recent value emitted|Volume|
|PurefaVolumeSpaceSizeBytes|Volume|Nexus Storage Volume Space Size Bytes (Deprecated)|Bytes|Deprecated - Size of the pure storage array volumes. In the absence of data, this metric will retain the most recent value emitted|Volume|
|PurefaVolumeSpaceUsage|Volume|Nexus Storage Volume Space Used (Deprecated)|Percent|Deprecated - Space usage of the pure storage array volumes. In the absence of data, this metric will default to 0|Volume|

## Cluster Management
All the metrics from Cluster Management are collected and delivered to Azure Monitor per minute.

### ***cluster management metrics***

| Metric      | Category | Display Name  | Unit | Description | Dimensions   |
|-------------|:-------------:|:-----:|:----------:|:-----------:|:--------------------------:|
|NexusClusterDeployClusterRequests|Nexus Cluster|Cluster Deploy Requests|Count|Number of cluster deploy requests|Cluster Version|
|NexusClusterConnectionStatus|Nexus Cluster|Cluster Connection Status|Count|Tracks changes in the connection status of the Cluster(s) managed by the Cluster Manager. The metric gets a value of 0 when the Cluster is connected and 1 when disconnected. The reason filter describes the connection status itself.|Cluster Name, Reason|
|NexusClusterMachineUpgrade|Nexus Cluster|Cluster Machine Upgrade|Count|Nexus machine upgrade request, successful will have a value of 0 while unsuccessful will have a value of 1.|Cluster Name, Cluster Version, Result, Upgraded From Version, Upgraded To Version, Upgrade Strategy|
|NexusClusterManagementBundleUpgrade|Nexus Cluster|Cluster Management Bundle Upgrade|Count|Nexus Cluster management bundle upgrade, successful will have a value of 0 while unsuccessful will have a value of 1.|Cluster Name, Cluster Version, Result, Upgraded From Version, Upgraded To Version|
|NexusClusterRuntimeBundleUpgrade|Nexus Cluster|Cluster Runtime Bundle Upgrade|Count|Nexus Cluster runtime bundle upgrade, successful will have a value of 0 while unsuccessful will have a value of 1.|Cluster Name, Cluster Version, Result, Upgraded From Version, Upgraded To Version|

## Network Fabric Metrics
### Network Devices Metrics

The collection interval for Network Fabric device metrics varies and you can find more information per metric (refer to column "Collection Interval").

| Metric Name     | Metric Display Name| Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? | Collection Interval |
|-------------|:-------------:|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|:-------:|
| AclMatchedPackets | Acl Matched Packets | ACL State Counters | Count | Average | Count of the number of packets matching the current ACL entry | AclSetName | Yes | Every 5 mins |
| ComponentOperStatus | Component Operational State | Component Operational State | NA | NA | The current operational status of the component | Component Name | Yes | Every 5 mins and on state change |
| CpuUtilizationMax | Cpu Utilization Max | Resource Utilization | % | Average | Maximum CPU utilization of the device over a given interval | CPU Cores | Yes | Per minute |
| CpuUtilizationMin | Cpu Utilization Min | Resource Utilization | % | Average | Minimum CPU utilization of the device over a given interval | CPU Cores | Yes | Per minute |
| CpuUtilizationAvg | Cpu Utilization Avg | Resource Utilization | % | Average | Avg cpu utilization. The Avg value of the percentage measure of the statistic over the time interval. | CPU Cores | Yes | Per minute |
| CpuUtilizationInstant | Cpu Utilization Instant | Resource Utilization | % | Average | Instantaneous Cpu utilization. The instantaneous value of the percentage measure of the statistic over the time interval. | CPU Cores | Yes | Per minute |
| FanSpeed | Fan Speed | Resource Utilization | RPM | Average | Running speed of the fan at any given point of time | Fan number | Yes | Per minute |
| MemoryAvailable | Memory Available | Resource Utilization | GiB | Average | The amount of memory available or allocated to the device at a given point in time | NA | Yes | Per minute |
| MemoryUtilized | Memory Utilized | Resource Utilization | GiB | Average | The amount of memory utilized by the device at a given point in time | NA | Yes | Per minute |
| TemperatureMax | Temperature Max | Resource Utilization | NA | Maximum | Max temperature in degrees Celsius of the component. The maximum value of the statistic over the sampling period | NA | Yes | Per minute |
| TemperatureInstant | Temperature Instantaneous | Resource Utilization | NA | NA | The instantaneous value of temperature in degrees Celsius of the component. | NA | Yes | Per minute |
| PowerSupplyInputCurrent | Power Supply Input Current | Resource Utilization | Amps | Average | The input current draw of the power supply | NA | Yes | Per minute |
| PowerSupplyInputVoltage | Power Supply Input Voltage | Resource Utilization | Volts | Average | The input voltage of the power supply | NA | Yes | Per minute |
| PowerSupplyCapacity | Power Supply Maximum Power Capacity | Resource Utilization | Watts | Average | Maximum power capacity of the power supply | NA | Yes | Per minute |
| PowerSupplyOutputCurrent | Power Supply Output Current | Resource Utilization | Amps | Average | The output current supplied by the power supply | NA | Yes | Per minute |
| PowerSupplyOutputPower| Power Supply Output Power | Resource Utilization | Watts | Average | The output power supplied by the power supply | NA | Yes | Per minute |
| PowerSupplyOutputVoltage | Power Supply Output Voltage | Resource Utilization | Volts | Average | The output voltage supplied the power supply | NA | Yes | Per minute |
| BgpPeerStatus | BGP Peer Status | BGP Status | Count | Average | Operational state of the BGP Peer represented in numerical form. 1-Idle, 2-Connect, 3-Active, 4-OpenSent, 5-OpenConfirm, 6-Established | NA | Yes | Every 5 mins and on state change |
| InterfaceOperStatus | Interface Operational State | Interface Operational State | Count | Average | Operational state of the Interface represented in numerical form. 0-Up, 1-Down, 2-Lower Layer Down, 3-Testing, 4-Unknown, 5-Dormant, 6-Not Present | NA | Yes | Every 5 mins and on state change |
| IfEthInCrcErrors | Ethernet Interface In CRC Errors | Interface State Counters | Count | Average | The count of incoming CRC errors caused by several factors for an ethernet interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfEthInFragmentFrames | Ethernet Interface In Fragment Frames | Interface State Counters | Count | Average | The count of incoming fragmented frames for an ethernet interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfEthInJabberFrames | Ethernet Interface In Jabber Frames | Interface State Counters | Count | Average | The count of incoming jabber frames. Jabber frames are typically oversized frames with invalid CRC | Interface name | Yes | Every 5 mins |
| IfEthInMacControlFrames | Ethernet Interface In MAC Control Frames | Interface State Counters | Count | Average | The count of incoming MAC layer control frames for an ethernet interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfEthInMacPauseFrames | Ethernet Interface In MAC Pause Frames | Interface State Counters | Count | Average | The count of incoming MAC layer pause frames for an ethernet interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfEthInMaxsizeExceeded | Ethernet Interface In Maxsize Exceeded | Interface State Counters | Count | Average | The total number frames received that are well-formed dropped due to exceeding the maximum frame size on the interface | Interface name | Yes | Every 5 mins |
| IfEthInOversizeFrames | Ethernet Interface In Oversize Frames | Interface State Counters | Count | Average | The count of incoming oversized frames (larger than 1518 octets) for an ethernet interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfEthOutMacControlFrames | Ethernet Interface Out MAC Control Frames | Interface State Counters | Count | Average | The count of outgoing MAC layer control frames for an ethernet interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfEthOutMacPauseFrames | Ethernet Interface Out MAC Pause Frames | Interface State Counters | Count | Average | Shows the count of outgoing MAC layer pause frames for an ethernet interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInBroadcastPkts | Interface In Broadcast Pkts | Interface State Counters | Count | Average | The count of incoming broadcast packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInDiscards | Interface In Discards | Interface State Counters | Count | Average | The count of incoming discarded packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInErrors | Interface In Errors | Interface State Counters | Count | Average | The count of incoming packets with errors for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInFcsErrors | Interface In FCS Errors | Interface State Counters | Count | Average | The count of incoming packets with FCS (Frame Check Sequence) errors for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInMulticastPkts | Interface In Multicast Pkts | Interface State Counters | Count | Average | The count of incoming multicast packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInOctets | Interface In Octets | Interface State Counters | Count | Average | The total number of incoming octets received by an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInUnicastPkts | Interface In Unicast Pkts | Interface State Counters | Count | Average | The count of incoming unicast packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfInPkts | Interface In Pkts | Interface State Counters | Count | Average | The total number of incoming packets received by an interface over a given interval of time. Includes all packets - unicast, multicast, broadcast, bad packets, etc. | Interface name | Yes | Every 5 mins |
| IfOutBroadcastPkts | Interface Out Broadcast Pkts | Interface State Counters | Count | Average | The count of outgoing broadcast packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfOutDiscards | Interface Out Discards | Interface State Counters | Count | Average | The count of outgoing discarded packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfOutErrors | Interface Out Errors | Interface State Counters | Count | Average | The count of outgoing packets with errors for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfOutMulticastPkts | Interface Out Multicast Pkts | Interface State Counters | Count | Average | The count of outgoing multicast packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfOutOctets | Interface Out Octets | Interface State Counters | Count | Average | The total number of outgoing octets sent from an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfOutUnicastPkts | Interface Out Unicast Pkts | Interface State Counters | Count | Average | The count of outgoing unicast packets for an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| IfOutPkts | Interface Out Pkts | Interface State Counters | Count | Average | The total number of outgoing packets sent from an interface over a given interval of time. Includes all packets - unicast, multicast, broadcast, bad packets, etc. | Interface name | Yes | Every 5 mins |
| LacpErrors | LACP Errors | LACP State Counters | Count | Average | The count of LACPDU illegal packet errors | Interface name | Yes | Every 5 mins |
| LacpInPkts | LACP In Pkts | LACP State Counters | Count | Average | The count of LACPDU packets received by an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| LacpOutPkts | LACP Out Pkts | LACP State Counters | Count | Average | The count of LACPDU packets sent by an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| LacpRxErrors | LACP Rx Errors | LACP State Counters | Count | Average | The count of LACPDU packets with errors received by an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| LacpTxErrors | LACP Tx Errors | LACP State Counters | Count | Average | The count of LACPDU packets with errors transmitted by an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| LacpUnknownErrors | LACP Unknown Errors | LACP State Counters | Count | Average | The count of LACPDU packets with unknown errors over a given interval of time | Interface name | Yes | Every 5 mins |
| LldpFrameIn | LLDP Frame In | LLDP State Counters | Count | Average | The count of LLDP frames received by an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| LldpFrameOut | LLDP Frame Out | LLDP State Counters | Count | Average | The count of LLDP frames transmitted from an interface over a given interval of time | Interface name | Yes | Every 5 mins |
| LldpTlvUnknown | LLDP Tlv Unknown | LLDP State Counters | Count | Average | The count of LLDP frames received with unknown TLV by an interface over a given interval of time | Interface name | Yes | Every 5 mins |
