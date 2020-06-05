---
title: Use direct methods in Live Video Analytics on IoT Edge - Azure  
description: Live Video Analytics on IoT Edge exposes several direct methods. The direct methods are based on the conventions described in this topic.
ms.topic: conceptual
ms.date: 04/27/2020

---
# Direct methods

Live Video Analytics on IoT Edge exposes several direct methods that can be invoked from IoT Hub. Direct methods represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout). This approach is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond. For more information, see [Understand and invoke direct methods from IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-direct-methods).

This topic describes these methods and conventions.

## Conventions

The direct methods are based on the following conventions:

1. Direct methods have a version specified in MAJOR.MINOR format (as shown in the following example):

    ```
    {
        "methodName": "GraphTopologySet",
        "payload": {
            // API version matches matches module MAJOR.MINOR version
            "@apiVersion": "1.0"
            //payload here…
        }
    }
    ```

2. A given version of Live Video Analytics on IoT Edge module will support all the direct methods up-to its current version. For example, module version 1.3 will support direct methods with versions 1.3, 1.2, 1.1, and 1.0 versions.
3. All direct methods are synchronous.
4. Error results follow OData error schema.
5. Names should observe the following constraints:
    
    * Only alphanumeric characters and dashes as long as it doesn't start and end with a dash
    * No spaces
    * Max of 32 characters

### Example

```
{
  "status": 400,
  "payload": {
    "error": {
      "code": "BadRequest",
      "message": "Graph instance is not found."
    }
  }
}
```    

### Top-level error codes     

|Status	|Code	|Message|
|---|---|---|
|400|	BadRequest|	Request is not valid|
|400|	InvalidResource|	Resource is not valid|
|400|	InvalidVersion|	API version is not valid|
|402|	ConnectivityRequired	|Edge module requires cloud connectivity to properly function.|
|404|	NotFound	|Resource was not found|
|409|	Conflict|	Operation conflict|
|500|	InternalServerError|	Internal server error|
|503|	ServerBusy|	Server busy|

### Detailed error codes

Detailed validations error, such as graph module validations, are added as error details:

```
{
  "status": 400,
  "payload": {
    "error": {
      "code": "InvalidResource",
      "message": "The resource format is invalid.",
      "details": [
        {
          "code": "RtspEndpointUrlInvalidScheme",
          "target": "$.Properties.Sources[0]",
          "message": "Uri scheme 'http' is not valid for an RTSP source endpoint. Valid values are: rtsp"
        },
        {
          "code": "PropertyValueInvalidPattern",
          "target": "$.Properties.Sinks[0].AssetNamePattern",
          "message": "The value must match the regular expression '^[^<>%&:\\\\\\/?*+.']{1,260}$'"
        }
      ]
    }
  }
}
}
```

|Status|	Detailed code	|Description|
|---|---|---|
|400|	GraphValidationError|	General graph errors such as cycles or partitioning, etc.|
|400|	ModuleValidationError|	Module specific validation errors.|
|409|	GraphTopologyInUse|	Graph topology is still referenced by one or more graph instances.|
|409|	OperationNotAllowedInState|	Requested operation cannot be performed in the current state.|
|409|	ResourceValidationError|	Referenced resource (example: asset) is not in a valid state.|

## Details  

### GraphTopologyGet

This direct method retrieves a single graph topology.

#### Request

```
{
    "methodName": "GraphTopologyGet",
    "payload": {
        "@apiVersion": "1.0",
        "name": "CaptureAndRecord"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": {
        "name": "CaptureAndRecord",
        "properties": {
            // Complete graph topology
        }
    }
}
```

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Entity found|	200	|N/A
|General user errors	|400 range	||
|Entity not found	|404		||
|General server errors|	500 range		||

### GraphTopologySet

Creates a single topology if there is no existing one with the given name or updates and existing one with the same name.

Key aspects:

* Topology can be freely updated is there are no graph referencing it.
* Topology can be freely updated if all referencing graphs are deactivated as long as:

    * Newly added parameters have default values
    * Removed parameters are not referenced by any graph
* Topology updates are not allowed if there are active graphs

#### Request

```
{
    "methodName": "GraphTopologySet",
    "payload": {
        "@apiVersion": "1.0",
        "name": "CaptureAndRecord",
        "properties": {
            // Desired graph topology properties
        }
    }
}
```

#### Response

```
{
    "status": 201,
    "payload": {
        "name": " CaptureAndRecord ",
        "properties": {
            // Complete graph topology
        }
    }
}
```

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
Existing entity updated	|200|	N/A|
New entity created	|201|	N/A|
General user errors	|400 range	||
Graph Validation Errors	|400	|GraphValidationError|
Module Validation Errors|	400	|ModuleValidationError|
General server errors	|500 range	||

### GraphTopologyDelete

Deletes a single graph topology.

#### Request

```
{
    "methodName": "GraphTopologyDelete",
    "payload": {
        "@apiVersion": "1.0",
        "name": "CaptureAndRecord"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": null
}
```

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Entity deleted|	200|	N/A|
|Entity not found|	204|	N/A|
|General user errors|	400 range	||
|Graph topology is being referenced by one or more graph instances|	409	|GraphTopologyInUse|
|General server errors|	500 range	||

### GraphTopologyList

Retrieves a list of all the graph topologies that matches the filter criteria.

#### Request

```
{
    "methodName": "GraphTopologyList",
    "payload": {
        // Required
        "@apiVersion": "1.0",
        
        // Optional
        "@continuationToken": "xxxxx",    
        "@query": "$orderby=name asc"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": {
        "@continuationToken": "xxxx",
        "value": [
            {
                "name": "Capture & Record",
                // ...
            },
            {
                "name": "Capture, Analyze & Record",
                // ...
            }
        ]
    }
}
```

