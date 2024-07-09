---
title: Azure API Management workspaces - virtual network injection - network resources
description: Learn about requirements for network resources when you deploy (inject) your API Management workspace in an Azure virtual network.
author: dlepow

ms.service: api-management
ms.topic: concept-article
ms.date: 07/08/2024
ms.author: danlep
---

# Network resource requirements for injection of a workspace gateway into a virtual network

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

The following are virtual network resource requirements for optionally injecting an API Management [workspace gateway](workspaces-overview.md#workspace-gateway) into a virtual network. Some requirements differ depending on the desired inbound and outbound access mode:

* **External mode**: Public inbound access, private outbound access
* **Internal mode**: Private inbound access, private outbound access

For information about networking options in API Management, see [Use a virtual network to secure inbound or outbound traffic for Azure API Management](virtual-network-concepts.md).

[!INCLUDE [api-management-virtual-network-workspaces-alert](../../includes/api-management-virtual-network-workspaces-alert.md)]


## Network location

* The virtual network must be in the same region and Azure subscription as the API Management instance.
* The region must also support the creation of a [workspace gateway](workspaces-overview.md#workspace-gateway) resource.

## Subnet size

* The subnet size must be `/24` (256 IP addresses).
* The subnet can't be shared with another resource.

## Subnet delegation

The subnet must be delegated as follows to enable the desired inbound and outbound access. The subnet can't have another delegation configured.

For information about configuring subnet delegation, see [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md).

#### [External](#tab/external)


For external mode, the subnet needs to be delegated to the **Microsoft.Web/serverFarms** service.

:::image type="content" source="media/virtual-network-injection-workspaces-resources/delegate-external.png" alt-text="Screenshot showing subnet delegation to Microsoft.Web/serverFarms in the portal.":::

> [!NOTE]
> You might need to register the `Microsoft.Web/serverFarms` resource provider in the subscription so that you can delegate the subnet to the service.

#### [Internal](#tab/internal)

For internal mode, the subnet needs to be delegated to the **Microsoft.Web/hostingEnvironment** service.

:::image type="content" source="media/virtual-network-injection-workspaces-resources/delegate-internal.png" alt-text="Screenshot showing subnet delegation to Microsoft.Web/hostingEnvironment in the portal.":::


> [!NOTE]
> You might need to register the `Microsoft.Web/hostingEnvironment` resource provider in the subscription so that you can delegate the subnet to the service.

---


## Network security group (NSG) rules

A network security group (NSG) must be attached to the subnet to explicitly allow inbound connectivity. Configure the following rules in the NSG. Set the priority of these rules higher than that of the default rules.

#### [External](#tab/external)

| Source / Destination Port(s) | Direction          | Transport protocol |   Source | Destination   | Purpose |
|------------------------------|--------------------|--------------------|---------------------------------------|----------------------------------|-----------|
| */80                          | Inbound            | TCP                | AzureLoadBalancer | Workspace gateway subnet range                           | Allow internal health ping traffic     |
| */80,443 | Inbound | TCP | Internet | Workspace gateway subnet range | Allow inbound traffic |

#### [Internal](#tab/internal)

| Source / Destination Port(s) | Direction          | Transport protocol |   Source | Destination   | Purpose |
|------------------------------|--------------------|--------------------|---------------------------------------|----------------------------------|-----------|
| */80                          | Inbound            | TCP                | AzureLoadBalancer | Workspace gateway subnet range                           | Allow internal health ping traffic     |
| */80,443 | Inbound | TCP | Virtual network | Workspace gateway subnet range | Allow inbound traffic |

---

## DNS

TBD

## Limitations

TBD


## Related content

* [Use a virtual network to secure inbound or outbound traffic for Azure API Management](virtual-network-concepts.md)
* [Workspaces in Azure API Management](workspaces-overview.md)





