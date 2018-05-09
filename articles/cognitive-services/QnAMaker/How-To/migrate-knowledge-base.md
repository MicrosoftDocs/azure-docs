---
title: How to import a knowledge base - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: How to import a knowledge base
services: cognitive-services
author: nstulasi
manager: sangitap
ms.service: cognitive-services
ms.component: QnAMaker
ms.topic: article
ms.date: 04/21/2018
ms.author: saneppal
---
# Import from a knowledge base in QnA Maker Preview
QnA Maker announced General Availability on May 7, 2018 at the \\\build\ conference. QnA Maker GA has a new architecture built on Azure. Knowledge bases created with QnA Maker Free Preview will need to be migrated to QnA Maker GA. QnA Maker Preview will be deprecated in November 2018. For more information about the changes in QnA Maker GA, see the QnA Maker GA announcement [blog post](https://aka.ms/qnamakerga-blog).

QnAMaker now has a [pricing model](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/qna-maker/).

Prerequisites
> [!div class="checklist"]
> * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
> * Setup a new [QnA Maker service](./set-up-qnamaker-service-azure.md)

## Migrate a knowledge base from QnAMaker Preview portal
1. Navigate to [QnA Maker Preview portal](https://aka.ms/qnamaker-old-portal
) and click on **My services**.
2. Select the knowledge base you want to migrate by clicking on the edit icon.

    ![Edit knowledge base](../media/qnamaker-how-to-migrate-kb/preview-editkb.png)

3. Click on **Download knowledge base** to download a .tsv file that contains the content of your knowledge base - questions, answers, metadata, and the data source names from which they were extracted.

    ![Download knowledge base](../media/qnamaker-how-to-migrate-kb/Preview-download.png)

4. In the current [QnA Maker portal](https://qnamaker.ai), learn how to [create a knowledge base](./create-knowledge-base.md).
5. Create a new empty knowledge base. To create an empty knowledge base, skip uploading and data sources in Step 4.

    ![Create empty knowledge base](../media/qnamaker-how-to-migrate-kb/create-empty-kb.png)

6. In this new Knowledge base, open the **Settings** tab and click on **Import knowledge base**. This imports the questions, answers, and metadata, and retains the data source names from which they were extracted.

    ![Import knowledge base](../media/qnamaker-how-to-migrate-kb/import.png)

7. **Test** the new knowledge base using the Test panel. Learn how to [test your knowledge base](./test-knowledge-base.md).
8. **Publish** the knowledge base. Learn how to [publish your knowledge base](./publish-knowledge-base.md).
9. Use the endpoint below in your application or bot code. See here how to [create a QnA bot](../Tutorials/create-qna-bot.md).

    ![QnA Maker values](../media/qnamaker-tutorials-create-bot/qnamaker-settings-kbid-key.PNG)

At this point, all the knowledge base content - questions, answers and metadata, along with the names of the source files and the URLs, are imported to the new knowledge base. 

## Chatlogs and alterations
Alterations (synonyms) are not imported automatically. Use the [V2 APIs](https://aka.ms/qnamaker-v2-apis) to export the alterations from the preview stack and the [V4 APIs](https://aka.ms/qnamaker-v4-apis) to replace in the new stack.

There is no way to migrate chatlogs, since the new stack uses Application Insights for storing chatlogs. You can however download the chatlogs from the [preview portal](https://aka.ms/qnamaker-old-portal).

## Next steps

> [!div class="nextstepaction"]
> [Edit a knowledge base](./edit-knowledge-base.md)