---
title: Imagery partner integration
description: This article describes imagery partner integration.
author: RiyazPishori
ms.topic: article
ms.date: 11/04/2019
ms.author: riyazp
---

# Imagery partner integration

This article describes how to use the Azure FarmBeats Translator component to send imagery data to FarmBeats. Agricultural imagery data can be generated from various sources, such as multispectral cameras, satellites, and drones. Agricultural imagery partners can integrate with FarmBeats to provide customers with custom-generated maps for their farms.

Data, once available, can be visualized through the FarmBeats Accelerator and potentially be used for data fusion and machine learning/artificial intelligence (ML/AI) model building by agricultural businesses or customer system integrators.

FarmBeats provides the ability to:

- Define custom image types, source, and file format by using /ExtendedType APIs.
- Ingest imagery data from various sources via the /Scene and /SceneFile APIs.

The following information focuses on getting any form of imagery into the FarmBeats system.

When you select the **Drone Imagery** section, a pop-up opens to show a high-resolution image of the drone orthomosaic. You can access the partner software, which helps to plan drone flights and get raw data. You'll continue to use the partner's software for path planning and orthomosaic image stitching.

Drone partners need to enable customers to link their customer account with their FarmBeats instance on Azure.

You must use the following credentials in the drone partner software to link FarmBeats:

- API endpoint
- Tenant ID
- Client ID
- Client secret

## API development

The APIs contain Swagger technical documentation.

## Authentication

FarmBeats uses [Microsoft Entra ID](../../app-service/overview-authentication-authorization.md). Azure App Service provides built-in authentication and authorization support. 

For more information, see [Microsoft Entra ID](../../app-service/overview-authentication-authorization.md).   

FarmBeats Datahub uses bearer authentication, which needs the following credentials:

- Client ID
- Client secret
- Tenant ID

Using the previous credentials, the caller can request an access token, which needs to be sent in the subsequent API requests, in the header section, as follows:

```
headers = {"Authorization": "Bearer " + access_token, …} 
```

The following Python code sample retrieves the access token. You can then use the token for subsequent API calls to FarmBeats.

```python
import requests
import json
import msal

# Your service principal App ID
CLIENT_ID = "<CLIENT_ID>"
# Your service principal password
CLIENT_SECRET = "<CLIENT_SECRET>"
# Tenant ID for your Azure subscription
TENANT_ID = "<TENANT_ID>"

AUTHORITY_HOST = 'https://login.microsoftonline.com'
AUTHORITY = AUTHORITY_HOST + '/' + TENANT_ID

ENDPOINT = "https://<yourfarmbeatswebsitename-api>.azurewebsites.net"
SCOPE = ENDPOINT + "/.default"

context = msal.ConfidentialClientApplication(CLIENT_ID, authority=AUTHORITY, client_credential=CLIENT_SECRET)
token_response = context.acquire_token_for_client(SCOPE)
# We should get an access token here
access_token = token_response.get('access_token')
```

## HTTP request headers

Here are the most common request headers that need to be specified when you make an API call to FarmBeats Datahub.

**Header** | **Description and example**
--- | ---
Content-Type  | The request format (Content-Type: application/\<format\>). For FarmBeats Datahub APIs, the format is JSON. Content-Type: application/json
Authorization | Specifies the access token required to make an API call. Authorization: Bearer \<Access-Token\>
Accept  | The response format. For FarmBeats Datahub APIs, the format is JSON. Accept: application/json


## API requests

To make a REST API request, you combine:

- The HTTP method (GET, POST, and PUT).
- The URL to the API service.
- The resource URI (to query, submit data, update, or delete).
- One or more HTTP request headers.

Optionally, you can include query parameters on GET calls to filter, limit the size of, and sort the data in the responses.

The following sample request is to get the list of devices:

```bash
curl -X GET "https://microsoft-farmbeats.azurewebsites.net/Device" -H
"Content-Type: application/json" -H
"Authorization: Bearer <Access-Token>"
```

Most GET, POST, and PUT calls require a JSON request body.

The following sample request is to create a device. This sample has an input JSON with the request body.


```bash
curl -X POST "https://microsoft-farmbeats.azurewebsites.net/Device" -H
"accept: application/json" -H
"Content-Type: application/json" -H "Authorization: Bearer <Access-Token>" -d
"{  \"deviceModelId\": \"ID123\",  \"hardwareId\": \"MHDN123\",  \"reportingInterval\": 900,
\"name\": \"Device123\",  \"description\": \"Test Device 123\",}"
```

## Data format

JSON is a common language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see [JSON org](https://JSON.org).

## Ingest imagery into FarmBeats

After the partner has credentials to connect to FarmBeats Datahub, the partner takes the following steps in the Translator component.

1. Create a new extended type for the following fields, in accordance with the type of imagery to be uploaded:

   - **Scene Source**: For example, drone_partner_name
   - **Scene Type**: For example, drone
   - **Scene File Type**: For example, chlorophyll index
   - **Scene File Content Type**: For example, image/tiff

2. Call the /Farms API to get the list of farms from within the Azure FarmBeats system.

3. Provide the customer with an ability to choose a single farm from the list of farms.

   The partner system must show the farm within the partner software to do the path planning and drone flight and image collection.

4. Call the /Scene API and provide required details to create a new scene with a unique scene ID.

5. Receive a blob SAS URL to upload the required images into FarmBeats Datahub, in the context of the chosen farm, in the FarmBeats system.

Here's a detailed flow on the API calls.

### Step 1: ExtendedType

Check in the /ExtendedType API to see whether the type and file source are available on FarmBeats. To do so, call a GET on the /ExtendedType API.

Here are the system-defined values:

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

This step is a one-time setup. The scope of this new scene type is limited to the subscription in which the Azure FarmBeats is installed.

For example, to add SceneSource: "SlantRange," you do a PUT on the ID of the /ExtendedType API with the key "SceneSource" input payload.

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

The green field is the new addition to the system-defined scene source values.

### Step 2: Get farm details

The scenes (.tiff or .csv files) are in the context of a farm. You need to get the farm details by doing a GET on the /Farm API. The API returns the list of farms that are available in FarmBeats. You can select the farm you want to ingest the data for.

GET /Farm response:

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

### Step 3: Create a scene ID (POST call)

Create a new scene (.tiff or .csv file) with the given information, which provides the date, sequence, and farm ID with which the scene is associated. The metadata associated with the scene can be defined under properties, which includes the duration and type of measure.

Creating a new scene creates a new scene ID, which is associated with the farm. After the scene ID is created, the user can use the same to create a new file (.tiff or .csv) and store the contents of the file.

Example input payload for the POST call on the /Scene API:

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

**Create a scene file**

The scene ID returned in step 3 is the input for the scene file. The scene file returns an SAS URL token, which is valid for 24 hours.

If the user requires a programmatic way of uploading a stream of images, the blob storage SDK can be used to define a method by using the scene file ID, location, and URL.

Example input payload for the POST call on the /SceneFile API:

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

The POST call to the /SceneFile API returns an SAS upload URL, which can be used to upload the .csv or .tiff file by using the Azure Blob storage client or library.


## Next steps

For more information on REST API-based integration details, see [REST API](rest-api-in-azure-farmbeats.md).
