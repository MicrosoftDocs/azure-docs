---
title: 'How To: Fulfill Commands on the client with the Speech SDK (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, handle Custom Speech Commands activities on client with the Speech SDK
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# How To: Fulfill Commands on the client with the Speech SDK (Preview)

In this How to you will create a and send a custom JSON payload from the Speech Commands application and handle it directly in thje Speech SDK client.

Extend the Speech Commands application we created for turn {OnOff} the {SubjectDevice}

Extend the Speech SDK client sample

First define the Completion Rule and the payload

Go to Completion Rules
Add new completion rule
Condition - Required OnOff, Required SubjectDevice
Action Send Activity action
Content
```json
{
    "name": "SetDeviceState",
    "state": "{OnOff}",
    "device": "{SubjectDevice}"
}
```

Client handling

Add activity handler

check type == 'event' name == "SetDeviceState"

new method on mainpage.xaml.cs

```C#
void SetDeviceState(string deviceName, string state)
{

}
```

## Next steps
> [!div class="nextstepaction"]
> [How To: Prompt for confirmation in a Command (Preview)](./how-to-custom-speech-commands-confirmation.md)

