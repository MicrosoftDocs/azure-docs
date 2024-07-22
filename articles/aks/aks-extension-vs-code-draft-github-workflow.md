---
title: Create a GitHub Workflow using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code
description: Learn how to create a GitHub Workflow using Automated Deployments in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.
author: qpetraroia
ms.topic: how-to
ms.date: 07/15/2024
ms.author: qpetraroia
ms.service: azure-kubernetes-service
---

# Use Automated Deployments to create a GitHub Workflow in the Azure Kubernetes Service (AKS) extension for Visual Studio Code.

The Azure Kubernetes Service (AKS) extension for Visual Studio Code offers a streamlined and efficient way to generate GitHub Workflows for your applications.

A GitHub workflow is crucial as it automates various development tasks, such as building, testing, and deploying code, ensuring consistency and efficiency across the development process. It enhances collaboration by integrating seamlessly with version control, enabling continuous integration and continuous deployment (CI/CD) pipelines, and ensuring that all changes are thoroughly vetted before being merged into the main codebase.

## Before you begin

* Have an active folder with code open in Visual Studio Code.
* Make sure the current workspace is an active git repository.
* Have downloaded the Azure Kubernetes Service (AKS) extension for Visual Studio Code.

## Create a GitHub Workflow with the Azure Kubernetes Service (AKS) extension

To use the command pallete to create a GitHub Worklow, press "crtl + shift + p" on your keyboard to open the command pallete. Then type "Automated Deployments: Create a GitHub Workflow". Once the screen pops up, the following information must be filled out.

To use the Kubernetes view, right click on your cluster in the Kubernetes tab, under Clouds -> Azure -> your subscription -> Automated Deployments -> Create a GitHub Workflow.

Both methods will bring you to a screen where the following information must be filled out.

* **Workflow name**: Type a name for your GitHub Workflow.
* **GitHub repository**: Choose a location where you would like to save your Kubernetes deployment files.
* **Subscription**: Choose your Azure subscription.
* **Dockerfile**: Select the dockerfile that you would like to build in the GitHub Action.
* **Build coontext**: Choose a build context.
* **ACR Resource Group**: Select an ACR resource group.
* **Container Registry**: Select a container registry.
* **Azure Container Registy image**: Select or type a Azure Container Registry image.
* **Cluster Resource Group**: Select your cluster resource group.
* **Cluster**: Select your AKS cluster to deploy to.
* **Namespace**: Select or type a namespace which you will deploy into.
* **Type**: Select the type of deployment option.

Depending on your deployment type, more fields may need to be filled out. Once all information is filled out, press create. Your GitHub workflow files will now be created in your app folder.

For more information, see [AKS extension for Visual Studio Code features](https://code.visualstudio.com/docs/azure/aksextensions#_features).

## Product support/feedback

If you have a question or would like to offer product feedback. Please open an issue on the [AKS extension GitHub repository](https://github.com/Azure/vscode-aks-tools/issues/new/choose).

## Next steps

To learn more about other AKS add-ons and extensions, see [Add-ons, extensions, and other integrations with AKS](./integrations.md).

