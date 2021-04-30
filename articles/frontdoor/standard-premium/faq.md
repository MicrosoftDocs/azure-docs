---
title: 'Azure Front Door: Frequently asked questions'
description: This page provides answers to frequently asked questions about Azure Front Door Standard/Premium.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: duau
---

# Frequently asked questions for Azure Front Door Standard/Premium (Preview)

This article answers common questions about Azure Front Door features and functionality.

## General

### What is Azure Front Door?

Azure Front Door is a fast, reliable, and secure modern cloud CDN with intelligent threat protection. It provides static and dynamic content acceleration, global load balancing, and enhanced security for your global hyper-scale applications, APIs, websites, and cloud services with intelligent threat protection.

### What features does Azure Front Door support?

Azure Front Door supports:

* Both static content and dynamic application acceleration
* TLS/SSL offloading and end to end TLS
* Web Application Firewall
* Cookie-based session affinity
* Url path-based routing
* Free certificates and multiple domain managements

For a full list of supported features, see [Overview of Azure Front Door](overview.md).

### What is the difference between Azure Front Door and Azure Application Gateway?

While both Front Door and Application Gateway are layer 7 (HTTP/HTTPS) load balancers, the primary difference is that Front Door is a global service. Application Gateway is a regional service. While Front Door can load balance between your different scale units/clusters/stamp units across regions, Application Gateway allows you to load balance between your VMs/containers that is within the scale unit.

### When should we deploy an Application Gateway behind Front Door?

The key scenarios why one should use Application Gateway behind Front Door are:

* Front Door can do path-based load balancing only at the global level but if one wants to load balance traffic even further within their virtual network (VNET) then they should use Application Gateway.
* Since Front Door doesn't work at a VM/container level, so it can't do Connection Draining. However, Application Gateway allows you to do Connection Draining. 
* With an Application Gateway behind Front Door, one can achieve 100% TLS/SSL offload and route only HTTP requests within their virtual network (VNET).
* Front Door and Application Gateway both support session affinity. Front Door can direct ensuing traffic from a user session to the same cluster or backend in a given region. Application Gateway can direct affinitize the traffic to the same server within the cluster.  

### Can we deploy Azure Load Balancer behind Front Door?

Azure Front Door needs a public VIP or a publicly available DNS name to route the traffic to. Deploying an Azure Load Balancer behind Front Door is a common use case.

### What protocols does Azure Front Door support?

Azure Front Door supports HTTP, HTTPS and HTTP/2.

### How does Azure Front Door support HTTP/2?

HTTP/2 protocol support is available to clients connecting to Azure Front Door only. The communication to backends in the backend pool is over HTTP/1.1. HTTP/2 support is enabled by default.

### What resources are supported today as part of origin group?

Origin group can be composed of Storage, Web App, Kubernetes instances, or any other custom hostname that has public connectivity. Azure Front Door requires that the origins are defined either via a public IP or a publicly resolvable DNS hostname. Members of origin group can be across zones, regions, or even outside of Azure as long as they have public connectivity.

### What regions is the service available in?

Azure Front Door is a global service and isn't tied to any specific Azure region. The only location you need to specify while creating a Front Door is for the resource group. That location is basically specifying where the metadata for the resource group will be stored. Front Door resource itself is created as a global resource and the configuration is deployed globally to all the POPs (Point of Presence). 

### What are the POP locations for Azure Front Door?

Azure Front Door has the same list of POP (Point of Presence) locations as Azure CDN from Microsoft. For the complete list of our POPs, kindly refer [Azure CDN POP locations from Microsoft](../../cdn/cdn-pop-locations.md).

### Is Azure Front Door a dedicated deployment for my application or is it shared across customers?

Azure Front Door is a globally distributed multi-tenant service. The infrastructure for Front Door is shared across all its customers. By creating a Front Door profile, you're defining the specific configuration required for your application. Changes made to your Front Door doesn't affect other Front Door configurations.

### Is HTTP->HTTPS redirection supported?

Yes. In fact, Azure Front Door supports host, path, query string redirection, and part of URL redirection. Learn more about [URL redirection](concept-rule-set-url-redirect-and-rewrite.md). 

### How do I lock down the access to my backend to only Azure Front Door?

The best way to lock down your application to accept traffic only from your specific Front Door instance is to publish your application via Private Endpoint. Network traffic between Front Door and the application traverses over the VNet and a Private Link on the Microsoft backbone network, eliminating exposure from the public internet.

Learn more about the [securing origin for Front Door with Private Link](concept-private-link.md).  

Alternative way to lock down your application to accept traffic only from your specific Front Door, you'll need to set up IP ACLs for your backend. Then restrict the traffic of your backend to the specific value of the header 'X-Azure-FDID' sent by Front Door. These steps are detailed out as below:

