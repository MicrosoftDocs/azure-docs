---
title: Recommended security practices
description: Managed services offers allow service providers to sell resource management offers to customers in Azure Marketplace.
author: JnHs
ms.service: lighthouse
ms.author: jenhayes
ms.date: 06/26/2019
ms.topic: overview
manager: carmonm
---

# Managed services offers in Azure Marketplace

When using Azure delegated resource management, it’s important to consider  security and access control. Users in your tenant will have direct access to customer subscriptions and resource groups, so you’ll want to take steps to maintain your tenant’s security. You’ll also want to make sure you only allow the access that’s needed to effectively manage your customers’ resources. This topic provides recommendations to help you do so.

## Require multi-factor authentication

[Multi-factor authentication](../../active-directory/authentication/concept-mfa-howitworks.md)  (also known as two-step verification) helps prevent attackers from gaining access to an account by requiring multiple authentication steps. You should use multi-factor authentication for all users in your service provider tenant, including any users who will have access to customer resources. You should also ask your customers to implement multi-factor authentication in their tenant.

## Next steps

- Learn about [Azure Delegated Resource Management](azure-delegated-resource-management.md) and the [cross-tenant management experience](cross-tenant-management-experience.md).
- [Publish managed services offers](../how-to/publish-managed-services-offers.md) to Azure Marketplace.