---
title: Azure API Management with an Azure virtual network
description: Learn about scenarios and requirements to connect you API Management instance to an Azure virtual network.
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 08/19/2021
ms.author: danlep
ms.custom: 
---
# Use a virtual network with Azure API Management

With Azure virtual networks (VNets), you can place ("inject") your API Management instance in a non-internet-routable network to which you control access. You can then connect VNets to your on-premises networks using various VPN technologies. To learn more about Azure VNets, start with the information in the [Azure Virtual Network Overview](../virtual-network/virtual-networks-overview.md).

This article explains VNet connectivity options, requirements, and considerations for your API Management instance. You can use the Azure portal, Azure CLI, Azure Resource Manager templates, or other tools for the configuration. You control inbound and outbound traffic into the subnet in which API Management is deployed by using [network security groups][NetworkSecurityGroups].

For detailed deployment steps and network configuration, see:

* [Connect to an external virtual network using Azure API Management](./api-management-using-with-vnet.md).
* [Connect to an internal virtual network using Azure API Management](./api-management-using-with-internal-vnet.md).

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Access options

When created, an API Management instance must be accessible from the internet. Using a virtual network, you can configure the developer portal, API gateway, and other API Management endpoints to be accessible either from the internet (external mode) or only within the VNet (internal mode). 

* **External** - The API Management endpoints are accessible from the public internet via an external load balancer. The gateway can access resources within the VNet.

    :::image type="content" source="media/virtual-network-concepts/api-management-vnet-external.png" alt-text="Connect to external VNet":::

    Use API Management in external mode to access backend services deployed in the virtual network.

* **Internal** - The API Management endpoints are accessible only from within the VNet via an internal load balancer. The gateway can access resources within the VNet.

    :::image type="content" source="media/virtual-network-concepts/api-management-vnet-internal.png" alt-text="Connect to internal VNet":::

    Use API Management in internal mode to:

    * Make APIs hosted in your private datacenter securely accessible by third parties by using Azure VPN connections or Azure ExpressRoute.
    * Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
    * Manage your APIs hosted in multiple geographic locations, using a single gateway endpoint.


## Network resource requirements

The following are virtual network resource requirements for API Management. Some requirements differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

### [stv2](#tab/stv2)

* An Azure Resource Manager virtual network is required.
* You must provide a Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) in addition to specifying a virtual network and subnet.
* The subnet used to connect to the API Management instance may contain other Azure resource types.
* A [network security group](../virtual-network/network-security-groups-overview.md) attached to the subnet above. A network security group (NSG) is required to explicitly allow inbound connectivity, because the load balancer used internally by API Management is secure by default and rejects all inbound traffic. 
* The API Management service, virtual network and subnet, and public IP address resource must be in the same region and subscription.
* For multi-region API Management deployments, configure virtual network resources separately for each location.

### [stv1](#tab/stv1)

* An Azure Resource Manager virtual network is required.
* The subnet used to connect to the API Management instance must be dedicated to API Management. It cannot contain other Azure resource types.
* The API Management service, virtual network, and subnet resources must be in the same region and subscription.
* For multi-region API Management deployments, you configure virtual network resources separately for each location.

---

## Subnet size

The minimum size of the subnet in which API Management can be deployed is /29, which gives three usable IP addresses. Each extra scale [unit](api-management-capacity.md) of API Management requires two more IP addresses. The minimum size requirement is based on the following considerations:

* Azure reserves some IP addresses within each subnet that can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance. Three more addresses are used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

* In addition to the IP addresses used by the Azure VNet infrastructure, each API Management instance in the subnet uses:
    * Two IP addresses per unit of Premium SKU, or 
    * One IP address for the Developer SKU. 

* When deploying into an [internal VNet](./api-management-using-with-internal-vnet.md), the instance requires an extra IP address for the internal load balancer.

## Routing

See the Routing guidance when deploying your API Management instance into an [external VNet](./api-management-using-with-vnet.md#routing) or [internal VNet](./api-management-using-with-internal-vnet.md#routing).

Learn more about the [IP addresses of API Management](api-management-howto-ip-addresses.md).

## DNS

* In external mode, the VNet enables [Azure-provided name resolution](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default for your API Management endpoints and other Azure resources. It does not provide name resolution for on-premises resources. Optionally, configure your own DNS solution.

* In internal mode, you must provide your own DNS solution to ensure name resolution for API Management endpoints and other required Azure resources. We recommend configuring an Azure [private DNS zone](../dns/private-dns-overview.md).

For more information, see the DNS guidance when deploying your API Management instance into an [external VNet](./api-management-using-with-vnet.md#routing) or [internal VNet](./api-management-using-with-internal-vnet.md#routing).

For more information, see: 
* [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).  
* [Create an Azure private DNS zone](../dns/private-dns-getstarted-portal.md)

> [!IMPORTANT]
> If you plan to use a custom DNS solution for the VNet, set it up **before** deploying an API Management service into it. Otherwise, you'll need to update the API Management service each time you change the DNS server(s) by running the [Apply Network Configuration Operation](/rest/api/apimanagement/current-ga/api-management-service/apply-network-configuration-updates), or by selecting **Apply network configuration** in the service instance's network configuration window in the Azure portal.

## Limitations

Some limitations differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

### [stv2](#tab/stv2)

* A subnet containing API Management instances can't be moved across subscriptions.
* For multi-region API Management deployments configured in internal VNet mode, users own the routing and are responsible for managing the load balancing across multiple regions.
* To import an API to API Management from an [OpenAPI specification](import-and-publish.md), the specification URL must be hosted at a publicly accessible internet address.

### [stv1](#tab/stv1)

* A subnet containing API Management instances can't be movacross subscriptions.
* For multi-region API Management deployments configured in internal VNet mode, users own the routing and are responsible for managing the load balancing across multiple regions.
* To import an API to API Management from an [OpenAPI specification](import-and-publish.md), the specification URL must be hosted at a publicly accessible internet address.
* Due to platform limitations, connectivity between a resource in a globally peered VNet in another region and an API Management service in internal mode will not work. For more information, see the [virtual network documentation](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints).

---

## Next steps

Learn more about:

* [Connecting a virtual network to backend using VPN Gateway](../vpn-gateway/design.md#s2smulti)
* [Connecting a virtual network from different deployment models](../vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md)
* [Virtual network frequently asked questions](../virtual-network/virtual-networks-faq.md)

Connect to a virtual network:
* [Connect to an external virtual network using Azure API Management](./api-management-using-with-vnet.md).
* [Connect to an internal virtual network using Azure API Management](./api-management-using-with-internal-vnet.md).

Review the following topics

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
[NetworkSecurityGroups]: ../virtual-network/network-security-groups-overview.md
[ServiceEndpoints]: ../virtual-network/virtual-network-service-endpoints-overview.md
[ServiceTags]: ../virtual-network/network-security-groups-overview.md#service-tags
