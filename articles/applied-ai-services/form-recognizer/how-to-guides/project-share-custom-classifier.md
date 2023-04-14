---
title: "Share custom model projects using Form Recognizer Studio"
titleSuffix: Azure Applied AI Services
description: Learn how to share custom model projects using Form Recognizer Studio.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 04/14/2023
ms.author: jppark
monikerRange: 'form-recog-3.0.0'
recommendations: false
---

# Share custom model projects using Form Recognizer Studio

Form Recognizer Studio is an online tool to visually explore, understand, train, and integrate features from the Form Recognizer service into your applications. Form Recognizer Studio enables project sharing feature within the custom extraction model. Projects can be shared easily via a project token. The same project token can also be used to import a project.

## Prerequisite

In order to share and import your custom extraction projects seamlessly, both users (user who shares and user who imports) need to check if they have been granted or have access to certain permission.

 > [!IMPORTANT]
 > Custom model projects can be imported only if you have the access to the storage account that is associated with the project you are trying to import. Check your storage account permission before starting to share or import projects with others.

### Managed identity

Enable a system-assigned managed identity for your Form Recognizer resource. A system-assigned managed identity is enabled directly on a service instance. It isn't enabled by default; you must go to your resource and update the identity setting.

For more information, *see*, [Enable a system-assigned managed identity](../managed-identities.md#enable-a-system-assigned-managed-identity)

### Role-based access control (RBAC)

Grant your Form Recognizer managed identity access to your storage account using Azure role-based access control (Azure RBAC). The [Storage Blob Data Reader](../../..//role-based-access-control/built-in-roles.md#storage-blob-data-reader) role grants read and list permissions to Azure Storage containers and blobs.

For more information, *see*, [Grant access to your storage account](../managed-identities.md#grant-access-to-your-storage-account)

### Configure cross origin resource sharing (CORS)

CORS needs to be configured in your Azure storage account for it to be accessible to the Form Recognizer Studio. You can update the CORS setting in the Azure portal.

Form more information, *see* [Configure CORS](../quickstarts/try-form-recognizer-studio.md#configure-cors)

### Virtual networks and firewalls

If your storage account VNet is enabled or if there are any firewall constraints, the project cannot be shared. If you want to bypass those restrictions, ensure that those settings are turned off.

A workaround is to manually create a project using the same settings as the project being shared.

## User sharing requirements

The user sharing the project needs to create a project **`ListAccountSAS`** to configure the storage account CORS and a `ListServiceSAS` to generate a SAS token for *read*, *write* and *list* container's file in addition to blob storage data *update* permissions.

### User importing requirements

User who wants to import the project will need ListServiceSAS to generate a SAS token for *read*, *write* and *list* container's file in addition to blob storage data *update* permissions.

## Share a custom extraction model with Form Recognizer studio

Follow the steps below to share your project using Form Recognizer studio.

1. Start by navigating to the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio).

1. In the Studio, select the **Custom extraction models** tile, under the custom models section.

:::image type="content" source="../media/how-to/studio-custom-extraction.png" alt-text="Screenshot showing how to select a custom extraction model in the Studio.":::

1. On the custom extraction models page, select the desired model to share and then select the **Share** button.

:::image type="content" source="../media/how-to/studio-project-share.png" alt-text="Screenshot showing how to select the desired model and select the share option.":::

1. On the share project dialog, copy the project token for the selected project.

:::image type="content" source="../media/how-to/studio-project-token.png" alt-text="Screenshot showing how to copy the project token.":::

## Import custom extraction model with Form Recognizer studio

Follow the steps below to import a project using Form Recognizer studio.

1. Start by navigating to the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio).

1. In the Studio, select the **Custom extraction models** tile, under the custom models section.

:::image type="content" source="../media/how-to/studio-custom-extraction.png" alt-text="Screenshot: Select custom extraction model in the Studio.":::

1. On the custom extraction models page, select the **Import** button.

:::image type="content" source="../media/how-to/studio-project-import.png" alt-text="Screenshot: Select import within custom extraction model page.":::

1. On the import project dialog, paste the project token shared with you and select import.

:::image type="content" source="../media/how-to/studio-import-token.png" alt-text="Screenshot: Paste the project token in the dialogue.":::
