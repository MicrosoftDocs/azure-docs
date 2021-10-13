---
title: Get default answer - custom question answering
description: The default answer is returned when there is no match to the question. You may want to change the default answer from the standard default answer in custom question answering.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: how-to
ms.date: 11/02/2021
---

# Change default answer for question answering

The default answer for a project is meant to be returned when an answer is not found. If you are using a client application, such as the [Azure Bot service](/azure/bot-service/bot-builder-howto-qna), it may also have a separate default answer, indicating no answer met the score threshold.

## Types of default answer

There are two types of default answer in your knowledge base. It is important to understand how and when each is returned from a prediction query:

|Types of default answers|Description of answer|
|--|--|
|KB answer when no answer is determined|`No good match found in KB.` - When the question answering API finds no matching answer to the question it displays a default text response. In Custom question answering, you can set this text in the **Settings** of your project. |
|Follow-up prompt instruction text|When using a follow-up prompt in a conversation flow, you may not need an answer in the QnA pair because you want the user to select from the follow-up prompts. In this case, set specific text by setting the default answer text, which is returned with each prediction for follow-up prompts. The text is meant to display as instructional text to the selection of follow-up prompts. An example for this default answer text is `Please select from the following choices`. This configuration is explained in the next few sections of this document. You can also set this as part of a knowledge base definition with `defaultAnswerUsedForExtraction` using the REST API.|

### Client application integration

For a client application, such as a bot with the **Azure Bot service**, you can choose from the common following scenarios:

* Use your project/knowledge base's setting
* Use different text in the client application to distinguish when an answer is returned but doesn't meet the score threshold. This text can either be static text stored in code, or can be stored in the client application's settings list.

## Set follow-up prompt's default answer when you create knowledge base

When you create a new knowledge base, the default answer text is one of the settings. If you choose not to set it during the creation process, you can change it later with the following procedure.

## Change follow-up prompt's default answer in Language Studio

The knowledge base default answer is returned when no answer is returned from question answering.

1. Sign in to the [Language Studio](https://language.azure.com) and select your project from the list.
1. Select **Settings** from the left navigation bar.
1. Change the value of **Default answer when no answer found** > Select **Save**.

> [!div class="mx-imgBorder"]
> ![Screenshot of project settings with red box around the default answer](../media/change-default-answer/settings.png)

## Next steps

* [Create a knowledge base](manage-knowledge-base.md)
