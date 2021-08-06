---
title: Virtual networking with Azure API Management
description: Learn background, scenarios, and limitations of connecting a virtual network to your Azure API Management service.
services: api-management
author: vladvino

ms.service: api-management
ms.topic: how-to
ms.date: 08/05/2021
ms.author: apimpm
ms.custom: 
---
# Using a virtual network with Azure API Management
With Azure Virtual Networks (VNETs), you can place your Azure resources in a non-internet-routable network to which you control access. You can then connect VNETs to your on-premises networks using various VPN technologies. To learn more about Azure VNETs, start with the information in the [Azure Virtual Network Overview](../virtual-network/virtual-networks-overview.md).

Azure API Management can be deployed inside the VNET to access backend services within the network. You can use the Azure portal, Azure CLI, Azure Resource Manager templates, or other tools for the deployment. You can control inbound and outbound traffic into the subnet in which API Management is deployed by using [network security groups][network security groups].


This article explains VNET connectivity options, settings, considerations, and troubleshooting steps for your API Management instance. For deploymet steps, see:

* [Connect to an external virtual network using Azure API Management](./api-management-using-with-vnet.md).
* [Connect to an internal virtual network using Azure API Management](./api-management-using-with-internal-vnet.md).

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Access options

Deploying an API Management instance into a virtual network is optional. Using a virtual network, you can configure the developer portal and API Mangement gateway to be accessible either from the internet (external mode) or only within the VNET (internal mode). 

* **External** - The API Management gateway, developer portal, and other endpoints are accessible from the public internet via an external load balancer. The gateway can access resources within the VNET.

    ![Public peering][api-management-vnet-public]

* **Internal** - The API Management gateway, developer portal, and other endpoints are accessible only from within the VNET via an internal load balancer. The gateway can access resources within the VNET.

    ![Private peering][api-management-vnet-private]
* **Ports required for API Management:**  
    . If any of the following ports are unavailable, API Management may not operate properly and may become inaccessible. Blocked ports are another common misconfiguration issue when using API Management with a VNET.

## Network resource requirements
It's recommended to use the Azure portal or current client tools supporting API Management API version 2020-12-01 or later for deploying API Management into a virtual network. The following are current network resource requirements:

