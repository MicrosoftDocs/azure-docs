---
title: 'How To: Add simple commands to Custom Commands application - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you create and test a hosted Custom Commands application.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: sausin
---

# Add simple commands to Custom Command application

In this article, you will learn how to add some basic commands to your application.

## Prerequisites
> [!div class="checklist"]
> * 

## Add TurnOn Command
### Create Command
To the **smart room-lite** Custom Commands application, let's add a simple command that process an utterance, `turn on the tv`, and respond with the message `Ok, turning on the tv`.

1. Create a new Command by selecting **New command** at the top of the left pane. The **New command** window opens.
1. Provide value for the **Name** field as **TurnOn**.
1. Select **Create**.

The middle pane lists the different properties of the command. You will be configuring the following properties of the command. For explanation of all the configuration properties of a command, click here. [TODOVishesh1]


| Configuration            | Description                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Example sentences** | Example utterances the user can say to trigger this Command                                                                 |
| **Parameters**       | Information required to complete the Command                                                                                |
| **Completion rules** | The actions to be taken to fulfill the Command. For example, to respond to the user or communicate with another web service. |
| **Interaction rules**   | Additional rules to handle more specific or complex situations                                                              |


> [!div class="mx-imgBorder"]
> ![Create a command](media/custom-speech-commands/create-add-command.png)


### Add example sentences

Let's start with **Example sentences** section, and provide an example of what the user can say.

1. Select **Example sentences** section in the middle pane.
1. In the right most pane, add examples:

    ```
    turn on the tv
    ```

1.  Select **Save** at the top of the pane.

For now, we don't have parameters, so we can move to the **Completion rules** section.

### Add a completion rule

Now add a completion rule that has the following configuration. This rule tells the user that a fulfillment action is being taken.


| Setting    | Suggested value                          | Description                                        |
| ---------- | ---------------------------------------- | -------------------------------------------------- |
| **Name**       | ConfirmationResponse                  | A name describing the purpose of the rule          |
| **Conditions** | None                                     | Conditions that determine when the rule can run    |
| **Actions**    | SpeechResponse -> "Ok, turning on the tv" | The action to take when the rule condition is true |

1. You can create a completion rule by selecting the **Add** at the top of the middle pane. But for now, let's reuse the existing default **Done** rule.
1. Provide value in **Name** section.
1. Add an action
   1. Create an action by selecting **Add an action** in the **Actions** section.
   1. In the **New Action** window, in the **Type** list, select **Send speech response**.
   1. Under **Response**, select **Simple editor**.
       - In the **First variation** field, provide value for response as `Ok, turning on the tv`

   > [!div class="mx-imgBorder"]
   > ![Create a Speech response](media/custom-speech-commands/create-speech-response-action.png)

1. Select **Save** to save the rule.
1. Back in the **Completion rules** section, select **Save** to save all changes. 

> [!div class="mx-imgBorder"]
> ![Create a completion rule](media/custom-speech-commands/create-basic-completion-response-rule.png)

### Try it out

Test the behavior using the Test chat panel
1. Select **Train** icon present on top of the right pane.
1. Once, training completes, select **Test**. Try out the following utterance.
    - Input: turn on the tv
    - Output: Ok, turning on the tv


> [!div class="mx-imgBorder"]
> ![Test with web chat](media/custom-speech-commands/create-basic-test-chat.png)

## Add SetTemperature command
Now, let's add one more command **SetTemperature** that will take a single utterance, `set the temperature to 40 degrees`, and respond with the message `Ok, setting temperature to 40 degrees`.

Follow the steps as illustrated for the **TurnOn** command to create a new command with the following configuration-

### Example sentences
    ```
    set the temperature to 40 degrees
    ```

### Completion rules

| Setting    | Suggested value                          |
| ---------- | ---------------------------------------- |
| Name  | ConfirmationResponse                  |
| Conditions | None                                     |
| Actions    | SpeechResponse > "Ok, setting temperature to 40 degrees" |


## Add SetAlarm command
Create a new Command **SetAlarm** with configuration as defined below.
### Example sentences

   ```
    set an alarm for 9 am tomorrow
   ```

    
### Completion rules


| Setting    | Suggested value                          |
| ---------- | ---------------------------------------- |
| Rule Name  | ConfirmationResponse                  |
| Conditions | None                                     |
| Actions    | SpeechResponse > "Ok, setting an alarm for 9 am tomorrow" |


## Try it out

Test the behavior using the Test chat panel
1. Select **Train**. After training success, select **Test** 
    - You type: set the temperature to 40 degrees
    - Expected response: Ok, setting temperature to 40 degrees
    - You type: turn on the tv
    - Expected response: Ok, turning the tv on
    - You type: set an alarm for 9 am tomorrow
    - Expected response: Ok, setting an alarm for 9 am tomorrow

> [!div class="nextstepaction"]
> [How To: Add parameters to Commands](./how-to-custom-commands-add-parameters-to-commands.md)
