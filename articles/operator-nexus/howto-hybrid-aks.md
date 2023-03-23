---
title: "Azure Operator Nexus: Interact with AKS-Hybrid Cluster"
description: Learn how to manage (view, list, update, delete) AKS-Hybrid clusters.
author: dramasamy
ms.author: dramasamy
ms.service: azure 
ms.topic: how-to
ms.date: 02/02/2023
ms.custom: template-how-to
---

# How to manage and lifecycle the AKS-Hybrid cluster

This document shows how to manage an AKS-Hybrid cluster that you use for CNF workloads.

## Before you begin

You need:

1. You should have created an [AKS-Hybrid Cluster](./quickstarts-tenant-workload-deployment.md#section-k-how-to-create-aks-hybrid-cluster-for-deploying-cnf-workloads)
2. <`YourAKS-HybridClusterName`>: the name of your previously created AKS-Hybrid cluster
3. <`YourSubscription`>: your subscription name or ID where the AKS-Hybrid cluster was created
4. <`YourResourceGroupName`>: the name of the Resource group where the AKS-Hybrid cluster was created
5. <`tags`>: space-separated key=value tags: key[=value] [key[=value] ...]. Use '' to clear existing tags
6. You should install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

## List command

To get a list of AKS_Hybrid clusters in your Resource group:

```azurecli
    az hybridaks list -o table \
      --resource-group "<YourResourceGroupName>" \
      --subscription "<YourSubscription>"
```

## Show command

To see the properties of AKS-Hybrid cluster named `YourAKS-HybridClustername`:

```azurecli
  az hybridaks show --name "<YourAKS-HybridClusterName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>"
```

## Update command

To update the properties of your AKS-Hybrid cluster:

```azurecli
    az hybridaks update --name "<YourAKS-HybridClustername>" \
      --resource-group "<YourResourceGroupName>" \
      --subscription "<YourSubscription>" \
      --tags "<YourAKS-HybridClusterTags>"
```

## Delete command

To delete the AKS-Hybrid cluster named `YourAKS-HybridClustername`:

```azurecli
    az hybridaks delete --name "<YourAKS-HybridClustername>" \
      --resource-group "<YourResourceGroupName >" \
      --subscription "<YourSubscription>"
```

## Add node pool command

To add a node pool to the AKS-Hybrid cluster named `YourAKS-HybridClustername`:
```azurecli
    az hybridaks nodepool add \
      --name <name of the nodepool> \
      --cluster-name "<YourAKS-HybridClustername>" \
      --resource-group "<YourResourceGroupName>" \
      --location <dc-location> \
      --node-count <worker node count> \
      --node-vm-size <Operator Nexus SKU> \
      --zones <comma separated list of availability zones>
```

## Delete node pool command

To delete a node pool from the AKS-Hybrid cluster named `YourAKS-HybridClustername`:

```azurecli
    az hybridaks nodepool delete \
      --name <name of the nodepool> \
      --cluster-name "<YourAKS-HybridClustername>" \
      --resource-group "<YourResourceGroupName>"
```
