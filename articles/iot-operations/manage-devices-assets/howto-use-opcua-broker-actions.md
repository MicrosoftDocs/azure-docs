---
title: Use Azure IoT OPC UA Broker actions
description: How to work with actions in Azure IoT OPC UA Broker
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/24/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to be able to call actions
# in OPC UA Broker, so that I can manage the assets in my industrial edge environment.
---

# Use actions with OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The OPC UA Broker runtime allows you to call actions in the OPC UA Broker by using the [MQTT V5 request/response mechanism](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901252). This article shows how to use actions that enable you to manage the assets in your environment. 

## Features supported

The following features are supported for actions:

| Actions                 | Supported   |  Symbol    |
| ----------------------- | ---------   | :-------:  |
| Explore (OPC UA Browse) | Supported   |     ✅     |
| Write (OPC UA Write)    | Supported   |     ✅     |

## Call an action
Each action has a request and a response. To call an action, the MQTT request message requires a defined `response-topic`, and the name of the action (`actionName`) as a `user-property`. This message is sent to the following topic: `<app-id>/actions/<module-type>/<module-purpose>/invoke`.  There are two types of actions you can call with OPC UA Broker:  **Explore** actions and **Write** actions. 

Action responses typically contain multiple response messages, the {{<oub-product-name>}} runtime adds a `state` as a `user-property` to indicate if all responses were sent. The following states are supported:

| Action State | Meaning                                                  |
| ------------ | -------------------------------------------------------- |
| Running      | Action is running, more messages are published |
| Finished     | Action finished successfully                             |
| Failed       | Action finished with failure                             |


## Use the Explore action

The **Explore** action allows you to use the browse service call to iterate through the OPC UA address space. To execute this action, set `actionName` to `explore`.

### Explore Request

The following schema defines the `explore` request object: 

```json
{
    "request": {
        "name": "explore_request",
        "schema": {
            "@type": "Object",
            "fields": [
            {
                "name": "root_data_point",
                "displayName": "RootDataPoint",
                "schema": "string",
                "description": "Starting point, null means root object."
            },
            {
                "name": "depth",
                "displayName": "Depth",
                "schema": "integer",
                "description": "Levels of depth to be explored, -1 means all."
            },
            {
                "name": "max_data_points_per_message",
                "displayName": "MaxDataPointsPerMessage",
                "schema": "integer",
                "description": "Max amount of datapoints per response."
            }]
        }
    }
}
```

> [!div class="mx-tdBreakAll"]
> | Name                          | Mandatory | Datatype         | Default | Comment                                                                                   |
> | ----------------------------- | --------- | ---------------- | ------- | ----------------------------------------------------------------------------------------- |
> | `root_data_point`             | false     | String           | null    | Expanded Node Id, that defines the start OPC UA node for browsing, null means root object |
> | `depth`                       | false     | Unsigned Integer | 0       | Levels of depth to be browsed, -1 means all levels                                        |
> | `max_data_points_per_message` | false     | Unsigned Integer | 1000    | Maximum amount of datapoints per response                                                |

### Explore Response

The following schema defines the `explore` response object: 

```json
{
    "response": {
        "name": "explore_response",
        "schema": {
            "@type": "Array",
            "elementSchema": {
                "@type": "Object",
                "fields": [
                {
                    "name": "id",
                    "displayName": "Id",
                    "schema": "string"
                },
                {
                    "name": "name",
                    "displayName": "Name",
                    "schema": "string"
                },
                {
                    "name": "type",
                    "displayName": "Type",
                    "schema": "string"
                },
                {
                    "name": "parent",
                    "displayName": "Parent",
                    "schema": "string"
                },
                {
                    "name": "tag",
                    "displayName": "Tag",
                    "schema": "string"
                }]
            }
        }
    }
}
```

### Call the Explore action
The following steps show an example of how to call the **Explore** action. 

1. Subscribe to the topic that that writes the responses:

    ```bash
    mosquitto_sub.exe \
    -h localhost \
    -p 1883 \
    -q 1 \
    -V mqttv5 \
    -t /response
    ```

