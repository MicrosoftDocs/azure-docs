---
title: 'Add one-step correction in Custom Commands Preview - Speech service'
titleSuffix: Azure Cognitive Services
description: Learn how to add a one-step correction for a command in a Custom Commands Preview app.
services: cognitive-services
author: encorona-ms
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/05/2019
ms.author: encorona
---

# Add a one-step correction to a custom command in a Custom Commands Preview application

In this article, you'll learn how to add one-step confirmation to a command in a Custom Commands Preview app.

One-step correction is used to update a command that was just completed. When you add a one-step correction to an alarm command, you can change your mind and update the time of the alarm. For example:

- Input: Set alarm for tomorrow at noon
- Output: Ok, alarm set for 2020-05-02 12:00:00
- Input: No, tomorrow at 1pm
- Output: Ok

> [!NOTE]
> In a real-world scenario, the client executes an action as a result of command completion. This article assumes that you have a mechanism to update the alarm in your back-end application.

## Prerequisites

Complete the steps in the following articles:
> [!div class="checklist"]

> * [Quickstart: Create a Custom Commands Preview app](./quickstart-custom-speech-commands-create-new.md)
> * [Quickstart: Create a Custom Commands Preview app with parameters](./quickstart-custom-speech-commands-create-parameters.md)
> * [How To: Add confirmations to a command in a Custom Commands Preview app](./how-to-custom-speech-commands-confirmations.md)

## Add interaction rules for one-step correction

To demonstrate one-step correction, extend the **SetAlarm** command that you created in [How To: Add a confirmation to a command in Custom Commands Preview](./how-to-custom-speech-commands-confirmations.md).

1. Add an interaction rule to update your **SetAlarm** command.

    This rule asks the user to confirm the date and time of the alarm and expects a confirmation (yes/no) for the next turn.

   | Setting               | Suggested value                                                  | Description                                        |
   | --------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
   | **Rule Name**             | **Update previous alarm**                                            | A name describing the purpose of the rule          |
   | **Conditions**            | **Previous command needs to be updated & Required Parameter -> DateTime**                | Conditions that determine when the rule can run    |   
   | **Actions**               | **Send speech response -> Simple editor -> Updating previous alarm to {DateTime}**      | The action to take when the rule conditions are true |
   | **Post-execution state** | **Command completed**        | State of the user after the turn                   |

1. In the pane, select the interaction rule you just created. Select the ellipsis (**...**) button in the upper-left corner of the pane. Then use the **Move up** arrow to move the rule to the top of the **Interaction rules** list.
   > [!div class="mx-imgBorder"]
   > ![Add a range validation](media/custom-speech-commands/one-step-correction-rules.png)

    > [!NOTE]
    > In a real-world application, use the **Actions** section to send back an activity to the client or call an HTTP endpoint to update the alarm in your system.

## Try it out

1. Select **Train**.

1. After training is done, select **Test**, and then try these interactions:

   - Input: Set alarm for tomorrow at noon
   - Output: Are you sure you want to set an alarm for 2020-05-02 12:00:00
   - Input: Yes
   - Output: Ok, alarm set for 2020-05-02 12:00:00
   - Input: No, tomorrow at 2pm
   - Output: Updating previous alarm to 2020-05-02 14:00:00
