<properties
 pageTitle="Developer guide - device twins | Microsoft Azure"
 description="Azure IoT Hub developer guide - use device twins to synchronize state and configuration data between IoT Hub and your devices"
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="elioda"/>

# Use device twins to synchronize state and configurations

## Overview
A *device twin* is a JSON document representing a physical device.
Device twins are persisted in an IoT hub, and are used to store device meta-data and facilitate the synchronization of device configurations and conditions between an IoT solution's device app and back-end.

Currently, device twins are accessible only from devices connected using the MQTT protocol.

### When to use
Consider using device twins when:
* Solution back-ends have to store device meta-data,
* Device apps have to report current state information such as available capabilities and conditions (e.g. connectivity method used),
* Device apps and back-ends have to synchronize the state of long-running workflows (e.g. firmware/configuration updates), and
* Solution back-ends have to query devices based on meta-data, configuration or state.

Use [device-to-cloud messages][lnk-d2c] for sequences of timestamped events (e.g. time series of sensor data, alarms) and [cloud-to-device methods][lnk-methods] for interactive control of devices, e.g. turn on a fan.

## Device twins
Device twins store device-related information that device and back-ends can use to synchronize device conditions and configurations, and that the application back-end can use to query and target long-running operations.

Twins lifecycle is linked with the corresponding [device identity][lnk-identity]. Twins are implicitly created and deleted when a new device identity is created or deleted.

A device twin includes:
* **Tags**. Device meta-data stored and retrieved by the application back-end in the form of a JSON document. Tags are not visible by device apps.
* **Desired properties**. Used in conjunction with reported properties to sycnhronize device configuration or condition. Desired properties can only be set by the application back-end and are observed by the device app. 
* **Reported properties**. Used in conjunction with desired properties to sycnhronize device configuration or condition. Reported properties can only be set by the device app and can be read and queried by the application back-end.
* **System properties**. As reported in the [Twin's format][] section, system properties are read-only and include information regarding the device usage such as last activity time and connection state. This is the same information reported in the [device identity registry][lnk-identity].

Here is an example of a twin's JSON document:

        {
            "deviceId: "devA",
            "generationId: "123",
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
                    "batteryLevel": "55%",
                    "$metadata" : {...},
                    "$version": 4
                }
            }
        }

In the root object, there are the system properties, and container objects for `tags` and both `reported` and `desired properties`. The container for properties also contains some system elements (`$metadata`, `$etag`, and `$version`) that are described respectively in [Twin metadata][] and [Optimistic concurrency][] sections.

In the example, the `batteryLevel` property represents a device condition and is reported by the device app. This property makes it possible to query and operate on devices based on the last known battery level. Another example would have the device app report device capabilities or connectivity options. Use [device-to-cloud messages][lnk-d2c], if the back-end needs to process device telemetry in the form of sequences of timestamped events, such as time series.

The `telemetryConfig` desired and reported properties are used by the back-end and device app to synchronize the telemetry configuration for this device. For instance:

1. The app back-end sets the desired property with the desired configuration

        ...
        "desired": {
            "telemetryConfig": {
                "sendFrequency": "5m"
            },
            ...
        },
        ...
        
2. The device app observes the change (immediately if connected, or at first reconnect), and reports the updated configuration (or an error condition using the `status` property):

        ...
        "reported": {
            "telemetryConfig": {
                "sendFrequency": "5m",
                "status": "success"
            }
            ...
        }
        ...

3. The app back-end can keep track the results of the configuration operation across many devices, by [querying][lnk-query] twins.

In many cases twins are used to synchronize long-running operations such as firmware updates. Refer to [Use desired properties to configure devices][lnk-tutorial-use-twin] for more information on how to use properties to synchronize and track long running operations across devices.

### Back-end-facing operations
The application back-end operates on the twin using the following atomic operations, exposed through HTTP:

1. **Retrieve twin by id**. This operation returns the content of the twin's document, i.e. tags and desired, reported and system properties.
2. **Partially update twin**. This operation allows the back-end to partially update the twin's tags or desired properties. The partial update is expressed as a JSON document which adds or updates any property mentioned. Properties that are set to `null` are removed. For instance:

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
    
    will create a new desired property with value `{"newProperty": "newValue"}`, will overwrite the existing value of `existingProperty` with `"otherNewValue"`, and remove completely `otherOldProperty`. No changes will happen to other existing desired properties or tags.
3. **Replace desired properties**. This operation allows the back-end to completely overwrite all existing desired properties and substitute a new JSON document for `properties/desired`.
4. **Replace tags**. Analogously to replace desired properties, this operations allows the back-end to completely overwrite all existing tags and substitute a new JSON document for `tags`.

