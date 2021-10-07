---
title: Use the REST API to add device templates in Azure IoT Central
description: How to use the IoT Central REST API to add device templates in an application
author: v-krishnag
ms.author: v-krishnag
ms.date: 09/28/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage device templates

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage device templates in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

## Device templates

Any device that's connected to and managed by an IoT Central application is associated with a device template in the application. The device model in the template acts as a contract between the IoT Central application and the devices connected to it. The device template also includes information about how IoT Central displays information about the device in the web UI. For example, a device template can include definitions of dashboards to show device telemetry or to send commands to a device.

The device model section of a device template specifies the capabilities of a device you want to connect to your application. For example, a device template can specify:

* The types of telemetry, such as temperature, that your device sends to IoT Central
* Properties, such as firmware version, that your device will report to IoT Central.
* Properties, such as target temperature, that IoT Central will set on your device.
* Commands, such as reboot, that IoT Central will send to your device.

The capabilities in a device model are grouped into interfaces. Interfaces enable you to share groups of related capabilities across templates. For example, the common Device Information interface defines device properties such as the manufacturer, model, and software version.

Device templates includes _cloud properties_ which specifies any device metadata to store. Cloud properties are never synchronized with devices and only exist in the application. It also includes _customizations_, they can override some of the definitions in the device model. Customizations are useful if you want to refine how the application handles a value, such as changing the display name for a property or the color used to display a telemetry value. However, you cannot add _views_ from the API, it can be added only through the UI.

## Device templates REST API

The IoT Central REST API lets you:

* Add a device template to your application
* Update a device template in your application
* Get a list of the device templates in the application
* Get a device template by ID
* Delete a device template in your application

### Add a device template

Use the following request to publish a new device template. Default views will be automatically generated for new device templates created this way.

```http
PUT https://{subdomain}.{baseDomain}/api/deviceTemplates/{deviceTemplateId}?api-version=1.0
```

>[!NOTE]
>Device template IDs follow the [DTDL](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#digital-twin-model-identifier) naming convention, for example: `dtmi:contoso:mythermostattemplate;1`

The sample request body looks like the following example:

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

Request body some required fields:

* `@id`: a unique ID in the form of a simple Uniform Resource Name.
* `@type`: declares that this object is an interface.
* `@context`: specifies the DTDL version used for the interface.
* `contents`: lists the properties, telemetry, and commands that make up your device. The capabilities may be defined in multiple interfaces.
* `capabilityModel` : Every device template has a capability model. A relationship is established between each module capability model and a device model. A capability model implements one or more module interfaces.

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

### Get a device template

Use the following request to retrieve details of a device template from your application:

```http
GET https://{subdomain}.{baseDomain}/api/deviceTemplates/{deviceTemplateId}?api-version=1.0
```

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

### List device templates

Use the following request to retrieve a list of device templates from your application:

```http
GET https://{subdomain}.{baseDomain}/api/deviceTemplates?api-version=1.0
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

### Update a device template

```http
PATCH https://{subdomain}.{baseDomain}/api/deviceTemplates/{deviceTemplateId}?api-version=1.0
```

>[!NOTE] 
>`{deviceTemplateId}` should be the same as the `@id` in the payload.

The sample request body looks like the following example which adds a new cloud property:

```json
{
    "displayName": "Thermostat",

    "@id": "dtmi:contoso:mythermostattemplate",
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

### Delete a device template

Use the following request to delete a device template:

```http
DELETE https://{subdomain}.{baseDomain}/api/deviceTemplates/{deviceTemplateId}?api-version=1.0
```

The sample request looks like the following example:

```http
DELETE https://appsubdomain.azureiotcentral.com/api/deviceTemplates/dtmi:contoso:testDeviceTemplate;1?api-version=1.0
```

## Next steps

Now that you've learned how to manage device templates with the REST API, a suggested next step is to [How to create device templates from IoT Central GUI.](howto-set-up-template.md#create-a-device-template)
