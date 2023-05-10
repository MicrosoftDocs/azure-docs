---
title: Manage device reconnections to create resilient applications
titleSuffix: Azure IoT
description: Manage the device connection and reconnection process to ensure resilient applications by using the Azure IoT Hub device SDKs.
services: iot-develop
author: timlt
ms.author: timlt
ms.date: 03/30/2023
ms.topic: conceptual
ms.service: iot-develop
ms.custom: [amqp, mqtt, devx-track-csharp]
---

# Manage device reconnections to create resilient applications

This article provides high-level guidance to help you design resilient applications by adding a device reconnection strategy. It explains why devices disconnect and need to reconnect. And it describes specific strategies that developers can use to reconnect devices that have been disconnected.  

## What causes disconnections
The following are the most common reasons that devices disconnect from IoT Hub: 

- Expired SAS token or X.509 certificate. The device's SAS token or X.509 authentication certificate expired. 
- Network interruption. The device's connection to the network is interrupted.
- Service disruption. The Azure IoT Hub service experiences errors or is temporarily unavailable. 
- Service reconfiguration. After you reconfigure IoT Hub service settings, it can cause devices to require reprovisioning or reconnection. 

## Why you need a reconnection strategy

It's important to have a strategy to reconnect devices as described in the following sections.  Without a reconnection strategy, you could see a negative effect on your solution's performance, availability, and cost. 

### Mass reconnection attempts could cause a DDoS

A high number of connection attempts per second can cause a condition similar to a distributed denial-of-service attack (DDoS). This scenario is relevant for large fleets of devices numbering in the millions. The issue can extend beyond the tenant that owns the fleet, and affect the entire scale-unit. A DDoS could drive a large cost increase for your Azure IoT Hub resources, due to a need to scale out.  A DDoS could also hurt your solution's performance due to resource starvation. In the worse case, a DDoS can cause service interruption. 

### Hub failure or reconfiguration could disconnect many devices

After an IoT hub experiences a failure, or after you reconfigure service settings on an IoT hub, devices might be disconnected. For proper failover, disconnected devices require reprovisioning.  To learn more about failover options, see [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md).

### Reprovisioning many devices could increase costs