All above operations support [Optimistic concurrency][].
In addition to these operations, the back-end can query the twins using a SQL-like [query language][lnk-query], and perform operations on large sets of twins using [jobs][lnk-jobs].

### Device-facing operations
The device app operates on the twin using the following atomic operations, exposed through MQTT:

1. **Retrieve twin**. This operation returns the content of the twin's document (i.e. tags and desired, reported and system properties) for the currently-connected device.
2. **Partially update reported properties**. This operation allows partial update of the reported properties of the currently-connected device. This uses the same JSON update format as the back-end-facing partial update of desired properties.
3. **Observe desired properties**. The currently-connected device can choose to be notified of updates to the desired properties as soon as they happens. The device will receive the same form of update (partial or full replacement) executed by the back-end.

[IoT Hub SDKs][lnk-sdks] make it easy to use the above operations from many languages and platforms. More information on the details of IoT Hub's primitives for desired properties synchronization can be found in [Device reconnection flow][].

## Reference

### Tags and properties
Tags, desired and reported properties are JSON objects with the following restrictions:

* All keys in JSON objects are case-sensitive 128-char UNICODE strings. Allowed characters exclude UNICODE control characters (segments C0 and C1), and `'.'`, `' '`, and `'$'`.
* All values in JSON object can be of the following JSON types: boolean, number, strings, object.

### Twin size
IoT Hub enforces an 8KB size limitation on the values of `tags`, `properties/desired` and `properties/reported`.
The size is computed by counting all characters excluding UNICODE control characters (i.e. segments C0 and C1) and space `' '` when appearing outside of a string constant.

### Twin metadata
IoT Hub maintains the timestamp of the last update for each JSON objects in desired and reported properties. The timestamps are in UTC and encoded in the [ISO8601] format `YYYY-MM-DDTHH:MM:SS.mmmZ`.
An example:

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

This information is kept at every level (and not only to the leaves of the JSON structure) to preserve updates that remove object keys.

### Optimistic concurrency
Tags, desired and reported properties all support optimistic concurency.
Tags have an etag [RFC7232] that represent the tags JSON representation. This can be used in conditional update operations by the back-end to ensure consistency.

Desired and reported properties do not have etags, but have a `$version` information which is guaranteed to always be incremental. Analogously to etags, the version can be used by the updating party (i.e. device app for reported property and back-end for desired) to enforce consistency of updates.

Versions are also useful when an observing agent (e.g. the device app observing the desired properties) has to reconcile races between the result of a retrieve operation and an update notification. The section [Device reconnection flow][] provides more information.

### Device reconnection flow
IoT Hub does not preserve desired properties update notifications for disconnected devices. It follows that a device that is connecting has to retrieve the full desired properties document, in addition to subscribe for update notifications. Given the possibility of races between udpate notifications and full retrieval, the following flow has to be ensured:

1. Device app connects to an IoT hub;
2. Device app subsribes for desired properties update notifications;
3. Device app retrieves the full document for desired properties.

The device app can ignore all notifications with `$version` less or equal than the version of the full retrieved document. This is possible because IoT Hub guarantees that versions are always increasing.

>AZURE.NOTE This reconnection logic is already implemented in [IoT Hub SDKs][lnk-sdks]. This description is useful only if the device app cannot use any of IoT Hub SDKs and has to program the MQTT interface directly.

### Additional reference material

Other reference topics in the Developer Guide include:

- [IoT Hub endpoints][lnk-endpoints] describes the various endpoints that each IoT hub exposes for runtime and management operations.
// TODO

- [Throttling and quotas][lnk-quotas] describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.
// pending!!!

- [IoT Hub device and service SDKs][lnk-sdks] lists the various language SDKs you an use when you develop both device and service applications that interact with IoT Hub.
- [Query language for twins, methods, and jobs][lnk-query] describes the query language you can use to retrieve information from IoT Hub about your device twins, methods and jobs.

## Next steps
// TODO (create tutorial stubs, link)

Now you have learned about sending and receiving messages with IoT Hub, you may be interested in the following Developer Guide topics:

- [Related topic 1][lnk-topic1]
- [Related topic 2][lnk-topic2]

If you would like to try out some of the concepts described in this article, you may be interested in the following IoT Hub tutorials:

- [Related tutorial 1][lnk-tutorial1]
- [Related tutorial 2][lnk-tutorial2]

<!-- links and images -->

[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-jobs]: iot-hub-devguide-jobs.md
[lnk-identity]: iot-hub-devguide-identity-registry.md
[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-methods]: iot-hub-devguide-direct-methods.md

[lnk-tutorial-use-twin]: iot-hub-node-node-twin-use-desired-to-config.md

[ISO8601]: https://en.wikipedia.org/wiki/ISO_8601
[RFC7232]: https://tools.ietf.org/html/rfc7232