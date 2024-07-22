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

## Attatch an Azure Container Registry (ACR) to an Azure Kubernetes Service (AKS) cluster

To use the command pallete to attatch your Azure Container Registry, press "crtl + shift + p" on your keyboard to open the command pallete. Then type "AKS: Attatch ACR". Once the screen pops up, the following information must be filled out.

To use the Kubernetes view, right click on your cluster in the Kubernetes tab, under Clouds -> Azure -> your subscription -> Automated Deployments -> Attatch ACR to Cluster.

Both methods will bring you to a screen where the following information must be filled out.

* **Subscription**: Select the proper subscription that has your resources.
* **ACR Resource Group**: Select the proper resource group for your ACR.
* **Container Registry**: Select the container registry that you want to attatch.
* **Cluster Resource Group**: Select the proper resource group for your cluster.
* **Cluster**: Select the cluster that you wish to attatch the ACR to.

Once all information is filled out, press attatch. Once attatched you should see a green checkmark. Your Azure Container Registry is now attatched to your Azure Kubernetes Service cluster.

For more information, see [AKS extension for Visual Studio Code features](https://code.visualstudio.com/docs/azure/aksextensions#_features).

## Product support/feedback

If you have a question or would like to offer product feedback. Please open an issue on the [AKS extension GitHub repository](https://github.com/Azure/vscode-aks-tools/issues/new/choose).

## Next steps

To learn more about other AKS add-ons and extensions, see [Add-ons, extensions, and other integrations with AKS](./integrations.md).

