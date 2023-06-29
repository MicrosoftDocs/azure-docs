---
title: Convert an existing device to use IoT Plug and Play | Microsoft Docs
description: This article describes how to convert your existing device code to work with IoT Plug and Play by creating a device model and then sending the model ID when the device connects.
author: dominicbetts
ms.author: dobett
ms.date: 11/17/2022
ms.topic: how-to
ms.service: iot-develop
services: iot-develop
---

# How to convert an existing device to be an IoT Plug and Play device

This article outlines the steps you should follow to convert an existing device to an IoT Plug and Play device. It describes how to create the model that every IoT Plug and Play device requires, and the necessary code changes to enable the device to function as an IoT Plug and Play device.

For the code samples, this article shows C code that uses an MQTT library to connect to an IoT hub. You can apply the changes described in this article to devices implemented with other languages and SDKs.

To convert your existing device to be an IoT Plug and Play device:

1. Review your device code to understand the telemetry, properties, and commands it implements.
1. Create a model that describes the telemetry, properties, and commands your device implements.
1. Modify the device code to announce the model ID when it connects to your service.

## Review your device code

Before you create a model for your device, you need to understand the existing capabilities of your device:

- The telemetry the device sends on regular basis.
- The read-only and writable properties the device synchronizes with your service.
- The commands invoked from the service that the device responds to.

For example, review the following device code snippets that implement various device capabilities.

The following snippet shows the device sending temperature telemetry:

```c
#define TOPIC "devices/" DEVICEID "/messages/events/"

// ...

void Thermostat_SendCurrentTemperature()
{
  char msg[] = "{\"temperature\":25.6}";
  int msgId = rand();
  int rc = mosquitto_publish(mosq, &msgId, TOPIC, sizeof(msg) - 1, msg, 1, true);
  if (rc != MOSQ_ERR_SUCCESS)
  {
    printf("Error: %s\r\n", mosquitto_strerror(rc));
  }
}
```

