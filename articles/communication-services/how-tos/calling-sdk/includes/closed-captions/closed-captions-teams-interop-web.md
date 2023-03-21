---
title: include file
description: Web how-to guide for enabling Closed captions during a call .
author: Kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.topic: include file
ms.date: 03/20/20223
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- An app with voice and video calling, refer to our [Voice](../../quickstarts/voice-video-calling/getting-started-with-calling.md) and [Video](../../quickstarts/voice-video-calling/get-started-with-video-calling.md) calling quickstarts.
- [Access tokesn](../../quickstarts/manage-teams-identity.md) for Microsoft 365 users. 
- [Access tokesn](../../quickstarts/identity/access-tokens.md) for External identity users.
- For Translated captions you will need to have a [Teams premium] license. 

>[!NOTE]
>Please note that you will need to have a voice calling app using ACS calling SDKs to access the closed captions feature that is described in the quickstart below.

## Join a Teams meeting


## Models
| Name | Description |
|------|-------------|
| TeamsCaptionsCallFeature | API for TeamsCall captions |
| StartCaptionOptions | Closed caption options like spoken language |
| TeamsCaptionHandler | Callback definition for handling CaptionsReceivedEventType event |
| TeamsCaptionsInfo | Data structure received for each CaptionsReceivedEventType event |

## Get captions feature for External Identity users

``` typescript
let teamsCaptions: SDK.TeamsCaptionsCallFeature = call.feature(SDK.Features.TeamsCaptions);
```

## Get captions feature for Microsoft 365 users on ACS SDK

``` typescript
let teamsCaptions: SDK.TeamsCaptionsCallFeature = teamsCall.feature(SDK.Features.TeamsCaptions);
```

## Set captions handler and start captions

Set the `captionsReceived` event handler via the `on` API

``` typescript
const teamsCaptionsHandler = (data: TeamsCaptionsInfo) => { /* USER CODE HERE - E.G. RENDER TO DOM */ }; 

try { 
// on the call object, associated with External Identity users 
const teamsCaptionsApi = call.feature(Features.TeamsCaptions); 
teamsCaptionsApi.on('captionsReceived', teamsCaptionsHandler); 
await teamsCaptionsApi.startCaptions({ spokenLanguage: 'en-us' }); 

// alternatively, on the TeamsCall object, associated with M365 identity users const teamsCaptionsApi = teamsCall.feature(Features.TeamsCaptions); teamsCaptionsApi.on('captionsReceived', teamsCaptionsHandler); await teamsCaptionsApi.startCaptions({ spokenLanguage: 'en-us' }); 
} catch (e) { 
console.log('Internal error occurred when Starting Teams Captions'); } 
```

## Get supported languages 

Access the `supportedSpokenLanguages` property on the `Features.TeamsCaptions` API. Earlier, the API was set to TeamsCaptionsApi. The property will return an array of langauges in bcp-47 format. 

``` typescript
const spokenLanguages = teamsCaptionsApi.supportedSpokenLanguages; 
```

## Update spoken language

Pass a value in from the supported spoken languages array to ensure that the requested language is supported. By default, if contoso provides no language or an unsupported language, the spoken language defaults to 'en-us'.

``` typescript
// bcp 47 formatted language code
const language = 'en-us'; 

// Altneratively, pass a value fromt he supported spoken languages array
const language = spokenLanguages[0]; 
teamsCaptionsApi.setSpokenLanguage(language);
```

## Get supported caption languages

If your organization has Teams premium license you can allow your users to leverage translated captions provided by Teams captions. The property returns an array of two-letter langauge codes in `ISO 639-1` standard. 

Access the `supportedCaptionLanguages` property on the `Features.TeamsCaptions` API. 

``` typescript
const captionLanguages = teamsCaptionsApi.supportedCaptionLanguages;
```

## Update caption language
If your organization has Teams premium license you can allow your users to leverage translated captions provided by Teams captions. Contoso can generate a list of supported caption languages by calling `teamsCaptions.supportedCaptionLanguages` that returns an array of two-letter langauge codes in `ISO 639-1` standard. 

Pass a value in from the supported caption languages array to ensure that the requested language is supported. 

``` typescript
// ISO 639-1 formatted language code
const language = 'en-us'; 

// Altneratively, pass a value fromt he supported spoken languages array
const language = captionLanguages[0]; teamsCaptionsApi.setCaptionLanguage(language);
```

## Stop captions

``` typescript
teamsCaptionsApi.stopCaptions(); 
teamsCaptionsApi.off('captionsReceived', teamsCaptionsHandler);
```
