---
title: Azure Linux Container Host for AKS tutorial - Create a cluster
description: In this Azure Linux Container Host for AKS tutorial, you will learn how to create an AKS cluster with Azure Linux.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: tutorial
ms.date: 04/18/2023
---

# Tutorial: Create a cluster with the Azure Linux Container Host for AKS

To create a cluster with the Azure Linux Container Host, you will use:
1. Azure resource groups, a logical container into which Azure resources are deployed and managed.
1. [Azure Kubernetes Service (AKS)](../../articles/aks/intro-kubernetes.md), a hosted Kubernetes service that allows you to quickly create a production ready Kubernetes cluster.

In this tutorial, part one of five, you will learn how to:

> [!div class="checklist"]
> * Install the Kubernetes CLI, `kubectl`.
> * Create an Azure resource group.
> * Create and deploy an Azure Linux Container Host cluster.
> * Configure `kubectl` to connect to your Azure Linux Container Host cluster.

In later tutorials, you'll learn how to add an Azure Linux node pool to an existing cluster and migrate existing nodes to Azure Linux.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- You need the latest version of Azure CLI. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## 1 - Install the Kubernetes CLI

Use the Kubernetes CLI, kubectl, to connect to the Kubernetes cluster from your local computer.

If you don't already have kubectl installed, install it through Azure CLI using `az aks install-cli` or follow the [upstream instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).

```azurecli-interactive
az aks install-cli
```

## 2 - Create a resource group

When creating a resource group, it is required to specify a location. This location is: 
- The storage location of your resource group metadata.
- Where your resources will run in Azure if you don't specify another region when creating a resource.

Create a resource group with the `az group create` command. To create a resource group named *testAzureLinuxResourceGroup* in the *eastus* region, follow this step:

```azurecli-interactive
az group create --name testAzureLinuxResourceGroup --location eastus
```
> [!NOTE]
> The above example uses *eastus*, but Azure Linux Container Host clusters are available in all regions.

## 3 - Create an Azure Linux Container Host cluster

Create an AKS cluster using the `az aks create` command with the `--os-sku` parameter to provision the Azure Linux Container Host with an Azure Linux image. The following example creates an Azure Linux Container Host cluster named *testAzureLinuxCluster* using the *testAzureLinuxResourceGroup* resource group created in the previous step: 

```azurecli-interactive
az aks create --name testAzureLinuxCluster --resource-group testAzureLinuxResourceGroup --os-sku AzureLinux
```
After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## 4 - Connect to the cluster using kubectl

To configure `kubectl` to connect to your Kubernetes cluster, use the `az aks get-credentials` command. The following example gets credentials for the Azure Linux Container Host cluster named *testAzureLinuxCluster* in the *testAzureLinuxResourceGroup* resource group:

```azurecli
az aks get-credentials --resource-group testAzureLinuxResourceGroup --name testAzureLinuxCluster
```

To verify the connection to your cluster, run the [kubectl get nodes](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to return a list of the cluster nodes:

```azurecli-interactive
kubectl get nodes
```

## Next steps

In this tutorial, you created and deployed an Azure Linux Container Host cluster. You learned how to: 

> [!div class="checklist"]
> * Install the Kubernetes CLI, `kubectl`.
> * Create an Azure resource group.
> * Create and deploy an Azure Linux Container Host cluster.
> * Configure `kubectl` to connect to your Azure Linux Container Host cluster.

In the next tutorial, you'll learn how to add an Azure Linux node pool to an existing cluster.

> [!div class="nextstepaction"]
> [Add an Azure Linux node pool](./tutorial-azure-linux-add-nodepool.md)