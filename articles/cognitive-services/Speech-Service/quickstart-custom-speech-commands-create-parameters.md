---
title: 'Quickstart: Create a Custom Speech Command with Parameters (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, you will add parameters to a Custom Speech Commands application.
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

In the previous quickstart, we created a new Speech Commands application and created a Command that handled an utterance
"turn on the tv" and responded with a message "Ok, turning on the tv"

In this quickstart, we will extend this application with parameters so that it can handle turning on and turning off multiple different
types of devices.

## Create Parameters

Open the application we created previously.

Under Parameters, create a new parameter to represent whether to turn on or off the target device
- Create a new parameter "OnOff"
- Select "String List" as the parameter type
- Add "on" and "off" as possible values for the String List
- Mark the parameter Required
- Add an elicitation prompt with the message "On or Off?"

Next add a second parameter to represent the name of the device to turn on or off
- Create a new parameter "SubjectDevice"
- Select "String List" as the parameter type
- Add "tv" and "fan" as possible values for the String List
- Mark the parameter Required
- Add an elicitation prompt with the message "Which Device"

## Add Sample Sentences

When using parameters, it is helpful to add sample sentences with:
- full parameter information
- partial parameter information
- no parameter information

This will allow the Speech Commands application to resolve both one shot resolutions, as well as multi-turn resolutions with partial information.

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
the television
- Ok, turning off the tv

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Connect to a Custom Speech Command application with the Speech SDK (Preview)](./quickstart-custom-speech-commands-speech-sdk.md)

