---
title: Detect anomalies in your manufacturing process
description: Learn how to detect anomalies in real time in your manufacturing process by using Azure IoT Operations, Azure Data Explorer, and Azure Managed Grafana.
author: dominicbetts
ms.author: dobett
ms.topic: tutorial
ms.date: 12/18/2023

#CustomerIntent: As an OT, I want to configure my Azure IoT Operations deployment to detect anomalies in real time in my manufacturing process.
---

# Tutorial: Detect anomalies in your manufacturing process in real time

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Contoso Bakery supplies baked goods to the Puget Sound area in the northwest United States. It has bakeries in Seattle, Redmond, and Tacoma.

Contoso Bakery wants to check the quality of its manufacturing process by detecting anomalies in real-time at their three bakeries. The quality of the process helps Contoso Bakery decide whether the baked products need more inspection because of process anomalies before they're shipped.

To achieve these goals, Contoso Bakery needs to:

- Collect data from multiple data sources.
- Contextualize the data.
- Use an analytics model at the edge to estimate the quality in near-real time.

Contoso Bakery also wants to reduce the amount of data at the edge and send the final data to the cloud for more analysis.

## Prerequisite

- Follow the steps in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md) to install Azure IoT operations on an Azure Arc-enabled Kubernetes cluster.

- An Azure Data Explorer cluster and database. Follow the steps in [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database?tabs=free) to create a free cluster and database to use in this tutorial. Name your database `bakery_ops`

- An Azure Managed Grafana workspace. You can use either the [Azure portal](../../managed-grafana/quickstart-managed-grafana-portal.md) or [Azure CLI](../../managed-grafana/quickstart-managed-grafana-cli.md) to create the workspace. Make a note of the endpoint URL, you need it later in this tutorial.

## Prepare your environment

Complete the following tasks to prepare your environment:

### Create a service principal

[!INCLUDE [create-service-principal-fabric](../includes/create-service-principal-fabric.md)]

### Grant access to your Azure Data Explorer database

To add the service principal to the database, navigate to the Azure Data Explorer portal and run the following query on your database. Replace the placeholders with the values you made a note of when you created the service principal:

```kusto
.add database ['bakery_ops'] admins ('aadapp=<app-id>;<tenant-id>');
```

<!-- TODO: Do we need admins or can we go for something more restrictive? https://learn.microsoft.com/en-us/azure/data-explorer/kusto/access-control/role-based-access-control -->

### Add a table to your database

To add a table to the `bakery_ops` database to store the anomaly data, navigate to the Azure Data Explorer portal and run the following query on your database:

```kusto
.create table edge_data  (
['AssetID']:string,
['Timestamp']:datetime,
['Name']:string,
['SerialNumber']:string,
['Status']:bool,
['Maintenance']:string,
['Location']:string,
['OperatingTime']:int,
['Humidity']:decimal,
['HumidityAnomalyFactor']:decimal,
['HumidityAnomaly']:bool,
['Temperature']:decimal,
['TemperatureAnomalyFactor']:decimal,
['TemperatureAnomaly']:bool,
['Vibration']:decimal,
['VibrationAnomalyFactor']:decimal,
['VibrationAnomaly']:bool
)
```

### Add a secret to your cluster

[!INCLUDE [add-cluster-secret](../includes/add-cluster-secret.md)]

## Assets and measurements

In this tutorial, you simulate the Contoso Bakery sites and production lines. Contoso Bakery has three types of asset on its production lines: ovens, mixers, and slicers:

:::image type="content" source="media/tutorial-anomaly-detection/contoso-bakery-production-lines.svg" alt-text="Diagram that shows the Contoso Bakery sites, production lines and assets." border="false":::

The production line assets generate multiple real-time measurements such as humidity, pressure, and temperature. This tutorial uses these simulated measurements to detect anomalies in the manufacturing process.

The simulation generates data and measurements from the following two sources for anomaly detection:

### Production line assets

_Production line assets_ have sensors that generate measurements as the baked goods are produced. Contoso Bakery production lines contain _oven_, _mixer_, and _slicer_ assets. As a product moves through each asset, the system captures measurements of values that can affect the final product. The system sends these measurements to Azure IoT MQ.

