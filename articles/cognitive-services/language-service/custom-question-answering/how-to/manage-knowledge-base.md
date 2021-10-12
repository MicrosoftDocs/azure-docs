---
title: Manage knowledge bases - custom question answering
description: Custom question answering allows you to manage your knowledge bases by providing access to the knowledge base settings and content.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 11/02/2021
---

# Create and manage knowledge base settings

custom question answering allows you to manage your knowledge bases by providing access to the knowledge base settings and data sources.

## Prerequisites

> * If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.
> * A [Language resource](https://aka.ms/create-language-resource) with the custom question answering feature enabled in the Azure portal. Remember your Azure Active Directory ID, Subscription, and Languageresource name you selected when you created the resource.

## Create a knowledge base

1. Sign in to the [QnAMaker.ai](https://QnAMaker.ai) portal with your Azure credentials.

2. In the QnA Maker portal, select **Create a knowledge base**.

3. On the **Create** page, skip **Step 1** if you already have custom question answering added to a language resource. <!--TODO: Change link-->

    If you haven't created the service yet, select **Preview** and **Create a QnA service**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of create a new QnA service](../media/manage-knowledge-base/create-qna-service.png)

    You are directed to the [Azure portal](https://aka.ms/create-language-resource) to set up the language resource in your subscription. You should add the Custom question answering feature to the service on creation. 

    > [!div class="mx-imgBorder"]
    > ![Screenshot of selecting additional features](../../../qnamaker/media/qnamaker-how-to-setup-service/select-qna-feature-create-flow.png)
    
    Remember your Azure Active Directory ID, Subscription, language resource name you selected when you created the resource. When you are done creating the resource in the Azure portal, return to the QnA Maker portal, refresh the browser page, and continue to Step 2.

4. In **Step 2**, select your Active directory, subscription, service (resource), and the language for all knowledge bases created in the service.

    ![Screenshot of selecting a Custom Question Answering service](../media/manage-knowledge-base/connect-knowledgebase-custom-qna.png)

5. In **Step 2**, if you are creating the first knowledge base for your service, you can check **Add knowledge bases in multiple languages to this service** property to allow the capability to add knowledge bases in different languages to the same service. You won't be able to modify this later.

6. In **Step 3**, name your knowledge base **My Sample QnA KB**. 

7. In **Step 4**, configure the settings with the following table:

    |Setting|Value|
    |--|--|
    |**Enable multi-turn extraction from URLs, .pdf or .docx files.**|Checked|
    |**Default answer text**| `Quickstart - default answer not found.`|
     |**+ Add URL**|`https://azure.microsoft.com/support/faq/`|
    |**+ Add file**|Browse a file to upload.|
     |**Unstructured content**|Check this box to indicate that the file being uploaded has unstructured content. Checking the unstructured box would mean the document will be ingested entirely into the service. If you leave this unchecked, QnA pairs will be  extracted from the file. <br> The following image shows how unstructured files will look after upload.
     | |[!div class="mx-imgBorder"] ![Screenshot of unstructured file upload](../media/manage-knowledge-base/add-unstructured-file.png)|
    |**Chit-chat**|Select **Professional**|

## Edit knowledge base

1.  Select **My knowledge bases** in the top navigation bar.

       You can see all the services you created or shared with you sorted in the descending order of the **last modified** date.

       ![My Knowledge Bases](../../../qnamaker/media/qnamaker-how-to-edit-kb/my-kbs.png)

1. Select a particular knowledge base to make edits to it.

1.  Select **Settings**. The following list contains fields you can change.

     # [QnA Maker GA (stable release)](#tab/v1)
       |Goal|Action|
       |--|--|
       |Add URL|You can add new URLs to add new FAQ content to Knowledge base by clicking **Manage knowledge base -> '+ Add URL'** link.|
       |Delete URL|You can delete existing URLs by selecting the delete icon, the trash can.|
       |Refresh content|If you want your knowledge base to crawl the latest content of existing URLs, select the **Refresh** checkbox. This action will update the knowledge base with latest URL content once. This action is not setting a regular schedule of updates.|
       |Add file|You can add a supported file document to be part of a knowledge base, by selecting **Manage knowledge base**, then selecting **+ Add File**|
    |Import|You can also import any existing knowledge base by selecting **Import Knowledge base** button. |
    |Update|Updating of knowledge base depends on **management pricing tier** used while creating QnA Maker service associated with your knowledge base. You can also update the management tier from Azure portal if necessary.

    # [Custom Question Answering (preview release)](#tab/v2)
       |Goal|Action|
       |--|--|
       |Add URL|You can add new URLs to add new FAQ content to Knowledge base by clicking **Manage knowledge base -> '+ Add URL'** link.|
       |Delete URL|You can delete existing URLs by clicking the delete icon represented by the trash can.|
       |Refresh content|If you want your knowledge base to crawl the latest content of existing URLs, select the **Refresh** checkbox. This action will update the knowledge base with latest URL content once. This action is not about setting a regular schedule of updates.|
       |Add file|You can add a supported file document to be part of a knowledge base, by selecting **Manage knowledge base**, then selecting **+ Add File**|
       |Delete file|You can delete existing file by clicking the delete icon represented by the trash can.|
       |Mark content as unstructured|If you want to mark the uploaded file content as unstructured select the **Unstructured content** checkbox.|
       |Mark unstructured content as structured|You cannot mark a previously uploaded unstructured content as structured.|
    |Import|You can also import any existing knowledge base by selecting **Import Knowledge base** button. |
    |Update|Updating of knowledge base depends on **management pricing tier** used while creating QnA Maker service associated with your knowledge base. You can also update the management tier from Azure portal if necessary.


    <br/>
  1. Once you are done making changes to the knowledge base, select **Save and train** in the top-right corner of the page in order to persist the changes.

       ![Save and Train](../../../qnamaker/media/qnamaker-how-to-edit-kb/save-and-train.png)

       >[!CAUTION]
       >If you leave the page before selecting **Save and train**, all changes will be lost.



## Manage large knowledge bases

* **Data source groups**: The QnAs are grouped by the data source from which they were extracted. You can expand or collapse the data source.

    ![Use the QnA Maker data source bar to collapse and expand data source questions and answers](../../../qnamaker/media/qnamaker-how-to-edit-kb/data-source-grouping.png)

* **Search knowledge base**: You can search the knowledge base by typing in the text box at the top of the Knowledge Base table. Click enter to search on the question, answer, or metadata content. Click on the X icon to remove the search filter.

    ![Use the QnA Maker search box above the questions and answers to reduce the view to only filter-matching items](../../../qnamaker/media/qnamaker-how-to-edit-kb/search-paginate-group.png)

* **Pagination**: Quickly move through data sources to manage large knowledge bases

    ![Use the QnA Maker pagination features above the questions and answers to move through pages of questions and answers](../../../qnamaker/media/qnamaker-how-to-edit-kb/pagination.png)

## Delete knowledge bases

Deleting a knowledge base (KB) is a permanent operation. It can't be undone. Before deleting a knowledge base, you should export the knowledge base from the **Settings** page of the QnA Maker portal.

If you share your knowledge base with collaborators,](collaborate-knowledge-base.md) then delete it, everyone loses access to the KB.