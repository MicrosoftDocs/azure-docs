---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.custom: include file
ms.date: 02/14/2020
ms.subservice: language-understanding
ms.author: diberry
---

The client application needs to know if an utterance is not meaningful or appropriate for the application. The **None** intent is added to each application as part of the creation process to determine if an utterance shouldn't be answered by the client application.

If LUIS returns the **None** intent for an utterance, your client application can ask if the user wants to end the conversation or give more directions for continuing the conversation.

If you leave the **None** intent empty, an utterance that should be predicted outside the subject domain will be predicted in one of the existing subject domain intents. The result is that the client application, such as a chat bot, will perform incorrect operations based on an incorrect prediction.

1. Select **Intents** from the left panel.

1. Select the **None** intent. Add three utterances that your user might enter but are not relevant to your Pizza ordering app:

    |`None` example utterances|
    |--|
    |`Barking dogs are annoying`|
    |`Penguins in the ocean`|

    These examples shouldn't use words you expect in your subject domain such as `pizza`, `cheese`, `crust`, `pickup` `deliver`.