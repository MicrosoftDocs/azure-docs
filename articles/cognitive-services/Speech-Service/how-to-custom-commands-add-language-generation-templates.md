---
title: 'How To: Use language generation templates for speech responses - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to configure a string parameter to refer to catalog exposed over a web endpoint.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/27/2020
ms.author: sausin
---

# Add language generation templates for speech responses

In this article, you'll learn about the language generation aspects of speech responses. This can be achieved in two ways:
 - Use of language generation templates
 - Use of adaptive expressions

## Prerequisites

You must have completed the steps in the following articles:

> [!div class="checklist"]
> * [How To: Create application with simple commands](./how-to-custom-commands-create-application-with-simple-commands.md)
> * [How To: Add parameters to commands](./how-to-custom-commands-add-parameters-to-commands.md)

## Language generation templates overview

Custom Commands templates are based on the BotFramework's [LG templates](https://aka.ms/speech/cc-lg-format).

Since Custom Commands creates a new LG template when required (that is, for speech responses in parameters or actions) you do not have to specify the name of the LG template. So, instead of defining your template as:

 ```
    # CompletionAction
    - Ok, turning {OnOff} the {SubjectDevice}
    - Done, turning {OnOff} the {SubjectDevice}
    - Proceeding to turn {OnOff} {SubjectDevice}
 ```

You only need to define the body of the template without the name:
> [!div class="mx-imgBorder"]
> ![template editor example](./media/custom-commands/template-editor-example.png)


This change introduces variation to the speech responses being sent to the client. So, for the same utterance, the corresponding speech response would be randomly picked out of the options provided.

Taking advantage of LG templates we can also define complex speech responses for our commands using adaptive expressions.

You can refer to the [LG templates format](https://aka.ms/speech/cc-lg-format) for more details. Custom Commands by default supports all the capabilities with the following minor differences:

1. In the LG templates entities are represented as ${entityName}. In Custom Commands we don't use entities but parameters can be used as variables with either one of these representations ${parameterName} or {parameterName}
1. Template composition and expansion are not supported in Custom Commands. This is because you never edit the `.lg` file directly, but only the responses of automatically created templates.
1. Custom functions injected by LG  are not supported in Custom Commands. Predefined functions are still supported.
1. Options (strict, replaceNull & lineBreakStyle) are not supported in Custom Commands.

## Add template responses to TurnOnOff command

### Add a new SubjectContext parameter
Let's modify the **TurnOnOff** command to add a new parameter to it with the following configuration:

| Setting            | Suggested value       | 
| ------------------ | --------------------- | 
| Name               | `SubjectContext`         | 
| Is Global          | unchecked             | 
| Required           | unchecked               | 
| Type               | String                |
| Default value      | `all` |
| Configuration      | Accept predefined input values from internal catalog | 
| Predefined input values | `room`, `bathroom`, `all`|

### Modify completion rule

1. Edit the **Actions** section of existing completion rule **ConfirmationResponse**.
1. In the **Edit action** pop-up, switch to **Template Editor** and replace the text with-

    ```
    - IF: @{SubjectContext == "all" && SubjectDevice == "lights"}
        - Ok, turning all the lights {OnOff}
    - ELSEIF: @{SubjectDevice == "lights"}
        - Ok, turning {OnOff} the {SubjectContext} {SubjectDevice}
    - ELSE:
        - Ok, turning the {SubjectDevice} {OnOff}
        - Done, turning {OnOff} the {SubjectDevice}
    ```

1. **Train** and **Test** your application as follows. Notice the variation of responses owing to use of multiple alternatives of the template value and use of adaptive expressions.
    * Input: turn on the tv
    * Output: Ok, turning the tv on
    * Input: turn on the tv
    * Output: Done, turned on the tv
    * Input: turn off the lights
    * Output: Ok, turning all the lights off
    * Input: turn off room lights
    * Output: Ok, turning off the room lights