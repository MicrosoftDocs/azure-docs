---
title: What is Advanced Container Networking Services?
description: An overview of Advanced Container Networking Services for Azure Kubernetes Service (AKS).
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: overview
ms.date: 04/30/2024
---

# What is Advanced Container Networking Services?

As containerized applications become more intricate, managing their network infrastructure on AKS effectively presents a growing challenge. Strong  network  troubleshooting capabilities are crucial to ensure smooth operation, and the ability to pinpoint and resolve network issues becomes essential.

Azure Container Networking Services empowers you to elevate the networking troubleshooting capabilities of your Azure Kubernetes Service   (AKS) clusters. Leveraging the open-source project Retina (https://retina.sh/), Azure Container Networking Services provides a comprehensive suite of tools for in-depth network observability.

## Overview of Advanced  Container Networking Services in AKS 
Azure Container Networking Service operates seamlessly on Non-Cilium and Cilium data-planes. It empowers customers with enterprise-grade network observability capabilities for DevOps and SecOps. This solution offers the following capabilities to monitor network related issues in your cluster:  

* **Network Observability:** Understanding the health of your container network at the node-level is crucial for maintaining optimal application performance. By leveraging network observability metrics, you gain valuable insights into traffic volume, dropped packets, and the number of active connections on each node. This granular data empowers you to proactively identify potential bottlenecks or congestion issues that could hinder application performance within your cluster. 
* **Advanced Network Observability:** For even greater precision, advanced observability unlocks granular pod-level metrics. Analyze traffic volume, dropped packets, source/destination information, and even DNS metrics at pod-level. This empowers you to pinpoint network related issues at much granular level compared to the network observability , ensuring the health and optimal performance of your applications across the entire cluster.
* **Hubble CLI:** Hubble CLI unlocks deep visibility into your cluster's network activity. It allows you to monitor data flow between applications, identifying bottlenecks, and tracking traffic origin and destination which proactively troubleshoot performance issues, optimize resource allocation, and ensure only authorized communication occurs, all contributing to a smoothly running and secure containerized environment.
* **Hubble UI:** Hubble UI provides a user-friendly interface for exploring your cluster's network activity with Hubble. This intuitive visualization empowers you to troubleshoot performance issues, optimize resource allocation, and ensure there is secure communication within your cluster, all contributing to a smoothly running and well-managed containerized environment.

## Advanced Container Networking Services Tiers
The Advanced Container Networking Service  offers tiered plans with varying capabilities. Here's a table summarizing their capabilities: 

| Feature  | Azure Container Networking Service - Free | Azure Container Networking Service - Standard (Public Preview) |
|-------------|-------------|--------|
| **Network Observability** | Yes | Yes | 
| **Advanced Network Observability** | No | Yes | 
| **Hubble CLI**  | No | Yes |
| **Hubble UI** | No | Yes |

## Next steps

- For more information about Azure Kubernetes Service (AKS), see [What is Azure Kubernetes Service (AKS)?](/azure/aks/intro-kubernetes).

- To learn more about the Advanced Container Networking Services - Free  offering, see [Advanced Container Networking Services - Free for Azure Kubernetes Service (AKS)](advanced-container-networking-services-free-overview.md).

- To learn more about the Advanced Container Networking Services - Standard offering, see [Advanced Container Networking Services - Standard for Azure Kubernetes Service (AKS)](advanced-container-networking-services-standard-overview.md).

