---
title: Baseline resource profiles for Azure IoT Operations
description: Learn about measured baseline resource consumption for Azure IoT Operations deployments at idle, including memory and CPU profiles across configurations.
author: huguesbouvier
ms.author: hubouvie
ms.topic: concept-article
ms.date: 03/25/2026
ms.service: azure-iot-operations

#customer intent: As a platform engineer or IT administrator planning capacity for Azure IoT Operations deployments, I want to see scaling recommendations before deploying to production.
---

# Baseline resource profiles for Azure IoT Operations

This reference provides measured baseline resource consumption for Azure IoT Operations deployments at idle (no active workloads). Use these profiles to validate your hardware meets minimum requirements and to establish resource monitoring baselines.

## Overview

Azure IoT Operations deploys multiple components across several Kubernetes namespaces. The total resource footprint depends on two factors: the MQTT broker **memory profile** (which controls per-pod memory allocation) and the broker **cardinality** (number of frontend replicas, backend partitions, and redundancy factor, which controls how many pods are deployed). Higher cardinality means more pods, and a higher memory profile means each pod uses more memory.

Three configurations were measured on single-node clusters at idle (no connected assets, no active data flows, near-zero traffic). These are **baseline numbers, not maximums**. Production workloads increase consumption significantly:

| Configuration | Memory Profile | Cardinality | Node Peak Memory | Azure IoT Operations Namespace Peak RSS | Total Pod Peak RSS | Pod Count |
|---|---|---|---|---|---|---|
| **Config A** | Tiny | 1 frontend <br> 1 partition <br> redundancy factor 2 | ~4,979 MiB | ~1,298 MiB | ~5,409 MiB | 55 |
| **Config B** | Low | 2 frontends <br> 2 partitions <br> redundancy factor 2 | ~5,130 MiB | ~1,559 MiB | ~5,695 MiB | 58 |
| **Config C** | Medium | 2 frontends <br> 2 partitions <br> redundancy factor 2 | ~6,088 MiB | ~2,407 MiB | ~6,564 MiB | 58 |

