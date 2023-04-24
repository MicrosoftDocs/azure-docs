---
title: Azure Event Grid Namespace MQTT client authentication
description: Describes how MQTT clients are authenticated and mTLS connection is established when a client connects to MQTT service.
ms.topic: conceptual
ms.date: 04/20/2023
author: veyaddan
ms.author: veyaddan
---

# Client Authentication

We support authentication of clients using X.509 certificates.  X.509 certificate will provide the credentials to associate a particular client with the tenant.  In this model, authentication generally happens once during session establishment.  Then, all future operations using the same session are assumed to come from that identity.  

## Supported authentication credential types

- Certificates issued by a Certificate Authority (CA)
- Certificate thumbprint

**CA signed certificates:**
In this method, a root or intermediate X.509 certificate is registered with the service. Essentially, the root or intermediary certificate that is used to sign the client certificate, must be registered with the service first. Later, clients are authenticated if they have a valid leaf certificate that's signed by the root or intermediate certificate that was supplied to the service. While registering the clients, the subject common name of the leaf certificate needs to be supplied for authentication. Service will validate the subject values match the subject values from the client certificate and also validate the client certificate is signed the root or intermediary certificate that was registered earlier.

**Certificate Thumbprint:**
Clients are onboarded to the service using the certificate thumbprint alongside the identity record. In this method of authentication, the client registry will store the exact ID of the certificate that the client is going to use to authenticate.
Client Authentication Name: For the client, you can provide a unique identifier which is not restricted by Azure Resource Manager naming constraints. It is a mandatory field and if not explicitly provided, it will be defaulted to the Client Name.

No two clients can have same authentication name within a Namespace. While authenticating a client, we treat Client authentication name as case insensitive.

We preserve the original case of client authentication name that you configure in the client. We use the original client authentication name (case sensitive) that was provided when client was created, in routing enrichments, topic space matching, etc.

**Client Certificate Authentication Validation Scheme:**
To use CA certificate for authentication, you can choose from one of following options to specify the location of the client identity in the client certificate. When the client tries to connect to the service, service will find the client identify from this certificate field and matches it with the client authentication name to authenciate the client.

We support 5 certificate fields, you can find more information in below table. 
- Subject Matches Authentication Name
- Dns Matches Authentication Name
- Uri Matches Authentication Name
- IP Matches Authentication Name
- Email Matches Authentication Name

Use the "Thumbprint Match" option while using the client certificate thumbprint to authenticate the client.

## Client authentication source options

| Authentication Source Option | Certificate field | Description |
| ------------ | ------------ | ------------ |
| Certificate Subject Name | tls_client_auth_subject_dn | The subject distinguished name of the certificate. |
| Certificate Dns | tls_client_auth_san_dns | The dNSName SAN entry in the certificate. |
| Certificate Uri | tls_client_auth_san_uri | The uniformResourceIdentifier SAN entry in the certificate. |
| Certificate Ip | tls_client_auth_san_ip | The IPv4 or IPv6 address present in the iPAddress SAN entry in the certificate. |
| Certificate Email | tls_client_auth_san_email | The rfc822Name SAN entry in the certificate. |

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
