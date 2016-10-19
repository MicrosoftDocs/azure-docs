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

# How to use Azure API Management with Virtual Networks

Azure API Management can be connected to a Virtual Network so customers can securely connect to backend services that are on-premises or otherwise inaccessbile to the public internet. Additionally, the API frontend can be made accessible only to consumers within the Virtual Network.


## <a name="enable-vpn"> </a>Enable VPN connections

>VPN connectivity is only available in the **Premium** and **Developer** tiers. To switch to it, open your API Management service in the AzurePortal and then open the **Scale and pricing** tab. Under the **Pricing tier** section select the Premium tier and click Save.

To enable VPN connectivity, open your API Management service in the Azure Portal and open the **VPN** tab. Select the desired type of peering:

* **External**: public peering means that the API Management gateway and developer portal will be accessible from the public internet. The virtual network connection will be used only to connect to a backend.
* **Internal**: private peering means that the API Management gateway and developer portal will only be accessible from within the Virtual Network.

Under the VPN section, switch **VPN connection** to **On**.

![Virtual network menu of API Management][api-management-using-vnet-menu]

You will now see a list of all regions where your API Management service is provisioned.

Select a VNet and subnet for every region. The list is populated with both classic and ARM virtual networks available in your Azure subscription that are setup in the region you are configuring.

![Select VPN][api-management-setup-vpn-select]

Click **Save** at the top of the screen. You will not be able to perform other operations on the API Management service from the Azure Portal while it is updating. The service gateway will remain available and runtime calls should not be affected.

Note that the VIP address of the gateway will change each time VPN is enabled or disabled.

## <a name="connect-vpn"> </a>Connect to a web service behind a Virtual Network

After your API Management service is connected to the VNet, accessing web services within it is no different than accessing public services. Just type in the local address or the host name (if a DNS server was configured for the Azure Virtual Network) of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]

## Required ports for API Management VPN support

When an API Management service instance is hosted in a VNET it uses the ports [described here](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server). If these ports are blocked, the service may not function correctly. Having one or more of these ports blocked is the most common misconfiguration issue when using API Management with a VNET.

## <a name="custom-dns"> </a>Custom DNS server setup

API Management depends on a number of Azure services. When an API Management service instance is hosted in a VNET where a custom DNS server is used, it needs to be able to resolve hostnames of those Azure services. Please follow [this](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) guidance on custom DNS setup.

## <a name="topographies"> </a>Supported topographies

Virtual networks can be used with API Management in a number of possible topograpies.The connection between the API gateway and the virtual network can be established via:

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