* Azure Resource Manager virtual networks are required.
* You must provide a Standard SKU [public IPv4 address](../virtual-network/public-ip-addresses#standard) in addition to specifying a virtual network and subnet.
* The subnet used to connect to the API Management instance may contain other Azure resource types.
* The API Management service, virtual network and subnet, and public IP address resource must be in the same region and subscription.
* For multi-region API Management deployments, you configure virtual network resources separately for each location.
* When an API Management service instance is hosted in a VNET, the following [ports]() must allow traffic.

### Subnet size
Azure reserves some IP addresses within each subnet that can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance. Three more addresses are used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

In addition to the IP addresses used by the Azure VNET infrastructure, each API Management instance in the subnet uses:
* Two IP addresses per unit of Premium SKU, or 
* One IP address for the Developer SKU. 

Each instance reserves an extra IP address for the external load balancer. When deploying into an [internal VNET](./api-management-using-with-internal-vnet.md), the instance requires an extra IP address for the internal load balancer.

Given the calculation above, the minimum size of the subnet in which API Management can be deployed is /29, which gives three usable IP addresses. Each extra scale unit of API Management requires two more IP addresses.

### Routing
+ A load-balanced public IP address (VIP) will be reserved to provide access to all service endpoints and resources outside the VNET.
  + Load balanced public IP addresses can be found on the **Overview/Essentials** blade in the Azure portal.
+ An IP address from a subnet IP range (DIP) will be used to access resources within the VNET.

### Limitations

* A subnet containing API Management instances can't be moved across subscriptions.
* For multi-region API Management deployments configured in internal VNET mode, users own the routing and are responsible for managing the load balancing across multiple regions.
* Due to platform limitations, connectivity between a resource in a globally peered VNET in another region and an API Management service in internal mode will not work. For more information, see the [virtual network docuementation](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints).

<a name="required-ports"> </a>
When an API Management service instance is hosted in a VNET, the ports in the following table are used.

| Source / Destination Port(s) | Direction          | Transport protocol |   [Service Tags](../virtual-network/network-security-groups-overview.md#service-tags) <br> Source / Destination   | Purpose (\*)                                                 | VNET type |
|------------------------------|--------------------|--------------------|---------------------------------------|-------------------------------------------------------------|----------------------|
| * / [80], 443                  | Inbound            | TCP                | INTERNET / VIRTUAL_NETWORK            | Client communication to API Management                      | External             |
| * / 3443                     | Inbound            | TCP                | ApiManagement / VIRTUAL_NETWORK       | Management endpoint for Azure portal and PowerShell         | External & Internal  |
| * / 443                  | Outbound           | TCP                | VIRTUAL_NETWORK / Storage             | **Dependency on Azure Storage**                             | External & Internal  |
| * / 443                  | Outbound           | TCP                | VIRTUAL_NETWORK / AzureActiveDirectory | [Azure Active Directory](api-management-howto-aad.md) and Azure KeyVault dependency                  | External & Internal  |
| * / 1433                     | Outbound           | TCP                | VIRTUAL_NETWORK / SQL                 | **Access to Azure SQL endpoints**                           | External & Internal  |
| * / 443                     | Outbound           | TCP                | VIRTUAL_NETWORK / AzureKeyVault                 | **Access to Azure KeyVault**                           | External & Internal  |
| * / 5671, 5672, 443          | Outbound           | TCP                | VIRTUAL_NETWORK / EventHub            | Dependency for [Log to Event Hub policy](api-management-howto-log-event-hubs.md) and monitoring agent | External & Internal  |
| * / 445                      | Outbound           | TCP                | VIRTUAL_NETWORK / Storage             | Dependency on Azure File Share for [GIT](api-management-configuration-repository-git.md)                      | External & Internal  |
| * / 443, 12000                     | Outbound           | TCP                | VIRTUAL_NETWORK / AzureCloud            | Health and Monitoring Extension         | External & Internal  |
| * / 1886, 443                     | Outbound           | TCP                | VIRTUAL_NETWORK / AzureMonitor         | Publish [Diagnostics Logs and Metrics](api-management-howto-use-azure-monitor.md), [Resource Health](../service-health/resource-health-overview.md), and [Application Insights](api-management-howto-app-insights.md)                   | External & Internal  |
| * / 25, 587, 25028                       | Outbound           | TCP                | VIRTUAL_NETWORK / INTERNET            | Connect to SMTP Relay for sending e-mails                    | External & Internal  |
| * / 6381 - 6383              | Inbound & Outbound | TCP                | VIRTUAL_NETWORK / VIRTUAL_NETWORK     | Access Redis Service for [Cache](api-management-caching-policies.md) policies between machines         | External & Internal  |
| * / 4290              | Inbound & Outbound | UDP                | VIRTUAL_NETWORK / VIRTUAL_NETWORK     | Sync Counters for [Rate Limit](api-management-access-restriction-policies.md#LimitCallRateByKey) policies between machines         | External & Internal  |
| * / *                        | Inbound            | TCP                | AZURE_LOAD_BALANCER / VIRTUAL_NETWORK | Azure Infrastructure Load Balancer                          | External & Internal  |

>[!IMPORTANT]
> Bold items in the *Purpose* column are required for API Management service to be deployed successfully. Blocking the other ports, however, will cause **degradation** in the ability to use and **monitor the running service and provide the committed SLA**.

+ **TLS functionality:**  
  To enable TLS/SSL certificate chain building and validation, the API Management service needs outbound network connectivity to `ocsp.msocsp.com`, `mscrl.microsoft.com`, and `crl.microsoft.com`. This dependency is not required if any certificate you upload to API Management contains the full chain to the CA root.

+ **DNS Access:**  
  Outbound access on `port 53` is required for communication with DNS servers. If a custom DNS server exists on the other end of a VPN gateway, the DNS server must be reachable from the subnet hosting API Management.

+ **Metrics and Health Monitoring:**  
  Outbound network connectivity to Azure Monitoring endpoints, which resolve under the following domains, are represented under the AzureMonitor service tag for use with Network Security Groups.

    | Azure Environment | Endpoints                                                                                                                                                                                                                                                                                                                                                              |
    |-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Azure Public      | <ul><li>gcs.prod.monitoring.core.windows.net</li><li>global.prod.microsoftmetrics.com</li><li>shoebox2.prod.microsoftmetrics.com</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>prod3.prod.microsoftmetrics.com</li><li>prod3-black.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.com</li></ul> |
    | Azure Government  | <ul><li>fairfax.warmpath.usgovcloudapi.net</li><li>global.prod.microsoftmetrics.com</li><li>shoebox2.prod.microsoftmetrics.com</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>prod3.prod.microsoftmetrics.com</li><li>prod3-black.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>prod5.prod.microsoftmetrics.com</li><li>prod5-black.prod.microsoftmetrics.com</li><li>prod5-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.us</li></ul>                                                                                                                                                                                                                                                |
    | Azure China 21Vianet     | <ul><li>mooncake.warmpath.chinacloudapi.cn</li><li>global.prod.microsoftmetrics.com</li><li>shoebox2.prod.microsoftmetrics.com</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>prod3.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>prod5.prod.microsoftmetrics.com</li><li>prod5-black.prod.microsoftmetrics.com</li><li>prod5-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.cn</li></ul>                                                                                                                                                                                                                                                |

  
+ **Regional Service Tags**: NSG rules allowing outbound connectivity to Storage, SQL, and Event Hubs service tags may use the regional versions of those tags corresponding to the region containing the API Management instance (for example, Storage.WestUS for an API Management instance in the West US region). In multi-region deployments, the NSG in each region should allow traffic to the service tags for that region and the primary region.

    > [!IMPORTANT]
    > Enable publishing the [developer portal](api-management-howto-developer-portal.md) for an API Management instance in a VNET by allowing outbound connectivity to blob storage in the West US region. For example, use the **Storage.WestUS** service tag in an NSG rule. Currently, connectivity to blob storage in the West US region is required to publish the developer portal for any API Management instance.

+ **SMTP Relay:**  
  Outbound network connectivity for the SMTP Relay, which resolves under the host `smtpi-co1.msn.com`, `smtpi-ch1.msn.com`, `smtpi-db3.msn.com`, `smtpi-sin.msn.com` and `ies.global.microsoft.com`

+ **Developer portal CAPTCHA:**  
  Outbound network connectivity for the developer portal's CAPTCHA, which resolves under the hosts `client.hip.live.com` and `partner.hip.live.com`.

+ **Azure portal Diagnostics:**  
  When using the API Management extension from inside a VNET, outbound access to `dc.services.visualstudio.com` on `port 443` is required to enable the flow of diagnostic logs from Azure portal. This access helps in troubleshooting issues you might face when using extension.

+ **Azure Load Balancer:**  
  You're not required to allow inbound request from service tag `AZURE_LOAD_BALANCER` for the `Developer` SKU, since only one compute unit is deployed behind it. But inbound from [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md) becomes critical when scaling to a higher SKU, like `Premium`, as failure of health probe from load balancer then fails a deployment.

+ **Application Insights:**  
  If you've enabled [Azure Application Insights](api-management-howto-app-insights.md) monitoring on API Management, allow outbound connectivity to the [Telemetry endpoint](../azure-monitor/app/ip-addresses.md#outgoing-ports) from the VNET.

+ **Force Tunneling Traffic to On-premises Firewall Using Express Route or Network Virtual Appliance:**  
  Commonly, you configure and define your own default route (0.0.0.0/0), forcing all traffic from the API Management-delegated subnet to flow through an on-premises firewall or to a network virtual appliance. This traffic flow breaks connectivity with Azure API Management, since outbound traffic is either blocked on-premises, or NAT'd to an unrecognizable set of addresses no longer working with various Azure endpoints. You can solve this issue via a couple of methods: 

  * Enable [service endpoints][ServiceEndpoints] on the subnet in which the API Management service is deployed for:
      * Azure Sql
      * Azure Storage
      * Azure EventHub, and
      * Azure KeyVault. 
  
    By enabling endpoints directly from API Management-delegated subnet to these services, you can use the Microsoft Azure backbone network, providing optimal routing for service traffic. If you use service endpoints with a force tunneled API Management, the above Azure services traffic isn't force tunneled. The other API Management service dependency traffic is force tunneled and can't be lost. If lost, the API Management service would not function properly.

  * All the control plane traffic from the internet to the management endpoint of your API Management service is routed through a specific set of inbound IPs, hosted by API Management. When the traffic is force tunneled, the responses will not symmetrically map back to these inbound source IPs. To overcome the limitation, set the destination of the following user-defined routes ([UDRs][UDRs]) to the "Internet", to steer traffic back to Azure. Find the set of inbound IPs for control plane traffic documented in [Control Plane IP Addresses](#control-plane-ips).

  * For other force tunneled API Management service dependencies, resolve the hostname and reach out to the endpoint. These include:
      - Metrics and Health Monitoring
      - Azure portal Diagnostics
      - SMTP Relay
      - Developer portal CAPTCHA

## <a name="troubleshooting"> </a>Troubleshooting
* **Unsuccessful initial deployment of API Management service into a subnet:** 
  * Deploy a virtual machine into the same subnet. 
  * Remote desktop into the virtual machine and validate connectivity to one of each of the following resources in your Azure subscription:
    * Azure Storage blob
    * Azure SQL Database
    * Azure Storage Table

  > [!IMPORTANT]
  > After validating the connectivity, remove all the resources in the subnet before deploying API Management into the subnet.

* **Verify network connectivity status:**  
  * After deploying API Management into the subnet, use the portal to check the connectivity of your instance to dependencies, such as Azure Storage. 
  * In the portal, in the left-hand menu, under **Deployment and infrastructure**, select **Network connectivity status**.

   :::image type="content" source="media/api-management-using-with-vnet/verify-network-connectivity-status.png" alt-text="Verify network connectivity status in the portal":::

  | Filter | Description |
  | ----- | ----- |
  | **Required** | Select to review the required Azure services connectivity for API Management. Failure indicates that the instance is unable to perform core operations to manage APIs |
  | **Optional** | Select to review the optional services connectivity. Failure indicates only that the specific functionality will not work (for example, SMTP). Failure may lead to degradation in using and monitoring the API Management instance and providing the committed SLA. |

  To address connectivity issues, review [Common network configuration issues](#network-configuration-issues) and fix required network settings.

* **Incremental Updates:**  
  When making changes to your network, refer to [NetworkStatus API](/rest/api/apimanagement/2020-12-01/network-status) to verify that the API Management service has not lost access to critical resources. The connectivity status should be updated every 15 minutes.

* **Resource Navigation Links:**  
  When deploying into a Resource Manager VNET subnet with API version 2020-12-01 and earlier, API Management reserves the subnet by creating a resource navigation link. If the subnet already contains a resource from a different provider, deployment will **fail**. Similarly, when you delete an API Management service, or move it to a different subnet, the resource navigation link will be removed.

## <a name="subnet-size"> </a> Subnet Size Requirement
Azure reserves some IP addresses within each subnet, which can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance. Three more addresses are used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

In addition to the IP addresses used by the Azure VNET infrastructure, each API Management instance in the subnet uses:
* Two IP addresses per unit of Premium SKU, or 
* One IP address for the Developer SKU. 

Each instance reserves an extra IP address for the external load balancer. When deploying into [internal VNET](./api-management-using-with-internal-vnet.md), the instance requires an extra IP address for the internal load balancer.

Given the calculation above, the minimum size of the subnet in which API Management can be deployed is /29, which gives three usable IP addresses. Each extra scale unit of API Management requires two more IP addresses.

## <a name="routing"> </a> Routing
+ A load balanced public IP address (VIP) will be reserved to provide access to all service endpoints and resources outside the VNET.
  + Load balanced public IP addresses can be found on the **Overview/Essentials** blade in the Azure portal.
+ An IP address from a subnet IP range (DIP) will be used to access resources within the VNET.


* # Prerequisites

+ **An active Azure subscription.** [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ **An API Management instance.** For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

[!INCLUDE [api-management-public-ip-for-vnet](../../includes/api-management-public-ip-for-vnet.md)]

## <a name="enable-vpn"> </a>Enable VNET connection

### Enable VNET connectivity using the Azure portal

1. Go to the [Azure portal](https://portal.azure.com) to find your API management instance. Search for and select **API Management services**.

1. Choose your API Management instance.

1. Select **Virtual network**.
1. Configure the API Management instance to be deployed inside a VNET.

    :::image type="content" source="media/api-management-using-with-vnet/api-management-menu-vnet.png" alt-text="Select VNET in Azure portal.":::

1. Select the desired access type:

    * **Off**: Default type. API Management is not deployed into a VNET.

## <a name="control-plane-ips"> </a> Control Plane IP Addresses

The IP Addresses are divided by **Azure Environment**. When allowing inbound requests, IP addresses marked with **Global** must be permitted, along with the **Region**-specific IP address.

| **Azure Environment**|   **Region**|  **IP address**|
|-----------------|-------------------------|---------------|
| Azure Public| South Central US (Global)| 104.214.19.224|
| Azure Public| North Central US (Global)| 52.162.110.80|
| Azure Public| Australia Central| 20.37.52.67|
| Azure Public| Australia Central 2| 20.39.99.81|
| Azure Public| Australia East| 20.40.125.155|
| Azure Public| Australia Southeast| 20.40.160.107|
| Azure Public| Brazil South| 191.233.24.179|
| Azure Public| Brazil Southeast| 191.232.18.181|
| Azure Public| Canada Central| 52.139.20.34|
| Azure Public| Canada East| 52.139.80.117|
| Azure Public| Central India| 13.71.49.1|
| Azure Public| Central US| 13.86.102.66|
| Azure Public| Central US EUAP| 52.253.159.160|
| Azure Public| East Asia| 52.139.152.27|
| Azure Public| East US| 52.224.186.99|
| Azure Public| East US 2| 20.44.72.3|
| Azure Public| East US 2 EUAP| 52.253.229.253|
| Azure Public| France Central| 40.66.60.111|
| Azure Public| France South| 20.39.80.2|
| Azure Public| Germany North| 51.116.0.0|
| Azure Public| Germany West Central| 51.116.96.0|
| Azure Public| Japan East| 52.140.238.179|
| Azure Public| Japan West| 40.81.185.8|
| Azure Public| Jio India Central| 20.192.234.160|
| Azure Public| Jio India West| 20.193.202.160|
| Azure Public| Korea Central| 40.82.157.167|
| Azure Public| Korea South| 40.80.232.185|
| Azure Public| North Central US| 40.81.47.216|
| Azure Public| North Europe| 52.142.95.35|
| Azure Public| Norway East| 51.120.2.185|
| Azure Public| Norway West| 51.120.130.134|
| Azure Public| South Africa North| 102.133.130.197|
| Azure Public| South Africa West| 102.133.0.79|
| Azure Public| South Central US| 20.188.77.119|
| Azure Public| South India| 20.44.33.246|
| Azure Public| Southeast Asia| 40.90.185.46|
| Azure Public| Switzerland North| 51.107.0.91|
| Azure Public| Switzerland West| 51.107.96.8|
| Azure Public| UAE Central| 20.37.81.41|
| Azure Public| UAE North| 20.46.144.85|
| Azure Public| UK South| 51.145.56.125|
| Azure Public| UK West| 51.137.136.0|
| Azure Public| West Central US| 52.253.135.58|
| Azure Public| West Europe| 51.145.179.78|
| Azure Public| West India| 40.81.89.24|
| Azure Public| West US| 13.64.39.16|
| Azure Public| West US 2| 51.143.127.203|
| Azure Public| West US 3| 20.150.167.160|
| Azure China 21Vianet| China North (Global)| 139.217.51.16|
| Azure China 21Vianet| China East (Global)| 139.217.171.176|
| Azure China 21Vianet| China North| 40.125.137.220|
| Azure China 21Vianet| China East| 40.126.120.30|
| Azure China 21Vianet| China North 2| 40.73.41.178|
| Azure China 21Vianet| China East 2| 40.73.104.4|
| Azure Government| USGov Virginia (Global)| 52.127.42.160|
| Azure Government| USGov Texas (Global)| 52.127.34.192|
| Azure Government| USGov Virginia| 52.227.222.92|
| Azure Government| USGov Iowa| 13.73.72.21|
| Azure Government| USGov Arizona| 52.244.32.39|
| Azure Government| USGov Texas| 52.243.154.118|
| Azure Government| USDoD Central| 52.182.32.132|
| Azure Government| USDoD East| 52.181.32.192|

## <a name="related-content"> </a>Related content
* [Connecting a Virtual Network to backend using Vpn Gateway](../vpn-gateway/design.md#s2smulti)
* [Connecting a Virtual Network from different deployment models](../vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md)
* [How to use the API Inspector to trace calls in Azure API Management](api-management-howto-api-inspector.md)
* [Virtual Network Frequently asked Questions](../virtual-network/virtual-networks-faq.md)
* [Service tags](../virtual-network/network-security-groups-overview.md#service-tags)

[api-management-using-vnet-menu]: ./media/api-management-using-with-vnet/api-management-menu-vnet.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-using-with-vnet/api-management-using-vnet-add-api.png
[api-management-vnet-private]: ./media/virtual-network-concepts/api-management-vnet-internal.png
[api-management-vnet-public]: ./media/virtual-network-concepts/api-management-vnet-external.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content

[UDRs]: ../virtual-network/virtual-networks-udr-overview.md
[Network Security Group]: ../virtual-network/network-security-groups-overview.md
[ServiceEndpoints]: ../virtual-network/virtual-network-service-endpoints-overview.md
[ServiceTags]: ../virtual-network/network-security-groups-overview.md#service-tags
