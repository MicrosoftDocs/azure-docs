---
title: Network security perimeter for Azure App Configuration
description: Learn how to use network security perimeter with Azure App Configuration.
services: azure-app-configuration
author: austintolani
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 04/22/2026

# customer intent: As a developer or administrator using Azure App Configuration, I want to understand how network security perimeter works so that I can manage network access to my configuration store alongside other PaaS resources.
---
# Network security perimeter for Azure App Configuration (preview)

[Azure network security perimeter (NSP)](../private-link/network-security-perimeter-concepts.md) allows you to define a logical network isolation boundary for PaaS resources that are deployed outside of a virtual network. By default, a network security perimeter restricts public network access to PaaS resources within the perimeter. However, you can configure explicit access rules for inbound and outbound traffic.

> [!IMPORTANT]
> Network security perimeter is currently in preview. See [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms of use.

When you associate a configuration store with a network security perimeter, you gain the following capabilities:

- **Logical network isolation boundary**: A network security perimeter provides a logical isolation boundary for your configuration store and other associated PaaS resources. By default, public network access to resources within the perimeter is restricted, providing an additional layer of security.
- **Inbound access rules**: Control which IP addresses or subscriptions can access your configuration store.
- **Outbound access rules**: Control which resources your configuration store can communicate with (for example, an Azure Key Vault when using [customer-managed key encryption](./concept-customer-managed-keys.md)).
- **Shared configuration across PaaS resources**: Share a collection of access rules across multiple PaaS resources using network security perimeter profiles.
- **Diagnostic logging**: Monitor network traffic to and from your configuration store through network security perimeter diagnostic logs.

## Limitations
- Certain network security perimeter features, such as subscription-based inbound access rules, don't work with [access key authentication](./howto-disable-access-key-authentication.md). Use [Microsoft Entra ID authentication](./concept-enable-rbac.md) for full NSP functionality.
- At this time, a configuration store in a network security perimeter can't send events to Azure Event Grid. If a configuration store has an Azure App Configuration event subscription configured, you can't associate the store with a network security perimeter. Similarly, if a store is associated with a network security perimeter, you can't enable an event subscription for the store.

## Troubleshooting

**RP registration errors**

If you associate a configuration store with a network security perimeter in a different subscription than the store, you must ensure that the network security perimeter's subscription has the `Microsoft.AppConfiguration` resource provider registered. If the resource provider isn't registered, you receive the following error when performing the association:

"The network security perimeter's subscription 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e' is not registered to use resource provider 'Microsoft.AppConfiguration'. See https://aka.ms/registerrp for instructions on registering a resource provider."

To resolve the situation, take the following steps:
1. Register the `Microsoft.AppConfiguration` resource provider in the network security perimeter's subscription.
2. Re-attempt the association between the configuration store and the network security perimeter.

For more information about registering a subscription to a resource provider, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

## Related content

- [Network security overview for Azure App Configuration](./concept-network-security.md)
- [Associate with a network security perimeter](./howto-set-up-nsp.md)
- [What is Azure network security perimeter?](../private-link/network-security-perimeter-concepts.md)
