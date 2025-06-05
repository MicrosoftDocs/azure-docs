---
title: DNS resolution in Application Gateway
description: This article explains how Virtual Network DNS servers impact DNS resolution for Azure Application Gateway.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 06/04/2025
ms.author: mbender 
---

# Understanding DNS resolution in Application Gateway
An Application Gateway is a dedicated deployment within your Virtual Network. The DNS resolution for instances of your application gateway resource, which handles incoming traffic, is also affected by your virtual network configurations. This article discusses the Domain Name System (DNS) configurations and their impact on name resolution.

## Need for name resolution
Application Gateway performs DNS resolution for the Fully Qualified Domain Names (FQDN) of

* **Customer-provided FQDNs**, such as
  * Domain name-based backend server
  * Key vault endpoint for listener certificate
  * Custom error page URL
  * Online Certificate Status Protocol (OCSP) verification URL

* **Management FQDNs** that are utilized for various Azure infrastructure endpoints (control plane). These are the building blocks that form a complete Application Gateway resource. For example, communication with monitoring endpoints enable flow of Logs and Metrics. Thus, it's important for application gateways to internally communicate with other Azure services' endpoints having suffixes like `.windows.net`, `.azure.net`, etc.

> [!IMPORTANT]
> The management endpoint domain names that an Application Gateway resource interacts with are listed here. Depending on the type of application gateway deployment (detailed in this article), any name resolution issue for these Azure domain names may lead to either partial or complete loss of resource functionality.
> 
> * .windows.net
> * .chinacloudapi.cn
> * .azure.net
> * .azure.cn
> * .usgovcloudapi.net
> * .azure.us
> * .microsoft.scloud
> * .msftcloudes.com
> * .microsoft.com 

## DNS configuration types
Customers have different infrastructure needs, requiring various approaches to name resolution. This document outlines general DNS implementation scenarios and offers recommendations for the efficient operation of application gateway resources.

### Gateways with Public IP address (networkIsolationEnabled: False)
For public gateways, all control plane communication with Azure domains occurs through the default Azure DNS server at 168.63.129.16. In this section we'll examine the potential DNS zone configuration with public application gateways, and how to prevent conflicts with Azure domain names resolution.

#### Using default Azure-provided DNS
The Azure-provided DNS comes as a default setting with all virtual networks in Azure and has an IP address 168.63.129.16. Along with resolution of any public domain names, the Azure-provided DNS provides internal name resolution for VMs that reside within the same virtual network. In this scenario, all instances of the application gateway connect to 168.63.129.16 for DNS resolution. 

:::image source="media/application-gateway-dns-resolution/default-dns.png" alt-text="A diagram showing DNS resolution for Azure-provided DNS.":::

Flows: 
* In this diagram, we can see the Application Gateway instance talks to Azure-provided DNS (168.63.129.16) for name resolution of the backend servers FQDN "server1.contoso.com" and "server2.contoso.com," as shown with blue line.
* Similarly, the instance queries 168.63.129.16 for the DNS resolution of the private link-enabled Key Vault resource, as indicated by the orange line. To enable an application gateway to resolve the Key Vault endpoint to its private IP address, it is essential to link the Private DNS zone with the virtual network of that application gateway.
* After performing successful DNS resolutions for these FQDNs, the instance can communicate with the Key Vault and backend server endpoints.

Considerations:
* Don't create and link private DNS zones for top-level Azure domain names. You must create DNS zone for a subdomain as specific as possible. For example, having a private DNS zone for `privatelink.vaultcore.azure.net` for a key vault’s private endpoint works better in all cases than having a zone for `vaultcore.azure.net` or `azure.net`.
* For communication with backend servers or any service using a Private Endpoint, ensure the private link DNS zone is linked to your application gateway’s virtual network. 

#### Using custom DNS servers

In your virtual network, it's possible to designate custom DNS servers. This configuration may be required for managing zones independently for specific domain names. Such an arrangement directs the application gateway instances within the virtual network also to utilize the specified custom DNS servers for resolving non-Azure domain names. 

:::image source="media/application-gateway-dns-resolution/custom-dns.png" alt-text="A diagram showing DNS resolution with custom DNS servers.":::

Flows: 
* The diagram shows that the Application Gateway instance uses Azure-provided DNS (168.63.129.16) for name resolution of the private link Key Vault endpoint "contoso.privatelink.vaultcore.azure.net". The DNS queries for Azure domain names, which include `azure.net`, are redirected to Azure-provided DNS (shown in orange line).
* For DNS resolution of "server1.contoso.com," the instance honors the custom DNS setup (as shown in blue line). 

Considerations:

Using custom DNS servers on application gateway virtual network needs you to take the following measures to ensure there's no impact on functioning of application gateway. 

* After you change the DNS servers associated with application gateway virtual network, you must restart (Stop and Start) your application gateway for these changes to take effect for the instances.
* When using a private endpoint in application gateway virtual network, the private DNS zone must remain linked to the application gateway virtual network to allow resolution to private IP. This DNS zone must be for a subdomain as specific as possible.
* If the custom DNS servers are in a different virtual network, ensure it's peered with the Application Gateway's virtual network and not impacted by any Network Security Group or Route Table configurations. 

### Gateways with Private IP address only (networkIsolationEnabled: True)
The private application gateway deployment is designed to separate the customer’s data plane and management plane traffic. Therefore, having default Azure DNS or custom DNS servers has no effect on the critical management endpoints name resolutions. However, when using custom DNS servers, you must take care of name resolutions required for any data path operations.

:::image source="media/application-gateway-dns-resolution/private-only.png" alt-text="A diagram showing DNS resolution for private-only gateway.":::

Flows:
* The DNS queries for "contoso.com" reaches the custom DNS servers through customer traffic plane.
* The DNS queries for "contoso.privatelink.vaultcore.azure.net" also reaches the custom DNS servers. However, since the DNS server isn't authoritative zone for this domain name, it forwards the query recursively to Azure DNS 168.63.129.16. Such a configuration is important to allow name resolution through a private DNS zone that is linked to the virtual network.
* The resolution of all management endpoints goes via management plane traffic that directly interacts with the Azure-provided DNS.

Considerations:

* After you change the DNS servers associated with application gateway virtual network, you must restart (Stop and Start) your application gateway for these changes to take effect for the instances.
* You must set forwarding rules to send all other domains resolution queries to Azure DNS 168.63.129.16. This configuration is especially important when you have a private DNS zone for private endpoint resolution.
* When using a private endpoint, the private DNS zone must remain linked to the application gateway virtual network to allow resolution to private IP. 


