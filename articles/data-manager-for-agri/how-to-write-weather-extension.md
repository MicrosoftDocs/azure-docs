---
title: Installing weather extension in Azure Data Manager for Agriculture
description: Provides guidance to use weather extension
author: lbethapudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 02/14/2023
ms.custom: template-how-to
---

# How to write a weather extension

In this section you'll see a step-by-step guide to write your own weather extension. 

## What is a weather extension

Weather extension in Data Manager for Agriculture is a manifest (JSON) file providing the complete details on the APIs and a template for each APIs response (output). Therefore, extension file is essentially an API template structure as defined by Data Manager for Agriculture, for it to understand the API input (request) and output (response) characteristics.

## Weather extension structure

At a high-level the extension file is a JSON consisting of two things:

* Provider metadata (JSON Object)
* API Information (JSON Array)

### Provider metadata

It's a json object providing the details on the below fields that are necessary to uniquely identify an extension and its versioning information. The details provided in this section of the extension will be shown to external customers in Data Manager for Agriculture marketplace. Therefore `extensionId` & `extensionName` (for easy identification) and `description` (for value-proposition) needs to be customer focused.

#### Sample provider metadata

```
"provider": {
    "extensionId": "abc.weather", 
    "extensionName": "ABC weather",
    "description": "Get Weather data from ABC weather into Azure Data Manager for Agriculture platform using this extension",
    "dataCategory": "Weather",
    "farmBeatsSchemaVersion": "1.0",
    "extensionVersion": "1.0",
    "supportUrl": "www.abc.com/support",
    "supportEmail": "support@abc.com"
  }
```

##### Provider metadata details

|Name | Type | Description|
|:-----:|:----:|----|
| extensionId | string | The ID provided in the fashion of organization name (ABC) and service (weather) Ex: `org.service`. extensionId is the unique identifier of the extension and the one which users will be using on the Data Manager for Agriculture platform to interact with the extension APIs|
| extensionName |  string | Name of the extension as to be used in Data Manager for Agriculture extension marketplace.|
| description | string | Description stating the capabilities and services offered by the extension.|
| dataCategory | string | For weather extensions use `weather`.|
| farmBeatsSchemaVersion | string | The version of the manifest file on the Data Manager for Agriculture side. Any updates to the existing manifest file will lead to a new version update to this field.|
| extensionVersion | string | The version of extension file. Starting with `1.0`. As there are updates to your extension file increment this version number according to the convention of major & minor updates.|
| supportUrl | string | Website link to raise support queries & FAQs|
| supportEmail | string | Email to send in the support queries.|

### API information

The API Information JSON array (`apiInfos`) can be further broken into the following structural elements

* API metadata
* Authentication parameters
* API input parameters
* Extracted API input parameters
* Functional parameters
* Units system
* Platform & Custom parameters
* Platform & Custom template

#### API metadata

This section consists of basic information regarding the API. It's used by Data Manager for Agriculture to identify the `apiName` (called by users explicitly) and redirect the api request to the right `endpoint` based on the appropriate `requestType`.

##### Sample API metadata

```
"apiInfos": [
    {
          "apiName": "dailyforecast",
          "description": "The Daily Forecast API",
          "endpoint": "https://ag.us.clearapis.com/v1.1/forecast/daily",
          "requestType": "GET",
          "isLoadAPI": "false",
          "typeOfData": "forecast",
          "granularity": "daily",
          "defaultUnitSystem": "us"
    }
]
```

##### API metadata details

|Name | Type | Description|
|:-----:|:----:|----|
| apiInfos |  array | The JSON array of objects, where each API is an object within `apiInfos` array.|
| apiName | string | The API Name as supported by the extension, this is the exact name using which the users would be calling into the extension APIs. Kindly follow the same naming convention as mentioned in your API documentation.|
| description |  string | API description|
| endpoint | string | API endpoint for Data Manager for Agriculture to call into the `apiName`.|
| requestType | string | `GET` or `POST` or `PUT` request type as supported by the `apiName`.|
| isLoadAPI | boolean | If the `apiName` is a pass-through API like current weather data, make this key as `false`. For all the load APIs (historical & forecast) keep this field as `true`. When the `isLoadAPI` key is `false`, the API response would be directly sent to the user and wouldn't be stored in the Data Manager for Agriculture storage service.|
| typeOfData | string | Currently supported values are `Historical` and `Forecast`.|
| granularity | string | Currently supported values are `Daily` and `Hourly`.|
| defaultUnitSystem | string | Provide the name of the default units system supported by the `apiName`.|

