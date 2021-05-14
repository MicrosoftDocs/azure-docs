---
title: Use direct methods in Azure Video Analyzer - Azure
description: Azure Video Analyzer exposes several direct methods. The direct methods are based on the conventions described in this topic.
ms.topic: conceptual
ms.date: 05/06/2021

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

### Here is an example of response from a direct method

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

Detailed validations error, such as pipeline module validations, are added as error details:

```
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
|Status|	Detailed code	|Description|
|---|---|---|
|400|	PipelineValidationError|	General Pipeline errors such as cycles or partitioning, etc.|
|400|	ModuleValidationError|	Module specific validation errors.|
|409|	PipelineTopologyInUse|	Pipeline topology is still referenced by one or more Pipeline.|
|409|	OperationNotAllowedInState|	Requested operation cannot be performed in the current state.|
|409|	ResourceValidationError|	Referenced resource (example: asset) is not in a valid state.|

## Details  

### pipelineTopologyList

This direct method retrieves a single pipeline topology.

#### Request

```
{
  "@apiVersion": "1.0"
}
```
#### Response

```
{
  "value": [
    {
      "systemData": {
        "createdAt": "2021-05-05T14:19:22.16Z",
        "lastModifiedAt": "2021-05-05T16:20:41.505Z"
      },
      
      //Complete Topology
      
    }
  ]
}
```

#### Status codes

| Condition | Status code | Detailed error code |
|--|--|--|
| Entity found | 200 | N/A |
| General user errors | 400 range |  |
| Entity not found | 404 |  |
| General server errors | 500 range |  |

### pipelineTopologySet

Creates a single pipeline topology if there is no existing one with the given name or updates and existing one with the same name.

Key aspects:

* A Pipeline topology can be freely updated if there are no pipeline referencing it.
* A Pipeline topology can be freely updated if all referencing pipeline are deactivated as long as:

    * Newly added parameters have default values
    * Removed parameters are not referenced by any pipeline
* Only some pipeline updates are allowed while the pipeline is active.

#### Request

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

#### Response

```
  {
    "status": 201,
    "payload": {
        "name": "{TopologyName}",
        "properties": {
            // Complete Topology
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
Pipeline Validation Errors	|400	|PipelineValidationError|
Module Validation Errors|	400	|ModuleValidationError|
General server errors	|500 range	||

### pipelineTopologyDelete

Deletes a single live pipeline topology.

* Note that there cannot be any live pipelines referencing a pipeline topology being deleted. If this is the case you will receive a `TopologyInUse` error.

#### Request

```
  {
    "methodName": "pipeline
    
    Delete",
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

Retrieves a single Pipeline:

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
        "name": "{livePipelineName}",
        "properties": {
            // Complete pipeline
        }
    }
  }
```
#### Status codes

| Condition | Status code | Detailed error code |
|--|--|--|
| Entity found | 200 | N/A |
| General user errors | 400 range |  |
| Entity not found | 404 |  |
| General server errors | 500 range |  |

### livePipelineSet

Creates a single pipeline if there is no existing one with the given name or updates and existing one with the same name.

Key aspects:

* A Pipeline can be freely updated while in "Deactivated" state.

* A Pipeline is revalidated on every update.
* Pipeline updates are partially restricted while the pipeline is not in the “Inactive” state.
* Only some pipeline updates are allowed while the pipeline is active.

#### Request

```
  {
        "@apiVersion": "1.0",
        "name": "{livePipelineName}",
        "properties": {
            // Desired Stream properties
        }
  }
```
#### Response

````
  {
    "status": 201,
    "payload": {
        "name": "{livePipelineName}",
        "properties": {
            // Complete pipeline
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
| Pipeline Validation Errors | 400 | PipelineValidationError |
| Module Validation Errors | 400 | ModuleValidationError |
| Resource validation errors | 409 | ResourceValidationError |
| General server errors | 500 range | N/A |

### livePipelineDelete

Deletes a single pipeline.

Key aspects:

* Only deactivated pipeline can be deleted.

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
| Pipeline deleted successfully | 200 | N/A |
| Pipeline not found | 204 | N/A |
| General user errors | 400 range |  |
| Pipeline is not in the "Stopped" state | 409 | OperationNotAllowedInState |
| General server errors | 500 range |  |

### livePipelineList

This is similar to liveTopologyList. It retrieves a list of all the pipelines.

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
  "payload": {
    "value": [
      {
        "systemData": {
          "createdAt": "2021-05-06T10:28:04.560Z",
          "lastModifiedAt": "2021-05-06T10:28:04.560Z"
        },
        "name": "Sample-Pipeline-1",
        "properties": {
          "state": "Active",
          "description": "Sample pipeline description",
          "topologyName": "CVRToVideoSink",
          "parameters": [
            {
              "name": "rtspPassword",
              "value": "testpassword"
            },
            {
              "name": "rtspUrl",
              "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
            },
            {
              "name": "rtspUserName",
              "value": "testuser"
            }
          ]
        }
      }
    ]
  }
}
```

#### Status codes

| Condition | Status code | Detailed error code |
|--|--|--|
| Success | 200 | N/A |
| General user errors | 400 range |  |
| General server errors | 500 range |  |

### livePipelineActivate

Activates a single pipeline. 

Key aspects

* Method only returns when pipeline is activated 
* Pipeline assumes the “Activating” state while being activated.

* A List/Set operation on the pipeline would return the pipeline on the proper state.
* Idempotency:

    * Starting a pipeline on “Activating” state behaves the same way as if the pipeline was deactivated (that is: call blocks until pipeline is activated)
    * Activating a pipeline on “Active” state returns successfully immediately.

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
| Pipeline is in deactivating state | 409 | OperationNotAllowedInState |
| General server errors | 500 range |  |

### livePipelineDeactivate

Deactivates a single pipeline. Deactivating a pipeline gracefully deactivates the video processing and ensures that all events and video transiently stored on edge is committed to cloud, whenever applicable.

Key aspects:

* Method only returns when pipeline is deactivated
* Pipeline assumes the “Deactivating” state while being deactivated.

    * A List/Set operation on the pipeline would return the pipeline on the proper state.
    * Stop only completes when all media has been uploaded to the cloud.
* Idempotency:

    * Deactivating a pipeline on “Deactivating” state behaves the same way as if the pipeline was deactivated (that is: call blocks until pipeline is deactivated)
    * Deactivating a pipeline on “Inactive” state returns successfully immediately.

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
