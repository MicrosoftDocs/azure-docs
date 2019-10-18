---
title: 'How To: Fulfill Custom Commands on the client with the Speech SDK (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, handle Custom Commands activities on client with the Speech SDK
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

This How To requires:

* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/).
* An Azure subscription key for Speech Services. [Get one for free](get-started.md) or create it on the [Azure portal](https://portal.azure.com).
* A previously created Custom Commands app [Quickstart: Create a Custom Command with Parameters (Preview)](./quickstart-custom-speech-commands-create-parameters.md)
* A Speech SDK enabled client application [Quickstart: Connect to a Custom Command application with the Speech SDK (Preview)](./quickstart-custom-speech-commands-speech-sdk.md)

## Optional: Get started fast

This how-to will describe, step by step, how to make a client application to talk to your Custom Commands application. If you prefer to dive right in, the complete, ready-to-compile source code used in this how-to is available in the [Speech SDK Samples](https://aka.ms/csspeech/samples).

## Fulfill with JSON payload

First let's open our previously created Custom Commands application from the [Speech Studio](https://speech.microsoft.com/)

In the Completion Rules section, we should have our previously created rule that responds back to the user.

In order to send a payload directly to the client, create a new rule with a Send Activity action

![Send Activity completion rule](media/custom-speech-commands/fulfill-sdk-completion-rule.png)

Setting|Suggested value|Description
---|---|---
Rule Name | Set Device State |A name describing the purpose of the rule
Conditions|Required Parameter - `OnOff` and `SubjectDevice`|Conditions that determine when the rule can run
Actions|Send Activity - see below|The action to take when the rule condition is true.

![Send Activity payload](media/custom-speech-commands/fulfill-sdk-send-activity-action.png)
```json
{
    "name": "SetDeviceState",
    "state": "{OnOff}",
    "device": "{SubjectDevice}"
}
```

## Create visuals for device on or off state

In [Quickstart: Connect to a Custom Command application with the Speech SDK (Preview)](./quickstart-custom-speech-commands-speech-sdk.md) we created a Speech SDK enabled client application that handled commands such as `turn on the tv`, `turn off the fan`.

Let's add some visuals so that we can see the result of those commands.

We can add labeled boxes with text indicating On or Off.

Add the following to MainPage.xaml.cs

```xml
<StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="20">
    <Grid x:Name="Grid_TV" Margin="50, 0" Width="100" Height="100" Background="LightBlue">
        <StackPanel>
            <TextBlock Text="TV" Margin="0, 10" TextAlignment="Center"/>
            <TextBlock x:Name="State_TV" Text="Off" TextAlignment="Center"/>
        </StackPanel>
    </Grid>
    <Grid x:Name="Grid_Fan" Margin="50, 0" Width="100" Height="100" Background="LightBlue">
        <StackPanel>
            <TextBlock Text="Fan" Margin="0, 10" TextAlignment="Center"/>
            <TextBlock x:Name="State_Fan" Text="Off" TextAlignment="Center"/>
        </StackPanel>
    </Grid>
</StackPanel>
```

## Handle customizable payload using the Speech SDK

Since we created a JSON payload, we can add a reference to the [JSON.NET](https://www.newtonsoft.com/json) library to handle deserialization.

![Send Activity payload](media/custom-speech-commands/fulfill-sdk-json-nuget.png)

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

## Try it out

- Start the application
- Press Enable microphone
- Press Talk button
- Try saying `turn on the tv` to change the visual state of the tv to "On"

## Next steps
> [!div class="nextstepaction"]
> [How To: Add Validations to Custom Command parameters (Preview)](./how-to-custom-speech-commands-validations.md)

