---
title: 'How to: Add a confirmation to a custom command'
titleSuffix: Azure Cognitive Services
description: In this article, you learn how to implement confirmations for a command in Custom Commands.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/18/2020
ms.author: sausin
---

# Add interaction rules

In this article, you'll learn about **interaction rules**. These are additional rules to handle more specific or complex situations. While you're free to author your own custom interaction rules, in this article, you make use of interaction rules for the following targeted scenarios:

* Confirming commands
* Adding a one-step correction to commands

To learn more about interaction rules, go to the [references](./custom-commands-references.md) section.

## Prerequisites

You must have finished the steps in the following articles:
> [!div class="checklist"]
> * [How To: Create application with simple commands](./how-to-custom-commands-create-application-with-simple-commands.md)
> * [How To: Add parameters to commands](./how-to-custom-commands-add-parameters-to-commands.md)

## Add confirmations to a command

To add a confirmation, use the **SetTemperature** command. To achieve confirmation, you create interaction rules by using the following steps.

1. Select the **SetTemperature** command in the left pane.
1. Add interaction rules by selecting **Add** in the middle pane. Then select **Interaction rules** > **Confirm command**.

    This action adds three interaction rules which will ask the user to confirm the date and time of the alarm and expects a confirmation (yes/no) for the next turn.

    1. Modify the **Confirm command** interaction rule as per the following configuration:
        1. Rename **Name** to **Confirm temperature**.
        1. Add a new condition as **Required parameters** > **Temperature**.
        1. Add a new action as **Type** > **Send speech response** > **Are you sure you want to set the temperature as {Temperature} degrees?**
        1. Leave the default value of **Expecting confirmation from user** in the **Expectations** section.
      
         > [!div class="mx-imgBorder"]
         > ![Create required parameter response](media/custom-speech-commands/add-validation-set-temperature.png)
    

    1. Modify the **Confirmation succeeded** interaction rule to handle a successful confirmation (user said yes).
      
          1. Modify **Name** to **Confirmation temperature succeeded**.
          1. Leave the already existing **Confirmation was successful** condition.
          1. Add a new condition as **Type** > **Required parameters** > **Temperature**.
          1. Leave the default value of **Post-execution state** as **Execute completion rules**.

    1. Modify the **Confirmation denied** interaction rule to handle scenarios when confirmation is denied (user said no).

          1. Modify **Name** to **Confirmation temperature denied**.
          1. Leave the already existing **Confirmation was denied** condition.
          1. Add a new condition as **Type** > **Required parameters** > **Temperature**.
          1. Add a new action as **Type** > **Send speech response** > **No problem. What temperature then?**
          1. Leave the default value of **Post-execution state** as **Wait for user's input**.

> [!IMPORTANT]
> In this article, you used the built-in confirmation capability. You can also manually add interaction rules one by one.
   

### Try out the changes

Select **Train**, wait for the training to finish, and select **Test**.

- **Input**: Set temperature to 80 degrees
- **Output**: are you sure you want to set the temperature as 80 degrees?
- **Input**: No
- **Output**: No problem. What temperature then?
- **Input**: 72 degrees
- **Output**: are you sure you want to set the temperature as 72 degrees?
- **Input**: Yes
- **Output**: OK, setting temperature to 83 degrees


## Implement corrections in a command

In this section, you configure a one-step correction, which is used after the fulfillment action has already been executed. You also see an example of how a correction is enabled by default in case the command isn't fulfilled yet. To add a correction when the command isn't completed, add the new parameter **AlarmTone**.

Select the **SetAlarm** command from the left pane, and add the new parameter **AlarmTone**.
        
- **Name** > **AlarmTone**
- **Type** > **String**
- **Default Value** > **Chimes**
- **Configuration** > **Accept predefined input values from the internal catalog**
- **Predefined input values** > **Chimes**, **Jingle**, and **Echo** as individual predefined inputs


Next, update the response for the **DateTime** parameter to **Ready to set alarm with tone as {AlarmTone}. For what time?**. Then modify the completion rule as follows:

1. Select the existing completion rule **ConfirmationResponse**.
1. In the right pane, hover over the existing action and select **Edit**.
1. Update the speech response to **OK, alarm set for {DateTime}. The alarm tone is {AlarmTone}.**

### Try out the changes

Select **Train**, wait for the training to finish, and select **Test**.
Try out the following utterances:

- **Input**: Set an alarm.
- **Output**: Ready to set alarm with tone as Chimes. For what time?
- **Input**: Set an alarm with the tone as Jingle for 9 am tomorrow.
- **Output**: OK, alarm set for 2020-05-30 09:00:00. The alarm tone is Jingle.

> [!IMPORTANT]
> The alarm tone could be changed without any explicit configuration in an ongoing command, for example, when the command wasn't finished yet. *A correction is enabled by default for all the command parameters, regardless of the turn number if the command is yet to be fulfilled.*

### Correction when command is completed

The Custom Commands platform also provides the capability for a one-step correction even when the command has been completed. This feature isn't enabled by default. It must be explicitly configured. Use the following steps to configure a one-step correction.

1. In the **SetAlarm** command, add an interaction rule of the type **Update previous command** to update the previously set alarm. Rename the default **Name** of the interaction rule to **Update previous alarm**.
1. Leave the default condition **Previous command needs to be updated** as is.
1. Add a new condition as **Type** > **Required Parameter** > **DateTime**.
1. Add a new action as **Type** > **Send speech response** > **Simple editor** > **Updating previous alarm time to {DateTime}.**
1. Leave the default value of **Post-execution state** as **Command completed**.

### Try out the changes

Select **Train**, wait for the training to finish, and select **Test**.

- **Input**: Set an alarm.
- **Output**: Ready to set alarm with tone as Chimes. For what time?
- **Input**: Set an alarm with the tone as Jingle for 9 am tomorrow.
- **Output**: OK, alarm set for 2020-05-21 09:00:00. The alarm tone is Jingle.
- **Input**: No, 8 am.
- **Output**: Updating previous alarm time to 2020-05-29 08:00.

> [!NOTE]
> In a real application, in the **Actions** section of this correction rule, you'll also need to send back an activity to the client or call an HTTP endpoint to update the alarm time in your system. This action should be solely responsible for updating the alarm time and not any other attribute of the command. In this case, that would be the alarm tone.

## Next steps

> [!div class="nextstepaction"]
> [How to: Add language generation templates for speech responses](./how-to-custom-commands-add-language-generation-templates.md)
