---
title: Technical concepts for Azure container offers - Microsoft commercial marketplace
description: Technical resource and guidelines to help you configure a container offer on Azure Marketplace.
author: anbene
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/09/2020
---

# Create an Azure container offer

This article gives technical resources and recommendations to help you create a container offer on Azure Marketplace.

## Before you begin

For Quickstarts, Tutorials, and Samples, see the [Azure Container Instances documentation](https://docs.microsoft.com/azure/container-instances).

## Fundamental technical knowledge

Designing, building, and testing these assets takes time and requires technical knowledge of both the Azure platform and the technologies used to build the offer.

In addition to your solution domain, your engineering team should have knowledge about the following Microsoft technologies:

- Basic understanding of [Azure Services](https://azure.microsoft.com/services/)
- How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
- Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking)
- Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
- Working Knowledge of [JSON](https://www.json.org/).

## Suggested tools

Choose one or both of the following scripting environments to help manage your Container image:

- [Azure PowerShell](https://docs.microsoft.com/powershell/azure/?view=azps-3.7.0&viewFallbackFrom=azps-3.6.1)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).

We recommend adding these tools to your development environment:

- [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows)
- [Visual Studio Code](https://code.visualstudio.com/)
  - Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
  - Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
  - Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json).

Review the available tools on the [Azure Developer Tools](https://azure.microsoft.com/) page. If you're using Visual Studio, review the tools available in the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Create the container image

For more information, see the following tutorials:

- [Tutorial: Create a container image for deployment to Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-tutorial-prepare-app)
- [Tutorial: Build and deploy container images in the cloud with Azure Container Registry Tasks](https://docs.microsoft.com/azure/container-registry/container-registry-tutorial-quick-task).

## Next steps

- [Create your container offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-azure-container-offer).
