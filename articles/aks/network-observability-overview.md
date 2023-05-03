---
title: What is Azure Kubernetes Service (AKS) network observability powered by Kappie?
description: An overview of of network observability powered by Kappie for Azure Kubernetes Service (AKS).
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: overview
ms.date: 5/23/2023
---

# What is Azure Kubernetes Service (AKS) network observability powered by Kappie?

Network observability powered by Kappie is a cloud and vendor agnostic Kubernetes networking observability platform which helps customers with enterprise grade DevOps, SecOps and compliance use cases. It is designed to cater to cluster network administrators, cluster security administrators and DevOps engineers by providing a centralized platform for monitoring application and network health, and security. Network observability is capable of collecting telemetry data from multiple sources and aggregating it into a single time-series database. Network observability is also capable of sending data to multiple destinations, such as Prometheus, Azure Monitor, and other vendors, and visualizing the data in a variety of ways, like Grafana, Azure Monitor, Azure log analytics, and more.

## Features

* eBPF based networking observability platform for Kubernetes workloads. For more information about ePBF, see [What is eBPF?](https://ebpf.io/what-is-ebpf/#what-is-ebpf).

* On demand and configurable. Product is cloud agnostic.

* Emit actionable networking observability data into industry standard Prometheus metrics.

## How it works?

Kappie is an interface to Kubernetes Cluster network traffic intended to be infrastructure and cloud agnostic. Kappie’s goals are not to provide a comprehensive Kubernetes network monitoring or troubleshooting solution, but to provide an accessible interface in which other monitoring and troubleshooting solutions can be used as a data source to support three main pillars: 

* **Observability**: Increased visibility into Kubernetes network and connection data 

* **Debuggability**: Simplifying and streamlining the debugging and troubleshooting process. 

* **Security**: Increasing data aggregation to enable better integration with existing security tools. 

:::image type="content" source="./media/network-observability-overview/kappie-components.png" alt-text="Diagram of network observability powered by Kappie diagram.":::

## Metrics

Kappie supports both Linux and Windows platforms, below are the dataplanes:

* **Cilium Linux nodes**: In this dataplane, Cilium Agent metrics are used directly as basic metrics.

* **Regular Linux nodes**: in this dataplane, Kappie daemon sets will generate data by inserting relevant eBPF progs or gathering data from linux utilities.

* **Windows nodes**: HNS and VFP stats are used for metrics.

| Metric Name | Description | Labels | Linux | Windows |
|-------------|-------------|--------|-------|---------|
| **kappie_forward_count** | Total forwarded packet count | Direction, NodeName, Cluster | Yes | Yes |
| **kappie_forward_bytes** | Total forwarded byte count | Direction, NodeName, Cluster | Yes | Yes |
| **kappie_drop_count** | Total dropped packet count | Reason, Direction, NodeName, Cluster | Yes | Yes |
| **kappie_drop_bytes** | Total dropped byte count | Reason, Direction, NodeName, Cluster | Yes | Yes |
| **kappie_tcp_state** | TCP active socket count by TCP state. (ex: Estab, timewait) | State, NodeName, Cluster | Yes | Yes |
| **kappie_tcp_connection_remote** | TCP active socket count by remote address. | Address, Port, NodeName, Cluster | Yes | No |
| **kappie_tcp_connection_stats** | TCP connection statistics. (ex: Delayed ACKs, TCPKeepAlive, TCPSackFailures) | Statistic, NodeName, Cluster | Yes | Yes |
| **kappie_tcp_flag_counters** | TCP packets count by flag. | Flag, NodeName, Cluster | Yes | Yes |
| **kappie_ip_connection_stats** | IP connection statistics. | Statistic, NodeName, Cluster | Yes | No |
| **kappie_udp_connection_stats** | UDP connection statistics. | Statistic, NodeName, Cluster | Yes | No |
| **kappie_udp_active_sockets** | UDP active socket count | NodeName, Cluster | Yes | No |
| **kappie_interface_stats** | Interface statistics. | InterfaceName, Statistic, NodeName, Cluster | Yes | Yes |

## Next steps

- For more information about Azure Kubernetes Service (AKS), see [What is Azure Kubernetes Service (AKS)?](/azure/aks/intro-kubernetes).