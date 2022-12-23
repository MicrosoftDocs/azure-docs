---
title: Create a Grafana dashboard with Azure Managed Grafana
description: Learn how to create and set up Azure Managed Grafana dashboards.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to 
ms.date: 12/20/2022
---

# Create a dashboard in Azure Managed Grafana

In this guide, learn how to create a dashboard in Azure Managed Grafana to visualize data from your Azure services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).
- An existing Azure service instance with monitoring data.

## Import a Grafana dashboard

To quickly create a dashboard, import a dashboard template from the Grafana Labs website and add it to your Managed Grafana workspace.

1. From the Grafana Labs website, browse through [Grafana dashboards templates](https://grafana.com/grafana/dashboards/?category=azure) and select a dashboard to import.
1. Select **Copy ID to clipboard**.
1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
1. In your Grafana endpoint, go to **Dashboards > Import**.
1. On the **Import** page, under **Import via grafana.com**, paste the Grafana dashboard ID copied earlier, and select **Load**.
   :::image type="content" source="media/dashboard/import-load.png" alt-text="Screenshot of the Grafana instance. Load dashboard to import.":::

1. Optionally update the dashboard name, folder and UID.
1. Select a datasource and select **Import**.
1. A new dashboard is displayed.
1. Review the default visualizations on the dashboard and edit the dashboard if necessary.

## Create a new Grafana dashboard from scratch

If none of the pre-configured dashboards listed on the Grafana Labs website fit your needs, create a new dashboard from scratch.

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
1. In your Grafana endpoint, go to **Dashboards > New Dashboard**.
1. Select one of three options:
   - **Add a new panel**: instantly creates a dashboard with a first default panel.
   - **Add a new row**: instantly creates a dashboard with a new empty row.
   - **Add a panel from the panel library**: instantly creates a dashboard with an existing reusable panel from another instance you have access to.

   :::image type="content" source="media/dashboard/from-scratch.png" alt-text="Screenshot of the Grafana instance. Create a new dashboard.":::

1. Select the title of your first panel and select **Edit** to start editing your panel.

## Edit a panel

To update your Grafana panel, follow the steps below.
1. Review the visualization to check if you're satisfied with the data and display:

     :::image type="content" source="media/dashboard/visualization.png" alt-text="Screenshot of the Grafana instance. Example of visualization.":::

1. In the lower part of the page:
   1. **Query** tab:
      1. Review the selected data source. If necessary, select the drop-down list to use another data source.
      1. Update the query. Each data source has a specific query editor that provides different features and capabilities for that type of [data source](https://grafana.com/docs/grafana/v9.1/datasources/#querying).
      1. Select **+ Query** or **+ Expression** to add a new query or expression.

    :::image type="content" source="media/dashboard/edit-query.png" alt-text="Screenshot of the Grafana instance. Create a new dashboard.":::

   1. **Transform** tab:  filter data or queries, and organize or combine data before the data is visualized.
   1. **Alert** tab: set alert rules and notifications.

1. At the top of the page:
   1. Toggle **Table view** to display data as a table.
   1. Switch between **Fill** and **Actual** to edit panel size
   1. Select time to update the time range
   1. Select the **Visualization** drop-down menu to choose a visualization type that best supports your use case. Go to [visualization](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/) for more information.
   1. Select the **Panel options** icon on the right side to review and update a variety of panel options.

    :::image type="content" source="media/dashboard/panel-time-visualization-options.png" alt-text="Screenshot of the Grafana instance. Open options.":::

Grafana displays a preview of your query results with the visualization applied.

If needed, in the dropdowns at the top, make selections for your datasource instance.

## Next steps

In this how-to guide, you learned how to create a Grafana dashboard. To learn how to manage your data sources, go to:

> [!div class="nextstepaction"]
> [Configure data sources](how-to-data-source-plugins-managed-identity.md)
