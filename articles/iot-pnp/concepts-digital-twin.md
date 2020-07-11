---
title: Understand the Plug and Play Digital Twins | Microsoft Docs
description: Understand the digital twins when using Plug and Play preview
author: miagdp
ms.author: miag
ms.date: 07/10/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Understand the Plug and Play Digital Twins

For each plug and play device that registered in IoT Hub, it has a digital twin. When first time a plug and play device connects to IoT Hub, initial device twin and digital twin are populated. The information captured in [device twins](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins) follows the plug and play convention and the schema is defined in the [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl). There are a set of device facing endpoints that are designed to interact with the device twin. Digital Twin REST APIs are provided for the service backend to interact with the digital twin as a resource. 

## Device Twins
Device twins are JSON documents that store device state information including metadata, configurations, and conditions. Azure IoT Hub maintains a device twin for each device that you connect to IoT Hub. For more detailed information please refer to [Understand and use device twins in IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins#device-operations).

For a Plug and Play device, device twins are created upon device connects. Both desired properties and reported properties are exposed in this JSON document and they are implemented using DTDL as the convention. For device twins, devices can utilize the same set of APIs and SDKs and same operations can be applied to device twins for both PnP and non-PnP devices. For more detailed information please go to [Device Operations](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins#device-operations).

Below is an example of how properties are exposed in a device twin that's created when a plug and play device connects. In this example, the ``PnPDevice`` has implemented model ``dtmi:contoso:macaw;1``, and within this model there is a component ``setting`` that has a reported property ``fanspeed``. The initial value for this property is ``1``.

```json
{
    ...
    "deviceId": "PnPDevice",
    "modelId": "dtmi:contoso:macaw;1",
    "properties": {
        "reported": {
            "settings": {
                "fanSpeed": {
                    "value": 1,
                    "ac": 200,
                    "av": 1
                },
                "__t": "c"
            },
            "$metadata": {
                "$lastUpdated": "2020-07-10T22:35:56.0487962Z",           
                "settings": {
                    "$lastUpdated": "2020-07-10T22:35:56.0487962Z",
                    "fanSpeed": {
                        "$lastUpdated": "2020-07-10T22:35:56.0487962Z",
                        "value": {
                            "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
                        },
                        "ac": {
                            "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
                        },
                        "av": {
                            "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
                        }
                    },
                },
            },
            "$version": 3
        }
    },
}
```


## Digital Twins
A digital twin is created upon connection of a plug and play device. Digital twins can be directly managed and updated by service back-end using [Digital Twin REST APIs](https://review.docs.microsoft.com/en-us/rest/api/iothub/service/digitaltwin?branch=iothubser). Operations that update digital twins trigger a Digital twin change event, which can be routed to your desired endpoint e.g. Eventhubs. For more information of routing, please see [IoT Hub message routing](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-d2c).

For the device twin example we had above, the corresponding digital twin looks like below, which shows the same information of a desired property ``fanspeed`` within component ``setting``.

```json
{
     ...
    "deviceId": "PnPDevice",
    "modelId": "dtmi:contoso:macaw;1",
    "properties": {
        "desired": {
            "settings": {
                "fanSpeed": {
                    "value": 1,
                    "ac": 200,
                    "av": 1
                },
                "__t": "c"
            },
            "$metadata": {
                "settings": {
                    "$lastUpdated": "2020-07-10T22:35:56.0487962Z",
                    "fanSpeed": {
                        "$lastUpdated": "2020-07-10T22:35:56.0487962Z",
                        "value": {
                            "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
                        },
                        "ac": {
                            "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
                        },
                        "av": {
                            "$lastUpdated": "2020-07-10T22:35:56.0487962Z"
                        }
                    }
                },
            },
        }
    },
}
```




## Digital Twin REST APIs
A set of REST APIs are provided to interact with digital twin. Specifically these operations are available: Get Digital Twin, Get Digital Twin Model, Invoke Component Command and Update Digital Twin. For more detailed information of each operation, please refer to [Digital Twin](https://review.docs.microsoft.com/en-us/rest/api/iothub/service/digitaltwin?branch=iothubser).

Below is an example of updating the desired properties. In this example, the desired property ``fanSpeed`` is updated to a new desired value ``5``.

```json 

 {
    "op": "replace",
    "path": "/settings/fanSpeed",
    "value": 5
    }
```
Once the device completes the update with the desired value, the digital twin is updated as below:


```json
{    ...
    "settings": {
        "fanSpeed": 5,
        "$metadata": {
            "fanSpeed": {
                "desiredValue": 5,
                "desiredVersion": 2,
                "ackVersion": 2,
                "ackCode": 200,
                "lastUpdateTime": "2020-07-10T22:43:15.3276407Z"
            },
        }
    },
...
}
```

Along with this operation, a digital twin change event is triggered. Here is a sample:

```json
    iothub-connection-device-id: PnPDevice
    iothub-enqueuedtime:7/7/2020 10:47:14 PM
    iothub-message-source:digitalTwinChangeEvents
    user-id:System.ArraySegment`1[System.Byte]
    correlation-id:fe0630c28b0
    content-type:application/json-patch+json
    content-encoding:utf-8
    [
      {
        "op": "replace",
        "path": "/settings/fanSpeed",
        "value": 5
      }
    ]
```




