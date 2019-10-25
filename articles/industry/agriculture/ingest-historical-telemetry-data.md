---
title: Ingest Historical Telemetry Data
description:
author: uhabiba04
ms.topic: article
ms.date: 10/25/2019
ms.author: v-umha
ms.service: backup
---

# Ingest historical telemetry data


  A common usage scenario is to ingest historical data from Internet of Things (IoT) devices/sensors into your FarmBeats instance. This can be done by creating the metadata for your devices/sensors and then ingest the historical sensor data in a canonical format to FarmBeats.

## Before you begin

  Make sure you have deployed FarmBeats. To deploy FarmBeats, visit (add link here - awaiting links from SMEs)
  This document outlines the process of ingesting historical sensor data into FarmBeats. To proceed, make sure you have historical sensor data that you have collected from your IoT devices/sensors.

## Enable partner access to Azure FarmBeats

First, we will need to enable partner integration to your Azure FarmBeats instance. This step will create a client that will have access to your Azure FarmBeats as your device partner and will provide you the following values that are required in the subsequent steps.

1. API Endpoint – This is the datahub URL for example, https://<datahub>.azurewebsites.net
2. Tenant ID
3. Client ID
4. Client Secret
5. EventHub Connection String

Follow the below steps to generate the above values:

>[!NOTE]
> You must be an administrator to do the following steps.

1. Download this script (add link here. awaiting SMEs inputs) and extract it in on your local drive. You will find two files inside the ZIP file.
2. Sign in to https://portal.azure.com/ and open Cloud Shell (This option is available on the top right bar of the portal)  

  ![Project Farm Beats](./media/for-tutorials/navigation-bar.png)

3. Ensure the environment is set to **PowerShell**.

  ![Project Farm Beats](./media/for-tutorials/power-shell-new.png)

4. Upload the 2 files that you downloaded (from step 1 above) in your CloudShell.  

  ![Project Farm Beats](./media/for-tutorials/power-shell-two.png)