In this tutorial, the industrial data simulator simulates the assets that generate measurements. A [manifest](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/industrial-data-simulator/manifests/anomaly-detection/manifest.yml) file determines how the industrial data simulator generates the measurements.

The following snippet shows an example of the measurements the simulator sends to MQ:

```json
[
  {
    "DataSetWriterName": "Redmond_Oven_Redmond_Oven__asset_0",
    "Payload": {
      "Redmond_Oven__oven_asset_id__0": {
        "SourceTimestamp": "2023-12-08T17:06:31.840373756-08:00",
        "Value": "Red_O1"
      },
      "Redmond_Oven__oven_humidity__0": {
        "SourceTimestamp": "2023-12-08T17:06:31.84037286-08:00",
        "Value": 91.36737218207834
      },
      "Redmond_Oven__oven_machine_status__0": {
        "SourceTimestamp": "2023-12-08T17:06:31.840359971-08:00",
        "Value": 1
      },
      "Redmond_Oven__oven_operating_time__0": {
        "SourceTimestamp": "2023-12-08T17:06:31.840354666-08:00",
        "Value": 15
      },
      "Redmond_Oven__oven_pressure__0": {
        "SourceTimestamp": "2023-12-08T17:06:31.840366788-08:00",
        "Value": 9.98121471138974
      },
      "Redmond_Oven__oven_temperature__0": {
        "SourceTimestamp": "2023-12-08T17:06:31.840365282-08:00",
        "Value": 109.9060735569487
      },
      "Redmond_Oven__oven_vibration__0": {
        "SourceTimestamp": "2023-12-08T17:06:31.840370171-08:00",
        "Value": 54.64103415605061
      }
    },
    "SequenceNumber": 14,
    "Timestamp": "2023-12-08T17:06:31.840331844-08:00"
  }
]
```

### Enterprise resource planning data

_Enterprise resource planning data (ERP)_ is contextual data for the operations from an ERP application. This ERP data is accessible from an HTTP endpoint. The following snippet shows an example of the ERP data:

```json
[  
  {  
    "assetID": "Sea_O1",  
    "serialNumber": "SN001",  
    "name": "Contoso",  
    "site": "Seattle",  
    "maintenanceStatus": "Done"  
  },  
  {  
    "assetID": "Red_O1",  
    "serialNumber": "SN002",  
    "name": "Contoso",  
    "site": "Redmond",  
    "maintenanceStatus": "Upcoming"  
  }
]
```

## Set up the data simulator and HTTP call-out samples

Run the following command to deploy the industrial data simulator to your cluster with the configuration for this sample:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/industrial-data-simulator/manifests/anomaly-detection/manifest.yml
```

> [!CAUTION]
> The previous configuration adds an insecure **BrokerListener** to connect the simulator to the MQTT broker. Don't use this configuration in a production environment.

Run the following command to deploy the GRPC callout service that returns simulated ERP data to your cluster:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/http-grpc-callout/manifest.yml
```

## Deploy the anomaly detection custom workload

