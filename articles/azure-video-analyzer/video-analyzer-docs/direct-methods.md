---
title: Use direct methods in Azure Video Analyzer - Azure
description: Azure Video Analyzer exposes several direct methods. The direct methods are based on the conventions described in this topic.
ms.topic: conceptual
ms.date: 03/30/2021

---
# Azure Video Analyzer Direct methods

Azure Video Analyzer exposes several direct methods that can be invoked from IoT Hub. Direct methods represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout). This approach is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond. For more information, see [Understand and invoke direct methods from IoT Hub](../../iot-hub/iot-hub-devguide-direct-methods.md).

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

2. A given version of Azure Video Analyzer module will support all the direct methods up-to its current version. For example, module version 1.3 will support direct methods with versions 1.3, 1.2, 1.1, and 1.0 versions.
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
      "message": "Pipeline instance is not found."
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

Detailed validations error, such as pipeline module validations, are added as error details:

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
|400|	PipelineValidationError|	General Pipeline errors such as cycles or partitioning, etc.|
|400|	ModuleValidationError|	Module specific validation errors.|
|409|	PipelineTopologyInUse|	Pipeline topology is still referenced by one or more Pipeline instances.|
|409|	OperationNotAllowedInState|	Requested operation cannot be performed in the current state.|
|409|	ResourceValidationError|	Referenced resource (example: asset) is not in a valid state.|

## Details  

### PipelineTopologyGet

This direct method retrieves a single pipeline topology.

#### Request

```
  {
    "methodName": "pipelineTopologyGet",
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
    "payload": {
        "name": "{TopologyName}",
        "properties": {
            // Complete Topology
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

### PipelineTopologySet

Creates a single pipeline topology if there is no existing one with the given name or updates and existing one with the same name.

Key aspects:

* Pipeline topology can be freely updated if there are no pipeline referencing it.
* Pipeline topology can be freely updated if all referencing pipeline are deactivated as long as:

    * Newly added parameters have default values
    * Removed parameters are not referenced by any pipeline
* Pipeline updates are not allowed if there are active pipelines

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

### PipelineTopologyDelete

Deletes a single live pipeline topology.

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
| Pipeline topology is being referenced by one or more Pipeline instances | 409 | PipelineTopologyInUse |
| General server errors | 500 range |  |

### PipelineTopologyList

Retrieves a list of all the pipelines that matches the filter criteria.

#### Request

```
  {
        "@apiVersion": "1.0",
        "@continuationToken": "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==",    
        "@query": "$orderby=name asc"
  }
```
#### Response

```
  {
    "status": 200,
    "payload": {
      "@continuationToken": "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==",
      "value": [
        {
            "name": "{TopologyName}",
            "properties": {
                // Complete Topology
            }
        },
        {
            "name": "{TopologyName}",
            "properties": {
                // Complete Topology
            }
        }
      ]
    }
  }
```
#### Filter support

|Operation |Field(s)	|Operators|
|---|---|---|
|$orderby|name	|asc|


#### Status codes

| Condition | Status code | Detailed error code |
|--|--|--|
| Success | 200 | N/A |
| General user errors | 400 range |  |
| General server errors | 500 range |  |

### LivePipelineGet

Retrieves a single Pipeline Instance:

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
            // Complete Stream
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

### LivePipelineSet

Creates a single Pipeline Instance if there is no existing one with the given name or updates and existing one with the same name.

Key aspects:

* Pipeline Instance can be freely updated while in "Deactivated" state.

    * Pipeline is revalidated on every update.
* Pipeline instance updates are partially restricted while the pipeline is not in the “Inactive” state.
* Pipeline instance updates are not allowed on active pipeline.

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
            // Complete Stream
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

### LivePipelineDelete

Deletes a single pipeline instance.

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

### LivePipelineList

This is similar to LiveTopologyList. It enables use to enumerate the pipeline instances.
Retrieves a list of all the pipeline instances that matches the filter criteria.

#### Request

```
  {
        "@apiVersion": "1.0",
        "@continuationToken": "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==",    
        "@query": "$orderby=name asc"
  }
```
#### Response

```
  {
    "status": 200,
    "payload": {
      "@continuationToken": "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==",
      "value": [
        {
            "name": "{livePipelineName}",
            "properties": {
                // Complete Stream
            }
        },
        {
            "name": "{livePipelineName}",
            "properties": {
                // Complete Stream
            }
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

| Condition | Status code | Detailed error code |
|--|--|--|
| Success | 200 | N/A |
| General user errors | 400 range |  |
| General server errors | 500 range |  |

### LivePipelineActivate

Activates a single pipeline instance. 

Key aspects

* Method only returns when pipeline is activated 
* Pipeline assumes the “Activating” state while being activated.

    * A List/Get operation on the pipeline would return the pipeline on the proper state.
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

### LivePipelineDeactivate

Deactivates a single pipeline instance. Deactivating a pipeline gracefully deactivates the media processing and ensures that all events and media transiently stored on edge is committed to cloud, whenever applicable.

Key aspects:

* Method only returns when pipeline is deactivated
* Pipeline assumes the “Deactivating” state while being deactivated.

    * A List/Get operation on the pipeline would return the pipeline on the proper state.
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

[Module Twin configuration schema]()