1. Create the request object and save it as `payload.json`. The following example explores the complete address space:

    ```json
    {
        "depth": -1
    }
    ```

1. Publish the request to the following topic: `opcua/actions/opc-ua-connector/opc-ua-connector/invoke`.

    ```bash
    mosquitto_pub.exe \
    -h localhost \
    -p 1883 \
    -q 1 \
    -V mqttv5 \
    -t opcua/actions/opc-ua-connector/opc-ua-connector/invoke \
    -D PUBLISH user-property actionName explore \
    -D PUBLISH response-topic /response \
    -f .\payload.json
    ```

The response message for the preceding code looks like the following example:

```json
[
    {"id":"nsu=http://microsoft.com/Opc/OpcPlc/;s=SlowUInt21","name":"SlowUInt21","type":"UInt32","parent":"nsu=http://microsoft.com/Opc/OpcPlc/;s=Slow","tag":null},
    {"id":"nsu=http://microsoft.com/Opc/OpcPlc/;s=SlowUInt22","name":"SlowUInt22","type":"UInt32","parent":"nsu=http://microsoft.com/Opc/OpcPlc/;s=Slow","tag":null},
    {"id":"nsu=http://microsoft.com/Opc/OpcPlc/;s=SlowUInt23","name":"SlowUInt23","type":"UInt32","parent":"nsu=http://microsoft.com/Opc/OpcPlc/;s=Slow","tag":null},
    {"id":"nsu=http://microsoft.com/Opc/OpcPlc/;s=SlowUInt24","name":"SlowUInt24","type":"UInt32","parent":"nsu=http://microsoft.com/Opc/OpcPlc/;s=Slow","tag":null},
    {"id":"nsu=http://microsoft.com/Opc/OpcPlc/;s=SlowUInt25","name":"SlowUInt25","type":"UInt32","parent":"nsu=http://microsoft.com/Opc/OpcPlc/;s=Slow","tag":null},
    {"id":"nsu=http://microsoft.com/Opc/OpcPlc/;s=BadSlowUInt1","name":"BadSlowUInt1","type":"UInt32","parent":"nsu=http://microsoft.com/Opc/OpcPlc/;s=Slow","tag":null}
]
```

## Use the Write action

The **Write** action allows you to use an OPC UA write service call to write the value property of node variables of the OPC UA server. To execute this action, set `actionName` to `write`.

### Write request

The following schema defines the `write` request object: 

```json
{
    "request": {
        "name": "write_request",
        "schema": {
            "@type": "Object",
            "fields": [
            {
                "name": "asset-name",
                "displayName": "assetName",
                "schema": "string",
                "description": "the asset name to be written to"
            },
            {
                "name": "data-values",
                "displayName": "dataValues",
                "schema": {
                    "@type": "Object",
                    "fields": [
                    {
                    "name": "dtmi-placeholder-1",
                    "schema" : {
                        "@type": "Object",
                        "fields": [
                            {
                                "name": "value",
                                "displayName": "value",
                                "schema": "",
                                "description": "the value to be written to the asset's variable identified by the dtmi-placeholders"
                            }
                        ]
                        }
                    },
                    {
                        "name": "dtmi-placeholder-n",
                        "schema" : {
                            "@type": "Object",
                            "fields": [
                            {
                                "name": "value",
                                "displayName": "value",
                                "schema": "",
                                "description": "the value to be written to the asset's variable identified by the dtmi-placeholders"
                            }
                            ]
                        }
                    }
                    ]
                }
                "description": "datapoints and corresponding values to be written"
            },
            ]
        }
    }
}
```

```json
{
    "response": {
        "name": "write_response",
        "schema": {
            "@type": "Object",
            "fields": [
            {
            "name": "dtmi-placeholder-1",
            "schema" : {
                "@type": "Object",
                "fields": [
                    {
                        "name": "status-code",
                        "displayName": "statusCode",
                        "schema": "integer",
                        "description": "a bad status code if the write failed"
                    }
                ]
                }
            },
            {
                "name": "dtmi-placeholder-n",
                "schema" : {
                    "@type": "Object",
                    "fields": [
                    {
                        "name": "status",
                        "displayName": "status",
                        "schema": "integer",
                        "description": "a bad status code if the write failed"
                    }
                    ]
                }
            }
            ]
        }
    }
}
```

