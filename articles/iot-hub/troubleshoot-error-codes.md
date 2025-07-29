---
title: Troubleshooting Azure IoT Hub error codes
description: Understand specific error codes and how to fix errors reported by Azure IoT Hub
author: SoniaLopezBravo
manager: lizross
ms.service: azure-iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 03/20/2025
ms.author: sonialopez
ms.custom: [mqtt, iot]
---

# Understand and resolve Azure IoT Hub errors

This article describes the causes and solutions for common error codes that you might encounter while using IoT Hub.

## 400027 Connection forcefully closed on new connection

You might see the **400027 ConnectionForcefullyClosedOnNewConnection** error if your device disconnects and reports **Communication_Error** as the **ConnectionStatusChangeReason** using .NET SDK and MQTT transport type. Or, your device-to-cloud twin operation (such as read or patch reported properties) or direct method invocation fails with the error code **400027**.

This error occurs when another client creates a new connection to IoT Hub using the same identity, so IoT Hub closes the previous connection. IoT Hub doesn't allow more than one client to connect using the same identity.

To resolve this error, ensure that each client connects to IoT Hub using its own identity.

## 401003 IoT Hub unauthorized

In logs, you might see a pattern of devices disconnecting with **401003 IoTHubUnauthorized**, followed by **404104 DeviceConnectionClosedRemotely**, and then successfully connecting shortly after.

Or, requests to IoT Hub fail with one of the following error messages:

* Authorization header missing
* IotHub '\*' does not contain the specified device '\*'
* Authorization rule '\*' does not allow access for '\*'
* Authentication failed for this device, renew token or certificate and reconnect
* Thumbprint does not match configuration: Thumbprint: SHA1Hash=\*, SHA2Hash=\*; Configuration: PrimaryThumbprint=\*, SecondaryThumbprint=\*
* Principal user@example.com is not authorized for GET on /exampleOperation due to no assigned permissions

This error occurs because, for MQTT, some SDKs rely on IoT Hub to issue the disconnect when the SAS token expires to know when to refresh it. So:

1. The SAS token expires
1. IoT Hub notices the expiration, and disconnects the device with **401003 IoTHubUnauthorized**
1. The device completes the disconnection with **404104 DeviceConnectionClosedRemotely**
1. The IoT SDK generates a new SAS token
1. The device reconnects with IoT Hub successfully

Or, IoT Hub couldn't authenticate the auth header, rule, or key. This result could be due to any of the reasons cited in the symptoms.

To resolve this error, no action is needed if using IoT SDK for connection using the device connection string. IoT SDK regenerates the new token to reconnect on SAS token expiration.

