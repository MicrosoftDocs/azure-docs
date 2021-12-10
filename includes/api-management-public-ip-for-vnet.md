---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 04/12/2021
ms.author: danlep
---
* **A Standard SKU [public IPv4 address](../articles/virtual-network/ip-services/public-ip-addresses.md#sku)**. The public IP address resource is required when setting up the virtual network for either external or internal access. With an internal virtual network, the public IP address is used only for management operations. Learn more about [IP addresses of API Management](../articles/api-management/api-management-howto-ip-addresses.md).

  * The IP address must be in the same region and subscription as the API Management instance and the virtual network.

  * When creating a public IP resource, ensure you assign a "DNS Name Label" to it. The label you choose to use does not matter but a label is required if this resource will be assigned to an API Management Service.

  * The value of the IP address is assigned as the virtual public IPv4 address of the API Management instance in that region. 

  * When changing from an external to internal virtual network (or vice versa), changing subnets in the network, or updating availability zones for the API Management instance, you must configure a different public IP address.
