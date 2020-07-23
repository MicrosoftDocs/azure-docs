---
title: Query ingested telemetry data
description: This article describes how to query ingested telemetry data.
author: sunasing
ms.topic: article
ms.date: 03/11/2020
ms.author: sunasing
---

# Query ingested telemetry data

This article describes how to query ingested sensor data from Azure FarmBeats.

Ingesting data from Internet of Things (IoT) resources such as devices and sensors is a common scenario in FarmBeats. You create metadata for devices and sensors and then ingest the historical data to FarmBeats in a canonical format. Once the sensor data is available on FarmBeats Datahub, we can query the same to generate actionable insights or build models.

## Before you begin

Before you proceed with this article, ensure that you've installed FarmBeats and ingested sensor telemetry data from your IoT devices to FarmBeats.

To ingest sensor telemetry data, visit [ingest historical telemetry data](ingest-historical-telemetry-data-in-azure-farmbeats.md)

Before you proceed, you also need to ensure you are familiar with FarmBeats REST APIs as you will query ingested telemetry using the APIs. For more information on FarmBeats APIs, see [FarmBeats REST APIs](rest-api-in-azure-farmbeats.md). **Ensure that you are able to make API requests to your FarmBeats Datahub endpoint**.

## Query ingested sensor telemetry data

There are two ways to access and query telemetry data from FarmBeats:

- API and
- Time Series Insights (TSI).

### Query using REST API

Follow the steps to query the ingested sensor telemetry data using FarmBeats REST APIs:

1. Identify the sensor you are interested in. You can do this by making a GET request on /Sensor API.

> [!NOTE]
> The **id** and the **sensorModelId** of the interested sensor object.

2. Make a GET/{id} on /SensorModel API for the **sensorModelId** as noted in step 1. The "Sensor Model" has all the metadata and details about the ingested telemetry from the sensor. For example, **Sensor Measure** within the **Sensor Model** object has details about what measures is the sensor sending and in what types and units. For example,

  ```json
  {
      "name": "moist_soil_last <name of the sensor measure - this is what we will receive as part of the queried telemetry data>",
      "dataType": "Double <Data Type - eg. Double>",
      "type": "SoilMoisture <Type of measure eg. temperature, soil moisture etc.>",
      "unit": "Percentage <Unit of measure eg. Celsius, Percentage etc.>",
      "aggregationType": "None <either of None, Average, Maximum, Minimum, StandardDeviation>",
      "description": "<Description of the measure>"
  }
  ```
Make a note of the response from the GET/{id} call for the Sensor Model.

3. Do a POST call on /Telemetry API with the following input payload

  ```json
  {
    "sensorId": "<id of the sensor as noted in step 1>",
    "searchSpan": {
      "from": "<desired start timestamp in ISO 8601 format; default is UTC>",
      "to": "<desired end timestamp in ISO 8601 format; default is UTC>"
    },
    "filter": {
      "tsx": "string"
    },
    "projectedProperties": [
      {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      }
    ]
  }
  ```
4. The response from the /Telemetry API will look something like this:

  ```json
  {
    "timestamps": [
      "2020-XX-XXT07:30:00Z",
      "2020-XX-XXT07:45:00Z"
    ],
    "properties": [
      {
        "values": [
          "<id of the sensor>",
          "<id of the sensor>"
        ],
        "name": "Id",
        "type": "String"
      },
      {
        "values": [
          2.1,
          2.2
        ],
        "name": "moist_soil_last <name of the SensorMeasure as defined in the SensorModel object>",
        "type": "Double <Data Type of the value - eg. Double>"
      }
    ]
  }
  ```
In the above example response, the queried sensor telemetry gives data for two timestamps along with the measure name ("moist_soil_last") and values of the reported telemetry in the two timestamps. You will need to refer to the associated Sensor Model (as described in step 2) to interpret the type and unit of the reported values.

### Query using Azure Time Series Insights (TSI)

FarmBeats leverages [Azure Time Series Insights (TSI)](https://azure.microsoft.com/services/time-series-insights/) to ingest, store, query, and visualize data at IoT scale--data that's highly contextualized and optimized for time series.

Telemetry data is received on an EventHub and then processed and pushed to a TSI environment within FarmBeats resource group. Data can then be directly queried from the TSI. For more information, see [TSI documentation](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-explorer)

Follow the steps to visualize data on TSI:

1. Go to **Azure Portal** > **FarmBeats DataHub resource group** > select **Time Series Insights** environment (tsi-xxxx) > **Data Access Policies**. Add user with Reader or Contributor access.
2. Go to the **Overview** page of **Time Series Insights** environment (tsi-xxxx) and select the **Time Series Insights Explorer URL**. You'll now be able to visualize the ingested telemetry.

Apart from storing, querying and visualization of telemetry, TSI also enables integration to a Power BI dashboard. For more information, see [here]( https://docs.microsoft.com/azure/time-series-insights/how-to-connect-power-bi)

## Next steps

You now have queried sensor data from your Azure FarmBeats instance. Now, learn how to [generate maps](generate-maps-in-azure-farmbeats.md#generate-maps) for your farms.
