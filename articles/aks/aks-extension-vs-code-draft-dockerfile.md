---
title: Create a Dockerfile using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code
description: Learn how to create a Dockerfile using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.
author: qpetraroia
ms.topic: how-to
ms.date: 07/15/2024
ms.author: qpetraroia
ms.service: azure-kubernetes-service
---

# Use Automated Deployments to create a Dockerfile in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.

The Azure Kubernetes Service (AKS) extension for Visual Studio Code offers a streamlined and efficient way to generate Dockerfiles for your applications.

A Dockerfile is essential for Kubernetes because it defines the blueprint for creating Docker images. These images encapsulate your application along with its dependencies and environment settings, ensuring consistent deployment across various environments.

## Before you begin

* Have an active folder with code open in Visual Studio Code.
* Have downloaded the Azure Kubernetes Service (AKS) extension for Visual Studio Code.

## Create a Dockerfile with the Azure Kubernetes Service (AKS) extension

To use the command pallete to create a Dockerfile, press "crtl + shift + p" on your keyboard to open the command pallete. Then type "Automated Deployments: Create a Dockerfile". Once the screen pops up, the following information must be filled out.

To use the explorer view, right click on the explorer pane where your active folder is open and select "Create a Dockerfile".

Both methods will bring you to a screen where the following information must be filled out.

* **Location**: Choose a location where you would like to save your Dockerfile.
* **Programming language**: Select the programming language your app is written in.
* **Programming language version**: Select the programming language version.
* **Application Port**: Select the port.
* **Cluster**: Choose the port on which your application listens for incoming network connections.

Once all information is filled out, press create. Your dockerfile will now be created in your app folder.

For more information, see [AKS extension for Visual Studio Code features](https://code.visualstudio.com/docs/azure/aksextensions#_features).

## Product support and feedback
		
If you have a question or want to offer product feedback, please open an issue on the [AKS extension GitHub repository][aks-vscode-github].
		
## Next steps
		
To learn more about other AKS add-ons and extensions, see [Add-ons, extensions, and other integrations for AKS][aks-addons].
	
<!---LINKS--->
[install-aks-vscode]: ./aks-extension-vs-code.md#installation
[aks-vscode-features]: https://code.visualstudio.com/docs/azure/aksextensions#_features
[aks-vscode-github]: https://github.com/Azure/vscode-aks-tools/issues/new/choose
[aks-addons]: ./integrations.md

