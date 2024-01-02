---
title: Adding chit-chat to a QnA Maker knowledge base
titleSuffix: Azure AI services
description: Adding personal chit-chat to your bot makes it more conversational and engaging when you create a KB. QnA Maker allows you to easily add a pre-populated set of the top chit-chat, into your KB.
#services: cognitive-services
manager: nitinme
ms.author: jboback
author: jboback
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
ms.date: 12/19/2023
ms.custom: ignite-fall-2021
---

# Add Chit-chat to a knowledge base

Adding chit-chat to your bot makes it more conversational and engaging. The chit-chat feature in QnA maker allows you to easily add a pre-populated set of the top chit-chat, into your knowledge base (KB). This can be a starting point for your bot's personality, and it will save you the time and cost of writing them from scratch.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

This dataset has about 100 scenarios of chit-chat in the voice of multiple personas, like Professional, Friendly and Witty. Choose the persona that most closely resembles your bot's voice. Given a user query, QnA Maker tries to match it with the closest known chit-chat QnA.

Some examples of the different personalities are below. You can see all the personality [datasets](https://github.com/microsoft/botframework-cli/blob/main/packages/qnamaker/docs/chit-chat-dataset.md) along with details of the personalities.

For the user query of `When is your birthday?`, each personality has a styled response:

<!-- added quotes so acrolinx doesn't score these sentences -->
|Personality|Example|
|--|--|
|Professional|Age doesn't really apply to me.|
|Friendly|I don't really have an age.|
|Witty|I'm age-free.|
|Caring|I don't have an age.|
|Enthusiastic|I'm a bot, so I don't have an age.|
||


## Language support

Chit-chat data sets are supported in the following languages:

|Language|
|--|
|Chinese|
|English|
|French|
|Germany|
|Italian|
|Japanese|
|Korean|
|Portuguese|
|Spanish|


## Add chit-chat during KB creation
During knowledge base creation, after adding your source URLs and files, there is an option for adding chit-chat. Choose the personality that you want as your chit-chat base. If you do not want to add chit-chat, or if you already have chit-chat support in your data sources, choose **None**.

## Add Chit-chat to an existing KB
Select your KB, and navigate to the **Settings** page. There is a link to all the chit-chat datasets in the appropriate **.tsv** format. Download the personality you want, then upload it as a file source. Make sure not to edit the format or the metadata when you download and upload the file.

![Add chit-chat to existing KB](../media/qnamaker-how-to-chit-chat/add-chit-chat-dataset.png)

## Edit your chit-chat questions and answers
When you edit your KB, you will see a new source for chit-chat, based on the personality you selected. You can now add altered questions or edit the responses, just like with any other source.

![Edit chit-chat QnAs](../media/qnamaker-how-to-chit-chat/edit-chit-chat.png)

To view the metadata, select **View Options** in the toolbar, then select **Show metadata**.

## Add additional chit-chat questions and answers
You can add a new chit-chat QnA pair that is not in the predefined data set. Ensure that you are not duplicating a QnA pair that is already covered in the chit-chat set. When you add any new chit-chat QnA, it gets added to your **Editorial** source. To ensure the ranker understands that this is chit-chat, add the metadata key/value pair "Editorial: chitchat", as seen in the following image:

:::image type="content" source="../media/qnamaker-how-to-chit-chat/add-new-chit-chat.png" alt-text="Add chit-chat QnAs" lightbox="../media/qnamaker-how-to-chit-chat/add-new-chit-chat.png":::

## Delete chit-chat from an existing KB
Select your KB, and navigate to the **Settings** page. Your specific chit-chat source is listed as a file, with the selected personality name. You can delete this as a source file.

![Delete chit-chat from KB](../media/qnamaker-how-to-chit-chat/delete-chit-chat.png)

## Next steps

> [!div class="nextstepaction"]
> [Import a knowledge base](../tutorials/export-knowledge-base.md)

## See also

[QnA Maker overview](../overview/overview.md)
