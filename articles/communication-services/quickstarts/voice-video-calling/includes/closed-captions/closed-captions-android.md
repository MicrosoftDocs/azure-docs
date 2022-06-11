---
title: Get started with Azure Communication Services closed caption on Android
titleSuffix: An Azure Communication Services quickstart document
description: Learn about the Azure Communication Services Closed Captions in Android apps
author: RinaRish
manager: visho
services: azure-communication-services

ms.author: ektrishi
ms.date: 02/03/2022
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-android) to set up a sample app with voice calling.

## Models

| Name | Description |
| - | - |
| CaptionsCallFeature | Used to start and manage closed captions. |
| StartCaptionsOptions | Used for representing options to start closed captions. |
| CaptionsListener | Used to handle captions events. |
| CaptionsInfo | Used to representing captions data. |

## Methods
### Start captions

1. Get the ongoing call object established during the prerequisite steps.
2. Get the Captions Feature object
```java
CaptionsCallFeature captionsCallFeature = call.api(Features.CAPTIONS);
```
3. Define the CaptionsListener
```java
CaptionsListener captionsListener = new CaptionsListener() {
    @Override
    public void onCaptions(CaptionsInfo captionsInfo) {
        String captionsText = captionsInfo.getText(); // get transcribed text
        String speakerName = captionsInfo.getSpeaker().getDisplayName; // get display name of current speaker
        Date timeStamp = captionsInfo.getTimestamp(); // get timestamp corresponding to caption

        // display captionsText and information as needed...
    }
};
```
4. Register the `captionsListener`
5. Invoke `startCaptions` with the desired options.
```java
public void startCallCaptions() {
    captionsCallFeature.addOnCaptionsReceivedListener(captionsListener);
    if (!captionsCallFeature.isCaptionsActive) {
        StartCaptionsOptions startCaptionsOptions = new StartCaptionsOptions();
        startCaptionsOptions.setLanguage("en-us");

        try {
            captionsCallFeature.startCaptions(startCaptionsOptions);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```


### Stopping captions

Remove the previously registered `captionsListener`.

```java
public void stopCaptions() {
    captionsCallFeature.removeOnCaptionsReceivedListener(captionsListener);
}
```

### Get available languages

Call the `getAvailableLanguages` method on the `CaptionsCallFeature` API.

```java
String[] captionsAvailableLanguages = captionsCallFeature.getAvailableLanguages();
```

### Update language

Pass a value in from the available languages array to ensure that the requested language is supported. 

```java
public void switchCaptionsLanguage() {
    if (!captionsCallFeature.isCaptionsActive) {
        return;
    }
    try {
        captionsCallFeature.select(captionsAvailableLanguages[0]);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

## Clean up
Learn more about [cleaning up resources here.](../../../create-communication-resource.md?pivots=platform-azp&tabs=windows#clean-up-resources)