---
title: Azure Front Door Service - Frequently Asked Questions for Front Door | Microsoft Docs
description: This page provides answers to frequently asked questions about Azure Front Door Service
services: frontdoor
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/08/2019
ms.author: sharadag
---

# Frequently asked questions for Azure Front Door Service

This article answers common questions about Azure Front Door Service features and functionality. If you don't see the answer to your question, you can contact us through the following channels (in escalating order):

1. The comments section of this article.
2. [Azure Front Door Service UserVoice](https://feedback.azure.com/forums/217313-networking?category_id=345025).
3. **Microsoft Support:** To create a new support request, in the Azure portal, on the **Help** tab, select the **Help + support** button, and then select **New support request**.

## General

### What is Azure Front Door Service?

Azure Front Door Service is an Application Delivery Network (ADN) as a service, offering various layer 7 load-balancing capabilities for your applications. It provides dynamic site acceleration (DSA) along with global load balancing with near real-time failover. It is a highly available and scalable service, which is fully managed by Azure.

### What features does Azure Front Door Service support?

Azure Front Door Service supports dynamic site acceleration (DSA), SSL offloading and end to end SSL, Web Application Firewall, cookie-based session affinity, url path-based routing, free certificates and multiple domain management, and others. For a full list of supported features, see [Overview of Azure Front Door Service](front-door-overview.md).

### What is the difference between Azure Front Door Service and Azure Application Gateway?

While both Front Door and Application Gateway are layer 7 (HTTP/HTTPS) load balancers, the primary difference is that Front Door is a global service whereas Application Gateway is a regional service. While Front Door can load balance between your different scale units/clusters/stamp units across regions, Application Gateway allows you to load balance between your VMs/containers etc. that is within the scale unit.

### When should we deploy an Application Gateway behind Front Door?

The key scenarios why one should use Application Gateway behind Front Door are:

- Front Door can perform path-based load balancing only at the global level but if one wants to load balance traffic even further within their virtual network (VNET) then they should use Application Gateway.
- Since Front Door doesn't work at a VM/container level, so it cannot do Connection Draining. However, Application Gateway allows you to do Connection Draining. 
- With an Application Gateway behind AFD, one can achieve 100% SSL offload and route only HTTP requests within their virtual network (VNET).
- Front Door and Application Gateway both support session affinity. While Front Door can direct subsequent traffic from a user session to the same cluster or backend in a given region, Application Gateway can direct affinitize the traffic to the same server within the cluster.  

### Can we deploy Azure Load Balancer behind Front Door?

Azure Front Door Service needs a public VIP or a publicly available DNS name to route the traffic to. Deploying an Azure Load Balancer behind Front Door is a common use case.

### What protocols does Azure Front Door Service support?

Azure Front Door Service supports HTTP, HTTPS and HTTP/2.

### How does Azure Front Door Service support HTTP/2?

HTTP/2 protocol support is available to clients connecting to Azure Front Door Service only. The communication to backends in the backend pool is over HTTP/1.1. HTTP/2 support is enabled by default.

### What resources are supported today as part of backend pool?

Backend pools can be composed of Storage, Web App, Kubernetes instances, or any other custom hostname that has public connectivity. Azure Front Door Service requires that the backends are defined either via a public IP or a publicly resolvable DNS hostname. Members of backend pools can be across zones, regions, or even outside of Azure as long as they have public connectivity.

### What regions is the service available in?

Azure Front Door Service is a global service and is not tied to any specific Azure region. The only location you need to specify while creating a Front Door is the resource group location, which is basically specifying where the metadata for the resource group will be stored. Front Door resource itself is created as a global resource and the configuration is deployed globally to all the POPs (Point of Presence). 

### What are the POP locations for Azure Front Door Service?

Azure Front Door Service has the same list of POP (Point of Presence) locations as Azure CDN from Microsoft. For the complete list of our POPs, kindly refer [Azure CDN POP locations from Microsoft](https://docs.microsoft.com/azure/cdn/cdn-pop-locations).

### Is Azure Front Door Service a dedicated deployment for my application or is it shared across customers?

Azure Front Door Service is a globally distributed multi-tenant service. So, the infrastructure for Front Door is shared across all its customers. However, by creating a Front Door profile, you define the specific configuration required for your application and no changes made to your Front Door impact other Front Door configurations.

### Is HTTP->HTTPS redirection supported?

Yes. In fact, Azure Front Door Service supports host, path, and query string redirection as well as part of URL redirection. Learn more about [URL redirection](front-door-url-redirect.md). 

### In what order are routing rules processed?

Routes for your Front Door are not ordered and a specific route is selected based on the best match. Learn more about [How Front Door matches requests to a routing rule](front-door-route-matching.md).

### How do I lock down the access to my backend to only Azure Front Door?

To lock down your application to accept traffic only from your specific Front Door, you will need to set up IP ACLs for your backend and then restrict the set of accepted values for the header 'X-Forwarded-Host' sent by Azure Front Door. These steps are detailed out as below:

- Configure IP ACLing for your backends to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only. We are working towards integrating with [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) but for now you can refer the IP ranges as below:
 
    - Front Door's **IPv4** backend IP space: `147.243.0.0/16`
    - Front Door's **IPv6** backend IP space: `2a01:111:2050::/44`
    - Azure's [basic infrastructure services](https://docs.microsoft.com/azure/virtual-network/security-overview#azure-platform-considerations) through virtualized host IP addresses: `168.63.129.16` and `169.254.169.254`

    > [!WARNING]
    > Front Door's backend IP space may change later, however, we will ensure that before that happens, that we would have integrated with [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). We recommend that you subscribe to [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for any changes or updates.

-	Filter on the values for the incoming header '**X-Forwarded-Host**' sent by Front Door. The only allowed values for the header should be all of the frontend hosts as defined in your Front Door config. In fact even more specifically, only the host names for which you want to accept traffic from, on this particular backend of yours.
    - Example – let’s say your Front Door config has the following frontend hosts _`contoso.azurefd.net`_ (A), _`www.contoso.com`_ (B), _ (C), and _`notifications.contoso.com`_ (D). Let’s assume that you have two backends X and Y. 
    - Backend X should only take traffic from host names A and B. Backend Y can take traffic from A, C, and D.
    - So, on Backend X you should only accept traffic that has the header '**X-Forwarded-Host**' set to either _`contoso.azurefd.net`_ or _`www.contoso.com`_. For everything else, backend X should reject the traffic.
    - Similarly, on Backend Y you should only accept traffic that has the header “**X-Forwarded-Host**” set to either _`contoso.azurefd.net`_, _`api.contoso.com`_ or _`notifications.contoso.com`_. For everything else, backend Y should reject the traffic.

### Can the anycast IP change over the lifetime of my Front Door?

The frontend anycast IP for your Front Door should typically not change and may remain static for the lifetime of the Front Door. However, there are **no guarantees** for the same. Kindly do not take any direct dependencies on the IP.

### Does Azure Front Door Service support static or dedicated IPs?

No, Azure Front Door Service currently doesn't support static or dedicated frontend anycast IPs. 

### Does Azure Front Door Service support x-forwarded-for headers?

Yes, Azure Front Door Service supports the X-Forwarded-For, X-Forwarded-Host, and X-Forwarded-Proto headers. For X-Forwarded-For if the header was already present then Front Door appends the client socket IP to it. Else, it adds the header with the client socket IP as the value. For X-Forwarded-Host and X-Forwarded-Proto, the value is overridden.

Learn more about the [Front Door supported HTTP headers](front-door-http-headers-protocol.md).  

### How long does it take to deploy an Azure Front Door Service? Does my Front Door still work when being updated?

A new Front Door creation or any updates to an existing Front Door takes about 3 to 5 minutes for global deployment. That means in about 3 to 5 minutes, your Front Door configuration will be deployed across all of our POPs globally.

Note - Custom SSL certificate updates take about 30 minutes to be deployed globally.

## Configuration

### Can Azure Front Door load balance or route traffic within a virtual network?

Azure Front Door (AFD) requires a public IP or publicly resolvable DNS name to route traffic. So, the answer is no AFD directly cannot route within a virtual network, but using an Application Gateway or Azure Load Balancer in between will solve this scenario.

### What are the various timeouts and limits for Azure Front Door Service?

Learn about all the documented [timeouts and limits for Azure Front Door Service](https://docs.microsoft.com/azure/azure-subscription-service-limits#azure-front-door-service-limits).

## Performance

### How does Azure Front Door Service support high availability and scalability?

Azure Front Door Service is a globally distributed multi-tenant platform with huge volumes of capacity to cater to your application's scalability needs. Delivered from the edge of Microsoft's global network, Front Door provides global load-balancing capability that allows you to fail over your entire application or even individual microservices across regions or different clouds.

## SSL configuration

### What TLS versions are supported by Azure Front Door Service?

Front Door supports TLS versions 1.0, 1.1 and 1.2. TLS 1.3 is not yet supported.

### What certificates are supported on Azure Front Door Service?

To enable the HTTPS protocol for securely delivering content on a Front Door custom domain, you can choose to use a certificate that is managed by Azure Front Door Service or use your own certificate.
The Front Door managed option provisions a standard SSL certificate via Digicert and  stored in Front Door's Key Vault. If you choose to use your own certificate, then you can onboard a certificate from a supported CA and can be a standard SSL, extended validation certificate, or even a wildcard certificate. Self-signed certificates are not supported. Learn [how to enable HTTPS for a custom domain](https://aka.ms/FrontDoorCustomDomainHTTPS).

### Does Front Door support autorotation of certificates?

For the Front Door managed certificate option, the certificates are autorotated by Front Door. If you are using a Front Door managed certificate and see that the certificate expiry date is less than 60 days away, file a support ticket.
</br>For your own custom SSL certificate, autorotation isn't supported. Similar to how it was set up the first time for a given custom domain, you will need to point Front Door to the right certificate version in your Key Vault and ensure that the service principal for Front Door still has access to the Key Vault. This updated certificate rollout operation by Front Door is atomic and doesn't cause any production impact provided the subject name or SAN for the certificate doesn't change.

### What are the current cipher suites supported by Azure Front Door Service?

The following are the current cipher suites supported by Azure Front Door Service:

- TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
- TLS_RSA_WITH_AES_256_GCM_SHA384
- TLS_RSA_WITH_AES_128_GCM_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA256
- TLS_RSA_WITH_AES_128_CBC_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA
- TLS_RSA_WITH_AES_128_CBC_SHA

### Does Azure Front Door Service also support re-encryption of traffic to the backend?

Yes, Azure Front Door Service supports SSL offload, and end to end SSL, which re-encrypts the traffic to the backend. In fact, since the connections to the backend happen over it's public IP, it is recommended that you configure your Front Door to use HTTPS as the forwarding protocol.

### Can I configure SSL policy to control SSL Protocol versions?

No, currently Front Door doesn't support to deny specific TLS versions nor can you set the minimum TLS version. 

### Can I configure Front Door to only support specific cipher suites?

No, configuring Front Door for specific cipher suites is not supported. 

## Diagnostics and logging

### What types of metrics and logs are available with Azure Front Door Service?

For information on logs and other diagnostic capabilities, see [Monitoring metrics and logs for Front Door](front-door-diagnostics.md).

### What is the retention policy on the diagnostics logs?

Diagnostic logs flow to the customers storage account and customers can set the retention policy based on their preference. Diagnostic logs can also be sent to an Event Hub or Azure Monitor logs. For more information, see [Azure Front Door Service Diagnostics](front-door-diagnostics.md).

### How do I get audit logs for Azure Front Door Service?

Audit logs are available for Azure Front Door Service. In the portal, click **Activity Log** in the menu blade of your Front Door to access the audit log. 

### Can I set alerts with Azure Front Door Service?

Yes, Azure Front Door Service does support alerts. Alerts are configured on metrics. 

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).