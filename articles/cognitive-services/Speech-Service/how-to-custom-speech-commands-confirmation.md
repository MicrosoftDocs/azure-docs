---
title: 'How To: Prompt for confirmation in a Command (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, add an exit confirmation prompt to a Custom Speech Command
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# How To: Prompt for confirmation in a Command (Preview)

In this article, you'll learn how to add a yes/no confirmation prompt before completing a Command.

## Prerequisites

This article assumes that you've completed the previous quickstart.
> [Quickstart: Create a Custom Speech Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)

## Add a rule to prompt for Confirmation

Change the CompletionStrategy of the "TurnOnOff" Command from OnRequiredParameters to OnRuleDefinition.

Go to the Advanced Rules section and create a new Rule.

Setting|Suggested value|Description
---|---|---
Rule Name | Exit confirmation prompt |A name describing the purpose of the rule
Conditions| <ul><li>Required Parameter - OnOff</li><li>Required Parameter - SubjectDevice</li></ul>|Conditions that determine when the rule can run
Actions|SpeechResponse - "Ok, turn {OnOff} the {SubjectDevice}. Is that correct?"|The action to take when the rule condition is true.
RulePostExecutionState|Wait For Input|Behavior after the rule, such as waiting for user input, or completing the Command
Expectations|ExpectConfirmation - true|Expectations on the user's next input.  "ExpectConfirmation" indicates the user's next input is likely to indicate a "yes" or an "no"

To handle the positive and negative cases for the confirmation prompt, we'll add rules with the Confirmation and Confirmation denied conditions.

Add a new Rule to handle a positive response.

Setting|Suggested value|Description
---|---|---
Rule Name | Handle confirmation success |A name describing the purpose of the rule
Conditions| Successful Confirmation|Conditions that determine when the rule can run
Actions|None|The action to take when the rule condition is true.
RulePostExecutionState|Ready For Completion|Behavior after the rule, such as waiting for user input, or completing the Command

Add a new Rule to handle a negative response.

Setting|Suggested value|Description
---|---|---
Rule Name | Handle confirmation failure |A name describing the purpose of the rule
Conditions| Denied Confirmation|Conditions that determine when the rule can run
Actions|SpeechResponse - "Ok, what would you like to change?"|The action to take when the rule condition is true.
RulePostExecutionState|Wait For Input|Behavior after the rule, such as waiting for user input, or completing the Command

## Try it out

"turn on the fan"
- "Ok, turn on the fan. Is that correct?"
"yes"
- "Ok, turning on the fan"

"turn on the fan"
- "Ok, turn on the fan. Is that correct?"
"no"
- "Ok, what would you like to change?"
"turn off the tv"
- "Ok, turn off the tv. Is that correct?"
"yes"
- "Ok, turning off the tv"

When prompted for confirmation, the user may still respond with a different request or updated information.

"turn on the tv"
- "Ok, turn on the tv. Is that correct?"
"actually, I meant the fan"
- "Ok, turn on the fan. Is that correct?"
"yes"
- "Ok, turning on the fan"

## Next steps
> [!div class="nextstepaction"]
> [How To: Add Validations to Custom Speech Command parameters (Preview)](./how-to-custom-speech-commands-validations.md)

