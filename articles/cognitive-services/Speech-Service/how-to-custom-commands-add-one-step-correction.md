---
title: 'How To: Add validations to Custom Command parameters'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to add validations to a parameter in Custom Commands.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: sausin
---


# Implementing corrections in Custom Command parameters
In this article, you will learn how to configure one-step correction - once the fulfillment action has already been executed.

You will see an example of how correction is enabled by default in case the command is not fulfilled yet.

## Prerequisites

You must have completed the steps in the following articles:

> [!div class="checklist"]
> * 
> *

## Correction when command isn't completed
1. Select **SetAlarm** command from the left pane and add a new parameter **AlarmTone**.
        
    1.  **Name** > AlarmTone
    1. **Type** > String
    1. **Default Value** > Chimes
    1. **Configuration** > Accept predefined input values from internal catalog
    1. **Predefined input values** > Chimes, Jingle, Echo each as individual predefined inputs.

### Try out the changes

Select **Train**, wait for training complete and select **Test**.

- Input: set an alarm
- Output: Ready to set alarm with tone as Chimes. What time?
- Input: set an alarm with tone as jingle for 9 am tomorrow
- Output: Ok, alarm set for 2020-05-21 09:00:00. The alarm tone is jingle

Note how the alarm tone could be changed without any explicit configuration in an ongoing command.

## Correction when command is completed

Custom Commands platform also provides the capability for a one step correction even when the command has been completed. But this feature isn't enabled by default and user has to explicitly configure it.

### Configure one step correction

1. In the **SetAlarm** command, add an interaction rule of type **Update previous command** to update the previously set alarm. Rename the default **Name** value to **Update previous alarm**.
1. Leave the default condition **Previous command needs to be updated** as is.
1.  Add a new condition as **Type > Required Parameter > DateTime**.
1. Add a new action as **Type > Send speech response >> Simple editor > Updating previous alarm time to {DateTime}.**

### Try out the changes

Select **Train**, wait for training complete and select **Test**.

- Input: set an alarm
- Output: Ready to set alarm with tone as Chimes. What time?
- Input: set an alarm with tone as jingle for 9 am tomorrow
- Output: Ok, alarm set for 2020-05-21 09:00:00. The alarm tone is jingle
- Input: no, 8 am
- Output: Ok, alarm set for 2020-05-21 08:00:00

Note how the alarm tone could be changed without any explicit configuration in an ongoing command.

 > [!NOTE]
  > In a real application, in the Actions section of this rule you'll also send back an activity to the client or call an HTTP endpoint to update the alarm time in your system. And this action should be singularly responsible for just updating the alarm time and not any other attribute of the command, in this case alarm tone.

## Next steps

> [!div class="nextstepaction"]
> [How To: Use language generation templates for speech responses](./how-to-custom-commands-add-language-generation-templates.md)