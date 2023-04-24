---
title: Tutorial - Proxy your ACS calling traffic across your own servers
titleSuffix: An Azure Communication Services tutorial
description: Learn how to have your media and signaling traffic be proxied to servers that you can control.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 04/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---
# How to force calling traffic to be proxied across your own servers

In certain situations, it might be useful to have all your client traffic proxied to a server that you can control. When the SDK is initializing, you can provide the details of your servers that you would like the traffic to route to. Once enabled all the media traffic (audio/video/screen sharing) travel through the provided TURN servers instead of the Azure Communication Services defaults. This tutorial guides on how to have WebJS SDK calling traffic be proxied to servers that you control.

>[!IMPORTANT]
> The proxy feature is available starting in the public preview version [1.13.0-beta.4](https://www.npmjs.com/package/@azure/communication-calling/v/1.13.0-beta.4) of the Calling SDK. Please ensure that you use this or a newer SDK when trying to use this feature. This Quickstart uses the Azure Communication Services Calling SDK version greater than `1.13.0`.

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

## What is a TURN server?
Many times, establishing a network connection between two peers isn't straightforward. A direct connection might not work because of many reasons: firewalls with strict rules, peers sitting behind a private network, or computers are running in a NAT environment. To solve these network connection issues, you can use a TURN server. The term stands for Traversal Using Relays around NAT, and it's a protocol for relaying network traffic STUN and TURN servers are the relay servers here. Learn more about how ACS [mitigates](../concepts/network-traversal.md) network challenges by utilizing STUN and TURN.

## Provide your TURN servers details to the SDK
To provide the details of your TURN servers, you need to pass details of what TURN server to use as part of `CallClientOptions` while initializing the `CallClient`. For more details how to setup a call see [Azure Communication Services Web SDK](../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-web)) for the Quickstart on how to setup Voice and Video.

```js
import { CallClient } from '@azure/communication-calling'; 

const myTurn1 = {
    urls: [
        'turn:turn.azure.com:3478?transport=udp',
        'turn:turn1.azure.com:3478?transport=udp',
    ],
    username: 'turnserver1username',
    credential: 'turnserver1credentialorpass'
};

const myTurn2 = {
    urls: [
        'turn:20.202.255.255:3478',
        'turn:20.202.255.255:3478?transport=tcp',
    ],
    username: 'turnserver2username',
    credential: 'turnserver2credentialorpass'
};

// While you are creating an instance of the CallClient (the entry point of the SDK):
const callClient = new CallClient({
    networkConfiguration: {
        turn: {
            iceServers: [
                myTurn1,
                myTurn2
            ]
        }
    }
});




// ...continue normally with your SDK setup and usage.
```

> [!IMPORTANT]
> Note that if you have provided your TURN server details while initializing the `CallClient`, all the media traffic will <i>exclusively</i> flow through these TURN servers. Any other ICE candidates that are normally generated when creating a call won't be considered while trying to establish connectivity between peers i.e. only 'relay' candidates will be considered. To learn more about different types of Ice candidates can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/type).

> [!NOTE]
> If the '?transport' query parameter is not present as part of the TURN url or is not one of these values - 'udp', 'tcp', 'tls', the default will behaviour will be UDP.

> [!NOTE]
> If any of the URLs provided are invalid or don't have one of these schemas - 'turn:', 'turns:', 'stun:', the `CallClient` initialization will fail and will throw errors accordingly. The error messages thrown should help you troubleshoot if you run into issues.

The API reference for the `CallClientOptions` object, and the `networkConfiguration` property within it can be found here - [CallClientOptions](/javascript/api/azure-communication-services/@azure/communication-calling/callclientoptions?view=azure-communication-services-js&preserve-view=true).

## Set up a TURN server in Azure
You can create a Linux virtual machine in the Azure portal using this [guide](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu), and deploy a TURN server using [coturn](https://github.com/coturn/coturn), a free and open source implementation of a TURN and STUN server for VoIP and WebRTC.

Once you have setup a TURN server, you can test it using the WebRTC Trickle ICE page - [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/).
