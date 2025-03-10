---
title: Understand Azure IoT Hub direct methods
description: This article describes how to use direct methods to invoke code on your devices from a service app.
author: SoniaLopezBravo

ms.author: sonialopez
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 05/03/2024
ms.custom: [amqp, mqtt,'Role: Cloud Development', 'Role: IoT Device']
---

# Understand and invoke direct methods from IoT Hub

IoT Hub *direct methods* enable you to remotely invoke calls on devices from the cloud. Direct methods follow a request-response pattern and are meant for communications that require immediate confirmation of their result. For example, interactive control of a device, such as turning on a fan. This functionality is useful for scenarios where the course of immediate action is different depending on whether the device was able to respond.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

Each device method targets a single device. If you want to invoke direct methods on multiple devices, or schedule methods for disconnected devices, see [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md).

Anyone with **service connect** permissions on IoT Hub may invoke a method on a device.

Refer to the [Cloud-to-device communication guidance](iot-hub-devguide-c2d-guidance.md) if in doubt between using desired properties, direct methods, or cloud-to-device messages.

## Method lifecycle

Direct methods are implemented on the device and may require zero or more inputs in the method payload to correctly instantiate. You invoke a direct method through a service-facing URI (`{iot hub}/twins/{device id}/methods/`). A device receives direct methods through a device-specific MQTT topic (`$iothub/methods/POST/{method name}/`) or through AMQP links (the `IoThub-methodname` and `IoThub-status` application properties).

> [!NOTE]
> When you invoke a direct method on a device, property names and values can only contain US-ASCII printable alphanumeric, except any in the following set: `$ ( ) < > @ , ; : \ " / [ ] ? = { } SP HT`
>

Direct methods are synchronous and either succeed or fail after the timeout period (default 30 seconds; settable between 5 and 300 seconds). Direct methods are useful in interactive scenarios where you want a device to act if and only if the device is online and receiving commands. For example, turning on a light from a phone. In these scenarios, you want to see an immediate success or failure so the cloud service can act on the result as soon as possible. The device may return some message body as a result of the method, but it isn't required. There is no guarantee on ordering or any concurrency semantics on method calls.

Direct methods are HTTPS-only from the cloud side and MQTT, AMQP, MQTT over WebSockets, or AMQP over WebSockets from the device side.

The payload for method requests and responses is a JSON document up to 128 KB.

## Invoke a direct method from a back-end app

