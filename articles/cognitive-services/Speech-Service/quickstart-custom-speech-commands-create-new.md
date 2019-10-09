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
In this Quickstart we will create and test a hosted Custom Speech Commands application that can recognize an utterance like "turn on the tv"
and respond with a simple message "Ok, turning on the tv".

> [!TIP]
> In the previous quickstart you created a Speech subscription key and a LUIS authoring key
> 
> [Quickstart: Create a Custom Speech Command with Parameters (Preview)](./quickstart-custom-speech-commands-resources.md)

## Log in to the Custom Speech portal
Open your web browser, and navigate to the [Custom Speech portal](https://speech.microsoft.com/)
Enter your credentials to sign in to the portal. The default view your list of Speech subscriptions.

## Create a Custom Speech Commands application
Select the Speech subscriptions that you previously created, then select "Go to Studio"

Select "Custom Speech Commands"

Next create a new Speech Commands application

Name "Device Control Quickstart"
Language - en-us
Region - West US 2

## Add a new Command

Now create a new Command

Create a new Command "TurnOn"
CompletionStrategy OnRequiredParameters

Give an example for what the user will say in Sample Sentences
"turn on the tv"

Because we have no parameters, invoking this command should always run the Completion Rules.

Let's add a new Completion Rule
Condition - True
Action - Speech Response - Template
- message - "Ok, turning on the tv"

## Try it out
Test the behavior using the Test chat panel

type - "turn on the tv"
response - "Ok, turning on the tv"

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Custom Speech Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)