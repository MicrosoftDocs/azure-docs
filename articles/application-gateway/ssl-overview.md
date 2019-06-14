---
title: Enabling end to end SSL on Azure Application Gateway
description: This article is an overview of the Application Gateway end to end SSL support.
services: application-gateway
author: amsriva
ms.service: application-gateway
ms.topic: article
ms.date: 3/19/2019
ms.author: victorh

---
# Overview of SSL termination and end to end SSL with Application Gateway

Secure Sockets Layer (SSL) is the standard security technology for establishing an encrypted link between a web server and a browser. This link ensures that all data passed between the web server and browsers remain private and encrypted. Application gateway supports both SSL termination at the gateway as well as end to end SSL encryption.

## SSL termination

Application Gateway supports SSL termination at the gateway, after which traffic typically flows unencrypted to the backend servers. There are a number of advantages of doing SSL termination at the application gateway:

- **Improved performance** – The biggest performance hit when doing SSL decryption is the initial handshake. To improve performance, the server doing the decryption caches SSL session IDs and manages TLS session tickets. If this is done at the application gateway, all requests from the same client can use the cached values. If it’s done on the backend servers, then each time the client’s requests go to a different server the client has to re‑authenticate. The use of TLS tickets can help mitigate this issue, but they are not supported by all clients and can be difficult to configure and manage.
- **Better utilization of the backend servers** – SSL/TLS processing is very CPU intensive, and is becoming more intensive as key sizes increase. Removing this work from the backend servers allows them to focus on what they are most efficient at, delivering content.
- **Intelligent routing** – By decrypting the traffic, the application gateway has access to the request content, such as headers, URI, and so on, and can use this data to route requests.
- **Certificate management** – Certificates only need to be purchased and installed on the application gateway and not all backend servers. This saves both time and money.

To configure SSL termination, an SSL certificate is required to be added to the listener to enable the application gateway to derive a symmetric key as per SSL protocol specification. The symmetric key is then used to encrypt and decrypt the traffic sent to the gateway. The SSL certificate needs to be in Personal Information Exchange (PFX) format. This file format allows you to export the private key that is required by the application gateway to perform the encryption and decryption of traffic.

> [!NOTE] 
>
> Application gateway does not provide any capability to create a new certificate or send a certificate request to a certification authority.

For the SSL connection to work, you need to ensure that the SSL certificate meets the following conditions:

- That the current date and time is within the "Valid from" and "Valid to" date range on the certificate.
- That the certificate's "Common Name" (CN) matches the host header in the request. For example, if the client is making a request to `https://www.contoso.com/`, then the CN must be `www.contoso.com`.

### Certificates supported for SSL termination

Application gateway supports the following types of certificates:

- CA (Certificate Authority) certificate: A CA certificate is a digital certificate issued by a certificate authority (CA)
- EV (Extended Validation) certificate: An EV certificate is an industry standard certificate guidelines. This will turn the browser locator bar green and publish company name as well.
- Wildcard Certificate: This certificate supports any number of subdomains based on *.site.com, where your subdomain would replace the *. It doesn’t, however, support site.com, so in case the users are accessing your website without typing the leading "www", the wildcard certificate will not cover that.
- Self-Signed certificates: Client browsers do not trust these certificates and will warn the user that the virtual service’s certificate is not part of a trust chain. Self-signed certificates are good for testing or environments where administrators control the clients and can safely bypass the browser’s security alerts. Production workloads should never use self-signed certificates.

For more information, see [configure SSL termination with application gateway](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal).

### Size of the certificate
Check the [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits) section to know the maximum SSL certificate size supported.

## End to end SSL encryption

Some customers may not desire unencrypted communication to the backend servers. This could be due to security requirements, compliance requirements, or the application may only accept a secure connection. For such applications, application gateway supports end to end SSL encryption.

End to end SSL allows you to securely transmit sensitive data to the backend encrypted while still taking advantage of the benefits of Layer 7 load-balancing features which application gateway provides. Some of these features are cookie-based session affinity, URL-based routing, support for routing based on sites, or ability to inject X-Forwarded-* headers.

