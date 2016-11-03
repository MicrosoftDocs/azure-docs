<properties
	pageTitle="How to use Azure API Management with virtual networks"
	description="Learn how to setup a connection to a virtual network in Azure API Management and access web services through it."
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
	ms.date="10/20/2016"
	ms.author="antonba"/>

# How to use Azure API Management with virtual networks

Azure Virtual Networks (VNETs) allow you to place any of your Azure resources in a non-internet routeable network that you control access to. These networks can then be connected to your on premise networks using a variety of VPN technologies. To learn more about Azure Virtual Networks start with the information here: [Azure Virtual Network Overview](../virtual-networks-overview/).

Azure API Management can be connected to a virtual network (VNET) so it can access backend services within the network and so that the developer portal and API gateway are accessible within the network.


## <a name="enable-vpn"> </a>Enable VNET connection

>VNET connectivity is only available in the **Premium** and **Developer** tiers. To switch between the tiers, open your API Management service in the Azure Portal and then open the **Scale and pricing** tab. Under the **Pricing tier** section select the Premium tier and click Save.

To enable VNET connectivity, open your API Management service in the Azure Portal and open the **Virtual network** page.

![Virtual network menu of API Management][api-management-using-vnet-menu]


Select the desired access type:

* **External**: the API Management gateway and developer portal are accessible from the public internet via an external load balancer. The gateway can access resources within the virtual network.

![Public peering][api-management-vnet-public]

* **Internal**: the API Management gateway and developer portal are accessible only from within the virtual network via an internal load balancer. The gateway can access resources within the virtual network.

![Private peering][api-management-vnet-private]

You will now see a list of all regions where your API Management service is provisioned. Select a VNET and subnet for every region. The list is populated with both classic and ARM virtual networks available in your Azure subscriptions that are setup in the region you are configuring.

![Select VPN][api-management-setup-vpn-select]

Click **Save** at the top of the screen. 

> You will not be able to perform management operations on the API Management service while it is updating. The API Management gateway and developer portal will remain available.
> Note that the VIP address of the API Management instance is likely to change each time VNET is enabled or disabled.

## <a name="enable-vnet-powershell"> </a>Enable VNET connection using PowerShell commandlets

You can also enable VNET connectivity using the PowerShell commandlet [Set-AzureRmApiManagementVirtualNetworks](https://msdn.microsoft.com/en-us/library/mt619277.aspx).

## <a name="connect-vnet"> </a>Connect to a web service hosted within a virtual Network

After your API Management service is connected to the VNET, accessing backend services within it is no different than accessing public services. Just type in the local IP address or the host name (if a DNS server is configured for the VNET) of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]

## <a name="custom-dns"> </a>Custom DNS server setup

API Management depends on a number of Azure services. When API Management is hosted in a VNET with a custom DNS server, it needs to be able to resolve hostnames of those Azure services. Please follow [this](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) guidance on custom DNS setup. See diagrams and ports table below for reference.


## <a name="ports-required"> </a>Ports required for API Management

> If any of these ports are unavailable API Management may not operate properly and may become inaccessible. Having one or more of these ports blocked is the most common misconfiguration issue when using API Management with a VNET.

When an API Management service instance is hosted in a VNET, the ports in the following table are used.

| Port(s)                      | Direction        | Transport protocol | Purpose                                                          | Source / destination              | Access type           |
|------------------------------|------------------|--------------------|------------------------------------------------------------------|-----------------------------------|---------------------|
| 80, 443                      | Inbound          | TCP                | Client communication to API Management 			              | INTERNET / VIRTUAL_NETWORK        | External            |
| 3443                         | Inbound          | TCP                | Management endpoint 			                                  | INTERNET / VIRTUAL_NETWORK        | External & Internal |
| 80, 443                      | Outbound         | TCP                | Dependency on Azure Storage and Azure Service Bus                | VIRTUAL_NETWORK / INTERNET        | External & Internal |
| 1433                         | Outbound         | TCP                | Dependency on Azure SQL                                          | VIRTUAL_NETWORK / INTERNET        | External & Internal | 
| 9350, 9351, 9352, 9353, 9354 | Outbound         | TCP                | Dependency on Service Bus                                        | VIRTUAL_NETWORK / INTERNET        | External & Internal |
| 5671                         | Outbound         | AMQP               | Dependency for Log to event Hub policy                           | VIRTUAL_NETWORK / INTERNET        | External & Internal |
| 6381, 6382, 6383             | Inbound/Outbound | UDP                | Dependency on Redis Cache                                        | VIRTUAL_NETWORK / VIRTUAL_NETWORK | External & Internal |
| 445                          | Outbound         | TCP                | Dependency on Azure File Share for GIT                           | VIRTUAL_NETWORK / INTERNET        | External & Internal |


## <a name="limitations"> </a>Limitations

* A subnet containing API Management instances cannot contain any other Azure resource types.
* The subnet and the API Management service must be in the same subscription.
* A subnet containing API Management instances cannot be moved across subscriptions.
* When using an internal virtual network, only an internal IP address will be available from the range stated in [RFC 1918](https://tools.ietf.org/html/rfc1918), a public IP address cannot be provided.
* For multi-region API Management deployments with internal virtual networks configured, users are responsible for managing their own load balancing as they own the DNS.

## <a name="related-content"> </a>Related content


* [Create a virtual network with a site-to-site VPN connection using the Azure Portal][]
* [How to use the API Inspector to trace calls in Azure API Management][]

[api-management-using-vnet-menu]: ./media/api-management-using-with-vnet/api-management-menu-vnet.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-type.png
[api-management-setup-vpn-select]: ./media/api-management-using-with-vnet/api-management-using-vnet-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-using-with-vnet/api-management-using-vnet-add-api.png
[api-management-vnet-private]: ./media/api-management-using-with-vnet/api-management-vnet-private.png
[api-management-vnet-public]: ./media/api-management-using-with-vnet/api-management-vnet-public.png

[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn
[Related content]: #related-content


[Create a virtual network with a site-to-site VPN connection using the Azure Portal]: ../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md
[How to use the API Inspector to trace calls in Azure API Management]: api-management-howto-api-inspector.md
