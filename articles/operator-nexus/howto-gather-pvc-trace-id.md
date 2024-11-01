---
title: Gather trace IDs for PersistentVolumeClaim failures
description: Gather trace IDs for PersistentVolumeClaim failures
ms.service: azure-operator-nexus
ms.custom: how-to
ms.topic: how-to
ms.date: 11/01/2024
ms.author: peterwhiting
author: pjw711
---

# Gather trace IDs for PersistentVolumeClaim failures

There are rare cases where pods using PersistentVolumeClaims referencing the 'nexus-volume' or 'nexus-shared' storage class can enter a stuck state. Pods may get stuck in the "ContainerCreating" state due to failures creating a volume or in attaching a volume to a node.

The 'nexus-volume' and 'nexus-shared' storage classes assign trace IDs to volume lifecycle operations to allow diagnosis of these issues. This articles explains how to find trace IDs and include them in support requests.

1. Follow [Connect to Azure Operator Nexus Kubernetes Cluster](./howto-kubernetes-cluster-connect.md) to connect to your Nexus Kubernetes cluster.
1. Identify the pod in the stuck state.

    ```console
    kubectl get pod
    NAME               READY    STATUS              RESTARTS      AGE
    contoso-0           0/1     ContainerCreating   0             10m
    ```

1. Run `kubectl describe <pod-name>` on the stuck pod.

    ```console
    kubectl describe pod contoso-0
    ```

@@@PJW NEEDS EXAMPLE OUTPUT

1. Raise a support request through the Azure Portal and include the output of the `kubectl describe` command.