> [!NOTE]
> The difference between Config A and Config B comes from both higher cardinality (more broker pods) and a different [memory profile](../manage-mqtt-broker/howto-configure-availability-scale.md#configure-memory-profile). The difference between Config B and Config C is purely from the memory profile (same cardinality, same pod count). See [Production deployment examples](../deploy-iot-ops/concept-production-examples.md) for loaded scenarios.

## Namespace breakdown

The following table shows peak RSS memory by namespace across all three configurations at idle:

| Namespace | Config A, Tiny (MiB) | Config B, Low (MiB) | Config C, Medium (MiB) | Description |
|---|---|---|---|---|
| **azure-iot-operations** | 1,298 | 1,559 | 2,407 | Azure IoT Operations core services (broker, data flows, connectors, observability) |
| **azure-arc** | 1,964 | 1,985 | 1,990 | Azure Arc agents and controllers |
| **cert-manager** | 1,351 | 1,357 | 1,362 | Certificate management |
| **gatekeeper-system** | 338 | 338 | 350 | Policy enforcement |
| **azure-extensions-usage-system** | 279 | 277 | 278 | Billing operator |
| **arc-workload-identity** | 90 | 90 | 91 | Workload identity webhooks |
| **azure-secret-store** | 87 | 88 | 87 | Secret sync controller |
| **Total** | **~5,409** | **~5,695** | **~6,564** | |

> [!NOTE]
> - **Azure Arc, cert-manager, gatekeeper, and other infrastructure namespaces consume ~3.8-4.1 GB regardless of broker configuration.** This overhead is the fixed cost of running an Arc-enabled cluster with Azure IoT Operations.
> - **Only the `azure-iot-operations` namespace scales with the memory profile and cardinality choices**, from ~1.3 GB (Tiny, minimal cardinality) to ~2.4 GB (Medium, higher cardinality).
> - Plan for at least **6 GB of memory** dedicated to Azure IoT Operations infrastructure at idle before accounting for any workloads.

## MQTT broker pod resource consumption

The MQTT broker is the largest variable component. Memory differences across configurations come from **both** the memory profile (per-pod allocation) and the cardinality (number of pods). The following table shows per-pod idle RSS. These numbers grow with traffic:

| Pod | Config A, Tiny (MiB) | Config B, Low (MiB) | Config C, Medium (MiB) | Notes |
|---|---|---|---|---|
| **aio-broker-frontend-0** | 29 | 33 | 169 | Per-pod memory scales with profile |
| **aio-broker-frontend-1** | N/A | 33 | 169 | Not present in Config A (one frontend replica) |
| **aio-broker-backend-1-0** | 41 | 66 | 211 | Per-pod memory scales with profile |
| **aio-broker-backend-1-1** | 41 | 65 | 210 | Redundancy factor replica |
| **aio-broker-backend-2-0** | N/A | 66 | 212 | Not present in Config A (one partition) |
| **aio-broker-backend-2-1** | N/A | 65 | 211 | Not present in Config A (one partition) |
| **aio-broker-health-manager-0** | 41 | 41 | 42 | Constant across profiles |
| **aio-broker-operator-0** | 60 | 60 | 56 | Constant across profiles |
| **aio-broker-diagnostics-probe-0** | 24 | 43 | 43 | |
| **aio-broker-diagnostics-service-0** | 49 | 66 | 66 | |
| **aio-broker-authentication-0** | 24 | 24 | 24 | Constant across profiles |
| **aio-broker-webhook-0** | 33 | 35 | 32 | Constant across profiles |

### Broker configuration per profile tested

| Setting | Config A (Tiny) | Config B (Low) | Config C (Medium) |
|---|---|---|---|
| Frontend replicas | 1 | 2 | 2 |
| Backend partitions | 1 | 2 | 2 |
| Backend redundancy factor | 2 | 2 | 2 |
| Total broker pods | 10 | 13 | 13 |
| Idle frontend memory per pod | ~29 MiB | ~33 MiB | ~169 MiB |
| Idle backend memory per pod | ~41 MiB | ~66 MiB | ~211 MiB |
| Max message size | 4 MB | 16 MB | 64 MB |

## Other Azure IoT Operations component consumption

These components have consistent idle resource usage regardless of memory profile or cardinality:

| Component | Peak RSS (MiB) | Peak CPU (cores) | Notes |
|---|---|---|---|
| **adr-schema-registry** (x2) | ~52 each | 0.002 | Schema registry pods |
| **aio-akri-operator-0** | ~39 | 0.001 | Akri device discovery |
| **aio-akri-adr-service-0** | ~30 | 0.001 | Akri Azure Device Registry (ADR) service |
| **aio-dataflow-dev-0** | ~67 | 0.002 | Data flow runtime |
| **aio-dataflow-operator-0** | ~56 | 0.001 | Data flow operator |
| **aio-operator** | ~114 | 0.003 | Azure IoT Operations operator |
| **aio-observability** (x2) | ~125 each | 0.005 | OpenTelemetry collectors |
| **aio-observability-operator** | ~106 | 0.003 | Observability operator |
| **aio-observability-cluster-metrics-agent** | ~114 | 0.004 | Metrics agent |
| **aio-wasm-graph-controller-0** | ~30 | 0.001 | WebAssembly (WASM) graph controller |

## CPU consumption

CPU consumption is minimal at idle across all configurations tested:

| Configuration | Azure IoT Operations Namespace Peak CPU | Total Cluster Peak CPU | % of Node |
|---|---|---|---|
| **Config A (Tiny)** | 0.025 cores | 0.099 cores | 1.3% |
| **Config B (Low)** | 0.044 cores | 0.104 cores | 1.3% |
| **Config C (Medium)** | 0.048 cores | 0.093 cores | 1.2% |

> CPU usage is negligible at idle. Under production load, expect significantly higher CPU consumption proportional to message throughput and the number of frontend/backend workers configured.

## Hardware sizing guidance

Based on these idle baseline measurements, the following minimum hardware recommendations apply for single-node deployments. Actual requirements are higher under production traffic:

| Memory Profile | Min RAM (with headroom) | Recommended RAM | Use Case |
|---|---|---|---|
| **Tiny** | 8 GB | 8–10 GB | Low traffic, small packets only |
| **Low** | 10 GB | 12–16 GB | Limited memory, small packets |
| **Medium** | 12 GB | 16–32 GB | Moderate traffic and message sizes |
| **High** | 16 GB | 32+ GB | High throughput, large messages |

> [!IMPORTANT]
> These recommendations account for the ~4 GB of fixed infrastructure overhead (Azure Arc, cert-manager, gatekeeper) plus the variable Azure IoT Operations component footprint. Production workloads require additional headroom for MQTT message buffering, data flow processing, and OPC UA connector activity.

## Related content

- [Deployment planning](../deploy-iot-ops/deployment-planning.md)
- [Production deployment guidelines](../deploy-iot-ops/concept-production-guidelines.md)
- [Production deployment examples](../deploy-iot-ops/concept-production-examples.md)
