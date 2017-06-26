---
title: How to use Azure API Management with virtual networks
description: Learn how to setup a connection to a virtual network in Azure API Management and access web services through it.
services: api-management
documentationcenter: ''
author: antonba
manager: erikre
editor: ''

ms.assetid: 64b58f7b-ca22-47dc-89c0-f6bb0af27a48
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/15/2016
ms.author: apimpm

---
# How to use Azure API Management with virtual networks
Azure Virtual Networks (VNETs) allow you to place any of your Azure resources in a non-internet routeable network that you control access to. These networks can then be connected to your on-premise networks using various VPN technologies. To learn more about Azure Virtual Networks start with the information here: [Azure Virtual Network Overview](../virtual-network/virtual-networks-overview.md).

Azure API Management can be deployed inside the virtual network (VNET), so it can access backend services within the network. The developer portal and API gateway, can be configured to be accessible either from the Internet or only within the virtual network.

> [!NOTE]
> Azure API Management supports both classic and Azure Resource Manager VNets.
>
>

## <a name="enable-vpn"> </a>Enable VNET connection
> [!NOTE]
> VNET connectivity is available in the **Premium** and **Developer** tiers. To switch between the tiers, open your API Management
> service in the Azure portal and then open the **Scale and pricing** tab. Under the **Pricing tier** section, select the Premium or
> Developer tier and click Save.
>

To enable VNET connectivity, open your API Management service in the Azure portal and open the **Virtual network** page.

![Virtual network menu of API Management][api-management-using-vnet-menu]

Select the desired access type:

* **External**: the API Management gateway and developer portal are accessible from the public internet via an external load balancer. The gateway can access resources within the virtual network.

![Public peering][api-management-vnet-public]

* **Internal**: the API Management gateway and developer portal are accessible only from within the virtual network via an internal load balancer. The gateway can access resources within the virtual network.

![Private peering][api-management-vnet-private]

You will now see a list of all regions where your API Management service is provisioned. Select a VNET and subnet for every region. The list is populated with both classic and Resource Manager virtual networks available in your Azure subscriptions that are setup in the region you are configuring.

> [!NOTE]
> **Service Endpoint** in the above diagram includes Gateway/Proxy, Publisher Portal, Developer Portal, GIT, and the Direct Management Endpoint.
> **Management Endpoint** in the above diagram is the endpoint hosted on the service to manage configuration via Azure portal and Powershell.
> Also, note, that, even though, the diagram shows IP Addresses for its various endpoints, API Management service **only** responds on its configured Hostnames.

> [!IMPORTANT]
> When deploying an Azure API Management instance to a Resource Manager VNET, the service must be in a dedicated subnet that contains no other resources except for Azure API Management instances. If an attempt is made to deploy an Azure API Management instance to a Resource Manager VNET subnet that contains other resources, the deployment will fail.
>
>

![Select VPN][api-management-setup-vpn-select]

Click **Save** at the top of the screen.

> [!NOTE]
> The VIP address of the API Management instance will change each time VNET is enabled or disabled.  
> The VIP address will also change when API Management is moved from **External** to **Internal** or vice-versa
>


> [!IMPORTANT]
> If you remove API Management from a VNET or change the one it is deployed in, the previously used VNET can remain locked for up to 4 hours. During this period it will not be possible to delete the VNET or deploy a new resource to it.

## <a name="enable-vnet-powershell"> </a>Enable VNET connection using PowerShell cmdlets
You can also enable VNET connectivity using the PowerShell cmdlets

* **Create an API Management service inside a VNET**: Use the cmdlet [New-AzureRmApiManagement](/powershell/module/azurerm.apimanagement/new-azurermapimanagement) to create an Azure API Management service inside a VNET.

* **Deploy an existing API Management service inside a VNET**: Use the cmdlet [Update-AzureRmApiManagementDeployment](/powershell/module/azurerm.apimanagement/update-azurermapimanagementdeployment) to move an existing Azure API Management service inside a Virtual Network.

## <a name="connect-vnet"> </a>Connect to a web service hosted within a virtual Network
After your API Management service is connected to the VNET, accessing backend services within it is no different than accessing public services. Just type in the local IP address or the host name (if a DNS server is configured for the VNET) of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]

## <a name="network-configuration-issues"> </a>Common Network Configuration Issues
Following is a list of common misconfiguration issues that can occur while deploying API Management service into a Virtual Network.

* **Custom DNS server setup**: The API Management service depends on several Azure services. When API Management is hosted in a VNET with a custom DNS server, it needs to resolve the hostnames of those Azure services. Please follow [this](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) guidance on custom DNS setup. See the ports table below and other network requirements for reference.

> [!IMPORTANT]
> It is recommended that, if you are using a Custom DNS Server for the VNET, you set that up **before** deploying an API Management service into it. Otherwise we need to restart the CloudService hosting the service, for it to pick up the new DNS Server settings.
>

* **Ports required for API Management**: Inbound and Outbound traffic into the Subnet in which API Management is deployed can be controlled using [Network Security Group][Network Security Group]. If any of these ports are unavailable, API Management may not operate properly and may become inaccessible. Having one or more of these ports blocked is another common misconfiguration issue when using API Management with a VNET.

