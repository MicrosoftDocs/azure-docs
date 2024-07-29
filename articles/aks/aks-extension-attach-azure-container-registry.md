---
title: Attach to Azure Container Registry (ACR) using the Azure Kubernetes Service (AKS) extension for Visual Studio Code
description: Learn how to attach to Azure Container Registry (ACR) using the Azure Kubernetes Service (AKS) extension for Visual Studio Code.
author: qpetraroia
ms.topic: how-to
ms.date: 07/15/2024
ms.author: qpetraroia
ms.service: azure-kubernetes-service
---

# Attach to Azure Container Registry (ACR) using the Azure Kubernetes Service (AKS) extension for Visual Studio Code

In this article, you learn how to attach to Azure Container Registry (ACR) using the Azure Kubernetes Service (AKS) extension for Visual Studio Code. 

## Prerequisites

Before you begin, make sure you have the following resources:

* An Azure container registry. If you don't have one, create one using the steps in [Quickstart: Create a private container registry][create-acr-cli].
* An AKS cluster. If you don't have one, create one using the steps in [Quickstart: Deploy an AKS cluster][deploy-aks-cli].
* The Azure Kubernetes Service (AKS) extension for Visual Studio Code downloaded. For more information, see [Install the Azure Kubernetes Service (AKS) extension for Visual Studio Code][install-aks-vscode].

## Attach your Azure container registry to your AKS cluster

You can access the screen for attaching your container registry to your AKS cluster using the command palette or the Kubernetes view.

### [Command palette](#tab/command-palette)

1. On your keyboard, press `Ctrl+Shift+P` to open the command palette.
2. Enter the following information:

    * **Subscription**: Select the Azure subscription that holds your resources.
    * **ACR Resource Group**: Select the resource group for your container registry.
    * **Container Registry**: Select the container registry you want to attach to your cluster.
    * **Cluster Resource Group**: Select the resource group for your cluster.
    * **Cluster**: Select the cluster you want to attach to your container registry.

3. Select **Attach**.

    You should see a green checkmark, which means your container registry is attached to your AKS cluster.

### [Kubernetes view](#tab/kubernetes-view)

1. In the Kubernetes tab, under Clouds > Azure > your subscription > Automated Deployments, right click on your cluster and select **Attach ACR to Cluster**.
2. Enter the following information:

    * **Subscription**: Select the Azure subscription that holds your resources.
    * **ACR Resource Group**: Select the resource group for your container registry.
    * **Container Registry**: Select the container registry you want to attach to your cluster.
    * **Cluster Resource Group**: Select the resource group for your cluster.
    * **Cluster**: Select the cluster you want to attach to your container registry.

3. Select **Attach**.

    You should see a green checkmark, which means your container registry is attached to your AKS cluster.

---

For more information, see [AKS extension for Visual Studio Code features][aks-vscode-features].

## Product support and feedback

If you have a question or want to offer product feedback, please open an issue on the [AKS extension GitHub repository][aks-vscode-github].

## Next steps

To learn more about other AKS add-ons and extensions, see [Add-ons, extensions, and other integrations for AKS][aks-addons].

<!---LINKS--->
[create-acr-cli]: ../container-registry/container-registry-get-started-azure-cli.md
[deploy-aks-cli]: ./learn/quick-kubernetes-deploy-cli.md
[install-aks-vscode]: ./aks-extension-vs-code.md#installation
[aks-vscode-features]: https://code.visualstudio.com/docs/azure/aksextensions#_features
[aks-vscode-github]: https://github.com/Azure/vscode-aks-tools/issues/new/choose
[aks-addons]: ./integrations.md

