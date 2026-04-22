---
title: Deployment planning for Azure IoT Operations
description: Plan your Azure IoT Operations deployment by reviewing architecture, sizing, broker configuration, and security decisions that must be made before deployment.
author: huguesbouvier
ms.author: hubouvie
ms.topic: conceptual
ms.service: azure-iot-operations
ms.date: 04/21/2026
#CustomerIntent: As an IT administrator or platform engineer, I want to understand the planning decisions I need to make before deploying Azure IoT Operations.
---

# Deployment planning for Azure IoT Operations

Many MQTT broker settings in Azure IoT Operations are configured at deployment time and can't be changed afterward. A new deployment is required if broker configuration changes are needed. This constraint makes pre-deployment planning critical -- you need to make informed decisions about cluster topology, memory profiles, disk buffering, persistence, diagnostics, and security before you deploy. This guide consolidates the key decisions you should review before deployment.

## Understand the architecture

Azure IoT Operations is a set of modular, Kubernetes-native services deployed to an Azure Arc-enabled cluster. Key components include:

| Component | Purpose |
|---|---|
| **[MQTT Broker](../manage-mqtt-broker/overview-broker.md)** | High-performance MQTT v3.1.1/v5 broker for edge messaging |
| **[Connector for OPC UA](../discover-manage-assets/overview-opc-ua-connector.md)** | Collects data from OPC UA servers and publishes to MQTT |
| **[Data Flows](../connect-to-cloud/overview-dataflow.md)** | Routes, transforms, and pushes data to cloud endpoints |
| **[Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#azure-device-registry)** | Cloud-based registry for devices, assets, and schemas |
| **[Akri Services](../discover-manage-assets/overview-akri.md)** | Device discovery and protocol adapters |
| **[State Store](../develop-edge-apps/overview-state-store.md)** | Key-value persistence layer in the MQTT broker |

An Azure IoT Operations *deployment* includes the instance, Arc extensions, custom locations, and all configurable resources (assets, devices, data flows). The *instance* is the parent resource that bundles the services.

## Choose your cluster topology

Before you deploy, decide whether you need a single-node or multi-node cluster. This decision determines the hardware requirements and the broker cardinality settings.

| Topology | Use Case | Min Hardware |
|---|---|---|
| **Single-node** | Smaller deployments where high availability isn't required | 4 vCPU, 16-GB RAM, 30-GB storage |
| **Multi-node (3-5 nodes)** | High availability and higher throughput requirements | 8 vCPU, 32-GB RAM per node |

> [!IMPORTANT]
> Cardinality is set at deployment time only. A new deployment is required if the cardinality settings need to be changed.

### Understand broker cardinality

Cardinality means the number of instances of a particular entity in a set. In the context of the MQTT broker, cardinality refers to the number of frontend replicas, frontend workers, backend partitions, and backend workers to deploy. The cardinality settings are used to scale the broker horizontally and improve high availability if there are pod or node failures.

The MQTT broker has a two-tier architecture: **frontend** pods handle client connections and protocol processing, while **backend** pods handle message storage and delivery. Understanding how each tier scales is important for capacity planning.

#### Frontend

Frontend pods accept MQTT client connections and forward messages to the backend. Frontend pods don't store messages themselves. There are two main settings for the frontend tier:

- **Replicas**: The number of frontend replicas (pods) to deploy. Adding more frontend replicas increases the number of concurrent client connections the broker can handle and provides high availability in case one of the frontend pods fails.
- **Workers**: The number of logical frontend workers per replica. Adding more workers allows the frontend pod to use more CPU cores. Each worker can consume up to one CPU core at most.

#### Backend chain

Backend pods handle message storage and delivery. There are three main settings for the backend tier:

- **Partitions**: The number of partitions to deploy. Partitions are the unit of horizontal scaling for message throughput. Through a process called *sharding*, each partition is responsible for a portion of the messages, divided by topic ID and session ID. The frontend pods distribute message traffic across the partitions. Adding more partitions increases the total message throughput the broker can handle. However, the effectiveness of scaling depends on how evenly the topic space is spread across partitions -- a highly skewed distribution can create hotspots on a single partition.
- **Redundancy factor**: The number of backend replicas (pods) to deploy per partition. Increasing the redundancy factor increases the number of data copies to provide resiliency against node failures in the cluster.
- **Workers**: The number of workers to deploy per backend replica. Workers are the unit of vertical scaling within a partition -- adding more workers allows the backend pod to use more CPU cores on the same node. Each worker can consume up to two CPU cores at most, so be careful when you increase the number of workers per replica to not exceed the number of CPU cores in the cluster.

> [!IMPORTANT]
> The backend redundancy factor must be set to **2 or greater**. The broker requires at least two backend replicas per partition for high availability and rolling upgrade support. Setting the redundancy factor to `1` results in a deployment validation error.

#### Throughput estimate

The performance of an individual partition depends heavily on the CPU characteristics of the node it's running on. As a rule of thumb, a ballpark throughput per partition is on the order of **5--6K messages** per second for QoS 1 with 8-KB payloads on 2-GHz base frequency CPU (~4-GHz turbo). This estimate is intentionally approximate -- real-world performance depends on many factors -- but it can serve as a starting point for capacity planning.

For detailed benchmark data, see [MQTT Broker performance benchmarking](https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-mqtt-broker-performance-benchmarking-on-throughput-and-late/4405528).

### Single-node recommendations

- **Frontend replicas**: Set to at least **1**.
- **Frontend workers**: Set to **half the number of CPU cores** per node.
- **Backend replicas (redundancy factor)**: Set to at least **2** so the broker can perform rolling updates.

*Example -- single node with 4 CPU cores:*

| Frontend setting | Value | Backend setting | Value |
|---|---|---|---|
| Replicas | 1 | Redundancy factor | 2 |
| Workers | 2 | Workers | 1 |
| | | Partitions | 1 |

### Multi-node recommendations

The following values are recommended for optimal performance. For large clusters with low traffic, these values can be set lower than the recommendations without causing issues. More considerations such as memory (RAM) and performance characteristics are discussed in the following sections. It is always recommended to test your configuration with the expected workload to verify the desired performance.

- **Frontend replicas**: Set equal to the **number of nodes** in the cluster.
- **Frontend workers**: Set to **half the number of CPU cores** per node.
- **Backend replicas (redundancy factor)**: Set to **2** for redundancy and rolling update support.
- **Backend partitions**: Set equal to the **number of nodes** in the cluster.
- **Backend workers**: Set to **half the number of CPU cores** per node.

*Example -- 3-node cluster, 8 CPU cores per node:*

| Frontend setting | Value | Backend setting | Value |
|---|---|---|---|
| Replicas | 3 | Redundancy factor | 2 |
| Workers | 4 | Workers | 4 |
| | | Partitions | 3 |

*Example -- 5-node cluster, 16 CPU cores per node:*

| Frontend setting | Value | Backend setting | Value |
|---|---|---|---|
| Replicas | 5 | Redundancy factor | 2 |
| Workers | 8 | Workers | 8 |
| | | Partitions | 5 |

> [!IMPORTANT]
> The total number of frontend and backend workers per node should not exceed the number of CPU cores available on that node. Over-provisioning workers beyond available cores may lead to CPU contention and degrade performance.

### CPU resource limits

To prevent resource starvation in the cluster, the broker can be configured to [request Kubernetes CPU resource limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) based on the cardinality settings. When enabled, scaling the number of replicas or workers proportionally increases the CPU resources required.

> [!IMPORTANT]
> The default value for `generateResourceLimits.cpu` depends on the deployment method:
>
> - **Azure CLI (`az iot ops create`)**: `Disabled` by default. The CLI actively sets this value to `Disabled` to avoid deployment failures on resource-constrained clusters, particularly single-node clusters where the CPU requests can exceed available resources.
> - **REST API, Bicep, and ARM templates**: `Enabled` by default, as defined in the [Broker API specification](/rest/api/iotoperations/broker/create-or-update). If you deploy using these methods without explicitly setting `generateResourceLimits.cpu`, CPU resource limits are applied automatically.
>
> If you enable CPU resource limits, make sure your cluster has enough CPU resources to satisfy the broker's requests based on your cardinality configuration. See the CPU requirements below.

The MQTT broker requests CPU resources per pod based on the number of workers configured:

- **Frontend pods**: 1.0 CPU per worker
- **Backend pods**: 2.0 CPU per worker

Use the following formulas to calculate total CPU requirements:

| Component | Formula |
|-----------|---------|
| Frontend CPU | `replicas` x `frontend.workers` x 1.0 CPU |
| Backend CPU | `partitions` x `redundancyFactor` x `backend.workers` x 2.0 CPU |
| **Total broker CPU** | Frontend CPU + Backend CPU |

> [!CAUTION]
> The broker isn't the only component that consumes CPU on the cluster. Other Azure IoT Operations components (such as the dataflow engine, OPC UA connector, and system pods) also reserve CPU resources, typically around 200-300m in aggregate. When planning cluster capacity, make sure to account for this overhead on top of the broker's CPU requirements. If the total CPU requested by all pods exceeds the available CPU on your cluster, broker pods get stuck in a `Pending` state.

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

- **Frontend CPU**: 2 replicas x 2 workers x 1.0 = **4.0 CPU**
- **Backend CPU**: 1 partition x 2 RF x 1 worker x 2.0 = **4.0 CPU**
- **Total broker CPU**: **8.0 CPU**

Even though the cluster has 8 cores total, this deployment fails because other Azure IoT Operations components also consume CPU (~280m). The broker pods get stuck in `Pending` state with `Insufficient cpu` errors.

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

- **Frontend CPU**: 3 replicas x 2 workers x 1.0 = **6.0 CPU**
- **Backend CPU**: 3 partitions x 2 RF x 2 workers x 2.0 = **24.0 CPU**
- **Total broker CPU**: **30.0 CPU**

### Configure CPU resource limits

To enable or disable CPU resource limits, set the `generateResourceLimits.cpu` field in the Broker resource. Currently, this configuration is supported only by using the `--broker-config-file` flag when you deploy Azure IoT Operations by using the `az iot ops create` command. For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

To get started, prepare a Broker configuration file by following the [GenerateResourceLimits](/rest/api/iotoperations/broker/create-or-update#generateresourcelimits) API reference.


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

| Memory Profile | Max Message Size | Idle Frontend Memory (per pod) | Max Frontend Memory (per pod) | Idle Backend Memory (per pod) | Max Backend Memory (per pod) | Use Case |
|---|---|---|---|---|---|---|
| **Tiny** | 4 MB | ~29 MiB | ~99 MiB | ~41 MiB | ~102 MiB | Low traffic, small packets only |
| **Low** | 16 MB | ~33 MiB | ~387 MiB | ~66 MiB | ~390 MiB | Limited memory, small packets |
| **Medium** (default) | 64 MB | ~169 MiB | ~1.9 GiB | ~211 MiB | ~1.5 GiB | Moderate traffic and message sizes |
| **High** | 256 MB | ~4.9 GiB | ~4.9 GiB | ~5.8 GiB | ~5.8 GiB | High throughput, large messages |

> [!NOTE]
> The memory values in the table are per pod. All workers within a pod share the same memory allocation -- adding more workers does not increase the pod's memory limit.

> [!WARNING]
> The broker rejects messages when memory usage reaches 75% capacity. Choose a profile with sufficient headroom for your expected message sizes and throughput.

Total broker memory depends on **both** the memory profile and the cardinality (number of frontend replicas, backend partitions, and redundancy factor). More pods mean more total memory. For measured baseline resource consumption across different configurations, see [Baseline resource profiles](../reference/concept-resource-profiles.md).

### Calculate total memory usage

You can calculate the total memory usage using the formula:

*M_total = R_fe * M_fe + (P_be * RF_be) * M_be * W_be*

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

For example if you choose the *Medium* memory profile, the profile has a frontend memory usage of 1.9 GB and backend memory usage of 1.5 GB. Assume that the broker configuration is 2 frontend replicas, 2 backend partitions, and a backend redundancy factor of 2. The total memory usage is:

*2 * 1.9 GB + (2 * 2) * 1.5 GB * 2* = 15.8 GB

In comparison, the *Tiny* memory profile has a frontend memory usage of 99 MiB and backend memory usage of 102 MiB. If you assume the same broker configuration, the total memory usage is:

*2 * 99 MB + (2 * 2) * 102 MB * 2 = 198 MB + 816 MB* = 1.014 GB.

### Configure the memory profile

When you deploy IoT Operations by using the `az iot ops create` command, use the `--broker-mem-profile` parameter to specify the memory profile settings.

For example, to specify the memory profile as `Tiny`, see the following command (other parameters are omitted for brevity):

```azurecli
az iot ops create ... --broker-mem-profile Tiny
```

To learn more, see [`az iot ops create` optional parameters](/cli/azure/iot/ops#az-iot-ops-create-optional-parameters).

## Optional broker settings

The following broker settings are also configured at deployment time and can't be changed afterward. Review these if they apply to your scenario:

- [Disk-backed message buffer](deployment-planning-disk-buffer.md) -- Buffer messages to disk when subscriber queues exceed available memory. Useful for persistent sessions and connectivity challenges.
- [Persistence](deployment-planning-persistence.md) -- Write critical broker data to disk to preserve it across restarts.
- [Diagnostics](deployment-planning-diagnostics.md) -- Configure metrics, logs, and self-check probes for the MQTT broker.
- [Advanced MQTT options](deployment-planning-mqtt-options.md) -- Customize session expiry, message expiry, subscriber queue limits, and keep alive settings.
- [Internal traffic encryption](deployment-planning-encryption.md) -- Configure encryption of internal traffic between broker frontend and backend pods (enabled by default).
- [Certificate management](deployment-planning-certificates.md) -- Decide whether to bring your own CA issuer for internal communications or use the default self-signed issuer.

## Next steps

- [Prepare your cluster](howto-prepare-cluster.md)
- [Deploy to a production cluster](howto-deploy-iot-operations.md)
- [Configure observability](../configure-observability-monitoring/howto-configure-observability.md)
- [Secure your deployment](howto-enable-secure-settings.md)
