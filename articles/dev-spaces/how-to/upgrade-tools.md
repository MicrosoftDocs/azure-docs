---
title: "How to manage secrets when working with an Azure Dev Space | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "article"
ms.technology: "azds-kubernetes"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# How to upgrade Azure Dev Spaces tools

If there is a new release and you are already using Azure Dev Spaces, you might need to upgrade your Azure Dev Spaces client tools.

## Update the Azure CLI

When you update the latest Azure CLI, you also get the latest version of the Dev Spaces CLI extension.

You don't need to uninstall the previous version, just find the appropriate download at [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).


## Update the Dev Spaces CLI extension

Run the following command:

```cmd
az aks use-dev-spaces --update -n <AKS-cluster-name> -g <resource-group>
```

## Update azds command line tools

In the browser, navigate to:

- On Windows, http://aka.ms/get-azds-windows
- On the Mac, http://aka.ms/get-azds-mac
- On Linux, http://aka.ms/get-azds-linux

## Update the VS Code extension

Uninstall the old version of the Azure Dev Spaces extension.

1. In VS Code, choose the **Extensions** icon in the left sidebar.

1. Select the Azure Dev Spaces extension, and choose **Uninstall**.

Install the new Azure Dev Spaces extension.

1. In the VS Extensions Marketplace, search for _Azure Dev Spaces_.

1. Select and install.

## Update the Visual Studio extension

Uninstall the old version of the Azure Dev Spaces extension. In Visual Studio, navigate to **Tools > Extensions and Updates**. Look for **Visual Studio Tools for Kubernetes**, and uninstall it.

Install the new Azure Dev Spaces extension. In the **Extensions and Updates** dialog box, choose Online to search for online extensions, and search for **Visual Studio Tools for Kubernetes**.
