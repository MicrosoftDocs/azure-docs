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

# How to use the IoT Central REST API to add device templates

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to add device templates in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

## Device Templates

Any device that's connected to and managed by an IoT Central application is associated with a device template in the application. The device model in the template acts as a contract between the IoT Central application and the devices connected to it. The device template also includes information about how IoT Central displays information about the device in the web UI. For example, a device template can include definitions of dashboards to show device telemetry or to send commands to a device.

The device model section of a device template specifies the capabilities of a device you want to connect to your application. For example, a device template can specify:

* The types of telemetry, such as temperature, that your device will send to IoT Central
* Properties, such as firmware version, that your device will report to IoT Central.
* Properties, such as target temperature, that IoT Central will set on your device.
* Commands, such as reboot, that IoT Central will send to your device.

The capabilities in a device model are grouped into interfaces. Interfaces enable you to share groups of related capabilities across templates. For example, the common Device Information interface defines device properties such as the manufacturer, model, and software version.

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

The sample request body looks like the following example:

```json
{
  "@type": [
    "ModelDefinition",
    "DeviceModel",
    "EdgeModel"
  ],
  "displayName": "Test Definition",
  "capabilityModel": {
    "@id": "dtmi:contoso:testCapabilityModel;1",
    "@type": "Interface",
    "displayName": "Test Capability Model",
    "extends": [
      {
        "@id": "dtmi:contoso:testInterface;1",
        "@type": "Interface",
        "displayName": "Test Interface",
        "contents": [
          {
            "@type": "Telemetry",
            "displayName": "Test Telemetry",
            "name": "testTelemetry",
            "schema": "double"
          },
          {
            "@type": [
              "Telemetry",
              "Event",
              "EventValue"
            ],
            "displayName": "Test Event",
            "name": "testEvent",
            "schema": "integer",
            "severity": "warning"
          },
          {
            "@type": [
              "Property",
              "Initialized"
            ],
            "displayName": "Test Property",
            "name": "testProperty",
            "schema": "string",
            "writable": true,
            "initialValue": "initialValue1"
          },
          {
            "@type": "Property",
            "displayName": "Test Read-Only Property",
            "name": "testReadOnly",
            "schema": "string"
          },
          {
            "@type": "Property",
            "displayName": "Test Complex Property",
            "name": "testComplex",
            "schema": {
              "@id": "dtmi:contoso:testComplex;1",
              "@type": "Object",
              "displayName": "Object",
              "fields": [
                {
                  "displayName": "First",
                  "name": "first",
                  "schema": "string"
                },
                {
                  "displayName": "Second",
                  "name": "second",
                  "schema": "string"
                }
              ]
            },
            "writable": true
          },
          {
            "@type": "Command",
            "commandType": "synchronous",
            "displayName": "Test Command",
            "name": "testCommand",
            "request": {
              "displayName": "Test Request",
              "name": "testRequest",
              "schema": "double"
            },
            "response": {
              "displayName": "Test Response",
              "name": "testResponse",
              "schema": "geopoint"
            }
          },
          {
            "@type": "Property",
            "displayName": "Test Enum",
            "name": "testEnum",
            "schema": {
              "@id": "dtmi:contoso:testEnum;1",
              "@type": "Enum",
              "displayName": "Enum",
              "enumValues": [
                {
                  "displayName": "First",
                  "enumValue": 1,
                  "name": "first"
                },
                {
                  "displayName": "Second",
                  "enumValue": 2,
                  "name": "second"
                }
              ],
              "valueSchema": "integer"
            },
            "writable": true
          }
        ]
      }
    ],
    "contents": [
      {
        "@type": [
          "Relationship",
          "EdgeModule"
        ],
        "displayName": "Test Module",
        "maxMultiplicity": 1,
        "name": "testModule",
        "target": [
          {
            "@id": "dtmi:contoso:testModuleCapabilityModel;1",
            "@type": "Interface",
            "displayName": "Test Module Capability Model",
            "extends": [
              {
                "@id": "dtmi:contoso:testModuleInterface;1",
                "@type": "Interface",
                "contents": [
                  {
                    "@type": "Telemetry",
                    "displayName": "Test Module Telemetry",
                    "name": "testModuleTelemetry",
                    "schema": "double"
                  },
                  {
                    "@type": "Property",
                    "displayName": "Test Module Property",
                    "name": "testModuleProperty",
                    "schema": "string",
                    "writable": true
                  }
                ],
                "displayName": "Test Module Interface"
              }
            ]
          }
        ]
      },
      {
        "@type": [
          "Property",
          "CloudProperty"
        ],
        "displayName": "Test Cloud Property",
        "name": "testCloudProperty",
        "schema": "dateTime"
      }
    ]
  }
}
```

