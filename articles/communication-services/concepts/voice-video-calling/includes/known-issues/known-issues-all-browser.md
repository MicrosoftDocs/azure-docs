---
title: Azure Communication Services - known issues - all browsers
description: Learn more about known issues on Azure Communication Service calling when using all browsers
author: sloanster
services: azure-communication-services
 
ms.author: micahvivion
ms.date: 02/23/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: template-how-to
---

## All Desktop browsers


### It isn't possible to render multiple previews from multiple devices on web
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** It isn't possible to render multiple previews from multiple devices on web. This issue is a known limitation.<br>
**Known issue reference:** For more information, see [Calling SDK overview](../../../voice-video-calling/calling-sdk-features.md).<br>
  

### Repeatedly switching video devices might cause video streaming to stop temporarily
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Switching between video devices might cause your video stream to pause while the stream is acquired from the selected device. Switching between devices frequently can cause performance degradation.<br>
**Recommended workaround:** Developers should ensure to stop the stream from one device before starting another to mitigate performance degradation when switching between video devices.<br>

### Video signal problem when the call is in connecting state
**Browser version:** All. <br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:**  If a user turns video on and off quickly while the call is in the *Connecting* state, this action might lead to a problem with the stream acquired for the call. It's best for developers to build their apps in a way that doesn't require video to be turned on and off while the call is in the *Connecting* state. Degraded video performance might occur in the following scenarios:
- If the user starts with audio, and then starts and stops video, while the call is in the *Connecting* state.
- If the user starts with audio, and then starts and stops video, while the call is in the *Lobby* state.
<br>

### Delay in rendering remote participant videos
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** During an ongoing group call, suppose that *User A* sends video, and then *User B* joins the call. Sometimes, User B doesn't see video from User A, or User A's video begins rendering after a long delay. A network environment configuration problem might cause this delay.<br>
**Known issue reference:** For more information [Network recommendations](../../../voice-video-calling/network-requirements.md).<br>

### Excessive use of certain APIs like mute/unmute results in throttling on Azure Communication Services infrastructure
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** As a result of the mute/unmute API call, Azure Communication Services infrastructure informs other participants in the call about the state of audio of a local participant who invoked mute/unmute, so that participants in the call know who is muted/unmuted.
    
Excessive use of mute/unmute is blocked in Azure Communication Services infrastructure. Throttling happens if the participant (or application on behalf of participant) attempts to mute/unmute continuously, every second, more than 15 times in a 30-second rolling window.
<br>

### Siri activation during WebRTC call doesn't automatically mute microphone on macOS
**Operating system:** macOS.<br>
**Browsers:** All browsers and versions.<br>
**Azure Communication Services calling SDK version:** All.<br>
**Description:** WebRTC call isn't automatically muted when a user starts talking with Siri in the middle of the call. During such instances, other participants can hear either the user giving commands to Siri or both the given command and Siri's response.<br>
**Known issue reference:** This is a known issue on [macOS](https://bugs.webkit.org/show_bug.cgi?id=247897).<br>
**Recommended workaround:** Currently, no workaround is available. Users need to manually mute their microphone when activating Siri during a call.<br>



## All mobile browsers


### It isn't possible to render multiple previews from multiple devices on web
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** It isn't possible to render multiple previews from multiple devices on web. This issue is a known limitation.<br>
**Known issue reference:** For more information, see [Calling SDK overview](../../../voice-video-calling/calling-sdk-features.md).<br>

### Repeatedly switching video devices might cause video streaming to stop temporarily
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** Switching between video devices might cause your video stream to pause while the stream is acquired from the selected device. Switching between devices frequently can cause performance degradation.<br>
**Recommended workaround:** Developers should ensure to stop the stream from one device before starting another to mitigate performance degradation when switching between video devices.<br>

### Video signal problem when the call is in connecting state
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:**  If a user turns video on and off quickly while the call is in the *Connecting* state, this action might lead to a problem with the stream acquired for the call. It's best for developers to build their apps in a way that doesn't require video to be turned on and off while the call is in the *Connecting* state. Degraded video performance might occur in the following scenarios:
  - If the user starts with audio, and then starts and stops video, while the call is in the *Connecting* state.
  - If the user starts with audio, and then starts and stops video, while the call is in the *Lobby* state.
  

 ### Delay in rendering remote participant videos
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** During an ongoing group call, suppose that *User A* sends video, and then *User B* joins the call. Sometimes, User B doesn't see video from User A, or User A's video begins rendering after a long delay. A network environment configuration problem might cause this delay.<br>
**Known issue reference:** For more information [Network recommendations](../../../voice-video-calling/network-requirements.md). <br>

 ### Excessive use of certain APIs like mute/unmute results in throttling on Azure Communication Services infrastructure
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All<br>
**Description:** As a result of the mute/unmute API call, Azure Communication Services infrastructure informs other participants in the call about the state of audio of a local participant who invoked mute/unmute, so that participants in the call know who is muted/unmuted.<br>
   
Excessive use of mute/unmute is blocked in Azure Communication Services infrastructure. Throttling happens if the participant (or application on behalf of participant) attempts to mute/unmute continuously, every second, more than 15 times in a 30-second rolling window.
    
### Refreshing a page doesn't immediately remove the user from their call
**Browser version:** All.<br>
**Azure Communication Service calling SDK version:** All.<br>
**Description:** If a user is in a call and decides to refresh the page, the Communication Services media service doesn't remove this user immediately from the call. It waits for the user to rejoin. The user is removed from the call after the media service times out.
  
  If a user is in a call and decides to refresh the page, the Communication Services media service doesn't remove this user immediately from the call. It waits for the user to rejoin. The user is removed from the call after the media service times out.

  It's best to build user experiences that don't require end users to refresh the page of your application while in a call. If a user refreshes the page, reuse the same Communication Services user ID after that user returns back to the application. By rejoining with the same user ID, the user is represented as the same, existing object in the `remoteParticipants` collection. From the perspective of other participants in the call, the user remains in the call during the time it takes to refresh the page, up to a minute or two.
   
  If the user was sending video before refreshing, the `videoStreams` collection keeps the previous stream information until the service times out and removes it. In this scenario, the application might decide to observe any new streams added to the collection, and render one with the highest `id`.
