---
title: Azure Monitor Logs pricing model
description: Learn how to change the pricing plan and manage data volume and retention policy for your Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Change pricing tier for Log Analytics workspace


## Azure portal
To change the Log Analytics pricing tier of your workspace:

1. In the Azure portal, open **Usage and estimated costs** from your workspace; you'll see a list of each of the pricing tiers available to this workspace.

2. Review the estimated costs for each pricing tier. This estimate is based on the last 31 days of usage, so this cost estimate relies on the last 31 days being representative of your typical usage. In the example below, you can see how, based on the data patterns from the last 31 days, this workspace would cost less in the Pay-As-You-Go tier (#1) compared to the 100 GB/day commitment tier (#2).  

:::image type="content" source="media/manage-cost-storage/pricing-tier-estimated-costs.png" alt-text="Pricing tiers":::
    
3. After reviewing the estimated costs based on the last 31 days of usage, if you decide to change the pricing tier, select **Select**.  

## Azure Resource Manager
You can also [set the pricing tier via Azure Resource Manager](./resource-manager-workspace.md) using the `sku` object to set the pricing tier, and the `capacityReservationLevel` parameter if the pricing tier is `capacityresrvation`. (Learn more about [setting workspace properties via ARM](/azure/templates/microsoft.operationalinsights/2020-08-01/workspaces?tabs=json#workspacesku-object).) Here is a sample Azure Resource Manager template to set your workspace to a 300 GB/day commitment tier (in Resource Manager, it's called `capacityreservation`). 

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

To use this template in PowerShell, after [installing the Azure Az PowerShell module](/powershell/azure/install-az-ps), sign in to Azure using `Connect-AzAccount`, select the subscription containing your workspace using `Select-AzSubscription -SubscriptionId YourSubscriptionId`, and apply the template (saved in a file named template.json):

```
New-AzResourceGroupDeployment -ResourceGroupName "YourResourceGroupName" -TemplateFile "template.json"
```

To set the pricing tier to other values such as Pay-As-You-Go (called `pergb2018` for the SKU), omit the `capacityReservationLevel` property. Learn more about [creating ARM templates](../../azure-resource-manager/templates/template-tutorial-create-first-template.md),  [adding a resource to your template](../../azure-resource-manager/templates/template-tutorial-add-resource.md), and [applying templates](../resource-manager-samples.md). 


## Tracking pricing tier changes

Changes to a workspace's pricing pier are recorded in the [Activity Log](../essentials/activity-log.md) with events with an **Operation** of *Create Workspace*. The event's **Change history** tab will show the old and new pricing tiers in the  `properties.sku.name` row.  Click the **Activity Log** option from your workspace to see events scoped to a particular workspace. To monitor changes the pricing tier, you can create an alert for the *Create Workspace* operation. 