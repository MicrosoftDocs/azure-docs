---
title: Azure Virtual Enclaves FAQ
description: See answers to frequently asked questions (FAQ) about Azure Virtual Enclaves.
author: aserfass-msft
ms.author: aserfass
# ms.service: azure-virtual-enclave
ms.topic: concept-article
ms.date: 04/08/2025
---

# Virtual Enclaves FAQ

### Is Azure Virtual Enclaves in GA?

Yes, Azure Virtual WAN is Generally Available (GA). However, Virtual WAN consists of several features and scenarios. There are features or scenarios within Virtual WAN where Microsoft applies the Preview tag. In those cases, the specific feature, or the scenario itself, is in Preview. If you don't use a specific preview feature, regular GA support applies. For more information about Preview support, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### What is Azure Virtual Enclaves?
Azure Virtual Enclaves is a hub-and-spoke network architecture with network isolation and policy enforcement out of the box. [Learn more](./what-azure-virtual-enclaves.md)

### Why should I use Azure Virtual Enclaves?
Azure Virtual Enclaves creates a secure foundation in a known configuration so you can get compliance approval faster and deploy your workloads. [Learn more](./why-azure-virtual-enclaves.md)

### Where can I find a quickstart for Azure Virtual Enclaves?
You can easily deploy customized individual components from the portal, but we also offer quickstart reference architectures. [Learn more](./azure-virtual-enclaves-templates.md)

### Can Azure Virtual Enclaves resources scale across multiple subscriptions?
Yes, communities and enclaves can exist in one subscription or in separate subscriptions within the same tenant. This allows separate organizations to pay for the resources associated with each enclave if that fits your use case. [Learn more](./azure-virtual-enclaves-resource-groups.md#multi-subscription-deployment-architecture)

### Which regions are Azure Virtual Enclaves available in today?
The current regions Azure Virtual Enclaves is available in can be viewed [here](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

### What roles are used to manage permissions for Azure Virtual Enclaves resources?
Azure Virtual Enclaves includes news roles to help you manage your environments with least privileges. These roles include: owner, contributor, reader, and approver scoped at the community or enclave (e.g. “community owner”). [Learn more](https://aka.ms/ave/concept/rbac)