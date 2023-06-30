---
title: Enroll in a simplified pricing tier for Microsoft Sentinel
description: Learn how to enroll in simplified billing, the impact of the switch, and frequently asked questions about enrollment.
author: austinmccollum
ms.topic: how-to
ms.date: 06/29/2023
ms.author: austinmc
---

# Enroll in a simplified pricing tier for Microsoft Sentinel

For some Microsoft Sentinel workspaces, there is a separate pricing tier for Azure Monitor Log Analytics in addition to a classic pricing tier for Microsoft Sentinel. To combine the data ingestion costs for Log Analytics and the data analysis costs of Microsoft Sentinel, enroll your workspace in a simplified pricing tier. 

## Prerequisites
- If Log Analytics is on legacy tier, the tier must be changed to Pay-as-You-Go or a commitment tier before enrolling in a simplified pricing tier.
- Only tenants that had Sentinel prior to July 2023 are able to revert back to classic pricing tiers.


## Change pricing tier to simplified
Classic pricing tiers are when Microsoft Sentinel and Log Analytics pricing tiers are configured separately and show up as different meters on your invoice. To move to the simplified pricing tier where Microsoft Sentinel and Log Analytics billing are combined for the same pricing meter, enroll in the **New pricing**.

# [Microsoft Sentinel portal](#tab/microsoft-sentinel-portal)
Use the following steps to change the pricing tier of your workspace using the Microsoft Sentinel portal. Once you've made the switch, you can't revert to a classic pricing tier using this interface.  

1. From the **Settings** menu, select the **New pricing** switch. 
1. Review your current tiers and the **Recommended** tier.
1. Choose a selection from the **Unified pricing tiers** pull-down menu based on your typical ingestion.
1. **Select and switch** to confirm.

:::image type="content" source="media/manage-cost-storage/pricing-tier-estimated-costs.png" alt-text="Pricing tiers":::
    
# [Azure Resource Manager](#tab/azure-resource-manager)
To set the pricing tier using an [Azure Resource Manager](./resource-manager-workspace.md), set the `Microsoft.OperationsManagement/solutions` `sku` name to `Unified` and set the `capacityReservationLevel` to the pricing tier. For details on this template format, see [Microsoft.OperationalInsights workspaces](/azure/templates/microsoft.operationalinsights/workspaces).

The following sample template configures Microsoft Sentinel simplified pricing to the 300 GB/day commitment tier. To set the pricing tier to other values such as Pay-As-You-Go, omit the `capacityReservationLevel` property and set the `sku` to `pergb2018`.

```json
{ 
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#", 
    "contentVersion": "1.0.0.0", 
    "resources": [ 
        { 
            "type": "Microsoft.OperationsManagement/solutions", 
            "apiVersion": "2015-11-01-preview", 
            "name": "SecurityInsights({YourWorkspaceName})", 
            "location": "{RegionName}", 
            "plan": { 
                "name": "SecurityInsights({YourWorkspaceName})", 
                "publisher": "Microsoft", 
                "promotionCode": "", 
                "product": "OMSGallery/SecurityInsights" 
            }, 
            "properties": { 
                "workspaceResourceId": "/subscriptions/{SubscriptionId}/resourcegroups/{ResourceGroup}/providers/microsoft.operationalinsights/workspaces/{YourWorkspaceName}", 
                "sku": { 
                    "name": "Unified" 
                } 
            } 
        }, 
        { 
            "name": "{YourWorkspaceName}", 
            "type": "Microsoft.OperationalInsights/workspaces", 
            "apiVersion": "2020-08-01", 
            "location": "{RegionName}", 
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

To revert back to a classic pricing tier, set the `Microsoft.OperationsManagement/solutions` `sku` name to `capacityreservation` and set the `capacityReservationLevel` for both sections to the appropriate pricing tier. Only tenants that had Microsoft Sentinel prior to July 2023 are able to revert back to classic pricing.

The following sample template sets Microsoft Sentinel to the classic pricing tier of Pay-As-You-Go and sets the Log Analytic workspace to the 100 GB/day commitment tier.

```json
{ 
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#", 
    "contentVersion": "1.0.0.0", 
    "resources": [ 
        { 
            "type": "Microsoft.OperationsManagement/solutions", 
            "apiVersion": "2015-11-01-preview", 
            "name": "SecurityInsights({YourWorkspaceName})", 
            "location": "{RegionName}", 
            "plan": { 
                "name": "SecurityInsights({YourWorkspaceName})", 
                "publisher": "Microsoft", 
                "promotionCode": "", 
                "product": "OMSGallery/SecurityInsights" 
            }, 
            "properties": { 
                "workspaceResourceId": "/subscriptions/{SubscriptionId}/resourcegroups/{ResourceGroup}/providers/microsoft.operationalinsights/workspaces/{YourWorkspaceName}", 
                "sku": { 
                    "name": "pergb2018", 
                    "capacityReservationLevel":
                } 
            } 
        }, 
        { 
            "name": "{YourWorkspaceName}", 
            "type": "Microsoft.OperationalInsights/workspaces", 
            "apiVersion": "2020-08-01", 
            "location": "{RegionName}", 
            "properties": { 
                "sku": { 
                "name": "capacityreservation", 
                 "capacityReservationLevel": 100 
                } 
            } 
        } 
    ] 
} 
```

See [Deploying the sample templates](../resource-manager-samples.md) if you're not familiar with using Resource Manager templates.

---

## Simplified billing for dedicated clusters
Expected behavior for Sentinel unified vs dual:

Classic - In the dual mode billing experience (pre July 2023) Sentinel is always billed as a second meter,  at the workspace level. The meter for Sentinel can be different from that of the workspace.
			
Simplified - In the simplified billing experience for Sentinel, when a Sentinel-enabled workspace is attached to a Log Analytics cluster, the same Commitment Tier level is used for the Sentinel workspace as is set for the cluster. Sentinel usage will be billed at the effective per GB price of that Sentinel commitment tier meter, and all usage would be counted against the total allocation for dedicated cluster, either at the cluster or proportionately at the workspace level depending on the billing mode of the cluster as described here: Azure Monitor Logs cost calculations and options - Azure Monitor | Microsoft Learn. The ability to have the Sentinel pricing tier match that of the cluster is advantageous to customers and allows them to avail the effective per GB discount offered by the  Sentinel commitment tier matching the cluster level commitment.
			
Unlinking from a cluster??

## Offboard behavior
If Microsoft Sentinel is removed from a workspace while simplified pricing is enabled, the Log Analytics workspace defaults to the pricing tier that was configured for the dual mode. For example, if the simplified pricing was configured for 100 GB/day commitment tier in Microsoft Sentinel, the Log Analytics workspace changes to 100 GB/day commitment tier once Microsoft Sentinel is offboarded from the workspace.

### will this reduce my costs?
Maybe, the combined defender benefit may result in a total cost savings. Another possibility is if one of the Log A or Sentinel pricing tiers was inappropriately mismatched. This might happen if a commitment tier was increased in Sentinel, but not LA. In this case, the simplified pricing tier would result in cost saving.

### is there ever a reason NOT to switch?
It's possible your Microsoft sales team has negotiated a discounted price for Log Analytics or Microsoft Sentinel charges. You won't be able to tell if this is the case from the UI. It may be possible to calculate the expected cost vs. actual charge in cost analysis to see if there's a discount included.

## Next steps
