---
title: Get started with Azure Communication Services closed caption on iOS
titleSuffix: An Azure Communication Services quickstart document
description: Learn about the Azure Communication Services Closed Captions in iOS apps
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
| Name                                   | Description                                                         |
| -------------------------------------- | ------------------------------------------------------------------- |
| CaptionsCallFeature                    | API for captions call feature                                       |
| CommunicationCaptions                  | API for communication captions                                      |
| StartCaptionOptions                    | Closed caption options like spoken language                         |
| CommunicationCaptionsDelegate          | Delegate for communication captions                                 |
| CommunicationCaptionsReceivedEventArgs | Data object received for each communication captions received event |

## Get closed captions feature 
You need to get and cast the Captions object to utilize Captions specific features.

``` swift
if let call = self.call {
    @State var captionsCallFeature = call.feature(Features.captions)
    captionsCallFeature.getCaptions{(value, error) in
        if let error = error {
            // failed to get captions
        } else {
            if (value?.type == CaptionsType.communicationCaptions) {
                // communication captions
                @State var communicationCaptions = value as? CommunicationCaptions
            }
        }
    }
}
```

## Subscribe to listeners

### Add a listener to receive captions enabled/disabled, type, spoken language, caption language status changed and data received

The event `didChangeActiveCaptionsType` will be triggered when the caption type changes from `CommunicationCaptions` to `TeamsCaptions` upon inviting Microsoft 365 users to ACS-only calls.

```swift
extension CallObserver: CommunicationCaptionsDelegate {
    // listener for receive captions enabled/disabled status
    public func communicationCaptions(_ communicationCaptions: CommunicationCaptions, didChangeCaptionsEnabledState args: PropertyChangedEventArgs) {
        // communicationCaptions.isEnabled
    }
    
    // listener for active spoken language state change
    public func communicationCaptions(_ communicationCaptions: CommunicationCaptions, didChangeActiveSpokenLanguageState args: PropertyChangedEventArgs) {
        // communicationCaptions.activeSpokenLanguage
    }
    
    // listener for captions data received
    public func communicationCaptions(_ communicationCaptions: CommunicationCaptions, didReceiveCaptions:CommunicationCaptionsReceivedEventArgs) {
            // Information about the speaker.
            // didReceiveCaptions.speaker
            // The original text with no transcribed.
            // didReceiveCaptions.spokenText
            // language identifier for the speaker.
            // didReceiveCaptions.spokenLanguage
            // Timestamp denoting the time when the corresponding speech was made.
            // didReceiveCaptions.timestamp
            // CaptionsResultType is Partial if text contains partially spoken sentence.
            // It is set to Final once the sentence has been completely transcribed.
            // didReceiveCaptions.resultType
    }
}

communicationCaptions.delegate = self.callObserver

extension CallObserver: CaptionsCallFeatureDelegate {
    // captions type changed
    public func captionsCallFeature(_ captionsCallFeature: CaptionsCallFeature, didChangeActiveCaptionsType args: PropertyChangedEventArgs) {
        // captionsCallFeature.getCaptions to get captions
    }
}

captionsCallFeature.delegate = self.callObserver
```

## Start captions

Once you've set up all your listeners, you can now start adding captions.

``` swift
func startCaptions() {
    guard let communicationCaptions = communicationCaptions else {
        return
    }
    let startCaptionsOptions = StartCaptionsOptions()
    startCaptionsOptions.spokenLanguage = "en-us"
    communicationCaptions.startCaptions(startCaptionsOptions: startCaptionsOptions, completionHandler: { (error) in
        if error != nil {
            
        }
    })
}
```

## Stop captions

``` swift
func stopCaptions() {
    communicationCaptions.stopCaptions(completionHandler: { (error) in
        if error != nil {
            
        }
    })
}
```

## Remove caption received listener

``` swift
communicationCaptions?.delegate = nil
```

## Spoken language support 

### Get list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` swift
// bcp 47 formatted language code
let spokenLanguage : String = "en-us"
for language in communicationCaptions?.supportedSpokenLanguages ?? [] {
    // choose required language
    spokenLanguage = language
}
```

### Set spoken language 
When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` swift 
func setSpokenLanguage() {
    guard let communicationCaptions = self.communicationCaptions else {
        return
    }

    communicationCaptions.set(spokenLanguage: spokenLanguage, completionHandler: { (error) in
        if let error = error {
        }
    })
}
```

## Clean up
Learn more about [cleaning up resources here.](../../../create-communication-resource.md?pivots=platform-azp&tabs=windows#clean-up-resources)
