---
title: Resize persistent volumes in Azure Container Storage
description: Resize persistent volumes in Azure Container Storage without downtime. Scale up by expanding volumes backed by Elastic SAN and local NVMe.
author: saurabh0501
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 01/28/2026
ms.author: saurabsharma
# Customer intent: "As a cloud engineer, I want to resize persistent volumes in Azure Container Storage without downtime so that I can ensure my applications have the necessary storage resources as demand increases."
---

# Resize persistent volumes in Azure Container Storage without downtime

You can expand persistent volumes in Azure Container Storage without downtime. Shrinking persistent volumes isn't supported.

You can't increase a volume beyond the maximum capacity available in your Elastic SAN or the local NVMe storage available on your nodes. If you need more capacity, first [increase your Elastic SAN capacity](../elastic-san/elastic-san-expand.md) or [increase your ephemeral disk (local NVMe) capacity](use-container-storage-with-local-disk.md#manage-storage) by adding more nodes to your Azure Kubernetes Service (AKS) cluster. Then expand the volume size.

## Prerequisites

- This article requires the latest version of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you use Azure Cloud Shell, the latest version is already installed. If you run commands locally, use an account with administrative privileges.
- This article assumes you installed Azure Container Storage version 2.x.x on your AKS cluster and created a persistent volume claim (PVC) using [Elastic SAN](use-container-storage-with-elastic-san.md) or [ephemeral disk (local NVMe)](use-container-storage-with-local-disk.md).

## Expand a volume

Follow these instructions to resize a persistent volume. A built-in StorageClass supports volume expansion, so reference a PVC created by an Azure Container Storage StorageClass. For example, if you created the PVC for Elastic SAN, it might be named `elasticsanpvc`.

1. Expand the PVC by increasing the `spec.resources.requests.storage` field. Replace `<pvc-name>` with the name of your PVC and `<size-in-Gi>` with the new size, for example `100Gi`.

   ```azurecli-interactive
   kubectl patch pvc <pvc-name> --type merge --patch '{"spec": {"resources": {"requests": {"storage": "<size-in-Gi>"}}}}'
   ```

1. Check the PVC to confirm the new size.

   ```azurecli-interactive
   kubectl describe pvc <pvc-name>
   ```

## See also

- [What is Azure Container Storage (version 1.x.x)?](container-storage-introduction-version-1.md)
