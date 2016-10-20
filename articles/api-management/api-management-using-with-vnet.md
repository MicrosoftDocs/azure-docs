<properties
	pageTitle="How to setup VPN connections in Azure API Management"
	description="Learn how to setup a VPN connection in Azure API Management and access web services through it."
	services="api-management"
	documentationCenter=""
	authors="antonba"
	manager="erikre"
	editor=""/>

<tags
	ms.service="api-management"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/09/2016"
	ms.author="antonba"/>

# How to use Azure API Management with virtual networks

{{TODO: Please update the screenshot with theones reflecting new labels and ideally with better res.}}

Azure API Management can be connected to a virtual network (VNET) to ensure secure connection to the backend services hosted on Azure and on-premises and inaccessbile to the public internet. API Management supports both private and public [Express Route](../expressroute/expressroute-introduction.md) peering. Additionally, API Management gateway, developer portal and management edmpoints can be made accessible only from within the VNET.


## <a name="enable-vpn"> </a>Enable VNET connection

>VNET connectivity is only available in the **Premium** and **Developer** tiers. To switch between the tiers, open your API Management service in the Azure Portal and then open the **Scale and pricing** tab. Under the **Pricing tier** section select the Premium tier and click Save.

To enable VNET connectivity, open your API Management service in the Azure Portal and open the **Virtual network** tab. Select the desired access type:

* **External**: the API Management gateway and developer portal will be accessible from the public internet. The virtual network connection will be used only to connect to a backend.
* **Internal**: the API Management gateway and developer portal will only be accessible from within the virtual network.

Under the Virtual network section, switch **Virtual network connection** to **On**.

![Virtual network menu of API Management][api-management-using-vnet-menu]

You will now see a list of all regions where your API Management service is provisioned.

Select a VNET and subnet for every region. The list is populated with both classic and ARM virtual networks available in your Azure subscriptions that are setup in the region you are configuring.

![Select VPN][api-management-setup-vpn-select]

Click **Save** at the top of the screen. You will not be able to perform management operations on the API Management service while it is updating. The API Management gateway and Developer portal will remain available. {{TODO: Anton please check is the last statement holds for Developer tier instances}}

Note that the VIP address of the API Management instance is likely to change each time VNET is enabled or disabled.

## <a name="connect-vpn"> </a>Connect to a web service hosted within a virtual Network

After your API Management service is connected to the VNET, accessing backend services within it is no different than accessing public services. Just type in the local IP address or the host name (if a DNS server was configured for the VNET) of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]

## Required ports for API Management VPN support

When an API Management service instance is hosted in a VNET it uses the ports [described here](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server). If these ports are blocked, the service may not function correctly or become inaccesible for management operations. Having one or more of these ports blocked is the most common misconfiguration issue when using API Management with virtual networks.

## <a name="custom-dns"> </a>Custom DNS server setup

API Management depends on a number of Azure services. When an API Management service instance is hosted in a VNET where a custom DNS server is used, it needs to be able to resolve hostnames of those Azure services. Please follow [this](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) guidance on custom DNS setup. {{TODO: Anton, which specific names we depend on? Are they listed in the ports document?}}

## <a name="topographies"> </a>Supported topologies
{{TODO: Anton, let's discuss this and section the follow with Samir. I think you might be mistaking peering for access type or vice versa.}}

Virtual networks can be used with API Management in a number of possible topologies.The connection between the API Management gateway and the virtual network can be established via:

* ExpressRoute with private peering
* ExpressRoute with public peering
* IPSec tunnel

The configuration on the API Management side is the same in all cases. The relevant configuration is done on the [virtual network side](../virtual-network/virtual-networks-create-vnet-arm-pportal/).

### ExpressRoute with private peering

![ExpressRoute with private peering][api-management-vnet-er-private]

### ExpressRoute with public peering

![ExpressRoute with private peering][api-management-vnet-er-public]

### IPSec tunnel

![IPSec tunnel][api-management-vnet-ipsec]

## <a name="related-content"> </a>Related content


* [Create a virtual network with a site-to-site VPN connection using the Azure Portal][]
* [How to use the API Inspector to trace calls in Azure API Management][]

[api-management-using-vnet-menu]: ./media/api-management-using-with-vnet/api-management-menu-vnet.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-using-with-vnet/api-management-using-vnet-add-api.png
[api-management-vnet-er-private]: ./media/api-management-using-with-vnet/api-management-using-vnet-er-private.png
[api-management-vnet-er-public]: ./media/api-management-using-with-vnet/api-management-using-vnet-er-public.png
[api-management-vnet-ipsec]: ./media/api-management-using-with-vnet/api-management-using-vnet-ipsec.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content


[Create a virtual network with a site-to-site VPN connection using the Azure Portal]: ../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md
[How to use the API Inspector to trace calls in Azure API Management]: api-management-howto-api-inspector.md
