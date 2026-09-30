---
title: Azure Event Hubs with confidential computing
description: Learn how to enable confidential computing on Azure Event Hubs Dedicated namespaces to protect data in use with hardware-based trusted execution environments.
ms.topic: overview
ms.date: 01/22/2026
ms.service: azure-event-hubs
ms.custom: references_regions
author: axisc
ms.author: achhabria
# Customer intent: As a security administrator or developer, I want to enable confidential computing on Azure Event Hubs to protect sensitive event data in use with hardware-based isolation.
---

# Azure Event Hubs confidential computing overview

Azure Event Hubs Dedicated supports [confidential computing](../confidential-computing/overview.md) to protect your event data in use. Confidential computing uses hardware-based trusted execution environments (TEEs) to provide enhanced data protection, preventing unauthorized access to your events while they're being processed.

When you enable confidential computing on an Event Hubs Dedicated namespace, your data benefits from hardware-level isolation in addition to existing encryption at rest and in transit. This capability helps organizations that handle sensitive or regulated data meet strict security and compliance requirements.

## Benefits

Confidential computing for Azure Event Hubs provides the following advantages:

- **No code changes required**: Enable confidential computing at the namespace level without modifying your applications or event processing patterns.
- **Defense in depth**: Combines with existing Event Hubs security features like [customer-managed keys](configure-customer-managed-key.md), [private endpoints](private-link-service.md), and [managed identities](authenticate-managed-identity.md).
- **Event streaming protection**: Your event hubs benefit from hardware-level isolation during event processing.

## Regional availability

Confidential computing for Azure Event Hubs is available in select regions.

| Region |
|--------|
| Korea Central |
| UAE North |

## Limitations

The following limitations apply to confidential computing for Azure Event Hubs:

- Confidential computing is available only on the **[Dedicated tier](event-hubs-dedicated-overview.md)**.
- You must enable confidential computing during namespace creation. You can't enable it on existing namespaces.

## Enable confidential computing by using the Azure portal

1. Go to the [Azure portal](https://portal.azure.com) and open the Event Hubs namespace creation page.

1. Select **Dedicated** for the pricing tier.

1. Select a [supported region](#regional-availability) as the location.

1. For **Confidential compute**, select **Enabled**.

    :::image type="content" source="./media/confidential-computing/enable-confidential-computing-portal.png" alt-text="Screenshot showing the Create namespace page with the Confidential compute toggle enabled.":::

1. Fill in the remaining required fields for your namespace configuration.

1. Select **Review + create**, and then select **Create** to deploy the namespace with confidential computing enabled.

## Enable confidential computing by using a template

You can enable confidential computing programmatically by including the `platformCapabilities` property in your deployment template.

### Step 1: Create a Dedicated cluster with confidential computing

# [Bicep](#tab/bicep)

The following Bicep file creates an Event Hubs Dedicated cluster with confidential computing enabled:

```bicep
@description('Name of the Event Hubs Dedicated cluster')
param clusterName string

@description('Location for the cluster. Must be a region that supports confidential computing.')
@allowed([
  'koreacentral'
  'uaenorth'
])
param location string = 'uaenorth'

@description('Capacity units for the Dedicated cluster')
@minValue(1)
param capacity int = 1

resource eventHubCluster 'Microsoft.EventHub/clusters@2025-05-01-preview' = {
  name: clusterName
  location: location
  sku: {
    name: 'Dedicated'
    capacity: capacity
  }
  properties: {
    supportsScaling: true
    platformCapabilities: {
      confidentialCompute: {
        mode: 'Enabled'
      }
    }
  }
}

output clusterArmId string = eventHubCluster.id
```

# [ARM template](#tab/arm)

The following ARM template creates an Event Hubs Dedicated cluster with confidential computing enabled:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "clusterName": {
            "type": "string",
            "metadata": {
                "description": "Name of the Event Hubs Dedicated cluster"
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
                "description": "Location for the cluster. Must be a region that supports confidential computing."
            }
        },
        "capacity": {
            "type": "int",
            "defaultValue": 1,
            "minValue": 1,
            "metadata": {
                "description": "Capacity units for the Dedicated cluster"
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.EventHub/clusters",
            "apiVersion": "2025-05-01-preview",
            "name": "[parameters('clusterName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Dedicated",
                "capacity": "[parameters('capacity')]"
            },
            "properties": {
                "supportsScaling": true,
                "platformCapabilities": {
                    "confidentialCompute": {
                        "mode": "Enabled"
                    }
                }
            }
        }
    ],
    "outputs": {
        "clusterArmId": {
            "type": "string",
            "value": "[resourceId('Microsoft.EventHub/clusters', parameters('clusterName'))]"
        }
    }
}
```

---

### Step 2: Create a namespace in the Dedicated cluster

After the cluster is created, create an Event Hubs namespace inside it by referencing the cluster's resource ID.

# [Bicep](#tab/bicep)

```bicep
@description('Name of the Event Hubs namespace')
param namespaceName string

@description('Location for the namespace. Must match the cluster location.')
param location string

@description('Resource ID of the Dedicated cluster')
param clusterArmId string

resource eventHubNamespace 'Microsoft.EventHub/namespaces@2025-05-01-preview' = {
  name: namespaceName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
    capacity: 1
  }
  properties: {
    clusterArmId: clusterArmId
  }
}
```

# [ARM template](#tab/arm)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaceName": {
            "type": "string",
            "metadata": {
                "description": "Name of the Event Hubs namespace"
            }
        },
        "location": {
            "type": "string",
            "metadata": {
                "description": "Location for the namespace. Must match the cluster location."
            }
        },
        "clusterArmId": {
            "type": "string",
            "metadata": {
                "description": "Resource ID of the Dedicated cluster"
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.EventHub/namespaces",
            "apiVersion": "2025-05-01-preview",
            "name": "[parameters('namespaceName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard",
                "tier": "Standard",
                "capacity": 1
            },
            "properties": {
                "clusterArmId": "[parameters('clusterArmId')]"
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

Create an Azure Policy definition to enforce that all Event Hubs Dedicated clusters in your organization have confidential computing enabled. This approach ensures consistent security configuration across your Azure environment.

The following policy definition denies or audits the creation of Dedicated clusters that don't have confidential computing enabled:

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
                    "equals": "Microsoft.EventHub/clusters"
                },
                {
                    "not": {
                        "field": "Microsoft.EventHub/clusters/platformCapabilities.confidentialCompute.mode",
                        "equals": "Enabled"
                    }
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
- [Configure customer-managed keys for Azure Event Hubs](configure-customer-managed-key.md)
- [Azure Event Hubs Dedicated](event-hubs-dedicated-overview.md)
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)
