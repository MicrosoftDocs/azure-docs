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

In this article, you will learn about the language generation aspects of speech responses. This can be achieved in two ways-
1. Use of language generation templates.
1. Use of adaptive expressions.
Templates are generated using the template editor and is used to introduce variation to the speech responses being sent to the client. In addition, you can also use adaptive expressions to 

## Prerequisites

You must have completed the steps in the following articles:

> [!div class="checklist"]
> * 
> *

## Add template responses to TurnOnOff command
Template editor is used to introduce variation to the speech responses being sent to the client.

1. Let's go back to **TurnOnOff** command. Edit the **Actions** section of existing completion rule **ConfirmationResponse**.
1. In the **Edit action** pop-up, switch to **Template Editor** and replace the text with-

    ```
    -  Ok, turning {OnOff} the {SubjectDevice}
    - Done, turning {OnOff} the {SubjectDevice}
    - Proceeding to turn {OnOff} {SubjectDevice}
    ```

1. **Train** and **Test** your application
    * Input: turn on the tv
    * Output: Ok, turning on the tv
    * Input: turn on the tv
    * Output: Done, turning on the tv
    * Input: turn on the tv
    * Output: Proceeding to turn on the tv


## Add adaptive expressions to SetAlarms command
1. For this, let's use the **FallbackCommand**. Select the command in the left pane.
1. Modify the **DefaultResponse** completion rules and change the existing action to **Send speech response > hi {getTimeOfDay(utcNow())}**

 > [!NOTE]
  > For details on supported adaptive expressions, click here []

1. **Train** and **Test** your application
    * Input: hi
    * Output: hi morning