---
title: Create and manage a project
titleSuffix: Azure AI services
description: How to create and manage a project in the Azure AI Translator Custom Translator.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: how-to
---

# Create and manage a project

A project contains translation models for one language pair. Each project includes all documents that were uploaded into that workspace with the correct language pair.

Creating a project is the first step in building and publishing a model.

## Create a project

1. After you sign in, your default workspace is loaded. To create a project in different workspace, select **My workspaces**, then select a workspace name.

1. Select **Create project**.

1. Enter the following details about your project in the creation dialog:

    - **Project name (required):** Give your project a unique, meaningful name. It's not necessary to mention the languages within the title.

    - **Language pair (required):** Select the source and target languages from the dropdown list

    - **Domain (required):** Select the domain from the dropdown list that's most appropriate for your project. The domain describes the terminology and style of the documents you intend to translate.

      >[!Note]
      >Select **Show advanced options** to add project label, project description, and domain description

    - **Project label:** The project label distinguishes between projects with the same language pair and domain. As a best practice, here are a few tips:

      - Use a label *only* if you're planning to build multiple projects for the same language pair and same domain and want to access these projects with a different Domain ID.

      - Don't use a label if you're building systems for one domain only.

      - A project label isn't required and not helpful to distinguish between language pairs.

      - You can use the same label for multiple projects.

    - **Project description:** A short summary about the project. This description has no influence over the behavior of the Custom Translator or your resulting custom system, but can help you differentiate between different projects.

    - **Domain description:** Use this field to better describe the particular field or industry in which you're working. or example, if your category is medicine, you might add details about your subfield, such as surgery or pediatrics. The description has no influence over the behavior of the Custom Translator or your resulting custom system.

1. Select **Create project**.

   :::image type="content" source="../media/how-to/create-project-dialog.png" alt-text="Screenshot illustrating the create project fields.":::

## Edit a project

To modify the project name, project description, or domain description:

1. Select the workspace name.

1. Select the project name, for example, *English-to-German*.

1. The **Edit and Delete** buttons should now be visible.

   :::image type="content" source="../media/how-to/edit-project-dialog-1.png" alt-text="Screenshot illustrating the edit project fields":::

1. Select **Edit** and fill in or modify existing text.

    :::image type="content" source="../media/how-to/edit-project-dialog-2.png" alt-text="Screenshot illustrating detailed edit project fields.":::

1. Select **Edit project** to save.

## Delete a project

1. Follow the [**Edit a project**](#edit-a-project) steps 1-3 above.

1. Select **Delete** and read the delete message before you select **Delete project** to confirm.

   :::image type="content" source="../media/how-to/delete-project-1.png" alt-text="Screenshot illustrating delete project fields.":::

   >[!Note]
   >If your project has a published model or a model that is currently in training, you will only be able to delete your project once your model is no longer published or training.
   >
   > :::image type="content" source="../media/how-to/delete-project-2.png" alt-text="Screenshot illustrating the unable to delete message.":::

## Next steps

- Learn [how to manage project documents](create-manage-training-documents.md).
- Learn [how to train a model](train-custom-model.md).
- Learn [how to test and evaluate model quality](test-your-model.md).
- Learn [how to publish model](publish-model.md).
- Learn [how to translate with custom models](translate-with-custom-model.md).
