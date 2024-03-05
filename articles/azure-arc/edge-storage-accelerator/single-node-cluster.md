---
title: Prepare Linux using a single-node cluster
description: Learn how to prepare Linux with a single-node cluster using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 02/06/2024
zone_pivot_groups: platform-select

---

# Prepare Linux using a single-node cluster

This article describes how to prepare Linux using a single-node cluster, and assumes you [fulfilled the prerequisites](prepare-linux.md#prerequisites).

::: zone pivot="aks"
## Prepare Linux with AKS enabled by Azure Arc

This section describes how to prepare Linux with AKS enabled by Azure Arc if you run a single-node cluster.

Disable **ACStor** by creating a file named **config.json** with the following contents:

```json
{
  "hydra.highAvailability.disk.storageClass": "default",
  "hydra.acstorController.enabled": false,
  "hydra.highAvailability.disk.storageClass": "local-path"
}
```

::: zone-end

::: zone pivot="aks-ee"
## Prepare Linux with AKS Edge Essentials

This section describes how to prepare Linux with AKS Edge Essentials if you run a single-node cluster.

1. Set up Local Path Provisioner storage using:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/Azure/AKS-Edge/main/samples/storage/local-path-provisioner/local-path-storage.yaml
   ```

   > [!NOTE]
   > Local-Path-Provisioner and Busybox images are not maintained by Microsoft and are pulled from the Rancher Labs repository. Local-Path-Provisioner and BusyBox are only available as a Linux container image.

   Once the deployment is finished, make sure that the local-path storage class is available on your node by running the following cmdlet:

   ```bash
   kubectl get StorageClass
   ```

   If everything is correctly configured, you should see the following output:

   ```output
   NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  21h
   ```

   If you have multiple disks and want to redirect the path, use:

   ```bash
   kubectl edit configmap -n kube-system local-path-config
   ```

1. Increase the maximum number of files using the following command:

   ```bash
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'echo 'fs.inotify.max_user_instances = 1024' | sudo tee -a /etc/sysctl.conf && sudo sysctl -p'
   ```

1. If you run a single-node cluster, disable **ACStor** by creating a file named **config.json** with the following contents:

   ```json
   {
     "hydra.acstorController.enabled": false,
     "hydra.highAvailability.disk.storageClass": "local-path"
   }
   ```

::: zone-end

::: zone pivot="ubuntu"
## Prepare Linux with Ubuntu

This section describes how to prepare Linux with Ubuntu if you run a single-node cluster.

1. Increase the number of allowed open files and reload the **sysctl** settings using the following command:

   ```bash
   echo 'fs.inotify.max_user_instances = 1024' | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. Disable **ACStor** by creating a file named **config.json** with the following contents:

   ```json
   {
     "hydra.acstorController.enabled": false,
     "hydra.highAvailability.disk.storageClass": "local-path"
   }
   ```

::: zone-end

## Next steps

[Install Edge Storage Accelerator](install-edge-storage-accelerator.md)
