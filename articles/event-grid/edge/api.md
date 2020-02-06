---
title: REST API - Azure Event Grid IoT Edge | Microsoft Docs 
description: REST API on Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/03/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---


# REST API
This article describes the REST APIs of Azure Event Grid on IoT Edge

## Common API behavior

### Base URL
Event Grid on IoT Edge has the following APIs exposed over HTTP (port 5888) and HTTPS (port 4438).

* Base URL for HTTP: http://eventgridmodule:5888
* Base URL for HTTPS: https://eventgridmodule:4438

### Request query string
All API requests require the following query string parameter:

```?api-version=2019-01-01-preview```

### Request content type
All API requests must have a **Content-Type**.

In case of **EventGridSchema** or **CustomSchema**, the value of Content-Type can be one of the following values:

```Content-Type: application/json```

```Content-Type: application/json; charset=utf-8```

In case of **CloudEventSchemaV1_0** in structured mode, the value of Content-Type can be one of the following values:

```Content-Type: application/cloudevents+json```
    
```Content-Type: application/cloudevents+json; charset=utf-8```
    
```Content-Type: application/cloudevents-batch+json```
    
```Content-Type: application/cloudevents-batch+json; charset=utf-8```

In case of **CloudEventSchemaV1_0** in binary mode, refer to [documentation](https://github.com/cloudevents/spec/blob/master/http-protocol-binding.md) for details.

### Error response
All APIs return an error with the following payload:

```json
{
    "error":
    {
        "code": "<HTTP STATUS CODE>",
        "details": 
        {
            "code": "<Detailed Error Code>",
            "message": "..."
        }
    }
}
```

## Manage topics

### Put topic (create / update)

**Request**: ``` PUT /topics/<topic_name>?api-version=2019-01-01-preview ```

**Payload**:

```json
    {
        "name": "<topic_name>", // optional, inferred from URL. If specified must match URL topic_name
        "properties":
        {
            "inputSchema": "EventGridSchema | CustomEventSchema | CloudEventSchemaV1_0" // optional
        }
    }
```

**Response**: HTTP 200

**Payload**:

```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
    "name": "<topic_name>",
    "type": "Microsoft.EventGrid/topics",
    "properties":
    {
        "endpoint": "<get_request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
        "inputSchema": "EventGridSchema | CustomEventSchema | CloudEventSchemaV1_0" // populated with EventGridSchema if not explicitly specified in PUT request
    }
}
```

### Get topic

**Request**: ``` GET /topics/<topic_name>?api-version=2019-01-01-preview ```

**Response**: HTTP 200

**Payload**:
```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
    "name": "<topic_name>",
    "type": "Microsoft.EventGrid/topics",
    "properties":
    {
        "endpoint": "<request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
        "inputSchema": "EventGridSchema | CustomEventSchema | CloudEventSchemaV1_0"
    }
}
```

### Get all topics

**Request**: ``` GET /topics?api-version=2019-01-01-preview ```

**Response**: HTTP 200

**Payload**:
```json
[
    {
        "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
        "name": "<topic_name>",
        "type": "Microsoft.EventGrid/topics",
        "properties":
        {
            "endpoint": "<request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
            "inputSchema": "EventGridSchema | CustomEventSchema | CloudEventSchemaV1_0"
        }
    },
    {
        "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
        "name": "<topic_name>",
        "type": "Microsoft.EventGrid/topics",
        "properties":
        {
            "endpoint": "<request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
            "inputSchema": "EventGridSchema | CustomEventSchema | CloudEventSchemaV1_0"
        }
    }
]
```

### Delete topic

**Request**: ``` DELETE /topics/<topic_name>?api-version=2019-01-01-preview ```

**Response**: HTTP 200, empty payload

## Manage event subscriptions
Samples in this section use `EndpointType=Webhook;`. The json samples for `EndpointType=EdgeHub / EndpointType=EventGrid` are in the next section. 

### Put event subscription (create / update)

**Request**: ``` PUT /topics/<topic_name>/eventSubscriptions/<subscription_name>?api-version=2019-01-01-preview ```

**Payload**:
```json
{
    "name": "<subscription_name>", // optional, inferred from URL. If specified must match URL subscription_name
    "properties":
    {
        "topicName": "<topic_name>", // optional, inferred from URL. If specified must match URL topic_name
        "eventDeliverySchema": "EventGridSchema | CustomEventSchema | CloudEventSchemaV1_0", // optional
        "retryPolicy":  //optional
        {
            "eventExpiryInMinutes": 120,
            "maxDeliveryAttempts": 50
        },
        "persistencePolicy": "true",
        "destination":
        {
            "endpointType": "WebHook",
            "properties":
            {
                "endpointUrl": "<webhook_url>",
                "maxEventsPerBatch": 10, // optional
                "preferredBatchSizeInKilobytes": 1033 // optional
            }
        },
        "filter": // optional
        {
            "subjectBeginsWith": "...",
            "subjectEndsWith": "...",
            "isSubjectCaseSensitive": true|false,
            "includedEventTypes": ["...", "..."],
            "advancedFilters":
            [
                {
                    "OperatorType": "BoolEquals",
                    "Key": "...",
                    "Value": "..."
                },
                {
                    "OperatorType": "NumberLessThan",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberGreaterThan",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberLessThanOrEquals",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberGreaterThanOrEquals",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberIn",
                    "Key": "...",
                    "Values": [<number>, <number>, <number>]
                },
                {
                    "OperatorType": "NumberNotIn",
                    "Key": "...",
                    "Values": [<number>, <number>, <number>]
                },
                {
                    "OperatorType": "StringIn",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringNotIn",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringBeginsWith",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringEndsWith",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringContains",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                }
            ]
        }
    }
}
```

**Response**: HTTP 200

**Payload**:

```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>/eventSubscriptions/<subscription_name>",
    "name": "<subscription_name>",
    "type": "Microsoft.EventGrid/eventSubscriptions",
    "properties":
    {
        "topicName": "<topic_name>",
        "eventDeliverySchema": "EventGridSchema | CustomEventSchema  | CloudEventSchemaV1_0", // populated with EventGridSchema if not explicitly specified in PUT request
        "retryPolicy":  // only populated if specified in the PUT request
        {
            "eventExpiryInMinutes": 120,
            "maxDeliveryAttempts": 50
        },
        "destination":
        {
            "endpointType": "WebHook",
            "properties":
            {
                "endpointUrl": "<webhook_url>",
                "maxEventsPerBatch": 10, // optional
                "preferredBatchSizeInKilobytes": 1033 // optional
            }
        },
        "filter": // only populated if specified in the PUT request 
        {
            "subjectBeginsWith": "...",
            "subjectEndsWith": "...",
            "isSubjectCaseSensitive": true|false,
            "includedEventTypes": ["...", "..."],
            "advancedFilters":
            [
                {
                    "OperatorType": "BoolEquals",
                    "Key": "...",
                    "Value": "..."
                },
                {
                    "OperatorType": "NumberLessThan",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberGreaterThan",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberLessThanOrEquals",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberGreaterThanOrEquals",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberIn",
                    "Key": "...",
                    "Values": [<number>, <number>, <number>]
                },
                {
                    "OperatorType": "NumberNotIn",
                    "Key": "...",
                    "Values": [<number>, <number>, <number>]
                },
                {
                    "OperatorType": "StringIn",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringNotIn",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringBeginsWith",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringEndsWith",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringContains",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                }
            ]
        }
    }
}
```


### Get event subscription

**Request**: ``` GET /topics/<topic_name>/eventSubscriptions/<subscription_name>?api-version=2019-01-01-preview ```

**Response**: HTTP 200

**Payload**:
```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>/eventSubscriptions/<subscription_name>",
    "name": "<subscription_name>",
    "type": "Microsoft.EventGrid/eventSubscriptions",
    "properties":
    {
        "topicName": "<topic_name>",
        "eventDeliverySchema": "EventGridSchema | CustomEventSchema  | CloudEventSchemaV1_0", // populated with EventGridSchema if not explicitly specified in PUT request
        "retryPolicy":  // only populated if specified in the PUT request
        {
            "eventExpiryInMinutes": 120,
            "maxDeliveryAttempts": 50
        },
        "destination":
        {
            "endpointType": "WebHook",
            "properties":
            {
                "endpointUrl": "<webhook_url>",
                "maxEventsPerBatch": 10, // optional
                "preferredBatchSizeInKilobytes": 1033 // optional
            }
        },
        "filter": // only populated if specified in the PUT request 
        {
            "subjectBeginsWith": "...",
            "subjectEndsWith": "...",
            "isSubjectCaseSensitive": true|false,
            "includedEventTypes": ["...", "..."],
            "advancedFilters":
            [
                {
                    "OperatorType": "BoolEquals",
                    "Key": "...",
                    "Value": "..."
                },
                {
                    "OperatorType": "NumberLessThan",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberGreaterThan",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberLessThanOrEquals",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberGreaterThanOrEquals",
                    "Key": "...",
                    "Value": <number>
                },
                {
                    "OperatorType": "NumberIn",
                    "Key": "...",
                    "Values": [<number>, <number>, <number>]
                },
                {
                    "OperatorType": "NumberNotIn",
                    "Key": "...",
                    "Values": [<number>, <number>, <number>]
                },
                {
                    "OperatorType": "StringIn",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringNotIn",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringBeginsWith",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringEndsWith",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                },
                {
                    "OperatorType": "StringContains",
                    "Key": "...",
                    "Values": ["...", "...", "..."]
                }
            ]
        }
    }
}
```

### Get event subscriptions

**Request**: ``` GET /topics/<topic_name>/eventSubscriptions?api-version=2019-01-01-preview ```

**Response**: HTTP 200

**Payload**:
```json
[
    {
        // same event-subscription json as that returned from Get-EventSubscription above
    },
    {
    },
    ...
]
```

### Delete event subscription

**Request**: ``` DELETE /topics/<topic_name>/eventSubscriptions/<subscription_name>?api-version=2019-01-01-preview ```

**Response**: HTTP 200, no payload


## Publish events API

### Send batch of events (in Event Grid schema)

**Request**: ``` POST /topics/<topic_name>/events?api-version=2019-01-01-preview ```

```json
[
    {
        "id": "<user-defined-event-id>",
        "topic": "<topic_name>",
        "subject": "",
        "eventType": "",
        "eventTime": ""
        "dataVersion": "",
        "metadataVersion": "1",
        "data": 
            ...
    }
]
```

**Response**: HTTP 200, empty payload


**Payload field descriptions**
- ```Id``` is mandatory. It can be any string value that's populated by the caller. Event Grid does NOT do any duplicate detection or enforce any semantics on this field.
- ```Topic``` is optional, but if specified must match the topic_name from the request URL
- ```Subject``` is mandatory, can be any string value
- ```EventType``` is mandatory, can be any string value
- ```EventTime``` is mandatory, it's not validated but should be a proper DateTime.
- ```DataVersion``` is mandatory
- ```MetadataVersion``` is optional, if specified it MUST be a string with the value ```"1"```
- ```Data``` is optional, and can be any JSON token (number, string, boolean, array, object)

### Send batch of events (in custom schema)

**Request**: ``` POST /topics/<topic_name>/events?api-version=2019-01-01-preview ```

```json
[
    {
        ...
    }
]
```

**Response**: HTTP 200, empty payload


**Payload Restrictions**
- MUST be an array of events.
- Each array entry MUST be a JSON object.
- No other constraints (other than payload size).

## Examples

### Set up topic with EventGrid schema
Sets up a topic to require events to be published in **eventgridschema**.

```json
    {
        "name": "myeventgridtopic",
        "properties":
        {
            "inputSchema": "EventGridSchema"
        }
    }
```

### Set up topic with custom schema
Sets up a topic to require events to be published in `customschema`.

```json
    {
        "name": "mycustomschematopic",
        "properties":
        {
            "inputSchema": "CustomSchema"
        }
    }
```

### Set up topic with cloud event schema
Sets up a topic to require events to be published in `cloudeventschema`.

```json
    {
        "name": "mycloudeventschematopic",
        "properties":
        {
            "inputSchema": "CloudEventSchemaV1_0"
        }
    }
```

### Set up WebHook as destination, events to be delivered in eventgridschema
Use this destination type to send events to any other module (that hosts an HTTP endpoint) or to any HTTP addressable endpoint on the network/internet.

```json
{
    "properties":
    {
        "destination":
        {
            "endpointType": "WebHook",
            "properties":
            {
                "endpointUrl": "<webhook_url>",
                "eventDeliverySchema": "eventgridschema",
            }
        }
    }
}
```

Constraints on the `endpointUrl` attribute:
- It must be non-null.
- It must be an absolute URL.
- If outbound__webhook__httpsOnly is set to true in the EventGridModule settings, it must be HTTPS only.
- If outbound__webhook__httpsOnly set to false, it can be HTTP or HTTPS.

Constraints on the `eventDeliverySchema` property:
- It must match the subscribing topic's input schema.
- It can be null. It defaults to the topic's input schema.

### Set up IoT Edge as destination

Use this destination to send events to IoT Edge Hub and be subjected to edge hub's routing/filtering/forwarding subsystem.

```json
{
    "properties":
    {
        "destination":
        {
            "endpointType": "EdgeHub",
            "properties":
            {
                "outputName": "<eventgridmodule_output_port_name>"
            }
        }
    }
}
```

### Set up Event Grid Cloud as destination

Use this destination to send events to Event Grid in the cloud (Azure). You'll need to first set up a user topic in the cloud to which events should be sent to, before creating an event subscription on the edge.

```json
{
    "properties":
    {
        "destination":
        {
            "endpointType": "EventGrid",
            "properties":
            {
                "endpointUrl": "<eventgrid_user_topic_url>",
                "sasKey": "<user_topic_sas_key>",
                "topicName": "<new value to populate in forwarded EventGridEvent.Topic>" // if not specified, the Topic field on every event gets nulled out before being sent to Azure Event Grid
            }
        }
    }
}
```

EndpointUrl:
- It must be non-null.
- It must be an absolute URL.
- The path `/api/events` must be defined in the request URL path.
- It must have `api-version=2018-01-01` in the query string.
- If outbound__eventgrid__httpsOnly is set to true in the EventGridModule settings (true by default), it must be HTTPS only.
- If outbound__eventgrid__httpsOnly is set to false, it can be HTTP or HTTPS.
- If outbound__eventgrid__allowInvalidHostnames is set to false (false by default), it must target one of the following endpoints:
   - `eventgrid.azure.net`
   - `eventgrid.azure.us`
   - `eventgrid.azure.cn`

SasKey:
- Must be non-null.

TopicName:
- If the Subscription.EventDeliverySchema is set to EventGridSchema, the value from this field is put into every event's Topic field before being forwarded to Event Grid in the cloud.
- If the Subscription.EventDeliverySchema is set to CustomEventSchema, this property is ignored and the custom event payload is forwarded exactly as it was received.

## Set up Event Hubs as a destination

To publish to an Event Hub, set the `endpointType` to `eventHub` and provide:

* connectionString: Connection string for the specific Event Hub you're targeting generated via a Shared Access Policy.

    >[!NOTE]
    > The connection string must be entity specific. Using a namespace connection string will not work. You can generate an entity specific connection string by navigating to the specific Event Hub you would like to publish to in the Azure Portal and clicking **Shared access policies** to generate a new entity specific connecection string.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "eventHub",
              "properties": {
                "connectionString": "<your-event-hub-connection-string>"
              }
            }
          }
        }
    ```

## Set up Service Bus Queues as a destination

To publish to a Service Bus Queue, set the `endpointType` to `serviceBusQueue` and provide:

* connectionString: Connection string for the specific Service Bus Queue you're targeting generated via a Shared Access Policy.

    >[!NOTE]
    > The connection string must be entity specific. Using a namespace connection string will not work. Generate an entity specific connection string by navigating to the specific Service Bus Queue you would like to publish to in the Azure Portal and clicking **Shared access policies** to generate a new entity specific connecection string.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "serviceBusQueue",
              "properties": {
                "connectionString": "<your-service-bus-queue-connection-string>"
              }
            }
          }
        }
    ```

