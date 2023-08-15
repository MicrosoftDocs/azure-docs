---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/08/2023
ms.author: danlep
---

## Prerequisites

Some prerequisites differ depending on the version (`stv2` or `stv1`) of the [compute platform](../articles/api-management/compute-infrastructure.md) hosting your API Management instance.

> [!TIP]
> When you use the portal to create or update the network connection of an existing API Management instance, the instance is hosted on the `stv2` compute platform.

### [stv2](#tab/stv2)

+ **An API Management instance.** For more information, see [Create an Azure API Management instance](../articles/api-management/get-started-create-service-instance.md).

* **A virtual network and subnet** in the same region and subscription as your API Management instance. 
  * The subnet used to connect to the API Management instance may contain other Azure resource types. 
  * The subnet shouldn't have any delegations enabled. The **Delegate subnet to a service** setting for the subnet should be set to *None*. 

* **A network security group** attached to the subnet above. A network security group (NSG) is required to explicitly allow inbound connectivity, because the load balancer used internally by API Management is secure by default and rejects all inbound traffic. For specific configuration, see [Configure NSG rules](#configure-nsg-rules), later in this article.

* **A Standard SKU [public IPv4 address](../articles/virtual-network/ip-services/public-ip-addresses.md#sku)**. The public IP address resource is required when setting up the virtual network for either external or internal access. With an internal virtual network, the public IP address is used only for management operations. Learn more about [IP addresses of API Management](../articles/api-management/api-management-howto-ip-addresses.md).

  * The IP address must be in the same region and subscription as the API Management instance and the virtual network.

  * When creating a public IP address resource, ensure you assign a **DNS name label** to it. The label you choose to use does not matter but a label is required if this resource will be assigned to an API Management service.

  * For best network performance, it's recommended to use the default **Routing preference**: **Microsoft network**.  

  * When creating a public IP address in a region where you plan to enable [zone redundancy](../articles/reliability/migrate-api-mgt.md) for your API Management instance, configure the **Zone-redundant** setting.

  * The value of the IP address is assigned as the virtual public IPv4 address of the API Management instance in that region. 

  * When changing from an external to internal virtual network (or vice versa), changing subnets in the network, or updating availability zones for the API Management instance, you must configure a different public IP address.

### [stv1](#tab/stv1)

+ **An API Management instance.** For more information, see [Create an Azure API Management instance](../articles/api-management/get-started-create-service-instance.md).

* **A virtual network and subnet** in the same region and subscription as your API Management instance.
  * The subnet used to connect to the API Management instance must be dedicated to API Management. It can't contain other Azure resource types, or the deployment will fail.
  * The subnet used to connect to the API Management instance should not have any delegations enabled. The **Delegate subnet to a service** setting for the subnet should be set to *None*. 
---
