---
title: Network security perimeter for Azure App Configuration
description: Learn how to use network security perimeter with Azure App Configuration 
services: azure-app-configuration
author: austintolani
ms.author: austintolani 
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 04/22/2026

# customer intent: As a developer or administrator using Azure App Configuration, I want to understand how network security perimeter works so that I can manage network access to my configuration store alongside other PaaS resources.
---
# Network security perimeter for Azure App Configuration (preview)

[Azure network security perimeter (NSP)](../private-link/network-security-perimeter-concepts) allows you to define a logical network isolation boundary for PaaS resources that are deployed outside of a virtual network. By default, a network security perimeter restricts public network access to PaaS resources within the perimeter. However, you can configure explicit access rules for inbound and outbound traffic.

> [!IMPORTANT]
> Network security perimeter is currently in preview. See [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms of use.

When you associate a configuration store with a network security perimeter, you gain the following capabilities:

- **Logical network isolation boundary**: A network security perimeter provides a logical isolation boundary for your configuration store and other associated PaaS resources. By default, public network access to resources within the perimeter is restricted, providing an additional layer of security.
- **Inbound access rules**: Control which IP addresses or subscriptions can access your configuration store. 
- **Outbound access rules**: Control which resources your configuration store can communicate with (for example, an Azure Key Vault when using [customer-managed key encryption](./concept-customer-managed-keys)). 
- **Shared configuration across PaaS resources**: Share a collection of access rules across multiple PaaS resources using network security perimeter profiles. 
- **Diagnostic logging**: Monitor network traffic to and from your configuration store through network security perimeter diagnostic logs.

> [!NOTE]
> Allow up to 15 minutes for the any changes to network security perimeter configuration to take effect at the data plane level.

## Limitations
- Certain network security perimeter features, such as subscription-based inbound access rules, do not work with [access key authentication](./howto-disable-access-key-authentication). Use [Entra ID authentication[(./concept-enable-rbac) for full NSP functionality.
- At this time, a configuration store in a network security perimeter is unable to send events to Azure Event Grid. If a configuration store has an Azure App Configuration event subscription configured, you will not be able to associate the store with a network security perimeter. Similarly, if a store is associated with a network security perimeter, you will not be able to enable an event subscription for the store.

> tatic website, being open in nature cannot be used with network security perimeter. If static website is already enabled, you cannot associate a network security perimeter. Similarly, if a network security perimeter is already associated, you cannot enable static website. This restriction prevents you from configuring an unsupported scenario.

## Troubleshooting
- Feature not registered
- Cross subscription
- Event grid 

## Related content

- [Network security overview for Azure App Configuration](concept-network-security.md)
