---
title: Troubleshooting Nexus Kubernetes Cluster pods stuck in ContainerCreating status
description: Troubleshooting Nexus Kubernetes Cluster pods stuck in ContainerCreating status
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 08/12/2024
ms.author: hbusipalle
author: hem2
---
# Troubleshooting Nexus Kubernetes Cluster pods stuck in ContainerCreating status
This guide provides detailed steps for troubleshooting Nexus Kubernetes Cluster pods stuck in `ContainerCreating` status

## Prerequisites

* Command line access to the Nexus Kubernetes Cluster is required
* Necessary permissions to make changes to the Nexus Kubernetes Cluster objects
   
## Symptoms

In environments operating at scale, there are rare instances where pods using the `nexus-volume` storage class Persistent Volume Claims (PVCs) might become stuck in the `ContainerCreating` status.

Verify if the pod is experiencing the described error by inspecting its details and reviewing its events.

``` console
kubectl describe pod <pod name>
```
```console
Events:
  Type     Reason              Age                From                     Message
  ----     ------              ----               ----                     -------

Warning  FailedAttachVolume  13s (x6 over 31s)  attachdetach-controller  AttachVolume.Attach failed for volume "pvc-561a2f5b-f673-4f6c-aa4d-34dbc4a6224e" : rpc error: code = Internal desc = failed to handle ControllerPublishVolume
```

## Solution
To address this issue, the following workaround can be applied for pods...

### Steps to Resolve
1. Identify the StatefulSet whose pods are stuck in the `ContainerCreating` status.
2. Scale down the StatefulSet’s replicas to zero: 

   ```console
   kubectl scale statefulset <statefulset-name> --replicas=0
   ```

3. Wait until the persistent volume attachments are fully removed. Volume attachments should clear up quickly, usually in a matter of a minute or two. In this example, the persistent volume is named pvc-561a2f5b-f673-4f6c-aa4d-34dbc4a6224e. Typically, persistent volumes are named with the prefix pvc-xxx, even though they aren't volume claims. You can verify by running the following command:

   ```console
   kubectl get volumeattachments | grep -c pvc-561a2f5b-f673-4f6c-aa4d-34dbc4a6224e
   0
   ```

4. Scale up the StatefulSet to the desired number of replicas:

   ```console
   kubectl scale statefulset <statefulset-name> --replicas=<desired-replica-count>
   ```
