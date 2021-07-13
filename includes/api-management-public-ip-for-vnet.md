---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 04/12/2021
ms.author: danlep
---
* **A Standard SKU [public IPv4 address](../articles/virtual-network/public-ip-addresses.md#standard)**, if your client uses API version 2021-01-01-preview or later. The public IP address resource is required when setting up the virtual network for either external or internal access. With an internal virtual network, the public IP address is used only for management operations. Learn more about [IP addresses of API Management](../articles/api-management/api-management-howto-ip-addresses.md).

  * The IP address must be in the same region and subscription as the API Management instance and the virtual network.

  * The value of the IP address is assigned as the virtual public IPv4 address of the API Management instance in that region. 

  * When changing from an external to internal virtual network (or vice versa), changing subnets in the network, or updating availability zones for the API Management instance, you must configure a different public IP address. 

  > [!IMPORTANT]
  > Currently, the Azure portal uses API version 2021-01-01 preview when creating or updating an API Management instance. You can specify this API version using an Azure Resource Manager template or the API Management REST API. The Azure CLI and Azure PowerShell currently support API version 2020-12-01.
