---
title: Copy a custom model
titleSuffix: Azure AI services
description: This article explains how to copy a custom model to another workspace using the Azure AI Translator Custom Translator.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: how-to
---
# Copy a custom model

Copying a model to other workspaces enables model lifecycle management (for example, development → test → production) and increases usage scalability while reducing the training cost.

## Copy model to another workspace

   > [!Note]
   >
   > To copy model from one workspace to another, you must have an **Owner** role in both workspaces.
   >
   > The copied model cannot be recopied. You can only rename, delete, or publish a copied model.

1. After successful model training, select the **Model details** blade.

1. Select the **Model Name** to copy.

1. Select **Copy to workspace**.

1. Fill out the target details.

   :::image type="content" source="../media/how-to/copy-model-1.png" alt-text="Screenshot illustrating the copy model dialog window.":::

   > [!Note]
      >
      > A dropdown list displays the list of workspaces available to use. Otherwise, select **Create a new workspace**.
      >
      > If selected workspace contains a project for the same language pair, it can be selected from the Project dropdown list, otherwise, select **Create a new project** to create one.

1. Select **Copy model**.

1. A notification panel shows the copy progress. The process should complete fairly quickly:

   :::image type="content" source="../media/how-to/copy-model-2.png" alt-text="Screenshot illustrating notification that the copy model is in process.":::

1. After **Copy model** completion, a copied model is available in the target workspace and ready to publish. A **Copied model** watermark is appended to the model name.

   :::image type="content" source="../media/how-to/copy-model-3.png" alt-text="Screenshot illustrating the copy complete dialog window.":::

## Next steps

> [!div class="nextstepaction"]
> [Learn how to publish/deploy a custom model](publish-model.md).
