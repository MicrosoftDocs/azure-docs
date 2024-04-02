---
title: View resource changes in the Azure portal (preview)
description: View resource changes via the Azure Resource Graph Change Analysis in the Azure portal.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/15/2024
ms.topic: how-to
---

# View resource changes in the Azure portal (preview)

[!INCLUDE [preview](../../includes/resource-graph/preview/change-analysis.md)]

Change Analysis provides data for various management and troubleshooting scenarios, helping you understand which changes to your application caused which breaking issues. In addition to [querying Resource Graph for resource changes](./get-resource-changes.md), you can also view all changes to your applications via the Azure portal. 

In this guide, you learn where to find Change Analysis in the portal and how to view changes.

## Access Change Analysis screens

Change Analysis automatically collects snapshots of change data for all Azure resources, without  needing to limit to a specific subscription or service. To view change data, navigate to **All Resources** from the main menu on the portal dashboard.

:::image type="content" source="./media/view-resource-changes/all-resources-menu.png" alt-text="Screenshot of finding All Resources in the portal menu.":::

Select the **Changed resources** card. In this example, all Azure resources are returned with no specific subscription selected. 

:::image type="content" source="./media/view-resource-changes/change-analysis-card.png" alt-text="Screenshot of the All Resources page and highlighting the Changed resources card.":::

Review the results in the **Changed resources** blade.

:::image type="content" source="./media/view-resource-changes/change-history-results.png" alt-text="Screenshot of the Azure Resource Graph Change Analysis resources blade.":::

## Filter and sort Change Analysis results

Realistically, you only want to see the change history results for the resources you work with. You can use the filters and sorting categories in the Azure portal to weed out results unnecessary to your project.

### Filter

To narrow down the change history results to your specific needs, start by using any of the filters available on the **All Resources** blade. 

:::image type="content" source="./media/view-resource-changes/all-resources-filter.png" alt-text="Screenshot of the filters available on the All Resources blade that help narrow down the Change Analysis results.":::

| Filter | Description |
| ------ | ----------- |
| Subscription | This filter is in-sync with the Azure portal subscription selector. It supports multiple-subscription selection. |
| Resource group | Select the resource group to scope to all resources within that group. By default, all resource groups are selected. |
| Type | Filter resources to specific Azure services/resource types, like Logic App or Virtual Machine.  |
| Location | Limit results to resources based on the location in which they were created. |
| Name | Select **Add filter** to add this filter.</br> Search for resources by their resource name. |
| Kind | Select **Add filter** to add this filter.</br> Filter results based on their resource account. |
| Edge zone | Select **Add filter** to add this filter.</br> Filter resource results by their edge zones, which are small, localized Azure footprints designed to provide low latency connectivity. |
| Tags | Select **Add filter** to add a tag filter.</br> Select the tag associated with the resources you'd like to see. |

Once you narrow down the **All resources** results, select the **Changed resources** card to view the change history for those resources. For example, with the **Location** filter set to **East US**, the Change Analysis blade is limited to 15 total changes. 

:::image type="content" source="./media/view-resource-changes/location-filter-changes.png" alt-text="Screenshot of the Change Analysis results based on the Location filter being set to East US.":::

### Sort

In the **Change Analysis** blade, you can organize the results into groups using the **Group by...** drop-down menu.

:::image type="content" source="./media/view-resource-changes/change-grouping.png" alt-text="Screenshot of the drop-down for selecting how to group Change Analysis results.":::

| Group by... | Description |
| ------ | ----------- |
| None | Set to this grouping by default and applies no group settings. |
| Subscription | Sorts the resources into their respective subscriptions. |
| Resource Group | Groups resources based on their resource group. |
| Type | Groups resources based on their Azure service type.  |
| Resource | Sorts resources per their resource name. |
| Change Type | Organizes resources based on the collected change type. Values include Create, Update, and Delete. |

## Next steps

