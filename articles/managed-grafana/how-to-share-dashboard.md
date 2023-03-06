---
title: Share an Azure Managed Grafana dashboard or panel
description: Learn how to share a Grafana dashboard with internal and external stakeholders.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to 
ms.date: 03/01/2023
---

# Share a Grafana dashboard or panel

In this guide for Azure Managed Grafana, learn how to share a Grafana dashboard with internal and external stakeholders, whether they are registered in your Azure Active Directory tenant or not.

You can share Grafana panels and dashboards using:
- A direct link
- A snapshot
- An embedded link (for panels only)
- An export link (for dashboards only)

> [!NOTE]
> The Grafana UI may change periodically. This article shows the Grafana interface and user flow at a given point. Your experience may slightly differ from the examples below at the time of reading this document. If this is the case, refer to the [Grafana Labs documentation.](https://grafana.com/docs/grafana/latest/dashboards/)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).
- A Grafana dashboard. If you don't have one, [create a Grafana dashboard](./quickstart-managed-grafana-portal.md).

### [Portal](#tab/azure-portal)

## Open sharing options

Access Grafana dashboard and panel sharing options with the following steps:

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
1. In the Grafana portal, go to **Dashboards > Browse**, and open a dashboard of your choice.
1. Open the sharing options:
   - To share a whole dashboard, select the **Share dashboard or panel** icon at the top of the page 
   - To share a single dashboard panel, hover on top of a panel title, expand the panel menu and select **Share**.

   :::image type="content" source="media/share-dashboard/find-share-option.png" alt-text="Screenshot of the Grafana instance. Create a new dashboard.":::

A new window opens, offering various sharing options.

> [!TIP] 
> If you update a dashboard or a panel, make sure to save your changes before sharing it so that it contains the latest changes.

### Share a link

The **Link** tab lets you create a direct link to a Grafana dashboard or panel. This link can then be accessed by users who have a Grafana viewer permission.

Create a sharable link in one step , by selecting **Copy**, at the bottom of the **Link** tab. Optionally customize sharing with the options below:

- **Lock time range**: sets the time range of the shared panel or dashboard to the time range currently displayed in your shared panel or dashboard.
- **Theme**: keep the current theme or choose a dark or a light theme.
- **Shorten URL**: shortens the sharable link

### Share a snapshot publicly

The **Snapshot** tab lets you share an interactive dashboard or panel publicly. Sensitive data like queries (metric, template, and annotation) and panel links are removed from the snapshot leaving only the visible metric data and series names embedded in your dashboard.

> [!NOTE] 
> Snapshots can be viewed by anyone that has the link and can access the URL.

Optionally update the snapshot name, select an expiry date and change the value of the timeout. timeout.

### Share a snapshot publicly

### [Portal](#tab/azure-portal)

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
1. In the Grafana portal, go to **Dashboards > New Dashboard**.
1. Select one of the following options:
   - **Add a new panel**: instantly creates a dashboard from scratch with a first default panel.
   - **Add a new row**: instantly creates a dashboard with a new empty row.
   - **Add a panel from the panel library**: instantly creates a dashboard with an existing reusable panel from another instance you have access to.

   :::image type="content" source="media/create-dashboard/from-scratch.png" alt-text="Screenshot of the Grafana instance. Create a new dashboard.":::

### [Azure CLI](#tab/azure-cli)

Run the [az grafana dashboard create](/cli/azure/grafana/dashboard#az-grafana-dashboard-create) command and replace the placeholders `<AMG-name>`, `<AMG-resource-group>`, `<title>`, and `<definition>` with the name of the Azure Managed Grafana instance, its resource group, a title and a definition for the new dashboard. The definition consists of a dashboard model in JSON string, a path or URL to a file with such content.

```azurecli
az grafana dashboard create --name <AMG-name> --resource-group <AMG-resource-group> --title <title> --definition <definition>
```

For example:

```azurecli
az grafana dashboard create --name myGrafana --resource-group myResourceGroup --title "My dashboard" --folder folder1 --definition '{
   "dashboard": {
      "annotations": {
         ...
      },
      "panels": {
         ...
      }
   },
   "message": "Create a new test dashboard"
}'
```

---

## Duplicate a Grafana dashboard

Duplicate a Grafana dashboard using your preferred method.

### [Portal](#tab/azure-portal)

To copy a Grafana dashboard:

1. Open an existing dashboard in your Grafana instance
1. Select **Dashboard settings**
1. Select **Save as**
1. Enter a new name and/or a new folder and select **Save**

   :::image type="content" source="media\create-dashboard\copy-dashboard.png" alt-text="Screenshot of the Grafana instance. Duplicate a dashboard.":::

### [Azure CLI](#tab/azure-cli)

1. Run the [az grafana dashboard show](/cli/azure/grafana/dashboard#az-grafana-dashboard-show) command to show the definition of the dashboard you want to duplicate, and copy the output.

    ```azurecli
    az grafana dashboard show --name <AMG-name> --resource-group <AMG-resource-group> --dashboard <dashboard-UID>
    ```

1. Run the [az grafana dashboard create](/cli/azure/grafana/dashboard#az-grafana-dashboard-create) command and replace the placeholders `<AMG-name>`, `<AMG-resource-group>`, `<title>`, and `<dashboard-id>` with your own information. Replace `<definition>` with the output you copied in the previous step, and remove the `uid`and `id`.

    ```azurecli
    az grafana dashboard create --name <AMG-name> --resource-group <AMG-resource-group> --title <title>--definition <definition>
    ```

    For example:

    ```azurecli
    az grafana dashboard create --name myGrafana --resource-group myResourceGroup --title "My dashboard" --folder folder1 --definition '{
       "dashboard": {
          "annotations": {
             ...
          },
          "panels": {
             ...
          }
       },
       "message": "Create a new test dashboard"
    }'
    ```

---

## Edit a dashboard panel

Edit a Grafana dashboard panel using your preferred method.

### [Portal](#tab/azure-portal)

To update a Grafana panel, follow the steps below.

1. Review the panel to check if you're satisfied with it or want to make some edits.

     :::image type="content" source="media/create-dashboard/visualization.png" alt-text="Screenshot of the Grafana instance. Example of visualization.":::

1. In the lower part of the page:
   1. **Query** tab:
      1. Review the selected data source. If necessary, select the drop-down list to use another data source.
      1. Update the query. Each data source has a specific query editor that provides different features and capabilities for that type of [data source](https://grafana.com/docs/grafana/v9.1/datasources/#querying).
      1. Select **+ Query** or **+ Expression** to add a new query or expression.

    :::image type="content" source="media/create-dashboard/edit-query.png" alt-text="Screenshot of the Grafana instance. Queries.":::

   1. **Transform** tab:  filter data or queries, and organize or combine data before the data is visualized.
   1. **Alert** tab: set alert rules and notifications.

1. At the top of the page:
   1. Toggle **Table view** to display data as a table.
   1. Switch between **Fill** and **Actual** to edit panel size
   1. Select the time icon to update the time range
   1. Select the visualization drop-down menu to choose a visualization type that best supports your use case. Go to [visualization](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/) for more information.

    :::image type="content" source="media/create-dashboard/panel-time-visualization-options.png" alt-text="Screenshot of the Grafana instance. Time, visualization and more options.":::

1. On the right hand side, select the **Panel options** icon to review and update various panel options.

## [Azure CLI](#tab/azure-cli)

Run the [az grafana dashboard update](/cli/azure/grafana/dashboard#az-grafana-dashboard-update) command and update the Grafana dashboard definition.

```azurecli
az grafana dashboard update --name <AMG-name> --resource-group <AMG-resource-group> --definition <definition>
```

---

## Next steps

In this how-to guide, you learned how to create a Grafana dashboard. To learn how to manage your data sources, go to:

> [!div class="nextstepaction"]
> [Configure data sources](how-to-data-source-plugins-managed-identity.md)
