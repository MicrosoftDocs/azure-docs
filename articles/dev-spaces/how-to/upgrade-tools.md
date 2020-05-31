---
title: "How to upgrade Azure Dev Spaces tools"
services: azure-dev-spaces
ms.date: "07/03/2018"
ms.topic: "conceptual"
description: "Learn how to upgrade the Azure Dev Spaces command line tools, Visual Studio Code extension, and Visual Studio extension"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
---
# How to upgrade Azure Dev Spaces tools

If there is a new release and you are already using Azure Dev Spaces, you might need to upgrade your Azure Dev Spaces client tools.

## Update the Azure CLI

When you update the latest Azure CLI, you also get the latest version of the Dev Spaces CLI extension.

You don't need to uninstall the previous version, just find the appropriate download at [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).


## Update the Dev Spaces CLI extension and command-line tools

Run the following command:

```azurecli
az aks use-dev-spaces -n <your-aks-cluster> -g <your-aks-cluster-resource-group> --update
```

## Update the VS Code extension

Once installed, the extension updates automatically. You might need to reload the extension to use the new features. In VS Code, open the **Extensions** pane, choose the **Azure Dev Spaces** extensions, and choose **Reload**.

## Update Visual Studio

Azure Dev Spaces is part of the Azure Development workload and is included in all Visual Studio updates.

## Next steps

Test out the new tools by creating a new cluster. Try the quickstarts and tutorials at [Azure Dev Spaces](/azure/dev-spaces).
