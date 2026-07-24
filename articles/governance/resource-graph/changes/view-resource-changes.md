---
title: View resource changes in the Azure portal
description: View resource changes with Azure Resource Graph Change Analysis in the Azure portal.
author: iancarter-msft
ms.author: daphnema
ms.date: 10/28/2025
ms.topic: how-to
ms.custom: sfi-image-nochange
---

# View resource changes in the Azure portal

Change Analysis provides data for various management and troubleshooting scenarios, helping you understand which changes to your application caused which breaking issues. In addition to [querying Resource Graph for resource changes](./get-resource-changes.md), you can also view all changes to your applications via the Azure portal.

In this guide, you learn where to find Change Analysis in the portal and how to view, filter, and query changes.

## Access Change Analysis screens

Change Analysis automatically collects snapshots of change data for all Azure resources, without needing to limit to a specific subscription or service. To view change data, search for and select **Change Analysis** in the Azure portal search bar.

:::image type="content" source="./media/view-resource-changes/search-change-analysis.png" alt-text="Screenshot of searching for Change Analysis in the Azure portal.":::

:::image type="content" source="./media/view-resource-changes/change-analysis-page.png" alt-text="Screenshot of the Change Analysis page.":::

## Filter and sort Change Analysis results

You can use the filters and sorting categories in the Azure portal to weed out results unnecessary to your project.

### Filter

Use any of the filters available at the top of **Change Analysis** to narrow down the change history results to your specific needs.

:::image type="content" source="./media/view-resource-changes/changes-filter.png" alt-text="Screenshot of the filters available for Change Analysis that help narrow down the Change Analysis results.":::

| Filter | Description |
| ------ | ----------- |
| Subscription | This filter is in-sync with the Azure portal subscription selector. It supports multiple-subscription selection. |
| Resource group | Select the resource group to scope to all resources within that group. By default, all resource groups are selected. |
| Time span | Limit results to resources changed within a certain time range.  |
| Change types | Types of changes made to resources. |
| Resource types | Select **Add filter** to add this filter.</br> Search for resources by their resource type, like virtual machine. |
| Resource names | Select **Add filter** to add this filter.</br> Filter results based on their resource name. |
| Correlation IDs | Select **Add filter** to add this filter.</br> Filter resource results by [the operation's unique identifier](../../../expressroute/get-correlation-id.md). |
| Changed by types | Select **Add filter** to add a tag filter.</br> Filter resource changes based on the descriptor of who made the change. |
| Client types | Select **Add filter** to add this filter.</br> Filter results based on how the change is initiated and performed. |
| Operations | Select **Add filter** to add this filter.</br> Filter resources based on [their resource provider operations](../../../role-based-access-control/resource-provider-operations.md). |
| Changed by | Select **Add filter** to add a tag filter.</br> Filter the resource changes by who made the change. |

### Sort

In **Change Analysis**, you can organize the results into groups using the **Group by...** drop-down menu.

:::image type="content" source="./media/view-resource-changes/change-grouping.png" alt-text="Screenshot of the drop-down for selecting how to group Change Analysis results.":::

| Group by... | Description |
| ------ | ----------- |
| None | Set to this grouping by default and applies no group settings. |
| Subscription | Sorts the resources into their respective subscriptions. |
| Resource Group | Groups resources based on their resource group. |
| Resource Type | Groups resources based on their Azure service type.  |
| Change Type | Organizes resources based on the collected change type. Values include _Create_, _Update_, and _Delete_. |
| Client Type | Sorts by how the change is initiated and performed. Values include _CLI_ and _ARM template_. |
| Changed By | Groups resource changes by who made the change. Values include user email ID or subscription ID. |
| Changed By Type | Groups resource changes based on the descriptor of who made the change. Values include _User_, _Application_.  |
| Operation | Groups resources based on [their resource provider operations](../../../role-based-access-control/resource-provider-operations.md). |
| Correlation ID | Organizes the resource changes by [the operation's unique identifier](../../../expressroute/get-correlation-id.md). |

### Edit columns

You can add and remove columns, or change the column order in the Change Analysis results. In **Change Analysis** select **Manage view** > **Edit columns**.

:::image type="content" source="./media/view-resource-changes/manage-results-view.png" alt-text="Screenshot of the drop-down for selecting the option for editing columns for the results.":::

In the **Edit columns** pane, make your changes and then select **Save** to apply.

:::image type="content" source="./media/view-resource-changes/edit-columns-pane.png" alt-text="Screenshot of the Edit columns pane options.":::

#### Add a column

Click **+ Add column** and select a column property from the dropdown in the new column field.

:::image type="content" source="./media/view-resource-changes/select-new-column.png" alt-text="Screenshot of the drop-down for selecting a new column.":::

#### Delete a column

To delete a column, select the trash can icon.

:::image type="content" source="./media/view-resource-changes/delete-column.png" alt-text="Screenshot of the trash can icon to delete a column.":::

#### Reorder columns

Change the column order by either dragging and dropping a field, or selecting a column and clicking **Move up** and **Move down**.

:::image type="content" source="./media/view-resource-changes/reorder-columns.png" alt-text="Screenshot of selecting a column to move up or down in the order.":::

#### Reset to default

Select **Reset to defaults** to revert your changes.

:::image type="content" source="./media/view-resource-changes/reset-columns-default.png" alt-text="Screenshot of where to reset to the default column settings.":::

## Next steps

Learn more about [Azure Resource Graph](../overview.md)
