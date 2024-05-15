---
title: include file
description: include file
author: mgoedtel
ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 01/12/2024
ms.author: magoedte
ms.custom: include file
---

| Resource | Limit |
|--|:-|
| Maximum clusters per subscription | 5000 <br />Note: spread clusters across different regions to account for Azure API throttling limits |
| Maximum nodes per cluster with Virtual Machine Scale Sets and [Standard Load Balancer SKU][standard-load-balancer] | 5000 across all [node-pools][node-pool] <br />Note: If you are unable to scale up to 5000 nodes per cluster, see [Best Practices for Large Clusters](../articles/aks/best-practices-performance-scale-large.md). |
| Maximum nodes per node pool (Virtual Machine Scale Sets node pools) | 1000 |
| Maximum node pools per cluster | 100 |
| Maximum pods per node: with [Kubenet][Kubenet] networking plug-in<sup>1</sup> | Maximum: 250 <br /> Azure CLI default: 110 <br /> Azure Resource Manager template default: 110 <br /> Azure portal deployment default: 30 |
| Maximum pods per node: with [Azure Container Networking Interface (Azure CNI)][Azure CNI]<sup>1</sup> | Maximum: 250 <br /> Maximum recommended for Windows Server containers: 110 <br /> Default: 30 |
| Open Service Mesh (OSM) AKS addon | Kubernetes Cluster Version: AKS Supported Versions<br />OSM controllers per cluster: 1<br />Pods per OSM controller: 1600<br />Kubernetes service accounts managed by OSM: 160 |
| Maximum load-balanced kubernetes services per cluster  with [Standard Load Balancer SKU][standard-load-balancer] | 300 |
| Maximum nodes per cluster with Virtual Machine Availability Sets and Basic Load Balancer SKU | 100 |

<sup>1</sup> Windows Server containers must use Azure CNI networking plug-in. Kubenet is not supported for Windows Server containers.

| Kubernetes Control Plane tier | Limit |
|--|:-|
| Standard tier | Automatically scales Kubernetes API server based on load. Larger control plane component limits and API server/etc instances. |
| Free tier | Limited resources with [inflight requests limit](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) of 50 mutating and 100 read-only calls. Recommended node limit of 10 nodes per cluster. Best for experimenting, learning, and simple testing. **Not advised for production/critical workloads**. |

<!-- LINKS - Internal -->

[Kubenet]: ../articles/aks/concepts-network.md#kubenet-basic-networking
[Azure CNI]: ../articles/aks/concepts-network.md#azure-cni-advanced-networking
[standard-load-balancer]: ../articles/load-balancer/load-balancer-overview.md
[node-pool]: ../articles/aks/create-node-pools.md
[Contact Support]: https://portal.azure.com/#create/Microsoft.Support/Parameters/%7B%0D%0A%09%22subId%22%3A+%22%22%2C%0D%0A%09%22pesId%22%3A+%225a3a423f-8667-9095-1770-0a554a934512%22%2C%0D%0A%09%22supportTopicId%22%3A+%2280ea0df7-5108-8e37-2b0e-9737517f0b96%22%2C%0D%0A%09%22contextInfo%22%3A+%22AksLabelDeprecationMarch22%22%2C%0D%0A%09%22caller%22%3A+%22Microsoft_Azure_ContainerService+%2B+AksLabelDeprecationMarch22%22%2C%0D%0A%09%22severity%22%3A+%223%22%0D%0A%7D

<!-- LINKS - External -->

[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
