---
title: 'How to: Add a one-step correction to a custom command (Preview) - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to implement one-step corrections for a command in Custom Commands.
services: cognitive-services
author: encorona-ms
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/05/2019
ms.author: encorona
---

# How To: Add a one-step correction to a Custom Command (Preview)

In this article, you'll learn how to add one-step confirmation to a command.

One-step correction is used to update a command that was just completed. That is, if you just set up an alarm, you can change your mind and update the time of the alarm. An example of such case is as follows-

- Input: Set alarm for tomorrow at noon
- Output: Ok, alarm set for 2020-05-02 12:00:00
- Input: No, tomorrow at 1pm
- Output: Ok

A real world scenario, which is generally accompanied by client executing an action as a result of command completion - this article assumes that you as a developer have a mechanism to update the alarm in your back-end application.

## Prerequisites

You must have completed the steps in the following articles:
> [!div class="checklist"]

> * [Quickstart: Create a Custom Command (Preview)](./quickstart-custom-speech-commands-create-new.md)
> * [Quickstart: Create a Custom Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)
> * [How To: Add a confirmation to a Custom Command (Preview)](./how-to-custom-speech-commands-confirmations.md)


## Add interaction rules for one-step correction 

To demonstrate one-step correction, let's extend the **SetAlarm** command created in [How To: Add a confirmation to a Custom Command (Preview)](./how-to-custom-speech-commands-confirmations.md).
1. Add an interaction rule to update the previously set alarm. 

    This rule will ask the user to confirm the date and time of the alarm and is expecting a confirmation (yes/no) for the next turn.

   | Setting               | Suggested value                                                  | Description                                        |
   | --------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name             | Update previous alarm                                            | A name describing the purpose of the rule          |
   | Conditions            | Previous command needs to be updated & Required Parameter -> DateTime                | Conditions that determine when the rule can run    |   
   | Actions               | Send speech response -> Simple editor -> Updating previous alarm to {DateTime}      | The action to take when the rule conditions are true |
   | Post-execution state | Command completed        | State of the user after the turn                   |

1. Move the rule you just created to the top of interaction rules (select the rule in the panel and click the UP arrow present under `...` icon on the top of the middle pane).
   > [!div class="mx-imgBorder"]
   > ![Add a range validation](media/custom-speech-commands/one-step-correction-rules.png)
    > [!NOTE]
    > In a real application, in the Actions section of this rule you'll also send back an activity to the client or call an HTTP endpoint to update the alarm in your system.

## Try it out

Select `Train`, wait for training complete, and select `Test`.

- Input: Set alarm for tomorrow at noon
- Output: Are you sure you want to set an alarm for 2020-05-02 12:00:00
- Input: Yes
- Output: Ok, alarm set for 2020-05-02 12:00:00
- Input: No, tomorrow at 2pm
- Output: Updating previous alarm to 2020-05-02 14:00:00
