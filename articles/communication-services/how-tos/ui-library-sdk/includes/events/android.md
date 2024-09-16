---
description: Handle events in the Android UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 09/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Participant joins the call

We expose `addOnRemoteParticipantJoinedEventHandler` to listen if the participant joins the call.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.addOnRemoteParticipantJoinedEventHandler { remoteParticipantJoinedEvent -> 
                remoteParticipantJoinedEvent.identifiers.forEach { identifier ->
                    // identifier is communication identifier
                }
            }
```

#### [Java](#tab/java)

```java
    callComposite.addOnRemoteParticipantJoinedEventHandler( (remoteParticipantJoinedEvent) -> {
                for (CommunicationIdentifier identifier: remoteParticipantJoinedEvent.getIdentifiers()) {
                    // identifier is communication identifier
                }
            });
```

-----

## Participant left the call

We expose `addOnRemoteParticipantLeftEventHandler` to listen if the participant leaves the call.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.addOnRemoteParticipantLeftEventHandler { remoteParticipantLeftEvent -> 
                remoteParticipantLeftEvent.identifiers.forEach { identifier ->
                    // identifier is communication identifier
                }
            }
```

#### [Java](#tab/java)

```java
    callComposite.addOnRemoteParticipantLeftEventHandler( (remoteParticipantLeftEvent) -> {
                for (CommunicationIdentifier identifier: remoteParticipantLeftEvent.getIdentifiers()) {
                    // identifier is communication identifier
                }
            });
```

-----