* Configure IP ACLing for your backends to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only. Refer to the IP details below for ACLing your backend:
 
    * Refer *AzureFrontDoor.Backend* section in [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for Front Door's IPv4 backend IP address range. You can also use the service tag *AzureFrontDoor.Backend* in your [network security groups](../../virtual-network/network-security-groups-overview.md#security-rules).
    * Azure's [basic infrastructure services](../../virtual-network/network-security-groups-overview.md#azure-platform-considerations) through virtualized host IP addresses: `168.63.129.16` and `169.254.169.254`.

    > [!WARNING]
    > Front Door's backend IP space may change later, however, we will ensure that before that happens, that we would have integrated with [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). We recommend that you subscribe to [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for any changes or updates.

* Do a GET operation on your Front Door with the API version `2020-01-01` or higher. In the API call, look for `frontdoorID` field. Filter on the incoming header '**X-Azure-FDID**' sent by Front Door to your backend with the value of the field `frontdoorID`. You can also find `Front Door ID` value under the Overview section from Front Door portal page. 

* Apply rule filtering in your backend web server to restrict traffic based on the resulting 'X-Azure-FDID' header value.

  Here's an example for [Microsoft Internet Information Services (IIS)](https://www.iis.net/):

    ``` xml
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Filter_X-Azure-FDID" patternSyntax="Wildcard" stopProcessing="true">
                        <match url="*" />
                        <conditions>
                            <add input="{HTTP_X_AZURE_FDID}" pattern="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" negate="true" />
                        </conditions>
                        <action type="AbortRequest" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>
    ```

### Can the anycast IP change over the lifetime of my Front Door?

The frontend anycast IP for your Front Door should typically not change and may remain static for the lifetime of the Front Door. However, there are **no guarantees** for the same. Kindly don't take any direct dependencies on the IP.

### Does Azure Front Door support static or dedicated IPs?

No, Azure Front Door currently doesn't support static or dedicated frontend anycast IPs. 

### Does Azure Front Door support x-forwarded-for headers?

Yes, Azure Front Door supports the X-Forwarded-For, X-Forwarded-Host, and X-Forwarded-Proto headers. For X-Forwarded-For if the header was already present then Front Door appends the client socket IP to it. Else, it adds the header with the client socket IP as the value. For X-Forwarded-Host and X-Forwarded-Proto, the value is overridden.  

### How long does it take to deploy an Azure Front Door? Does my Front Door still work when being updated?

A new Front Door creation or any updates to an existing Front Door takes about 3 to 5 minutes for global deployment. That means in about 3 to 5 minutes, your Front Door configuration will be deployed across all of our POPs globally.

Note - Custom TLS/SSL certificate updates take about 30 minutes to be deployed globally.

Any updates to routes or backend pools are seamless and will cause zero downtime (if the new configuration is correct). Certificate updates won't cause any outage, unless you're switching from 'Azure Front Door Managed' to 'Use your own cert' or the other way around.


## Configuration

### Can Azure Front Door load balance or route traffic within a virtual network?

Azure Front Door (AFD) requires a public IP or a publicly resolvable DNS name to route traffic. Azure Front Door can't route directly to resources in a virtual network. You can use an Application Gateway or an Azure Load Balancer with a public IP to solve this problem.

### What are the various timeouts and limits for Azure Front Door?

Learn about all the documented [timeouts and limits for Azure Front Door](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-service-limits).

### How long does it take for a rule to take effect after being added to the Front Door Rules Engine?

The Rules Engine configuration takes about 10 to 15 minutes to complete an update. You can expect the rule to take effect as soon as the update is completed. 

### Can I configure Azure CDN behind my Front Door profile or Front Door behind my Azure CDN?

Azure Front Door and Azure CDN can't be configured together because both services use the same Azure edge sites when responding to requests. 

## Performance

### How does Azure Front Door support high availability and scalability?

Azure Front Door is a globally distributed multi-tenant platform with huge amount of capacity to cater to your application's scalability needs. Delivered from the edge of Microsoft's global network, Front Door provides global load-balancing capability that allows you to fail over your entire application or even individual microservices across regions or different clouds.

## TLS configuration

### What TLS versions are supported by Azure Front Door?

All Front Door profiles created after September 2019 use TLS 1.2 as the default minimum.

Front Door supports TLS versions 1.0, 1.1 and 1.2. TLS 1.3 isn't yet supported.

### What certificates are supported on Azure Front Door?

To enable the HTTPS protocol on a Front Door custom domain, you can choose a certificate that gets managed by Azure Front Door or use your own certificate.
The Front Door managed option provisions a standard TLS/SSL certificate via Digicert and  stored in Front Door's Key Vault. If you choose to use your own certificate, then you can onboard a certificate from a supported CA and can be a standard TLS, extended validation certificate, or even a wildcard certificate. Self-signed certificates aren't supported.

### Does Front Door support autorotation of certificates?

For the Front Door managed certificate option, the certificates are autorotated by Front Door. If you're using a Front Door managed certificate and see that the certificate expiry date is less than 60 days away, file a support ticket.

For your own custom TLS/SSL certificate, autorotation isn't supported. Similar to how you set up the first time for a given custom domain, you'll need to point Front Door to the right certificate version in your Key Vault. Ensure that the service principal for Front Door still has access to the Key Vault. This updated certificate rollout operation by Front Door doesn't cause any production down time provided the subject name or SAN for the certificate doesn't change.

### What are the current cipher suites supported by Azure Front Door?

For TLS1.2 the following cipher suites are supported: 

- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_DHE_RSA_WITH_AES_128_GCM_SHA256

Using custom domains with TLS1.0/1.1 enabled the following cipher suites are supported:

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

You can configure a minimum TLS version in Azure Front Door in the custom domain HTTPS settings using the Azure portal or the [Azure REST API](/rest/api/frontdoorservice/frontdoor/frontdoors/createorupdate#minimumtlsversion). Currently, you can choose between 1.0 and 1.2.

### Can I configure Front Door to only support specific cipher suites?

No, configuring Front Door for specific cipher suites isn't supported. You can get your own custom TLS/SSL certificate from your Certificate Authority (say Verisign, Entrust, or Digicert). Then have specific cipher suites marked on the certificate when you generate it. 

### Does Front Door support OCSP stapling?

Yes, OCSP stapling is supported by default by Front Door and no configuration is required.

### Does Azure Front Door also support re-encryption of traffic to the backend?

Yes, Azure Front Door supports TLS/SSL offload and end to end TLS, which re-encrypts the traffic to the backend. Since the connections to the backend happen over the public IP, it's recommended that you configure your Front Door to use HTTPS as the forwarding protocol.

### Does Front Door support self-signed certificates on the backend for HTTPS connection?

No, self-signed certificates aren't supported on Front Door and the restriction applies to both:

* **Backends**: You can't use self-signed certificates when you're forwarding the traffic as HTTPS or HTTPS health probes or filling the cache for from origin for routing rules with caching enabled.
* **Frontend**: You can't use self-signed certificates when using your own custom TLS/SSL certificate for enabling HTTPS on your custom domain.

### Why is HTTPS traffic to my backend failing?

For having successful HTTPS connections to your backend whether for health probes or for forwarding requests, there could be two reasons why HTTPS traffic might fail:

* **Certificate subject name mismatch**: For HTTPS connections, Front Door expects that your backend presents certificate from a valid CA with subject name(s) matching the backend hostname. As an example, if your backend hostname is set to `myapp-centralus.contosonews.net` and the certificate that your backend presents during the TLS handshake doesn't have `myapp-centralus.contosonews.net` or `*myapp-centralus*.contosonews.net` in the subject name. Then Front Door will refuse the connection and result in an error. 
    * **Solution**: It isn't recommended from a compliance standpoint but you can work around this error by disabling the certificate subject name check for your Front Door. You can find this option under Settings in Azure portal and under BackendPoolsSettings in the API.
* **Backend hosting certificate from invalid CA**: Only certificates from [valid Certificate Authorities](troubleshoot-allowed-certificate-authority.md) can be used at the backend with Front Door. Certificates from internal CAs or self-signed certificates aren't allowed.

### Can I use client/mutual authentication with Azure Front Door?

No. Although Azure Front Door supports TLS 1.2, which introduced client/mutual authentication in [RFC 5246](https://tools.ietf.org/html/rfc5246), currently, Azure Front Door doesn't support client/mutual authentication.

## Diagnostics and logging

### What types of metrics and logs are available with Azure Front Door?

For information on logs and other diagnostic capabilities, see Monitoring metrics and logs for Front Door.

### What is the retention policy on the diagnostics logs?

Diagnostic logs flow to the customers storage account and customers can set the retention policy based on their preference. Diagnostic logs can also be sent to an Event Hub or Azure Monitor logs. For more information, see [Azure Front Door Logging](how-to-logs.md).

### How do I get audit logs for Azure Front Door?

Audit logs are available for Azure Front Door. In the portal, select **Activity Log** in the menu page of your Front Door to access the audit log. 

### Can I set alerts with Azure Front Door?

Yes, Azure Front Door does support alerts. Alerts are configured on metrics. 

## Next steps

Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md).
