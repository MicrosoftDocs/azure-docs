---
title: How to use Azure API Management with virtual networks
description: Learn how to setup a connection to a virtual network in Azure API Management and access web services through it.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 06/10/2020
ms.author: apimpm
ms.custom: references_regions
---
# How to use Azure API Management with virtual networks
Azure Virtual Networks (VNETs) allow you to place any of your Azure resources in a non-internet routable network that you control access to. These networks can then be connected to your on-premises networks using various VPN technologies. To learn more about Azure Virtual Networks start with the information here: [Azure Virtual Network Overview](../virtual-network/virtual-networks-overview.md).

Azure API Management can be deployed inside the virtual network (VNET), so it can access backend services within the network. The developer portal and API gateway, can be configured to be accessible either from the Internet or only within the virtual network.

> [!NOTE]
> The API import document URL must be hosted on a publicly accessible internet address.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

To perform the steps described in this article, you must have:

+ An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ An APIM instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

## <a name="enable-vpn"> </a>Enable VNET connection

### Enable VNET connectivity using the Azure portal

1. Go to the [Azure portal](https://portal.azure.com) to find your API management instance. Search for and select **API Management services**.

2. Choose your API Management instance.

3. Select **Virtual network**.
4. Configure the API Management instance to be deployed inside a Virtual network.

    ![Virtual network menu of API Management][api-management-using-vnet-menu]
5. Select the desired access type:

    * **Off**: This is the default. API Management is not deployed into a virtual network.

    * **External**: The API Management gateway and developer portal are accessible from the public internet via an external load balancer. The gateway can access resources within the virtual network.

        ![Public peering][api-management-vnet-public]

    * **Internal**: The API Management gateway and developer portal are accessible only from within the virtual network via an internal load balancer. The gateway can access resources within the virtual network.

        ![Private peering][api-management-vnet-private]

6. If you selected **External** or **Internal**, you will see a list of all regions where your API Management service is provisioned. Choose a **Location**, and then pick its **Virtual network** and **Subnet**. The virtual network list is populated with both classic and Resource Manager virtual networks available in your Azure subscriptions that are set up in the region you are configuring.

    > [!IMPORTANT]
    > When deploying an Azure API Management instance to a Resource Manager VNET, the service must be in a dedicated subnet that contains no other resources except for Azure API Management instances. If an attempt is made to deploy an Azure API Management instance to a Resource Manager VNET subnet that contains other resources, the deployment will fail.

    Then select **Apply**. The **Virtual network** page of your API Management instance is updated with your new virtual network and subnet choices.

    ![Select VPN][api-management-setup-vpn-select]

7. In the top navigation bar, select **Save**, and then select **Apply network configuration**.

> [!NOTE]
> The VIP address of the API Management instance will change each time VNET is enabled or disabled.
> The VIP address will also change when API Management is moved from **External** to **Internal**, or vice-versa.
>

> [!IMPORTANT]
> If you remove API Management from a VNET or change the one it is deployed in, the previously used VNET can remain locked for up to six hours. During this period it will not be possible to delete the VNET or deploy a new resource to it. This behavior is true for clients using api-version 2018-01-01 and earlier. Clients using api-version 2019-01-01 and later, the VNET is freed up as soon as the associated API Management service is deleted.

## <a name="enable-vnet-powershell"> </a>Enable VNET connection using PowerShell cmdlets
You can also enable VNET connectivity using the PowerShell cmdlets.

* **Create an API Management service inside a VNET**: Use the cmdlet [New-AzApiManagement](/powershell/module/az.apimanagement/new-azapimanagement) to create an Azure API Management service inside a VNET.

* **Deploy an existing API Management service inside a VNET**: Use the cmdlet [Update-AzApiManagementRegion](/powershell/module/az.apimanagement/update-azapimanagementregion) to move an existing Azure API Management service inside a Virtual Network.

## <a name="connect-vnet"> </a>Connect to a web service hosted within a virtual Network
After your API Management service is connected to the VNET, accessing backend services within it is no different than accessing public services. Just type in the local IP address or the host name (if a DNS server is configured for the VNET) of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]

## <a name="network-configuration-issues"> </a>Common Network Configuration Issues
Following is a list of common misconfiguration issues that can occur while deploying API Management service into a Virtual Network.

* **Custom DNS server setup**: The API Management service depends on several Azure services. When API Management is hosted in a VNET with a custom DNS server, it needs to resolve the hostnames of those Azure services. Please follow [this](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) guidance on custom DNS setup. See the ports table below and other network requirements for reference.

