---
title: Sensor partner integration
description: Describes Sensor Partner Integration
author: uhabiba04
ms.topic: article
ms.date: 10/25/2019
ms.date: 11/04/2019
ms.author: v-umha
---

# Sensor Partner Integration

This section explains the implementation of the Sensor data integration (also called the **Translator** component) that FarmBeats Device Partners (OEMs (Original Equipment Manufacturer) and Device Manufacturers) can develop to integrate with FarmBeats by leveraging its APIs and send customers’ device data along with telemetry to FarmBeats Data hub. The data once available is visualized through the FarmBeats Accelerator and can potentially be used for data fusion and ML/AI (Machine Language/Artificial Intelligence) model building by the Agribusiness or the customer’s System Integrator.

## Linking FarmBeats Account

Once the customers have purchased and deployed Devices/Sensors, they will be able to access the device data and telemetry on device partners’ SaaS portal (Software as a Service). Device Partners need to enable customers to link their account to their FarmBeats instance on Azure. The following credentials are require to fill in by customer/SI:

1. Display Name (An optional field for user to define a name for this integration)
2. API Endpoint
3. Tenant ID
4. Client ID
5. Client Secret
6. EventHub Connection String
7. Start Date

> [!NOTE]
> Start Date – This enables historical data feed i.e. data from the date specified by the user.

## Unlink FarmBeats

The customer should have the ability to unlink an existing FarmBeats Integration. Unlinking FarmBeats should not delete any device/sensor metadata that was created in customer’s Data hub. Unlinking should do the following:

1. Stop Telemetry Flow
2. Delete and Erase the integration credentials on device partner.

## Edit FarmBeats Integration

The customer should have the ability to edit the FarmBeats Integration. The primary scenario for edit is when the client secret or connection string changes due to expiry, in this case you can only edit the following fields.
1. Display Name (if applicable)
2. Client Secret (should be displayed in “2x8***********” format or Show/Hide feature rather than clear text)
3. Connection String (should be displayed in “2x8***********” format or Show/Hide feature rather than clear text)

> [!NOTE]
> Edit should not interrupt the creation of metadata objects.

## Last Telemetry Sent

The customer should have the ability to view the timestamp of “Last Telemetry Sent” that is the time at which the latest telemetry was successfully sent to FarmBeats.

## Translator Development

**Rest API based integration**

Sensor data integration capabilities of FarmBeats are exposed via the REST API. Capabilities include metadata definition, device/sensor provisioning, device and sensor management.

**Telemetry Ingestion**

The telemetry data is mapped to a canonical message that is published on Azure Event Hub for processing. Azure EventHub is a service that enables real-time data (telemetry) ingestion from connected devices and applications.

**API Development**

The APIs contain swagger technical documentation. Refer swagger for information on all the APIs and their corresponding requests/responses.

The Swagger is available at http://aka.ms/FarmBeatsDatahubSwagger.

**Authentication**

FarmBeats leverages Microsoft Azure’s Active Directory Authentication. Azure App Service provides built-in authentication and authorization support.

For more information on Azure Active Directory, refer this link https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization.

FarmBeats Data hub uses Bearer Authentication which needs the following credentials:
1. Client ID
2. Client Secret
3. Tenant ID

Using the above credentials, the caller can request for an access token, which needs to be
sent it in the subsequent API requests in the header section as follows:

headers = {"Authorization": "Bearer " + access_token, …} 

Below is a sample Python code that gives the access token which can be used for subsequent API calls to FarmBeats: 

