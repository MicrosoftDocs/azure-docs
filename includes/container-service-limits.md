---
title: include file
description: include file
services: container-service
author: mlearned

ms.service: container-service
ms.topic: include
ms.date: 04/06/2021
ms.author: mlearned
ms.custom: include file
---

| Resource                                                                                                           | Limit                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maximum clusters per subscription                                                                                  | 1000                                                                                                                                                                                                        |
| Maximum nodes per cluster with Virtual Machine Availability Sets and Basic Load Balancer SKU                       | 100                                                                                                                                                                                                         |
| Maximum nodes per cluster with Virtual Machine Scale Sets and [Standard Load Balancer SKU][standard-load-balancer] | 1000 (across all [node pools][node-pool])                                            |
| Maximum node pools per cluster                                                                                     | 100                                                                                  |
| Maximum pods per node: [Basic networking][basic-networking] with Kubenet                                           | Maximum: 250 <br /> Azure CLI default: 110 <br /> Azure Resource Manager template default: 110 <br /> Azure portal deployment default: 30          |
| Maximum pods per node: [Advanced networking][advanced-networking] with Azure Container Networking Interface        | Maximum: 250 <br /> Default: 30                                                      |
| Open Service Mesh (OSM) AKS addon preview                                                                          | Kubernetes Cluster Version: 1.19+<sup>1</sup><br />OSM controllers per cluster: 1<sup>1</sup><br />Pods per OSM controller: 500<sup>1</sup><br />Kubernetes service accounts managed by OSM: 50<sup>1</sup> |

<sup>1</sup>The OSM add-on for AKS is in a preview state and will undergo additional enhancements before general availability (GA). During the preview phase, it's recommended to not surpass the limits shown.<br />

<!-- LINKS - Internal -->

[basic-networking]: ../articles/aks/concepts-network.md#kubenet-basic-networking
[advanced-networking]: ../articles/aks/concepts-network.md#azure-cni-advanced-networking
[standard-load-balancer]: ../articles/load-balancer/load-balancer-overview.md
[node-pool]: ../articles/aks/use-multiple-node-pools.md

<!-- LINKS - External -->

[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
