---
title: Migrate QnA Maker knowledge bases to custom question answering
description: Migrate your legacy QnAMaker knowledge bases to custom question answering to take advantage of the latest features.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: how-to
ms.author: diagarw
author: DishaAgarwal
ms.date: 09/30/2021
---

# Migrate from QnA Maker to custom question answering

Custom question answering was introduced in May 2021 with several new features including enhanced relevance using a deep learning ranker, precise answers, and end-to-end region support. Each custom question answering project is equivalent to a knowledge base in QnA Maker. Users can easily migrate knowledge bases from a QnA Maker resource to custom question answering projects within a [language resource](https://aka.ms/create-language-resource). Users can also choose to migrate knowledge bases from multiple QnA Maker resources to a specific language resource.

To successfully migrate knowledgebases, **users need contributor access to the selected QnA Maker and language resource**. When a knowledge base is migrated, the following details are copied to the new custom question answering project:

- QnA pairs including active learning suggestions
- Synonyms and default answer from the QnA Maker resource
- Knowledge base name is copied as project description

Resource level settings such as Role-based access control (RBAC) settings are not migrated to the new resource. Such resource level settings would have to be reconfigured for the language resource. You also need to [enable analytics](analytics.md) for the language resource again.

## QnA Maker knowledge base migration

Users can follow the steps below to migrate knowledge bases:

1. Create a [language resource](https://aka.ms/create-language-resource) with custom question answering enabled in advance. When you create the language resource in Azure portal, you will see the option to enable custom question answering. When you select that option and proceed, you will be asked for Azure search details to save the knowledge bases.

2. If you want to add knowledge bases in multiple languages to your language resource, visit [Language Studio](https://lanuage.azure.com) to create your first custom question answering project and select the first option as shown below. Language setting for the language resource can be specified only when creating a project. If you want to migrate existing knowledge bases in a single language to the language resource, you can skip this step.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of language selection for creating a new project](../media/migrate-qnamaker/choose-language.png)

3. Visit [https://www.qnamaker.ai](https://www.qnamaker.ai) and select **Start Migration** in the migration note on the knowledge bases page. A dialog box will open to initiate the migration.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of message at the top of qnamaker.ai UI with a button for "Start Migration"](../media/migrate-qnamaker/start-migration.png)

4. Fill in the details required to initiate migration. The tenant will be auto-selected. You can choose to switch the tenant.

   > [!div class="mx-imgBorder"]
   > ![Migrate QnAMaker with red selection box around the tenant selection option](../media/migrate-qnamaker/tenant-selection.png)

5. Select the QnA Maker resource, which contains the knowledge bases to be migrated.

   > [!div class="mx-imgBorder"]
   > ![Migrate QnAMaker with red selection box around the QnAMaker resource selection option](../media/migrate-qnamaker/select-resource.png)

6. Select the language resource to which you want to migrate the knowledge bases. You will only be able to see those language resources that have custom question answering enabled. The language setting for the language resource is displayed in the options. You won’t be able to migrate knowledge bases in multiple languages from QnA Maker resources to a language resource if its language setting is not specified.

   > [!div class="mx-imgBorder"]
   > ![Migrate QnAMaker with red selection box around the language resource option currently selected resource contains the information that language is unspecified](../media/migrate-qnamaker/language-setting.png)

    If you want to migrate knowledge bases in multiple languages to the language resource, you must enable multiple language setting when creating the first custom question answering project for the language resource. You can do so by following the instructions in step #2. If the language setting for the language resource is not specified, it is assigned the language of the selected QnA Maker resource.

7. Select all the knowledge bases that you wish to migrate > Select **Next**.

   > [!div class="mx-imgBorder"]
   > ![Migrate QnAMaker with red selection box around the knowledge base selection option with a drop-down displaying three knowledge base names](../media/migrate-qnamaker/select-knowledge-bases.png)

8. You can review the knowledge bases you plan to migrate. There could be some validation errors in project names as we follow stricter validation rules for custom question answering projects. 

    > [!CAUTION]
    > If you migrate a knowledge base with the same name as a project that already exists in the target language resource, **the content of the project will be overridden** by the content of the selected knowledge base.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of an error message starting project names can't contain special characters](../media/migrate-qnamaker/special-characters.png)

9. After resolving any validation errors, select **Next**

    > [!div class="mx-imgBorder"]
    > ![Screenshot with special characters removed](../media/migrate-qnamaker/validation-errors.png)

10. It will take a few minutes for the migration to occur. Do not cancel the migration while it is in progress. You can navigate to the migrated projects within the [Language Studio](https://lanuage.azure.com) post migration.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of successfully migrated knowledge bases with information that you can publish by using the Language Studio](../media/migrate-qnamaker/migration-success.png)

    If any knowledge bases fail to migrate to custom question answering projects, an error will be displayed. The most common migration errors occur when:
    
    - Your source and target resources are invalid.
    - You are trying to migrate an empty knowledge base (KB)
    - You have reached the limit for an Azure Search instance linked to your target resources.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of a failed migration with an example error](../media/migrate-qnamaker/migration-errors.png)

    Once you resolve these errors, you can rerun the migration.

11. The migration will only copy the test instances of your knowledge bases. Once your migration is complete, you will need to manually deploy the knowledge bases to copy the test index to the production index.

## Next steps

- Learn how to re-enable analytics and telemetry with [Azure Monitor diagnostic logs](analytics.md).