import azure 
from azure.common.credentials import ServicePrincipalCredentials 
import adal 
#FarmBeats API Endpoint 
ENDPOINT = "https://<yourdatahub>.azurewebsites.net" [Azure website](https://<yourdatahub>.azurewebsites.net)
CLIENT_ID = "<Your Client ID>"   
CLIENT_SECRET = "<Your Client Secret>"   
TENANT_ID = "<Your Tenant ID>" 
AUTHORITY_HOST = 'https://login.microsoftonline.com' 
AUTHORITY = AUTHORITY_HOST + '/' + TENANT_ID 
#Authenticating with the credentials 
context = adal.AuthenticationContext(AUTHORITY) 
token_response = context.acquire_token_with_client_credentials(ENDPOINT, CLIENT_ID, CLIENT_SECRET) 
#Should get an access token here 
access_token = token_response.get('accessToken') 



**HTTP Request Headers**

Here are the most common request headers that needs to be specified when making an API call to FarmBeats Data hub:


**Header** | **Description and Example**
--- | ---
Content-Type | The request format (Content-Type: application/<format>) For FarmBeats Data hub APIs format is json. Content-Type: application/json
Authorization | Specifies the access token required to make an API call Authorization: Bearer <Access-Token>
Accept | The response format. For FarmBeats Data hub APIs the format is json Accept: application/json

**API Requests**

To make a REST (Representaional State Transfer) API request, you combine the HTTP (GET, POST, or PUT) method, the URL to the API service, the URI (Uniform Resource Identifier) to a resource to query, submit data to, update, or delete, and one or more HTTP request headers. The URL to the API service is the API Endpoint provided by the customer (https://<yourdatahub>.azurewebsites.net)

Optionally, you can include query parameters on GET calls to filter, limit the size of, and sort the data in the responses.

The below sample request is to get the list of Devices:

curl -X GET "https://microsoft-farmbeats.azurewebsites.net/Device" -H "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>”
Most GET, POST, and PUT calls require a JSON request body.
The below sample request is to create a Device (This has an input json with the request body).
curl -X POST "https://microsoft-farmbeats.azurewebsites.net/Device" -H  "accept: application/json" -H  "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>" -d "{  \"deviceModelId\": \"ID123\",  \"hardwareId\": \"MHDN123\",  \"reportingInterval\": 900,  \"name\": \"Device123\",  \"description\": \"Test Device 123\",}"

**Data Format**

JSON (JavaScript Object Notation) is a common, language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see json.org.

## Metadata Specifications

FarmBeats Data hub has the following APIs that enable device partners to create and manage device/sensor metadata.  
   /**DeviceModel** - Device Model corresponds to the meta-data of the device such as the Manufacturer, Type of the device either Gateway or Node.  
  /**Device** - Device corresponds to a physical device present in the farm.
  /**SensorModel** - Sensor Model corresponds to the meta-data of the sensor such as the Manufacturer, Type of the sensor either Analog or Digital, Sensor Measure such as Ambient Temperature, Pressure etc.
  /**Sensor** - Sensor corresponds to a physical sensor that records values. A sensor is typically connected to a device with a device id.

  **Device Model** | **DeviceModel corresponds to the meta-data of the device such as the Manufacturer, Type of the device either Gateway or Node.**
  --- | ---
  Type (Node, Gateway)  | 1 Star |
  Manufacturer  | 2 Star |
  ProductCode  | Device product code Or Model Name/Number. eg: EnviroMonitor#6800 |
  Ports  | Port Name and Type (Digital/Analog)  |
  Name  | Name to identify resource. Eg. Model Name/Product Name |
  Description  | Provide a meaningful description of the model |
  Properties  | Additional properties from the manufacturer |
  **Device** | **Device corresponds to a physical device present in the farm. Each device has a unique device id** |
DeviceModelId  |id of the associated Device Model. |
HardwareId   |Unique Id for the device such as MAC address etc.,  |
reportingInterval |Reporting Interval in seconds |
Location    |Device Latitude (-90 to +90)/Longitude (-180 to 180)/Elevation (in meters) |
parentDeviceId | id of the parent device to which this device is connected to. Eg. A Node connected to a Gateway; Node will have parentDeviceId as the Gateway |
  Name  | Name to identify resource.  Device Partners will need to send a name that is consistent with the device name on Device Partner side. If the device name is user-defined on Device Partner side, the same user-defined name should be propagated to FarmBeats  |
  Description  | Provide a meaningful description  |
  Properties  |Additional properties from the manufacturer  |
  **Sensor Model** | SensorModel corresponds to the meta-data of the sensor such as the Manufacturer, Type of the sensor either Analog or Digital, Sensor Measure such as Ambient Temperature, Pressure etc |
  Type (Analog, Digital)  |Mention analog or digital sensor|
  manufacturer  | name of manufacturer |
  productCode  | Product code or Model Name/Number. eg: RS-CO2-N01  |
  sensorMeasures > Name  | Name of the Sensor Measure. Only lower case is supported. For measure from different depths, specify the depth. Eg. soil_moisture_15cm This name has to be consistent with the telemetry data. |
  sensorMeasures > DataType  | Telemetry Data Type. Currently Double is supported  |
  sensorMeasures > Type  | Measurement type of the sensor telemetry data. Following are the system-defined types: AmbientTemperature, CO2, Depth, ElectricalConductivity, LeafWetness, Length, LiquidLevel, Nitrate, O2, PH, Phosphate, PointInTime, Potassium, Pressure, RainGauge, RelativeHumidity, Salinity, SoilMoisture, SoilTemperature, SolarRadiation, State, TimeDuration, UVRadiation, UVIndex, Volume, WindDirection, WindRun, WindSpeed, Evapotranspiration, PAR. To add more refer to /ExtendedType API
  sensorMeasures > Unit | Unit of sensor telemetry data. Following are the system-defined  units: NoUnit, Celsius, Fahrenheit, Kelvin, Rankine, Pascal, Mercury, PSI, MilliMeter, CentiMeter, Meter, Inch, Feet, Mile, KiloMeter, MilesPerHour, MilesPerSecond, KMPerHour, KMPerSecond, MetersPerHour, MetersPerSecond, Degree, WattsPerSquareMeter, KiloWattsPerSquareMeter, MilliWattsPerSquareCentiMeter, MilliJoulesPerSquareCentiMeter, VolumetricWaterContent, Percentage, PartsPerMillion, MicroMol, MicroMolesPerLiter, SiemensPerSquareMeterPerMole, MilliSiemensPerCentiMeter, Centibar, DeciSiemensPerMeter, KiloPascal, VolumetricIonContent, Liter, MilliLiter, Seconds, UnixTimestamp, MicroMolPerMeterSquaredPerSecond, InchesPerHour To add more refer to /ExtendedType API
  sensorMeasures > aggregationType  | Either of None, Average, Maximum, Minimum, StandardDeviation
  SensorMeasures > depth  | The depth of the sensor in centimeters (eg. Measure of moisture 10 cm under the ground)
  sensorMeasures > description  | Provide a meaningful description of the measure
  name  | Name to identify resource. Eg. Model Name/Product Name
  description  | Provide a meaningful description of the model
  properties  | Additional properties from the manufacturer
  **Sensor**  |
  hardwareId  | Unique Id for the sensor set by manufacturer
  sensorModelId  | id of the associated Sensor Model.
  location  | Sensor Latitude (-90 to +90)/Longitude (-180 to 180)/Elevation (in meters)
  port > name  |Name and Type of the port that the sensor is connected to on the device. This needs to be same name as defined in the Device Model
  deviceId  | id of the Device that the sensor is connected to
  name  | Name to identify resource. Eg. Sensor Name/Product Name and Model Number/Product Code.
  description  | Provide a meaningful description
  properties  | Additional properties from the manufacturer


Refer to the Swagger for more details on each of the objects and their properties.

> [!NOTE]
> The APIs return unique ids for each instance created. This id needs to be retained by the Translator for device management and metadata sync.


**Metadata Sync**

The Translator should send updates on the metadata. Examples of update scenarios are – Change of Device/Sensor name, Change of Device/Sensor location.

The Translator should have the ability to add new Devices and/or Sensors that have been installed by the user post linking of FarmBeats. Similarly, if a device/sensor has been updated by the user, the same should be updated in FarmBeats for the corresponding Device/Sensor. Typical scenarios for update device/sensor could be: change of device location, addition of sensors in a node etc.


> [!NOTE]
> Delete is not supported for Device/Sensor metadata.


> [!NOTE]
>To update metadata, it is mandatory to call /Get/{id} on the device/sensor, update the changed properties and then do a /Put/{id} so that any properties set by the user is not lost

**Adding new Types/Unit**
FarmBeats supports adding new sensor measure types and units. Refer to /ExtendedType API in the swagger for more details.

## Telemetry Specifications

The telemetry data is mapped to a canonical message that is published on Azure Event Hub for processing. Azure EventHub is a service that enables real-time data (telemetry) ingestion from connected devices and applications.

## Send telemetry data to FarmBeats

To send telemetry data to FarmBeats, you will need to create a client that sends messages to an Event Hub in FarmBeats. To know more about sending telemetry to event hub, [click here](https://docs.microsoft.com/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send)

Here is a sample Python code that sends telemetry as a client to a specified Event Hub:

import azure
from azure.eventhub import EventHubClient, Sender, EventData, Receiver, Offset


```

EVENTHUBCONNECTIONSTRING = "<EventHub Connection String provided by customer>"
EVENTHUBNAME = "<EventHub Name provided by customer>"

write_client = EventHubClient.from_connection_string(EVENTHUBCONNECTIONSTRING, eventhub=EVENTHUBNAME, debug=False)
sender = write_client.add_sender(partition="0")
write_client.run()
for i in range(5):
    telemetry = "<Canonical Telemetry message>"
    print("Sending telemetry: " + telemetry)
    sender.send(EventData(telemetry))
write_client.stop()


The canonical message format is as below:
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
}onParameters>]

```


> [!NOTE]
> All key names in the telemetry json should be lower case eg. deviceid, sensordata etc.


Example Telemetry message:


```
{
  "deviceid": "7f9b4b92-ba45-4a1d-a6ae-c6eda3a5bd12",
  "timestamp": "2019-06-22T06:55:02.7279559Z",
  "version" : "1",
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


## Troubleshoot/Error Management

**Troubleshoot Option/Support**

In the event that the customer is not able to receive Device data and/or telemetry in the FarmBeats instance specified, the device partner should provide support and a mechanism to troubleshoot the same.

**Telemetry Data Retention**

The Telemetry data should also be retained for a pre-defined time period so that the same can be useful in debugging or re-sending the telemetry in the event of error or data loss.

**Error Management / Error notification**

In the event of an error that affects the device/sensor metadata/data integration or telemetry data flow in the device partner system, the same should be notified to the customer. A mechanism to resolve the error(s) should also be designed and implemented.

**Connection Checklist**

Device Manufacturers/Partners can have the following sanity test/checklist to ensure that the credentials provided by the customer is accurate.

1. Check if an access token is received with the credentials provided
2. Check if an API call succeeds with the access token received
3. Check if the EventHub client Connection is established

## Imagery Partner Integration

This section describes the implementation of the Translator component to send imagery data into Azure FarmBeats. Agricultural Imagery data can be from various sources like multispectral cameras, satellites, drones. Agricultural Imagery Partners can integrate with FarmBeats and provide the end customer with their custom generated maps in the context of a Farm.  

The data once available can be visualized through the FarmBeats Accelerator and potentially be used for data fusion and ML/AI model building by the Agribusiness or the customer’s System Integrator.

FarmBeats provides the ability to

1.	Define custom image types, source, file format using Extended Type APIs
2.	Ingest imagery data from various sources via the Scene & SceneFile APIs.

The below section focuses on getting any form of imagery into the FarmBeats system

Once customers have purchased their drones/ camera payloads, they will be able to access the partner software which helps them plan drone flights & get raw data. They will continue to use the partner’s software for path planning and orthomosaic image stitching.

Drone Partners will need to enable customers to link their account to their FarmBeats instance on Azure. The following credentials will be input by customer in the drone partner software for the same:

1. API Endpoint
2. Tenant ID
3. Client ID
4. Client Secret
5. Translator Development
6. Rest API based integration

Sensor data integration capabilities of FarmBeats are exposed via the REST API. Capabilities include metadata definition, device/sensor provisioning, device and sensor management.

**Telemetry Ingestion**

The telemetry data is mapped to a canonical message that is published on Azure Event Hub for processing. Azure EventHub is a service that enables real-time data (telemetry) ingestion from connected devices and applications.

**API Development**

The APIs contain swagger technical documentation. Refer swagger for information on all the APIs and their corresponding requests/responses.
The Swagger is available at http://aka.ms/FarmBeatsDatahubSwagger .
Authentication
FarmBeats leverages Microsoft Azure’s Active Directory Authentication. Azure App Service provides built-in authentication and authorization support. For more information on Azure Active Directory, refer this link https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization  

FarmBeats Data hub uses Bearer Authentication which needs the following credentials:

1. Client ID
2. Client Secret
3. Tenant ID

Using the above credentials, the caller can request for an access token which needs to be sent it in the subsequent API requests in the header section as follows
headers = {"Authorization": "Bearer " + access_token, …} 


Below is a sample Python code that gives the access token which can be used for subsequent API calls to FarmBeats: 
 
import azure 

from azure.common.credentials import ServicePrincipalCredentials 
import adal 
#FarmBeats API Endpoint 
ENDPOINT = "https://<yourdatahub>.azurewebsites.net"   
CLIENT_ID = "<Your Client ID>"   
CLIENT_SECRET = "<Your Client Secret>"   
TENANT_ID = "<Your Tenant ID>" 
AUTHORITY_HOST = 'https://login.microsoftonline.com' 
AUTHORITY = AUTHORITY_HOST + '/' + TENANT_ID 
#Authenticating with the credentials 
context = adal.AuthenticationContext(AUTHORITY) 
token_response = context.acquire_token_with_client_credentials(ENDPOINT, CLIENT_ID, CLIENT_SECRET) 
#Should get an access token here 
access_token = token_response.get('accessToken') 


**HTTP Request Headers**

Here are the most common request headers that need to be specified when making an API call to FarmBeats Data hub:

**Header** | **Description and Example**
--- | ---
Content-Type  | The request format (Content-Type: application/<format>) For FarmBeats Data hub APIs format is json. Content-Type: application/json
Authorization | Specifies the access token required to make an API call. Authorization: Bearer <Access-Token>
Accept  | The response format. For FarmBeats Data hub APIs the format is json  Accept: application/json


**API Requests**

To make a REST API request, you combine the HTTP (GET, POST, or PUT) method, the URL to the API service, the URI to a resource to query, submit data to, update, or delete, and one or more HTTP request headers. The URL to the API service is the API Endpoint provided by the customer (https://<yourdatahub>.azurewebsites.net)  

Optionally, you can include query parameters on GET calls to filter, limit the size of, and sort the data in the responses.

The below sample request is to get the list of Devices:
curl -X GET "https://microsoft-farmbeats.azurewebsites.net/Device" -H "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>”

Most GET, POST, and PUT calls require a JSON request body.
The below sample request is to create a Device (This has an input json with the request body).
curl -X POST "https://microsoft-farmbeats.azurewebsites.net/Device" -H  "accept: application/json" -H  "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>" -d "{  \"deviceModelId\": \"ID123\",  \"hardwareId\": \"MHDN123\",  \"reportingInterval\": 900,  \"name\": \"Device123\",  \"description\": \"Test Device 123\",}"

Data Format

JSON (JavaScript Object Notation) is a common, language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see json.org

Partner Integration Steps:

Once the partner has the required credentials to make the connect to the FarmBeats Data hub, the partner should enable the following in their translator component
1.	Create new extended type for the following fields to suit the imagery they are planning to upload:
  - Scene Source : For example <drone_partner_name>
  - Scene Type: For example <drone>
  - Scene File Type: For example <chlorophyll index>
  - Scene File Content Type: For example <image/tiff>
2.	Call the Farms API to get the list of Farms from within the FarmBeats system
3.	Provide the customer with an ability to choose a single farm from the list of Farms.

The Partner system must show the Farm within the partner software to do the path planning & drone flight and image collection

4.	Call the Scene API and provide required details to create a new Scene with a unique SceneID
5.	Receive a Blob SAS URL to upload the required images into the FarmBeats data hub, in the context of the chosen farm into the FarmBeats system
A detailed flow on the API calls is defined below:

Step 1: ExtendedType: Check in the ExtendedType API if the type and File source are available on FarmBeats. You can do this by calling a GET on the /ExtendedType API.

Following are the system defined values: "key": "SceneFileContentType",       "value": [         "image/tiff",         "image/png",         "image/jpeg",         "text/csv",         "text/plain",         "text/tab-separated-values",         "application/json",         "application/octet-stream"       ]

"key": "SceneFileType",       "value": [         "evi",         "ndvi",         "ndwi",         "tci",         "soil-moisture",         "sensor-placement",         "sentinel-b01",         "sentinel-b02",         "sentinel-b03",         "sentinel-b04",         "sentinel-b05",         "sentinel-b06",         "sentinel-b07",         "sentinel-b08",
        "sentinel-b8a",         "sentinel-b09",         "sentinel-b10",         "sentinel-b11",         "sentinel-b12",         "cloud-mask",         "farm-mask"       ],

"key": "SceneType",       "value": [         "base-bands",         "sensor-placement",         "soil-moisture",         "evi",         "ndwi",         "ndvi",         "drone"       ]

"key": "SceneSource",       "value": [         "sentinel-l1c",         "sentinel-l2a",         "farmbeats-model",         "dji"       ]


This will be a one-time setup, and the scope of this new scenetype is limited to the subscription in which FarmBeats is deployed.

Example: To add SceneSource: “SlantRange”, we will do PUT on the id of the /ExtendedType with key: “SceneSource” Input payload:

{   "key": "SceneSource",       "value": [         "sentinel-l1c",         "sentinel-l2a",         "farmbeats-model",         "dji",         "SlantRange"
      ]   "description": "List of scene sources available in system. User can add more values. Added dinamica-generale" }

green field is the new addition to the system-defined scenesource values.

Step 2: Get Farm Details The Scenes (tiff or csv files) will be in the context of a farm. So you will need to get the Farm details by doing a get on /Farm API. The API will return you the list of farms available in the FarmBeats and you can select the farm you want to ingest the data for.

Get /Farm response: {   "items": [     {       "id": "d41a33e7-b73e-480e-9279-0fcb3207332b",       "createdAt": "2019-10-04T11:33:35.01619Z",       "lastModifiedAt": "2019-10-04T11:33:35.01619Z",       "geometry": {         "type": "Polygon",         "coordinates": [           [             [               78.33494849794374,               17.427459159016905             ],             [               78.33470873178663,               17.429174852000685             ],             [               78.3370736978917,               17.43074495690408             ],             [               78.33494849794374,               17.427459159016905             ]           ]         ]       },       "name": "MicrosoftBuilding3",       "properties": {         "crops": "Others",         "address": "Microsoft Gachibowli"       }     }   ] } 3. Create a /Scene id (Post call)
Create a new scene (tiff or csv file) with the given information, providing the Date, sequence & FarmID to which the Scene will be associated. The meta-data associated with the scene can be defined here in the “properties” bag (including details of duration, type of measure, etc.)

This creates a new SceneID which will be associated with the farm. Once the SceneID is created, the user can use the same to create a new file (tiff or csv) & store the content of the file.

Example input payload for the Post call on /Scene API

{   "type": "nirsensordata",   "source": "dinamica-generale",   "farmId": "<farmid from step 2>",   "date": "2019-10-04T16:13:39.064Z",   "sequence": 5,   "name": "test scene",   "description": "test scene description",   "properties": {     "additionalProp1": {},     "additionalProp2": {},     "additionalProp3": {}   } } green fields: defined as part of the /ExtendedType API above

API Response: {   "id": "a0505928-c480-491b-ba31-d38285a28c1d",   "createdAt": "2019-10-04T16:19:12.4838584Z",   "lastModifiedAt": "2019-10-04T16:19:12.4838584Z",   "type": "nirsensordata",   "source": "dinamica-generale",   "farmId": "d41a33e7-b73e-480e-9279-0fcb3207332b",   "date": "2019-10-04T16:13:39.064Z",   "sequence": 5,   "name": "test scene",   "description": "test scene description",   "properties": {} }

**Create/SceneFile**

The Sceneid returned from step 3 would be the input for the SceneFile which will return a SAS URL token which is valid for 24 hours. The user can use a blob storage Rest API to upload the local file through the SAS URL.

If the user requires a programmatic way of uploading a stream of images, the blob storage SDK can be used to define a method using the Scenefile ID, location & URL.

Example input payload for the Post call on /Scene API {   "sceneId": "a0505928-c480-491b-ba31-d38285a28c1d",   "type": "mobile-sensor-data",   "contentType": "image/tiff",   "name": "test scene file",   "description": "test scene file description",   "properties": {     "additionalProp1": {},     "additionalProp2": {},     "additionalProp3": {}   } }

API Response: {   "uploadSASUrl": "https://storagej2lho.blob.core.windows.net/farm-scene/2019/a0505928-c480-491bba31-d38285a28c1d/e91139a7-4ebd-4e2f-b17c-c677822dc840?sv=2018-0328&sr=b&sig=%2F1426JkDcIFE5g3d%2BjOevCVMIn%2FJo9YKwBn3La5zL8Y%3D&se=2019-1005T16%3A23%3A57Z&sp=w",   "id": "e91139a7-4ebd-4e2f-b17c-c677822dc840",   "createdAt": "2019-10-04T16:23:57.1192916Z",   "lastModifiedAt": "2019-10-04T16:23:57.1192916Z",   "blobUrl": "https://storagej2lho.blob.core.windows.net/farm-scene/2019/a0505928-c480-491b-ba31d38285a28c1d/e91139a7-4ebd-4e2f-b17c-c677822dc840",   "sceneId": "a0505928-c480-491b-ba31-d38285a28c1d",   "type": "mobile-sensor-data",   "contentType": "image/tiff",   "name": "test scene file",   "description": "test scene file description",   "properties": {} }

The Post call to /SceneFile API returns a SAS upload URL, which can be used to upload the csv or tiff file using Azure Blob Storage client/library.


## Next Steps

Click [REST API](references-for-farmbeats.md#rest-api) to know more on REST API based integration details.
