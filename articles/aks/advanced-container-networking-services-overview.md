---
title: What is Advanced Container Networking Services for Azure Kubernetes Service (AKS)?
description: An overview of Advanced Container Networking Services for Azure Kubernetes Service (AKS).
author: Khushbu-Parekh
ms.author: kparekh
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: overview
ms.date: 05/10/2024
---

# What is Advanced Container Networking Services?

Kubernetes is a powerful tool for managing containerized applications. As your deployments grow, ensuring smooth network operation becomes more challenging.
Identifying and resolving network issues within a complex Kubernetes cluster can be a time-consuming task.

Advanced Container Networking Services is a comprehensive suite built upon existing Azure Kubernetes Services (AKS) networking solutions. Designed to address the evolving demands of modern containerized applications, Advanced Container Networking Services tackles complex challenges in observability, security, and compliance.

## What is included in Advanced Container Networking Services?

The first feature in this suite is Advanced Observability. This provides enhanced monitoring and diagnostics tools to give you a clear picture of your containerized workloads. But that's just the beginning! The Advanced Container Networking Services suite is packed with potential upcoming features unlocking even more powerful ways to manage your network within AKS clusters.

## What is Advanced Observability?

Advanced Observability is the foundation of the Advanced Container Networking Services suite. It equips you with next-level monitoring and diagnostics tools, providing unparalleled visibility into your containerized workloads. These tools empower you to pinpoint and troubleshoot network issues with ease, ensuring optimal performance for your applications.

Advanced Observability offers compatibility across all Linux workloads. It seamlessly integrates with Hubble, regardless of the underlying dataplanes.

Advanced Container Networking Services offers support for both Cilium and non-Cilium dataplanes, ensuring flexibility for your container networking needs.

