---
title: Install Edge Storage Accelerator
description: Learn how to install Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 02/06/2024

---

# Install Edge Storage Accelerator

This article describes the steps to install Edge Storage Accelerator.

## Optional: increase cache disk size

Currently, the cache disk size defaults to 8 GiB. If you're satisfied with the cache disk size, move to the next section, [Install the Edge Storage Accelerator Arc Extension](#install-edge-storage-accelerator-arc-extension).  

If you use Edge Essentials, require a larger cache disk size, and already created a **config.json** file, append the key and value pair (`"hydra.cachedStorageSize": "20Gi"`) to your existing **config.json**. Don't erase the previous contents of **config.json**.

If you require a larger cache disk size, create **config.json** with the following contents:

```json
{
  "hydra.cachedStorageSize": "20Gi"
}
```

## Install Edge Storage Accelerator Arc extension

Install the Edge Storage Accelerator Arc extension using the following command:

```bash
az k8s-extension create --resource-group "${YOUR-RESOURCE-GROUP}" --cluster-name "${YOUR-CLUSTER-NAME}" --cluster-type connectedClusters --name hydraext --extension-type microsoft.edgestorageaccelerator
```

> [!NOTE]
> If you created a `config.json` to increase your cache disk size and/or for Edge Essentials, append `--config-file "config.json"` to the previous `az k8s-extension create` command.

## Next steps

Once you complete these prerequisites, you can begin to [create a Persistent Volume (PV) with Storage Key Authentication or Workload Identity](create-pv.md).
