---
title: 'How to: Add a confirmation to a custom command (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, how to implements confirmations for a command in Custom Commands.
services: cognitive-services
author: encorona-ms
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/05/2019
ms.author: encorona
---

# How To: Add a confirmation to a Custom Command (Preview)

In this article, you'll learn how to add a confirmation to a command.

## Prerequisites

You must have completed the steps in the following articles:
> [!div class="checklist"]
> *  [Quickstart: Create a Custom Command (Preview)](./quickstart-custom-speech-commands-create-new.md)
> * [Quickstart: Create a Custom Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)

## Create a SetAlarm command

To demonstrate confirmations, let's create a new Command allowing the user to set an alarm.

1. Open your previously created Custom Commands application in [Speech Studio](https://speech.microsoft.com/).
1. Create a new Command `SetAlarm`.
1. Add a parameter called `DateTime` with the following configuration.

   | Setting                           | Suggested value                     |  Description                 |
   | --------------------------------- | -----------------------------------------------------| ------------|
   | Name                              | DateTime                                | A descriptive name for parameter                                |
   | Required                          | checked                                 | Checkbox indicating whether a value for this parameter is required before completing the Command |
   | Response for required parameter   | Simple editor -> What time?                              | A prompt to ask for the value of this parameter when it isn't known |
   | Type                              | DateTime                                | The type of parameter, such as Number, String, Date Time or Geography   |
   | Date Defaults                     | If date is missing use today            | Default value of the variable to use if not provided by user.  |  
   | Time Defaults                     | If time is missing use start of day     |  Default value of the variable to use if not provided by user.|

1. Add some example sentences.
   
    ```
    set an alarm for {DateTime}
    set alarm {DateTime}
    alarm for {DateTime}
   ```

1. Add a Completion rule to confirm result.

   | Setting    | Suggested value                               |Description                                     |
   | ---------- | ------------------------------------------------------- |-----|
   | Rule Name  | Set alarm                                               |    A name describing the purpose of the rule |
   | Actions    | Send speech response - Ok, alarm set for {DateTime}"    |The action to take when the rule condition is true

## Try it out

1. Select `Train` icon present on top of the right pane.

1. Once training completes, select `Test`.
    - Input: Set alarm for tomorrow at noon
    - Output: Ok, alarm set for 2020-05-02 12:00:00
    - Input: Set an alarm
    - Output: What time?
    - Input: 5pm
    - Output: Ok, alarm set for 2020-05-01 17:00:00

## Add the advanced rules for confirmation

Confirmations are achieved through addition of interactions rules.

1. In the existing `SetAlarm` command, add an **Interaction rule** by selection `+Add` icon in the middle pane and then selecting **Interaction rules** -> **Confirm command**.

    This rule will ask the user to confirm the date and time of the alarm and is expecting a confirmation (yes/no) for the next turn.

   | Setting               | Suggested value                                                                  | Description                                        |
   | --------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name             | Confirm date time                                                                | A name describing the purpose of the rule          |
   | Conditions            | Required Parameter -> DateTime                                                    | Conditions that determine when the rule can run    |   
   | Actions               | Send speech response -> Are you sure you want to set an alarm for {DateTime}?     | The action to take when the rule condition is true |
   | Expectations          | Expecting confirmation from user                                                 | Expectation for the next turn                      |
   | Post-execution state  | Wait for user's input                                                            | State for the user after the turn                  |
  
      > [!div class="mx-imgBorder"]
      > ![Create required parameter response](media/custom-speech-commands/add-validation-set-temperature.png)

1. Add another interaction rule to handle a successful confirmation (user said yes)

   | Setting               | Suggested value                                                                  | Description                                        |
   | --------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name             | Accepted confirmation                                                            | A name describing the purpose of the rule          |
   | Conditions            | Confirmation was successful & Required Parameter -> DateTime                      | Conditions that determine when the rule can run    |   
   | Post-execution state | Execute completion rules                                                          | State of the user after the turn                   |

1. Add an advanced rule to handle a confirmation denied (user said no)

   | Setting               | Suggested value                                                                  | Description                                        |
   | --------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name             | Denied confirmation                                                                   | A name describing the purpose of the rule          |
   | Conditions            | Confirmation was denied & Required Parameter -> DateTime                               | Conditions that determine when the rule can run    |   
   | Actions               | Clear parameter value -> DateTime & Send speech response -> No problem, what time then?  | The action to take when the rule condition is true |
   | State after execution | Wait for input                                                                   | State of the user after the turn                   |
   | Expectations          | Expecting parameters(s) input from the user -> DateTime                           | Expectation for the next turn                      |

## Try out the changes

Select `Train`, wait for training complete and select `Test`.

- Input: Set alarm for tomorrow at noon
- Output: Are you sure you want to set an alarm for 2020-05-02 12:00:00?
- Input: No
- Output: No problem, what time then?
- Input: 5pm
- Output: "Are you sure you want to set an alarm for 2020-05-01 17:00:00?"
- Input: Yes
- Output: Ok, alarm set for 2020-05-01 17:00:00

## Next steps

> [!div class="nextstepaction"]
> [How To: Add a one-step correction to a Custom Command (Preview)](./how-to-custom-speech-commands-one-step-correction.md)