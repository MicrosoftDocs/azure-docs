---
title: Enabling end to end SSL on Azure Application Gateway
description: This article is an overview of the Application Gateway end to end SSL support.
services: application-gateway
author: amsriva
ms.service: application-gateway
ms.topic: article
ms.date: 8/6/2018
ms.author: amsriva

---
# Overview of end to end SSL with Application Gateway

Application Gateway supports SSL termination at the gateway, after which traffic typically flows unencrypted to the backend servers. This feature allows web servers to be unburdened from costly encryption and decryption overhead. However for some customers unencrypted communication to the backend servers is not an acceptable option. This unencrypted communication could be due to security requirements, compliance requirements, or the application may only accept a secure connection. For such applications, application gateway supports end to end SSL encryption.

End to end SSL allows you to securely transmit sensitive data to the backend encrypted while still taking advantage of the benefits of Layer 7 load balancing features which application gateway provides. Some of these features are cookie-based session affinity, URL-based routing, support for routing based on sites, or ability to inject X-Forwarded-* headers.

When configured with end to end SSL communication mode, application gateway terminates the SSL sessions at the gateway and decrypts user traffic. It then applies the configured rules to select an appropriate backend pool instance to route traffic to. Application gateway then initiates a new SSL connection to the backend server and re-encrypts data using the backend server's public key certificate before transmitting the request to the backend. End to end SSL is enabled by setting protocol setting in **BackendHTTPSetting** to HTTPS, which is then applied to a backend pool. Each backend server in the backend pool with end to end SSL enabled must be configured with a certificate to allow secure communication.

![end to end ssl scenario][1]

In this example, requests using TLS1.2 are routed to backend servers in Pool1 using end to end SSL.

## End to end SSL and whitelisting of certificates

Application gateway only communicates with known backend instances that have whitelisted their certificate with the application gateway. To enable whitelisting of certificates, you must upload the public key of backend server certificates to the application gateway (not the root certificate). Only connections to known and whitelisted backends are then allowed. The remaining backends results in a gateway error. Self-signed certificates are for test purposes only and not recommended for production workloads. Such certificates must be whitelisted with the application gateway as described in the preceding steps before they can be used.

> [!NOTE]
> Authentication certificate setup is not required for trusted Azure services such as Azure Web Apps.

## Next steps

After learning about end to end SSL, go to [Configure an application gateway with SSL termination using the Azure portal](create-ssl-portal.md) to create an application gateway using end to end SSL.

<!--Image references-->

[1]: ./media/ssl-overview/scenario.png
