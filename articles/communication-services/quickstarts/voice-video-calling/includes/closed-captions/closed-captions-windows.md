---
title: Get started with Azure Communication Services closed caption on Windows
titleSuffix: An Azure Communication Services quickstart document
description: Learn about the Azure Communication Services Closed Captions on Windows
author: Kunaal
services: azure-communication-services
ms.subservice: calling
ms.author: valindrae
ms.date: 04/15/2024
ms.topic: include
ms.service: azure-communication-services
---
## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- An app with voice and video calling, refer to our [Voice](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md) and [Video](../../../../quickstarts/voice-video-calling/get-started-with-video-calling.md) calling quickstarts.

>[!NOTE]
>Please note that you will need to have a voice calling app using Azure Communication Services calling SDKs to access the closed captions feature that is described in this guide.

## Models
| Name                                   | Description                                                        |
|----------------------------------------|------------------------------------------------------------------- |
| CaptionsCallFeature                    | API for captions call feature                                      |
| CommunicationCaptions                  | API for communication captions                                     |
| StartCaptionOptions                    | Closed caption options like spoken language                        |
| CommunicationCaptionsReceivedEventArgs | Data object received for each communication captions received event|

## Get closed captions feature 
You need to get and cast the Captions object to utilize Captions specific features.

``` cs
CaptionsCallFeature captionsCallFeature = call.Features.Captions;
CallCaptions callCaptions = await captionsCallFeature.GetCaptionsAsync();
if (callCaptions.CaptionsKind == CaptionsKind.CommunicationCaptions)
{
    CommunicationCaptions communicationCaptions = callCaptions as CommunicationCaptions;
} 
```

## Subscribe to listeners

### Add a listener to receive captions enabled/disabled status

``` cs
communicationCaptions.CaptionsEnabledChanged += OnIsCaptionsEnabledChanged;

private void OnIsCaptionsEnabledChanged(object sender, PropertyChangedEventArgs args)
{
    if (communicationCaptions.IsEnabled)
    {
    }
}
```

### Add a listener to receive captions type changed
This event will be triggered when the caption type changes from `CommunicationCaptions` to `TeamsCaptions` upon inviting Microsoft 365 users to ACS-only calls.

``` cs
captionsCallFeature.ActiveCaptionsTypeChanged += OnIsCaptionsTypeChanged;

private void OnIsCaptionsTypeChanged(object sender, PropertyChangedEventArgs args)
{
    // get captions
}
```

### Add listener for captions data received

``` cs 
communicationCaptions.CaptionsReceived += OnCaptionsReceived;

private void OnCaptionsReceived(object sender, CommunicationCaptionsReceivedEventArgs eventArgs)
{
    // Information about the speaker.
    // eventArgs.Speaker
    // The original text with no transcribed.
    // eventArgs.SpokenText
    // language identifier for the speaker.
    // eventArgs.SpokenLanguage
    // Timestamp denoting the time when the corresponding speech was made.
    // eventArgs.Timestamp
    // CaptionsResultKind is Partial if text contains partially spoken sentence.
    // It is set to Final once the sentence has been completely transcribed.
    // eventArgs.ResultKind
}
```

### Add a listener to receive active spoken language changed status

``` cs
communicationCaptions.ActiveSpokenLanguageChanged += OnIsActiveSpokenLanguageChanged;

private void OnIsActiveSpokenLanguageChanged(object sender, PropertyChangedEventArgs args)
{
    // communicationCaptions.ActiveSpokenLanguage
}
```

## Start captions

Once you've set up all your listeners, you can now start adding captions.

``` cs

private async void StartCaptions()
{
    var options = new StartCaptionsOptions
    {
        SpokenLanguage = "en-us"
    };
    try
    {
        await communicationCaptions.StartCaptionsAsync(options);
    }
    catch (Exception ex)
    {
    }
}
```

## Stop captions

``` cs
private async void StopCaptions()
{
    try
    {
        await communicationCaptions.StopCaptionsAsync();
    }
    catch (Exception ex)
    {
    }
}
```

## Remove caption received listener

``` cs
communicationCaptions.CaptionsReceived -= OnCaptionsReceived;
```

## Spoken language support 

### Get list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` cs
// bcp 47 formatted language code
IReadOnlyList<string> sLanguages = communicationCaptions.SupportedSpokenLanguages;```

### Set spoken language 
When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` cs 
public async void SetSpokenLanguage()
{
    try
    {
        await communicationCaptions.SetSpokenLanguageAsync("en-us");
    }
    catch (Exception ex)
    {
    }
}
```

## Clean up
Learn more about [cleaning up resources here.](../../../create-communication-resource.md?pivots=platform-azp&tabs=windows#clean-up-resources)
