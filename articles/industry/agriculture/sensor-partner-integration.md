---
title: Sensor partner integration
description: Describes Sensor Partner Integration
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---

# Sensor partner integration

This article provides information about the Azure FarmBeats **Translator** component, which enables sensor partner integration.

Using this component, partners can develop sensors that integrate with FarmBeats, by leveraging our API, and sending customer device data and telemetry to the FarmBeats Data hub. Data is visualized using the FarmBeats Accelerator. Data can be used for data fusion, and for building machine language/artificial intelligence models.

## Link FarmBeats account

Once the customers have purchased and deployed devices/sensors, they can access the device data and telemetry on device partners’ SaaS portal (Software as a Service). device partners need to enable customers to link their account to their FarmBeats instance on Azure. The following credentials are required to fill in by customer/system integrator:

   - Display name (An optional field for user to define a name for this integration)
   - API endpoint
   - Tenant ID
   - Client ID
   - Client secret
   - EventHub connection string
   - Start date

   > [!NOTE]
   > Start Date enables historical data feed i.e. data from the date specified by the user.

## Unlink FarmBeats

Customers have the ability to unlink an existing FarmBeats Integration. Unlinking FarmBeats should not delete any device/sensor metadata that was created in customer’s Data hub. Unlinking does the following:

   - Stops telemetry flow.
   - Deletes and erase the integration credentials on device partner.

## Edit FarmBeats integration

The customer can edit the FarmBeats integration settings, if the client secret or connection string changes. In this case, customer can only edit the following fields:

   - Display name (if applicable)
   - Client secret (should be displayed in “2x8***********” format or Show/Hide feature rather than clear text)
   - Connection string (should be displayed in “2x8***********” format or Show/Hide feature rather than clear text)

## View last telemetry sent

You can view the timestamp of Last **Telemetry Sent**. This is the time at which the latest telemetry was successfully sent to FarmBeats.

## Translator development

**Rest API-based integration**

Sensor data integration capabilities of FarmBeats are exposed via the REST API. Capabilities include metadata definition, device/sensor provisioning, device, and sensor management.

**Telemetry ingestion**

The telemetry data is mapped to a canonical message that is published on Azure Event Hub for processing. Azure EventHub is a service that enables real-time data (telemetry) ingestion from connected devices and applications.

**API development**

