---
title: 'How To: Use language generation templates for speech responses'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to configure a string parameter to refer to catalog exposed over a web endpoint.
services: cognitive-services
author: sausin
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: singhsaumya
---

# Use language generation templates for speech responses

In this article, you will learn how to use language generation templates for speech responses action type.

## Prerequisites

You must have completed the steps in the following articles:

> [!div class="checklist"]
> * 
> *

## Add template responses to commands
Template editor is used to introduce variation to the speech responses being sent to the client.

1. To use this, let's go back to `TurnOnOff` command. Edit the **Actions** section of existing **Completion Rule** `ConfirmationResponse`.
1. In the **Edit action** pop-up, switch to **Template Editor** and replace the text with-

    ```
    -  Ok, turning {OnOff} the {SubjectDevice}
    - Done, turning {OnOff} the {SubjectDevice}
    - Proceeding to turn {OnOff} {{SubjectDevice}}
    ```

1. `Train` and `Test` your application
    * Input: turn on the tv
    * Output: Ok, turning on the tv
    * Input: turn on the tv
    * Output: Done, turning on the tv
    * Input: turn on the tv
    * Output: Proceeding to turn on the tv