To invoke a direct method from a back-end app use the [Invoke device method](/rest/api/iothub/service/devices/invoke-method) REST API or its equivalent in one of the [IoT Hub service SDKs](iot-hub-devguide-sdks.md#azure-iot-hub-service-sdks).

### Method invocation

Direct method invocations on a device are HTTPS calls that are made up of the following items:

* The *request URI* specific to the device along with the API version:

    ```http
    https://fully-qualified-iothubname.azure-devices.net/twins/{deviceId}/methods?api-version=2021-04-12
    ```

* The POST *method*

* *Headers* that contain the authorization, content type, and content encoding.

* A transparent JSON *body* in the following format:

    ```json
    {
        "connectTimeoutInSeconds": 200,
        "methodName": "reboot",
        "responseTimeoutInSeconds": 200,
        "payload": {
            "input1": "someInput",
            "input2": "anotherInput"
        }
    }
    ```

The value provided as `responseTimeoutInSeconds` in the request is the amount of time that IoT Hub service must await for completion of a direct method execution on a device. Set this timeout to be at least as long as the expected execution time of a direct method by a device. If timeout is not provided, the default value of 30 seconds is used. The minimum and maximum values for `responseTimeoutInSeconds` are 5 and 300 seconds, respectively.

The value provided as `connectTimeoutInSeconds` in the request is the amount of time upon invocation of a direct method that IoT Hub service must await for a disconnected device to come online. The default value is 0, meaning that devices must already be online upon invocation of a direct method. The maximum value for `connectTimeoutInSeconds` is 300 seconds.

#### Example

This example initiates a request to invoke a direct method on an IoT device registered to an Azure IoT hub.

To begin, use the [Microsoft Azure IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to create a SharedAccessSignature.

```azurecli
az iot hub generate-sas-token -n <iothubName> --du <duration>
```

Next, replace the Authorization header with your newly generated SharedAccessSignature, then modify the `iothubName`, `deviceId`, `methodName` and `payload` parameters to match your implementation in the example `curl` command below.

```bash
curl -X POST \
  https://<iothubName>.azure-devices.net/twins/<deviceId>/methods?api-version=2021-04-12\
  -H 'Authorization: SharedAccessSignature sr=iothubname.azure-devices.net&sig=x&se=x&skn=iothubowner' \
  -H 'Content-Type: application/json' \
  -d '{
    "methodName": "reboot",
    "responseTimeoutInSeconds": 200,
    "payload": {
        "input1": "someInput",
        "input2": "anotherInput"
    }
}'
```

Execute the modified command to invoke the specified direct method. Successful requests return an HTTP 200 status code.

> [!NOTE]
> The example above demonstrates invoking a direct method on a device. If you want to invoke a direct method in an IoT Edge Module, modify the url request to include `/modules/<moduleName>` as shown below:
>
> ```bash
> https://<iothubName>.azure-devices.net/twins/<deviceId>/modules/<moduleName>/methods?api-version=2021-04-12
> ```

### Response

The back-end app receives a response that is made up of the following items:

* *HTTP status code*:
  * 200 indicates successful execution of direct method;
  * 404 indicates that either device ID is invalid, or that the device was not online upon invocation of a direct method and for `connectTimeoutInSeconds` thereafter (use accompanied error message to understand the root cause);
  * 504 indicates gateway timeout caused by device not responding to a direct method call within `responseTimeoutInSeconds`.

* *Headers* that contain the request ID, content type, and content encoding.

* A JSON *body* in the following format:

    ```json
    {
        "status" : 201,
        "payload" : {...}
    }
    ```

    Both `status` and `payload` are provided by the device and used to respond with the device's own status code and the method response.

### Method invocation for IoT Edge modules

Invoking direct methods on a module is supported by the [Invoke module method](/rest/api/iothub/service/modules/invoke-method) REST API or its equivalent in one of the IoT Hub service SDKs.

The `moduleId` is passed along with the `deviceId` in the request URI when using the REST API or as a parameter when using a service SDK. For example, `https://<iothubName>.azure-devices.net/twins/<deviceId>/modules/<moduleName>/methods?api-version=2021-04-12`. The request body and response is similar to that of direct methods invoked on the device.

## Handle a direct method on a device

On an IoT device, direct methods can be received over MQTT, AMQP, or either of these protocols over WebSockets. The [IoT Hub device SDKs](iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) help you receive and respond to direct methods on devices without having to worry about the underlying protocol details.

### MQTT

The following section is for the MQTT protocol. To learn more about using the MQTT protocol directly with IoT Hub, see [MQTT protocol support](../iot/iot-mqtt-connect-to-iot-hub.md).

#### Method invocation

Devices receive direct method requests on the MQTT topic: `$iothub/methods/POST/{method name}/?$rid={request id}`. However, the `request id` is generated by IoT Hub and cannot be known ahead of time, so subscribe to `$iothub/methods/POST/#` and then filter the delivered messages based on method names supported by your device. (You'll use the `request id` to respond.)

The body that the device receives is in the following format:

```json
{
    "input1": "someInput",
    "input2": "anotherInput"
}
```

Method requests are QoS 0.

#### Response

The device sends responses to `$iothub/methods/res/{status}/?$rid={request id}`, where:

* The `status` property is the device-supplied status of method execution.

* The `$rid` property is the request ID from the method invocation received from IoT Hub. The request ID is a hexadecimal formatted value.

The body is set by the device and can be any status.

### AMQP

The following section is for the AMQP protocol. To learn more about using the AMQP protocol directly with IoT Hub, see [AMQP protocol support](iot-hub-amqp-support.md).

#### Method invocation

The device receives direct method requests by creating a receive link on address `amqps://{hostname}:5671/devices/{deviceId}/methods/deviceBound`.

The AMQP message arrives on the receive link that represents the method request. It contains the following sections:

* The correlation ID property, which contains a request ID that should be passed back with the corresponding method response.

* An application property named `IoThub-methodname`, which contains the name of the method being invoked.

* The AMQP message body containing the method payload as JSON.

#### Response

The device creates a sending link to return the method response on address `amqps://{hostname}:5671/devices/{deviceId}/methods/deviceBound`.

The method's response is returned on the sending link and is structured as follows:

* The correlation ID property, which contains the request ID passed in the method's request message.

* An application property named `IoThub-status`, which contains the user supplied method status.

* The AMQP message body containing the method response as JSON.

## Next steps

Now you have learned how to use direct methods, you may be interested in the following IoT Hub developer guide article:

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)
* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.
* [IoT Hub query language for device twins, jobs, and message routing](iot-hub-devguide-query-language.md) describes the IoT Hub query language you can use to retrieve information from IoT Hub about your device twins and jobs.

