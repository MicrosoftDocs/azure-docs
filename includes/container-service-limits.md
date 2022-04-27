---
title: include file
description: include file
author: zr-msft
ms.service: container-service
ms.topic: include
ms.date: 04/06/2021
ms.author: zarhoads
ms.custom: include file
---

| Resource                                                                                                           | Limit                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maximum clusters per subscription                                                                                  | 5000                                                                                                                                                                                                        |
| Maximum nodes per cluster with Virtual Machine Availability Sets and Basic Load Balancer SKU                       | 100                                                                                                                                                                                                         |
| Maximum nodes per cluster with Virtual Machine Scale Sets and [Standard Load Balancer SKU][standard-load-balancer] | 1000 (across all [node pools][node-pool])                                            |
| Maximum node pools per cluster                                                                                     | 100                                                                                  |
| Maximum pods per node: [Basic networking][basic-networking] with Kubenet                                           | Maximum: 250 <br /> Azure CLI default: 110 <br /> Azure Resource Manager template default: 110 <br /> Azure portal deployment default: 30          |
| Maximum pods per node: [Advanced networking][advanced-networking] with Azure Container Networking Interface        | Maximum: 250 <br /> Default: 30                                                      |
| Open Service Mesh (OSM) AKS addon                                                                          | Kubernetes Cluster Version: 1.19+<br />OSM controllers per cluster: 1<br />Pods per OSM controller: 500<br />Kubernetes service accounts managed by OSM: 50 |


| Kubernetes Control Plane tier | Limit |  
| -------------- | :--------------------------------------------- |
| Paid tier      | Automatically scales out based on the load     |
| Free tier      | Limited resources with [inflight requests limit](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) of 50 mutating and 100 read-only calls   |

<!-- LINKS - Internal -->

[basic-networking]: ../articles/aks/concepts-network.md#kubenet-basic-networking
[advanced-networking]: ../articles/aks/concepts-network.md#azure-cni-advanced-networking
[standard-load-balancer]: ../articles/load-balancer/load-balancer-overview.md
[node-pool]: ../articles/aks/use-multiple-node-pools.md

<!-- LINKS - External -->

[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