#### Filter support

|Operation		|Field(s)	|Operators|
|---|---|---|
|$orderby|name	|asc|


#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Success|	200	|N/A|
|General user errors|	400 range	||
|General server errors|	500 range	||

### GraphInstanceGet

Retrieves a single Graph Instance:

#### Request

```
{
    "methodName": "GraphInstanceGet",
    "payload": {
        "@apiVersion": "1.0",
        "name": "Camera001"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": {
        "name": "Camera001",
        "properties": {
            // Complete graph instance
        }
    }
}
```

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Entity found	|200|	N/A|
|General user errors|	400 range	||
|Entity not found|	404	||
|General server errors|	500 range	||

### GraphInstanceSet

Creates a single Graph Instance if there is no existing one with the given name or updates and existing one with the same name.

Key aspects:

* Graph Instance can be freely updated while in "Deactivated" state.

    * Graph is revalidated on every updated.
* Graph instance updates are partially restricted while the graph is not in the “Inactive” state.
* Graph instance updates are not allowed on active graphs.

#### Request

```
{
"methodName": "GraphInstanceSet",
    "payload": {
        "@apiVersion": "1.0",
        "name": "Camera001",
        "properties": {
            // Desired graph instance properties
        }
    }
}
```

#### Response

````
{
    "status": 201,
    "payload": {
        "name": " Camera001",
        "properties": {
            // Complete graph instance
        }	
    }
}
````

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Existing entity updated	|200	|N/A|
|New entity created|	201	|N/A|
|General user errors|	400 range	||
|Graph Validation Errors	|400|	GraphValidationError|
|Module Validation Errors|	400	|ModuleValidationError|
|Resource validation errors	|409	|ResourceValidationError|
|General server errors	|500 range||	

### GraphInstanceDelete

Deletes a single graph instance.

Key aspects:

* Only deactivated graphs can be deleted.

#### Request

```
{
    "methodName": "GraphInstanceDelete",
    "payload": {
        "@apiVersion": "1.0",
        "name": "Camera001"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": null
}
```

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Graph deleted successfully|	200|	N/A|
|Graph not found|	204|	N/A|
|General user errors	|400 range	||
|Graph is not in the "Stopped" state	|409	|OperationNotAllowedInState|
|General server errors|	500 range	||

### GraphInstanceList

This is similar to GraphTopologyList. It enables use to enumerate the graph instances.
Retrieves a list of all the graphs instances that matches the filter criteria.

#### Request

```
{
    "methodName": "GraphInstanceList",
    "payload": {
        // Required
        "@apiVersion": "1.0",
        
        // Optional
        "@continuationToken": "xxxxx",    
        "@query": "$orderby=name asc"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": {
        "@continuationToken": "xxxx",
        "value": [
            {
                "name": "Capture & Record",
                // ...
            },
            {
                "name": "Capture, Analyze & Record",
                // ...
            }
        ]
    }
}
```

#### Filter support

|Operation	|	Field(s)|	Operators|
|---|---|---|
|$orderby|	name|	asc|

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Success	|200	|N/A|
|General user errors|	400 range	||
|General server errors|	500 range	||

### GraphInstanceActivate

Activates a single graph instance. 

Key aspects

* Method only returns when graph is activated 
* Graph assumes the “Activating” state while being activated.

    * A List/Get operation on the graph would return the graph on the proper state.
* Idempotency:

    * Starting a graph on “Activating” state behaves the same way as if the graph was deactivated (that is: call blocks until graph is activated)
    * Activating a graph on “Active” state returns successfully immediately.

#### Request

```
{
    "methodName": "GraphInstanceActivate",
    "payload": {
        "@apiVersion": "1.0",
        "name": "Camera001"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": null
}
```

#### Status codes

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Graph activated successfully	|200	|N/A|
|New entity created	|201|	N/A|
|General user errors	|400 range	||
|Module validation errors	|400|	ModuleValidationError|
|Resource validation errors|	409|	ResourceValidationError|
|Graph is in deactivating state	|409	|OperationNotAllowedInState|
|General server errors|	500 range	||

### GraphInstanceDeactivate

Deactivates a single graph instance. Deactivating a graph gracefully deactivates the media processing and ensures that all events and media transiently stored on edge is committed to cloud, whenever applicable.

Key aspects:

* Method only returns when graph is deactivated
* Graph assumes the “Deactivating” state while being deactivated.

    * A List/Get operation on the graph would return the graph on the proper state.
    * Stop only completes when all media has been uploaded to the cloud.
* Idempotency:

    * Deactivating a graph on “Deactivating” state behaves the same way as if the graph was deactivated (that is: call blocks until graph is deactivated)
    * Deactivating a graph on “Inactive” state returns successfully immediately.

#### Request

```
{
    "methodName": "GraphInstanceDeactivate",
    // A high response timeout is recommended here since there might be data movement    // being executed as part of this operation
    "responseTimeoutInSeconds": 300,
    "payload": {
        "@apiVersion": "1.0",
        "name": "Camera001"
    }
}
```

#### Response

```
{
    "status": 200,
    "payload": null
}
```

|Condition	|Status code	|Detailed error code|
|---|---|---|
|Graph activated successfully	|200|	N/A|
|New entity created	|201|	N/A|
|General user errors	|400 range	||
|Graph is in activating state	|409|	OperationNotAllowedInState|
|General server errors	|500 range	||

## Next steps

[Module Twin configuration schema](module-twin-configuration-schema.md)
