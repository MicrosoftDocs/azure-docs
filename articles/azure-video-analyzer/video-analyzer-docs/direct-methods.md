---
title: Use direct methods in Azure Video Analyzer - Azure
description: Azure Video Analyzer exposes several direct methods. The direct methods are based on the conventions described in this topic.
ms.topic: conceptual
ms.date: 06/01/2021

---
# Azure Video Analyzer Direct methods

Azure Video Analyzer IoT edge module `avaedge` exposes several direct methods that can be invoked from IoT Hub. Direct methods represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout). This approach is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond. For more information, see [Understand and invoke direct methods from IoT Hub](../../iot-hub/iot-hub-devguide-direct-methods.md).

This topic describes these methods and conventions.

## Conventions

The direct methods are based on the following conventions:

1. Direct methods have a version specified in MAJOR.MINOR format (as shown in the following example). It is the "@apiVersion" number where "1" is the MAJOR and "0" the MINOR in this example:

```
  {
    "methodName": "pipelineTopologySet",
    "payload": {
        "@apiVersion": "1.0",
        "name": "{TopologyName}",
        "properties": {
            // Desired Topology properties
        }
    }
  }
```

2. A given version of Video Analyzer module supports all minor versions of a direct method call up-to its current version. Support across major versions is not guaranteed.
3. All direct methods are synchronous.
4. Error results are based on the [OData error schema](http://docs.oasis-open.org/odata/odata-json-format/v4.01/odata-json-format-v4.01.html#sec_ErrorResponse).
5. Names should observe the following constraints:
    
    * Only alphanumeric characters and dashes as long as it doesn't start and end with a dash
    * No spaces
    * Max of 32 characters

### Example of response from a direct method

```
-----------------------  Request: livePipelineList  --------------------------------------------------

{
  "@apiVersion": "1.0"
}

---------------  Response: livePipelineList - Status: 200  ---------------

{
  "value": []
}

--------------------------------------------------------------------------
```    
### Error codes
As shown in the example below, when you get an error response from a direct method, there is a top-level error code, and further information is provided under `details`.


```json
{
  "status": 400,
  "payload": {
    "error": {
      "code": "BadRequest",
      "message": "The request is invalid",
      "details": [
        {
          "code": "ApiVersionNotSupported",
          "message": "The API version '1.1' is not supported. Supported version(s): 1.0."
        }
      ]
    }
  }
}
```

Following are the error codes used at the top level.

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

Following are some of the error codes used at the detail level.

|Status|	Detailed code	|Description|
|---|---|---|
|400|	PipelineValidationError|	General pipeline errors such as cycles or partitioning, etc.|
|400|	ModuleValidationError|	Module specific validation errors.|
|409|	PipelineTopologyInUse|	Pipeline topology is still referenced by one or more live pipeline.|
|409|	OperationNotAllowedInState|	Requested operation cannot be performed in the current state.|
|409|	ResourceValidationError|	Referenced resource (example: video resource) is not in a valid state.|

## Supported direct methods  
Following are the direct methods exposed by the Video Analyzer edge module.

### pipelineTopologyList

This direct method lists all the pipeline topologies that have been created.

#### Request

```
{
  "@apiVersion": "1.0"
}
```
#### Response

```
{
  "status": 200,
  "value": [
    {
      "systemData": {
        "createdAt": "2021-05-05T14:19:22.16Z",
        "lastModifiedAt": "2021-05-05T16:20:41.505Z"
      },
      
      // first pipeline topology payload
      
    },
      "systemData": {
        "createdAt": "2021-05-06T14:19:22.16Z",
        "lastModifiedAt": "2021-05-06T16:20:41.505Z"
      },
      
      // next pipeline topology payload
      
    }    
  ]
}
```

#### Status codes

| Condition | Status code |
|--|--|
| Entity found | 200 |
| General user errors | 400 range |
| Entity not found | 404 |
| General server errors | 500 range |

### pipelineTopologySet

Creates a pipeline topology with the given name if no such topology exists, or updates an existing topology with that name.

Key aspects:

* A pipeline topology can be freely updated if there are no live pipelines referencing it.
* A pipeline topology can be freely updated if all referencing live pipelines are deactivated as long as:

    * Newly added parameters have default values
    * Removed parameters are not referenced by any pipeline
* Only some pipeline topology updates are allowed while a live pipeline is active.

#### Request

```
  {
    "methodName": "pipelineTopologySet",
    "payload": {
        "@apiVersion": "1.0",
        "name": "{TopologyName}",
        "properties": {
            // Desired pipeline topology properties
        }
    }
  }
```

#### Response

```
  {
    "status": 201,
    "payload": {
        "systemData": {
           "createdAt": "2021-05-11T18:16:46.491Z",
           "lastModifiedAt": "2021-05-11T18:16:46.491Z"
        },
        "name": "{TopologyName}",
        "properties": {
            // Complete pipeline topology
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
Pipeline validation Errors	|400	|PipelineValidationError|
Module validation Errors|	400	|ModuleValidationError|
General server errors	|500 range	||

### pipelineTopologyGet

It retrieves a pipeline topology with the specified name, if it exists.

#### Request

```
  {
        "@apiVersion": "1.0",
        "name": "{TopologyName}"       
  }
```
#### Response

```
{
  "status": 200,
  "payload": {
    "value": [
      {
        "systemData": {
          "createdAt": "2021-05-06T10:28:04.560Z",
          "lastModifiedAt": "2021-05-06T10:28:04.560Z"
        },
        "name": "{TopologyName}",
        // Complete pipeline topology
      }
    ]
  }
}
```

#### Status codes

| Condition | Status code |
|--|--|
| Success | 200 |
| General user errors | 400 range |
| General server errors | 500 range |

### pipelineTopologyDelete

Deletes a single pipeline topology.

* Note that there cannot be any live pipelines [referencing a pipeline topology being deleted](pipeline.md#pipeline-states). If there are such live pipelines you will receive a `TopologyInUse` error.

#### Request

```
  {
    "methodName": "pipelineTopologyDelete",
    "payload": {
        "@apiVersion": "1.0",
        "name": "{TopologyName}"
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

| Condition | Status code | Detailed error code |
|--|--|--|
| Entity deleted | 200 | N/A |
| Entity not found | 204 | N/A |
| General user errors | 400 range |  |
| Pipeline topology is being referenced by one or more Pipelines | 409 | PipelineTopologyInUse |
| General server errors | 500 range |  |

### livePipelineList

Lists all live pipelines.

#### Request

```
  {
        "@apiVersion": "1.0"
  }
```
#### Response

```
{
  "status": 200,
  "value": [
    {
      "systemData": {
        "createdAt": "2021-05-05T14:19:22.16Z",
        "lastModifiedAt": "2021-05-05T16:20:41.505Z"
      },      
      // first live pipeline payload  
    },
      "systemData": {
        "createdAt": "2021-05-06T14:19:22.16Z",
        "lastModifiedAt": "2021-05-06T16:20:41.505Z"
      },
      // next live pipeline payload
    }    
  ]
}
```
#### Status codes

| Condition | Status code |
|--|--|
| Entity found | 200 |
| General user errors | 400 range |
| Entity not found | 404 |
| General server errors | 500 range |

### livePipelineSet

Creates a live pipeline with the given name if no such live pipeline exists, or updates an existing live pipeline with that name.

Key aspects:

* A live pipeline can be freely updated while in "Deactivated" state. In other states, only some updates are allowed.
* A live pipeline is revalidated on every update.

#### Request

```
  {
        "@apiVersion": "1.0",
        "name": "{livePipelineName}",
        "properties": {
            // Desired live pipeline properties
        }
  }
```
#### Response

````
  {
    "status": 201,
    "payload": {
        "systemData": {
           "createdAt": "2021-05-11T18:16:46.491Z",
           "lastModifiedAt": "2021-05-11T18:16:46.491Z"
        },
        "name": "{livePipelineName}",
        "properties": {
            // Complete live pipeline
        }
    }
  }
````
#### Status codes

| Condition | Status code | Detailed error code |
|--|--|--|
| Existing entity updated | 200 | N/A |
| New entity created | 201 | N/A |
| General user errors | 400 range | N/A |
| Live pipeline validation errors | 400 | PipelineValidationError |
| Module validation errors | 400 | ModuleValidationError |
| Resource validation errors | 409 | ResourceValidationError |
| General server errors | 500 range | N/A |

### livePipelineDelete

Deletes a single live pipeline.

Key aspects:

* Only deactivated live pipelines can be deleted.

#### Request

```
  {
        "@apiVersion": "1.0",
        "name": "{livePipelineName}"
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

| Condition | Status code | Detailed error code |
|--|--|--|
| Live pipeline deleted successfully | 200 | N/A |
| Live pipeline not found | 204 | N/A |
| General user errors | 400 range |  |
| Pipeline is not in the "Deactivated" state | 409 | OperationNotAllowedInState |
| General server errors | 500 range |  |

### livePipelineGet

This is similar to liveTopologyGet. It retrieves a live pipeline with the specified name, if it exists.

#### Request

```
  {
        "@apiVersion": "1.0",
        "name": "{livePipelineName}"       
  }
```
#### Response

```
{
  "status": 200,
  "payload": {
    "value": [
      {
        "systemData": {
          "createdAt": "2021-05-06T10:28:04.560Z",
          "lastModifiedAt": "2021-05-06T10:28:04.560Z"
        },
        "name": "{livePipelineName}",
        // Complete live pipeline
      }
    ]
  }
}
```

#### Status codes

| Condition | Status code |
|--|--|
| Success | 200 |
| General user errors | 400 range |
| General server errors | 500 range |

### livePipelineActivate

Activates a live pipeline. 

Key aspects

* Method returns when the live pipeline is in "Activating" or "Activated" state. 
* A List/Set operation on the live pipeline would return the current state.
* This method can be invoked as long as the live pipeline is not in the (transient) "Deactivating" state.
* Idempotency:
    * Calling `livePipelineActivate` on a live pipeline which is already in "Activating" state behaves the same way as if the live pipeline was deactivated.
    * Activating a pipeline which is in "Active" state returns a success code immediately.

#### Request

```
  {
        "@apiVersion": "1.0",
        "name": "{livePipelineName}"
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

| Condition | Status code | Detailed error code |
|--|--|--|
| Pipeline activated successfully | 200 | N/A |
| New entity created | 201 | N/A |
| General user errors | 400 range |  |
| Module validation errors | 400 | ModuleValidationError |
| Resource validation errors | 409 | ResourceValidationError |
| Live pipeline is in deactivating state | 409 | OperationNotAllowedInState |
| General server errors | 500 range |  |

### livePipelineDeactivate

Deactivates a live pipeline. Deactivating a pipeline gracefully deactivates the video processing and ensures that all events and video cached on the edge is committed to cloud, whenever applicable.

Key aspects:

* Method only returns when live pipeline is deactivated.
* This method can be invoked as long as the live pipeline is not in the (transient) "Activating" state.
* Pipeline goes into the "Deactivating" state while being deactivated.
    * A List/Set operation on the live pipeline would return the current state.
    * Deactivation completes when all media has been uploaded to the cloud (if the pipeline has a [video sink](pipeline.md#video-sink) node).
* Idempotency:
    * Calling `livePipelineDeactivate` on a live pipeline which is already in "Deactivating" state behaves the same way as if the live pipeline was in "Active" state.
    * Deactivating a pipeline which is in "Inactive" state returns a success code immediately.


#### Request

```
  {
    "@apiVersion": "1.0",
    "name": "{livePipelineName}"
  }
```
#### Response

```
{
 "status": 200,
 "payload": null
}
```
| Condition | Status code | Detailed error code |
|--|--|--|
| Pipeline activated successfully | 200 | N/A |
| New entity created | 201 | N/A |
| General user errors | 400 range |  |
| Pipeline is in activating state | 409 | OperationNotAllowedInState |
| General server errors | 500 range |  |

## Next steps

[Module Twin configuration schema](module-twin-configuration-schema.md)
