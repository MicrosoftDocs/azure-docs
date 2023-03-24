---
title: Azure Application Gateway features
description: Learn about Azure Application Gateway features
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 03/17/2023
ms.author: greglin
---

# Azure Application Gateway features

[Azure Application Gateway](overview.md) is a web traffic load balancer that enables you to manage traffic to your web applications.

![Application Gateway conceptual](media/overview/figure1-720.png)

Application Gateway includes the following features:


## Secure Sockets Layer (SSL/TLS) termination

Application gateway supports SSL/TLS termination at the gateway, after which traffic typically flows unencrypted to the backend servers. This feature allows web servers to be unburdened from costly encryption and decryption overhead. But sometimes unencrypted communication to the servers isn't an acceptable option. This can be because of security requirements, compliance requirements, or the application may only accept a secure connection. For these applications, application gateway supports end to end SSL/TLS encryption.

For more information, see [Overview of SSL termination and end to end SSL with Application Gateway](ssl-overview.md)

## Autoscaling

Application Gateway Standard_v2 supports autoscaling and can scale up or down based on changing traffic load patterns. Autoscaling also removes the requirement to choose a deployment size or instance count during provisioning. 

For more information about the Application Gateway Standard_v2 features, see [What is Azure Application Gateway v2?](overview-v2.md).

## Zone redundancy

A Standard_v2 Application Gateway  can span multiple Availability Zones, offering better fault resiliency and removing the need to provision separate Application Gateways in each zone.

## Static VIP

The application gateway Standard_v2 SKU supports static VIP type exclusively. This ensures that the VIP associated with application gateway doesn't change even over the lifetime of the Application Gateway.

## Web Application Firewall

