---
title: "Azure Operator Nexus: Gather trace IDs for PersistentVolumeClaim failures"
description: Learn how to gather trace IDs for pods stuck in 'ContainerCreating'
ms.service: azure-operator-nexus
ms.custom: how-to
ms.topic: how-to
ms.date: 11/01/2024
ms.author: peterwhiting
author: pjw711
---

# Gather trace IDs for pods stuck in 'ContainerCreating'

There are rare cases where pods using PersistentVolumeClaims referencing the 'nexus-volume' or 'nexus-shared' storage class can enter a stuck state. Pods can get stuck in the "ContainerCreating" state due to failures creating a volume or in attaching a volume to a node.

The 'nexus-volume' and 'nexus-shared' storage classes assign trace IDs to volume lifecycle operations to allow diagnosis of these issues. This article explains how to find trace IDs and include them in support requests.

1. Connect to your Nexus Kubernetes cluster by following [Connect to Azure Operator Nexus Kubernetes Cluster](./howto-kubernetes-cluster-connect.md).
1. Identify the pod in the stuck state.

    ```console
    kubectl get pod
    NAME               READY    STATUS              RESTARTS      AGE
    contoso-0           0/1     ContainerCreating   0             10m
    ```

1. Run `kubectl describe <pod-name>` on the stuck pod and copy the output. The 'contoso-0' pod in this truncated example has three PersistentVolumeClaims. All of the corresponding Persistent Volumes failed to attach to the 'contoso-0' pod. The Kubernetes Events section in the output contains the errors trace IDs for the volume orchestration failures.

    ```console
    kubectl describe pod contoso-0

    Name:             contoso-0
    Volumes:
      persistent-storage-filesystem-1:
        Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName:  persistent-storage-filesystem-1-contoso-0-0
        ReadOnly:   false
      persistent-storage-filesystem-1-2:
        Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName:  persistent-storage-filesystem-1-2-contoso-0-0
        ReadOnly:   false
      persistent-storage-filesystem-1-3:
        Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName:  persistent-storage-filesystem-1-3-contoso-0-0
        ReadOnly:   false
    Events:
      Type     Reason              Age               From                     Message
      ----     ------              ----              ----                     -------
      Normal   Scheduled           66s               default-scheduler        Successfully assigned scale-test/contoso-0-0 to contoso-37bb13b4-agentpool2-md-xltt4-cxjgz
      Warning  FailedAttachVolume  8s (x6 over 26s)  attachdetach-controller  AttachVolume.Attach failed for volume "pvc-605d27e1-a360-4f04-a305-dc48bf2f9e8d" : rpc error: code = Internal desc = attachment (temporarily) failed; "traceid": "tr-aa0a7217-ac14-4237-845f-713966741c6e"
      Warning  FailedAttachVolume  5s (x6 over 24s)  attachdetach-controller  AttachVolume.Attach failed for volume "pvc-225ebcc2-8a0f-4f17-afa1-b7a4f2c20b7e" : rpc error: code = Internal desc = attachment (temporarily) failed; "traceid": "tr-a57086a6-817c-4c16-b4cb-df5d1e12815f"
      Warning  FailedAttachVolume  5s (x6 over 24s)  attachdetach-controller  AttachVolume.Attach failed for volume "pvc-c71f748c-d97e-4aac-a1fb-cd8d7b878c22" : rpc error: code = Internal desc = attachment (temporarily) failed; "traceid": "tr-82d2d5bf-cc99-4175-b293-1f67fc4ea7f3"

    ```

1. Raise a [support request through the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) and include the output of the `kubectl describe` command. For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
