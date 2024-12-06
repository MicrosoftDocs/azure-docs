---
title: "Azure Operator Nexus: How to check runtime version for Azure Operator Nexus"
description: Learn to check the runtime version of the key components in Azure Operator Nexus
author: Tony Yam
ms.author: tonyyam
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 12/03/2024
# ms.custom: template-include
---

# How to check runtime version for Azure Operator Nexus
This how-to guide explains the steps to determine the runtime version of the key components in Azure Operator Nexus.

## Prerequisites

1. The [Install Azure CLI][installation-instruction] must be installed.
2. The `networkcloud` CLI extension is required. If the `networkcloud` extension isn't installed, it can be installed following the steps listed [here](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-install-cli-extensions).
3. Access to the Azure portal for the target cluster to be upgraded.
4. You must be logged in to the same subscription as your target cluster via `az login`

## Check Cluster runtime version

### Via Portal

To check cluster runtime version, navigate to the cluster in the Azure portal. In the cluster's overview pane, navigate to the ***Properties*** tab and look for "Cluster version"

:::image type="content" source="media\cluster-runtime-version-screenshot.png" alt-text="Screenshot of cluster runtime version" lightbox="media\cluster-runtime-version-screenshot.png":::

### Via Azure CLI

Runtime cluster version is retrievable via the Azure CLI:

```azurecli
az networkcloud cluster show --name "clusterName" --resource-group "cls_resourceGroup" --query "{name:name, version:clusterVersion}" -o json
{
  "name": "sample_clsName",
  "version": "3.14.1"
}
```

## Check Fabric runtime version

### Via Portal
To check fabric runtime version, navigate to the fabric in the Azure portal. In the fabric's overview pane, navigate to the ***Properties*** tab and look for "Fabric version"

:::image type="content" source="media\fabric-runtime-version-screenshot.png" alt-text="Screenshot of fabric runtime version" lightbox="media\fabric-runtime-version-screenshot.png":::

### Via Azure CLI
```azurecli
az networkfabric fabric show --resource-name "fabricName" --resource-group "fab_resourceGroup" --query "{name:name, version:fabricVersion}" -o json
{
  "name": "Sample_fabName",
  "version": "3.0.0"
}
```

