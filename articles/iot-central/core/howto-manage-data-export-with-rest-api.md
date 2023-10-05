---
title: Use the REST API to manage data export in Azure IoT Central
description: How to use the IoT Central REST API to manage data export in an application. Export data to desinations such as blob storage, event hubs, and service bus.
author: dominicbetts
ms.author: dobett
ms.date: 06/13/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage data exports

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to create and manage [data exports](howto-export-to-blob-storage.md)
 in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

To learn how to manage data export by using the IoT Central UI, see [Export IoT data to Blob Storage.](../core/howto-export-to-blob-storage.md)

## Data export

You can use the IoT Central data export feature to stream telemetry, property changes, device connectivity events, device lifecycle events, and device template lifecycle events to destinations such as Azure Event Hubs, Azure Service Bus, Azure Blob Storage, and webhook endpoints.

Each data export definition can send data to one or more destinations. Create the destination definitions before you create the export definition.

### Create or update a destination

Use the following request to create or update a destination definition:

```http
PUT https://{your app subdomain}/api/dataExport/destinations/{destinationId}?api-version=2022-10-31-preview
```

`destinationId` is a  unique ID for the destination.

The following example shows a request body that creates a blob storage destination:

```json
{
  "displayName": "Blob Storage Destination",
  "type": "blobstorage@v1",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=********;EndpointSuffix=core.windows.net",
  "containerName": "central-data"
}
```

The request body has some required fields:

* `displayName`: Display name of the destination.
* `type`:  Type of destination object. One of: `blobstorage@v1`, `dataexplorer@v1`, `eventhubs@v1`, `servicebusqueue@v1`, `servicebustopic@v1`, `webhook@v1`.
* `connectionString`: The connection string for accessing the destination resource.
* `containerName`: For a blob storage destination, the name of the container where data should be written.

The response to this request looks like the following example:

```json
{
    "id": "8dbcdb53-c6a7-498a-a976-a824b694c150",
    "displayName": "Blob Storage",
    "type": "blobstorage@v1",
    "authorization": {
      "type": "connectionString",
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=*****;EndpointSuffix=core.windows.net",
      "containerName": "central-data"
    },
    "status": "waiting"
}
```

### Get a destination by ID

Use the following request to retrieve details of a destination from your application:

```http
GET https://{your app subdomain}/api/dataExport/destinations/{destinationId}?api-version=2022-10-31-preview
```

The response to this request looks like the following example:

```json
{
    "id": "8dbcdb53-c6a7-498a-a976-a824b694c150",
    "displayName": "Blob Storage",
    "type": "blobstorage@v1",
    "authorization": {
      "type": "connectionString",
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=*****;EndpointSuffix=core.windows.net",
      "containerName": "central-data"
    },
    "status": "waiting"
}
```

### List destinations

Use the following request to retrieve a list of destinations from your application:

```http
GET https://{your app subdomain}/api/dataExport/destinations?api-version=2022-10-31-preview
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "8dbcdb53-c6a7-498a-a976-a824b694c150",
            "displayName": "Blob Storage Destination",
            "type": "blobstorage@v1",
            "authorization": {
                "type": "connectionString",
                "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=********;EndpointSuffix=core.windows.net",
                "containerName": "central-data"
            },
            "status": "waiting"
        },
        {
            "id": "9742a8d9-c3ca-4d8d-8bc7-357bdc7f39d9",
            "displayName": "Webhook destination",
            "type": "webhook@v1",
            "url": "https://eofnjsh68jdytan.m.pipedream.net",
            "headerCustomizations": {},
            "status": "error"
        }
    ]
}
```

### Patch a destination

```http
PATCH https://{your app subdomain}/api/dataExport/destinations/{destinationId}?api-version=2022-10-31-preview
```

You can use this call to perform an incremental update to an export. The sample request body looks like the following example that updates the `connectionString` of a destination:

```json
{
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=********;EndpointSuffix=core.windows.net"
}
```

The response to this request looks like the following example:

```json
{
    "id": "8dbcdb53-c6a7-498a-a976-a824b694c150",
    "displayName": "Blob Storage",
    "type": "blobstorage@v1",
    "authorization": {
      "type": "connectionString",
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=*****;EndpointSuffix=core.windows.net",
      "containerName": "central-data"
    },
    "status": "waiting"
}
```

### Delete a destination

Use the following request to delete a destination:

```http
DELETE https://{your app subdomain}/api/dataExport/destinations/{destinationId}?api-version=2022-10-31-preview
```

### Create or update an export definition

Use the following request to create or update a data export definition:

```http
PUT https://{your app subdomain}/api/dataExport/exports/{exportId}?api-version=2022-10-31-preview
```

The following example shows a request body that creates an export definition for device telemetry:

```json
{
    "displayName": "Enriched Export",
    "enabled": true,
    "source": "telemetry",
    "enrichments": {
        "Custom data": {
            "value": "My value"
        }
    },
    "destinations": [
        {
            "id": "8dbcdb53-c6a7-498a-a976-a824b694c150"
        }
    ]
}
```

The request body has some required fields:

* `displayName`: Display name of the export.
* `enabled`: Toggle to start/stop an export from sending data.
* `source`: The type of data to export.
* `destinations`: The list of destinations to which the export should send data. The destination IDs must already exist in the application.

There are some optional fields you can use to add more details to the export.

* `enrichments`: Extra pieces of information to include with each sent message. Data is represented as a set of key/value pairs, where the key is the name of the enrichment that will appear in the output message and the value identifies the data to send.
* `filter`: Query defining which events from the source should be exported.

