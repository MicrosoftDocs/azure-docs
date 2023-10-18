---
title: How to configure data sources for Azure Managed Grafana
description: In this how-to guide, discover how you can configure data sources for Azure Managed Grafana using Managed Identity.
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to
ms.date: 1/12/2023
---

# How to configure data sources for Azure Managed Grafana

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./how-to-permissions.md).
- A resource including monitoring data with  Managed Grafana monitoring permissions. Read [how to configure permissions](how-to-permissions.md) for more information.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Supported Grafana data sources

By design, Grafana can be configured with multiple data sources. A data source is an externalized storage backend that holds your telemetry information. Azure Managed Grafana supports many popular data sources.

Azure-specific data sources available for all customers:

- [Azure Data Explorer](https://github.com/grafana/azure-data-explorer-datasource?utm_source=grafana_add_ds)
- [Azure Monitor](https://grafana.com/docs/grafana/latest/datasources/azuremonitor/). Is preloaded in all Grafana instances.

Data sources reserved for Grafana Enterprise customers - exclusively preloaded in instances with a Grafana Enterprise subscription:

- [AppDynamics](https://grafana.com/grafana/plugins/dlopes7-appdynamics-datasource)
- [Azure Devops](https://grafana.com/grafana/plugins/grafana-azuredevops-datasource)
- [DataDog](https://grafana.com/grafana/plugins/grafana-datadog-datasource)
- [Dynatrace](https://grafana.com/grafana/plugins/grafana-dynatrace-datasource)
- [Gitlab](https://grafana.com/grafana/plugins/grafana-gitlab-datasource)
- [Honeycomb](https://grafana.com/grafana/plugins/grafana-honeycomb-datasource)
- [Jira](https://grafana.com/grafana/plugins/grafana-jira-datasource)
- [MongoDB](https://grafana.com/grafana/plugins/grafana-mongodb-datasource)
- [New Relic](https://grafana.com/grafana/plugins/grafana-newrelic-datasource)
- [Oracle Database](https://grafana.com/grafana/plugins/grafana-oracle-datasource)
- [Salesforce](https://grafana.com/grafana/plugins/grafana-salesforce-datasource)
- [SAP HANA®](https://grafana.com/grafana/plugins/grafana-saphana-datasource)
- [ServiceNow](https://grafana.com/grafana/plugins/grafana-servicenow-datasource)
- [Snowflake](https://grafana.com/grafana/plugins/grafana-snowflake-datasource)
- [Splunk](https://grafana.com/grafana/plugins/grafana-splunk-datasource)
- [Splunk Infrastructure monitoring (SignalFx)](https://grafana.com/grafana/plugins/grafana-splunk-monitoring-datasource)
- [Wavefront](https://grafana.com/grafana/plugins/grafana-wavefront-datasource)

Other data sources:

- [Alertmanager](https://grafana.com/docs/grafana/latest/datasources/alertmanager/)
- [CloudWatch](https://grafana.com/docs/grafana/latest/datasources/aws-cloudwatch/)
- Direct Input
- [Elasticsearch](https://grafana.com/docs/grafana/latest/datasources/elasticsearch/)
- [Google Cloud Monitoring](https://grafana.com/docs/grafana/latest/datasources/google-cloud-monitoring/)
- [Graphite](https://grafana.com/docs/grafana/latest/datasources/graphite/)
- [InfluxDB](https://grafana.com/docs/grafana/latest/datasources/influxdb/)
- [Jaeger](https://grafana.com/docs/grafana/latest/datasources/jaeger/)
- [Loki](https://grafana.com/docs/grafana/latest/datasources/loki/)
- [Microsoft SQL Server](https://grafana.com/docs/grafana/latest/datasources/mssql/)
- [MySQL](https://grafana.com/docs/grafana/latest/datasources/mysql/)
- [OpenTSDB](https://grafana.com/docs/grafana/latest/datasources/opentsdb/)
- [PostgreSQL](https://grafana.com/docs/grafana/latest/datasources/postgres/)
- [Prometheus](https://grafana.com/docs/grafana/latest/datasources/prometheus/)
- [Tempo](https://grafana.com/docs/grafana/latest/datasources/tempo/)
- [TestData DB](https://grafana.com/docs/grafana/latest/datasources/testdata/)
- [Zipkin](https://grafana.com/docs/grafana/latest/datasources/zipkin/)

For more information about data sources, go to [Data sources](https://grafana.com/docs/grafana/latest/datasources/) on the Grafana Labs website.

## Add a datasource

A number of data sources are added by in your Grafana instance by default. To add more data sources, follow the steps below using the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

1. Open the Grafana UI of your Azure Managed Grafana instance and select **Configuration** > **Data sources** from the left menu.
1. Select **Add data source**, search for the data source you need from the available list, and select it.
1. Fill out the form with the data source settings and select **Save and test** to validate the connection to your data source.

   :::image type="content" source="media/data-sources/add-data-source.png" alt-text="Screenshot of the Add data source page.":::

> [!NOTE]
> Installing Grafana plugins listed on the page **Configuration** > **Plugins** isn’t currently supported.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana data-source create](/cli/azure/grafana/data-source#az-grafana-data-source-create) command to add and manage Azure Managed Grafana data sources with the Azure CLI.

For example, to add an Azure SQL data source, run:

```azurecli-interactive

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

---

## Update a data source

### Azure Monitor configuration

The Azure Monitor data source is automatically added to all new Managed Grafana resources. To review or modify its configuration, follow these steps below in the Grafana UI of your Azure Managed Grafana instance or in the Azure CLI.

### [Portal](#tab/azure-portal)

1. From the left menu, select **Configuration** > **Data sources**.

   :::image type="content" source="media/data-sources/configuration.png" alt-text="Screenshot of the Add data sources page.":::

1. Azure Monitor is listed as a built-in data source for your Managed Grafana instance. Select **Azure Monitor**.
1. In the **Settings** tab, authenticate through **Managed Identity** and select your subscription from the dropdown list or enter your **App Registration** details

   :::image type="content" source="media/data-sources/configure-Azure-Monitor.png" alt-text="Screenshot of the Azure Monitor page in data sources.":::

Authentication and authorization are made through the provided managed identity. Using managed identity, lets you assign permissions for your Managed Grafana instance to access Azure Monitor data without having to manually manage service principals in Azure Active Directory (Azure AD).

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
> User-assigned managed identity isn't supported currently.

### Azure Data Explorer configuration

Azure Managed Grafana can also access data sources using a service principal set up in Azure Active Directory (Azure AD).

### [Portal](#tab/azure-portal)

1. From the left menu, select **Configuration** > **Data sources**.

   :::image type="content" source="media/data-sources/configuration.png" alt-text="Screenshot of the Add data sources page.":::

1. Add the **Azure Data Explorer Datasource** data source to your Managed Grafana instance.
1. In the **Settings** tab, fill out the form under **Connection Details**,  and optionally also edit the **Query Optimizations**, **Database schema settings**, and **Tracking** sections.

   :::image type="content" source="media/data-sources/data-explorer-connection-settings.jpg" alt-text="Screenshot of the Connection details section for Data Explorer in data sources.":::

   To complete this process, you need to have an Azure AD service principal and connect Azure AD with an Azure Data Explorer User. For more information, go to [Configuring the datasource in Grafana](https://github.com/grafana/azure-data-explorer-datasource#configuring-the-datasource-in-grafana).

1. Select **Save & test** to validate the connection. "Success" is displayed on screen and confirms that Azure Managed Grafana is able to fetch the data source through the provided connection details, using the service principal in Azure AD.

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

---

## Next steps

> [!div class="nextstepaction"]
> [Connect to a data source privately](./how-to-connect-to-data-source-privately.md)

> [!div class="nextstepaction"]
> [Share an Azure Managed Grafana instance](./how-to-share-grafana-workspace.md)
