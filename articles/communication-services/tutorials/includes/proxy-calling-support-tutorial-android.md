---
title: include file
description: include file
author: sloanster
services: azure-communication-services
ms.date: 08/14/2023
ms.topic: include
ms.author: chengyuanlai
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

The proxy feature will *not* be available for Teams identities and Azure Communication Services Teams interoperability actions.

## Proxy calling media traffic

The following sections describe how to proxy call your media traffic.

### What is a TURN server?
Many times, establishing a network connection between two peers isn't straightforward. A direct connection might not work because of:

- Firewalls with strict rules.
- Peers sitting behind a private network.
- Computers running in a network address translation (NAT) environment.

To solve these network connection issues, you can use a server that uses the Traversal Using Relay NAT (TURN) protocol for relaying network traffic. Session Traversal Utilities for NAT (STUN) and TURN servers are the relay servers.

### Provide your TURN server details with the SDK
To provide the details of your TURN servers, you need to pass details of what TURN server to use as part of `CallClientOptions` while initializing `CallClient`. For more information on how to set up a call, see [Azure Communication Services Android SDK](../../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-android) for the quickstart on how to set up voice and video.

```java
CallClientOptions callClientOptions = new CallClientOptions();
CallNetworkOptions callNetworkOptions = new CallNetworkOptions();

IceServer iceServer = new IceServer();
iceServer.setUrls(Arrays.asList("turn:20.202.255.255"));
iceServer.setUdpPort(3478);
iceServer.setRealm("turn.azure.com"); // Realm information is required.
iceServer.setUsername("turnserver1username");
iceServer.setPassword("turnserver1password");

callNetworkOptions.setIceServers(Arrays.asList(iceServer));

// Supply the network options when creating an instance of the CallClient
callClientOptions.setNetwork(callNetworkOptions);
CallClient callClient = new CallClient(callClientOptions);
```

> [!IMPORTANT]
> If you provided your TURN server details while you initialized `CallClient`, all the media traffic <i>exclusively</i> flows through these TURN servers. Any other ICE candidates that are normally generated when you create a call won't be considered while trying to establish connectivity between peers. That means only `relay` candidates are considered. To learn more about different types of Ice candidates, see [RTCIceCandidate: type property](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/type).

 Currently, the Android SDK supports only <b>one single IPv4 address</b> and <b>UDP</b> protocol for media proxy. If a UDP port isn't provided, a default UDP port 3478 is used. The SDK will throw an `Failed to set media proxy` error when calling `setIceServer` with unsupported input as follows:
 * More than one ICE server is provided in the IceServers list.
 * More than one url is provided in the IceServer's url list.
 * IPv6 url is provided in the url list.
 * Only TCP port is provided.
 * Realm information is not provided.

If the ICE server information provided is invalid, the `CallClient` initialization fails and throws errors accordingly.

### Set up a TURN server in Azure
You can create a Linux virtual machine in the Azure portal. For more information, see [Quickstart: Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu). To deploy a TURN server, use [coturn](https://github.com/coturn/coturn). Coturn is a free and open-source implementation of a TURN and STUN server for VoIP and WebRTC.

After you set up a TURN server, you can test it by using the instructions on the [WebRTC Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/) webpage.

## Proxy signaling traffic

To provide the URL of a proxy server, you need to pass it in as part of `CallClientOptions` through its property `Network` while initializing `CallClient`. For more information on how to set up a call, see [Azure Communication Services Android SDK](../../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-android) for the quickstart on how to set up voice and video.

```java
CallClientOptions callClientOptions = new CallClientOptions();
CallNetworkOptions callNetworkOptions = new CallNetworkOptions();
callNetworkOptions.setProxyUrl("https://myproxyserver.com");
callClientOptions.setNetwork(callNetworkOptions);
CallClient callClient = new CallClient(callClientOptions);

// ...continue normally with your SDK setup and usage.
```

### Set up a signaling proxy server on Azure
You can create a Linux virtual machine in the Azure portal and deploy an NGINX server on it. For more information, see [Quickstart: Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu).

Here's an NGINX configuration that you can use as a sample:

```
events {
    multi_accept       on;
    worker_connections 65535;
}
http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }
    map $request_method $access_control_header {
        OPTIONS '*';
    }
    server {
        listen <port_you_want_listen_on> ssl;
        ssl_certificate     <path_to_your_ssl_cert>;
        ssl_certificate_key <path_to_your_ssl_key>;
        location ~* ^/(.*?\.(com|net)(?::[\d]+)?)/(.*)$ {
            if ($request_method = 'OPTIONS') {
                add_header Access-Control-Allow-Origin '*' always;
                add_header Access-Control-Allow-Credentials 'true' always;
                add_header Access-Control-Allow-Headers '*' always;
                add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
                add_header Access-Control-Max-Age 1728000;
                add_header Content-Type 'text/plain';
                add_header Content-Length 0;
                return 204;
            }
            resolver 1.1.1.1;
            set $ups_host $1;
            set $r_uri $3;
            rewrite ^/.*$ /$r_uri break;
            proxy_set_header Host $ups_host;
            proxy_ssl_server_name on;
            proxy_ssl_protocols TLSv1.2;
            proxy_ssl_ciphers DEFAULT;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass_header Authorization;
            proxy_pass_request_headers on;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Proxy "";
            proxy_set_header Access-Control-Allow-Origin $access_control_header;
            proxy_pass https://$ups_host;
            proxy_redirect https://$ups_host https://$host/$ups_host;
            proxy_intercept_errors on;
            error_page 301 302 307 = @process_redirect;
            error_page 400 405 = @process_error_response;
        }
        location @process_redirect {
            set $saved_redirect_location '$upstream_http_location';
            resolver 1.1.1.1;
            proxy_pass $saved_redirect_location;
            add_header X-DBUG-MSG "301" always;
        }
        location @process_error_response {
            add_header Access-Control-Allow-Origin * always;
        }
    }
}
```