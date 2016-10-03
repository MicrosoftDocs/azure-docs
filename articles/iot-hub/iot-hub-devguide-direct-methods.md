<properties
 pageTitle="Developer guide - direct methods | Microsoft Azure"
 description="Azure IoT Hub developer guide - use direct methods to invoke code on your devices"
 services="iot-hub"
 documentationCenter=".net"
 authors="nberdy"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="nberdy"/>

# Invoke a direct method on a device

## Overview

IoT Hub gives you ability to invoke methods on devices from the cloud. Methods represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout) to let the user know the status of the call. This is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond, such as sending an SMS wake-up to a device if a device is offline (SMS being more expensive than a method call).

You can think of a method as a remote procedure call directly to the device. Only methods which have been implemented on a device may be called from the cloud. If the cloud attempts to invoke a method on a device which does not have that method defined, the method call fails.

Each device method targets a single device. [Jobs][lnk-devguide-jobs] provide a way to invoke methods on multiple devices, and queue method invocation for disconnected devices.

Anyone with **service connect** permissions on IoT Hub may invoke a method on a device.

### When to use

Device methods are similar to [cloud-to-device messages][lnk-devguide-messages] in that both enable the cloud back-end to pass information to a device, but they differ in fundamental ways. Conceptually, methods are synchronous and not durable, while cloud-to-device messages are asynchronous with up to 48 hours of durability.

Methods follow a request-response pattern and are not durable. The lack of durability provides two immediate benefits when you are commanding devices:

- **Immediate feedback on method execution** means there is no need for you to manage the correlation between request and reply.
- **Higher throughput** means the operations can be performed faster because IoT Hub is not providing any durability. IoT Hub allows more method calls per unit than cloud-to-device messages.

Cloud-to-device messages are not necessarily commands to the device, but rather represent a cloud service passing some bit of information to the device for it to pick up at its leisure, and to which the device may or may not respond. Cloud-to-device messages have a longer timeout time (up to 48 hours) while methods expire much more quickly.

Use device methods for immediate command invocation on a device and jobs for scheduled invocation of a command on a device.

## Method lifecycle

Methods are implemented on the device and may require zero or more inputs in the method payload to correctly instantiate. You invoke a direct method through a service-facing URI (`{iot hub}/twins/{device id}/methods/`). A device receives direct methods through a device-specific MQTT topic (`$iothub/methods/POST/{method name}/`). We may support methods on additional device-side networking protocols in the future.

> [AZURE.NOTE] When you invoke a direct method on a device, property names and values can only contain US-ASCII printable alphanumeric, except any in the following set: ``{'$', '(', ')', '<', '>', '@', ',', ';', ':', '\', '"', '/', '[', ']', '?', '=', '{', '}', SP, HT}``.

Methods are synchronous and either succeed or fail after the timeout period (default: 30 seconds, settable up to 3600 seconds). Methods are useful in interactive scenarios where you want a device to act if and only if the device is online and receiving commands, such as turning on a light from a phone. In these scenarios, you want to see an immediate success or failure so the cloud service can act on the result as soon as possible. The device may return some message body as a result of the method, but it isn't required for the method to do so. There is no guarantee on ordering or any concurrency semantics on method calls.

Device method calls are HTTP-only from the cloud side, and MQTT-only from the device side.

## Reference

### Service-facing

#### Method invocation

Direct method invocations on a device are HTTP calls which comprise:
- The *URI* specific to the device (`{iot hub}/twins/{device id}/methods/`)
- The POST *method*
- *Headers* which contain the authorization, request ID, content type, and content encoding
- A transparent JSON *body* in the following format:

    ```
    {
        "methodName": "reboot",
        "timeoutInSeconds": 200,
        "payload": {
            "input1": "someInput",
            "input2": "anotherInput"
        }
    }
    ```

  Timeout is in seconds. If timeout is not set, it defaults to 30 seconds.
  
#### Response

The back-end receives a response which comprises:
- *HTTP status code*, which is used for errors coming from the IoT Hub, including a 404 error for devices not currently connected
- *Headers* which contain the etag, request ID, content type, and content encoding
- A JSON *body* in the following format:

    ```
    {
        "status" : "OK",
        "payload" : {...}
    }
    ```
  
   Both `status` and `body` are provided by the device and used to respond with the device's own status code and/or description.

### Device-facing

#### Method invocation

Devices receive direct method requests on the MQTT topic: `$iothub/methods/POST/{method name}/?$rid={request id}`

The body which the device receives is in the following format:

```
{
    "input1": "someInput",
    "input2": "anotherInput"
}
```

Method requests are QoS 0.

#### Response

The device sends responses to `$iothub/methods/res/{status}/?$rid={request id}`, where:
  - The `status` property is the device-supplied status of method execution.
  - The `$rid` property is the request ID from the method invocation received from IoT Hub.
The body is set by the device and can be any status.

### Additional reference material

Other reference topics in the Developer Guide include:

- [IoT Hub endpoints][lnk-endpoints] describes the various endpoints that each IoT hub exposes for runtime and management operations.
- [Throttling and quotas][lnk-quotas] describes the quotas that apply to the IoT Hub service and the throttling behavior to expect when you use the service.
- [IoT Hub device and service SDKs][lnk-sdks] lists the various language SDKs you an use when you develop both device and service applications that interact with IoT Hub.
- [Query language for twins, methods, and jobs][lnk-query] describes the query language you can use to retrieve information from IoT Hub about your device twins, methods and jobs.
- [IoT Hub MQTT support][lnk-devguide-mqtt] provides more information about IoT Hub support for the MQTT protocol.

## Next steps

Now you have learned how to use direct methods, you may be interested in the following Developer Guide topic:

- [Schedule jobs on multiple devices][lnk-devguide-jobs]

If you would like to try out some of the concepts described in this article, you may be interested in the following IoT Hub tutorial:

- [Use cloud-to-device methods][lnk-methods-tutorial]

<!-- links and images -->

[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-methods-tutorial]: iot-hub-c2d-methods.md
[lnk-devguide-messages]: iot-hub-devguide-messaging.md
