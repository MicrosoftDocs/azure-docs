---
title: Weather partner integration
description: This article describes how a weather data provider can integrate with FarmBeats
author: sunasing
ms.topic: article
ms.date: 07/09/2020
ms.author: sunasing
---

# Weather partner integration

This article provides information about the Azure FarmBeats **Connector** docker component that weather data providers can develop to integrate with FarmBeats by leveraging its APIs and send weather data to 
FarmBeats. Once the data is available in FarmBeats, it can be used for data fusion and for building machine learning/artificial intelligence models.

 > [!NOTE]
 > For the purpose of this documentation, we will use a reference implementation built using NOAA from Azure Open Datasets and is available at [https://github.com/azurefarmbeats/noaa_docker](https://github.com/azurefarmbeats/noaa_docker).
 > The corresponding docker image is available at [https://hub.docker.com/r/azurefarmbeats/farmbeats-noaa](https://hub.docker.com/r/azurefarmbeats/farmbeats-noaa)

A weather partner will need to provide a docker image/program (with specifications mentioned below)
and host the docker image in a container registry that is accessible by customers. The weather partner will need to provide the following information to its customers:

- Docker Image URL
- Docker Image tag
- Keys/Credentials to access the docker image
- Customer-specific API Keys/Credentials to access the data from the weather partner’s system
- VM SKU details (Partners can provide this in case their docker has specific VM requirements, otherwise customers can choose from supported VM SKUs in Azure)

Using the above docker information, customer will register a weather partner in their FarmBeats instance. To know more about how customers can use the docker to ingest weather data in FarmBeats, see the guide to [get weather data](./get-weather-data-from-weather-partner.md)

## Connector docker development

**REST API-based integration**

The FarmBeats APIs contain Swagger technical documentation. For information on all the APIs and their
corresponding requests or responses, see [FarmBeats Swagger](https://aka.ms/farmbeatsswagger). 

If you have installed FarmBeats, you can access your FarmBeats swagger at `https://yourfarmbeatswebsitename-api.azurewebsites.net/swagger`

Note that “-api” is appended to your FarmBeats website name.
The API endpoint will be: `https://yourfarmbeatswebsitename-api.azurewebsites.net`

### Datahub lib

FarmBeats will provide a lib that can be used by the weather partner. The lib is currently available as part of the reference implementation [here](https://github.com/azurefarmbeats/noaa_docker/tree/master/datahub_lib). In future, the same will be available as an SDK for multiple languages.

### Authentication

**Authentication with FarmBeats APIs**

FarmBeats uses bearer authentication and the APIs can be accessed by providing an access token in the header section of the request as below:

```
headers = *{"Authorization": "Bearer " + access_token, …}*
```

The access token can be requested from an Azure Function that is running on the customer’s FarmBeats instance. The Azure Function URL will be provided to the docker program as an argument and the access token can be obtained by making a GET request on the URL. The response from the URL will contain the access token. The Datahub lib provides helper functions to enable partners to get the access token. More details [here](https://github.com/azurefarmbeats/noaa_docker/blob/master/datahub_lib/auth/partner_auth_helper.py).

The access token is valid only for few hours and needs to be re-requested when expired.

**Authentication with partner side APIs**

To enable customers to authenticate with the partner-side APIs during the docker execution, customers need to provide the credentials during Partner registration as follows:

```json
{
 "partnerCredentials": {
   "key1": "value1",
   "key2": "value2"
   }
}
```
The API service serializes this dict and stores it in a [KeyVault](../../key-vault/general/basic-concepts.md).

[Azure Data Factory](../../data-factory/introduction.md) is used to orchestrate weather jobs and spins up resources to execute the docker code. It also provides a mechanism to push data securely to the VM where the docker job executes. The API credentials, which are now securely stored in the KeyVault are read as secure strings from the KeyVault and made available as extended properties in the working directory of the docker container as activity.json (path to the file is "/mnt/working_dir/activity.json") The docker code can read the credentials from this file during run-time to access partner-side APIs on behalf of the customer. The credentials will be available in the file as follows:

```json
{ 
   "typeProperties" : {
      "extendedProperties" : { 
         "partnerCredentials": "" } 
   } 
}
```
Note that the “partnerCredentials” will be available in the exact way that was provided by the customer during Partner registration

The FarmBeats lib provides helper functions to enable partners to read the credentials from the activity properties. More details [here](https://github.com/azurefarmbeats/noaa_docker/blob/master/datahub_lib/auth/partner_adf_helper.py).

The lifetime of the file is only during the docker code execution and will be deleted after the docker run ends.

For more details on how ADF pipelines and activities work, see [https://docs.microsoft.com/azure/data-factory/copy-activity-schema-and-type-mapping](../../data-factory/copy-activity-schema-and-type-mapping.md).

**HTTP request headers**

Here are the most common request headers that need to be specified when you make an API call to FarmBeats.

**Header** | **Description and example**
--- | ---
Content-Type | The request format (Content-Type: application/<format>). For FarmBeats Datahub APIs, the format is JSON. Content-Type: application/json
Authorization | Specifies the access token required to make an API call. Authorization: Bearer <Access-Token>
Accept | The response format. For FarmBeats Datahub APIs, the format is JSON. Accept: application/json

## Data format

JSON is a common language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see [json.org](http://json.org).

## Docker specifications

The docker program needs to have two components: **Bootstrap** and **Jobs**. There can be more than one Job.

### Bootstrap

This component should execute when customer initiates the docker registration on FarmBeats. The arguments (arg1, arg2) that will be passed to this program are:

- FarmBeats API Endpoint: FarmBeats API endpoint for API requests: This is the endpoint for making API calls to the FarmBeats deployment.
- Azure Function URL: This is your own personal endpoint that will give you your access token for FarmBeats APIs. Just calling a GET on this url, will fetch you the access token in its response.

The responsibility of the bootstrap is to create the requisite metadata so that users can run your jobs to get weather data. Refer to the reference implementation [here](https://github.com/azurefarmbeats/noaa_docker). You can update the bootstrap_manifest.json file as per your needs and the reference bootstrap program will create the required metadata for you.

Following metadata are created as part of this process. 

 > [!NOTE]
 > **Please note** if you update the bootstrap_manifest.json file as mentioned in the [reference implementation](https://github.com/azurefarmbeats/noaa_docker), you don’t need to create the below metadata as the bootstrap will create the same based on your manifest file.

- /**WeatherDataModel**:  A WeatherDataModel is a model for representing weather data and corresponds to different data sets provided by the source. For example, a DailyForecastSimpleModel may provide average temperature, humidity, and precipitation info once a day whereas an DailyForecastAdvancedModel may provide much more information at hourly granularity. You can create any number of WeatherDataModels.
- /**JobType**: FarmBeats has an extensible job management system. As a weather data provider, you will have different datasets/APIs (For example GetDailyForecasts) - you can enable them in FarmBeats as JobType. Once a JobType is created, a customer can
trigger Jobs of that type to get weather data for their location/farm of interest (see JobType and Job APIs in [FarmBeats Swagger](https://aka.ms/farmbeatsswagger)).

### Jobs

This component will be invoked every time a FarmBeats user runs a job of your /JobType that you created as part of the bootstrap process. The docker run command for the job is defined as part of the **/JobType** that you created.
- The responsibility of the job will be to fetch data from the source and push it to FarmBeats. The parameters required to get the data should be defined as part of /JobType in the bootstrap process.
- As part of the job, the program will have to create a **/WeatherDataLocation** based on the /WeatherDataModel that was created as part of the bootstrap process. The **/WeatherDataLocation** corresponds to a location (lat/long) which is provided by the user as a parameter to the job.

### Details of the objects

  WeatherDataModel | Description |
  --- | ---
  Name  | Name of the weather data model |
  Description  | Provide a meaningful description of the model. |
  Properties  | Additional properties defined by the data provider. |
  weatherMeasures > Name  | Name of the weather measure. For example humidity_max |
  weatherMeasures > DataType  | either Double or Enum. If Enum, measureEnumDefinition is required |
  weatherMeasures > measureEnumDefinition  | Only required if DataType is Enum. For example { "NoRain": 0, "Snow": 1, "Drizzle": 2, "Rain": 3 } |
  weatherMeasures > Type  | type of weather telemetry data. For example “RelativeHumidity”. Following are the system-defined types: AmbientTemperature, NoUnit, CO2, Depth, ElectricalConductivity, LeafWetness, Length, LiquidLevel, Nitrate, O2, PH, Phosphate, PointInTime, Potassium, Pressure, RainGauge, RelativeHumidity, Salinity, SoilMoisture, SoilTemperature, SolarRadiation, State, TimeDuration, UVRadiation, UVIndex, Volume, WindDirection, WindRun, WindSpeed, Evapotranspiration, PAR. To add more, refer to the /ExtendedType API or in the [Add Types and Units section](weather-partner-integration-in-azure-farmbeats.md#add-extendedtype) below
  weatherMeasures > Unit | Unit of weather telemetry data. Following are the system-defined units: NoUnit, Celsius, Fahrenheit, Kelvin, Rankine, Pascal, Mercury, PSI, MilliMeter, CentiMeter, Meter, Inch, Feet, Mile, KiloMeter, MilesPerHour, MilesPerSecond, KMPerHour, KMPerSecond, MetersPerHour, MetersPerSecond, Degree, WattsPerSquareMeter, KiloWattsPerSquareMeter, MilliWattsPerSquareCentiMeter, MilliJoulesPerSquareCentiMeter, VolumetricWaterContent, Percentage, PartsPerMillion, MicroMol, MicroMolesPerLiter, SiemensPerSquareMeterPerMole, MilliSiemensPerCentiMeter, Centibar, DeciSiemensPerMeter, KiloPascal, VolumetricIonContent, Liter, MilliLiter, Seconds, UnixTimestamp, MicroMolPerMeterSquaredPerSecond, and InchesPerHour. To add more, refer to the /ExtendedType API or in the [Add Types and Units section](weather-partner-integration-in-azure-farmbeats.md#add-extendedtype) below.
  weatherMeasures > AggregationType  | Either of None, Average, Maximum, Minimum, StandardDeviation, Sum, Total
  weatherMeasures > Depth  | The depth of the sensor in centimeters. For example, the measurement of moisture 10 cm under the ground.
  weatherMeasures > Description  | Provide a meaningful description of the measurement. |
  **JobType** | **Description** |
  Name  | name of the Job - for example Get_Daily_Forecast; the job that customer will run to get weather data|
  pipelineDetails > parameters > name  | name of the parameter |
  pipelineDetails > parameters > type | either of String, Int, Float, Bool, Array |
  pipelineDetails > parameters > isRequired | boolean; true if required parameter, false if not; default is true |
  pipelineDetails > parameters > defaultValue | Default value of the parameter |
  pipelineDetails > parameters > description | Description of the parameter |
  Properties  | Additional properties from the manufacturer.
  Properties > **programRunCommand** | docker run command - this command will be executed when the customer runs the weather job. |
  **WeatherDataLocation** | **Description** |
  weatherDataModelId  | ID of the corresponding WeatherDataModel that was created during bootstrap|
  location  | represents latitude, longitude, and elevation |
  Name | Name of the object |
  Description | Description |
  farmId | **optional** ID of the farm - provided by customer as part of the job parameter |
  Properties  | Additional properties from the manufacturer.

 For information on each of the objects and their properties, see [Swagger](https://aka.ms/FarmBeatsSwagger).

 > [!NOTE]
 > The APIs return unique IDs for each instance created. This ID needs to be retained by the Translator for device management and metadata sync.

**Metadata sync**

The Connector docker should have the ability to send updates on the metadata. Examples of update scenarios are – Addition of new weather parameters in the weather provider’s dataset, Addition of functionality (eg. Addition of 30-Day Forecast)

> [!NOTE]
> Delete isn't supported for the metadata eg. weather data model.
>
> To update metadata, it's mandatory to call /Get/{ID} on the weather data model, update the changed properties, and then do a /Put/{ID} so that any properties set by the user aren't lost.

## Weather Data (Telemetry) specifications

The weather data is mapped to a canonical message that is pushed to an Azure Event Hub for processing. Azure Event Hubs is a service that enables real-time data (telemetry) ingestion from connected devices and applications. To send weather data to FarmBeats, you will need to create a client that sends messages to an event hub in FarmBeats. To know more about sending telemetry, refer to [Sending telemetry to an event hub](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)

Here's a sample Python code that sends telemetry as a client to a specified event hub.

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

The canonical message format is as follows:

```json
{
   "weatherstations": [
   {
   "id": "id of the WeatherDataLocation",
   "weatherdata": [
   {
     "timestamp": "timestamp of the data. For historical, this is the time for which the observations are sent. For forecast this is the time for which data is forecasted. Format is ISO 8601. Default time-zone is UTC",
     "predictiontimestamp": "timestamp on which the forecast data is predicted i.e time of prediction. Required only for forecast data. Format is ISO 8601. Default timezone is UTC ",
     "weathermeasurename1": <value>,
     "weathermeasurename2": <value>
     }
     ]
    }
   ]
}
```

For example, here's a telemetry message:

```json
{
   "weatherstations": [
   {
     "id": "5e4b34e7-bf9e-4f39-xxxx-f3c06d0366ea",
     "weatherdata": [
     {
      "timestamp": "2019-07-10T00:00:00Z",
      "predictiontimestamp": "2019-07-05T00:00:00Z",
      "PrecipitationTotalLiquidEquivalent": 0,
      "AvgPressure": 0,
      "AvgRelativeHumidity": 72
     }
    ] 
  }
 ]
}

```

## Troubleshooting and error management

**Error Logging**

Since the partner job will be running in the existing job framework – the errors get logged the same way as errors for other pre-existing jobs in FarmBeats (like GetFarmData, SensorPlacement etc.). The ADF activity running within the ADF pipeline logs both STDERR and STDOUT. Both files are available in the "datahublogs-xxx" storage account within the FarmBeats resource group.

The Datahub lib provides helper functions to enable logging as part of overall Datahub logs. More details [here](https://github.com/azurefarmbeats/noaa_docker/blob/master/datahub_lib/framework/logger.py).

**Troubleshoot option or support**

In the event that the customer is not able to receive weather data in the FarmBeats instance specified, the weather partner should provide support and a mechanism to troubleshoot the same.

## Add ExtendedType

FarmBeats supports adding new sensor measure types and units. Note that a weather partner can add new units/types by updating the bootstrap_manifest.json file in the reference implementation [here](https://github.com/azurefarmbeats/noaa_docker)

To add a new WeatherMeasure type, for example “PrecipitationDepth”, follow the steps below.

1. Make a GET request on /ExtendedType with the query filter - key = WeatherMeasureType
2. Note the ID of the returned object.
3. Add the new type to the list in the returned object and make a PUT request on the /ExtendedType{ID} with the following new list. The input payload should be the same as the response received above and the new unit appended at the end of the list of values.

For more information about the /ExtendedType API, see [Swagger](https://aka.ms/FarmBeatsSwagger).

## Next steps

Now you have a Connector docker that integrates with FarmBeats. Next you can see how to get weather data using your docker into FarmBeats. See [Get weather data](get-weather-data-from-weather-partner.md).
