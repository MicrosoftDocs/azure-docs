---
title: Integrate API Management instance in private network - private IP
description: Learn how to integrate an Azure API Management instance in the Premium v2 tier with a virtual network to isolate inbound and outbound traffic in the network.
author: dlepow
ms.author: danlep
ms.service: azure-api-management
ms.topic: how-to 
ms.date: 09/27/2024
---

# Integrate an Azure API Management instance with a private VNet - private IP address

[!INCLUDE [api-management-availability-premiumv2](../../includes/api-management-availability-premiumv2.md)] 

This article guides you through the process of configuring internal *VNet integration* for your Azure API Management instance so that inbound request to your API Management instance and outbound requests to API backends are isolated to traffic in the network. 

In this configuration, the API Management instance is accessible only through the VNet at a private IP address. This configuration is suitable for scenarios where you want to keep both the API Management instance and the backend APIs private.

When an API Management instance is integrated with a virtual network for inbound and outbound requests, the gateway and developer portal endpoints are accessible only through the VNet. In this configuration, the API Management instance can reach both public and network-isolated backend services.

If you want to integrate your API Management instance with a virtual network for outbound requests only, see [Integrate API Management in private network - public IP](integrate-vnet-outbound.md).
<!-- 
:::image type="content" source="./media/integrate-vnet-outbound/vnet-integration.svg" alt-text="Diagram of integrating API Management instance with a delegated subnet."  :::
-->

## Prerequisites

- An Azure API Management instance in the [Premium v2](v2-service-tiers-overview.md) pricing tier
- A virtual network with a subnet where your API Management backend APIs are hosted. See the following sections for requirements and recommendations for the virtual network and subnet.

### Network location

* The virtual network must be in the same region and Azure subscription as the API Management instance.

### Subnet requirements

* The subnet can't be shared with another Azure resource.

### Subnet size 

* Minimum: /27 (32 addresses)
* Recommended: /24 (256 addresses) - to accommodate scaling of API Management instance

### Subnet delegation

For access to the API Management instance only within the VNet using a private IP address, the subnet needs to be delegated to the **Microsoft.Web/hostingEnvironments** service.

:::image type="content" source="media/virtual-network-injection-workspaces-resources/delegate-internal.png" alt-text="Screenshot showing subnet delegation to Microsoft.Web/hostingEnvironments in the portal.":::


> [!NOTE]
> You might need to register the `Microsoft.Web/hostingEnvironments` resource provider in the subscription so that you can delegate the subnet to the service.


For more information about configuring subnet delegation, see [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md).

### Permissions

You must have at least the following role-based access control permissions on the subnet or at a higher level to configure virtual network integration:

| Action | Description |
|-|-|
| Microsoft.Network/virtualNetworks/read | Read the virtual network definition |
| Microsoft.Network/virtualNetworks/subnets/read | Read a virtual network subnet definition |
| Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network |


<!--
## Network security group (NSG) rules

A network security group (NSG) must be attached to the subnet to explicitly allow inbound connectivity. Configure the following rules in the NSG. Set the priority of these rules higher than that of the default rules.

#### [Public/Private](#tab/external)

| Source / Destination Port(s) | Direction          | Transport protocol |   Source | Destination   | Purpose |
|------------------------------|--------------------|--------------------|---------------------------------------|----------------------------------|-----------|
| */80                          | Inbound            | TCP                | AzureLoadBalancer | Workspace gateway subnet range                           | Allow internal health ping traffic     |
| */80,443 | Inbound | TCP | Internet | Workspace gateway subnet range | Allow inbound traffic |

#### [Private/Private](#tab/internal)

| Source / Destination Port(s) | Direction          | Transport protocol |   Source | Destination   | Purpose |
|------------------------------|--------------------|--------------------|---------------------------------------|----------------------------------|-----------|
| */80                          | Inbound            | TCP                | AzureLoadBalancer | Workspace gateway subnet range                           | Allow internal health ping traffic     |
| */80,443 | Inbound | TCP | Virtual network | Workspace gateway subnet range | Allow inbound traffic |

---
-->

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

## DNS settings for integration with private IP address

With virtual network integration with a private IP address, you have to manage your own DNS to enable inbound access to your API Management instance. 

We recommend:

1. Configure an Azure [DNS private zone](../dns/private-dns-overview.md).
1. Link the Azure DNS private zone to the virtual network. 

Learn how to [set up a private zone in Azure DNS](../dns/private-dns-getstarted-portal.md).


### Endpoint access on default hostnames

When you create an API Management instance, the following endpoints are assigned default hostnames:

* **Gateway** - 
* **Developer portal**


### Configure DNS records

Create A records in your DNS server to access the API Management instance from within your VNet. Map the endpoint records to the private VIP address of your API Management instance

For testing purposes, you might update the hosts file on a virtual machine in a subnet connected to the VNet in which API Management is deployed. Assuming the private virtual IP address for your API Management instance is 10.1.0.5, you can map the hosts file as shown in the following example. The hosts mapping file is at  `%SystemDrive%\drivers\etc\hosts` (Windows) or `/etc/hosts` (Linux, macOS). For example:

| Internal virtual IP address | Gateway hostname |
| ----- | ----- |
| 10.1.0.5 | `contoso-apim.westus.azure-api.net` |
| 10.1.0.5 | `contoso-apim.portal.azure-api.net` |

## Related content

* [Use a virtual network with Azure API Management](virtual-network-concepts.md)




