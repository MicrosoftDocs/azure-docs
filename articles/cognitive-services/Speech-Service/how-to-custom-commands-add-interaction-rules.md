---
title: 'How to: Add a confirmation to a custom command'
titleSuffix: Azure Cognitive Services
description: In this article, how to implements confirmations for a command in Custom Commands.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/27/2020
ms.author: sausin
---

# Add interaction rules

In the previous articles, you learns how to create and configure completion rules. In this article, you'll learn about **interaction rules**. These are additional rules to handle more specific or complex situations.

While you're free to author your own custom interaction rules, in this article, you'll learn how to make use of interaction rules for following targeted scenarios:

1. Confirming commands
1. Adding one step correction to commands

Go to [references](./custom-commands-references.md) section to learn more about interaction rules.

## Prerequisites

You must have completed the steps in the following articles:
> [!div class="checklist"]
> [!div class="checklist"]
> * [How To: Create application with simple commands](./how-to-custom-commands-create-application-with-simple-commands.md)
> * [How To: Add parameters to commands](./how-to-custom-commands-add-parameters-to-commands.md)

## Add confirmations to a command

To demonstrate confirmations, you will be using the **SetTemperature** command. For achieving confirmation, you will be creating interaction rules.

### Add interaction rules for confirmation

1. Select **SetTemperature** command from the left pane.
2. Add interaction rules by selecting **Add** in the middle pane and then selecting **Interaction rules** > **Confirm command**.

    This will add 3 interaction rules This rule will ask the user to confirm the date and time of the alarm and is expecting a confirmation (yes/no) for the next turn.

    1. Modify the **Confirm Command** interaction rule as per the following configuration
        1. Rename **Name** to  **`Confirm Temperature`**.
        1. Add a new condition as- **Required parameters > Temperature**
        1. Add a new action as- **Type > Send speech response > `Are you sure you want to set the temperature as {Temperature} degrees?`**
        1. Leave the default value of **Expecting confirmation from user** in the expectations section.
      
         > [!div class="mx-imgBorder"]
         > ![Create required parameter response](media/custom-speech-commands/add-validation-set-temperature.png)
    

    1. Modify the **Confirmation succeeded** interaction rule to handle a successful confirmation (user said yes).
      
          1. Modify **Name** to  **`Confirmation temperature succeeded`**.
          1. Leave the already existing **Confirmation was successful** condition.
          1. Add a new condition as- **Type >  Required Parameters > Temperature**
          1. Leave the default value of **Post-execution state** as **Execute completion rules**.

    1. Modify the **Confirmation denied** (user said no) to handle scenarios when confirmation is denied.

          1. Modify **Name** to  **`Confirmation temperature denied`**.
          1. Leave the already existing **Confirmation was denied** condition.
          1. Add a new condition as- **Type >  Required Parameters > Temperature**
          1. Add a new action as- **Type > Send speech response > `No problem. What temperature then?`**
          1. Leave the default value of **Post-execution state** as **Wait for user's input**.

> [!IMPORTANT]
> In this article, you used the inbuilt confirmation capability. Alternatively, you can also achieve the same by adding the interaction rules one by one, manually.
   

### Try out the changes

Select **Train**, wait for training complete and select **Test**.

- Input: set temperature to 80 degrees
- Output: ok 80?
- Input: No
- Output: no problem. what temperature then?
- Input: 83 degrees
- Output: ok 83?
- Input: Yes
- Output: Ok, setting temperature to 83 degrees


## Implementing corrections in a command
In this section, you will learn how to configure one-step correction - once the fulfillment action has already been executed.

You will also see an example of how correction is enabled by default in case the command is not fulfilled yet.

### Correction when command isn't completed
#### Add a new parameter AlarmTone
1. Select **SetAlarm** command from the left pane and add a new parameter **AlarmTone**.
        
    - **Name** > `AlarmTone`
    - **Type** > String
    - **Default Value** > `Chimes`
    - **Configuration** > Accept predefined input values from internal catalog
    - **Predefined input values** > `Chimes`, `Jingle`, and `Echo`. Each as individual predefined inputs.

#### Modify existing parameter DateTime
1. Update the response for the DateTime parameter to `Ready to set alarm with tone as {AlarmTone}. For what time?`

#### Modify completion rule
1. Select the existing completion rule **ConfirmationResponse**.
1. In the right panel, hover over the existing action and select **Edit** button.
1. Update speech response to `Ok, alarm set for {DateTime}. The alarm tone is {AlarmTone}.`

#### Try out the changes

Select **Train**, wait till training completes and select **Test**.
Try out the following utterances:

- Input: set an alarm
- Output: Ready to set alarm with tone as Chimes. For what time?
- Input: set an alarm with tone as jingle for 9 am tomorrow
- Output: Ok, alarm set for 2020-05-30 09:00:00. The alarm tone is jingle.

> [!IMPORTANT]
> Note how the alarm tone could be changed without any explicit configuration in an ongoing command, i.e. when the command was not completed yet. **Correction is enabled by default for all the command parameters, regardless of the turn number if the command is yet to be fulfilled.**

### Correction when command is completed

Custom Commands platform also provides the capability for one step correction even when the command has been completed. But this feature isn't enabled by default and user has to explicitly configure it.

#### Configure one step correction

1. In the **SetAlarm** command, add an interaction rule of type **Update previous command** to update the previously set alarm. Rename the default **Name** of the interaction rule to **Update previous alarm**.
1. Leave the default condition **Previous command needs to be updated** as is.
1.  Add a new condition as **Type > Required Parameter > DateTime**.
1. Add a new action as **Type > Send speech response > Simple editor > `Updating previous alarm time to {DateTime}.`**
1. Leave the default value of post execution state as **Command completed**.

#### Try out the changes

Select **Train**, wait for training complete and select **Test**.

- Input: set an alarm
- Output: Ready to set alarm with tone as Chimes. What time?
- Input: set an alarm with tone as jingle for 9 am tomorrow
- Output: Ok, alarm set for 2020-05-21 09:00:00. The alarm tone is jingle.
- Input: no, 8 am
- Output: Updating previous alarm time to 2020-05-29 08:00.


 > [!NOTE]
  > In a real application, in the Actions section of this correction rule, you'll also need to send back an activity to the client or call an HTTP endpoint to update the alarm time in your system. This action should be singularly responsible for just updating the alarm time and not any other attribute of the command, in this case alarm tone.


## Next steps

> [!div class="nextstepaction"]
> [How To: Add language generation templates for speech responses](./how-to-custom-commands-add-language-generation-templates.md)