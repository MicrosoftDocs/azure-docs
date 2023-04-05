---
title: "Share custom model projects"
titleSuffix: Azure Applied AI Services
description: Learn how to share custom model projects using Form Recognizer Studio.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 03/30/2023
ms.author: jppark
monikerRange: 'form-recog-3.0.0'
recommendations: false
---

# Project sharing capability

Form Recognizer studio now enables project sharing feature within the custom extraction model. Projects can be shared easily via a project token and this same token can be used to import the project. 

## Prerequisite before sharing custom extraction project

In order to share and import projects seamlessly, both sides of the users (user who shares and user who imports) need to check if they have granted or have access to certain permission.

 > [!IMPORTANT]
 > Custom model projects can be imported only if you have the access to the storage account that is associated with the project you are trying to import. Check your storage account permission first before sharing your project or importing project from someone else.

Note that by defining a custom role in [Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles), you would be able to define custom roles for managing access to your storage account. In addition to Form Recognizer specific privileges, the project also requires additional storage privileges as well. For the Studio to communicate with the storage account, CORS rules need to be configured on the storage account, that requires [specific privileges](https://learn.microsoft.com/en-us/rest/api/storageservices/set-blob-service-properties?tabs=azure-ad).

### User sharing the project
User who wants to share the project first needs to create a project ListAccountSAS to configure storage account's CORS as well as ListServiceSAS to generate a SAS token for *read*, *write* and *list* container's file in addition to blob storage data *update* permissions.

### User importing the project
User who wants to import the project will need ListServiceSAS to generate a SAS token for *read*, *write* and *list* container's file in addition to blob storage data *update* permissions.

## Share a custom extraction model with Form Recognizer studio

Follow the steps below to share your project using Form Recognizer studio.

1. Start by navigating to the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio).

1. In the Studio, select the **Custom extraction models** tile, under the custom models section.

:::image type="content" source="../media/how-to/studio-custom-extraction.png" alt-text="Screenshot: Select custom extraction model in the Studio.":::

1. On the custom extraction models page, select the desired model to share and then select the **Share** button.

:::image type="content" source="../media/how-to/studio-project-share.png" alt-text="Screenshot: Select the desired model and select share.":::

1. On the share project dialog, copy the project token for the selected project.

:::image type="content" source="../media/how-to/studio-project-token.png" alt-text="Screenshot: Copy the project token.":::


## Import custom extraction model with Form Recognizer studio

Follow the steps below to import a project using Form Recognizer studio.

1. Start by navigating to the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio).

1. In the Studio, select the **Custom extraction models** tile, under the custom models section.

:::image type="content" source="../media/how-to/studio-custom-extraction.png" alt-text="Screenshot: Select custom extraction model in the Studio.":::

1. On the custom extraction models page, select the **Import** button.

:::image type="content" source="../media/how-to/studio-project-import.png" alt-text="Screenshot: Select import within custom extraction model page.":::

1. On the import project dialog, paste the project token shared with you and select import.

:::image type="content" source="../media/how-to/studio-import-token.png" alt-text="Screenshot: Paste the project token in the dialogue.":::
