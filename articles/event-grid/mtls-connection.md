---
title: Azure Event Grid mTLS connection
description: Describes how mTLS connection is established when a client connects to MQTT service.
ms.topic: conceptual
ms.date: 04/20/2023
---

# mTLS connection for MQTT service in Azure Event Grid
In this article, you learn how the mTLS connection is established between MQTT service and clients.  

## Flow to establish mTLS connection
- The client initiates the handshake with Event Grid MQTT service.  It sends a hello packet with supported TLS version, cipher suites.
- Service presents its certificate to the client.  
    - Service presents either a P-384 EC certificate or an RSA 2048 certificate depending on the ciphers in the client hello packet.
    - Service certificates are signed by a public certificate authority.
- Client validates that it's connected to the correct and trusted service.
- Then the client presents its own certificate to prove its authenticity.  
    - Currently, we only support certificate-based authentication, so clients must send their certificate.
- Service completes TLS handshake successfully after checking the certificate for proof-of-possession, expiry, etc.
- What is the timeout to complete TLS handshake?
- Do we support renegotiation?
- After completing the TLS handshake and mTLS connection is established, the client sends the MQTT CONNECT packet to the service.
- Service authenticates the client and allows the connection.
    - The same client certificate that was used to establish mTLS is used to authenticate the client connection to the service.

## Next steps
