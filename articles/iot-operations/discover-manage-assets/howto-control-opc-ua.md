---
title: Control OPC UA server data
description: Learn how to read and write data to OPC UA servers in Azure IoT Operations by using datasets, management groups, and sub-path (subtree) actions.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 07/27/2026


#CustomerIntent: As an OT user, I want to configure my Azure IoT Operations environment so that I can control my OPC UA server. I also want to see a sample application that lets me do this.
---

# Control OPC UA servers in Azure IoT Operations

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA tags_ that represent data points on the physical assets. You can read and write values to some tags to control the behavior of your OPC UA server and physical assets.

This article describes:

- The different ways you can write data to your OPC UA server.
- The different ways you can read data from your OPC UA server.
- How to find the sample application that demonstrates these scenarios.

## Sample asset definitions

The examples in this article use the following two asset definitions. The datasource values represent nodes in the OPC PLC simulator.

```bicep
@description('The name of the Azure Device Registry namespace.')
param aioNamespace string

@description('The location for the resources.')
param location string = resourceGroup().location

@description('The extended location name (custom location).')
param extendedLocationName string

@description('The name of the device to reference.')
param deviceName string

@description('The name of the device endpoint to reference.')
param endpointName string

resource namespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: aioNamespace
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
  name: 'process-control-dataset-actions'
  parent: namespace
  location: location
  extendedLocation: {
    type: 'CustomLocation'
    name: extendedLocationName
  }
  properties: {
    displayName: 'Process Control Demo'
    description: 'A asset containing simple data points used for read/write'
    enabled: true
    deviceRef: {
      deviceName: deviceName
      endpointName: endpointName
    }
    datasets: [
      {
        name: 'simple-types-dataset'
        dataPoints: [
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5017'
            name: 'Boiler #2'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6195'
            name: 'AssetId'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6198'
            name: 'DeviceHealth'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6202'
            name: 'Manufacturer'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6203'
            name: 'ManufacturerUri'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6210'
            name: 'BaseTemperature'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6211'
            name: 'CurrentTemperature'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6212'
            name: 'HeaterState'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6213'
            name: 'MaintenanceInterval'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6350'
            name: 'OverheatInterval'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6214'
            name: 'Overheated'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6215'
            name: 'OverheatedThresholdTemperature'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6217'
            name: 'TargetTemperature'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6218'
            name: 'TemperatureChangeSpeed'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6205'
            name: 'ProductCode'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6206'
            name: 'ProductInstanceUri'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6207'
            name: 'RevisionCounter'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6208'
            name: 'SerialNumber'
          }
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6209'
            name: 'SoftwareRevision'
          }
        ]
      }
      {
        name: 'complex-types-dataset'
        dataPoints: [
          {
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=15013'
            name: 'BoilerStatus'
          }
        ]
      }
    ]
  }
}

output assetName string = asset.name
output assetId string = asset.id
```

```bicep
@description('The name of the Azure Device Registry namespace.')
param aioNamespace string

@description('The location for the resources.')
param location string = resourceGroup().location

@description('The extended location name (custom location).')
param extendedLocationName string

@description('The name of the device to reference.')
param deviceName string

@description('The name of the device endpoint to reference.')
param endpointName string

resource namespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: aioNamespace
}
resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
  name: 'management-actions-asset'
  parent: namespace
  location: location
  extendedLocation: {
    type: 'CustomLocation'
    name: extendedLocationName
  }
  properties: {
    displayName: 'Process Control Management Action Demo'
    description: 'An asset containing management actions'
    enabled: true
    deviceRef: {
      deviceName: deviceName
      endpointName: endpointName
    }
    managementGroups: [
      {
        name: 'managementGroup'
        dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5019'
        actions: [
          {
            name: 'Switch'
            actionType: 'Call'
            targetUri: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=7019'
          }
          {
            name: 'explicit-write'
            actionType: 'Write'
            targetUri: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6217'
          }
          {
            name: 'explicit-read'
            actionType: 'Read'
            targetUri: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=15013'
          }
        ]
      }
    ]
  }
}

output assetName string = asset.name
output assetId string = asset.id
```

