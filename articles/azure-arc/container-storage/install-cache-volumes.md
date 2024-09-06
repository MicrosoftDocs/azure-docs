---
title: Install Cache Volumes (preview)
description: Learn how to install the Cache Volumes offering from Azure Container Storage enabled by Azure Arc.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 08/26/2024

---

# Install Azure Container Storage enabled by Azure Arc Cache Volumes (preview)

This article describes the steps to install the Azure Container Storage enabled by Azure Arc extension.

## Optional: increase cache disk size

Currently, the cache disk size defaults to 8 GB. If you're satisfied with the cache disk size, see the next section, [Install the Azure Container Storage enabled by Azure Arc extension](#install-the-azure-container-storage-enabled-by-azure-arc-extension).  

If you use Edge Essentials, require a larger cache disk size, and already created a **config.json** file, append the key and value pair (`"cachedStorageSize": "20Gi"`) to your existing **config.json**. Don't erase the previous contents of **config.json**.

If you require a larger cache disk size, create **config.json** with the following contents:

```json
{
  "cachedStorageSize": "20Gi"
}
```

## Prepare the `azure-arc-containerstorage` namespace

In this step, you prepare a namespace in Kubernetes for `azure-arc-containerstoragee` and add it to your Open Service Mesh (OSM) configuration for link security. If you want to use a namespace other than `azure-arc-containerstorage`, substitute it in the `export extension_namespace`:

```bash
export extension_namespace=azure-arc-containerstorage
kubectl create namespace "${extension_namespace}"
kubectl label namespace "${extension_namespace}" openservicemesh.io/monitored-by=osm
kubectl annotate namespace "${extension_namespace}" openservicemesh.io/sidecar-injection=enabled
# Disable OSM permissive mode.
kubectl patch meshconfig osm-mesh-config \
  -n "arc-osm-system" \
  -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":'"false"'}}}'  \
  --type=merge
```

## Install the Azure Container Storage enabled by Azure Arc extension

Install the Azure Container Storage enabled by Azure Arc extension using the following command:

> [!NOTE]
> If you created a **config.json** file from the previous steps in [Prepare Linux](prepare-linux.md), append `--config-file "config.json"` to the following `az k8s-extension create` command. Any values set at installation time persist throughout the installation lifetime (including manual and auto-upgrades).

```bash
az k8s-extension create --resource-group "${YOUR-RESOURCE-GROUP}" --cluster-name "${YOUR-CLUSTER-NAME}" --cluster-type connectedClusters --name hydraext --extension-type microsoft.arc.containerstorage
```

## Next steps

Once you complete these prerequisites, you can begin to [create a Persistent Volume (PV) with Storage Key Authentication](create-persistent-volume.md).