Web Application Firewall (WAF) is a service that provides centralized protection of your web applications from common exploits and vulnerabilities. WAF is based on rules from the [OWASP (Open Web Application Security Project) core rule sets](https://owasp.org/www-project-modsecurity-core-rule-set/) 3.1 (WAF_v2 only), 3.0, and 2.2.9. 

Web applications are increasingly targets of malicious attacks that exploit common known vulnerabilities. Common among these exploits are SQL injection attacks, cross site scripting attacks to name a few. Preventing such attacks in application code can be challenging and may require rigorous maintenance, patching and monitoring at many layers of the application topology. A centralized web application firewall helps make security management much simpler and gives better assurance to application administrators against threats or intrusions. A WAF solution can also react to a security threat faster by patching a known vulnerability at a central location versus securing each of individual web applications. Existing application gateways can be converted to a Web Application Firewall enabled application gateway easily.

For more information, see [What is Azure Web Application Firewall?](../web-application-firewall/overview.md).

## Ingress Controller for AKS
Application Gateway Ingress Controller (AGIC) allows you to use Application Gateway as the ingress for an [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) cluster. 

The ingress controller runs as a pod within the AKS cluster and consumes [Kubernetes Ingress Resources](https://kubernetes.io/docs/concepts/services-networking/ingress/) and converts them to an Application Gateway configuration, which allows the gateway to load-balance traffic to the Kubernetes pods. The ingress controller only supports Application Gateway Standard_v2 and WAF_v2 SKUs. 

For more information, see [Application Gateway Ingress Controller (AGIC)](ingress-controller-overview.md).

## URL-based routing

URL Path Based Routing allows you to route traffic to backend server pools based on URL Paths of the request. 
One of the scenarios is to route requests for different content types to different pool.

For example, requests for `http://contoso.com/video/*` are routed to VideoServerPool, and `http://contoso.com/images/*` are routed to ImageServerPool. DefaultServerPool is selected if none of the path patterns match.

For more information, see [URL Path Based Routing overview](url-route-overview.md).

## Multiple-site hosting

With Application Gateway, you can configure routing based on host name or domain name for more than one web application on the same application gateway. It allows you to configure a more efficient topology for your deployments by adding up to 100+ websites to one application gateway. Each website can be directed to its own backend pool. For example, three domains, contoso.com, fabrikam.com, and adatum.com, point to the IP address of the application gateway. You'd create three multi-site listeners and configure each listener for the respective port and protocol setting. 

Requests for `http://contoso.com` are routed to ContosoServerPool, `http://fabrikam.com` are routed to FabrikamServerPool, and so on.

Similarly, two subdomains of the same parent domain can be hosted on the same application gateway deployment. Examples of using subdomains could include `http://blog.contoso.com` and `http://app.contoso.com` hosted on a single application gateway deployment. For more information, see [Application Gateway multiple site hosting](multiple-site-overview.md).

You can also define wildcard host names in a multi-site listener and up to 5 host names per listener. To learn more, see [wildcard host names in listener](multiple-site-overview.md#wildcard-host-names-in-listener).

## Redirection

A common scenario for many web applications is to support automatic HTTP to HTTPS redirection to ensure all communication between an application and its users occurs over an encrypted path.

In the past, you may have used techniques such as dedicated pool creation whose sole purpose is to redirect requests it receives on HTTP to HTTPS. Application gateway supports the ability to redirect traffic on the Application Gateway. This simplifies application configuration, optimizes the resource usage, and supports new redirection scenarios, including global and path-based redirection. Application Gateway redirection support isn't limited to HTTP to HTTPS redirection alone. This is a generic redirection mechanism, so you can redirect from and to any port you define using rules. It also supports redirection to an external site as well.

Application Gateway redirection support offers the following capabilities:

- Global redirection from one port to another port on the Gateway. This enables HTTP to HTTPS redirection on a site.
- Path-based redirection. This type of redirection enables HTTP to HTTPS redirection only on a specific site area, for example a shopping cart area denoted by `/cart/*`.
- Redirect to an external site.

For more information, see [Application Gateway redirect overview](redirect-overview.md).

## Session affinity

The cookie-based session affinity feature is useful when you want to keep a user session on the same server. By using gateway-managed cookies, the Application Gateway can direct subsequent traffic from a user session to the same server for processing. This is important in cases where session state is saved locally on the server for a user session.

For more information, see [How an application gateway works](how-application-gateway-works.md#modifications-to-the-request).

## Websocket and HTTP/2 traffic

Application Gateway provides native support for the WebSocket and HTTP/2 protocols. There's no user-configurable setting to selectively enable or disable WebSocket support.

The WebSocket and HTTP/2 protocols enable full duplex communication between a server and a client over a long running TCP connection. This allows for a more interactive communication between the web server and the client, which can be bidirectional without the need for polling as required in HTTP-based implementations. These protocols have low overhead, unlike HTTP, and can reuse the same TCP connection for multiple request/responses resulting in a more efficient resource utilization. These protocols are designed to work over traditional HTTP ports of 80 and 443.

For more information, see [WebSocket support](application-gateway-websocket.md) and [HTTP/2 support](configuration-listeners.md#http2-support).

## Connection draining

Connection draining helps you achieve graceful removal of backend pool members during planned service updates or problems with backend health. This setting is enabled via the [Backend Setting](configuration-http-settings.md) and is applied to all backend pool members during rule creation. Once enabled, the aplication gateway ensures all deregistering instances of a backend pool don't receive any new requests while allowing existing requests to complete within a configured time limit. It applies to cases where backend instances are
- explicitly removed from the backend pool after a configuration change by a user,
- reported as unhealthy by the health probes, or
- removed during a scale-in operation.

The only exception is when requests continue to be proxied to the deregistering instances because of gateway-managed session affinity.

The connection draining is honored for WebSocket connections as well. For information on time limits, see [Backend Settings configuration](configuration-http-settings.md#connection-draining).

## Custom error pages

Application Gateway allows you to create custom error pages instead of displaying default error pages. You can use your own branding and layout using a custom error page.

For more information, see [Custom Errors](custom-error.md).

## Rewrite HTTP headers and URL

HTTP headers allow the client and server to pass additional information with the request or the response. Rewriting these HTTP headers helps you accomplish several important scenarios, such as:

- Adding security-related header fields like HSTS/ X-XSS-Protection.
- Removing response header fields that can reveal sensitive information.
- Stripping port information from X-Forwarded-For headers.

Application Gateway and WAF v2 SKU supports the capability to add, remove, or update HTTP request and response headers, while the request and response packets move between the client and backend pools. You can also rewrite URLs, query string parameters and host name. With URL rewrite and URL path-based routing, you can choose to either route requests to one of the backend pools based on the original path or the rewritten path, using the re-evaluate path map option. 

It also provides you with the capability to add conditions to ensure the specified headers or URL are rewritten only when certain conditions are met. These conditions are based on the request and response information.

For more information, see [Rewrite HTTP headers and URL](rewrite-http-headers-url.md).

## Sizing

Application Gateway Standard_v2 can be configured for autoscaling or fixed size deployments. The v2 SKU doesn't offer different instance sizes. For more information on v2 performance and pricing, see [Autoscaling V2](application-gateway-autoscaling-zone-redundant.md) and [Understanding pricing](understanding-pricing.md).

The Application Gateway Standard (v1) is offered in three sizes: **Small**, **Medium**, and **Large**. Small instance sizes are intended for development and testing scenarios.

For a complete list of application gateway limits, see [Application Gateway service limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fapplication-gateway%2ftoc.json#application-gateway-limits).

The following table shows an average performance throughput for each application gateway v1 instance with SSL offload enabled:

| Average backend page response size | Small | Medium | Large |
| --- | --- | --- | --- |
| 6 KB |7.5 Mbps |13 Mbps |50 Mbps |
| 100 KB |35 Mbps |100 Mbps |200 Mbps |

> [!NOTE]
> These values are approximate values for an application gateway throughput. The actual throughput depends on various environment details, such as average page size, location of backend instances, and processing time to serve a page. For exact performance numbers, you should run your own tests. These values are only provided for capacity planning guidance.

## Version feature comparison

For an Application Gateway v1-v2 feature comparison, see [What is Azure Application Gateway v2?](overview-v2.md#feature-comparison-between-v1-sku-and-v2-sku).

## Next steps

- Learn [how an application gateway works](how-application-gateway-works.md)
- Review [Frequently asked questions about Azure Application Gateway](application-gateway-faq.yml)
