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

# Understand the IoT Plug and Play Digital Twins

EveryIoT Plug and Play device that registered in IoT Hub has a digital twin. When a plug and play device connects to IoT Hub for the first time, initial device twin and digital twin are populated. The information captured in [device twins](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins) follows the plug and play convention, where the schema is defined in the [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl). There are a set of device facing endpoints that are designed to interact with the device twin. Digital Twin REST APIs are provided for the service backend to interact with the digital twin as a resource. 

## Device Twins
Device twins are JSON documents that store device state information including metadata, configurations, and conditions. Azure IoT Hub maintains a device twin for each device that you connect to IoT Hub. For more detailed information please refer to [Understand and use device twins in IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins#device-operations).

For a Plug and Play device, device twins are created upon device connects. Both desired properties and reported properties are exposed in this JSON document and they are implemented using Plug and Play as the convention. Any device that conforms to Plug and Play convention automatically benefits from PnP features. For device twins, devices can utilize the same set of APIs and SDKs and same operations can be applied to device twins for both PnP and non-PnP devices. For more detailed information please go to [Device Operations](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins#device-operations).

Below is an example of how properties are exposed in a device twin that's created when a plug and play device connects. In this example, the ``PnPDevice`` has implemented model ``dtmi:contoso:macaw;1``, and within this model there is a component ``setting`` that has a reported property ``fanspeed``. The initial value for this property is ``1``. Any device reporting a component must have the ``{"t": "c"}`` marker.

```json
{
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
A digital twin is created upon connection of a plug and play device. Digital twins can be directly managed and updated by service back-end using [Digital Twin REST APIs](https://review.docs.microsoft.com/en-us/rest/api/iothub/service/digitaltwin?branch=iothubser). Operations that update digital twins trigger a Digital twin change event as well as a twin change event, which can be routed to your desired endpoint e.g. Eventhubs. For more information of how to set up the routing, please see [IoT Hub message routing](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-messages-d2c).

For the device twin example we had above, the corresponding digital twin looks like below, which shows the same information of a desired property ``fanspeed`` within component ``setting``.

```json
{
    "$dtId": "PnPDevice",
    "settings": {
        "fanSpeed": 1,
        "$metadata": {
            "fanSpeed": {
                "ackVersion": 1,
                "ackCode": 200,
                "lastUpdateTime": "2020-07-10T22:35:56.0487962Z"
            },
        }
    },
    "$metadata": {
        "$model": "dtmi:contoso:macaw;1",
    }
}
```

To utilize the Digital Twin, a device needs to follow these rules:

1. Rules on setting desired value of a digital twin writable property:
    - Simple key value form.
    - Name must be DTDL v2 conformant.
    - Value must be DTDL v2 conformant.
    
2.  Rules on reporting a digital twin property:
    - Read-only property:
        - Simple key value form.
        - Name must be DTDL v2 conformant.
        - Value must be DTDL v2 conformant.
    - Writable property:
        - Always needs to be in embedded form, “value”, “ac” and “av” are required fields.
        - Name must be DTDL v2 conformant.
        - “value” must be DTDL v2 conformant.
        - “ac” and “av” must be numeric values.
        - “ad” or ack description is optional, when present needs to be a string.

## Digital Twin REST APIs
A set of REST APIs are provided to interact with digital twin. Specifically these operations are available: Get Digital Twin, Invoke Component Command, Invoke Command and Update Digital Twin. For more detailed information of each operation, please refer to [Digital Twin](https://review.docs.microsoft.com/en-us/rest/api/iothub/service/digitaltwin?branch=iothubser). A few rules need to be followed for Digital Twin Patch:

 1. Component CRUD: Component level operations requires empty object $metadata marker within value.
    - Create or Update: Sets the desired values all properties provided and clears desired values for any properties not provided.
    - Delete: Clears the desired values of all the properties present.
    Device can pick this up and stop reporting the individual properties and component is removed from Digital Twin eventually.

Examples for component operations:
```json
{
    "op": "add",
    "path": "/led",
    "value": {
    "testDisplay": "test_string",
    "color": "green",
    "$metadata": {}
    }
},
{
    "op": "replace",
    "path": "/led",
    "value": {
    "testDisplay": "test_string",
    "color": "green",
    "$metadata": {}
    }
},
{
    "op": "remove", // Clears desired value of "testDisplay", "color"
    "path": "/led"
}
```
2. Properties CRUD
    - Create or Update: Json Patch value is set as the property’s desired value. The device can then pick up the desired value and report an update in the embedded form with value, ac, av. 
    - Delete: Clears the desired value of property if it is set. Device can then stop reporting this property and property is removed. 

Examples for properties operations: 

```json
{
    "op": "add",
    "path": "/led/testDisplay",
    "value": "Test123!"
},
{
    "op": "replace",
    "path": "/led/color",
    "value": "Red"
},
{
    "op": "remove", // Clears the desired value of "timer"
    "path": "/led/timer",
}
```
3. Conversion of Property to Component or vice versa is not supported. The object needs to be removed completely and re-add with new type. 

4. Desired values for root level properties are set in the root $metadata. For example:

```json
"$metadata": { 
        "$model": "dtmi:contoso:mxchip;1", 
        "properties": { 
            "lastUpdateTime": "2020-07-10T18:20:14.597656Z" 
        }, 
        "irSwitch": { 
            "ackVersion": 1, 
            "ackCode": 200, 
            "lastUpdateTime": "2020-07-10T22:43:15.3276407Z" 
        }, 
        "current": { 
            "ackVersion": 1, 
            "ackCode": 200, 
            "lastUpdateTime": "2020-07-10T22:43:15.3276407Z" 
        } 
    } 
```

## Digital Twin Change Event
A Digital Twin Change Event can be triggered when desired value and version is set, as well as when device reports them. The modelHere is a sample:

```json
    iothub-connection-device-id: PnPDevice
    iothub-enqueuedtime:7/7/2020 10:47:14 PM
    iothub-message-source:digitalTwinChangeEvents
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



