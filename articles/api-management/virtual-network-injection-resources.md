---
title: Azure API Management virtual network integration - network resources
description: Learn about requirements for network resources when you deploy (inject) your API Management instance in an Azure virtual network.
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 03/26/2024
ms.author: danlep
---

# Network resource requirements for API Management injection into a virtual network

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

The following are virtual network resource requirements for API Management injection into a virtual network. Some requirements differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

#### [stv2](#tab/stv2)

* An Azure Resource Manager virtual network is required.
* You must provide a Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#sku) in addition to specifying a virtual network and subnet.
* The subnet used to connect to the API Management instance may contain other Azure resource types.
* The subnet used to connect to the API Management instance should not have any delegations enabled. The "Delegate subnet to a service" setting for the subnet should be set to "None". 
* A [network security group](../virtual-network/network-security-groups-overview.md) attached to the subnet above. A network security group (NSG) is required to explicitly allow inbound connectivity, because the load balancer used internally by API Management is secure by default and rejects all inbound traffic. 
* The API Management service, virtual network and subnet, and public IP address resource must be in the same region and subscription.
* For multi-region API Management deployments, configure virtual network resources separately for each location.

#### [stv1](#tab/stv1)

* An Azure Resource Manager virtual network is required.
* The subnet used to connect to the API Management instance must be dedicated to API Management. It can't contain other Azure resource types.
* The subnet used to connect to the API Management instance should not have any delegations enabled. The "Delegate subnet to a service" setting for the subnet should be set to "None". 
* The API Management service, virtual network, and subnet resources must be in the same region and subscription.
* For multi-region API Management deployments, configure virtual network resources separately for each location.
---

## Subnet size

The minimum size of the subnet in which API Management can be deployed is /29, which provides three usable IP addresses. Each extra scale [unit](api-management-capacity.md) of API Management requires two more IP addresses. The minimum size requirement is based on the following considerations:

* Azure reserves five IP addresses within each subnet that can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance. Three more addresses are used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

* In addition to the IP addresses used by the Azure virtual network infrastructure, each API Management instance in the subnet uses:
    * Two IP addresses per unit of Basic, Standard, or Premium SKU, or 
    * One IP address for the Developer SKU. 

* When deploying into an [internal virtual network](./api-management-using-with-internal-vnet.md), the instance requires an extra IP address for the internal load balancer.

### Examples

* **/29 subnet**: 8 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 0 remaining IP addresses left for scale-out units.  
  
* **/28 subnet**: 16 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 8 remaining IP addresses left for four scale-out units (2 IP addresses/scale-out unit) for a total of five units.   
  
* **/27 subnet**: 32 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 24 remaining IP addresses left for 12 scale-out units (2 IP addresses/scale-out unit) for a total of 13 units. 
  
* **/26 subnet**: 64 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 56 remaining IP addresses left for 28 scale-out units (2 IP addresses/scale-out unit) for a total of 29 units. 
  
* **/25 subnet**: 128 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 120 remaining IP addresses left for 60 scale-out units (2 IP addresses/scale-out unit) for a total of 61 units. This is a large, theoretical number of scale-out units. 

> [!NOTE]
> It is currently possible to scale the Premium SKU to 31 units. If you foresee demand approaching this limit, consider the /26 subnet or /25 submit.

> [!IMPORTANT]
> The private IP addresses of internal load balancer and API Management units are assigned dynamically. Therefore, it is impossible to anticipate the private IP of the API Management instance prior to its deployment. Additionally, changing to a different subnet and then returning may cause a change in the private IP address.

## Routing

See the Routing guidance when deploying your API Management instance into an [external virtual network](./api-management-using-with-vnet.md#routing) or [internal virtual network](./api-management-using-with-internal-vnet.md#routing).

Learn more about the [IP addresses of API Management](api-management-howto-ip-addresses.md).

## DNS

* In external mode, the virtual network enables [Azure-provided name resolution](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default for your API Management endpoints and other Azure resources. It doesn't provide name resolution for on-premises resources. Optionally, configure your own DNS solution.

* In internal mode, you must provide your own DNS solution to ensure name resolution for API Management endpoints and other required Azure resources. We recommend configuring an Azure [private DNS zone](../dns/private-dns-overview.md).

For more information, see the DNS guidance when deploying your API Management instance into an [external virtual network](./api-management-using-with-vnet.md#routing) or [internal virtual network](./api-management-using-with-internal-vnet.md#routing).

Related information: 
* [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).  
* [Create an Azure private DNS zone](../dns/private-dns-getstarted-portal.md)

> [!IMPORTANT]
> If you plan to use a custom DNS solution for the VNet, set it up **before** deploying an API Management service into it. Otherwise, you'll need to update the API Management service each time you change the DNS server(s) by running the [Apply Network Configuration Operation](/rest/api/apimanagement/current-ga/api-management-service/apply-network-configuration-updates), or by selecting **Apply network configuration** in the service instance's network configuration window in the Azure portal.

## Limitations

Some virtual network limitations differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

#### [stv2](#tab/stv2)

* A subnet containing API Management instances can't be moved across subscriptions.
* For multi-region API Management deployments configured in internal virtual network mode, users own the routing and are responsible for managing the load balancing across multiple regions.
* To import an API to API Management from an [OpenAPI specification](import-and-publish.md), the specification URL must be hosted at a publicly accessible internet address.

#### [stv1](#tab/stv1)

* A subnet containing API Management instances can't be moved across subscriptions.
* For multi-region API Management deployments configured in internal virtual network mode, users own the routing and are responsible for managing the load balancing across multiple regions.
* To import an API to API Management from an [OpenAPI specification](import-and-publish.md), the specification URL must be hosted at a publicly accessible internet address.
* Due to platform limitations, connectivity between a resource in a globally peered virtual network in another region and an API Management service in internal mode doesn't work. For more information, see the [virtual network documentation](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints).

---


## Related content

* [Site-to-site VPN](../vpn-gateway/design.md#s2smulti)
* [Connect virtual networks from different deployment models using PowerShell](../vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md)
* [Azure Virtual Network frequently asked questions](../virtual-network/virtual-networks-faq.md)




