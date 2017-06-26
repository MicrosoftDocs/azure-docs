---
title: Understand Azure IoT Hub device twins | Microsoft Docs
description: Developer guide - use device twins to synchronize state and configuration data between IoT Hub and your devices
services: iot-hub
documentationcenter: .net
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 8a3da072-a5bf-46e5-8de4-24cdbb2a03fa
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/09/2017
ms.author: elioda
ms.custom: H1Hack27Feb2017

---
# Understand and use device twins in IoT Hub
## Overview
*Device twins* are JSON documents that store device state information (metadata, configurations, and conditions). IoT Hub persists a device twin for each device that you connect to IoT Hub. This article describes:

* The structure of the device twin: *tags*, *desired* and *reported properties*, and
* The operations that device apps and back ends can perform on device twins.

> [!NOTE]
> Currently, device twins are accessible only from devices that connect to IoT Hub using the MQTT protocol. Refer to the [MQTT support][lnk-devguide-mqtt] article for instructions on how to convert existing device app to use MQTT.
> 
> 

### When to use
Use device twins to:

* Store device-specific metadata in the cloud. For example, the deployment location of a vending machine.
* Report current state information such as available capabilities and conditions from your device app. For example, a device is connected to your IoT hub over cellular or WiFi.
* Synchronize the state of long-running workflows between device app and back-end app. For example, when the solution back end specifies the new firmware version to install, and the device app reports the various stages of the update process.
* Query your device metadata, configuration, or state.

Refer to [Device-to-cloud communication guidance][lnk-d2c-guidance] for guidance on using reported properties, device-to-cloud messages, or file upload.
Refer to [Cloud-to-device communication guidance][lnk-c2d-guidance] for guidance on using desired properties, direct methods, or cloud-to-device messages.

## Device twins
Device twins store device-related information that:

* Device and back ends can use to synchronize device conditions and configuration.
* The solution back end can use to query and target long-running operations.

The lifecycle of a device twin is linked to the corresponding [device identity][lnk-identity]. Device twins are implicitly created and deleted when a new device identity is created or deleted in IoT Hub.

A device twin is a JSON document that includes:

* **Tags**. A section of the JSON document that the solution back end can read from and write to. Tags are not visible to device apps.
* **Desired properties**. Used along with reported properties to synchronize device configuration or conditions. Desired properties can only be set by the solution back end and can be read by the device app. The device app can also be notified in real time of changes in the desired properties.
* **Reported properties**. Used along with desired properties to synchronize device configuration or conditions. Reported properties can only be set by the device app and can be read and queried by the solution back end.

Additionally, the root of the device twin JSON document contains the read-only properties from the corresponding device identity stored in the [identity registry][lnk-identity].

![][img-twin]

The following example shows a device twin JSON document:

        {
            "deviceId": "devA",
            "generationId": "123",
            "status": "enabled",
            "statusReason": "provisioned",
            "connectionState": "connected",
            "connectionStateUpdatedTime": "2015-02-28T16:24:48.789Z",
            "lastActivityTime": "2015-02-30T16:24:48.789Z",

            "tags": {
                "$etag": "123",
                "deploymentLocation": {
                    "building": "43",
                    "floor": "1"
                }
            },
            "properties": {
                "desired": {
                    "telemetryConfig": {
                        "sendFrequency": "5m"
                    },
                    "$metadata" : {...},
                    "$version": 1
                },
                "reported": {
                    "telemetryConfig": {
                        "sendFrequency": "5m",
                        "status": "success"
                    }
                    "batteryLevel": 55,
                    "$metadata" : {...},
                    "$version": 4
                }
            }
        }

In the root object, are the system properties, and container objects for `tags` and both `reported` and `desired` properties. The `properties` container contains some read-only elements (`$metadata`, `$etag`, and `$version`) described in the [Device twin metadata][lnk-twin-metadata] and [Optimistic concurrency][lnk-concurrency] sections.

### Reported property example
In the previous example, the device twin contains a `batteryLevel` property that is reported by the device app. This property makes it possible to query and operate on devices based on the last reported battery level. Other examples include the device app reporting device capabilities or connectivity options.

