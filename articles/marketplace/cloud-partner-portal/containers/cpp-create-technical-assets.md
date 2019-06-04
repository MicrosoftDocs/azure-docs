---
title: Create Azure Containers image technical assets | Azure Marketplace
description: Create the technical assets for an Azure container.
services: Azure, Marketplace, Cloud Partner Portal, 
author: dan-wesley
ms.service: marketplace
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: pabutler
---

# Prepare your container technical assets

This article describes steps and requirements for configuring a container offer the Azure Marketplace.

## Before you begin

Review the [Azure Container Instances](https://docs.microsoft.com/azure/container-instances) documentation, which provides Quickstarts, Tutorials, and Samples.

## Fundamental technical knowledge

Designing, building, and testing these assets take time and requires technical knowledge of both the Azure platform and the technologies used to build the offer.
 
In addition to your solution domain, your engineering team should have knowledge on the following Microsoft technologies:

-	Basic understanding of [Azure Services](https://azure.microsoft.com/services/) 
-	How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
-	Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage) and [Azure Networking](https://azure.microsoft.com/services/?filter=networking)
-	Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
-	Working Knowledge of [JSON](https://www.json.org/)

## Suggested tools

Choose one or both of the following scripting environments to help manage your container image:

-	[Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview)
-	[Azure CLI](https://docs.microsoft.com/cli/azure)

In addition, we recommend adding the following tools to your development environment:

-	[Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer)
-	[Visual Studio Code](https://code.visualstudio.com/)
    *	Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
    *	Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
    *	Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json)

We also suggest reviewing the available tools in the [Azure Developer Tools](https://azure.microsoft.com/tools/) page and, if you are using Visual Studio, the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Create the container image

See the following for more information:

* [Tutorial: Create a container image for deployment to Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-tutorial-prepare-app)
* [Tutorial: Build and deploy container images in the cloud with Azure Container Registry Tasks](https://docs.microsoft.com/azure/container-registry/container-registry-tutorial-quick-task)

## Next steps

[Create your container offer](./cpp-create-offer.md)
