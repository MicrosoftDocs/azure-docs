---
title: "Azure Operator Nexus: How to check runtime version for Azure Operator Nexus"
description: Learn to check the runtime version of the key components in Azure Operator Nexus.
author: tonyyam23
ms.author: tonyyam
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 12/03/2024
#ms.custom: template-include
---

# How to check current runtime version for Azure Operator Nexus
This how-to guide explains the steps to determine the runtime version of the key components in Azure Operator Nexus.

## Prerequisites

* The [Install Azure CLI](/cli/azure/install-azure-cli) must be installed.
* The `networkcloud` CLI extension is required. If the `networkcloud` extension isn't installed, it can be installed following the steps listed [here](./howto-install-cli-extensions.md)
* Access to the Azure portal for the target cluster to be upgraded.
* You must be logged in to the same subscription as your target cluster via `az login`

## Check current Cluster runtime version

### Via Azure portal

To check current cluster runtime version, navigate to the cluster in the Azure portal. In the cluster's overview pane, navigate to the ***Properties*** tab and look for "Cluster version"

:::image type="content" source="media\cluster-runtime-version-screenshot.png" alt-text="Screenshot of cluster runtime version." lightbox="media\cluster-runtime-version-screenshot.png":::

### Via Azure CLI

Current Runtime cluster version is retrievable via the Azure CLI:

```azurecli
az networkcloud cluster show --name "clusterName" --resource-group "cls_resourceGroup" --query "{name:name, version:clusterVersion}" -o json
{
  "name": "sample_clsName",
  "version": "3.14.1"
}
```

## Check current Fabric runtime version

### Via Azure portal
To check current fabric runtime version, navigate to the fabric in the Azure portal. In the fabric's overview pane, navigate to the ***Properties*** tab and look for "Fabric version"

:::image type="content" source="media\fabric-runtime-version-screenshot.png" alt-text="Screenshot of fabric runtime version." lightbox="media\fabric-runtime-version-screenshot.png":::

### Via Azure CLI
Current Runtime fabric version is retrievable via the Azure CLI:
```azurecli
az networkfabric fabric show --resource-name "fabricName" --resource-group "fab_resourceGroup" --query "{name:name, version:fabricVersion}" -o json
{
  "name": "Sample_fabName",
  "version": "3.0.0"
}
```

