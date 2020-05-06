---
title: 'Quickstart: Create a Custom Command (Preview) - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you create and test a hosted Custom Commands application.
services: cognitive-services
author: don-d-kim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: donkim
---

# Quickstart: Create a Custom Commands app (Preview)

In this quickstart, you will learn how to create and test a Custom Commands application.
The created application will process utterances like "turn on the tv" and reply with a simple message "Ok, turning on the tv".

## Prerequisites

> [!div class="checklist"]
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create an Azure Speech resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>

  > [!NOTE]
  > At this time, Custom Commands only supports speech subscriptions in  westus, westus2 and neur regions.

## Go to the Speech Studio for Custom Commands

1. Open your web browser, and navigate to the [Speech Studio](https://speech.microsoft.com/)
1. Enter your credentials to sign in to the portal.

   - The default view is your list of Speech subscriptions.
     > [!NOTE]
     > If you don't see the select subscription page, you can navigate there by choosing "Speech resources" from the settings menu on the top bar.

1. Select your Speech subscription, then select **Go to Studio**.
1. Select **Custom Commands**.

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

1. Next, select **Create** to create your project.
1. Once created, select your project.

    - Your view should now be an overview of your newly created Custom Commands application.

## Update LUIS Resources (Optional)

You can update the authoring resource that was set in the new project window, and set a prediction resource. Prediction resource is used for recognition once your Custom Commands application is published. You don't need a prediction resource for the development and testing phases.

1. Select **Settings** from the left pane and then navigate to the **LUIS resources** section in the middle pane.
1. Select a prediction resource, or create one by selecting **Create new resource**.
1. Select **Save**.
    
    > [!div class="mx-imgBorder"]
    > ![Set LUIS Resources](media/custom-speech-commands/set-luis-resources.png)


> [!NOTE]
> Since the authoring resource supports only 1,000 prediction endpoint requests per month, you will mandatorily need to set a LUIS prediction resource before publishing your Custom Commands application.


## Create a new Command

Let's create a simple command that will take a single utterance, `turn on the tv`, and respond with the message `Ok, turning on the tv`.

1. Create a new Command by selecting the `+ New command` icon present on top of the left most pane. A new pop-up appears titled **New command**.
1. Provide value for the **Name** field as `TurnOn`.
1. Select **Create**.

The middle pane enlists the different properties of a command:


| Configuration            | Description                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Example sentences | Example utterances the user can say to trigger this Command                                                                 |
| Parameters       | Information required to complete the Command                                                                                |
| Completion rules | The actions to be taken to fulfill the Command. For example, to respond to the user or communicate with another web service. |
| Interaction rules   | Additional rules to handle more specific or complex situations                                                              |


> [!div class="mx-imgBorder"]
> ![Create a command](media/custom-speech-commands/create-add-command.png)


### Add Example sentences

Let's start with Example sentences section, and provide an example of what the user can say.

1. Select **Example sentences** section from the middle pane and in the right most pane, add examples:

    ```
    turn on the tv
    ```

1. Select `Save` icon present on top of this pane.

For now, we have no parameters so we can move on to **Completion rules** section.

### Add a Completion rule

Now add a Completion rule with the following configuration. This rule indicates user that a fulfillment action is being taken.
| Setting    | Suggested value                          | Description                                        |
| ---------- | ---------------------------------------- | -------------------------------------------------- |
| Rule Name  | ConfirmationResponse                  | A name describing the purpose of the rule          |
| Conditions | None                                     | Conditions that determine when the rule can run    |
| Actions    | SpeechResponse "- Ok, turning on the tv" | The action to take when the rule condition is true |

1. Create a new completion rule by selecting the `+Add` icon at the top of the middle pane.
1. Provide value in **Name** section.
1. Add an action
   1. Create a new action by selecting the **+ Add an action** in the **Actions** section.
   1. In the **New Action** pop-up, select `Send speech response` from the drop-down options for **Type**.
   1. Choose `Simple editor` for the **Response** field.
       - In the **First variation** field, provide value for response as `Ok, turning on the tv`

   > [!div class="mx-imgBorder"]
   > ![Create a Speech response](media/custom-speech-commands/create-speech-response-action.png)

1. Click **Save** to save the rule.
1. Back in the **Completion rules** section, select **Save** to save all changes. 

> [!div class="mx-imgBorder"]
> ![Create a completion rule](media/custom-speech-commands/create-basic-completion-response-rule.png)



## Try it out

Test the behavior using the Test chat panel
1. Select `Train` icon present on top of the right pane.
1. Once, training completes, select `Test`. A new **Test your application** window will appear.
    - You type: turn on the tv
    - Expected response: Ok, turning on the tv


> [!div class="mx-imgBorder"]
> ![Test with web chat](media/custom-speech-commands/create-basic-test-chat.png)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create a Custom Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)
