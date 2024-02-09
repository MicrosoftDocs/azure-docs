---
title: Add device templates in Azure IoT Central with the REST API
description: How to use the IoT Central REST API to add, update, delete, and manage device templates in an application
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage device templates

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage [device templates](concepts-device-templates.md) in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

To learn how to manage device templates by using the IoT Central UI, see [How to set up device templates](../core/howto-set-up-template.md) and [How to edit device templates](../core/howto-edit-device-template.md)

## Device templates

A device template contains a device model and view definitions. The REST API lets you manage the device model including cloud property definitions. You must use the UI to create and manage views.

The device model section of a device template specifies the capabilities of a device you want to connect to your application. Capabilities include telemetry, properties, and commands. The model is defined using [DTDL V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md).

> [!NOTE]
> IoT Central defines some extensions to the DTDL language. To learn more, see [IoT Central extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md).

## Device templates REST API

The IoT Central REST API lets you:

* Add a device template to your application
* Update a device template in your application
* Get a list of the device templates in the application
* Get a device template by ID
* Delete a device template in your application
* Filter the list of device templates in the application

## Add a device template

Use the following request to create and publish a new device template. Default views are automatically generated for device templates created this way.

```http
PUT https://{your app subdomain}/api/deviceTemplates/{deviceTemplateId}?api-version=2022-07-31
```

