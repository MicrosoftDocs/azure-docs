---
title: How to prepare your data for custom text classification
titleSuffix: Azure Cognitive Services
description: Learn about preparing your data for Custom Text Classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 08/09/2021
ms.author: aahi
---

# How to prepare your data

For Custom text classification, you need to bring your own storage. That is, you can host your data in your storage account and connect it to your Text Analytics resource to build your own models.

## Prerequisites

* An Azure [storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).

## Set permissions on storage account

To successfully create a Custom text classification project, you need to assign te following roles:

* Users have **owner** or **contributor** role for the storage account.
* Your Text analytics resource has **Storage blob data owner** or **Storage blob data contributor** role on the storage account.
* Your Text analytics resource has **Reader** role on the storage account.

### Set roles for storage account

Ensure the below resource roles are set correctly on the storage account:

* Your Text Analytics resource has **owner** or **contributor** role on the storage account.

* Your Text Analytics resource has **Storage blob data owner** or **Storage blob data contributor** role on the storage account

* Your Text analytics resource has **Reader** role on the storage account.

To set proper roles on your resource, go to your storage account page in [Azure](https://ms.portal.azure.com/), click on **Access Control (IAM)** blade on the left-nav bar. Then click on **Add** to **Add Role Assignments**, and choose the **Owner** or **Contributor** role. Search on the user name in the **Select** field.

:::image type="content" source="../media/assign-roles-azure.png" alt-text="ct-assign-roles-azure" lightbox="../media/assign-roles-azure.png":::

## Connect storage account to your resource

Connection your storage account to you Language resource is the process of enabling the project you create within your resource to access your data and use it in building your models. You only need to do this step once for each resource. This process is irreversible, if you connect a storage account to your resource you cannot disconnect it later. You can only link your resource to one storage account.
If you followed the steps [here](manage-azure-resources.md#Create-new-resource-from-Azure-portal) to create your Language resource, it will be connected to your storage account. If not you still need to do this step.

### Connect storage through Language studio

You will need to do these steps as part of the project creation flow for the first project only.

1. Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/classification).

1. Select **Create new project** from the top menu in your projects page.

:::image type="content" source="../media/create-project-1.png" alt-text="create-project-1" lightbox="../media/create-project-1.png":::

1. Select your storage account from the drop down. If you cannot find your storage account, make sure you have satisfied [required permissions](#Set-permission-on-storage-account).

    :::image type="content" source="../media/connect-storage.png" alt-text="connect-storage" lightbox="../media/connect-storage.png":::

1. Click **Next**

You can follow this [guide](create-project.md) for project creation.

### Connect storage through Azure CLI

You can connect your resource to a storage account using the following CLI [template](../extras/template2.json) and [parameters](../extras/parameters.json) files. This method connects a storage account to your existing resource and if you don't have an existing storage account it creates one for you and connects it to your resource.

Edit the following values in the parameters file:

| Parameter name | Value description |
|--|--|
|name| Name of your TA resource|
|location| Region in which your resource is hosted. Custom text is only available in **West US 2** and **West Europe**.|
|sku| Pricing tier of your resource. Custom text only works with **"S"** tier|
|storageResourceName| Name of your storage account|
|storageLocation| Region in which your storage account is hosted.|
|storageSkuType| SKU of your storage account. You an learn more about this [here](https://docs.microsoft.com/rest/api/storagerp/srp_sku_types).|
|storageResourceGroupName| Resource group of your storage account|

Use the following PowerShell command to deploy ARM template with parameters file.

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile <path-to-arm-template> `
  -TemplateParameterFile <path-to-parameters-file>
```

## Data preparation

After you have prepared your storage account and assigned required permissions, You need to prepare your data and upload it to your blob container.
You can only use `.txt`. files for custom text. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CogSLanguageUtilities/blob/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your file format.
You can upload an unlabeled dataset or a labeled  dataset to your container.
Learn how to [tag your data](tag-data.md) using Language Studio.

You can create and upload training files from Azure directly or through using the Azure Storage Explorer tool. Using Azure Storage Explorer tool allows you to upload more data in less time.

* [Create and upload files from Azure](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
* [Create and upload files using Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-blobs)

* All files uploaded in your container should contain data, empty files will not considered for training.

[!TIP]
> [**Review recommended practices**](../concepts/recommended-practices.md) for data selection

## Next steps

* Get Started with Language Studio for [classification](../quickstart/using-language-studio.md)
