---
title: REST API - Azure Event Grid IoT Edge | Microsoft Docs 
description: REST API on Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/18/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---


# A. Common API Behavior

## 1. Base URL
Event Grid on IoT Edge has the following APIs exposed over HTTP (port 5888) and HTTPS (port 4438).

Base URL for HTTP: http://eventgridmodule:5888

Base URL for HTTPS: https://eventgridmodule:4438

## 2. Request Query String
All API requests require the following query string parameter:

```?api-version=2019-01-01-preview```

## 3. Request Content Type
All API requests must have a Content-Type header with one of the following values:

```Content-Type: application/json```

```Content-Type: application/json; charset=utf-8```

## 4. Error Response
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

# B. Manage Topics

## 1. Put Topic (Create / Update)

### **Request: ``` PUT /topics/<topic_name>?api-version=2019-01-01-preview ```

Payload:
```json
{
    "name": "<topic_name>", // optional, inferred from URL. If specified must match URL topic_name
    "properties":
    {
        "inputSchema": "EventGridSchema | CustomEventSchema" // optional
    }
}
```

### **Response: HTTP 200

Payload:
```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
    "name": "<topic_name>",
    "type": "Microsoft.EventGrid/topics",
    "properties":
    {
        "endpoint": "<get_request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
        "inputSchema": "EventGridSchema | CustomEventSchema" // populated with EventGridSchema if not explicitly specified in PUT request
    }
}
```

## 2. Get Topic

### **Request: ``` GET /topics/<topic_name>?api-version=2019-01-01-preview ```

### **Response: HTTP 200

Payload:
```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
    "name": "<topic_name>",
    "type": "Microsoft.EventGrid/topics",
    "properties":
    {
        "endpoint": "<request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
        "inputSchema": "EventGridSchema | CustomEventSchema"
    }
}
```

## 3. Get All Topics

### **Request: ``` GET /topics?api-version=2019-01-01-preview ```

### **Response: HTTP 200

Payload:
```json
[
    {
        "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
        "name": "<topic_name>",
        "type": "Microsoft.EventGrid/topics",
        "properties":
        {
            "endpoint": "<request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
            "inputSchema": "EventGridSchema | CustomEventSchema"
        }
    },
    {
        "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>",
        "name": "<topic_name>",
        "type": "Microsoft.EventGrid/topics",
        "properties":
        {
            "endpoint": "<request_base_url>/topics/<topic_name>/events?api-version=2019-01-01-preview",
            "inputSchema": "EventGridSchema | CustomEventSchema"
        }
    }
]
```

## 4. Delete Topic

### **Request: ``` DELETE /topics/<topic_name>?api-version=2019-01-01-preview ```

### **Response: HTTP 200, empty payload

# C. Manage Event Subscriptions
Note that all the samples below are using EndpointType=Webhook; json samples for EndpointType=EdgeHub / EndpointType=EventGrid are laid out in the next section. 

## 1. Put Event Subscription (Create / Update)

### **Request: ``` PUT /topics/<topic_name>/eventSubscriptions/<subscription_name>?api-version=2019-01-01-preview ```

