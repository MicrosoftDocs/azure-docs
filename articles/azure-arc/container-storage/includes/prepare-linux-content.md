---
ms.service: azure-arc
ms.topic: include
ms.date: 08/27/2024
author: sethmanheim
ms.author: sethm
---

### Arc-connected Kubernetes cluster

These instructions assume that you already have an Arc-connected Kubernetes cluster. To connect an existing Kubernetes cluster to Azure Arc, [see these instructions](/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli).  

If you want to use Azure Container Storage enabled by Azure Arc with Azure IoT Operations, follow the [instructions to create a cluster for Azure IoT Operations](/azure/iot-operations/get-started/quickstart-deploy?tabs=linux).

## Single-node and multi-node clusters

A single-node cluster is commonly used for development or testing purposes due to its simplicity in setup and minimal resource requirements. These clusters offer a lightweight and straightforward environment for developers to experiment with Kubernetes without the complexity of a multi-node setup. Additionally, in situations where resources such as CPU, memory, and storage are limited, a single-node cluster is more practical. Its ease of setup and minimal resource requirements make it a suitable choice in resource-constrained environments.

However, single-node clusters come with limitations, mostly in the form of missing features, including their lack of high availability, fault tolerance, scalability, and performance.

A multi-node Kubernetes configuration is typically used for production, staging, or large-scale scenarios because of features such as high availability, fault tolerance, scalability, and performance. A multi-node cluster also introduces challenges and trade-offs, including complexity, overhead, cost, and efficiency considerations. For example, setting up and maintaining a multi-node cluster requires extra knowledge, skills, tools, and resources (network, storage, compute). The cluster must handle coordination and communication among nodes, leading to potential latency and errors. Additionally, running a multi-node cluster is more resource-intensive and is costlier than a single-node cluster. Optimization of resource usage among nodes is crucial for maintaining cluster and application efficiency and performance.

In summary, a [single-node Kubernetes cluster](../single-node-cluster-edge-volumes.md) might be suitable for development, testing, and resource-constrained environments. A [multi-node cluster](../multi-node-cluster-edge-volumes.md) is more appropriate for production deployments, high availability, scalability, and scenarios in which distributed applications are a requirement. This choice ultimately depends on your specific needs and goals for your deployment.

## Minimum hardware requirements

### Single-node or 2-node cluster

- Standard_D8ds_v5 VM recommended
- Equivalent specifications per node:
  - 4 CPUs
  - 16 GB RAM

### Multi-node cluster

- Standard_D8as_v5 VM recommended
- Equivalent specifications per node:
  - 8 CPUs
  - 32 GB RAM

32 GB RAM serves as a buffer; however, 16 GB RAM should suffice. Edge Essentials configurations require 8 CPUs with 10 GB RAM per node, making 16 GB RAM the minimum requirement.

## Minimum storage requirements

### Edge Volumes requirements

When you use the fault tolerant storage option, Edge Volumes allocates disk space out of a fault tolerant storage pool, which is made up of the storage exported by each node in the cluster.

The storage pool is configured to use 3-way replication to ensure fault tolerance. When an Edge Volume is provisioned, it allocates disk space from the storage pool, and allocates storage on 3 of the replicas.

For example, in a 3-node cluster with 20 GB of disk space per node, the cluster has a storage pool of 60 GB. However, due to replication, it has an effective storage size of 20 GB.

When an Edge Volume is provisioned with a requested size of 10 GB, it allocates a reserved system volume (statically sized to 1 GB) and a data volume (sized to the requested volume size, for example 10 GB). The reserved system volume consumes 3 GB (3 x 1 GB) of disk space in the storage pool, and the data volume consumes 30 GB (3 x 10 GB) of disk space in the storage pool, for a total of 33 GB.

### Cache Volumes requirements

Cache Volumes requires at least 4 GB per node of storage. For example, if you have a 3-node cluster, you need at least 12 GB of storage.
