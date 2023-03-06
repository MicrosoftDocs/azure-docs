---
title: Manage connectivity and reliable messaging
titleSuffix: Azure IoT
description: How to manage device connectivity and ensure reliable messaging when you use the Azure IoT Hub device SDKs
services: iot-develop
author: dominicbetts
ms.author: dobett
ms.date: 02/20/2023
ms.topic: how-to
ms.service: iot-hub
ms.custom: [amqp, mqtt, devx-track-csharp]
---

# Manage connectivity and reliable messaging by using Azure IoT Hub device SDKs

This article provides high-level guidance to help you design device applications that are more resilient. It shows you how to take advantage of the connectivity and reliable messaging features in Azure IoT device SDKs. The goal of this guide is to help you manage the following scenarios:

* Fixing a dropped network connection

* Switching between different network connections

* Reconnecting because of transient service connection errors

Implementation details vary by language. For more information, see the API documentation or specific SDK:

* [C SDK](https://github.com/Azure/azure-iot-sdk-c/blob/main/doc/connection_and_messaging_reliability.md)

* [.NET SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/devdoc/retrypolicy.md)

* [Java SDK](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md)

* [Node SDK](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries)

* [Python SDK](https://github.com/Azure/azure-iot-sdk-python)

## Design for resiliency

IoT devices often rely on non-continuous or unstable network connections (for example, GSM or satellite). Errors can occur when devices interact with cloud-based services because of intermittent service availability and infrastructure-level or transient faults. An application that runs on a device has to manage the mechanisms for connection, re-connection, and the retry logic for sending and receiving messages. Also, the retry strategy requirements depend heavily on the device's IoT scenario, context, capabilities.

The Azure IoT Hub device SDKs aim to simplify connecting and communicating from cloud-to-device and device-to-cloud. These SDKs provide a robust way to connect to Azure IoT Hub and a comprehensive set of options for sending and receiving messages. Developers can also modify existing implementation to customize a better retry strategy for a given scenario.

The relevant SDK features that support connectivity and reliable messaging are covered in the following sections.

## Connection and retry

This section gives an overview of the re-connection and retry patterns available when managing connections. It details implementation guidance for using a different retry policy in your device application and lists relevant APIs from the device SDKs.

### Error patterns

Connection failures can happen at many levels:

* Network errors: disconnected socket and name resolution errors

* Protocol-level errors for HTTP, AMQP, and MQTT transport: detached links or expired sessions

* Application-level errors that result from either local mistakes: invalid credentials or service behavior (for example, exceeding the quota or throttling)

The device SDKs detect errors at all three levels. OS-related errors and hardware errors are not detected and handled by the device SDKs. The SDK design is based on [The Transient Fault Handling Guidance](/azure/architecture/best-practices/transient-faults#general-guidelines) from the Azure Architecture Center.

### Retry patterns

The following steps describe the retry process when connection errors are detected:

1. The SDK detects the error and the associated error in the network, protocol, or application.

1. The SDK uses the error filter to determine the error type and decide if a retry is needed.

1. If the SDK identifies an **unrecoverable error**, operations like connection, send, and receive are stopped. The SDK notifies the user. Examples of unrecoverable errors include an authentication error and a bad endpoint error.

1. If the SDK identifies a **recoverable error**, it retries according to the specified retry policy until the defined timeout elapses.  Note that the SDK uses **Exponential back-off with jitter** retry policy by default.

1. When the defined timeout expires, the SDK stops trying to connect or send. It notifies the user.

1. The SDK allows the user to attach a callback to receive connection status changes.

The SDKs typically provide three retry policies:

* **Exponential back-off with jitter**: This default retry policy tends to be aggressive at the start and slow down over time until it reaches a maximum delay. The design is based on [Retry guidance from Azure Architecture Center](/azure/architecture/best-practices/retry-service-specific).

* **Custom retry**: For some SDK languages, you can design a custom retry policy that is better suited for your scenario and then inject it into the RetryPolicy. Custom retry isn't available on the C SDK, and it is not currently supported on the Python SDK. The Python SDK reconnects as-needed.

* **No retry**: You can set retry policy to "no retry", which disables the retry logic. The SDK tries to connect once and send a message once, assuming the connection is established. This policy is typically used in scenarios with bandwidth or cost concerns. If you choose this option, messages that fail to send are lost and can't be recovered.

### Retry policy APIs

| SDK | SetRetryPolicy method | Policy implementations | Implementation guidance |
|---|---|---|---|
| C | [IOTHUB_CLIENT_RESULT IoTHubDeviceClient_SetRetryPolicy](https://azure.github.io/azure-iot-sdk-c/iothub__device__client_8h.html#a53604d8d75556ded769b7947268beec8) | See: [IOTHUB_CLIENT_RETRY_POLICY](https://azure.github.io/azure-iot-sdk-c/iothub__client__core__common_8h.html#a361221e523247855ff0a05c2e2870e4a) | [C implementation](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md) |
| Java | [SetRetryPolicy](/java/api/com.microsoft.azure.sdk.iot.device.deviceclientconfig.setretrypolicy) | **Default**: [ExponentialBackoffWithJitter class](/java/api/com.microsoft.azure.sdk.iot.device.transport.exponentialbackoffwithjitter)<BR>**Custom:** implement [RetryPolicy interface](/api/com.microsoft.azure.sdk.iot.device.transport.retrypolicy)<BR>**No retry:** [NoRetry class](/java/api/com.microsoft.azure.sdk.iot.device.transport.noretry) | [Java implementation](https://github.com/Azure/azure-iot-sdk-java/blob/main/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md) |
| .NET | [DeviceClient.SetRetryPolicy](/dotnet/api/microsoft.azure.devices.client.deviceclient.setretrypolicy) | **Default**: [ExponentialBackoff class](/dotnet/api/microsoft.azure.devices.client.exponentialbackoff)<BR>**Custom:** implement [IRetryPolicy interface](/dotnet/api/microsoft.azure.devices.client.iretrypolicy)<BR>**No retry:** [NoRetry class](/dotnet/api/microsoft.azure.devices.client.noretry) | [C# implementation](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/devdoc/retrypolicy.md) |
| Node | [setRetryPolicy](/javascript/api/azure-iot-device/client#azure-iot-device-client-setretrypolicy) | **Default**: [ExponentialBackoffWithJitter class](/javascript/api/azure-iot-common/exponentialbackoffwithjitter)<BR>**Custom:** implement [RetryPolicy interface](/javascript/api/azure-iot-common/retrypolicy)<BR>**No retry:** [NoRetry class](/javascript/api/azure-iot-common/noretry) | [Node implementation](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries) |
| Python | Not currently supported | Not currently supported | Built-in connection retries: Dropped connections will be retried with a fixed 10 second interval by default. This functionality can be disabled if desired, and the interval can be configured. |

## Next steps

Suggested next steps include:

* [Troubleshoot device disconnects](../iot-hub/iot-hub-troubleshoot-connectivity.md)

* [Use the Azure IoT Device SDKs](./about-iot-sdks.md)
