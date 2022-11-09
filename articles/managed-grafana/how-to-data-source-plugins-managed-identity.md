---
title: How to configure data sources for Azure Managed Grafana
description: In this how-to guide, discover how you can configure data sources for Azure Managed Grafana using Managed Identity.
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to
ms.date: 3/31/2022 
---

# How to configure data sources for Azure Managed Grafana

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./how-to-permissions.md).
- A resource including monitoring data with  Managed Grafana monitoring permissions. Read [how to configure permissions](how-to-permissions.md) for more information.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Supported Grafana data sources

By design, Grafana can be configured with multiple data sources. A data source is an externalized storage backend that holds your telemetry information. Azure Managed Grafana supports many popular data sources. Azure-specific data sources are:

- [Azure Data Explorer](https://github.com/grafana/azure-data-explorer-datasource?utm_source=grafana_add_ds)
- [Azure Monitor](https://grafana.com/docs/grafana/latest/datasources/azuremonitor/)

Other data sources include:

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

You can find all available Grafana data sources by going to your resource and selecting **Configuration** > **Data sources** from the left menu. Search for the data source you need from the available list and select **Add data source**.

   :::image type="content" source="media/data-sources/add-data-source.png" alt-text="Screenshot of the Add data source page.":::

> [!NOTE]
> Installing Grafana plugins listed on the page **Configuration** > **Plugins** isn’t currently supported.

For more information about data sources, go to [Data sources](https://grafana.com/docs/grafana/latest/datasources/) on the Grafana Labs website.

## Configuration for Azure Monitor

The Azure Monitor data source is automatically added to all new Managed Grafana resources. To review or modify its configuration, follow these steps in your Managed Grafana endpoint:

1. From the left menu, select **Configuration** > **Data sources**.

   :::image type="content" source="media/data-sources/configuration.png" alt-text="Screenshot of the Add data sources page.":::

1. Azure Monitor is listed as a built-in data source for your Managed Grafana instance. Select **Azure Monitor**.
1. In the **Settings** tab, authenticate through **Managed Identity** and select your subscription from the dropdown list or enter your **App Registration** details

   :::image type="content" source="media/data-sources/configure-Azure-Monitor.png" alt-text="Screenshot of the Azure Monitor page in data sources.":::

Authentication and authorization are then made through the provided managed identity. With Managed Identity, you can assign permissions for your Managed Grafana instance to access Azure Monitor data without having to manually manage service principals in Azure Active Directory (Azure AD).

> [!NOTE]
> User assigned managed identity isn't supported currently.

## Configuration for Azure Data Explorer

Azure Managed Grafana can also access data sources using a service principal set up in Azure Active Directory (Azure AD).

1. From the left menu, select **Configuration** > **Data sources**.

   :::image type="content" source="media/data-sources/configuration.png" alt-text="Screenshot of the Add data sources page.":::

1. **Azure Data Explorer Datasource** is listed as a built-in data source for your Managed Grafana instance. Select this data source.
1. In the **Settings** tab, fill out the form under **Connection Details**,  and optionally also edit the **Query Optimizations**, **Database schema settings**, and **Tracking** sections.

   :::image type="content" source="media/data-sources/data-explorer-connection-settings.jpg" alt-text="Screenshot of the Connection details section for Data Explorer in data sources.":::

   To complete this process, you need to have an Azure AD service principal and connect Azure AD with an Azure Data Explorer User. For more information, go to [Configuring the datasource in Grafana](https://github.com/grafana/azure-data-explorer-datasource#configuring-the-datasource-in-grafana).

1. Select **Save & test** to validate the connection. "Success" is displayed on screen and confirms that Azure Managed Grafana is able to fetch the data source through the provided connection details, using the service principal in Azure AD.

## Next steps

> [!div class="nextstepaction"]
> [Share an Azure Managed Grafana instance](./how-to-share-grafana-workspace.md)
