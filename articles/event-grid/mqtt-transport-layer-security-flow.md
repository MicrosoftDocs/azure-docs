---
title: 'Azure Event Grid Transport Layer Security flow'
description: 'Describes how mTLS connection is established when a client connects to Azure Event Grid’s Message Queueing Telemetry Transport (MQTT) broker feature.'
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
---

# Transport Layer Security (TLS) connection with MQTT broker
To establish a secure connection with MQTT broker, you can use either MQTTS over port 8883 or MQTT over web sockets on port 443. It's important to note that only secure connections are supported. The following steps are to establish secure connection before the authentication of clients.


## High level flow of how mutual transport layer security (mTLS) connection is established

1. The client initiates the handshake with MQTT broker. It sends a hello packet with supported TLS version, cipher suites.
2. Service presents its certificate to the client.  
    - Service presents either a P-384 EC certificate or an RSA 2048 certificate depending on the ciphers in the client hello packet.
    - Service certificates signed by a public certificate authority.
3. Client validates that it connected to the correct and trusted service.
4. Then the client presents its own certificate to prove its authenticity.  
    - Currently, we only support certificate-based authentication, so clients must send their certificate.
5. Service completes TLS handshake successfully after validating the certificate.
6. After completing the TLS handshake and mTLS connection is established, the client sends the MQTT CONNECT packet to the service.
7. Service authenticates the client and allows the connection.
    - The same client certificate that was used to establish mTLS is used to authenticate the client connection to the service.

## Next steps
- Learn how to [authenticate clients using certificate chain](mqtt-certificate-chain-client-authentication.md)
- Learn how to [authenticate client using Microsoft Entra ID token](mqtt-client-azure-ad-token-and-rbac.md)
