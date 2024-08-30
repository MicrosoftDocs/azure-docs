---
title: Prepare Linux for Cache Volumes using a multi-node cluster (preview)
description: Learn how to prepare Linux for Cache Volumes with a multi-node cluster using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
zone_pivot_groups: platform-select
---

# Prepare Linux using a multi-node cluster (preview)

This article describes how to prepare Linux using a multi-node cluster, and assumes you [fulfilled the prerequisites](prepare-linux.md#prerequisites).

::: zone pivot="aks"
## Prepare Linux with AKS enabled by Azure Arc

Install and configure Open Service Mesh (OSM) using the following commands:

```azurecli
az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
kubectl patch meshconfig osm-mesh-config -n "arc-osm-system" -p '{"spec":{"featureFlags":{"enableWASMStats": false }, "traffic":{"outboundPortExclusionList":[443,2379,2380], "inboundPortExclusionList":[443,2379,2380]}}}' --type=merge
```

::: zone-end

::: zone pivot="aks-ee"
[!INCLUDE [multi-node](includes/multi-node-edge-essentials.md)]

5. Create a file named **config.json** with the following contents:

   ```json
   {
       "acstor.capacityProvisioner.tempDiskMountPoint": /var
   }
   ```

   > [!NOTE]
   > The location/path of this file is referenced later, when you install the Cache Volumes Arc extension.

::: zone-end

::: zone pivot="ubuntu"
## Prepare Linux with Ubuntu

This section describes how to prepare Linux with Ubuntu if you run a multi-node cluster.

1. Install and configure Open Service Mesh (OSM) using the following command:

   ```azurecli
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   kubectl patch meshconfig osm-mesh-config -n "arc-osm-system" -p '{"spec":{"featureFlags":{"enableWASMStats": false }, "traffic":{"outboundPortExclusionList":[443,2379,2380], "inboundPortExclusionList":[443,2379,2380]}}}' --type=merge
   ```

[!INCLUDE [multi-node-ubuntu](includes/multi-node-ubuntu.md)]

::: zone-end

## Next steps

[Install Azure Container Storage enabled by Azure Arc](install-cache-volumes.md)
