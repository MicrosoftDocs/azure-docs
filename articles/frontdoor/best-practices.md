---
title: Best Practices
titleSuffix: Azure Front Door
description: Learn best practices for configuring and using Azure Front Door, including TLS security, domain management, WAF, health probes, and traffic routing optimization.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 09/25/2025
---

# Best practices for Azure Front Door

This article summarizes best practices for using Azure Front Door.

## General best practices

### Understand when to combine Traffic Manager and Azure Front Door

For most solutions, we recommend the use of *either* Azure Front Door *or* [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md), but not both. Traffic Manager is a DNS-based load balancer. It sends traffic directly to your origin's endpoints. In contrast, Azure Front Door terminates connections at points of presence (PoPs) near to the client and establishes separate long-lived connections to the origins. The products work differently and are intended for different use cases.

If you need content caching and delivery, TLS termination, advanced routing capabilities, or a web application firewall (WAF), consider using Azure Front Door. For simple global load balancing with direct connections from your client to your endpoints, consider using Traffic Manager. For more information about selecting a load balancing option, see [Load-balancing options](/azure/architecture/guide/technology-choices/load-balancing-overview).

As part of a [complex architecture that requires high availability](/azure/architecture/guide/networking/global-web-applications/mission-critical-content-delivery), you can put Traffic Manager in front of Azure Front Door. In the unlikely event that Azure Front Door is unavailable, Traffic Manager can then route traffic to an alternative destination, such as Azure Application Gateway or a partner content delivery network (CDN).

> [!IMPORTANT]
> Don't put Traffic Manager behind Azure Front Door. Traffic Manager should always be in front of Azure Front Door.

### Restrict traffic to your origins

The features of Azure Front Door work best when traffic flows only through Azure Front Door. You should configure your origin to block traffic that isn't sent through Azure Front Door. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md).

### Use the latest API version and SDK version

When you work with Azure Front Door by using APIs, Azure Resource Manager templates, Bicep, or Azure SDKs, it's important to use the latest available API or SDK version. API and SDK updates occur when new functionality is available, and they contain important security patches and bug fixes.

### Configure logs

Azure Front Door tracks extensive performance data for every request. When you enable caching, your origin servers might not receive every request. It's important that you use the Azure Front Door logs to understand how your solution is running and responding to your clients. For more information about the metrics and logs that Azure Front Door records, see [Monitor metrics and logs in Azure Front Door](front-door-diagnostics.md) and [WAF logs](../web-application-firewall/afds/waf-front-door-monitor.md#waf-logs).

To configure logging for your own application, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md).

## TLS best practices

### Use end-to-end TLS

Azure Front Door terminates TCP and TLS connections from clients. It then establishes new connections from each PoP to the origin. It's a good practice to secure each of these connections with TLS, even for origins that are hosted in Azure. This approach keeps your data encrypted during transit.

For more information, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

### Use HTTP-to-HTTPS redirection

It's a good practice for clients to use HTTPS to connect to your service. However, sometimes you need to accept HTTP requests to allow for older clients or clients that might not follow the best practice.

You can configure Azure Front Door to automatically redirect HTTP requests to use the HTTPS protocol. You should enable the **Redirect all traffic to use HTTPS** setting on your route.

### Use managed TLS certificates

When Azure Front Door manages your TLS certificates, it reduces your operational costs and helps you avoid costly outages caused by forgetting to renew a certificate. Azure Front Door automatically issues and rotates the managed TLS certificates.

For more information, see [Configure HTTPS on an Azure Front Door custom domain using the Azure portal](standard-premium/how-to-configure-https-custom-domain.md).

### Use the latest version for customer-managed certificates

If you decide to use your own TLS certificates, consider setting the Azure Key Vault certificate version to **Latest**. By using **Latest**, you avoid having to reconfigure Azure Front Door to use new versions of your certificate and waiting for the certificate to be deployed throughout Azure Front Door environments.

For more information, see [Select the certificate for Azure Front Door to deploy](standard-premium/how-to-configure-https-custom-domain.md#select-the-certificate-for-azure-front-door-to-deploy).

## Domain best practices

### Adopt custom domains

Adopt custom domains for your Azure Front Door endpoints to ensure better availability and flexibility while managing your domains and traffic. Don't hardcode Azure Front Door-provided domains (like `*.azurefd.z01.net`) in your clients, codebases, or firewall. Use custom domains for such scenarios.

### Use the same domain name on Azure Front Door and your origin

Azure Front Door can rewrite the `Host` header of incoming requests. This feature can be helpful when you manage a set of customer-facing custom domain names that route to a single origin. This feature can also help when you want to avoid configuring custom domain names in Azure Front Door and at your origin.

However, when you rewrite the `Host` header, request cookies and URL redirections might break. In particular, when you use platforms like Azure App Service, features like [session affinity](../app-service/configure-common.md#configure-general-settings) and [authentication and authorization](../app-service/overview-authentication-authorization.md) might not work correctly.

Before you rewrite the `Host` header of your requests, carefully consider whether your application will work correctly. For more information, see [Preserve the original HTTP host name between a reverse proxy and its back-end web application](/azure/architecture/best-practices/host-name-preservation).

## WAF best practices

For internet-facing applications, we recommend that you enable the Azure Front Door WAF and configure it to use managed rules. Using a WAF and Microsoft-managed rules helps protect your application from a wide range of attacks. For more information, see [Web Application Firewall (WAF) on Azure Front Door](web-application-firewall.md).

The WAF for Azure Front Door has its own set of best practices for its configuration and use. For more information, see [Best practices for Web Application Firewall in Azure Front Door](../web-application-firewall/afds/waf-front-door-best-practices.md).

## Best practices for health probes

### Disable health probes when there's only one origin in an origin group

Health probes in Azure Front Door can detect situations where an origin is unavailable or unhealthy. You can configure Azure Front Door to send traffic to another origin in the origin group when a health probe detects a problem with an origin.

If you have only a single origin, Azure Front Door always routes traffic to that origin even if its health probe reports an unhealthy status. The status of the health probe doesn't do anything to change the behavior of Azure Front Door. In this scenario, health probes don't provide a benefit and you should disable them to reduce the traffic on your origin.

For more information, see [Health probes](health-probes.md).

### Select good endpoints

Consider the location where you want an Azure Front Door health probe to do its monitoring. It's usually a good idea to monitor a webpage or location that you specifically design for health monitoring. Your application logic can consider the status of all of the critical components required to serve production traffic, including application servers, databases, and caches. That way, if any component fails, Azure Front Door can route your traffic to another instance of your service.

For more information, see [Health Endpoint Monitoring pattern](/azure/architecture/patterns/health-endpoint-monitoring).

### Use HEAD health probes

Health probes can use either the `GET` or `HEAD` HTTP method. It's a good practice to use the `HEAD` method for health probes, because it reduces the amount of traffic load on your origins.

For more information, see [Supported HTTP methods for health probes](health-probes.md#supported-http-methods-for-health-probes).

## Next step

> [!div class="nextstepaction"]
> [Create an Azure Front Door profile](create-front-door-portal.md)
