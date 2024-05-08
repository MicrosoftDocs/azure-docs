---
title: What is Advanced Container Networking Services- Free?
description: An overview of Advanced Container Networking Services- Free for Azure Kubernetes Service (AKS).
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: overview
ms.date: 04/30/2024
---

# What is Advanced Container Networking Services - Free ?
Kubernetes is a powerful tool for managing containerized applications, but as your deployments grow, ensuring smooth network operation becomes more challenging. Identifying and resolving network issues within a complex Kubernetes cluster can be a time-consuming task.

Advanced Container Networking Services - Free provides you with essential network observability feature, empowering you to gain insights into your container network's health at the node-level. Built on the open-source project Retina (https://retina.sh/), Advanced Container Networking Services - Free collects and analyzes network traffic data, giving you a cluster and node-level picture of what's happening within your cluster.

## What is Included in Advanced Container Networking Services - Free?

Advanced Container Networking Services - Free operates seamlessly on Non-Cilium and Cilium data-planes to gain insights into key network health indicators for your cluster's nodes, including traffic volume, dropped traffic, and the number of connections. This data helps you identify potential bottlenecks or congestion issues before they impact application performance. This solution offers a centralized way to monitor network issues in your cluster at the node-level. 

Starting with Kubernetes version 1.29, Advanced Container Networking Services - Free should be enabled by default on your AKS cluster if you have Azure Monitor metrics enabled.

:::image type="content" source="./media/advanced-container-networking-services/advanced-container-networking-services-free.png" alt-text="Diagram of Advanced Container Networking Services - Free.":::

## Overview of Advanced Container Networking Services - Free 

Advanced Container Networking Services - Free  allows for the collection and conversion of useful metrics into Prometheus format, which can then be visualized in Grafana. There are two options available for using Prometheus and Grafana in this context: Azure managed [Prometheus](/azure/azure-monitor/essentials/prometheus-metrics-overview) and [Grafana](/azure/azure-monitor/visualize/grafana-plugin) or BYO Prometheus and Grafana.

* **Azure managed Prometheus and Grafana:** This option involves using a managed service provided by Azure. The managed service takes care of the infrastructure and maintenance of Prometheus and Grafana, allowing you to focus on configuring and visualizing your metrics. This option is convenient if you prefer not to manage the underlying infrastructure.

* **BYO Prometheus and Grafana:** Alternatively, you can choose to set up your own Prometheus and Grafana instances. In this case, you're responsible for provisioning and managing the infrastructure required to run Prometheus and Grafana. Install and configure Prometheus to scrape the metrics generated and store them. Similarly, Grafana needs to be set up to connect to Prometheus and visualize the collected data.

* **Multi CNI Support:** Advanced Container Networking Services - Free supports both Azure CNI and Kubenet network plugins.

## Metrics

Advanced Container Networking Services - Free currently only supports node level metrics in both Linux and Windows platforms. The below table outlines the different metrics generated.

| Metric Name | Description | Labels | Linux | Windows |
|-------------|-------------|--------|-------|---------|
| **networkobservability_forward_count** | Total forwarded packet count | Direction, NodeName, Cluster | Yes | Yes |
| **networkobservability_forward_bytes** | Total forwarded byte count | Direction, NodeName, Cluster | Yes | Yes |
| **networkobservability_drop_count** | Total dropped packet count | Reason, Direction, NodeName, Cluster | Yes | Yes |
| **networkobservability_drop_bytes** | Total dropped byte count | Reason, Direction, NodeName, Cluster | Yes | Yes |
| **networkobservability_tcp_state** | TCP active socket count by TCP state. | State, NodeName, Cluster | Yes | Yes |
| **networkobservability_tcp_connection_remote** | TCP active socket count by remote address. | Address, Port, NodeName, Cluster | Yes | No |
| **networkobservability_tcp_connection_stats** | TCP connection statistics. (ex: Delayed ACKs, TCPKeepAlive, TCPSackFailures) | Statistic, NodeName, Cluster | Yes | Yes |
| **networkobservability_tcp_flag_counters** | TCP packets count by flag. | Flag, NodeName, Cluster | Yes | Yes |
| **networkobservability_ip_connection_stats** | IP connection statistics. | Statistic, NodeName, Cluster | Yes | No |
| **networkobservability_udp_connection_stats** | UDP connection statistics. | Statistic, NodeName, Cluster | Yes | No |
| **networkobservability_udp_active_sockets** | UDP active socket count | NodeName, Cluster | Yes | No |
| **networkobservability_interface_stats** | Interface statistics. | InterfaceName, Statistic, NodeName, Cluster | Yes | Yes |

## Limitations

* Pod level metrics aren't supported.
* Hubble is not supported 
* DNS metrics are not available

## Scale

Certain scale limitations apply when you use Azure managed Prometheus and Grafana. For more information, see [Scrape Prometheus metrics at scale in Azure Monitor](/azure/azure-monitor/essentials/prometheus-metrics-scrape-scale)

## Next steps

- For more information about Azure Kubernetes Service (AKS), see [What is Azure Kubernetes Service (AKS)?](/azure/aks/intro-kubernetes).

- To create an AKS cluster with Network Observability and Azure managed Prometheus and Grafana, see [Setup Network Observability for Azure Kubernetes Service (AKS) Azure managed Prometheus and Grafana](network-observability-managed-cli.md).

- To create an AKS cluster with Network Observability and BYO Prometheus and Grafana, see [Setup Network Observability for Azure Kubernetes Service (AKS) BYO Prometheus and Grafana](network-observability-byo-cli.md).

