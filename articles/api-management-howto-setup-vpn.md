<properties
	pageTitle="How to setup VPN connections in Azure API Management"
	description="Learn how to setup a VPN connection in Azure API Management and access web services through it."
	services="api-management"
	documentationCenter=""
	authors="antonba"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="api-management"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/24/2015"
	ms.author="antonba"/>

# How to setup VPN connections in Azure API Management

API Management's VPN support allows you to connect your API Management proxy to an Azure Virtual Network. This allows API Management customers to securely connect to their backend web services that are on-premises or are otherwise inaccessible to the public internet.

## <a name="enable-vpn"> </a>Enable VPN connections

>VPN connectivity is only available in the **Premium** tier. To switch to it, open your API Management service in the [Management Portal][] and then open the **Scale** tab. Under the **General** section select the Premium tier and click Save.

To enable VPN connectivity, open your API Management service in the [Management Portal][] and switch to the **Configure** tab. 

Under the VPN section, switch **VPN connection** to **On**.

![Configure tab of API Management instance][api-management-setup-vpn-configure]

You will now see a list of all regions where your API Management service is provisioned.

Select a VPN and subnet for every region. The list of VPNs is populated based on the virtual networks available in your Azure subscription that are setup in the region you are configuring.

![Select VPN][api-management-setup-vpn-select]

Click **Save** at the bottom of the screen. You will not be able to perform other operations on the API Management service from the Azure management portal while it is updating. The service proxy will remain available and runtime calls should not be affected.

Note that the VIP address of the proxy will change each time VPN is enabled or disabled.

## <a name="connect-vpn"> </a>Connect to a web service behind VPN

After your API Management service is connected to the VPN, accessing web services within the virtual network is no different than accessing public services. Just type in the local address or the host name (if a DNS server was configured for the Azure Virtual Network) of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]


## <a name="related-content"> </a>Related content


 * [Tutorial: Create a Cross-Premises Virtual Network for Site-to-Site Connectivity][]
 * [How to use the API Inspector to trace calls in Azure API Management][]

[api-management-setup-vpn-configure]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-configure.png
[api-management-setup-vpn-select]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-add-api.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content

[Management Portal]: https://manage.windowsazure.com/

[Tutorial: Create a Cross-Premises Virtual Network for Site-to-Site Connectivity]: ../virtual-networks-create-site-to-site-cross-premises-connectivity
[How to use the API Inspector to trace calls in Azure API Management]: api-management-howto-api-inspector.md
