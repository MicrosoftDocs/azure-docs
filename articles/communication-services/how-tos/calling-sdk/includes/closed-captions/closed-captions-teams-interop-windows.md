---
title: include file
description: Windows how-to guide for enabling Closed captions during a call.
author: Kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.topic: include file
ms.date: 03/20/2023
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
>Please note that you will need to have a voice calling app using ACS calling SDKs to access the closed captions feature that is described in this guide.

## Models
| Name | Description |
|------|-------------|
| TeamsCaptionsCallFeature | API for TeamsCall captions |
| StartCaptionOptions | Closed caption options like spoken language |
| CaptionsReceived | Listener for captions data |
| TeamsCaptionsInfo | Data object received for each CaptionsActiveChanged event |

## Get closed captions feature 

### External Identity users

If you're building an application that allows ACS users to join a Teams meeting 

``` cs
TeamsCaptionsCallFeature captionsCallFeature = call.Features.TeamsCaptions;
```

### Microsoft 365 users 

If you're building an application for Microsoft 365 Users using ACS SDK. 

``` cs
TeamsCaptionsCallFeature captionsCallFeature = teamCall.Features.TeamsCaptions;
```

## Subscribe to listeners

### Add a listener to receive captions active/inactive status

``` cs
captionsCallFeature.CaptionsActiveChanged += OnIsCaptionsActiveChanged;

private void OnIsCaptionsActiveChanged(object sender, PropertyChangedEventArgs args)
{
    if (captionsCallFeature.IsCaptionsFeatureActive)
    {
    }
}
```

### Add listener for captions data received

``` cs 
captionsCallFeature.CaptionsReceived += OnCaptionsReceived;

private void OnCaptionsReceived(object sender, TeamsCaptionsInfo info)
{
}
```

## Start captions

Once you've got all your listeners setup, you can now start captions.

``` cs

private async void StartCaptions()
{
    var options = new StartCaptionsOptions
    {
        SpokenLanguage = "en-US"
    };
    try
    {
        await captionsCallFeature.StartCaptionsAsync(options);
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
        await captionsCallFeature.StopCaptionsAsync();
    }
    catch (Exception ex)
    {
    }
}
```

## Remove caption received listener

``` cs
captionsCallFeature.CaptionsReceived -= OnCaptionsReceived;
```

## Spoken language support 

### Get list of supported spoken languages

Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` cs
// bcp 47 formatted language code
IReadOnlyList<string> sLanguages = captionsCallFeature.SupportedSpokenLanguages;
```

### Set spoken language 

When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` cs 
public async void SetSpokenLanguage()
{
    try
    {
        await captionsCallFeature.SetSpokenLanguageAsync("en-us");
    }
    catch (Exception ex)
    {
    }
}
```

## Caption language support 

### Get supported caption language 

If your organization has an active Teams premium license, then your ACS users can enable translated captions as long as the organizer of the meeting has a Teams premium license. As for users with Microsoft 365 identities this check is done against their own user account if they meeting organizer doesn't have a Teams premium license.

``` cs
// ISO 639-1 formatted language code
IReadOnlyList<string> cLanguages = captionsCallFeature.SupportedCaptionLanguages;
```
### Set caption language 

``` cs
public async void SetCaptionLanguage()
{
    try
    {
        await captionsCallFeature.SetCaptionLanguageAsync("en");
    }
    catch (Exception ex)
    {
    }
}
```
