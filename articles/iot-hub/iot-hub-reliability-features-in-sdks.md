---
title: How to manage connectivity and reliable messaging using Azure IoT Hub device SDKs
description: Learn how to improve your device connectivity and messaging when using the Azure IoT Hub device SDKs
services: iot-hub
keywords: 
author: BryanLa
ms.author: bryanla
ms.date: 02/10/2018
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# How to manage connectivity and reliable messaging using Azure IoT Hub device SDKs

This guide provides high-level guidance for designing resilient device applications, by taking advantage of the connectivity and reliable messaging features in Azure IoT device SDKs. The goal of this article is to help answer questions and handle scenarios such as :

- managing a dropped network connection
- managing switching between different network connections
- managing reconnection due to service transient connection errors

Implementation details may vary by language, so be sure to refer to the linked API documentation or specific SDK for more details.
- [C/Python/iOS SDK][lnk-c-retry-md]
- [.NET SDK][lnk-csharp- retry-md]
- [Java SDK][lnk-java-retry-md]
- [Node SDK][lnk-node-retry-md]

## Designing for resiliency

Internet of Things devices often rely on non-continuous and/or unstable network connections such as GSM or satellite. In addition, when interacting with cloud-based services, errors can occur due to temporary conditions such as intermittent service availability and infrastructure-level faults (commonly referred to as "transient faults"). This makes it difficult for an application running on a device to manage the connection and reconnection mechanisms, as well as the retry logic for sending/receiving messages. Furthermore, the retry strategy requirements depend heavily on the IoT scenario the device participates in, and the device’s context and capabilities.

The Azure IoT Hub device SDKs aim to simplify connecting and communicating from cloud-to-device and device-to-cloud. We want to ensure that the Azure IoT device client SDKs provide a simple, robust and comprehensive way of connecting and sending/receiving messages to and from Azure IoT Hub. This also requires providing the right set of information and settings for a developer to implement the right retry strategy for a given scenario.

The relevant SDK features that support connectivity and reliable messaging are covered in the following sections.

## Connection and retry

This section provides an overview of the reconnection and retry patterns available when managing connections,  implementation guidance for using different retry policy in your device application, and relevant APIs for the device SDKs.

### Error patterns
Connection failures can happen in many levels:

1. Network errors such as a disconnected socket and name resolution errors
2. Protocol-level errors for HTTP, AMQP and MQTT transports such as links detached or sessions expired
3. Application-level errors that result from either local mistakes such as invalid credentials or service behavior such as exceeding quota or throttling

The device SDKs detect errors in all three levels.  OS-related errors and hardware errors are not detected and handled by the device SDKs.  The design is based on [Transient fault handling guidance from Azure Architecture Center](https://docs.microsoft.com/azure/architecture/best-practices/transient-faults#general-guidelines).

### Retry patterns

The process for retry when connection errors are detected is: 1) it detects the error and the associated error type; 2) based on the error type, it uses the error filter to decide if retry needs to be performed; 3) it applies the specified retry policy if needed.

1. The SDK detects errors in network, protocol or application.

2. If an **unrecoverable error** is identified by the SDK, operations (connection and send/receive) will be stopped and the SDK will notify the user. An **unrecoverable error** is an error that the SDK can identify and determine that it can not be required, for example, an authentication or bad endpoint error.  If a recoverable error is identified, the SDK begins to retry using the retry policy specified until a defined timeout expires.

3. When the defined timeout expires, the SDK stops trying to connect or send, and notifies the user.

4.	The device client will allow the user to attach a callback to receive connection status changes.  This is described in the device connection callback section below. 

Three retry policies are provided:
1) **Exponential back-off with jitter**: This is the default retry policy applied.  It tends to be aggressive at the start, slows down, and then hits a maximum delay that is not exceeded.  The design is based on [Retry guidance from Azure Architecture Center](https://docs.microsoft.com/azure/architecture/best-practices/retry-service-specific).
2) **Custom retry**: You can implement a custom retry policy and inject it in the RetryPolicy depending on the language you choose. You can design a retry policy that is suited for your scenario.
3) **No retry**: There is an option to set retry policy to "no retry," which disables the retry logic.  The SDK tries to connect once and send a message once, assuming the connection is established. This policy would typically be used in cases where there are bandwidth or cost concerns.  Please be aware that if this option is chosen, messages that fail to send are lost and cannot be recovered. 

