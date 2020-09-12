---
title: Manage and filter Azure resource information
description: Filter information and use different views to better understand your Azure resources.
author: mgblythe
ms.service: azure-portal
ms.topic: quickstart
ms.author: mblythe
ms.date: 09/11/2020

---

# Manage and filter Azure resource information

The Azure portal enables you to browse detailed information about resources across your Azure subscriptions. This article shows you how to filter information and use different views to better understand your resources.

The article focuses on the **All resources** screen shown in the following screenshot. Screens for individual resource types, such as virtual machines, have different options, such as starting and stopping a VM.

:::image type="content" source="media/manage-filter-resource-views/all-resources.png" alt-text="Azure portal view of all resources":::

## Filter resources

Start exploring **All resources** by using filters to focus on a subset of your resources. The following screenshot shows filtering on resource groups, selecting two of the six resource groups in a subscription.

:::image type="content" source="media/manage-filter-resource-views/filter-resource-group.png" alt-text="Filter view based on resource groups":::

You can combine filters, including those based on text searches, as shown in the following screenshot. In this case the results are scoped to resources that contain "SimpleWinVM" in one of the two resource groups already selected.

:::image type="content" source="media/manage-filter-resource-views/filter-simplewinvm.png" alt-text="Filter view based on text entry":::

To change which columns are included in a view, select **Manage view** then **Edit columns**.

:::image type="content" source="media/manage-filter-resource-views/edit-columns.png" alt-text="Edit columns shown in view":::

## Save, use, and delete views

You can save views that include the filters and columns you've selected. To save and use a view:

1. Select **Manage view** then **Save view**.

1. Enter a name for the view then select **OK**. The saved view now appears in the **Manage view** menu.

    :::image type="content" source="media/manage-filter-resource-views/simple-view.png" alt-text="Saved view":::

1. To use a view, switch between **Default** and one of your own views to see how that affects the list of resources displayed.

To delete a view:

1. Select **Manage view** then **Browse all views**.

1. In the **Saved views for "All resources"** pane, select the view then select the **Delete** icon ![Delete view icon](media/manage-filter-resource-views/icon-delete.png).

## Summarize resources with visuals

So far, the views have list

1. In all resources _view_ has two meanings: saved thing, list vs summary
1. Default view is list view, show dropdown

- "Summarize with visuals" allows you to go to another browse view that gives you a summary of your resources. This view provides visualizations to choose from that are summary counts based on all the columns available in browse. 

- You can switch the visualization between bar chart or pie chart. For location column, there is also a map (as shown above). 
- You can save this as a “view” using the Manage View dropdown – when you open this view, it’ll take you here instead of the list view that usually is shown in browse 
- Filters persist between the visualization view and list view 
- You can use filter and the counts on the visualizations will update accordingly
- You can open the underlying query in Resource Graph Explorer
- When you click on a bar, a part of the pie, or a number on the map, it’ll open a drill down blade that provides a list of resources that apply. For example, if I’m on a VM browse page, and I’m on the visualization for “Status” and I click on the “Running” bar, it opens the drill down blade with a list of all the VM resources that are running.

## Run a query in Azure Resource Graph

Azure Resource Graph provides efficient and performant resource exploration with the ability to query at scale across a set of subscriptions. The **All resources** screen in the Azure portal includes a link to open a Resource Graph query that is scoped to the current filtered view.

To run a Resource Graph query:

1. Select **Open query**.

    :::image type="content" source="media/manage-filter-resource-views/open-query.png" alt-text="Open Azure Resource Graph query":::

1. In **Azure Resource Graph Explorer**, select **Run query** to see the results.

    :::image type="content" source="media/manage-filter-resource-views/run-query.png" alt-text="Run Azure Resource Graph query":::

    For more information, see [Run your first Resource Graph query using Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md).

## Next steps

[Azure portal overview](azure-portal-overview.md)
[Create and share dashboards in the Azure portal](azure-portal-dashboards.md)
