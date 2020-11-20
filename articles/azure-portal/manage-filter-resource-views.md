---
title: View and filter Azure resource information
description: Filter information and use different views to better understand your Azure resources.
author: mgblythe
ms.service: azure-portal
ms.topic: how-to
ms.author: mblythe
ms.date: 09/11/2020

---

# View and filter Azure resource information

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

The views we've looked at so far have been _list views_, but there are also _summary views_ that include visuals. You can save and use these views just like you can list views. Filters persist between the two types of views. There are standard views, like the **Location** view shown below, as well as views that are relevant to specific services, such as the **Status** view for Azure Storage.

:::image type="content" source="media/manage-filter-resource-views/summary-map.png" alt-text="Summary of resources in a map view":::

To save and use a summary view:

1. From the view menu, select **Summary view**.

    :::image type="content" source="media/manage-filter-resource-views/menu-summary-view.png" alt-text="Summary view menu":::

1. The summary view enables you to summarize by different attributes, including **Location** and **Type**. Select a **Summarize by** option and an appropriate visual. The following screenshot shows the **Type summary** with a **Bar chart** visual.

    :::image type="content" source="media/manage-filter-resource-views/type-summary-bar-chart.png" alt-text="Type summary showing a bar chart":::

1. Select **Manage view** then **Save** to save this view like you did with the list view.

1. In the summary view, under **Type summary**, select a bar in the chart. Selecting the bar provides a list filtered down to one type of resource.

    :::image type="content" source="media/manage-filter-resource-views/all-resources-filtered-type.png" alt-text="All resources filtered by type":::

## Run queries in Azure Resource Graph

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