The response to this request looks like the following example:

```json
{
    "id": "6e93df53-1ce5-45e4-ad61-3eb0d684b3a5",
    "displayName": "Enriched Export",
    "enabled": true,
    "source": "telemetry",
    "enrichments": {
        "Custom data": {
            "value": "My value"
        }
    },
    "destinations": [
        {
            "id": "9742a8d9-c3ca-4d8d-8bc7-357bdc7f39d9"
        }
    ],
    "status": "starting"
}
```

#### Enrichments

There are three types of enrichment that you can add to an export: custom strings, system properties, and custom properties:

The following example shows how to use the `enrichments` node to add a custom string to the outgoing message:

```json
"enrichments": {
  "My custom string": {
    "value": "My value"
  },
  //...
}
```

The following example shows how to use the `enrichments` node to add a system property to the outgoing message:

```json
"enrichments": {
  "Device template": {
    "path": "$templateDisplayName"
  },
  //...
}
```

You can add the following system properties:

| Property | Description |
| -------- | ----------- |
| `$enabled` | Is the device enabled? |
| `$displayName` | The device name. |
| `$templateDisplayName` | The device template name. |
| `$organizations` | The organizations the device belongs to. |
| `$provisioned` | Is the device provisioned? |
| `$simulated` | Is the device simulated? |

The following example shows how to use the `enrichments` node to add a custom property to the outgoing message. Custom properties are properties defined in the device template the device is associated with:

```json
"enrichments": {
  "Device model": {
    "target": "dtmi:azure:DeviceManagement:DeviceInformation;1",
    "path": "model"
  },
  //...
}
```

#### Filters

You can filter the exported messages based on telemetry or property values.

The following example shows how to use the `filter` field to export only messages where the accelerometer-X telemetry value is greater than 0:

```json
{
  "id": "export-001",
  "displayName": "Enriched Export",
  "enabled": true,
  "source": "telemetry",
  "filter": "SELECT * FROM dtmi:azurertos:devkit:gsgmxchip;1 WHERE accelerometerX > 0",
  "destinations": [
    {
      "id": "dest-001"
    }
  ],
  "status": "healthy"
}
```

The following example shows how to use the `filter` field to export only messages where the `temperature` telemetry value is greater than the `targetTemperature` property:

```json
{
  "id": "export-001",
  "displayName": "Enriched Export",
  "enabled": true,
  "source": "telemetry",
  "filter": "SELECT * FROM dtmi:azurertos:devkit:gsgmxchip;1 AS A, dtmi:contoso:Thermostat;1 WHERE A.temperature > targetTemperature",
  "destinations": [
    {
      "id": "dest-001"
    }
  ],
  "status": "healthy"
}
```

### Get an export by ID

Use the following request to retrieve details of an export definition from your application:

```http
GET https://{your app subdomain}/api/dataExport/exports/{exportId}?api-version=2022-10-31-preview
```

The response to this request looks like the following example:

```json
{
    "id": "8dbcdb53-c6a7-498a-a976-a824b694c150",
    "displayName": "Blob Storage Destination",
    "type": "blobstorage@v1",
    "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=********;EndpointSuffix=core.windows.net",
    "containerName": "central-data",
    "status": "waiting"
}
```

### List export definitions

Use the following request to retrieve a list of export definitions from your application:

```http
GET https://{your app subdomain}/api/dataExport/exports?api-version=2022-10-31-preview
```

The response to this request looks like the following example:

```json
{
  "value": [
    {
      "id": "6e93df53-1ce5-45e4-ad61-3eb0d684b3a5",
      "displayName": "Enriched Export",
      "enabled": true,
      "source": "telemetry",
      "enrichments": {
        "Custom data": {
          "value": "My value"
        }
      },
      "destinations": [
        {
          "id": "9742a8d9-c3ca-4d8d-8bc7-357bdc7f39d9"
        }
      ],
      "status": "starting"
    },
    {
      "id": "802894c4-33bc-4f1e-ad64-e886f315cece",
      "displayName": "Enriched Export",
      "enabled": true,
      "source": "telemetry",
      "enrichments": {
        "Custom data": {
          "value": "My value"
        }
      },
      "destinations": [
        {
          "id": "9742a8d9-c3ca-4d8d-8bc7-357bdc7f39d9"
        }
      ],
      "status": "healthy"
    }
  ]
}
```

### Patch an export definition

```http
PATCH https://{your app subdomain}/dataExport/exports/{exportId}?api-version=2022-10-31-preview
```

You can use this call to perform an incremental update to an export. The sample request body looks like the following example that updates the `enrichments` to an export:

```json
{
    "enrichments": {
        "Custom data": {
            "value": "My value 2"
        }
    }
}
```

The response to this request looks like the following example:

```json
{
    "id": "6e93df53-1ce5-45e4-ad61-3eb0d684b3a5",
    "displayName": "Enriched Export",
    "enabled": true,
    "source": "telemetry",
    "enrichments": {
        "Custom data": {
            "value": "My value 2"
        }
    },
    "destinations": [
        {
            "id": "9742a8d9-c3ca-4d8d-8bc7-357bdc7f39d9"
        }
    ],
    "status": "healthy"
}
```

### Delete an export definition

Use the following request to delete an export definition:

```http
DELETE https://{your app subdomain}/api/dataExport/destinations/{destinationId}?api-version=2022-10-31-preview
```

## Next steps

Now that you've learned how to manage data export with the REST API, a suggested next step is to [How to use the IoT Central REST API to manage device templates](howto-manage-device-templates-with-rest-api.md).
