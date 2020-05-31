---
title: Get weather data from weather partners
description: This article describes how to get weather data from partners.
author: sunasing
ms.topic: article
ms.date: 03/31/2020
ms.author: sunasing
---

# Get weather data from weather partners

Azure FarmBeats helps you to bring weather data from your weather data provider(s) using a docker-based Connector Framework. Using this framework, weather data providers implement a docker that can be integrated with FarmBeats. Currently the following weather data providers are supported:

[NOAA data from Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/)

The weather data can be used to generate actionable insights and build AI/ML models on FarmBeats.

## Before you start

To get weather data, ensure that you have installed FarmBeats. **Weather integration is supported in version 1.2.11 or higher**. To install Azure FarmBeats, see [Install FarmBeats](https://aka.ms/farmbeatsinstalldocumentation).

## Enable weather integration with FarmBeats

To start getting weather data on your FarmBeats Data hub, follow the steps below:

1. Go to your FarmBeats Data hub swagger (https://yourdatahub.azurewebsites.net/swagger)

2. Navigate to /Partner API and make a POST request with the following input payload:

   ```json
   {  
 
     "dockerDetails": {  
       "credentials": { 
         "username": "<credentials to access private docker - not required for public docker>", 
         "password": "<credentials to access private docker – not required for public docker>"  
       },  
       "imageName" : "<docker image name. Default is azurefarmbeats/fambeats-noaa>",
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

   For example, to get weather data from NOAA by Azure Open Datasets, use the payload below. You can modify the name and description as per your preference.

   ```json
   {
 
     "dockerDetails": {
       "imageName": "azurefarmbeats/farmbeats-noaa",
       "imageTag": "latest",
       "azureBatchVMDetails": {
         "batchVMSKU": "standard_d2_v2",
         "dedicatedComputerNodes": 1,
         "nodeAgentSKUID": "batch.node.ubuntu 18.04"
       }
     },
     "partnerType": "Weather",
     "name": "ods-noaa",
     "description": "NOAA data from Azure Open Datasets registered as a Weather Partner"
   }  
   ```

   > [!NOTE]
   > For more information about the Partner object, see [Appendix](get-weather-data-from-weather-partner.md#appendix)

   The preceding step will provision the resources to enable docker to run in the customer's FarmBeats environment.  

   It takes about 10-15 minutes to provision the above resources.

3. Check the status of the /Partner object that you created in step 2. To do this, make a GET request on /Partner API and check for the **status** of the partner object. Once FarmBeats provisions the partner successfully, the status is set to **Active**.

4. Navigate to /JobType API and make a GET request on the same. Check for the weather jobs that are created as part of the Partner addition process in step 2. The **pipelineName** field in the weather jobs will be of the following format:
"partner-name_partner-type_job-name".

5. Now your FarmBeats instance has an active weather data partner and you can run jobs to request weather data for a particular location (latitude/longitude) and a date range. The JobType(s) will have details on what parameters are required to run weather jobs.

   For example, for NOAA data from Azure Open Datasets, following JobType(s) will be created:

   - get_weather_data (Get ISD/historical weather data)
   - get_weather_forecast_data (Get GFS/forecast weather data)

6. Make a note of the **ID** and the parameters of the JobType(s).

7. Navigate to /Jobs API and make a POST request on /Jobs with the following input payload:

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

   For example, to run **get_weather_data**, use the following payload:

   ```json
   {
 
         "typeId": "<id of the JobType>",
         "arguments": {
               "latitude": 47.620422,
               "longitude": -122.349358,
               "start_date": "yyyy-mm-dd",
               "end_date": "yyyy-mm-dd"
         },
         "name": "<name of the job>",
         "description": "<description>",
         "properties": {}
   }
   ```

8. The preceding step will run the weather jobs as defined in the partner docker and ingest weather data into FarmBeats. You can check the status of the job by making a GET request on /Jobs and look for **currentState** in the response. Once complete, the currentState is set to **Succeeded**.

## Query ingested weather data

After the weather jobs are complete, you can query ingested weather data to build models or actionable insights. There are two ways to access and query weather data from FarmBeats:

- API and
- Time Series Insights (TSI).

### Query using REST API

To query weather data using FarmBeats REST API, follow the steps below:

1. In your FarmBeats Data hub swagger (https://yourdatahub.azurewebsites.net/swagger), navigate to /WeatherDataLocation API and make a GET request. The response will have /WeatherDataLocation object(s) created for the location (latitude/longitude) that was specified as part of the job run. Make a note of the **ID** and the **weatherDataModelId** of the object(s).

2. Make a GET/{id} on /WeatherDataModel API for the **weatherDataModelId** as noted in step 1. The "Weather Data Model" has all the metadata and details about the ingested weather data. For example, **Weather Measure** within the **Weather Data Model** object has details about what weather information is supported and in what types and units. For example,

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

   Make a note of the response from the GET/{id} call for the Weather Data Model.

3. Navigate to **Telemetry** API and make a POST request with the following input payload:

   ```json
   {
       "weatherDataLocationId": "<id from step 1 above>",
     "searchSpan": {
       "from": "2020-XX-XXT07:30:00Z",
       "to": "2020-XX-XXT07:45:00Z"
     }
   }
   ```

4. The response containing weather data that is available for the specified time range will look like this:

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

In the preceding example, the response has data for two timestamps along with the measure name ("Temperature") and values of the reported weather data in the two timestamps. You will need to refer to the associated Weather Data Model (as described in step 2 above) to interpret the type and unit of the reported values.

### Query using Azure Time Series Insights (TSI)

FarmBeats uses [Azure Time Series Insights (TSI)](https://azure.microsoft.com/services/time-series-insights/) to ingest, store, query, and visualize data at IoT scale--data that's highly contextualized and optimized for time series.

Weather data is received on an EventHub and then pushed to a TSI environment within FarmBeats resource group. Data can then be directly queried from the TSI. For more information, see [TSI documentation](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-explorer).

Follow the steps to visualize data on TSI:

1. Go to **Azure portal** > **FarmBeats DataHub resource group** > select **Time Series Insights** environment (tsi-xxxx) > **Data Access Policies**. Add user with Reader or Contributor access.

2. Go to the **Overview** page of **Time Series Insights** environment (tsi-xxxx) and select the **Time Series Insights Explorer URL**. You can now visualize the ingested weather data.

Apart from storing, querying and visualization of weather data, TSI also enables integration to a Power BI dashboard. For more information, see [Visualize data from Time Series Insights in Power BI](https://docs.microsoft.com/azure/time-series-insights/how-to-connect-power-bi).

## Appendix

|        Partner   |  Details   |
| ------- | -------             |
|     DockerDetails - imageName         |          Docker image name. For example, docker.io/azurefarmbeats/farmbeats-noaa (image in hub.docker.com) OR myazureacr.azurecr.io/mydockerimage (image in Azure Container Registry) and so on. If no registry is provided, default is hub.docker.com      |
|          DockerDetails - imageTag             |         Tag name of the docker image. Default is "latest"     |
|  DockerDetails - credentials      |  Credentials to access the private docker. This will be provided by the partner to the customer   |
|  DockerDetails - azureBatchVMDetails - batchVMSKU     |    Azure Batch VM SKU. See [here](https://docs.microsoft.com/azure/virtual-machines/linux/sizes?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for all Linux virtual machines available. Valid values are: "Small', 'ExtraLarge', 'Large', 'A8', 'A9', 'Medium', 'A5', 'A6', 'A7', 'STANDARD_D1', 'STANDARD_D2', 'STANDARD_D3', 'STANDARD_D4', 'STANDARD_D11', 'STANDARD_D12', 'STANDARD_D13', 'STANDARD_D14', 'A10', 'A11', 'STANDARD_D1_V2', 'STANDARD_D2_V2', 'STANDARD_D3_V2', 'STANDARD_D4_V2', 'STANDARD_D11_V2', 'STANDARD_D12_V2', 'STANDARD_D13_V2', 'STANDARD_D14_V2', 'STANDARD_G1', 'STANDARD_G2', 'STANDARD_G3', 'STANDARD_G4', 'STANDARD_G5', 'STANDARD_D5_V2', 'BASIC_A1', 'BASIC_A2', 'BASIC_A3', 'BASIC_A4', 'STANDARD_A1', 'STANDARD_A2', 'STANDARD_A3', 'STANDARD_A4', 'STANDARD_A5', 'STANDARD_A6', 'STANDARD_A7', 'STANDARD_A8', 'STANDARD_A9', 'STANDARD_A10', 'STANDARD_A11', 'STANDARD_D15_V2', 'STANDARD_F1', 'STANDARD_F2', 'STANDARD_F4', 'STANDARD_F8', 'STANDARD_F16', 'STANDARD_NV6', 'STANDARD_NV12', 'STANDARD_NV24', 'STANDARD_NC6', 'STANDARD_NC12', 'STANDARD_NC24', 'STANDARD_NC24r', 'STANDARD_H8', 'STANDARD_H8m', 'STANDARD_H16', 'STANDARD_H16m', 'STANDARD_H16mr', 'STANDARD_H16r', 'STANDARD_A1_V2', 'STANDARD_A2_V2', 'STANDARD_A4_V2', 'STANDARD_A8_V2', 'STANDARD_A2m_V2', 'STANDARD_A4m_V2', 'STANDARD_A8m_V2', 'STANDARD_M64ms', 'STANDARD_M128s', 'STANDARD_D2_V3'. **Default is "standard_d2_v2"**  |
|    DockerDetails - azureBatchVMDetails - dedicatedComputerNodes   |  No. of dedicated computer nodes for batch pool. Default value is 1. |
|    DockerDetails - azureBatchVMDetails - nodeAgentSKUID          |    Azure Batch Node Agent SKU ID. Currently only "batch.node.ubuntu 18.04" batch node agent is supported.    |
| DockerDetails - partnerCredentials | credentials for calling partner API in docker. The partner needs to give this information to their customers based on the auth mechanism that is supported eg. Username/password or API Keys. |
| partnerType | "Weather" (Other partner types in FarmBeats are "Sensor" and "Imagery")  |
|  name   |   Desired name of the partner in FarmBeats system   |
|  description |  Description   |

## Next steps

You now have queried sensor data from your Azure FarmBeats instance. Now, learn how to [generate maps](generate-maps-in-azure-farmbeats.md#generate-maps) for your farms.