> [!NOTE]
> Reported properties simplify scenarios where the solution back end is interested in the last known value of a property. Use [device-to-cloud messages][lnk-d2c] if the solution back end needs to process device telemetry in the form of sequences of timestamped events, such as time series.

### Desired property example
In the previous example, the `telemetryConfig` device twin desired and reported properties are used by the solution back end and the device app to synchronize the telemetry configuration for this device. For example:

1. The solution back end sets the desired property with the desired configuration value. Here is the portion of the document with the desired property set:
   
        ...
        "desired": {
            "telemetryConfig": {
                "sendFrequency": "5m"
            },
            ...
        },
        ...
2. The device app is notified of the change immediately if connected, or at the first reconnect. The device app then reports the updated configuration (or an error condition using the `status` property). Here is the portion of the reported properties:
   
        ...
        "reported": {
            "telemetryConfig": {
                "sendFrequency": "5m",
                "status": "success"
            }
            ...
        }
        ...
3. The solution back end can track the results of the configuration operation across many devices, by [querying][lnk-query] device twins.

> [!NOTE]
> The preceding snippets are examples, optimized for readability, of one way to encode a device configuration and its status. IoT Hub does not impose a specific schema for the device twin desired and reported properties in the device twins.
> 
> 

You can use twins to synchronize long-running operations such as firmware updates. For more information on how to use properties to synchronize and track a long running operation across devices, see [Use desired properties to configure devices][lnk-twin-properties].

## Back-end operations
The solution back end operates on the device twin using the following atomic operations, exposed through HTTP:

1. **Retrieve device twin by id**. This operation returns the device twin document, including tags and desired, reported, and system properties.
2. **Partially update device twin**. This operation enables the solution back end to partially update the tags or desired properties in a device twin. The partial update is expressed as a JSON document that adds or updates any property. Properties set to `null` are removed. The following example creates a new desired property with value `{"newProperty": "newValue"}`, overwrites the existing value of `existingProperty` with `"otherNewValue"`, and removes `otherOldProperty`. No other changes are made to existing desired properties or tags:
   
        {
            "properties": {
                "desired": {
                    "newProperty": {
                        "nestedProperty": "newValue"
                    },
                    "existingProperty": "otherNewValue",
                    "otherOldProperty": null
                }
            }
        }
3. **Replace desired properties**. This operation enables the solution back end to completely overwrite all existing desired properties and substitute a new JSON document for `properties/desired`.
4. **Replace tags**. This operation enables the solution back end to completely overwrite all existing tags and substitute a new JSON document for `tags`.
5. **Receive twin notifications**. This operation allows the solution back end to be notified when the twin is modified. To do so, your IoT solution needs to create a route and to set the Data Source equal to *twinChangeEvents*. By default, no twin notifications are sent, that is, no such routes pre-exist. If the rate of change is too high, or for other reasons, such as internal failures, the IoT Hub might send only one notification that contains all changes. So, if your application needs reliable auditing and logging of all intermediate states, then it is still recommended that you use D2C messages. The twin notification message includes properties, and body.

    - Properties

    | Name | Value |
    | --- | --- |
    $content-type | application/json |
    $iothub-enqueuedtime |  Time when the notification was sent |
    $iothub-message-source | twinChangeEvents |
    $content-encoding | utf-8 |
    deviceId | Id of the device |
    hubName | Name of IoT Hub |
    operationTimestamp | ISO8601 timestamp of operation |
    iothub-message-schema | deviceLifecycleNotification |
    opType | "replaceTwin" or "updateTwin" |

    Message system properties are prefixed with the `'$'` symbol.

    - Body
        
    This section includes all the twin changes in a JSON format. It uses the same format as a patch, with the difference that it can contain all twin sections: tags, properties.reported, properties.desired, and that it contains the “$metadata” elements. For example,
    ```
    {
        "properties": {
            "desired": {
                "$metadata": {
                    "$lastUpdated": "2016-02-30T16:24:48.789Z"
                },
                "$version": 1
            },
            "reported": {
                "$metadata": {
                    "$lastUpdated": "2016-02-30T16:24:48.789Z"
                },
                "$version": 1
            }
        }
    }
    ``` 

