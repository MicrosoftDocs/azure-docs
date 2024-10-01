---
title: Integrate API Management in private network - private IP
description: Learn how to integrate an Azure API Management instance in the Premium v2 tier with a virtual network to isolate inbound and outbound traffic in the network.
author: dlepow
ms.author: danlep
ms.service: azure-api-management
ms.topic: how-to 
ms.date: 10/01/2024
---

# Integrate an Azure API Management instance with a private virtual network - private IP address

[!INCLUDE [api-management-availability-premiumv2](../../includes/api-management-availability-premiumv2.md)] 

This article guides you through the requirements to configure *internal virtual network integration* for your Azure API Management instance so that inbound requests to your API Management instance and outbound requests to API backends can be isolated to traffic in the network. 

In this configuration, the API Management gateway and developer portal endpoints are accessible through the virtual network at a private IP address. This configuration is recommended for scenarios where you want to keep both the API Management instance and the backend APIs private.

:::image type="content" source="./media/integrate-vnet-internal/vnet-integration.png" alt-text="Diagram of integrating API Management instance with a virtual network to isolate inbound and outbound traffic."  :::

If you want to configure *external* virtual network integration for your API Management instance (inbound traffic to a public IP address, outbound traffic to network-isolated backends), see [Integrate API Management in private network - public IP address](integrate-vnet-outbound.md).


> [!IMPORTANT]
> * Internal virtual network integration described in this article is available only for API Management instances in the Premium v2 tier. For networking options in the classic tiers, see [Use a virtual network with Azure API Management](virtual-network-concepts.md).
> * Currently, you configure internal virtual network integration when a Premium v2 instance is **created**. You can't enable internal virtual network integration on an existing Premium v2 instance. However, you can update the integrated subnet settings after the instance is created.
> * You can't change the virtual network integration type from internal to external or vice versa after the API Management instance is created.

## Prerequisites

- An Azure API Management instance in the [Premium v2](v2-service-tiers-overview.md) pricing tier
- A virtual network with a subnet where your client apps and API Management backend APIs are hosted. See the following sections for requirements and recommendations for the virtual network and subnet.

### Network location

* The virtual network must be in the same region and Azure subscription as the API Management instance.

### Subnet requirements

* The subnet can't be shared with another Azure resource.

### Subnet size 

* Minimum: /27 (32 addresses)
* Recommended: /24 (256 addresses) - to accommodate scaling of API Management instance

### Subnet delegation

The subnet needs to be delegated to the **Microsoft.Web/hostingEnvironments** service.

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



## Enable virtual network integration

You enable internal virtual network integration for your Azure API Management instance when you [create](get-started-create-service-instance.md) a Premium v2 instance using the Azure portal. 

1. In the **Create API Management service** wizard, select the **Networking** tab.
1. In **Connectivity type**, select **Virtual network**.
1. In **Type**, select **Internal**. 
1. In **Configure virtual networks**, select the virtual network and the delegated subnet that you want to integrate. 

    Optionally, provide a public IP address resource if you want to own and control an IP address used for outbound connection to the internet (if configured).
1. Complete the wizard to create the API Management instance.

## DNS settings for integration with private IP address

When you integrate your API Management instance in a virtual network with a private IP address, you have to manage your own DNS to enable inbound access to your API Management endpoints. 

We recommend:

1. Configure an Azure [DNS private zone](../dns/private-dns-overview.md).
1. Link the Azure DNS private zone to the virtual network. 

Learn how to [set up a private zone in Azure DNS](../dns/private-dns-getstarted-portal.md).


### Endpoint access on default hostnames

When you create an API Management instance in the Premium v2 tier, the following endpoints are assigned default hostnames:

* **Gateway** - 
* **Developer portal**

### Configure DNS records

Create A records in your DNS server to access the API Management instance from within your virtual network. Map the endpoint records to the private VIP address of your API Management instance.

For testing purposes, you might update the hosts file on a virtual machine in a subnet connected to the virtual network in which API Management is deployed. Assuming the private virtual IP address for your API Management instance is 10.1.0.5, you can map the hosts file as shown in the following example. The hosts mapping file is at  `%SystemDrive%\drivers\etc\hosts` (Windows) or `/etc/hosts` (Linux, macOS). For example:

| Internal virtual IP address | Gateway hostname |
| ----- | ----- |
| 10.1.0.5 | `contoso-apim.azure-api.net` |
| 10.1.0.5 | `contoso-apim.portal.azure-api.net` |

## Related content

* [Use a virtual network with Azure API Management](virtual-network-concepts.md)
* [Configure a custom domain name for your Azure API Management instance](configure-custom-domain.md)




