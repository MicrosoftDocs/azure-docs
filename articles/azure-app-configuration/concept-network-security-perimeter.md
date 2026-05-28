---
title: Network security perimeter for Azure App Configuration
description: Learn how to use network security perimeter with Azure App Configuration.
services: azure-app-configuration
author: austintolani
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 05/18/2026

# customer intent: As a developer or administrator using Azure App Configuration, I want to understand how network security perimeters work so that I can manage network access to my App Configuration store alongside other PaaS resources.
---
# Network security perimeter for Azure App Configuration (preview)

[Azure network security perimeter (NSP)](../private-link/network-security-perimeter-concepts.md) allows you to define a logical network isolation boundary for PaaS resources, such as an App Configuration store, that are deployed outside of a virtual network. By default, a network security perimeter restricts public network access to PaaS resources within the perimeter. However, you can configure explicit access rules for inbound and outbound traffic.

When you associate an App Configuration store with a network security perimeter, you can control inbound and outbound traffic with access rules, share a common set of rules across multiple PaaS resources using perimeter profiles, and monitor network traffic through diagnostic logs. For more information, see [Why use a network security perimeter?](../private-link/network-security-perimeter-concepts.md#why-use-a-network-security-perimeter).

## Transitioning to a network security perimeter

A resource association with a network security perimeter supports two access modes: **Transition** and **Enforced**. Transition mode is intended as a temporary, intermediate step that lets you adopt a network security perimeter without disrupting existing connectivity by falling back to the App Configuration store's existing network access rules when no perimeter rule matches. See [Transition to a network security perimeter in Azure](../private-link/network-security-perimeter-transition.md) to learn how to use Transition mode for a smooth adoption of NSP.

## Access mode and public network access

When an App Configuration store is associated with an NSP, the network access rules enforced on the App Configuration store depend on the combination of two settings: the association's access mode (Transition or Enforced) and the App Configuration store's public network access setting (Enabled, Disabled, or Secured by perimeter). Together, these settings determine whether inbound and outbound traffic is evaluated against the perimeter's access rules, the App Configuration store's public network access setting, or both.

For a complete breakdown of how these settings interact, see [Moving new resources into network security perimeter](../private-link/network-security-perimeter-transition.md#moving-new-resources-into-network-security-perimeter).

## Considerations for customer-managed key encryption

If your App Configuration store uses [customer-managed key encryption](./concept-customer-managed-keys.md), the App Configuration service communicates with an Azure Key Vault resource to access your encryption key. When the store's outbound requests are subject to NSP rules (public network access is Secured by perimeter _or_ the NSP association is in Enforced mode), the perimeter's access rules must permit outbound communication to the Azure Key Vault resource. To ensure the App Configuration service can continue to access the encryption key, you must configure your network security perimeter in either of the following ways:

- **Same perimeter**: Place the Azure Key Vault in the same network security perimeter as your App Configuration store. When both resources are within the same perimeter, communication between them is automatically allowed.
- **FQDN-based outbound access rule**: Add a fully qualified domain name (FQDN) outbound access rule to the network security perimeter profile associated with your App Configuration store. The rule must list the endpoint of the Key Vault holding the customer-managed key (for example, `mykeyvault.vault.azure.net`).

If neither condition is met, the App Configuration store can't access the encryption key, and requests to the store fail.

## Considerations for monitoring

If your App Configuration store has [monitoring](./monitor-app-configuration.md) enabled through diagnostic settings, log destinations (such as Log Analytics workspaces, storage accounts, and event hubs) must be in the same network security perimeter as the App Configuration store. FQDN-based outbound access rules don't apply to monitoring destinations, so any destination outside the perimeter won't receive diagnostic data.

## Limitations

- Certain network security perimeter features, such as subscription-based inbound access rules, don't work with [access key authentication](./howto-disable-access-key-authentication.md). Use [Microsoft Entra ID authentication](./concept-enable-rbac.md) for full NSP functionality.
- At this time, an App Configuration store in a network security perimeter can't send events to Azure Event Grid. If an App Configuration store has an [Azure App Configuration event subscription](./concept-app-configuration-event.md) configured, you can't associate the store with a network security perimeter. Similarly, if a store is associated with a network security perimeter, you can't enable an event subscription for the store.
- Subscription-based and IP-based inbound access rules don't apply to the original caller for data plane requests made through [deployment tools](./quickstart-deployment-overview.md) such as ARM templates, Bicep, or Terraform. Because these requests are forwarded to the App Configuration store by Azure Resource Manager, the original caller's subscription and IP address aren't passed to the perimeter for evaluation.

## Troubleshooting

**RP registration errors**

If you associate an App Configuration store with a network security perimeter in a different subscription than the store, you must ensure that the network security perimeter's subscription has the `Microsoft.AppConfiguration` resource provider registered. If the resource provider isn't registered, you receive the following error when performing the association:

> The network security perimeter's subscription 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e' is not registered to use resource provider 'Microsoft.AppConfiguration'. See https://aka.ms/registerrp for instructions on registering a resource provider.

To resolve this error, take the following steps:
1. Register the `Microsoft.AppConfiguration` resource provider in the network security perimeter's subscription.
2. Re-attempt the association between the App Configuration store and the network security perimeter.

For more information about registering a subscription to a resource provider, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

**Customer-managed key access errors**

If your App Configuration store uses [customer-managed key encryption](./concept-customer-managed-keys.md), you might receive the following error when associating the store with a network security perimeter:

> The requested Network Security Perimeter association cannot be applied because it would block access to the configuration store's customer-managed key. See https://aka.ms/appconfig/NSPTroubleshooting for guidance on configuring an NSP for configuration stores that use a customer-managed key.

This error occurs when the network security perimeter's configuration would prevent the App Configuration store from reaching the Azure Key Vault that holds its customer-managed key. To resolve this error, configure the network security perimeter to permit access to the Key Vault as described in [Considerations for customer-managed key encryption](#considerations-for-customer-managed-key-encryption), then re-attempt the association.

## Related content

- [What is Azure network security perimeter?](../private-link/network-security-perimeter-concepts.md)
- [Network security overview for Azure App Configuration](./concept-network-security.md)
- [Associate with a network security perimeter](./howto-set-up-network-security-perimeter.md)
- [Transition to a network security perimeter in Azure](../private-link/network-security-perimeter-transition.md)
