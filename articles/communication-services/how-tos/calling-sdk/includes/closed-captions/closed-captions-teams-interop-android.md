---
title: include file
description: Android how-to guide for enabling Closed captions during a Teams interop call.
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
| Name                       | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| CaptionsCallFeature        | API for captions call feature                             |
| TeamsCaptions              | API for Teams captions                                    |
| StartCaptionOptions        | Closed caption options like spoken language               |
| TeamsCaptionsListener      | Listener for TeamsCaptions addOnCaptionsReceivedListener  |
| TeamsCaptionsReceivedEvent | Data object received for each TeamsCaptionsListener event |

## Get closed captions feature 

### External Identity users and Microsoft 365 users

If you're building an application that allows users to join a Teams meeting 

``` java
CaptionsCallFeature captionsCallFeature = call.feature(Features.CAPTIONS);
captionsCallFeature.getCaptions().whenComplete(
    ((captions, throwable) -> {
        if (throwable == null) {
            CallCaptions callCaptions = captions;
            if (captions.getCaptionsType() == CaptionsType.TEAMS_CAPTIONS) {
            // teams captions
            TeamsCaptions teamsCaptions = (TeamsCaptions) captions;
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
    teamsCaptions.addOnCaptionsEnabledChangedListener( (PropertyChangedEvent args) -> {
        if(teamsCaptions.isEnabled()) {
            // captions enabled
        }
    });
}
```

### Add listener for captions data received

``` java 
TeamsCaptionsListener captionsListener = (TeamsCaptionsReceivedEvent args) -> {
  // Information about the speaker.
  // CallerInfo participantInfo = args.getSpeaker();
  // The original text with no transcribed.
  // args.getSpokenText();
  // language identifier for the captions text.
  // args.getCaptionLanguage();
  // language identifier for the speaker.
  // args.getSpokenLanguage();
  // The transcribed text.
  // args.getCaptionText();
  // Timestamp denoting the time when the corresponding speech was made.
  // args.getTimestamp();
  // CaptionsResultType is Partial if text contains partially spoken sentence.
  // It is set to Final once the sentence has been completely transcribed.
  // args.getResultType() == CaptionsResultType.FINAL;
}; 
public void addOnCaptionsReceivedListener() {
  teamsCaptions.addOnCaptionsReceivedListener(captionsListener); 
}
```

### Add a listener to receive active spoken language changed status

``` java
public void addOnActiveSpokenLanguageChangedListener() {
    teamsCaptions.addOnActiveSpokenLanguageChangedListener( (PropertyChangedEvent args) -> {
       // teamsCaptions.getActiveSpokenLanguage()
    });
}
```

### Add a listener to receive active caption language changed status

``` java
public void addOnActiveCaptionLanguageChangedListener() {
    teamsCaptions.addOnActiveCaptionLanguageChangedListener( (PropertyChangedEvent args) -> {
       // teamsCaptions.getActiveCaptionLanguage()
    });
}
```

## Start captions

Once you've set up all your listeners, you can now start adding captions.

``` java
public void startCaptions() {
    StartCaptionsOptions startCaptionsOptions = new StartCaptionsOptions();
    startCaptionsOptions.setSpokenLanguage("en-us");
    teamsCaptions.startCaptions(startCaptionsOptions).whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Stop captions

``` java
public void stopCaptions() {
    teamsCaptions.stopCaptions().whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Remove caption received listener

``` java
public void removeOnCaptionsReceivedListener() {
    teamsCaptions.removeOnCaptionsReceivedListener(captionsListener);
}
```

## Spoken language support 

### Get list of supported spoken languages
Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` java
// bcp 47 formatted language code
teamsCaptions.getSupportedSpokenLanguages();
```

### Set spoken language 
When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` java 
public void setSpokenLanguage() {
    teamsCaptions.setSpokenLanguage("en-us").whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Caption language support 

### Get supported caption language 

If your organization has an active Teams premium license, then your Azure Communication Services users can enable translated captions as long as the organizer of the meeting has a Teams premium license. As for users with Microsoft 365 identities this check is done against their own user account if they meeting organizer doesn't have a Teams premium license.

``` java
// ISO 639-1 formatted language code
teamsCaptions.getSupportedCaptionLanguages();
```
### Set caption language 

``` java
public void setCaptionLanguage() {
    teamsCaptions.setCaptionLanguage("en").whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```
