---
title: Prepare your Azure container technical assets
description: Technical resource and guidelines to help you configure a container offer on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 03/30/2021
---

# Prepare Azure container technical assets

This article gives technical resources and recommendations to help you create a container offer on Azure Marketplace.

## Before you begin

For Quickstarts, Tutorials, and Samples, see the [Azure Container Instances documentation](../container-instances/index.yml).

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

- [Azure PowerShell](/powershell/azure/)
- [Azure CLI](/cli/azure/)

We recommend adding these tools to your development environment:

- [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows)
- [Visual Studio Code](https://code.visualstudio.com/)
  - Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
  - Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
  - Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json).

Review the available tools on the [Azure Developer Tools](https://azure.microsoft.com/) page. If you're using Visual Studio, review the tools available in the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Create the container image

You can't deploy an image to Azure Container Instances from an on-premises registry.

- If you already have a working container in your local registry, create an Azure Registry and upload your container image to the Azure Container Registry. To learn more, see [Tutorial: Build and deploy container images in the cloud with Azure Container Registry Tasks](../container-registry/container-registry-tutorial-quick-task.md).

- If don’t have a container image yet and need to containerize your existing application or create a new container based application,  clone the application source code from GitHub, create a container image from the application source, and test the image in a local Docker environment. To learn more, see [Tutorial: Create a container image for deployment to Azure Container Instances](../container-instances/container-instances-tutorial-prepare-app.md).

## Next steps

- [Create your container offer](azure-container-offer-setup.md)