The response to this request looks like the following example: 

```json
{
  "@id": "dtmi:contoso:testDeviceTemplate;1",
  "@type": [
    "ModelDefinition",
    "DeviceModel",
    "EdgeModel"
  ],
  "displayName": "Test Definition",
  "etag": "\"~jbzfGhYctc9wtzNZXVmVua5JjTHO/FfjMUJvk9hqkRY=\"",
  "capabilityModel": {
    "@id": "dtmi:contoso:testCapabilityModel;1",
    "@type": "Interface",
    "displayName": "Test Capability Model",
    "extends": [
      {
        "@id": "dtmi:contoso:testInterface;1",
        "@type": "Interface",
        "displayName": "Test Interface",
        "contents": [
          {
            "@type": "Telemetry",
            "displayName": "Test Telemetry",
            "name": "testTelemetry",
            "schema": "double"
          },
          {
            "@type": [
              "Telemetry",
              "Event",
              "EventValue"
            ],
            "displayName": "Test Event",
            "name": "testEvent",
            "schema": "integer",
            "severity": "warning"
          },
          {
            "@type": [
              "Property",
              "Initialized"
            ],
            "displayName": "Test Property",
            "name": "testProperty",
            "schema": "string",
            "writable": true,
            "initialValue": "initialValue1"
          },
          {
            "@type": "Property",
            "displayName": "Test Read-Only Property",
            "name": "testReadOnly",
            "schema": "string"
          },
          {
            "@type": "Property",
            "displayName": "Test Complex Property",
            "name": "testComplex",
            "schema": {
              "@id": "dtmi:contoso:testComplex;1",
              "@type": "Object",
              "displayName": "Object",
              "fields": [
                {
                  "displayName": "First",
                  "name": "first",
                  "schema": "string"
                },
                {
                  "displayName": "Second",
                  "name": "second",
                  "schema": "string"
                }
              ]
            },
            "writable": true
          },
          {
            "@type": "Command",
            "commandType": "synchronous",
            "displayName": "Test Command",
            "name": "testCommand",
            "request": {
              "displayName": "Test Request",
              "name": "testRequest",
              "schema": "double"
            },
            "response": {
              "displayName": "Test Response",
              "name": "testResponse",
              "schema": "geopoint"
            }
          },
          {
            "@type": "Property",
            "displayName": "Test Enum",
            "name": "testEnum",
            "schema": {
              "@id": "dtmi:contoso:testEnum;1",
              "@type": "Enum",
              "displayName": "Enum",
              "enumValues": [
                {
                  "displayName": "First",
                  "enumValue": 1,
                  "name": "first"
                },
                {
                  "displayName": "Second",
                  "enumValue": 2,
                  "name": "second"
                }
              ],
              "valueSchema": "integer"
            },
            "writable": true
          }
        ]
      }
    ],
    "contents": [
      {
        "@type": [
          "Relationship",
          "EdgeModule"
        ],
        "displayName": "Test Module",
        "maxMultiplicity": 1,
        "name": "testModule",
        "target": [
          {
            "@id": "dtmi:contoso:testModuleCapabilityModel;1",
            "@type": "Interface",
            "displayName": "Test Module Capability Model",
            "extends": [
              {
                "@id": "dtmi:contoso:testModuleInterface;1",
                "@type": "Interface",
                "contents": [
                  {
                    "@type": "Telemetry",
                    "displayName": "Test Module Telemetry",
                    "name": "testModuleTelemetry",
                    "schema": "double"
                  },
                  {
                    "@type": "Property",
                    "displayName": "Test Module Property",
                    "name": "testModuleProperty",
                    "schema": "string",
                    "writable": true
                  }
                ],
                "displayName": "Test Module Interface"
              }
            ]
          }
        ]
      },
      {
        "@type": [
          "Property",
          "Cloud"
        ],
        "displayName": "Test Cloud Property",
        "name": "testCloudProperty",
        "schema": "dateTime"
      }
    ]
  }
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
  "@id": "dtmi:contoso:testDeviceTemplate;1",
  "@type": [
    "ModelDefinition",
    "DeviceModel",
    "EdgeModel"
  ],
  "displayName": "Test Definition",
  "etag": "\"~jbzfGhYctc9wtzNZXVmVua5JjTHO/FfjMUJvk9hqkRY=\"",
  "capabilityModel": {
    "@id": "dtmi:contoso:testCapabilityModel;1",
    "@type": "Interface",
    "displayName": "Test Capability Model",
    "extends": [
      {
        "@id": "dtmi:contoso:testInterface;1",
        "@type": "Interface",
        "displayName": "Test Interface",
        "contents": [
          {
            "@type": "Telemetry",
            "displayName": "Test Telemetry",
            "name": "testTelemetry",
            "schema": "double"
          },
          {
            "@type": [
              "Telemetry",
              "Event",
              "EventValue"
            ],
            "displayName": "Test Event",
            "name": "testEvent",
            "schema": "integer",
            "severity": "warning"
          },
          {
            "@type": [
              "Property",
              "Initialized"
            ],
            "displayName": "Test Property",
            "name": "testProperty",
            "schema": "string",
            "writable": true,
            "initialValue": "initialValue1"
          },
          {
            "@type": "Property",
            "displayName": "Test Read-Only Property",
            "name": "testReadOnly",
            "schema": "string"
          },
          {
            "@type": "Property",
            "displayName": "Test Complex Property",
            "name": "testComplex",
            "schema": {
              "@id": "dtmi:contoso:testComplex;1",
              "@type": "Object",
              "displayName": "Object",
              "fields": [
                {
                  "displayName": "First",
                  "name": "first",
                  "schema": "string"
                },
                {
                  "displayName": "Second",
                  "name": "second",
                  "schema": "string"
                }
              ]
            },
            "writable": true
          },
          {
            "@type": "Command",
            "commandType": "synchronous",
            "displayName": "Test Command",
            "name": "testCommand",
            "request": {
              "displayName": "Test Request",
              "name": "testRequest",
              "schema": "double"
            },
            "response": {
              "displayName": "Test Response",
              "name": "testResponse",
              "schema": "geopoint"
            }
          },
          {
            "@type": "Property",
            "displayName": "Test Enum",
            "name": "testEnum",
            "schema": {
              "@id": "dtmi:contoso:testEnum;1",
              "@type": "Enum",
              "displayName": "Enum",
              "enumValues": [
                {
                  "displayName": "First",
                  "enumValue": 1,
                  "name": "first"
                },
                {
                  "displayName": "Second",
                  "enumValue": 2,
                  "name": "second"
                }
              ],
              "valueSchema": "integer"
            },
            "writable": true
          }
        ]
      }
    ],
    "contents": [
      {
        "@type": [
          "Relationship",
          "EdgeModule"
        ],
        "displayName": "Test Module",
        "maxMultiplicity": 1,
        "name": "testModule",
        "target": [
          {
            "@id": "dtmi:contoso:testModuleCapabilityModel;1",
            "@type": "Interface",
            "displayName": "Test Module Capability Model",
            "extends": [
              {
                "@id": "dtmi:contoso:testModuleInterface;1",
                "@type": "Interface",
                "contents": [
                  {
                    "@type": "Telemetry",
                    "displayName": "Test Module Telemetry",
                    "name": "testModuleTelemetry",
                    "schema": "double"
                  },
                  {
                    "@type": "Property",
                    "displayName": "Test Module Property",
                    "name": "testModuleProperty",
                    "schema": "string",
                    "writable": true
                  }
                ],
                "displayName": "Test Module Interface"
              }
            ]
          }
        ]
      },
      {
        "@type": [
          "Property",
          "Cloud"
        ],
        "displayName": "Test Cloud Property",
        "name": "testCloudProperty",
        "schema": "dateTime"
      }
    ]
  }
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
      "@id": "dtmi:contoso:testDeviceTemplate;1",
      "@type": [
        "ModelDefinition",
        "DeviceModel",
        "EdgeModel"
      ],
      "displayName": "Test Definition",
      "etag": "\"~jbzfGhYctc9wtzNZXVmVua5JjTHO/FfjMUJvk9hqkRY=\"",
      "capabilityModel": {
        "@id": "dtmi:contoso:testCapabilityModel;1",
        "@type": "Interface",
        "displayName": "Test Capability Model",
        "extends": [
          {
            "@id": "dtmi:contoso:testInterface;1",
            "@type": "Interface",
            "displayName": "Test Interface",
            "contents": [
              {
                "@type": "Telemetry",
                "displayName": "Test Telemetry",
                "name": "testTelemetry",
                "schema": "double"
              },
              {
                "@type": [
                  "Telemetry",
                  "Event",
                  "EventValue"
                ],
                "displayName": "Test Event",
                "name": "testEvent",
                "schema": "integer",
                "severity": "warning"
              },
              {
                "@type": [
                  "Property",
                  "Initialized"
                ],
                "displayName": "Test Property",
                "name": "testProperty",
                "schema": "string",
                "writable": true,
                "initialValue": "initialValue1"
              },
              {
                "@type": "Property",
                "displayName": "Test Read-Only Property",
                "name": "testReadOnly",
                "schema": "string"
              },
              {
                "@type": "Property",
                "displayName": "Test Complex Property",
                "name": "testComplex",
                "schema": {
                  "@id": "dtmi:contoso:testComplex;1",
                  "@type": "Object",
                  "displayName": "Object",
                  "fields": [
                    {
                      "displayName": "First",
                      "name": "first",
                      "schema": "string"
                    },
                    {
                      "displayName": "Second",
                      "name": "second",
                      "schema": "string"
                    }
                  ]
                },
                "writable": true
              },
              {
                "@type": "Command",
                "commandType": "synchronous",
                "displayName": "Test Command",
                "name": "testCommand",
                "request": {
                  "displayName": "Test Request",
                  "name": "testRequest",
                  "schema": "double"
                },
                "response": {
                  "displayName": "Test Response",
                  "name": "testResponse",
                  "schema": "geopoint"
                }
              },
              {
                "@type": "Property",
                "displayName": "Test Enum",
                "name": "testEnum",
                "schema": {
                  "@id": "dtmi:contoso:testEnum;1",
                  "@type": "Enum",
                  "displayName": "Enum",
                  "enumValues": [
                    {
                      "displayName": "First",
                      "enumValue": 1,
                      "name": "first"
                    },
                    {
                      "displayName": "Second",
                      "enumValue": 2,
                      "name": "second"
                    }
                  ],
                  "valueSchema": "integer"
                },
                "writable": true
              }
            ]
          }
        ],
        "contents": [
          {
            "@type": [
              "Relationship",
              "EdgeModule"
            ],
            "displayName": "Test Module",
            "maxMultiplicity": 1,
            "name": "testModule",
            "target": [
              {
                "@id": "dtmi:contoso:testModuleCapabilityModel;1",
                "@type": "Interface",
                "displayName": "Test Module Capability Model",
                "extends": [
                  {
                    "@id": "dtmi:contoso:testModuleInterface;1",
                    "@type": "Interface",
                    "contents": [
                      {
                        "@type": "Telemetry",
                        "displayName": "Test Module Telemetry",
                        "name": "testModuleTelemetry",
                        "schema": "double"
                      },
                      {
                        "@type": "Property",
                        "displayName": "Test Module Property",
                        "name": "testModuleProperty",
                        "schema": "string",
                        "writable": true
                      }
                    ],
                    "displayName": "Test Module Interface"
                  }
                ]
              }
            ]
          },
          {
            "@type": [
              "Property",
              "Cloud"
            ],
            "displayName": "Test Cloud Property",
            "name": "testCloudProperty",
            "schema": "dateTime"
          }
        ]
      }
    }
  ]
}
```

