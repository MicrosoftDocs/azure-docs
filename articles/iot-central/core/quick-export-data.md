---
title: Quickstart - Export data from Azure IoT Central
description: Quickstart - Learn how to use the data export feature in IoT Central to integrate with other cloud services.
author: dominicbetts
ms.author: dobett
ms.date: 05/27/2021
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# Quickstart: Export data from an IoT Central application

This quickstart shows you how to continuously export data from your Azure IoT Central application to another cloud service. To get you set up quickly, this quickstart uses [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) to let you store, query, and process the telemetry from the **IoT Plug and Play** smartphone app.

In this quickstart, you:

- Use the data export feature in IoT Central to export the telemetry sent by the smartphone app to an Azure Event Hubs queue.
- Ingest the telemetry from the Event Hubs queue into an Azure Data Explorer database.
- Use Azure Data Explorer to run queries on the telemetry.

## Prerequisites

Before you begin, you should complete the first quickstart [Create an Azure IoT Central application](./quick-deploy-iot-central.md). The second quickstart, [Configure rules and actions for your device](quick-configure-rules.md), is optional.

## Install Azure services

Before you can export data from your IoT Central application, you need to create an Event Hubs queue and an Azure Data Explorer database.

Select the following button to deploy the services:

[![Deploy to Azure Button for continuous-data-export](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fiot-central-docs-samples%2Fmaster%2Fquickstart-cde%2Fdeploy-azure-services.json)

On the **Custom deployment** form:

- Create a new resource group called *central-quickstart*.
- Choose the region closest to you.
- Enter a unique Azure Data Explorer name using lowercase letters and numbers only. For example *contosocentraladx*.
- Enter a unique Azure Event Hubs namespace name using lowercase letters and numbers only. For example *contosocentraleh*.

Select **Review + create**, then select **Create**.

> [!TIP]
> Expect the deployment to take about 10 minutes.

When the deployment is complete, make a note of the connection string it returns for Azure Event Hubs:

1. Wait for the deployment to complete.
1. Select **Outputs**.
1. Make a note of the **eventHubConnectionString** value, you use it later:

    :::image type="content" source="media/quick-export-data/connection-string.png" alt-text="Event hubs connection string.":::

## Configure data export

This scenario uses an Azure Event Hubs queue to deliver telemetry collected by your IoT Central application to Azure Data Explorer.

To configure the data export from IoT Central:

1. Navigate to the **Data export** page in your IoT Central application.
1. Select the **Destinations** tab and then **Add a destination**.
1. Enter *Event Hub 1* as the destination name. Select **Azure Event Hubs** as the destination type.
1. Enter the Event Hubs queue connection string you saved in the previous section. The **Event Hub** is filled out automatically with *centraltelemetry*.
1. Select **Save**.
1. On the **Data export** page, select the **Exports** tab, and then **Add an export**.
1. Enter *Telemetry Export* as the export name.
1. Select **Telemetry** as the type of data to export.
1. Add **Event Hub 1** as a destination.
1. Select **Save**.

When the export is running, the status on the **Data export** page is **Healthy**:

:::image type="content" source="media/quick-export-data/healthy-export.png" alt-text="Screenshot that shows a running data export with the healthy status.":::

## Configure data ingestion

Make sure the phone app is connected to your IoT Central application and sending data before you continue.

Your IoT Central application is continuously exporting telemetry to the Event Hubs queue. In this section, you configure your Azure Data Explorer cluster to continuously ingest the telemetry into a table where you can query it.

To configure data ingestion:

1. In the Azure portal, navigate to your Azure Data Explorer cluster in the **central-quickstart** resource group:

    :::image type="content" source="media/quick-export-data/azure-data-explorer-portal.png" alt-text="Screenshot of the Azure Data Explorer overview page.":::

1. Select **Ingest new data**.
1. On the **Ingest new data** page, select your cluster and the **iotcentraldata** database.
1. Select **Create new** to create a new table called *telemetry*.
1. Select **Event Hubs** as the source type.
1. Enter *IoT-Central-connection* as the data connection name.
1. Use the information in the following table to fill out the remainder of the form:

    | Field                   | Value                            |
    |-------------------------|----------------------------------|
    | Subscription            | Select your Azure subscription   |
    | Event Hub namespace     | Select your Event Hubs namespace |
    | Event Hub               | `centraltelemetry`               |
    | Consumer group          | `$Default`                       |
    | Data format             | JSON                             |
    | Compression             | None                             |
    | Event system properties | Leave blank                      |

1. Select **Edit schema**.
1. The **Schema** page shows a data preview of the messages in the Event Hubs queue.
1. Change the nested levels value to `3` to expand the JSON and show each telemetry value in its own column.
1. Select **Start ingestion**. Wait until the data ingestion is complete:

:::image type="content" source="media/quick-export-data/data-ingestion-complete.png" alt-text="Screenshot that shows competed data ingestion is Azure Data Explorer.":::

Leave this page open, you use it in the next section.

## Query exported data

Your Azure Data Explorer cluster is now continuously ingesting data from your IoT Central application. To query the data:

1. On the Azure Data Explorer page from the previous section, select the **Take 10** quick query. This query selects ten records from the **telemetry** table.
1. Replace the query with the following query:

    ```kusto
    ['telemetry'] 
    | where isnotnull(telemetry_magnetometer_x)
    | project Time=todatetime(enqueuedTime), deviceId, telemetry_magnetometer_x, telemetry_magnetometer_y, telemetry_magnetometer_z
    | render timechart 
    ```

    This query plots the magnetometer telemetry values from the phone app on a time-line.

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

To remove the Azure Data Explorer instance and Event Hubs namespace from your subscription and avoid being billed unnecessarily, delete the **central-quickstarts** resource group from the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceGroups).

## Next steps

In this quickstart, you learned how to continuously export data from IoT Central to another Azure service.

Now that you know now to export your data, the suggested next step is to:

> [!div class="nextstepaction"]
> [Build and manage a device template](howto-set-up-template.md).
