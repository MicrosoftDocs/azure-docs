---
title: include file
description: iOS how-to guide for enabling Closed captions during a call.
author: Kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.topic: include file
ms.date: 03/21/2023
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
| TeamsCaptionsCallFeatureDelegate | Delegate for events |
| TeamsCaptionsInfo | Data object received for each didReceiveCaptions event |

## Get closed captions feature 

### External Identity users

If you're building an application that allows ACS users to join a Teams meeting 

``` swift
if let call = self.call { @State var captionsCallFeature = call.feature(Features.teamsCaptions) }
```

### Microsoft 365 users 

If you're building an app for Microsoft 365 Users using ACS SDK. 

``` swift
if let teamsCall = self.teamsCall { @State var captionsCallFeature = call.feature(Features.teamsCaptions) }
```

## Subscribe to listeners

### Add a listener to receive captions active/inactive status and data received

```swift
extension CallObserver: TeamsCaptionsCallFeatureDelegate {
    // Add a listener to receive captions active/inactive status
    public func teamsCaptionsCallFeature(_ teamsCaptionsFeature: TeamsCaptionsCallFeature, didChangeCaptionsActiveState args: PropertyChangedEventArgs) {
        if(captionsCallFeature.isCaptionsFeatureActive) {
            
        }
    }
    
    // Add listener for captions data received
    public func teamsCaptionsCallFeature(_ teamsCaptionsFeature: TeamsCaptionsCallFeature, didReceiveCaptions: TeamsCaptionsInfo) {
        
    }
}

teamsCaptionsFeature.delegate = self.callObserver
```

## Start captions

Once you've got all your listeners setup, you can now start captions.

``` swift
func startCaptions() {
    guard let captionsCallFeature = captionsCallFeature else {
        return
    }
    let startCaptionsOptions = StartCaptionsOptions()
    startCaptionsOptions.spokenLanguage = "en-us"
    captionsCallFeature.startCaptions(startCaptionsOptions: startCaptionsOptions, completionHandler: { (error) in
        if error != nil {
            
        }
    })
}
```

## Stop captions

``` swift
func stopCaptions() {
    captionsCallFeature.stopCaptions(completionHandler: { (error) in
        if error != nil {
            
        }
    })
}
```

## Remove caption received listener

``` swift
captionsCallFeature?.delegate = nil
```

## Spoken language support 

### Get list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` swift
// bcp 47 formatted language code
let spokenLanguage : String = "en-us"
for language in captionsCallFeature?.supportedSpokenLanguages ?? [] {
    // choose required language
    spokenLanguage = language
}
```

### Set spoken language 
When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` swift 
func setSpokenLanguage() {
    guard let captionsCallFeature = self.captionsCallFeature else {
        return
    }

    captionsCallFeature.set(spokenLanguage: spokenLanguage, completionHandler: { (error) in
        if let error = error {
        }
    })
}
```

## Caption language support 

### Get supported caption language 

If your organization has an active Teams premium license, then your ACS users can enable translated captions as long as the organizer of the meeting has a Teams premium license. As for users with Microsoft 365 identities this check is done against their own user account if they meeting organizer doesn't have a Teams premium license.

``` swift
// ISO 639-1 formatted language code
let captionLanguage : String = "en"
for language in captionsCallFeature?.supportedCaptionLanguages ?? [] {
    // choose required language
    captionLanguage = language
}
```
### Set caption language 

``` swift
func setCaptionLanguage() {
    guard let captionsCallFeature = self.captionsCallFeature else {
        return
    }

    captionsCallFeature.set(captionLanguage: captionLanguage, completionHandler: { (error) in
        if let error = error {
        }
    })
}
```
