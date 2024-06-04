---
author: nickomang
ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 01/12/2024
ms.author: nickoman
ms.custom: include file
---

| Resource | Limit |
|--|:-|
| Maximum clusters per subscription globally | 5,000 |
| Maximum clusters per subscription per region <sup>1</sup> | 100 |
| Maximum nodes per cluster with Virtual Machine Scale Sets and [Standard Load Balancer SKU][standard-load-balancer] | 5,000 across all [node pools][node-pool] <br />Note: If you're unable to scale up to 5,000 nodes per cluster, see [Best Practices for Large Clusters](../articles/aks/best-practices-performance-scale-large.md). |
| Maximum nodes per node pool (Virtual Machine Scale Sets node pools) | 1000 |
| Maximum node pools per cluster | 100 |
| Maximum pods per node: with [Kubenet][Kubenet] networking plug-in<sup>1</sup> | Maximum: 250 <br /> Azure CLI default: 110 <br /> Azure Resource Manager template default: 110 <br /> Azure portal deployment default: 30 |
| Maximum pods per node: with [Azure Container Networking Interface (Azure CNI)][Azure CNI]<sup>2</sup> | Maximum: 250 <br /> Maximum recommended for Windows Server containers: 110 <br /> Default: 30 |
| Open Service Mesh (OSM) AKS addon | Kubernetes Cluster Version: AKS Supported Versions<br />OSM controllers per cluster: 1<br />Pods per OSM controller: 1600<br />Kubernetes service accounts managed by OSM: 160 |
| Maximum load-balanced kubernetes services per cluster  with [Standard Load Balancer SKU][standard-load-balancer] | 300 |
| Maximum nodes per cluster with Virtual Machine Availability Sets and Basic Load Balancer SKU | 100 |

<sup>1</sup> More are allowed upon request.<br /> 
<sup>2</sup> Windows Server containers must use Azure CNI networking plug-in. Kubenet isn't supported for Windows Server containers.

| Kubernetes Control Plane tier | Limit |
|--|:-|
| Standard tier | Automatically scales Kubernetes API server based on load. Larger control plane component limits and API server/etcd instances. |
| Free tier | Limited resources with [inflight requests limit](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) of 50 mutating and 100 read-only calls. Recommended node limit of 10 nodes per cluster. Best for experimenting, learning, and simple testing. **Not advised for production/critical workloads**. |

<!-- LINKS - Internal -->

[Kubenet]: ../articles/aks/concepts-network-legacy-cni.md#kubenet
[Azure CNI]: ../articles/aks/concepts-network-cni-overview.md
[standard-load-balancer]: ../articles/load-balancer/load-balancer-overview.md
[node-pool]: ../articles/aks/create-node-pools.md

<!-- LINKS - External -->

