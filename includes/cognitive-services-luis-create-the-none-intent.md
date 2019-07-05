---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.subservice: luis
ms.topic: include
ms.custom: include file
ms.date: 12/21/2018
ms.author: diberry
---

The client application needs to know if an utterance is not meaningful or appropriate for the application. The **None** intent is added to each application as part of the creation process to determine if an utterance can't be answered by the client application.

If LUIS returns the **None** intent for an utterance, your client application can ask if the user wants to end the conversation or give more directions for continuing the conversation. 

> [!CAUTION] 
> Do not leave the **None** intent empty. 

1. Select **Intents** from the left panel.

2. Select the **None** intent. Add three utterances that your user might enter but are not relevant to your Human Resources app:

    | Example utterances|
    |--|
    |Barking dogs are annoying|
    |Order a pizza for me|
    |Penguins in the ocean|
