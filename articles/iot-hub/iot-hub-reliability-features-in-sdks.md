---
title: Manage IoT Hub connectivity & reliable messaging w/device SDKs
description: Learn how to improve your device connectivity and messaging when using the Azure IoT Hub device SDKs
services: iot-hub
author: robinsh
ms.author: robinsh
ms.date: 07/07/2018
ms.topic: article
ms.service: iot-hub
---

# Manage connectivity and reliable messaging by using Azure IoT Hub device SDKs

This article provides high-level guidance to help you design device applications that are more resilient. It shows you how to take advantage of the connectivity and reliable messaging features in Azure IoT device SDKs. The goal of this guide is to help you manage the following scenarios:

* Fixing a dropped network connection

* Switching between different network connections

* Reconnecting because of service transient connection errors

Implementation details may vary by language. For more information, see the API documentation or specific SDK:

* [C/iOS SDK](https://github.com/azure/azure-iot-sdk-c)

* [.NET SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/iothub/device/devdoc/retrypolicy.md)

* [Java SDK](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md)

* [Node SDK](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries#types-of-errors-and-how-to-detect-them)

* [Python SDK](https://github.com/Azure/azure-iot-sdk-python) (Reliability not yet implemented)

## Designing for resiliency

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

2. The SDK uses the error filter to determine the error type and decide if a retry is needed.

3. If the SDK identifies an **unrecoverable error**, operations like connection, send, and receive are stopped. The SDK notifies the user. Examples of unrecoverable errors include an authentication error and a bad endpoint error.

4. If the SDK identifies a **recoverable error**, it retries according to the specified retry policy until the defined timeout elapses.  Note that the SDK uses **Exponential back-off with jitter** retry policy by default.
5. When the defined timeout expires, the SDK stops trying to connect or send. It notifies the user.

6. The SDK allows the user to attach a callback to receive connection status changes.

The SDKs provide three retry policies:

* **Exponential back-off with jitter**: This default retry policy tends to be aggressive at the start and slow down over time until it reaches a maximum delay. The design is based on [Retry guidance from Azure Architecture Center](https://docs.microsoft.com/azure/architecture/best-practices/retry-service-specific). 

* **Custom retry**: For some SDK languages, you can design a custom retry policy that is better suited for your scenario and then inject it into the RetryPolicy. Custom retry isn't available on the C SDK, and it is not currently supported on the Python SDK. The Python SDK reconnects as-needed.

* **No retry**: You can set retry policy to "no retry," which disables the retry logic. The SDK tries to connect once and send a message once, assuming the connection is established. This policy is typically used in scenarios with bandwidth or cost concerns. If you choose this option, messages that fail to send are lost and can't be recovered.

### Retry policy APIs

   | SDK | SetRetryPolicy method | Policy implementations | Implementation guidance |
   |-----|----------------------|--|--|
   |  C/iOS  | [IOTHUB_CLIENT_RESULT IoTHubClient_SetRetryPolicy](https://github.com/Azure/azure-iot-sdk-c/blob/2018-05-04/iothub_client/inc/iothub_client.h#L188)        | **Default**: [IOTHUB_CLIENT_RETRY_EXPONENTIAL_BACKOFF](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md#connection-retry-policies)<BR>**Custom:** use available [retryPolicy](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md#connection-retry-policies)<BR>**No retry:** [IOTHUB_CLIENT_RETRY_NONE](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md#connection-retry-policies)  | [C/iOS implementation](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md#)  |
   | Java| [SetRetryPolicy](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device.deviceclientconfig.setretrypolicy?view=azure-java-stable)        | **Default**: [ExponentialBackoffWithJitter class](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-client/src/main/java/com/microsoft/azure/sdk/iot/device/transport/NoRetry.java)<BR>**Custom:** implement [RetryPolicy interface](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-client/src/main/java/com/microsoft/azure/sdk/iot/device/transport/RetryPolicy.java)<BR>**No retry:** [NoRetry class](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-client/src/main/java/com/microsoft/azure/sdk/iot/device/transport/NoRetry.java)  | [Java implementation](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md) |
   | .NET| [DeviceClient.SetRetryPolicy](/dotnet/api/microsoft.azure.devices.client.deviceclient.setretrypolicy?view=azure-dotnet) | **Default**: [ExponentialBackoff class](/dotnet/api/microsoft.azure.devices.client.exponentialbackoff?view=azure-dotnet)<BR>**Custom:** implement [IRetryPolicy interface](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.iretrypolicy?view=azure-dotnet)<BR>**No retry:** [NoRetry class](/dotnet/api/microsoft.azure.devices.client.noretry?view=azure-dotnet) | [C# implementation](https://github.com/Azure/azure-iot-sdk-csharp) | |
   | Node| [setRetryPolicy](/javascript/api/azure-iot-device/client?view=azure-iot-typescript-latest) | **Default**: [ExponentialBackoffWithJitter class](/javascript/api/azure-iot-common/exponentialbackoffwithjitter?view=azure-iot-typescript-latest)<BR>**Custom:** implement [RetryPolicy interface](/javascript/api/azure-iot-common/retrypolicy?view=azure-iot-typescript-latest)<BR>**No retry:** [NoRetry class](/javascript/api/azure-iot-common/noretry?view=azure-iot-typescript-latest) | [Node implementation](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries#types-of-errors-and-how-to-detect-them) |
   | Python| Not currently supported | Not currently supported | Not currently supported |

The following code samples illustrate this flow:

#### .NET implementation guidance

The following code sample shows how to define and set the default retry policy:

   ```csharp
   // define/set default retry policy
   IRetryPolicy retryPolicy = new ExponentialBackoff(int.MaxValue, TimeSpan.FromMilliseconds(100), TimeSpan.FromSeconds(10), TimeSpan.FromMilliseconds(100));
   SetRetryPolicy(retryPolicy);
   ```

To avoid high CPU usage, the retries are throttled if the code fails immediately. For example, when there's no network or route to the destination. The minimum time to execute the next retry is 1 second.

If the service responds with a throttling error, the retry policy is different and can't be changed via public API:

   ```csharp
   // throttled retry policy
   IRetryPolicy retryPolicy = new ExponentialBackoff(RetryCount, TimeSpan.FromSeconds(10), 
     TimeSpan.FromSeconds(60), TimeSpan.FromSeconds(5)); SetRetryPolicy(retryPolicy);
   ```

The retry mechanism stops after `DefaultOperationTimeoutInMilliseconds`, which is currently set at 4 minutes.

#### Other languages implementation guidance

For code samples in other languages, review the following implementation documents. The repository contains samples that demonstrate the use of retry policy APIs.

* [C/iOS SDK](https://github.com/azure/azure-iot-sdk-c)

* [.NET SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/iothub/device/devdoc/retrypolicy.md)

* [Java SDK](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md)

* [Node SDK](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries#types-of-errors-and-how-to-detect-them)

* [Python SDK](https://github.com/Azure/azure-iot-sdk-python)

## Next steps

* [Use device and service SDKs](./iot-hub-devguide-sdks.md)

* [Use the IoT device SDK for C](./iot-hub-device-sdk-c-intro.md)

* [Develop for constrained devices](./iot-hub-devguide-develop-for-constrained-devices.md)

* [Develop for mobile devices](./iot-hub-how-to-develop-for-mobile-devices.md)

* [Troubleshoot device disconnects](iot-hub-troubleshoot-connectivity.md)