5. Go to the directory where the files were uploaded (By default it gets uploaded to the home directory *</home<username>*
6. Run the script by using the command:  *<./generateCredentials.ps1>*

  ![Project Farm Beats](./media/for-tutorials/power-shell-generate-credentials.png)

7. Follow the onscreen instructions

  Contact the FarmBeats administrator in case you don’t have access to FarmBeats or your Azure subscription.


## Create device/sensor metadata

  Now that we have the required credentials, we will define the device and sensors by creating the metadata using FarmBeats APIs.

  FarmBeats Datahub has the following APIs that enable creation and management of device/sensor metadata.   

  /**DeviceModel** - Device Model corresponds to the meta-data of the device such as the Manufacturer, Type of the device either Gateway or Node.  
  /**Device** - Device corresponds to a physical device present in the farm.  
  /**SensorModel** - Sensor Model corresponds to the meta-data of the sensor such as the Manufacturer, Type of the sensor either Analog or Digital, Sensor Measure such as Ambient Temperature, Pressure etc.  
  /**Sensor** - Sensor corresponds to a physical sensor that records values. A sensor is typically connected to a device with a device id.  



|        Device Mode   |  Suggestions                            |
| :------------------- | -------------------        :             |
|     Type (Node, Gateway)        |          1 Star      |
|          Manufacturer            |         2 Star     |
|  ProductCode                    |  Device product code Or Model Name/Number. eg: EnviroMonitor#6800  |
|            Ports          |     Port Name and Type (Digital/Analog)
|     Name                 |  Name to identify resource. Eg. Model Name/Product Name
      Description     |Provide a meaningful description of the model
|    Properties          |    Additional properties from the manufacturer   |
|    **Device**             |                      |
|   DeviceModelId     |     id of the associated Device Model  |
|  HardwareId	       | Unique Id for the device such as MAC address etc  
|  reportingInterval        |   Reporting Interval in seconds
|  Location            |  Device Latitude (-90 to +90)/Longitude (-180 to 180)/Elevation (in meters)   
|parentDeviceId       |         id of the parent device to which this device is connected to. Eg. A Node connected to a Gateway; Node will have parentDeviceId as the Gateway  |
|    Name            | Name to identify resource. Device Partners will need to send a name that is consistent with the device name on Device Partner side. If the device name is user-defined on Device Partner side, the same user-defined name should be propagated to FarmBeats|
|     Description       |      Provide a meaningful description  |
|     Properties    |  Additional properties from the manufacturer
|     **Sensor Model**        |          |
|       Type (Analog, Digital)          |                    |
|          manufacturer            |                     |
|     productCode| Product code or Model Name/Number. eg: RS-CO2-N01 |
|       TsensorMeasures > Name	    | Name of the Sensor Measure. Only lower case is supported. For measure from different depths, specify the depth. Eg. soil_moisture_15cm This name has to be consistent with the telemetry d              |
|          sensorMeasures > DataType	   |Telemetry Data Type. Currently Double is supported|
|    sensorMeasures > Type	  |Measurement type of the sensor telemetry data. Following are the system-defined types: AmbientTemperature, CO2, Depth, ElectricalConductivity, LeafWetness, Length, LiquidLevel, Nitrate, O2, PH, Phosphate, PointInTime, Potassium, Pressure, RainGauge, RelativeHumidity, Salinity, SoilMoisture, SoilTemperature, SolarRadiation, State, TimeDuration, UVRadiation, UVIndex, Volume, WindDirection, WindRun, WindSpeed, Evapotranspiration, PAR. To add more refer to /ExtendedType API|
|        sensorMeasures > Unit	            | Unit of sensor telemetry data. Following are the system-defined units: NoUnit, Celsius, Fahrenheit, Kelvin, Rankine, Pascal, Mercury, PSI, MilliMeter, CentiMeter, Meter, Inch, Feet, Mile, KiloMeter, MilesPerHour, MilesPerSecond, KMPerHour, KMPerSecond, MetersPerHour, MetersPerSecond, Degree, WattsPerSquareMeter, KiloWattsPerSquareMeter, MilliWattsPerSquareCentiMeter, MilliJoulesPerSquareCentiMeter, VolumetricWaterContent, Percentage, PartsPerMillion, MicroMol, MicroMolesPerLiter, SiemensPerSquareMeterPerMole, MilliSiemensPerCentiMeter, Centibar, DeciSiemensPerMeter, KiloPascal, VolumetricIonContent, Liter, MilliLiter, Seconds, UnixTimestamp, MicroMolPerMeterSquaredPerSecond, InchesPerHour To add more refer to /ExtendedType API|
|    sensorMeasures > aggregationType	 |  Either of None, Average, Maximum, Minimum, StandardDeviation  |
|          name            | Name to identify resource. Eg. Model Name/Product Name  |
|    description        | Provide a meaningful description of the model  |
|   properties       |  Additional properties from the manufacturer  |
|    **Sensor**      |          |
| hardwareId          |   Unique Id for the sensor set by manufacturer |
|  sensorModelId     |    id of the associated Sensor Model   |
| location          |  Sensor Latitude (-90 to +90)/Longitude (-180 to 180)/Elevation (in meters)|
|   port > name	       |  Name and Type of the port that the sensor is connected to on the device. This needs to be same name as defined in the Device Mode |
|    deviceId  |    id of the Device that the sensor is connected to     |
| name	          |   Name to identify resource. Eg. Sensor Name/Product Name and Model Number/Product Code.|
|    description	  | Provide a meaningful description |
|    properties        |Additional properties from the manufacturer |

  For more details on each of the objects, see the Swagger (add a link here - awaiting inputs from SMEs).

**API request to create metadata**

  To make an API request, you combine the HTTP (POST) method, the URL to the API service, the URI to a resource to query, submit data to create or delete a request and add one or more HTTP request headers. The URL to the API service is the API Endpoint i.e. the datahub URL (https://<yourdatahub>.azurewebsites.net)  

  **Authentication**:

  FarmBeats Datahub uses Bearer Authentication, which needs the following credentials that we generated in the above section.
    - Client ID
    - Client Secret
    - Tenant ID  

  Using the above credentials, the caller can request for an access token, which needs to be sent in the subsequent API requests in the header section as follows:
  headers = *{"Authorization": "Bearer " + access_token, …}*

  **HTTP Request Headers**:
    Here are the most common request headers that need to be specified when making an API call to FarmBeats Datahub:

    - Content-Type: application/json
    - Authorization: Bearer <Access-Token>
    - Accept: application/json

**Input Payload to create metadata**:

**DeviceModel**


```
{
  "type": "Node",
  "manufacturer": "string",
  "productCode": "string",
  "ports": [
    {
      "name": "string",
      "type": "Analog"
    }
  ],
  "name": "string",
  "description": "string",
  "properties": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  }
}

Device
{
  "deviceModelId": "string",
  "hardwareId": "string",
  "farmId": "string",
  "reportingInterval": 0,
  "location": {
    "latitude": 0,
    "longitude": 0,
    "elevation": 0
  },
  "parentDeviceId": "string",
  "name": "string",
  "description": "string",
  "properties": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  }
}

SensorModel

{
  "type": "Analog",
  "manufacturer": "string",
  "productCode": "string",
  "sensorMeasures": [
    {
      "name": "string",
      "dataType": "Double",
      "type": "string",
      "unit": "string",
      "aggregationType": "None",
      "depth": 0,
      "description": "string"
    }
  ],
  "name": "string",
  "description": "string",
  "properties": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  }
}

```
Sensor

```
{
  "hardwareId": "string",
  "sensorModelId": "string",
  "location": {
    "latitude": 0,
    "longitude": 0,
    "elevation": 0
  },
  "depth": 0,
  "port": {
    "name": "string",
    "type": "Analog"
  },
  "deviceId": "string",
  "name": "string",
  "description": "string",
  "properties": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  }
}

```
The below sample request is to create a Device (This has an input json as payload with the request body).  

*curl -X POST "https://<datahub>.azurewebsites.net/Device" -H  "accept: application/json" -H  "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>" -d "{  \"deviceModelId\": \"ID123\",  \"hardwareId\": \"MHDN123\",  \"reportingInterval\": 900,  \"name\": \"Device123\",  \"description\": \"Test Device 123\",}"*


> [!NOTE]
> The APIs return unique IDs for each instance created. The IDs need to be retained for sending the corresponding telemetry messages.

**Sending Telemetry**

  Now that we have created the devices and sensors in FarmBeats, we can send the associated Telemetry messages.  

**Create Telemetry Client**

  The Telemetry needs to be sent to Azure Event Hub for processing. Azure EventHub is a service that enables real-time data (telemetry) ingestion from connected devices and applications. To send telemetry data to FarmBeats, you need to create a client that sends messages to an Event Hub in FarmBeats. To know more about sending telemetry, refer to see:
  https://docs.microsoft.com/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send

**Send Telemetry message as the client**

  Once you have a connection established as an EventHub client, you can send messages to the EventHub as a json.  
  You need to convert the historical sensor data format to a canonical format that FarmBeats understands. The canonical message format is as below:  


```
{   
“deviceid”: “<id of the Device created>”,   
"timestamp": "<timestamp in ISO 8601 format>",     
"version" : "1",   
"sensors": [     
 {        
"id": "<id of the sensor created>”       
 "sensordata": [         
 {            
"timestamp": "< timestamp in ISO 8601 format >",           
 "<sensor measure name (as defined in the Sensor Model)>": value          
},          
{            
"timestamp": "<timestamp in ISO 8601 format>",           
 "<sensor measure name (as defined in the Sensor Model)>": value          
}        
]      
}  
}

The deviceid and the sensorid in the message needs to be obtained from the previous section after adding the corresponding devices/sensors.

Example Telemetry message:
{
  "deviceid": "7f9b4b92-ba45-4a1d-a6ae-c6eda3a5bd12",
  "timestamp": "2019-06-22T06:55:02.7279559Z",
  "version": "1",
  "sensors": [
    {
      "id": "d8e7beb4-72de-4eed-9e00-45e09043a0b3",
      "sensordata": [
        {
          "timestamp": "2019-06-22T06:55:02.7279559Z",
          "hum_max": 15
        },
        {
          "timestamp": "2019-06-22T06:55:02.7279559Z",
          "hum_min": 42
        }
      ]
    },
    {
      "id": "d8e7beb4-72de-4eed-9e00-45e09043a0b3",
      "sensordata": [
        {
          "timestamp": "2019-06-22T06:55:02.7279559Z",
          "hum_max": 20
        },
        {
          "timestamp": "2019-06-22T06:55:02.7279559Z",
          "hum_min": 89
        }
      ]
    }
  ]
}

```

## Next steps
