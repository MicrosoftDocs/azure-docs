---
description: Handle events in the iOS UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 09/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Participant joins the call

We expose `onRemoteParticipantJoined` to listen if the participant joins the call.

```swift
let onRemoteParticipantJoinedHandler: ([CommunicationIdentifier]) -> Void = { [weak callComposite] ids in
            guard let composite = callComposite else {
                return
            }
            /// ids are the communication identifiers that has joined and are present in the meeting
        }
callComposite.events.onRemoteParticipantJoined = onRemoteParticipantJoinedHandler
```

## Participant left the call

We expose `onRemoteParticipantLeft` to listen if the participant leaves the call.

```swift
let onRemoteParticipantLeftHandler: ([CommunicationIdentifier]) -> Void = { [weak callComposite] ids in
            guard let composite = callComposite else {
                return
            }
            /// ids are the communication identifiers which have left the meeting just now.
        }
callComposite.events.onRemoteParticipantLeft = onRemoteParticipantLeftHandler
```
