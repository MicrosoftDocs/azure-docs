---
title: 'How To: Add Validations to Custom Speech Command parameters (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, add validations to Custom Speech Command parameters
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# How To: Add Validations to Custom Speech Command parameters (Preview)

In this article, you'll learn how to add validations to parameters and prompt for correction.

To demonstrate validations, create a new Command allowing the user to set the temperature.

Create a new Command "SetTemperature"

Add a parameter for the target temperature.

---|---|---
Name | Temperature |Choose a descriptive name for your parameter
Parameter Type|Number|The type of parameter, such as Number, String, or Date Time
Validations|NumberInRange|For Strings, a String List limits inputs to a set of possible values
On Failure Prompt|"Sorry, I can only set between 50 and 80 degrees"|Prompt to ask for an updated value if the validation fails
Required|true|Checkbox indicating whether a value for this parameter is required before completing the Command
Elicitation Prompt |"What temperature would you like?"| A prompt to ask for the value of this parameter when it isn't known

Remember to add some sample sentences
- set the temperature to {Temperature} degrees
- change the temperature to {Temperature}
- set the temperature
- change the temperature

Finally, add a Completion rule to confirm result.

Setting|Suggested value|Description
---|---|---
Rule Name | Confirmation Message |A name describing the purpose of the rule
Conditions|Required Parameter - Temperature|Conditions that determine when the rule can run
Actions|SpeechResponse - "Ok, setting to {Temperature} degrees"|The action to take when the rule condition is true.

> [!TIP]
> This example uses a speech response to confirm the result.  For examples on completing the Command with a REST or client action see:
> [How To: Fulfill Commands with a REST backend (Preview)](./how-to-custom-speech-commands-fulfill-rest.md)
> [How To: Fulfill Commands on the client with the Speech SDK (Preview)](./how-to-custom-speech-commands-fulfill-sdk.md)

## Try it out
Select the "Test" panel

"Set the temperature to 65 degrees"
- "Ok, setting to 65 degrees"

"Set the temperature to 45 degrees"
- "Sorry, I can only set between 50 and 80 degrees"
"Ok, make it 60 degrees instead"
- "Ok, setting to 65 degrees"
