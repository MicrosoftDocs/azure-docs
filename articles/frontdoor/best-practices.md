---
title: Azure Front Door - Best practices
description: This page provides information about how to configure Azure Front Door based on Microsoft's best practices.
services: frontdoor
documentationcenter: ''
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/10/2022
ms.author: jodowns
---

# Best practices for Front Door

## General best practices

### Avoid combining Traffic Manager and Front Door

For most solutions, you should use *either* Azure Front Door *or* [Azure Traffic Manager](TODO).

Traffic Manager is a DNS-based load balancer. It sends traffic directly to your origin's endpoints. In contrast, Front Door terminates connections at points of presence (PoPs) near to the client and establishes separate long-lived connections to the origins. The products work very differently and are intended for different use cases.

If you combine both Front Door and Traffic Manager together, it's unlikely that you'll increase the resiliency or performance of your solution. Also, if you have health probes configured on both services, you might accidentally overload your servers with the volume of health probe traffic.

If you need TLS termination, advanced routing capabilities, or a web application firewall (WAF), consider using Front Door. For simple global load balancing with direct connections from your client to your endpoints, consider using Traffic Manager. For more information about selecting a load balancing option, see [TODO](TODO).

### Use the latest API version and SDK version

When you work with Azure Front Door by using APIs, ARM templates, Bicep, or Azure SDKs, it's important to use the latest available API or SDK version. API and SDK updates occur when new functionality is available, and also contain important security patches and bug fixes.

## TLS best practices

### Use end-to-end TLS

Azure Front Door terminates TCP and TLS connections from clients. It then establishes new connections from each point of presence (PoP) to the origin. It's a good practice to secure each of these connections with TLS, even for origins that are hosted in Azure. This approach ensures that your data is always encrypted during transit.

For more information, see [End-to-end TLS with Azure Front Door](end-to-end-tls.md).

### Use HTTP to HTTPS redirection

It's a good practice for clients to use HTTPS to connect to your service. However, sometimes you need to accept HTTP requests to allow for older clients or clients who might not understand the best practice.

You can configure Front Door to automatically redirect HTTP requests to use the HTTPS protocol. You should enable the *Redirect all traffic to use HTTPS* setting on your route.

### Use managed TLS certificates

By using Front Door to manage your TLS certificates, you reduce your operational costs, and you avoid costly outages caused by forgetting to renew a certificate. Front Door automatically issues and rotates managed TLS certificates.

For more information, see [Configure HTTPS on an Azure Front Door custom domain using the Azure portal](standard-premium/how-to-configure-https-custom-domain.md).

### Use 'Latest' version for customer-managed certificates

If you decide to use your own TLS certificates, then consider setting the Key Vault certificate version to 'Latest'. By using 'Latest', you avoid having to reconfigure Front Door to use new versions of your certificate and waiting for the certificate to be deployed throughout Front Door's environments.

For more information, see [Select the certificate for Azure Front Door to deploy](standard-premium/how-to-configure-https-custom-domain.md#select-the-certificate-for-azure-front-door-to-deploy).

## Domain name best practices

### Use the same domain name on Front Door and your origin

Avoid host header rewrites.

## Web application firewall (WAF)

### Enable the WAF

TODO

### Follow WAF best practices

## Health probe best practices

### Select good health probe endpoints

Point health probes to something that tells you whether the origin is healthy and ready to accept traffic.

### Disable health probes when there’s only one origin

TODO

## Next steps

TODO
