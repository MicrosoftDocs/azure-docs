---
title: Prepare Linux for Edge Volumes (preview)
description: Learn how to prepare Linux in Azure Container Storage enabled by Azure Arc Edge Volumes using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content, references_regions
ms.date: 08/30/2024

---

# Prepare Linux for Edge Volumes (preview)

The article describes how to prepare Linux for Edge Volumes using AKS enabled by Azure Arc, Edge Essentials, or Ubuntu.

> [!NOTE]
> The minimum supported Linux kernel version is 5.1. At this time, there are known issues with 6.4 and 6.2.

## Prerequisites

> [!NOTE]
> Azure Container Storage enabled by Azure Arc is only available in the following regions: East US, East US 2, West US, West US 2, West US 3, North Europe, West Europe.

### Uninstall previous instance of Azure Container Storage enabled by Azure Arc extension

If you previously installed a version of Azure Container Storage enabled by Azure Arc earlier than **2.1.0-preview**, you must uninstall that previous instance in order to install the newer version. If you installed the **1.2.0-preview** release or earlier, [use these instructions](release-notes.md#if-i-installed-the-120-preview-or-any-earlier-release-how-do-i-uninstall-the-extension). Versions after **2.1.0-preview** are upgradeable and do not require this uninstall.

1. In order to delete the old version of the extension, the Kubernetes resources holding references to old version of the extension must be cleaned up. Any pending resources can delay the clean-up of the extension. There are at least two ways to clean up these resources: either using `kubectl delete <resource_type> <resource_name>`, or by "unapplying" the YAML files used to create the resources. The resources that need to be deleted are typically the pods, the PVC referenced, and the subvolume CRD (if Cloud Ingest Edge Volume was configured). Alternatively, the following four YAML files can be passed to `kubectl delete -f` using the following commands in the specified order. These variables must be updated with your information:

   - `YOUR_DEPLOYMENT_FILE_NAME_HERE`: Add your deployment file names. In the example in this article, the file name used was `deploymentExample.yaml`. If you created multiple deployments, each one must be deleted on a separate line.
   - `YOUR_PVC_FILE_NAME_HERE`: Add your Persistent Volume Claim file names. In the example in this article, if you used the Cloud Ingest Edge Volume, the file name used was `cloudIngestPVC.yaml`. If you used the Local Shared Edge Volume, the file name used was `localSharedPVC.yaml`. If you created multiple PVCs, each one must be deleted on a separate line.
   - `YOUR_EDGE_SUBVOLUME_FILE_NAME_HERE`: Add your Edge subvolume file names. In the example in this article, the file name used was `edgeSubvolume.yaml`. If you created multiple subvolumes, each one must be deleted on a separate line.
   - `YOUR_EDGE_STORAGE_CONFIGURATION_FILE_NAME_HERE`: Add your Edge storage configuration file name here. In the example in this article, the file name used was `edgeConfig.yaml`.

   ```bash
   kubectl delete -f "<YOUR_DEPLOYMENT_FILE_NAME_HERE.yaml>"
   kubectl delete -f "<YOUR_PVC_FILE_NAME_HERE.yaml>"   
   kubectl delete -f "<YOUR_EDGE_SUBVOLUME_FILE_NAME_HERE.yaml>"
   kubectl delete -f "<YOUR_EDGE_STORAGE_CONFIGURATION_FILE_NAME_HERE.yaml>"
   ```

1. After you delete the files for your deployments, PVCs, Edge subvolumes, and Edge storage configuration from the previous step, you can uninstall the extension using the following command. Replace `YOUR_RESOURCE_GROUP_NAME_HERE`, `YOUR_CLUSTER_NAME_HERE`, and `YOUR_EXTENSION_NAME_HERE` with your respective information:

   ```azurecli
   az k8s-extension delete --resource-group YOUR_RESOURCE_GROUP_NAME_HERE --cluster-name YOUR_CLUSTER_NAME_HERE --cluster-type connectedClusters --name YOUR_EXTENSION_NAME_HERE
   ```

[!INCLUDE [prepare-linux-content](includes/prepare-linux-content.md)]

## Next steps

- [Prepare Linux using a single-node cluster](single-node-cluster-edge-volumes.md)
- [Prepare Linux using a multi-node cluster](multi-node-cluster-edge-volumes.md)
