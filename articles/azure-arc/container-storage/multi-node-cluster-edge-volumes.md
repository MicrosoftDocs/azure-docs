---
title: Prepare Linux for Edge Volumes using a multi-node cluster (preview)
description: Learn how to prepare Linux for Edge Volumes with a multi-node cluster using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
zone_pivot_groups: platform-select
---

# Prepare Linux for Edge Volumes using a multi-node cluster (preview)

This article describes how to prepare Linux using a multi-node cluster, and assumes you [fulfilled the prerequisites](prepare-linux.md#prerequisites).

::: zone pivot="aks"
## Prepare Linux with AKS enabled by Azure Arc

Install and configure Open Service Mesh (OSM) using the following commands:

```azurecli
az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
```

::: zone-end

::: zone pivot="aks-ee"
[!INCLUDE [multi-node](includes/multi-node-edge-essentials.md)]

::: zone-end

::: zone pivot="ubuntu"
## Prepare Linux with Ubuntu

This section describes how to prepare Linux with Ubuntu if you run a multi-node cluster.

First, install and configure Open Service Mesh (OSM) using the following command:

```azurecli
az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
```

[!INCLUDE [multi-node-ubuntu](includes/multi-node-ubuntu.md)]
::: zone-end

## Next steps

[Install Extension](install-edge-volumes.md)
