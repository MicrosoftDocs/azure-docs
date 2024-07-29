---
title: Install Edge Storage Accelerator (preview)
description: Learn how to install Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 03/12/2024

---

# Install Edge Storage Accelerator (preview)

This article describes the steps to install Edge Storage Accelerator.

## Optional: increase cache disk size

Currently, the cache disk size defaults to 8 GiB. If you're satisfied with the cache disk size, move to the next section, [Install the Edge Storage Accelerator Arc Extension](#install-edge-storage-accelerator-arc-extension).  

If you use Edge Essentials, require a larger cache disk size, and already created a **config.json** file, append the key and value pair (`"cachedStorageSize": "20Gi"`) to your existing **config.json**. Don't erase the previous contents of **config.json**.

If you require a larger cache disk size, create **config.json** with the following contents:

```json
{
  "cachedStorageSize": "20Gi"
}
```

## Install Edge Storage Accelerator Arc extension

Install the Edge Storage Accelerator Arc extension using the following command:

> [!NOTE]
> If you created a **config.json** file from the previous steps in [Prepare Linux](prepare-linux.md), append `--config-file "config.json"` to the following `az k8s-extension create` command. Any values set at installation time persist throughout the installation lifetime (inclusive of manual and auto-upgrades).

```bash
az k8s-extension create --resource-group "${YOUR-RESOURCE-GROUP}" --cluster-name "${YOUR-CLUSTER-NAME}" --cluster-type connectedClusters --name hydraext --extension-type microsoft.edgestorageaccelerator
```

## Next steps

Once you complete these prerequisites, you can begin to [create a Persistent Volume (PV) with Storage Key Authentication](create-pv.md).
