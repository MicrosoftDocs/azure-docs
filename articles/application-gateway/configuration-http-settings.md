---
title: Azure Application Gateway HTTP settings configuration
description: This article describes how to configure Azure Application Gateway HTTP settings.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: conceptual
ms.date: 09/09/2020
ms.author: surmb
---

# Application Gateway HTTP settings configuration

The application gateway routes traffic to the back-end servers by using the configuration that you specify here. After you create an HTTP setting, you must associate it with one or more request-routing rules.

## Cookie-based affinity

Azure Application Gateway uses gateway-managed cookies for maintaining user sessions. When a user sends the first request to Application Gateway, it sets an affinity cookie in the response with a hash value which contains the session details, so that the subsequent requests carrying the affinity cookie will be routed to the same backend server for maintaining stickiness. 

This feature is useful when you want to keep a user session on the same server and when session state is saved locally on the server for a user session. If the application can't handle cookie-based affinity, you can't use this feature. To use it, make sure that the clients support cookies.

The [Chromium browser](https://www.chromium.org/Home) [v80 update](https://chromiumdash.appspot.com/schedule) brought a mandate where HTTP cookies without [SameSite](https://tools.ietf.org/id/draft-ietf-httpbis-rfc6265bis-03.html#rfc.section.5.3.7) attribute has to be treated as SameSite=Lax. In the case of CORS (Cross-Origin Resource Sharing) requests, if the cookie has to be sent in a third-party context, it has to use *SameSite=None; Secure* attributes and it should be sent over HTTPS only. Otherwise, in a HTTP only scenario, the browser doesn't send the cookies in the third-party context. The goal of this update from Chrome is to enhance security and to avoid Cross-Site Request Forgery (CSRF) attacks. 

To support this change, starting February 17 2020, Application Gateway (all the SKU types) will inject another cookie called *ApplicationGatewayAffinityCORS* in addition to the existing *ApplicationGatewayAffinity* cookie. The *ApplicationGatewayAffinityCORS* cookie has two more attributes added to it (*"SameSite=None; Secure"*) so that sticky session are maintained even for cross-origin requests.

Note that the default affinity cookie name is *ApplicationGatewayAffinity* and you can change it. In case you're using a custom affinity cookie name, an additional cookie is added with CORS as suffix. For example, *CustomCookieNameCORS*.

> [!NOTE]
> If the attribute *SameSite=None* is set, it is mandatory that the cookie also contains the *Secure* flag, and must be sent over HTTPS.  If session affinity is required over CORS, you must migrate your workload to HTTPS. 
Please refer to TLS offload and End-to-End TLS documentation for Application Gateway here – [Overview](ssl-overview.md), [Configure an application gateway with TLS termination using the Azure portal](create-ssl-portal.md), [Configure end-to-end TLS by using Application Gateway with the portal](end-to-end-ssl-portal.md).

## Connection draining

Connection draining helps you gracefully remove back-end pool members during planned service updates. You can apply this setting to all members of a back-end pool by enabling connection draining on the HTTP setting. It ensures that all deregistering instances of a back-end pool continue to maintain existing connections and serve on-going requests for a configurable timeout and don't receive any new requests or connections. The only exception to this are requests bound for deregistering instances because of gateway-managed session affinity and will continue to be forwarded to the deregistering instances. Connection draining applies to back-end instances that are explicitly removed from the back-end pool.

## Protocol

Application Gateway supports both HTTP and HTTPS for routing requests to the back-end servers. If you choose HTTP, traffic to the back-end servers is unencrypted. If unencrypted communication isn't acceptable, choose HTTPS.

This setting combined with HTTPS in the listener supports [end-to-end TLS](ssl-overview.md). This allows you to securely transmit sensitive data encrypted to the back end. Each back-end server in the back-end pool that has end-to-end TLS enabled must be configured with a certificate to allow secure communication.

## Port

This setting specifies the port where the back-end servers listen to traffic from the application gateway. You can configure ports ranging from 1 to 65535.

## Request timeout

This setting is the number of seconds that the application gateway waits to receive a response from the back-end server.

## Override back-end path

This setting lets you configure an optional custom forwarding path to use when the request is forwarded to the back end. Any part of the incoming path that matches the custom path in the **override backend path** field is copied to the forwarded path. The following table shows how this feature works:

- When the HTTP setting is attached to a basic request-routing rule:

  | Original request  | Override back-end path | Request forwarded to back end |
  | ----------------- | --------------------- | ---------------------------- |
  | /home/            | /override/            | /override/home/              |
  | /home/secondhome/ | /override/            | /override/home/secondhome/   |

- When the HTTP setting is attached to a path-based request-routing rule:

  | Original request           | Path rule       | Override back-end path | Request forwarded to back end |
  | -------------------------- | --------------- | --------------------- | ---------------------------- |
  | /pathrule/home/            | /pathrule*      | /override/            | /override/home/              |
  | /pathrule/home/secondhome/ | /pathrule*      | /override/            | /override/home/secondhome/   |
  | /home/                     | /pathrule*      | /override/            | /override/home/              |
  | /home/secondhome/          | /pathrule*      | /override/            | /override/home/secondhome/   |
  | /pathrule/home/            | /pathrule/home* | /override/            | /override/                   |
  | /pathrule/home/secondhome/ | /pathrule/home* | /override/            | /override/secondhome/        |
  | /pathrule/                 | /pathrule/      | /override/            | /override/                   |

## Use for app service

This is a UI only shortcut that selects the two required settings for the Azure App Service back end. It enables **pick host name from back-end address**, and it creates a new custom probe if you don't have one already. (For more information, see the [Pick host name from back-end address](#pick-host-name-from-back-end-address) setting section of this article.) A new probe is created, and the probe header is picked from the back-end member's address.

## Use custom probe

This setting associates a [custom probe](application-gateway-probe-overview.md#custom-health-probe) with an HTTP setting. You can associate only one custom probe with an HTTP setting. If you don't explicitly associate a custom probe, the [default probe](application-gateway-probe-overview.md#default-health-probe-settings) is used to monitor the health of the back end. We recommend that you create a custom probe for greater control over the health monitoring of your back ends.

> [!NOTE]
> The custom probe doesn't monitor the health of the back-end pool unless the corresponding HTTP setting is explicitly associated with a listener.

## Pick host name from back-end address

This capability dynamically sets the *host* header in the request to the host name of the back-end pool. It uses an IP address or FQDN.

This feature helps when the domain name of the back end is different from the DNS name of the application gateway, and the back end relies on a specific host header to resolve to the correct endpoint.

An example case is multi-tenant services as the back end. An app service is a multi-tenant service that uses a shared space with a single IP address. So, an app service can only be accessed through the hostnames that are configured in the custom domain settings.

By default, the custom domain name is *example.azurewebsites.net*. To access your app service by using an application gateway through a hostname that's not explicitly registered in the app service or through the application gateway's FQDN, you override the hostname in the original request to the app service's hostname. To do this, enable the **pick host name from backend address** setting.

For a custom domain whose existing custom DNS name is mapped to the app service, you don't have to enable this setting.

> [!NOTE]
> This setting is not required for App Service Environment, which is a dedicated deployment.

## Host name override

This capability replaces the *host* header in the incoming request on the application gateway with the host name that you specify.

For example, if *www.contoso.com* is specified in the **Host name** setting, the original request *`https://appgw.eastus.cloudapp.azure.com/path1` is changed to *`https://www.contoso.com/path1` when the request is forwarded to the back-end server.

## Next steps

- [Learn about the back-end pool](configuration-overview.md#back-end-pool)