When an API Management service instance is hosted in a VNET, the ports in the following table are used.

| Source / Destination Port(s) | Direction | Transport protocol | Purpose | Source / Destination | Access type |
| --- | --- | --- | --- | --- | --- |
| * / 80, 443 |Inbound |TCP |Client communication to API Management |INTERNET / VIRTUAL_NETWORK |External |
| * / 3443 |Inbound |TCP |Management endpoint for Azure portal and Powershell |INTERNET / VIRTUAL_NETWORK |External & Internal |
| * / 80, 443 |Outbound |TCP |Dependency on Azure Storage and Azure Service Bus |VIRTUAL_NETWORK / INTERNET |External & Internal |
| * / 1433 |Outbound |TCP |Dependency on Azure SQL |VIRTUAL_NETWORK / INTERNET |External & Internal |
| * / 11000 - 11999 |Outbound |TCP |Dependency on Azure SQL V12 |VIRTUAL_NETWORK / INTERNET |External & Internal |
| * / 14000 - 14999 |Outbound |TCP |Dependency on Azure SQL V12 |VIRTUAL_NETWORK / INTERNET |External & Internal |
| * / 5671 |Outbound |AMQP |Dependency for Log to Event Hub policy and monitoring agent |VIRTUAL_NETWORK / INTERNET |External & Internal |
| 6381 - 6383 / 6381 - 6383 |Inbound & Outbound |UDP |Dependency on Redis Cache |VIRTUAL_NETWORK / VIRTUAL_NETWORK |External & Internal |-
| * / 445 |Outbound |TCP |Dependency on Azure File Share for GIT |VIRTUAL_NETWORK / INTERNET |External & Internal |
| * / * | Inbound |TCP |Azure Infrastructure Load Balancer | AZURE_LOAD_BALANCER / VIRTUAL_NETWORK |External & Internal |

* **SSL functionality**: To enable SSL certificate chain building and validation the API Management service needs Outbound network connectivity to ocsp.msocsp.com, mscrl.microsoft.com and crl.microsoft.com.

* **Metrics and Health Monitoring**: Outbound network connectivity to Azure Monitoring endpoints, which resolve under the following domains: global.metrics.nsatc.net, shoebox2.metrics.nsatc.net, prod3.metrics.nsatc.net.

* **Express Route Setup**: A common customer configuration is to define their own default route (0.0.0.0/0) which forces outbound Internet traffic to instead flow on-premises. This traffic flow invariably breaks connectivity with Azure API Management because the outbound traffic is either blocked on-premises, or NAT'd to an unrecognizable set of addresses that no longer work with various Azure endpoints. The solution is to define one (or more) user-defined routes ([UDRs][UDRs]) on the subnet that contains the Azure API Management. A UDR defines subnet-specific routes that will be honored instead of the default route.
  If possible, it is recommended to use the following configuration:
 * The ExpressRoute configuration advertises 0.0.0.0/0 and by default force tunnels all outbound traffic on-premises.
 * The UDR applied to the subnet containing the Azure API Management defines 0.0.0.0/0 with a next hop type of Internet.
 The combined effect of these steps is that the subnet level UDR takes precedence over the ExpressRoute forced tunneling, thus ensuring outbound Internet access from the Azure API Management.

>[!WARNING]  
>Azure API Management is not supported with ExpressRoute configurations that **incorrectly cross-advertise routes from the public peering path to the private peering path**. ExpressRoute configurations that have public peering configured, will receive route advertisements from Microsoft for a large set of Microsoft Azure IP address ranges. If these address ranges are incorrectly cross-advertised on the private peering path, the end result is that all outbound network packets from the Azure API Management instance's subnet are incorrectly force-tunneled to a customer's on-premises network infrastructure. This network flow breaks Azure API Management. The solution to this problem is to stop cross-advertising routes from the public peering path to the private peering path.

## <a name="limitations"> </a>Limitations
* A subnet containing API Management instances cannot contain any other Azure resource types.
* The subnet and the API Management service must be in the same subscription.
* A subnet containing API Management instances cannot be moved across subscriptions.
* When using an internal virtual network, only an internal IP address will be available from the range stated in [RFC 1918](https://tools.ietf.org/html/rfc1918), a public IP address cannot be provided.
* For multi-region API Management deployments, with Internal virtual networks configured, users are responsible for managing their own load balancing as they own the DNS.


## <a name="related-content"> </a>Related content
* [Connecting a Virtual Network to backend using Vpn Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md#site-to-site-and-multi-site-ipsecike-vpn-tunnel)
* [Connecting a Virtual Network from different deployment models](../vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md)
* [How to use the API Inspector to trace calls in Azure API Management](api-management-howto-api-inspector.md)

[api-management-using-vnet-menu]: ./media/api-management-using-with-vnet/api-management-menu-vnet.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-type.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-using-with-vnet/api-management-using-vnet-add-api.png
[api-management-vnet-private]: ./media/api-management-using-with-vnet/api-management-vnet-private.png
[api-management-vnet-public]: ./media/api-management-using-with-vnet/api-management-vnet-public.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content

[UDRs]: ../virtual-network/virtual-networks-udr-overview.md
[Network Security Group]: ../virtual-network/virtual-networks-nsg.md