All the preceding operations support [Optimistic concurrency][lnk-concurrency] and require the **ServiceConnect** permission, as defined in the [Security][lnk-security] article.

In addition to these operations, the solution back end can:

* Query the device twins using the SQL-like [IoT Hub query language][lnk-query].
* Perform operations on large sets of device twins using [jobs][lnk-jobs].

## Device operations
The device app operates on the device twin using the following atomic operations:

1. **Retrieve device twin**. This operation returns the device twin document (including tags and desired, reported and system properties) for the currently connected device.
2. **Partially update reported properties**. This operation enables the partial update of the reported properties of the currently connected device. This operation uses the same JSON update format that the solution back end uses for a partial update of desired properties.
3. **Observe desired properties**. The currently connected device can choose to be notified of updates to the desired properties when they happen. The device receives the same form of update (partial or full replacement) executed by the solution back end.

All the preceding operations require the **DeviceConnect** permission, as defined in the [Security][lnk-security] article.

The [Azure IoT device SDKs][lnk-sdks] make it easy to use the preceding operations from many languages and platforms. More information on the details of IoT Hub primitives for desired properties synchronization can be found in [Device reconnection flow][lnk-reconnection].

> [!NOTE]
> Currently, device twins are accessible only from devices that connect to IoT Hub using the MQTT protocol.
> 
> 

## Reference topics:
The following reference topics provide you with more information about controlling access to your IoT hub.

## Tags and properties format
Tags, desired, and reported properties are JSON objects with the following restrictions:

* All keys in JSON objects are case-sensitive 64 bytes UTF-8 UNICODE strings. Allowed characters exclude UNICODE control characters (segments C0 and C1), and `'.'`, `' '`, and `'$'`.
* All values in JSON objects can be of the following JSON types: boolean, number, string, object. Arrays are not allowed.
* All JSON objects in tags, desired, and reported properties can have a maximum depth of 5. For instance, the following object is valid:

        {
            ...
            "tags": {
                "one": {
                    "two": {
                        "three": {
                            "four": {
                                "five": {
                                    "property": "value"
                                }
                            }
                        }
                    }
                }
            },
            ...
        }

* All string values can be at most 512 bytes in length.

## Device twin size
IoT Hub enforces an 8KB size limitation on the values of `tags`, `properties/desired`, and `properties/reported`, excluding read-only elements.
The size is computed by counting all characters excluding UNICODE control characters (segments C0 and C1) and space `' '` when it appears outside of a string constant.
IoT Hub rejects with an error all operations that would increase the size of those documents above the limit.

## Device twin metadata
IoT Hub maintains the timestamp of the last update for each JSON object in device twin desired and reported properties. The timestamps are in UTC and encoded in the [ISO8601] format `YYYY-MM-DDTHH:MM:SS.mmmZ`.
For example:

        {
            ...
            "properties": {
                "desired": {
                    "telemetryConfig": {
                        "sendFrequency": "5m"
                    },
                    "$metadata": {
                        "telemetryConfig": {
                            "sendFrequency": {
                                "$lastUpdated": "2016-03-30T16:24:48.789Z"
                            },
                            "$lastUpdated": "2016-03-30T16:24:48.789Z"
                        },
                        "$lastUpdated": "2016-03-30T16:24:48.789Z"
                    },
                    "$version": 23
                },
                "reported": {
                    "telemetryConfig": {
                        "sendFrequency": "5m",
                        "status": "success"
                    }
                    "batteryLevel": "55%",
                    "$metadata": {
                        "telemetryConfig": {
                            "sendFrequency": "5m",
                            "status": {
                                "$lastUpdated": "2016-03-31T16:35:48.789Z"
                            },
                            "$lastUpdated": "2016-03-31T16:35:48.789Z"
                        }
                        "batteryLevel": {
                            "$lastUpdated": "2016-04-01T16:35:48.789Z"
                        },
                        "$lastUpdated": "2016-04-01T16:24:48.789Z"
                    },
                    "$version": 123
                }
            }
            ...
        }

