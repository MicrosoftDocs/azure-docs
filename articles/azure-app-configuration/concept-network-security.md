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

Azure App Configuration integrates with Azure's network security offerings, letting you apply network security policies that protect your configuration data. You can restrict or disable public network access to your store, and you can enable private access from your virtual networks through private endpoints.

## Restrict or disable public network access

By default, an App Configuration store is reachable over the public internet by any client that has valid credentials. You can restrict or completely disable public network access in two ways:

- **The public network access setting on the store.** The [Public network access setting](#public-network-access-setting) controls how the store communicates with the public internet. When access from the public internet is not permitted, clients must connect using a private endpoint. See [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md) for more information.
- **Association with a network security perimeter.** A network security perimeter is a security boundary that lets you allow traffic from specific clients (by IP address, Azure subscription, or perimeter membership) while blocking all other public traffic. It also controls outbound traffic from your store, helping prevent data exfiltration. For more information, see [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md).

> [!IMPORTANT]
> If an App Configuration store is associated with a network security perimeter in **Enforced** access mode, public network access is governed entirely by the network security perimeter, and the store's public network access setting is ignored. For more information, see [Moving new resources into network security perimeter](../private-link/network-security-perimeter-transition.md#moving-new-resources-into-network-security-perimeter).

## Private access through private endpoints

Clients can reach your App Configuration store privately from a virtual network by using a private endpoint. A private endpoint is a network interface powered by Azure Private Link that connects clients in your virtual network to your App Configuration store over the Microsoft backbone network, without exposing traffic to the public internet.

Private endpoints work independently of how you configure public network access or a network security perimeter, so you can combine them with the public network access setting or a network security perimeter for defense in depth.

For more information, see [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md).

## Public network access setting

The public network access setting on an App Configuration store controls how the store can communicate over the public internet. It can have one of the following values:

- **Automatic**: Inbound public network access is enabled until you create a private endpoint for the store. Once a private endpoint exists, inbound public network access is automatically disabled. Outbound public network access is allowed. This option can only be selected when creating a store.
- **Enabled**: All networks can access the store over the public internet. Outbound public network access is allowed.
- **Disabled**: Inbound public network access is disabled. The store can only be reached through a private endpoint. Outbound public network access is allowed.
- **Secured by perimeter**: Inbound public network access is disabled. Only traffic from a private endpoint or traffic allowed by an associated network security perimeter can access the store. Outbound public network access is governed by the associated network security perimeter, or denied if no perimeter is associated. 

As noted earlier, this setting is ignored when the store is associated with a network security perimeter in Enforced access mode.

For step-by-step instructions on changing this setting, see [Disable public access in Azure App Configuration](./howto-disable-public-access.md).

## Related content

- [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md)
- [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md)
- [Disable public access in Azure App Configuration](./howto-disable-public-access.md)
- [Network access errors](./network-access-errors.md)
