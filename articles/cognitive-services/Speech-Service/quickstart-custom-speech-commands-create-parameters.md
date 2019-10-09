---
title: 'Quickstart: Create a Custom Speech Command (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, you create a hosted Custom Speech Commands application.
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/26/2019
ms.author: donkim
---

# Quickstart: Create a Custom Speech Command with Parameters (Preview)

In the previous quickstart, we created a new Speech Commands application and created a Command that handled an utterance
"turn on the tv" and responded with a message "Ok, turning on the tv"

In this article, we will extend this application with parameters so that it can handle turning on and turning off multiple different
types of devices.

Open the application we created previously.

Under Parameters, let's add the parameters that we will need.
First, for specifying on or off, create a new parameter "OnOff"
Selecting "String List" as the parameter type
Mark Required
Add an elicitation prompt.  Simply "On or Off?"

Next add a second parameter to represent the device to turn on or off.
Create a new parameter "SubjectDevice"
Select "String List" parameter type
tv - television
light - lights
Mark Required
Add an elicitation prompt. "Which device?"

Sample sentences.
Think of examples with no information, partial information, and full information
Use brackets in the sample sentences editor to refer to indicate parameters
turn {OnOff} the {SubjectDevice}
{SubjectDevice} {OnOff}
turn it {OnOff}
turn something {OnOff}

Modify the completion rule
Remove the True condition
Add Required OnOff
Add Required SubjectDevice

Edit the Speech Response - Ok, turning {OnOff} the {SubjectDevice}
Same brackets and syntax highlighting as in Sample sentences

Try it out
Test Panel

turn off the tv
 - Ok, turning off the tv

turn off the television
 - Ok, turning off the tv

turn it off
- Which device?
the television
- Ok, turning off the tv

