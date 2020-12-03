---
title: Get weather data from weather partners
description: This article describes how to get weather data from partners.
author: sunasing
ms.topic: article
ms.date: 03/31/2020
ms.author: sunasing
---

# Get weather data from weather partners

Azure FarmBeats helps you to bring weather data from your weather data providers by using a Docker-based Connector Framework. Using this framework, weather data providers implement a Docker that can be integrated with FarmBeats. Currently, the following weather data provider is supported.

  ![FarmBeats partners](./media/get-sensor-data-from-sensor-partner/dtn-logo.png)
  
   [DTN](https://www.dtn.com/dtn-content-integration/)

The weather data can be used to generate actionable insights and build AI or ML models in FarmBeats.

## Before you start

To get weather data, ensure that you have [installed FarmBeats](./install-azure-farmbeats.md). Weather integration is supported in versions 1.2.11 and higher. 

## Enable weather integration with FarmBeats

To start getting weather data on your FarmBeats Datahub:

1. Go to your FarmBeats Datahub Swagger `https://farmbeatswebsite-api.azurewebsites.net/swagger`.

2. Go to the /Partner API and then make a POST request. Use the following input payload:

   ```json
   {  
 
     "dockerDetails": {  
       "credentials": { 
         "username": "<credentials to access private docker - not required for public docker>", 
         "password": "<credentials to access private docker – not required for public docker>"  
       },  
       "imageName" : "<docker image name",
       "imageTag" : "<docker image tag, default:latest>",
       "azureBatchVMDetails": {  
         "batchVMSKU" : "<VM SKU. Default is standard_d2_v2>",  
         "dedicatedComputerNodes" : 1,
         "nodeAgentSKUID": "<Node SKU. Default is batch.node.ubuntu 18.04>"  
       }
     },
     "partnerCredentials": {  
       "key1": "value1",  
       "key2": "value2"  
     },  
     "partnerType": "Weather",  
     "name": "<Name of the partner>",  
     "description": "<Description>",
     "properties": {  }  
   }  
   ```

   For example, to get weather data from DTN, use the following payload. You can modify the name and description according to your preference.

   > [!NOTE]
   > The following step requires an API key. To get a key for your DTN subscription, contact DTN.

   ```json
   {
 
     "dockerDetails": {
       "imageName": "dtnweather/dtn-farm-beats",
       "imageTag": "latest",
       "azureBatchVMDetails": {
         "batchVMSKU": "standard_d2_v2",
         "dedicatedComputerNodes": 1,
         "nodeAgentSKUID": "batch.node.ubuntu 18.04"
       }
     },
     "partnerCredentials": {
      "apikey": "<API key from DTN>"
      },
     "partnerType": "Weather",
     "name": "dtn-weather",
     "description": "DTN registered as a Weather Partner in FarmBeats"
   }  
   ```

   > [!NOTE]
   > For more information about the partner object, see the [Appendix](get-weather-data-from-weather-partner.md#appendix) in this article.

   The preceding step will provision the resources to enable Docker to run in the customer's FarmBeats environment.  

   It takes about 10 to 15 minutes to provision the resources.

3. Check the status of the /Partner object that you created in the previous step. To do check the status, make a GET request on the /Partner API and check the status of the partner object. After FarmBeats provisions the partner successfully, the status is set to **Active**.

4. On the /JobType API, make a GET request. Check for the weather jobs that you created earlier, in the partner addition process. In the weather jobs, the **pipelineName** field has the following format: **partner-name_partner-type_job-name**.

      Now your FarmBeats instance has an active weather data partner. You can run jobs to request weather data for a particular location (latitude and longitude) and a date range. The job types will have details on what parameters are required to run weather jobs.

      For example, for DTN, the following job types will be created:
   
      - **get_dtn_daily_observations**: Get daily observations for a location and time period.
      - **get_dtn_daily_forecasts**: Get daily forecasts for a location and time period.
      - **get_dtn_hourly_observations**: Get hourly observations for a location and time period.
      - **get_dtn_hourly_forecasts**: Get hourly forecasts for a location and time period.

6. Make a note of the ID and the parameters of the job types.

7. Go to the /Jobs API and make a POST request on /Jobs. Use the following input payload:

   ```json
    {
         "typeId": "<id of the JobType>",
         "arguments": {
           "additionalProp1": {},
           "additionalProp2": {},
           "additionalProp3": {}
         },
         "name": "<name of the job>",
         "description": "<description>",
         "properties": {}
       }
   ```

   For example, to run **get_dtn_daily_observations**, use the following payload:

   ```json
   { 
         "typeId": "<id of the JobType>",
         "arguments": {
               "latitude": 47.620422,
               "longitude": -122.349358,
               "days": 5
         },
         "name": "<name of the job>",
         "description": "<description>",
         "properties": {}
   }
   ```

8. The preceding step runs the weather jobs as defined in the partner Docker and ingests weather data into FarmBeats. You can check the status of the job by making a GET request on /Jobs. In the response, look for **currentState**. When you finish, **currentState** is set to **Succeeded**.

## Query ingested weather data

After the weather jobs are complete, you can query ingested weather data to build models or actionable insights by using FarmBeats Datahub REST APIs.

To query weather data by using a FarmBeats REST API:

1. In your FarmBeats Datahub [Swagger](https://yourdatahub.azurewebsites.net/swagger), go to the /WeatherDataLocation API and make a GET request. The response includes /WeatherDataLocation objects created for the location (latitude and longitude) that the job run specified. Make a note of the **ID** and the **weatherDataModelId** of the objects.

2. Make a GET/{id} request on the /WeatherDataModel API for the **weatherDataModelId** as you did earlier. The weather data model shows all the metadata and details about the ingested weather data. For example, in the weather data model object, the weather measure details what weather information is supported and in what types and units. For example:

   ```json
   {
       "name": "Temperature <name of the weather measure - this is what we will receive as part of the queried weather data>",
       "dataType": "Double <Data Type - eg. Double, Enum>",
       "type": "AmbientTemperature <Type of measure eg. AmbientTemperature, Wind speed etc.>",
       "unit": "Celsius <Unit of measure eg. Celsius, Percentage etc.>",
       "aggregationType": "None <either of None, Average, Maximum, Minimum, StandardDeviation, Sum, Total>",
       "description": "<Description of the measure>"
   }
   ```

   Make a note of the response from the GET/{id} call for the weather data model.

3. Go to the Telemetry API and make a POST request. Use the following input payload:

   ```json
   {
       "weatherDataLocationId": "<id from step 1 above>",
     "searchSpan": {
       "from": "2020-XX-XXT07:30:00Z",
       "to": "2020-XX-XXT07:45:00Z"
     }
   }
   ```

    The response shows the weather data that's available for the specified time range:

   ```json
   {
     "timestamps": [
       "2020-XX-XXT07:30:00Z",
       "2020-XX-XXT07:45:00Z"
     ],
     "properties": [
       {
         "values": [
           "<id of the weatherDataLocation>",
           "<id of the weatherDataLocation>"
         ],
         "name": "Id",
         "type": "String"
       },
       {
         "values": [
           29.1,
           30.2
         ],
         "name": "Temperature <name of the WeatherMeasure as defined in the WeatherDataModel object>",
         "type": "Double <Data Type of the value - eg. Double>"
       }
     ]
   }
   ```

In the preceding example, the response shows data for two time stamps. It also shows the measure name (temperature) and values of the reported weather data in the two time stamps. Refer to the associated weather data model to interpret the type and unit of the reported values.

## Troubleshoot job failures

To troubleshoot job failures, [check the job logs](troubleshoot-azure-farmbeats.md#weather-data-job-failures).


## Appendix

|        Partner   |  Details   |
| ------- | -------             |
|     DockerDetails - imageName         |          Docker image name. For example, docker.io/mydockerimage (image in hub.docker.com) or myazureacr.azurecr.io/mydockerimage (image in Azure Container Registry) and so on. If no registry is provided, the default is hub.docker.com.      |
|          DockerDetails - imageTag             |         Tag name of the Docker image. The default is "latest".     |
|  DockerDetails - credentials      |  Credentials to access the private Docker. The partner provides the credentials.   |
|  DockerDetails - azureBatchVMDetails - batchVMSKU     |    Azure Batch VM SKU. For more information, see [all available Linux virtual machines](../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). <BR> <BR> Valid values are 'Small', 'ExtraLarge', 'Large', 'A8', 'A9', 'Medium', 'A5', 'A6', 'A7', 'STANDARD_D1', 'STANDARD_D2', 'STANDARD_D3', 'STANDARD_D4', 'STANDARD_D11', 'STANDARD_D12', 'STANDARD_D13', 'STANDARD_D14', 'A10', 'A11', 'STANDARD_D1_V2', 'STANDARD_D2_V2', 'STANDARD_D3_V2', 'STANDARD_D4_V2', 'STANDARD_D11_V2', 'STANDARD_D12_V2', 'STANDARD_D13_V2', 'STANDARD_D14_V2', 'STANDARD_G1', 'STANDARD_G2', 'STANDARD_G3', 'STANDARD_G4', 'STANDARD_G5', 'STANDARD_D5_V2', 'BASIC_A1', 'BASIC_A2', 'BASIC_A3', 'BASIC_A4', 'STANDARD_A1', 'STANDARD_A2', 'STANDARD_A3', 'STANDARD_A4', 'STANDARD_A5', 'STANDARD_A6', 'STANDARD_A7', 'STANDARD_A8', 'STANDARD_A9', 'STANDARD_A10', 'STANDARD_A11', 'STANDARD_D15_V2', 'STANDARD_F1', 'STANDARD_F2', 'STANDARD_F4', 'STANDARD_F8', 'STANDARD_F16', 'STANDARD_NV6', 'STANDARD_NV12', 'STANDARD_NV24', 'STANDARD_NC6', 'STANDARD_NC12', 'STANDARD_NC24', 'STANDARD_NC24r', 'STANDARD_H8', 'STANDARD_H8m', 'STANDARD_H16', 'STANDARD_H16m', 'STANDARD_H16mr', 'STANDARD_H16r', 'STANDARD_A1_V2', 'STANDARD_A2_V2', 'STANDARD_A4_V2', 'STANDARD_A8_V2', 'STANDARD_A2m_V2', 'STANDARD_A4m_V2', 'STANDARD_A8m_V2', 'STANDARD_M64ms', 'STANDARD_M128s', and 'STANDARD_D2_V3'. *The default is 'STANDARD_D2_V2'.*  |
|    DockerDetails - azureBatchVMDetails - dedicatedComputerNodes   |  Number of dedicated computer nodes per batch pool. The default value is 1. |
|    DockerDetails - azureBatchVMDetails - nodeAgentSKUID          |    Azure Batch node agent SKU ID. Currently, only the "batch.node.ubuntu 18.04" batch node agent is supported.    |
| DockerDetails - partnerCredentials | Credentials for calling the partner API in Docker. The partner provides this information based on the supported authorization mechanism; for example, username and password, or API keys. |
| partnerType | "Weather". Other partner types in FarmBeats are "Sensor" and "Imagery".  |
|  name   |   Desired name of the partner in the FarmBeats system.   |
|  description |  Description.   |

## Next steps

Now that you've queried sensor data from your Azure FarmBeats instance, learn how to [generate maps](generate-maps-in-azure-farmbeats.md#generate-maps) for your farms.