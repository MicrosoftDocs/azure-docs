---
title: Push and consume sensor data in Data Manager for Agriculture 
description: Learn how to push sensor data as a provider and egress it as a customer
author: lbpudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 06/19/2023
ms.custom: template-how-to
---
# Sensor Integration as both partner and customer in Azure Data Manager for Agriculture 

Follow the below steps to register as a sensor partner so that you can start pushing your data into your Data Manager for Agriculture instance.

## Step 1: Enable sensor integration

1. Sensor integration should be enabled before it can be initiated. This step provisions required internal Azure resources for sensor integration for Data Manager for Agriculture instance. This can be done by running following <a href="https://github.com/projectkudu/ARMClient" target=" blank">armclient</a> command.

```armclient 
armclient patch /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<datamanager-instance-name>?api-version=2023-04-01-preview "{properties:{sensorIntegration:{enabled:'true'}}}"
```

Sample output:

```json
{
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<datamanager-instance-name>",
  "type": "Microsoft.AgFoodPlatform/farmBeats",
  "sku": {
    "name": "A0"
  },
  "systemData": {
    "createdBy": "<customer-id>",
    "createdByType": "User",
    "createdAt": "2022-03-11T03:36:32Z",
    "lastModifiedBy": "<customer-id>",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2022-03-11T03:40:06Z"
  },
  "properties": {
    "instanceUri": "https://<datamanager-instance-name>.farmbeats.azure.net/",
    "provisioningState": "Succeeded",
    "sensorIntegration": {
      "enabled": "True",
      "provisioningState": "**Creating**"
    },
    "publicNetworkAccess": "Enabled"
  },
  "location": "eastus",
  "name": "myfarmbeats"
}
```

2. The above job might take a few minutes to complete. To know the status of job, the following armclient command should be run:

```armclient 
armclient get /subscriptions/<subscription-id>/resourceGroups/<resource-group-name> /providers/Microsoft.AgFoodPlatform/farmBeats/<datamanager-instance-name>?api-version=2023-04-01-preview
```

3. To verify whether it's completed, look at the highlighted attribute. It should be updated as “Succeeded” from “Creating” in the earlier step. The attribute that indicates that the sensor integration is enabled is indicated by **provisioningState inside the sensorIntegration object**. 

Sample output: 
```json
{
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<datamanager-instance-name>",
  "type": "Microsoft.AgFoodPlatform/farmBeats",
  "sku": {
    "name": "A0"
  },
  "systemData": {
    "createdBy": "<customer-id>",
    "createdByType": "User",
    "createdAt": "2022-03-11T03:36:32Z",
    "lastModifiedBy": "<customer-id>",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2022-03-11T03:40:06Z"
  },
  "properties": {
    "instanceUri": "https://<customer-host-name>.farmbeats.azure.net/",
    "provisioningState": "Succeeded",
    "sensorIntegration": {
      "enabled": "True",
      "provisioningState": "**Succeeded**"
    },
    "publicNetworkAccess": "Enabled"
  },
  "tags": {
    "usage": "<sensor-partner-id>"
  },
  "location": "eastus",
  "name": "<customer-id>"
}
```
Once the provisioning status for sensor integration is completed, sensor integration objects can be created. 

## Step 2: Create sensor partner integration
Create sensor partner integration step should be executed to connect customer with provider. 
The integrationId is later used in sensor creation.

API documentation: [Sensor Partner Integrations - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/sensor-partner-integrations/create-or-update)

## Step 3: Create sensor data model
Use sensor data model to define the model of telemetry being sent. All the telemetry sent by the sensor is validated as per this data model.

API documentation: [Sensor Data Models - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/sensor-data-models/create-or-update)

Sample telemetry 
```json
{
	"pressure": 30.45,
	"temperature": 28,
	"name": "sensor-1"
}
```

Corresponding sensor data model 
```json
{
  "type": "Sensor",
  "manufacturer": "Some sensor manufacturer",
  "productCode": "soil m",
  "measures": {
    "pressure": {
      "description": "measures soil moisture",
      "dataType": "Double",
      "type": "sm",
      "unit": "Bar",
      "properties": {
        "abc": "def",
        "elevation": 5
      }
    },
	"temperature": {
      "description": "measures soil temperature",
      "dataType": "Long",
      "type": "sm",
      "unit": "Celsius",
      "properties": {
        "abc": "def",
        "elevation": 5
      }
    },
	"name": {
      "description": "Sensor name",
      "dataType": "String",
      "type": "sm",
      "unit": "none",
      "properties": {
        "abc": "def",
        "elevation": 5
      }
    }
  },
  "sensorPartnerId": "sensor-partner-1",
  "id": "sdm124",
  "status": "new",
  "createdDateTime": "2022-01-24T06:12:15Z",
  "modifiedDateTime": "2022-01-24T06:12:15Z",
  "eTag": "040158a0-0000-0700-0000-61ee433f0000",
  "name": "my sdm for soil moisture",
  "description": "description goes here",
  "properties": {
    "key1": "value1",
    "key2": 123.45
  }
}
```

## Step 4: Create sensor
Create sensor using the corresponding integration ID and sensor data model ID. DeviceId and HardwareId are optional parameters, if needed, you can use the [Devices - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/devices/create-or-update?tabs=HTTP) to create the device.

API documentation: [Sensors - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/sensors/create-or-update?tabs=HTTP)

## Step 5: Get IoTHub connection string
Get IoTHub connection string to push sensor telemetry to the platform for the Sensor created. 

API Documentation: [Sensors - Get Connection String](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/sensors/get-connection-string?tabs=HTTP)

## Step 6: Push data using IoT Hub 
Use [IoT Hub Device SDKs](/azure/iot-hub/iot-hub-devguide-sdks#azure-iot-hub-device-sdks) to push the telemetry using the connection string.

For all sensor telemetry events, "timestamp" is a mandatory property and has to be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).

You're now all set to start pushing sensor data for all sensors using the respective connection string provided for each sensor. However, sensor data should be sent in the format defined in the sensor data model created in Step 3. Refer to an example of the telemetry schema that follows:

```json
{
	"timestamp": "2022-02-11T03:15:00Z",
	"bar": 30.181,
	"bar_absolute": 29.748,
	"bar_trend": 0,
	"et_day": 0.081,
	"humidity": 55,
	"rain_15_min": 0,
	"rain_60_min": 0,
	"rain_24_hr": 0,
	"rain_day": 0,
	"rain_rate": 0,
	"rain_storm": 0,
	"solar_rad": 0,
	"temp_out": 58.8,
	"uv_index": 0,
	"wind_dir": 131,
	"wind_dir_of_gust_10_min": 134,
	"wind_gust_10_min": 0,
	"wind_speed": 0,
	"wind_speed_2_min": 0,
	"wind_speed_10_min": 0
} 
```

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).