---
title: Deployment planning for Azure IoT Operations
description: Plan your Azure IoT Operations deployment by reviewing architecture, sizing, broker configuration, and security decisions that must be made before deployment.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.service: azure-iot-operations
ms.date: 04/21/2026
#customer intent: As an IT administrator or platform engineer, I want to understand the planning decisions I need to make before deploying Azure IoT Operations.
---

# Deployment planning for Azure IoT Operations

Many Azure IoT Operations settings are fixed at deployment time and can only be changed by redeploying. Before you deploy, plan your cluster topology, broker cardinality, memory profile, and the optional broker settings you need. This article summarizes the decisions you should make.

## Understand the architecture

Azure IoT Operations is a set of modular, Kubernetes-native services deployed to an Azure Arc-enabled cluster. Key components include:

| Component | Purpose |
|---|---|
| **[MQTT broker](../manage-mqtt-broker/overview-broker.md)** | High-performance MQTT 3.1.1 and 5 broker for edge messaging |
| **[Connector for OPC UA](../discover-manage-assets/overview-opc-ua-connector.md)** | Collects data from OPC UA servers and publishes to MQTT |
| **[Data flows](../connect-to-cloud/overview-dataflow.md)** | Routes, transforms, and pushes data to cloud endpoints |
| **[Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#azure-device-registry)** | Cloud-based registry for devices, assets, and schemas |
| **[Akri services](../discover-manage-assets/overview-akri.md)** | Device discovery and protocol adapters |
| **[State store](../develop-edge-apps/overview-state-store.md)** | Key-value persistence layer in the MQTT broker |

Two terms are used throughout the documentation:

- **Deployment** — The instance, Arc extensions, custom locations, and all configurable resources (assets, devices, data flows).
- **Instance** — The parent resource that bundles the services.

## Choose your cluster topology

Before you deploy, decide whether you need a single-node or multi-node cluster. This decision determines the hardware requirements and the broker cardinality settings.

| Topology | Use case | Minimum hardware |
|---|---|---|
| **Single-node** | Smaller deployments where high availability isn't required | 4 vCPUs, 16 GB of RAM, 30 GB of storage |
| **Multi-node (3-5 nodes)** | High availability and higher throughput requirements | 8 vCPUs, 32 GB of RAM per node |

> [!IMPORTANT]
> Cardinality is set at deployment time only. A new deployment is required if the cardinality settings need to be changed.

### Understand broker cardinality

Cardinality is the number of frontend replicas, frontend workers, backend partitions, and backend workers in the broker deployment. Cardinality controls how the broker scales horizontally and how resilient it is to pod or node failures.

The MQTT broker has a two-tier architecture: **frontend** pods handle client connections and protocol processing, while **backend** pods handle message storage and delivery. Understanding how each tier scales is important for capacity planning.

#### Frontend

Frontend pods accept MQTT client connections and forward messages to the backend. Frontend pods don't store messages themselves. There are two main settings for the frontend tier:

- **Replicas**: The number of frontend pods to deploy. Adding more frontend replicas increases the number of concurrent client connections the broker can handle and provides high availability if one of the frontend pods fails.
- **Workers**: The number of logical workers per frontend pod. Adding more workers lets the frontend pod use more CPU cores. Each worker can consume up to one CPU core.

#### Backend chain

Backend pods handle message storage and delivery. There are three main settings for the backend tier:

- **Partitions**: The number of partitions to deploy. Partitions are the unit of horizontal scaling for message throughput. Through a process called *sharding*, each partition handles a portion of the messages, sharded by topic and session. The frontend pods distribute message traffic across the partitions. Adding more partitions increases the total message throughput the broker can handle.
- **Redundancy factor**: The number of backend pods to deploy per partition. Increasing the redundancy factor increases the number of data copies to provide resiliency against node failures in the cluster.
- **Workers**: The number of workers per backend pod. Workers are the unit of vertical scaling within a partition — adding more workers lets the backend pod use more CPU cores on the same node. Each worker can consume up to two CPU cores, so be careful when you increase the number of workers per replica to not exceed the number of CPU cores in the cluster.

> [!NOTE]
> The effectiveness of partition scaling depends on how evenly the topic space is spread across partitions. A highly skewed distribution can create hotspots on a single partition.

> [!IMPORTANT]
> The backend redundancy factor must be **2 or greater**. The broker requires at least two backend replicas per partition for high availability and rolling update support. Setting the redundancy factor to `1` results in a deployment validation error.

#### Throughput estimate

The performance of an individual partition depends heavily on the CPU characteristics of the node it's running on. As a rule of thumb, expect roughly **5,000 to 6,000 QoS 1 messages per second per partition** with 8-KB payloads on a 2-GHz CPU (~4-GHz turbo). Real-world performance depends on many factors, so use this number only as a starting point for capacity planning.

For detailed benchmark data, see [MQTT Broker performance benchmarking](https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-mqtt-broker-performance-benchmarking-on-throughput-and-late/4405528).

### Single-node recommendations

- **Frontend replicas**: Set to **1**.
- **Frontend workers**: Set to **half the number of CPU cores** per node.
- **Backend replicas (redundancy factor)**: Set to at least **2** so the broker can perform rolling updates.

**Example: single node, 4 CPU cores**

| Frontend setting | Value | Backend setting | Value |
|---|---|---|---|
| Replicas | 1 | Redundancy factor | 2 |
| Workers | 2 | Workers | 1 |
| | | Partitions | 1 |

### Multi-node recommendations

The following values are recommended for optimal performance. For large clusters with low traffic, these values can be set lower than the recommendations without causing issues. More considerations such as memory (RAM) and performance characteristics are discussed in the following sections. Always test your configuration with the expected workload to confirm performance.

- **Frontend replicas**: Set equal to the **number of nodes** in the cluster.
- **Frontend workers**: Set to **half the number of CPU cores** per node.
- **Backend replicas (redundancy factor)**: Set to **2** for redundancy and rolling update support.
- **Backend partitions**: Set equal to the **number of nodes** in the cluster.
- **Backend workers**: Set to **half the number of CPU cores** per node.

**Example: 3-node cluster, 8 CPU cores per node**

| Frontend setting | Value | Backend setting | Value |
|---|---|---|---|
| Replicas | 3 | Redundancy factor | 2 |
| Workers | 4 | Workers | 4 |
| | | Partitions | 3 |

**Example: 5-node cluster, 16 CPU cores per node**

| Frontend setting | Value | Backend setting | Value |
|---|---|---|---|
| Replicas | 5 | Redundancy factor | 2 |
| Workers | 8 | Workers | 8 |
| | | Partitions | 5 |

> [!IMPORTANT]
> The total number of frontend and backend workers per node should not exceed the number of CPU cores available on that node. Over-provisioning workers beyond available cores can cause CPU contention and degrade performance.

### CPU resource limits

To prevent resource starvation in the cluster, the broker can be configured to [request Kubernetes CPU resource limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) based on the cardinality settings. When enabled, scaling the number of replicas or workers proportionally increases the CPU resources required.

> [!IMPORTANT]
> The default value for `generateResourceLimits.cpu` depends on the deployment method:
>
> - **Azure CLI (`az iot ops create`)**: `Disabled` by default, to avoid deployment failures on resource-constrained clusters such as single-node clusters where CPU requests can exceed available resources.
> - **REST API, Bicep, and ARM templates**: `Enabled` by default. If you deploy with these methods without explicitly setting `generateResourceLimits.cpu`, CPU resource limits are applied automatically.
>
> If you enable CPU resource limits, make sure your cluster has enough CPU resources to satisfy the broker's requests based on your cardinality configuration.

The default for REST API, Bicep, and ARM templates is defined in the [Broker API specification](/rest/api/iotoperations/broker/create-or-update).

The MQTT broker requests CPU resources per pod based on the number of workers configured:

- **Frontend pods**: 1.0 CPU per worker
- **Backend pods**: 2.0 CPU per worker

Use the following formulas to calculate total CPU requirements:

| Component | Formula |
|-----------|---------|
| Frontend CPU | `replicas` × `frontend.workers` × 1.0 CPU |
| Backend CPU | `partitions` × `redundancyFactor` × `backend.workers` × 2.0 CPU |
| **Total broker CPU** | Frontend CPU + Backend CPU |

> [!CAUTION]
> The broker isn't the only component that consumes CPU on the cluster. Other Azure IoT Operations components (such as the dataflow engine, OPC UA connector, and system pods) also reserve CPU resources, typically 200-300m in aggregate. When planning cluster capacity, make sure to account for this overhead on top of the broker's CPU requirements. If the total CPU requested by all pods exceeds the available CPU on your cluster, broker pods get stuck in a `Pending` state.

#### Example: small cluster

Consider a 2-node cluster with 4 CPU cores per node (8 cores total) with the following cardinality:

```json
{
  "cardinality": {
    "frontend": {
      "replicas": 2,
      "workers": 2
    },
    "backendChain": {
      "partitions": 1,
      "redundancyFactor": 2,
      "workers": 1
    }
  }
}
```

The broker requests:

- **Frontend CPU**: 2 replicas × 2 workers × 1.0 = **4.0 CPU**
- **Backend CPU**: 1 partition × 2 RF × 1 worker × 2.0 = **4.0 CPU**
- **Total broker CPU**: **8.0 CPU**

This configuration requests 8.0 CPU on a cluster with only 8 cores, leaving nothing for other Azure IoT Operations components (200-300m) or for Kubernetes system pods. The broker pods stay in `Pending` state with `Insufficient cpu` errors.

To resolve this, either add more nodes, increase cores per node, or reduce the broker cardinality.

#### Example: larger deployment

The following cardinality requests significantly more CPU resources:

```json
{
  "cardinality": {
    "frontend": {
      "replicas": 3,
      "workers": 2
    },
    "backendChain": {
      "partitions": 3,
      "redundancyFactor": 2,
      "workers": 2
    }
  }
}
```

- **Frontend CPU**: 3 replicas × 2 workers × 1.0 = **6.0 CPU**
- **Backend CPU**: 3 partitions × 2 RF × 2 workers × 2.0 = **24.0 CPU**
- **Total broker CPU**: **30.0 CPU**

A cluster needs at least 30 CPU cores available for broker pods alone, plus headroom for other Azure IoT Operations components and Kubernetes system pods.

### CPU resource limit configuration

CPU resource limits are controlled by the `generateResourceLimits.cpu` field in the Broker resource. This configuration is supported only by using the `--broker-config-file` flag when you deploy Azure IoT Operations by using the `az iot ops create` command. For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

Prepare a Broker configuration file by following the [GenerateResourceLimits](/rest/api/iotoperations/broker/create-or-update#generateresourcelimits) API reference. The following examples show the two possible values:


```json
{
  "generateResourceLimits": {
    "cpu": "Enabled"
  }
}
```

Or

```json
{
  "generateResourceLimits": {
    "cpu": "Disabled"
  }
}
```

## Choose your memory profile

The memory profile controls the maximum MQTT message size the broker accepts, idle memory usage, and maximum memory usage of each pod. Decide on the right memory profile before deployment based on your expected message sizes and throughput.

| Memory profile | Maximum message size | Idle frontend memory (per pod) | Maximum frontend memory (per pod) | Idle backend memory (per pod) | Maximum backend memory (per pod) | Use case |
|---|---|---|---|---|---|---|
| **Tiny** | 4 MB | ~29 MiB | ~99 MiB | ~41 MiB | ~102 MiB | Low traffic, small packets only |
| **Low** | 16 MB | ~33 MiB | ~387 MiB | ~66 MiB | ~390 MiB | Limited memory, small packets |
| **Medium** (default) | 64 MB | ~169 MiB | ~1.9 GiB | ~211 MiB | ~1.5 GiB | Moderate traffic and message sizes |
| **High** | 256 MB | ~4.9 GiB | ~4.9 GiB | ~5.8 GiB | ~5.8 GiB | High throughput, large messages |

> [!NOTE]
> The memory values in the table are per pod. All workers within a pod share the same memory allocation — adding more workers doesn't increase the pod's memory limit.

> [!WARNING]
> The broker rejects messages when memory usage reaches 75% capacity. Choose a profile with sufficient headroom for your expected message sizes and throughput.

Total broker memory depends on **both** the memory profile and the cardinality (number of frontend replicas, backend partitions, and redundancy factor). More pods mean more total memory. For measured baseline resource consumption across different configurations, see [Baseline resource profiles](../reference/concept-resource-profiles.md).

### Calculate total memory usage

You can calculate total memory usage with this formula:

```text
M_total = (R_fe × M_fe) + (P_be × RF_be × M_be × W_be)
```

Where:

| Variable | Description |
|----------|-------------|
| *M_total* | Total memory usage |
| *R_fe* | The number of frontend replicas |
| *M_fe*| The memory usage of each frontend replica |
| *P_be*| The number of backend partitions |
| *RF_be* | Backend redundancy factor |
| *M_be* | The memory usage of each backend replica |
| *W_be* | The number of workers per backend replica |

For example, if you choose the *Medium* memory profile, the profile has a frontend memory usage of 1.9 GiB and a backend memory usage of 1.5 GiB. Assume that the broker configuration is 2 frontend replicas, 2 backend partitions, and a backend redundancy factor of 2. The total memory usage is:

```text
M_total = (2 × 1.9 GiB) + (2 × 2 × 1.5 GiB × 2)
        = 15.8 GiB
```

In comparison, the *Tiny* memory profile has a frontend memory usage of 99 MiB and a backend memory usage of 102 MiB. With the same broker configuration, the total memory usage is:

```text
M_total = (2 × 99 MiB) + (2 × 2 × 102 MiB × 2)
        = 198 MiB + 816 MiB
        = 1014 MiB (≈ 1.0 GiB)
```

### Memory profile configuration

When you deploy IoT Operations by using the `az iot ops create` command, the `--broker-mem-profile` parameter specifies the memory profile settings.

For example, the following command sets the memory profile to `Tiny` (other parameters are omitted for brevity):

```azurecli
az iot ops create ... --broker-mem-profile Tiny
```

To learn more, see [`az iot ops create` optional parameters](/cli/azure/iot/ops#az-iot-ops-create-optional-parameters).

## Optional broker settings

The following broker settings are also configured at deployment time and can't be changed afterward. Review these if they apply to your scenario:

- [Disk-backed message buffer](deployment-planning-disk-buffer.md) — Buffer messages to disk when subscriber queues exceed available memory. Useful for persistent sessions and connectivity challenges.
- [Persistence](deployment-planning-persistence.md) — Write critical broker data to disk to preserve it across restarts.
- [Diagnostics](deployment-planning-diagnostics.md) — Configure metrics, logs, and self-check probes for the MQTT broker.
- [Advanced MQTT options](deployment-planning-mqtt-options.md) — Customize session expiry, message expiry, subscriber queue limits, and keep-alive settings.
- [Internal traffic encryption](deployment-planning-encryption.md) — Configure encryption of internal traffic between broker frontend and backend pods (on by default).

## Next steps

- [Prepare your cluster](../deploy-iot-ops/howto-prepare-cluster.md)
- [Deploy to a production cluster](../deploy-iot-ops/howto-deploy-iot-operations.md)
- [Configure observability](../deploy-iot-ops/howto-configure-observability.md)
- [Secure your deployment](../secure-iot-ops/howto-enable-secure-settings.md)