:::image type="content" source="./media/advanced-container-networking-services/advanced-network-observability.png" alt-text="Diagram of Advanced Network Observability.":::

    * Cilium Dataplane: This is a high-performance, eBPF-based dataplane specifically designed for Kubernetes environments.

    * Non-Cilium Dataplane: Powered by the open-source project [Retina](https://retina.sh), this dataplane provides a compatible alternative for users not using Cilium. Retina is also built using eBPF technology.

> [!NOTE]
> For deployments leveraging Cilium dataplanes, Advanced Observability is readily available starting with Kubernetes version 1.29.
> There are no Kubernetes version limitations for non-Cilium Linux dataplanes – Advanced Observability is universally supported.

### Features of Advanced Observability

Advanced Observability offers the following capabilities to monitor network-related issues in your cluster:

- **Node-Level Metrics:** Understanding the health of your container network at the node-level is crucial for maintaining optimal application performance. These metrics indicate traffic volume, dropped packets, number of connections, etc. by node. Since they are Prometheus metrics, you can view them in Grafana or create custom alerts.

- **Hubble Metrics (DNS and Pod-Level Metrics):** These Prometheus metrics include source/destination Pod information, empowering you to pinpoint network-related issues at a granular level. Metrics cover traffic volume, dropped packets, TCP resets, L4/L7 packet flows, etc. There are also DNS metrics (currently only for Non-Cilium dataplanes), covering DNS errors and DNS requests missing respones.

- **Hubble Flow Logs:** Flow logs unlock deep visibility into your cluster's network activity. All communications to/from Pods are logged, allowing you to investigate connectivity issues and more. Flow logs help answer questions such as: did the server receive the client's request? What is the round-trip latency between the client's request and server's response?

  - **Hubble CLI:** The Hubble Command-Line Interface (CLI) provides a means to retrieve flow logs from across the cluster with customizable filtering and formatting.

  - **Hubble UI:** Hubble UI is a user-friendly web-browser interface for exploring your cluster's network activity. It creates a service-connection graph based on Flow logs, and it also displays flow logs for the selected namespace.

    > [!Note]
    > Users are responsible for provisioning and managing the infrastructure required to run **Hubble UI**.

### Key Benefits of Advanced Observability

- **CNI-Agnostic**: Supported on kubenet and all Azure CNI modes.

- **Cilium and Non-Cilium**: Uniform and seamless experince across Cilium and Non-Cilium dataplanes.

- **eBPF-Based Network Observability:** Identify potential bottlenecks and congestion issues before they impact application performance. Gain insights into key network health indicators, including traffic volume, dropped packets, and connection information.

- **Deep Visibility into Network Activity:** Understand how your applications are communicating with each other through detailed network flow logs.

- **Simplified Monitoring Options:** Choose between:
  - **Azure Managed Prometheus and Grafana:** A convenient option where Azure manages the infrastructure and maintenance, allowing you to focus on configuring and visualizing metrics.
  - **Bring Your Own (BYO) Prometheus and Grafana:** Set up your own instances and manage the underlying infrastructure.

### Metrics

#### Node-Level Metrics

The following metrics are aggregated per Node. All metrics include the labels:

- `cluster`
- `instance` (Node name)

# [**Non-Cilium**](#tab/non-cilium)

On Non-Cilium dataplane, the Network Observability add-on provides metrics in both Linux and Windows platforms.
The below table outlines the different metrics generated.

| Metric Name                                    | Description | Extra Labels | Linux | Windows |
|------------------------------------------------|-------------|--------------|-------|---------|
| **networkobservability_forward_count**         | Total forwarded packet count | `direction` | ✅ | ✅ |
| **networkobservability_forward_bytes**         | Total forwarded byte count | `direction` | ✅ | ✅ |
| **networkobservability_drop_count**            | Total dropped packet count | `direction`, `reason` | ✅ | ✅ |
| **networkobservability_drop_bytes**            | Total dropped byte count | `direction`, `reason` | ✅ | ✅ |
| **networkobservability_tcp_state**             | TCP currently active socket count by TCP state. | `state` | ✅ | ✅ |
| **networkobservability_tcp_connection_remote** | TCP currently active socket count by remote IP/port. | `address` (IP), `port` | ✅ | ❌ |
| **networkobservability_tcp_connection_stats**  | TCP connection statistics. (ex: Delayed ACKs, TCPKeepAlive, TCPSackFailures) | `statistic` | ✅ | ✅ |
| **networkobservability_tcp_flag_counters**     | TCP packets count by flag. | `flag` | ❌ | ✅ |
| **networkobservability_ip_connection_stats**   | IP connection statistics. | `statistic` | ✅ | ❌ |
| **networkobservability_udp_connection_stats**  | UDP connection statistics. | `statistic` | ✅ | ❌ |
| **networkobservability_udp_active_sockets**    | UDP currently active socket count |  | ✅ | ❌ |
| **networkobservability_interface_stats**       | Interface statistics. | InterfaceName, `statistic` | ✅ | ✅ |

# [**Cilium**](#tab/cilium)

Cilium currently only supports Linux nodes.
It exposes several metrics including the following for network observability.

| Metric Name                    | Description                  | Extra Labels          |Linux | Windows |
|--------------------------------|------------------------------|-----------------------|-------|---------|
| **cilium_forward_count_total** | Total forwarded packet count | `direction`           | ✅ | ❌ |
| **cilium_forward_bytes_total** | Total forwarded byte count   | `direction`           |✅ | ❌ |
| **cilium_drop_count_total**    | Total dropped packet count   | `direction`, `reason` | ✅ | ❌ |
| **cilium_drop_bytes_total**    | Total dropped byte count     | `direction`, `reason` | ✅ | ❌ |

---

#### Pod-Level Metrics (Hubble Metrics)

The following metrics are aggregated per Pod (still containing Node information). All metrics include the labels:
- `cluster`
- `instance` (Node name)
- `source` or `destination`

For *outgoing traffic*, there will be a `source` label with source Pod namespace/name.
For *incoming traffic*, there will be a `destination` label with destination Pod namespace/name.

| Metric Name                      | Description                  | Extra Labels          | Linux | Windows |
|----------------------------------|------------------------------|-----------------------|-------|---------|
| **hubble_dns_queries_total**     | Total DNS requests by query  | `source` or `destination`, `query`, `qtypes` (query type) | ✅ | ❌ |
| **hubble_dns_responses_total**   | Total DNS responses by query/response | `source` or `destination`, `query`, `qtypes` (query type), `rcode` (return code), `ips_returned` (number of IPs) | ✅ | ❌ |
| **hubble_drop_total**            | Total dropped packet count | `source` or `destination`, `protocol`, `reason` | ✅ | ❌ |
| **hubble_tcp_flags_total**       | Toctal TCP packets count by flag. | `source` or `destination`, `flag` | ✅ | ❌ |
| **hubble_flows_processed_total** | Total network flows processed (L4/L7 traffic) | `source` or `destination`, `protocol`, `verdict`, `type`, `subtype` | ✅ | ❌ |

### Limitations

- Pod-level metrics available only on Linux.
- Cilium dataplane is supported starting with Kubernetes version 1.29.
- Metric labels may have subtle differences between Cilium and Non-Cilium clusters.

### Scale

Certain scale limitations apply when you use Azure managed Prometheus and Grafana. For more information, see [Scrape Prometheus metrics at scale in Azure Monitor](/azure/azure-monitor/essentials/prometheus-metrics-scrape-scale)

## Pricing

This feature is going to be charged. We will share more details in coming weeks

## Next steps

- For more information about Azure Kubernetes Service (AKS), see [What is Azure Kubernetes Service (AKS)?](/azure/aks/intro-kubernetes).

- To create an AKS cluster with Advanced Network Observability and Azure managed Prometheus and Grafana, see [Setup Advanced Network Observability for Azure Kubernetes Service (AKS) Azure managed Prometheus and Grafana](advanced-network-observability-cli.md).

- To create an AKS cluster with Advanced Network Observability and BYO Prometheus and Grafana, see [Setup Advanced Network Observability for Azure Kubernetes Service (AKS) BYO Prometheus and Grafana](advanced-network-observability-byo-cli.md).
