---
title: Istio Service Mesh AKS Add-On Performance
description: Istio Service Mesh AKS Add-On Performance
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 01/09/2024
ms.author: shalierxia
---

# **Istio service mesh add-on performance**

The Istio-based service mesh add-on is logically split into control plane (`istiod`) and data plane. The data plane is composed of Envoy sidecar proxies inside workload pods. Istiod manages and configures these Envoy proxies. This document provides an analysis of the add-on’s control and data plane performance across network plugins available in Azure Kubernetes Service (AKS) - Kubenet, Azure CNI, Azure CNI Dynamic IP Allocation, and Azure CNI Overlay. Additionally, it showcases testing the Cilium network data plane with the latter two network plugins.

## Control Plane Performance
[Istiod’s CPU and memory requirements][control-plane-performance] correlate with the rate of deployment and configuration changes and the number of proxies connected. To determine Istiod’s performance in revision asm-1-18, a single `istiod` instance with the default settings: `2 vCPU` and `2 GB` memory is used with horizontal pod autoscaling disabled. The scenarios tested were:

- Pod churn: Examines the impact of pod churning on `istiod`. To reduce variables, only one service is used for all sidecars. 
- Maximum sidecars: Examines the maximum sidecars Istiod can manage (sidecar capacity) with 1,000 services and each service has `N` sidecars, totaling the overall maximum.

### Pod churn
The [ClusterLoader2 framework][clusterloader2] was used to determine the maximum number of sidecars Istiod can manage when there's sidecar churning. The churn percent is defined as the percent of sidecars churned down/up during the test. For example, 50% churn for 10,000 sidecars would mean that 5,000 sidecars were churned down then 5,000 sidecars were churned up. The churn percents tested were determined from the typical churn percentage during deployment rollouts (`maxUnavailable`). The churn rate was calculated by determining the total number of sidecars churned (up and down) over the actual time taken to complete the churning process.

#### Sidecar Capacity and Istiod CPU and Memory

**Azure CNI**

|   Churn (%) | Churn Rate (sidecars/sec)   |   Sidecar Capacity |   Istiod Memory (GB) |   Istiod CPU |
|-------------|-----------------------------|--------------------|----------------------|--------------|
|           0 | --                          |              15000 |                 17.3 |           11 |
|          25 | 41.7                        |              15000 |                 20.4 |           13 |
|          50 | 62.5                        |              15000 |                 24.2 |           12 |

**Azure CNI Dynamic IP**

|   Churn (%) | Churn Rate (sidecars/sec)   |   Sidecar Capacity |   Istiod Memory (GB) |   Istiod CPU |
|-------------|-----------------------------|--------------------|----------------------|--------------|
|           0 | --                          |              35000 |                 41.1 |           13 |
|          25 | 50.0                        |              30000 |                 42.6 |           12 |
|          50 | 69.4                        |              25000 |                 44.5 |           12 |

**Azure CNI Dynamic IP with Cilium**

|   Churn (%) | Churn Rate (sidecars/sec)   |   Sidecar Capacity |   Istiod Memory (GB) |   Istiod CPU |
|-------------|-----------------------------|--------------------|----------------------|--------------|
|           0 | --                          |              20000 |                 23.1 |           11 |
|          25 | 31.2                        |              15000 |                 20.5 |           11 |
|          50 | 41.7                        |              10000 |                 14.8 |            8 |

**Kubenet**

|   Churn (%) | Churn Rate (sidecars/sec)   |   Sidecar Capacity |   Istiod Memory (GB) |   Istiod CPU |
|-------------|-----------------------------|--------------------|----------------------|--------------|
|           0 | --                          |              35000 |                 40.7 |           14 |
|          25 | 50.0                        |              30000 |                 41.7 |           14 |
|          50 | 59.5                        |              25000 |                 43.3 |           11 |

**Azure CNI Overlay**

|   Churn (%) | Churn Rate (sidecars/sec)   |   Sidecar Capacity |   Istiod Memory (GB) |   Istiod CPU |
|-------------|-----------------------------|--------------------|----------------------|--------------|
|           0 | --                          |              35000 |                 40.9 |           14 |
|          25 | 50.0                        |              30000 |                 42.9 |           12 |
|          50 | 62.5                        |              30000 |                 50.3 |           13 |

**Azure CNI Overlay with Cilium**

|   Churn (%) | Churn Rate (sidecars/sec)   |   Sidecar Capacity |   Istiod Memory (GB) |   Istiod CPU |
|-------------|-----------------------------|--------------------|----------------------|--------------|
|           0 | --                          |              15000 |                 17.1 |           10 |
|          25 | 41.7                        |              10000 |                 12.9 |            8 |
|          50 | 41.7                        |              10000 |                 15.5 |            8 |