### Update a device template

```http
PATCH https://{subdomain}.{baseDomain}/api/deviceTemplates/{deviceTemplateId}?api-version=1.0
```

The sample request body looks like the following example:

```json
{
  "@type": [
    "ModelDefinition",
    "DeviceModel",
    "EdgeModel"
  ],
  "displayName": "Test Definition",
  "capabilityModel": {
    "@id": "dtmi:contoso:testCapabilityModel;1",
    "@type": "Interface",
    "displayName": "Test Capability Model",
    "extends": [
      {
        "@id": "dtmi:contoso:testInterface;1",
        "@type": "Interface",
        "displayName": "Test Interface",
        "contents": [
          {
            "@type": "Telemetry",
            "displayName": "Test Telemetry",
            "name": "testTelemetry",
            "schema": "double"
          },
          {
            "@type": [
              "Telemetry",
              "Event",
              "EventValue"
            ],
            "displayName": "Test Event",
            "name": "testEvent",
            "schema": "integer",
            "severity": "warning"
          },
          {
            "@type": [
              "Property",
              "Initialized"
            ],
            "displayName": "Test Property",
            "name": "testProperty",
            "schema": "string",
            "writable": true,
            "initialValue": "initialValue1"
          },
          {
            "@type": "Property",
            "displayName": "Test Read-Only Property",
            "name": "testReadOnly",
            "schema": "string"
          },
          {
            "@type": "Property",
            "displayName": "Test Complex Property",
            "name": "testComplex",
            "schema": {
              "@id": "dtmi:contoso:testComplex;1",
              "@type": "Object",
              "displayName": "Object",
              "fields": [
                {
                  "displayName": "First",
                  "name": "first",
                  "schema": "string"
                },
                {
                  "displayName": "Second",
                  "name": "second",
                  "schema": "string"
                }
              ]
            },
            "writable": true
          },
          {
            "@type": "Command",
            "commandType": "synchronous",
            "displayName": "Test Command",
            "name": "testCommand",
            "request": {
              "displayName": "Test Request",
              "name": "testRequest",
              "schema": "double"
            },
            "response": {
              "displayName": "Test Response",
              "name": "testResponse",
              "schema": "geopoint"
            }
          },
          {
            "@type": "Property",
            "displayName": "Test Enum",
            "name": "testEnum",
            "schema": {
              "@id": "dtmi:contoso:testEnum;1",
              "@type": "Enum",
              "displayName": "Enum",
              "enumValues": [
                {
                  "displayName": "First",
                  "enumValue": 1,
                  "name": "first"
                },
                {
                  "displayName": "Second",
                  "enumValue": 2,
                  "name": "second"
                }
              ],
              "valueSchema": "integer"
            },
            "writable": true
          }
        ]
      }
    ],
    "contents": [
      {
        "@type": [
          "Relationship",
          "EdgeModule"
        ],
        "displayName": "Test Module",
        "maxMultiplicity": 1,
        "name": "testModule",
        "target": [
          {
            "@id": "dtmi:contoso:testModuleCapabilityModel;1",
            "@type": "Interface",
            "displayName": "Test Module Capability Model",
            "extends": [
              {
                "@id": "dtmi:contoso:testModuleInterface;1",
                "@type": "Interface",
                "contents": [
                  {
                    "@type": "Telemetry",
                    "displayName": "Test Module Telemetry",
                    "name": "testModuleTelemetry",
                    "schema": "double"
                  },
                  {
                    "@type": "Property",
                    "displayName": "Test Module Property",
                    "name": "testModuleProperty",
                    "schema": "string",
                    "writable": true
                  }
                ],
                "displayName": "Test Module Interface"
              }
            ]
          }
        ]
      },
      {
        "@type": [
          "Property",
          "CloudProperty"
        ],
        "displayName": "Test Cloud Property",
        "name": "testCloudProperty",
        "schema": "dateTime"
      }
    ]
  }
}
```

