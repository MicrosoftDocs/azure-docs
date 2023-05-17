---
title: Azure Front Door - Best practices
description: This page provides information about how to configure Azure Front Door based on Microsoft's best practices.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/23/2023
ms.author: jodowns
---

# Best practices for Front Door

This article summarizes best practices for using Azure Front Door.

## General best practices

### Avoid combining Traffic Manager and Front Door

For most solutions, you should use *either* Front Door *or* [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md), but not both. Traffic Manager is a DNS-based load balancer. It sends traffic directly to your origin's endpoints. In contrast, Front Door terminates connections at points of presence (PoPs) near to the client and establishes separate long-lived connections to the origins. The products work differently and are intended for different use cases.

If you need content caching and delivery (CDN), TLS termination, advanced routing capabilities, or a web application firewall (WAF), consider using Front Door. For simple global load balancing with direct connections from your client to your endpoints, consider using Traffic Manager. For more information about selecting a load balancing option, see [Load-balancing options](/azure/architecture/guide/technology-choices/load-balancing-overview).

However, as part of a complex architecture, you might choose to use Traffic Manager in front of Front Door. In the unlikely event that Front Door is unavailable, Traffic Manager can route traffic to an alternative destination, such as Azure Application Gateway or a partner content delivery network (CDN). These architectures are difficult to implement and most customers don't need them.

### Restrict traffic to your origins

Front Door's features work best when traffic only flows through Front Door. You should configure your origin to block traffic that hasn't been sent through Front Door. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md).

### Use the latest API version and SDK version

When you work with Front Door by using APIs, ARM templates, Bicep, or Azure SDKs, it's important to use the latest available API or SDK version. API and SDK updates occur when new functionality is available, and also contain important security patches and bug fixes.

### Configure logs

Front Door tracks extensive telemetry about every request. When you enable caching, your origin servers might not receive every request, so it's important that you use the Front Door logs to understand how your solution is running and responding to your clients. For more information about the metrics and logs that Azure Front Door records, see [Monitor metrics and logs in Azure Front Door](front-door-diagnostics.md) and [WAF logs](../web-application-firewall/afds/waf-front-door-monitor.md#waf-logs).

To configure logging for your own application, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md)

## TLS best practices

### Use end-to-end TLS

Front Door terminates TCP and TLS connections from clients. It then establishes new connections from each point of presence (PoP) to the origin. It's a good practice to secure each of these connections with TLS, even for origins that are hosted in Azure. This approach ensures that your data is always encrypted during transit.

For more information, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

### Use HTTP to HTTPS redirection

It's a good practice for clients to use HTTPS to connect to your service. However, sometimes you need to accept HTTP requests to allow for older clients or clients who might not understand the best practice.

You can configure Front Door to automatically redirect HTTP requests to use the HTTPS protocol. You should enable the *Redirect all traffic to use HTTPS* setting on your route.

### Use managed TLS certificates

When Front Door manages your TLS certificates, it reduces your operational costs, and helps you to avoid costly outages caused by forgetting to renew a certificate. Front Door automatically issues and rotates the managed TLS certificates.

For more information, see [Configure HTTPS on an Azure Front Door custom domain using the Azure portal](standard-premium/how-to-configure-https-custom-domain.md).

### Use 'Latest' version for customer-managed certificates

If you decide to use your own TLS certificates, then consider setting the Key Vault certificate version to 'Latest'. By using 'Latest', you avoid having to reconfigure Front Door to use new versions of your certificate and waiting for the certificate to be deployed throughout Front Door's environments.

For more information, see [Select the certificate for Azure Front Door to deploy](standard-premium/how-to-configure-https-custom-domain.md#select-the-certificate-for-azure-front-door-to-deploy).

## Domain name best practices

### Use the same domain name on Front Door and your origin

Front Door can rewrite the `Host` header of incoming requests. This feature can be helpful when you manage a set of customer-facing custom domain names that route to a single origin. This feature can also help when you want to avoid configuring custom domain names in Front Door and at your origin. However, when you rewrite the `Host` header, request cookies and URL redirections might break. In particular, when you use platforms like Azure App Service, features like [session affinity](../app-service/configure-common.md#configure-general-settings) and [authentication and authorization](../app-service/overview-authentication-authorization.md) might not work correctly.

Before you rewrite the `Host` header of your requests, carefully consider whether your application is going to work correctly.

For more information, see [Preserve the original HTTP host name between a reverse proxy and its back-end web application](/azure/architecture/best-practices/host-name-preservation).

## Web application firewall (WAF)

### Enable the WAF

For internet-facing applications, we recommend you enable the Front Door web application firewall (WAF) and configure it to use managed rules. When you use a WAF and Microsoft-managed rules, your application is protected from a wide range of attacks.

For more information, see [Web Application Firewall (WAF) on Azure Front Door](web-application-firewall.md).

### Follow WAF best practices

The WAF for Front Door has its own set of best practices for its configuration and use. For more information, see [Best practices for Web Application Firewall on Azure Front Door](../web-application-firewall/afds/waf-front-door-best-practices.md).

## Health probe best practices

### Disable health probes when there’s only one origin in an origin group

Front Door's health probes are designed to detect situations where an origin is unavailable or unhealthy. When a health probe detects a problem with an origin, Front Door can be configured to send traffic to another origin in the origin group.

If you only have a single origin, Front Door always routes traffic to that origin even if its health probe reports an unhealthy status. The status of the health probe doesn't do anything to change Front Door's behavior. In this scenario, health probes don't provide a benefit and you should disable them to reduce the traffic on your origin.

For more information, see [Health probes](health-probes.md).

### Select good health probe endpoints

Consider the location where you tell Front Door's health probe to monitor. It's usually a good idea to monitor a webpage or location that you specifically design for health monitoring. Your application logic can consider the status of all of the critical components required to serve production traffic including application servers, databases, and caches. That way, if any component fails, Front Door can route your traffic to another instance of your service.

For more information, see the [Health Endpoint Monitoring pattern](/azure/architecture/patterns/health-endpoint-monitoring)

### Use HEAD health probes

Health probes can use either the GET or HEAD HTTP method. It's a good practice to use the HEAD method for health probes, which reduces the amount of traffic load on your origins.

For more information, see [Supported HTTP methods for health probes](health-probes.md#supported-http-methods-for-health-probes).

## Next steps

Learn how to [create an Front Door profile](create-front-door-portal.md).
