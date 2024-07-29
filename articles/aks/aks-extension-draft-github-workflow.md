---
title: Create a GitHub Workflow using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code
description: Learn how to create a GitHub Workflow using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.
author: qpetraroia
ms.topic: how-to
ms.date: 07/15/2024
ms.author: qpetraroia
ms.service: azure-kubernetes-service
---

# Create a GitHub Workflow using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code

In this article, you learn how to create a GitHub Workflow using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code. A GitHub Workflow automates various development tasks, such as building, testing, and deploying code, ensuring consistency and efficiency across the development process. It enhances collaboration by integrating seamlessly with version control, enabling continuous integration and continuous deployment (CI/CD) pipelines, and ensuring that all changes are thoroughly vetted before being merged into the main codebase.

## Prerequisites

Before you begin, make sure you have the following resources:

* An active folder with code open in Visual Studio Code.
* Make sure the current workspace is an active `git` repository.
* The Azure Kubernetes Service (AKS) extension for Visual Studio Code downloaded. For more information, see [Install the Azure Kubernetes Service (AKS) extension for Visual Studio Code][install-aks-vscode].

## Create a GitHub Workflow using the Azure Kubernetes Service (AKS) extension

You can access the screen to create a GitHub Workflow using the command palette or the Kubernetes view.

### [Command palette](#tab/command-palette)

1. On your keyboard, press `Ctrl+Shift+P` to open the command palette.
2. Enter the following information:

    * **Workflow name**: Enter a name for your GitHub Workflow.
    * **GitHub repository**: Select the location where want to save your Kubernetes deployment files.
    * **Subscription**: Select your Azure subscription.
    * **Dockerfile**: Select the Dockerfile that you want to build in the GitHub Action.
    * **Build context**: Select a build context.
    * **ACR Resource Group**: Select an ACR resource group.
    * **Container Registry**: Select a container registry.
    * **Azure Container Registry image**: Select or enter an Azure Container Registry image.
    * **Cluster Resource Group**: Select your cluster resource group.
    * **Cluster**: Select your AKS cluster.
    * **Namespace**: Select or enter a namespace in which you will deploy into.
   * **Type**: Select the type of deployment option.

3. Select **Create**.

### [Kubernetes view](#tab/kubernetes-view)
	
1. In the Kubernetes tab, under Clouds > Azure > your subscription > Automated Deployments, right click on your cluster and select **Create a GitHub Workflow**.
2. Enter the following information:

    * **Workflow name**: Enter a name for your GitHub Workflow.
    * **GitHub repository**: Select the location where want to save your Kubernetes deployment files.
    * **Subscription**: Select your Azure subscription.
    * **Dockerfile**: Select the Dockerfile that you want to build in the GitHub Action.
    * **Build context**: Select a build context.
    * **ACR Resource Group**: Select an ACR resource group.
    * **Container Registry**: Select a container registry.
    * **Azure Container Registy image**: Select or enter an Azure Container Registry image.
    * **Cluster Resource Group**: Select your cluster resource group.
    * **Cluster**: Select your AKS cluster.
    * **Namespace**: Select or enter a namespace in which you will deploy into.
   * **Type**: Select the type of deployment option.

3. Select **Create**.

---

For more information, see [AKS extension for Visual Studio Code features][aks-vscode-features].

## Product support and feedback
	
If you have a question or want to offer product feedback, please open an issue on the [AKS extension GitHub repository][aks-vscode-github].
	
## Next steps
	
To learn more about other AKS add-ons and extensions, see [Add-ons, extensions, and other integrations for AKS][aks-addons].
	
<!---LINKS--->
[install-aks-vscode]: ./aks-extension-vs-code.md#installation
[aks-vscode-features]: https://code.visualstudio.com/docs/azure/aksextensions#_features
[aks-vscode-github]: https://github.com/Azure/vscode-aks-tools/issues/new/choose
[aks-addons]: ./integrations.md

