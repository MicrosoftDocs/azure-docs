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

Advanced Container Networking Services Standard unlocks a comprehensive suite of features for in-depth network analysis and troubleshooting. Empowering you to diagnose and resolve issues with greater efficiency. Advanced Container Networking Services Standard builds  provides a robust network troubleshooting experience. Built on the open-source project Retina (https://retina.sh/), Advanced Container Networking Services Standard collects and analyzes network traffic data, DNS data, giving you an even more granular picture at pod level. 

## What is Included in Advanced Container Networking Services Standard?

Advanced Container Networking Services Standard offers comprehensive network monitoring for your containerized applications. Advanced Container Networking Services Standard works seamlessly with both Cilium and Non-Cilium data planes. The Advanced Container Networking Services Standard provides insights into key network health indicators like traffic volume and dropped packets, helping you identify potential bottlenecks before they impact performance. . Advanced Container Networking Services Standard integrates with Hubble, a powerful network observability tool that includes Hubble CLI for deep dives into traffic flow and Hubble UI for easy visualization. This combination empowers you to proactively troubleshoot issues, optimize resource allocation, and ensure secure communication within your containerized environment.

:::image type="content" source="./media/advanced-container-networking-services-standard/advanced-container-networking-services-standard.png" alt-text="Diagram of Advanced Container Networking Services Standard.":::

## Key Benefits of Advanced Container Networking Services Standard

* **Proactive Problem Detection:** Identify potential bottlenecks and congestion issues before they affect your applications' performance. Advanced Container Networking Services Standard  monitors key network health indicators, including traffic volume, dropped traffic, DNS statistics and information on number of connections.

* **Deep Visibility into Network Activity:** Gain valuable insights into how your applications communicate with each other. Advanced Container Networking Services Standard integrates with Hubble, a powerful network observability tool that offers:
  * **Hubble CLI:** Troubleshoot performance issues and optimize resource allocation by monitoring data flow between applications, identifying bottlenecks, and tracking traffic origin and destination.
  * **Hubble UI:** Easily visualize your cluster's network activity with a user-friendly interface. Hubble UI helps you troubleshoot performance, optimize resource allocation, and ensure secure communication within your containers. You're responsible for provisioning and managing the infrastructure required to run Hubble UI.

* **Azure managed Prometheus and Grafana:** This option involves using a managed service provided by Azure. The managed service takes care of the infrastructure and maintenance of Prometheus and Grafana, allowing you to focus on configuring and visualizing your metrics. This option is convenient if you prefer not to manage the underlying infrastructure.

* **BYO Prometheus and Grafana:** Alternatively, you can choose to set up your own Prometheus and Grafana instances. You're responsible for provisioning and managing the infrastructure required to run Prometheus and Grafana. Install and configure Prometheus to scrape the metrics generated and store them. Similarly, Grafana must be set up to connect to Prometheus and visualize the collected data.

* **Multi CNI Support:** Advanced Container Networking Services Standard supports both Azure CNI and Kubenet network plugins.


## Metrics

###TODO - To be updated 

| Metric Name | Description | Labels |
|-------------|-------------|--------|
| **hubble_dns_queries_total** | Total DNS requests by query | source/destination, query, qtypes (query type), |
| **hubble_dns_responses_total** | Total DNS responses by query/response | source/destination, query, qtypes (query type), rcode (response code), ips_returned
| **hubble_drop_total** | Total dropped packet count | source/destination, protocol, reason |
| **hubble_flows_processed_total** | Total network flows processed (L4/L7 traffic) | source/destination, protocol, verdict, type, subtype |
| **hubble_tcp_flags_total** | TCP active socket count by TCP state. | source/destination, flag |


## Limitations

###TODO - To be updated 

## Scale

Certain scale limitations apply when you use Azure managed Prometheus and Grafana. For more information, see [Scrape Prometheus metrics at scale in Azure Monitor](/azure/azure-monitor/essentials/prometheus-metrics-scrape-scale)
###TODO - To be updated 

## Next steps

- For more information about Azure Kubernetes Service (AKS), see [What is Azure Kubernetes Service (AKS)?](/azure/aks/intro-kubernetes).

- To create an AKS cluster with Network Observability and Azure managed Prometheus and Grafana, see [Setup  Advanced Container Networking Services Standard for Azure Kubernetes Service (AKS) Azure managed Prometheus and Grafana](advanced-container-networking-services-standard-cli.md).

- To create an AKS cluster with Network Observability and BYO Prometheus and Grafana, see [Setup Network Observability for Azure Kubernetes Service (AKS) BYO Prometheus and Grafana](advanced-container-networking-services-standard-byo-cli.md).
