---
title: Azure Front Door - Frequently Asked Questions
description: This page provides answers to frequently asked questions about Azure Front Door
services: frontdoor
documentationcenter: ''
author: sohamnchatterjee
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/13/2020
ms.author: sohamnc
---

# Frequently asked questions for Azure Front Door

This article answers common questions about Azure Front Door features and functionality. If you don't see the answer to your question, you can contact us through the following channels (in escalating order):

1. The comments section of this article.
2. [Azure Front Door UserVoice](https://feedback.azure.com/forums/217313-networking?category_id=345025).
3. **Microsoft Support:** To create a new support request, in the Azure portal, on the **Help** tab, select the **Help + support** button, and then select **New support request**.

## General

### What is Azure Front Door?

Azure Front Door is an Application Delivery Network (ADN) as a service, offering various layer 7 load-balancing capabilities for your applications. It provides dynamic site acceleration (DSA) along with global load balancing with near real-time failover. It is a highly available and scalable service, which is fully managed by Azure.

### What features does Azure Front Door support?

Azure Front Door supports dynamic site acceleration (DSA), TLS/SSL offloading and end to end TLS, Web Application Firewall, cookie-based session affinity, url path-based routing, free certificates and multiple domain management, and others. For a full list of supported features, see [Overview of Azure Front Door](front-door-overview.md).

### What is the difference between Azure Front Door and Azure Application Gateway?

While both Front Door and Application Gateway are layer 7 (HTTP/HTTPS) load balancers, the primary difference is that Front Door is a global service whereas Application Gateway is a regional service. While Front Door can load balance between your different scale units/clusters/stamp units across regions, Application Gateway allows you to load balance between your VMs/containers etc. that is within the scale unit.

### When should we deploy an Application Gateway behind Front Door?

The key scenarios why one should use Application Gateway behind Front Door are:

- Front Door can perform path-based load balancing only at the global level but if one wants to load balance traffic even further within their virtual network (VNET) then they should use Application Gateway.
- Since Front Door doesn't work at a VM/container level, so it cannot do Connection Draining. However, Application Gateway allows you to do Connection Draining. 
- With an Application Gateway behind Front Door, one can achieve 100% TLS/SSL offload and route only HTTP requests within their virtual network (VNET).
- Front Door and Application Gateway both support session affinity. While Front Door can direct subsequent traffic from a user session to the same cluster or backend in a given region, Application Gateway can direct affinitize the traffic to the same server within the cluster.  

### Can we deploy Azure Load Balancer behind Front Door?

Azure Front Door needs a public VIP or a publicly available DNS name to route the traffic to. Deploying an Azure Load Balancer behind Front Door is a common use case.

### What protocols does Azure Front Door support?

Azure Front Door supports HTTP, HTTPS and HTTP/2.

### How does Azure Front Door support HTTP/2?

HTTP/2 protocol support is available to clients connecting to Azure Front Door only. The communication to backends in the backend pool is over HTTP/1.1. HTTP/2 support is enabled by default.

### What resources are supported today as part of backend pool?

Backend pools can be composed of Storage, Web App, Kubernetes instances, or any other custom hostname that has public connectivity. Azure Front Door requires that the backends are defined either via a public IP or a publicly resolvable DNS hostname. Members of backend pools can be across zones, regions, or even outside of Azure as long as they have public connectivity.

### What regions is the service available in?

Azure Front Door is a global service and is not tied to any specific Azure region. The only location you need to specify while creating a Front Door is the resource group location, which is basically specifying where the metadata for the resource group will be stored. Front Door resource itself is created as a global resource and the configuration is deployed globally to all the POPs (Point of Presence). 

### What are the POP locations for Azure Front Door?

Azure Front Door has the same list of POP (Point of Presence) locations as Azure CDN from Microsoft. For the complete list of our POPs, kindly refer [Azure CDN POP locations from Microsoft](https://docs.microsoft.com/azure/cdn/cdn-pop-locations).

### Is Azure Front Door a dedicated deployment for my application or is it shared across customers?

Azure Front Door is a globally distributed multi-tenant service. So, the infrastructure for Front Door is shared across all its customers. However, by creating a Front Door profile, you define the specific configuration required for your application and no changes made to your Front Door impact other Front Door configurations.

### Is HTTP->HTTPS redirection supported?

Yes. In fact, Azure Front Door supports host, path, and query string redirection as well as part of URL redirection. Learn more about [URL redirection](front-door-url-redirect.md). 

### In what order are routing rules processed?

Routes for your Front Door are not ordered and a specific route is selected based on the best match. Learn more about [How Front Door matches requests to a routing rule](front-door-route-matching.md).

### How do I lock down the access to my backend to only Azure Front Door?

To lock down your application to accept traffic only from your specific Front Door, you will need to set up IP ACLs for your backend and then restrict the traffic on your backend to the specific value of the header 'X-Azure-FDID' sent by Front Door. These steps are detailed out as below:

- Configure IP ACLing for your backends to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only. Refer the IP details below for ACLing your backend:
 
    - Refer *AzureFrontDoor.Backend* section in [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for Front Door's IPv4 backend IP address range or you can also use the service tag *AzureFrontDoor.Backend* in your [network security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#security-rules).
    - Front Door's **IPv6** backend IP space while covered in the service tag, is not listed in the Azure IP ranges JSON file. If you are looking for explicit IPv6 address range, it is currently limited to `2a01:111:2050::/44`
    - Azure's [basic infrastructure services](https://docs.microsoft.com/azure/virtual-network/security-overview#azure-platform-considerations) through virtualized host IP addresses: `168.63.129.16` and `169.254.169.254`

    > [!WARNING]
    > Front Door's backend IP space may change later, however, we will ensure that before that happens, that we would have integrated with [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). We recommend that you subscribe to [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for any changes or updates.

-    Perform a GET operation on your Front Door with the API version `2020-01-01` or higher. In the API call, look for `frontdoorID` field. Filter on the incoming header '**X-Azure-FDID**' sent by Front Door to your backend with the value as that of the field `frontdoorID`. 

### Can the anycast IP change over the lifetime of my Front Door?

The frontend anycast IP for your Front Door should typically not change and may remain static for the lifetime of the Front Door. However, there are **no guarantees** for the same. Kindly do not take any direct dependencies on the IP.

### Does Azure Front Door support static or dedicated IPs?

No, Azure Front Door currently doesn't support static or dedicated frontend anycast IPs. 

### Does Azure Front Door support x-forwarded-for headers?

Yes, Azure Front Door supports the X-Forwarded-For, X-Forwarded-Host, and X-Forwarded-Proto headers. For X-Forwarded-For if the header was already present then Front Door appends the client socket IP to it. Else, it adds the header with the client socket IP as the value. For X-Forwarded-Host and X-Forwarded-Proto, the value is overridden.

Learn more about the [Front Door supported HTTP headers](front-door-http-headers-protocol.md).  

### How long does it take to deploy an Azure Front Door? Does my Front Door still work when being updated?

A new Front Door creation or any updates to an existing Front Door takes about 3 to 5 minutes for global deployment. That means in about 3 to 5 minutes, your Front Door configuration will be deployed across all of our POPs globally.

Note - Custom TLS/SSL certificate updates take about 30 minutes to be deployed globally.

Any updates to routes or backend pools etc. are seamless and will cause zero downtime (if the new configuration is correct). Certificate updates are also atomic and will not cause any outage, unless switching from 'AFD Managed' to 'Use your own cert' or vice versa.


## Configuration

### Can Azure Front Door load balance or route traffic within a virtual network?

Azure Front Door (AFD) requires a public IP or publicly resolvable DNS name to route traffic. So, the answer is no AFD directly cannot route within a virtual network, but using an Application Gateway or Azure Load Balancer in between will solve this scenario.

### What are the various timeouts and limits for Azure Front Door?

Learn about all the documented [timeouts and limits for Azure Front Door](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-service-limits).

## Performance

### How does Azure Front Door support high availability and scalability?

Azure Front Door is a globally distributed multi-tenant platform with huge volumes of capacity to cater to your application's scalability needs. Delivered from the edge of Microsoft's global network, Front Door provides global load-balancing capability that allows you to fail over your entire application or even individual microservices across regions or different clouds.

## TLS configuration

### What TLS versions are supported by Azure Front Door?

All Front Door profiles created after September 2019 use TLS 1.2 as the default minimum.

Front Door supports TLS versions 1.0, 1.1 and 1.2. TLS 1.3 is not yet supported.

### What certificates are supported on Azure Front Door?

To enable the HTTPS protocol for securely delivering content on a Front Door custom domain, you can choose to use a certificate that is managed by Azure Front Door or use your own certificate.
The Front Door managed option provisions a standard TLS/SSL certificate via Digicert and  stored in Front Door's Key Vault. If you choose to use your own certificate, then you can onboard a certificate from a supported CA and can be a standard TLS, extended validation certificate, or even a wildcard certificate. Self-signed certificates are not supported. Learn [how to enable HTTPS for a custom domain](https://aka.ms/FrontDoorCustomDomainHTTPS).

### Does Front Door support autorotation of certificates?

For the Front Door managed certificate option, the certificates are autorotated by Front Door. If you are using a Front Door managed certificate and see that the certificate expiry date is less than 60 days away, file a support ticket.
</br>For your own custom TLS/SSL certificate, autorotation isn't supported. Similar to how it was set up the first time for a given custom domain, you will need to point Front Door to the right certificate version in your Key Vault and ensure that the service principal for Front Door still has access to the Key Vault. This updated certificate rollout operation by Front Door is atomic and doesn't cause any production impact provided the subject name or SAN for the certificate doesn't change.

### What are the current cipher suites supported by Azure Front Door?

For TLS1.2 the following cipher suites are supported

TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
TLS_DHE_RSA_WITH_AES_128_GCM_SHA256

When using custom domains with TLS1.0/1.1 enabled the following cipher suites are supported:

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
- TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_DHE_RSA_WITH_AES_256_GCM_SHA384

### Can I configure TLS policy to control TLS Protocol versions?

You can configure a minimum TLS version in Azure Front Door in the custom domain HTTPS settings via Azure portal or the [Azure REST API](https://docs.microsoft.com/rest/api/frontdoorservice/frontdoor/frontdoors/createorupdate#minimumtlsversion). Currently, you can choose between 1.0 and 1.2.

### Can I configure Front Door to only support specific cipher suites?

No, configuring Front Door for specific cipher suites is not supported. However, you can get your own custom TLS/SSL certificate from your Certificate Authority (say Verisign, Entrust, or Digicert) and have specific cipher suites marked on the certificate when you have it generated. 

### Does Front Door support OCSP stapling?

Yes, OCSP stapling is supported by default by Front Door and no configuration is required.

### Does Azure Front Door also support re-encryption of traffic to the backend?

Yes, Azure Front Door supports TLS/SSL offload, and end to end TLS, which re-encrypts the traffic to the backend. In fact, since the connections to the backend happen over it's public IP, it is recommended that you configure your Front Door to use HTTPS as the forwarding protocol.

### Does Front Door support self-signed certificates on the backend for HTTPS connection?

No, self-signed certificates are not supported on Front Door and the restriction applies to both:

1. **Backends**: You cannot use self-signed certificates when you are forwarding the traffic as HTTPS or HTTPS health probes or filling the cache for from origin for routing rules with caching enabled.
2. **Frontend**: You cannot use self-signed certificates when using your own custom TLS/SSL certificate for enabling HTTPS on your custom domain.

### Why is HTTPS traffic to my backend failing?

For having successful HTTPS connections to your backend whether for health probes or for forwarding requests, there could be two reasons why HTTPS traffic might fail:

1. **Certificate subject name mismatch**: For HTTPS connections, Front Door expects that your backend presents certificate from a valid CA with subject name(s) matching the backend hostname. As an example, if your backend hostname is set to `myapp-centralus.contosonews.net` and the certificate that your backend presents during the TLS handshake neither has `myapp-centralus.contosonews.net` nor `*myapp-centralus*.contosonews.net` in the subject name, the Front Door will refuse the connection and result in an error. 
    1. **Solution**: While it is not recommended from a compliance standpoint, you can workaround this error by disabling certificate subject name check for your Front Door. This is present under Settings in Azure portal and under BackendPoolsSettings in the API.
2. **Backend hosting certificate from invalid CA**: Only certificates from [valid CAs](/azure/frontdoor/front-door-troubleshoot-allowed-ca) can be used at the backend with Front Door. Certificates from internal CAs or self-signed certificates are not allowed.

## Diagnostics and logging

### What types of metrics and logs are available with Azure Front Door?

For information on logs and other diagnostic capabilities, see [Monitoring metrics and logs for Front Door](front-door-diagnostics.md).

### What is the retention policy on the diagnostics logs?

Diagnostic logs flow to the customers storage account and customers can set the retention policy based on their preference. Diagnostic logs can also be sent to an Event Hub or Azure Monitor logs. For more information, see [Azure Front Door Diagnostics](front-door-diagnostics.md).

### How do I get audit logs for Azure Front Door?

Audit logs are available for Azure Front Door. In the portal, click **Activity Log** in the menu blade of your Front Door to access the audit log. 

### Can I set alerts with Azure Front Door?

Yes, Azure Front Door does support alerts. Alerts are configured on metrics. 

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
