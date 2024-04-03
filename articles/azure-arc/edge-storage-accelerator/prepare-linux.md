---
title: Prepare Linux
description: Learn how to prepare Linux using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 03/12/2024

---

# Prepare Linux

The article describes how to prepare Linux using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.

> [!NOTE]
> The minimum supported Linux kernel version is 5.1. At this time, there are known issues with 6.4 and 6.2.

## Prerequisites

> [!NOTE]
> Edge Storage Accelerator is only available in the following regions: East US 2, West US 3, West Europe.

### Custom Kubernetes installation on Azure IoT Operations (AIO)

Follow the instructions to [create a cluster for Azure IoT Operations](/azure/iot-operations/get-started/quickstart-deploy?tabs=linux). Use Ubuntu 22.04 on Standard D8s v3 machines with 3 SSDs attached for additional storage.

## Single-node and multi-node clusters

A single-node cluster is commonly used for development or testing purposes due to its simplicity in setup and minimal resource requirements. These clusters offer a lightweight and straightforward environment for developers to experiment with Kubernetes without the complexity of a multi-node setup. Additionally, in situations where resources such as CPU, memory, and storage are limited, a single-node cluster is more practical. Its ease of setup and minimal resource requirements make it a suitable choice in resource-constrained environments.

However, single-node clusters come with limitations, mostly in the form of missing features, including their lack of high availability, fault tolerance, scalability, and performance.

A multi-node Kubernetes configuration is typically used for production, staging, or large-scale scenarios because of its advantages, including high availability, fault tolerance, scalability, and performance. A multi-node cluster also introduces challenges and trade-offs, including complexity, overhead, cost, and efficiency considerations. For example, setting up and maintaining a multi-node cluster requires additional knowledge, skills, tools, and resources (network, storage, compute). The cluster must handle coordination and communication among nodes, leading to potential latency and errors. Additionally, running a multi-node cluster is more resource-intensive and is costlier than a single-node cluster. Optimization of resource usage among nodes is crucial for maintaining cluster and application efficiency and performance.

In summary, a [single-node Kubernetes cluster](single-node-cluster.md) might be suitable for development, testing, and resource-constrained environments, while a [multi-node cluster](multi-node-cluster.md) is more appropriate for production deployments, high availability, scalability, and scenarios where distributed applications are a requirement. This choice ultimately depends on your specific needs and goals for your deployment.

## Next steps

To continue preparing Linux, see the following instructions for single-node or multi-node clusters:

- [Single-node clusters](single-node-cluster.md)
- [Multi-node clusters](multi-node-cluster.md)
