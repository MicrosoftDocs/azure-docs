---
title: Azure Application Gateway Backend Settings configuration
description: This article describes how to configure Azure Application Gateway Backend Settings.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 09/15/2025
ms.author: mbender
ms.custom:
  - build-2025
# Customer intent: "As a cloud architect, I want to configure the Backend Settings for Azure Application Gateway, so that I can manage backend connections and optimize traffic routing based on various protocols and settings."
---

# Application Gateway backend settings configuration

The Backend Settings enable you to manage the configurations for backend connections established from an application gateway resource to a server in the backend pool. A Backend Settings configuration can be associated with one or more Routing rules.

## Types of Backend Settings in Application Gateway
While Portal users will only see the "Backend Settings" option, API users will have access to two types of settings. You must utilize the correct configuration, according to the protocol.

* Backend HTTP settings - It is for Layer 7 proxy configurations that support HTTP and HTTPS protocols.
* Backend settings - It is for Layer 4 proxy (Preview) configurations that support TLS and TCP protocols.

---
## [Backend HTTP Settings](#tab/backendhttpsettings)

### Cookie-based affinity

Azure Application Gateway uses gateway-managed cookies for maintaining user sessions. When a user sends the first request to Application Gateway, it sets an affinity cookie in the response with a hash value that contains the session details. This process enables subsequent requests that carry the affinity cookie to be routed to the same backend server, thus maintaining stickiness.

This feature is useful when you want to keep a user session on the same server and when session state is saved locally on the server for a user session. If the application can't handle cookie-based affinity, you can't use this feature. To use it, make sure that the clients support cookies.

> [!NOTE]
> Some vulnerability scans may flag the Application Gateway affinity cookie because the Secure or HttpOnly flags aren't set. These scans don't take into account that the data in the cookie is generated using a one-way hash. The cookie doesn't contain any user information and is used purely for routing. 