This information is kept at every level (not just the leaves of the JSON structure) to preserve updates that remove object keys.

## Optimistic concurrency
Tags, desired, and reported properties all support optimistic concurrency.
Tags have an ETag, as per [RFC7232], that represents the tag's JSON representation. You can use ETags in conditional update operations from the solution back end to ensure consistency.

Device twin desired and reported properties do not have ETags, but have a `$version` value that is guaranteed to be incremental. Similarly to an ETag, the version can be used by the updating party to enforce consistency of updates. For example, a device app for a reported property or the solution back end for a desired property.

Versions are also useful when an observing agent (such as the device app observing the desired properties) must reconcile races between the result of a retrieve operation and an update notification. The section [Device reconnection flow][lnk-reconnection] provides more information.

## Device reconnection flow
IoT Hub does not preserve desired properties update notifications for disconnected devices. It follows that a device that is connecting must retrieve the full desired properties document, in addition to subscribing for update notifications. Given the possibility of races between update notifications and full retrieval, the following flow must be ensured:

1. Device app connects to an IoT hub.
2. Device app subscribes for desired properties update notifications.
3. Device app retrieves the full document for desired properties.

The device app can ignore all notifications with `$version` less or equal than the version of the full retrieved document. This approach is possible because IoT Hub guarantees that versions always increment.

> [!NOTE]
> This logic is already implemented in the [Azure IoT device SDKs][lnk-sdks]. This description is useful only if the device app cannot use any of Azure IoT device SDKs and must program the MQTT interface directly.
> 
> 

## Additional reference material
Other reference topics in the IoT Hub developer guide include:

* The [IoT Hub endpoints][lnk-endpoints] article describes the various endpoints that each IoT hub exposes for run-time and management operations.
* The [Throttling and quotas][lnk-quotas] article describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.
* The [Azure IoT device and service SDKs][lnk-sdks] article lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.
* The [IoT Hub query language for device twins, jobs, and message routing][lnk-query] article describes the IoT Hub query language you can use to retrieve information from IoT Hub about your device twins and jobs.
* The [IoT Hub MQTT support][lnk-devguide-mqtt] article provides more information about IoT Hub support for the MQTT protocol.

## Next steps
Now you have learned about device twins, you may be interested in the following IoT Hub developer guide topics:

* [Invoke a direct method on a device][lnk-methods]
* [Schedule jobs on multiple devices][lnk-jobs]

If you would like to try out some of the concepts described in this article, you may be interested in the following IoT Hub tutorials:

* [How to use the device twin][lnk-twin-tutorial]
* [How to use device twin properties][lnk-twin-properties]

<!-- links and images -->

[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-jobs]: iot-hub-devguide-jobs.md
[lnk-identity]: iot-hub-devguide-identity-registry.md
[lnk-d2c]: iot-hub-devguide-messages-d2c.md
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-security]: iot-hub-devguide-security.md
[lnk-c2d-guidance]: iot-hub-devguide-c2d-guidance.md
[lnk-d2c-guidance]: iot-hub-devguide-d2c-guidance.md

[ISO8601]: https://en.wikipedia.org/wiki/ISO_8601
[RFC7232]: https://tools.ietf.org/html/rfc7232
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md

[lnk-devguide-directmethods]: iot-hub-devguide-direct-methods.md
[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-twin-tutorial]: iot-hub-node-node-twin-getstarted.md
[lnk-twin-properties]: iot-hub-node-node-twin-how-to-configure.md
[lnk-twin-metadata]: iot-hub-devguide-device-twins.md#device-twin-metadata
[lnk-concurrency]: iot-hub-devguide-device-twins.md#optimistic-concurrency
[lnk-reconnection]: iot-hub-devguide-device-twins.md#device-reconnection-flow

[img-twin]: media/iot-hub-devguide-device-twins/twin.png