### Maximum sidecars
The [ClusterLoader2 framework][clusterloader2] was used to determine the maximum number of sidecars `istiod` can manage with 1,000 services. Each service had `N` sidecars contributing to the overall maximum sidecar count. The API Server resource usage was observed to determine if there's any significant stress from the add-on.

#### Sidecar Capacity

|   Azure CNI |   Azure CNI Dynamic IP |   Azure CNI Dynamic IP with Cilium |   Kubenet |   Azure CNI Overlay |   Azure CNI Overlay with Cilium |
|-------------|------------------------|------------------------------------|-----------|---------------------|---------------------------------|
|       15000 |                  20000 |                              20000 |     20000 |               20000 |                           15000 |

#### CPU and Memory

| Resource               |   Azure CNI |   Azure CNI Dynamic IP |   Azure CNI Dynamic IP with Cilium |   Kubenet |   Azure CNI Overlay |   Azure CNI Overlay with Cilium |
|------------------------|-------------|------------------------|------------------------------------|-----------|---------------------|---------------------------------|
| API Server Memory (GB) |         4.8 |                    9   |                                9   |       7.6 |                 7.4 |                             6.9 |
| API Server CPU         |         3.6 |                    4.4 |                                4.5 |       3.6 |                 4.3 |                             4.3 |
| Istiod Memory (GB)     |        33.7 |                   41.8 |                               43.9 |      40.9 |                42.8 |                            32.1 |
| Istiod CPU             |        16   |                   16   |                               16   |      16   |                16   |                            16   |


## Data Plane Performance
Various factors impact [sidecar performance][data-plane-performance] such as request size, number of proxy worker threads, and number of client connections. Additionally, any request flowing through the mesh traverses the client-side proxy and then the server-side proxy. Therefore, latency and resource consumption are measured to determine the data plane performance.

[Fortio][fortio] was used to create the load. The test was conducted with the [Istio benchmark repository][istio-benchmark] that was modified for use with the add-on. The test involved a 1 KB payload, 1000 QPS, 2 proxy workers, utilized `http/1.1` protocol and mutual TLS enabled at various client connections. 

#### CPU and Memory
The memory and CPU usage for both the client and server proxy for 16 client connections and 1000 QPS across all network plugin scenarios is roughly 0.4 v CPU and 72 MB. 

#### Latency
The sidecar Envoy proxy collects raw telemetry data after responding to a client, which doesn't directly affect the request's total processing time. However, this process delays the start of handling the next request, contributing to queue wait times and influencing average and tail latencies. Depending on the traffic pattern, the actual tail latency varies. 

The following analysis evaluates the impact of adding sidecar proxies to the data path. It includes both P90 and P99 latency metrics.


[ ![Diagram that compares P90 latency for AKS network plugins.](./media/aks-istio-addon/latency-graphs/latency-p90__1000qps.png) ](./media/aks-istio-addon/latency-graphs/latency-p90__1000qps.png#lightbox)

[ ![Diagram that compares P99 latency for AKS network plugins.](./media/aks-istio-addon/latency-graphs/latency-p99__1000qps.png) ](./media/aks-istio-addon/latency-graphs/latency-p99__1000qps.png#lightbox)


## Service Entry
Istio features a custom resource definition known as a ServiceEntry that enables adding other services into the Istio’s internal service registry. A [ServiceEntry][serviceentry] allows services already in the mesh to route or access the services specified. However, the configuration of multiple ServiceEntries with the `resolution` field set to DNS can cause a [heavy load on DNS servers][understanding-dns]. The following suggestions can help reduce the load:

- Switch to resolution: NONE to avoid proxy DNS lookups entirely. Suitable for most use cases.
- Increase TTL (Time To Live) if you control the domains being resolved.
- Limit the ServiceEntry scope with `exportTo`.


[control-plane-performance]: https://istio.io/latest/docs/ops/deployment/performance-and-scalability/#control-plane-performance
[data-plane-performance]: https://istio.io/latest/docs/ops/deployment/performance-and-scalability/#data-plane-performance
[clusterloader2]: https://github.com/kubernetes/perf-tests/tree/master/clusterloader2#clusterloader
[fortio]: https://fortio.org/
[istio-benchmark]: https://github.com/istio/tools/tree/master/perf/benchmark#istio-performance-benchmarking
[serviceentry]: https://istio.io/latest/docs/reference/config/networking/service-entry/
[understanding-dns]: https://preliminary.istio.io/latest/docs/ops/configuration/traffic-management/dns/#proxy-dns-resolution
