---
title: 'How To: Add validations to Custom Command parameters'
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

# How To: Add validations to Custom Command parameters

In this article, you will add validations to parameters and prompts for correction.

## Prerequisites

You must have completed the steps in the following articles:
> [!div class="checklist"]
> * [Quickstart: Create a Custom Command](./quickstart-custom-speech-commands-create-new.md)
> * [Quickstart: Create a Custom Command with Parameters](./quickstart-custom-speech-commands-create-parameters.md)

## Create a SetTemperature Command

To demonstrate validations, let's create a new Command allowing users to set temperature.

1. Open your previously created Custom Commands application in [Speech Studio](https://speech.microsoft.com/)
1. Create a new Command **SetTemperature**
1. Add a parameter for the target temperature

   | Parameter Configuration           | Suggested value                                        
   | ----------------- | ----------------------------------| 
   | Name              | Temperature                       | 
   | Is Global         | unchecked                         | 
   | Required          | checked                           | 
   | Simple editor     | What temperature would you like?  | 
   | Type              | Number                            |

1. Add a validation for the temperature parameter

   | Parameter Configuration         | Suggested value                                          | Description                                                                        |
   | ----------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
   | Validation        | Min Value: 60, Max Value: 80                             | For Number parameters, the allowed range of values for the parameter                             |
   | Response template | Sorry, I can only set between 60 and 80 degrees      | Prompt to ask for an updated value if the validation fails                                       |

   > [!div class="mx-imgBorder"]
   > ![Add a range validation](media/custom-speech-commands/validations-add-temperature.png)
1. Add some example sentences

   ```
   set the temperature to {Temperature} degrees
   change the temperature to {Temperature}
   set the temperature
   change the temperature
   ```

1. Add a Completion rule to confirm result

   | Setting    | Suggested value                                           |
   | ---------- | --------------------------------------------------------- |
   | Name       | Confirmation Message                                      |
   | Conditions | Required Parameters - `Temperature`                       |
   | Actions    | Send speech response - `Ok, setting to {Temperature} degrees` |

> [!TIP]
> This example uses a speech response to confirm the result. For examples on completing the Command with a client action see:
> [How To: Fulfill Commands on the client with the Speech SDK](./how-to-custom-speech-commands-fulfill-sdk.md)

## Try it out

1. Click on **Train** button.
1. Once, training completes, click on **Test** button.

    - Input: Set the temperature to 72 degrees
    - Output: Ok, setting to 72 degrees
    - Input: Set the temperature to 45 degrees
    - Output: Sorry, I can only set between 60 and 80 degrees
    - Input: make it 72 degrees instead
    - Output: Ok, setting to 72 degrees

## Next steps

> [!div class="nextstepaction"]
> [How To: Add a confirmation to a Custom Command](./how-to-custom-speech-commands-confirmations.md)
