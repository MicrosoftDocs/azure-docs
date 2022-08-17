---
title: 'Azure Front Door: Frequently asked questions'
description: This page provides answers to frequently asked questions about Azure Front Door Standard/Premium.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 05/18/2021
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

### What resources are supported today as part of an origin group?

Origin groups can be composed of two types of origins:

- Public origins include storage accounts, App Service apps, Kubernetes instances, or any other custom hostname that has public connectivity. These origins must be defined either via a public IP address or a publicly resolvable DNS hostname. Members of origin groups can be deployed across availability zones, regions, or even outside of Azure as long as they have public connectivity. Public origins are supported for Azure Front Door Standard and Premium tiers.
- [Private Link origins](../private-link.md) are available when you use Azure Front Door (Premium).

### What regions is the service available in?

Azure Front Door is a global service and isn't tied to any specific Azure region. The only location you need to specify while creating a Front Door is for the resource group. That location is basically specifying where the metadata for the resource group will be stored. Front Door resource itself is created as a global resource and the configuration is deployed globally to all edge locations. 

### Where are the edge locations for Azure Front Door?

For the complete list of Azure Front Door edge locations, see [Azure Front Door edge locations](edge-locations.md).

### Is Azure Front Door a dedicated deployment for my application or is it shared across customers?

Azure Front Door is a globally distributed multi-tenant service. The infrastructure for Front Door is shared across all its customers. By creating a Front Door profile, you're defining the specific configuration required for your application. Changes made to your Front Door doesn't affect other Front Door configurations.

### Is HTTP->HTTPS redirection supported?

Yes. In fact, Azure Front Door supports host, path, query string redirection, and part of URL redirection. Learn more about [URL redirection](../front-door-url-redirect.md). 

### How do I lock down the access to my backend to only Azure Front Door?

The best way to lock down your application to accept traffic only from your specific Front Door instance is to publish your application via Private Endpoint. Network traffic between Front Door and the application traverses over the VNet and a Private Link on the Microsoft backbone network, eliminating exposure from the public internet.

Learn more about the [securing origin for Front Door with Private Link](../private-link.md).  

Alternative way to lock down your application to accept traffic only from your specific Front Door, you'll need to set up IP ACLs for your backend. Then restrict the traffic of your backend to the specific value of the header 'X-Azure-FDID' sent by Front Door. These steps are detailed out as below:

* Configure IP ACLing for your backends to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only. Refer to the IP details below for ACLing your backend:
 
    * Refer *AzureFrontDoor.Backend* section in [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for Front Door's backend IP address range. You can also use the service tag *AzureFrontDoor.Backend* in your [network security groups](../../virtual-network/network-security-groups-overview.md#security-rules).
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

* Azure Front Door also supports the *AzureFrontDoor.Frontend* service tag, which provides the list of IP addresses that clients use when connecting to Front Door. You can use the *AzureFrontDoor.Frontend* service tag when you’re controlling the outbound traffic that should be allowed to connect to services deployed behind Azure Front Door. Azure Front Door also supports an additional service tag, *AzureFrontDoor.FirstParty*, to integrate internally with other Azure services. See [available service tags](../../virtual-network/service-tags-overview.md#available-service-tags) for more details on Azure Front Door service tags use cases.

### Can the anycast IP change over the lifetime of my Front Door?

The frontend anycast IP for your Front Door should typically not change and may remain static for the lifetime of the Front Door. However, there are **no guarantees** for the same. Kindly don't take any direct dependencies on the IP.

### Does Azure Front Door support static or dedicated IPs?

No, Azure Front Door currently doesn't support static or dedicated frontend anycast IPs. 

### Does Azure Front Door support x-forwarded-for headers?

Yes, Azure Front Door supports the X-Forwarded-For, X-Forwarded-Host, and X-Forwarded-Proto headers. For X-Forwarded-For if the header was already present then Front Door appends the client socket IP to it. Else, it adds the header with the client socket IP as the value. For X-Forwarded-Host and X-Forwarded-Proto, the value is overridden.  

### How long does it take to deploy an Azure Front Door? Does my Front Door still work when being updated?

Most Rules Engine configuration updates complete under 20 minutes. You can expect the rule to take effect as soon as the update is completed. 

 > [!Note]  
  > Most custom TLS/SSL certificate updates take from several minutes to an hour to be deployed globally.

Any updates to routes or backend pools are seamless and will cause zero downtime (if the new configuration is correct). Certificate updates won't cause any outage, unless you're switching from 'Azure Front Door Managed' to 'Use your own cert' or the other way around.


## Configuration

### Can Azure Front Door load balance or route traffic within a virtual network?

Azure Front Door (Standard) requires a public IP or a publicly resolvable DNS name to route traffic. Azure Front Door can't route directly to resources in a virtual network. You can use an Application Gateway or an Azure Load Balancer with a public IP to solve this problem.

Azure Front Door (Premium) supports routing traffic to [Private Link origins](../private-link.md).

### What are the various timeouts and limits for Azure Front Door?

Learn about all the documented [timeouts and limits for Azure Front Door](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-classic-limits).

### How long does it take for a rule to take effect after being added to the Front Door Rules Engine?

Most rules engine configuration updates complete under 20 minutes. You can expect the rule to take effect as soon as the update is completed. 

### Can I configure Azure CDN behind my Front Door profile or Front Door behind my Azure CDN?

Azure Front Door and Azure CDN can't be configured together because both services use the same Azure edge sites when responding to requests. 

## Performance

### How does Azure Front Door support high availability and scalability?

Azure Front Door is a globally distributed multi-tenant platform with huge amount of capacity to cater to your application's scalability needs. Delivered from the edge of Microsoft's global network, Front Door provides global load-balancing capability that allows you to fail over your entire application or even individual microservices across regions or different clouds.

## TLS configuration

### What TLS versions are supported by Azure Front Door?

All Front Door profiles created after September 2019 use TLS 1.2 as the default minimum.

Front Door supports TLS versions 1.0, 1.1 and 1.2. TLS 1.3 isn't yet supported. Refer to [Azure Front Door end-to-end TLS](../concept-end-to-end-tls.md) for more details.

### Why is HTTPS traffic to my backend failing?

For having successful HTTPS connections to your backend whether for health probes or for forwarding requests, there could be two reasons why HTTPS traffic might fail:

* **Certificate subject name mismatch**: For HTTPS connections, Front Door expects that your backend presents certificate from a valid CA with subject name(s) matching the backend hostname. As an example, if your backend hostname is set to `myapp-centralus.contosonews.net` and the certificate that your backend presents during the TLS handshake doesn't have `myapp-centralus.contosonews.net` or `*myapp-centralus*.contosonews.net` in the subject name. Then Front Door will refuse the connection and result in an error. 
    * **Solution**: It isn't recommended from a compliance standpoint but you can work around this error by disabling the certificate subject name check for your Front Door. You can find this option under Settings in Azure portal and under BackendPoolsSettings in the API.
* **Backend hosting certificate from invalid CA**: Only certificates from [valid Certificate Authorities](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT) can be used at the backend with Front Door. Certificates from internal CAs or self-signed certificates aren't allowed.

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

## Billing

### Will I be billed for the Azure Front Door resources that are disabled?

Azure Front Door resources, like Front Door profiles, are not billed if disabled.

## Next steps

Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md).
