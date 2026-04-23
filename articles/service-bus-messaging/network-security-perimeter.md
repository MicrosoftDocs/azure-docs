---
title: Network Security Perimeter
titleSuffix: Azure Service Bus
description: Learn how to associate an Azure Service Bus namespace with a network security perimeter.
ms.reviewer: spelluru
ms.date: 04/10/2026
author: EldertGrootenboer
ms.author: egrootenboer
ms.topic: feature-guide
ms.custom:
---

# Network security perimeter for Azure Service Bus

[Azure Service Bus](./service-bus-messaging-overview.md) supports integration with a [network security perimeter](../private-link/network-security-perimeter-concepts.md).

A network security perimeter helps safeguard network traffic between Azure Service Bus and other platform as a service (PaaS) offerings like Azure Key Vault. By confining communication solely to Azure resources within its boundaries, a network security perimeter blocks unauthorized attempts to access other resources.

With a network security perimeter:

- PaaS resources associated with a specific perimeter can, by default, communicate with only other PaaS resources within the same perimeter.
- You can actively permit external inbound and outbound communication by setting explicit access rules.
- [Diagnostic logs](../private-link/network-security-perimeter-diagnostic-logs.md) are enabled for PaaS resources within the perimeter for audit and compliance.

Integrating Service Bus within this framework enhances messaging capabilities while providing robust security measures. This integration improves platform scalability and reliability. It also strengthens data protection strategies to mitigate risks associated with unauthorized access or data breaches.

By operating as a service under Azure Private Link, a network security perimeter facilitates secure communication for PaaS services deployed outside the virtual network. It enables seamless interaction among PaaS services within the perimeter and facilitates communication with external resources through carefully configured access rules. It also supports outbound resources such as Azure Key Vault for customer-managed keys (CMKs). This support further enhances its versatility and utility in diverse cloud environments.

## Scenarios for network security perimeters in Service Bus

Azure Service Bus supports scenarios that require access to other PaaS resources. CMKs require communication with Azure Key Vault. For more information, see [Configure customer-managed keys for encrypting Azure Service Bus data at rest](configure-customer-managed-key.md).

For legacy geo-disaster recovery (alias-based pairing), both the primary and secondary namespaces must be associated with the same network security perimeter. If only the primary is associated, pairing fails.

Network security perimeter rules don't govern private link traffic through [private endpoints](../private-link/private-endpoint-overview.md).

## Create a network security perimeter

Create your own network security perimeter resource by using the [Azure portal](../private-link/create-network-security-perimeter-portal.md), [Azure PowerShell](../private-link/create-network-security-perimeter-powershell.md), or the [Azure CLI](../private-link/create-network-security-perimeter-cli.md).

## Associate Service Bus with a network security perimeter in the Azure portal

You can associate your Service Bus namespace with a network security perimeter directly from the Service Bus namespace in the Azure portal:

1. On the page for your Service Bus namespace, under **Settings**, select **Networking**.

1. Select the **Public access** tab.

1. In the **Network security perimeter** section, select **Associate**.

1. In the **Select network security perimeter** dialog, search for and select the network security perimeter that you want to associate with the namespace.

1. Select a profile to associate with the namespace.

1. Select **Associate** to complete the association.

## Verify the association by using the Azure CLI

To verify that your namespace is associated with a network security perimeter:

```azurecli
az servicebus namespace network-rule-set show \
  --name <namespace-name> \
  --resource-group <resource-group>
```

When the association exists, the `publicNetworkAccess` field shows `SecuredByPerimeter`.

## Troubleshoot

### Feature availability

Some capabilities of network security perimeters require feature flags to be registered on your subscription. If you encounter a "This feature isn't available for given subscription" error when configuring access rules or perimeter links, register the required feature flag and re-register the network provider:

| Capability | Feature flag | Registration command |
| ---------- | ------------ | -------------------- |
| Cross-perimeter links | `AllowNspLink` | `az feature register --namespace Microsoft.Network --name AllowNspLink` |
| Service tag inbound rules | `EnableServiceTagsInNsp` | `az feature register --namespace Microsoft.Network --name EnableServiceTagsInNsp` |

After the registration, propagate the change:

```azurecli
az provider register -n Microsoft.Network
```

Feature flag propagation can take up to 15 minutes.

### Namespace association with a network security perimeter

When you're creating a legacy geo-disaster recovery pairing, the primary and secondary namespaces must be associated with the same network security perimeter. If you encounter a "DisasterRecoveryConfigSecondaryMustHaveAssociationsUnderSameNSP" error, associate the secondary namespace with the same perimeter, and then retry the pairing.

## Related content

- [What is a network security perimeter?](../private-link/network-security-perimeter-concepts.md)
- [Diagnostic logs for network security perimeters](../private-link/network-security-perimeter-diagnostic-logs.md)
- [Network security for Azure Service Bus](./network-security.md)
- [Allow access to Azure Service Bus namespaces via private endpoints](./private-link-service.md)
- [Configure customer-managed keys for Azure Service Bus](configure-customer-managed-key.md)
