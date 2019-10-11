---
title: 'Quickstart: Connect to a Custom Speech Command application with the Speech SDK (Preview)'
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

# Quickstart: Connect to a Custom Speech Command application with the Speech SDK (Preview)

In this article, you'll publish a Custom Speech Commands application and connect to it from

## Prerequisites

If you haven't created a Commands application yet, try one of the previous quickstarts.

> [Quickstart: Create a Custom Speech Command (Preview)](./quickstart-custom-speech-commands-create-new.md)

> [Quickstart: Create a Custom Speech Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)

## Publish application

> Screenshot publish

Copy the application id received from publish.

## Connect to Speech SDK

Load the Speech SDK client app that you created previously.

When creating the DialogServiceConnector, create the DialogServiceConfig using the FromSpeechCommandsAppId api.

```C#
var config = DialogServiceConfig.FromSpeechCommandsAppId(
    "<Your Application ID here>",
    "<Your Speech Subscription key here>",
    "<Your Speech Subscription key region here>");
var dialogConnector = new DialogServiceConnector(config);
```

That's all you need to connect using the Speech SDK.  Press the mic button and try speaking your commands!

## Next steps
> [!div class="nextstepaction"]
> [How To: Fulfill Commands with a REST backend (Preview)](./how-to-custom-speech-commands-fulfill-rest.md)
> [How To: Fulfill Commands on the client with the Speech SDK (Preview)](./how-to-custom-speech-commands-fulfill-sdk.md)
> [How To: Prompt for confirmation in a Command (Preview)](./how-to-custom-speech-commands-confirmation.md)
> [How To: Add Validations to Custom Speech Command parameters (Preview)](./how-to-custom-speech-commands-validations.md)

