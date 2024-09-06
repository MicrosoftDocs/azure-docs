---
title: Prepare Linux for Edge Volumes using a single-node or 2-node cluster (preview)
description: Learn how to prepare Linux for Edge Volumes with a single-node or 2-node cluster in Azure Container Storage enabled by Azure Arc using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
zone_pivot_groups: platform-select
---

# Prepare Linux for Edge Volumes using a single-node or two-node cluster (preview)

This article describes how to prepare Linux using a single-node or two-node cluster, and assumes you [fulfilled the prerequisites](prepare-linux-edge-volumes.md#prerequisites).

::: zone pivot="aks"
## Prepare Linux with AKS enabled by Azure Arc

This section describes how to prepare Linux with AKS enabled by Azure Arc if you run a single-node or two-node cluster.

1. Install Open Service Mesh (OSM) using the following command:

   ```azurecli
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   ```

::: zone-end

::: zone pivot="aks-ee"
[!INCLUDE [single-node-edge-essentials](includes/single-node-edge-essentials.md)]
::: zone-end

::: zone pivot="ubuntu"
[!INCLUDE [single-node-ubuntu](includes/single-node-ubuntu.md)]
::: zone-end

## Next steps

[Install Azure Container Storage enabled by Azure Arc](install-edge-volumes.md)
