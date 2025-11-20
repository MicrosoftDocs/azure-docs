---
title: How to control OPC UA assets
description: Learn how to configure OPC UA assets and devices to enable you to control and OPC UA server.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 10/08/2025


#CustomerIntent: As an OT user, I want configure my Azure IoT Operations environment so that I can control my OPC UA server. I also want to see a sample application that lets me do this.
---

# Control OPC UA servers

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA tags_ that represent tags. You can write values to some tags to control the behavior of your OPC UA server and physical assets.

This article describes:

- The different ways you can write data to your OPC UA server.
- How to find the sample application that demonstrates these scenarios.

## How to write data to an OPC UA server

The `opc-ua-commander` service in the Azure IoT Operations cluster connects to your OPC UA server and performs write operations on your behalf. The `opc-ua-commander` service uses the [RPC protocol](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/rpc-protocol.md) over MQTT to receive write requests and send responses. The message must include the required system and user [message metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

> [!IMPORTANT]
> The tag name `_ErrorMessage` is reserved and should not be used.

The commander service can perform the following types of write operations:

### Simple write using a dataset

The boiler asset in the OPC PLC simulator has a tag called `TargetTemperature` that you can write to in order to set the target temperature of the boiler. Create an asset that includes a dataset with a data point that maps to this tag:

| Name | Data source                                |
|------|--------------------------------------------|
| `TargetTemperature` | `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6217` |

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/builtin/<dataset name>` that includes a value for `TargetTemperature`, the commander service writes the value to the OPC UA server. For example, to set the target temperature to 176, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/<asset name>/builtin/<dataset name>`:

```json
{
    "TargetTemperature": 176
}
```

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Complex write using a dataset

The boiler asset in the OPC PLC simulator has a tag called `BoilerStatus` that you can write to in order to set the status of the boiler. Create an asset that includes a dataset with a data point that maps to this tag:

| Name | Data source                                |
|------|--------------------------------------------|
| `BoilerStatus` | `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=15013` |

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/builtin/<dataset name>` that includes a value for `BoilerStatus`, the commander service writes the values to the OPC UA server. For example, to set the boiler status, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/<asset name>/builtin/<dataset name>`:

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

### Call a method using a management group

The boiler asset in the OPC PLC simulator has an action called `Switch` that you can call to switch the boiler on or off. Create an asset that includes a management group with an action that maps to this action:

| name | targetUri  | actionType | typeRef |
|------|------------|------------|---------|
| `Switch` | `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5017` | `Call` | `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5019` |

An action always has the following properties:

- `name`: Name of the action in a `ManagementGroup`.
- `targetUri`: Maps to the `methodId` in [OPC UA](https://reference.opcfoundation.org/Core/Part4/v104/docs/5.11.2.2). References the method to be called.
- `actionType`: The type of action. For methods, this is always `Call`.
- `typeRef`: Maps to the `objectId` in [OPC UA](https://reference.opcfoundation.org/Core/Part4/v104/docs/5.11.2.2). Distinguishes methods defined for multiple objects.

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/<management group name>/<action name>` that includes a value for `Switch`, the commander service calls the method in the OPC UA server. For example, to switch the boiler on, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/<asset name>/<dataset name>/<management group name>/<action name>`:

```json
{
  "On": true
}
```

> [!TIP]
> To call a method without parameters, set the payload to `{}`.

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Explicit write using a management group

Use explicit writes to write to data points that aren't part of a dataset. As compared to a dataset write, the differences are:

- The data points must be explicitly configured.
- Value changes aren't transmitted as part of the telemetry. Therefore, the client must rely on the MQTT RPC response.

 Create an asset that includes a management group with an action defined as follows:

| name | targetUri  | actionType |
|------|------------|------------|
| `simple-write` | `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=6217` | `Write` |

An action always has the following properties:

- `name`: Name of the action in a `ManagementGroup`.
- `targetUri`: The `nodeId` of the node to write to.
- `actionType`: The type of action. For explicit writes, this is always `Write`.

When you publish a message to the topic `azure-iot-operations/asset-operations/<asset name>/<management group name>/<action name>` that includes a value for `simple-write`, the commander service writes to the target URI. For example, to set the target temperature for the boiler, publish a message with the following payload to the topic `azure-iot-operations/asset-operations/<asset name>/<dataset name>/<management group name>/<action name>`:

```json
{
  "TargetTemperature": 95
}
```

The message must include the required [metadata](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/message-metadata.md).

### Endpoint operations

Endpoint operations are process control calls that work on an inbound endpoint only and don't need an asset.

For example, to dump the address space of an OPC UA server, send a message to the topic `azure-iot-operations/endpoint-operations/{InboundEndpointName}/browse`.

If the payload contains an empty JSON object the entire address space is returned.

If you use a JSON object like:

```json
{
    "root_data_point": "<OPC UA Expanded Node ID>",
    "depth": 128
}
```

`root_data_point` defines the starting point for the browse operation and `depth` defines how deep the browse operation should go.


## Sample application

The [sample application](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/process-control) shows you how to control the simulated boiler asset by setting values on the OPC UA server.

The sample application uses the [protocol compiler](https://github.com/Azure/iot-operations-sdks/blob/main/codegen/README.md) in the SDK to generate the required C# to implement the RPC protocol code from a [Digital Twins Definition Language (DTDL) V3](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.Specification.v3.md) model.

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

## Related content

- [Manage asset and device configurations](howto-manage-assets-devices.md)
- [Connector for OPC UA overview](overview-opc-ua-connector.md)
