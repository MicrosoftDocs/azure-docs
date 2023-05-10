---
title: include file
description: Android how-to guide for enabling Closed captions during a call.
author: Kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.topic: include file
ms.date: 03/20/2023
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
| TeamsCaptionsListener | Listener for addOnCaptionsReceivedListener |
| TeamsCaptionsInfo | Data object received for each TeamsCaptionsListener event |

## Get closed captions feature 

### External Identity users

If you're building an application that allows ACS users to join a Teams meeting 

``` java
TeamsCaptionsCallFeature captionsCallFeature = call.feature(Features.TEAMS_CAPTIONS);
```

### Microsoft 365 users 

If you're building an application for Microsoft 365 Users using ACS SDK. 

``` java
TeamsCaptionsCallFeature captionsCallFeature = teamsCall.feature(Features.TEAMS_CAPTIONS); 
```

## Subscribe to listeners

### Add a listener to receive captions active/inactive status

``` java
public void addOnIsCaptionsActiveChangedListener() {
    captionsCallFeature.addOnCaptionsActiveChangedListener( (PropertyChangedEvent args) -> {
        if(captionsCallFeature.isCaptionsFeatureActive()) {
        
        }
    });
}
```

### Add listener for captions data received

``` java 
TeamsCaptionsListener captionsListener = (TeamsCaptionsInfo captionsInfo) -> {

}; 
public void addOnCaptionsReceivedListener() {
  captionsCallFeature.addOnCaptionsReceivedListener(captionsListener); 
}
```

## Start captions

Once you've got all your listeners setup, you can now start captions.

``` java
public void startCaptions() {
    StartCaptionsOptions startCaptionsOptions = new StartCaptionsOptions();
    startCaptionsOptions.setSpokenLanguage("en-us");
    captionsCallFeature.startCaptions(startCaptionsOptions).whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Stop captions

``` java
public void stopCaptions() {
    captionsCallFeature.stopCaptions().whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Remove caption received listener

``` java
public void removeOnCaptionsReceivedListener() {
    captionsCallFeature.removeOnCaptionsReceivedListener(captionsListener);
}
```

## Spoken language support

### Get a list of supported spoken languages 

Get a list of supported spoken languages that your users can select from when enabling closed captions. 

``` java
// bcp 47 formatted language code
captionsCallFeature.getSupportedSpokenLanguages();
```

### Set spoken language 

When the user selects the spoken language, your app can set the spoken language that it expects captions to be generated from. 

``` java 
public void setSpokenLanguage() {
    captionsCallFeature.setSpokenLanguage("en-us").whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```

## Caption language support 

### Get supported caption language 

If your organization has an active Teams premium license, then your ACS users can enable translated captions as long as the organizer of the meeting has a Teams premium license. As for users with Microsoft 365 identities this check is done against their own user account if they meeting organizer doesn't have a Teams premium license.

``` java
// ISO 639-1 formatted language code
captionsCallFeature.getSupportedCaptionLanguages();
```
### Set caption language 

``` java
public void setCaptionLanguage() {
    captionsCallFeature.setCaptionLanguage("en").whenComplete((result, error) -> {
        if (error != null) {
        }
    });
}
```



