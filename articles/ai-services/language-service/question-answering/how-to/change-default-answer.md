---
title: Get default answer - custom question answering
description: The default answer is returned when there is no match to the question. You may want to change the default answer from the standard default answer in custom question answering.
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
author: jboback
ms.author: jboback
ms.custom: language-service-question-answering, ignite-fall-2021
---

# Change default answer for question answering

The default answer for a project is meant to be returned when an answer is not found. If you are using a client application, such as the [Azure AI Bot Service](/azure/bot-service/bot-builder-howto-qna), it may also have a separate default answer, indicating no answer met the score threshold.

## Default answer


|Default answer|Description of answer|
|--|--|
|KB answer when no answer is determined|`No good match found in KB.` - When the question answering API finds no matching answer to the question it displays a default text response. In Custom question answering, you can set this text in the **Settings** of your project. |

### Client application integration

For a client application, such as a bot with the [Azure AI Bot Service](/azure/bot-service/bot-builder-howto-qna), you can choose from the following scenarios:

* Use your project's setting
* Use different text in the client application to distinguish when an answer is returned but doesn't meet the score threshold. This text can either be static text stored in code, or can be stored in the client application's settings list.

## Change default answer in Language Studio

The project default answer is returned when no answer is returned from question answering.

1. Sign in to the [Language Studio](https://language.azure.com). Go to Custom question answering and select your project from the list.
1. Select **Settings** from the left navigation bar.
1. Change the value of **Default answer when no answer found** > Select **Save**.

> [!div class="mx-imgBorder"]
> ![Screenshot of project settings with red box around the default answer](../media/change-default-answer/settings.png)

## Next steps

* [Create a project](manage-knowledge-base.md)
