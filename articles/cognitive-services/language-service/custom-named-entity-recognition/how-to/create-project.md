---
title: Using Azure resources in custom NER
titleSuffix: Azure Cognitive Services
description: Learn about the steps for using Azure resources with custom NER.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/21/2022
ms.author: aahi
ms.custom: language-service-custom-ner, references_regions, ignite-fall-2021
---

# How to create custom NER projects

Before you start using custom NER, you will need several things:

* An Azure Language resource 
* An Azure storage account where you will upload your `.txt` files that will be used to train an AI model to classify text

Use this article to learn how to prepare the requirements for using custom NER.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
You should have an idea of the [project schema](design-schema.md) you will use for your data.

## Azure resources

Before you start using custom NER, you will need an Azure Language resource. We recommend the steps in the [quickstart](../quickstart.md) for creating one in the Azure portal. Creating a resource in the Azure portal lets you create an Azure storage account at the same time, with all of the required permissions pre-configured. You can also read further in the article to learn how to use a pre-existing resource, and configure it to work with custom NER.

# [Azure portal](#tab/portal)

[!INCLUDE [create a new resource from the Azure portal](../../custom-classification/includes/resource-creation-azure-portal.md)]

# [Language Studio](#tab/studio)

### Create a new resource from Language Studio

If it's your first time logging in, you'll see a window in [Language Studio](https://aka.ms/languageStudio) that will let you choose a language resource or create a new one. You can also create a resource by clicking the settings icon in the top-right corner, selecting **Resources**, then clicking **Create a new resource**.

> [!IMPORTANT]
> * To use Custom NER, you'll need a Language resource in **West US 2** or **West Europe** with the Standard (**S**) pricing tier.
> * Be sure to to select **Managed Identity** when you create a resource. 

:::image type="content" source="../../media/create-new-resource-small.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="../../media/create-new-resource.png":::

To use custom NER, you'll need to [create an Azure storage account](../../../../storage/common/storage-account-create.md) if you don't have one already. 

Next you'll need to assign the [correct roles](#required-roles-for-your-storage-account) for the storage account to connect it to your Language resource. 

# [Azure PowerShell](#tab/powershell)

### Create a new resource with the Azure PowerShell

You can create a new resource and a storage account using the following CLI [template](https://github.com/Azure-Samples/cognitive-services-sample-data-files) and [parameters](https://github.com/Azure-Samples/cognitive-services-sample-data-files) files, which are hosted on GitHub.

Edit the following values in the parameters file:

| Parameter name | Value description |
|--|--|
|`name`| Name of your Language resource|
|`location`| Region in which your resource is hosted. Custom NER is only available in **West US 2** and **West Europe**.|
|`sku`| Pricing tier of your resource. This feature only works with **S** tier|
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

You can use an existing Language resource to get started with custom NER as long as this resource meets the below requirements:

|Requirement  |Description  |
|---------|---------|
|Regions     | Make sure your existing resource is provisioned in one of the two supported regions, **West US 2** or **West Europe**. If not, you will need to create a new resource in these regions.        |
|Pricing tier     | Make sure your existing resource is in the Standard (**S**) pricing tier. Only this pricing tier is supported. If your resource doesn't use this pricing  tier, you will need to create a new resource.        |
|Managed identity     | Make sure that the resource-managed identity setting is enabled. Otherwise, read the next section. |

To use custom NER, you'll need to [create an Azure storage account](../../../../storage/common/storage-account-create.md) if you don't have one already, and assign the [correct roles](#required-roles-for-your-storage-account) to connect it to your Language resource. 

> [!NOTE]
> Custom NER currently does not currently support Data Lake Storage Gen 2.

## Required roles for Azure Language resources

To access and use custom NER projects, your account must have one of the following roles in your Language resource. If you have contributors who need access to your projects, they will also need one of these roles to access the Language resource's managed identity:
* *owner*
* *contributor*

### Enable managed identities for your Language resource

Your Language resource must have identity management, which can be enabled either using the Azure portal or from Language Studio. To enable it using [Language Studio](https://aka.ms/languageStudio):
1. Click the settings icon in the top right corner of the screen
2. Select **Resources**
3. Select **Managed Identity** for your Azure resource.

### Add roles to your Language resource

After you've enabled managed identities for your resource, add the appropriate owner or contributor role assignments for your account, and your contributors' Azure accounts:

1. Go to your Language resource in the [Azure portal](https://portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** then **Add Role Assignments**, and choose the **Owner** or **Contributor** role. You can search for user names in the **Select** field.

## Required roles for your storage account

Your Language resource must have the below roles assigned within your Azure blob storage account:

* *owner* or *contributor*, and
* *storage blob data owner* or *storage blob data contributor*, and
* *reader*

### Add roles to your storage account

To set proper roles on your storage account:

1. Go to your storage account page in the [Azure portal](https://portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the appropriate role for your Language resource.
4. Select **Managed identity** under **Assign access to**. 
5. Select **Members** and find your resource. In the window that appears, select your subscription, and **Language** as the managed identity. You can search for user names in the **Select** field. Repeat this for all roles. 

[!INCLUDE [Storage connection note](../../custom-classification/includes/storage-account-note.md)]

For information on authorizing access to your Azure blob storage account and data, see [Authorize access to data in Azure storage](../../../../storage/common/authorize-data-access.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Enable CORS for your storage account

Make sure to allow (**GET, PUT, DELETE**) methods when enabling Cross-Origin Resource Sharing (CORS). Then, add an asterisk (`*`) to the fields and add the recommended value of 500 for the maximum age.

:::image type="content" source="../media/cors.png" alt-text="A screenshot showing how to use CORS for storage accounts." lightbox="../media/cors.png":::

## Prepare training data

* As a prerequisite for creating a custom NER project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training files from Azure directly or through using the Azure Storage Explorer tool. Using Azure Storage Explorer tool allows you to upload more data in less time.

  * [Create and upload files from Azure](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
  * [Create and upload files using Azure Storage Explorer](../../../../vs-azure-tools-storage-explorer-blobs.md)

* You can only use `.txt`. files for custom NER. If your data is in other format, you can use [Cognitive Services Language Utilities tool](https://aka.ms/CognitiveServicesLanguageUtilities) to parse your file to `.txt` format.

* You can either upload tagged data, or you can tag your data in Language Studio. Tagged data must follow the [tags file format](../concepts/data-formats.md). 

>[!TIP]
> Review [Prepare data and define a schema](../how-to/design-schema.md) for information on data selection and preparation.

## Create a custom named entity recognition project

Once your resource and storage container are configured, create a new custom NER project. A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have contributor access to the Azure resource being used.

[!INCLUDE [Create custom NER project](../includes/create-project.md)]

Review the data you entered and select **Create Project**.

## Next steps

After your project is created, you can start [tagging your data](tag-data.md), which will inform your entity extraction model how to interpret text, and is used for training and evaluation.
