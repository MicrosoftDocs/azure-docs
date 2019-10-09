---
title: 'Quickstart: Create a Custom Speech Command (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, you create and test a hosted Custom Speech Commands application.
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# Quickstart: Create a Custom Speech Command (Preview)
In this Quickstart, you'll create and test a hosted Custom Speech Commands application.
You'll add example sentences the application can respond to such as "turn on the tv".
You'll add a Completion rule so the application can respond with a simple message "Ok, turning on the tv".

> [!TIP]
> In the previous quickstart you created a Speech subscription key and a LUIS authoring key
> 
> [Quickstart: Create a Custom Speech Command with Parameters (Preview)](./quickstart-custom-speech-commands-resources.md)

## Log in to the Custom Speech portal
Open your web browser, and navigate to the [Custom Speech portal](https://speech.microsoft.com/)
Enter your credentials to sign in to the portal. The default view is your list of Speech subscriptions.

## Create a Custom Speech Commands application
Select the Speech subscriptions that you previously created, then select "Go to Studio"

Select "Custom Speech Commands (Preview)".  The default view is your list of Custom Speech Commands applications

Next create a new Speech Commands application.

Name "Device Control Quickstart"
Language - en-us
Region - West US 2

## Create a new Command

A Command is a set of:

Group|Description
---|---
Sample Sentences|Example utterances the user can say to trigger this Command
Parameters|Information required to complete the Command
Completion Rules|The actions to be taken to fulfill the Command
Advanced Rules|Additional rules to handle more specific or complex situation

Create a new Command "TurnOn"
CompletionStrategy OnRequiredParameters

Give an example for what the user will say in Sample Sentences
"turn on the tv"

Because we have no parameters, invoking this command should always run the Completion Rules.

Now add a Completion rule to respond to the user indicating that an action is being taken.

![Create completion response rule](media/custom-speech-commands/create-basic-completion-response-rule.png)

Setting|Suggested value|Description
---|---|---
Rule Name | Confirmation Message |A name describing the purpose of the rule
Conditions|True|Conditions that determine when the rule can run
Actions|SpeechResponse - "Ok, turning on the TV"|The action to take when the rule condition is true.

## Try it out
Test the behavior using the Test chat panel

type - "turn on the tv"
response - "Ok, turning on the tv"

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Custom Speech Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)