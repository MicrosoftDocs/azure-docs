---
title: Enroll in a simplified pricing tier for Microsoft Sentinel
description: Learn how to enroll in simplified billing, the impact of the switch to commitment pricing tiers, and frequently asked questions about enrollment.
author: austinmccollum
ms.topic: how-to
ms.date: 04/25/2024
ms.author: austinmc
#customerintent: As a SOC administrator or a billing specialist, I want to know how to switch to simplified pricing and whether it will benefit us financially or simplify our administration of Microsoft Sentinel and log analytics workspaces.
---

# Switch to the simplified pricing tiers for Microsoft Sentinel

For many Microsoft Sentinel workspaces created before July 2023, there's a separate pricing tier for Azure Monitor Log Analytics in addition to the classic pricing tier for Microsoft Sentinel. To combine the data ingestion costs for Log Analytics and the data analysis costs of Microsoft Sentinel, enroll your workspace in a simplified pricing tier. 

## Prerequisites
- The Log Analytics workspace pricing tier must be on pay-as-you-go or a Commitment tier before enrolling in a simplified pricing tier. Log Analytics legacy pricing tiers aren't supported.
- Microsoft Sentinel was enabled on the workspace before July 2023. Workspaces that enable Microsoft Sentinel from July 2023 onwards are automatically set to the simplified pricing experience as the default. 
- You must have **Contributor** or **Owner** for the Microsoft Sentinel workspace to change the pricing tier.

## Change pricing tier to simplified
Classic pricing tiers are when Microsoft Sentinel and Log Analytics pricing tiers are configured separately and show up as different meters on your invoice. To move to the simplified pricing tier where Microsoft Sentinel and Log Analytics billing are combined for the same pricing meter, **Switch to new pricing**.

# [Microsoft Sentinel](#tab/microsoft-sentinel)
Use the following steps to change the pricing tier of your workspace using the Microsoft Sentinel portal. Once you make the switch, reverting back to a classic pricing tier can't be performed using this interface.  

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

The following sample template configures Microsoft Sentinel simplified pricing with the 300 GB/day Commitment tier. To set the simplified pricing tier to pay-as-you-go, omit the `capacityReservationLevel` property value and change `capacityreservation` to `pergb2018`.

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

Only tenants that had Microsoft Sentinel enabled before July 2023 are able to revert back to classic pricing tiers. To make the switch back, set the `Microsoft.OperationsManagement/solutions` `sku` name to `capacityreservation` and set the `capacityReservationLevel` for both sections to the appropriate pricing tier. 

The following sample template sets Microsoft Sentinel to the classic pricing tier of pay-as-you-go and sets the Log Analytic workspace to the 100 GB/day Commitment tier.

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

To reference how to implement this template in Terraform or Bicep start [here](/azure/templates/microsoft.operationalinsights/2020-08-01/workspaces).

---

## Simplified pricing tiers for dedicated clusters
In classic pricing tiers, Microsoft Sentinel was always billed as a secondary meter at the workspace level. The meter for Microsoft Sentinel could differ from the overall meter of the workspace. 

With simplified pricing tiers, the same Commitment tier and billing mode used by the cluster is set for the Microsoft Sentinel workspace. Microsoft Sentinel usage is billed at the effective per GB price of that tier meter, and all usage is counted towards the total allocation for the dedicated cluster. This allocation is either at the cluster level or proportionately at the workspace level depending on the billing mode of the cluster. For more information, see [Cost details - Dedicated cluster](../azure-monitor/logs/cost-logs.md#dedicated-clusters).

### Dedicated cluster billing examples
Compare the following cluster scenarios to better understand simplified pricing when adding Microsoft Sentinel enabled workspaces to a dedicated cluster.

:::image type="content" source="media/enroll-simplified-pricing-tier/cluster.svg" alt-text="A block diagram showing a color coded cluster with three workspaces. One of the workspaces is labeled Microsoft Sentinel.":::

**Example 1:** A dedicated cluster ingesting *more* data than the Commitment tier level, but under the next highest tier (ideal).
:::image type="content" source="media/enroll-simplified-pricing-tier/example-1.png" alt-text="Spreadsheet showing Commitment tier over usage billing example for a Microsoft Sentinel workspace in a dedicated cluster." lightbox="media/enroll-simplified-pricing-tier/example-1.png":::

**Example 2:** A dedicated cluster ingesting *less* data than the Commitment tier level. Consider adding more workspaces to the cluster.
:::image type="content" source="media/enroll-simplified-pricing-tier/example-2.png" alt-text="Spreadsheet showing Commitment tier under usage billing example for a Microsoft Sentinel workspace in a dedicated cluster." lightbox="media/enroll-simplified-pricing-tier/example-2.png":::

Keep in mind, the simplified effective per GB price for a Microsoft Sentinel enabled workspace now includes the log analytics ingestion cost. For the latest **per day** and **Effective Per GB Price** for both types of workspaces, see: 
- [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/microsoft-sentinel/)
- [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Offboarding behavior
A Log Analytics workspace automatically configures its pricing tier to match the simplified pricing tier if Microsoft Sentinel is removed from a workspace while simplified pricing is enabled. For example, if the simplified pricing was configured for 100 GB/day Commitment tier in Microsoft Sentinel, the pricing tier of the Log Analytics workspace changes to 100 GB/day Commitment tier once Microsoft Sentinel is removed from the workspace.

### Will switching reduce my costs?
Though the goal of the experience is to merely simplify the pricing and cost management experience without impacting actual costs, two primary scenarios exist for a cost reduction when switching to a simplified pricing tier.

- The combined [Defender for Servers](../defender-for-cloud/faq-defender-for-servers.yml#is-the-500-mb-of-free-data-ingestion-allowance-applied-per-workspace-or-per-machine-) benefit results in a total cost savings if utilized by the workspace. 
- If one of the separate pricing tiers for Log Analytics or Microsoft Sentinel was inappropriately mismatched, the simplified pricing tier could result in cost saving.

### Is there ever a reason NOT to switch?
It's possible your Microsoft account team negotiated a discounted price for Log Analytics or Microsoft Sentinel charges on the classic tiers. You can't tell if this is so from the Microsoft Sentinel pricing interface alone. It might be possible to calculate the expected cost vs. actual charge in Microsoft Cost Management to see if there's a discount included. In such cases, we recommend contacting your Microsoft account team if you want to switch to the simplified pricing tiers or have any questions.

## Learn more

- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](../azure-monitor/best-practices-cost.md).
- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.

## Related content

- [Plan costs, understand Microsoft Sentinel pricing and billing](billing.md)
- [Monitor costs for Microsoft Sentinel](billing-monitor-costs.md)
- [Reduce costs for Microsoft Sentinel](billing-reduce-costs.md)