The [Chromium browser](https://www.chromium.org/Home) [v80 update](https://chromiumdash.appspot.com/schedule) brought a mandate where HTTP cookies without [SameSite](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-03#rfc.section.5.3.7) attribute have to be treated as SameSite=Lax. For CORS (Cross-Origin Resource Sharing) requests, if the cookie has to be sent in a third-party context, it has to use *SameSite=None; Secure* attributes and it should be sent over HTTPS only. Otherwise, in an HTTP only scenario, the browser doesn't send the cookies in the third-party context. The goal of this update from Chrome is to enhance security and to avoid Cross-Site Request Forgery (CSRF) attacks. 

To support this change, starting February 17 2020, Application Gateway (all the SKU types) will inject another cookie called *ApplicationGatewayAffinityCORS* in addition to the existing *ApplicationGatewayAffinity* cookie. The *ApplicationGatewayAffinityCORS* cookie has two more attributes added to it (*"SameSite=None; Secure"*) so that sticky sessions are maintained even for cross-origin requests.

The default affinity cookie name is *ApplicationGatewayAffinity* and you can change it. If in your network topology, you deploy multiple application gateways in line, you must set unique cookie names for each resource. If you're using a custom affinity cookie name, an additional cookie is added with `CORS` as suffix. For example: *CustomCookieNameCORS*.

> [!NOTE]
> If the attribute *SameSite=None* is set, it's mandatory that the cookie also contains the *Secure* flag, and must be sent over HTTPS. If session affinity is required over CORS, you must migrate your workload to HTTPS. Refer to TLS offload and End-to-End TLS documentation for Application Gateway. See the [SSL overview](ssl-overview.md), [Configure an application gateway with TLS termination](create-ssl-portal.md), and [Configure end-to-end TLS](end-to-end-ssl-portal.md).

### Connection draining

Connection draining helps you gracefully remove backend pool members during planned service updates. It applies to backend instances that are explicitly removed from the backend pool.

You can apply this setting to all backend pool members by enabling Connection Draining in the Backend Setting. It ensures that all deregistering instances in a backend pool don't receive any new requests/connections while maintaining the existing connections until the configured timeout value. This process is also true for WebSocket connections.

| Configuration Type  | Value |
| ---------- | ---------- |
|Default value when Connection Draining isn't enabled in Backend Setting| 30 seconds |
|User-defined value when Connection Draining is enabled in Backend Setting | 1 to 3600 seconds |

The only exception to this process are requests bound for deregistering instances because of gateway-managed session affinity. These requests continue to be forwarded to the deregistering instances.

> [!NOTE]
> There's a limitation where a configuration update will terminate ongoing connections after the connection draining timeout. To address this limitation, you must increase the connection draining time-out in the backend settings to a value higher than the max expected client download time. 

### Protocol

Application Gateway supports both HTTP and HTTPS for routing requests to the backend servers. If you choose HTTP, traffic to the backend servers is unencrypted. If unencrypted communication isn't acceptable, choose HTTPS.

This setting combined with HTTPS in the listener supports [end-to-end TLS](ssl-overview.md). This allows you to securely transmit sensitive data encrypted to the back end. Each backend server in the backend pool that has end-to-end TLS enabled must be configured with a certificate to allow secure communication.

### Port

This setting specifies the port where the backend servers listen to traffic from the application gateway. You can configure ports ranging from 1 to 65535.

### Trusted root certificate 

When selecting the HTTPS protocol in the backend settings, the application gateway resource utilizes its default Trusted Root CA certificate store to verify the chain and authenticity of the certificate provided by the backend server.

By default, the Application Gateway resource includes popular CA certificates, allowing seamless backend TLS connections when the backend server certificate is issued by a Public CA. However, if you intend to use a Private CA or a self-generated certificate with complete TLS validation, you must provide the corresponding Root CA certificate (.cer) in the Backend Settings configuration.

### Backend HTTPS validation settings

When HTTPS is selected in the Backend Settings of Azure Application Gateway, the gateway performs complete TLS handshake validation while establishing a secure connection with backend servers. These validations include:

1.	Verifying certificate chain to ensure the certificate is trusted.
2.	Verifying the Subject Name of certificate against the Server Name Indication (SNI) that was sent by the Application Gateway.
3.	Verifying the certificate expiry to confirm if the certificate is still valid.
   
The default validation settings ensure secure TLS communication between the gateway and backend services. In certain scenarios, it may be necessary to adjust one or more of these validation settings. To accommodate diverse customer requirements, Application Gateway offers the following configurable options. You can use either or both options as needed.

:::image source="media/configuration-http-settings/backend-tls-validations.png" alt-text="A diagram showing portal view of the TLS validation controls available for customers.":::

| Properties  | Values | 
| ---------- | ---------- |
| validateCertChainAndExpiry  | Type: Boolean (true or false). The default setting is true. This verifies or skips both certificate chain and expiry verifications. | 
| validateSNI | Type: Boolean (true or false). The default setting is true. It verifies if the Common Name of the certificate provided by the backend server matches the Server Name Indication (SNI) value that was sent by the Application Gateway. |
| sniName | Type: String. This property is required only when validateSNI is set as true. You can specify an SNI value to match the common name of the certificate on the backend. By default, the application gateway uses the incoming request’s host header as the SNI. |

> [!NOTE]
> - We recommend keeping all validations enabled for production environments. Disabling some or all validations is suggested only for testing and development purposes, such as when self-signed certificates are used.
> - These settings don't apply to test probe functionality when adding a custom Health Probe. As a result, you may see differences in the results when comparing to periodic health probes.
> - Currently, unsupported for TLS/TCP proxy.


### Request timeout

This setting is the number of seconds that the application gateway waits to receive a response from the backend server. The default value is 20 seconds. However, you may wish to adjust this setting to the needs of your application. Acceptable values are from 1 second to 86400 seconds (24 hours).

### Override backend path

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


### Use custom probe

This setting associates a [custom probe](application-gateway-probe-overview.md#custom-health-probe) with an HTTP setting. You can associate only one custom probe with an HTTP setting. If you don't explicitly associate a custom probe, the [default probe](application-gateway-probe-overview.md#default-health-probe-settings) is used to monitor the health of the back end. We recommend that you create a custom probe for greater control over the health monitoring of your back ends.

> [!NOTE]
> The custom probe doesn't monitor the health of the backend pool unless the corresponding HTTP setting is explicitly associated with a listener.

### Configuring the host name

Application Gateway allows for the connection established to the backend to use a *different* hostname than the one used by the client to connect to Application Gateway. While this configuration can be useful in some cases, exercise caution when overriding the hostname such that it's different between the application gateway and the client compared to the backend target.  

In production environments, it's a best practice to use the same hostname for the client to application gateway connection and application gateway to backend target connection. This practice avoids potential issues with absolute URLs, redirect URLs, and host-bound cookies.

Before setting up Application Gateway that deviates from this, review the implications of such configuration as discussed in more detail in Architecture Center: [Preserve the original HTTP host name between a reverse proxy and its backend web application](/azure/architecture/best-practices/host-name-preservation)

There are two aspects of an HTTP setting that influence the [`Host`](https://datatracker.ietf.org/doc/html/rfc2616#section-14.23) HTTP header that is used by Application Gateway to connect to the backend:
- "Pick host name from backend-address"
- "Host name override"

### Pick host name from backend address

This capability dynamically sets the *host* header in the request to the host name of the backend pool. It uses an IP address or FQDN.

This feature helps when the domain name of the back end is different from the DNS name of the application gateway, and the back end relies on a specific host header to resolve to the correct endpoint.

An example case is multitenant services as the back end. An app service is a multitenant service that uses a shared space with a single IP address. So, an app service can only be accessed through the hostnames that are configured in the custom domain settings.

By default, the custom domain name is *example.azurewebsites.net*. To access your app service by using an application gateway through a hostname that's not explicitly registered in the app service or through the application gateway's FQDN, you can override the hostname in the original request to the app service's hostname. To do this, enable the **pick host name from backend address** setting.

For a custom domain whose existing custom DNS name is mapped to the app service, the recommended configuration isn't to enable the **pick host name from backend address**.

> [!NOTE]
> This setting isn't required for App Service Environment, which is a dedicated deployment.

### Host name override

This capability replaces the *host* header in the incoming request on the application gateway with the host name that you specify.

For example, if *www.contoso.com* is specified in the **Host name** setting, the original request *`https://appgw.eastus.cloudapp.azure.com/path1` is changed to *`https://www.contoso.com/path1` when the request is forwarded to the backend server.

### Dedicated Backend Connection

Azure Application Gateway, by default, reuses idle backend connections to optimize the resource utilization of TCP connections for both the Application Gateway and the backend server.
To support security functions in customer data paths that necessitate unique backend connections per client, Azure Application Gateway V2 provides dedicated connections to backend servers.

:::image type="content" source="media/configuration-http-settings/dedicated-backend.png" alt-text="Screenshot of network flows through Application Gateway layer 7 proxy."::: This capability establishes direct, one-to-one mapping between frontend and backend connections, ensuring persistent connectivity for each individual client.

>[!IMPORTANT]
>Dedicated backend connection leads to an increase in the number of backend connections and hence could require more resources to support the increased concurrent connections on Application Gateway and the backend servers. On Application Gateway, you must consider increasing the number of instances or enabling auto scale.
>
>When the backend is a remote server, Application Gateway instances utilize SNAT ports for every connection. As each client connection establishes a dedicated backend connection, SNAT port consumption correspondingly increases. Therefore, it is important to account for potential SNAT port exhaustion. Visit the [architecture best practices](/azure/well-architected/service-guides/azure-application-gateway#design-checklist) for guidance.
>
>Dedicated Backend connection is not supported with HTTP/2.

## [Backend Settings](#tab/backendsettings)

### Port

This setting specifies the port where the backend servers listen to traffic from the application gateway. You can configure ports ranging from 1 to 65535.

### Timeout

This setting is the number of seconds that the application gateway waits before closing the frontend and backend connections in case there's no transmission of any data. Acceptable values are from 1 second to 86400 seconds (24 hours).

### Trusted root certificate 

When selecting the TLS protocol in the backend settings, the application gateway resource utilizes its default Trusted Root CA certificate store to verify the chain and authenticity of the certificate provided by the backend server.

By default, the Application Gateway resource includes popular CA certificates, allowing seamless backend TLS connections when the backend server certificate is issued by a Public CA. However, if you intend to use a Private CA or a self-generated certificate, you must provide the corresponding Root CA certificate (.cer) in this Backend Settings configuration.

### SNI (Server Name Indication)
This configuration is applicable only to a backend setting with the TLS protocol. The SNI value provided here is transmitted to the backend server during the TLS handshake. The backend server must present the appropriate certificate.

### Use custom probe

This setting associates a [custom probe](application-gateway-probe-overview.md#custom-health-probe) with a Backend setting. You can associate only one custom probe with a backend setting. If you don't explicitly associate a custom probe, the [default probe](application-gateway-probe-overview.md#default-health-probe-settings) is used to monitor the health of the backend.

> [!NOTE]
> The custom probe doesn't monitor the health of the backend pool unless it is linked to a Backend Setting that is associated with a Rule.

---

## Next steps

- [Learn about the backend pool](configuration-overview.md#backend-pool)
