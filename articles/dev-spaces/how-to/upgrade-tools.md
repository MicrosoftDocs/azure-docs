---
title: "How to upgrade Azure Dev Spaces tools | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: "ghogen"
ms.author: "ghogen"
ms.date: "07/03/2018"
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
az extension update --name=dev-spaces-preview
```

## Update azds command line tools

In the browser, navigate to:

- On Windows, http://aka.ms/get-azds-windows
- On the Mac, `curl -L https://aka.ms/get-azds-mac`
- On Linux, `curl -L https://aka.ms/get-azds-linux`

## Update the VS Code extension

Uninstall the old version of the Azure Dev Spaces extension.

1. In VS Code, choose the **Extensions** icon in the left sidebar.

1. Select the Azure Dev Spaces extension, and choose **Uninstall**.

Install the new Azure Dev Spaces extension.

1. In the VS Extensions Marketplace, search for _Azure Dev Spaces_.

1. Select and install.

## Update the Visual Studio extension

1. Uninstall the old version of the Azure Dev Spaces extension. In Visual Studio, navigate to **Tools > Extensions and Updates**. Look for **Visual Studio Tools for Kubernetes**, and uninstall it.

1. Install the new Azure Dev Spaces extension. In the **Extensions and Updates** dialog box, choose Online to search for online extensions, and search for **Visual Studio Tools for Kubernetes**.

## Next steps

Test out the new tools by creating a new cluster. If you've used Azure Dev Spaces on previous clusters, you won't necessarily be using the most recent bits as clusters will not be immediately patched. Try the quickstarts and tutorials at [Azure Dev Spaces](/azure/dev-spaces).

> [!WARNING]
> Azure Dev Spaces on existing clusters will not be immediately patched, so to be sure you are using the most recent version on all your Azure deployments, create a new cluster.
