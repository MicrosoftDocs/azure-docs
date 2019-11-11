---
title: Imagery partner integration
description: Describes about imagery partner integration
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---

# Imagery partner integration

This article describes how to use the Azure FarmBeats Translator component to send imagery data to FarmBeats. Agricultural imagery data can be from various sources, including multispectral cameras, satellites, and drones. Agricultural imagery partners can integrate with FarmBeats to provide customers with custom-generated maps for their farms.

Data, once available, can be visualized through the FarmBeats Accelerator and potentially be used for data fusion and (Machine Learning/Artificial Intelligence) ML/AI model building by agricultural businesses, or customer system integrators.

FarmBeats provides the ability to:

- Define custom image types, source, file format using Extended Type APIs
- Ingest imagery data from various sources via the Scene & SceneFile APIs.

The below information focuses on getting any form of imagery into the FarmBeats system.

When you select the Drone Imagery section, a pop-up opens to show a high-resolution image of the drone orthomosaic. You can access the partner software, which helps to plan drone flights and get raw data. You'll continue to use the partner’s software for path planning and orthomosaic image stitching.

Drone partners need to enable customers, to link their customer account with their FarmBeats instance on Azure.

You must use the following credentials in the drone partner software for linking FarmBeats:

- API Endpoint
- Tenant ID
- Client ID
- Client Secret

## API development

