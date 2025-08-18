---
title: VNet configuration settings | Azure API Management
description: Reference for network configuration settings when deploying Azure API Management to a virtual network
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 06/17/2025
ms.author: danlep
ms.custom: references_regions
---
# Virtual network configuration reference: API Management

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

This reference provides detailed network configuration settings for an API Management instance deployed (injected) in an Azure virtual network in the [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) mode. 

For VNet connectivity options, requirements, and considerations, see [Using a virtual network with Azure API Management](virtual-network-concepts.md).

> [!IMPORTANT]
> This reference applies only to API Management instances in the classic tiers deployed in a virtual network. For information about virtual network injection in the v2 tiers, see [Inject an Azure API Management instance in a private virtual network - Premium v2 tier](inject-vnet-v2.md).

## Required ports  

Control inbound and outbound traffic into the subnet in which API Management is deployed by using [network security group][NetworkSecurityGroups] rules. If certain ports are unavailable, API Management may not operate properly and may become inaccessible. 

When an API Management service instance is hosted in a VNet, the ports in the following table are used.

>[!IMPORTANT]
> * **Bold** items in the *Purpose* column indicate port configurations required for successful deployment and operation of the API Management service. Configurations labeled "optional" enable specific features, as noted. They are not required for the overall health of the service. 
>
> * We recommend using the indicated [service tags](../virtual-network/service-tags-overview.md) instead of IP addresses in NSG and other network rules to specify network sources and destinations. Service tags prevent downtime when infrastructure improvements necessitate IP address changes.      



