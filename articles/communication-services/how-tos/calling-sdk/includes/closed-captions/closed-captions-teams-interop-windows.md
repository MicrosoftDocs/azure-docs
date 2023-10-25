---
title: include file
description: Windows how-to guide for enabling Closed captions during a Teams interop call.
author: Kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.topic: include file
ms.date: 07/21/20223
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- An app with voice and video calling, refer to our [Voice](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md) and [Video](../../../../quickstarts/voice-video-calling/get-started-with-video-calling.md) calling quickstarts.
- [Access tokens](../../../../quickstarts/manage-teams-identity.md) for Microsoft 365 users. 
- [Access tokens](../../../../quickstarts/identity/access-tokens.md) for External identity users.
- For Translated captions, you need to have a [Teams premium](/MicrosoftTeams/teams-add-on-licensing/licensing-enhance-teams#meetings) license.  

>[!NOTE]
>Please note that you will need to have a voice calling app using Azure Communication Services calling SDKs to access the closed captions feature that is described in this guide.

## Models
| Name | Description |
|------|-------------|
| CaptionsCallFeature | API for captions call feature|
| TeamsCaptions | API for Teams captions |
| StartCaptionOptions | Closed caption options like spoken language |
| TeamsCaptionsReceivedEventArgs | Data object received for each Teams captions received event |

## Get closed captions feature 

### External Identity users and Microsoft 365 users

If you're building an application that allows Azure Communication Services users to join a Teams meeting 

``` cs
CaptionsCallFeature captionsCallFeature = call.Features.Captions;
CallCaptions callCaptions = await captionsCallFeature.GetCaptionsAsync();
if (callCaptions.CaptionsKind == CaptionsKind.TeamsCaptions)
{
    TeamsCaptions teamsCaptions = callCaptions as TeamsCaptions;
} 
```

## Subscribe to listeners

### Add a listener to receive captions enabled/disabled status

``` cs
teamsCaptions.CaptionsEnabledChanged += OnIsCaptionsEnabledChanged;

private void OnIsCaptionsEnabledChanged(object sender, PropertyChangedEventArgs args)
{
    if (teamsCaptions.IsEnabled)
    {
    }
}
```

### Add listener for captions data received

``` cs 
teamsCaptions.CaptionsReceived += OnCaptionsReceived;

private void OnCaptionsReceived(object sender, TeamsCaptionsReceivedEventArgs eventArgs)
{
    // Information about the speaker.
    // eventArgs.Speaker
    // The original text with no transcribed.
    // eventArgs.SpokenText
    // language identifier for the captions text.
    // eventArgs.CaptionLanguage
    // language identifier for the speaker.
    // eventArgs.SpokenLanguage
    // The transcribed text.
    // eventArgs.CaptionText
    // Timestamp denoting the time when the corresponding speech was made.
    // eventArgs.Timestamp
    // CaptionsResultKind is Partial if text contains partially spoken sentence.
    // It is set to Final once the sentence has been completely transcribed.
    // eventArgs.ResultKind
}
```

### Add a listener to receive active spoken language changed status

``` cs
teamsCaptions.ActiveSpokenLanguageChanged += OnIsActiveSpokenLanguageChanged;

private void OnIsActiveSpokenLanguageChanged(object sender, PropertyChangedEventArgs args)
{
    // teamsCaptions.ActiveSpokenLanguage
}
```

### Add a listener to receive active caption language changed status

``` cs
teamsCaptions.ActiveCaptionLanguageChanged += OnIsActiveCaptionLanguageChanged;

private void OnIsActiveCaptionLanguageChanged(object sender, PropertyChangedEventArgs args)
{
    // teamsCaptions.ActiveCaptionLanguage
}
```

## Start captions

Once you've set up all your listeners, you can now start adding captions.

``` cs

private async void StartCaptions()
{
    var options = new StartCaptionsOptions
    {
        SpokenLanguage = "en-US"
    };
    try
    {
        await teamsCaptions.StartCaptionsAsync(options);
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
        await teamsCaptions.StopCaptionsAsync();
    }
    catch (Exception ex)
    {
    }
}
```

## Remove caption received listener

``` cs
teamsCaptions.CaptionsReceived -= OnCaptionsReceived;
```

## Spoken language support 

### Get list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` cs
// bcp 47 formatted language code
IReadOnlyList<string> sLanguages = teamsCaptions.SupportedSpokenLanguages;```

### Set spoken language 
When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` cs 
public async void SetSpokenLanguage()
{
    try
    {
        await teamsCaptions.SetSpokenLanguageAsync("en-us");
    }
    catch (Exception ex)
    {
    }
}
```

## Caption language support 

### Get supported caption language 

If your organization has an active Teams premium license, then your Azure Communication Services users can enable translated captions as long as the organizer of the meeting has a Teams premium license. As for users with Microsoft 365 identities this check is done against their own user account if they meeting organizer doesn't have a Teams premium license.

``` cs
// ISO 639-1 formatted language code
IReadOnlyList<string> cLanguages = teamsCaptions.SupportedCaptionLanguages;
```
### Set caption language 

``` cs
public async void SetCaptionLanguage()
{
    try
    {
        await teamsCaptions.SetCaptionLanguageAsync("en");
    }
    catch (Exception ex)
    {
    }
}
```
