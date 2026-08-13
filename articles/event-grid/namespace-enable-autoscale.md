---
title: Enable Autoscale for an Azure Event Grid namespace (preview)
description: Learn how to enable Autoscale for an Azure Event Grid namespace using the Azure portal, ARM template, or REST API.
ms.topic: how-to
ms.date: 05/14/2026
author: robece
ms.author: robece
ai-usage: ai-assisted
# Customer intent: As an Azure developer or administrator, I want to enable Autoscale on my Event Grid namespace so that throughput units adjust automatically based on workload demands.
---

# Enable autoscale for an Event Grid namespace (preview)

This article shows you how to enable autoscale for an Azure Event Grid namespace. Autoscale requires only three configuration properties: an enable flag and the minimum and maximum throughput unit (TU) limits. Event Grid manages all scaling logic internally.

You can enable autoscale by using the Azure portal, an Azure Resource Manager template, or the REST API.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- An Event Grid namespace in the Standard tier.

> [!IMPORTANT]
> Autoscale isn't available in the Basic tier.

## Enable autoscale - Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, type **Event Grid Namespaces** and select it from the results.
1. Select your namespace from the list.
1. Under **Settings**, select **Scale**.
1. Select **Autoscale**.
1. Set the **Minimum throughput units** value. This value is the lowest number of TUs the namespace can scale down to.
1. Set the **Maximum throughput units** value. This value is the highest number of TUs the namespace can scale up to. The maximum supported value is 40.
1. Select **Apply**.
1. Review the summary of changes and select **Confirm** to apply the new autoscale settings.

    :::image type="content" source="./media/namespace-enable-autoscale/autoscale-configuration.png" alt-text="Screenshot of Autoscale configuration settings for an Azure Event Grid namespace in the Azure portal." lightbox="./media/namespace-enable-autoscale/autoscale-configuration.png":::

    > [!NOTE]
    > After you apply the changes, Autoscale takes effect almost immediately. The namespace evaluates utilization continuously and adjusts TUs as needed.
    
## Enable autoscale - ARM template

Use the following Azure Resource Manager template to create or update an Event Grid namespace with autoscale enabled.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "namespaceName": {
      "type": "string",
      "metadata": { "description": "Name of the Event Grid namespace." }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": { "description": "Azure region for the namespace." }
    },
    "minThroughputUnits": {
      "type": "int",
      "defaultValue": 1,
      "minValue": 1,
      "maxValue": 40,
      "metadata": { "description": "Minimum number of throughput units." }
    },
    "maxThroughputUnits": {
      "type": "int",
      "defaultValue": 10,
      "minValue": 1,
      "maxValue": 40,
      "metadata": { "description": "Maximum number of throughput units." }
    },
    "enableAutoscale": {
      "type": "bool",
      "defaultValue": true,
      "metadata": { "description": "Set to true to enable autoscale." }
    }
  },
  "resources": [
    {
      "type": "Microsoft.EventGrid/namespaces",
      "apiVersion": "2025-11-15-preview",
      "name": "[parameters('namespaceName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard",
        "capacity": "[parameters('minThroughputUnits')]"
      },
      "properties": {
        "autoScaleConfiguration": {
          "enableAutoScale": "[parameters('enableAutoscale')]",
          "minimumThroughputUnits": "[parameters('minThroughputUnits')]",
          "maximumThroughputUnits": "[parameters('maxThroughputUnits')]"
        }
      }
    }
  ]
}
```

Deploy the template by using Azure CLI:

```azurecli
az deployment group create \
    --resource-group <resource-group-name> \
    --template-file autoscale-namespace.json \
    --parameters namespaceName=<namespace-name> \
                 minThroughputUnits=2 maxThroughputUnits=10
```

## Enable autoscale - REST API

You can enable autoscale when creating or updating an Event Grid namespace by using the REST API.

### Create or update a namespace with autoscale enabled (PUT)

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventGrid/namespaces/{namespaceName}?api-version=2025-11-15-preview
```

Request body:

```json
{
  "location": "eastus",
  "sku": {
    "name": "Standard",
    "capacity": 1
  },
  "properties": {
    "autoScaleConfiguration": {
      "enableAutoScale": true,
      "minimumThroughputUnits": 2,
      "maximumThroughputUnits": 8
    }
  }
}
```