After devices disconnect from IoT Hub, the optimal solution is to reconnect the device rather than reprovision it. If you use IoT Hub with DPS, DPS has a per provisioning cost. If you reprovision many devices on DPS, it increases the cost of your IoT solution. To learn more about DPS provisioning costs, see [IoT Hub DPS pricing](https://azure.microsoft.com/pricing/details/iot-hub). 

## Design for resiliency

IoT devices often rely on noncontinuous or unstable network connections (for example, GSM or satellite). Errors can occur when devices interact with cloud-based services because of intermittent service availability and infrastructure-level or transient faults. An application that runs on a device has to manage the mechanisms for connection, reconnection, and the retry logic for sending and receiving messages. Also, the retry strategy requirements depend heavily on the device's IoT scenario, context, capabilities.

The Azure IoT Hub device SDKs aim to simplify connecting and communicating from cloud-to-device and device-to-cloud. These SDKs provide a robust way to connect to Azure IoT Hub and a comprehensive set of options for sending and receiving messages. Developers can also modify existing implementation to customize a better retry strategy for a given scenario.

The relevant SDK features that support connectivity and reliable messaging are available in the following IoT Hub device SDKs. For more information, see the API documentation or specific SDK:

* [C SDK](https://github.com/Azure/azure-iot-sdk-c/blob/main/doc/connection_and_messaging_reliability.md)

* [.NET SDK](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/devdoc/retrypolicy.md)

* [Java SDK](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md)

* [Node SDK](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries)

* [Python SDK](https://github.com/Azure/azure-iot-sdk-python)

The following sections describe SDK features that support connectivity.

## Connection and retry

This section gives an overview of the reconnection and retry patterns available when managing connections. It details implementation guidance for using a different retry policy in your device application and lists relevant APIs from the device SDKs.

### Error patterns

Connection failures can happen at many levels:

* Network errors: disconnected socket and name resolution errors

* Protocol-level errors for HTTP, AMQP, and MQTT transport: detached links or expired sessions

* Application-level errors that result from either local mistakes: invalid credentials or service behavior (for example, exceeding the quota or throttling)

The device SDKs detect errors at all three levels. However, device SDKs don't detect and handle OS-related errors and hardware errors. The SDK design is based on [The Transient Fault Handling Guidance](/azure/architecture/best-practices/transient-faults#general-guidelines) from the Azure Architecture Center.

### Retry patterns

The following steps describe the retry process when connection errors are detected:

1. The SDK detects the error and the associated error in the network, protocol, or application.

1. The SDK uses the error filter to determine the error type and decide if a retry is needed.

1. If the SDK identifies an **unrecoverable error**, operations like connection, send, and receive are stopped. The SDK notifies the user. Examples of unrecoverable errors include an authentication error and a bad endpoint error.

1. If the SDK identifies a **recoverable error**, it retries according to the specified retry policy until the defined timeout elapses.  The SDK uses **Exponential back-off with jitter** retry policy by default.

1. When the defined timeout expires, the SDK stops trying to connect or send. It notifies the user.

1. The SDK allows the user to attach a callback to receive connection status changes.

The SDKs typically provide three retry policies:

* **Exponential back-off with jitter**: This default retry policy tends to be aggressive at the start and slow down over time until it reaches a maximum delay. The design is based on [Retry guidance from Azure Architecture Center](/azure/architecture/best-practices/retry-service-specific).

* **Custom retry**: For some SDK languages, you can design a custom retry policy that is better suited for your scenario and then inject it into the RetryPolicy. Custom retry isn't available on the C SDK, and it isn't currently supported on the Python SDK. The Python SDK reconnects as-needed.

* **No retry**: You can set retry policy to "no retry", which disables the retry logic. The SDK tries to connect once and send a message once, assuming the connection is established. This policy is typically used in scenarios with bandwidth or cost concerns. If you choose this option, messages that fail to send are lost and can't be recovered.

### Retry policy APIs

| SDK | SetRetryPolicy method | Policy implementations | Implementation guidance |
|---|---|---|---|
| C | [IOTHUB_CLIENT_RESULT IoTHubDeviceClient_SetRetryPolicy](https://azure.github.io/azure-iot-sdk-c/iothub__device__client_8h.html#a53604d8d75556ded769b7947268beec8) | See: [IOTHUB_CLIENT_RETRY_POLICY](https://azure.github.io/azure-iot-sdk-c/iothub__client__core__common_8h.html#a361221e523247855ff0a05c2e2870e4a) | [C implementation](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md) |
| Java | [SetRetryPolicy](/java/api/com.microsoft.azure.sdk.iot.device.deviceclientconfig.setretrypolicy) | **Default**: [ExponentialBackoffWithJitter class](/java/api/com.microsoft.azure.sdk.iot.device.transport.exponentialbackoffwithjitter)<BR>**Custom:** implement RetryPolicy interface<BR>**No retry:** [NoRetry class](/java/api/com.microsoft.azure.sdk.iot.device.transport.noretry) | [Java implementation](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md) |
| .NET | [DeviceClient.SetRetryPolicy](/dotnet/api/microsoft.azure.devices.client.deviceclient.setretrypolicy) | **Default**: [ExponentialBackoff class](/dotnet/api/microsoft.azure.devices.client.exponentialbackoff)<BR>**Custom:** implement [IRetryPolicy interface](/dotnet/api/microsoft.azure.devices.client.iretrypolicy)<BR>**No retry:** [NoRetry class](/dotnet/api/microsoft.azure.devices.client.noretry) | [C# implementation](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/devdoc/retrypolicy.md) |
| Node | [setRetryPolicy](/javascript/api/azure-iot-device/client#azure-iot-device-client-setretrypolicy) | **Default**: [ExponentialBackoffWithJitter class](/javascript/api/azure-iot-common/exponentialbackoffwithjitter)<BR>**Custom:** implement [RetryPolicy interface](/javascript/api/azure-iot-common/retrypolicy)<BR>**No retry:** [NoRetry class](/javascript/api/azure-iot-common/noretry) | [Node implementation](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries) |
| Python | Not currently supported | Not currently supported | Built-in connection retries: Dropped connections are retried with a fixed 10-second interval by default. This functionality can be disabled if desired, and the interval can be configured. |

## Hub reconnection flow

If you use IoT Hub only without DPS, use the following reconnection strategy.  

When a device fails to connect to IoT Hub, or is disconnected from IoT Hub:

1. Use an exponential back-off with jitter delay function. 
1. Reconnect to IoT Hub. 

The following diagram summarizes the reconnection flow:

:::image type="content" source="media/concepts-manage-device-reconnections/connect-retry-iot-hub.png" alt-text="Diagram of device reconnect flow for IoT Hub." border="false":::


## Hub with DPS reconnection flow

If you use IoT Hub with DPS, use the following reconnection strategy.  

When a device fails to connect to IoT Hub, or is disconnected from IoT Hub, reconnect based on the following cases:

|Reconnection scenario | Reconnection strategy |
|---------|---------|
|For errors that allow connection retries (HTTP response code 500) | Use an exponential back-off with jitter delay function. <br>  Reconnect to IoT Hub. |
|For errors that indicate a retry is possible, but reconnection has failed 10 consecutive times | Reprovision the device to DPS. |
|For errors that don't allow connection retries (HTTP responses 401, Unauthorized or 403, Forbidden or 404, Not Found) | Reprovision the device to DPS. |

The following diagram summarizes the reconnection flow:

:::image type="content" source="media/concepts-manage-device-reconnections/connect-retry-iot-hub-with-DPS.png" alt-text="Diagram of device reconnect flow for IoT Hub with DPS." border="false":::

## Next steps

Suggested next steps include:

- [Troubleshoot device disconnects](../iot-hub/iot-hub-troubleshoot-connectivity.md)

- [Deploy devices at scale](../iot-dps/concepts-deploy-at-scale.md)
