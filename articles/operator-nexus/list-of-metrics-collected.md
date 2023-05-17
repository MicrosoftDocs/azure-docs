---
title: List of Metrics Collected in Azure Operator Nexus.
description: List of metrics collected in Azure Operator Nexus.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/03/2023
ms.custom: template-concept
---

# List of metrics collected in Azure Operator Nexus

This section provides the list of metrics collected from the different components.

**Undercloud Kubernetes**
- [kubernetes API server](#kubernetes-api-server)
- [kubernetes Services](#kubernetes-services)
- [coreDNS](#coredns)
- [etcd](#etcd)
- [calico-felix](#calico-felix)
- [calico-typha](#calico-typha)
- [containers](#kubernetes-containers)

**Baremetal servers**
- [node metrics](#node-metrics)

**Virtual Machine orchestrator**
- [kubevirt](#kubevirt)

**Storage Appliance**
- [pure storage](#pure-storage)

## Undercloud Kubernetes
### ***Kubernetes API server***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| apiserver_audit_requests_rejected_total | Apiserver | Count | Average | Counter of apiserver requests rejected due to an error in audit logging backend. | Cluster, Node | Yes |
| apiserver_client_certificate_expiration_seconds_sum  | Apiserver | Second | Sum | Distribution of the remaining lifetime on the certificate used to authenticate a request. | Cluster, Node | Yes |
| apiserver_storage_data_key_generation_failures_total | Apiserver | Count | Average | Total number of failed data encryption key(DEK) generation operations. | Cluster, Node | Yes |
| apiserver_tls_handshake_errors_total | Apiserver | Count | Average | Number of requests dropped with 'TLS handshake error from' error | Cluster, Node | Yes |

### ***Kubernetes services***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| kube_daemonset_status_current_number_scheduled | Kube Daemonset | Count | Average | Number of Daemonsets scheduled | Cluster | Yes |
| kube_daemonset_status_desired_number_scheduled | Kube Daemonset | Count | Average | Number of daemoset replicas desired | Cluster | Yes |
| kube_deployment_status_replicas_ready | Kube Deployment | Count | Average | Number of deployment replicas present | Cluster | Yes |
| kube_deployment_status_replicas_available | Kube Deployment | Count | Average | Number of deployment replicas available | Cluster | Yes |
| kube_job_status_active | Kube job - Active | Labels | Average | Number of actively running jobs | Cluster, Job | Yes |
| kube_job_status_failed | Kube job - Failed | Labels | Average | Number of failed jobs | Cluster, Job | Yes |
| kube_job_status_succeeded | Kube job - Succeeded | Labels | Average | Number of successful jobs | Cluster, Job | Yes |
| kube_node_status_allocatable | Node - Allocatable | Labels | Average | The amount of resources allocatable for pods | Cluster, Node, Resource | Yes |
| kube_node_status_capacity | Node - Capacity | Labels | Average | The total amount of resources available for a node | Cluster, Node, Resource | Yes |
| kube_node_status_condition | Kubenode status | Labels | Average | The condition of a cluster node | Cluster, Node, Condition, Status | Yes |
| kube_pod_container_resource_limits | Pod container - Limits | Count | Average | The number of requested limit resource by a container. | Cluster, Node, Resource, Pod | Yes |
| kube_pod_container_resource_requests | Pod container - Requests | Count | Average | The number of requested request resource by a container. | Cluster, Node, Resource, Pod | Yes |
| kube_pod_container_state_started | Pod container - state | Second | Average | Start time in unix timestamp for a pod container | Cluster, Node, Container | Yes |
| kube_pod_container_status_last_terminated_reason | Pod container - state | Labels | Average | Describes the last reason the container was in terminated state | Cluster, Node, Container, Reason | Yes |
| kube_pod_container_status_ready | Container State | Labels | Average | Describes whether the containers readiness check succeeded | Cluster, Node, Container | Yes |
| kube_pod_container_status_restarts_total | Container State | Count | Average | The number of container restarts per container | Cluster, Node, Container | Yes |
| kube_pod_container_status_running | Container State | Labels | Average | Describes whether the container is currently in running state | Cluster, Node, Container | Yes |
| kube_pod_container_status_terminated | Container State | Labels | Average | Describes whether the container is currently in terminated state | Cluster, Node, Container | Yes |
| kube_pod_container_status_terminated_reason | Container State | Labels | Average | Describes the reason the container is currently in terminated state | Cluster, Node, Container, Reason | Yes |
| kube_pod_container_status_waiting | Container State | Labels | Average | Describes whether the container is currently in waiting state | Cluster, Node, Container | Yes |
| kube_pod_container_status_waiting_reason | Container State | Labels | Average | Describes the reason the container is currently in waiting state | Cluster, Node, Container, Reason | Yes                                 |
| kube_pod_deletion_timestamp | Pod Deletion Timestamp | Timestamp | NA | Unix deletion timestamp   | Cluster, Pod | Yes |
| kube_pod_init_container_status_ready | Init Container State | Labels | Average | Describes whether the init containers readiness check succeeded | Cluster, Node, Container | Yes |
| kube_pod_init_container_status_restarts_total | Init Container State | Count | Average | The number of restarts for the init container | Cluster, Container | Yes |
| kube_pod_init_container_status_running | Init Container State | Labels | Average | Describes whether the init container is currently in running state | Cluster, Node, Container | Yes |
| kube_pod_init_container_status_terminated | Init Container State | Labels | Average | Describes whether the init container is currently in terminated state | Cluster, Node, Container | Yes |
| kube_pod_init_container_status_terminated_reason | Init Container State | Labels | Average | Describes the reason the init container is currently in terminated state | Cluster, Node, Container, Reason | Yes |
| kube_pod_init_container_status_waiting | Init Container State | Labels | Average | Describes whether the init container is currently in waiting state | Cluster, Node, Container | Yes |
| kube_pod_init_container_status_waiting_reason | Init Container State | Labels | Average | Describes the reason the init container is currently in waiting state | Cluster, Node, Container, Reason | Yes |
| kube_pod_status_phase | Pod Status | Labels | Average | The pods current phase | Cluster, Node, Container, Phase | Yes |
| kube_pod_status_ready | Pod Status Ready | Count | Average | Describe whether the pod is ready to serve requests. | Cluster, Pod | Yes |
| kube_pod_status_reason | Pod Status Reason | Labels | Average | The pod status reasons | Cluster, Node, Container, Reason | Yes |
| kube_statefulset_replicas | Statefulset # of replicas | Count | Average | The number of desired pods for a statefulset | Cluster, Stateful Set | Yes |
| kube_statefulset_status_replicas | Statefulset replicas status | Count | Average | The number of replicas per statefulsets | Cluster, Stateful Set | Yes |
| controller_runtime_reconcile_errors_total | Kube Controller | Count | Average | Total number of reconciliation errors per controller | Cluster, Node, Controller | Yes |
| controller_runtime_reconcile_total | Kube Controller | Count | Average | Total number of reconciliation per controller | Cluster, Node, Controller | Yes |
| kubelet_running_containers | Containers - # of running | Labels | Average | Number of containers currently running | Cluster, node, Container State | Yes |
| kubelet_running_pods | Pods - # of running | Count | Average | Number of pods that have a running pod sandbox | Cluster, Node | Yes |
| kubelet_runtime_operations_errors_total | Kubelet Runtime Op Errors | Count | Average | Cumulative number of runtime operation errors by operation type. | Cluster, Node | Yes |
| kubelet_volume_stats_available_bytes | Pods - Storage - Available | Byte | Average | Number of available bytes in the volume | Cluster, Node, Persistent Volume Claim | Yes |
| kubelet_volume_stats_capacity_bytes | Pods - Storage - Capacity | Byte | Average | Capacity in bytes of the volume | Cluster, Node, Persistent Volume Claim | Yes |
| kubelet_volume_stats_used_bytes | Pods - Storage - Used | Byte | Average | Number of used bytes in the volume | Cluster, Node, Persistent Volume Claim | Yes |

### ***coreDNS***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| coredns_dns_requests_total | DNS Requests | Count | Average | total query count | Cluster, Node, Protocol | Yes |
| coredns_dns_responses_total | DNS response/errors | Count | Average | response per zone, rcode and plugin. | Cluster, Node, Rcode | Yes |
| coredns_health_request_failures_total | DNS Health Request Failures | Count | Average | The number of times the internal health check loop failed to query | Cluster, Node | Yes |
| coredns_panics_total | DNS panic | Count | Average | total number of panics | Cluster, Node | Yes |

### ***etcd***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| etcd_disk_backend_commit_duration_seconds_sum | Etcd Disk | Second | Average | The latency distributions of commit called by backend. | Cluster, Pod | Yes |
| etcd_disk_wal_fsync_duration_seconds_sum | Etcd Disk | Second | Average | The latency distributions of fsync called by wal | Cluster, Pod | Yes |
| etcd_server_is_leader | Etcd Server | Labels | Average | Whether node is leader | Cluster, Pod | Yes |
| etcd_server_is_learner | Etcd Server | Labels | Average | Whether node is learner | Cluster, Pod | Yes |
| etcd_server_leader_changes_seen_total | Etcd Server | Count | Average | The number of leader changes seen. | Cluster, Pod, Tier | Yes |
| etcd_server_proposals_committed_total | Etcd Server | Count | Average | The total number of consensus proposals committed. | Cluster, Pod, Tier | Yes |
| etcd_server_proposals_applied_total | Etcd Server | Count | Average | The total number of consensus proposals applied. | Cluster, Pod, Tier | Yes |
| etcd_server_proposals_failed_total | Etcd Server | Count | Average | The total number of failed proposals seen. | Cluster, Pod, Tier | Yes |

### ***calico-felix***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| felix_ipsets_calico | Felix | Count | Average | Number of active Calico IP sets. | Cluster, Node | Yes |
| felix_cluster_num_host_endpoints | Felix | Count | Average | Total number of host endpoints cluster-wide. | Cluster, Node | Yes |
| felix_active_local_endpoints | Felix | Count | Average | Number of active endpoints on this host. | Cluster, Node | Yes |
| felix_cluster_num_hosts | Felix | Count | Average | Total number of Calico hosts in the cluster. | Cluster, Node | Yes |
| felix_cluster_num_workload_endpoints | Felix | Count | Average | Total number of workload endpoints cluster-wide. | Cluster, Node | Yes |
| felix_int_dataplane_failures | Felix | Count | Average | Number of times dataplane updates failed and will be retried. | Cluster, Node | Yes |
| felix_ipset_errors | Felix | Count | Average | Number of ipset command failures. | Cluster, Node | Yes |
| felix_iptables_restore_errors | Felix | Count | Average | Number of iptables-restore errors. | Cluster, Node | Yes |
| felix_iptables_save_errors | Felix | Count | Average | Number of iptables-save errors. | Cluster, Node | Yes |
| felix_resyncs_started | Felix | Count | Average | Number of times Felix has started resyncing with the datastore. | Cluster, Node | Yes |
| felix_resync_state | Felix | Count | Average | Current datastore state. | Cluster, Node | Yes |

### ***calico-typha***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| typha_connections_accepted | Typha | Count | Average | Total number of connections accepted over time. | Cluster, Node | Yes |
| typha_connections_dropped | Typha | Count | Average | Total number of connections dropped due to rebalancing. | Cluster, Node | Yes |
| typha_ping_latency_count | Typha | Count | Average | Round-trip ping latency to client. | Cluster, Node | Yes |


### ***Kubernetes containers***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| container_fs_io_time_seconds_total | Containers - Filesystem | Second | Average | Cumulative count of seconds spent doing I/Os | Cluster, Node, Pod+Container+Interface | Yes |
| container_memory_failcnt | Containers - Memory | Count | Average | Number of memory usage hits limits | Cluster, Node, Pod+Container+Interface | Yes |
| container_memory_usage_bytes | Containers - Memory | Byte | Average | Current memory usage, including all memory regardless of when it was accessed | Cluster, Node, Pod+Container+Interface | Yes |
| container_tasks_state | Containers - Task state | Labels | Average | Number of tasks in given state | Cluster, Node, Pod+Container+Interface, State | Yes |

## Baremetal servers
### ***node metrics***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| node_boot_time_seconds | Node - Boot time | Second | Average | Unix time of last boot | Cluster, Node | Yes |
| node_cpu_seconds_total | Node - CPU | Second | Average | CPU usage | Cluster, Node, CPU, Mode | Yes |
| node_disk_read_time_seconds_total | Node - Disk - Read Time | Second | Average | Disk read time | Cluster, Node, Device | Yes |
| node_disk_reads_completed_total | Node - Disk - Read Completed | Count | Average | Disk reads completed | Cluster, Node, Device | Yes |
| node_disk_write_time_seconds_total | Node - Disk - Write Time | Second | Average | Disk write time | Cluster, Node, Device | Yes |
| node_disk_writes_completed_total | Node - Disk - Write Completed | Count | Average | Disk writes completed | Cluster, Node, Device | Yes |
| node_entropy_available_bits | Node - Entropy Available | Bits | Average | Available node entropy | Cluster, Node | Yes |
| node_filesystem_avail_bytes | Node - Disk - Available (TBD) | Byte | Average | Available filesystem size | Cluster, Node, Mountpoint | Yes |
| node_filesystem_free_bytes | Node - Disk - Free (TBD) | Byte | Average | Free filesystem size | Cluster, Node, Mountpoint | Yes |
| node_filesystem_size_bytes | Node - Disk - Size | Byte | Average | Filesystem size | Cluster, Node, Mountpoint | Yes |
| node_filesystem_files | Node - Disk - Files | Count | Average | Total number of permitted inodes | Cluster, Node, Mountpoint | Yes |
| node_filesystem_files_free | Node - Disk - Files Free | Count | Average | Total number of free inodes | Cluster, Node, Mountpoint | Yes |
| node_filesystem_device_error | Node - Disk - FS Device error | Count | Average | indicates if there was a problem getting information for the filesystem | Cluster, Node, Mountpoint | Yes |
| node_filesystem_readonly | Node - Disk - Files Readonly | Count | Average | indicates if the filesystem is readonly | Cluster, Node, Mountpoint | Yes |
| node_hwmon_temp_celsius | Node - temperature (TBD) | Celcius | Average | Hardware monitor for temperature | Cluster, Node, Chip, Sensor | Yes |
| node_hwmon_temp_max_celsius | Node - temperature (TBD) | Celcius     | Average | Hardware monitor for maximum temperature | Cluster, Node, Chip, Sensor | Yes |
| node_load1 | Node - Memory | Second | Average | 1m load average. | Cluster, Node | Yes |
| node_load15 | Node - Memory | Second | Average | 15m load average. | Cluster, Node | Yes |
| node_load5 | Node - Memory | Second | Average | 5m load average. | Cluster, Node | Yes |
| node_memory_HardwareCorrupted_bytes | Node - Memory | Byte | Average | Memory information field HardwareCorrupted_bytes. | Cluster, Node | Yes |
| node_memory_MemAvailable_bytes | Node - Memory | Byte | Average | Memory information field MemAvailable_bytes. | Cluster, Node | Yes |
| node_memory_MemFree_bytes | Node - Memory | Byte | Average | Memory information field MemFree_bytes. | Cluster, Node | Yes |
| node_memory_MemTotal_bytes | Node - Memory | Byte | Average | Memory information field MemTotal_bytes. | Cluster, Node | Yes |
| node_memory_numa_HugePages_Free | Node - Memory | Byte | Average | Free hugepages | Cluster, Node. NUMA | Yes |
| node_memory_numa_HugePages_Total | Node - Memory | Byte | Average | Total hugepages | Cluster, Node. NUMA | Yes |
| node_memory_numa_MemFree | Node - Memory | Byte | Average | Numa memory free | Cluster, Node. NUMA | Yes |
| node_memory_numa_MemTotal | Node - Memory | Byte | Average | Total Numa memory | Cluster, Node. NUMA | Yes |
| node_memory_numa_MemUsed | Node - Memory | Byte | Average | Numa memory used | Cluster, Node. NUMA | Yes |
| node_memory_numa_Shmem | Node - Memory | Byte | Average | Shared memory | Cluster, Node | Yes |
| node_os_info | Node - OS Info | Labels      | Average | OS details | Cluster, Node | Yes |
| node_network_carrier_changes_total | Node Network - Carrier changes   | Count | Average | carrier_changes_total value of `/sys/class/net/<iface>`. | Cluster, node, Device | Yes |
| node_network_receive_packets_total | NodeNetwork - receive packets | Count | Average | Network device statistic receive_packets. | Cluster, node, Device | Yes |
| node_network_transmit_packets_total | NodeNetwork - transmit packets | Count | Average | Network device statistic transmit_packets. | Cluster, node, Device | Yes |
| node_network_up | Node Network - Interface state   | Labels | Average | Value is 1 if operstate is 'up', 0 otherwise. | Cluster, node, Device | Yes |
| node_network_mtu_bytes | Network Interface - MTU | Byte | Average | mtu_bytes value of `/sys/class/net/<iface>`. | Cluster, node, Device | Yes |
| node_network_receive_errs_total | Network Interface - Error totals | Count | Average | Network device statistic receive_errs | Cluster, node, Device | Yes |
| node_network_receive_multicast_total | Network Interface - Multicast | Count | Average | Network device statistic receive_multicast. | Cluster, node, Device | Yes |
| node_network_speed_bytes | Network Interface - Speed | Byte | Average | speed_bytes value of `/sys/class/net/<iface>`. | Cluster, node, Device | Yes |
| node_network_transmit_errs_total | Network Interface - Error totals | Count | Average | Network device statistic transmit_errs. | Cluster, node, Device | Yes |
| node_timex_sync_status | Node Timex | Labels | Average | Is clock synchronized to a reliable server (1 = yes, 0 = no). | Cluster, Node | Yes |
| node_timex_maxerror_seconds | Node Timex | Second | Average | Maximum error in seconds. | Cluster, Node | Yes |
| node_timex_offset_seconds | Node Timex | Second | Average | Time offset in between local system and reference clock. | Cluster, Node | Yes |
| node_vmstat_oom_kill | Node VM Stat | Count | Average | /proc/vmstat information field oom_kill. | Cluster, Node | Yes |
| node_vmstat_pswpin | Node VM Stat | Count | Average | /proc/vmstat information field pswpin. | Cluster, Node | Yes |
| node_vmstat_pswpout | Node VM Stat | Count | Average | /proc/vmstat information field pswpout | Cluster, Node | Yes |
| node_dmi_info | Node Bios Information | Labels | Average | Node environment information | Cluster, Node | Yes |
| node_time_seconds | Node - Time | Second | NA | System time in seconds since epoch (1970) | Cluster, Node | Yes |
| idrac_power_input_watts | Node - Power | Watt | Average | Power Input | Cluster, Node, PSU | Yes |
| idrac_power_output_watts | Node - Power | Watt | Average | Power Output | Cluster, Node, PSU | Yes |
| idrac_power_capacity_watts | Node - Power | Watt | Average | Power Capacity | Cluster, Node, PSU | Yes |
| idrac_sensors_temperature | Node - Temperature | Celcius | Average | Idrac sensor Temperature | Cluster, Node, Name | Yes |
| idrac_power_on | Node - Power | Labels | Average | Idrac Power On Status | Cluster, Node | Yes |

## Virtual Machine orchestrator 
### ***kubevirt***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| kubevirt_info | Host | Labels | NA | Version information. | Cluster, Node | Yes |
| kubevirt_virt_controller_leading | Kubevirt Controller | Labels | Average | Indication for an operating virt-controller. | Cluster, Pod | Yes |
| kubevirt_virt_operator_ready | Kubevirt Operator | Labels | Average | Indication for a virt operator being ready | Cluster, Pod | Yes |
| kubevirt_vmi_cpu_affinity | VM-CPU | Labels | Average | Details the cpu pinning map via boolean labels in the form of vcpu_X_cpu_Y. | Cluster, Node, VM | Yes |
| kubevirt_vmi_memory_actual_balloon_bytes | VM-Memory | Byte | Average | Current balloon size in bytes. | Cluster, Node, VM | Yes |
| kubevirt_vmi_memory_domain_total_bytes | VM-Memory | Byte | Average | The amount of memory in bytes allocated to the domain. The memory value in domain xml file | Cluster, Node, VM | Yes |
| kubevirt_vmi_memory_swap_in_traffic_bytes_total | VM-Memory | Byte | Average | The total amount of data read from swap space of the guest in bytes. | Cluster, Node, VM | Yes |
| kubevirt_vmi_memory_swap_out_traffic_bytes_total | VM-Memory | Byte | Average | The total amount of memory written out to swap space of the guest in bytes. | Cluster, Node, VM | Yes |
| kubevirt_vmi_memory_available_bytes | VM-Memory | Byte | Average | Amount of usable memory as seen by the domain. This value may not be accurate if a balloon driver is in use or if the guest OS does not initialize all assigned pages | Cluster, Node, VM | Yes |
| kubevirt_vmi_memory_unused_bytes | VM-Memory | Byte | Average | The amount of memory left completely unused by the system. Memory that is available but used for reclaimable caches should NOT be reported as free | Cluster, Node, VM | Yes |
| kubevirt_vmi_network_receive_packets_total | VM-Network | Count | Average | Total network traffic received packets. | Cluster, Node, VM, Interface | Yes |
| kubevirt_vmi_network_transmit_packets_total | VM-Network | Count | Average | Total network traffic transmitted packets. | Cluster, Node, VM, Interface | Yes |
| kubevirt_vmi_network_transmit_packets_dropped_total  | VM-Network | Count | Average | The total number of tx packets dropped on vNIC interfaces. | Cluster, Node, VM, Interface | Yes |
| kubevirt_vmi_outdated_count | VMI | Count | Average | Indication for the total number of VirtualMachineInstance workloads that are not running within the most up-to-date version of the virt-launcher environment. | Cluster, Node, VM, Phase | Yes |
| kubevirt_vmi_phase_count | VMI | Count | Average | Sum of VMIs per phase and node. | Cluster, Node, VM, Phase | Yes |
| kubevirt_vmi_storage_iops_read_total | VM-Storage | Count | Average | Total number of I/O read operations. | Cluster, Node, VM, Drive | Yes |
| kubevirt_vmi_storage_iops_write_total | VM-Storage | Count | Average | Total number of I/O write operations. | Cluster, Node, VM, Drive | Yes |
| kubevirt_vmi_storage_read_times_ms_total | VM-Storage | Mili Second | Average | Total time (ms) spent on read operations. | Cluster, Node, VM, Drive | Yes |
| kubevirt_vmi_storage_write_times_ms_total | VM-Storage | Mili Second | Average | Total time (ms) spent on write operations | Cluster, Node, VM, Drive | Yes |
| kubevirt_virt_controller_ready | Kubevirt Controller | Labels | Average | Indication for a virt-controller that is ready to take the lead. | Cluster, Pod | Yes |

## Storage Appliances
### ***pure storage***

| Metric      | Category | Unit | Aggregation Type | Description     | Dimensions     | Exportable via <br/>Diagnostic Settings? |
|-------------|:-------------:|:-----:|:----------:|-------------------------------------|:---------------------:|:-------:|
| purefa_hardware_component_health | FlashArray | Labels | NA | FlashArray hardware component health status | Cluster, Appliance, Controller+Component+Index | Yes |
| purefa_hardware_power_volts | FlashArray | Volt | Average | FlashArray hardware power supply voltage | Cluster, Power Supply, Appliance | Yes |
| purefa_volume_performance_throughput_bytes | Volume | Byte | Average | FlashArray volume throughput | Cluster, Volume, Dimension, Appliance | Yes |
| purefa_volume_space_datareduction_ratio | Volume | Count | Average | FlashArray volumes data reduction ratio | Cluster, Volume, Appliance | Yes |
| purefa_hardware_temperature_celsius | FlashArray | Celcius | Average | FlashArray hardware temperature sensors | Cluster, Controller, Sensor, Appliance | Yes |
| purefa_alerts_total | FlashArray | Count | Average | Number of alert events | Cluster, Severity | Yes |
| purefa_array_performance_iops | FlashArray | Count | Average | FlashArray IOPS | Cluster, Dimension, Appliance | Yes |
| purefa_array_performance_qdepth | FlashArray | Count | Average | FlashArray queue depth | Cluster, Appliance | Yes |
| purefa_info | FlashArray | Labels | NA | FlashArray host volumes connections | Cluster, Array | Yes |
| purefa_volume_performance_latency_usec | Volume | MicroSecond | Average | FlashArray volume IO latency | Cluster, Volume, Dimension, Appliance | Yes |
| purefa_volume_space_bytes | Volume | Byte | Average | FlashArray allocated space | Cluster, Volume, Dimension, Appliance | Yes |
| purefa_volume_performance_iops | Volume | Count | Average | FlashArray volume IOPS | Cluster, Volume, Dimension, Appliance | Yes |
| purefa_volume_space_size_bytes | Volume | Byte | Average | FlashArray volumes size | Cluster, Volume, Appliance | Yes |
| purefa_array_performance_latency_usec | FlashArray | MicroSecond | Average | FlashArray latency | Cluster, Dimension, Appliance | Yes |
| purefa_array_space_used_bytes | FlashArray | Byte | Average | FlashArray overall used space | Cluster, Dimension, Appliance | Yes |
| purefa_array_performance_bandwidth_bytes | FlashArray | Byte | Average | FlashArray bandwidth | Cluster, Dimension, Appliance | Yes |
| purefa_array_performance_avg_block_bytes | FlashArray | Byte | Average | FlashArray avg block size | Cluster, Dimension, Appliance | Yes |
| purefa_array_space_datareduction_ratio | FlashArray | Count | Average | FlashArray overall data reduction | Cluster, Appliance | Yes |
| purefa_array_space_capacity_bytes | FlashArray | Byte | Average | FlashArray overall space capacity | Cluster, Appliance | Yes |
| purefa_array_space_provisioned_bytes | FlashArray | Byte | Average | FlashArray overall provisioned space | Cluster, Appliance | Yes |
| purefa_host_space_datareduction_ratio | Host | Count | Average | FlashArray host volumes data reduction ratio | Cluster, Node, Appliance | Yes |
| purefa_host_space_size_bytes | Host | Byte | Average | FlashArray host volumes size | Cluster, Node, Appliance | Yes |
| purefa_host_performance_latency_usec | Host | MicroSecond | Average | FlashArray host IO latency | Cluster, Node, Dimension, Appliance | Yes |
| purefa_host_performance_bandwidth_bytes | Host | Byte | Average | FlashArray host bandwidth | Cluster, Node, Dimension, Appliance | Yes |
| purefa_host_space_bytes | Host | Byte | Average | FlashArray host volumes allocated space | Cluster, Node, Dimension, Appliance | Yes |
| purefa_host_performance_iops | Host | Count | Average | FlashArray host IOPS | Cluster, Node, Dimension, Appliance | Yes |