### Update autoscale on an existing namespace (PATCH)

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventGrid/namespaces/{namespaceName}?api-version=2025-11-15-preview
```

Request body:

```json
{
  "properties": {
    "autoScaleConfiguration": {
      "enableAutoScale": true,
      "minimumThroughputUnits": 1,
      "maximumThroughputUnits": 10
    }
  }
}
```

## Verify Autoscale configuration

After enabling Autoscale, verify the configuration by retrieving the namespace details.

### REST API

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventGrid/namespaces/{namespaceName}?api-version=2025-11-15-preview
```

The response body includes the `autoScaleConfiguration` section:

```json
{
  "id": "/subscriptions/12345678-.../providers/Microsoft.EventGrid/namespaces/my-namespace",
  "name": "my-namespace",
  "type": "Microsoft.EventGrid/namespaces",
  "location": "eastus",
  "sku": {
    "name": "Standard",
    "capacity": 1
  },
  "properties": {
    "provisioningState": "Succeeded",
    "autoScaleConfiguration": {
      "enableAutoScale": true,
      "minimumThroughputUnits": 1,
      "maximumThroughputUnits": 10
    },
    "topicsConfiguration": {
      "inputSchema": "CloudEventSchemaV1_0"
    },
    "topicSpacesConfiguration": {
      "state": "Enabled",
      "maximumSessionExpiryInHours": 1,
      "maximumClientSessionsPerAuthenticationName": 1
    },
    "publicNetworkAccess": "Enabled",
    "isZoneRedundant": false,
    "minimumTlsVersionAllowed": "1.2"
  },
  "systemData": {
    "createdBy": "user@contoso.com",
    "createdByType": "User",
    "createdAt": "2026-01-15T10:30:00.0000000Z",
    "lastModifiedBy": "user@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2026-01-15T11:45:00.0000000Z"
  }
}
```

## Disable autoscale

This section shows how to disable autoscale for an Event Grid namespace by using the Azure portal and REST API. The namespace keeps its current TU allocation and stops scaling automatically.

### Azure portal
Follow these steps to disable autoscale by using the Azure portal:

1. Go to your Event Grid namespace in the Azure portal.
1. Under **Settings**, select **Scale**.
1. Select **Manual scale** to disable autoscale.
1. Select **Apply** to save your changes.

    :::image type="content" source="./media/namespace-enable-autoscale/manual-scale.png" alt-text="Screenshot showing manual scale option in the Azure portal." lightbox="./media/namespace-enable-autoscale/manual-scale.png":::


### REST API
When using the REST API, set `enableAutoScale` to `false` under properties.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventGrid/namespaces/{namespaceName}?api-version=2025-11-15-preview
```

Request body:

```json
{
  "properties": {
    "autoScaleConfiguration": {
      "enableAutoScale": false
    }
  }
}
```

## Best practices

- **Set the minimum TU count to handle your baseline load.** Autoscale needs time to detect utilization changes and provision more capacity. A minimum value that covers normal traffic avoids throttling during the initial ramp-up.
- **Don't set the maximum TU count higher than what your budget allows.** Every TU allocated incurs cost. Set the maximum to the highest capacity you're willing to pay for during peak periods.
- **Account for the cooldown period during traffic spikes.** After a scale-up, there's a dynamic cooldown period before the next scale operation. If your workload ramps from idle to peak within seconds, set a minimum TU count that can absorb the initial burst.
- **Review per-TU capacity limits for all categories.** Autoscale evaluates all categories (event ingress, event egress, MQTT publish, MQTT clients) together. If your workload is dominated by one category (for example, MQTT connections), your TU requirements might be driven primarily by that category. 

## Related content

- [Autoscale in Azure Event Grid namespaces](namespace-autoscale-overview.md)
- [Configure manual scale for an Azure Event Grid namespace](namespace-enable-manual-scale.md)
- [Azure Event Grid quotas and limits](quotas-limits.md)
- [Azure Event Grid namespace concepts](concepts-event-grid-namespaces.md)
- [Choose the right Event Grid tier](choose-right-tier.md)
