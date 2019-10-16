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

In this How to you'll:
- Define and send a custom JSON payload from your Custom Commands application
- Receive and visualize the custom JSON payload contents from a C# UWP Speech SDK client application

## Prerequisites

This quickstart requires:

* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/).
* An Azure subscription key for Speech Services. [Get one for free](get-started.md) or create it on the [Azure portal](https://portal.azure.com).
* A previously Custom Commands app [Quickstart: Create a Custom Speech Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)
* A Speech SDK enabled client application [Quickstart: Connect to a Custom Speech Command application with the Speech SDK (Preview)](./quickstart-custom-speech-commands-speech-sdk.md)


## Optional: Get started fast

This quickstart will describe, step by step, how to make a client application to connect to your Custom Commands app. If you prefer to dive right in, the complete, ready-to-compile source code used in this quickstart is available in the [Speech SDK Samples](https://aka.ms/csspeech/samples) under the `quickstart` folder.


## Fulfill with JSON payload

First let's open our previously created Custom Speech Commands application from the [Custom Speech portal](https://speech.microsoft.com/)

In the Completion Rules section, we should have our previously created rule that responds back to the user.

In order to send a payload directly to the client, create a new rule with a Send Activity action

![Send Activity completion rule](media/custom-speech-commands/fulfill-sdk-completion-rule.png)

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

![Send Activity payload](media/custom-speech-commands/fulfill-sdk-send-activity-action.png)

## Create 

In [Quickstart: Connect to a Custom Speech Command application with the Speech SDK (Preview)](./quickstart-custom-speech-commands-speech-sdk.md) we created a Speech SDK enabled client application.

Add the following to MainPage.xaml.cs

```xml
<StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="20">
    <Grid x:Name="Grid_TV" Margin="50, 0" Width="100" Height="100" Background="Blue" Opacity=".2">
        <StackPanel>
            <TextBlock Text="TV" Margin="0, 10" TextAlignment="Center"/>
            <TextBlock x:Name="State_TV" Text="Off" TextAlignment="Center"/>
        </StackPanel>
    </Grid>
    <Grid x:Name="Grid_Fan" Margin="50, 0" Width="100" Height="100" Background="Green" Opacity=".2">
        <StackPanel>
            <TextBlock Text="Fan" Margin="0, 10" TextAlignment="Center"/>
            <TextBlock x:Name="State_Fan" Text="Off" TextAlignment="Center"/>
        </StackPanel>
    </Grid>
</StackPanel>
```

## Handle customizable payload using the Speech SDK

Since we created a JSON payload, we can add a reference to the JSON.NET library

In `InitializeDialogServiceConnector` add the following to your ActivityReceived event handler.  The additional code will extract the payload from the activity and change the visual state of the tv or fan accordingly.

```C#
connector.ActivityReceived += async (sender, activityReceivedEventArgs) =>
{
    NotifyUser($"Activity received, hasAudio={activityReceivedEventArgs.HasAudio} activity={activityReceivedEventArgs.Activity}");

    dynamic activity = JsonConvert.DeserializeObject(activityReceivedEventArgs.Activity);
    var payload = activity?.Value;

    if(payload?.name == "SetDeviceState")
    {
        var state = payload?.state;
        var device = payload?.device;
        switch(device)
        {
            case "tv":
                State_TV.Text = state;
                break;
            case "fan":
                State_Fan.Text = state;
                break;
            default:
                NotifyUser($"Received request to set unsupport device {device} to {state}");
                break;
        }
    }

    if (activityReceivedEventArgs.HasAudio)
    {
        SynchronouslyPlayActivityAudio(activityReceivedEventArgs.Audio);
    }
};
```

## Next steps
> [!div class="nextstepaction"]
> [How To: Prompt for confirmation in a Command (Preview)](./how-to-custom-speech-commands-confirmation.md)

