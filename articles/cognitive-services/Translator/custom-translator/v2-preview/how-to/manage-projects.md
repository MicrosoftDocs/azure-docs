---
title: How to manage a project - Custom Translator
titleSuffix: Azure Cognitive Services
description: How to create and manage a project with the Azure Cognitive Services Custom Translator v2.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 08/17/2020
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand how to create project, so that I can build and manage a project.
---
# How to manage a Custom Translator project | Preview

> [!IMPORTANT]
> Custom Translator v2.1 is currently in public preview. Some features may not be supported or have constrained capabilities.

A project is a container for a models, documents, and tests. Each project automatically includes all documents that are uploaded into that workspace that have the correct language pair.

Creating project is the first step toward building and publishing a model.

## Create project

1. After sign-in, your default workspace is loaded.
    - To create a project in different workspace, click **My workspaces**, then click the workspace name
2. Click **Create project**
3. Enter the following details about your project in the dialog:

    a.  **Project name (required):** Give your project a unique, meaningful name. It's not necessary to mention the languages within the title.

    b.  **Language pair (required):** Select the source and target languages from the dropdown list

    c.  **Domain (required):** Select the domain from the dropdown list that's most appropriate for
        your project. The category describes the terminology and style of the
        documents you intend to translate.

    >[!Note]
    >Click **Show advanced options** to add project label, project description, and domain description

    d.  **Project label:** The project label distinguishes between
        projects with the same language pair and domain. As best practices,
        use a label *only* if you're planning to build multiple projects for
        the same language pair and same domain and want to access these
        projects with a different Domain ID. Don't use this field if you're
        building systems for one domain only. A project label is not required
        and not helpful to distinguish between language pairs. You can use the
        same label for multiple projects.

    e.  **Project description:** A short summary about the project. This description has no
        influence over the behavior of the Custom Translator or your resulting
        custom system, but can help you differentiate between different
        projects.

    f.  **Domain description:** Use this field to better describe the particular
        field or industry in which you're working. For example, if your
        category is medicine, you might add a particular document, such a surgery,
        or pediatrics. The description has no influence over the behavior of the
        Custom Translator or your resulting custom system.

    ![Create project dialog](../media/how-to/create-project-dialog.png)

3. Click **Create project**

## Edit project

To modify the project name, project description and domain description:

1. Click the workspace name, e.g., `Contoso MT models`.
2. Select the project name, e.g., `English to German`.
3. **Edit and Delete** buttons are now visible.

    ![Edit project](../media/how-to/edit-project-dialog-1.png)

4. Click **Edit** and fill in or modify existing text.

    ![Edit project details](../media/how-to/edit-project-dialog-2.png)

5. Click **Edit project** to save.

## Delete project

1. Follow **Edit a project** steps 1-3
2. Click **Delete** and read the delete message before you click **Delete project** to confirm.

    ![Delete project dialog](../media/how-to/delete-project-1.png)

>[!Note]
>If your project has published model or in training status, delete fails with the Following message:
>
> ![Unable to delete project](../media/how-to/delete-project-2.png)

## Next steps

- Learn [how to manage project documents](build-upload-training-sets.md).
- Learn [how to train a model](train-custom-model.md).
- Learn [how to test and evaluate model quality](test-model-details.md).
- Learn [how to publish model](publish-model.md).
- Learn [how to translate with custom models](translate-with-custom-model.md).
