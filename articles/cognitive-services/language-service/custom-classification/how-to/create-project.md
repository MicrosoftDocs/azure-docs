---
title: How to create custom text classification projects
titleSuffix: Azure Cognitive Services
description: Learn about the steps for using Azure resources with custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/21/2022
ms.author: aahi
ms.custom: language-service-custom-classification, references_regions, ignite-fall-2021
---

# How to create custom text classification projects

Use this article to learn how to set up these requirements and create a project. 

## Prerequisites

Before you start using custom text classification, you will need several things:

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
* An Azure Language resource 
* An Azure storage account to store data for your project
* You should have an idea of the [project schema](design-schema.md) you will use for your data.

## Azure resources

Before you start using custom text classification, you will need an Azure Language resource. We recommend following the steps below for creating your resource in the Azure portal. Creating a resource in the Azure portal lets you create an Azure storage account at the same time, with all of the required permissions pre-configured. You can also read further in the article to learn how to use a pre-existing resource, and configure it to work with custom text classification.

You also will need an Azure storage account where you will upload your `.txt` files that will be used to train a model to classify text.

# [Azure portal](#tab/portal)

[!INCLUDE [create a new resource from the Azure portal](../includes/resource-creation-azure-portal.md)]

<!-- :::image type="content" source="../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="../../media/azure-portal-resource-credentials.png"::: -->

# [Language Studio](#tab/studio)

### Create a new resource from Language Studio

If it's your first time logging in, you'll see a window in [Language Studio](https://aka.ms/languageStudio) that will let you choose a language resource or create a new one. You can also create a resource by clicking the settings icon in the top-right corner, selecting **Resources**, then clicking **Create a new resource**.

> [!IMPORTANT]
> * To use custom text classification, you'll need a Language resource in **West US 2** or **West Europe** with the Standard (**S**) pricing tier.
> * Be sure to to select **Managed Identity** when you create a resource. 

:::image type="content" source="../../media/create-new-resource-small.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="../../media/create-new-resource.png":::

To use custom text classification, you'll need to [create an Azure storage account](../../../../storage/common/storage-account-create.md) if you don't have one already. 

Next you'll need to assign the [correct roles](#roles-for-your-storage-account) for the storage account to connect it to your Language resource. 

# [Azure PowerShell](#tab/powershell)

### Create a new resource with the Azure PowerShell

You can create a new resource and a storage account using the following CLI [template](https://github.com/Azure-Samples/cognitive-services-sample-data-files) and [parameters](https://github.com/Azure-Samples/cognitive-services-sample-data-files) files, which are hosted on GitHub.

Edit the following values in the parameters file:

| Parameter name | Value description |
|--|--|
|`name`| Name of your Language resource|
|`location`| Region in which your resource is hosted. Custom text classification is only available in **West US 2** and **West Europe**.|
|`sku`| Pricing tier of your resource. Custom text only works with **S** tier|
|`storageResourceName`| Name of your storage account|
|`storageLocation`| Region in which your storage account is hosted.|
|`storageSkuType`| SKU of your [storage account](/rest/api/storagerp/srp_sku_types).|
|`storageResourceGroupName`| Resource group of your storage account|
<!-- |builtInRoleType| Set this role to **"Contributor"**| -->

Use the following PowerShell command to deploy the Azure Resource Manager (ARM) template with the files you edited.

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile <path-to-arm-template> `
  -TemplateParameterFile <path-to-parameters-file>
```

See the ARM template documentation for information on [deploying templates](../../../../azure-resource-manager/templates/deploy-powershell.md#parameter-files) and [parameter files](../../../../azure-resource-manager/templates/parameter-files.md?tabs=json).

--- 

## Using a pre-existing Azure resource

You can use an existing Language resource to get started with custom text classification as long as this resource meets the below requirements:

|Requirement  |Description  |
|---------|---------|
|Regions     | Make sure your existing resource is provisioned in one of the two supported regions, **West US 2** or **West Europe**. If not, you will need to create a new resource in these regions.        |
|Pricing tier     | Make sure your existing resource is in the Standard (**S**) pricing tier. Only this pricing tier is supported. If your resource doesn't use this pricing  tier, you will need to create a new resource.        |
|Managed identity     | Make sure that the resource-managed identity setting is enabled. Otherwise, read the next section. |

To use custom text classification, you'll need to [create an Azure storage account](../../../../storage/common/storage-account-create.md) if you don't have one already. 

Next you'll need to assign the [correct roles](#roles-for-your-storage-account) for the storage account to connect it to your Language resource. 

## Roles for your Azure Language resource

You should have the **owner** or **contributor** role assigned on your Azure Language resource.

## Enable identity management for your resource

Your Language resource must have identity management, which can be enabled either using the Azure portal or from Language Studio. To enable it using [Language Studio](https://aka.ms/languageStudio):
1. Click the settings icon in the top right corner of the screen
2. Select **Resources**
3. Select **Managed Identity** for your Azure resource.

## Roles for your storage account

Your Azure blob storage account must have the below roles:

* Your resource has the **owner** or **contributor** role on the storage account.
* Your resource has the **Storage blob data owner** or **Storage blob data contributor** role on the storage account.
* Your resource has the **Reader** role on the storage account.

To set proper roles on your storage account:

1. Go to your storage account page in the [Azure portal](https://portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the appropriate role for your Language resource.
4. Select **Managed identity** under **Assign access to**. 
5. Select **Members** and find your resource. In the window that appears, select your subscription, and **Language** as the managed identity. You can search for user names in the **Select** field. Repeat this for all roles. 

[!INCLUDE [Storage connection note](../includes/storage-account-note.md)]

### Enable CORS for your storage account

Make sure to allow (**GET, PUT, DELETE**) methods when enabling Cross-Origin Resource Sharing (CORS). Make sure to add an asterisk (`*`) to the fields, and add the recommended value of 500 for the maximum age.

:::image type="content" source="../../custom-named-entity-recognition/media/cors.png" alt-text="A screenshot showing how to use CORS for storage accounts." lightbox="../../custom-named-entity-recognition/media/cors.png":::

## Prepare training data

* As a prerequisite for creating a custom text classification project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training files from Azure directly or through using the Azure Storage Explorer tool. Using Azure Storage Explorer tool allows you to upload more data in less time.

  * [Create and upload files from Azure](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
  * [Create and upload files using Azure Storage Explorer](../../../../vs-azure-tools-storage-explorer-blobs.md)

* You can only use `.txt`. files for custom text classification. If your data is in other format, you can use [Cognitive Services Language Utilities tool](https://aka.ms/CognitiveServicesLanguageUtilities) to parse your file to `.txt` format.

* You can either upload tagged data, or you can tag your data in Language Studio. Tagged data must follow the [tags file format](../concepts/data-formats.md). 

>[!TIP]
> See [How to design a schema](design-schema.md) for information on data selection and preparation.

## Create a project

[!INCLUDE [Language Studio project creation](../includes/create-project.md)]

## Next steps

After your project is created, you can start [tagging your data](tag-data.md), which will inform your text classification model how to interpret text, and is used for training and evaluation.
