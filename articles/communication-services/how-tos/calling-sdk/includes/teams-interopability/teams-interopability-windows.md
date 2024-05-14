---
author: jiyoonlee
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/16/2022
ms.author: jiyoonlee
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Meeting join methods
To join a Teams meeting, use the `CallAgent.JoinAsync` method and pass a `JoinMeetingLocator` and a `JoinCallOptions`.

### Meeting ID and passcode
A Teams meeting ID will be 12 characters long and will consist of numeric digits grouped in threes (i.e. `000 000 000 000`).
A passcode will consist of 6 alphabet characters (i.e. `aBcDeF`).

```cs
string meetingId, passcode; 
TeamsMeetingIdLocator locator = new TeamsMeetingIdLocator(meetingId, passcode);
```

### Meeting link
```cs
string meetingLink; 
TeamsMeetingLinkLocator locator = new TeamsMeetingLinkLocator(meetingLink);
```

### Meeting coordinates 
(this is currently in limited preview)

```cs
Guid organizerId, tenantId;
string threadId, messageId;
TeamsMeetingCoordinatesLocator locator = new TeamsMeetingCoordinatesLocator(threadId, organizerId, tenantId, messageId);
```

## Join meeting using locators
```cs
var joinCallOptions = new JoinCallOptions() {
        OutgoingAudioOptions = new OutgoingAudioOptions() { IsMuted = true },
        OutgoingVideoOptions = new OutgoingVideoOptions() { Streams = new OutgoingVideoStream[] { cameraStream } }
    };
var call = await callAgent.JoinAsync(locator, joinCallOptions);
```