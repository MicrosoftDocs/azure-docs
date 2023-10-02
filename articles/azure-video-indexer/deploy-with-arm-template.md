---
title: Deploy Azure AI Video Indexer by using an ARM template
description: Learn how to create an Azure AI Video Indexer account by using an Azure Resource Manager (ARM) template.
ms.topic: tutorial
ms.custom: devx-track-arm-template
ms.date: 05/23/2022
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Tutorial: Deploy Azure AI Video Indexer by using an ARM template

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

[!INCLUDE [Gate notice](./includes/face-limited-access.md)]

In this tutorial, you'll create an Azure AI Video Indexer account by using the Azure Resource Manager template (ARM template, which is in preview). The resource will be deployed to your subscription and will create the Azure AI Video Indexer resource based on parameters defined in the *avam.template* file.

> [!NOTE]
> This sample is *not* for connecting an existing Azure AI Video Indexer classic account to a Resource Manager-based Azure AI Video Indexer account.
>
> For full documentation on the Azure AI Video Indexer API, visit the [developer portal](https://aka.ms/avam-dev-portal). For the latest API version for *Microsoft.VideoIndexer*, see the [template reference](/azure/templates/microsoft.videoindexer/accounts?tabs=bicep).

## Prerequisites

You need an Azure Media Services account. You can create one for free through [Create a Media Services account](/azure/media-services/latest/account-create-how-to).

## Deploy the sample

----

### Option 1: Select the button for deploying to Azure, and fill in the missing parameters

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fmedia-services-video-indexer%2Fmaster%2FDeploy-Samples%2FArmTemplates%2Favam.template.json)

----

### Option 2: Deploy by using a PowerShell script

1. Open the [template file](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/Deploy-Samples/ArmTemplates/avam.template.json) and inspect its contents.
2. Fill in the required parameters.
3. Run the following PowerShell commands:

   * Create a new resource group on the same location as your Azure AI Video Indexer account by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet.

     ```powershell
      New-AzResourceGroup -Name myResourceGroup -Location eastus
     ```

   * Deploy the template to the resource group by using the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet.

     ```powershell
     New-AzResourceGroupDeployment -ResourceGroupName myResourceGroup -TemplateFile ./avam.template.json
     ```

> [!NOTE]
> If you want to work with Bicep format, see [Deploy by using Bicep](./deploy-with-bicep.md).

## Parameters

### name

* Type: string
* Description: The name of the new Azure AI Video Indexer account.
* Required: true

### location

* Type: string
* Description: The Azure location where the Azure AI Video Indexer account should be created.
* Required: false

> [!NOTE]
> You need to deploy your Azure AI Video Indexer account in the same location (region) as the associated Azure Media Services resource.

### mediaServiceAccountResourceId

* Type: string
* Description: The resource ID of the Azure Media Services resource.
* Required: true

### managedIdentityId

> [!NOTE]
> User assigned managed Identify must have at least Contributor role on the Media Service before deployment, when using System Assigned Managed Identity the Contributor role should be assigned after deployment.

* Type: string
* Description: The resource ID of the managed identity that's used to grant access between Azure Media Services resource and the Azure AI Video Indexer account.
* Required: true

### tags

* Type: object
* Description: The array of objects that represents custom user tags on the Azure AI Video Indexer account.
* Required: false

## Reference documentation

If you're new to Azure AI Video Indexer, see:

* [The Azure AI Video Indexer documentation](./index.yml)
* [The Azure AI Video Indexer API developer portal](https://api-portal.videoindexer.ai/)

After you complete this tutorial, head to other Azure AI Video Indexer samples described in [README.md](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/README.md).

If you're new to template deployment, see:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Deploy resources with ARM templates](../azure-resource-manager/templates/deploy-powershell.md)
* [Deploy resources with Bicep and the Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)

## Next steps

Connect a [classic paid Azure AI Video Indexer account to a Resource Manager-based account](connect-classic-account-to-arm.md).
