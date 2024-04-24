---
title: Prepare Linux using a multi-node cluster (preview)
description: Learn how to prepare Linux with a multi-node cluster in Edge Storage Accelerator using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024
zone_pivot_groups: platform-select

---

# Prepare Linux using a multi-node cluster (preview)

This article describes how to prepare Linux using a multi-node cluster, and assumes you [fulfilled the prerequisites](prepare-linux.md#prerequisites).

::: zone pivot="aks"
## Prepare Linux with AKS enabled by Azure Arc

Install and configure Open Service Mesh (OSM) using the following commands:

```bash
az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
kubectl patch meshconfig osm-mesh-config -n "arc-osm-system" -p '{"spec":{"featureFlags":{"enableWASMStats": false }, "traffic":{"outboundPortExclusionList":[443,2379,2380], "inboundPortExclusionList":[443,2379,2380]}}}' --type=merge
```

::: zone-end

::: zone pivot="aks-ee"
## Prepare Linux with AKS Edge Essentials

This section describes how to prepare Linux with AKS Edge Essentials if you run a multi-node cluster.

1. On each node in your cluster, set the number of **HugePages** to 512 using the following command:

   ```bash
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'echo 512 | sudo tee /sys/devices/system/node/node0/hugepages/hugepages-2048kB/nr_hugepages'
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'echo "vm.nr_hugepages=512" | sudo tee /etc/sysctl.d/99-hugepages.conf'
   ```

1. On each node in your cluster, install the specific kernel using:

   ```bash
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'sudo apt install linux-modules-extra-`uname -r`'
   ```

   > [!NOTE]
   > The minimum supported version is 5.1. At this time, there are known issues with 6.4 and 6.2.

1. On each node in your cluster, increase the maximum number of files using the following command:

   ```bash
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'echo -e "LimitNOFILE=1048576" | sudo tee -a /etc/systemd/system/containerd.service.d/override.conf'
   ```

1. Install and configure Open Service Mesh (OSM) using the following commands:

   ```bash
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   kubectl patch meshconfig osm-mesh-config -n "arc-osm-system" -p '{"spec":{"featureFlags":{"enableWASMStats": false }, "traffic":{"outboundPortExclusionList":[443,2379,2380], "inboundPortExclusionList":[443,2379,2380]}}}' --type=merge
   ```

1. Create a file named **config.json** with the following contents:

   ```json
   {
       "acstor.capacityProvisioner.tempDiskMountPoint": /var
   }
   ```

   > [!NOTE]
   > The location/path of this file is referenced later, when installing the Edge Storage Accelerator Arc extension.

::: zone-end

::: zone pivot="ubuntu"
## Prepare Linux with Ubuntu

This section describes how to prepare Linux with Ubuntu if you run a multi-node cluster.

1. Install and configure Open Service Mesh (OSM) using the following command:

   ```bash
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   kubectl patch meshconfig osm-mesh-config -n "arc-osm-system" -p '{"spec":{"featureFlags":{"enableWASMStats": false }, "traffic":{"outboundPortExclusionList":[443,2379,2380], "inboundPortExclusionList":[443,2379,2380]}}}' --type=merge
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

1. Install the specific kernel using:

   ```bash
   sudo apt install linux-modules-extra-`uname -r`
   ```

   > [!NOTE]
   > The minimum supported version is 5.1. At this time, there are known issues with 6.4 and 6.2.

1. On each node in your cluster, set the number of **HugePages** to 512 using the following command:

   ```bash
   HUGEPAGES_NR=512
   echo $HUGEPAGES_NR | sudo tee /sys/devices/system/node/node0/hugepages/hugepages-2048kB/nr_hugepages
   echo "vm.nr_hugepages=$HUGEPAGES_NR" | sudo tee /etc/sysctl.d/99-hugepages.conf
   ```

::: zone-end

## Next steps

[Install Edge Storage Accelerator](install-edge-storage-accelerator.md)
