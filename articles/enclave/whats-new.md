---
title: What's new in Azure Enclave?
description: Learn what's new with Azure Enclave such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.date: 06/12/2026
---

# What's new in Azure Enclave?

Azure Enclave is updated regularly. Use this article to track recent feature updates, preview capabilities, known limitations, and related documentation.

This article includes:

* [Recently released features](#recently-released)
* [Preview features](#preview)

You can also find Azure Enclave updates and subscribe to the [Azure updates RSS feed](https://azure.microsoft.com/updates?filters=%5B%22Virtual+Enclaves%22%5D).

## Recently released

The following Azure Enclave networking features are available.

### March 2026

| Feature | Release status | Description | Documentation |
|---------|----------------|-------------|---------------|
| Service Tags for community endpoints | Available | Community endpoint rules support Azure Service Tags, which simplify firewall rule management for Azure services. Service Tags represent groups of IP address prefixes that Azure maintains automatically. Supported protocols include TCP, UDP, ICMP, and ANY. | [What is a community endpoint?](./what-community-endpoint.md) |
| FQDN network rules for community endpoints | Available | Community endpoints support FQDN-based Azure Firewall network rules for HTTP, HTTPS, TCP, and UDP. This support lets enclaves connect to domain-based destinations without maintaining static IP address lists. FQDN network rules require a supported firewall SKU and use one protocol and one port per rule. | [What is a community endpoint?](./what-community-endpoint.md) |
| Community endpoints for common services | Available | Community endpoints can simplify connectivity configuration for common service dependencies such as Azure management, Microsoft Update, monitoring, identity, and certificate services. | [Create a community endpoint](./create-community-endpoint-portal.md) |
| Transit hub interconnection | Available | Enclave connections support transit-hub source connections within a community, which helps define traffic paths between trusted external network connections. | [What is an enclave connection?](./what-enclave-connection.md) |
| Simplified S2S connections | Available | Transit hubs support gateway, ExpressRoute, and peering connection patterns for trusted external networks. | [What is a transit hub?](./what-transit-hub.md) |

## Preview

The following features are currently in preview. Preview features might have limited availability, constrained capabilities, or support requirements that differ from released features.

| Type of preview | Feature | Description | Limitations |
|-----------------|---------|-------------|-------------|
| Preview | Approvals | Approvals require more oversight on critical Azure Enclave actions. Approvals enable administrators to queue the creation of new resources or change existing resources while requiring oversight and approval before the change can be made. | [Configure approval settings](./configure-approvals.md) |

## Next steps

For more information about Azure Enclave, see:
  * [What is Azure Enclave?](./what-azure-enclave.md)
  * [Frequently asked questions - FAQ](./azure-enclave-faq.md).
