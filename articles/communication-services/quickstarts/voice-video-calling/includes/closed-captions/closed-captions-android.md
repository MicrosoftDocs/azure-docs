---
title: Get started with Azure Communication Services closed caption on Android
titleSuffix: An Azure Communication Services quickstart document
description: Learn about the Azure Communication Services Closed Captions in Android apps
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
| Name                               | Description                                                       |
| ---------------------------------- | ----------------------------------------------------------------- |
| CaptionsCallFeature                | API for captions call feature                                     |
| CommunicationCaptions              | API for communication captions                                    |
| StartCaptionOptions                | Closed caption options like spoken language                       |
| CommunicationCaptionsListener      | Listener for CommunicationCaptions addOnCaptionsReceivedListener  |
| CommunicationCaptionsReceivedEvent | Data object received for each CommunicationCaptionsListener event |

## Get closed captions feature 
You need to get and cast the Captions object to utilize Captions specific features.

``` java
CaptionsCallFeature captionsCallFeature = call.feature(Features.CAPTIONS);
captionsCallFeature.getCaptions().whenComplete(
    ((captions, throwable) -> {
        if (throwable == null) {
            CallCaptions callCaptions = captions;
            if (captions.getCaptionsType() == CaptionsType.COMMUNICATION_CAPTIONS) {
            // communication captions
            CommunicationCaptions communicationCaptions = (CommunicationCaptions) captions;
            }
        } else {
        // get captions failed
        // throwable is the exception/cause
        }
    }));
```

## Subscribe to listeners

### Add a listener to receive captions enabled/disabled status

``` java
public void addOnIsCaptionsEnabledChangedListener() {
    communicationCaptions.addOnCaptionsEnabledChangedListener( (PropertyChangedEvent args) -> {
        if(communicationCaptions.isEnabled()) {
            // captions enabled
        }
    });
}
```

### Add a listener to receive captions type changed 
This event will be triggered when the caption type changes from `CommunicationCaptions` to `TeamsCaptions` upon inviting Microsoft 365 users to ACS-only calls.

``` java
public void addOnIsCaptionsTypeChangedListener() {
    captionsCallFeature.addOnActiveCaptionsTypeChangedListener( (PropertyChangedEvent args) -> {
        if(communicationCaptions.isEnabled()) {
            // captionsCallFeature.getCaptions();
        }
    });
}
```

### Add listener for captions data received

``` java 
CommunicationCaptionsListener captionsListener = (CommunicationCaptionsReceivedEvent args) -> {
  // Information about the speaker.
  // CallerInfo participantInfo = args.getSpeaker();
  // The original text with no transcribed.
  // args.getSpokenText();
  // language identifier for the speaker.
  // args.getSpokenLanguage();
  // Timestamp denoting the time when the corresponding speech was made.
  // args.getTimestamp();
  // CaptionsResultType is Partial if text contains partially spoken sentence.
  // It is set to Final once the sentence has been completely transcribed.
  // args.getResultType() == CaptionsResultType.FINAL;
}; 
public void addOnCaptionsReceivedListener() {
  communicationCaptions.addOnCaptionsReceivedListener(captionsListener); 
}
```

### Add a listener to receive active spoken language changed status

``` java
public void addOnActiveSpokenLanguageChangedListener() {
    communicationCaptions.addOnActiveSpokenLanguageChangedListener( (PropertyChangedEvent args) -> {
       // communicationCaptions.getActiveSpokenLanguage()
    });
}
```

## Start captions

Once you've set up all your listeners, you can now start adding captions.

``` java
public void startCaptions() {
    StartCaptionsOptions startCaptionsOptions = new StartCaptionsOptions();
    startCaptionsOptions.setSpokenLanguage("en-us");
    communicationCaptions.startCaptions(startCaptionsOptions).whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Stop captions

``` java
public void stopCaptions() {
    communicationCaptions.stopCaptions().whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Remove caption received listener

``` java
public void removeOnCaptionsReceivedListener() {
    communicationCaptions.removeOnCaptionsReceivedListener(captionsListener);
}
```

## Spoken language support 

### Get list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` java
// bcp 47 formatted language code
communicationCaptions.getSupportedSpokenLanguages();
```

### Set spoken language 
When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` java 
public void setSpokenLanguage() {
    communicationCaptions.setSpokenLanguage("en-us").whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Clean up
Learn more about [cleaning up resources here.](../../../create-communication-resource.md?pivots=platform-azp&tabs=windows#clean-up-resources)
