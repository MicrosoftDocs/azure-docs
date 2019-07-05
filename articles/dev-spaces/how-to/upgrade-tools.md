---
title: "How to upgrade Azure Dev Spaces tools"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: "07/03/2018"
ms.topic: "conceptual"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
---
# How to upgrade Azure Dev Spaces tools

If there is a new release and you are already using Azure Dev Spaces, you might need to upgrade your Azure Dev Spaces client tools.

## Update the Azure CLI

When you update the latest Azure CLI, you also get the latest version of the Dev Spaces CLI extension.

You don't need to uninstall the previous version, just find the appropriate download at [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).


## Update the Dev Spaces CLI extension and command-line tools

Run the following command:

```cmd
az aks use-dev-spaces -n <your-aks-cluster> -g <your-aks-cluster-resource-group> --update
```

## Update the VS Code extension

Once installed, the extension updates automatically. You might need to reload the extension to use the new features. In VS Code, open the **Extensions** pane, choose the **Azure Dev Spaces** extensions, and choose **Reload**.

## Update the Visual Studio extension

Like with other extensions and updates, Visual Studio will notify you when there's an update available to the Visual Studio Tools for Kubernetes, which includes Azure Dev Spaces. Look for a flag icon on the top right of the screen.

To update the tools in Visual Studio, choose the **Tools > Extensions and Updates** menu item, and on the left side, choose **Updates**. Find **Visual Studio Tools for Kubernetes** and choose the **Update** button.

## Next steps

Test out the new tools by creating a new cluster. Try the quickstarts and tutorials at [Azure Dev Spaces](/azure/dev-spaces).

> [!WARNING]
> Azure Dev Spaces on existing clusters will not be immediately patched, so to be sure you are using the most recent version on all your Azure deployments, create a new cluster after upgrading the tools.
