---
title: Network security perimeter for Azure App Configuration
description: Learn how to use network security perimeter with Azure App Configuration.
services: azure-app-configuration
author: austintolani
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 04/22/2026

# customer intent: As a developer or administrator using Azure App Configuration, I want to understand how network security perimeters work so that I can manage network access to my configuration store alongside other PaaS resources.
---
# Network security perimeter for Azure App Configuration (preview)

## Overview

[Azure network security perimeter (NSP)](../private-link/network-security-perimeter-concepts.md) allows you to define a logical network isolation boundary for PaaS resources, such as a configuration store, that are deployed outside of a virtual network. By default, a network security perimeter restricts public network access to PaaS resources within the perimeter. However, you can configure explicit access rules for inbound and outbound traffic.

> [!IMPORTANT]
> Network security perimeter is currently in preview. See [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms of use.

When you associate a configuration store with a network security perimeter, you gain the following capabilities:

- **Logical network isolation boundary**: A network security perimeter provides a logical isolation boundary for your configuration store and other associated PaaS resources. By default, public network access to resources within the perimeter is restricted, providing an additional layer of security.
- **Inbound access rules**: Control which IP addresses or subscriptions can access your configuration store.
- **Outbound access rules**: Control which resources your configuration store can communicate with (for example, an Azure Key Vault when using [customer-managed key encryption](./concept-customer-managed-keys.md)).
- **Shared configuration across PaaS resources**: Share a collection of access rules across multiple PaaS resources using network security perimeter profiles.
- **Diagnostic logging**: Monitor network traffic to and from your configuration store through network security perimeter diagnostic logs.

## Transitioning to a network security perimeter

A resource association supports two access modes: **Transition** and **Enforced**. Transition mode lets you adopt a network security perimeter without disrupting existing connectivity by falling back to the configuration store's existing network access rules when no perimeter rule matches. See [Transition to a network security perimeter in Azure](../private-link/network-security-perimeter-transition.md) to learn how to use Transition mode to ensure a smooth transition to adopting NSP.

## Access mode and public network access

When a store is associated with a NSP, the network access rules enforced on the configuration store depend on the combination of two settings: the association's **access mode** (Transition or Enforced) and the configuration store's public network access setting (Enabled, Disabled, or SecuredByPerimeter). Together, these settings determine whether inbound and outbound traffic is evaluated against the perimeter's access rules and/or the configuration store's public network access setting.

For a complete breakdown of how these settings interact, see [Moving new resources into network security perimeter](../private-link/network-security-perimeter-transition.md#moving-new-resources-into-network-security-perimeter).

## Considerations for customer-managed key encryption

If your configuration store uses [customer-managed key encryption](./concept-customer-managed-keys.md), the store communicates with Azure Key Vault to access your encryption key. When the store's outbound requests are abiding by NSP rules (public network access is SecuredByPerimeter **or** NSP assocation is in Enforced mode), this outbound communication to Azure Key Vault is subject to the perimeter's access rules. To ensure your configuration store can continue to access the encryption key, you must configure your network security perimeter in either of the following ways:

- **Same perimeter**: Place the Azure Key Vault in the same network security perimeter as your configuration store. When both resources are within the same perimeter, communication between them is automatically allowed.
- **FQDN outbound access rule**: Add a fully qualified domain name (FQDN) outbound access rule to the network security perimeter profile associated with your configuration store. The rule must list the endpoint of the Key Vault holding the customer-managed key (for example, `mykeyvault.vault.azure.net`).

If neither condition is met, the configuration store can't access the encryption key, and requests to the store will fail.

## Considerations for monitoring

If your configuration store has [monitoring](./monitor-app-configuration.md) enabled through diagnostic settings, log destinations (such as Log Analytics workspaces, storage accounts, and event hubs) must be in the same network security perimeter as the configuration store. FQDN outbound access rules don't apply to monitoring destinations, so any destination outside the perimeter won't receive diagnostic data.

## Limitations
- Certain network security perimeter features, such as subscription-based inbound access rules, don't work with [access key authentication](./howto-disable-access-key-authentication.md). Use [Microsoft Entra ID authentication](./concept-enable-rbac.md) for full NSP functionality.
- At this time, a configuration store in a network security perimeter can't send events to Azure Event Grid. If a configuration store has an Azure App Configuration event subscription configured, you can't associate the store with a network security perimeter. Similarly, if a store is associated with a network security perimeter, you can't enable an event subscription for the store.
- Subscription-based and IP-based inbound access rules don't apply to the original caller for data plane requests made through [deployment](./quickstart-deployment-overview.md) tools such as ARM templates, Bicep, or Terraform. Because these requests are forwarded to the configuration store by Azure Resource Manager, the original caller's subscription and IP address aren't passed to the perimeter for evaluation.

## Troubleshooting

**RP registration errors**

If you associate a configuration store with a network security perimeter in a different subscription than the store, you must ensure that the network security perimeter's subscription has the `Microsoft.AppConfiguration` resource provider registered. If the resource provider isn't registered, you receive the following error when performing the association:

"The network security perimeter's subscription 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e' is not registered to use resource provider 'Microsoft.AppConfiguration'. See https://aka.ms/registerrp for instructions on registering a resource provider."

To resolve the situation, take the following steps:
1. Register the `Microsoft.AppConfiguration` resource provider in the network security perimeter's subscription.
2. Re-attempt the association between the configuration store and the network security perimeter.

For more information about registering a subscription to a resource provider, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

**Customer-managed key access errors**

If your configuration store uses [customer-managed key encryption](./concept-customer-managed-keys.md), you might receive the following error when associating the store with a network security perimeter:

"The requested Network Security Perimeter association cannot be applied because it would block access to the configuration store's customer-managed key. See https://aka.ms/appconfig/NSPTroubleshooting for guidance on configuring an NSP for configuration stores that use a customer-managed key."

This error occurs when the network security perimeter's configuration would prevent the configuration store from reaching the Azure Key Vault that holds its customer-managed key. To resolve the situation, configure the network security perimeter to permit access to the Key Vault as described in [Considerations for customer-managed key encryption](#considerations-for-customer-managed-key-encryption), then re-attempt the association.

## Related content

- [What is Azure network security perimeter?](../private-link/network-security-perimeter-concepts.md)
- [Network security overview for Azure App Configuration](./concept-network-security.md)
- [Associate with a network security perimeter](./howto-set-up-nsp.md)
- [Transition to a network security perimeter in Azure](../private-link/network-security-perimeter-transition.md).