> [!div class="mx-tdBreakAll"]
> | Name                          | Mandatory | Datatype         | Default | Comment                                                                                   |
> | ----------------------------- | --------- | ---------------- | ------- | ----------------------------------------------------------------------------------------- |
> | `asset-name`                  | true      | String           | null    | the name of the asset associated with the write action                                    |
> | `dataValues`                  | true      | Object           | N/A     | defines all the ids to be written to                                                      |
> | `dtmi-placeholder-1`          | true      | object           | N/A     | contains an object storing the value to be written to the variable                        |
> | `dtmi-placeholder-n`          | true      | object           | N/A     | contains an object storing the value to be written to the variable                        |
> | `value`                       | true      | variant          | N/A     | the value to be written, as a datatype easy to be parsed into the variable's datatype     |
> | `statusCode`                  | true      | integer          | N/A     | OPC UA Status code in case of a write failure                                             |

#### Supported data types
For data types, the current release implements OPC UA base data-types and OPC UA arrays of base data-types. Other data types aren't currently supported. 

### Write response
The `write` response object returns relevant information only if the **Write** action fails or is partially successful. If there's a failure, the user receives a notification, and an error message provides relevant information about the reason. 

#### Success response payload
A successful response payload is an empty object, as shown in the following example:

```json
{
}
```

### Failure response payload
If there's a failure, the user receives a notification, and an error message provides relevant information about the reason.

The following example shows an action failure response payload:

```Json
{
    "error_message":"Action invocation returned error: One or more errors occurred. (Failed to read data type for node nsu=http://microsoft.com/Opc/OpcPlc/ReferenceTest;s=Scalar_Simulation_Boolean_bad due to BadNodeIdUnknown) (Failed to read data type for node nsu=http://microsoft.com/Opc/OpcPlc/ReferenceTest;s=Scalar_Simulation_Byte_bad due to BadNodeIdUnknown)"
}
```

The following example shows a response where one variable failed:

```Json
{
    "dtmi:com:example:OpcPlc;1:AccessRights_AccessAll_RO": {
        "statusCode": 500
    }
}
```

### Call the Write action
The following steps show an example of how to call the **Write** action. 

1. Subscribe to the topic that writes the responses:

    ```bash
    mosquitto_sub.exe \
    -h localhost \
    -p 1883 \
    -q 1 \
    -V mqttv5 \
    -t opcuabroker/actions/opcua-connector/aio-opcplc-connector/response
    ```

1. Create the request object and save it as `payload.json`. The following example explores the complete address space:

    ```json
    {
        "assetName" : "thermostat-sample-3",
        "dataValues" : {
            "dtmi:com:example:Thermostat:_contents:__FastUInt1;1": {
                "value" : 1
            },
            "dtmi:com:example:Thermostat:_contents:__FastUInt2;1": {
                "value" : 1
            },
            "dtmi:com:example:Thermostat:_contents:__FastUInt3;1": {
                "value" : 1
            },
            "dtmi:com:example:Thermostat:_contents:__FastUInt4;1": {
                "value" : 1
            }
        }
    }
    ```

3. Publish the request to the following topic: `opcuabroker/actions/opcua-connector/aio-opcplc-connector/invoke`.

    ```bash
    mosquitto_pub.exe \
    -h localhost \
    -p 1883 \
    -q 1 \
    -V mqttv5 \
    -t opcuabroker/actions/opcua-connector/aio-opcplc-connector/invoke \
    -D PUBLISH user-property actionName write \
    -D PUBLISH response-topic opcuabroker/actions/opcua-connector/aio-opcplc-connector/response \
    -f .\payload.json
    ```

The response message for the preceding code looks like the following example:

```json
{}
```

## Related content

- [Define OPC UA assets using OPC UA Broker](howto-define-opcua-assets.md)
- [Uninstall OPC UA Broker using helm](howto-uninstall-opcua-broker-using-helm.md)