---
title: Prepare Linux for Edge Volumes (preview)
description: Learn how to prepare Linux in Azure Container Storage enabled by Azure Arc Edge Volumes using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content, references_regions
ms.date: 08/26/2024

---

# Prepare Linux for Edge Volumes (preview)

The article describes how to prepare Linux for Edge Volumes using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.

> [!NOTE]
> The minimum supported Linux kernel version is 5.1. At this time, there are known issues with 6.4 and 6.2.

## Prerequisites

> [!NOTE]
> Azure Container Storage enabled by Azure Arc is only available in the following regions: East US, East US 2, West US, West US 2, West US 3, North Europe, West Europe.

### Uninstall previous instance of Azure Container Storage enabled by Azure Arc extension

If you previously installed Azure Container Storage enabled by Azure Arc, you must uninstall the previous instance.

1. Before you delete the extension, delete your configPod, Persistent Volume Claim (PVC), and Persistent Volume (PV) using the following commands. You must maintain the order of these delete commands. Replace `YOUR_POD_FILE_NAME_HERE`, `YOUR_PVC_FILE_NAME_HERE`, and `YOUR_PV_FILE_NAME_HERE` with your respective file names:

   ```bash
   kubectl delete -f "YOUR_POD_FILE_NAME_HERE.yaml"
   kubectl delete -f "YOUR_PVC_FILE_NAME_HERE.yaml"
   kubectl delete -f "YOUR_PV_FILE_NAME_HERE.yaml"
   ```

2. After you delete your configPod, PVC, and PV from the previous step, uninstall the extension using the following command. Replace `YOUR_RESOURCE_GROUP_NAME_HERE`, `YOUR_CLUSTER_NAME_HERE`, and `YOUR_EXTENSION_NAME_HERE` with your respective information:

   ```azurecli
   az k8s-extension delete --resource-group YOUR_RESOURCE_GROUP_NAME_HERE --cluster-name YOUR_CLUSTER_NAME_HERE --cluster-type connectedClusters --name YOUR_EXTENSION_NAME_HERE
   ```

3. If you installed the extension prior to the 1.1.0-preview release (released on 4/19/24) and have a preexisting `config.json` file, be aware that the `config.json` schema changed. Remove the old `config.json` file using `rm config.json`. You can find the new values in the instructions for your specific environment (Arc-connected AKS on Azure, Edge Essentials, or Ubuntu).

[!INCLUDE [prepare-linux-content](includes/prepare-linux-content.md)]

## Next steps

- [Prepare Linux using a single-node cluster](single-node-cluster-edge-volumes.md)
- [Prepare Linux using a multi-node cluster](multi-node-cluster-edge-volumes.md)
