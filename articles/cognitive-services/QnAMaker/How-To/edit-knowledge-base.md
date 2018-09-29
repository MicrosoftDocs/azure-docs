---
title: Edit a knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: QnA Maker allows you to manage the content of your knowledge base by providing an easy-to-use editing experience. 
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---
# Edit a knowledge base

QnA Maker allows you to manage the content of your knowledge base by providing an easy-to-use editing experience.

## Edit your knowledge base content

1.  Select **My knowledge bases** in the top navigation bar. 

    You can see all the services you created or shared with you sorted in the descending order of the **last modified** date.

    ![My Knowledge Bases](../media/qnamaker-how-to-edit-kb/my-kbs.png)

2. Select a particular knowledge base to make edits to it.
 
3. Click on **Settings**.

   Here you can edit mandatory field Service Name.
  
   You can add new Urls to add new FAQ content to Knowledgebase by clicking **Manage knowledgebase -> '+ Add URL'** link.
   
   You can delete existing URLs by clicking on **delete icon**.
   
   If you want Knowledgebase to Crawl the latest content of existing URLs, tick the Check Box name **'Refresh'**, this will update the   Knowledgebase with latest URL content.
   
You can add supported file document to be part of knowledgebase, by clicking **Manage knowledgebase -> '+ Add File'**

You can also import any existing knowledgebase by clicking **'Ímport Knowledgebase'** button. 
   
Updation of knowledgebase depends on **management pricing tier** being used while creating QnA Maker service associated with your knowledgbase. You can also update the management tier from Azure portal if required.

4. Once you are done making changes to the Knowledge base, click on **Save and train** in the top right corner of the page in order to persist the changes.    

    ![Save and Train](../media/qnamaker-how-to-edit-kb/save-and-train.png)

    >[!NOTE]
	Leaving the page before clicking on Save and train will not persist the changes.

## Add a QnA pair

Select **Add QnA pair** to add a new row to the knowledge base table.

![Add QnA pair](../media/qnamaker-how-to-edit-kb/add-qnapair.png)

## Delete a QnA pair

To delete a QnA, click the **delete** icon on the far right of the QnA row.

![Delete QnA pair](../media/qnamaker-how-to-edit-kb/delete-qnapair.png)

## Add alternate questions

Add alternate questions to an existing QnA pair to improve the likelihood of a match to a user query.

![Add Alternate Questions](../media/qnamaker-how-to-edit-kb/add-alternate-question.png)

## Add metadata


Add metadata pairs by selecting the filter icon

![Add Metadata](../media/qnamaker-how-to-edit-kb/add-metadata.png)

> [!TIP]
> Make sure to periodically Save and train the knowledge base after making edits to avoid losing changes.

## Manage large knowledge bases

1. The QnAs are **grouped** by the data source from which they were extracted. You can expand or collapse the data source.
2. You can **search** the knowledge base by typing in the text box at the top of the Knowledge Base table. Click enter to search on the question, answer or metadata content. Click on the X icon to remove the search filter.
3. **Pagination** allows you to manage large knowledge bases

    ![Search, Paginate, Group](../media/qnamaker-how-to-edit-kb/search-paginate-group.png)

## Next steps

> [!div class="nextstepaction"]
> [Collaborate on a knowledge base](./collaborate-knowledge-base.md)
