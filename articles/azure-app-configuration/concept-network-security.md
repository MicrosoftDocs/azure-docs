---
title: Network security overview for Azure App Configuration
description: Learn about network security options in Azure App Configuration, including private endpoints, public access controls, and network security perimeters.
services: azure-app-configuration
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 04/22/2026

# customer intent: As a developer or administrator using Azure App Configuration, I want to understand the network security options available so that I can protect my configuration data from unauthorized network access.
---
# Network security for Azure App Configuration

Azure App Configuration provides multiple layers of network security to help you protect access to your configuration data. These controls allow you to restrict which networks, services, and clients can reach your App Configuration store.

## Network security options

Azure App Configuration supports the following network security capabilities:

| Feature | Description |
| --- | --- |
| [Private endpoints](concept-private-endpoint.md) | Allow clients in a virtual network to access your App Configuration store over a private link, eliminating exposure to the public internet. |
| [Disable public access](howto-disable-public-access.md) | Block all internet-based connections and force all communication through private endpoints. |
| [Network security perimeter](concept-nsp.md) | Define a logical network boundary for your App Configuration store and other PaaS resources to control inbound and outbound access. |

## Choosing a network security approach

The right approach depends on your requirements:

- **Private endpoints** are ideal when your clients reside in an Azure virtual network and you want to ensure all traffic stays on the Microsoft backbone network.
- **Disabling public access** provides an additional layer of protection when using private endpoints by blocking all internet-based connections.
- **Network security perimeter (preview)** provides a centralized way to manage network access rules across multiple PaaS resources, simplifying governance for organizations with many Azure services.

You can combine these features for defense in depth. For example, you can use private endpoints for virtual network clients, disable public access to block internet traffic, and associate your store with a network security perimeter for centralized policy management.

## Related content

- [Use private endpoints for Azure App Configuration](concept-private-endpoint.md)
- [Set up private access in Azure App Configuration](howto-set-up-private-access.md)
- [Disable public access in Azure App Configuration](howto-disable-public-access.md)
- [Network security perimeter for Azure App Configuration](concept-nsp.md)
- [Troubleshoot network access errors](network-access-errors.md)