### Retry policy APIs

   | SDK | SetRetryPolicy method | Policy implementations | Implementation guidance |
   |-----|----------------------|--|--|
   |  C  | Not available        |  |  |
   | Java| Not available        |  |  |
   | .NET| [DeviceClient.SetRetryPolicy](/dotnet/api/microsoft.azure.devices.client.deviceclient.setretrypolicy?view=azure-dotnet#Microsoft_Azure_Devices_Client_DeviceClient_SetRetryPolicy_Microsoft_Azure_Devices_Client_IRetryPolicy) | **Default**: [ExponentialBackoff class](/dotnet/api/microsoft.azure.devices.client.exponentialbackoff?view=azure-dotnet)<BR>**Custom:** implement [IRetryPolicy interface](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.iretrypolicy?view=azure-dotnet)<BR>**No retry:** [NoRetry class](/dotnet/api/microsoft.azure.devices.client.noretry?view=azure-dotnet) | [C# example](#net-implementation-guidance) |
   | Node| [setRetryPolicy](/javascript/api/azure-iot-device/client?view=azure-iot-typescript-latest#azure_iot_device_Client_setRetryPolicy) | **Default**: [ExponentialBackoffWithJitter class](/javascript/api/azure-iot-common/exponentialbackoffwithjitter?view=azure-iot-typescript-latest)<BR>**Custom:** implement [RetryPolicy interface](/javascript/api/azure-iot-common/retrypolicy?view=azure-iot-typescript-latest)<BR>**No retry:** [NoRetry class](/javascript/api/azure-iot-common/noretry?view=azure-iot-typescript-latest) | [Node example](#node-implementation-guidance) |
   | Python| Not available      |  |  |

Below are code examples that illustrates this flow. 

#### .NET implementation guidance

The code sample below shows how to define and set the default retry policy:

   ```csharp
   # define/set default retry policy
   RetryPolicy retryPolicy = new ExponentialBackoff(int.MaxValue, TimeSpan.FromMilliseconds(100), TimeSpan.FromSeconds(10), TimeSpan.FromMilliseconds(100));
   SetRetryPolicy(retryPolicy);
   ```

To avoid high CPU usage, the retries are throttled if the code fails immediately (e.g. when there is no network or route to destination) so that the minimum time to execute the next retry is 1 second. 

The following graph shows how much delay is *added* after the initial I/O call failed with a transport error:

   ![Retry graph](media/how-to-manage-connectivity-and-reliable-messaging/retry-graph.png "Retry graph showing the delay added after call fail with transport error")

If the service is responding with a throttling error, the retry policy is different and cannot be changed via public API:

   ```csharp
   # throttled retry policy
   RetryPolicy retryPolicy = new ExponentialBackoff(RetryCount, TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(60), TimeSpan.FromSeconds(5));
   SetRetryPolicy(retryPolicy);
   ```

##### TODO
- For reference: [Connection Management functional spec](https://microsoft.sharepoint.com/:w:/r/teams/Azure_IoT/_layouts/15/doc2.aspx?sourcedoc=%7BFBADCD9B-86F1-49DF-89AF-5AE2350C820B%7D&file=Azure%20IoT%20Hub%20Device%20Client%20SDKs%20-%20Connection%20Management.docx&action=edit&mobileredirect=true) for additional details.
- Rewrite this "Patterns" section (or "Policies"?), based on template distilled from Pierre's [Node.js Connectivity and Retries doc](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries). Goal is to explain how these work in an SDK-neutral way. 
- Need to add specific guidance about when you would use each, not just explain what each is and how it works.
- For "Default retry: exponential back-off with jitter", cite one of the following (replaces the [Amazon retry bible](https://aws.amazon.com/it/blogs/architecture/exponential-backoff-and-jitter/) doc)
   - [Azure Architecture Center - Retry guidance for specific Azure services](https://docs.microsoft.com/azure/architecture/best-practices/retry-service-specific)
   - [Azure Architecture Center - Transient fault handling](https://docs.microsoft.com/azure/architecture/best-practices/transient-faults#general-guidelines)
- Need to add clarity on how SDKs do/don't guarantee messaging order, client vs service perspective (ie: from the client send - not the service arrival)


The retry mechanism will stop after `DefaultOperationTimeoutInMilliseconds`, which is currently set at 4 minutes.

#### Node implementation guidance

##### TODO: text from [Pierre's Connectivity & Retries article](https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries)

### Connection Event APIs

##### TODO: Should we just remove this section?

This is covered in the [Connection status callback section](#connection-status-callback)

### GetLastError 

##### TODO

### Send/Receive: attach a callback for messages to/from IoT Hub 

##### TODO
 
## Connection status callback

Overview should cover:

- Use cases/scenarios - blinking a LED scenario; programmatic logic flow based on connection status callback (need to include caveats) 
- If connection status callback is implemented, device will receive a connection status and connection status change reason 

### How to set connection status callback

##### TODO: NEED CODE SNIPPETS TO DEMONSTRATE APIS FOR EACH
- C 
- C# 
- Java: N/A 
- Node: N/A 
- Python 

### Connection status 

##### TODO: Finish this section, cover:
- Java (N/A)
- C#: Disconnected, connected, disconnected_retrying (need to list which will retry) 
- C: Authenticated, not_authenticated  
- Node: not implemented yet 

### Connection status change reason 

##### TODO: Need explanations of each of the following [TIM TO FILL OUT WHEN CLOSED] 
- Expired_SAS_Token 
- Device_Disabled 
- Bad_Credential 
- Retry_Expired 
- No_Network 
- Communciation_Error 

## Queueing

##### TODO: 
- Describe scenario for implementing
- Discuss how to set it up, what transport supports this

## Next steps

##### TODO:  Add relevant links


- [C/Python/iOS SDK]:
- [.NET SDK]:https://github.com/Azure/azure-iot-sdk-csharp/blob/master/iothub/device/devdoc/requirements/retrypolicy.md
- [Java SDK]: https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-client/devdoc/requirement_docs/com/microsoft/azure/iothub/retryPolicy.md
- [Node SDK]:https://github.com/Azure/azure-iot-sdk-node/wiki/Connectivity-and-Retries#types-of-errors-and-how-to-detect-them