The name of the telemetry field is `temperature` and its type is float or a double. The model definition for this telemetry type looks like the following JSON. To learn mode, see [Design a model](#design-a-model) below:

```json
{
  "@type": [
    "Telemetry"
  ],
  "name": "temperature",
  "displayName": "Temperature",
  "description": "Temperature in degrees Celsius.",
  "schema": "double"
}
```

The following snippet shows the device reporting a property value:

```c
#define DEVICETWIN_MESSAGE_PATCH "$iothub/twin/PATCH/properties/reported/?$rid=patch_temp"

static void SendMaxTemperatureSinceReboot()
{
  char msg[] = "{\"maxTempSinceLastReboot\": 42.500}";
  int msgId = rand();
  int rc = mosquitto_publish(mosq, &msgId, DEVICETWIN_MESSAGE_PATCH, sizeof(msg) - 1, msg, 1, true);
  if (rc != MOSQ_ERR_SUCCESS)
  {
    printf("Error: %s\r\n", mosquitto_strerror(rc));
  }
}
```

The name of the property is `maxTempSinceLastReboot` and its type is float or double. This property is reported by the device, the device never receives an update for this value from the service. The model definition for this property looks like the following JSON. To learn mode, see [Design a model](#design-a-model) below:

```json
{
  "@type": [
    "Property"
  ],
  "name": "maxTempSinceLastReboot",
  "schema": "double",
  "displayName": "Max temperature since last reboot.",
  "description": "Returns the max temperature since last device reboot."
}
```

The following snippet shows the device responding to messages from the service:

```c
void message_callback(struct mosquitto* mosq, void* obj, const struct mosquitto_message* message)
{
  printf("Message received: %s payload: %s \r\n", message->topic, (char*)message->payload);
  
  if (strncmp(message->topic, "$iothub/methods/POST/getMaxMinReport/?$rid=1",37) == 0)
  {
    char* pch;
    char* context;
    int msgId = 0;
    pch = strtok_s((char*)message->topic, "=",&context);
    while (pch != NULL)
    {
      pch = strtok_s(NULL, "=", &context);
      if (pch != NULL) {
        char * pEnd;
        msgId = strtol(pch,&pEnd,16 );
      }
    }
    char topic[64];
    sprintf_s(topic, "$iothub/methods/res/200/?$rid=%d", msgId);
    char msg[] = "{\"maxTemp\":83.51,\"minTemp\":77.68}";
    int rc = mosquitto_publish(mosq, &msgId, topic, sizeof(msg) - 1, msg, 1, true);
    if (rc != MOSQ_ERR_SUCCESS)
    {
      printf("Error: %s\r\n", mosquitto_strerror(rc));
    }
    delete pch;
  }

  if (strncmp(message->topic, "$iothub/twin/PATCH/properties/desired/?$version=1", 38) == 0)
  {
    char* pch;
    char* context;
    int version = 0; 
    pch = strtok_s((char*)message->topic, "=", &context);
    while (pch != NULL)
    {
      pch = strtok_s(NULL, "=", &context);
      if (pch != NULL) {
        char* pEnd;
        version = strtol(pch, &pEnd, 10);
      }
    }
    // To do: Parse payload and extract target value
    char msg[128];
    int value = 46;
    sprintf_s(msg, "{\"targetTemperature\":{\"value\":%d,\"ac\":200,\"av\":%d,\"ad\":\"success\"}}", value, version);
    int rc = mosquitto_publish(mosq, &version, DEVICETWIN_MESSAGE_PATCH, strlen(msg), msg, 1, true);
    if (rc != MOSQ_ERR_SUCCESS)
    {
      printf("Error: %s\r\n", mosquitto_strerror(rc));
    }
    delete pch;
  }
}
```

The `$iothub/methods/POST/getMaxMinReport/` topic receives a request for command called `getMaxMinReport` from the service, this request could include a payload with command parameters. The device sends a response with a payload that includes `maxTemp` and `minTemp` values.

The `$iothub/twin/PATCH/properties/desired/` topic receives property updates from the service. This example assumes the property update is for the `targetTemperature` property. It responds with an acknowledgment that looks like `{\"targetTemperature\":{\"value\":46,\"ac\":200,\"av\":12,\"ad\":\"success\"}}`.

In summary, the sample implements the following capabilities:

| Name                   | Capability type   | Details |
| ---------------------- | ----------------- | ------- |
| temperature            | Telemetry         | Assume the data type is double |
| maxTempSinceLastReboot | Property          | Assume the data type is double |
| targetTemperature      | Writable property | Data type is integer |
| getMaxMinReport        | Command           | Returns JSON with `maxTemp` and `minTemp` fields of type double |

## Design a model

Every IoT Plug and Play device has a model that describes the features and capabilities of the device. The model uses the [Digital Twin Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md) to describe the device capabilities.

For a simple model that maps the existing capabilities of your device, use the *Telemetry*, *Property*, and *Command* DTDL elements.

A DTDL model for the sample described in the previous section looks like the following example:

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:ConvertSample;1",
  "@type": "Interface",
  "displayName": "Simple device",
  "description": "Example that shows model for simple device converted to act as an IoT Plug and Play device.",
  "contents": [
    {
      "@type": [
        "Telemetry",
        "Temperature"
      ],
      "name": "temperature",
      "displayName": "Temperature",
      "description": "Temperature in degrees Celsius.",
      "schema": "double",
      "unit": "degreeCelsius"
    },
    {
      "@type": [
        "Property",
        "Temperature"
      ],
      "name": "targetTemperature",
      "schema": "double",
      "displayName": "Target Temperature",
      "description": "Allows to remotely specify the desired target temperature.",
      "unit": "degreeCelsius",
      "writable": true
    },
    {
      "@type": [
        "Property",
        "Temperature"
      ],
      "name": "maxTempSinceLastReboot",
      "schema": "double",
      "unit": "degreeCelsius",
      "displayName": "Max temperature since last reboot.",
      "description": "Returns the max temperature since last device reboot."
    },
    {
      "@type": "Command",
      "name": "getMaxMinReport",
      "displayName": "Get Max-Min report.",
      "description": "This command returns the max and min temperature.",
      "request": {
      },
      "response": {
        "name": "tempReport",
        "displayName": "Temperature Report",
        "schema": {
          "@type": "Object",
          "fields": [
            {
              "name": "maxTemp",
              "displayName": "Max temperature",
              "schema": "double"
            },
            {
              "name": "minTemp",
              "displayName": "Min temperature",
              "schema": "double"
            }
          ]
        }
      }
    }
  ]
}
```

In this model:

- The `name` and `schema` values map to the data the device sends and receives.
- All the capabilities are grouped in a single interface.
- The `@type` fields identify the DTDL types such as **Property** and **Command**.
- Fields such as `unit`, `displayName`, and `description` provide extra information for the service to use. For example, IoT Central uses these values when it displays data on device dashboards.

To learn more, see [IoT Plug and Play conventions](concepts-convention.md) and [IoT Plug and Play modeling guide](concepts-modeling-guide.md).

## Update the code

If your device is already working with IoT Hub or IoT Central, you don't need to make any changes to the implementation of its telemetry, property, and command capabilities. To make the device follow the IoT Plug and Play conventions, modify the way that the device connects to your service so that it announces the ID of the model you created. The service can then use the model to understand the device capabilities. For example, IoT Central can use the model ID to automatically retrieve the model from a repository and generate a device template for your device.

IoT devices connect to your IoT service either through the Device Provisioning Service (DPS) or directly with a connection string.

If your device uses DPS to connect, include the model ID in the payload you send when you register the device. For the example model shown previously, the payload looks like:

```json
{
  "modelId" : "dtmi:com:example:ConvertSample;1"
}
```

To learn more, see [Runtime Registration - Register Device](/rest/api/iot-dps/device/runtime-registration/register-device).

If your device uses DPS to connect or connects directly with a connection string, include the model ID when your code connects to IoT Hub. For example:

```c
#define USERNAME IOTHUBNAME ".azure-devices.net/" DEVICEID "/?api-version=2020-09-30&model-id=dtmi:com:example:ConvertSample;1"

// ...

mosquitto_username_pw_set(mosq, USERNAME, PWD);

// ...

rc = mosquitto_connect(mosq, HOST, PORT, 10);
```

## Next steps

Now that you know how to convert an existing device to be an IoT Plug and Play device, a suggested next step is to read the [IoT Plug and Play modeling guide](concepts-modeling-guide.md).
