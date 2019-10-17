---
title: 'Quickstart: Create a Custom Command (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, you create and test a hosted Custom Commands application.
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# Quickstart: Create a Custom Command (Preview)
In this article, you'll learn how to create and test a hosted Custom Commands application.
The application will recognize an utterance like "turn on the tv" and respond with a simple message "Ok, turning on the tv".

## Prerequisites

You'll need a Speech subscription.  [Try the speech service for free](~/articles/cognitive-services/speech-service/get-started.md).

> [!NOTE]
> During preview, only the westus2 region is supported for subscription keys.

You'll also need a [LUIS](https://www.luis.ai/home) authoring key.
- Create a Language Understanding resource
- Select Authoring as the create option

![Create authoring resource](media/custom-speech-commands/resources-LUIS-authoring.png)
- From the resource, select Keys under Resource Management
- Copy and securely store one of the keys

![Copy authoring key](media/custom-speech-commands/resources-LUIS-authoring-key.png)

## Go to the Speech Studio for Custom Commands
Open your web browser, and navigate to the [Speech Studio](https://speech.microsoft.com/)
Enter your credentials to sign in to the portal. The default view is your list of Speech subscriptions.

> [!NOTE]
> If you don't see the select subscription page, you can navigate to it by choosing "Speech resources" from the settings menu on the top bar.

Select your Speech subscription,  then select "Go to Studio".

Select Custom Commands (Preview).
The default view is a list of your created Custom Commands applications

## Create a Custom Commands application

Select New project to create a new project

![Create new project](media/custom-speech-commands/create-new-project.png)

Enter the Project name and Language and select Next to continue.

You will be prompted for the LUIS authoring key you created earlier.  Enter the authoring key and select Create to continue.

Once created, select your project.

Your view should now be an overview of your Custom Commands application

## Create a new Command

A Command is a set of:

Group|Description
---|---
Sample Sentences|Example utterances the user can say to trigger this Command
Parameters|Information required to complete the Command
Completion Rules|The actions to be taken to fulfill the Command
Advanced Rules|Additional rules to handle more specific or complex situations

Let's create an example Command that will take a single utterance and respond with a message.  Later articles will extend this example.

Create a new Command "TurnOn" and select CompletionStrategy OnRequiredParameters.

You should now see sections for Sample Sentences, Parameters, Completion Rules, and Advanced Rules.

### Sample Sentences

Let's start with Sample Sentences and provide an example of what the user can say:
- "turn on the tv"

For now, we have no parameters so we can move on to Completion rules.

### Completion Rules

Now add a Completion rule to respond to the user indicating that an action is being taken.

![Create a Completion rule](media/custom-speech-commands/create-basic-completion-response-rule.png)

Setting|Suggested value|Description
---|---|---
Rule Name | Confirmation Message |A name describing the purpose of the rule
Conditions|True|Conditions that determine when the rule can run
Actions|SpeechResponse - "Ok, turning on the TV"|The action to take when the rule condition is true.

That's all we need to handle this interaction.

## Try it out
Test the behavior using the Test chat panel.

![Create a Completion rule](media/custom-speech-commands/create-basic-test-chat.png)

- A: "turn on the tv"
- B: "Ok, turning on the tv"

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Custom Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)