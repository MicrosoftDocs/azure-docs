---
title: Azure Service Bus with confidential computing
description: Learn how to enable confidential computing on Azure Service Bus Premium namespaces to protect data in use with hardware-based trusted execution environments.
ms.topic: conceptual
ms.date: 01/22/2026
ms.service: azure-service-bus
author: EldertGrootenboer
ms.author: egrootenboer
# Customer intent: As a security administrator or developer, I want to enable confidential computing on Azure Service Bus to protect sensitive messaging data in use with hardware-based isolation.
---

# Azure Service Bus confidential computing overview

Azure Service Bus Premium supports [confidential computing](../confidential-computing/overview.md) to protect your messaging data in use. Confidential computing uses hardware-based trusted execution environments (TEEs) to provide enhanced data protection, preventing unauthorized access to your messages while they're being processed.

When you enable confidential computing on a Service Bus Premium namespace, your data benefits from hardware-level isolation in addition to existing encryption at rest and in transit. This capability helps organizations that handle sensitive or regulated data meet strict security and compliance requirements.

## Benefits

Confidential computing for Azure Service Bus provides the following advantages:

- **No code changes required**: Enable confidential computing at the namespace level without modifying your applications or messaging patterns.
- **Defense in depth**: Combines with existing Service Bus security features like [customer-managed keys](configure-customer-managed-key.md), [private endpoints](private-link-service.md), and [managed identities](service-bus-managed-service-identity.md).
- **Messaging-specific protection**: Your queues, topics, and subscriptions benefit from hardware-level isolation during message processing.

## Regional availability

Confidential computing for Azure Service Bus is available in select regions.

| Region |
|--------|
| Korea Central |
| UAE North |

## Limitations

The following limitations apply to confidential computing for Azure Service Bus:

- Confidential computing is available only on the **[Premium tier](service-bus-premium-messaging.md)**.
- You must enable confidential computing during namespace creation. You can't enable it on existing namespaces.

## Enable confidential computing by using the Azure portal

1. Go to the [Azure portal](https://portal.azure.com) and open the Service Bus namespace creation page.

1. Select **Premium** for the pricing tier.

1. Select a [supported region](#regional-availability) as the location.

1. For **Confidential compute**, select **Enabled**.

    :::image type="content" source="./media/confidential-computing/enable-confidential-computing-portal.png" alt-text="Screenshot showing the Create namespace page with the Confidential compute toggle enabled.":::

1. Fill in the remaining required fields for your namespace configuration.

1. Select **Review + create**, and then select **Create** to deploy the namespace with confidential computing enabled.

## Enable confidential computing by using a template

You can enable confidential computing programmatically by including the `platformCapabilities` property in your deployment template.

# [Bicep](#tab/bicep)

The following Bicep file creates a Service Bus Premium namespace with confidential computing enabled:

```bicep
@description('Name of the Service Bus namespace')
param namespaceName string

@description('Location for the namespace. Must be a region that supports confidential computing.')
@allowed([
  'koreacentral'
  'uaenorth'
])
param location string = 'uaenorth'

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2025-05-01-preview' = {
  name: namespaceName
  location: location
  sku: {
    name: 'Premium'
    tier: 'Premium'
    capacity: 1
  }
  properties: {
    platformCapabilities: {
      confidentialCompute: {
        mode: 'Enabled'
      }
    }
  }
}
```

# [ARM template](#tab/arm)

The following ARM template creates a Service Bus Premium namespace with confidential computing enabled:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaceName": {
            "type": "string",
            "metadata": {
                "description": "Name of the Service Bus namespace"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "uaenorth",
            "allowedValues": [
                "koreacentral",
                "uaenorth"
            ],
            "metadata": {
                "description": "Location for the namespace. Must be a region that supports confidential computing."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.ServiceBus/namespaces",
            "apiVersion": "2025-05-01-preview",
            "name": "[parameters('namespaceName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Premium",
                "tier": "Premium",
                "capacity": 1
            },
            "properties": {
                "platformCapabilities": {
                    "confidentialCompute": {
                        "mode": "Enabled"
                    }
                }
            }
        }
    ]
}
```

---

## Combine confidential computing with customer-managed keys

For maximum data protection, combine confidential computing with [customer-managed keys](configure-customer-managed-key.md) backed by [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview). This combination ensures that:

- Your data is protected in use by confidential computing.
- Your encryption keys are stored in validated hardware security modules.
- You maintain full control over your encryption keys.

## Use Azure Policy to enforce confidential computing

Create an Azure Policy definition to enforce that all Premium Service Bus namespaces in your organization have both confidential computing and customer-managed keys enabled. This approach ensures consistent security configuration across your Azure environment.

The following policy definition denies or audits the creation of Premium Service Bus namespaces that don't meet these security requirements:

```json
{
    "mode": "All",
    "parameters": {
        "effect": {
            "type": "String",
            "metadata": {
                "displayName": "Effect",
                "description": "Deny or Audit"
            },
            "allowedValues": [
                "Deny",
                "Audit"
            ],
            "defaultValue": "Deny"
        }
    },
    "policyRule": {
        "if": {
            "allOf": [
                {
                    "field": "type",
                    "equals": "Microsoft.ServiceBus/namespaces"
                },
                {
                    "field": "Microsoft.ServiceBus/namespaces/sku.tier",
                    "equals": "Premium"
                },
                {
                    "anyOf": [
                        {
                            "anyOf": [
                                {
                                    "not": {
                                        "field": "Microsoft.ServiceBus/namespaces/encryption.keySource",
                                        "equals": "Microsoft.KeyVault"
                                    }
                                },
                                {
                                    "not": {
                                        "field": "Microsoft.ServiceBus/namespaces/encryption.keyVaultProperties[*].keyVaultUri",
                                        "contains": ".managedhsm.azure.net/"
                                    }
                                },
                                {
                                    "anyOf": [
                                        {
                                            "field": "identity.type",
                                            "equals": "None"
                                        },
                                        {
                                            "field": "identity.type",
                                            "exists": false
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "not": {
                                "field": "Microsoft.ServiceBus/namespaces/platformCapabilities.confidentialCompute.mode",
                                "equals": "Enabled"
                            }
                        }
                    ]
                }
            ]
        },
        "then": {
            "effect": "[parameters('effect')]"
        }
    }
}
```

To use this policy, create a custom policy definition in Azure Policy and assign it to the appropriate scope, such as a management group, subscription, or resource group.

> [!NOTE]
> When combining confidential computing with customer-managed keys, use a user-assigned managed identity. This requirement exists because the identity must be granted access to the Managed HSM before creating the namespace. A system-assigned identity only exists after the namespace is created.

## Related content

- [What is confidential computing?](../confidential-computing/overview.md)
- [Azure confidential computing products](../confidential-computing/overview-azure-products.md)
- [Confidential computing use cases](../confidential-computing/use-cases-scenarios.md)
- [Configure customer-managed keys for Azure Service Bus](configure-customer-managed-key.md)
- [Azure Service Bus Premium messaging tier](service-bus-premium-messaging.md)
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)