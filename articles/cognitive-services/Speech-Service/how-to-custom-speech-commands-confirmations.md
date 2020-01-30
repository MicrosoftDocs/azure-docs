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

- [Quickstart: Create a Custom Command (Preview)](./quickstart-custom-speech-commands-create-new.md)
- [Quickstart: Create a Custom Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)

## Create a SetAlarm command

To demonstrate validations, let's create a new Command allowing the user to set an alarm.

1. Open your previously created Custom Commands application in [Speech Studio](https://speech.microsoft.com/)
1. Create a new Command **SetAlarm**
1. Add a parameter called DateTime

   | Setting           | Suggested value                                          | Description                                                                                      |
   | ----------------- | ---------------------------------------------------------| ------------------------------------------------------------------------------------------------ |
   | Name              | DateTime                                                 | A descriptive name for your Command parameter                                                    |
   | Required          | true                                                     | Checkbox indicating whether a value for this parameter is required before completing the Command |
   | Response template | "- What time?"                                           | A prompt to ask for the value of this parameter when it isn't known                              |
   | Type              | DateTime                                                 | The type of parameter, such as Number, String, or Date Time                                      |
   | Date Defaults     | If date is missing use today                             |                                                                                                  |
   | Time Defaults     | If time is missing use start of day                      |                                                                                                  | 

1. Add some sample sentences
   
   ```
    set an alarm for {DateTime}
    set alarm {DateTime}
    alarm for {DateTime}
   ```

1. Add a Completion rule to confirm result

   | Setting    | Suggested value                                         | Description                                        |
   | ---------- | ------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name  | Set alarm                                               | A name describing the purpose of the rule          |
   | Actions    | SpeechResponse - "- Ok, alarm set for {DateTime}"       | The action to take when the rule condition is true |

## Try it out

Select the Test panel and try a few interactions.

- Input: Set alarm for tomorrow at noon
- Output: "Ok, alarm set for 12/06/2019 12:00:00"

- Input: Set an alarm
- Output: "What time?"
- Input: 5pm
- Output: "Ok, alarm set for 12/05/2019 17:00:00"

## Add the advanced rules for confirmation

1. Add an advanced rule for confirmation. 

    This rule will ask the user to confirm the date and time of the alarm and is expecting a confirmation (yes/no) for the next turn.

   | Setting               | Suggested value                                                                  | Description                                        |
   | --------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name             | Confirm date time                                                                | A name describing the purpose of the rule          |
   | Conditions            | Required Parameter - DateTime                                                    | Conditions that determine when the rule can run    |   
   | Actions               | SpeechResponse - "- Are you sure you want to set an alarm for {DateTime}?"       | The action to take when the rule condition is true |
   | State after execution | Wait for input                                                                   | State for the user after the turn                  |
   | Expectations          | Confirmation                                                                     | Expectation for the next turn                      |

1. Add an advanced rule to handle a successful confirmation (user said yes)

   | Setting               | Suggested value                                                                  | Description                                        |
   | --------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name             | Accepted confirmation                                                            | A name describing the purpose of the rule          |
   | Conditions            | SuccessfulConfirmation & Required Parameter - DateTime                           | Conditions that determine when the rule can run    |   
   | State after execution | Ready for Completion                                                             | State of the user after the turn                   |

1. Add an advanced rule to handle a confirmation denied (user said no)

   | Setting               | Suggested value                                                                  | Description                                        |
   | --------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name             | Denied confirm                                                                   | A name describing the purpose of the rule          |
   | Conditions            | DeniedConfirmation & Required Parameter - DateTime                               | Conditions that determine when the rule can run    |   
   | Actions               | ClearParameter - DateTime & SpeechResponse - "- No problem, what time then?"     | The action to take when the rule condition is true |
   | State after execution | Wait for input                                                                   | State of the user after the turn                   |
   | Expectations          | ElicitParameters - DateTime                                                      | Expectation for the next turn                      |

## Try it out

Select the Test panel and try a few interactions.

- Input: Set alarm for tomorrow at noon
- Output: "Are you sure you want to set an alarm for 12/07/2019 12:00:00?"
- Input: No
- Output: "No problem, what time then?"
- Input: 5pm
- Output: "Are you sure you want to set an alarm for 12/06/2019 17:00:00?"
- Input: Yes
- Output: "Ok, alarm set for 12/06/2019 17:00:00"

## Next steps

> [!div class="nextstepaction"]
> [How To: Add a one-step correction to a Custom Command (Preview)](./how-to-custom-speech-commands-one-step-correction.md)