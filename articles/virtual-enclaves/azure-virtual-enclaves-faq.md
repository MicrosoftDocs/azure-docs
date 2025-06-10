---
title: Azure Virtual Enclaves FAQ
description: See answers to frequently asked questions (FAQ) about Azure Virtual Enclaves.
author: aserfass-msft
ms.author: aserfass
# ms.service: azure-virtual-enclave
ms.topic: concept-article
ms.date: 04/08/2025
---

# Azure Virtual Enclaves frequently asked questions (FAQ)
Frequently asked questions (FAQ) about Azure Virtual Enclaves.

## General
General questions about Azure Virtual Enclaves.

### What is Azure Virtual Enclaves?
Azure Virtual Enclaves is a hub-and-spoke network architecture with network isolation and policy enforcement out of the box. [Learn more](./what-azure-virtual-enclaves.md)

### Why should I use Azure Virtual Enclaves?
Azure Virtual Enclaves creates a secure foundation in a known configuration so you can get compliance approval faster and deploy your workloads. [Learn more](./why-azure-virtual-enclaves.md)

## Customer planning
Questions to help customers plan for Azure Virtual Enclaves deployments.

### Is Azure Virtual Enclaves in GA?
Yes, Azure Virtual WAN is Generally Available (GA). However, Virtual WAN consists of several features and scenarios. There are features or scenarios within Virtual WAN where Microsoft applies the Preview tag. In those cases, the specific feature, or the scenario itself, is in Preview. If you don't use a specific preview feature, regular GA support applies. For more information about Preview support, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Where can I find a quickstart for Azure Virtual Enclaves?
You can easily deploy customized individual components from the portal, but we also offer quickstart reference architectures. [Learn more](./azure-virtual-enclaves-templates.md)

### Can Azure Virtual Enclaves resources scale across multiple subscriptions?
Yes, communities and enclaves can exist in one subscription or in separate subscriptions within the same tenant. This allows separate organizations to pay for the resources associated with each enclave if that fits your use case. [Learn more](./azure-virtual-enclaves-resource-groups.md#multi-subscription-deployment-architecture)

### Which regions are Azure Virtual Enclaves available in today?
The current regions Azure Virtual Enclaves is available in can be viewed [here](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

### What roles are used to manage permissions for Azure Virtual Enclaves resources?
Azure Virtual Enclaves includes news roles to help you manage your environments with least privileges. These roles include: owner, contributor, reader, and approver scoped at the community or enclave (e.g. “community owner”). [Learn more](https://aka.ms/ave/concept/rbac)

## Using Azure Virtual Enclaves
Guides for using Azure Virtual Enclaves.

### How do I prevent the creation of new Azure Virtual Enclave resource types?

If you are a cloud engineer and want to restrict the creation of new Communities in your subscription you can use Azure policy to prevent deployment of specific resource types.

Currently, Azure Virtual Enclaves recommends following the [Tutorial: Disallow resource types in your cloud environment](/azure/governance/policy/tutorials/disallowed-resources) and defining the business logic your organization desires. The `Not allowed resource types` and `Allowed resource types` policies are linked in the tutorial.

As an example, to prevent deploying Communities to a Subscription, you would assign the `Not allowed resource type` [policy definition](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6c112d4e-5bc7-47ae-a041-ea2d9dccd749) while including `Microsoft.Mission/communities` in the parameter list of not allowed resource types.

### Can I `move` my enclave?
Moving the enclave resource itself is not supported and moves for some of the resources deployed in the enclave managed resource group also do not support moves actions (for example bastion, ipgroups, and user assigned managed identity).

## Billing
Questions related to Azure Virtual Enclaves billing.

### How does billing work for Azure Virtual Enclaves?
You pay for:
1.	Each enclave on an hourly basis
2.	The usage for any resources managed by Azure Virtual Enclaves to create the community or enclave boundaries and 
3.	Any workloads the customer deploys within their enclaves.

Managed resources for Azure Virtual Enclaves includes:
  - [Virtual WAN](../virtual-wan/virtual-wan-about.md) required for the community
  - [Azure Firewall](../firewall/overview.md) required for the community
  - [Virtual Network](../virtual-network/virtual-networks-overview.md) required for the enclave
  - [Azure DNS](../dns/private-dns-overview.md) required for the enclave
  - [LogA](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-overview) user selectable for community, enclave, or both.

Visit the Azure Virtual Enclaves community and enclave documentation for a complete list of managed resources and visit the Azure Virtual Enclaves pricing page for current costs.

The cost of the Enclave includes the community, community endpoints, enclave endpoints, enclave connections, and transit hub.

### Are partial hours pro-rated?
Enclaves deployed during part of an hour are charged for the full hour.