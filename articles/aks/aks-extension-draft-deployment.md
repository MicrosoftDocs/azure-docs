---
title: Create a Kubernetes deployment using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code
description: Learn how create a Kubernetes deployment using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.
author: qpetraroia
ms.topic: how-to
ms.date: 07/15/2024
ms.author: qpetraroia
ms.service: azure-kubernetes-service
---

# Create a Kubernetes deployment using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code

In this article, you learn how to create a Kubernetes deployment using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code. Automated Deployments provides an easy way to automate the process of scaling, updating, and maintaining your applications.

## Prerequisites

Before you begin, make sure you have the following resources:

* An active folder with code open in Visual Studio Code.
* The Azure Kubernetes Service (AKS) extension for Visual Studio Code downloaded. For more information, see [Install the Azure Kubernetes Service (AKS) extension for Visual Studio Code][install-aks-vscode].

## Create a Kubernetes deployment using the Azure Kubernetes Service (AKS) extension

You can access the screen to create a Kubernetes deployment using the command palette or the explorer view.

### [Command palette](#tab/command-palette)

1. On your keyboard, press `Ctrl+Shift+P` to open the command palette.
2. In the search bar, search for and select **Automated Deployments: Create a Deployment**.
3. Enter the following information:

    * **Subscription**: Select your Azure subscription.
    * **Location**: Select a location where you want to save your Kubernetes deployment files.
    * **Deployment options**: Select `Kubernetes manifests`, `Helm`, or `Kustomize`.
    * **Target port**: Select the port in which your applications listen to in your deployment. This port usually matches what is exposed in your Dockerfile.
    * **Service port**: Select the port in which the service listens to for incoming traffic.
    * **Namespace**: Select the namespace in which your application will be deployed into.

4. Select **Create**.


### [Explorer view](#tab/explorer-view)

1. Right click on the explorer pane where your active folder is open and select **Create a Deployment**.
2. Enter the following information:

    * **Subscription**: Select your Azure subscription.
    * **Location**: Select a location where you want to save your Kubernetes deployment files.
    * **Deployment options**: Select `Kubernetes manifests`, `Helm`, or `Kustomize`.
    * **Target port**: Select the port in which your applications listen to in your deployment. This port usually matches what is exposed in your Dockerfile.
    * **Service port**: Select the port in which the service listens to for incoming traffic.
    * **Namespace**: Select the namespace in which your application will be deployed into.

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
	

