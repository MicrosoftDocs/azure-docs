---
title: Network security overview for Azure App Configuration
description: Learn about network security options in Azure App Configuration, including public access controls, private endpoints, and network security perimeters.
services: azure-app-configuration
author: austintolani
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 04/22/2026

# customer intent: As a developer or administrator using Azure App Configuration, I want to understand the network security options available so that I can protect my configuration data with network controls.
---
# Network security for Azure App Configuration

Azure App Configuration integrates with Azure's network security offerings to enable configuration of network security policies that protect your configuration data. Through features like private endpoints and network security perimeters, you can restrict network access to your configuration store to clients in a virtual network, clients with specific IP addresses, or managed identities in specific subscriptions. In addition to inbound controls, with a network security perimeter, you can also place network restrictions on outbound traffic from your configuration store, preventing data exfiltration to unauthorized endpoints.

## Public network access

The key component of network security in Azure App Configuration is the ability to restrict public network access. Azure App Configuration offers four public network access options:
- **Enabled**: All networks can access this resource.
- **Automatic public access**: Public network access is enabled, as long as you don't have a private endpoint present. Once you create a private endpoint, App Configuration disables public network access and enables private access. This option can only be selected when creating a store.
- **Secured by perimeter**: Public access is disabled. Only traffic from a private endpoint or traffic allowed by the associated network security perimeter can access this resource.
- **Disabled**: Public access is disabled and no traffic can access this resource unless it's through a private endpoint.

> [!IMPORTANT]
> If a network security perimeter is associated with a configuration store and that association is in "enforced mode", public network access is governed by the network security perimeter, regardless of the public access setting on the configuration store. See [this table](../private-link/network-security-perimeter-transition.md#moving-new-resources-into-network-security-perimeter) for more details.

## Accessing a configuration store with public network access disabled

If you limit restrict network access to your configuration store (public network access set to "Disabled" or "Secured by perimeter"), there are two ways your clients can access your configuration store:

1. **Private endpoint**: A private endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link, such as Azure App Configuration. By creating a private endpoint for your configuration store, you can access it privately from your virtual network, without exposing it to the public internet. For more information, see [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md).
2. **Network security perimeter**: A network security perimeter is a security boundary that you can define to restrict access to your configuration store based on client IP address, Azure subscription or network security perimeter membership. By associating a network security perimeter with your configuration store, you can allow access from specific clients while blocking all other traffic. For more information, see [Network security perimeter for Azure App Configuration](./concept-nsp.md).

## Choosing a network security approach

The right approach depends on your requirements. In some scenarios, disabling public network access isn't an option. For example, if you use [hyperscale configuration delivery for client applications (preview)](./concept-hyperscale-client-configuration.md), your configuration store must remain publicly accessible so that Azure Front Door can serve configuration to end users. When you can restrict public access, consider the following options to access your configuration store:

- **Private endpoints** are ideal when your clients reside in an Azure virtual network and you want to ensure all traffic stays on the Microsoft backbone network.
- **Network security perimeter (preview)** gives you the capability to define IP address and subscription-based inbound access rules for your configuration store. In addition, network security perimeters allow you to define a logical isolation boundary between many PaaS resources, centralize network access rule configuration, control outbound access, and more. To learn more, see [Network security perimeter for Azure App Configuration](./concept-nsp.md).

> [!NOTE]
> Private endpoints and network security perimeters can be combined for defense in depth. You can use both features simultaneously to provide layered security for your configuration store. For example, you can use a private endpoint to connect to your store from clients within a virtual network, while also using a network security perimeter to allow access to specific IP addresses.

## Related content

- [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md)
- [Network security perimeter for Azure App Configuration](./concept-nsp.md)
- [Disable public access in Azure App Configuration](./howto-disable-public-access.md)
- [Network access errors](./network-access-errors.md)