To deploy the anomaly detection custom workload pods to your Kubernetes cluster, run the following command:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/anomaly-detection/manifest.yml
```

The anomaly detection service applies the exponential weighted moving average (EWMA) method to detect anomalies in process variables such as temperature, humidity, and vibration. The EWMA method is a statistical technique for anomaly detection used to find anomalies in the mean of time series data. The EWMA method acts as a filter that gives more importance to recent data points and less importance to older data points.

By default, the anomaly detection service uses preset estimated control limits. The algorithm identifies an anomaly in the measurement stream when the control limit value of a data point lies outside the control limit band. You can modify the anomaly detection service configuration to use dynamically calculated control limits for anomalies. To learn more, see the [Anomaly Detection Server read me file](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/anomaly-detection/README.md).

## Transform and enrich the measurement data

<!-- TODO: Clarify here where the anomaly detection takes place -->

To transform the measurement data from your production lines into a structure that the anomaly detector can use, you use Data Processor pipelines.

In this tutorial, you create three pipelines:

- The _ERP reference data pipeline_ ingests ERP data from the HTTP endpoint and writes it to the _erp-data_ reference dataset.

- The _operations data processing pipeline_:
  - Ingests the operational sensor data from the assets.
  - Transforms the data and enriches it with data from the ERP dataset.
  - Writes the data to a separate MQTT topic.

- The _send data to Azure Data Explorer pipeline_ ingests the preprocessed data and writes it to Azure Data Explorer in the cloud.

### ERP reference data pipeline

To make the ERP data available to the enrichment stage in the operations data processing pipeline, you save the ERP data in a reference dataset.

To create the _erp-data_ dataset:

1. Navigate to the [Azure IoT Operations](https://iotoperations.azure.com) portal in your browser and sign in with your Microsoft Entra ID credentials.

1. Select **Get Started** and navigate to **Azure IoT Operations Instances** to see a list of the clusters you have access to.

1. Select your instance and then select **Data pipelines**. Here, you can author the Data Processor pipelines, create the reference data sets, and deploy them to your Azure Arc-enabled Kubernetes cluster.

1. Select **Reference datasets**. Then select **Create reference dataset**.

1. Enter the information from the following table and select **Create**. It can take up to a minute for the reference dataset to deploy to the Kubernetes cluster and show up in the portal.

    | Field         | Value             |
    |---------------|-------------------|
    | Name          | `erp-data`        |
    | Property Name | `ID`              |
    | Property Path | `.assetID`        |
    | Primary Key   | Yes               |

1. Select **Create**.

To create the ERP reference data pipeline that ingests the data from the HTTP endpoint and then saves it in the _erp-data_ dataset:

1. Navigate to **Data pipelines** and select **Create pipeline**.

1. Select the **HTTP Endpoint** input source, enter the information from the following table, and select **Apply**:

    | Field                      | Value                                   |
    |----------------------------|-----------------------------------------|
    | Name                       | `erp-input`                             |
    | Method                     | `GET`                                   |
    | URL                        | `http://callout-svc-http:3333/ref_data` |
    | Authentication             | `None`                                  |
    | Data format                | `JSON`                                  |
    | API Request – Request Body | `{}`                                    |
    | Request Interval           | `30m`                                   |

1. Select **Add stages** and then select **Delete** to delete the stage.

1. To connect the source and destination stages, select the red dot at the bottom of the source stage and drag it to the red dot at the top of the destination stage.

1. Select **Add destination** and then select **Reference datasets**.

1. Select **erp-data** in the **Dataset** field, select **Apply**.

1. Name your pipeline _erp-reference-data-pipeline_ and then select **Save** to save it.

You now have a pipeline that queries an HTTP endpoint every 30 minutes for ERP reference data to store in a reference dataset.

### OPCUA anomaly detection pipeline

Now you can build the OPCUA anomaly detection pipeline that:

- Ingests the sensor measurements from the production line assets.
- Detects any anomalies in the measurement data.

To create the _opcua-anomaly-pipeline_ pipeline:

1. Navigate to **Data pipelines** and select **Create pipeline**.

1. Select the title of the pipeline on the top left corner and rename it to _opcua-anomaly-pipeline_.

1. Select the **MQ** input source, enter the information from the following table, and select **Apply**:
  
    | Field           | Value                              |
    |-----------------|------------------------------------|
    | Broker          | `tls://aio-mq-dmqtt-frontend:8883` |
    | Topic           | `ContosoLLC/#`                     |
    | Data format     | `JSON`                             |

    The simulated production line assets send measurements to the MQ broker in the cluster. This input stage configuration subscribes to all the topics under the `ContosoLLC` topic in the MQ broker. This topic receives measurement data from the Redmond, Seattle, and Tacoma sites.

1. Add a transform stage after the source stage with the following JQ expressions and select **Apply**. This transform reorganizes the data and makes it easier to read:

    ```jq
    .payload[0].Payload |= with_entries(.value |= .Value) |
    .payload[0].Payload.sourceTimestamp = .systemProperties.timestamp |
    .payload |= .[0] |
    .payload.Payload.assetName = .payload.DataSetWriterName |
    del(.payload.DataSetWriterName) |
    .payload.Payload |= with_entries (
        if (.key | startswith("Tacoma")) then
            .key |= capture("^(Tacoma)_[a-zA-Z0-9]+__[a-zA-Z0-9]+_(?<name>.+)__0").name
        elif (.key | startswith("Seattle")) then
            .key |= capture("^(Seattle)_[a-zA-Z0-9]+__[a-zA-Z0-9]+_(?<name>.+)__0").name
        elif (.key | startswith("Redmond")) then
            .key |= capture("^(Redmond)_[a-zA-Z0-9]+__[a-zA-Z0-9]+_(?<name>.+)__0").name
        else
            .
        end
        )
    ```