#### Authentication parameters

This section takes in the authentication related parameters as supported by the `apiName`. As Data Manager for Agriculture supports two types of auth-related keys (`x-ms-farmBeats-data-provider-id` & `x-ms-farmBeats-data-provider-key`) in the api header section, the extension file needs to explicitly provide the key name of its respective authentication keys as required by the `apiName`.

As Data Manager for Agriculture collects the authentication information via the api header (in the [Create Weather Job API](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/weather/create-data-delete-job)). Authentication parameter mapping is done to ensure that Data Manager for Agriculture can pass the key accordingly to the extension as required.

##### Sample authentication parameters

```
"apiInfos": [
    "authInputParameters": [
        {
          "farmBeatsAuthMapping": "x-ms-farmBeats-data-provider-id",
          "name": "app_id",
          "isRequired": "true",
          "providerDataType": "string",
          "description": "Provide the APP ID, username etc. that your API supports",
          "location": "apiQuery"
        },
        {
          "farmBeatsAuthMapping": "x-ms-farmBeats-data-provider-key",
          "name": "app_key",
          "isRequired": "true",
          "providerDataType": "string",
          "description": "Provide the API Key or password etc. that your API supports",
          "location": "apiQuery"
        }
      ]
]
```

##### Authentication parameters details

|Name | Type | Description|
|:-----:|:----:|----|
| authInputParameters | array | JSON array of authentication parameters, where each object signifies a type of authentication supported. Use the key based on the authentication type supported by your extension.|
| farmBeatsAuthMapping |  string | Currently two types of authentication related keys are supported. For API Key based authentication, use only `x-ms-farmBeats-data-provider-key` object, whereas for APP ID and APP Key based authentication use both `x-ms-farmBeats-data-provider-id` &`x-ms-farmBeats-data-provider-key` objects.|
| name | string | Name of the authentication key as supported by the `apiName`.|
| isRequired | boolean | Is this name a required parameter to the apiName. Provide true or false values.|
| providerDataType | string | Provide the datatype of the `name` parameter.|
| description | string | Data Manager for Agriculture description of what each of the `farmBeatsAuthMapping` means within each object.|
| location | string | Where in the API should the `name` parameter be sent. Currently supported values are `apiQuery` & `apiHeader`.|

#### API input parameters

This section provides the details about the API signature (input parameters) to successfully call into the `apiName`.

##### Sample API input parameters

```
"apiInfos": [
    "apiInputParameters": [
        {
          "name": "start",
          "isRequired": "true",
          "providerDataType": "double",
          "description": "Start of time range. Valid start values range from zero to nine. Day zero represents the current day.",
          "location": "apiQuery"
        },
        {
          "name": "end",
          "isRequired": "true",
          "providerDataType": "double",
          "description": "End of time range. Valid end values range from zero to nine.",
          "location": "apiQuery"
        },
        {
          "name": "location",
          "isRequired": "true",
          "providerDataType": "string",
          "description": "User-provided latitude and longitude coordinates. Formatted as location=[(<lat_1>,<lon_1>)].",
          "location": "apiQuery"
        },
        {
          "name": "unitcode",
          "isRequired": "false",
          "providerDataType": "string",
          "description": "Unit conversion set to be used. Default is us-std. Valid values are us-std, si-std.",
          "location": "apiQuery"
        },
      ]
]
```

##### API input parameters details

|Name | Type | Description|
|:-----:|:----:|----|
| apiInputParameters | array | JSON array of API input parameters, where each object signifies an input parameter supported by the `apiName`.|
| name |  string | Name of the input parameter as supported by the `apiName`.|
| isRequired | boolean | Is this name a required parameter to the apiName. Provide true or false values.|
| providerDataType | string | Provide the datatype of the `name` parameter.|
| description | string |  Provide a description of what `name` parameter means.|
| location | string | Where in the API should the `name` parameter be sent. Currently supported values are `apiQuery` & `apiHeader`.|

#### Extracted API input parameters

