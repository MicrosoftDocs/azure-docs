---
title: include file
description: include file
services: azure-communication-services
ms.date: 08/14/2023
ms.topic: include
ms.author: chengyuanlai
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

## Force calling traffic to be proxied across your own server for Android SDK

In certain situations, it might be useful to have all your client traffic proxied to a server that you can control. When the SDK is initializing, you can provide the details of your servers that you would like the traffic to route to. Once enabled, all the media traffic (audio/video/screen sharing) travel through the provided TURN servers instead of the Azure Communication Services defaults. This tutorial guides on how to have Android SDK calling traffic be proxied to servers that you control.

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
> The proxy feature will NOT be available for Teams Identities and Azure Communication Services Teams interop actions. 

### Proxy calling media traffic

#### What is a TURN server?
Many times, establishing a network connection between two peers isn't straightforward. A direct connection might not work because of many reasons: firewalls with strict rules, peers sitting behind a private network, or computers running in a NAT environment. To solve these network connection issues, you can use a TURN server. The term stands for Traversal Using Relays around NAT, and it's a protocol for relaying network traffic. STUN and TURN servers are the relay servers here. [Learn more about how Azure Communication Services mitigates network challenges by utilizing STUN and TURN](../../concepts/network-traversal.md).

#### Provide your TURN server details with the SDK
To provide the details of your TURN servers, you need to pass details of what TURN server to use as part of `CallClientOptions` while initializing the `CallClient`. For more information how to set up a call, see [Azure Communication Services Android SDK](../../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-android) for the Quickstart on how to setup Voice and Video.

```java
CallClientOptions callClientOptions = new CallClientOptions();
CallNetworkOptions callNetworkOptions = new CallNetworkOptions();

IceServer iceServer1 = new IceServer();
iceServer1.setUrls(Arrays.asList("turn:turn.azure.com", "turn:20.202.255.255"));
iceServer1.setUdpPort(3478);
iceServer1.setRealm("turn.azure.com");
iceServer1.setUsername("turnserver1username");
iceServer1.setPassword("turnserver1password");

IceServer iceServer2 = new IceServer();
iceServer2.setUrls(Arrays.asList("turn:turn1.azure.com"));
iceServer2.setTcpPort(3478);
iceServer2.setRealm("turn1.azure.com");
iceServer2.setUsername("turnserver2username");
iceServer2.setPassword("turnserver2password");

callNetworkOptions.setIceServers(Arrays.asList(iceServer1, iceServer2));

// Supply the network options when creating an instance of the CallClient
callClientOptions.setNetwork(callNetworkOptions);
CallClient callClient = new CallClient(callClientOptions);

// ...continue normally with your SDK setup and usage.
```

> [!IMPORTANT]
> Note that if you have provided your TURN server details while initializing the `CallClient`, all the media traffic will <i>exclusively</i> flow through these TURN servers. Any other ICE candidates that are normally generated when creating a call won't be considered while trying to establish connectivity between peers i.e. only 'relay' candidates will be considered. To learn more about different types of Ice candidates click [here](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/type).

> [!NOTE]
> If UDP and TCP ports are not provided, the default behaviour will be using UDP port 3478.

> [!NOTE]
> If any of the URLs provided are invalid, the `CallClient` initialization will fail and will throw errors accordingly.

#### Set up a TURN server in Azure
You can create a Linux virtual machine in the Azure portal using this [guide](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu) and deploy a TURN server using [coturn](https://github.com/coturn/coturn). Coturn is a free and open source implementation of a TURN and STUN server for VoIP and WebRTC.

Once you have setup a TURN server, you can test it using the WebRTC Trickle ICE page - [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/).

### Proxy signaling traffic

To provide the URL of a proxy server, you need to pass it in as part of `CallClientOptions` through its property `Network` while initializing the `CallClient`. For more information on how to set up a call, see [Azure Communication Services Android SDK](../../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-android) for the Quickstart on how to setup Voice and Video.

```java
CallClientOptions callClientOptions = new CallClientOptions();
CallNetworkOptions callNetworkOptions = new CallNetworkOptions();
callNetworkOptions.setProxyUrl("https://myproxyserver.com");
callClientOptions.setNetwork(callNetworkOptions);
CallClient callClient = new CallClient(callClientOptions);

// ...continue normally with your SDK setup and usage.
```

#### Setting up a signaling proxy server on Azure
You can create a Linux virtual machine in the Azure portal and deploy an NGINX server on it using this guide - [Quickstart: Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu).