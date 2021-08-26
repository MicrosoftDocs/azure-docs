---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: rifox
---

## Releasing resources
1. How to properly release resources when a call is finished:
    - When the call is finished our SDK will terminate the signaling & media sessions leaving you with an instance of the call that holds the last state of it. You can still check callEndReason. If your app won't hold the reference to the Call instance then the JavaScript garbage collector will clean up everything so in terms of memory consumption your app should go back to initial state from before the call.
2. Which resource types are long-lived (app lifetime) vs. short-lived (call lifetime):
    - The following are considered to be "long-lived" resources - you can create them and keep referenced for a long time, they are very light in terms of resource(memory) consumption so won't impact perf:
        - CallClient
        - CallAgent
        - DeviceManager
    - The following are considered to be "short-lived" resources and are the ones that are playing some role in the call itself, emit events to the application, or are interacting with local media devices. These will consume more cpu&memory, but once call ends - SDK will clean up all the state and release resource:
        - Call - since it's the one holding the actual state of the call (both signaling and media).
        - RemoteParticipants - Represent the remote participants in the call.
        - VideoStreamRenderer with it's VideoStreamRendererViews - handling video rendering.