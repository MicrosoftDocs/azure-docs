---
title: Use Automated Deployments to create a Kubernetes deployment in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.
description: Learn how to use Automated Deployments to create a Kubernetes deployment in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.
author: qpetraroia
ms.topic: article
ms.date: 07/15/2024
ms.author: qpetraroia
ms.service: azure-kubernetes-service
---

# Use Automated Deployments to create a Kubernetes deployment in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.

The Azure Kubernetes Service (AKS) extension for Visual Studio Code offers a streamlined and efficient way to generate Kubernetes deployments for your applications. A Kubernetes Deployment is essential for managing containerized applications because it automates the process of scaling, updating, and maintaining the application's desired state.

## Before you begin

* Have an active folder with code open in Visual Studio Code.
* Have downloaded the Azure Kubernetes Service (AKS) extension for Visual Studio Code.

## Create a Kubernetes deployment with the Azure Kubernetes Service (AKS) extension

To use the command pallete to create a Kubernetes deployment, press "crtl + shift + p" on your keyboard to open the command pallete. Then type "Automated Deployments: Create a Deployment". Once the screen pops up, the following information must be filled out.

To use the explorer view, right click on the explorer pane where your active folder is open and select "Create a Deployment".

Both methods will bring you to a screen where the following information must be filled out.

* **Subscription**: Choose your Azure subscription.
* **Location**: Choose a location where you would like to save your Kubernetes deployment files.
* **Deployment options**: Choose between `Kubernetes manifests`, `Helm`, or `Kustmoize` for your deployment options.
* **Target port**: The port in which your applications listens to in your deployment. This port usually matches what is exposted in your Dockerfile.
* **Service port**: The port in which the service will listen to for incoming traffic.
* **Namespace**: Namespace in which your application will be deployed into.

Once all information is filled out, press create. Your deployment files will now be created in your app folder.

For more information, see [AKS extension for Visual Studio Code features](https://code.visualstudio.com/docs/azure/aksextensions#_features).

## Product support/feedback

If you have a question or would like to offer product feedback. Please open an issue on the [AKS extension GitHub repository](https://github.com/Azure/vscode-aks-tools/issues/new/choose).

## Next steps

To learn more about other AKS add-ons and extensions, see [Add-ons, extensions, and other integrations with AKS](./integrations.md).

