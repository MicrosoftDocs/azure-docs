---
title: Tutorial - Proxy your ACS calling traffic across your own servers
titleSuffix: An Azure Communication Services tutorial
description: Learn how to have your media and signaling traffic be proxied to servers that you can control
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 04/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---
# How to force calling traffic to be relayed and proxied across your own servers

In certain situations, it might be useful to have all your client traffic be proxied to a TURN server that you can control. When the SDK is initializing, you can provide the details of your TURN servers that you would like the traffic to route to. Once enabled all the media traffic (audio/video/screen sharing) travels through the provided TURN servers instead of the Azure Communication Services defaults. When you define that a TURN server should be used wyen  initializing the `CallClient`, all the calls to and from this `CallClient` will be using the provided TURN servers. This tutorial will guide on how to do provide your TURN configurations to the WebJS SDK.

>[!IMPORTANT]
> The custom proxy feature is available starting in the public preview version [1.13.0-beta.4](https://www.npmjs.com/package/@azure/communication-calling/v/1.13.0-beta.4) of the Calling SDK. Please ensure that you use this or a newer SDK when trying to use this feature. This quickstart uses the Azure Communication Services Calling SDK version greater than `1.13.0`.

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

## What is a STUN/TURN server?
Many times establishing connection between two peers is not straightforward and a direct connection will not work because of many reasons - firewalls with strict rules, peers sitting behind a private network, etc. In many situations your device does not have a public IP address to establish a connection straightaway and so relaying data via a relay server, that is usually known to both peers, is a way to allow this connection to happen. STUN and TURN servers are the relay servers here. See [Network Traversal Concepts](../concepts/network-traversal.md) for more details on how ACS mitigates network challenges with STUN and TURN.

## Providing your TURN servers to the SDK
To provide the details of your TURN servers, you need to pass details of what TURN server to use as part of `CallClientOptions` while initializing the `CallClient`. See the quickstart on how to setup Voice and Video calling using the Web SDK at - [Azure Communication Services Web SDK](../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-web)).

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
> Note that if you've provided your TURN server details while initializing the `CallClient`, all the media traffic will <i>exclusively</i> flow through these TURN servers. That means, other ice candidates will not be considered while trying to establish connectivity between peers i.e. only 'relay' candidates will be considered. More information on types of ice candidates can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/type). This behaviour might change in the future versions of the SDK.

> [!NOTE]
> If the '?transport' query parameter is not present as part of the TURN url or is not one of these values - 'udp', 'tcp', 'tls', the default will behaviour will be UDP.

> [!NOTE]
> If any of the URLs provided are invalid or don't have one of these schemas - 'turn:', 'turns:', 'stun:', the `CallClient` initialization will fail and will throw errors accordingly. The error messages thrown should help you troubleshoot if you run into issues.

The API reference for the `CallClientOptions` object, and the `networkConfiguration` property within it can be found here - [CallClientOptions](/javascript/api/azure-communication-services/@azure/communication-calling/callclientoptions?view=azure-communication-services-js).

## Setting up a TURN server in Azure
You can create a Linux virtual machine in the Azure portal using this guide - [Quickstart: Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu), and deploy a TURN server using [coturn](https://github.com/coturn/coturn), a free and open source implementation of a TURN and STUN server for VoIP and WebRTC.
Best spot to start from - [coturn turnserver README](https://github.com/coturn/coturn/blob/master/README.turnserver)

Once you've setup a TURN server, you can test it using the WebRTC Trickle ICE page - [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/).
Add your server details here, select 'relay' in the ICE options section and click on 'Gather candidates':
