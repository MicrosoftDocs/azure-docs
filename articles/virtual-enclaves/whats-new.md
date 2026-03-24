---
title: What's new in Azure Virtual Enclaves?
description: Learn what's new with Azure Virtual Enclaves such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.date: 3/23/2026
---

# What's new in Azure Virtual Enclaves?

Azure Virtual Enclaves is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

* [Recently released features](#recently-released)
* [Previews](#preview) underway with known limitations (if applicable)

You can also find the latest Azure Virtual Enclaves updates and subscribe to the [RSS feed](https://azure.microsoft.com/updates?filters=%5B%22Virtual+Enclaves%22%5D).

## Recently released

The following networking features have been released and are now generally available.

### March 2026

| Feature | Description | Documentation |
|---------|-------------|---------------|
| **Service Tags for community endpoints** | Community endpoint rules now support Azure Service Tags, enabling simplified firewall rule management for Azure services. Service Tags represent groups of IP address prefixes that Azure automatically maintains, eliminating the need to manually update rules when service IP addresses change. | [What is a community endpoint?](./what-community-endpoint.md) |
| **FQDN network rules for community endpoints** | Community endpoints now support FQDN-based Azure Firewall network rules for TCP and UDP protocols. This enables enclaves to connect to domain-based destinations without maintaining static IP address lists. | [What is a community endpoint?](./what-community-endpoint.md) |
| **Community endpoints for common services** | Pre-configured community endpoints for commonly needed services are now available, including Azure management, Microsoft Update, monitoring, identity, and certificate services. These built-in endpoints simplify connectivity configuration and follow Microsoft best practices. | [Create a community endpoint](./create-community-endpoint-portal.md) |
| **Transit hub interconnection** | Enclave connections now support connecting transit hubs within the same community, enabling traffic flow between different external network connections. This supports cross-region connectivity, network segmentation, and redundant connectivity patterns. | [What is an enclave connection?](./what-enclave-connection.md) |
| **Simplified S2S connections for Azure Local and on-premises** | Transit hubs now provide streamlined site-to-site VPN connectivity for Azure Local and on-premises environments. The simplified configuration reduces complexity with wizard-based setup, pre-configured security settings, and automated routing. | [What is a transit hub?](./what-transit-hub.md) |

## Preview

The following features are currently in gated preview. After working with the listed articles, if you have questions or require support, reach out to the contact alias (if available) that corresponds to the feature.

| Type of preview | Feature | Description | Limitations |
|-----------------|---------|-------------|-------------|
| Preview | Approvals | Approvals require more oversight on critical Azure Virtual Enclaves actions. Approvals enable administrators to queue the creation of new resources or change existing resources while requiring oversight and approval before the change can be made. | |

## Next steps

For more information about Azure Virtual Enclaves, see [What is Azure Virtual Enclaves](./what-azure-virtual-enclaves.md) and [frequently asked questions- FAQ](./virtual-enclaves-faq.md).