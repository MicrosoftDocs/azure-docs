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
[Istiod’s CPU and memory requirements][control-plane-performance] correlate with the rate of deployment and configuration changes and the number of proxies connected. To determine Istiod’s performance in revision asm-1-17, a single `istiod` instance with the default settings: `2 vCPU` and `2 GB` memory is used with horizontal pod autoscaling disabled. The scenarios tested were:

- Pod churn: Examines the impact of pod churning on `istiod`. To reduce variables, only one service is used for all sidecars. 
- Maximum sidecars: Examines the maximum sidecars Istiod can manage (sidecar capacity) with 1,000 services and each service has `N` sidecars, totaling the overall maximum.

### Pod churn
The [ClusterLoader2 framework][clusterloader2] was used to determine the maximum number of sidecars Istiod can manage when there's sidecar churning. The churn percent is defined as the percent of sidecars churned down/up during the test. For example, 50% churn for 10,000 sidecars would mean that 5,000 sidecars were churned down then 5,000 sidecars were churned up. The churn percents tested were determined from the typical churn percentage during deployment rollouts (`maxUnavailable`). The churn rate was calculated by determining the total number of sidecars churned (up and down) over the actual time taken to complete the churning process.

#### Sidecar Capacity and Istiod CPU and Memory

**Kubenet**

| Churn (%) | Churn Rate (sidecars/sec) | Sidecar Capacity | Istiod Memory (GB) | Istiod vCPU |
|-----------|---------------------------|------------------|--------------------|-------------|
| 0 | -- | 35,000 | 40.3 | 14 |
| 25 | 50 | 30,000 | 44.9 | 14 |
| 50 | 46.3 | 25,000 | 42.2 | 10 |

**Azure CNI**

| Churn (%) | Churn Rate (sidecars/sec) | Sidecar Capacity | Istiod Memory (GB) | Istiod vCPU |
|-----------|---------------------------|------------------|--------------------|-------------|
| 0 | -- | 15,000 | 13.4 | 9 |
| 25 | 41.7 | 15,000 | 17.5 | 12 |
| 50 | 62.5 | 15,000 | 18.2 | 8 |

**Azure CNI Dynamic IP**

| Churn (%) | Churn Rate (sidecars/sec) | Sidecar Capacity | Istiod Memory (GB) | Istiod vCPU |
|-----------|---------------------------|------------------|--------------------|-------------|
| 0 | -- | 35,000 | 41 | 14 |
| 25 | 31.3 | 30,000 | 42.6 | 14 |
| 50 | 59.5 | 25,000 | 43.1 | 12 |

**Azure CNI Overlay**

| Churn (%) | Churn Rate (sidecars/sec) | Sidecar Capacity | Istiod Memory (GB) | Istiod vCPU |
|-----------|---------------------------|------------------|--------------------|-------------|
| 0 | -- | 35,000 | 40.8 | 13 |
| 25 | 41.7 | 30,000 | 43.9 | 13 |
| 50 | 55.6 | 30,000 | 49 | 12 |


**Azure CNI Dynamic IP with Cilium**

| Churn (%) | Churn Rate (sidecars/sec) | Sidecar Capacity | Istiod Memory (GB) | Istiod vCPU |
|-----------|---------------------------|------------------|--------------------|-------------|
| 0 | -- | 20,000 | 23.4 | 13 |
| 25 | 31.3 | 15,000 | 20.1 | 12 |
| 50 | 35.7 | 15,000 | 23.4 | 10 |

**Azure CNI Overlay with Cilium**

| Churn (%) | Churn Rate (sidecars/sec) | Sidecar Capacity | Istiod Memory (GB) | Istiod vCPU |
|-----------|---------------------------|------------------|--------------------|-------------|
| 0 | -- | 15,000 | 17.2 | 10 |
| 25 | 31.3 | 15,000 | 19.4 | 12 |
| 50 | 41.7 | 10,000 | 14.7 | 10 |

### Maximum sidecars
The [ClusterLoader2 framework][clusterloader2] was used to determine the maximum number of sidecars `istiod` can manage with 1,000 services. Each service had `N` sidecars contributing to the overall maximum sidecar count. The API Server resource usage was observed to determine if there's any significant stress from the add-on.

#### Sidecar Capacity

|Azure CNI       |Azure CNI Dynamic IP|Kubenet         |Azure CNI Overlay|Azure CNI Overlay with Cilium|Azure CNI Dynamic IP with Cilium|
|----------------|--------------------|----------------|-----------------|---------------------------|------------------------------|
|15,000          |15,000              |15,000          |15,000           |10,000                     |15,000                        |

#### CPU and Memory

|Resource|Component|Azure CNI   |Azure CNI Dynamic IP|Kubenet |Azure CNI Overlay|Azure CNI Overlay with Cilium|Azure CNI Dynamic IP with Cilium|
|----------------|------------|--------------------|--------|-----------------|---------------------------|------------------------------|------|
|vCPU            |API Server  |3                   |3.4     |2.4              |3                          |2.5                           |4.4   |
|                |Istiod      |16                  |16      |16               |16                         |15                            |16    |
|Memory (GB)     |API Server  |5.5                 |7.9     |4.8              |5.9                        |4.1                           |8.8   |
|                |Istiod      |49.2                |48.3    |48.8             |48.2                       |29.6                          |49.3  |


## Data Plane Performance
Various factors impact [sidecar performance][data-plane-performance] such as request size, number of proxy worker threads, and number of client connections. Additionally, any request flowing through the mesh traverses the client-side proxy and then the server-side proxy. Therefore, latency and resource consumption are measured to determine the data plane performance.

[Fortio][fortio] was used to create the load. The test was conducted with the [Istio benchmark repository][istio-benchmark] that was modified for use with the add-on. The test involved a 1 KB payload, 16 client connections, 2 proxy workers, utilized `http/1.1` protocol and mutual TLS enabled at various queries per second (QPS). 

#### CPU and Memory
The table shows the memory and CPU usage for both the client and server proxy for 16 client connections and 1000 QPS. 

|Sidecar         | Resource     |Azure CNI       |Azure CNI Dynamic IP|Kubenet     |Azure CNI Overlay|Azure CNI Overlay w/ Cilium|Azure CNI Dynamic IP w/ Cilium|
|----------------|------------|----------------|--------------------|------------|-----------------|---------------------------|------------------------------|
|Client          |vCPU        |0.27             |0.29                 |0.28         |0.48              |0.36                        |0.37                           |
|                |Memory (MB) |61.5            |56.2                |60.8        |164              |61.5                       |54.9                          |
|Server          |vCPU        |0.35             |0.28                 |0.29         |0.34              |0.48                        |0.40                           |
|                |Memory (MB) |58.9            |58.5                |53.4        |56.6             |61.5                       |45.2                          |


#### Latency
The sidecar Envoy proxy collects raw telemetry data after responding to a client, which doesn't directly affect the request's total processing time. However, this process delays the start of handling the next request, contributing to queue wait times and influencing average and tail latencies. Depending on the traffic pattern, the actual tail latency varies. 

The following analysis evaluates the impact of adding sidecar proxies to the data path. It includes both P90 and P99 latency metrics.


[ ![Diagram that compares P90 latency for AKS network plugins.](./media/aks-istio-addon/latency-graphs/latency-p90.png) ](./media/aks-istio-addon/latency-graphs/latency-p90.png#lightbox)

[ ![Diagram that compares P99 latency for AKS network plugins.](./media/aks-istio-addon/latency-graphs/latency-p99.png) ](./media/aks-istio-addon/latency-graphs/latency-p99.png#lightbox)


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
