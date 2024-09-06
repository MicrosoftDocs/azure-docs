---
ms.service: azure-arc
ms.topic: include
ms.date: 08/16/2024
author: sethmanheim
ms.author: sethm
---

## Prepare Linux with AKS Edge Essentials

This section describes how to prepare Linux with AKS Edge Essentials if you run a multi-node cluster.

1. On each node in your cluster, set the number of **HugePages** to 512 using the following command:

   ```powershell
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'echo 512 | sudo tee /sys/devices/system/node/node0/hugepages/hugepages-2048kB/nr_hugepages'
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'echo "vm.nr_hugepages=512" | sudo tee /etc/sysctl.d/99-hugepages.conf'
   ```

1. On each node in your cluster, install the required NVME over TCP module for your kernel using:

   ```powershell
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'sudo apt install linux-modules-extra-`uname -r`'
   ```

   > [!NOTE]
   > The minimum supported version is 5.1. At this time, there are known issues with 6.4 and 6.2.

1. On each node in your cluster, increase the maximum number of files using the following command:

   ```powershell
   Invoke-AksEdgeNodeCommand -NodeType "Linux" -Command 'echo -e "LimitNOFILE=1048576" | sudo tee -a /etc/systemd/system/containerd.service.d/override.conf'
   ```

1. Install and configure Open Service Mesh (OSM) using the following commands:

   ```azurecli
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   kubectl patch meshconfig osm-mesh-config -n "arc-osm-system" -p '{"spec":{"featureFlags":{"enableWASMStats": false }, "traffic":{"outboundPortExclusionList":[443,2379,2380], "inboundPortExclusionList":[443,2379,2380]}}}' --type=merge
   ```
