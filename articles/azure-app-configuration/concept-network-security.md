---
title: Network security overview for Azure App Configuration
description: Learn about network security options in Azure App Configuration, including public access controls, private endpoints, and network security perimeters.
services: azure-app-configuration
author: austintolani
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 05/18/2026

# customer intent: As a developer or administrator using Azure App Configuration, I want to understand the network security options available so that I can protect my configuration data with network controls.
---
# Network security for Azure App Configuration

Azure App Configuration integrates with Azure's network security offerings, letting you apply network security policies that protect your configuration data. Through features like private endpoints and network security perimeters, you can restrict network access to your App Configuration store to clients in a virtual network, clients with specific IP addresses, or managed identities in specific subscriptions. In addition to inbound controls, with a network security perimeter, you can also place network restrictions on outbound traffic from your App Configuration store, preventing data exfiltration to unauthorized endpoints.

## Public network access

The key component of network security in Azure App Configuration is the ability to restrict public network access. Azure App Configuration offers four public network access options:
- **Automatic**: Public network access is enabled as long as you don't have a private endpoint. Once you create a private endpoint, App Configuration disables public network access and enables private access. This option can only be selected when creating a store.
- **Enabled**: All networks can access this resource.
- **Secured by perimeter**: Public access is disabled. Only traffic from a private endpoint or traffic allowed by the associated network security perimeter can access this resource.
- **Disabled**: Public access is disabled and no traffic can access this resource unless it's through a private endpoint.

> [!IMPORTANT]
> If a network security perimeter is associated with an App Configuration store and that association's access mode is Enforced, public network access is governed by the network security perimeter, regardless of the public access setting on the store. See [Moving new resources into network security perimeter](../private-link/network-security-perimeter-transition.md#moving-new-resources-into-network-security-perimeter) for more details.

## Accessing an App Configuration store with public network access disabled

If you restrict network access to your App Configuration store through the public network access setting or association with a network security perimeter, there are two ways your clients can access your App Configuration store:

1. **Private endpoint**: A private endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link, such as Azure App Configuration. By creating a private endpoint for your App Configuration store, you can access the App Configuration store privately from your virtual network, without exposing it to the public internet. For more information, see [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md).
1. **Network security perimeter**: A network security perimeter is a security boundary that you can define to restrict access to your App Configuration store based on client IP address, Azure subscription, or network security perimeter membership. By associating a network security perimeter with your App Configuration store, you can allow access from specific clients while blocking all other traffic. For more information, see [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md).

Private endpoints and network security perimeters can be combined for defense in depth. You can use both features simultaneously to provide layered security for your App Configuration store.

## Related content

- [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md)
- [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md)
- [Disable public access in Azure App Configuration](./howto-disable-public-access.md)
- [Network access errors](./network-access-errors.md)
