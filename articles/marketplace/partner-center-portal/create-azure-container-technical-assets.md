---
title: Prepare your Azure Container technical assets
description: This article describes the steps and requirements for configuring a container offer on Azure Marketplace.
author: anbene
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/09/2020
---

# Prepare your Azure Container technical assets

> [!IMPORTANT]
> We're moving the management of your Azure Container offers from Cloud Partner Portal to Partner Center. Until your offers are migrated, please follow the instructions in [Prepare your Container technical assets](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/containers/cpp-create-technical-assets) for Cloud Partner Portal to manage your offers.

This article describes the steps and requirements for configuring a Container offer on Azure Marketplace.

## Before you begin

For Quickstarts, Tutorials, and Samples, see [Azure Container Instances](https://docs.microsoft.com/azure/container-instances).

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
- [Azure CLI.](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).

We recommend adding these tools to your development environment:

- [Azure Storage Explorer](https://aka.ms/GetStartedWithStorageExplorer)
- [Visual Studio Code](https://code.visualstudio.com/)
  - Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
  - Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
  - Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json).

Review the available tools on the [Azure Developer Tools](https://azure.microsoft.com/) page. If you're using Visual Studio, review the tools available in the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Create the container image

For more information, see the following tutorials:

- [Tutorial: Create a container image for deployment to Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-tutorial-prepare-app)
- [Tutorial: Build and deploy container images in the cloud with Azure Container Registry Tasks.](https://docs.microsoft.com/azure/container-registry/container-registry-tutorial-quick-task).

## Next step

- [Create your Container offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-azure-container-offer).
