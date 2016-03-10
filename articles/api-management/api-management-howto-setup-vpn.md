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
	ms.date="03/10/2016"
	ms.author="antonba"/>

# How to setup VPN connections in Azure API Management

API Management's VPN support allows you to connect your API Management gateway to an Azure Virtual Network (classic). This allows API Management customers to securely connect to their backend web services that are on-premises or are otherwise inaccessible to the public internet.

>[AZURE.NOTE] Azure API Management works with classic VNETs. For information on creating a classic VNET, see [Create a virtual network (classic) by using the Azure Portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md). For information on connecting classic VNETs to ARM VNETS, see [Connecting classic VNets to new VNets](../virtual-network/virtual-networks-arm-asm-s2s.md).

## <a name="enable-vpn"> </a>Enable VPN connections

>VPN connectivity is only available in the **Premium** tier. To switch to it, open your API Management service in the [Azure Classic Portal][] and then open the **Scale** tab. Under the **General** section select the Premium tier and click Save.

To enable VPN connectivity, open your API Management service in the [Azure Classic Portal][] and switch to the **Configure** tab. 

Under the VPN section, switch **VPN connection** to **On**.

![Configure tab of API Management instance][api-management-setup-vpn-configure]

You will now see a list of all regions where your API Management service is provisioned.

Select a VPN and subnet for every region. The list of VPNs is populated based on the virtual networks available in your Azure subscription that are setup in the region you are configuring.

![Select VPN][api-management-setup-vpn-select]

Click **Save** at the bottom of the screen. You will not be able to perform other operations on the API Management service from the Azure Classic Portal while it is updating. The service gateway will remain available and runtime calls should not be affected.

Note that the VIP address of the gateway will change each time VPN is enabled or disabled.

## <a name="connect-vpn"> </a>Connect to a web service behind VPN

After your API Management service is connected to the VPN, accessing web services within the virtual network is no different than accessing public services. Just type in the local address or the host name (if a DNS server was configured for the Azure Virtual Network) of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]

## Required ports for API Management VPN support

When an API Management service instance is hosted in a VNET, the ports in the following table are used. If these ports are blocked, the service may not function correctly. Having one or more of these ports blocked is the most common misconfiguration issue when using API Management with a VNET.

| Port(s)                      | Direction        | Transport Protocol | Purpose                                      | Remote IP        |
|------------------------------|------------------|--------------------|----------------------------------------------|------------------|
| 80, 443                      | Inbound          | HTTP, HTTPS        | Client communication to API Management       | *                |
| 1433                         | Outbound         | TCP                | API Management dependencies on SQL           | AZURE_SQL        |
| 443                          | Outbound         | HTTPS              | API Management dependencies on Azure Storage | AZURE_STORAGE    |
| 9350, 9351, 9352, 9353, 9354 | Outbound         | TCP                | API Management dependencies on Service Bus   | AZURE_SERVICEBUS |
| 5671                         | Outbound         | AMQP               | API Management log to eventHub policy        | AZURE_EVENTHUB   |
| 6381, 6382, 6383             | N/A              | N/A                | API Management internal cache replication    | N/A              |


## <a name="related-content"> </a>Related content


* [Create a virtual network with a site-to-site VPN connection using the Azure Classic Portal][]
* [How to use the API Inspector to trace calls in Azure API Management][]

[api-management-setup-vpn-configure]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-configure.png
[api-management-setup-vpn-select]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-add-api.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content

[Azure Classic Portal]: https://manage.windowsazure.com/

[Create a virtual network with a site-to-site VPN connection using the Azure Classic Portal]: ../vpn-gateway/vpn-gateway-site-to-site-create.md
[How to use the API Inspector to trace calls in Azure API Management]: api-management-howto-api-inspector.md