The response to this request looks like the following example:

```json
{
  "@id": "dtmi:contoso:testDeviceTemplate;1",
  "@type": [
    "ModelDefinition",
    "DeviceModel",
    "EdgeModel"
  ],
  "displayName": "Test Definition",
  "etag": "\"~jbzfGhYctc9wtzNZXVmVua5JjTHO/FfjMUJvk9hqkRY=\"",
  "capabilityModel": {
    "@id": "dtmi:contoso:testCapabilityModel;1",
    "@type": "Interface",
    "displayName": "Test Capability Model",
    "extends": [
      {
        "@id": "dtmi:contoso:testInterface;1",
        "@type": "Interface",
        "displayName": "Test Interface",
        "contents": [
          {
            "@type": "Telemetry",
            "displayName": "Test Telemetry",
            "name": "testTelemetry",
            "schema": "double"
          },
          {
            "@type": [
              "Telemetry",
              "Event",
              "EventValue"
            ],
            "displayName": "Test Event",
            "name": "testEvent",
            "schema": "integer",
            "severity": "warning"
          },
          {
            "@type": [
              "Property",
              "Initialized"
            ],
            "displayName": "Test Property",
            "name": "testProperty",
            "schema": "string",
            "writable": true,
            "initialValue": "initialValue1"
          },
          {
            "@type": "Property",
            "displayName": "Test Read-Only Property",
            "name": "testReadOnly",
            "schema": "string"
          },
          {
            "@type": "Property",
            "displayName": "Test Complex Property",
            "name": "testComplex",
            "schema": {
              "@id": "dtmi:contoso:testComplex;1",
              "@type": "Object",
              "displayName": "Object",
              "fields": [
                {
                  "displayName": "First",
                  "name": "first",
                  "schema": "string"
                },
                {
                  "displayName": "Second",
                  "name": "second",
                  "schema": "string"
                }
              ]
            },
            "writable": true
          },
          {
            "@type": "Command",
            "commandType": "synchronous",
            "displayName": "Test Command",
            "name": "testCommand",
            "request": {
              "displayName": "Test Request",
              "name": "testRequest",
              "schema": "double"
            },
            "response": {
              "displayName": "Test Response",
              "name": "testResponse",
              "schema": "geopoint"
            }
          },
          {
            "@type": "Property",
            "displayName": "Test Enum",
            "name": "testEnum",
            "schema": {
              "@id": "dtmi:contoso:testEnum;1",
              "@type": "Enum",
              "displayName": "Enum",
              "enumValues": [
                {
                  "displayName": "First",
                  "enumValue": 1,
                  "name": "first"
                },
                {
                  "displayName": "Second",
                  "enumValue": 2,
                  "name": "second"
                }
              ],
              "valueSchema": "integer"
            },
            "writable": true
          }
        ]
      }
    ],
    "contents": [
      {
        "@type": [
          "Relationship",
          "EdgeModule"
        ],
        "displayName": "Test Module",
        "maxMultiplicity": 1,
        "name": "testModule",
        "target": [
          {
            "@id": "dtmi:contoso:testModuleCapabilityModel;1",
            "@type": "Interface",
            "displayName": "Test Module Capability Model",
            "extends": [
              {
                "@id": "dtmi:contoso:testModuleInterface;1",
                "@type": "Interface",
                "contents": [
                  {
                    "@type": "Telemetry",
                    "displayName": "Test Module Telemetry",
                    "name": "testModuleTelemetry",
                    "schema": "double"
                  },
                  {
                    "@type": "Property",
                    "displayName": "Test Module Property",
                    "name": "testModuleProperty",
                    "schema": "string",
                    "writable": true
                  }
                ],
                "displayName": "Test Module Interface"
              }
            ]
          }
        ]
      },
      {
        "@type": [
          "Property",
          "Cloud"
        ],
        "displayName": "Test Cloud Property",
        "name": "testCloudProperty",
        "schema": "dateTime"
      }
    ]
  }
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

Now that you've learned how to add device templates with the REST API, a suggested next step is to [How to use the IoT Central REST API to control devices](howto-control-devices-with-rest-api.md).