> [!IMPORTANT]
> If you plan to use a Custom DNS Server(s) for the VNET, you should set it up **before** deploying an API Management service into it. Otherwise you need to
> update the API Management service each time you change the DNS Server(s) by running the [Apply Network Configuration Operation](https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/ApiManagementService/ApplyNetworkConfigurationUpdates)

* **Ports required for API Management**: Inbound and Outbound traffic into the Subnet in which API Management is deployed can be controlled using [Network Security Group][Network Security Group]. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible. Having one or more of these ports blocked is another common misconfiguration issue when using API Management with a VNET.

<a name="required-ports"> </a>
When an API Management service instance is hosted in a VNET, the ports in the following table are used.

| Source / Destination Port(s) | Direction          | Transport protocol |   [Service Tags](../virtual-network/security-overview.md#service-tags) <br> Source / Destination   | Purpose (\*)                                                 | Virtual Network type |
|------------------------------|--------------------|--------------------|---------------------------------------|-------------------------------------------------------------|----------------------|
| * / [80], 443                  | Inbound            | TCP                | INTERNET / VIRTUAL_NETWORK            | Client communication to API Management                      | External             |
| * / 3443                     | Inbound            | TCP                | ApiManagement / VIRTUAL_NETWORK       | Management endpoint for Azure portal and PowerShell         | External & Internal  |
| * / 443                  | Outbound           | TCP                | VIRTUAL_NETWORK / Storage             | **Dependency on Azure Storage**                             | External & Internal  |
| * / 443                  | Outbound           | TCP                | VIRTUAL_NETWORK / AzureActiveDirectory | [Azure Active Directory](api-management-howto-aad.md) (where applicable)                   | External & Internal  |
| * / 1433                     | Outbound           | TCP                | VIRTUAL_NETWORK / SQL                 | **Access to Azure SQL endpoints**                           | External & Internal  |
| * / 5671, 5672, 443          | Outbound           | TCP                | VIRTUAL_NETWORK / EventHub            | Dependency for [Log to Event Hub policy](api-management-howto-log-event-hubs.md) and monitoring agent | External & Internal  |
| * / 445                      | Outbound           | TCP                | VIRTUAL_NETWORK / Storage             | Dependency on Azure File Share for [GIT](api-management-configuration-repository-git.md)                      | External & Internal  |
| * / 443                     | Outbound           | TCP                | VIRTUAL_NETWORK / AzureCloud            | Health and Monitoring Extension         | External & Internal  |
| * / 1886, 443                     | Outbound           | TCP                | VIRTUAL_NETWORK / AzureMonitor         | Publish [Diagnostics Logs and Metrics](api-management-howto-use-azure-monitor.md) and [Resource Health](../service-health/resource-health-overview.md)                     | External & Internal  |
| * / 25, 587, 25028                       | Outbound           | TCP                | VIRTUAL_NETWORK / INTERNET            | Connect to SMTP Relay for sending e-mails                    | External & Internal  |
| * / 6381 - 6383              | Inbound & Outbound | TCP                | VIRTUAL_NETWORK / VIRTUAL_NETWORK     | Access Redis Service for [Cache](api-management-caching-policies.md) policies between machines         | External & Internal  |
| * / 4290              | Inbound & Outbound | UDP                | VIRTUAL_NETWORK / VIRTUAL_NETWORK     | Sync Counters for [Rate Limit](api-management-access-restriction-policies.md#LimitCallRateByKey) policies between machines         | External & Internal  |
| * / *                        | Inbound            | TCP                | AZURE_LOAD_BALANCER / VIRTUAL_NETWORK | Azure Infrastructure Load Balancer                          | External & Internal  |

>[!IMPORTANT]
> The Ports for which the *Purpose* is **bold** are required for API Management service to be deployed successfully. Blocking the other ports however will cause **degradation** in the ability to use and **monitor the running service and provide the committed SLA**.

+ **TLS functionality**: To enable TLS/SSL certificate chain building and validation the API Management service needs Outbound network connectivity to ocsp.msocsp.com, mscrl.microsoft.com and crl.microsoft.com. This dependency is not required, if any certificate you upload to API Management contain the full chain to the CA root.

+ **DNS Access**: Outbound access on port 53 is required for communication with DNS servers. If a custom DNS server exists on the other end of a VPN gateway, the DNS server must be reachable from the subnet hosting API Management.

+ **Metrics and Health Monitoring**: Outbound network connectivity to Azure Monitoring endpoints, which resolve under the following domains. As shown in the table, these URLs are represented under the AzureMonitor service tag for use with Network Security Groups.

    | Azure Environment | Endpoints                                                                                                                                                                                                                                                                                                                                                              |
    |-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Azure Public      | <ul><li>gcs.prod.monitoring.core.windows.net(**new**)</li><li>prod.warmpath.msftcloudes.com(**to be deprecated**)</li><li>global.prod.microsoftmetrics.com(**new**)</li><li>global.metrics.nsatc.net(**to be deprecated**)</li><li>shoebox2.prod.microsoftmetrics.com(**new**)</li><li>shoebox2.metrics.nsatc.net(**to be deprecated**)</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>shoebox2-red.shoebox2.metrics.nsatc.net</li><li>shoebox2-black.shoebox2.metrics.nsatc.net</li><li>prod3.prod.microsoftmetrics.com(**new**)</li><li>prod3.metrics.nsatc.net(**to be deprecated**)</li><li>prod3-black.prod.microsoftmetrics.com(**new**)</li><li>prod3-black.prod3.metrics.nsatc.net(**to be deprecated**)</li><li>prod3-red.prod.microsoftmetrics.com(**new**)</li><li>prod3-red.prod3.metrics.nsatc.net(**to be deprecated**)</li><li>gcs.prod.warm.ingestion.monitoring.azure.com</li></ul> |
    | Azure Government  | <ul><li>fairfax.warmpath.usgovcloudapi.net</li><li>global.prod.microsoftmetrics.com(**new**)</li><li>global.metrics.nsatc.net(**to be deprecated**)</li><li>shoebox2.prod.microsoftmetrics.com(**new**)</li><li>shoebox2.metrics.nsatc.net(**to be deprecated**)</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>shoebox2-red.shoebox2.metrics.nsatc.net</li><li>shoebox2-black.shoebox2.metrics.nsatc.net</li><li>prod3.prod.microsoftmetrics.com(**new**)</li><li>prod3.metrics.nsatc.net(**to be deprecated**)</li><li>prod3-black.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>prod5.prod.microsoftmetrics.com</li><li>prod5-black.prod.microsoftmetrics.com</li><li>prod5-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.us</li></ul>                                                                                                                                                                                                                                                |
    | Azure China 21Vianet     | <ul><li>mooncake.warmpath.chinacloudapi.cn</li><li>global.prod.microsoftmetrics.com(**new**)</li><li>global.metrics.nsatc.net(**to be deprecated**)</li><li>shoebox2.prod.microsoftmetrics.com(**new**)</li><li>shoebox2.metrics.nsatc.net(**to be deprecated**)</li><li>shoebox2-red.prod.microsoftmetrics.com</li><li>shoebox2-black.prod.microsoftmetrics.com</li><li>shoebox2-red.shoebox2.metrics.nsatc.net</li><li>shoebox2-black.shoebox2.metrics.nsatc.net</li><li>prod3.prod.microsoftmetrics.com(**new**)</li><li>prod3.metrics.nsatc.net(**to be deprecated**)</li><li>prod3-black.prod.microsoftmetrics.com</li><li>prod3-red.prod.microsoftmetrics.com</li><li>prod5.prod.microsoftmetrics.com</li><li>prod5-black.prod.microsoftmetrics.com</li><li>prod5-red.prod.microsoftmetrics.com</li><li>gcs.prod.warm.ingestion.monitoring.azure.cn</li></ul>                                                                                                                                                                                                                                                |

  >[!IMPORTANT]
  > The change of clusters above with dns zone **.nsatc.net** to **.microsoftmetrics.com** is mostly a DNS Change. IP Address of cluster will not change.

+ **Regional Service Tags**: NSG rules allowing outbound connectivity to Storage, SQL, and Event Hubs service tags may use the regional versions of those tags corresponding to the region containing the API Management instance (for example, Storage.WestUS for an API Management instance in the West US region). In multi-region deployments, the NSG in each region should allow traffic to the service tags for that region and the primary region.

+ **SMTP Relay**: Outbound network connectivity for the SMTP Relay, which resolves under the host `smtpi-co1.msn.com`, `smtpi-ch1.msn.com`, `smtpi-db3.msn.com`, `smtpi-sin.msn.com` and `ies.global.microsoft.com`

+ **Developer portal CAPTCHA**: Outbound network connectivity for the developer portal's CAPTCHA, which resolves under the hosts `client.hip.live.com` and `partner.hip.live.com`.

+ **Azure portal Diagnostics**: To enable the flow of diagnostic logs from Azure portal when using the API Management extension from inside a Virtual Network, outbound access to `dc.services.visualstudio.com` on port 443 is required. This helps in troubleshooting issues you might face when using extension.

+ **Azure Load Balancer**: Allowing Inbound request from Service Tag `AZURE_LOAD_BALANCER` is not a requirement for the `Developer` SKU, since we only deploy one unit of Compute behind it. But Inbound from [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md) becomes critical when scaling to higher SKU like `Premium`, as failure of Health Probe from Load Balancer, fails a deployment.

+ **Force Tunneling Traffic to On-premises Firewall Using Express Route or Network Virtual Appliance**: A common customer configuration is to define their own default route (0.0.0.0/0) which forces all traffic from the API Management delegated subnet to flow through an on-premises firewall or to a Network virtual appliance. This traffic flow invariably breaks connectivity with Azure API Management because the outbound traffic is either blocked on-premises, or NAT'd to an unrecognizable set of addresses that no longer work with various Azure endpoints. The solution requires you to do a couple of things:

  * Enable service endpoints on the subnet in which the API Management service is deployed. [Service Endpoints][ServiceEndpoints] need to be enabled for Azure Sql, Azure Storage, Azure EventHub and Azure ServiceBus. Enabling endpoints directly from API Management delegated subnet to these services allows them to use the Microsoft Azure backbone network providing optimal routing for service traffic. If you use Service Endpoints with a forced tunneled Api Management, the above Azure services traffic isn't forced tunneled. The other API Management service dependency traffic is forced tunneled and can't be lost or the API Management service would not function properly.
    
  * All the control plane traffic from Internet to the management endpoint of your API Management service are routed through a specific set of Inbound IPs hosted by API Management. When the traffic is force tunneled the responses will not symmetrically map back to these Inbound source IPs. To overcome the limitation, we need to add the following user-defined routes ([UDRs][UDRs]) to steer traffic back to Azure by setting the destination of these host routes to "Internet". The set of Inbound IPs for control Plane traffic is documented [Control Plane IP Addresses](#control-plane-ips)

  * For other API Management service dependencies which are force tunneled, there should be a way to resolve the hostname and reach out to the endpoint. These include
      - Metrics and Health Monitoring
      - Azure portal Diagnostics
      - SMTP Relay
      - Developer portal CAPTCHA

## <a name="troubleshooting"> </a>Troubleshooting
* **Initial Setup**: When the initial deployment of API Management service into a subnet does not succeed, it is advised to first deploy a virtual machine into the same subnet. Next remote desktop into the virtual machine and validate that there is connectivity to one of each resource below in your Azure subscription
    * Azure Storage blob
    * Azure SQL Database
    * Azure Storage Table

  > [!IMPORTANT]
  > After you have validated the connectivity, make sure to remove all the resources deployed in the subnet, before deploying API Management into the subnet.

* **Incremental Updates**: When making changes to your network, refer to [NetworkStatus API](https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/networkstatus), to verify that the API Management service has not lost access to any of the critical resources, which it depends upon. The connectivity status should be updated every 15 minutes.

* **Resource Navigation Links**: When deploying into Resource Manager style vnet subnet, API Management reserves the subnet, by creating a resource navigation Link. If the subnet already contains a resource from a different provider, deployment will **fail**. Similarly, when you move an API Management service to a different subnet or delete it, we will remove that resource navigation link.

## <a name="subnet-size"> </a> Subnet Size Requirement
Azure reserves some IP addresses within each subnet, and these addresses can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance, along with three more addresses used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets)

In addition to the IP addresses used by the Azure VNET infrastructure, each Api Management instance in the subnet uses two IP addresses per unit of Premium SKU or one IP address for the Developer SKU. Each instance reserves an additional IP address for the external load balancer. When deploying into Internal virtual network, it requires an additional IP address for the internal load balancer.

Given the calculation above the minimum size of the subnet, in which API Management can be deployed is /29 that gives three usable IP addresses.

Each additional scale unit of API Management requires two more IP addresses.

## <a name="routing"> </a> Routing
+ A load balanced public IP address (VIP) will be reserved to provide access to all service endpoints.
+ An IP address from a subnet IP range (DIP) will be used to access resources within the vnet and a public IP address (VIP) will be used to access resources outside the vnet.
+ Load balanced public IP address can be found on the Overview/Essentials blade in the Azure portal.

## <a name="limitations"> </a>Limitations
* A subnet containing API Management instances cannot contain any other Azure resource types.
* The subnet and the API Management service must be in the same subscription.
* A subnet containing API Management instances cannot be moved across subscriptions.
* For multi-region API Management deployments configured in Internal virtual network mode, users are responsible for managing the load balancing across multiple regions, as they own the routing.
* Connectivity from a resource in a globally peered VNET in another region to API Management service in Internal mode will not work due to platform limitation. For more information, see [Resources in one virtual network cannot communicate with Azure internal load balancer in peered virtual network](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints)

## <a name="control-plane-ips"> </a> Control Plane IP Addresses

The IP Addresses are divided by **Azure Environment**. When allowing inbound requests IP address marked with **Global** must be whitelisted along with the **Region** specific IP Address.

| **Azure Environment**|   **Region**|  **IP address**|
|-----------------|-------------------------|---------------|
| Azure Public| South Central US (Global)| 104.214.19.224|
| Azure Public| North Central US (Global)| 52.162.110.80|
| Azure Public| West Central US| 52.253.135.58|
| Azure Public| Korea Central| 40.82.157.167|
| Azure Public| UK West| 51.137.136.0|
| Azure Public| Japan West| 40.81.185.8|
| Azure Public| North Central US| 40.81.47.216|
| Azure Public| UK South| 51.145.56.125|
| Azure Public| West India| 40.81.89.24|
| Azure Public| East US| 52.224.186.99|
| Azure Public| West Europe| 51.145.179.78|
| Azure Public| Japan East| 52.140.238.179|
| Azure Public| France Central| 40.66.60.111|
| Azure Public| Canada East| 52.139.80.117|
| Azure Public| UAE North| 20.46.144.85|
| Azure Public| Brazil South| 191.233.24.179|
| Azure Public| Southeast Asia| 40.90.185.46|
| Azure Public| South Africa North| 102.133.130.197|
| Azure Public| Canada Central| 52.139.20.34|
| Azure Public| Korea South| 40.80.232.185|
| Azure Public| Central India| 13.71.49.1|
| Azure Public| West US| 13.64.39.16|
| Azure Public| Australia Southeast| 20.40.160.107|
| Azure Public| Australia Central| 20.37.52.67|
| Azure Public| South India| 20.44.33.246|
| Azure Public| Central US| 13.86.102.66|
| Azure Public| Australia East| 20.40.125.155|
| Azure Public| West US 2| 51.143.127.203|
| Azure Public| East US 2 EUAP| 52.253.229.253|
| Azure Public| Central US EUAP| 52.253.159.160|
| Azure Public| South Central US| 20.188.77.119|
| Azure Public| East US 2| 20.44.72.3|
| Azure Public| North Europe| 52.142.95.35|
| Azure Public| East Asia| 52.139.152.27|
| Azure Public| France South| 20.39.80.2|
| Azure Public| Switzerland West| 51.107.96.8|
| Azure Public| Australia Central 2| 20.39.99.81|
| Azure Public| UAE Central| 20.37.81.41|
| Azure Public| Switzerland North| 51.107.0.91|
| Azure Public| South Africa West| 102.133.0.79|
| Azure Public| Germany West Central| 51.116.96.0|
| Azure Public| Germany North| 51.116.0.0|
| Azure Public| Norway East| 51.120.2.185|
| Azure Public| Norway West| 51.120.130.134|
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
* [Service tags](../virtual-network/security-overview.md#service-tags)

[api-management-using-vnet-menu]: ./media/api-management-using-with-vnet/api-management-menu-vnet.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-using-with-vnet/api-management-using-vnet-add-api.png
[api-management-vnet-private]: ./media/api-management-using-with-vnet/api-management-vnet-internal.png
[api-management-vnet-public]: ./media/api-management-using-with-vnet/api-management-vnet-external.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content

[UDRs]: ../virtual-network/virtual-networks-udr-overview.md
[Network Security Group]: ../virtual-network/security-overview.md
[ServiceEndpoints]: ../virtual-network/virtual-network-service-endpoints-overview.md
[ServiceTags]: ../virtual-network/security-overview.md#service-tags
