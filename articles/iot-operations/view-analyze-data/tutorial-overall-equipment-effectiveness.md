---
title: Calculate overall equipment effectiveness
description: Learn how to calculate overall equipment and effectiveness and power consumption for your manufacturing process.
author: dominicbetts
ms.author: dobett
ms.topic: tutorial
ms.date: 02/01/2024

#CustomerIntent: As an OT, I want to configure my Azure IoT Operations deployment to calculate overall equipment effectiveness and power consumption for my manufacturing process.
---

# Tutorial: Calculate overall equipment effectiveness

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Contoso supplies baked goods to the Puget Sound area in the northwest United States. It has bakeries in Seattle and Redmond.

Contoso wants to measure the overall equipment effectiveness (OEE) and power consumption of its production lines. Contoso plans to use these measurements to identify ineffective areas in the manufacturing process, and use the insights to improve the bottom line for the business.

To achieve these goals, Contoso needs to:

- Gather data from multiple data sources.
- Down sample, transform, and join the data at the edge.
- Write the clean data to the cloud for viewing on dashboards and for analysis.

## Prerequisites

- Follow the steps in [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md) to install Azure IoT operations Preview on an Azure Arc-enabled Kubernetes cluster.

- A Microsoft Fabric subscription. You can sign up for a free [Microsoft Fabric trial capacity](/fabric/get-started/fabric-trial). In your Microsoft Fabric subscription, ensure that the following settings are enabled for your tenant:

  - [Allow service principals to use Power BI APIs](/fabric/admin/service-admin-portal-developer#allow-service-principals-to-use-power-bi-apis)
  - [Users can access data stored in OneLake with apps external to Fabric](/fabric/admin/service-admin-portal-onelake#users-can-access-data-stored-in-onelake-with-apps-external-to-fabric)

  To learn more, see [Microsoft Fabric > About tenant settings](/fabric/admin/tenant-settings-index).

- Download and sign into [Power BI Desktop.](/power-bi/fundamentals/desktop-what-is-desktop/) <!-- TODO: Clarify if we need desktop? -->

## Prepare your environment

Complete the following tasks to prepare your environment:

### Create a service principal

[!INCLUDE [create-service-principal-fabric](../includes/create-service-principal-fabric.md)]

### Grant access to your Microsoft Fabric workspace

[!INCLUDE [grant-service-principal-fabric-access](../includes/grant-service-principal-fabric-access.md)]

### Create a lakehouse

[!INCLUDE [create-lakehouse](../includes/create-lakehouse.md)]

Make a note of your workspace ID and lakehouse ID, you need them later. You can find these values in the URL that you use to access your lakehouse:

`https://msit.powerbi.com/groups/<your-workspace-ID>/lakehouses/<your-lakehouse-ID>?experience=data-engineering`

### Add a secret to your cluster

To access the lakehouse from a Data Processor pipeline, you need to enable your cluster to access the service principal details you created earlier. You need to configure your Azure Key Vault with the service principal details so that the cluster can retrieve them.

[!INCLUDE [add-cluster-secret](../includes/add-cluster-secret.md)]

## Understand the scenario and data

In this tutorial, you simulate the Redmond and Seattle sites. Each site has two production lines producing baked goods:

:::image type="content" source="media/tutorial-overall-equipment-effectiveness/contoso-production-lines.png" alt-text="Diagram that shows the Contoso production lines." border="false" lightbox="media/tutorial-overall-equipment-effectiveness/contoso-production-lines.png":::

To calculate OEE for Contoso, you need data from three data sources: production line assets, production data, and operator data. The following sections provide detail on each of these.

### Production line assets

_Production line assets_ have sensors that generate measurements as the baked goods are produced. Contoso production lines contain _assembly_, _test_, and _packaging_ assets. As a product moves through each asset, the system captures measurements of values that can affect the final product. The system sends these measurements to Azure IoT MQ Preview.

In this tutorial, the industrial data simulator simulates the assets that generate measurements. A [manifest](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/industrial-data-simulator/manifests/oee/manifest.yml) file determines how the industrial data simulator generates the measurements.

The following snippet shows an example of the measurements the simulator sends to MQ:

```json
[
  {
    "DataSetWriterName": "SLine1_1_SLine1_1__asset_0",
    "Payload": {
      "SLine1_1__assembly_assetID__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380769575-08:00",
        "Value": "Line2_Assembly"
      },
      "SLine1_1__assembly_energyconsumed__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380791333-08:00",
        "Value": 9.183789847893975
      },
      "SLine1_1__assembly_humidity__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380757125-08:00",
        "Value": 0
      },
      "SLine1_1__assembly_lastcycletime__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380716706-08:00",
        "Value": 4936
      },
      "SLine1_1__assembly_machinestatus__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380723952-08:00",
        "Value": 1
      },
      "SLine1_1__assembly_plannedProductionTime__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380840281-08:00",
        "Value": 14048
      },
      "SLine1_1__assembly_pressure__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380744766-08:00",
        "Value": 0
      },
      "SLine1_1__assembly_qualityStatus__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380720317-08:00",
        "Value": 1
      },
      "SLine1_1__assembly_sound__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380766621-08:00",
        "Value": 118.33789847893975
      },
      "SLine1_1__assembly_speed__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.38075408-08:00",
        "Value": 2.4584474619734937
      },
      "SLine1_1__assembly_temperature__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380731522-08:00",
        "Value": 109.16894923946987
      },
      "SLine1_1__assembly_totalOperatingTime__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380831078-08:00",
        "Value": 14038
      },
      "SLine1_1__assembly_vibration__0": {
        "SourceTimestamp": "2023-12-03T16:54:47.380749267-08:00",
        "Value": 54.584474619734934
      }
    },
    "SequenceNumber": 11047,
    "Timestamp": "2023-12-03T16:54:47.380696886-08:00"
  }
]
```

### Production data

_Production data_ is product-related data, such as the type of baked good and the customer. Production data is accessible from an HTTP endpoint.

Each production line produces goods for a specific customer. The following snippet shows an example of production data:

```json
[
  {
    "Line": "Line1",
    "Shift": 1,
    "ProductId": "Bagel",
    "Site": "Redmond",
    "Customer": "Contoso"
  },
  {
    "Line": "Line2",
    "Shift": 1,
    "ProductId": "Donut",
    "Site": "Redmond",
    "Customer": "Contoso"
  }
]
```

### Operator data

_Operator data_ is operator-related data, such as the name of operator, the shift, and any performance targets. Operator data is accessible from an HTTP endpoint.

There are three shifts in each 24-hour facility. An operator supervises each shift. Each operator has performance targets based on their past performance. The following snippet shows an example of production data:

```json
[
  {
    "Shift": 0,
    "Operator": "Bob",
    "PerformanceTarget": 45,
    "PackagedProductTarget": 12960
  },
  {
    "Shift": 1,
    "Operator": "Anne",
    "PerformanceTarget": 60,
    "PackagedProductTarget": 17280
  },
  {
    "Shift": 2,
    "Operator": "Cameron",
    "PerformanceTarget": 50,
    "PackagedProductTarget": 14400
  }
]

```

## Set up the data simulator and HTTP call-out samples

Run the following command to deploy the industrial data simulator to your cluster with the configuration for this sample:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/industrial-data-simulator/manifests/oee/manifest.yml
```

> [!CAUTION]
> The previous configuration adds an insecure **BrokerListener** to connect the simulator to the MQTT broker. Don't use this configuration in a production environment.

Run the following command to deploy the gRPC callout service that returns simulated production and operator data to your cluster:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/http-grpc-callout/manifest.yml
```

Run the following command to deploy the shift calculation simulator to your cluster:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/http-grpc-shift-calculation/manifest.yml
```

## Transform and enrich the data

To transform the measurement data from the three data sources at the edge and send it to Microsoft Fabric where you can calculate OEE, you use Data Processor pipelines.

In this tutorial, you create three pipelines:

- The _production data reference pipeline_ ingests production data from the HTTP endpoint and writes it to the _production-data_ reference dataset.

- The _operation data reference pipeline_ ingests operations data from the HTTP endpoint and writes it to the _operation-data_ reference dataset.

- The _process pipeline_ ingests the sensor measurements from the production line assets, and transforms and enriches the measurement data with data from the two reference datasets. The pipeline then writes the transformed and enriched data to a Microsoft Fabric lakehouse.

### Production data reference pipeline

To make the production data available to the enrichment stage in the process pipeline, you save the production data in a reference dataset.

To create the _production-data_ dataset:

1. Navigate to the [Azure IoT Operations (preview)](https://iotoperations.azure.com) portal in your browser and sign in with your Microsoft Entra ID credentials.

1. Select **Get started** and navigate to **Azure IoT Operations instances** to see a list of the clusters you have access to.

1. Select your instance and then select **Data pipelines**. Here, you can author the Data Processor pipelines, create the reference data sets, and deploy them to your Azure Arc-enabled Kubernetes cluster.

1. Select **Reference datasets**. Then select **Create reference dataset**.

1. Enter the information from the following table, which includes adding one property.

    | Field           | Value             |
    |-----------------|-------------------|
    | Name            | `production-data` |
    | Property Name 1 | `Line`            |
    | Property Path 1 | `.Line`           |
    | Primary Key 1   | `Yes`             |

1. Select **Create**. It can take up to a minute for the reference dataset to deploy to the Kubernetes cluster and show up in the portal.

To create the _production-data-reference_ pipeline that ingests the data from the HTTP endpoint and then saves it in the _production-data_ dataset:

1. Navigate back to **Data pipelines** and select **Create pipeline**.

1. Select the title of the pipeline on the top left corner, rename it to _production-data-reference_, and **Apply** the change.

1. In the pipeline diagram, select **Configure source** and then select **HTTP Endpoint**. Use the information from the following table to configure it:

    | Field                      | Value                                         |
    |----------------------------|-----------------------------------------------|
    | Name                       | `HTTP Endpoint - production data`             |
    | Method                     | `GET`                                         |
    | URL                        | `http://callout-svc-http:3333/productionData` |
    | Authentication             | `None`                                        |
    | Data format                | `JSON`                                        |
    | API Request – Request Body | `{}`                                          |
    | Request Interval           | `1m`                                          |

    Select **Apply**.

1. Select **Add stages** and then select **Delete** to delete the middle stage.

1. To connect the source and destination stages, select the red dot at the bottom of the source stage and drag it to the red dot at the top of the destination stage.

1. Select **Add destination** and then select **Reference datasets**.

1. Name the stage _Reference dataset - production-data_.

1. Select **production-data** in the **Dataset** field, and select **Apply**.

1. Select **Save** to save the pipeline.

You now have a pipeline that queries an HTTP endpoint for production reference data to store in a reference dataset.

### Operations data reference pipeline

To make the operations data available to the enrichment stage in the process pipeline, you save the production data in a reference dataset.

To create the _operations-data_ dataset:

1. In the [Azure IoT Operations (preview)](https://iotoperations.azure.com) portal, make sure you're still on the **Data pipelines** page.

1. Select **Reference datasets**. Then select **Create reference dataset**.

1. Enter the information from the following table, which includes adding one property.

    | Field           | Value             |
    |-----------------|-------------------|
    | Name            | `operations-data` |
    | Property Name 1 | `Shift`           |
    | Property Path 1 | `.Shift`          |
    | Primary Key 1   | `Yes`             |

1. Select **Create**. It can take up to a minute for the reference dataset to deploy to the Kubernetes cluster and show up in the portal.

To create the _operations-data-reference_ pipeline that ingests the data from the HTTP endpoint and then saves it in the _operations-data_ dataset:

1. Navigate back to **Data pipelines** and select **Create pipeline**.

1. Select the title of the pipeline on the top left corner, rename it to _operations-data-reference_, and **Apply** the change.

1. In the pipeline diagram, select **Configure source** and then select **HTTP Endpoint**. Use the information from the following table to configure it:

    | Field                      | Value                                         |
    |----------------------------|-----------------------------------------------|
    | Name                       | `HTTP Endpoint - operations data`             |
    | Method                     | `GET`                                         |
    | URL                        | `http://callout-svc-http:3333/operatorData`   |
    | Authentication             | `None`                                        |
    | Data format                | `JSON`                                        |
    | API Request – Request Body | `{}`                                          |
    | Request Interval           | `1m`                                          |

    Select **Apply**.

1. Select **Add stages** and then select **Delete** to delete the middle stage.

1. To connect the source and destination stages, select the red dot at the bottom of the source stage and drag it to the red dot at the top of the destination stage.

1. Select **Add destination** and then select **Reference datasets**.

1. Name the stage _Reference dataset - operations-data_.

1. Select **operations-data** in the **Dataset** field, select **Apply**.

1. Select **Save** to save the pipeline.

You now have a pipeline that queries an HTTP endpoint for operations reference data to store in a reference dataset.

### Process pipeline

Now you can build the process pipeline that:

- Ingests the sensor measurements from the production line assets.
- Transforms and enriches the sensor measurements with data from the two reference datasets.

To create the _oee-process-pipeline_ pipeline:

1. Navigate back to **Data pipelines** and select **Create pipeline**.

1. Select the title of the pipeline on the top left corner, rename it to _oee-process-pipeline_, and **Apply** the change.

1. Use the **Sources** tab on the left to select **MQ** as the source, and select the source from the pipeline diagram to open its configuration. Use the information from the following table to configure it:
  
    | Field           | Value                              |
    |-----------------|------------------------------------|
    | Name            | `MQ - Contoso/#`                   |
    | Broker          | `tls://aio-mq-dmqtt-frontend:8883` |
    | Topic           | `Contoso/#`                        |
    | Data format     | `JSON`                             |

    Select **Apply**. The simulated production line assets send measurements to the MQ broker in the cluster. This input stage configuration subscribes to all the topics under the `Contoso` topic in the MQ broker.

1. Use the **Stages** list on the left to add a **Transform** stage after the source stage. Name the stage _Transform - flatten message_ and add the following JQ expressions. This transform creates a flat, readable view of the message and extracts the `Line` and `Site` information from the topic:

    ```jq
    .payload[0].Payload |= with_entries(.value |= .Value) |
    .payload |= .[0] |
    .payload.Payload |= with_entries (
        if (.key | startswith("SLine")) then
            .key |= capture("^SLine[0-9]+_[0-9]+__[a-zA-Z0-9]+_(?<name>.+)__0").name
        elif (.key | startswith("RLine")) then
            .key |= capture("^RLine[0-9]+_[0-9]+__[a-zA-Z0-9]+_(?<name>.+)__0").name
        else
            .
        end
    ) |
    .payload.Payload.Line = (.topic | split("/")[2]) |
    .payload.Payload.Site = (.topic | split("/")[1])
    ```

    Select **Apply**.

1. Use the **Stages** list on the left to add an **Aggregate** stage after the transform stage and select it. Name the stage _Aggregate - down sample measurements_. In this pipeline, you use the aggregate stage to down sample the measurements from the production line assets. You configure the stage to aggregate data for 10 seconds. Then for the relevant data, calculate the average or pick the latest value. Select the **Advanced** tab in the aggregate stage and paste in the following configuration:

    ```json
    {
      "displayName": "Aggregate - 1b84f9",
      "type": "processor/aggregate@v1",
      "next": [
          "output"
      ],
      "viewOptions": {
          "position": {
              "x": -624,
              "y": 304
          }
      },
      "window": {
          "type": "tumbling",
          "size": "10s"
      },
      "properties": [
          {
              "function": "last",
              "inputPath": ".payload.Payload.assetID",
              "outputPath": ".payload.AssetID"
          },
          {
              "function": "count",
              "inputPath": ".",
              "outputPath": ".payload.TotalGoodsProduced"
          },
          {
              "function": "average",
              "inputPath": ".payload.Payload.temperature",
              "outputPath": ".payload.TemperatureAvg"
          },
          {
              "function": "average",
              "inputPath": ".payload.Payload.energyconsumed",
              "outputPath": ".payload.EnergyConsumedAvg"
          },
          {
              "function": "last",
              "inputPath": ".payload.Payload.lastcycletime",
              "outputPath": ".payload.LastCycletime"
          },
          {
              "function": "average",
              "inputPath": ".payload.Payload.pressure",
              "outputPath": ".payload.PressureAvg"
          },
          {
              "function": "average",
              "inputPath": ".payload.Payload.vibration",
              "outputPath": ".payload.VibrationAvg"
          },
          {
              "function": "average",
              "inputPath": ".payload.Payload.humidity",
              "outputPath": ".payload.HumidityAvg"
          },
          {
              "function": "average",
              "inputPath": ".payload.Payload.speed",
              "outputPath": ".payload.SpeedAvg"
          },
          {
              "function": "last",
              "inputPath": ".systemProperties.timestamp",
              "outputPath": ".payload.timestamp"
          },
          {
              "function": "last",
              "inputPath": ".topic",
              "outputPath": ".topic"
          },
          {
              "function": "last",
              "inputPath": ".payload.Payload.totalOperatingTime",
              "outputPath": ".payload.TotalOperatingTime"
          },
          {
              "function": "last",
              "inputPath": ".payload.Payload.Line",
              "outputPath": ".payload.Line"
          },
          {
              "function": "last",
              "inputPath": ".payload.Payload.plannedProductionTime",
              "outputPath": ".payload.PlannedProductionTime"
          },
          {
              "function": "sum",
              "inputPath": ".payload.Payload.qualityStatus",
              "outputPath": ".payload.TotalGoodUnitsProduced"
          },
          {
              "function": "last",
              "inputPath": ".payload.Payload.Site",
              "outputPath": ".payload.Site"
          }
      ]
    }
    ```

    Select **Apply**.

1. Use the **Stages** list on the left to add a **Call out HTTP** stage after the aggregate stage and select it. This HTTP call out stage calls a custom module running in the Kubernetes cluster that exposes an HTTP API. The module calculates the shift based on the current time. To configure the stage, select **Add condition** and enter the information from the following table:

    | Field           | Value                              |
    |-----------------|------------------------------------|
    | Name            | `Call out HTTP - Fetch shift data` |
    | Method          | `POST`                             |
    | URL             | `http://shift-svc-http:3333`       |
    | Authentication  | `None`                             |
    | API Request - Data format  | `JSON`                  |
    | API Request - Path         | `.payload`              |
    | API Response - Data format | `JSON`                  |
    | API Response - Path        | `.payload`              |

    Select **Apply**.

1. Use the **Stages** list on the left to add an **Enrich** stage after the HTTP call out stage and select it. This stage enriches the measurements from the simulated production line assets with reference data from the _operations-data_ dataset. This stage uses a condition to determine when to add the operations data. Open the **Add condition** options and add the following information:

    | Field           | Value                              |
    |-----------------|------------------------------------|
    | Name            | `Enrich - Operations data`         |
    | Dataset         | `operations-data`                  |
    | Output path     | `.payload.operatorData`            |
    | Input path      | `.payload.shift`                   |
    | Property        | `Shift`                            |
    | Operator        | `Key match`                        |

    Select **Apply**.

1. Use the **Stages** list on the left to add another **Enrich** stage after the first enrich stage and select it. This stage enriches the measurements from the simulated production line assets with reference data from the _production-data_ dataset. Open the **Add condition** options and add the following information:

    | Field           | Value                              |
    |-----------------|------------------------------------|
    | Name            | `Enrich - Production data`         |
    | Dataset         | `production-data`                  |
    | Output path     | `.payload.productionData`          |
    | Input path      | `.payload.Line`                    |
    | Property        | `Line`                             |
    | Operator        | `Key match`                        |

    Select **Apply**.

1. Use the **Stages** list on the left to add another **Transform** stage after the enrich stage and select it. Name the stage _Transform - flatten enrichment data_. Add the following JQ expressions:

    ```json
    .payload |= . + .operatorData |
    .payload |= . + .productionData |
    .payload |= del(.operatorData) |
    .payload |= del(.productionData)
    ```

    Select **Apply**. These JQ expressions move the enrichment data to the same flat path as the real-time data. This structure makes it easy to export the data to Microsoft Fabric.

1. Use the **Destinations** tab on the left to select **MQ** for the output stage, and select the stage. Add the following configuration:

    | Field       | Value                              |
    |-------------|------------------------------------|
    | Name        | `MQ - Oee-processed-output`        |
    | Broker      | `tls://aio-mq-dmqtt-frontend:8883` |
    | Topic       | `Oee-processed-output`             |
    | Data format | `JSON`                             |
    | Path        | `.payload`                         |

    Select **Apply**.

1. Review your pipeline diagram to make sure all the stages are present and connected. It should look like the following:

    :::image type="content" source="media/tutorial-overall-equipment-effectiveness/oee-process-pipeline.png" alt-text="Screenshot that shows the oee-process-pipeline in the Azure IoT Operations (preview) portal." lightbox="media/tutorial-overall-equipment-effectiveness/oee-process-pipeline.png":::

1. To save your pipeline, select **Save**. It may take a few minutes for the pipeline to deploy to your cluster, so make sure it's finished before you proceed.

### View processed data

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

Look for **Oee-processed-output** in the list of topics and verify that it's receiving messages. The following example shows a message in the _Oee-processed-output_ topic:

```json
{
  "payload": {
    "AssetID": "Line2_Assembly",
    "Customer": "Contoso",
    "EnergyConsumedAvg": 7.749793095563527,
    "HumidityAvg": 0,
    "LastCycletime": 4989,
    "Line": "Line2",
    "Manufacturer": "Northwind",
    "Operator": "Anne",
    "PackagedProductTarget": 17280,
    "PerformanceTarget": 60,
    "PlannedProductionTime": 15100,
    "PressureAvg": 0,
    "ProductId": "Donut",
    "Shift": 2,
    "Site": "Seattle",
    "SpeedAvg": 2.099948273890882,
    "TemperatureAvg": 101.99896547781763,
    "TotalGoodUnitsProduced": 3,
    "TotalGoodsProduced": 10,
    "TotalOperatingTime": 14799,
    "VibrationAvg": 50.99948273890882,
    "shift": 2,
    "timestamp": "2023-12-04T00:55:39.410Z"
  },
  "topic": "Contoso/Seattle/Line2/Assembly/SLine2_1"
}
```

Now that the data has passed through the pipeline stages, the data:

- Is easier to read.
- Is better organized.
- Has no unnecessary fields.
- Is enriched with information such as the manufacturer, customer, product ID, operator, and shift.

Next, you can send your transformed and enriched measurement data to Microsoft Fabric for further analysis and to create visualizations of the OEE of your production lines.

## Send data to Microsoft Fabric

The next step is to create a Data Processor pipeline that sends the transformed and enriched measurement data to your Microsoft Fabric lakehouse.

1. Back in the [Azure IoT Operations (preview)](https://iotoperations.azure.com) portal, navigate to **Data pipelines** and select **Create pipeline**.

1. Select the title of the pipeline on the top left corner, rename it to _oee-fabric_, and **Apply** the change.

1. In the pipeline diagram, select **Configure source** and then select **MQ**. Use the information from the following table to configure it:

    | Field       | Value                              |
    |-------------|------------------------------------|
    | Name        | `MQ - Oee-processed-output`        |
    | Broker      | `tls://aio-mq-dmqtt-frontend:8883` |
    | Topic       | `Oee-processed-output`             |
    | Data Format | `JSON`                             |

    Select **Apply**.

1. Select **Add stages** and then select **Delete** to delete the middle stage.

1. To connect the source and destination stages, select the red dot at the bottom of the source stage and drag it to the red dot at the top of the destination stage.

1. Select **Add destination** and then select **Fabric Lakehouse**. Select the **Advanced** tab and then paste in the following configuration:

    ```json
    {
      "displayName": "Fabric Lakehouse - OEE table",
      "type": "output/fabric@v1",
      "viewOptions": {
        "position": {
          "x": 0,
          "y": 432
        }
      },
      "workspace": "",
      "lakehouse": "",
      "table": "OEE",
      "columns": [
        {
          "name": "Timestamp",
          "type": "timestamp",
          "path": ".timestamp"
        },
        {
          "name": "AssetID",
          "type": "string"
        },
        {
          "name": "Line",
          "type": "string"
        },
        {
          "name": "Operator",
          "type": "string"
        },
        {
          "name": "PackagedProductTarget",
          "type": "integer"
        },
        {
          "name": "PerformanceTarget",
          "type": "integer"
        },
        {
          "name": "ProductId",
          "type": "string"
        },
        {
          "name": "Shift",
          "type": "integer"
        },
        {
          "name": "Site",
          "type": "string"
        },
        {
          "name": "Customer",
          "type": "string"
        },
        {
          "name": "AverageEnergy",
          "type": "double",
          "path": ".EnergyConsumedAvg"
        },
        {
          "name": "AverageHumidity",
          "type": "double",
          "path": ".HumidityAvg"
        },
        {
          "name": "PlannedProductionTime",
          "type": "integer",
          "path": ".PlannedProductionTime"
        },
        {
          "name": "AveragePressure",
          "type": "double",
          "path": ".PressureAvg"
        },
        {
          "name": "AverageSpeed",
          "type": "double",
          "path": ".SpeedAvg"
        },
        {
          "name": "AverageTemperature",
          "type": "double",
          "path": ".TemperatureAvg"
        },
        {
          "name": "TotalGoodUnitsProduced",
          "type": "integer",
          "path": ".TotalGoodUnitsProduced"
        },
        {
          "name": "TotalUnitsProduced",
          "type": "integer",
          "path": ".TotalGoodsProduced"
        },
        {
          "name": "TotalOperatingTime",
          "type": "integer",
          "path": ".TotalOperatingTime"
        },
        {
          "name": "Manufacturer",
          "type": "string"
        }
      ],
      "authentication": {
        "type": "servicePrincipal",
        "tenantId": "",
        "clientId": "",
        "clientSecret": ""
      },
      "batch": {
        "path": ".payload"
      }
    }
    ```

1. Then navigate to the **Basic** tag and fill in the following fields by using the information you made a note of previously:

    | Field | Value |
    |-------|-------|
    | Tenant ID | The tenant ID you made a note of when you created the service principal. |
    | Client ID | The app ID you made a note of when you created the service principal. |
    | Secret    | `AIOFabricSecret` |
    | Workspace | The Microsoft Fabric workspace ID you made a note of when you created the lakehouse. |
    | Lakehouse | The Microsoft Fabric lakehouse ID you made a note of when you created the lakehouse. |

    Select **Apply**.

1. To save your pipeline, select **Save**. It may take a few minutes for the pipeline to deploy to your cluster, so make sure it's finished before you proceed.

## View your measurement data in Microsoft Fabric

In [Microsoft Fabric](https://msit.powerbi.com/groups/me/list?experience=power-bi), navigate to your lakehouse and select the _OEE_ table. After a few minutes of receiving data from the pipeline, it looks like the following example:

:::image type="content" source="media/tutorial-overall-equipment-effectiveness/lakehouse-oee-table.png" alt-text="Screenshot that shows the OEE table in Microsoft Fabric lakehouse." lightbox="media/tutorial-overall-equipment-effectiveness/lakehouse-oee-table.png":::

## Use Power BI to calculate OEE

1. Open Power BI Desktop and sign in.

1. Select **Get data** followed by **Microsoft Fabric**:

    :::image type="content" source="media/tutorial-overall-equipment-effectiveness/power-bi-get-lakehouse-data.png" alt-text="Screenshot that shows how to access lakehouse data in Power BI." lightbox="media/tutorial-overall-equipment-effectiveness/power-bi-get-lakehouse-data.png":::

1. Select **Lakehouses** and then select **Connect**.

1. Select your lakehouse, and then **Connect to SQL endpoint**:

    :::image type="content" source="media/tutorial-overall-equipment-effectiveness/power-bi-connect-sql-endpoint.png" alt-text="Screenshot that shows how to access SQL endpoint in Power BI." lightbox="media/tutorial-overall-equipment-effectiveness/power-bi-connect-sql-endpoint.png":::

1. Check the box next to the **OEE** table and then select **Load**.

1. Select **DirectQuery** as the connection setting and then select **OK**.

You can now create measurements and tiles to display OEE for your production lines by using formulae such as:

- `OEE = Availability*Performance*Quality`
- `Performance = TotalUnitsProduced/10`
- `Availability = TotalOperatingTime/PlannedProductionTime`
- `Quality = TotalGoodUnitsProduced/TotalUnitsProduced`

The performance calculation above uses a factor of 10 in the calculation. This factor is specific to Contoso bakery and uses an estimate of the ideal cycle time for the production line. To learn more, see [Overall equipment effectiveness](https://wikipedia.org/wiki/Overall_equipment_effectiveness).

Follow these steps to create some measures and use them to build a visualization dashboard.

1. From the top navigation plane, select **New measure**. Paste the following data analysis expression into the main text field:

    ```dax
    OEE = DIVIDE(AVERAGE(OEE[TotalUnitsProduced]),10) * DIVIDE(AVERAGE(OEE[TotalOperatingTime]),AVERAGE(OEE[PlannedProductionTime])) * (DIVIDE(AVERAGE(OEE[TotalGoodUnitsProduced]), AVERAGE(OEE[TotalUnitsProduced])))
    ```

1. Change the measure **Name** to _OEE_, the **Format** to _Percentage_, and the number of decimals to `2`.

1. Select the checkmark to save your measurement:

    :::image type="content" source="media/tutorial-overall-equipment-effectiveness/oee-measurement.png" alt-text="Screenshot that shows how to save a Power BI measurement.":::

    The new OEE measurement now appears in the **Data** panel on the right.

1. Select the **Card** icon in the Visualizations panel and select the **OEE** measurement you created. You're now using the most recent asset measurement data to calculate OEE for your production lines.

    :::image type="content" source="media/tutorial-overall-equipment-effectiveness/oee-card.png" alt-text="Screenshot that shows a visualization card for OEE in Power BI." lightbox="media/tutorial-overall-equipment-effectiveness/oee-card.png":::

1. Repeat these steps to create new measurements and their corresponding tiles for _Performance_, _Availability_, and _Quality_. Use the following data analysis expressions:

    ```dax
    Performance = DIVIDE(AVERAGE(OEE[TotalUnitsProduced]),10)
    ```

    ```dax
    Availability = DIVIDE(AVERAGE(OEE[TotalOperatingTime]),AVERAGE(OEE[PlannedProductionTime]))
    ```

    ```dax
    Quality = (DIVIDE(AVERAGE(OEE[TotalGoodUnitsProduced]), AVERAGE(OEE[TotalUnitsProduced])))
    ```

Your dashboard looks like the following example:

:::image type="content" source="media/tutorial-overall-equipment-effectiveness/example-dashboard.png" alt-text="Screenshot of an example dashboard that displays OEE, performance, quality, and availability measurements." lightbox="media/tutorial-overall-equipment-effectiveness/example-dashboard.png":::

To create a filter that lets you calculate OEE for each Contoso site and further enhance the visualizations on the dashboard, complete the following steps:

1. Select the **Slicer** icon in the visualizations panel and select **Site**. The slicer lets you filter by the site to calculate OEE, performance, and availability, for individual sites. You can also create a slicer based on asset ID.

1. Select the **Table** icon in the visualizations panel and select **AssetID**, **Manufacturer**, **Customer**, and **ProductId**. The dashboard now displays enrichment data for each asset.

1. Select the **Map** icon in the visualizations panel, select **Site**, and drag the site box inside the visualizations panel into the **Location** field.

1. Select the **Line chart** icon in the visualizations panel and then check **Timestamp** and **AverageTemperature**.

1. Select the **Line chart** icon in the visualizations panel and then check **Timestamp** and **AverageEnergy**.

1. Select the **Line chart** icon in the visualizations panel and then check **Timestamp** and **AverageSpeed**.

1. Your dashboard now looks like the following example:

    :::image type="content" source="media/tutorial-overall-equipment-effectiveness/dashboard-line-charts.png" alt-text="Screenshot that shows line charts on a Power BI dashboard." lightbox="media/tutorial-overall-equipment-effectiveness/dashboard-line-charts.png":::

1. Save your dashboard.

To share your dashboard with your coworkers, select **Publish** in the top navigation plane, and enter your Microsoft Fabric workspace as the destination.

## Related content

- [Tutorial: Detect anomalies in real time](tutorial-anomaly-detection.md)
- [Tutorial: Configure MQTT bridge between Azure IoT MQ Preview and Azure Event Grid](../connect-to-cloud/tutorial-connect-event-grid.md)
- [Build event-driven apps with Dapr](../develop/tutorial-event-driven-with-dapr.md)
- [Upload MQTT data to Microsoft Fabric lakehouse](tutorial-upload-mqtt-lakehouse.md)
- [Build a real-time dashboard in Microsoft Fabric with MQTT data](tutorial-real-time-dashboard-fabric.md)
