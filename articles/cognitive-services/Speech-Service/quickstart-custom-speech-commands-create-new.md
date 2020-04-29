---
title: 'Quickstart: Create a Custom Command - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you create and test a hosted Custom Commands application.
services: cognitive-services
author: don-d-kim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/09/2019
ms.author: donkim
---

# Quickstart: Create a Custom Commands app

In this quickstart, you will learn how to create and test a Custom Commands application.
The created application will process utterances like "turn on the tv" and reply with a simple message "Ok, turning on the tv".

## Prerequisites
> [!div class="checklist"]
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create an Azure Speech resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>

  > [!NOTE]
  > At this time, only the westus, westus2, neur regions are supported.

## Go to the Speech Studio for Custom Commands

1. Open your web browser, and navigate to the [Speech Studio](https://speech.microsoft.com/)
1. Enter your credentials to sign in to the portal

   - The default view is your list of Speech subscriptions.
     > [!NOTE]
     > If you don't see the select subscription page, you can navigate there by choosing "Speech resources" from the settings menu on the top bar.

1. Select your Speech subscription, then select **Go to Studio**.
1. Select **Custom Commands**

     - The default view is a list of the Custom Commands applications you have under your selected subscription.

## Create a Custom Commands project

1. Select **New project** to create a new project.

   > [!div class="mx-imgBorder"]
   > ![Create a project](media/custom-speech-commands/create-new-project.png)

1. Enter the project name.
1. Select language from the drop-down.
1. Select an authoring resource from the drop-down. If there are no valid authoring resources, create one by clicking on  **Create new LUIS authoring resource**.

   > [!div class="mx-imgBorder"]
   > ![Create a resource](media/custom-speech-commands/create-new-resource.png)

   - Enter the Resource Name, Resource Group.
   - Choose value for Location, and Pricing Tier from the drop-down.

      > [!NOTE]
      > You can create resource groups by entering the desired resource group name into the "Resource Group" field. The resource group will be created when **Create** is selected.

1. Click **Create** to create your project.
1. Once created, select your project.

    - Your view should now be an overview of your Custom Commands application.

## Update LUIS Resources (Optional)

You can update the authoring resource that was set in the new project window, and set a prediction resource. Prediction resource is used for recognition once your Custom Commands application is published. You don't need a prediction resource for the development and testing phases.

> [!NOTE]
> Since the authoring resource supports only 1,000 prediction endpoint requests per month, you will mandatorily need to set a LUIS prediction resource before publishing your Custom Commands application.

> [!div class="mx-imgBorder"]
> ![Set LUIS Resources](media/custom-speech-commands/set-luis-resources.png)

1. Select **Settings** from the left pane and then navigate to the **LUIS resources** section in the middle pane .
1. Select a prediction resource, or create one by selecting **Create new resource**
1. Select **Save**

## Create a new Command

Let's create a simple command that will take a single utterance, `turn on the tv`, and respond with the message `Ok, turning on the tv`.

1. Create a new Command by selecting the **+** icon next to **New command**. A new pop-up window appears titled **New command**.
1. Provide value for the **Name** field as `TurnOn`
1. Click on **Create**

> [!div class="mx-imgBorder"]
> ![Create a command](media/custom-speech-commands/create-add-command.png)

A Command comprises of:

| Group            | Description                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Example sentences | Example utterances the user can say to trigger this Command                                                                 |
| Parameters       | Information required to complete the Command                                                                                |
| Completion Rules | The actions to be taken to fulfill the Command. For example, to respond to the user or communicate with another web service |
| Advanced Rules   | Additional rules to handle more specific or complex situations                                                              |

### Add Example Sentences

Let's start with **Example Sentences** section, and provide an example of what the user can say:

```
turn on the tv
```

For now, we have no parameters so we can move on to **Completion rules** section.

### Add a Completion Rule

Now add a Completion Rule to respond to user indicating that a fulfillment action is being taken.

1. Create a new completion rule by selecting the **+Add** button at the top of the middle pane
1. Provide value for rule name.
1. Add an action
   1. Create a new Speech Response Action by selecting the **+** icon next to Actions.
   1. In the **New Action** pop-up window which appears, select `Send speech response` from the drop-down options for **Type**.
   1. Choose `Simple editor` for the **Response** field.
       - In the **First variation** field, provide value for response as `Ok, turning on the tv`

   > [!div class="mx-imgBorder"]
   > ![Create a Speech response](media/custom-speech-commands/create-speech-response-action.png)

1. Click **Save** to save the rule.

> [!div class="mx-imgBorder"]
> ![Create a completion rule](media/custom-speech-commands/create-basic-completion-response-rule.png)

| Setting    | Suggested value                          | Description                                        |
| ---------- | ---------------------------------------- | -------------------------------------------------- |
| Rule Name  | "ConfirmationResponse"                   | A name describing the purpose of the rule          |
| Conditions | None                                     | Conditions that determine when the rule can run    |
| Actions    | SpeechResponse "- Ok, turning on the tv" | The action to take when the rule condition is true |

## Try it out

Test the behavior using the Test chat panel
1. Click on **Train** button.
1. Once, training completes, click on **Test** button.
    - A new **Test your application** window will appear.
    - You type: "turn on the tv"
    - Expected response: "Ok, turning on the tv"


> [!div class="mx-imgBorder"]
> ![Test with web chat](media/custom-speech-commands/create-basic-test-chat.png)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create a Custom Command with Parameters](./quickstart-custom-speech-commands-create-parameters.md)