The APIs contain Swagger technical documentation. Review [Swagger](https://aka.ms/FarmBeatsDatahubSwagger) for information about the APIs and corresponding requests/responses.

## Authentication

FarmBeats leverages Microsoft Azure’s [Active Directory]((https://docs.microsoft.com/azure/app-service/overview-authentication-authorization)). Authentication Azure App Service provides built-in authentication and authorization support. 

For more information about, see [Azure Active Directory](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization).   

FarmBeats Data hub uses bearer authentication, which needs the following credentials:

- Client ID
- Client Secret
- Tenant ID

Using the above credentials, the caller can request an access token, which needs to be sent in the subsequent API requests, in the header section as follows:

```
headers = {"Authorization": "Bearer " + access_token, …} 
```

Below is a Python code sample that retrieves the access token. You can then use the token for subsequent API calls to FarmBeat: 
 
import azure 

```python
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
```

## HTTP request headers

Here are the most common request headers that need to be specified when making an API call to FarmBeats Data hub:

**Header** | **Description and Example**
--- | ---
Content-Type  | The request format (Content-Type: application/<format>) For FarmBeats Data hub API's format is json. Content-Type: application/json
Authorization | Specifies the access token required to make an API call. Authorization: Bearer <Access-Token>
Accept  | The response format. For FarmBeats Data hub APIs the format is json  Accept: application/json


## API requests

To make a REST API request, you combine the HTTP method (GET/POST/PUT), the URL to the API service, the resource URI (to query, submit data, update, or delete), and one or more HTTP request headers.

Optionally, you can include query parameters on GET calls to filter, limit the size of, and sort the data in the responses.

The below sample request is to get the list of devices:

```bash
curl -X GET "https://microsoft-farmbeats.azurewebsites.net/Device" -H
"Content-Type: application/json" -H
"Authorization: Bearer <Access-Token>”
```

Most GET, POST, and PUT calls require a JSON request body.

The below sample request is to create a device (This has an input JSON with the request body).


```bash
curl -X POST "https://microsoft-farmbeats.azurewebsites.net/Device" -H  
"accept: application/json" -H  
"Content-Type: application/json" -H "Authorization: Bearer <Access-Token>" -d
"{  \"deviceModelId\": \"ID123\",  \"hardwareId\": \"MHDN123\",  \"reportingInterval\": 900,  
\"name\": \"Device123\",  \"description\": \"Test Device 123\",}"
```

## Data Format

JSON (JavaScript Object Notation) is a common, language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see [JSON org](https://JSON.org).

## Ingesting imagery into FarmBeats

After the partner has credentials to connect to the FarmBeats Data hub, the partner does the following in the Translator component:

1.	Create a new extended type for the following fields, in accordance with the type of imagery that will be uploaded:

    - Scene Source: For example, <drone_partner_name>
    - Scene Type: For example, <drone>
    - Scene File Type: For example, <chlorophyll index>
    - Scene File Content Type: For example, <image/tiff>

2.	Call the Farms API to get the list of Farms from within the Azure FarmBeats system.
3.	Provide the customer with an ability to choose a single farm from the list of Farms.

    The partner system must show the farm within the partner software to do the path planning and drone flight and image collection.

4.	Call the Scene API and provide required details to create a new Scene with a unique SceneID.
5.	Receive a Blob SAS URL to upload the required images into the FarmBeats data hub, in the context of the chosen farm, into the FarmBeats system.

Here is a detailed flow on the API calls:

### Step 1: ExtendedType

Check in the ExtendedType API, if the type and file source are available on FarmBeats. You can do this by calling a GET on the /ExtendedType API.

Following are the system defined values:

```json
{
  "items": [
    {
      "id": "ae2aa527-7d27-42e2-8fcf-841937c651d7",
      "createdAt": "2019-06-17T07:32:30.1135716Z",
      "lastModifiedAt": "2019-10-25T09:47:42.5910344Z",
      "key": "SceneFileType",
      "value": [
        "evi",
        "ndvi",
        "ndwi",
        "tci",
        "soil-moisture",
        "sensor-placement",
        "sentinel-b01",
        "sentinel-b02",
        "sentinel-b03",
        "sentinel-b04",
        "sentinel-b05",
        "sentinel-b06",
        "sentinel-b07",
        "sentinel-b08",
        "sentinel-b8a",
        "sentinel-b09",
        "sentinel-b10",
        "sentinel-b11",
        "sentinel-b12",
        "cloud-mask",
        "farm-mask",
        "image/tiff",
        "orthomosaic"
      ],
      "description": "List of scene file types available in system. User can add more values."
    },
    {
      "id": "b7824d2e-3e43-46d3-8fd4-ec7ba8918d84",
      "createdAt": "2019-06-17T07:32:30.1135716Z",
      "lastModifiedAt": "2019-10-25T09:45:44.8914691Z",
      "key": "SceneFileContentType",
      "value": [
        "image/tiff",
        "image/png",
        "image/jpeg",
        "text/csv",
        "text/plain",
        "text/tab-separated-values",
        "application/json",
        "application/octet-stream",
        "orthomosaic"
      ],
      "description": "List of scene file content types available in system. User can add more values."
    },
    {
      "id": "21d2924d-8b3e-4ce4-a7f8-318e85c0f7f2",
      "createdAt": "2019-06-17T07:32:30.1135716Z",
      "lastModifiedAt": "2019-10-25T09:45:37.5096445Z",
      "key": "SceneSource",
      "value": [
        "sentinel-l1c",
        "sentinel-l2a",
        "farmbeats-model",
        "dji",
        "SlantRange-3P",
        "DJI"
      ],
      "description": "List of scene sources available in system. User can add more values."
    },
    {
      "id": "6e09ca69-cacf-4b53-b63a-53c659aae4a4",
      "createdAt": "2019-06-17T07:32:30.1135716Z",
      "lastModifiedAt": "2019-10-25T09:45:34.7483899Z",
      "key": "SceneType",
      "value": [
        "base-bands",
        "sensor-placement",
        "soil-moisture",
        "evi",
        "ndwi",
        "ndvi",
        "drone",
        "orthomosaic-drone"
      ],
      "description": "List of scene types available in system. User can add more values."
    },
    {
      "id": "55d8436b-3a86-4bea-87ab-e1b51226525f",
      "createdAt": "2019-06-17T07:32:30.1135716Z",
      "lastModifiedAt": "2019-06-17T07:32:30.1135716Z",
      "key": "SensorMeasureType",
      "value": [
        "AmbientTemperature",
        "CO2",
        "Depth",
        "ElectricalConductivity",
        "LeafWetness",
        "Length",
        "LiquidLevel",
        "Nitrate",
        "O2",
        "PH",
        "Phosphate",
        "PointInTime",
        "Potassium",
        "Pressure",
        "RainGauge",
        "RelativeHumidity",
        "Salinity",
        "SoilMoisture",
        "SoilTemperature",
        "SolarRadiation",
        "State",
        "TimeDuration",
        "UVRadiation",
        "UVIndex",
        "Volume",
        "WindDirection",
        "WindRun",
        "WindSpeed",
        "Evapotranspiration",
        "PAR"
      ],
      "description": "List of sensor measure types available in system. User can add more values."
    },
    {
      "id": "0dfd6e6b-df58-428f-9ab8-a0674bfdcbe5",
      "createdAt": "2019-06-17T07:32:30.1135716Z",
      "lastModifiedAt": "2019-06-17T07:32:30.1135716Z",
      "key": "SensorMeasureUnit",
      "value": [
        "NoUnit",
        "Celsius",
        "Fahrenheit",
        "Kelvin",
        "Rankine",
        "Pascal",
        "Mercury",
        "PSI",
        "MilliMeter",
        "CentiMeter",
        "Meter",
        "Inch",
        "Feet",
        "Mile",
        "KiloMeter",
        "MilesPerHour",
        "MilesPerSecond",
        "KMPerHour",
        "KMPerSecond",
        "MetersPerHour",
        "MetersPerSecond",
        "Degree",
        "WattsPerSquareMeter",
        "KiloWattsPerSquareMeter",
        "MilliWattsPerSquareCentiMeter",
        "MilliJoulesPerSquareCentiMeter",
        "VolumetricWaterContent",
        "Percentage",
        "PartsPerMillion",
        "MicroMol",
        "MicroMolesPerLiter",
        "SiemensPerSquareMeterPerMole",
        "MilliSiemensPerCentiMeter",
        "Centibar",
        "DeciSiemensPerMeter",
        "KiloPascal",
        "VolumetricIonContent",
        "Liter",
        "MilliLiter",
        "Seconds",
        "UnixTimestamp",
        "MicroMolPerMeterSquaredPerSecond",
        "InchesPerHour"
      ],
      "description": "List of sensor measure units available in system. User can add more values."
    }
  ]
}
```

This will be a one-time setup, and the scope of this new scenetype is limited to the subscription in which FarmBeats project is deployed.

Example: To add SceneSource: “SlantRange”, you do PUT on the ID of the /ExtendedType with key: “SceneSource” Input payload:

```json
{

      "key": "SceneSource",
      "value": [
        "sentinel-l1c",
        "sentinel-l2a",
        "farmbeats-model",
        "dji",
        "SlantRange-3P"
      ],
      "description": "List of scene sources available in system. User can add more values."
}

```

Green field is the new addition to the system-defined scene source values.

### Step 2: Get FarmDetails

The scenes (tiff or .csv files) will be in the context of a farm. You need to get the farm details by doing a get on /Farm API. The API will return you the list of farms available in FarmBeats, and you can select the farm you want to ingest the data for.

Get /Farm response:

```json
{
  "id": "07f3e09c-89aa-4619-8d50-e57fb083d8f9",
  "createdAt": "2019-11-01T13:55:41.8804663Z",
  "lastModifiedAt": "2019-11-01T13:55:41.8804663Z",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          78.34252251428694,
          17.402556352862675
        ],
        [
          78.34278000635095,
          17.407920852463022
        ],
        [
          78.34883106989963,
          17.40878079576528
        ],
        [
          78.3498181228054,
          17.403539173730607
        ],
        [
          78.34805859369493,
          17.39977166504127
        ],
        [
          78.34252251428694,
          17.402556352862675
        ]
      ]
    ]
  },
  "name": "Samplefarm",
  "properties": {
    "crops": "Corn",
    "address": "Sample street"
  }
}
 ```

### Step 3: Create a/scene ID (post call)

Create a new scene (tiff or .csv file) with the given information, providing the date, sequence and farm ID with which the scene will be associated. The metadata associated with the scene can be defined under properties, including the duration and type of measure.

This creates a new SceneID, which will be associated with the farm. Once the SceneID is created, the user can use the same to create a new file (tiff or .csv) & store the content of the file.

Example input payload for the Post call on/Scene API

```json
{
  "sceneId": "a0505928-c480-491b-ba31-d38285a28c1d",
  "type": "newtype",
  "contentType": "image/tiff",
  "name": "test scene file",
  "description": "test scene file description",
  "properties": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  }
}
```

API response:

```json
{
  "id": "a0505928-c480-491b-ba31-d38285a28c1d",
  "createdAt": "2019-10-04T16:19:12.4838584Z",
  "lastModifiedAt": "2019-10-04T16:19:12.4838584Z",
  "type": "new type",
  "source": "SlantRange-3P",
  "farmId": "d41a33e7-b73e-480e-9279-0fcb3207332b",
  "date": "2019-10-04T16:13:39.064Z",
  "sequence": 5,
  "name": "test scene",
  "description": "test scene description",
  "properties": {}
}

```

**Create/SceneFile**

The Scene ID returned in step three is the input for the SceneFile. The SceneFile returns a SAS URL token, which is valid for 24 hours.

If the user requires a programmatic way of uploading a stream of images, the blob storage SDK can be used to define a method using the Scenefile ID, location & URL.

Example input payload for the Post call on /Scenefile API :

```json
{
  "sceneId": "a0505928-c480-491b-ba31-d38285a28c1d",
  "type": "newtype",
  "contentType": "image/tiff",
  "name": "test scene file",
  "description": "test scene file description",
  "properties": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  }
}
```
API Response:

```json
{
  "uploadSASUrl": "https://storagej2lho.blob.core.windows.net/farm-scene/2019/a0505928-c480-491b-ba31-d38285a28c1d/e91139a7-4ebd-4e2f-b17c-c677822dc840?sv=2018-03-28&sr=b&sig=%2F1426JkDcIFE5g3d%2BjOevCVMIn%2FJo9YKwBn3La5zL8Y%3D&se=2019-10-05T16%3A23%3A57Z&sp=w",
  "id": "e91139a7-4ebd-4e2f-b17c-c677822dc840",
  "createdAt": "2019-10-04T16:23:57.1192916Z",
  "lastModifiedAt": "2019-10-04T16:23:57.1192916Z",
  "blobUrl": "https://storagej2lho.blob.core.windows.net/farm-scene/2019/a0505928-c480-491b-ba31-d38285a28c1d/e91139a7-4ebd-4e2f-b17c-c677822dc840",
  "sceneId": "a0505928-c480-491b-ba31-d38285a28c1d",
  "type": "newtype",
  "contentType": "image/tiff",
  "name": "test scene file",
  "description": "test scene file description",
  "properties": {}
}


```

The Post call to /SceneFile API returns a SAS upload URL, which can be used to upload the csv or tiff file using the Azure Blob Storage client/library.


## Next steps

For more information on Rest API-based integration details, see [REST API](references-for-farmbeats.md#rest-api).
