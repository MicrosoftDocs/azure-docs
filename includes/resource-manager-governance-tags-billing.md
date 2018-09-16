---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: azure-resource-manager
 ms.topic: include
 ms.date: 02/19/2018
 ms.author: tomfitz
 ms.custom: include file
---

After applying tags to resources, you can view costs for resources with those tags. It takes a while for cost analysis to show the latest usage, so you may not see the costs yet. When the costs are available, you can view costs for resources across resource groups in your subscription. Users must have [subscription level access to billing information](../articles/billing/billing-manage-access.md) to see the costs.

To view costs by tag in the portal, select your subscription and select **Cost Analysis**.

![Cost analysis](./media/resource-manager-governance-tags-billing/select-cost-analysis.png)

Then, filter by the tag value, and select **Apply**.

![View cost by tag](./media/resource-manager-governance-tags-billing/view-costs-by-tag.png)

You can also use the [Azure Billing APIs](../articles/billing/billing-usage-rate-card-overview.md) to programmatically view costs.
