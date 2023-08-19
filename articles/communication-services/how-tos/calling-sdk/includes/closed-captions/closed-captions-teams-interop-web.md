---
title: include file
description: Web how-to guide for enabling Closed captions during a Teams interop call.
author: Kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.topic: include file
ms.date: 07/21/2023
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
| ---- | ----------- |
| CaptionsCallFeature | API for Captions |
| CaptionsCommon | Base class for captions | 
| StartCaptionOptions | Closed caption options like spoken language |
| TeamsCaptionHandler | Callback definition for handling CaptionsReceivedEventType event |
| TeamsCaptionsInfo | Data structure received for each CaptionsReceivedEventType event |

## Get closed captions feature

### External Identity users
If you're building an application that allows ACS users to join a Teams meeting.
``` typescript
let captionsCallFeature: SDK.CaptionsCallFeature = call.feature(SDK.Features.Captions);
```

### Microsoft 365 users
``` typescript
let captionsCallFeature: SDK.CaptionsCallFeature = teamsCall.feature(SDK.Features.Captions);
```

## Get teams captions object
You need to get and cast the Teams Captions object to utilize Teams Captions specific features
``` typescript
let teamsCaptions: SDK.TeamsCaptions;
if (captionsCallFeature.captions.kind === 'TeamsCaptions') {
    teamsCaptions = captionsCallFeature.captions as SDK.TeamsCaptions;
}
```

## Subscribe to listeners

### Add a listener to receive captions active/inactive status
```typescript
const captionsActiveChangedHandler = () => {
    if (teamsCaptions.isCaptionsFeatureActive()) {
        /* USER CODE HERE - E.G. RENDER TO DOM */
    }
}
teamsCaptions.on('CaptionsActiveChanged', captionsActiveChangedHandler);
```

### Add a listener for captions data received
```typescript
const captionsReceivedHandler : TeamsCaptionsHandler = (data: TeamsCaptionsInfo) => { /* USER CODE HERE - E.G. RENDER TO DOM */ }; 
teamsCaptions.on('CaptionsReceived', captionsReceivedHandler); 
```

### Add a listener to receive spoken language changed status
```typescript
const spokenLanguageChangedHandler = () => {
    if (teamsCaptions.activeSpokenLanguage !== currentSpokenLanguage) {
        /* USER CODE HERE - E.G. RENDER TO DOM */
    }
}
teamsCaptions.on('SpokenLanguageChanged', spokenLanguageChangedHandler)
```

### Add a listener to receive caption language changed status
```typescript
const captionLanguageChangedHandler = () => {
    if (teamsCaptions.activeCaptionLanguage !== currentCaptionLanguage) {
        /* USER CODE HERE - E.G. RENDER TO DOM */
    }
}
teamsCaptions.on('CaptionLanguageChanged', captionLanguageChangedHandler)
```

## Start captions
Once you've set up all your listeners, you can now start adding captions.
``` typescript
try {
    await teamsCaptions.startCaptions({ spokenLanguage: 'en-us' });
} catch (e) {
    /* USER ERROR HANDLING CODE HERE */
}
```

## Stop captions

``` typescript
try {
    teamsCaptions.stopCaptions(); 
} catch (e) {
    /* USER ERROR HANDLING CODE HERE */
}
```

## Unsubscribe to listeners
```typescript
teamsCaptions.off('CaptionsActiveChanged', captionsActiveChangedHandler);
teamsCaptions.off('CaptionsReceived', captionsReceivedHandler); 
```

## Spoken language support

### Get a list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions.
The property returns an array of languages in bcp 47 format. 
``` typescript
const spokenLanguages = teamsCaptions.supportedSpokenLanguages; 
```

## Set spoken language

Pass a value in from the supported spoken languages array to ensure that the requested language is supported. 
By default, if contoso provides no language or an unsupported language, the spoken language defaults to 'en-us'.

``` typescript
// bcp 47 formatted language code
const language = 'en-us'; 

// Altneratively, pass a value from the supported spoken languages array
const language = spokenLanguages[0]; 

try {
    teamsCaptions.setSpokenLanguage(language);
} catch (e) {
    /* USER ERROR HANDLING CODE HERE */
}
```

## Caption language support

### Get a list of supported caption languages
If your organization has an active Teams premium license, you can allow your users to use translated captions provided by Teams captions. As for users with a Microsoft 365 identity, if the meeting organizer doesn't have an active Teams premium license, captions language check is done against the Microsoft 365 users account.

The property returns an array of two-letter language codes in `ISO 639-1` standard. 

``` typescript
const captionLanguages = teamsCaptions.supportedCaptionLanguages;
```

## Set caption language
``` typescript
// ISO 639-1 formatted language code
const language = 'en'; 

// Altneratively, pass a value from the supported caption languages array
const language = captionLanguages[0];
try {
    teamsCaptions.setCaptionLanguage(language);
} catch (e) {
    /* USER ERROR HANDLING CODE HERE */
}
```
