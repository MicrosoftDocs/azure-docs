---
title: Use Draft and the DevX extension for Visual Studio Code with Azure Kubernetes Service (AKS)
description: Learn how to use Draft and the DevX extension for Visual Studio Code with Azure Kubernetes Service (AKS)
author: schaffererin
ms.topic: article
ms.date: 05/17/2023
ms.author: schaffererin
---

# Use Draft and the DevX extension for Visual Studio Code with Azure Kubernetes Service (AKS)

[Draft][draft] is an open-source project that streamlines Kubernetes development by taking a non-containerized application and generating the DockerFiles, Kubernetes manifests, Helm charts, Kustomize configurations, and other artifacts associated with a containerized application. The Azure Kubernetes Service (AKS) DevX extension for Visual Studio Code enhances non-cluster experiences, allowing you to create deployment files to deploy your applications to AKS. Draft is the available feature included in the DevX extension.

This article shows you how to use Draft with the DevX extension to draft a DockerFile, draft a Kubernetes deployment and service, and build an image on Azure Container Registry (ACR).

## Before you begin

* You need an Azure resource group and an AKS cluster with an attached ACR. To attach an ACR to your AKS cluster, use `az aks update -n <cluster-name> -g <resource-group-name> --attach-acr <acr-name>` or follow the instructions in [Authenticate with ACR from AKS][aks-acr-authenticate].
* Download and install the [Azure Kubernetes Service DevX Extension for Visual Studio Code][devx-extension].

## Draft with the DevX extension for Visual Studio Code

To get started with Draft in Visual Studio Code, press **Ctrl + Shift + P** in your Visual Studio Code window and enter **AKS Developer**. From here, you'll see available Draft commands:

* Get started
* Draft a DockerFile
* Draft a Kubernetes Deployment and Service
* Build an Image on Azure Container Registry

### Get started

The `Get started` command shows you all the steps you need to get up and running on AKS.

1. Press **Ctrl + Shift + P** to open the command palette.
2. Enter **AKS Developer**.
3. Select **AKS Developer: Get started**.

You'll see the following getting started page:

:::image type="content" source="./media/draft-devx-extension-aks/draft-devx-extension-aks-get-started-page-vs-code.png" alt-text="Screenshot showing the Get started page in Visual Studio Code." lightbox="./media/draft-devx-extension-aks/draft-devx-extension-aks-get-started-page-vs-code.png":::

### Draft a DockerFile

`Draft a DockerFile` adds the minimum required DockerFile to your project directory.

1. Press **Ctrl + Shift + P** to open the command palette.
2. Enter **AKS Developer**.
3. Select **AKS Developer: Draft a DockerFile**.

### Draft a Kubernetes Deployment and Service

`Draft a Kubernetes Deployment and Service` adds the appropriate deployment and service files to your application, which allows you to deploy to your AKS cluster. The supported deployment types include: Helm, Kustomize, and Kubernetes manifests.

1. Press **Ctrl + Shift + P** to open the command palette.
2. Enter **AKS Developer**.
3. Select **AKS Developer: Draft a Kubernetes Deployment and Service**.

### Build an Image on Azure Container Registry

`Build an Image on Azure Container Registry` builds an image on your ACR to use in your deployment files.

1. Press **Ctrl + Shift + P** to open the command palette.
2. Enter **AKS Developer**.
3. Select **AKS Developer: Build an Image on Azure Container Registry**.

### Draft a GitHub Action Deployment Workflow

`Draft a GitHub Action Deployment Workflow` adds a GitHub Action to your repository, allowing you initiate an autonomous workflow.

1. Press **Ctrl + Shift + P** to open the command palette.
2. Enter **AKS Developer**.
3. Select **AKS Developer: Draft a GitHub Action Deployment Workflow**.

## Next steps

In this article, you learned how to use Draft and the DevX extension for Visual Studio Code with AKS. To use Draft with the Azure CLI, see [Draft for AKS][draft-aks-cli].

<!-- LINKS -->

[draft-aks-cli]: ../aks/draft.md
[aks-acr-authenticate]: ../aks/cluster-container-registry-integration.md
[devx-extension]: https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.aks-devx-tools
[draft]: https://github.com/Azure/draft
