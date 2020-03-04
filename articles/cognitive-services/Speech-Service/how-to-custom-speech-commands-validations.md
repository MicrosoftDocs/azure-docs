---
title: 'How To: Add validations to Custom Command parameters (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to add validations to a parameter in Custom Commands.
services: cognitive-services
author: don-d-kim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# How To: Add validations to Custom Command parameters (Preview)

In this article, you'll learn how to add validations to parameters and prompt for correction.

## Prerequisites

You must have completed the steps in the following articles:

- [Quickstart: Create a Custom Command (Preview)](./quickstart-custom-speech-commands-create-new.md)
- [Quickstart: Create a Custom Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)

## Create a SetTemperature Command

To demonstrate validations, let's create a new Command allowing the user to set the temperature.

1. Open your previously created Custom Commands application in [Speech Studio](https://speech.microsoft.com/)
1. Create a new Command **SetTemperature**
1. Add a parameter for the target temperature
1. Add a validation for the temperature parameter
   > [!div class="mx-imgBorder"]
   > ![Add a range validation](media/custom-speech-commands/validations-add-temperature.png)

   | Setting           | Suggested value                                          | Description                                                                                      |
   | ----------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
   | Name              | Temperature                                              | A descriptive name for your Command parameter                                                    |
   | Required          | true                                                     | Checkbox indicating whether a value for this parameter is required before completing the Command |
   | Response template | "- What temperature would you like?"                     | A prompt to ask for the value of this parameter when it isn't known                              |
   | Type              | Number                                                   | The type of parameter, such as Number, String, or Date Time                                      |
   | Validation        | Min Value: 60, Max Value: 80                             | For Number parameters, the allowed range of values for the parameter                             |
   | Response template | "- Sorry, I can only set between 60 and 80 degrees"      | Prompt to ask for an updated value if the validation fails                                       |

1. Add some sample sentences

   ```
   set the temperature to {Temperature} degrees
   change the temperature to {Temperature}
   set the temperature
   change the temperature
   ```

1. Add a Completion rule to confirm result

   | Setting    | Suggested value                                           | Description                                        |
   | ---------- | --------------------------------------------------------- | -------------------------------------------------- |
   | Rule Name  | Confirmation Message                                      | A name describing the purpose of the rule          |
   | Conditions | Required Parameter - Temperature                          | Conditions that determine when the rule can run    |
   | Actions    | SpeechResponse - "- Ok, setting to {Temperature} degrees" | The action to take when the rule condition is true |

> [!TIP]
> This example uses a speech response to confirm the result. For examples on completing the Command with a client action see:
> [How To: Fulfill Commands on the client with the Speech SDK (Preview)](./how-to-custom-speech-commands-fulfill-sdk.md)

## Try it out

Select the Test panel and try a few interactions.

- Input: Set the temperature to 72 degrees
- Output: "Ok, setting to 72 degrees"

- Input: Set the temperature to 45 degrees
- Output: "Sorry, I can only set between 60 and 80 degrees"
- Input: make it 72 degrees instead
- Output: "Ok, setting to 72 degrees"

## Next steps

> [!div class="nextstepaction"]
> [How To: Add a confirmation to a Custom Command (Preview)](./how-to-custom-speech-commands-confirmations.md)
