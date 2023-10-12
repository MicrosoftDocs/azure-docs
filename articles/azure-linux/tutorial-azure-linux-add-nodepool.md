---
title: Azure Linux Container Host for AKS tutorial - Add an Azure Linux node pool to your existing AKS cluster
description: In this Azure Linux Container Host for AKS tutorial, you learn how to add an Azure Linux node pool to your existing cluster.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: tutorial
ms.date: 06/06/2023
---

# Tutorial: Add an Azure Linux node pool to your existing AKS cluster

In AKS, nodes with the same configurations are grouped together into node pools. Each pool contains the VMs that run your applications. In the previous tutorial, you created an Azure Linux Container Host cluster with a single node pool. To meet the varying compute or storage requirements of your applications, you can create additional user node pools.

In this tutorial, part two of five, you learn how to:

> [!div class="checklist"]
>
> * Add an Azure Linux node pool.
> * Check the status of your node pools.

In later tutorials, you learn how to migrate nodes to Azure Linux and enable telemetry to monitor your clusters.

## Prerequisites

* In the previous tutorial, you created and deployed an Azure Linux Container Host cluster. If you haven't done these steps and would like to follow along, start with [Tutorial 1: Create a cluster with the Azure Linux Container Host for AKS](./tutorial-azure-linux-create-cluster.md).
* You need the latest version of Azure CLI. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## 1 - Add an Azure Linux node pool

To add an Azure Linux node pool into your existing cluster, use the `az aks nodepool add` command and specify `--os-sku AzureLinux`. The following example creates a node pool named *ALnodepool* that runs three nodes in the *testAzureLinuxCluster* cluster in the *testAzureLinuxResourceGroup* resource group:

```azurecli-interactive
az aks nodepool add \
    --resource-group testAzureLinuxResourceGroup \
    --cluster-name testAzureLinuxCluster \
    --name ALnodepool \
    --node-count 3 \
    --os-sku AzureLinux
```

> [!NOTE]
> The name of a node pool must start with a lowercase letter and can only contain alphanumeric characters. For Linux node pools the length must be between one and 12 characters.

## 2 - Check the node pool status

To see the status of your node pools, use the `az aks node pool list` command and specify your resource group and cluster name.

```azurecli-interactive
az aks nodepool list --resource-group testAzureLinuxResourceGroup --cluster-name testAzureLinuxCluster
```

## Next steps

In this tutorial, you added an Azure Linux node pool to your existing cluster. You learned how to:

> [!div class="checklist"]
>
> * Add an Azure Linux node pool.
> * Check the status of your node pools.

In the next tutorial, you learn how to migrate existing nodes to Azure Linux.

> [!div class="nextstepaction"]
> [Migrating to Azure Linux](./tutorial-azure-linux-migration.md)
