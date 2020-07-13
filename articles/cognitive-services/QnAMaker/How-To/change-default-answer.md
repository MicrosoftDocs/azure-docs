---
title: Get default answer - QnA Maker
description: The default answer is returned when there is no match to the question. You may want to change the default answer from the standard default answer.
ms.topic: how-to
ms.date: 07/13/2020
---

# Change default answer for a QnA Maker resource

The default answer for a knowledge base is meant to be returned when an answer is not found. If you are using a client application, such as the [Azure Bot service](https://docs.microsoft.com/azure/bot-service/bot-builder-howto-qna?view=azure-bot-service-4.0&tabs=cs#calling-qna-maker-from-your-bot), it may also have a separate default answer, indicating no answer met the score threshold.

## Types of default answer

There are two types of default answer in your knowledge base. It is important to understand how and when each is returned from a prediction query:


|Type of question|Description of Answer|
|--|--|
|KB answer when no answer is determined|`No good match found in KB.` - When the [GenerateAnswer API](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer) finds no matching answer to the question, this is the text returned.<br>Change this text in the App Service's Application Settings for your QnA Maker service. All knowledge bases in the same QnA Maker service share the same default answer text. Can update `DefaultAnswer` setting with [REST API](https://docs.microsoft.com/rest/api/appservice/webapps/updateapplicationsettings)|
|Follow-up prompt instruction text|When using a follow-up prompt in a conversation flow, you may not need an answer in the QnA pair because you want the user to select from the follow-up prompts. In this case, set specific text by setting the default answer text, which is returned with each prediction for follow-up prompts. The text is meant to display as instructional text to the selection of follow-up prompts. An example for this default answer text is `Please select from the following choices`. This configuration is explained in the next few sections of this document. Can also set as part of knowledge base definition of `defaultAnswerUsedForExtraction` using [REST API](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/create).|


## Set follow-up prompt's default answer when you create knowledge base

When you create a new knowledge base, the default answer text is one of the settings. If you choose not to set it during the creation process, you can change it later with the following procedure.

## Change follow-up prompt's default answer in QnA Maker portal

The knowledge base default answer is returned when no answer is returned from the QnA Maker service.

1. Sign in to the [QnA Maker portal](https://www.qnamaker.ai/) and select your knowledge base from the list.
1. Select **Settings** from the navigation bar.
1. Change the value of **Default answer text** in the **Manage knowledge base** section.

    :::image type="content" source="../media/qnamaker-concepts-confidencescore/change-default-answer.png" alt-text="Screenshot of QnA Maker portal, Settings page, with default answer textbox highlighted.":::

1. Select **Save and train** to save the change.

## Next steps

* [Create a knowledge base](../How-to/manage-knowledge-bases.md)