---
title: Get started with Azure Communication Services closed caption on iOS
titleSuffix: An Azure Communication Services quickstart document
description: Learn about the Azure Communication Services Closed Captions in iOS apps
author: RinaRish
manager: visho
services: azure-communication-services

ms.author: ektrishi
ms.date: 02/03/2022
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

Refer to the [Voice Calling Quickstart](../../getting-started-with-calling.md?pivots=platform-ios) to set up a sample app with voice calling.

## Models

| Name | Description |
| - | - |
| CaptionsCallFeature | Used to start and manage closed captions. |
| StartCaptionsOptions | Used for representing options to start closed captions. |
| CaptionsCallFeatureDelegate | Used to handle captions events. |
| CaptionsInfo | Used to representing captions data. |

## Methods

### Start captions

1. Get the ongoing call object established during the prerequisite steps.
2. Get the Captions Feature object
```swift
var captionsFeature = self.call!.feature(Features.captions)
```
3. Define the CaptionsCallFeatureDelegate
```swift
@State var callObserver:CallObserver?
extension CallObserver: CaptionsCallFeatureDelegate {
    init(view:<nameOfView>) {
        owner = view
        super.init()
    }
    public func captionsCallFeature(_ captionsFeature: CaptionsCallFeature, didChangeCaptionsState args: PropertyChangedEventArgs) {
        os_log("Call captions state changed to %d", log:log, captionsFeature.isCaptionsActive)
    }
    
    public func captionsCallFeature(_ captionsFeature: CaptionsCallFeature, didReceiveCaptions: CaptionsInfo) {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .short
        let displayedTime = formatter.string(from: didReceiveCaptions.timestamp)
        let captionsText = "\(displayedTime) \(didReceiveCaptions.speaker.displayName): \(didReceiveCaptions.text)"
        // next display captionsText
    }
}
self.callObserver = CallObserver(view:self)
```
4. Register the captions feature delegate.
5. Invoke `startCaptions` with the desired options.
```swift
func startCaptions() {
    captionsFeature!.delegate = self.callObserver
    if(!captionsFeature!.isCaptionsActive) {
        let startCaptionsOptions = StartCaptionsOptions()
        startCaptionsOptions.language = "en-us"
        captionsFeature!.startCaptions(startCaptionsOptions: startCaptionsOptions, completionHandler: { (error) in
            if (error != nil) {
                print ("Call captions Failed to start caption %@", error! as Error)
            }
        })
    }
}
```

### Stopping captions

Remove the previously registered delegate.

```swift
func stopCaptions() {
    captionsFeature?.delegate = nil
}
```

### Get available languages

Access the `availableLanguages` property on the `CaptionsCallFeature` API.

```swift
var captionsAvailableLanguages = captionsFeature!.availableLanguages
```

### Update language

Pass a value in from the available languages array to ensure that the requested language is supported. 

```swift
func switchCaptionsLanguage() {
    if (!captionsFeature!.isCaptionsActive) {
        return
    }
    captionsFeature!.select(language: captionsAvailableLanguages[0], completionHandler: { (error) in
        if (error != nil) {
            print ("Call captions Failed to switch language %@", error! as Error)
        }
    })
}
```

## Clean up
Learn more about [cleaning up resources here.](../../../create-communication-resource.md?pivots=platform-azp&tabs=windows#clean-up-resources)