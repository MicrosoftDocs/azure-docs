---
title: "Share custom model projects using Document Intelligence (formerly Form Recognizer) Studio"
titleSuffix: Azure AI services
description: Learn how to share custom model projects using Document Intelligence Studio.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/18/2023
ms.author: jppark
monikerRange: '>=doc-intel-3.0.0'
---


# Project sharing using Document Intelligence Studio

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [applies to v4.0](../includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](../includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](../includes/applies-to-v30.md)]
::: moniker-end

Document Intelligence Studio is an online tool to visually explore, understand, train, and integrate features from the Document Intelligence service into your applications. Document Intelligence Studio enables project sharing feature within the custom extraction model. Projects can be shared easily via a project token. The same project token can also be used to import a project.

## Prerequisite

In order to share and import your custom extraction projects seamlessly, both users (user who shares and user who imports) need an An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/). Also, both users need to configure permissions to grant access to the Document Intelligence and storage resources.

Generally, in the process of creating a custom model project, most of the requirements should have been met for project sharing. However, in cases where the project sharing feature doesn't work, check [permissions](#granted-access-and-permissions).

## Granted access and permissions

 > [!IMPORTANT]
 > Custom model projects can be imported only if you have the access to the storage account that is associated with the project you are trying to import. Check your storage account permission before starting to share or import projects with others.

### Virtual networks and firewalls

If your storage account VNet is enabled or if there are any firewall constraints, the project can't be shared. If you want to bypass those restrictions, ensure that those settings are turned off.

A workaround is to manually create a project using the same settings as the project being shared.

## Share a custom extraction model with Document Intelligence Studio

Follow these steps to share your project using Document Intelligence Studio:

1. Start by navigating to the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

1. In the Studio, select the **Custom extraction models** tile, under the custom models section.

   :::image type="content" source="../media/how-to/studio-custom-extraction.png" alt-text="Screenshot showing how to select a custom extraction model in the Studio.":::

1. On the custom extraction models page, select the desired model to share and then select the **Share** button.

   :::image type="content" source="../media/how-to/studio-project-share.png" alt-text="Screenshot showing how to select the desired model and select the share option.":::

1. On the share project dialog, copy the project token for the selected project.

:::image type="content" source="../media/how-to/studio-project-token.png" alt-text="Screenshot showing how to copy the project token.":::

## Import custom extraction model with Document Intelligence Studio

Follow these steps to import a project using Document Intelligence Studio.

1. Start by navigating to the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

1. In the Studio, select the **Custom extraction models** tile, under the custom models section.

   :::image type="content" source="../media/how-to/studio-custom-extraction.png" alt-text="Screenshot of Select custom extraction model in the Studio.":::

1. On the custom extraction models page, select the **Import** button.

   :::image type="content" source="../media/how-to/studio-project-import.png" alt-text="Screenshot of Select import within custom extraction model page.":::

1. On the import project dialog, paste the project token shared with you and select import.

:::image type="content" source="../media/how-to/studio-import-token.png" alt-text="Screenshot of Paste the project token in the dialogue.":::

## Next steps

> [!div class="nextstepaction"]
> [Back up and recover models](../disaster-recovery.md)