The APIs contain Swagger technical documentation. For more information on the APIs  and their corresponding requests/responses, see [Swagger](https://aka.ms/FarmBeatsDatahubSwagger)

**Authentication**

FarmBeats leverages Microsoft Azure’s Active Directory Authentication. Azure App Service provides built-in authentication and authorization support.

For more information, see [Azure Active Directory](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization).

FarmBeats Data hub uses Bearer Authentication, which needs the following credentials:
   - Client ID
   - Client Secret
   - Tenant ID

Using the above credentials, the caller can request for an access token, which needs to be
sent in the subsequent API requests in the header section as follows:

```
headers = {"Authorization": "Bearer " + access_token, …} 
```

Below is a sample Python code that gives the access token, which can be used for subsequent API calls to FarmBeats: 

```python
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
```


**HTTP request headers**

Here are the most common request headers that need to be specified when making an API call to FarmBeats Data hub:


**Header** | **Description and example**
--- | ---
Content-Type | The request format (Content-Type: application/<format>) For FarmBeats Data hub APIs format is json. Content-Type: application/json
Authorization | Specifies the access token required to make an API call Authorization: Bearer <Access-Token>
Accept | The response format. For FarmBeats Data hub APIs, the format is json Accept: application/json

**API requests**

To make a REST (Representational State Transfer) API request, you combine the HTTP (GET, POST, or PUT) method, the URL to the API service, the URI (Uniform Resource Identifier) to a resource to query, submit data to, update, or delete, and one or more HTTP request headers. The URL to the API service is the API Endpoint provided by the customer. Here is sample: https://\<yourdatahub-website-name>.azurewebsites.net

Optionally, you can include query parameters on GET calls to filter, limit the size of, and sort the data in the responses.

The below sample request is to get the list of devices:

```
curl -X GET "https://microsoft-farmbeats.azurewebsites.net/Device" -H "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>”
```
Most GET, POST, and PUT calls require a JSON request body.

The below sample request is to create a device (This sample has an input json with the request body).

```
curl -X POST "https://microsoft-farmbeats.azurewebsites.net/Device" -H  "accept: application/json" -H  "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>" -d "{  \"deviceModelId\": \"ID123\",  \"hardwareId\": \"MHDN123\",  \"reportingInterval\": 900,  \"name\": \"Device123\",  \"description\": \"Test Device 123\",}"
```

## Data format

JSON (JavaScript Object Notation) is a common, language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see [json.org](http://json.org).

## Metadata specifications

FarmBeats Data hub has the following APIs that enable device partners to create and manage device/sensor metadata.  

- /**DeviceModel** - Device model corresponds to the metadata of the device such as the Manufacturer, Type of the device either gateway or node.  
- /**Device** - Device corresponds to a physical device present in the farm.
- /**SensorModel** - Sensor model corresponds to the meta-data of the sensor such as the manufacturer, Type of the sensor either analog or digital, sensor measure such as ambient temperature, pressure etc.,
- /**Sensor** - Sensor corresponds to a physical sensor that records values. A sensor is typically connected to a device with a device ID.

  Device Model| DeviceModel corresponds to the metadata of the device such as the Manufacturer, Type of the device either Gateway or Node.
  --- | ---
  Type (Node, Gateway)  | 1 Star |
  Manufacturer  | 2 Star |
  ProductCode  | Device product code Or model name/number. For example, EnviroMonitor#6800 |
  Ports  | Port name and type (digital/analog)  |
  Name  | Name to identify resource. For example, model name/product name |
  Description  | Provide a meaningful description of the model |
  Properties  | Additional properties from the manufacturer |
  **Device** | **Device corresponds to a physical device present in the farm. Each device has a unique device ID** |
DeviceModelId  |ID of the associated device model. |
HardwareId   |Unique ID for the device such as MAC address etc.,  |
reportingInterval |Reporting interval in seconds |
Location    |Device latitude (-90 to +90)/longitude (-180 to 180)/elevation (in meters) |
ParentDeviceId | ID of the parent device to which this device is connected to. For example,. A node connected to a gateway; node will have parentDeviceID as the Gateway |
  Name  | Name to identify resource.  Device partners will need to send a name that is consistent with the device name on device partner side. If the device name is user-defined on device partner side, the same user-defined name should be propagated to FarmBeats  |
  Description  | Provide a meaningful description  |
  Properties  |Additional properties from the manufacturer  |
  **Sensor Model** | SensorModel corresponds to the metadata of the sensor such as the manufacturer, type of the sensor either analog or digital, sensor measure such as ambient temperature, pressure etc. |
  Type (analog, digital)  |Mention analog or digital sensor|
  manufacturer  | name of manufacturer |
  ProductCode  | Product code or model name/number. For example, RS-CO2-N01  |
  SensorMeasures > Name  | Name of the sensor measure. Only lower case is supported. For measure from different depths, specify the depth. For example, soil_moisture_15cm This name has to be consistent with the telemetry data. |
  sensorMeasures > DataType  | Telemetry data type. Currently double is supported  |
  sensorMeasures > Type  | Measurement type of the sensor telemetry data. Following are the system-defined types: AmbientTemperature, CO2, Depth, ElectricalConductivity, LeafWetness, Length, LiquidLevel, Nitrate, O2, PH, Phosphate, PointInTime, Potassium, Pressure, RainGauge, RelativeHumidity, Salinity, SoilMoisture, SoilTemperature, SolarRadiation, State, TimeDuration, UVRadiation, UVIndex, Volume, WindDirection, WindRun, WindSpeed, Evapotranspiration, PAR. To add more, refer to /ExtendedType API
  sensorMeasures > Unit | Unit of sensor telemetry data. Following are the system-defined  units: NoUnit, Celsius, Fahrenheit, Kelvin, Rankine, Pascal, Mercury, PSI, MilliMeter, CentiMeter, Meter, Inch, Feet, Mile, KiloMeter, MilesPerHour, MilesPerSecond, KMPerHour, KMPerSecond, MetersPerHour, MetersPerSecond, Degree, WattsPerSquareMeter, KiloWattsPerSquareMeter, MilliWattsPerSquareCentiMeter, MilliJoulesPerSquareCentiMeter, VolumetricWaterContent, Percentage, PartsPerMillion, MicroMol, MicroMolesPerLiter, SiemensPerSquareMeterPerMole, MilliSiemensPerCentiMeter, Centibar, DeciSiemensPerMeter, KiloPascal, VolumetricIonContent, Liter, MilliLiter, Seconds, UnixTimestamp, MicroMolPerMeterSquaredPerSecond, InchesPerHour To add more, refer to /ExtendedType API
  SensorMeasures > aggregationType  | Either of none, average, maximum, minimum, StandardDeviation
  SensorMeasures > depth  | The depth of the sensor in centimeters (For example, measure of moisture 10 cm under the ground)
  sensorMeasures > description  | Provide a meaningful description of the measure
  name  | Name to identify resource. For example, model name/product name
  description  | Provide a meaningful description of the model
  properties  | Additional properties from the manufacturer
  **Sensor**  |
  hardwareId  | Unique ID for the sensor set by manufacturer
  sensorModelId  | ID of the associated Sensor Model.
  location  | Sensor latitude (-90 to +90)/longitude (-180 to 180)/elevation (in meters)
  port > name  |Name and type of the port that the sensor is connected to on the device. This needs to be same name as defined in the device model
  deviceId  | ID of the device that the sensor is connected to
  name  | Name to identify resource. For example, sensor name/product name and model number/product code.
  description  | Provide a meaningful description
  properties  | Additional properties from the manufacturer

 For information on each of the objects and their properties, see [swagger](https://aka.ms/FarmBeatsDatahubSwagger).

 > [!NOTE]
 > The APIs return unique IDs for each instance created. This ID needs to be retained by the translator for device management and metadata sync.


**Metadata sync**

The Translator should send updates on the metadata. For example, of update scenarios are – change of device/sensor name, change of device/sensor location.

The Translator should have the ability to add new devices and/or sensors that have been installed by the user post linking of FarmBeats. Similarly, if a device/sensor has been updated by the user, the same should be updated in FarmBeats for the corresponding device/sensor. Typical scenarios for update device/sensor could be: change of device location, addition of sensors in a node etc.


> [!NOTE]
> Delete is not supported for device/sensor metadata.
>
> To update metadata, it is mandatory to call /Get/{id} on the device/sensor, update the changed properties and then do a /Put/{id} so that any properties set by the user is not lost

### Adding new types/unit

FarmBeats supports adding new sensor measure types and units. For more information about /ExtendedType API, [Swagger](https://aka.ms/FarmBeatsDatahubSwagger).

## Telemetry specifications

The telemetry data is mapped to a canonical message that is published on Azure Event Hub for processing. Azure EventHub is a service that enables real-time data (telemetry) ingestion from connected devices and applications.

## Send telemetry data to FarmBeats

To send telemetry data to FarmBeats, you will need to create a client that sends messages to an Event Hub in FarmBeats. For more information about telemetry data, see [sending telemetry to event hub](https://docs.microsoft.com/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send).

Here is a sample Python code that sends telemetry as a client to a specified Event Hub:

```python
import azure
from azure.eventhub import EventHubClient, Sender, EventData, Receiver, Offset
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

```

The canonical message format is as below:

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

```

All key names in the telemetry json should be lower case For example, deviceid, sensordata etc.

For example, Telemetry message:


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

## Troubleshoot/error management

**Troubleshoot option/support**

In the event that the customer is not able to receive Device data and/or telemetry in the FarmBeats instance specified, the device partner should provide support and a mechanism to troubleshoot the same.

**Telemetry data retention**

The Telemetry data should also be retained for a pre-defined time period so that the same can be useful in debugging or re-sending the telemetry in the event of error or data loss.

**Error management/error notification**

In the event of an error that affects the device/sensor metadata/data integration or telemetry data flow in the device partner system, the same should be notified to the customer. A mechanism to resolve the error(s) should also be designed and implemented.

**Connection checklist**

Device manufacturers/partners can have the following sanity test/checklist to ensure that the credentials provided by the customer are accurate.

   - Check if an access token is received with the credentials provided
   - Check if an API call succeeds with the access token received
   - Check if the EventHub client Connection is established

## Next steps

For more information about REST API, see [REST API](references-for-farmbeats.md#rest-api).
