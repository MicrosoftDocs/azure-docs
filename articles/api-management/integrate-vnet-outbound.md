---
title: Integrate API Management in private network - public IP | Microsoft Docs
description: Learn how to integrate an Azure API Management instance in the Standard v2 or Premium v2 tier with a virtual network to access backend APIs in the network.
author: dlepow
ms.author: danlep
ms.service: azure-api-management
ms.topic: how-to 
ms.date: 05/20/2024
---

# Integrate an Azure API Management instance with a private VNet for outbound connections

[!INCLUDE [api-management-availability-standardv2-premiumv2](../../includes/api-management-availability-standardv2-premiumv2.md)] 

This article guides you through the process of configuring outbound *VNet integration* for your Azure API Management instance so that your API Management instance can make outbound requests to API backends that are isolated in the network.

When an API Management instance is integrated with a virtual network for outbound requests, the gateway and developer portal endpoints remain publicly accessible. In this configuration, the API Management instance can reach both public and network-isolated backend services.

:::image type="content" source="./media/integrate-vnet-outbound/vnet-integration.svg" alt-text="Diagram of integrating API Management instance with a delegated subnet."  :::

If you want to integrate your API Management instance with a virtual network to isolate both inbound and outbound trafficd, see [Integrate API Management in private network - private IP](integrate-vnet-internal.md).

## Prerequisites

- An Azure API Management instance in the [Standard v2 or Premium v2](v2-service-tiers-overview.md) pricing tier
- (Optional) For testing, a sample backend API hosted within a different subnet in the virtual network. For example, see [Tutorial: Establish Azure Functions private site access](../azure-functions/functions-create-private-site-access.md).
- A virtual network with a subnet where your API Management backend APIs are hosted. See the following sections for requirements and recommendations for the virtual network and subnet.

### Network location

* The virtual network must be in the same region and Azure subscription as the API Management instance.

### Subnet requirements

* The subnet can't be shared with another Azure resource.

### Subnet size 

* Minimum: /27 (32 addresses)
* Recommended: /24 (256 addresses) - to accommodate scaling of API Management instance

### Subnet delegation

For access to the API Management instance only within the VNet using a private IP address, the subnet needs to be delegated to the **Microsoft.Web/serverFarms** service.

:::image type="content" source="media/virtual-network-injection-workspaces-resources/delegate-external.png" alt-text="Screenshot showing subnet delegation to Microsoft.Web/serverFarms in the portal.":::


> [!NOTE]
> You might need to register the `Microsoft.Web/serverFarms` resource provider in the subscription so that you can delegate the subnet to the service.


For more information about configuring subnet delegation, see [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md).

### Permissions

You must have at least the following role-based access control permissions on the subnet or at a higher level to configure virtual network integration:

| Action | Description |
|-|-|
| Microsoft.Network/virtualNetworks/read | Read the virtual network definition |
| Microsoft.Network/virtualNetworks/subnets/read | Read a virtual network subnet definition |
| Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network |

### Permissions

You must have at least the following role-based access control permissions on the subnet or at a higher level to configure virtual network integration:

| Action | Description |
|-|-|
| Microsoft.Network/virtualNetworks/read | Read the virtual network definition |
| Microsoft.Network/virtualNetworks/subnets/read | Read a virtual network subnet definition |
| Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network |


## Enable VNet integration

This section will guide you through the process of enabling VNet integration for your Azure API Management instance.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Deployment + Infrastructure**, select **Network**.
1. On the **Outbound traffic** card, select **VNET integration**.

    :::image type="content" source="media/integrate-vnet-outbound/integrate-vnet.png" lightbox="media/integrate-vnet-outbound/integrate-vnet.png" alt-text="Screenshot of VNet integration in the portal.":::

1. In the **Virtual network** blade, enable the **Virtual network** checkbox.
1. Select the location of your API Management instance.
1. In **Virtual network**, select the virtual network and the delegated subnet that you want to integrate. 
1. Select **Apply**, and then select **Save**. The VNet is integrated.

    :::image type="content" source="media/integrate-vnet-outbound/vnet-settings.png" lightbox="media/integrate-vnet-outbound/vnet-settings.png" alt-text="Screenshot of VNet settings in the portal.":::

## (Optional) Test VNet integration

If you have an API hosted in the virtual network, you can import it to your Management instance and test the VNet integration. For basic steps, see [Import and publish an API](import-and-publish.md).


## Related content

* [Use a virtual network with Azure API Management](virtual-network-concepts.md)




