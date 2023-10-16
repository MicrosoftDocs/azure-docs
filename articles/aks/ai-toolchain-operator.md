---
title: Simplify OSS AI model management on Azure Kubernetes Service (AKS) with the AI toolchain operator
description: Learn how to enable the AI toolchain operator add-on on Azure Kubernetes Service (AKS) to simplify OSS AI model management.
ms.topic: article
ms.custom: azure-kubernetes-service
ms.date: 10/16/2023
---

# Simplify OSS AI model management on Azure Kubernetes Service (AKS) with the AI toolchain operator

The AI toolchain operator is a managed add-on for AKS that simplifies the experience of running OSS AI models on your AKS clusters. The AI toolchain operator automatically provisions the necessary GPU nodes and sets up the associated inference server as an endpoint server to your application. Using this add-on reduces your onboarding time and enables you to focus on your AI model development and deployment rather than the infrastructure setup.

This article shows you how to enable the AI toolchain operator add-on on your AKS clusters.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Azure CLI version 2.0.73 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* Helm v3 installed. For more information, see [Installing Helm](https://helm.sh/docs/intro/install/).

## Enable the AI toolchain operator add-on on an AKS cluster

### Create an AKS cluster with the AI toolchain operator add-on enabled

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myKaitoResourceGroup --location eastus
    ```

2. Create an AKS cluster with the AI toolchain operator add-on enabled using the [`az aks create`][az-aks-create] command with the `--enable-ai-toolchain-operator` flag.

    ```azurecli-interactive
    az aks create --resource-group myKaitoResourceGroup --name myKaitoClutser --generate-ssh-keys --enable-ai-toolchain-operator
    ```

### Enable the AI toolchain operator add-on on an existing AKS cluster

* Enable the AI toolchain operator add-on on an existing AKS cluster using the [`az aks enable-addons`][az-aks-enable-addons] command with the `--addons ai-toolchain-operator` flag.

    ```azurecli-interactive
    az aks enable-addons --resource-group myKaitoResourceGroup --name myKaitoCluster --addons ai-toolchain-operator
    ```

## Connect to your cluster

1. Install `kubectl` locally using the [`az aks install-cli`][az-aks-install-cli] command.

    ```azurecli-interactive
    az aks install-cli
    ```

2. Configure `kubectl` to connect to your cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myKaitoResourceGroup --name myKaitoCluster
    ```

3. Verify the connection to your cluster using the `kubectl get` command.

    ```azurecli-interactive
    kubectl get nodes
    ```

## Run the AI toolchain operator workspace example

1. Clone the AI toolchain operator repository using the `git clone` command.

    ```azurecli-interactive
    git clone https://github.com/Azure/kdm/tree/main
    ```

2. Run the AI toolchain operator workspace example using the `kubectl apply` command.

    ```azurecli-interactive
    kubectl apply -f examples/kaito_workspace_llama2_7b-chat.yaml
    ```

3. Watch the AI toolchain operator workspace CR status using the `kubectl describe workspace` command.

    ```azurecli-interactive
    kubectl describe workspace workspace-llama2-7b-chat
    ```

