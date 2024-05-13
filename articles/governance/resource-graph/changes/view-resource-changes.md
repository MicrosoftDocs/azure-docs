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

In this guide, you learn where to find Change Analysis in the portal and how to view, filter, and query changes.

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

Use any of the filters available at the top of the Change Analysis blade to narrow down the change history results to your specific needs.

:::image type="content" source="./media/view-resource-changes/changes-filter.png" alt-text="Screenshot of the filters available on the Change Analysis blade that help narrow down the Change Analysis results.":::

You may need to reset filters set on the **All resources** blade in order to use the resource changes filters.

:::image type="content" source="./media/view-resource-changes/reset-filters.png" alt-text="Screenshot of the banner indicating that you may need to reset filters from the All Resources blade.":::

| Filter | Description |
| ------ | ----------- |
| Subscription | This filter is in-sync with the Azure portal subscription selector. It supports multiple-subscription selection. |
| Resource group | Select the resource group to scope to all resources within that group. By default, all resource groups are selected. |
| Time span | Limit results to resources changed within a certain time range.  |
| Change types | Types of changes made to resources. |
| Resource types | Select **Add filter** to add this filter.</br> Search for resources by their resource type, like virtual machine. |
| Resources | Select **Add filter** to add this filter.</br> Filter results based on their resource name. |
| Correlation IDs | Select **Add filter** to add this filter.</br> Filter resource results by [the operation's unique identifier](../../../expressroute/get-correlation-id.md). |
| Changed by types | Select **Add filter** to add a tag filter.</br> Filter resource changes based on the descriptor of who made the change. |
| Client types | Select **Add filter** to add this filter.</br> Filter results based on how the change is initiated and performed. |
| Operations | Select **Add filter** to add this filter.</br> Filter resources based on [their resource provider operations](../../../role-based-access-control/resource-provider-operations.md). |
| Changed by | Select **Add filter** to add a tag filter.</br> Filter the resource changes by who made the change. |

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
| Change Type | Organizes resources based on the collected change type. Values include "Create", "Update", and "Delete". |
| Client Type | Sorts by how the change is initiated and performed. Values include "CLI" and "ARM template". |
| Changed By | Groups resource changes by who made the change. Values include user email ID or subscription ID. |
| Changed By Type | Groups resource changes based on the descriptor of who made the change. Values include "User", "Application".  |
| Operation | Groups resources based on [their resource provider operations](../../../role-based-access-control/resource-provider-operations.md). |
| Correlation ID | Organizes the resource changes by [the operation's unique identifier](../../../expressroute/get-correlation-id.md). |

### Edit columns

You can add and remove columns, or change the column order in the Change Analysis results. In the **Change Analysis** blade, select **Manage view** > **Edit columns**.

:::image type="content" source="./media/view-resource-changes/manage-results-view.png" alt-text="Screenshot of the drop-down for selecting the option for editing columns for the results.":::

In the **Edit columns** pane, make your changes and then select **Save** to apply.

:::image type="content" source="./media/view-resource-changes/edit-columns-pane.png" alt-text="Screenshot of the Edit columns pane options.":::

#### Add a column

Click **+ Add column**. 

:::image type="content" source="./media/view-resource-changes/add-column-button.png" alt-text="Screenshot of selecting the button for adding a new column.":::

Select a column property from the dropdown in the new column field.

:::image type="content" source="./media/view-resource-changes/select-new-column.png" alt-text="Screenshot of the drop-down for selecting a new column.":::

#### Delete a column

Select the trashcan icon to delete a column.

:::image type="content" source="./media/view-resource-changes/delete-column.png" alt-text="Screenshot of the trashcan icon for deleting a column.":::

#### Reorder columns

Change the column order by either dragging and dropping a field, or selecting a column and clicking **Move up** and **Move down**.

:::image type="content" source="./media/view-resource-changes/reorder-columns.png" alt-text="Screenshot of selecting a column to move up or down in the order.":::

#### Reset to default

Select **Reset to defaults** to revert your changes.

:::image type="content" source="./media/view-resource-changes/reset-columns-default.png" alt-text="Screenshot of where to reset to the default column settings.":::

## Next steps

Learn more about [Azure Resource Graph](../overview.md)