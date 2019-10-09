---
title: 'Quickstart: Create a Custom Speech Command (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, you create a hosted Custom Speech Commands application.
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/26/2019
ms.author: donkim
---

# Quickstart: Create a Custom Speech Command (Preview)


In this article we will create a hosted Custom Speech Commands application that can recognize an utterance like "turn on the tv"
and respond with a simple message "Ok, turning on the tv"

Sign in to the [Custom Speech Portal](https://speech.microsoft.com/)

Select the speech resource that we previously created, then select "Go to Studio"

Currently supported regions for Preview are West US 2.

Select "Custom Speech Commands"

Next create a new Speech Commands application

Name "Device Control Quickstart"
Language - en-us
Region - West US 2

Now let's add a command

Create a new Command "TurnOn"
CompletionStrategy OnRequiredParameters

Give an example for what the user will say in Sample Sentences
"turn on the tv"


Because we have no parameters, invoking this command should always run the Completion Rules.

Let's add a new Completion Rule
Condition - True
Action - Speech Response - Template
- message - "Ok, turning on the tv"

Try it out
We can test the behavior using the Test chat panel

type - "turn on the tv"
response - "Ok, turning on the tv"