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

## Creating Azure resources

Before you start using custom classification, you will need a Language Services resource. We recommend the steps in the [quickstart](../quickstart/using-language-studio.md) for creating one in the Azure portal. Creating a resource in the Azure portal lets you create an Azure blob storage account at the same time, with all of the required permissions pre-configured. 

You can also create a resource in Language Studio by clicking the settings icon in the top right corner, selecting **Resources**, then clicking **Create a new resource**. If you use this process, or have a preexisting storage account you'd like to use, you will have to [create an Azure Blob storage account](/azure/storage/common/storage-account-create). Afterwards you'll need to:
1. Enable identity management on your Azure resource.
2. Set contributor roles on the storage account

> [!NOTE]
> To use custom classification, you'll need a Language Services resource in **West US 2** or **West Europe** with the Standard (S) pricing tier.

### Identity management for your Language Services resource

Your Language Services resource must have identity management, which can be enabled either using the Azure portal or from Language Studio. To enable it using [Language Studio](https://language.azure.com/):
1. Click the settings icon in the top right corner of the screen
2. Select **Resources**
3. Select **Managed Identity** for your Azure resource.

### Contributor roles for your storage account

Your Azure blob storage account must have the below contributor roles:

* Your resource has the **owner** or **contributor** role on the storage account.
* Your resource has the **Storage blob data owner** or **Storage blob data contributor** role on the storage account.
* Your resource has the **Reader** role on the storage account.

To set proper roles on your storage account:

1. Go to your storage account page in the [Azure portal](https://ms.portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the **Owner** or **Contributor** role. You can search for user names in the **Select** field.

[!INCLUDE [Storage connection note](../includes/storage-account-note.md)]

## Next steps

* [Custom classification quickstart](../quickstart/using-language-studio.md)
* [Recommended practices](recommended-practices.md)