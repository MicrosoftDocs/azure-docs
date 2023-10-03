---
title: Create a Grafana dashboard with Azure Managed Grafana
description: Learn how to create and configure Azure Managed Grafana dashboards.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to
ms.date: 03/07/2023
---

# Create a dashboard in Azure Managed Grafana

In this guide, learn how to create a dashboard in Azure Managed Grafana to visualize data from your Azure services.

A Grafana dashboard contains panels and rows. You can import a Grafana dashboard and adapt it to your own scenario, create a new Grafana dashboard, or duplicate an existing dashboard.

> [!NOTE]
> The Grafana UI may change periodically. This article shows the Grafana interface and user flow at a given point. Your experience may slightly differ from the examples below at the time of reading this document. If this is the case, refer to the [Grafana Labs documentation](https://grafana.com/docs/grafana/latest/dashboards/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).
- Another existing Azure service instance with monitoring data.

## Import a Grafana dashboard

To quickly create a dashboard, import an existing dashboard and add it to your Managed Grafana instance. You can do so by importing a dashboard template from Grafana Labs, uploading a JSON file or pasting JSON code. 

### Import a dashboard from Grafana Labs 

Import a dashboard template from the Grafana Labs website.

1. From the Grafana Labs website, browse through [Grafana dashboards templates](https://grafana.com/grafana/dashboards/?category=azure) and select a dashboard to import.
1. Select **Copy ID to clipboard**.
1. For the next steps, use the Azure portal or the Azure CLI.

    ### [Portal](#tab/azure-portal)

   1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
   1. In the Grafana portal, go to **Dashboards > Import**.
   1. Under **Import via grafana.com**, paste the Grafana dashboard ID copied earlier, and select **Load**.

      :::image type="content" source="media/create-dashboard/import-load.png" alt-text="Screenshot of the Grafana instance. Load dashboard to import.":::

   1. Optionally update the dashboard name, folder, unique identifier (UID), and other parameters.
   1. Select a datasource and select **Import**.
   1. A new dashboard is displayed. Review and edit it if necessary.

    ### [Azure CLI](#tab/azure-cli)
    
    Run the [az grafana dashboard import](/cli/azure/grafana/dashboard#az-grafana-update) command and replace the placeholders `<AMG-name>`, `<AMG-resource-group>`, and `<dashboard-id>` with the name of the Azure Managed Grafana instance, its resource group, and the dashboard ID you copied earlier.

   ```azurecli
   az grafana dashboard import --name <AMG-name> --resource-group <AMG-resource-group> --definition <dashboard-id>
   ```

    ---

### Import a JSON dashboard

Follow these steps to import a JSON dashboard to Grafana:

### [Portal](#tab/azure-portal)

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
1. Go to **Dashboard > Import** use a preferred import option:
   - Select **Upload JSON file** and then **Load** to import from a JSON file.
   - Paste JSON text in the **Import via panel json** box and select **Load** to use text from your clipboard.
1. Optionally update the dashboard name, folder, unique identifier (UID) and other parameters.
1. Select **Import**.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana dashboard import](/cli/azure/grafana/dashboard#az-grafana-update) command and replace the placeholders `<AMG-name>`, `<AMG-resource-group>`, and `<local-path-to-file>` with the name of the Azure Managed Grafana instance, its resource group, and the path to the JSON File on your local machine, ending with `.json`.

   ```azurecli
   az grafana dashboard import --name <AMG-name> --resource-group <AMG-resource-group> --definition @<local-path-to-file>
   ```

---

## Create a new Grafana dashboard

To create your own new dashboard, follow these steps. 

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

1. Open an existing dashboard in your Grafana instance.
1. Select **Dashboard settings**.
1. Select **Save as**.
1. Enter a new name and/or a new folder and select **Save**.

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
   1. Switch between **Fill** and **Actual** to edit panel size.
   1. Select the time icon to update the time range.
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

In this how-to guide, you learned how to create a Grafana dashboard. To learn share this dashboard with internal and external stakeholders, go to:

> [!div class="nextstepaction"]
> [Share a dashboard or panel](how-to-share-dashboard.md)
