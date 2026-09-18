---
title: What's new in Azure Enclave?
description: Learn about recent Azure Enclave feature updates and preview capabilities.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.service: azure-enclave
ai-usage: ai-assisted
ms.date: 09/11/2026
---

# What's new in Azure Enclave?

Azure Enclave is updated regularly. Use this article to track recent feature updates, preview capabilities, known limitations, and related documentation.

This article includes:

- [Recently released features](#recently-released)
- [Preview features](#preview)

For service announcements, see the [Azure updates page](https://azure.microsoft.com/updates?filters=%5B%22Virtual+Enclaves%22%5D).

## Recently released

The following Azure Enclave features are available.

### March 2026

| Feature | Release status | Description | Documentation |
|---------|----------------|-------------|---------------|
| Service Tags for community endpoints | Available | Community endpoint rules support Azure Service Tags, which simplify firewall rule management for Azure services. Service Tags represent groups of IP address prefixes that Azure maintains automatically. Supported protocols include TCP, UDP, ICMP, and ANY. | [What is a community endpoint?](./what-community-endpoint.md) |
| FQDN rules for community endpoints | Available | Community endpoints support FQDN destinations. Azure Firewall uses application rules for HTTP and HTTPS and network rules for TCP and UDP. FQDN rules require a supported firewall SKU and use one protocol and one port per rule. | [What is a community endpoint?](./what-community-endpoint.md) |
| Community endpoints for supported services | Available | Community endpoints can target supported service tags and FQDN tags. Supported destinations depend on the Azure Enclave API and runtime. | [Create a community endpoint](./create-community-endpoint-portal.md) |
| Transit hub interconnection | Available | Enclave connections support transit-hub source connections within a community, which helps define traffic paths between trusted external network connections. | [What is an enclave connection?](./what-enclave-connection.md) |
| Simplified S2S connections | Available | Transit hubs support gateway, ExpressRoute, and peering connection patterns for trusted external networks. | [What is a transit hub?](./what-transit-hub.md) |

## Preview

The following features are currently in preview. Preview features might have limited availability, constrained capabilities, or support requirements that differ from released features.

| Type of preview | Feature | Description | Documentation |
|-----------------|---------|-------------|-------------|
| Preview | Approvals | When configured, the Approvals stage supports resource actions until an approval callback completes. Coverage is action and resource specific. | [Configure approval settings](./configure-approvals.md) |

## Next steps

For more information about Azure Enclave, see:
- [What is Azure Enclave?](./what-azure-enclave.md)
- [Azure Enclave frequently asked questions](./azure-enclave-faq.md)
