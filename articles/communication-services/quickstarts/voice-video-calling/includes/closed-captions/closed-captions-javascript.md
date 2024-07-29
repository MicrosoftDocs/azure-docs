---
title: include file
description: Web how-to guide for enabling Closed captions during an ACS call.
author: Kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.topic: include file
ms.date: 12/19/2023
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- An app with voice and video calling, refer to our [Voice](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md) and [Video](../../../../quickstarts/voice-video-calling/get-started-with-video-calling.md) calling quickstarts.
 

>[!NOTE]
>Please note that you will need to have a voice calling app using Azure Communication Services calling SDKs to access the closed captions feature that is described in this guide.

## Models
| Name | Description |
| ---- | ----------- |
| CaptionsCallFeature | API for Captions |
| CaptionsCommon | Base class for captions | 
| StartCaptionOptions | Closed caption options like spoken language |
| CaptionsHandler | Callback definition for handling CaptionsReceivedEventType event |
| CaptionsInfo | Data structure received for each CaptionsReceivedEventType event |

## Get closed captions feature

``` typescript
let captionsCallFeature: SDK.CaptionsCallFeature = call.feature(SDK.Features.Captions);
```


## Get captions object
You need to get and cast the Captions object to utilize Captions specific features.
``` typescript
let captions: SDK.Captions;
if (captionsCallFeature.captions.kind === 'Captions') {
    captions = captionsCallFeature.captions as SDK.Captions;
}
```

## Subscribe to listeners

### Add a listener to receive captions active/inactive status
```typescript
const captionsActiveChangedHandler = () => {
    if (captions.isCaptionsFeatureActive()) {
        /* USER CODE HERE - E.G. RENDER TO DOM */
    }
}
captions.on('CaptionsActiveChanged', captionsActiveChangedHandler);
```

### Add a listener for captions data received
Handle the returned CaptionsInfo data object. 

Note: The object contains a resultType prop that indicates whether the data is a partial caption or a finalized version of the caption. ResultType `Partial` indicates live unedited caption, while `Final` indicates a finalized interpreted version of the sentence (i.e includes punctuation and capitalization).

```typescript
const captionsReceivedHandler : CaptionsHandler = (data: CaptionsInfo) => { 
    /** USER CODE HERE - E.G. RENDER TO DOM 
     * data.resultType
     * data.speaker
     * data.spokenLanguage
     * data.spokenText
     * data.timeStamp
    */
   // Example code:
   // Create a dom element, i.e. div, with id "captionArea" before proceeding with the sample code
    let mri: string;
    switch (data.speaker.identifier.kind) {
        case 'communicationUser': { mri = data.speaker.identifier.communicationUserId; break; }
        case 'phoneNumber': { mri = data.speaker.identifier.phoneNumber; break; }
    }
    const outgoingCaption = `prefix${mri.replace(/:/g, '').replace(/-/g, '')}`;

    let captionArea = document.getElementById("captionArea");
    const captionText = `${data.timestamp.toUTCString()}
        ${data.speaker.displayName}: ${data.spokenText}`;

    let foundCaptionContainer = captionArea.querySelector(`.${outgoingCaption}[isNotFinal='true']`);
    if (!foundCaptionContainer) {
        let captionContainer = document.createElement('div');
        captionContainer.setAttribute('isNotFinal', 'true');
        captionContainer.style['borderBottom'] = '1px solid';
        captionContainer.style['whiteSpace'] = 'pre-line';
        captionContainer.textContent = captionText;
        captionContainer.classList.add(newClassName);

        captionArea.appendChild(captionContainer);
    } else {
        foundCaptionContainer.textContent = captionText;

        if (captionData.resultType === 'Final') {
            foundCaptionContainer.setAttribute('isNotFinal', 'false');
        }
    }
}; 
captions.on('CaptionsReceived', captionsReceivedHandler); 
```

### Add a listener to receive spoken language changed status
```typescript
const spokenLanguageChangedHandler = () => {
    if (captions.activeSpokenLanguage !== currentSpokenLanguage) {
        /* USER CODE HERE - E.G. RENDER TO DOM */
    }
}
captions.on('SpokenLanguageChanged', spokenLanguageChangedHandler)
```

## Start captions
Once you have set up all your listeners, you can now start adding captions.
``` typescript
try {
    await captions.startCaptions({ spokenLanguage: 'en-us' });
} catch (e) {
    /* USER ERROR HANDLING CODE HERE */
}
```

## Stop captions

``` typescript
try {
    captions.stopCaptions(); 
} catch (e) {
    /* USER ERROR HANDLING CODE HERE */
}
```

## Unsubscribe to listeners
```typescript
captions.off('CaptionsActiveChanged', captionsActiveChangedHandler);
captions.off('CaptionsReceived', captionsReceivedHandler); 
```

## Spoken language support

### Get a list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions.
The property returns an array of languages in bcp 47 format. 
``` typescript
const spokenLanguages = captions.supportedSpokenLanguages; 
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
    captions.setSpokenLanguage(language);
} catch (e) {
    /* USER ERROR HANDLING CODE HERE */
}
```
