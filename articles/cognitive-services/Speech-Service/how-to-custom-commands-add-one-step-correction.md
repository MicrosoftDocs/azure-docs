---
title: 'How To: Implementing corrections in a command'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to add validations to a parameter in Custom Commands.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/27/2020
ms.author: sausin
---


# Implementing corrections in a command
In this article, you will learn how to configure one-step correction - once the fulfillment action has already been executed.

You will also see an example of how correction is enabled by default in case the command is not fulfilled yet.

## Prerequisites

You must have completed the steps in the following articles:

> [!div class="checklist"]
> * [How To: Create an empty application](./how-to-custom-commands-create-empty-project.md)
> * [How To: Add simple commands](./how-to-custom-commands-add-simple-commands.md)
> * [How To: Add parameters to commands](./how-to-custom-commands-add-simple-commands.md)

## Correction when command isn't completed

### Add a new parameter AlarmTone
1. Select **SetAlarm** command from the left pane and add a new parameter **AlarmTone**.
        
    - **Name** > `AlarmTone`
    - **Type** > String
    - **Default Value** > `Chimes`
    - **Configuration** > Accept predefined input values from internal catalog
    - **Predefined input values** > `Chimes`, `Jingle`, and `Echo`. Each as individual predefined inputs.

### Modify existing parameter DateTime
1. Update the response for the DateTime parameter to `Ready to set alarm with tone as {AlarmTone}. For what time?`

### Modify completion rule
1. Select the existing completion rule **ConfirmationResponse**.
1. In the right panel, hover over the existing action and select **Edit** button.
1. Update speech response to `Ok, alarm set for {DateTime}. The alarm tone is {AlarmTone}.`
### Try out the changes

Select **Train**, wait till training completes and select **Test**.
Try out the following utterances:

- Input: set an alarm
- Output: Ready to set alarm with tone as Chimes. For what time?
- Input: set an alarm with tone as jingle for 9 am tomorrow
- Output: Ok, alarm set for 2020-05-30 09:00:00. The alarm tone is jingle.

> [!IMPORTANT]
> Note how the alarm tone could be changed without any explicit configuration in an ongoing command, i.e. when the command was not completed yet. **Correction is enabled by default for all the command parameters, regardless of the turn number if the command is yet to be fulfilled.** 

## Correction when command is completed

Custom Commands platform also provides the capability for one step correction even when the command has been completed. But this feature isn't enabled by default and user has to explicitly configure it.

### Configure one step correction

1. In the **SetAlarm** command, add an interaction rule of type **Update previous command** to update the previously set alarm. Rename the default **Name** of the interaction rule to **Update previous alarm**.
1. Leave the default condition **Previous command needs to be updated** as is.
1.  Add a new condition as **Type > Required Parameter > DateTime**.
1. Add a new action as **Type > Send speech response > Simple editor > `Updating previous alarm time to {DateTime}.`**
1. Leave the default value of post execution state as **Command completed**.

### Try out the changes

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
> [How To: Use language generation templates for speech responses](./how-to-custom-commands-add-language-generation-templates.md)