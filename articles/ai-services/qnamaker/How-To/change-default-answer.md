---
title: Get default answer - QnA Maker
description: The default answer is returned when there is no match to the question. You may want to change the default answer from the standard default answer.
ms.service: azure-ai-language
manager: nitinme
ms.author: jboback
author: jboback
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
ms.date: 12/19/2023
ms.custom: ignite-fall-2021
---

# Change default answer for a QnA Maker resource

The default answer for a knowledge base is meant to be returned when an answer is not found. If you are using a client application, such as the [Azure AI Bot Service](/azure/bot-service/bot-builder-howto-qna), it may also have a separate default answer, indicating no answer met the score threshold.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

## Types of default answer

There are two types of default answer in your knowledge base. It is important to understand how and when each is returned from a prediction query:

|Types of default answers|Description of answer|
|--|--|
|KB answer when no answer is determined|`No good match found in KB.` - When the [GenerateAnswer API](/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer) finds no matching answer to the question, the `DefaultAnswer` setting of the App service is returned. All knowledge bases in the same QnA Maker resource share the same default answer text.<br>You can manage the setting in the Azure portal, via the App service, or with the REST APIs for [getting](/rest/api/appservice/webapps/listapplicationsettings) or [updating](/rest/api/appservice/webapps/updateapplicationsettings) the setting.|
|Follow-up prompt instruction text|When using a follow-up prompt in a conversation flow, you may not need an answer in the QnA pair because you want the user to select from the follow-up prompts. In this case, set specific text by setting the default answer text, which is returned with each prediction for follow-up prompts. The text is meant to display as instructional text to the selection of follow-up prompts. An example for this default answer text is `Please select from the following choices`. This configuration is explained in the next few sections of this document. Can also set as part of knowledge base definition of `defaultAnswerUsedForExtraction` using [REST API](/rest/api/cognitiveservices/qnamaker/knowledgebase/create).|

### Client application integration

For a client application, such as a bot with the **Azure AI Bot Service**, you can choose from the common following scenarios:

* Use the knowledge base's setting
* Use different text in the client application to distinguish when an answer is returned but doesn't meet the score threshold. This text can either be static text stored in code, or can be stored in the client application's settings list.

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
