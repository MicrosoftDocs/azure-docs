---
title: Azure Application Gateway listener configuration
description: Learn how Application Gateway listeners handle incoming web requests efficiently. Configure protocols, certificates, HTTP2 support, and WebSocket connectivity for optimal performance.
#customer intent: As a network administrator, I want to understand how to configure Application Gateway listeners so that I can properly handle incoming web requests for my organization's applications.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 08/18/2026
ms.author: mbender
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:06/16/2025
# Customer intent: As a network administrator, I want to configure listeners for the Azure Application Gateway, so that I can manage incoming requests effectively based on protocols, ports, and host headers for optimal traffic routing.
---

# Application Gateway listener configuration

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

A listener is a logical entity that checks for incoming connection requests by using the port, protocol, host, and IP address. When you configure the listener, you must enter values for these settings that match the corresponding values in the incoming request on the gateway.

When you create an application gateway by using the Azure portal, you also create a default listener by choosing the protocol and port for the listener. You can choose whether to enable HTTP2 support on the listener. After you create the application gateway, you can edit the settings of that default listener (*appGatewayHttpListener*) or create new listeners.

## Listener type

When you create a new listener, you choose between [*basic* and *multi-site*](./application-gateway-components.md#types-of-listeners). The choice depends on whether routing depends on the host name in the incoming request.

| Routing depends on the host name | Listener type | Behavior |
| --- | --- | --- |
| No | Basic | Accept and forward all requests for any domain to backend pools. Learn [how to create an application gateway with a basic listener](./quick-create-portal.md). |
| Yes | Multi-site | Forward requests to different backend pools based on the *host* header or host names. Application Gateway relies on HTTP 1.1 host headers to host more than one website on the same public IP address and port. To differentiate requests on the same port, you must specify a host name that matches the incoming request. |

To learn more about multi-site listeners, see [hosting multiple sites using Application Gateway](multiple-site-overview.md).

### Order of processing listeners

For the v1 SKU, requests are matched according to the order of the rules and the type of listener. If a rule with a basic listener comes first in the order, it processes first and accepts any request for that port and IP combination. To avoid this behavior, configure the rules with multi-site listeners first and push the rule with the basic listener to the last in the list.

For the v2 SKU, rule priority defines the order in which listeners are processed. Define wildcard and basic listeners with a priority number greater than site-specific and multi-site listeners. This configuration ensures site-specific and multi-site listeners execute before the wildcard and basic listeners.

The following table summarizes how processing order is determined in each SKU.

| SKU | What determines the order | Recommended configuration |
| --- | --- | --- |
| v1 | The order of the rules and the type of listener. A rule with a basic listener that comes first in the order processes first and accepts any request for that port and IP combination. | Configure the rules with multi-site listeners first, and push the rule with the basic listener to the last position in the list. |
| v2 | Rule priority. | Define wildcard and basic listeners with a priority number greater than the number used for site-specific and multi-site listeners, so that the site-specific and multi-site listeners execute first. |

## Frontend IP address

Choose the frontend IP address that you plan to associate with this listener. The listener listens to incoming requests on this IP.

Choose a public frontend IP address when clients reach the application behind this listener over the internet. Choose a private frontend IP address for an internal endpoint that isn't exposed to the internet, such as an internal line-of-business application or a tier of a multitier application that still requires load distribution, session stickiness, or TLS termination. For the supported combinations, see [Frontend IP address configuration](configuration-frontend-ip.md).

  > [!NOTE]
  > Application Gateway frontend supports dual-stack IP addresses. You can create up to four frontend IP addresses: two IPv4 addresses (public and private) and two IPv6 addresses (public and private).


## Frontend port

Associate a frontend port. You can select an existing port or create a new one. Choose any value from the [allowed range of ports](./application-gateway-components.md#ports). You can use not only well-known ports, such as 80 and 443, but any allowed custom port that's suitable. The same port can be used for public and private listeners. 

Port 80 is the typical choice for an HTTP listener, and port 443 is the typical choice for an HTTPS listener. Use a custom port when your application requires one, and confirm that the value falls within the allowed range for your SKU, because the supported range differs between the v1 and v2 SKUs.

>[!NOTE] 
> When using private and public listeners with the same port number, your application gateway changes the "destination" of the inbound flow to the frontend IPs of your gateway. Hence, depending on your Network Security Group's configuration, you may need an inbound rule with **Destination IP addresses** as your application gateway's public and private frontend IPs.
> 
> **Inbound Rule**:
> - Source: (as per your requirement)
> - Destination IP addresses: Public and Private frontend IPs of your application gateway.
> - Destination Port: (as per listener configuration)
> - Protocol: TCP
> 
> **Outbound Rule**: (no specific requirement)

## Protocol

Choose HTTP or HTTPS. Choose HTTPS when traffic between the client and the application gateway must be encrypted, which also lets the gateway offload the encryption and decryption work so that your backend servers aren't burdened by TLS computation overhead. Choose HTTP when that encryption isn't required for the traffic that this listener accepts.

- If you choose HTTP, the traffic between the client and the application gateway is unencrypted.

- Choose HTTPS if you want [TLS termination](features.md#secure-sockets-layer-ssltls-termination) or [end-to-end TLS encryption](./ssl-overview.md). The traffic between the client and the application gateway is encrypted and the TLS connection will be terminated at the application gateway. If you want end-to-end TLS encryption to the backend target, you must choose HTTPS within **backend HTTP setting** as well. This ensures that traffic is encrypted when application gateway initiates a connection to the backend target.

To configure TLS termination, a TLS/SSL certificate must be added to the listener. This allows the Application Gateway to decrypt incoming traffic and encrypt response traffic to the client. The certificate provided to the Application Gateway must be in Personal Information Exchange (PFX) format, which contains both the private and public keys.

> [!NOTE]
> When using a TLS certificate from Key Vault for a listener, you must ensure your Application Gateway always has access to that linked key vault resource and the certificate object within it. This enables seamless operations of TLS termination feature and maintains the overall health of your gateway resource. If an application gateway resource detects a misconfigured key vault, it automatically puts the associated HTTPS listener(s) in a disabled state. [Learn more](../application-gateway/disabled-listeners.md).

## Supported certificates

See [Overview of TLS termination and end to end TLS with Application Gateway](ssl-overview.md#certificates-supported-for-tls-termination).

## Additional protocol support

### HTTP/2 support

Application Gateway supports the HTTP/2 protocol for clients that connect to application gateway listeners. Communication to backend server pools always uses HTTP/1.1. By default, HTTP/2 support is disabled. The following Azure PowerShell code snippet shows how to enable this support:

```azurepowershell
$gw = Get-AzApplicationGateway -Name test -ResourceGroupName hm

$gw.EnableHttp2 = $true

Set-AzApplicationGateway -ApplicationGateway $gw
```

> [!IMPORTANT]
> When you create an application gateway resource through the Azure portal, the default option for **HTTP2** is enabled. You can choose **Disabled** during creation, and re-enable HTTP/2 support by selecting **Enabled** under **HTTP2** in **Application gateway > Configuration** in the Azure portal.
>
> In instances where a client doesn't support HTTP/2, the connection uses HTTP/1.1. Enabling HTTP/2 doesn't disable HTTP/1.1; it allows support for both.

> [!NOTE]
> Application Gateway only supports HTTP/2 over TLS (HTTPS listeners). Application Gateway doesn't support HTTP/2 Cleartext (h2c) protocol upgrade attempts from HTTP/1.1 and returns a 403 Forbidden error. Clients that attempt h2c upgrades should use native HTTP/2 connections over HTTPS or remain on HTTP/1.1.

### HTTP/3 (QUIC) support

> [!INCLUDE [preview-http3](../networking/includes/azure-application-gateway/preview-http3.md)]

Application Gateway supports HTTP/3 only for client connections that use Basic listeners. An HTTP/3-enabled listener can also accept HTTP/1.1 or HTTP/2 traffic from clients. Communication from Application Gateway to backend server pools continues to use HTTP/1.1.

HTTP/3 support is disabled by default.

## How HTTP/3 support is advertised

Application Gateway advertises HTTP/3 support by using the Alt-Svc HTTP response header.
When you enable HTTP/3 on a listener, Application Gateway includes the following Alt-Svc header in responses.

```
Alt-Svc: h3=":<listener-port>"; ma=86400
```
When you disable HTTP/3, Application Gateway doesn't include the Alt-Svc header.

Clients that support HTTP/3 can use the advertised service to establish a QUIC connection on the listener port. Clients that don't support HTTP/3 continue to use HTTP/2 or HTTP/1.1 over TCP.

:::image type="content" source="media/configuration-listeners/alt-svc.png" alt-text="Screenshot of how Application Gateway advertises HTTP/3 support." lightbox="media/configuration-listeners/alt-svc.png":::

### WebSocket support

WebSocket support is enabled by default. There's no user-configurable setting to enable or disable it. You can use WebSockets with both HTTP and HTTPS listeners.

## Custom error pages

You can define custom error pages for different response codes that Application Gateway returns. You can configure error pages for the response codes 400, 403, 405, 408, 500, 502, 503, and 504. Use global-level or listener-specific error page configuration to set them granularly for each listener. For more information, see [Create Application Gateway custom error pages](./custom-error.md).

> [!NOTE]
> Application Gateway passes along an error from the backend server to the client without modifying it.

## TLS policy

You can centralize TLS/SSL certificate management and reduce encryption-decryption overhead for a backend server farm. Centralized TLS handling also lets you specify a central TLS policy that suits your security requirements. You can choose a *predefined* or *custom* TLS policy.

You configure the TLS policy to control TLS protocol versions. You can configure an application gateway to use a minimum protocol version for TLS handshakes from TLS 1.0, TLS 1.1, TLS 1.2, and TLS 1.3. By default, SSL 2.0 and 3.0 are disabled and aren't configurable. For more information, see [Application Gateway TLS policy overview](./application-gateway-ssl-policy-overview.md).

After you create a listener, you associate it with a request-routing rule. That rule determines how requests that the listener receives are routed to the back end.

## Next steps

- [Learn about request routing rules](configuration-request-routing-rules.md).
