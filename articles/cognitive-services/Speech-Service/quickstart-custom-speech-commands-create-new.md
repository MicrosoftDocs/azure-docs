---
title: 'Quickstart: Create a Custom Commands Preview app - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you'll create and test a hosted Custom Commands Preview application. The application will process utterances. 
services: cognitive-services
author: nitinme
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: nitinme
---

# Quickstart: Create a Custom Commands Preview app

In this quickstart, you'll learn how to create and test a Custom Commands application.
The application will process utterances like "turn on the tv" and reply with a simple message like "Ok, turning on the tv."

## Prerequisites

> [!div class="checklist"]
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create an Azure Speech resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>

  > [!NOTE]
  > At this time, Custom Commands only supports Speech subscriptions in the  westus, westus2, and neur regions.

## Go to the Speech Studio for Custom Commands

1. In a web browser, go to [Speech Studio](https://speech.microsoft.com/).
1. Enter your credentials to sign in to the portal.

   The default view is your list of Speech subscriptions.
    > [!NOTE]
    > If you don't see the select subscription page, you can get there by selecting **Speech resources** in the settings menu at the top of the screen.

1. Select your Speech subscription, and then select **Go to Studio**.
1. Select **Custom Commands**.

     The default view is a list of the Custom Commands applications that you have in the selected subscription.

## Create a Custom Commands project

1. Select **New project** to create a project.

   > [!div class="mx-imgBorder"]
   > ![Create a project](media/custom-speech-commands/create-new-project.png)

1. In the **Name** box, enter a project name.
1. In the **Language** list, select a language.
1. In the **LUIS authoring resource** list, select an authoring resource. If there are no valid authoring resources, create one by selecting  **Create new LUIS authoring resource**.

   > [!div class="mx-imgBorder"]
   > ![Create a resource](media/custom-speech-commands/create-new-resource.png)

   1. In the **Resource Name** box, enter the name of the resource.
   1. In the **Resource Group** list, select a resource group.
   1. In the **Location** list, select a location.
   1. In the **Pricing Tier** list, select a tier.

      > [!NOTE]
      > You can create a resource group by entering a resource group name in the **Resource Group** box. The resource group will be created when you select **Create**.

1. Select **Create**.
1. After the project is created, select it.

    You should now see an overview of your new Custom Commands application.

## Update LUIS resources (optional)

You can update the authoring resource that you selected in the **New project** window and set a prediction resource. The prediction resource is used for recognition when your Custom Commands application is published. You don't need a prediction resource during the development and testing phases.

1. Select **Settings** in the left pane and then select **LUIS resources** in the middle pane.
1. Select a prediction resource, or create one by selecting **Create new resource**.
1. Select **Save**.
    
    > [!div class="mx-imgBorder"]
    > ![Set LUIS resources](media/custom-speech-commands/set-luis-resources.png)


> [!NOTE]
> Because the authoring resource supports only 1,000 prediction endpoint requests per month, you'll need to set a LUIS prediction resource before you publish your Custom Commands application.


## Create a command

Let's create a simple command that will take a single utterance, `turn on the tv`, and respond with the message `Ok, turning on the tv`.

1. Create a command by selecting **New command** at the top of the left pane. The **New command** window opens.
1. In the **Name** box, enter **TurnOn**.
1. Select **Create**.

The middle pane lists the properties of the command:


| Configuration            | Description                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Example sentences** | Examples of utterances the user can say to trigger the command.                                                                 |
| **Parameters**       | Information required to complete the command.                                                                                |
| **Completion rules** | Actions that will be taken to fulfill the command. For example, responding to the user or communicating with another web service. |
| **Interaction rules**   | Additional rules to handle more specific or complex situations.                                                              |


> [!div class="mx-imgBorder"]
> ![Create a command](media/custom-speech-commands/create-add-command.png)


### Add example sentences

Let's start with **Example sentences** section. We'll provide an example of what the user can say.

1. Select **Example sentences** in the middle pane. 
1. In the right pane, add examples:

    ```
    turn on the tv
    ```

1. Select **Save** at the top of the pane.

For now, we don't have parameters, so we can move to the **Completion rules** section.

### Add a completion rule

Now add a completion rule that has the following configuration. This rule tells the user that a fulfillment action is being taken.


| Setting    | Suggested value                          | Description                                        |
| ---------- | ---------------------------------------- | -------------------------------------------------- |
| **Name**  | **ConfirmationResponse**                  | A name describing the purpose of the rule.          |
| **Conditions** | None                                     | Conditions that determine when the rule can run.    |
| **Actions**    | **Send speech response -> Ok, turning on the tv** | The action to take when the rule condition is true. |

1. Create a new completion rule by selecting **Add** at the top of the middle pane.
1. In the **Name** box, enter a name.
1. Add an action.
   1. Create an action by selecting **Add an action** in the **Actions** section.
   1. In the **Edit Action** window, in the **Type** list, select **Send speech response**.
   1. Under **Response**, select **Simple editor**. In the **First variation** box, enter **Ok, turning on the tv**.

   > [!div class="mx-imgBorder"]
   > ![Create a response](media/custom-speech-commands/create-speech-response-action.png)

1. Select **Save** to save the rule.
1. Back in the **Completion rules** section, select **Save** to save all changes. 

> [!div class="mx-imgBorder"]
> ![Create a completion rule](media/custom-speech-commands/create-basic-completion-response-rule.png)



## Try it out

Test the behavior by using the test chat panel.
1. Select **Train** at the top of the right pane.
1. After training is done, select **Test**. A new **Test your application** window appears.
    - Enter **turn on the tv**
    - Expected response: **Ok, turning on the tv**


> [!div class="mx-imgBorder"]
> ![Test the behavior](media/custom-speech-commands/create-basic-test-chat.png)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create a Custom Commands Preview application with parameters](./quickstart-custom-speech-commands-create-parameters.md)
