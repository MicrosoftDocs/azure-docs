---
title: Enabling end to end SSL on Azure Application Gateway
description: This article is an overview of the Application Gateway end to end SSL support.
services: application-gateway
author: amsriva
ms.service: application-gateway
ms.topic: article
ms.date: 10/23/2018
ms.author: amsriva

---
# Overview of end to end SSL with Application Gateway

Application Gateway supports SSL termination at the gateway, after which traffic typically flows unencrypted to the backend servers. This feature allows web servers to be unburdened from costly encryption and decryption overhead. However for some customers unencrypted communication to the backend servers is not an acceptable option. This unencrypted communication could be due to security requirements, compliance requirements, or the application may only accept a secure connection. For such applications, application gateway supports end to end SSL encryption.

End to end SSL allows you to securely transmit sensitive data to the backend encrypted while still taking advantage of the benefits of Layer 7 load-balancing features which application gateway provides. Some of these features are cookie-based session affinity, URL-based routing, support for routing based on sites, or ability to inject X-Forwarded-* headers.

When configured with end to end SSL communication mode, application gateway terminates the SSL sessions at the gateway and decrypts user traffic. It then applies the configured rules to select an appropriate backend pool instance to route traffic to. Application gateway then initiates a new SSL connection to the backend server and re-encrypts data using the backend server's public key certificate before transmitting the request to the backend. End to end SSL is enabled by setting protocol setting in **BackendHTTPSetting** to HTTPS, which is then applied to a backend pool. Each backend server in the backend pool with end to end SSL enabled must be configured with a certificate to allow secure communication.

![end to end ssl scenario][1]

In this example, requests using TLS1.2 are routed to backend servers in Pool1 using end to end SSL.

## End to end SSL and whitelisting of certificates

Application gateway only communicates with known backend instances that have whitelisted their certificate with the application gateway. To enable whitelisting of certificates, you must upload the public key of backend server certificates to the application gateway (not the root certificate). Only connections to known and whitelisted backends are then allowed. The remaining backends results in a gateway error. Self-signed certificates are for test purposes only and not recommended for production workloads. Such certificates must be whitelisted with the application gateway as described in the preceding steps before they can be used.

> [!NOTE]
> Authentication certificate setup is not required for trusted Azure services such as Azure Web Apps.

## End to end SSL with the v2 SKU

Authentication Certificates have been deprecated and replaced by Trusted Root Certificates in the Application Gateway v2 SKU. They function similarly to Authentication Certificates with a few key differences:

- Certificates signed by well known CA authorities whose CN matches the host name in the HTTP backend settings do not require any additional step for end to end SSL to work. 

   For example, if the backend certificates are issued by a well known CA and has a CN of contoso.com, and the backend http setting’s host field is also set to contoso.com, then no additional steps are required. You can set the backend http setting protocol to HTTPS and both the health probe and data path would be SSL enabled. If you are using Azure Web Apps or other Azure web services as your backend, then these are implicitly trusted as well and no further steps are required for end to end SSL.
- If the certificate is self-signed, or signed by unknown intermediaries, then to enable end to end SSL in v2 SKU a trusted root certificate must be defined. Application Gateway will only communicate with backends whose Server certificate’s root certificate matches one of the list of trusted root certificates in the backend http setting associated with the pool.
- In addition to root certificate match, Application Gateway also validates if the Host setting specified in the backend http setting matches that of the common name (CN) presented by the backend server’s SSL certificate. When trying to establish an SSL connection to the backend, Application Gateway sets the Server Name Indication (SNI) extension to the Host specified in the backend http setting.
- If **pick hostname from backend address** is chosen instead of the Host field in the backend http setting,  then the SNI header is always set to the backend pool FQDN and the CN on the backend server SSL certificate must match its FQDN. Backend pool members with IPs are not supported in this scenario.
- The root certificate is a base64 encoded root certificate from the backend Server certificates.

## Next steps

After learning about end to end SSL, go to [Configure end to end SSL by using Application Gateway with PowerShell](application-gateway-end-to-end-ssl-powershell.md) to create an application gateway using end to end SSL.

<!--Image references-->

[1]: ./media/ssl-overview/scenario.png
