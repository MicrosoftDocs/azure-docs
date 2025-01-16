---
title: Inject API Management in virtual network - Premium v2
description: Learn how to deploy (inject) an Azure API Management instance in the Premium v2 tier in a virtual network to isolate inbound and outbound traffic.
author: dlepow
ms.author: danlep
ms.service: azure-api-management
ms.topic: how-to 
ms.date: 11/18/2024
---

# Inject an Azure API Management instance in a private virtual network - Premium v2 tier

[!INCLUDE [api-management-availability-premiumv2](../../includes/api-management-availability-premiumv2.md)] 

This article guides you through the requirements to inject your Azure API Management Premium v2 (preview) instance in a virtual network. 

> [!NOTE]
> To inject a classic Developer or Premium tier instance in a virtual network, the requirements and configuration are different. [Learn more](virtual-network-injection-resources.md).

When an API Management Premium v2 instance is injected in a virtual network: 

* The API Management gateway endpoint is accessible through the virtual network at a private IP address.
* API Management can make outbound requests to API backends that are isolated in the network. 

This configuration is recommended for scenarios where you want to isolate network traffic to both the API Management instance and the backend APIs.

:::image type="content" source="./media/inject-vnet-v2/vnet-injection.png" alt-text="Diagram of injecting an API Management instance in a virtual network to isolate inbound and outbound traffic."  :::

If you want to enable *public* inbound access to an API Management instance in the Standard v2 or Premium v2 tier, but limit outbound access to network-isolated backends, see [Integrate with a virtual network for outbound connections](integrate-vnet-outbound.md).


> [!IMPORTANT]
> * Virtual network injection described in this article is available only for API Management instances in the Premium v2 tier (preview). For networking options in the different tiers, see [Use a virtual network with Azure API Management](virtual-network-concepts.md).
> * Currently, you can inject a Premium v2 instance into a virtual network only when the instance is **created**. You can't inject an existing Premium v2 instance into a virtual network. However, you can update the subnet settings for injection after the instance is created.
> * Currently, you can't switch between virtual network injection and virtual network integration for a Premium v2 instance.

## Prerequisites

- An Azure API Management instance in the [Premium v2](v2-service-tiers-overview.md) pricing tier.
- A virtual network where your client apps and your API Management backend APIs are hosted. See the following sections for requirements and recommendations for the virtual network and subnet used for the API Management instance.

### Network location

* The virtual network must be in the same region and Azure subscription as the API Management instance.

### Subnet requirements

* The subnet for the API Management instance can't be shared with another Azure resource.

### Subnet size 

* Minimum: /27 (32 addresses)
* Recommended: /24 (256 addresses) - to accommodate scaling of API Management instance

### Network security group

A network security group must be associated with the subnet.

### Subnet delegation

The subnet needs to be delegated to the **Microsoft.Web/hostingEnvironments** service.

:::image type="content" source="media/virtual-network-injection-workspaces-resources/delegate-internal.png" alt-text="Screenshot showing subnet delegation to Microsoft.Web/hostingEnvironments in the portal.":::


> [!NOTE]
> You might need to register the `Microsoft.Web/hostingEnvironments` resource provider in the subscription so that you can delegate the subnet to the service.

For more information about configuring subnet delegation, see [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md).

[!INCLUDE [api-management-virtual-network-address-prefix](../../includes/api-management-virtual-network-address-prefix.md)]

### Permissions

You must have at least the following role-based access control permissions on the subnet or at a higher level to configure virtual network injection:

| Action | Description |
|-|-|
| Microsoft.Network/virtualNetworks/read | Read the virtual network definition |
| Microsoft.Network/virtualNetworks/subnets/read | Read a virtual network subnet definition |
| Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network |



## Inject API Management in a virtual network

When you [create](get-started-create-service-instance.md) a Premium v2 instance using the Azure portal, you can optionally configure settings for virtual network injection. 

1. In the **Create API Management service** wizard, select the **Networking** tab.
1. In **Connectivity type**, select **Virtual network**.
1. In **Type**, select **Virtual Network injection**. 
1. In **Configure virtual networks**, select the virtual network and the delegated subnet that you want to inject. 
1. Complete the wizard to create the API Management instance.

## DNS settings for access to private IP address

When a Premium v2 API Management instance is injected in a virtual network, you have to manage your own DNS to enable inbound access to API Management. 

While you have the option to use your own custom DNS server, we recommend:

1. Configure an Azure [DNS private zone](../dns/private-dns-overview.md).
1. Link the Azure DNS private zone to the virtual network. 

Learn how to [set up a private zone in Azure DNS](../dns/private-dns-getstarted-portal.md).

### Endpoint access on default hostname

When you create an API Management instance in the Premium v2 tier, the following endpoint is assigned a default hostname:

* **Gateway** - example: `contoso-apim.azure-api.net`

### Configure DNS record

Create an A record in your DNS server to access the API Management instance from within your virtual network. Map the endpoint record to the private VIP address of your API Management instance.

For testing purposes, you might update the hosts file on a virtual machine in a subnet connected to the virtual network in which API Management is deployed. Assuming the private virtual IP address for your API Management instance is 10.1.0.5, you can map the hosts file as shown in the following example. The hosts mapping file is at  `%SystemDrive%\drivers\etc\hosts` (Windows) or `/etc/hosts` (Linux, macOS). For example:

| Internal virtual IP address | Gateway hostname |
| ----- | ----- |
| 10.1.0.5 | `contoso-apim.portal.azure-api.net` |

## Related content

* [Use a virtual network with Azure API Management](virtual-network-concepts.md)
* [Configure a custom domain name for your Azure API Management instance](configure-custom-domain.md)




