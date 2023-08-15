---
title: Enroll in a simplified pricing tier for Microsoft Sentinel
description: Learn how to enroll in simplified billing, the impact of the switch to simplified pricing tiers, and frequently asked questions about enrollment.
author: austinmccollum
ms.topic: how-to
ms.date: 07/06/2023
ms.author: austinmc
---

# Switch to the simplified pricing tiers for Microsoft Sentinel

For many Microsoft Sentinel workspaces created before July 2023, there is a separate pricing tier for Azure Monitor Log Analytics in addition to the classic pricing tier for Microsoft Sentinel. To combine the data ingestion costs for Log Analytics and the data analysis costs of Microsoft Sentinel, enroll your workspace in a simplified pricing tier. 

## Prerequisites
- The Log Analytics workspace pricing tier must be on Pay-as-You-Go or a commitment tier before enrolling in a simplified pricing tier. Log Analytics legacy pricing tiers are not supported.
- Sentinel must have been enabled prior to July 2023. Workspaces that enabled Sentinel July 2023 and onwards are automatically defaulted to the simplified pricing experience. 
- Microsoft Sentinel Contributor role is required to switch pricing tiers.

## Change pricing tier to simplified
Classic pricing tiers are when Microsoft Sentinel and Log Analytics pricing tiers are configured separately and show up as different meters on your invoice. To move to the simplified pricing tier where Microsoft Sentinel and Log Analytics billing are combined for the same pricing meter, **Switch to new pricing**.

# [Microsoft Sentinel](#tab/microsoft-sentinel)
Use the following steps to change the pricing tier of your workspace using the Microsoft Sentinel portal. Once you've made the switch, reverting back to a classic pricing tier can't be performed using this interface.  

1. From the **Settings** menu, select **Switch to new pricing**. 

    :::image type="content" source="media/enroll-simplified-pricing-tier/switch-to-new-pricing.png" alt-text="Screenshot showing setting option to switch to new pricing tier.":::

1. Review your current tiers and consider the **Recommended** tier where there's a mismatch in tiers.
1. Choose a selection from the **Unified pricing tiers** pull-down menu based on your typical ingestion.
1. Select **Ok** to confirm.
    
# [Azure Resource Manager](#tab/azure-resource-manager)
To set the pricing tier using an Azure Resource Manager template, set the following values:

- `Microsoft.OperationsManagement/solutions` `sku` name to `Unified` 
-  `capacityReservationLevel` to the pricing tier

For details on this template format, see [Microsoft.OperationalInsights workspaces](/azure/templates/microsoft.operationalinsights/workspaces).

The following sample template configures Microsoft Sentinel simplified pricing with the 300 GB/day commitment tier. To set the simplified pricing tier to Pay-As-You-Go, omit the `capacityReservationLevel` property value and change `capacityreservation` to `pergb2018`.

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

Only tenants that had Microsoft Sentinel prior to July 2023 are able to revert back to classic pricing tiers. To make the switch back, set the `Microsoft.OperationsManagement/solutions` `sku` name to `capacityreservation` and set the `capacityReservationLevel` for both sections to the appropriate pricing tier. 

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
                    "name": "PerGB", 
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

See [Deploying the sample templates](../azure-monitor/resource-manager-samples.md) to learn more about using Resource Manager templates.

To reference how to implement this in Terraform or Bicep start [here](/azure/templates/microsoft.operationalinsights/2020-08-01/workspaces).

---

## Simplified pricing tiers for dedicated clusters
In classic pricing tiers, Microsoft Sentinel was always billed as a secondary meter at the workspace level. The meter for Microsoft Sentinel could differ from that of the workspace. 

With simplified pricing tiers, the same Commitment Tier used by the cluster is set for the Microsoft Sentinel workspace. Microsoft Sentinel usage will be billed at the effective per GB price of that tier meter, and all usage is counted towards the total allocation for the dedicated cluster. This allocation is either at the cluster level or proportionately at the workspace level depending on the billing mode of the cluster. For more information, see [Cost details - Dedicated cluster](../azure-monitor/logs/cost-logs.md#dedicated-clusters).
			
## Offboarding behavior
If Microsoft Sentinel is removed from a workspace while simplified pricing is enabled, the Log Analytics workspace defaults to the pricing tier that was configured. For example, if the simplified pricing was configured for 100 GB/day commitment tier in Microsoft Sentinel, the pricing tier of the Log Analytics workspace changes to 100 GB/day commitment tier once Microsoft Sentinel is removed from the workspace.

### Will switching reduce my costs?
Though the goal of the experience is to merely simplify the pricing and cost management experience without impacting actual costs, two primary scenarios exist for a cost reduction when switching to a simplified pricing tier.

- The combined [Defender for Servers](../defender-for-cloud/faq-defender-for-servers.yml#is-the-500-mb-of-free-data-ingestion-allowance-applied-per-workspace-or-per-machine-) benefit will result in a total cost savings if utilized by the workspace. 
- If one of the separate pricing tiers for Log Analytics or Microsoft Sentinel was inappropriately mismatched, the simplified pricing tier could result in cost saving.

### Is there ever a reason NOT to switch?
It's possible your Microsoft account team has negotiated a discounted price for Log Analytics or Microsoft Sentinel charges on the classic tiers. You won't be able to tell if this is the case from the Microsoft Sentinel pricing interface alone. It might be possible to calculate the expected cost vs. actual charge in Microsoft Cost Management to see if there's a discount included. In such cases, we recommend contacting your Microsoft account team if you want to switch to the simplified pricing tiers or have any questions.

## Next steps

- [Plan costs, understand Microsoft Sentinel pricing and billing](billing.md)
- [Monitor costs for Microsoft Sentinel](billing-monitor-costs.md)
- [Reduce costs for Microsoft Sentinel](billing-reduce-costs.md)
- Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](../azure-monitor/best-practices-cost.md).
