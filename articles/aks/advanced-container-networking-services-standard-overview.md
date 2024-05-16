---
title: What is Advanced Container Networking Services Standard for Azure Kubernetes Service (AKS)?
description: An overview of Advanced Container Networking Services Standard for Azure Kubernetes Service (AKS).
author: Khushbu-Parekh
ms.author: kparekh
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: overview
ms.date: 05/10/2024
---

# What is Advanced Container Networking Services Standard ?
Kubernetes is a powerful tool for managing containerized applications. As your deployments grow, ensuring smooth network operation becomes more challenging. Identifying and resolving network issues within a complex Kubernetes cluster can be a time-consuming task.

Advanced Container Networking Services Standard unlocks a comprehensive suite of features for in-depth network analysis and troubleshooting. Empowering you to diagnose and resolve issues with greater efficiency. Advanced Container Networking Services Standard builds  provides a robust network troubleshooting experience. Built on the open-source project Retina (https://retina.sh/), Advanced Container Networking Services Standard collects and analyzes network traffic data, DNS data,  you can obtain metrics at a granular level down to the pod.

Advanced Container Networking Services Standard also integrates with Hubble, a powerful network observability tool that includes Hubble CLI for deep dives into traffic flow and Hubble UI for easy visualization. This combination empowers you to proactively troubleshoot issues, optimize resource allocation, and ensure secure communication within your containerized environment. 

:::image type="content" source="./media/advanced-container-networking-services-standard/advanced-container-networking-services-standard.png" alt-text="Diagram of Advanced Container Networking Services Standard.":::

> [!NOTE]
> This feature is going to be charged. We will share more details incoming weeks

## What is Included in Advanced Container Networking Services Standard?

Azure Container Networking Service Standard solution offers the following capabilities to monitor network related issues in your cluster:

 * **Metrics:** Understanding the health of your container network at the node-level is crucial for maintaining optimal application performance. By leveraging advanced observability unlocks granular pod-level metrics. Analyze traffic volume, dropped packets, source/destination information, and even DNS metrics at pod-level. This empowers you to pinpoint network related issues at much granular level compared to the network observability , ensuring the health and optimal performance of your applications across the entire cluster.

* **Hubble CLI:** Hubble CLI unlocks deep visibility into your cluster's network activity. It allows you to monitor data flow between applications, identifying bottlenecks, and tracking traffic origin and destination which proactively troubleshoot performance issues, optimize resource allocation, and ensure only authorized communication occurs, all contributing to a smoothly running and secure containerized environment.

  > [!Note]
  > You're responsible for provisioning and managing the infrastructure required to run **Hubble UI**.

* **Hubble UI:** Hubble UI provides a user-friendly interface for exploring your cluster's network activity with Hubble. This intuitive visualization empowers you to troubleshoot performance issues, optimize resource allocation, and ensure there is secure communication within your cluster, all contributing to a smoothly running and well-managed containerized environment.


## Key Benefits of Advanced Container Networking Services Standard

* **Proactive Problem Detection:** Identify potential bottlenecks and congestion issues before they impact application performance. Gain insights into key network health indicators, including traffic volume, dropped packets, and connection information.

* **Deep Visibility into Network Activity:** Understand how your applications communicate with each other through detailed network analysis.

* **Simplified Monitoring Options:** Choose between:
    **Azure Managed Prometheus and Grafana:** A convenient option where Azure manages the infrastructure and maintenance, allowing you to focus on configuring and visualizing metrics.
    **Bring Your Own (BYO) Prometheus and Grafana:** Set up your own instances and manage the underlying infrastructure.

* **Multi CNI Support:** Advanced Container Networking Services Standard supports both Azure CNI and Kubenet network plugins.

## Comparison between Network Observability vs Advanced Container Networking Services Standard

| **Feature** | **Network Observability** | **Azure Container Networking Service - Standard** |
|-------------|-------------|--------|
| **Node level metrics** | ✅  | ✅  | 
| **Pod level level metric** | ❌ | ✅  | 
| **Hubble CLI**  | ❌ | ✅  |
| **Hubble UI** | ❌ | ✅  |


## Metrics


### Node-Level Metrics

The following metrics are aggregated per Node and these metrics support labels like **cluster** and **instance (Node name)**

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

### Pod-Level Metrics (Hubble Metrics)

The following metrics are aggregated per Pod (still containing Node information).

For *outgoing traffic*, there will be a `source` label with source Pod namespace/name.
For *incoming traffic*, there will be a `destination` label with destination Pod namespace/name.

| Metric Name                      | Description                  | Extra Labels          | Linux | Windows |
|----------------------------------|------------------------------|-----------------------|-------|---------|
| **hubble_dns_queries_total**     | Total DNS requests by query  | `source` or `destination`, `query`, `qtypes` (query type) | ✅ | ❌ |
| **hubble_dns_responses_total**   | Total DNS responses by query/response | `source` or `destination`, `query`, `qtypes` (query type), `rcode` (return code), `ips_returned` (number of IPs) | ✅ | ❌ |
| **hubble_drop_total**            | Total dropped packet count | `source` or `destination`, `protocol`, `reason` | ✅ | ❌ |
| **hubble_tcp_flags_total**       | Toctal TCP packets count by flag. | `source` or `destination`, `flag` | ✅ | ❌ |
| **hubble_flows_processed_total** | Total network flows processed (L4/L7 traffic) | `source` or `destination`, `protocol`, `verdict`, `type`, `subtype` | ✅ | ❌ |

## Limitations

* Pod level metrics available only on Linux  

## Scale

Certain scale limitations apply when you use Azure managed Prometheus and Grafana. For more information, see [Scrape Prometheus metrics at scale in Azure Monitor](/azure/azure-monitor/essentials/prometheus-metrics-scrape-scale)

## Next steps

- For more information about Azure Kubernetes Service (AKS), see [What is Azure Kubernetes Service (AKS)?](/azure/aks/intro-kubernetes).

- To create an AKS cluster with Network Observability and Azure managed Prometheus and Grafana, see [Setup  Advanced Container Networking Services Standard for Azure Kubernetes Service (AKS) Azure managed Prometheus and Grafana](advanced-container-networking-services-standard-cli.md).

- To create an AKS cluster with Network Observability and BYO Prometheus and Grafana, see [Setup Network Observability for Azure Kubernetes Service (AKS) BYO Prometheus and Grafana](advanced-container-networking-services-standard-byo-cli.md).
