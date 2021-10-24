---
title: Use the REST API to manage data export in Azure IoT Central
description: How to use the IoT Central REST API to manage data export in an application
author: v-krishnag
ms.author: v-krishnag
ms.date: 10/18/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to export data

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to [export data](howto-export-data.md) in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

## Data Export

You can use the IoT Central data export feature to  stream telemetry, property changes, device connectivity changes, device lifecycle changes, device template lifecycle changes to other destinations such as Azure Event Hubs, Azure Service Bus, Azure Blob Storage, and webhook endpoints.

### Create or update a destination

Use the following request to create or update a definition for where to send data.

```http
PUT https://{subdomain}.{baseDomain}/api/dataExport/destinations/{destinationId}?api-version=1.0
```

* destinationId - Unique ID for the destination.

The following example shows a request body that creates a destination with blob storage

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
* `type`:  Destination object which can be BlobStorageV1Destination (blobstorage@v1), DataExplorerV1Destination (dataexplorer@v1), EventHubsV1Destination (eventhubs@v1), ServiceBusQueueV1Destination (servicebusqueue@v1), ServiceBusTopicV1Destination (servicebustopic@v1), WebhookV1Destination (webhook@v1)
* `connectionString`: The connection string for accessing the Event Hubs namespace, including the `EntityPath` of the event hub.
* `containerName`: Name of the container where data should be written in the storage account.

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

### Get a destination by Id

Use the following request to retrieve details of a destination from your application:

```http
GET https://{subdomain}.{baseDomain}/api/dataExport/destinations/{destinationId}?api-version=1.0
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

### List destinations

Use the following request to retrieve a list of destinations from your application:

```http
GET https://{subdomain}.{baseDomain}/api/dataExport/destinations?api-version=1.0
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
                "connectionString": DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=********;EndpointSuffix=core.windows.net",
                "containerName": "central-data"
            },
            "status": "waiting"
        },
        {
            "id": "9742a8d9-c3ca-4d8d-8bc7-357bdc7f39d9",
            "displayName": "Webhook destination",
            "type": "webhook@v1",
            "url": "http://requestbin.net/r/f7x2i1ug",
            "headerCustomizations": {},
            "status": "error",
        }
        }
    ]
}
```

### Patch a destination

```http
PATCH https://{subdomain}.{baseDomain}/api/dataExport/destinations/{destinationId}?api-version=1.0
```

You can use this to perform an incremental update to an export. The sample request body looks like the following example which updates the `displayName` to a destination:

```json
{
  "displayName": "Blob Storage",
  "type": "blobstorage@v1",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=********;EndpointSuffix=core.windows.net",
  "containerName": "central-data"
}
```

The response to this request looks like the following example:

```json
{
    "id": "8dbcdb53-c6a7-498a-a976-a824b694c150",
    "displayName": "Blob Storage",
    "type": "blobstorage@v1",
    "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=********;EndpointSuffix=core.windows.net",
    "containerName": "central-data",
    "status": "waiting"
}   
```

### Delete a destination

Use the following request to delete a destination:

```http
DELETE https://{subdomain}.{baseDomain}/api/dataExport/destinations/{destinationId}?api-version=1.0
```

### Create or update an export

Use the following request to create or update a definition for exporting data

```http
PUT https://{subdomain}.{baseDomain}/api/dataExport/exports/{exportId}?api-version=1.0
```

The following example shows a request body that creates an export with telemetry source

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
* `destinations`: The list of destinations to which the export should send data.

There are some optional fields you can use to add more details to the export.

* `enrichments`: Additional pieces of information to include with each sent message. Data is represented as a set of key/value pairs, where the key is the name of the enrichment that will appear in the output message and the value identifies the data to send.
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

### Get an export by Id

Use the following request to retrieve details of an export from your application:

```http
GET https://{subdomain}.{baseDomain}/api/dataExport/exports/{exportId}?api-version=1.0
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

### List exports

Use the following request to retrieve a list of exports from your application:

```http
GET https://{subdomain}.{baseDomain}/api/dataExport/exports?api-version=1.0
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

### Patch an export

```http
PATCH https://{subdomain}.{baseDomain}/dataExport/exports/{exportId}?api-version=1.0
```

You can use this to perform an incremental update to an export. The sample request body looks like the following example which updates the `enrichments` to an export:

```json
{
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
    ]
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
            "value": "My"
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

### Delete an export

Use the following request to delete an export:

```http
DELETE https://{subdomain}.{baseDomain}/api/dataExport/destinations/{destinationId}?api-version=1.0
```

## Next steps

Now that you've learned how to manage data export with the REST API, a suggested next step is to [How to control devices with REST API.](howto-control-devices-with-rest-api.md)
