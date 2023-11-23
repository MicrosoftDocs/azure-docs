---
title: How to manage data sources for Azure Managed Grafana
description: In this how-to guide, discover how you can configure data sources for Azure Managed Grafana
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to
ms.date: 11/22/2023
---

# How to manage data sources in Azure Managed Grafana

In this guide, you learn about data sources supported in each Azure Managed Grana plan and learn how to add, manage and remove these data sources.

## Prerequisites

[An Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).

## Supported Grafana data sources

By design, Grafana can be configured with multiple *data sources*. A data source is an externalized storage backend that holds telemetry information.

### Grafana core data sources

Azure Managed Grafana supports many popular data sources. The table below lists the Grafana core data sources that can be added to Azure Managed Grafana for each service tier.

| Data sources                                                                                                                  | Essential (preview) | Standard |
|-------------------------------------------------------------------------------------------------------------------------------|-----------|----------|
| [Alertmanager](https://grafana.com/docs/grafana/latest/datasources/alertmanager/)                                             | -         | ✔       |
| [AWS CloudWatch](https://grafana.com/docs/grafana/latest/datasources/aws-cloudwatch/)                                         | -         | ✔       |
| [Azure Data Explorer](https://github.com/grafana/azure-data-explorer-datasource?utm_source=grafana_add_ds)                    | -         | ✔       |
| [Azure Monitor](https://grafana.com/docs/grafana/latest/datasources/azuremonitor/)                                            | ✔        | ✔       |
| [Elasticsearch](https://grafana.com/docs/grafana/latest/datasources/elasticsearch/)                                           | -         | ✔       |
| [GitHub](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-github) | -         | ✔       |
| [Google Cloud Monitoring](https://grafana.com/docs/grafana/latest/datasources/google-cloud-monitoring/)                       | -         | ✔       |
| [Graphite](https://grafana.com/docs/grafana/latest/datasources/graphite/)                                                     | -         | ✔       |
| [InfluxDB](https://grafana.com/docs/grafana/latest/datasources/influxdb/)                                                     | -         | ✔       |
| [Jaeger](https://grafana.com/docs/grafana/latest/datasources/jaeger/)                                                         | -         | ✔       |
| [JSON API](https://grafana.com/grafana/plugins/grafana-jira-datasource)                                                       | -         | ✔       |
| [Loki](https://grafana.com/docs/grafana/latest/datasources/loki/)                                                             | -         | ✔       |
| [Microsoft SQL Server](https://grafana.com/docs/grafana/latest/datasources/mssql/)                                            | -         | ✔       |
| [MySQL](https://grafana.com/docs/grafana/latest/datasources/mysql/)                                                           | -         | ✔       |
| [OpenTSDB](https://grafana.com/docs/grafana/latest/datasources/opentsdb/)                                                     | -         | ✔       |
| [PostgreSQL](https://grafana.com/docs/grafana/latest/datasources/postgres/)                                                   | -         | ✔       |
| [Prometheus](https://grafana.com/docs/grafana/latest/datasources/prometheus/)                                                 | ✔        | ✔       |
| [Tempo](https://grafana.com/docs/grafana/latest/datasources/tempo/)                                                           | -         | ✔       |
| [TestData](https://grafana.com/docs/grafana/latest/datasources/testdata/)                                                     | ✔        | ✔       |
| [Zipkin](https://grafana.com/docs/grafana/latest/datasources/zipkin/)                                                         | -         | ✔       |

### Data sources for Grafana Enterprise customers

Within the Standard service tier, users who have subscribed to the Grafana Enterprise option can also access the following data sources.

* [AppDynamics](https://grafana.com/grafana/plugins/dlopes7-appdynamics-datasource)
* [Azure Devops](https://grafana.com/grafana/plugins/grafana-azuredevops-datasource)
* [DataDog](https://grafana.com/grafana/plugins/grafana-datadog-datasource)
* [Dynatrace](https://grafana.com/grafana/plugins/grafana-dynatrace-datasource)
* [GitLab](https://grafana.com/grafana/plugins/grafana-gitlab-datasource)
* [Honeycomb](https://grafana.com/grafana/plugins/grafana-honeycomb-datasource)
* [MongoDB](https://grafana.com/grafana/plugins/grafana-mongodb-datasource)
* [New Relic](https://grafana.com/grafana/plugins/grafana-newrelic-datasource)
* [Oracle Database](https://grafana.com/grafana/plugins/grafana-oracle-datasource)
* [Salesforce](https://grafana.com/grafana/plugins/grafana-salesforce-datasource)
* [SAP HANA®](https://grafana.com/grafana/plugins/grafana-saphana-datasource)
* [ServiceNow](https://grafana.com/grafana/plugins/grafana-servicenow-datasource)
* [Snowflake](https://grafana.com/grafana/plugins/grafana-snowflake-datasource)
* [Splunk](https://grafana.com/grafana/plugins/grafana-splunk-datasource)
* [Splunk Infrastructure monitoring (SignalFx)](https://grafana.com/grafana/plugins/grafana-splunk-monitoring-datasource)
* [Wavefront](https://grafana.com/grafana/plugins/grafana-wavefront-datasource)

### Additional data sources

More data sources can be added from the [Plugin management (preview) feature](how-to-manage-plugins.md).

For more information about data sources, go to [Data sources](https://grafana.com/docs/grafana/latest/datasources/) on the Grafana Labs website.

## Add a data source

To add a data source to Azure Managed Grafana, follow the steps below using the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

### Grafana core data sources

To add a [Grafana core data source](https://grafana.com/docs/grafana/latest/datasources/#built-in-core-data-sources) with the Azure portal:

1. Open your Azure Managed Grafana instance in the Azure portal.
1. Select **Overview** from the left menu, then open the **Endpoint** URL.
1. In the Grafana portal, deploy the menu on the left and select **Connections** > **Connect data**.
1. Select a data source from the list, and add it to your instance by selecting **Create** or **Add** in the top right hand corner.
1. Fill out the form and select **Save and test** to test and update the data source configuration.

   :::image type="content" source="media/data-sources/add-data-source.png" alt-text="Screenshot of the Add data source page.":::

### Other data sources

1. To add a data source that isn't part of the Grafana built-in core data sources, start by [installing the corresponding data source plugin](how-to-manage-plugins.md#add-a-plugin).

1. Then add the datasource from the Grafana portal.

    1. In the Grafana portal, go to **Connections** > **Connect data**.
    1. Select a data source from the list, and add the data source to your instance by selecting **Create** in the top right hand corner.
    1. Fill out the form and select **Save and test** to test and update the data source configuration.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana data-source create](/cli/azure/grafana/data-source#az-grafana-data-source-create) command to add a [Grafana core data source](https://grafana.com/docs/grafana/latest/datasources/#built-in-core-data-sources) with the Azure CLI.

For example, to add an Azure SQL data source, run:

```azurecli

az grafana data-source create --name <instance-name> --definition '{
  "access": "proxy",
  "database": "testdb",
  "jsonData": {
    "authenticationType": "SQL Server Authentication",
    "encrypt": "false"
  },
  "secureJsonData": {
    "password": "verySecretPassword"
  },
  "name": "Microsoft SQL Server",
  "type": "mssql",
  "url": "<url>",
  "user": "<user>"
}'
```

Other data sources can be added [from the Azure portal](#other-data-sources).

---

> [!TIP]
> If you can't connect to a data source, you may need to [modify access permissions](how-to-permissions.md) to allow access from your Azure Managed Grafana instance.

## Configure a data source

The content below, shows how to configure some of the most popular data sources in Azure Managed Grafana: Azure Monitor and Azure Data Explorer. A similar process can be used to configure other types of data sources. For more information about a specific data source, refer to [Grafana's documentation](https://grafana.com/docs/grafana/latest/datasources/#built-in-core-data-sources).

### Azure Monitor configuration

The Azure Monitor data source is automatically added to all new Managed Grafana resources. To review or modify its configuration, follow the steps below in the Grafana portal of your Azure Managed Grafana instance or in the Azure CLI.

### [Portal](#tab/azure-portal)

1. Deploy the menu on the left and select **Connections** > **Data sources**.

   :::image type="content" source="media/data-sources/configuration.png" alt-text="Screenshot of the Add data sources page.":::

1. Azure Monitor is listed as a built-in data source for your Managed Grafana instance. Select **Azure Monitor**.
1. In the **Settings** tab, authenticate through **Managed Identity** and select your subscription from the dropdown list or enter your **App Registration** details

   :::image type="content" source="media/data-sources/configure-Azure-Monitor.png" alt-text="Screenshot of the Azure Monitor page in data sources.":::

Authentication and authorization are made through the provided managed identity. Using managed identity, lets you assign permissions for your Managed Grafana instance to access Azure Monitor data without having to manually manage service principals in Microsoft Entra ID.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana data-source update](/cli/azure/grafana/data-source#az-grafana-data-source-update) command to update the configuration of your Azure Monitor data sources using the Azure CLI.

For example:

```azurecli-interactive

az grafana data-source update --data-source 'Azure Monitor' --name <instance-name> --definition '{ 
  "datasource": {
    "access": "proxy",
    "basicAuth": false,
    "basicAuthUser": "",
    "database": "",
    "id": 1,
    "isDefault": false,
    "jsonData": {
      "azureAuthType": "msi",
      "subscriptionId": "<subscription-ID>"
    },
    "name": "Azure Monitor",
    "orgId": 1,
    "readOnly": false,
    "secureJsonFields": {},
    "type": "grafana-azure-monitor-datasource",
    "typeLogoUrl": "",
    "uid": "azure-monitor-oob",
    "url": "",
    "user": "",
    "version": 1,
    "withCredentials": false
  },
  "id": 1,
  "message": "Datasource updated",
  "name": "Azure Monitor"
}
```

---

> [!NOTE]
> User-assigned managed identity isn't currently supported.

### Azure Data Explorer configuration

Azure Managed Grafana can also access data sources using a service principal set up in Microsoft Entra ID.

### [Portal](#tab/azure-portal)

1. From the left menu, select **Configuration** > **Data sources**.

   :::image type="content" source="media/data-sources/configuration.png" alt-text="Screenshot of the Add data sources page.":::

1. Add the **Azure Data Explorer Datasource** data source to your Managed Grafana instance.
1. In the **Settings** tab, fill out the form under **Connection Details**,  and optionally also edit the **Query Optimizations**, **Database schema settings**, and **Tracking** sections.

   :::image type="content" source="media/data-sources/data-explorer-connection-settings.jpg" alt-text="Screenshot of the Connection details section for Data Explorer in data sources.":::

   To complete this process, you need to have a Microsoft Entra service principal and connect Microsoft Entra ID with an Azure Data Explorer User. For more information, go to [Configuring the datasource in Grafana](https://github.com/grafana/azure-data-explorer-datasource#configuring-the-datasource-in-grafana).

1. Select **Save & test** to validate the connection. "Success" is displayed on screen and confirms that Azure Managed Grafana is able to fetch the data source through the provided connection details, using the service principal in Microsoft Entra ID.

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

For more information about configuring Azure Data Explorer in Grafana, go to [Azure Data Explorer](\how-to-connect-azure-data-explorer.md).

---

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
