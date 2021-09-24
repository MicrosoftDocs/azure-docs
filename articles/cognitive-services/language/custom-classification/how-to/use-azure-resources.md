---
title: Using Azure resources in custom classification 
titleSuffix: Azure Cognitive Services
description: Learn about the steps for using Azure resources with custom classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Using Azure resources for custom classification

When you create a custom text classification project, you will connect it to a blob storage container where your data is uploaded. Use this article to learn how to set up Azure resources to work with custom classification.

## Creating new Azure resources

Before you start using custom classification, you will need a Language Services resource. We recommend the steps in the [quickstart](../quickstart.md) for creating one in the Azure portal. Creating a resource in the Azure portal lets you create an Azure blob storage account at the same time, with all of the required permissions pre-configured. 

# [Azure portal](#tab/portal)

[!INCLUDE [create a new resource from the Azure portal](../includes/resource-creation-azure-portal.md)]

:::image type="content" source="../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="../../media/azure-portal-resource-credentials.png":::

# [Language Studio](#tab/studio)

### Create a new resource from Language Studio

If it's your first time logging in, you'll see a window appear in [Language Studio](https://language.azure.com/) that will let you choose a language resource or create a new one. You can also create a resource by clicking the settings icon in the top right corner, selecting **Resources**, then clicking **Create a new resource**.

> [!IMPORTANT]
> * Be sure to to select **Managed Identity** when you create a resource. This will let Azure authenticate to your Azure Blob storage account. 
> * To use Custom Text Classification, you'll need a Language Services resource in **West US 2** or **West Europe** with the Standard (S) pricing tier.

:::image type="content" source="../../media/create-new-resource-small.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="../../media/create-new-resource.png":::

If you use Language Studio, you'll need to [create an Azure Blob storage account](/azure/storage/common/storage-account-create). 

After your storage account is created, continue reading this article for the following steps:

1. Enable identity management on your Azure resource.
2. Set the correct roles on the storage account

# [Azure CLI](#tab/cli)

### Create a new resource with the Azure CLI

You can create a new resource and a storage account using the following CLI [template](https://github.com/Azure-Samples/cognitive-services-sample-data-files) and [parameters](https://github.com/Azure-Samples/cognitive-services-sample-data-files) files, which are hosted on GitHub.

Edit the following values in the parameters file:

| Parameter name | Value description |
|--|--|
|`name`| Name of your TA resource|
|`location`| Region in which your resource is hosted. Custom text is only available in **West US 2** and **West Europe**.|
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

See the ARM template documentation for information on [deploying templates](/azure/azure-resource-manager/templates/deploy-powershell#parameter-files) and [parameter files](/azure/azure-resource-manager/templates/parameter-files?tabs=json).

--- 

## (optional) Using a preexisting Azure resource

You can use an existing Text Analytics resource to get started with custom features as long as this resource meets the below requirements:

|Requirement  |Description  |
|---------|---------|
|Regions     | Make sure your existing TA resource is provisioned in one of the two supported regions, **West US 2** or **West Europe**. If not, you will need to create a new resource in these regions.        |
|Pricing tier     | Make sure your existing resource is in the Standard (**S**) pricing tier. This is the only supported pricing tier to use the custom text feature. If not, you will need to create a new resource.        |
|Managed identity     | Make sure that the resource managed identity setting is enabled. If it isn't read the next section. |


When you create a new project, you will need to connect your storage account with your existing preexisting resource. If you don't have a storage account, you need to [create a new one](/azure/storage/common/storage-account-create?tabs=azure-portal) and follow the steps below to apply the right Azure roles and permissions.

## Enable identity management for your resource

Your Language Services resource must have identity management, which can be enabled either using the Azure portal or from Language Studio. To enable it using [Language Studio](https://language.azure.com/):
1. Click the settings icon in the top right corner of the screen
2. Select **Resources**
3. Select **Managed Identity** for your Azure resource.

## Roles for your storage account

Your Azure blob storage account must have the below roles:

* Your resource has the **owner** or **contributor** role on the storage account.
* Your resource has the **Storage blob data owner** or **Storage blob data contributor** role on the storage account.
* Your resource has the **Reader** role on the storage account.

To set proper roles on your storage account:

1. Go to your storage account page in the [Azure portal](https://ms.portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the **Owner** or **Contributor** role. You can search for user names in the **Select** field.

[!INCLUDE [Storage connection note](../includes/storage-account-note.md)]

## Next steps

* [Custom classification quickstart](../quickstart.md)
* [Recommended practices](../concepts/recommended-practices.md)