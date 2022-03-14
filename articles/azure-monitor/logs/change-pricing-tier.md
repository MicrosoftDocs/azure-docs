---
title: Change pricing tier for Log Analytics workspace
description: Instructions on how to change pricing tier for Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Change pricing tier for Log Analytics workspace
Each Log Analytics workspace in Azure Monitor can have a different [pricing tier](cost-logs.md#commitment-tiers). This article describes how to change the pricing tier for a workspace and how to track these changes.

## Azure portal
Use the following steps to change the pricing tier of your workspace using the Azure portal.

1. From the **Log Analytics workspaces** menu, select your workspace, and open **Usage and estimated costs**. This displays a list of each of the pricing tiers available for this workspace.

2. Review the estimated costs for each pricing tier. This estimate assumes that the last 31 days of your usage is typical. In the example below, based on the data patterns from the previous 31 days, this workspace would cost less in the Pay-As-You-Go tier (#1) compared to the 100 GB/day commitment tier (#2).  

:::image type="content" source="media/manage-cost-storage/pricing-tier-estimated-costs.png" alt-text="Pricing tiers":::
    
3. Click **Select** if you decide to change the pricing tier after reviewing the estimated costs.  

## Azure Resource Manager
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



## Tracking pricing tier changes
Changes to a workspace's pricing tier are recorded in the [Activity Log](../essentials/activity-log.md). Filter for events with an **Operation** of *Create Workspace*. The event's **Change history** tab will show the old and new pricing tiers in the  `properties.sku.name` row.  

To monitor changes the pricing tier, [create an alert](../alerts/alerts-activity-log.md) for the *Create Workspace* operation.

## Next steps