---
title: Change pricing tier for Log Analytics workspace
description: Details on how to change pricing tier for Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: Dale.Koetke
ms.date: 03/25/2022
---
 
# Change pricing tier for Log Analytics workspace
Each Log Analytics workspace in Azure Monitor can have a different [pricing tier](cost-logs.md#commitment-tiers). This article describes how to change the pricing tier for a workspace and how to track these changes.

> [!NOTE]
> This article describes how to change the commitment tier for a Log Analytics workspace once you determine which commitment tier you want to use. See [Azure Monitor Logs pricing details](cost-logs.md) for details on how commitment tiers work and [Azure Monitor cost and usage](../usage-estimated-costs.md#log-analytics-workspace) for recommendations on the most cost effective commitment based on your observed Azure Monitor usage.

## Permissions required
To change the pricing tier for a workspace, you must be assigned to one of the following roles: 

- Log Analytics Contributor role.
- A custom role with `Microsoft.OperationalInsights/workspaces/*/write` permissions.

## Changing pricing tier

# [Azure portal](#tab/azure-portal)
Use the following steps to change the pricing tier of your workspace using the Azure portal.

1. From the **Log Analytics workspaces** menu, select your workspace, and open **Usage and estimated costs**. This displays a list of each of the pricing tiers available for this workspace.

2. Review the estimated costs for each pricing tier. This estimate assumes that the last 31 days of your usage is typical. Choose the tier with the lowest estimated cost.  

:::image type="content" source="media/manage-cost-storage/pricing-tier-estimated-costs.png" alt-text="Pricing tiers":::
    
3. Click **Select** if you decide to change the pricing tier after reviewing the estimated costs.

4. Review the commitment message in the popup that "Commitment Tier pricing has a 31-day commitment period, during which the workspace cannot be moved to a lower Commitment Tier or any Consumption Tier" and click **Change pricing tier** to confirm. 

# [Azure Resource Manager](#tab/azure-resource-manager)
To set the pricing tier using an [Azure Resource Manager](./resource-manager-workspace.md), use the `sku` object to set the pricing tier and the `capacityReservationLevel` parameter if the pricing tier is `capacityresrvation`. For details on this template format, see [Microsoft.OperationalInsights workspaces](/azure/templates/microsoft.operationalinsights/workspaces)

The following sample template sets a workspace to a 300 GB/day commitment tier. To set the pricing tier to other values such as Pay-As-You-Go (called `pergb2018` for the SKU), omit the `capacityReservationLevel` property.

```
{
  "$schema": https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#,
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "YourWorkspaceName",
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2020-08-01",
      "location": "yourWorkspaceRegion",
      "properties": {
                    "sku": {
                      "name": "capacityreservation",
                      "capacityReservationLevel": 300
                    }
      }
    }
  ]
}
```

See [Deploying the sample templates](../resource-manager-samples.md) if you're not familiar with using Resource Manager templates.

---

## Tracking pricing tier changes
Changes to a workspace's pricing tier are recorded in the [Activity Log](../essentials/activity-log.md). Filter for events with an **Operation** of *Create Workspace*. The event's **Change history** tab will show the old and new pricing tiers in the  `properties.sku.name` row. To monitor changes the pricing tier, [create an alert](../alerts/alerts-activity-log.md) for the *Create Workspace* operation.

## Next steps

- See [Azure Monitor Logs pricing details](cost-logs.md) for details on how charges are calculated for data in a Log Analytics workspace and different configuration options to reduce your charges.
- See [Azure Monitor cost and usage](../usage-estimated-costs.md) for a description of the different types of Azure Monitor charges and how to analyze them on your Azure bill.
