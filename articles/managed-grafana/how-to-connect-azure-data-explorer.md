---
title: Add an Azure Data Explorer datasource in Azure Managed Grafana
description: In this guide, learn how to connect an Azure Data Explorer datasource to Grafana and learn about the authentication methods available for Azure Data Explorer.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to
ms.date: 11/22/2023
---

# Configure an Azure Data Explorer datasource

Azure Data Explorer is a logs & telemetry data exploration service. In this guide, you learn how to add an Azure Data Explorer data source to Grafana and you learn how to configure Azure Data Explorer using each authentication option available for this service.

## Prerequisites

* [An Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md) in the Standard plan.
* [An Azure Data Explorer database](dataexplorer-docs-pr/data-explorer/create-cluster-and-database.md).

You can follow the steps below using the Azure portal or the Azure CLI.

## Add an Azure Data Explorer data source

1. Open your Azure Managed Grafana instance in the Azure portal.
1. Select **Overview** from the left menu, then open the **Endpoint** URL.
1. In the Grafana portal, deploy the menu on the left and select **Connections** > **Connect data**.
1. Select **Azure Data Explorer Datasource** from the list, and add it to your instance by selecting **Create a Azure Data Explorer Datasource data source** in the top right corner.

## Configure Azure Data Explorer

A new page is displayed, showing Azure Data Explorer configuration.

1. In the **Settings** tab, optionally edit the data source **Name**.
1. Under **Connection Details**, enter the Azure Data Explorer database **Cluster URL**.
1. Select an authentication method, between **Managed Identity**, **Current User** or **App Registration**.

### Managed Identity

## Test the configuration

Select **Save & test** and check if any error is displayed on screen.

<!-- 

Link to Troubleshooting doc eventually

Got error Azure HTTP "403 Forbidden"
 -->

1.  and optionally also edit the **Query Optimizations**, **Database schema settings**, and **Tracking** sections.

   :::image type="content" source="media/data-sources/data-explorer-connection-settings.jpg" alt-text="Screenshot of the Connection details section for Data Explorer in data sources.":::

   To complete this process, you need to have a Microsoft Entra service principal and connect Microsoft Entra ID with an Azure Data Explorer User. For more information, go to [Configuring the datasource in Grafana](https://github.com/grafana/azure-data-explorer-datasource#configuring-the-datasource-in-grafana).

1. Select **Save & test** to validate the connection. "Success" is displayed on screen and confirms that Azure Managed Grafana is able to fetch the data source through the provided connection details, using the service principal in Microsoft Entra ID.

## Configure Azure Data Explorer

To add and configure an Azure Data Explorer using the Azure CLI, run the [az grafana data-source create](/cli/azure/grafana/data-source#az-grafana-data-source-create) command in the Azure CLI.

### Using Managed Identity

Replace the placeholder `<name>` with a name for your data source, such as "Azure Data Explorer Datasource", and replace `<cluster-url>` with the URL of your cluster. An example is available in the [Azure CLI documentation](/cli/azure/grafana/data-source#az-grafana-data-source-create).

```azurecli
az grafana data-source create -n MyGrafana --definition '{
  "name": "<name>",
  "type": "grafana-azure-data-explorer-datasource",
  "access": "proxy",
  "jsonData": {
    "dataConsistency": "strongconsistency",
    "clusterUrl": "<cluster-url>"
  }
}'
```

### Using App Registration

Replace the placeholder `<name>` with a name for your data source, such as "Azure Data Explorer Datasource", and replace `<cluster-url>`, `<tenant-id>`, and `<-client-id>` with your own information. An example is available in the [Azure CLI documentation](/cli/azure/grafana/data-source#az-grafana-data-source-create).

```azurecli
az grafana data-source create -n MyGrafana --definition '{
  "name": "Azure Data Explorer Datasource-1",
  "type": "grafana-azure-data-explorer-datasource",
  "access": "proxy",
  "jsonData": {
    "clusterUrl": "<cluster-url>",
    "azureCredentials": {
      "authType": "clientsecret",
      "azureCloud": "AzureCloud",
      "tenantId": "<tenant-id>",
      "clientId": "<-client-id>"
    }
  },
  "secureJsonData": { "azureClientSecret": "verySecret" }
}'
```

---

> [!TIP]
> If you can't connect to a data source, you may need to [modify access permissions](how-to-permissions.md) to allow access from your Azure Managed Grafana instance.

Azure Managed Grafana can also access data sources using a service principal set up in Microsoft Entra ID.

### [Portal](#tab/azure-portal)


### [Azure CLI](#tab/azure-cli)

1. Run the [az grafana data-source create](/cli/azure/grafana/data-source#az-grafana-data-source-create) command to create the Azure Data Explorer data source.

   For example:

   ```azurecli-interactive
   az grafana data-source create --name <grafana-instance-name> --definition '{
   "access": "proxy", 
   "jsonData": { 
      "azureCloud": "azuremonitor", 
      "clientId": "<client-ID>",
      "clusterUrl": "<cluster URL>",
      "dataConsistency": "strongconsistency", 
      "defaultDatabase": "<database-name>",
      "queryTimeout": "120s",
      "tenantId": "<tenant-ID>"
   },
   "name": "<data-source-name>",
   "type": "grafana-azure-data-explorer-datasource",
   }'      
   ```

1. Run the [az grafana data-source update](/cli/azure/grafana/data-source#az-grafana-data-source-update) command to update the configuration of the Azure Data Explorer data source.

Fore more information about Azure Data Explorer datasources, go to [Azure Data Explorer](\how-to-connect-azure-data-explorer.md).

---a

## Remove a data source

This section describes the steps for removing a data source.

> [!CAUTION]
> Removing a data source that is used in a dashboard will make the dashboard unable to collect the corresponding data and will trigger an error or result in no data being shown in the panel.

### [Portal](#tab/azure-portal)

Remove a data source in the Azure portal:

1. Open your Azure Managed Grafana instance in the Azure portal.
1. Select **Overview** from the left menu, then open the **Endpoint** URL.
1. In the Grafana portal, go to **Connections** > **Your connections**
1. Select the data source you want to remove and select **Delete**.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana data-source delete](/cli/azure/grafana/data-source#az-grafana-data-source-delete) command to remove an Azure Managed Grafana data source using the Azure CLI. In the sample below, replace the placeholders `<instance-name>` and `<id>` with the name of the Azure Managed Grafana workspace and the name, ID or UID of the data source.

```azurecli
az grafana data-source delete --name <instance-name> --data-source <id>
```

---

## Next steps

> [!div class="nextstepaction"]
> [Create a dashboard](how-to-create-dashboard.md)


## Next steps

> [!div class="nextstepaction"]
> [Monitor your Azure Managed Grafana instance](how-to-monitor-managed-grafana-workspace.md)