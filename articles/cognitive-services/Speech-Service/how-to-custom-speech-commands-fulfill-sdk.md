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

In this How to you will create a and send a custom JSON payload from the Speech Commands application and handle it directly in the Speech SDK client.

Extend the Speech Commands application we created for turn {OnOff} the {SubjectDevice}

Extend the Speech SDK client sample

First define the Completion Rule and the payload

## Send a customizable payload on Command completion

Go to Completion Rules and create a new completion rule

Setting|Suggested value|Description
---|---|---
Rule Name | Confirmation Message |A name describing the purpose of the rule
Conditions|<ul><li>Required Parameter - OnOff</li><li>Required Parameter - SubjectDevice</li></ul>|Conditions that determine when the rule can run
Actions|Send Activity|The action to take when the rule condition is true.

Example activity content
```json
{
    "name": "SetDeviceState",
    "state": "{OnOff}",
    "device": "{SubjectDevice}"
}
```

## Handle customizable payload using the Speech SDK

Client handling

Add activity handler

```C#
void SetDeviceState(string deviceName, string state)
{

}
```

check type == 'event' name == "SetDeviceState"
```C#
private void SpeechBotConnector_ActivityReceived(object sender, ActivityReceivedEventArgs e)
{
    var json = e.Activity;
    var activity = JsonConvert.DeserializeObject<Activity>(json);

    if(activity.Type == "event" && activity.Value is JObject payload)
    {
        switch(payload["name"])
    }

}
```

## Next steps
> [!div class="nextstepaction"]
> [How To: Prompt for confirmation in a Command (Preview)](./how-to-custom-speech-commands-confirmation.md)