> [!IMPORTANT]
> It is required to assign a Network Security Group to your VNet in order for the Azure Load Balancer to work. Learn more in the [Azure Load Balancer documentation](/security/benchmark/azure/baselines/azure-load-balancer-security-baseline#network-security-group-support).


| Direction | Source service tag | Source port ranges | Destination service tag | Destination port ranges | Protocol |  Action | Purpose | VNet type |
|-------|--------------|----------|---------|------------|-----------|-----|--------|-----|
| Inbound | Internet | * | VirtualNetwork | [80], 443 |  TCP                | Allow           | **Client communication to API Management**                     | External only            |
| Inbound | ApiManagement | * | VirtualNetwork | 3443                                 | TCP                | Allow       | **Management endpoint for Azure portal and PowerShell**         | External & Internal  |
| Outbound | VirtualNetwork | * | Internet | 80                  |  TCP | Allow  | **Validation and management of Microsoft-managed and customer-managed certificates**      | External & Internal  |
| Outbound | VirtualNetwork | * | Storage | 443                  |  TCP                | Allow             | **Dependency on Azure Storage**                             | External & Internal  |
| Outbound | VirtualNetwork |  * | AzureActiveDirectory | 443                             | TCP                | Allow | [Microsoft Entra ID, Microsoft Graph,](api-management-howto-aad.md) and Azure Key Vault dependency (optional)              | External & Internal  |
| Outbound | VirtualNetwork | * | AzureConnectors | 443                  |  TCP                | Allow | [managed connections](credentials-overview.md) dependency (optional)              | External & Internal  |
| Outbound | VirtualNetwork | * | Sql | 1433                     |  TCP                | Allow          | **Access to Azure SQL endpoints**                           | External & Internal  |
| Outbound | VirtualNetwork | * | AzureKeyVault | 443                     |  TCP                | Allow                | **Access to Azure Key Vault**                         | External & Internal  |
| Outbound | VirtualNetwork | * | EventHub | 5671, 5672, 443          |  TCP                | Allow            | Dependency for [Log to Azure Event Hubs policy](api-management-howto-log-event-hubs.md) and [Azure Monitor](api-management-howto-use-azure-monitor.md) (optional) | External & Internal  |
| Outbound | VirtualNetwork | * | Storage | 445                      |  TCP                | Allow             | Dependency on Azure File Share for [GIT](api-management-configuration-repository-git.md) (optional)                   | External & Internal  |
| Outbound | VirtualNetwork | * | AzureMonitor | 1886, 443                     |  TCP                | Allow         | **Publish [Diagnostics Logs and Metrics](api-management-howto-use-azure-monitor.md), [Resource Health](/azure/service-health/resource-health-overview), and [Application Insights](api-management-howto-app-insights.md)**                  | External & Internal  |
| Inbound & Outbound | VirtualNetwork | * | Virtual Network | 6380              | TCP                | Allow     | Access external Azure Cache for Redis service for [caching](api-management-caching-policies.md) policies between machines (optional)        | External & Internal  |
| Inbound & Outbound | VirtualNetwork | * | VirtualNetwork | 6381 - 6383              |  TCP                | Allow     | Access internal Azure Cache for Redis service for [caching](api-management-caching-policies.md) policies between machines (optional)        | External & Internal  |
| Inbound & Outbound | VirtualNetwork | * | VirtualNetwork |  4290               | UDP                | Allow     | Sync Counters for [Rate Limit](rate-limit-policy.md) policies between machines (optional)        | External & Internal  |
| Inbound | AzureLoadBalancer | * | VirtualNetwork | 6390                       |  TCP                | Allow | **Azure Infrastructure Load Balancer**                          | External & Internal  |
| Inbound | AzureTrafficManager | * | VirtualNetwork | 443                       | TCP                | Allow | **Azure Traffic Manager**  routing for multi-region deployment                        | External |
| Inbound | AzureLoadBalancer | * | VirtualNetwork 6391                                  | TCP                | Allow | Monitoring of individual machine health (Optional)                          | External & Internal  |

## Regional service tags

NSG rules allowing outbound connectivity to Storage, SQL, and Azure Event Hubs service tags may use the regional versions of those tags corresponding to the region containing the API Management instance (for example, **Storage.WestUS** for an API Management instance in the West US region). In multi-region deployments, the NSG in each region should allow traffic to the service tags for that region and the primary region.

## TLS functionality  

To enable TLS/SSL certificate chain building and validation, the API Management service needs outbound network connectivity on ports `80` and `443` to `ocsp.msocsp.com`, `oneocsp.msocsp.com`, `mscrl.microsoft.com`, `crl.microsoft.com`, `cacerts.digicert.com`, `crl3.digicert.com` and `csp.digicert.com`. 


## DNS access

Outbound access on port `53` is required for communication with DNS servers. If a custom DNS server exists on the other end of a VPN gateway, the DNS server must be reachable from the subnet hosting API Management.

<a name='azure-active-directory-integration'></a>

## Microsoft Entra integration

To operate properly, the API Management service needs outbound connectivity on port 443 to the following endpoints associated with Microsoft Entra ID: `<region>.login.microsoft.com` and `login.microsoftonline.com`. 

## Metrics and health monitoring 

Outbound network connectivity to Azure Monitoring endpoints, which resolve under the following domains, are represented under the **AzureMonitor** service tag for use with Network Security Groups.

|     Azure Environment | Endpoints    |
|-------------------|-----------|
| Azure Public      | <ul><li>gcs.prod.monitoring.core.windows.net</li><li>global.prod.microsoftmetrics.com</li><li>shoebox2.prod.microsoftmetrics.com</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>prod3.prod.microsoftmetrics.com</li><li>prod3-black.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.com</li></ul> |
| Azure Government  | <ul><li>fairfax.warmpath.usgovcloudapi.net</li><li>global.prod.microsoftmetrics.com</li><li>shoebox2.prod.microsoftmetrics.com</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>prod3.prod.microsoftmetrics.com</li><li>prod3-black.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>prod5.prod.microsoftmetrics.com</li><li>prod5-black.prod.microsoftmetrics.com</li><li>prod5-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.us</li></ul>      |    
| Microsoft Azure operated by 21Vianet     | <ul><li>mooncake.warmpath.chinacloudapi.cn</li><li>global.prod.microsoftmetrics.com</li><li>shoebox2.prod.microsoftmetrics.com</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>prod3.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>prod5.prod.microsoftmetrics.com</li><li>prod5-black.prod.microsoftmetrics.com</li><li>prod5-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.cn</li></ul>       |                                                                                 

## Developer portal CAPTCHA
Allow outbound network connectivity for the developer portal's CAPTCHA, which resolves under the hosts `client.hip.live.com` and `partner.hip.live.com`.

## Publishing the developer portal

Enable publishing the [developer portal](api-management-howto-developer-portal.md) for an API Management instance in a VNet by allowing outbound connectivity to Azure Storage. For example, use the Storage service tag in an NSG rule. Currently, connectivity to Azure Storage via global or regional service endpoints is required to publish the developer portal for any API Management instance.

## Azure portal diagnostics  
  When using the API Management diagnostics extension from inside a VNet, outbound access to `dc.services.visualstudio.com` on port `443` is required to enable the flow of diagnostic logs from Azure portal. This access helps in troubleshooting issues you might face when using the extension.

## Azure load balancer  
  You're not required to allow inbound requests from service tag `AzureLoadBalancer` for the Developer SKU, since only one compute unit is deployed behind it. However, inbound connectivity from `AzureLoadBalancer` becomes **critical** when scaling to a higher SKU, such as Premium, because failure of the health probe from load balancer then blocks all inbound access to the control plane and data plane.

## Application Insights  
  If you enabled [Azure Application Insights](api-management-howto-app-insights.md) monitoring on API Management, allow outbound connectivity to the [telemetry endpoint](/azure/azure-monitor/ip-addresses#outgoing-ports) from the VNet.

## KMS endpoint

When adding virtual machines running Windows to the VNet, allow outbound connectivity on port `1688` to the [KMS endpoint](/troubleshoot/azure/virtual-machines/custom-routes-enable-kms-activation#solution) in your cloud. This configuration routes Windows VM traffic to the Azure Key Management Services (KMS) server to complete Windows activation.

## Internal infrastructure and diagnostics

The following settings and FQDNs are required to maintain and diagnose API Management's internal compute infrastructure.

* Allow outbound UDP access on port `123` for NTP.
* Allow outbound TCP access on port `12000` for diagnostics.
* Allow outbound access on port `443` to the following endpoints for internal diagnostics: `azurewatsonanalysis-prod.core.windows.net`, `*.data.microsoft.com`, `azureprofiler.trafficmanager.net`, `shavamanifestazurecdnprod1.azureedge.net`, `shavamanifestcdnprod1.azureedge.net`.
* Allow outbound access on port `443` to the following endpoint for internal PKI: `issuer.pki.azure.com`.
* Allow outbound access on ports `80` and `443` to the following endpoints for Windows Update: `*.update.microsoft.com`, `*.ctldl.windowsupdate.com`, `ctldl.windowsupdate.com`, `download.windowsupdate.com`.
* Allow outbound access on ports `80` and `443` to the endpoint `go.microsoft.com`.
* Allow outbound access on port `443` to the following endpoints for Windows Defender: `wdcp.microsoft.com`, `wdcpalt.microsoft.com `.

## Control plane IP addresses

> [!IMPORTANT]
> Control plane IP addresses for Azure API Management should be configured for network access rules only when needed in certain networking scenarios. We recommend using the **ApiManagement** [service tag](../virtual-network/service-tags-overview.md) instead of control plane IP addresses to prevent downtime when infrastructure improvements necessitate IP address changes.   



## Related content

Learn more about:

* [Connecting a virtual network to backend using VPN Gateway](../vpn-gateway/design.md#s2smulti)
* [Connecting a virtual network from different deployment models](../vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md)
* [Virtual Network frequently asked questions](../virtual-network/virtual-networks-faq.md)
* [Service tags](../virtual-network/network-security-groups-overview.md#service-tags)

For more guidance on configuration issues, see:
* [API Management - Networking FAQs (Demystifying series I)](https://techcommunity.microsoft.com/t5/azure-paas-blog/api-management-networking-faqs-demystifying-series-i/ba-p/1500996)
* [API Management - Networking FAQs (Demystifying series II)](https://techcommunity.microsoft.com/t5/azure-paas-blog/api-management-networking-faqs-demystifying-series-ii/ba-p/1502056)



[api-management-using-vnet-menu]: ./media/api-management-using-with-vnet/api-management-menu-vnet.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-using-with-vnet/api-management-using-vnet-add-api.png
[api-management-vnet-public]: ./media/api-management-using-with-vnet/api-management-vnet-external.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content

[UDRs]: ../virtual-network/virtual-networks-udr-overview.md
[NetworkSecurityGroups]: ../virtual-network/network-security-groups-overview.md
[ServiceEndpoints]: ../virtual-network/virtual-network-service-endpoints-overview.md
[ServiceTags]: ../virtual-network/network-security-groups-overview.md#service-tags