>[!NOTE]
>Device template IDs follow the [DTDL](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md#digital-twin-model-identifier) naming convention, for example: `dtmi:contoso:mythermostattemplate;1`

The following example shows a request body that adds a device template for a thermostat device. The `capabilityModel` includes temperature telemetry, two properties, and a command. The device template defines the `CustomerName` cloud property and customizes the `targetTemperature` property with `decimalPlaces`, `displayUnit`, `maxValue`, and `minValue`. The value of the device template `@id` must match the `deviceTemplateId` value in the URL. The value of the device template `@id` isn't the same as the value of the `capabilityModel` `@id` value.

```json
{
    "displayName": "Thermostat",

    "@id": "dtmi:contoso:mythermostattemplate;1",
    "@type": [
        "ModelDefinition",
        "DeviceModel"
    ],
    "@context": [
        "dtmi:iotcentral:context;2",
        "dtmi:dtdl:context;2"
    ],
    "capabilityModel": {
        "@id": "dtmi:contoso:Thermostat;1",
        "@type": "Interface",
        "contents": [
            {
                "@type": [
                    "Telemetry",
                    "Temperature"
                ],
                "description": "Temperature in degrees Celsius.",
                "displayName": "Temperature",
                "name": "temperature",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Allows to remotely specify the desired target temperature.",
                "displayName": "Target Temperature",
                "name": "targetTemperature",
                "schema": "double",
                "unit": "degreeCelsius",
                "writable": true,
                "decimalPlaces": 1,
                "displayUnit": "C",
                "maxValue": 80,
                "minValue": 50
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Returns the max temperature since last device reboot.",
                "displayName": "Max temperature since last reboot.",
                "name": "maxTempSinceLastReboot",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": "Command",
                "description": "This command returns the max, min and average temperature from the specified time to the current time.",
                "displayName": "Get report",
                "name": "getMaxMinReport",
                "request": {
                    "@type": "CommandPayload",
                    "description": "Period to return the max-min report.",
                    "displayName": "Since",
                    "name": "since",
                    "schema": "dateTime"
                },
                "response": {
                    "@type": "CommandPayload",
                    "displayName": "Temperature Report",
                    "name": "tempReport",
                    "schema": {
                        "@type": "Object",
                        "fields": [
                            {
                                "displayName": "Max temperature",
                                "name": "maxTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Min temperature",
                                "name": "minTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Average Temperature",
                                "name": "avgTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Start Time",
                                "name": "startTime",
                                "schema": "dateTime"
                            },
                            {
                                "displayName": "End Time",
                                "name": "endTime",
                                "schema": "dateTime"
                            }
                        ]
                    }
                }
            },
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "StringValue"
                ],
                "displayName": "Customer Name",
                "name": "CustomerName",
                "schema": "string"
            }
        ],
        "description": "Reports current temperature and provides desired temperature control.",
        "displayName": "Thermostat"
    }
}
```

The request body has some required fields:

* `@id`: a unique ID in the form of a simple Uniform Resource Name.
* `@type`: declares that the top-level object is a `"ModelDefinition","DeviceModel"`.
* `@context`: specifies the DTDL version used for the interface.
* `contents`: lists the properties, telemetry, and commands that make up your device. The capabilities may be defined in multiple interfaces.
* `capabilityModel` : Every device template has a capability model. A relationship is established between each module capability model and a device model. A capability model implements one or more module interfaces.

> [!TIP]
> The device template JSON is not a standard DTDL document. The device template JSON includes IoT Central specific data such as cloud property definitions and display units. You can use the device template JSON format to import and export device templates in IoT Central by using the REST API, the CLI, and the UI.

There are some optional fields you can use to add more details to the capability model, such as display name and description.

Each entry in the list of interfaces in the implements section has a:

* `name`: the programming name of the interface.
* `schema`: the interface the capability model implements.

The response to this request looks like the following example:

```json
{
    "etag": "\"~F27cqSo0ON3bfOzwgZxAl89/JVvM80+dds6y8+mZh5M=\"",
    "displayName": "Thermostat",
    "capabilityModel": {
        "@id": "dtmi:contoso:Thermostat;1",
        "@type": "Interface",
        "contents": [
            {
                "@type": [
                    "Telemetry",
                    "Temperature"
                ],
                "description": "Temperature in degrees Celsius.",
                "displayName": "Temperature",
                "name": "temperature",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": [
                    "Property",
                    "Temperature",
                    "NumberValue"
                ],
                "description": "Allows to remotely specify the desired target temperature.",
                "displayName": "Target Temperature",
                "name": "targetTemperature",
                "schema": "double",
                "unit": "degreeCelsius",
                "writable": true,
                "decimalPlaces": 1,
                "displayUnit": "C",
                "maxValue": 80,
                "minValue": 50
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Returns the max temperature since last device reboot.",
                "displayName": "Max temperature since last reboot.",
                "name": "maxTempSinceLastReboot",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": "Command",
                "description": "This command returns the max, min and average temperature from the specified time to the current time.",
                "displayName": "Get report",
                "name": "getMaxMinReport",
                "request": {
                    "@type": "CommandPayload",
                    "description": "Period to return the max-min report.",
                    "displayName": "Since",
                    "name": "since",
                    "schema": "dateTime"
                },
                "response": {
                    "@type": "CommandPayload",
                    "displayName": "Temperature Report",
                    "name": "tempReport",
                    "schema": {
                        "@type": "Object",
                        "fields": [
                            {
                                "displayName": "Max temperature",
                                "name": "maxTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Min temperature",
                                "name": "minTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Average Temperature",
                                "name": "avgTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Start Time",
                                "name": "startTime",
                                "schema": "dateTime"
                            },
                            {
                                "displayName": "End Time",
                                "name": "endTime",
                                "schema": "dateTime"
                            }
                        ]
                    }
                }
            },
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "StringValue"
                ],
                "displayName": "Customer Name",
                "name": "CustomerName",
                "schema": "string"
            }
        ],
        "description": "Reports current temperature and provides desired temperature control.",
        "displayName": "Thermostat"
    },
    "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
    "@type": [
        "ModelDefinition",
        "DeviceModel"
    ],
    "@context": [
        "dtmi:iotcentral:context;2",
        "dtmi:dtdl:context;2"
    ]
}

```

## Get a device template

Use the following request to retrieve details of a device template from your application:

```http
GET https://{your app subdomain}/api/deviceTemplates/{deviceTemplateId}?api-version=2022-07-31
```

>[!NOTE]
> You can get the `deviceTemplateId` from IoT Central Application UI by hovering the mouse over a device.

The response to this request looks like the following example:

```json
{
    "etag": "\"~F27cqSo0ON3bfOzwgZxAl89/JVvM80+dds6y8+mZh5M=\"",
    "displayName": "Thermostat",
    "capabilityModel": {
        "@id": "dtmi:contoso:Thermostat;1",
        "@type": "Interface",
        "contents": [
            {
                "@type": [
                    "Telemetry",
                    "Temperature"
                ],
                "description": "Temperature in degrees Celsius.",
                "displayName": "Temperature",
                "name": "temperature",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": [
                    "Property",
                    "Temperature",
                    "NumberValue"
                ],
                "description": "Allows to remotely specify the desired target temperature.",
                "displayName": "Target Temperature",
                "name": "targetTemperature",
                "schema": "double",
                "unit": "degreeCelsius",
                "writable": true,
                "decimalPlaces": 1,
                "displayUnit": "C",
                "maxValue": 80,
                "minValue": 50
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Returns the max temperature since last device reboot.",
                "displayName": "Max temperature since last reboot.",
                "name": "maxTempSinceLastReboot",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": "Command",
                "description": "This command returns the max, min and average temperature from the specified time to the current time.",
                "displayName": "Get report",
                "name": "getMaxMinReport",
                "request": {
                    "@type": "CommandPayload",
                    "description": "Period to return the max-min report.",
                    "displayName": "Since",
                    "name": "since",
                    "schema": "dateTime"
                },
                "response": {
                    "@type": "CommandPayload",
                    "displayName": "Temperature Report",
                    "name": "tempReport",
                    "schema": {
                        "@type": "Object",
                        "fields": [
                            {
                                "displayName": "Max temperature",
                                "name": "maxTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Min temperature",
                                "name": "minTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Average Temperature",
                                "name": "avgTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Start Time",
                                "name": "startTime",
                                "schema": "dateTime"
                            },
                            {
                                "displayName": "End Time",
                                "name": "endTime",
                                "schema": "dateTime"
                            }
                        ]
                    }
                }
            },
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "StringValue"
                ],
                "displayName": "Customer Name",
                "name": "CustomerName",
                "schema": "string"
            }
        ],
        "description": "Reports current temperature and provides desired temperature control.",
        "displayName": "Thermostat"
    },
    "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
    "@type": [
        "ModelDefinition",
        "DeviceModel"
    ],
    "@context": [
        "dtmi:iotcentral:context;2",
        "dtmi:dtdl:context;2"
    ]
}
```

## Update a device template

```http
PATCH https://{your app subdomain}/api/deviceTemplates/{deviceTemplateId}?api-version=2022-07-31
```

The sample request body looks like the following example that adds a `LastMaintenanceDate` cloud property to the `capabilityModel` in the device template:

```json
{
    "capabilityModel": {
        "contents": [
            {
                "@type": [
                    "Telemetry",
                    "Temperature"
                ],
                "description": "Temperature in degrees Celsius.",
                "displayName": "Temperature",
                "name": "temperature",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Allows to remotely specify the desired target temperature.",
                "displayName": "Target Temperature",
                "name": "targetTemperature",
                "schema": "double",
                "unit": "degreeCelsius",
                "writable": true,
                "decimalPlaces": 1,
                "displayUnit": "C",
                "maxValue": 80.0,
                "minValue": 50.0
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Returns the max temperature since last device reboot.",
                "displayName": "Max temperature since last reboot.",
                "name": "maxTempSinceLastReboot",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": "Command",
                "description": "This command returns the max, min and average temperature from the specified time to the current time.",
                "displayName": "Get report",
                "name": "getMaxMinReport",
                "request": {
                    "@type": "CommandPayload",
                    "description": "Period to return the max-min report.",
                    "displayName": "Since",
                    "name": "since",
                    "schema": "dateTime"
                },
                "response": {
                    "@type": "CommandPayload",
                    "displayName": "Temperature Report",
                    "name": "tempReport",
                    "schema": {
                        "@type": "Object",
                        "fields": [
                            {
                                "displayName": "Max temperature",
                                "name": "maxTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Min temperature",
                                "name": "minTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Average Temperature",
                                "name": "avgTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Start Time",
                                "name": "startTime",
                                "schema": "dateTime"
                            },
                            {
                                "displayName": "End Time",
                                "name": "endTime",
                                "schema": "dateTime"
                            }
                        ]
                    }
                }
            },
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "StringValue"
                ],
                "displayName": "Customer Name",
                "name": "CustomerName",
                "schema": "string"
            },
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "StringValue"
                ],
                "displayName": "Last Maintenance Date",
                "name": "LastMaintenanceDate",
                "schema": "dateTime"
            }
        ],
        "description": "Reports current temperature and provides desired temperature control.",
        "displayName": "Thermostat"
    }
}

```

The response to this request looks like the following example:

```json
{
    "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P4q/KxCU2xskrmk=\"",
    "displayName": "Thermostat",
    "capabilityModel": {
        "@id": "dtmi:contoso:Thermostat;1",
        "@type": "Interface",
        "contents": [
            {
                "@type": [
                    "Telemetry",
                    "Temperature"
                ],
                "description": "Temperature in degrees Celsius.",
                "displayName": "Temperature",
                "name": "temperature",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Allows to remotely specify the desired target temperature.",
                "displayName": "Target Temperature",
                "name": "targetTemperature",
                "schema": "double",
                "unit": "degreeCelsius",
                "writable": true,
                "decimalPlaces": 1,
                "displayUnit": "C",
                "maxValue": 80,
                "minValue": 50
            },
            {
                "@type": [
                    "Property",
                    "Temperature"
                ],
                "description": "Returns the max temperature since last device reboot.",
                "displayName": "Max temperature since last reboot.",
                "name": "maxTempSinceLastReboot",
                "schema": "double",
                "unit": "degreeCelsius"
            },
            {
                "@type": "Command",
                "description": "This command returns the max, min and average temperature from the specified time to the current time.",
                "displayName": "Get report",
                "name": "getMaxMinReport",
                "request": {
                    "@type": "CommandPayload",
                    "description": "Period to return the max-min report.",
                    "displayName": "Since",
                    "name": "since",
                    "schema": "dateTime"
                },
                "response": {
                    "@type": "CommandPayload",
                    "displayName": "Temperature Report",
                    "name": "tempReport",
                    "schema": {
                        "@type": "Object",
                        "fields": [
                            {
                                "displayName": "Max temperature",
                                "name": "maxTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Min temperature",
                                "name": "minTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Average Temperature",
                                "name": "avgTemp",
                                "schema": "double"
                            },
                            {
                                "displayName": "Start Time",
                                "name": "startTime",
                                "schema": "dateTime"
                            },
                            {
                                "displayName": "End Time",
                                "name": "endTime",
                                "schema": "dateTime"
                            }
                        ]
                    }
                }
            },
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "StringValue"
                ],
                "displayName": "Customer Name",
                "name": "CustomerName",
                "schema": "string"
            },
            {
                "@type": [
                    "Property",
                    "Cloud",
                    "DateTimeValue"
                ],
                "displayName": "Last Maintenance Date",
                "name": "LastMaintenanceDate",
                "schema": "dateTime"
            }
        ],
        "description": "Reports current temperature and provides desired temperature control.",
        "displayName": "Thermostat"
    },
    "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
    "@type": [
        "ModelDefinition",
        "DeviceModel"
    ],
    "@context": [
        "dtmi:iotcentral:context;2",
        "dtmi:dtdl:context;2"
    ]
}
```

## Delete a device template

Use the following request to delete a device template:

```http
DELETE https://{your app subdomain}/api/deviceTemplates/{deviceTemplateId}?api-version=2022-07-31
```

## List device templates

Use the following request to retrieve a list of device templates from your application:

```http
GET https://{your app subdomain}/api/deviceTemplates?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "etag": "\"~F27cqSo0ON3bfOzwgZxAl89/JVvM80+dds6y8+mZh5M=\"",
            "displayName": "Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:Thermostat;1",
                "@type": "Interface",
                "contents": [
                    {
                        "@type": [
                            "Telemetry",
                            "Temperature"
                        ],
                        "description": "Temperature in degrees Celsius.",
                        "displayName": "Temperature",
                        "name": "temperature",
                        "schema": "double",
                        "unit": "degreeCelsius"
                    },
                    {
                        "@type": [
                            "Property",
                            "Temperature",
                            "NumberValue"
                        ],
                        "description": "Allows to remotely specify the desired target temperature.",
                        "displayName": "Target Temperature",
                        "name": "targetTemperature",
                        "schema": "double",
                        "unit": "degreeCelsius",
                        "writable": true,
                        "decimalPlaces": 1,
                        "displayUnit": "C",
                        "maxValue": 80,
                        "minValue": 50
                    },
                    {
                        "@type": [
                            "Property",
                            "Temperature"
                        ],
                        "description": "Returns the max temperature since last device reboot.",
                        "displayName": "Max temperature since last reboot.",
                        "name": "maxTempSinceLastReboot",
                        "schema": "double",
                        "unit": "degreeCelsius"
                    },
                    {
                        "@type": "Command",
                        "description": "This command returns the max, min and average temperature from the specified time to the current time.",
                        "displayName": "Get report",
                        "name": "getMaxMinReport",
                        "request": {
                            "@type": "CommandPayload",
                            "description": "Period to return the max-min report.",
                            "displayName": "Since",
                            "name": "since",
                            "schema": "dateTime"
                        },
                        "response": {
                            "@type": "CommandPayload",
                            "displayName": "Temperature Report",
                            "name": "tempReport",
                            "schema": {
                                "@type": "Object",
                                "fields": [
                                    {
                                        "displayName": "Max temperature",
                                        "name": "maxTemp",
                                        "schema": "double"
                                    },
                                    {
                                        "displayName": "Min temperature",
                                        "name": "minTemp",
                                        "schema": "double"
                                    },
                                    {
                                        "displayName": "Average Temperature",
                                        "name": "avgTemp",
                                        "schema": "double"
                                    },
                                    {
                                        "displayName": "Start Time",
                                        "name": "startTime",
                                        "schema": "dateTime"
                                    },
                                    {
                                        "displayName": "End Time",
                                        "name": "endTime",
                                        "schema": "dateTime"
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "@type": [
                            "Property",
                            "Cloud",
                            "StringValue"
                        ],
                        "displayName": "Customer Name",
                        "name": "CustomerName",
                        "schema": "string"
                    }
                ],
                "description": "Reports current temperature and provides desired temperature control.",
                "displayName": "Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        },
        {
            "etag": "\"~XS5GovPNzJqFIwkkV/vyWW5U/6if2NwC/NqUlDxExAY=\"",
            "displayName": "Thermostat2",
            "capabilityModel": {
                "@id": "dtmi:contoso:Thermostat2;1",
                "@type": "Interface",
                "contents": [
                    {
                        "@type": [
                            "Telemetry",
                            "Temperature"
                        ],
                        "description": "Temperature in degrees Celsius.",
                        "displayName": "Temperature",
                        "name": "temperature",
                        "schema": "double",
                        "unit": "degreeCelsius"
                    },
                    {
                        "@type": [
                            "Property",
                            "Temperature",
                            "NumberValue"
                        ],
                        "description": "Allows to remotely specify the desired target temperature.",
                        "displayName": "Target Temperature",
                        "name": "targetTemperature",
                        "schema": "double",
                        "unit": "degreeCelsius",
                        "writable": true,
                        "decimalPlaces": 1,
                        "displayUnit": "C",
                        "maxValue": 80,
                        "minValue": 50
                    },
                    {
                        "@type": [
                            "Property",
                            "Temperature"
                        ],
                        "description": "Returns the max temperature since last device reboot.",
                        "displayName": "Max temperature since last reboot.",
                        "name": "maxTempSinceLastReboot",
                        "schema": "double",
                        "unit": "degreeCelsius"
                    },
                    {
                        "@type": "Command",
                        "description": "This command returns the max, min and average temperature from the specified time to the current time.",
                        "displayName": "Get report",
                        "name": "getMaxMinReport",
                        "request": {
                            "@type": "CommandPayload",
                            "description": "Period to return the max-min report.",
                            "displayName": "Since",
                            "name": "since",
                            "schema": "dateTime"
                        },
                        "response": {
                            "@type": "CommandPayload",
                            "displayName": "Temperature Report",
                            "name": "tempReport",
                            "schema": {
                                "@type": "Object",
                                "fields": [
                                    {
                                        "displayName": "Max temperature",
                                        "name": "maxTemp",
                                        "schema": "double"
                                    },
                                    {
                                        "displayName": "Min temperature",
                                        "name": "minTemp",
                                        "schema": "double"
                                    },
                                    {
                                        "displayName": "Average Temperature",
                                        "name": "avgTemp",
                                        "schema": "double"
                                    },
                                    {
                                        "displayName": "Start Time",
                                        "name": "startTime",
                                        "schema": "dateTime"
                                    },
                                    {
                                        "displayName": "End Time",
                                        "name": "endTime",
                                        "schema": "dateTime"
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "@type": [
                            "Property",
                            "Cloud",
                            "StringValue"
                        ],
                        "displayName": "Customer Name",
                        "name": "CustomerName",
                        "schema": "string"
                    }
                ],
                "description": "Reports current temperature and provides desired temperature control.",
                "displayName": "Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u67",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        }
    ]
}
```

### Use ODATA filters

In the preview version of the API (`api-version=2022-10-31-preview`), you can use ODATA filters to filter and sort the results returned by the list device templates API.

### maxpagesize

Use the **maxpagesize** filter to set the result size. The maximum returned result size is 100, and the default size is 25.

Use the following request to retrieve the top 10 device templates from your application:

```http
GET https://{your app subdomain}/api/deviceTemplates?api-version=2022-10-31-preview&maxpagesize=10
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P4q/KxCU2xskrmk=\"",
            "displayName": "Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:Thermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current temperature and provides desired temperature control.",
                "displayName": "Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        },
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P4q/KxCU2xskrmk=\"",
            "displayName": "Thermostat3",
            "capabilityModel": {
                "@id": "dtmi:contoso:Thermostat;3",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current temperature and provides desired temperature control.",
                "displayName": "Thermostat3"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;3",
                "dtmi:dtdl:context;2"
            ]
        },
        // ...
    ],
    "nextLink": "https://{your app subdomain}.azureiotcentral.com/api/deviceTemplates?api-version=2022-07-31&%24top=1&%24skiptoken=%7B%22token%22%3A%22%2BRID%3A%7EJWYqAKZQKp20qCoAAAAACA%3D%3D%23RT%3A1%23TRC%3A1%23ISV%3A2%23IEO%3A65551%23QCF%3A4%22%2C%22range%22%3A%7B%22min%22%3A%2205C1DFFFFFFFFC%22%2C%22max%22%3A%22FF%22%7D%7D"
}
```

The response includes a **nextLink** value that you can use to retrieve the next page of results.

### filter

Use **filter** to create expressions that filter the list of device templates. The following table shows the comparison operators you can use:

| Comparison Operator | Symbol | Example                        |
| -------------------- | ------ | ------------------------------ |
| Equals               | eq     | `'@id' eq 'dtmi:example:test;1'` |
| Not Equals           | ne     | `displayName ne 'template 1'`    |
| Less than or equals  | le     | `displayName le 'template A'`    |
| Less than            | lt     | `displayName lt 'template B'`    |
| Greater than or equals | ge   | `displayName ge 'template A'`    |
| Greater than         | gt     | `displayName gt 'template B'`    |

The following table shows the logic operators you can use in *filter* expressions:

| Logic Operator | Symbol | Example |
| -------------- | ------ |  ------ |
| AND            | and    | `'@id' eq 'dtmi:example:test;1' and capabilityModelId eq 'dtmi:example:test:model1;1'` |
| OR             | or     | `'@id' eq 'dtmi:example:test;1' or displayName ge 'template'` |

Currently, *filter* works with the following device template fields:

| FieldName           | Type   | Description                         |
| ------------------- | ------ | ----------------------------------- |
| `@id`               | string | Device template ID                  |
| `displayName`       | string | Device template display name        |
| `capabilityModelId` | string | Device template capability model ID |

**filter supported functions:**

Currently, the only supported filter function for device template lists is the `contains` function:

```txt
filter=contains(displayName, 'template1')
```

The following example shows how to retrieve all the device templates where the display name contains the string `thermostat`:

```http
GET https://{your app subdomain}/api/deviceTemplates?api-version=2022-10-31-preview&filter=contains(displayName, 'thermostat')
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P4q/KxCU2xskrmk=\"",
            "displayName": "Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:Thermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current temperature and provides desired temperature control.",
                "displayName": "Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        },
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P46/KxCU2xskrmk=\"",
            "displayName": "Room Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:RoomThermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current room temperature and provides desired temperature control.",
                "displayName": "Room Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u7",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        },
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P7q/KxCU2xskrmk=\"",
            "displayName": "Vehicle Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:VehicleThermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current vehicle temperature and provides desired temperature control.",
                "displayName": "Vehicle Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lt7u39u7",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        }
    ]
}
```

### orderby

Use **orderby** to sort the results. Currently, **orderby** only lets you sort on **displayName**. By default, **orderby** sorts in ascending order. Use **desc** to sort in descending order, for example:

```txt
orderby=displayName
orderby=displayName desc
```

The following example shows how to retrieve all the device templates where the result is sorted by `displayName`:

```http
GET https://{your app subdomain}/api/deviceTemplates?api-version=2022-10-31-preview&orderby=displayName
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P4q/KxCU2xskrmk=\"",
            "displayName": "Aircon Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:AirconThermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current temperature and provides desired temperature control.",
                "displayName": "Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        },
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P46/KxCU2xskrmk=\"",
            "displayName": "Room Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:RoomThermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current room temperature and provides desired temperature control.",
                "displayName": "Room Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u7",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        },
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P7q/KxCU2xskrmk=\"",
            "displayName": "Vehicle Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:VehicleThermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current vehicle temperature and provides desired temperature control.",
                "displayName": "Vehicle Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lt7u39u7",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        }
    ]
}
```

You can also combine two or more filters.

The following example shows how to retrieve the top two device templates where the display name contains the string `thermostat`.

```http
GET https://{your app subdomain}/api/deviceTemplates?api-version=2022-10-31-preview&filter=contains(displayName, 'thermostat')&maxpagesize=2
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P4q/KxCU2xskrmk=\"",
            "displayName": "Aircon Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:AirconThermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current temperature and provides desired temperature control.",
                "displayName": "Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u6",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        },
        {
            "etag": "\"~6Ku691rHAgw/yw8u+ygZJGAKjSN4P46/KxCU2xskrmk=\"",
            "displayName": "Room Thermostat",
            "capabilityModel": {
                "@id": "dtmi:contoso:RoomThermostat;1",
                "@type": "Interface",
                "contents": [
                    ...
                ],
                "description": "Reports current room temperature and provides desired temperature control.",
                "displayName": "Room Thermostat"
            },
            "@id": "dtmi:modelDefinition:spzeut3n:n2lteu39u7",
            "@type": [
                "ModelDefinition",
                "DeviceModel"
            ],
            "@context": [
                "dtmi:iotcentral:context;2",
                "dtmi:dtdl:context;2"
            ]
        }
    ]
}
```

## Next steps

Now that you've learned how to manage device templates with the REST API, a suggested next step is to [How to create device templates from IoT Central GUI](howto-set-up-template.md#create-a-device-template).
