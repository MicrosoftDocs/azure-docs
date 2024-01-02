---
title: High availability for Azure SQL Edge containers - Azure SQL Edge
description: Learn about high availability for Azure SQL Edge containers
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - SQL Edge
  - containers
  - high availability
---
# High availability for Azure SQL Edge containers

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Create and manage your Azure SQL Edge instances natively in Kubernetes. Deploy Azure SQL Edge to containers managed by [Kubernetes](https://kubernetes.io/). In Kubernetes, a container with an Azure SQL Edge instance can automatically recover in case a cluster node fails. You can configure the SQL Edge container image with a Kubernetes persistent volume claim (PVC). Kubernetes monitors the Azure SQL Edge process in the container. If the process, pod, container, or node fail, Kubernetes automatically bootstraps another instance and reconnects to the storage.

## Azure SQL Edge containers on Kubernetes

Kubernetes 1.6 and later versions has support for [*storage classes*](https://kubernetes.io/docs/concepts/storage/storage-classes/), [*persistent volume claims*](https://kubernetes.io/docs/concepts/storage/storage-classes/#persistentvolumeclaims).

In this configuration, Kubernetes plays the role of the container orchestrator.

:::image type="content" source="media/deploy-kubernetes/kubernetes-sql-edge.png" alt-text="Diagram of Azure SQL Edge in a Kubernetes cluster.":::

In the preceding diagram, `azure-sql-edge` is a container in a [pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/). Kubernetes orchestrates the resources in the cluster. A [replica set](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) ensures that the pod is automatically recovered after a node failure. Applications connect to the service. In this case, the service represents a load balancer that hosts an IP address that stays the same after failure of the `azure-sql-edge`.

In the following diagram, the `azure-sql-edge` container has failed. As the orchestrator, Kubernetes guarantees the correct count of healthy instances in the replica set, and starts a new container according to the configuration. The orchestrator starts a new pod on the same node, and `azure-sql-edge` reconnects to the same persistent storage. The service connects to the re-created `azure-sql-edge`.

:::image type="content" source="media/deploy-kubernetes/kubernetes-sql-edge-after-pod-fail.png" alt-text="Diagram of Azure SQL Edge in a Kubernetes cluster after pod fail.":::

In the following diagram, the node hosting the `azure-sql-edge` container has failed. The orchestrator starts the new pod on a different node, and `azure-sql-edge` reconnects to the same persistent storage. The service connects to the re-created `azure-sql-edge`.

:::image type="content" source="media/deploy-kubernetes/kubernetes-sql-edge-after-node-fail.png" alt-text="Diagram of Azure SQL Edge in a Kubernetes cluster after node fail.":::

To create a container in Kubernetes, see [Deploy a Azure SQL Edge container in Kubernetes](deploy-Kubernetes.md)

## Next steps

To deploy Azure SQL Edge containers in Azure Kubernetes Service (AKS), see the following articles:
- [Deploy a Azure SQL Edge container in Kubernetes](deploy-Kubernetes.md)
- [Machine Learning and Artificial Intelligence with ONNX in SQL Edge](onnx-overview.md).
- [Building an end to end IoT Solution with SQL Edge using IoT Edge](tutorial-deploy-azure-resources.md).
- [Data Streaming in Azure SQL Edge](stream-data.md)
