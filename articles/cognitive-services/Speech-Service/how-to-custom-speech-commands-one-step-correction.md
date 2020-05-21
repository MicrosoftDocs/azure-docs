---
title: 'Add a one-step correction in Custom Commands Preview - Speech service'
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

# How To: Add a one-step correction to a custom command in a Custom Commands Preview application

In this article, you'll learn how to add an interaction rule that allows a one-step correction to a command in a Custom Commands Preview app.

One-step correction is used to update a command that was just created. When a one-step correction is added to an alarm command, you can update the time of the alarm like this:

- Input: Set alarm for tomorrow at noon
- Output: Ok, alarm set for 2020-05-02 12:00:00
- Input: No, tomorrow at 1pm
- Output: Ok

In a real-world application, the client executes an action as a result of command completion. This article assumes that you, as a developer, have a mechanism to update the alarm in your back-end application.

## Prerequisites

Complete the steps in the following articles:
> [!div class="checklist"]

> * [Quickstart: Create a Custom Commands Preview app](./quickstart-custom-speech-commands-create-new.md)
> * [Quickstart: Create a Custom Commands Preview app with parameters](./quickstart-custom-speech-commands-create-parameters.md)
> * [How To: Add a confirmation to a command in a Custom Commands Preview app](./how-to-custom-speech-commands-confirmations.md)

## Add interaction rules for one-step correction

To demonstrate one-step correction, let's extend the **SetAlarm** command that you created in [How To: Add a confirmation to a command in Custom Commands Preview](./how-to-custom-speech-commands-confirmations.md).

1. Add an interaction rule to update your **SetAlarm** command.

    This rule asks the user to confirm the date and time of the alarm. The expectation for the next turn is a yes/no confirmation.

   | Setting               | Suggested value                                                  | Description                                        |
   | --------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
   | **Rule Name**             | **Update previous alarm**                                            | A name describing the purpose of the rule          |
   | **Conditions**            | **Previous command needs to be updated & Required Parameter -> DateTime**                | Conditions that determine when the rule can run    |   
   | **Actions**               | **Send speech response -> Simple editor -> Updating previous alarm to {DateTime}**      | The action to take when the rule conditions are true |
   | **Post-execution state** | **Command completed**        | State of the user after the turn                   |

1. In the pane, select the interaction rule you just created. Then select the ellipsis (**...**) button in the upper-left corner of the pane and use the **Move up** arrow to move the rule to the top of the **Interaction rules** list.
   > [!div class="mx-imgBorder"]
   > ![Add a range validation](media/custom-speech-commands/one-step-correction-rules.png)

    > [!NOTE]
    > In a real-world application, use the **Actions** section of this rule to send back an activity to the client or call an HTTP endpoint to update the alarm in your system.

## Try it out

1. Select **Train**.

1. After training is done, select **Test**, and then try some interactions:

- Input: Set alarm for tomorrow at noon
- Output: Are you sure you want to set an alarm for 2020-05-02 12:00:00
- Input: Yes
- Output: Ok, alarm set for 2020-05-02 12:00:00
- Input: No, tomorrow at 2pm
- Output: Updating previous alarm to 2020-05-02 14:00:00