## Set up Service Bus Topics as a destination

To publish to a Service Bus Topic, set the `endpointType` to `serviceBusTopic` and provide:

* connectionString: Connection string for the specific Service Bus Topic you're targeting generated via a Shared Access Policy.

    >[!NOTE]
    > The connection string must be entity specific. Using a namespace connection string will not work. Generate an entity specific connection string by navigating to the specific Service Bus Topic you would like to publish to in the Azure Portal and clicking **Shared access policies** to generate a new entity specific connecection string.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "serviceBusTopic",
              "properties": {
                "connectionString": "<your-service-bus-topic-connection-string>"
              }
            }
          }
        }
    ```

## Set up Storage Queues as a destination

To publish to a Storage Queue, set the  `endpointType` to `storageQueue` and provide:

* queueName: Name of the Storage Queue you're publishing to.
* connectionString: Connection string for the Storage Account the Storage Queue is in.

    >[!NOTE]
    > Unline Event Hubs, Service Bus Queues, and Service Bus Topics, the connection string used for Storage Queues is not entity specific. Instead, it must but the connection string for the Storage Account.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "storageQueue",
              "properties": {
                "queueName": "<your-storage-queue-name>",
                "connectionString": "<your-storage-account-connection-string>"
              }
            }
          }
        }
    ```