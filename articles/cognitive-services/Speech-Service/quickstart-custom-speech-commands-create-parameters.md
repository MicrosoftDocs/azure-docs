---
title: 'Quickstart: Create a Custom Speech Command with Parameters (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, you'll add parameters to a Custom Speech Commands application.
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# Quickstart: Create a Custom Speech Command with Parameters (Preview)

In the previous article, we created a new Custom Speech Commands application to respond to utterances without parameters.

In this article, we will extend this application with parameters so that it can handle turning on and turning off multiple devices.

## Create Parameters

Open the application we created previously.

Since the Command will now handle on and off, rename the Command to "TurnOnOff".

Select the Parameters section and create a new parameter to represent whether the user wants to turn the device on or off.

> SCREENSHOT: Add OnOff string list parameter

Setting|Suggested value|Description
---|---|---
Name | OnOff |Choose a descriptive name for your parameter
Parameter Type|String List|The type of parameter, such as Number, String List, or Date Time
Possible Values|on, off|For a String List parameter, the normalized set values for this parameter
Synonyms|on, off|For a String List parameter, the normalized set values for this parameter
Required|true|Checkbox indicating whether a value for this parameter is required before completing the Command
Elicitation Prompt |"On or off?"| A prompt to ask for the value of this parameter when it isn't known

Next add a second parameter to represent the name of the devices.  For this example, a tv and a fan.

Setting|Suggested value|Description
---|---|---
Name | SubjectDevice |Choose a descriptive name for your parameter
Parameter Type|String|The type of parameter, such as Number, String, or Date Time
Parameter Configuration|String List|For Strings, a String List limits inputs to a set of possible values
Possible Values|tv, fan|For a String List, the possible set values for this parameter
Synonyms (tv)|television, telly|Optional synonyms for each possible value of a String List Parameter
Required|true|Checkbox indicating whether a value for this parameter is required before completing the Command
Elicitation Prompt |"On or off?"| A prompt to ask for the value of this parameter when it isn't known

## Add Sample Sentences

With parameters, it's helpful to add sample sentences with:
- Full parameter information
- Partial parameter information
- No parameter information

Varied examples allow the Speech Commands application to resolve both one-shot resolutions and multi-turn resolutions with partial information.

Select Sample Sentences to access the sample sentences editor.

In the sample sentences editor use brackets in the sample sentences editor to refer to indicate parameters.

> [!TIP]
> Use tab completion to refer to previously created parameters
> Valid parameter references will be highlighted in Green.  Invalid references will be highlighted in Red.

- turn \{OnOff\} the \{SubjectDevice\}
- \{SubjectDevice\} \{OnOff\}
- turn it \{OnOff\}
- turn something \{OnOff\}

> Screenshot: Syntax highlighted sample sentences

## Add Parameters to Completion rule

Modify the Completion rule that you created in the previous quickstart
- Remove the True condition
- Add Required Parameter condition for OnOff
- Add Required Parameter condition for SubjectDevice
- Edit the Speech Response to refer to the required parameters - Ok, turning \{OnOff\} the \{SubjectDevice\}


## Try it out
Open the Test chat panel and test a few interactions

turn off the tv
 - Ok, turning off the tv

turn off the television
 - Ok, turning off the tv

turn it off
- Which device?
the tv
- Ok, turning off the tv

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Connect to a Custom Speech Command application with the Speech SDK (Preview)](./quickstart-custom-speech-commands-speech-sdk.md)

