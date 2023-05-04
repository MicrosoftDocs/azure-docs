---
title: 'Azure Event Grid Namespace MQTT client authentication'
description: 'Describes how MQTT clients are authenticated and mTLS connection is established when a client connects to MQTT service.'
ms.topic: conceptual
ms.date: 04/20/2023
author: veyaddan
ms.author: veyaddan
---

# Client authentication

We support authentication of clients using X.509 certificates.  X.509 certificate provides the credentials to associate a particular client with the tenant.  In this model, authentication generally happens once during session establishment.  Then, all future operations using the same session are assumed to come from that identity.  

## Supported authentication modes

- Certificates issued by a Certificate Authority (CA)
- Self-signed client certificate - thumbprint based authentication

**Certificate Authority (CA) signed certificates:**
In this method, a root or intermediate X.509 certificate is registered with the service. Essentially, the root or intermediary certificate that is used to sign the client certificate, must be registered with the service first.

While registering the clients, you need to identify the certificate field used to hold the client authentication name.  Service matches the authentication name from certificate with the client's authentication name in client metadata to validate the client. Service also validates  the client certificate by verifying whether it's signed by the previously registered root or intermediary certificate.

**Self-signed client certificate - thumbprint based authentication:**
Clients are onboarded to the service using the certificate thumbprint alongside the identity record. In this method of authentication, the client registry stores the exact thumbprint of the certificate that the client is going to use to authenticate.  When client tries to connect to the service, service validates the client by comparing the thumbprint presented in the client certificate with the thumbprint stored in client metadata.

## Key terms of client metadata

**Client Authentication Name:**  You can provide a unique identifier for the client without Azure Resource Manager naming constraints. It's a mandatory field and if not explicitly provided, it's defaulted to the Client Name.

No two clients can have same authentication name within a Namespace. While authenticating a client, we treat Client authentication name as case insensitive.

We preserve the original case of client authentication name that you configure in the client. We use the original client authentication name (case sensitive) that was provided when client was created, in routing enrichments, topic space matching, etc.

**Client Certificate Authentication Validation Scheme:**
To use CA certificate for authentication, you can choose from one of following options to specify the location of the client identity in the client certificate. When the client tries to connect to the service, service finds the client identify from this certificate field and matches it with the client authentication name to authenticate the client.

We support five certificate fields:
- Subject Matches Authentication Name
- Dns Matches Authentication Name
- Uri Matches Authentication Name
- IP Matches Authentication Name
- Email Matches Authentication Name

Use the "Thumbprint Match" option while using self-signed certificate to authenticate the client.

### Client authentication source options

| Authentication Source Option | Certificate field | Description |
| ------------ | ------------ | ------------ |
| Certificate Subject Name | tls_client_auth_subject_dn | The subject distinguished name of the certificate. |
| Certificate Dns | tls_client_auth_san_dns | The dNSName SAN entry in the certificate. |
| Certificate Uri | tls_client_auth_san_uri | The uniformResourceIdentifier SAN entry in the certificate. |
| Certificate Ip | tls_client_auth_san_ip | The IPv4 or IPv6 address present in the iPAddress SAN entry in the certificate. |
| Certificate Email | tls_client_auth_san_email | The rfc822Name SAN entry in the certificate. |

> [!NOTE]
> We recommend that you include the client authentication name in the username field of the client's connect packet.  Using this authentication name along with the client certificate, service will be able to authenticate the client.
> If you do not provide the authentication name in the username field, you need to configure the alternative source fields at namespace scope.  Service will look for the client authentication name in corresponding field of the client certificate in the order the fields are mentioned on the namespace configuration page.

## High level flow of how mutual transport layer security (mTLS) connection is established

1. The client initiates the handshake with Event Grid MQTT service.  It sends a hello packet with supported TLS version, cipher suites.
2. Service presents its certificate to the client.  
    - Service presents either a P-384 EC certificate or an RSA 2048 certificate depending on the ciphers in the client hello packet.
    - Service certificates are signed by a public certificate authority.
3. Client validates that it's connected to the correct and trusted service.
4. Then the client presents its own certificate to prove its authenticity.  
    - Currently, we only support certificate-based authentication, so clients must send their certificate.
5. Service completes TLS handshake successfully after validating the certificate.
6. After completing the TLS handshake and mTLS connection is established, the client sends the MQTT CONNECT packet to the service.
7. Service authenticates the client and allows the connection.
    - The same client certificate that was used to establish mTLS is used to authenticate the client connection to the service.

## Next steps
- Learn how to [authenticate clients using certificate chain](mqtt-certificate-chain-client-authentication.md)
