---
title: Create Azure application technical assets  | Azure Marketplace
description: Create the technical assets for an Azure application offer.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: article
ms.date: 12/13/2018
ms.author: pabutler
---

# Prepare your Azure application technical assets

This article describes the resources for preparing the technical assets for your Azure application offer.

## Before you begin

Review the following video, [Building Solution Templates, and Managed Applications for the Azure Marketplace](https://channel9.msdn.com/Events/Build/2018/BRK3603), an overview on how to author an Azure Resource Manager template to define an
Azure application solution and then how to subsequently publish the app offer to the Azure Marketplace.

>[!VIDEO https://channel9.msdn.com/Events/Build/2018/BRK3603/player]


Review the following Azure application documentation, which provides Quickstarts, Tutorials, and Samples.

- [Understand Azure Resource Manager Templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates)
- Quickstarts:

  - [Azure Quickstart templates](https://azure.microsoft.com/documentation/templates/)
  - [GitHub Azure Quickstart templates](https://github.com/azure/azure-quickstart-templates)
  - [Publish application definition](https://docs.microsoft.com/azure/managed-applications/publish-managed-app-definition-quickstart)
  - [Deploy service catalog app](https://docs.microsoft.com/azure/managed-applications/deploy-service-catalog-quickstart)

  
- Tutorials:

  - [Create definition files](https://docs.microsoft.com/azure/managed-applications/publish-service-catalog-app)
  - [Publish marketplace application](https://docs.microsoft.com/azure/managed-applications/publish-marketplace-app)

  - Samples:

    - [Azure CLI](https://docs.microsoft.com/azure/managed-applications/cli-samples)
    - [Azure PowerShell](https://docs.microsoft.com/azure/managed-applications/powershell-samples)
    - [Managed application solutions](https://docs.microsoft.com/azure/managed-applications/sample-projects)

## Fundamental technical knowledge

Designing, building, and testing these assets take time and requires technical knowledge of both the Azure platform and the technologies used to build the offer.

Your engineering team should have knowledge about the following Microsoft technologies:

- Basic understanding of [Azure Services](https://azure.microsoft.com/services/)
- How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
- Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking)
- Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
- Working knowledge of [JSON](https://www.json.org/)

## Suggested tools

Choose one or both of the following scripting environments to help manage your Azure application:

- [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview)
- [Azure CLI](https://docs.microsoft.com/cli/azure)

We recommend adding the following tools to your development environment:

- [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer)
- [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:

  - Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
  - Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
  - Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json)

We also suggest reviewing the available tools in the [Azure Developer Tools](https://azure.microsoft.com/tools/) page and, if you are using Visual Studio, the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Next steps

[Create Azure application offer](./cpp-create-offer.md)

