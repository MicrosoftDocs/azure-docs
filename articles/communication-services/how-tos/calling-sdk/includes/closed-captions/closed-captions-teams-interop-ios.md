---
title: include file
description: iOS how-to guide for enabling Closed captions during a Teams interop call.
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
| TeamsCaptionsDelegate | Delegate for Teams captions |
| TeamsCaptionsReceivedEventArgs | Data object received for each Teams captions received event |

## Get closed captions feature 

### External Identity users and Microsoft 365 users

If you're building an application that allows Azure Communication Services users to join a Teams meeting 

``` swift
if let call = self.call {
    @State var captionsCallFeature = call.feature(Features.captions)
    captionsCallFeature.getCaptions{(value, error) in
        if let error = error {
            // failed to get captions
        } else {
            if (value?.type == CaptionsType.teamsCaptions) {
                // teams captions
                @State var teamsCaptions = value as? TeamsCaptions
            }
        }
    }
}
```

## Subscribe to listeners

### Add a listener to receive captions enabled/disabled, spoken language, caption language status changed and data received

```swift
extension CallObserver: TeamsCaptionsDelegate {
    // listener for receive captions enabled/disabled status
    public func teamsCaptions(_ teamsCaptions: TeamsCaptions, didChangeCaptionsEnabledState args: PropertyChangedEventArgs) {
        // teamsCaptions.isEnabled
    }
    
    // listener for active spoken language state change
    public func teamsCaptions(_ teamsCaptions: TeamsCaptions, didChangeActiveSpokenLanguageState args: PropertyChangedEventArgs) {
        // teamsCaptions.activeSpokenLanguage
    }
    
    // listener for active caption language state change
    public func teamsCaptions(_ teamsCaptions: TeamsCaptions, didChangeActiveCaptionLanguageState args: PropertyChangedEventArgs) {
        // teamsCaptions.activeCaptionLanguage
    }
    
    // listener for captions data received
    public func teamsCaptions(_ teamsCaptions: TeamsCaptions, didReceiveCaptions:TeamsCaptionsReceivedEventArgs) {
            // Information about the speaker.
            // didReceiveCaptions.speaker
            // The original text with no transcribed.
            // didReceiveCaptions.spokenText
            // language identifier for the captions text.
            // didReceiveCaptions.captionLanguage
            // language identifier for the speaker.
            // didReceiveCaptions.spokenLanguage
            // The transcribed text.
            // didReceiveCaptions.captionText
            // Timestamp denoting the time when the corresponding speech was made.
            // didReceiveCaptions.timestamp
            // CaptionsResultType is Partial if text contains partially spoken sentence.
            // It is set to Final once the sentence has been completely transcribed.
            // didReceiveCaptions.resultType
    }
}

teamsCaptions.delegate = self.callObserver
```

## Start captions

Once you've set up all your listeners, you can now start adding captions.

``` swift
func startCaptions() {
    guard let teamsCaptions = teamsCaptions else {
        return
    }
    let startCaptionsOptions = StartCaptionsOptions()
    startCaptionsOptions.spokenLanguage = "en-us"
    teamsCaptions.startCaptions(startCaptionsOptions: startCaptionsOptions, completionHandler: { (error) in
        if error != nil {
            
        }
    })
}
```

## Stop captions

``` swift
func stopCaptions() {
    teamsCaptions.stopCaptions(completionHandler: { (error) in
        if error != nil {
            
        }
    })
}
```

## Remove caption received listener

``` swift
teamsCaptions?.delegate = nil
```

## Spoken language support 

### Get list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` swift
// bcp 47 formatted language code
let spokenLanguage : String = "en-us"
for language in teamsCaptions?.supportedSpokenLanguages ?? [] {
    // choose required language
    spokenLanguage = language
}
```

### Set spoken language 
When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` swift 
func setSpokenLanguage() {
    guard let teamsCaptions = self.teamsCaptions else {
        return
    }

    teamsCaptions.set(spokenLanguage: spokenLanguage, completionHandler: { (error) in
        if let error = error {
        }
    })
}
```

## Caption language support 

### Get supported caption language 

If your organization has an active Teams premium license, then your Azure Communication Services users can enable translated captions as long as the organizer of the meeting has a Teams premium license. As for users with Microsoft 365 identities this check is done against their own user account if they meeting organizer doesn't have a Teams premium license.

``` swift
// ISO 639-1 formatted language code
let captionLanguage : String = "en"
for language in teamsCaptions?.supportedCaptionLanguages ?? [] {
    // choose required language
    captionLanguage = language
}
```
### Set caption language 

``` swift
func setCaptionLanguage() {
    guard let teamsCaptions = self.teamsCaptions else {
        return
    }

    teamsCaptions.set(captionLanguage: captionLanguage, completionHandler: { (error) in
        if let error = error {
        }
    })
}
```
