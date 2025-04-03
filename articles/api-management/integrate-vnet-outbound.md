---
title: Integrate API Management in private network
description: Learn how to integrate an Azure API Management instance in the Standard v2 or Premium v2 tier with a virtual network to access backend APIs in the network.
author: dlepow
ms.author: danlep
ms.service: azure-api-management
ms.topic: how-to 
ms.date: 04/03/2025
---

# Integrate an Azure API Management instance with a private virtual network for outbound connections 

[!INCLUDE [api-management-availability-standardv2-premiumv2](../../includes/api-management-availability-standardv2-premiumv2.md)] 

This article guides you through the process of configuring *virtual network integration* for your Standard v2 or Premium v2 (preview) Azure API Management instance. With virtual network integration, your instance can make outbound requests to APIs that are isolated in a single connected virtual network.

When an API Management instance is integrated with a virtual network for outbound requests, the gateway and developer portal endpoints remain publicly accessible. The API Management instance can reach both public and network-isolated backend services.

:::image type="content" source="./media/integrate-vnet-outbound/vnet-integration.png" alt-text="Diagram of integrating API Management instance with a virtual network for outbound traffic."  :::

If you want to inject a Premium v2 (preview) API Management instance into a virtual network to isolate both inbound and outbound traffic, see [Inject a Premium v2 instance into a virtual network](inject-vnet-v2.md).

> [!IMPORTANT]
> * Outbound virtual network integration described in this article is available only for API Management instances in the Standard v2 and Premium v2 tiers. For networking options in the different tiers, see [Use a virtual network with Azure API Management](virtual-network-concepts.md).
> * You can enable virtual network integration when you create an API Management instance in the Standard v2 or Premium v2 tier, or after the instance is created.
> * Currently, you can't switch between virtual network injection and virtual network integration for a Premium v2 instance.



## Prerequisites

- An Azure API Management instance in the [Standard v2 or Premium v2](v2-service-tiers-overview.md) pricing tier
- (Optional) For testing, a sample backend API hosted within a different subnet in the virtual network. For example, see [Tutorial: Establish Azure Functions private site access](../azure-functions/functions-create-private-site-access.md).
- A virtual network with a subnet where your API Management backend APIs are hosted. See the following sections for requirements and recommendations for the virtual network and subnet.

### Network location

* The virtual network must be in the same region and Azure subscription as the API Management instance.

### Dedicated subnet

* The subnet used for virtual network integration can only be used by a single API Management instance. It can't be shared with another Azure resource.

### Subnet size 

* Minimum: /27 (32 addresses)
* Recommended: /24 (256 addresses) - to accommodate scaling of API Management instance

### Network security group

A network security group must be associated with the subnet. Configure any network security group rules that you need for the gateway to access your API backends. To set up a network security group, see [Create a network security group](../virtual-network/manage-network-security-group.md).

### Subnet delegation

The subnet needs to be delegated to the **Microsoft.Web/serverFarms** service.

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


## Configure virtual network integration

This section guides you through the process to configure external virtual network integration for an existing Azure API Management instance. You can also configure virtual network integration when you create a new API Management instance.


1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Deployment + Infrastructure**, select **Network** > **Edit**.
1. On the **Network configuration** page, under **Outbound features**, select **Enable** virtual network integration.
1. Select the virtual network and the delegated subnet that you want to integrate. 
1. Select **Save**. The virtual network is integrated.

## (Optional) Test virtual network integration

If you have an API hosted in the virtual network, you can import it to your Management instance and test the virtual network integration. For basic steps, see [Import and publish an API](import-and-publish.md).


## Related content

* [Use a virtual network with Azure API Management](virtual-network-concepts.md)




