---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 04/01/2021
ms.author: danlep
---
* A Standard SKU [public IP address](../articles/virtual-network/public-ip-addresses.md#standard), if your client uses API version 2021-01-01-preview or later. The public IP address resource is required when setting up the virtual network for either external or internal excess.  

  * The IP address must be in the same region and subscription as the API Management instance and the virtual network.

  * You can create the public IP address when deploying API Management in a virtual network, or provide an existing public IP address resource.

  * The value of the IP address is assigned as the virtual public IP address of the API Management instance. 

  * When changing from an external to internal virtual network (or vice versa), changing subnets in the network, or updating availability zones for the API Management instance, you must configure a different public IP address. 

  > [!IMPORTANT]
  > Currently, you can only use an Azure Resource Manager template or REST API to specify API version 2021-01-01 preview when creating or updating an API Management instance. The Azure portal, Azure CLI, and Azure PowerShell currently support API version 2019-01-01.
