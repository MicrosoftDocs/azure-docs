---
title: include file
description: include file
services: azure-communication-services
ms.date: 08/14/2023
ms.topic: include
author: sloanster
ms.author: micahvivion
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

## Force calling traffic to be proxied across your own server for Web SDK

In certain situations, it might be useful to have all your client traffic proxied to a server that you can control. When the SDK is initializing, you can provide the details of your servers that you would like the traffic to route to. Once enabled all the media traffic (audio/video/screen sharing) travel through the provided TURN servers instead of the Azure Communication Services defaults. This tutorial guides on how to have WebJS SDK calling traffic be proxied to servers that you control.

>[!IMPORTANT]
> The proxy feature is available starting in the public preview version [1.13.0-beta.4](https://www.npmjs.com/package/@azure/communication-calling/v/1.13.0-beta.4) of the Calling SDK. Please ensure that you use this or a newer SDK when trying to use this feature. This Quickstart uses the Azure Communication Services Calling SDK version greater than `1.13.0`.

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]
## Proxy calling media traffic

## What is a TURN server?
Many times, establishing a network connection between two peers isn't straightforward. A direct connection might not work because of many reasons: firewalls with strict rules, peers sitting behind a private network, or computers are running in a NAT environment. To solve these network connection issues, you can use a TURN server. The term stands for Traversal Using Relays around NAT, and it's a protocol for relaying network traffic STUN and TURN servers are the relay servers here. Learn more about how ACS [mitigates](../../concepts/network-traversal.md) network challenges by utilizing STUN and TURN.

### Provide your TURN servers details to the SDK
To provide the details of your TURN servers, you need to pass details of what TURN server to use as part of `CallClientOptions` while initializing the `CallClient`. For more information how to setup a call, see [Azure Communication Services Web SDK](../../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-web) for the Quickstart on how to setup Voice and Video.

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
> Note that if you have provided your TURN server details while initializing the `CallClient`, all the media traffic will <i>exclusively</i> flow through these TURN servers. Any other ICE candidates that are normally generated when creating a call won't be considered while trying to establish connectivity between peers i.e. only 'relay' candidates will be considered. To learn more about different types of Ice candidates click here [here](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/type).

> [!NOTE]
> If the '?transport' query parameter is not present as part of the TURN url or is not one of these values - 'udp', 'tcp', 'tls', the default behaviour will be UDP.

> [!NOTE]
> If any of the URLs provided are invalid or don't have one of these schemas - 'turn:', 'turns:', 'stun:', the `CallClient` initialization will fail and will throw errors accordingly. The error messages thrown should help you troubleshoot if you run into issues.

The API reference for the `CallClientOptions` object, and the `networkConfiguration` property within it can be found here - [CallClientOptions](/javascript/api/azure-communication-services/@azure/communication-calling/callclientoptions?view=azure-communication-services-js&preserve-view=true).

### Set up a TURN server in Azure
You can create a Linux virtual machine in the Azure portal using this [guide](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu), and deploy a TURN server using [coturn](https://github.com/coturn/coturn), a free and open source implementation of a TURN and STUN server for VoIP and WebRTC.

Once you have setup a TURN server, you can test it using the WebRTC Trickle ICE page - [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/).

## Proxy signaling traffic

To provide the URL of a proxy server, you need to pass it in as part of `CallClientOptions` while initializing the `CallClient`. For more details how to setup a call see [Azure Communication Services Web SDK](../../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-web)) for the Quickstart on how to setup Voice and Video.

```js
import { CallClient } from '@azure/communication-calling'; 

// While you are creating an instance of the CallClient (the entry point of the SDK):
const callClient = new CallClient({
    networkConfiguration: {
        proxy: {
            url: 'https://myproxyserver.com'
        }
    }
});

// ...continue normally with your SDK setup and usage.
```

> [!NOTE]
> If the proxy URL provided is an invalid URL, the `CallClient` initialization will fail and will throw errors accordingly. The error messages thrown will help you troubleshoot if you run into issues.

The API reference for the `CallClientOptions` object, and the `networkConfiguration` property within it can be found here - [CallClientOptions](/javascript/api/azure-communication-services/@azure/communication-calling/callclientoptions?view=azure-communication-services-js&preserve-view=true).

### Setting up a signaling proxy middleware in express js

You can also create a proxy middleware in your express js server setup to have all the URLs redirected through it, using the [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware) npm package.
The `createProxyMiddleware` function from that package should cover what you need for a simple redirect proxy setup. Here's an example usage of it with some option settings that the SDK needs to have all of our URLs working as expected:

```js
const proxyRouter = (req) => {
    // Your router function if you don't intend to setup a direct target

    // An example:
    if (!req.originalUrl && !req.url) {
        return '';
    }

    const incomingUrl = req.originalUrl || req.url;
    if (incomingUrl.includes('/proxy')) {
        return 'https://microsoft.com/forwarder/';
    }
    
    return incomingUrl;
}

const myProxyMiddleware = createProxyMiddleware({
    target: 'https://microsoft.com', // This will be ignore if a router function is provided, but createProxyMiddleware still requires this to be passed in (see it's official docs on the npm page for the most recent changes)
    router: proxyRouter,
    changeOrigin: true,
    secure: false, // If you have proper SSL setup, set this accordingly
    followRedirects: true,
    ignorePath: true,
    ws: true,
    logLevel: 'debug'
});

// And finally pass in your proxy middleware to your express app depending on your URL/host setup
app.use('/proxy', myProxyMiddleware);
```

> [!Tip]
> If you are having SSL issues, check out the [cors](https://www.npmjs.com/package/cors) package.

### Setting up a signaling proxy server on Azure
You can create a Linux virtual machine in the Azure portal and deploy an NGINX server on it using this guide - [Quickstart: Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu).

Here's an NGINX config that you could make use of for a quick spin up:
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
