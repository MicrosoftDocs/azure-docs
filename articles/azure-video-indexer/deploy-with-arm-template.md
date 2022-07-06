---
title:  Deploy Azure Video Indexer with Resource Manager template
description: Learn how to create an Azure Video Indexer account with Azure Resource Manager template.
ms.topic: tutorial
ms.date: 05/23/2022
ms.author: juliako
---

# Tutorial: Deploy Azure Video Indexer with the Azure Resource Manager template

## Overview

In this tutorial, you will create an Azure Video Indexer account by using the Azure Resource Manager template (preview). The resource will be deployed to your subscription and will create the Azure Video Indexer resource based on parameters defined in the ```avam.template``` file.

> [!NOTE]
> This sample is *not* for connecting an existing Azure Video Indexer classic account to a Resource Manager-based Azure Video Indexer account.
> For full documentation on Azure Video Indexer API, visit the [Developer portal](https://aka.ms/avam-dev-portal) page.
> For the latest API version for ```Microsoft.VideoIndexer```, see the [template reference](/azure/templates/microsoft.videoindexer/accounts?tabs=bicep).

## Prerequisites

An Azure Media Services account. You can create one for free through [Create a Media Services account](/azure/media-services/latest/account-create-how-to).

## Deploy the sample

----

### Option 1: Click the **Deploy To Azure** button, and fill in the missing parameters.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fmedia-services-video-indexer%2Fmaster%2FARM-Quick-Start%2Favam.template.json)

----

### Option 2: Deploy using a PowerShell script.

1. Open the [template file](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/ARM-Quick-Start/avam.template.json) and inspect its content.
2. Fill in the required parameters (see below).
3. Run the following PowerShell commands:

    * Create a new Resource group on the same location as your Azure Video Indexer account using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet.

    ```powershell
    New-AzResourceGroup -Name myResourceGroup -Location eastus
    ```

    * Deploy the template to the resource group using the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet.

    ```powershell
    New-AzResourceGroupDeployment -ResourceGroupName myResourceGroup -TemplateFile ./avam.template.json
    ```

> [!NOTE]
> If you would like to work with Bicep format, see [Deploy by using Bicep](./deploy-with-bicep.md).

## Parameters

### name

* Type: string
* Description: Specifies the name of the new Azure Video Indexer account.
* Required: true

### location

* Type: string
* Description: Specifies the Azure location where the Azure Video Indexer account should be created.
* Required: false

> [!NOTE]
> You need to deploy Your Azure Video Indexer account in the same location (region) as the associated Azure Media Services resource.

### mediaServiceAccountResourceId

* Type: string
* Description: Specifies the Resource ID of the Azure Media Services resource.
* Required: true

### managedIdentityId

* Type: string
* Description: Specifies the Resource ID of the Managed Identity used to grant access between Azure Media Services resource and the Azure Video Indexer account.
* Required: true

### tags

* Type: object
* Description: Specifies the array of objects that represents custom user tags on the Azure Video Indexer account.
* Required: false

## Reference documentation

If you're new to Azure Video Indexer, see:

* [Azure Video Indexer Documentation](./index.yml)
* [Azure Video Indexer Developer Portal](https://api-portal.videoindexer.ai/)

After completing this tutorial, head to other Azure Video Indexer samples, described on [README.md](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/README.md).

If you're new to template deployment, see:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Deploy Resources with Resource Manager Template](../azure-resource-manager/templates/deploy-powershell.md)
* [Deploy Resources with Bicep and Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)

## Next steps

Connect a [classic paid Azure Video Indexer account to a](connect-classic-account-to-arm.md) Resource Manager-based account.
