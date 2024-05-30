---
title: Prepare Linux using a single-node or 2-node cluster (preview)
description: Learn how to prepare Linux with a single-node or 2-node cluster in Edge Storage Accelerator using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024
zone_pivot_groups: platform-select

---

# Prepare Linux using a single-node or 2-node cluster (preview)

This article describes how to prepare Linux using a single-node or 2-node cluster, and assumes you [fulfilled the prerequisites](prepare-linux.md#prerequisites).

::: zone pivot="aks"
## Prepare Linux with AKS enabled by Azure Arc

This section describes how to prepare Linux with AKS enabled by Azure Arc if you run a single-node or 2-node cluster.

1. Install Open Service Mesh (OSM) using the following command:

   ```azurecli
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   ```

1. Disable **ACStor** by creating a file named **config.json** with the following contents:

   ```json
   {
     "feature.diskStorageClass": "default",
     "acstorController.enabled": false
   }
   ```

::: zone-end

::: zone pivot="aks-ee"
## Prepare Linux with AKS Edge Essentials

This section describes how to prepare Linux with AKS Edge Essentials if you run a single-node or 2-node cluster.

1. For Edge Essentials to support Azure IoT Operations and Edge Storage Accelerator, the Kubernetes hosts must be modified to support more memory. You can also increase vCPU and disk allocations at this time if you anticipate requiring additional resources for your Kubernetes uses.

   Start by following the [How-To guide here](/azure/aks/hybrid/aks-edge-howto-single-node-deployment). The QuickStart uses the default configuration and should be avoided.  

   Following [Step 1: single machine configuration parameters](/azure/aks/hybrid/aks-edge-howto-single-node-deployment#step-1-single-machine-configuration-parameters), you have a file in your working directory called **aksedge-config.json**. Open this file in Notepad or another text editor:

   ```json
   "SchemaVersion": "1.11",
   "Version": "1.0",
   "DeploymentType": "SingleMachineCluster",
   "Init": {
       "ServiceIPRangeSize": 0
   },
   "Machines": [
   {
       "LinuxNode": {
           "CpuCount": 4,
           "MemoryInMB": 4096,
           "DataSizeInGB": 10,
       }
   }
   ]
   ```

   Increase `MemoryInMB` to at least 16384 and `DataSizeInGB` to 40G. Set `ServiceIPRangeSize` to 15. If you intend to run many PODs, you can increase the `CpuCount` as well. For example:

   ```json
   "Init": {
       "ServiceIPRangeSize": 15
      },
   "Machines": [
   {
       "LinuxNode": {
           "CpuCount": 4,
           "MemoryInMB": 16384,
           "DataSizeInGB": 40,
       }
   }
   ]
   ```

   Continue with the remaining steps starting with [create a single machine cluster](/azure/aks/hybrid/aks-edge-howto-single-node-deployment#step-2-create-a-single-machine-cluster). Next, [connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).

1. Check for and install Local Path Provisioner storage if it's not already installed. Check if the local-path storage class is already available on your node by running the following cmdlet:

   ```bash
   kubectl get StorageClass
   ```

   If the local-path storage class is not available, run the following command:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/Azure/AKS-Edge/main/samples/storage/local-path-provisioner/local-path-storage.yaml
   ```

   > [!NOTE]
   > **Local-Path-Provisioner** and **Busybox** images are not maintained by Microsoft and are pulled from the Rancher Labs repository. Local-Path-Provisioner and BusyBox are only available as a Linux container image.

   If everything is correctly configured, you should see the following output:

   ```output
   NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
   local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  21h
   ```

   If you have multiple disks and want to redirect the path, use:

   ```bash
   kubectl edit configmap -n kube-system local-path-config
   ```

1. Run the following command to determine if you set `fs.inotify.max_user_instances` to 1024:

   ```bash
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command "sysctl fs.inotify.max_user_instances
   ```

   After you run this command, if it outputs less than 1024, run the following command to increase the maximum number of files:

   ```bash
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command "echo 'fs.inotify.max_user_instances = 1024' | sudo tee -a /etc/sysctl.conf && sudo sysctl -p"
   ```

1. Install Open Service Mesh (OSM) using the following command:

   ```bash
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   ```

1. Disable **ACStor** by creating a file named **config.json** with the following contents:

   ```json
   {
     "acstorController.enabled": false,
     "feature.diskStorageClass": "local-path"
   }
   ```

::: zone-end

::: zone pivot="ubuntu"
## Prepare Linux with Ubuntu

This section describes how to prepare Linux with Ubuntu if you run a single-node or 2-node cluster.

1. Install Open Service Mesh (OSM) using the following command:

   ```bash
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   ```

1. Run the following command to determine if you set `fs.inotify.max_user_instances` to 1024:

   ```bash
   sysctl fs.inotify.max_user_instances
   ```

   After you run this command, if it outputs less than 1024, run the following command to increase the maximum number of files and reload the **sysctl** settings:

   ```bash
   echo 'fs.inotify.max_user_instances = 1024' | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

1. Disable **ACStor** by creating a file named **config.json** with the following contents:

   ```json
   {
     "acstorController.enabled": false,
     "feature.diskStorageClass": "local-path"
   }
   ```

::: zone-end

## Next steps

[Install Edge Storage Accelerator](install-edge-storage-accelerator.md)