1. Add an enrich stage after the source stage and select it. This stage enriches the measurements from the simulated production line assets with reference data from the `erp-data` dataset. This stage uses a condition to determine when to add the ERP data. Select **Add condition**, add the following information, and select **Apply**:

    | Field       | Value                      |
    |-------------|----------------------------|
    | Dataset     | `erp-data`                 |
    | Output path | `.payload.Payload.enrich`  |
    | Condition Operator   | `Key match`                 |
    | Condition Input path | `.payload.Payload.asset_id` |
    | Condition Property   | `ID`                        |

1. Add transform stage after the enrich stage with the following JQ expressions and select **Apply**. This transform stage reorganizes the data and makes it easier to read. These JQ expressions move the enrichment data to the same flat path as the real-time data to make it easier to export to Azure Data Explorer:

    ```jq
    .payload.Payload |= . + .enrich |
    .payload.Payload |= del(.enrich)
    ```

1. Add an HTTP call out stage after the transform stage and select it. This HTTP call out stage calls a custom module running in the Kubernetes cluster that exposes an HTTP API. The anomaly detection service detects anomalies in the time-series data and how large they are. To configure the stage, select **Add condition**, enter the information from the following table, and select **Apply**:

    | Field           | Value                                    |
    |-----------------|------------------------------------------|
    | Name            | `Call out HTTP - Anomaly`                |
    | Method          | `POST`                                   |
    | URL             | `http://anomaly-svc:3333/anomaly`        |
    | Authentication  | None                                     |
    | API Request - Data format  | `JSON`                        |
    | API Request - Path         | `.`                           |
    | API Response - Data format | `JSON`                        |
    | API Response - Path        | `.`                           |

1. Select the destination stage and then select **MQ**.

1. Add the following configuration, select **Apply**, and then select **Save** to save your pipeline:

    | Field       | Value                              |
    |-------------|------------------------------------|
    | Broker      | `tls://aio-mq-dmqtt-frontend:8883` |
    | Data format | `JSON`                             |
    | Path        | `.payload`                         |
    | Topic       | `processed-output`                 |

1. To save your pipeline, select **Save**.

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

The following example shows a message in the _processed-output_ topic:

```json
{
  "payload": {
    "assetId": "Sea_S1",
    "assetName": "Seattle_Slicer_Seattle_Slicer__asset_0",
    "humidity": 82.88225244364277,
    "humidityAnomaly": true,
    "humidityAnomalyFactor": 68.48042507750309,
    "machineStatus": 0,
    "maintainenceStatus": "Upcoming",
    "name": "Contoso",
    "operatingTime": 162,
    "serialNumber": "SN004",
    "site": "Seattle",
    "sourceTimestamp": "2023-12-09T01:08:58.852Z",
    "temperature": 92.97592214422629,
    "temperatureAnomaly": false,
    "temperatureAnomalyFactor": 84.1659459093868,
    "vibration": 54.79910570367032,
    "vibrationAnomaly": false,
    "vibrationAnomalyFactor": 52.154975528663186
  }
}
```

After it passes through the pipeline stages, the data:

- Is easier to read.
- Is better organized.
- Has no unnecessary fields.
- Is enriched with information such as the asset ID, company name, maintenance status, site, and serial number.

Now you can send your transformed and enriched measurement data to Microsoft Azure Data Explorer for further analysis and to create visualizations of the anomalies in your production processes.

### Send data to Azure Data Explorer

The next step is to create a Data Processor pipeline that sends the transformed and enriched measurement data to your Azure Data Explorer instance.

1. Navigate to **Data pipelines** and select **Create pipeline**.

1. Select the title of the pipeline on the top left corner and rename the pipeline to _adx_pipeline_.