Payload:
```json
{
    "name": "<subscription_name>", // optional, inferred from URL. If specified must match URL subscription_name
    "properties":
    {
        "topicName": "<topic_name>", // optional, inferred from URL. If specified must match URL topic_name
        "eventDeliverySchema": "EventGridSchema | CustomEventSchema", // optional
        "retryPolicy":  //optional
        {
            "eventExpiryInMinutes": 120,
            "maxDeliveryAttempts": 50
        },
        "destination":
        {
            "endpointType": "WebHook",
            "properties":
            {
                "endpointUrl": "<webhook_url>"
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

### **Response: HTTP 200

Payload:
```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>/eventSubscriptions/<subscription_name>",
    "name": "<subscription_name>",
    "type": "Microsoft.EventGrid/eventSubscriptions",
    "properties":
    {
        "topicName": "<topic_name>",
        "eventDeliverySchema": "EventGridSchema | CustomEventSchema", // populated with EventGridSchema if not explicitly specified in PUT request
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
                "endpointUrl": "<webhook_url>"
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


## 2. Get Event Subscription

### **Request: ``` GET /topics/<topic_name>/eventSubscriptions/<subscription_name>?api-version=2019-01-01-preview ```

### **Response: HTTP 200

Payload:
```json
{
    "id": "/iotHubs/<iot_hub_name>/devices/<iot_edge_device_id>/modules/<eventgrid_module_name>/topics/<topic_name>/eventSubscriptions/<subscription_name>",
    "name": "<subscription_name>",
    "type": "Microsoft.EventGrid/eventSubscriptions",
    "properties":
    {
        "topicName": "<topic_name>",
        "eventDeliverySchema": "EventGridSchema | CustomEventSchema", // populated with EventGridSchema if not explicitly specified in PUT request
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
                "endpointUrl": "<webhook_url>"
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

## 3. Get Event Subscriptions

### **Request: ``` GET /topics/<topic_name>/eventSubscriptions?api-version=2019-01-01-preview ```

### **Response: HTTP 200
Payload:
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

## 4. Delete Event Subscription

### **Request: ``` DELETE /topics/<topic_name>/eventSubscriptions/<subscription_name>?api-version=2019-01-01-preview ```

### **Response: HTTP 200, no payload


D. Event Subscription Destinations

This section only shows the "destination" part of the event subscription json, refer to PUT/GET APIs above for the other parts.

## 1. Web Hook as Destination
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
                "endpointUrl": "<webhook_url>"
            }
        }
    }
}
```

Constraints on EndpointUrl:
- must be non-null
- must be an absolute URL
- if outbound__webhook__httpsOnly is set to true in EventGridModule settings: must be HTTPS only
- if outbound__webhook__httpsOnly set to false: can be HTTP or HTTPS

## 2. IoT Edge Hub as Destination

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

## 3. Event Grid (cloud) as Destination (User Topic)

Use this destination to send events to Event Grid in the cloud.
You'll need to first set up a user topic in the cloud to which events should be sent to, before creating an event subscription on the edge.

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
- must be non-null
- must be an absolute URL
- must have ```/api/events``` in request URL path
- must have ```api-version=2018-01-01``` in the query string
- if outbound__eventgrid__httpsOnly is set to true (true default): in EventGridModule settings: must be HTTPS only
- if outbound__eventgrid__httpsOnly set to false: can be HTTP or HTTPS
- if outbound__eventgrid__allowInvalidHostnames is set to false (false by default): must target one of: ```eventgrid.azure.net``` or ```eventgrid.azure.us``` or ```eventgrid.azure.cn```

SasKey:
- must be non-null

TopicName:
- if the Subscription.EventDeliverySchema is set to EventGridSchema, the value from this field is put into every event's Topic field before being forwarded to Event Grid in the cloud.
- if the Subscription.EventDeliverySchema is set to CustomEventSchema, this property is ignored and the custom event payload is forwarded exactly as it was received.

# E. Send Events API

## 1. Send Batch of Events (in Event Grid Schema)

### **Request: ``` POST /topics/<topic_name>/events?api-version=2019-01-01-preview ```

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

### **Response: HTTP 200, empty payload


### **Payload Field Descriptions**
- ```Id``` is mandatory, can be any string value that's populated by the caller, Event Grid does NOT do any duplicate detection or enforce any semantics on this field.
- ```Topic``` is optional, but if specified must match the topic_name from the request URL
- ```Subject``` is mandatory, can be any string value
- ```EventType``` is mandatory, can be any string value
- ```EventTime``` is mandatory, it's not validated but should be a proper DateTime.
- ```DataVersion``` is mandatory
- ```MetadataVersion``` is optional, if specified it MUST be a string with the value ```"1"```
- ```Data``` is optional, and can be any JSON token (number, string, boolean, array, object)

## 2. Send Batch of Events (in Custom Schema)

### **Request: ``` POST /topics/<topic_name>/events?api-version=2019-01-01-preview ```

```json
[
    {
        ...
    }
]
```

### **Response: HTTP 200, empty payload


### **Payload Restrictions**
- MUST be an array of events
- Each array entry MUST be a JSON object
- No other constraints (other than payload size)