---
title: Azure API Management with an Azure virtual network
description: Learn about scenarios and requirements to secure inbound and outbound traffic for your API Management instance using an Azure virtual network.
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: danlep
ms.custom: 
---
# Use a virtual network to secure inbound and outbound traffic for Azure API Management

API Management provides several options to secure access to your API Management instance and APIs using an Azure virtual network. API Management supports the following options. Available options depend on the [service tier](api-management-features.md) of your API Management instance.

[!INCLUDE [api-management-v2-tier-preview](../../includes/api-management-v2-tier-preview.md)]

* **Injection** of the API Management instance into a subnet in the virtual network, enabling the gateway to access resources in the network. 

    You can choose one of two injection modes: *external* or *internal*. They differ in whether inbound connectivity to the gateway and other API Management endpoints is allowed from the internet or only from within the virtual network.

* **Enabling secure and private inbound connectivity** to the API Management gateway using a *private endpoint*.
  
The following table compares virtual networking options. For more information, see later sections of this article and links to detailed guidance.

|Networking model  |Supported tiers  |Supported components  |Supported traffic  |Usage scenario |
|---------|---------|---------|---------|----|
|**[Virtual network injection - external](#virtual-network-injection)**     | Developer, Premium       | Developer portal, gateway, management plane, and Git repository        | Inbound and outbound traffic can be allowed to internet, peered virtual networks, Express Route, and S2S VPN connections.     | External access to private and on-premises backends
|**[Virtual network injection - internal](#virtual-network-injection)**     |  Developer, Premium      |  Developer portal, gateway, management plane, and Git repository.       |  Inbound and outbound traffic can be allowed to peered virtual networks, Express Route, and S2S VPN connections.       | Internal access to private and on-premises backends
|**[Inbound private endpoint](#inbound-private-endpoint)**   | Developer, Basic, Standard, Premium        |   Gateway only (managed gateway supported, self-hosted gateway not supported).      |    Only inbound traffic can be allowed from internet, peered virtual networks, Express Route, and S2S VPN connections.     | Secure client connection to API Management gateway |



## Virtual network injection
With VNet injection, deploy ("inject") your API Management instance in a subnet in a non-internet-routable network to which you control access. In the virtual network, your API Management instance can securely access other networked Azure resources and also connect to on-premises networks using various VPN technologies. To learn more about Azure VNets, start with the information in the [Azure Virtual Network Overview](../virtual-network/virtual-networks-overview.md).

 You can use the Azure portal, Azure CLI, Azure Resource Manager templates, or other tools for the configuration. You control inbound and outbound traffic into the subnet in which API Management is deployed by using [network security groups](../virtual-network/network-security-groups-overview.md).

For detailed deployment steps and network configuration, see:

* [Deploy your API Management instance to a virtual network - external mode](./api-management-using-with-vnet.md).
* [Deploy your API Management instance to a virtual network - internal mode](./api-management-using-with-internal-vnet.md).

### Access options
Using a virtual network, you can configure the developer portal, API gateway, and other API Management endpoints to be accessible either from the internet (external mode) or only within the VNet (internal mode). 

* **External** - The API Management endpoints are accessible from the public internet via an external load balancer. The gateway can access resources within the VNet.

    :::image type="content" source="media/virtual-network-concepts/api-management-vnet-external.png" alt-text="Diagram showing a connection to external VNet." :::

    Use API Management in external mode to access backend services deployed in the virtual network.

* **Internal** - The API Management endpoints are accessible only from within the VNet via an internal load balancer. The gateway can access resources within the VNet.

    :::image type="content" source="media/virtual-network-concepts/api-management-vnet-internal.png" alt-text="Diagram showing a connection to internal VNet." lightbox="media/virtual-network-concepts/api-management-vnet-internal.png":::

    Use API Management in internal mode to:

    * Make APIs hosted in your private datacenter securely accessible by third parties by using Azure VPN connections or Azure ExpressRoute.
    * Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
    * Manage your APIs hosted in multiple geographic locations, using a single gateway endpoint.


### Network resource requirements for injection

The following are virtual network resource requirements for API Management injection into a VNet. Some requirements differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

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

### Subnet size

The minimum size of the subnet in which API Management can be deployed is /29, which provides three usable IP addresses. Each extra scale [unit](api-management-capacity.md) of API Management requires two more IP addresses. The minimum size requirement is based on the following considerations:

* Azure reserves five IP addresses within each subnet that can't be used. The first and last IP addresses of the subnets are reserved for protocol conformance. Three more addresses are used for Azure services. For more information, see [Are there any restrictions on using IP addresses within these subnets?](../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets).

* In addition to the IP addresses used by the Azure VNet infrastructure, each API Management instance in the subnet uses:
    * Two IP addresses per unit of Basic, Standard, or Premium SKU, or 
    * One IP address for the Developer SKU. 

* When deploying into an [internal VNet](./api-management-using-with-internal-vnet.md), the instance requires an extra IP address for the internal load balancer.

#### Examples

* For Basic, Standard, or Premium SKUs:  

  * **/29 subnet**: 8 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 0 remaining IP addresses left for scale-out units.  
  
  * **/28 subnet**: 16 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 8 remaining IP addresses left for four scale-out units (2 IP addresses/scale-out unit) for a total of five units. **This subnet efficiently maximizes Basic and Standard SKU scale-out limits.**  
  
  * **/27 subnet**: 32 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 24 remaining IP addresses left for twelve scale-out units (2 IP addresses/scale-out unit) for a total of thirteen units. **This subnet efficiently maximizes the soft-limit Premium SKU scale-out limit.**  
  
  * **/26 subnet**: 64 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 56 remaining IP addresses left for twenty-eight scale-out units (2 IP addresses/scale-out unit) for a total of twenty-nine units. It is possible, with an Azure Support ticket, to scale the Premium SKU past twelve units. If you foresee such high demand, consider the /26 subnet.  
  
  * **/25 subnet**: 128 possible IP addresses - 5 reserved Azure IP addresses - 2 API Management IP addresses for one instance - 1 IP address for internal load balancer, if used in internal mode = 120 remaining IP addresses left for sixty scale-out units (2 IP addresses/scale-out unit) for a total of sixty-one units. This is an extremely large, theoretical number of scale-out units. 

> [!IMPORTANT]
> The private IP addresses of internal load balancer and API Management units are assigned dynamically. Therefore, it is impossible to anticipate the private IP of the API Management instance prior to its deployment. Additionally, changing to a different subnet and then returning may cause a change in the private IP address.

### Routing

See the Routing guidance when deploying your API Management instance into an [external VNet](./api-management-using-with-vnet.md#routing) or [internal VNet](./api-management-using-with-internal-vnet.md#routing).

Learn more about the [IP addresses of API Management](api-management-howto-ip-addresses.md).

### DNS

* In external mode, the VNet enables [Azure-provided name resolution](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default for your API Management endpoints and other Azure resources. It doesn't provide name resolution for on-premises resources. Optionally, configure your own DNS solution.

* In internal mode, you must provide your own DNS solution to ensure name resolution for API Management endpoints and other required Azure resources. We recommend configuring an Azure [private DNS zone](../dns/private-dns-overview.md).

For more information, see the DNS guidance when deploying your API Management instance into an [external VNet](./api-management-using-with-vnet.md#routing) or [internal VNet](./api-management-using-with-internal-vnet.md#routing).

Related information: 
* [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).  
* [Create an Azure private DNS zone](../dns/private-dns-getstarted-portal.md)

> [!IMPORTANT]
> If you plan to use a custom DNS solution for the VNet, set it up **before** deploying an API Management service into it. Otherwise, you'll need to update the API Management service each time you change the DNS server(s) by running the [Apply Network Configuration Operation](/rest/api/apimanagement/current-ga/api-management-service/apply-network-configuration-updates), or by selecting **Apply network configuration** in the service instance's network configuration window in the Azure portal.

### Limitations

Some virtual network limitations differ depending on the version (`stv2` or `stv1`) of the [compute platform](compute-infrastructure.md) hosting your API Management instance.

#### [stv2](#tab/stv2)

* A subnet containing API Management instances can't be moved across subscriptions.
* For multi-region API Management deployments configured in internal VNet mode, users own the routing and are responsible for managing the load balancing across multiple regions.
* To import an API to API Management from an [OpenAPI specification](import-and-publish.md), the specification URL must be hosted at a publicly accessible internet address.

#### [stv1](#tab/stv1)

* A subnet containing API Management instances can't be moved across subscriptions.
* For multi-region API Management deployments configured in internal VNet mode, users own the routing and are responsible for managing the load balancing across multiple regions.
* To import an API to API Management from an [OpenAPI specification](import-and-publish.md), the specification URL must be hosted at a publicly accessible internet address.
* Due to platform limitations, connectivity between a resource in a globally peered VNet in another region and an API Management service in internal mode doesn't work. For more information, see the [virtual network documentation](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints).

---

## Inbound private endpoint

API Management supports [private endpoints](../private-link/private-endpoint-overview.md) for secure inbound client connections to your API Management instance. Each secure connection uses a private IP address from your virtual network and Azure Private Link. 

:::image type="content" source="media/virtual-network-concepts/api-management-private-endpoint.png" alt-text="Diagram showing a secure connection to API Management using private endpoint." lightbox="media/virtual-network-concepts/api-management-private-endpoint.png":::

[!INCLUDE [api-management-private-endpoint](../../includes/api-management-private-endpoint.md)]

For more information, see [Connect privately to API Management using an inbound private endpoint](private-endpoint.md).

## Advanced networking configurations

### Secure API Management endpoints with a web application firewall

You may have scenarios where you need both secure external and internal access to your API Management instance, and flexibility to reach private and on-premises backends. For these scenarios, you may choose to manage external access to the endpoints of an API Management instance with a web application firewall (WAF). 

One example is to deploy an API Management instance in an internal virtual network, and route public access to it using an internet-facing Azure Application Gateway:

:::image type="content" source="media/virtual-network-concepts/api-management-application-gateway.png" alt-text="Diagram showing Application Gateway in front of API Management instance." lightbox="media/virtual-network-concepts/api-management-application-gateway.png":::

For more information, see [Deploy API Management in an internal virtual network with Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md).


## Next steps

Learn more about:

Virtual network configuration with API Management:
* [Deploy your Azure API Management instance to a virtual network - external mode](./api-management-using-with-vnet.md).
* [Deploy your Azure API Management instance to a virtual network - internal mode](./api-management-using-with-internal-vnet.md).
* [Connect privately to API Management using a private endpoint](private-endpoint.md)
* [Defend your Azure API Management instance against DDoS attacks](protect-with-ddos-protection.md)

Related articles:

* [Connecting a Virtual Network to backend using Vpn Gateway](../vpn-gateway/design.md#s2smulti)
* [Connecting a Virtual Network from different deployment models](../vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md)
* [Virtual Network Frequently asked Questions](../virtual-network/virtual-networks-faq.md)