This section is for dedicated for Data Manager for Agriculture to extract certain set of input parameters passed during the API request for computation and storage purpose. In this example Data Manager for Agriculture would be extracting the location information (latitude and longitude) from the API Input request and store them as part of each weather output in Data Manager for Agriculture.

Hence the extension needs to provide a [**HandleBars template**](https://handlebarsjs.com/examples/simple-expressions.html) on how to extract location information. The below example suggests that the extension API collects location information as `"lat"` for `"latitude"` and `"lon"` for `"longitude"`.

##### Sample extracted API input parameters

```
"extractedApiInputParameters": [
        {
          "name": "location",
          "template": "{ \"latitude\": \"{{lat}}\", \"longitude\": \"{{lon}}\"  } "
        }
      ]
```

##### Extracted API input parameters details

|Name | Type | Description|
|:-----:|:----:|----|
| extractedApiInputParameters | array | JSON array of extraction functionalities, where each object signifies what information needs to be extracted by Data Manager for Agriculture. Currently `location` is one such extraction.|
| name |  string | Name of the extraction, currently the supported value will be `location` .|
| template | string |  HandleBars template depicting how is latitude and longitude information collected in the API input parameters.|

#### Functional parameters

This section is dedicated for the functionalities/capabilities built by Data Manager for Agriculture. In the case of weather extension, centroid calculation is one such functionality.

When users don't provide the latitude/longitude coordinates, Data Manager for Agriculture will be using the primary geometry of the field (ID passed by user) to compute the centroid. The computed centroid coordinates will be passed as the latitude and longitude to the extension (data provider). Hence for Data Manager for Agriculture to be able to understand the usage of location coordinates the functional parameters section is used.

For Data Manager for Agriculture to understand the usage of latitude and longitude in the `apiName` input parameters, the extension is expected to provide the `name` of key used for collecting location information followed by a **handlebar template** to imply how the latitude and longitude values need to be passed.

##### Sample functional parameters

```
"apiInfos": [
    "functionalParameters": [
        {
          "name": "CentroidCalculation",
          "description": "Provide names of the parameters used to collect latitude and longitude information",
          "functionalParameterEntities": [
            {
              "name": "lat",
              "template": "{ \"lat\": \"{{latitude}}\" } "
            },
            {
              "name": "lon",
              "template": "{ \"lon\": \"{{longitude}}\" } "
            }
          ]
        }
      ],
]
```

##### Functional parameters details

|Name | Type | Description|
|:-----:|:----:|----|
| functionalParameters | array | JSON array of functionalities, where each object signifies a functionality supported by Data Manager for Agriculture. Currently `CentroidCalculation` is one such functionality.|
| name |  string | Name of the functionality, currently the supported value will be `CentroidCalculation` .|
| description | string |  Data Manager for Agriculture description of functionality.|
| functionalParameterEntities | array | JSON array of objects, where each object is specific to the latitude & longitude.|

#### Units system

This section is used by Data Manager for Agriculture to understand the various types of unit systems supported by the extension. Hence the extension needs to provide the `key` name used for collecting units information in the API inputs and followed by the various units system names (Ex: us-std) as supported by the `apiName`.

##### Sample units system

```
"unitSystems": 
    {
        "key": "unitcode",
        "values": [
            "us-std",
            "si-std",
            "us-std-precise",
            "si-std-precise"
            ]
    }
```

##### Units system details

|Name | Type | Description|
|:-----:|:----:|----|
| unitSystems | object | JSON object to collect the unit system information.|
| key |  string | Name of the parameter used to collect the units information in the API input.|
| values | string |  List of units system names as supported by the extension.|

#### Platform & custom parameters

In each weather API response, the weather measures which are sent as part of the output (ex: temperature, dewpoint etc.) are called as parameters.

Hence, when it comes to parameters, Data Manager for Agriculture internally supports the following set of parameters and treats them as `Platform parameters`.

* cloudCover
* dateTime
* dewPoint
* growingDegreeDay
* precipitation
* pressure
* relativeHumidity
* soilMoisture
* soilTemperature
* temperature
* visibility
* wetBulbTemperature
* windChill
* windDirection
* windGust
* windSpeed

Therefore, any extension sending weather parameters which do not fall under the platform parameters, will be sending them as part of `Custom parameters`. The key difference between platform & customer parameters is that, the users using Data Manager for Agriculture weather APIs will be able to query and filter on the platform parameters (Ex: temperature > 30) and not on custom parameters. However, custom parameters will be sent as part of the weather query output.

In this section, the extension provides the units information for each of the parameters for every units system that is supported. This is done to ensure that Data Manager for Agriculture will know what is the underlying measurement unit for each weather parameter based on the information provided in this section of the extension.

> [!NOTE]
>
> * For a particular parameter if units are not applicable then do not mention the units for those alone (Ex: weatherDescriptor)
> * For a particular parameter if the units are same for all the units system then mention the same in all units system. (Ex: cloudCover)

##### Sample platform & custom parameters

```
"apiInfos": [
     "platformParameters": [
        {
          "farmBeatsName": "cloudCover",
          "farmBeatsDataType": "double",
          "description": "The average percentage of sky covered by clouds.",
          "measurementUnits": [
            {
              "unitSystem": "us-std",
              "unit": "%"
            },
            {
              "unitSystem": "us-std-precise",
              "unit": "%"
            },
            {
              "unitSystem": "si-std",
              "unit": "%"
            },
            {
              "unitSystem": "si-std-precise",
              "unit": "%"
            }
          ]
        },
        {
          "farmBeatsName": "dewPoint",
          "farmBeatsDataType": "double",
          "description": "The air temperature at which the air will become saturated, and dew moisture will condense into fog (or dew).",
          "measurementUnits": [
            {
              "unitSystem": "us-std",
              "unit": "F"
            },
            {
              "unitSystem": "us-std-precise",
              "unit": "F"
            },
            {
              "unitSystem": "si-std",
              "unit": "C"
            },
            {
              "unitSystem": "si-std-precise",
              "unit": "C"
            }
          ]
        },
    "customParameters": [
        {
          "providerName": "weatherDescriptor",
          "providerDataType": "string",
          "description": "General weather descriptor data"
        },
        {
          "providerName": "airTempMax",
          "providerDataType": "double",
          "description": "Maximum daily air temperature at two meters above ground level.",
          "measurementUnits": [
            {
              "unitSystem": "us-std",
              "unit": "F"
            },
            {
              "unitSystem": "us-std-precise",
              "unit": "F"
            },
            {
              "unitSystem": "si-std",
              "unit": "C"
            },
            {
              "unitSystem": "si-std-precise",
              "unit": "C"
            }
          ]
        },
]
```

##### Platform parameters details

|Name | Type | Description|
|:-----:|:----:|----|
| platformParameters | array | JSON array of platform parameters where each object is  one platform parameter.|
| farmBeatsName |  string | Name of the parameter as provided by Data Manager for Agriculture.|
| farmBeatsDataType | string |  Data type of the parameter as provided by Data Manager for Agriculture.|
| description | string |  Description of the parameter as provided by Data Manager for Agriculture.|
| measurementUnits | string |  JSON array of units for each of the unit system `values` supported by the extension.|
| unitSystem | string |  Unit system `value` as supported by the extension.|
| unit | string |  Unit of measurement for the specific weather parameter Ex: `F` for dewPoint.|

##### Custom parameters details

|Name | Type | Description|
|:-----:|:----:|----|
| customParameters | object | JSON array of custom parameters where each object is one custom parameter.|
| providerName |  string | Name of the parameter as provided by the extension.|
| providerDataType | string |  Data type of the parameter as provided by extension.|
| description | string |  Description of the parameter as provided by extension.|
| measurementUnits | string |  JSON array of units for each of the unit system `values` supported by the extension.|
| unitSystem | string |  Unit system `value` as supported by the extension.|
| unit | string |  Unit of measurement for the specific weather parameter Ex: `F` for airTempMax.|

#### Platform & custom template

Template is the mapping information provided by the extension to convert the extension API output (JSON response) to the format which Data Manager for Agriculture expects. This is done to ensure that various weather data providers having different API output formats can now be uniformly mapped/converted to one single format.

Template solution is found to be one of the most effective ways to parse the JSON output provided by the extension. In the case of weather extension, **Data Manager for Agriculture expects the extension to be written using [HandleBars](https://handlebarsjs.com/guide/#what-is-handlebars) template**. HandleBars is an open source templating language with simple to use expressions.

> [!NOTE]
> It is highly recommended to try-out the [HandleBars template](https://handlebarsjs.com/examples/simple-expressions.html) with the examples provided and learn how to make use of the helper functions to build your own parsing logic if it is not already provided by Data Manager for Agriculture.

On a high-level this is how templates will work, by taking the API response as the input and generating the output in the format expected by Data Manager for Agriculture.

>:::image type="content" source="./media/template-flow.png" alt-text="Screen Shot of template flow.":::

As shown in the above figure, validate your template against the respective API response and use the validated template in the extension. Below is an example of an API response and its respective platform and custom template.

##### Sample API response

```
{
    "47,-97": {
        "2016-12-15": {
            "overall": {
                "air_temp_avg": {
                    "unit": "F",
                    "value": -3.0
                },
                "air_temp_max": {
                    "unit": "F",
                    "value": 5.0
                },
                "air_temp_min": {
                    "unit": "F",
                    "value": -11.0
                },
                "cloud_cover_avg": {
                    "unit": "%",
                    "value": 26.4
                },
                "descriptors": {
                    "cloud_cover_descriptor": {
                        "code": 21107,
                        "icon": "https://.../cover_partlycloudyday.png",
                        "text": "Increasing Clouds"
                    },
                    "precipitation_descriptor": {
                        "code": 61113,
                        "icon": "https://.../precip_flurries.png",
                        "text": "Slight Chance of Flurries"
                    },
                    "weather_descriptor": {
                        "code": 61113,
                        "icon": "https://.../precip_flurries.png",
                        "text": "Slight Chance of Flurries"
                    },
                    "wind_direction_descriptor": {
                        "code": 51600,
                        "icon": "https://.../direction_sw.png",
                        "text": "Southwest"
                    },
                    "wind_trend_descriptor": {
                        "code": 10500,
                        "icon": "https://.../error_none.png",
                        "text": "None"
                    }
                },
                "dew_point_avg": {
                    "unit": "F",
                    "value": -11.0
                },
                "dew_point_max": {
                    "unit": "F",
                    "value": -4.0
                },
                "dew_point_min": {
                    "unit": "F",
                    "value": -19.0
                },
                "ice_acc_period": {
                    "unit": "in",
                    "value": 0.0
                },
                "liquid_acc_period": {
                    "unit": "in",
                    "value": 0.0
                },
                "long_wave_radiation_avg": {
                    "unit": "W/m^2",
                    "value": 170.0
                },
                "pet_period": {
                    "unit": "in",
                    "value": 0.009
                },
                "precip_acc_period": {
                    "unit": "in",
                    "value": 0.001
                },
                "precip_prob": {
                    "unit": "%",
                    "value": 10.0
                },
                "relative_humidity_avg": {
                    "unit": "%",
                    "value": 68.0
                },
                "relative_humidity_max": {
                    "unit": "%",
                    "value": 77.0
                },
                "relative_humidity_min": {
                    "unit": "%",
                    "value": 61.0
                },
                "short_wave_radiation_avg": {
                    "unit": "W/m^2",
                    "value": 70.0
                },
                "snow_acc_period": {
                    "unit": "in",
                    "value": 0.02
                },
                "sunshine_duration": {
                    "unit": "hours",
                    "value": 6
                },
                "wind_gust_max": {
                    "unit": "n/a",
                    "value": "n/a"
                },
                "wind_speed_2m_avg": {
                    "unit": "mph",
                    "value": 6.0
                },
                "wind_speed_2m_max": {
                    "unit": "mph",
                    "value": 8.0
                },
                "wind_speed_2m_min": {
                    "unit": "mph",
                    "value": 2.0
                },
                "wind_speed_avg": {
                    "unit": "mph",
                    "value": 8.0
                },
                "wind_speed_max": {
                    "unit": "mph",
                    "value": 11.0
                },
                "wind_speed_min": {
                    "unit": "mph",
                    "value": 3.0
                }
            }
        }
    }
}
```

##### Sample Platform & Custom template for the above API response

```json
{
"apiInfos": {
    "platformTemplate": "{ {{#each .}}\"value\": [{{#each .}} {\"cloudCover\": \"{{overall.cloud_cover_avg.value}}\" ,\"dewPoint\": \"{{overall.dew_point_avg.value}}\" ,\"precipitation\": \"{{overall.precip_acc_period.value}}\" ,\"relativeHumidity\": \"{{overall.relative_humidity_avg.value}}\" ,\"dateTime\": \"{{convertDateInYYYYMMDDToDateTime @key}}\",      \"temperature\": \"{{overall.air_temp_avg.value}}\" ,\"windSpeed\": \"{{overall.wind_speed_avg.value}}\" ,   },{{/each}}]{{/each}} }",
    "customTemplate": "{ {{#each .}}\"value\": [{{#each .}} {\"air_temp_max\": \"{{overall.air_temp_max.value}}\",\"air_temp_min\": \"{{overall.air_temp_min.value}}\",\"cloudCoverDescriptor\": \"{{overall.descriptors.cloud_cover_descriptor.text}}\",\"precipitationDescriptor\": \"{{overall.descriptors.precipitation_descriptor.text}}\",\"weatherDescriptor\": \"{{overall.descriptors.weather_descriptor.text}}\",\"windDirectionDescriptor\": \"{{overall.descriptors.wind_direction_descriptor.text}}\",\"windTrendDescriptor\": \"{{overall.descriptors.wind_trend_descriptor.text}}\",\"dewPointMax\": \"{{overall.dew_point_max.value}}\",\"dewPointMin\": \"{{overall.dew_point_min.value}}\",\"iceAccPeriod\": \"{{overall.ice_acc_period.value}}\",\"liquidAccPeriod\": \"{{overall.liquid_acc_period.value}}\",\"longWaveRadiationAvg\": \"{{overall.long_wave_radiation_avg.value}}\",\"petPeriod\": \"{{overall.pet_period.value}}\",\"precipProb\": \"{{overall.precip_prob.value}}\",\"relativeHumidityMax\": \"{{overall.relative_humidity_max.value}}\",\"relativeHumidityMin\": \"{{overall.relative_humidity_min.value}}\",\"shortWaveRadiationAvg\": \"{{overall.short_wave_radiation_avg.value}}\",\"snowAccPeriod\": \"{{overall.snow_acc_period.value}}\",\"sunshineDuration\": \"{{overall.sunshine_duration.value}}\",\"windSpeed2mAvg\": \"{{overall.wind_speed_2m_avg.value}}\",\"windSpeed2mMax\": \"{{overall.wind_speed_2m_max.value}}\",\"windSpeed2mMin\": \"{{overall.wind_speed_2m_min.value}}\",\"windSpeedMax\": \"{{overall.wind_speed_max.value}}\",\"windSpeedMin\": \"{{overall.wind_speed_min.value}}\",},{{/each}}]{{/each}} }"
}
}
```

> [!NOTE]
>
>The template generated from the HandleBars is stringified by adding `\"<text>\"` to make it compatible with the JSON format.

#### Helper functions

Helper functions are used by the templates to perform specific transformation on the data which isn't supported natively. Below are few helper functions that are supported by Data Manager for Agriculture.

##### Sample helper functions

```
Handlebars.registerHelper('splitAndTake', function(title, char, index) {
  var t = title.split(char);
  return t[index];
});
Handlebars.registerHelper('converttime', function(timestamp) {
    return new Date(timestamp);
});
Handlebars.registerHelper('convertunixtime', function(unix_timestamp) {
    return new Date(unix_timestamp * 1000);
});
```

What action these helper functions do?

* **SplitAndTake(object valueObject, string separator, int index)** - This function is used to split a string (Ex: "47,-97") based on a separator (Ex: ",") and takes the element at given index (Ex: index=0 gives "47")
* **ConvertDateInFormatToDateTime(object dateObject, string format)** - This function is used to parse a date in given format (Ex: 2016-12-15) to DateTime string.
* **ConvertUnixTimeToDateTime(object unixTimeStamp)** - This function is used to convert unix timestamp (Ex: 1392267600) to datetime string.
* **GetObjectFromListWithKeyValuePair(Array listOfObjects, string key, string value)** - Given a list of objects it fetches the object based on key (`type`) value (`RAIN`) pair.
In the below example, to pick the precipitation of `"type": "RAIN"` this function will be used.

```json
{
"precipitation": [
      {
        "type": "SNOW",
        "amount": 0
      },
      {
        "type": "RAIN",
        "amount": 0.01
      }
    ]
}
```

* **GetValueFromObject(string jsonString, string key)** - Given a json object as string, it gets the value based on key.

> [!NOTE]
> If the extension you are writing requires additional helper functions to parse the API response write to us at madma@microsoft.com
