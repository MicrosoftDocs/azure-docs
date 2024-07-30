---
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 06/22/2024
---

WebSocket connection URI: `wss://{serviceName}.webpubsub.azure.com/clients/mqtt/hubs/{hub}?access_token={token}`.

* {hub} is a mandatory parameter that provides isolation for different applications.
* {token} is required by default. Alternatively, you can include the token in the `Authorization` header in the format `Bearer {token}`. You can bypass the token requirement by enabling anonymous access to the hub. <!--TODO MQTT allow anonymous access to the hub-->

If client library doesn't accept a URI, then you probably need to split the information in the URI into multiple parameters:

* Host: `{serviceName}.webpubsub.azure.com`
* Path: `/clients/mqtt/hubs/{hub}?access_token={token}`
* Port: 443
* Transport: WebSockets with TLS.

There are some limitations you should follow in your MQTT clients, otherwise the connection will be rejected. These MQTT protocol parameters include:
* Protocol versions: 3.1.1 or 5.0.
* Client ID format
    * Allowed characters: 0-9, a-z, A-Z
    * Length is between 1 and 128
* For MQTT 3.1.1, you must set a positive keep alive interval no longer than 180 seconds.
* Will Topic format: Not empty, and contains at least one non-whitespace character. The max length is 1024.
* Max will message size: 2,000 bytes