The default token lifespan is 60 minutes across SDKs; however, for some SDKs the token lifespan and the token renewal threshold is configurable. Additionally, the errors generated when a device disconnects and reconnects on token renewal differs for each SDK. To learn more, and for information about how to determine which SDK your device is using in logs, see the [MQTT device disconnect behavior with Azure IoT SDKs](iot-hub-troubleshoot-connectivity.md#mqtt-device-disconnect-behavior-with-azure-iot-sdks) section of [Monitor, diagnose, and troubleshoot Azure IoT Hub device connectivity](iot-hub-troubleshoot-connectivity.md).

For device developers, if the volume of errors is a concern, switch to the C SDK, which renews the SAS token before expiration. For AMQP, the SAS token can refresh without disconnection.

In general, the error message presented should explain how to fix the error. If for some reason you don't have access to the error message detail, make sure:

* The SAS or other security token you use isn't expired.
* For X.509 certificate authentication, the device certificate or the CA certificate associated with the device isn't expired. To learn how to register X.509 CA certificates with IoT Hub, see [Tutorial: Create and upload certificates for testing](tutorial-x509-test-certs.md).
* For X.509 certificate thumbprint authentication, the thumbprint of the device certificate is registered with IoT Hub.
* The authorization credential is well formed for the protocol that you use. To learn more, see [Control access to IoT Hub by using Microsoft Entra ID](authenticate-authorize-azure-ad.md).
* The authorization rule used has the permission for the operation requested.
* For the last error messages beginning with "principal...", this error can be resolved by assigning the correct level of Azure RBAC permission to the user. For example, an Owner on the IoT Hub can assign the "IoT Hub Data Owner" role, which gives all permissions. Try this role to resolve the lack of permission issue.

> [!NOTE]
> Some devices might experience a time drift issue when the device time has a difference from the server time that is greater than five minutes. This error can occur when a device has been connecting to an IoT hub without issues for weeks or even months but then starts to continually have its connection refused. The error can also be specific to a subset of devices connected to the IoT hub, since the time drift can happen at different rates depending upon when a device is first connected or turned on.
>
> Often, performing a time sync using NTP or rebooting the device (which can automatically perform a time sync during the boot sequence) fixes the issue and allows the device to connect again. To avoid this error, configure the device to perform a periodic time sync using NTP. You can schedule the sync for daily, weekly, or monthly depending on the amount of drift the device experiences. If you can't configure a periodic NTP sync on your device, then schedule a periodic reboot.

## 403002 IoT Hub quota exceeded

You might see requests to IoT Hub fail with the error  **403002 IoTHubQuotaExceeded**. And in Azure portal, the IoT hub device list doesn't load.

This error typically occurs when the daily message quota for the IoT hub is exceeded. To resolve this error:

* [Upgrade or increase the number of units on the IoT hub](iot-hub-upgrade.md) or wait for the next UTC day for the daily quota to refresh.
* To understand how operations are counted toward the quota, such as twin queries and direct methods, see the [Charges per operation](iot-hub-devguide-pricing.md#charges-per-operation) section of [Azure IoT Hub billing information](iot-hub-devguide-pricing.md).
* To set up monitoring for daily quota usage, set up an alert with the metric *Total number of messages used*. For step-by-step instructions, see the [Set up metrics](tutorial-use-metrics-and-diags.md#set-up-metrics) section of [Tutorial: Set up and use metrics and logs with an IoT hub](tutorial-use-metrics-and-diags.md).

A bulk import job might also return this error when the number of devices registered to your IoT hub approaches or exceeds the quota limit for an IoT hub. To learn more, see the [Troubleshoot import jobs](iot-hub-bulk-identity-mgmt.md#troubleshoot-import-jobs) section of [Import and export IoT Hub device identities in bulk](iot-hub-bulk-identity-mgmt.md).

## 403004 Device maximum queue depth exceeded

When trying to send a cloud-to-device message, you might see that the request fails with the error **403004** or **DeviceMaximumQueueDepthExceeded**.

The underlying cause of this error is that the number of messages enqueued for the device exceeds the [queue limit](iot-hub-devguide-quotas-throttling.md#other-limits).

The most likely reason that you're running into this limit is because you're using HTTPS to receive the message, which leads to continuous polling using `ReceiveAsync`, resulting in IoT Hub throttling the request.

The supported pattern for cloud-to-device messages with HTTPS is intermittently connected devices that check for messages infrequently (less than every 25 minutes). To reduce the likelihood of running into the queue limit, switch to AMQP or MQTT for cloud-to-device messages.

Alternatively, enhance device side logic to complete, reject, or abandon queued messages quickly, shorten the time to live, or consider sending fewer messages. For more information, see the [Message expiration (time to live)](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live) section of [Understand cloud-to-device messaging from an IoT hub](./iot-hub-devguide-messages-c2d.md).

Lastly, consider using the [Purge Queue API](/rest/api/iothub/service/cloud-to-device-messages/purge-cloud-to-device-message-queue) to periodically clean up pending messages before the limit is reached.

## 403006 Device maximum active file upload limit exceeded

You might see that your file upload request fails with the error code **403006 DeviceMaximumActiveFileUploadLimitExceeded** and a message "Number of active file upload requests cannot exceed 10".

This error occurs because each device client is limited for [concurrent file uploads](iot-hub-devguide-quotas-throttling.md#other-limits). You can easily exceed the limit if your device doesn't notify IoT Hub when file uploads are completed. An unreliable device side network commonly causes this problem.

To resolve this error, ensure that the device can promptly [notify IoT Hub file upload completion](iot-hub-devguide-file-upload.md#device-notify-iot-hub-of-a-completed-file-upload). Then, try [reducing the SAS token TTL for file upload configuration](iot-hub-configure-file-upload.md).

## 404001 Device not found

During a cloud-to-device (C2D) communication, such as C2D message, twin update, or direct method, you might see that the operation fails with error **404001 DeviceNotFound**.

The operation failed because IoT Hub can't find the device. The device either isn't registered or is disabled.

To resolve this error, register the device ID that you used, then try again.

## 404103 Device not online

You might see that a direct method to a device fails with the error **404103 DeviceNotOnline** even if the device is online.

If you know that the device is online and still get the error, then the error likely occurred because the direct method callback isn't registered on the device.

For more information about configuring your device properly for direct method callbacks, see the [Handle a direct method on a device](iot-hub-devguide-direct-methods.md#handle-a-direct-method-on-a-device) section of [Handle a direct method on a device](iot-hub-devguide-direct-methods.md).

## 404104 Device connection closed remotely

You might see that devices disconnect at a regular interval (every 65 minutes, for example) and you see **404104 DeviceConnectionClosedRemotely** in IoT Hub resource logs. Sometimes, you also see **401003 IoTHubUnauthorized** and a successful device connection event less than a minute later.

Or, devices disconnect randomly, and you see **404104 DeviceConnectionClosedRemotely** in IoT Hub resource logs.

Or, many devices disconnect at once, you see a dip in the [Connected devices (connectedDeviceCount) metric](monitor-iot-hub-reference.md#metrics), and there are more **404104 DeviceConnectionClosedRemotely** and [500xxx Internal errors](#500xxx-internal-errors) in Azure Monitor Logs than usual.

This error can occur because the [SAS token used to connect to IoT Hub](iot-hub-dev-guide-sas.md#sas-tokens) expired, which causes IoT Hub to disconnect the device. The connection is re-established when the device refreshes the token. For example, [the SAS token expires every hour by default for C SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/connection_and_messaging_reliability.md#connection-authentication), which can lead to regular disconnects. To learn more, see [401003 IoTHubUnauthorized](#401003-iot-hub-unauthorized).

Some other possibilities include:

* The device lost underlying network connectivity longer than the [MQTT keep-alive](../iot/iot-mqtt-connect-to-iot-hub.md#default-keep-alive-time-out), resulting in a remote idle time-out. The MQTT keep-alive setting can be different per device.
* The device sent a TCP/IP-level reset but didn't send an application-level `MQTT DISCONNECT`. Basically, the device abruptly closed the underlying socket connection. Sometimes, bugs in older versions of the Azure IoT SDK might cause this issue.
* The device side application crashed.

Or, IoT Hub might be experiencing a transient issue. For more information, see [500xxx Internal errors](#500xxx-internal-errors).

To resolve this error:

* See the guidance for [error 401003 IoTHubUnauthorized](#401003-iot-hub-unauthorized).
* Make sure the device has good connectivity to IoT Hub by [testing the connection](tutorial-connectivity.md). If the network is unreliable or intermittent, we don't recommend increasing the keep-alive value because it could result in detection (via Azure Monitor alerts, for example) taking longer.
* Use the latest versions of the [Azure IoT Hub SDKs](iot-hub-devguide-sdks.md).
* See the guidance for [500xxx Internal errors](#500xxx-internal-errors).

We recommend using Azure IoT device SDKs to manage connections reliably. To learn more, see [Manage device reconnections to create resilient applications](../iot/concepts-manage-device-reconnections.md)

## 409001 Device already exists

When trying to register a device in IoT Hub, you might see that the request fails with the error **409001 DeviceAlreadyExists**.

This error occurs because there's already a device with the same device ID in the IoT hub.

To resolve this error, use a different device ID and try again.

## 409002 Link creation conflict

You might see the error **409002 LinkCreationConflict** in logs along with device disconnection or cloud-to-device message failure.

<!-- When using AMQP? -->

Generally, this error happens when IoT Hub detects a client has more than one connection. In fact, when a new connection request arrives for a device with an existing connection, IoT Hub closes the existing connection with this error.

In the most common case, a separate issue (such as [404104 DeviceConnectionClosedRemotely](#404104-device-connection-closed-remotely)) causes the device to disconnect. The device tries to reestablish the connection immediately, but IoT Hub still considers the device connected. IoT Hub closes the previous connection and logs this error.

Or, faulty device-side logic causes the device to establish the connection when one is already open.

To resolve this error, look for other errors in the logs that you can troubleshoot because this error usually appears as a side effect of a different, transient issue. Otherwise, make sure to issue a new connection request only if the connection drops.

## 412002 Device message lock lost

When trying to send a cloud-to-device message, you might see that the request fails with the error **412002 DeviceMessageLockLost**.

This error occurs because when a device receives a cloud-to-device message from the queue (for example, using [`ReceiveAsync()`](/dotnet/api/microsoft.azure.devices.client.deviceclient.receiveasync)), IoT Hub locks the message for a lock time-out duration of one minute. If the device tries to complete the message after the lock time-out expires, IoT Hub throws this exception.

If IoT Hub doesn't get the notification within the one-minute lock time-out duration, it sets the message back to *Enqueued* state. The device can attempt to receive the message again. To prevent the error from happening in the future, implement device side logic to complete the message within one minute of receiving the message. This one-minute time-out can't be changed.

## 429xxx Throttling exception

You might see that your requests to IoT Hub fail with an error that begins with **429** such as:

* **429000 - GenericTooManyRequests**
* **429001 – ThrottlingException**: [Throttling limits](iot-hub-devguide-quotas-throttling.md) are exceeded for the requested operation.
* **429002 - ThrottleBacklogLimitExceeded**: The number of requests that are in the backlog due to throttling has exceeded the backlog limit.
* **429003 - ThrottlingBacklogTimeout**: Requests that were backlogged due to throttling have timed out while waiting in the backlog queue.
* **429004 - ThrottlingMaxActiveJobCountExceeded**
* **429005 – DeviceThrottlingLimitExceeded**

You can only monitor **429001** through Azure Monitor under the metric [Number of Throttling Errors](monitor-iot-hub-reference.md). Currently, the other throttling errors do not have an associated metric but are captured in the logs.

To resolve these errors, check if you're hitting the throttling limit by comparing your *Telemetry message send attempts* metric against the limits previously specified. You can also check the *Number of throttling errors* metric. For information about these metrics, see [Device telemetry metrics](monitor-iot-hub-reference.md#device-telemetry-metrics). For information about how use metrics to help you monitor your IoT hub, see [Monitor Azure IoT Hub](monitor-iot-hub.md).

IoT Hub returns **429001 – ThrottlingException** only after the limit is violated for too long a period. This delay is done so that your messages aren't dropped if your IoT hub gets burst traffic. In the meantime, IoT Hub processes the messages at the operation throttle rate, which might be slow if there's too much traffic in the backlog. For more information, see the [Traffic shaping](iot-hub-devguide-quotas-throttling.md#traffic-shaping) section of [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

Consider [scaling up your IoT hub](iot-hub-scaling.md) if you're running into quota or throttling limits.

## 500xxx Internal errors

You might see that your request to IoT Hub fails with an error that begins with 500 and/or some sort of "server error." Some possibilities are:

* **500001 ServerError**: IoT Hub ran into a server-side issue.

* **500008 GenericTimeout**: IoT Hub couldn't complete the connection request before timing out.

* **ServiceUnavailable (no error code)**: IoT Hub encountered an internal error.

* **InternalServerError (no error code)**: IoT Hub encountered an internal error.

There can be many causes for a 500xxx error response. In all cases, the issue is most likely transient. While the IoT Hub team works hard to maintain [the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/), small subsets of IoT Hub nodes can occasionally experience transient faults. When your device tries to connect to a node that's having issues, you receive this error.

To mitigate 500xxx errors, issue a retry from the device. To [automatically manage retries](../iot/concepts-manage-device-reconnections.md#connection-and-retry), make sure you use the latest version of the [Azure IoT Hub SDKs](iot-hub-devguide-sdks.md). For more information about best practices for transient fault handling and retries, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).

If the problem persists, check [Resource Health](iot-hub-azure-service-health-integration.md#check-iot-hub-health-with-azure-resource-health) and [Azure Status](https://azure.status.microsoft/) to see if IoT Hub has a known problem. You can also use the [manual failover feature](tutorial-manual-failover.md).

If there are no known problems and the issue continues, [contact support](https://azure.microsoft.com/support/options/) for further investigation.

## 503003 Partition not found

You might see that requests to IoT Hub fail with the error **503003 PartitionNotFound**.

This error is internal to IoT Hub and is likely transient. For more information, see [500xxx Internal errors](#500xxx-internal-errors).

To resolve this error, see [500xxx Internal errors](#500xxx-internal-errors).

## 504101 Gateway time-out

When trying to invoke a direct method from IoT Hub to a device, you might see that the request fails with the error **504101 GatewayTimeout**.

This error occurs because IoT Hub encountered an error and couldn't confirm if the direct method completed before timing out. Or, when using an earlier version of the Azure IoT C# SDK (<1.19.0), the AMQP link between the device and IoT Hub can be dropped silently because of a bug.

To resolve this error, issue a retry or upgrade to the latest version of the Azure IOT C# SDK.