1. Select the **MQ** input source, enter the information from the following table, and select **Apply**:

    | Field       | Value                            |
    |-------------|----------------------------------|
    | Name        | processed-mq-data                |
    | Broker      | tls://aio-mq-dmqtt-frontend:8883 |
    | Topic       | processed-output                 |
    | Data Format | JSON                             |

1. Select **Add stages** and then select **Delete** to delete the stage.

1. To connect the source and destination stages, select the red dot at the bottom of the source stage and drag it to the red dot at the top of the destination stage.

1. Select the destination stage and then select Azure Data Explorer.

1. Use the information in the following table to configure the destination stage, select **Apply**, and then select **Save** to save your pipeline:

    | Field       | Value                            |
    |-------------|----------------------------------|
    | Cluster URL | To find this value, navigate to your cluster at [Azure Data Explorer](https://dataexplorer.azure.com) and select **Edit connection**. |
    | Database    | `bakery_ops` |
    | Table       | `edge_data` |
    | Authentication | Service Principal |
    | Tenant ID   | The tenant ID you made a note of when you created the service principal. |
    | Client ID   | The app ID you made a note of when you created the service principal. |
    | Secret      | `AIOFabricSecret` |
    | Batching > Batch time | `5s` |
    | Batching > Batch path | `.payload.payload` |
    | Column > Name | `AssetID` |
    | Column > Path | `.assetId` |
    | Column > Name | `Timestamp` |
    | Column > Path | `.sourceTimestamp` |
    | Column > Name | `Name` |
    | Column > Path | `.assetName` |
    | Column > Name | `SerialNumber` |
    | Column > Path | `.serialNumber` |
    | Column > Name | `Status` |
    | Column > Path | `.machineStatus` |
    | Column > Name | `Maintenance` |
    | Column > Path | `.maintenanceStatus` |
    | Column > Name | `Location` |
    | Column > Path | `.site` |
    | Column > Name | `OperatingTime` |
    | Column > Path | `.operatingTime` |
    | Column > Name | `Humidity` |
    | Column > Path | `.humidity` |
    | Column > Name | `HumidityAnomalyFactor` |
    | Column > Path | `.humidityAnomalyFactor` |
    | Column > Name | `HumidityAnomaly` |
    | Column > Path | `.humidityAnomaly` |
    | Column > Name | `Temperature` |
    | Column > Path | `.temperature` |
    | Column > Name | `TemperatureAnomalyFactor` |
    | Column > Path | `.temperatureAnomalyFactor` |
    | Column > Name | `TemperatureAnomaly` |
    | Column > Path | `.temperatureAnomaly` |
    | Column > Name | `Vibration` |
    | Column > Path | `.vibration` |
    | Column > Name | `VibrationAnomalyFactor` |
    | Column > Path | `.vibrationAnomalyFactor` |
    | Column > Name | `VibrationAnomaly` |
    | Column > Path | `.vibrationAnomaly` |

1. Save the pipeline.

## Query your data

You can use Azure Data Explorer to query your data. Navigate to your [Azure Data Explorer cluster](https://dataexplorer.azure.com) and use the following command to confirm that the data is flowing from your pipeline:

```kusto
edge_data
| take 10
```

You can use Kusto queries in Azure Data Explorer to examine your data. The following example finds the asset with the highest proportion of anomalous data points compared to the total data points. Queries like these can help with predictive maintenance tasks:

```kusto
edge_data
| summarize TotalCount = count(), AnomalyCount = countif(VibrationAnomaly == true) by AssetID
| extend AnomalyPercentage = todouble(AnomalyCount) / todouble(TotalCount) * 100
| top 1 by AnomalyPercentage desc
| project AssetID
```

To learn more, see [Anomaly detection and forecasting](/azure/data-explorer/kusto/query/anomaly-detection). You can use the time series analysis functionality in Azure Data Explorer for tasks such as root cause analysis and forecasting.

## Visualize anomalies and process data

To visualize anomalies and process data, you can use Azure Managed Grafana. Use the Azure Managed Grafana instance that you created previously. Create a new dashboard to show the data from Azure Data Explorer:

1. In the Azure portal, navigate to your Azure Managed Grafana instance.

1. Select **Add your first data source** to connect your Grafana instance to Azure Data Explorer.

1. In **Add source**, search for and select **Azure Data Explorer Datasource**.

1. In the **Connection Details** section, add your Azure Data Explorer cluster URI.

1. In the **Authentication** section, select **App Registration** and enter your service principal details. You made a note of these values when you created your service principal.

1. To test the connection to the Azure Data Explorer database, select **Save & test**.

Now that your Grafana instance is connected to your Azure Data Explorer database, you can build a dashboard:

1. On the Grafana homepage, select **Home > Dashboards**.

1. Then select **New > Import**.

1. In another browser tab, navigate to [https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/dashboard/grafanaPredictiveMaintenance.json](https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/dashboard/grafanaPredictiveMaintenance.json). Copy the JSON definition of the dashboard.

1. Paste the dashboard JSON definition into the **Import via panel definition** text box and then select **Load**.

1. On the **Import dashboard** page, in the **Azure Data Explorer Datasource** drop-down list, select the Azure Data Explorer data source you created previously. Then select **Import**.

1. To view data on the dashboard, use the **Asset** drop-down list to select an asset and make sure that the **Time range** is set to **Last 30 minutes**.

:::image type="content" source="media/tutorial-anomaly-detection/grafana-filters.png" alt-text="A screenshot that shows the Grafana dashboard with filters applied.":::

> [!NOTE]
> This dashboard uses the variables feature to create the drop-down list of assets.

The sample dashboard has three sections:

:::image type="content" source="media/tutorial-anomaly-detection/grafana-sections.png" alt-text="A screenshot that shows the three sections of the Grafana dashboard.":::

The **Asset View** section displays the process variables, anomalies, number of anomalies, and the ratio of anomalies of the selected asset.

This view also displays the name of the asset that has the highest number of anomalies ratio within a given time period. This asset should be either inspected or replaced as soon as possible.

This view also displays the name of the asset that has the highest number of vibration anomalies ratio within a given time period. The Contoso Bakery plant maintenance crew should prioritize this asset for predictive maintenance.

The industrial data simulator generates deliberately noisy data for demonstration purposes and the anomaly detection is sensitive. Therefore, you see lots of anomalies. You can configure the sensitivity of the anomaly detection service and the noisiness of the industrial data simulator by editing their manifest files.

The **Vibration Analysis** section of the dashboard charts the real-time vibrations coming from moving assets such as slicers and mixers. It also charts the average of the anomaly detection factor metric that lets operators know when the vibration anomalies are over the set limit. This information helps operators identify assets that require predictive maintenance. This section is valuable to the plant operators as it helps them monitor asset health and take necessary actions to prevent potential downtime or asset damage.

The **Oven Process Parameters** section of the dashboard lets you visualize the current oven process parameters in the three Contoso Bakery locations. It charts the process parameters over a selected time period and shows temperature and humidity anomalies. You can use this anomaly data to predict abnormal oven process parameters that could result in a bad product. This section is valuable to the plant operators of the plant as it helps them to monitor the health of the ovens and take any necessary actions to preserve the quality of the products.

You can also create your own dashboard with Kusto Queries.

## Summary

This tutorial shows you how to do anomaly detection with the Contos Bakery manufacturing operations sample. You learned how to:

- Set up Azure IoT Operations on an Arc-enabled Kubernetes cluster.
- Use Data Processor to transform and enrich the measurement data.
- Use Data Processor to call a custom analytics service that detects anomalies in the measurement data at near real time.
- Create an Azure Data Explorer cluster.
- Deploy a custom workload for anomaly detection.
- Send data from the edge to Azure Data Explorer.
- Use Azure Managed Grafana to visualize the anomalies and data from your industrial process.

## Related content

- [Tutorial: Calculate overall equipment effectiveness](tutorial-overall-equipment-effectiveness.md)
- [Tutorial: Configure MQTT bridge between IoT MQ and Azure Event Grid](../connect-to-cloud/tutorial-connect-event-grid.md)
- [Build event-driven apps with Dapr](../develop/tutorial-event-driven-with-dapr.md)
- [Upload MQTT data to Microsoft Fabric lakehouse](tutorial-upload-mqtt-lakehouse.md)
- [Build a real-time dashboard in Microsoft Fabric with MQTT data](tutorial-real-time-dashboard-fabric.md)
