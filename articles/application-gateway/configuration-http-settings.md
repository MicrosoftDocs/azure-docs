---
title: Azure Application Gateway HTTP settings configuration
description: This article describes how to configure Azure Application Gateway HTTP settings.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 03/17/2023
ms.author: greglin
---

# Application Gateway HTTP settings configuration

The application gateway routes traffic to the backend servers by using the configuration that you specify here. After you create an HTTP setting, you must associate it with one or more request-routing rules.

## Cookie-based affinity

Azure Application Gateway uses gateway-managed cookies for maintaining user sessions. When a user sends the first request to Application Gateway, it sets an affinity cookie in the response with a hash value which contains the session details, so that the subsequent requests carrying the affinity cookie will be routed to the same backend server for maintaining stickiness.

This feature is useful when you want to keep a user session on the same server and when session state is saved locally on the server for a user session. If the application can't handle cookie-based affinity, you can't use this feature. To use it, make sure that the clients support cookies.
> [!NOTE]
> Some vulnerability scans may flag the Application Gateway affinity cookie because the Secure or HttpOnly flags are not set. These scans do not take into account that the data in the cookie is generated using a one-way hash. The cookie doesn't contain any user information and is used purely for routing. 


The [Chromium browser](https://www.chromium.org/Home) [v80 update](https://chromiumdash.appspot.com/schedule) brought a mandate where HTTP cookies without [SameSite](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-03#rfc.section.5.3.7) attribute have to be treated as SameSite=Lax. For CORS (Cross-Origin Resource Sharing) requests, if the cookie has to be sent in a third-party context, it has to use *SameSite=None; Secure* attributes and it should be sent over HTTPS only. Otherwise, in an HTTP only scenario, the browser doesn't send the cookies in the third-party context. The goal of this update from Chrome is to enhance security and to avoid Cross-Site Request Forgery (CSRF) attacks. 

To support this change, starting February 17 2020, Application Gateway (all the SKU types) will inject another cookie called *ApplicationGatewayAffinityCORS* in addition to the existing *ApplicationGatewayAffinity* cookie. The *ApplicationGatewayAffinityCORS* cookie has two more attributes added to it (*"SameSite=None; Secure"*) so that sticky sessions are maintained even for cross-origin requests.

Note that the default affinity cookie name is *ApplicationGatewayAffinity* and you can change it. In case you're using a custom affinity cookie name, an additional cookie is added with CORS as suffix. For example, *CustomCookieNameCORS*.

> [!NOTE]
> If the attribute *SameSite=None* is set, it is mandatory that the cookie also contains the *Secure* flag, and must be sent over HTTPS.  If session affinity is required over CORS, you must migrate your workload to HTTPS. 
Please refer to TLS offload and End-to-End TLS documentation for Application Gateway here – [Overview](ssl-overview.md), [Configure an application gateway with TLS termination using the Azure portal](create-ssl-portal.md), [Configure end-to-end TLS by using Application Gateway with the portal](end-to-end-ssl-portal.md).

## Connection draining

Connection draining helps you gracefully remove backend pool members during planned service updates. It applies to backend instances that are 
- explicitly removed from the backend pool,
- removed during scale-in operations, or
- reported as unhealthy by the health probes.

You can apply this setting to all backend pool members by enabling Connection Draining in the Backend Setting. It ensures that all deregistering instances in a backend pool don't receive any new requests/connections while maintaining the existing connections until the configured timeout value. This is also true for WebSocket connections.

| Configuration Type  | Value |
| ---------- | ---------- |
|Default value when Connection Draining is not enabled in Backend Setting| 30 seconds |
|User-defined value when Connection Draining is enabled in Backend Setting | 1 to 3600 seconds |

The only exception to this are requests bound for deregistering instances because of gateway-managed session affinity and will continue to be forwarded to the deregistering instances.

## Protocol

Application Gateway supports both HTTP and HTTPS for routing requests to the backend servers. If you choose HTTP, traffic to the backend servers is unencrypted. If unencrypted communication isn't acceptable, choose HTTPS.

This setting combined with HTTPS in the listener supports [end-to-end TLS](ssl-overview.md). This allows you to securely transmit sensitive data encrypted to the back end. Each backend server in the backend pool that has end-to-end TLS enabled must be configured with a certificate to allow secure communication.

## Port

This setting specifies the port where the backend servers listen to traffic from the application gateway. You can configure ports ranging from 1 to 65535.

## Trusted root certificate 

If you select HTTPS as the backend protocol, the Application Gateway requires a trusted root certificate to trust the backend pool for end-to-end SSL. By default, the **Use well known CA certificate** option is set to **No**. If you plan to use a self-signed certificate, or a certificate signed by an internal Certificate Authority, then you must provide the Application Gateway the matching public certificate that the backend pool will be using. This certificate must be uploaded directly to the Application Gateway in .CER format.

If you plan to use a certificate on the backend pool that is signed by a trusted public Certificate Authority, then you can set the **Use well known CA certificate** option to **Yes** and skip uploading a public certificate.

## Request timeout

This setting is the number of seconds that the application gateway waits to receive a response from the backend server.

## Override backend path

This setting lets you configure an optional custom forwarding path to use when the request is forwarded to the back end. Any part of the incoming path that matches the custom path in the **override backend path** field is copied to the forwarded path. The following table shows how this feature works:

- When the HTTP setting is attached to a basic request-routing rule:

  | Original request  | Override backend path | Request forwarded to back end |
  | ----------------- | --------------------- | ---------------------------- |
  | /home/            | /override/            | /override/home/              |
  | /home/secondhome/ | /override/            | /override/home/secondhome/   |

- When the HTTP setting is attached to a path-based request-routing rule:

  | Original request           | Path rule       | Override backend path | Request forwarded to back end |
  | -------------------------- | --------------- | --------------------- | ---------------------------- |
  | /pathrule/home/            | /pathrule*      | /override/            | /override/home/              |
  | /pathrule/home/secondhome/ | /pathrule*      | /override/            | /override/home/secondhome/   |
  | /home/                     | /pathrule*      | /override/            | /override/home/              |
  | /home/secondhome/          | /pathrule*      | /override/            | /override/home/secondhome/   |
  | /pathrule/home/            | /pathrule/home* | /override/            | /override/                   |
  | /pathrule/home/secondhome/ | /pathrule/home* | /override/            | /override/secondhome/        |
  | /pathrule/                 | /pathrule/      | /override/            | /override/                   |


## Use custom probe

This setting associates a [custom probe](application-gateway-probe-overview.md#custom-health-probe) with an HTTP setting. You can associate only one custom probe with an HTTP setting. If you don't explicitly associate a custom probe, the [default probe](application-gateway-probe-overview.md#default-health-probe-settings) is used to monitor the health of the back end. We recommend that you create a custom probe for greater control over the health monitoring of your back ends.

> [!NOTE]
> The custom probe doesn't monitor the health of the backend pool unless the corresponding HTTP setting is explicitly associated with a listener.

## Configuring the host name

Application Gateway allows for the connection established to the backend to use a *different* hostname than the one used by the client to connect to Application Gateway.  While this configuration can be useful in some cases, overriding the hostname to be different between the client and application gateway and application gateway to backend target, should be done with care.  

In production, it is recommended to keep the hostname used by the client towards the application gateway as the same hostname used by the application gateway to the backend target. This avoids potential issues with absolute URLs, redirect URLs, and host-bound cookies.

Before setting up Application Gateway that deviates from this, please review the implications of such configuration as discussed in more detail in Architecture Center: [Preserve the original HTTP host name between a reverse proxy and its backend web application](/azure/architecture/best-practices/host-name-preservation)

There are two aspects of an HTTP setting that influence the [`Host`](https://datatracker.ietf.org/doc/html/rfc2616#section-14.23) HTTP header that is used by Application Gateway to connect to the backend:
- "Pick host name from backend-address"
- "Host name override"

## Pick host name from backend address

This capability dynamically sets the *host* header in the request to the host name of the backend pool. It uses an IP address or FQDN.

This feature helps when the domain name of the back end is different from the DNS name of the application gateway, and the back end relies on a specific host header to resolve to the correct endpoint.

An example case is multi-tenant services as the back end. An app service is a multi-tenant service that uses a shared space with a single IP address. So, an app service can only be accessed through the hostnames that are configured in the custom domain settings.

By default, the custom domain name is *example.azurewebsites.net*. To access your app service by using an application gateway through a hostname that's not explicitly registered in the app service or through the application gateway's FQDN, you can override the hostname in the original request to the app service's hostname. To do this, enable the **pick host name from backend address** setting.

For a custom domain whose existing custom DNS name is mapped to the app service, the recommended configuration is not to enable the **pick host name from backend address**.

> [!NOTE]
> This setting is not required for App Service Environment, which is a dedicated deployment.

## Host name override

This capability replaces the *host* header in the incoming request on the application gateway with the host name that you specify.

For example, if *www.contoso.com* is specified in the **Host name** setting, the original request *`https://appgw.eastus.cloudapp.azure.com/path1` is changed to *`https://www.contoso.com/path1` when the request is forwarded to the backend server.

## Next steps

- [Learn about the backend pool](configuration-overview.md#backend-pool)