## How to write data to an OPC UA server

The `opc-ua-commander` service in the Azure IoT Operations cluster connects to your OPC UA server and performs write operations on your behalf. The `opc-ua-commander` service uses the [RPC protocol](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/rpc-protocol.md) over MQTT to receive write requests and send responses. The message must include the required system and user [message metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

> [!IMPORTANT]
> The tag name `_ErrorMessage` is reserved and shouldn't be used.

The commander service can perform the following types of write operations:

### Simple write using a dataset

The example asset `process-control-dataset-actions` has a data point called `TargetTemperature` in the `simple-types-dataset`. To set the target temperature of the boiler, write to this data point.

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/builtin/<dataset name>` that includes a value for `TargetTemperature`, the commander service writes the value to the OPC UA server. For example, to set the target temperature to 176, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/process-control-dataset-actions/builtin/simple-types-dataset`:

```json
{
    "TargetTemperature": 176
}
```

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Complex write using a dataset

The example asset `process-control-dataset-actions` has a data point called `BoilerStatus` in the `complex-types-dataset`. To set the status of the boiler, write to this data point.  

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/builtin/<dataset name>` that includes a value for `BoilerStatus`, the commander service writes the values to the OPC UA server. For example, to set the boiler status, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/process-control-dataset-actions/builtin/complex-types-dataset`:

```json
{
    "BoilerStatus": {
        "Temperature": {
            "Top": 123,
            "Bottom": 456
        },
        "Pressure": 789,
        "HeaterState": "Off_0"
    }
}
```

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Call a method by using a management group

The example asset called `management-actions-asset` has an action called `Switch` in the management group `managementGroup`. To switch the boiler on or off, call this action. The action type is `Call`.

An action always has the following properties:

- `name`: Name of the action in a management group.
- `dataSource`: Maps to the `objectId` in [OPC UA](https://reference.opcfoundation.org/Core/Part4/v104/docs/5.11.2.2). Distinguishes methods defined for multiple objects.
- `targetUri`: Maps to the `methodId` in [OPC UA](https://reference.opcfoundation.org/Core/Part4/v104/docs/5.11.2.2). References the method to call.
- `actionType`: The type of action. For methods, this property is always `Call`.

> [!NOTE]
> Versions of Azure IoT Operations prior to 2603 used `typeRef` as a property of an action instead of `dataSource` as a property of the management group to map to the `objectId`. If you're using an older version, use `typeRef` in your asset's action definition instead of `dataSource` in the management group.

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/<management group name>/<action name>` that includes a value for `Switch`, the commander service calls the method in the OPC UA server. For example, to switch on the boiler, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/management-actions-asset/managementGroup/Switch`:

```json
{
  "On": true
}
```

> [!TIP]
> To call a method without parameters, set the payload to `{}`.

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Explicit write using a management group

Use explicit writes to write to data points that aren't part of a dataset. Compared to a dataset write, the differences are:

- You must explicitly configure the data points.
- Value changes aren't transmitted as part of the telemetry. Therefore, the client must rely on the MQTT RPC response.

The example asset called `management-actions-asset` has an action called `explicit-write` in the management group `managementGroup` that you can set. The action type is `Write`. 

An action always has the following properties:

- `name`: Name of the action in a management group.
- `targetUri`: The `nodeId` of the node to write to.
- `actionType`: The type of action. For explicit writes, this property is always `Write`.

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/<management group name>/<action name>` that includes a value for `explicit-write`, the commander service writes to the target URI. For example, to set the target temperature for the boiler, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/management-actions-asset/managementGroup/explicit-write`:

```json
{
  "TargetTemperature": 95
}
```

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Sub-path write using a management group

A *sub-path action* applies a single `Read` or `Write` action to a node and all of its children, instead of a single explicitly configured node. A sub-path action differs from an explicit write in the following ways:

- A single action targets the root node of a subtree and every writable node beneath it.
- You address each target node by its relative browse path from the root node rather than by `nodeId`.

Configure a sub-path action by setting the management group `dataSource` to the root node of the subtree and the action `targetUri` to `#`:

```yaml
managementGroups:
  - name: managementGroup
    dataSource: "nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5"   # root node of the subtree
    actions:
      - name: subpath-read
        actionType: Read
        targetUri: "#"
      - name: subpath-write
        actionType: Write
        targetUri: "#"
```

An action always has the following properties:

- `name`: Name of the action in a management group.
- `targetUri`: Set to `#` to apply the action to the root node and all of its children.
- `actionType`: The type of action. For sub-path writes, this property is always `Write`.

A sub-path write addresses each target by its relative browse path from the root node. The value is what to write to the node. When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/<management group name>/<action name>`, the commander service writes to each node identified by its relative browse path. For example, to set the target temperature by using the `subpath-write` action, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/management-actions-asset/managementGroup/subpath-write`:

```json
{
  "/4:Boiler &#2/2:ParameterSet/4:TargetTemperature": 42.5
}
```

> [!TIP]
> The previous example shows a single relative browse path and value. You can include multiple relative browse paths and values in the same message to write to multiple nodes at once. 

The commander service accepts only relative paths that stay within the subtree. It rejects absolute node IDs and paths that leave the subtree, returning `BadInvalidArgument`. As with other write actions, the response is empty on full success. Otherwise, the response reports each failed path with its OPC UA status:

```json
{
  "/4:Boiler &#2/2:ParameterSet/4:DoesNotExist": "BadNoMatch"
}
```

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

## How to read data from an OPC UA server

Typically, to read data from an OPC UA server, you create a dataset that includes data points that map to the nodes you want to read. You then configure the dataset to send values as telemetry, such as by publishing to an MQTT topic.

However, in some scenarios, you might want to read from an OPC UA node that's not included in a dataset or do a one-off read of dataset.

The `opc-ua-commander` service in the Azure IoT Operations cluster connects to your OPC UA server and performs read operations on your behalf. The `opc-ua-commander` service uses the [RPC protocol](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/rpc-protocol.md) over MQTT to receive read requests and send responses. The message must include the required system and user [message metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

> [!IMPORTANT]
> The tag name `_ErrorMessage` is reserved and shouldn't be used.

The commander service can perform the following types of read operations:

### Explicit read using a management group

Use *explicit reads* to read data points that aren't part of a dataset. Compared to a standard dataset read, the differences are:

- You must explicitly configure the data points.
- Value changes aren't transmitted as part of the telemetry. Therefore, the client must rely on the MQTT RPC response.

The example asset called `management-actions-asset` has an action called `explicit-read` in the management group `managementGroup` that you can set. The action type is `Read`. 

An action always has the following properties:

- `name`: Name of the action in a management group.
- `targetUri`: The `nodeId` of the node to read from.
- `actionType`: The type of action. For explicit reads, this property is always `Read`.

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/<management group name>/<action name>`, the commander service reads from the target URI. For example, to read the target temperature for the boiler, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/management-actions-asset/managementGroup/explicit-read`:

```json
{}
```

After the commander executes the action, its response is a JSON representation of the OPC UA read response.

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Sub-path read using a management group

A *sub-path (subtree) action* applies a single action to a node and all of its children. For a full description of sub-path actions, see [Sub-path write using a management group](#sub-path-write-using-a-management-group).

Use a sub-path read to read a root node and every readable node beneath it with a single action. Configure a sub-path read the same way as a sub-path write: set the management group `dataSource` to the root node of the subtree and the action `targetUri` to `#`. The example configuration includes a `subpath-read` action in the management group `managementGroup`. The action type is `Read`, and the `targetUri` is `#`.

An action always has the following properties:

- `name`: Name of the action in a management group.
- `targetUri`: Set to `#` to apply the action to the root node and all of its children.
- `actionType`: The type of action. For sub-path reads, this property is always `Read`.

When you publish an empty message, `{}`, to the topic `azure-iot-operations/asset-operations/<asset name>/<management group name>/<action name>`, the commander service reads every readable node under the root node. For example, to read the subtree by using the `subpath-read` action, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/management-actions-asset/managementGroup/subpath-read`:

```json
{}
```

The response returns every readable node under the root node, keyed by its relative browse path. Nodes that can't be read carry a `StatusCode` instead of a value. For more information, see [Error reporting](#error-reporting).

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Read using a dataset

The example asset called `process-control-dataset-actions` has a dataset called `simple-types-dataset` that includes data points such as `DeviceHealth`, `CurrentTemperature`, and `HeaterState`.

When you publish an empty message, `{}`, to the topic `azure-iot-operations/asset-operations/<asset name>/builtin/<dataset name>`, the commander service reads the values of all the data points defined in the dataset from the OPC UA server. For example, to read all the node values from the dataset `simple-types-dataset`, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/process-control-dataset-actions/builtin/simple-types-dataset`:

```json
{}
```

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

The response to a successfully executed request is a message that contains all the current node values from the dataset.

## Endpoint operations

Endpoint operations are process control calls that work on an inbound endpoint only. They don't need an asset.

For example, to dump the address space of an OPC UA server, send a message to the topic `azure-iot-operations/endpoint-operations/{DeviceName}/{EndpointName}/{ActionName}`.

If the payload contains an empty JSON object, the entire address space is returned.

If you use a JSON object like:

```json
{
    "root_data_point": "<OPC UA Expanded Node ID>",
    "depth": 128
}
```

`root_data_point` defines the starting point for the browse operation and `depth` defines how deep the browse operation should go.

## Sample application

The [sample application](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/process-control) shows how to control the simulated boiler asset by setting values on the OPC UA server.

The sample application uses the [protocol compiler](https://github.com/Azure/iot-operations-sdks/blob/main/codegen/README.md) in the SDK to generate the required C# code to implement the RPC protocol from a [Digital Twins Definition Language (DTDL) V3](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.Specification.v3.md) model.

For example, the DTDL model for the `call` actions the sample uses looks like this:

```json
{
  "@context": [
    "dtmi:dtdl:context;4",
    "dtmi:dtdl:extension:mqtt;2",
    "dtmi:dtdl:extension:requirement;1"
  ],
  "@id": "dtmi:opcua:write;1",
  "@type": ["Interface", "Mqtt"],
  "payloadFormat": "custom/0",
  "commandTopic": "{ex:namespace}/asset-operations/{ex:asset}/builtin/{ex:dataset}",
  "schemas": [],
  "contents": [
    {
      "@type": "Command",
      "name": "WriteDataset",
      "request": {
        "name": "WriteDatasetRequest",
        "schema": "bytes"
      },
      "response": {
        "name": "WriteDatasetResponse",
        "schema": "bytes"
      }
    }
  ]
}
```

## Error reporting

The commander service reports the outcome of every request through two independent channels of the MQTT RPC response:

1. **Response message metadata** (MQTT user properties): Carries the overall result of the RPC call and, when applicable, an *application error*.
1. **Response payload** (the JSON body): Carries the result for each data point, such as read values or the OPC UA status of individual data points that failed.

A client should always inspect *both* channels. A request can complete as a normal RPC response and still contain data point failures inside the payload.

### General errors compared to application errors

The response [message metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md) distinguishes two kinds of problems:

- **General errors** come from the Azure IoT Operations SDK itself. Examples include a malformed request payload that can't be deserialized, or a lost session. These errors surface through the RPC status user properties (`__stat` and `__stMsg`), and the generated client raises them as an error.
- **Application errors** come from the commander service when it receives and understands the request but can't fulfill it. They appear in the user properties `AppErrCode` (a short reason string, always present when an application error occurs) and, optionally, `AppErrPayload`. Retrieve them with the `TryGetApplicationError` method of the `ExtendedResponse` in the Azure IoT Operations SDK.

> [!NOTE]
> `AppErrCode` is a free-form string, not a fixed enumeration. It's either a well-known constant (see the following table), an OPC UA status code name (for example, `BadNodeIdUnknown`), or a diagnostic message.

#### Well-known application error codes

| AppErrCode value | Meaning |
|---|---|
| `NoActionName` | The request doesn't include an action name in the topic. |
| `UnknownAction` | The action name doesn't exist in the management group of the asset. |
| `CustomTopicExecutorExists` | The action uses a custom topic, but the request targets the default topic instead. |
| `Bad...` (an OPC UA status name) | The OPC UA server, or the commander service's prevalidation, rejected the request or a node. See [OPC UA status codes](#opc-ua-status-codes). |
| A diagnostic message | An unexpected condition. The string describes the reason, such as a lost OPC UA session. |

### Results for each data point in the response payload

For requests that address multiple data points, the payload reports the outcome of *each* data point individually, keyed by the data point or argument name. With this behavior, a caller can match every result back to its request even when the order differs, and *partial success* is possible.

#### Write results (dataset write, explicit write, sub-path write)

A write response reports only the data points that failed:

- On *full success*, the response payload is an empty JSON object, `{}`. Every data point has a `Good` status.
- On *partial or full failure*, the payload contains one entry per failed data point, keyed by the data point name, whose value is the OPC UA status name. The payload omits data points that succeeded:

```json
{
  "TargetTemperature": "BadTypeMismatch",
  "MaintenanceInterval": "BadNotWritable"
}
```

Request-level problems that prevent any per-datapoint processing use the reserved key `_ErrorMessage`:

```json
{ "_ErrorMessage": "BadNothingToDo" }
```

#### Read results (dataset read, explicit read, sub-path read)

A read response is the keyframe of the requested data points. Data points that are read successfully carry their value. Data points that can't be read carry an OPC UA `StatusCode` instead of a value, so a bad node doesn't fail the whole read:

```json
{
  "CurrentTemperature": { "Value": 21.5 },
  "BadNode":            { "StatusCode": "BadNodeIdUnknown" }
}
```

#### Method call results

For a method call, the payload on success is a JSON object with all output arguments of the method. On failure, the payload is empty, and the commander service reports the reason as an application error (`AppErrCode`).

### Where errors appear for each operation

Because a single request can touch many data points, multiple data points can fail independently. Which channel carries the failure differs by operation:

| Operation | Full success | Some data points fail | Whole request fails |
|---|---|---|---|
| Dataset write | Empty payload, no `AppErrCode` | Failed data points in payload, no `AppErrCode` | `AppErrCode` set, empty payload |
| Explicit or sub-path write | Empty payload, no `AppErrCode` | Failed data points in payload and `AppErrCode` set | `AppErrCode` set, empty payload |
| Dataset or sub-path read | Values in payload, no `AppErrCode` | Bad data points carry `StatusCode` in payload, no `AppErrCode` | `AppErrCode` set, empty payload |
| Method call | Output arguments in payload | Not applicable (single call) | `AppErrCode` set, empty payload |

> [!IMPORTANT]
> For dataset write and read operations, only the payload reports data point failures. The RPC response is still a normal (non-error) response, and no `AppErrCode` is present. A client that checks only for an application error would miss these failures. Always inspect the payload as well.

### OPC UA status codes

The commander service reports all OPC UA statuses by their symbolic name, such as `Good`, `BadNodeIdUnknown`, `BadNodeIdInvalid`, `BadNoMatch`, `BadTypeMismatch`, `BadNotWritable`, `BadUserAccessDenied`, and `BadOutOfRange`. It also rejects some clearly invalid requests before contacting the OPC UA server and reports them with the matching status name. Examples include `BadNothingToDo` (empty request), `BadTooManyArguments` or `BadArgumentsMissing` (wrong number of method or explicit-write arguments), and `BadNodeClassInvalid` (the target node isn't a variable). For the meaning of each code, see the [OPC UA status code specification](https://reference.opcfoundation.org/specs/OPC-10000-4/7.38).

> [!NOTE]
> `_ErrorMessage` is a reserved name. Don't use it as a data point name in a dataset or as an action name in a management group. The commander service uses it as a request-level error key in the response payload.

## Related content

- [Enable and run management actions](howto-use-management-actions.md)
- [Manage asset and device configurations](overview-manage-assets.md)
- [Connector for OPC UA overview](overview-opc-ua-connector.md)