When configured with end to end SSL communication mode, application gateway terminates the SSL sessions at the gateway and decrypts user traffic. It then applies the configured rules to select an appropriate backend pool instance to route traffic to. Application gateway then initiates a new SSL connection to the backend server and re-encrypts data using the backend server's public key certificate before transmitting the request to the backend. Any response from the web server goes through the same process back to the end user. End to end SSL is enabled by setting protocol setting in [Backend HTTP Setting](https://docs.microsoft.com/azure/application-gateway/configuration-overview#http-settings) to HTTPS, which is then applied to a backend pool.

The SSL policy applies to both frontend and backend traffic. On the front end, Application Gateway acts as the server and enforces the policy. On the backend, Application Gateway acts as the client and sends the protocol/cipher information as the preference during the SSL handshake.

Application gateway only communicates with those backend instances that have either whitelisted their certificate with the application gateway or whose certificates are signed by well known CA authorities where the certificate CN matches the host name in the HTTP backend settings. These include the trusted Azure services such as Azure App service web apps and Azure API Management.

If the certificates of the members in the backend pool are not signed by well known CA authorities, then each instance in the backend pool with end to end SSL enabled must be configured with a certificate to allow secure communication. Adding the certificate ensures that the application gateway only communicates with known back-end instances. This further secures the end-to-end communication.

> [!NOTE] 
>
> Authentication certificate setup is not required for trusted Azure services such as Azure App service web apps and Azure API Management.

> [!NOTE] 
>
> The certificate added to **Backend HTTP Setting** to authenticate the backend servers can be the same as the certificate added to the **listener** for SSL termination at application gateway or different for enhanced security.

![end to end ssl scenario][1]

In this example, requests using TLS1.2 are routed to backend servers in Pool1 using end to end SSL.

## End to end SSL and whitelisting of certificates

Application gateway only communicates with known backend instances that have whitelisted their certificate with the application gateway. To enable whitelisting of certificates, you must upload the public key of backend server certificates to the application gateway (not the root certificate). Only connections to known and whitelisted backends are then allowed. The remaining backends results in a gateway error. Self-signed certificates are for test purposes only and not recommended for production workloads. Such certificates must be whitelisted with the application gateway as described in the preceding steps before they can be used.

> [!NOTE]
> Authentication certificate setup is not required for trusted Azure services such as Azure App Service.

## End to end SSL with the v2 SKU

Authentication Certificates have been deprecated and replaced by Trusted Root Certificates in the Application Gateway v2 SKU. They function similarly to Authentication Certificates with a few key differences:

- Certificates signed by well known CA authorities whose CN matches the host name in the HTTP backend settings do not require any additional step for end to end SSL to work. 

   For example, if the backend certificates are issued by a well known CA and has a CN of contoso.com, and the backend http setting’s host field is also set to contoso.com, then no additional steps are required. You can set the backend http setting protocol to HTTPS and both the health probe and data path would be SSL enabled. If you're using Azure App Service or other Azure web services as your backend, then these are implicitly trusted as well and no further steps are required for end to end SSL.
- If the certificate is self-signed, or signed by unknown intermediaries, then to enable end to end SSL in v2 SKU a trusted root certificate must be defined. Application Gateway will only communicate with backends whose Server certificate’s root certificate matches one of the list of trusted root certificates in the backend http setting associated with the pool.
- In addition to root certificate match, Application Gateway also validates if the Host setting specified in the backend http setting matches that of the common name (CN) presented by the backend server’s SSL certificate. When trying to establish an SSL connection to the backend, Application Gateway sets the Server Name Indication (SNI) extension to the Host specified in the backend http setting.
- If **pick hostname from backend address** is chosen instead of the Host field in the backend http setting,  then the SNI header is always set to the backend pool FQDN and the CN on the backend server SSL certificate must match its FQDN. Backend pool members with IPs aren't supported in this scenario.
- The root certificate is a base64 encoded root certificate from the backend Server certificates.

## Next steps

After learning about end to end SSL, go to [Configure end to end SSL by using Application Gateway with PowerShell](application-gateway-end-to-end-ssl-powershell.md) to create an application gateway using end to end SSL.

<!--Image references-->

[1]: ./media/ssl-overview/scenario.png
