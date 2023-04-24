---
title: Weather partner integration
description: Learn about how a weather data provider can integrate with FarmBeats.
author: sunasing
ms.topic: article
ms.date: 07/09/2020
ms.author: sunasing
---

# Weather partner integration with FarmBeats

This article provides information about the Azure FarmBeats Connector Docker component. As a weather data provider, you can use the Connector Docker to integrate with FarmBeats. Use its APIs to send weather data to 
FarmBeats. In FarmBeats, the data can be used for data fusion and for building machine learning models or artificial intelligence models.

 > [!NOTE]
 > In this article, we use a [reference implementation](https://github.com/azurefarmbeats/noaa_docker) that was built by using Azure Open Datasets and weather data from National Oceanic and Atmospheric Administration (NOAA). We also use the corresponding [Docker image](https://hub.docker.com/r/azurefarmbeats/farmbeats-noaa).

You must provide a [suitable Docker image or program](#docker-specifications)
and host the docker image in a container registry that customers can access. Provide the following information to your customers:

- Docker image URL
- Docker image tag
- Keys or credentials to access the Docker image
- Customer-specific API keys or credentials to access the data from your system
- VM SKU details (Provide these details if your Docker image has specific VM requirements. Otherwise, customers can choose from supported VM SKUs in Azure.)

Customers use this Docker information to register a weather partner in their FarmBeats instance. For more information about how customers can use the Docker to ingest weather data in FarmBeats, see [Get data from weather partners](./get-weather-data-from-weather-partner.md).

## Connector Docker development

**REST API-based integration**

The FarmBeats APIs contain Swagger technical documentation. 

If you've already installed FarmBeats, access your FarmBeats Swagger at `https://yourfarmbeatswebsitename-api.azurewebsites.net/swagger`

Notice that *-api* is appended to your FarmBeats website name. The API endpoint is `https://yourfarmbeatswebsitename-api.azurewebsites.net`

### Datahub lib

FarmBeats provides a lib that you can use. The lib is currently available as [part of the reference implementation](https://github.com/azurefarmbeats/noaa_docker/tree/master/datahub_lib). Later, it will be available as an SDK for multiple languages.

### Authentication

**Authentication with FarmBeats APIs**

FarmBeats uses bearer authentication. You can access the APIs by providing an access token in the header section of the request. Here's an example:

```
headers = *{"Authorization": "Bearer " + access_token, …}*
```

You can request the access token from an Azure Functions app that's running on the customer's FarmBeats instance. The Azure Functions URL is provided to the Docker program as an argument. You can get the access token by making a `GET` request on the URL. The response from the URL contains the access token. 

Use the helper functions in the Datahub lib to get the access token. For more information, see the [GitHub page for the NOAA Docker image](https://github.com/azurefarmbeats/noaa_docker/blob/master/datahub_lib/auth/partner_auth_helper.py).

The access token is valid only for few hours. When it expires, you must request it again.

**Authentication with partner-side APIs**

To authenticate with the partner-side APIs while the Docker job is running, customers need to provide the credentials during partner registration. Here's an example:

```json
{
 "partnerCredentials": {
   "key1": "value1",
   "key2": "value2"
   }
}
```
The API service serializes this dict and stores it in a [key vault](../../key-vault/general/basic-concepts.md).

[Azure Data Factory](../../data-factory/introduction.md) is used to orchestrate weather jobs. It spins up resources to run the Docker code. Data Factory also provides a mechanism to push data securely to the VM where the Docker job runs. The API credentials are then securely stored in the key vault. 

Credentials are read as secure strings from the key vault. They're provided as extended properties in the working directory of the Docker container. Their file path is */mnt/working_dir/activity.json*. 

The Docker code can read the credentials from *activity.json* during run time to access partner-side APIs for the customer. In the JSON file, the credentials look like this code example:

```json
{ 
   "typeProperties" : {
      "extendedProperties" : { 
         "partnerCredentials": "" } 
   } 
}
```
The `partnerCredentials` credential is available in the way that the customer provided it during partner registration.

The FarmBeats lib provides helper functions. Use these functions to read the credentials from the activity properties. For more information, see the [GitHub page for the NOAA Docker image](https://github.com/azurefarmbeats/noaa_docker/blob/master/datahub_lib/auth/partner_adf_helper.py).

The file is used only while the Docker code is running. After the code finishes, the file is deleted.

For more information about how Data Factory pipelines and activities work, see [Schema and data type mapping](../../data-factory/copy-activity-schema-and-type-mapping.md).

**HTTP request headers**

The following table shows the most common request headers that you need to specify when you make an API call to FarmBeats.

Header | Description and example
--- | ---
Content-Type | The request format. Example: `Content-Type: application/<format>` <br/>For FarmBeats Datahub APIs, the format is JSON. Example: ` Content-Type: application/json`
Authorization | The access token that's required to make an API call. Example: `Authorization: Bearer <Access-Token>`
Accept | The response format. For FarmBeats Datahub APIs, the format is JSON. Example: `Accept: application/json`

## Data format

JSON is a common language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see [JSON.org](https://json.org).

## Docker specifications

The Docker program needs two components: the bootstrap and the job. The program can have more than one job.

### Bootstrap

The bootstrap component should run when the customer starts the Docker registration on FarmBeats. The following arguments (`arg1` and `arg2`) are passed to the program:

- **FarmBeats API endpoint**: The FarmBeats API endpoint for API requests. This endpoint makes API calls to the FarmBeats deployment.
- **Azure Functions URL**: Your own endpoint. This URL provides your access token for FarmBeats APIs. You can call `GET` on this URL to fetch the access token.

The bootstrap creates the metadata that users need to run your jobs to get weather data. For more information, see the [reference implementation](https://github.com/azurefarmbeats/noaa_docker). 

If you customize the *bootstrap_manifest.json* file, then the reference bootstrap program will create the required metadata for you. The bootstrap program creates the following metadata: 

 > [!NOTE]
 > If you update the *bootstrap_manifest.json* file as the [reference implementation](https://github.com/azurefarmbeats/noaa_docker) describes, you don't need to create the following metadata. The bootstrap program will use your manifest file to create the necessary metadata.

- /**WeatherDataModel**: The WeatherDataModel metadata represents weather data. It corresponds to data sets that the source provides. For example, a DailyForecastSimpleModel might provide average temperature, humidity, and precipitation information once a day. By contrast, a DailyForecastAdvancedModel might provide much more information at hourly granularity. You can create any number of weather data models.
- /**JobType**: FarmBeats has an extensible job management system. As a weather data provider, you'll have various datasets and APIs (for example, GetDailyForecasts). You can enable these datasets and APIs in FarmBeats by using JobType. After a job type is created, a customer can
trigger jobs of that type to get weather data for their location or their farm of interest.

### Jobs

The Jobs component is invoked every time a FarmBeats user runs a job of the /JobType that you created as part of the bootstrap process. The Docker run command for the job is defined as part of the /JobType that you created.

The job fetches data from the source and pushes it to FarmBeats. During the bootstrap process, the parameters that are required to get the data should be defined as part of /JobType.

As part of the job, the program must create a /WeatherDataLocation based on the /WeatherDataModel that was created during the bootstrap process. The /WeatherDataLocation corresponds to a location (latitude and longitude coordinates) that the user provided as a parameter for the job.

### Object details

WeatherDataModel | Description |
--- | ---
Name  | Name of the weather data model. |
Description  | A meaningful description of the model. |
Properties  | Additional properties defined by the data provider. |
weatherMeasures > Name  | Name of the weather measure. For example, humidity_max. |
weatherMeasures > DataType  | Either Double or Enum. If Enum, measureEnumDefinition is required. |
weatherMeasures > measureEnumDefinition  | Required only if DataType is Enum. For example, `{ "NoRain": 0, "Snow": 1, "Drizzle": 2, "Rain": 3 }` |
weatherMeasures > Type  | Type of weather telemetry data. For example, RelativeHumidity. The system-defined types are AmbientTemperature, NoUnit, CO2, Depth, ElectricalConductivity, LeafWetness, Length, LiquidLevel, Nitrate, O2, PH, Phosphate, PointInTime, Potassium, Pressure, RainGauge, RelativeHumidity, Salinity, SoilMoisture, SoilTemperature, SolarRadiation, State, TimeDuration, UVRadiation, UVIndex, Volume, WindDirection, WindRun, WindSpeed, Evapotranspiration, and PAR. To add more types, see the [Add ExtendedType](#add-extendedtype) section in this article.
weatherMeasures > Unit | Unit of weather telemetry data. The system-defined units are NoUnit, Celsius, Fahrenheit, Kelvin, Rankine, Pascal, Mercury, PSI, MilliMeter, CentiMeter, Meter, Inch, Feet, Mile, KiloMeter, MilesPerHour, MilesPerSecond, KMPerHour, KMPerSecond, MetersPerHour, MetersPerSecond, Degree, WattsPerSquareMeter, KiloWattsPerSquareMeter, MilliWattsPerSquareCentiMeter, MilliJoulesPerSquareCentiMeter, VolumetricWaterContent, Percentage, PartsPerMillion, MicroMole, MicroMolesPerLiter, SiemensPerSquareMeterPerMole, MilliSiemensPerCentiMeter, Centibar, DeciSiemensPerMeter, KiloPascal, VolumetricIonContent, Liter, MilliLiter, Seconds, UnixTimestamp, MicroMolePerMeterSquaredPerSecond, and InchesPerHour. To add more units, see the [Add ExtendedType](#add-extendedtype) section in this article.
weatherMeasures > AggregationType  | The type of aggregation. Possible values are None, Average, Maximum, Minimum, StandardDeviation, Sum, and Total.
weatherMeasures > Depth  | The depth of the sensor in centimeters. For example, the measurement of moisture 10 cm under the ground.
weatherMeasures > Description  | A meaningful description of the measurement. 

JobType | Description |
--- | ---
Name  | Name of the job. For example, Get_Daily_Forecast. The customer will run this job to get weather data.|
pipelineDetails > parameters > name  | Name of the parameter. |
pipelineDetails > parameters > type | The parameter type. Possible values include String, Int, Float, Bool, and Array. |
pipelineDetails > parameters > isRequired | The parameter's Boolean value. The value is true if the parameter is required. Otherwise, the value is false. The default is true. |
pipelineDetails > parameters > defaultValue | Default value of the parameter. |
pipelineDetails > parameters > description | Description of the parameter. |
Properties  | Additional properties from the manufacturer.
Properties > programRunCommand | Docker run command. This command runs when the customer runs the weather job. |

WeatherDataLocation | Description |
--- | ---
weatherDataModelId  | ID of the corresponding WeatherDataModel that was created during the bootstrap process.|
location  | Latitude, longitude, and elevation. |
Name | Name of the object. |
Description | Description of the weather data location. |
farmId | (Optional) ID of the farm. The customer provides this ID as part of the job parameter. |
Properties  | Additional properties from the manufacturer.

> [!NOTE]
> The APIs return unique IDs for each instance that's created. The translator for device management and metadata sync needs to retain this ID.

**Metadata sync**

The Connector Docker component should be able to send updates on the metadata. For example, it should send updates when the weather provider adds new parameters to a dataset or when new functionality, such as a new 30-day forecast, is added.

> [!NOTE]
> Delete isn't supported for metadata in the weather data model.
>
> To update metadata, you have to call `/Get/{ID}` on the weather data model. Update the changed properties, and then do a `/Put/{ID}` to retain any properties that the user sets.

## Weather data (telemetry) specifications

Weather data is mapped to a canonical message that's pushed to an Azure event hub for processing. Azure Event Hubs is a service that enables real-time data (telemetry) ingestion from connected devices and applications. 

To send weather data to FarmBeats, create a client that sends messages to an event hub in FarmBeats. For more information, see [Sending telemetry to an event hub](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md).

The following sample Python code sends telemetry as a client to a specified event hub.

```python
import azure
from azure.eventhub import EventHubClient, Sender, EventData, Receiver, Offset
EVENTHUBCONNECTIONSTRING = "<EventHub connection string provided by customer>"
EVENTHUBNAME = "<EventHub name provided by customer>"

write_client = EventHubClient.from_connection_string(EVENTHUBCONNECTIONSTRING, eventhub=EVENTHUBNAME, debug=False)
sender = write_client.add_sender(partition="0")
write_client.run()
for i in range(5):
    telemetry = "<Canonical telemetry message>"
    print("Sending telemetry: " + telemetry)
    sender.send(EventData(telemetry))
write_client.stop()

```

Here's the canonical message format:

```json
{
   "weatherstations": [
   {
   "id": "ID of the WeatherDataLocation.",
   "weatherdata": [
   {
     "timestamp": "Timestamp of the data. For historical purposes, this is the time for which the observations are sent. For forecast, this is the time for which data is forecasted. Format is ISO 8601. Default time zone is UTC.",
     "predictiontimestamp": "Timestamp on which the forecast data is predicted. I.e., the time of prediction. Required only for forecast data. Format is ISO 8601. Default time zone is UTC. ",
     "weathermeasurename1": <value>,
     "weathermeasurename2": <value>
     }
     ]
    }
   ]
}
```

Here's an example of a telemetry message:

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

### Error logging

The partner job runs in the existing job framework. So the errors are logged the same way as errors for other preexisting FarmBeats jobs (like GetFarmData and SensorPlacement). The Data Factory activity that runs within the Data Factory pipeline logs both `STDERR` and `STDOUT`. Both files are available in the `datahublogs-xxx` storage account within the FarmBeats resource group.

The Datahub lib provides helper functions to enable logging as part of overall Datahub logs. For more information, see the [GitHub page for the NOAA Docker image](https://github.com/azurefarmbeats/noaa_docker/blob/master/datahub_lib/framework/logger.py).

### Troubleshooting and support

If the customer can't receive weather data in the FarmBeats instance, provide support and a mechanism to troubleshoot the problem.

## Add ExtendedType

FarmBeats supports adding new sensor measure types and units. You can add new units or types by updating the *bootstrap_manifest.json* file in the [reference implementation](https://github.com/azurefarmbeats/noaa_docker).

Follow these steps to add a new WeatherMeasure type, for example, PrecipitationDepth.

1. Make a `GET` request on /ExtendedType by using the query `filter - key = WeatherMeasureType`.
2. Note the ID of the returned object.
3. Add the new type to the list in the returned object. Make a `PUT` request on the /ExtendedType{ID} with the following new list. The input payload should be the same as the response that you received earlier. The new unit should be appended at the end of the list of values.

## Next steps

Now you have a Connector Docker component that integrates with FarmBeats. Next, find out how to [get weather data](get-weather-data-from-weather-partner.md) by using your Docker image in FarmBeats. 
