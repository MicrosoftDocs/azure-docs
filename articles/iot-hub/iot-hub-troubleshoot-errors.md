---
title: Troubleshooting Azure IoT Hub errors
description: Understand how to troubleshoot errors for Azure IoT Hub 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 09/19/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I need to know how to find and resolve common errors that occur with IoT Hub.
---
# Troubleshoot Azure IoT Hub errors

This article provides information about how to find IoT Hub error codes. To analyze errors from the cloud side (as opposed to device side), you can use Azure Monitor diagnostic settings and Azure Monitor alerts to log errors that occur on your IoT hub. You can then examine the generated logs to get the underlying error codes. Once you have an error code, you can use the articles under Problem Resolution to understand what the possible causes of some common errors might be and how to mitigate them.

To learn about how to enable Azure Monitor diagnostic settings for IoT Hub, see [Use Azure Monitor](./iot-hub-monitor-resource-health.md#use-azure-monitor). For a tutorial about how to set up Azure monitor diagnostics and alerts, see [Set up and use metrics and diagnostic logs with an IoT hub](./tutorial-use-metrics-and-diags.md).

## Find error codes

When you turn on diagnostic logs and alerts for connected devices, you get alerts when errors occur. This section describes how to find the specific error that occurred when you receive an alert. The steps below assume you've set up Azure Monitor logs for your diagnostic logs.

1. Go your workspace for **Log Analytics** in the Azure portal.

2. Select **Log Search**.

3. Enter a query to search for the category of error you are interested in. For example, to isolate connectivity error logs for IoT Hub, enter the following query and then select **Run**:

    ```kusto
    search *
    | where ( Type == "AzureDiagnostics" and ResourceType == "IOTHUBS")
    | where ( Category == "Connections" and Level == "Error")
    ```

4. If there are results, look for `OperationName`, `ResultType` (error code), and `ResultDescription` (error message) to get more detail on the error.

   ![Example of error log](./media/iot-hub-troubleshoot-errors/diag-logs.png)

5. Use `ResultType` (error code) and `ResultDescription` (error message) to locate the error from the list of common errors under **Problem resolution** and learn about its cause and possible ways to resolve it.

## 401002 AuthenticationFailed

Symptom

### Cause

Either the authentication expired or the specified device isn't found.

### Resolution

The Resolution.

## 401003 IoTHubUnauthorized

Symptom

### Cause

IoT Hub couldn't authenticate the connection.

### Resolution

Make sure that the SAS or other security token you use isn't expired. [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically generate tokens without requiring special configuration.

## 403004 DeviceMaximumQueueDepthExceeded

The number of messages enqueued for the device exceeds the [queue limit (50)](./iot-hub-devguide-quotas-throttling.md#other-limits).

To resolve, enhance device side logic to process (complete, reject, or abandon) queued messages promptly, shorten the time to live, or consider sending fewer messages. See [C2D message time to live](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live).

## 403006  Number of active file upload requests exceeded limit

Symptom

### Cause

Each device client is limited to [10 concurrent file uploads](./iot-hub-devguide-quotas-throttling.md#other-limits).

### Resolution

[Verify the previous uploads are completed](./iot-hub-devguide-file-upload.md#notify-iot-hub-of-a-completed-file-upload)

To learn more about file uploads, see [Upload files with IoT Hub](./iot-hub-devguide-file-upload.md) and [Configure IoT Hub file uploads using the Azure portal](./iot-hub-configure-file-upload.md)

## 404001 DeviceNotFound

During a cloud-to-device (C2D) communication such as C2D message, twin update, or direct methods, the operation fails with error `404001 DeviceNotFound`.

### Cause

The operation failed because the device cannot be found by IoT Hub, either because it's not registered or not online.

### Resolution

Ensure the device is registered with IoT Hub by checking the list of devices. If not, register the device ID that you used. If the device is already registered, ensure that it's online by checking connectivity on the device.

## 404103 DeviceNotOnline

The device isn't reachable during the timeout period, or the device may have crashed or disconnected during a direct method request.

### Cause

The Cause.

### Resolution

The Resolution.

## 404104 DeviceConnectionClosedRemotely

Devices seem to disconnect randomly and logs 404104 DeviceConnectionClosedRemotely in IoT Hub diagnostic logs. Typically, this is also accompanied by a device connection event less than a minute later.

### Cause

The connection was closed by the device, but IoT Hub doesn't know why. Common causes include MQTT/AMQP timeout and internet connectivity loss.

### Resolution

Make sure the device can connect to IoT Hub by [testing the connection](tutorial-connectivity.md). If the connection is good, but the device disconnects intermittently, make sure to implement proper keep alive device logic for your choice of protocol (MQTT/AMPQ).

## 409002 LinkCreationConflict

Symptom

### Cause

A device has more than one connection. When a new connection request comes for a device, IoT Hub closes the previous one with this error.

### Resolution

In the most common case, a device detects a disconnect and tries to reestablish the connection, but IoT Hub still considers the device connected. IoT Hub closes the previous connection and logs this error. This error usually appears as a side effect of a different, transient issue, so look for other errors in the logs to troubleshoot further. Otherwise, make sure to issue a new connection request only if the connection drops.

## 429001 ThrottlingException

Symptom

### Cause

IoT Hub [throttling limits](./iot-hub-devguide-quotas-throttling.md) have been exceeded.

### Resolution

Check if you're hitting the throttling limit by comparing your *Telemetry message send attempts* metric against the limits specified above. You can also check the *Number of throttling errors* metric. For more information about these and other metrics available for IoT Hub, see [IoT Hub metrics and how to use them](./iot-hub-metrics.md#iot-hub-metrics-and-how-to-use-them).

IoT Hub returns 429 ThrottlingException only after the limit has been violated for too long a period. This done so that your messages aren't dropped if your IoT hub gets burst traffic. In the meantime, IoT Hub processes the messages at the operation throttle rate, which might be slow if there's too much traffic in the backlog. To learn more, see [IoT Hub traffic shaping](./iot-hub-devguide-quotas-throttling.md#traffic-shaping).

Consider [scaling up your IoT Hub](./iot-hub-scaling.md) if you're running into quota or throttling limits.

## 500xxx Internal errors

Symptom

### Cause

Some common 500xxx errors returned are:

* **5000001 ServerError**: IoT Hub ran into a server-side issue.

* **500008 GenericTimeout**: IoT Hub couldn't complete the connection request before timing out.

* **ServiceUnavailable (no error code)**:

* **InternalServerError (no error code)**: IoT Hub encountered an internal error.

There can be a number of causes for a 500xxx error response. In all cases, the issue is most likely transient. While the IoT Hub team works hard to maintain [the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/), small subsets of IoT Hub nodes can occasionally experience transient faults. When your device tries to connect to a node that's having issues, you receive this error.

### Resolution

To mitigate 500xxx errors, issue a retry from the device. To [automatically manage retries](./iot-hub-reliability-features-in-sdks.md#connection-and-retry), make sure you use the latest version of the [Azure IoT SDKs](./iot-hub-devguide-sdks.md). For best practice on transient fault handling and retries, see [Transient fault handling](https://docs.microsoft.com/azure/architecture/best-practices/transient-faults).  If the problem persists, check [Resource Health](./iot-hub-monitor-resource-health.md#use-azure-resource-health) and [Azure Status](https://azure.microsoft.com/status/history/) to see if IoT Hub has a known problem. You can also use the [manual failover feature](./tutorial-manual-failover.md). If there are no known problems and the issue continues, [contact support](https://azure.microsoft.com/support/options/) for further investigation.

## DeliveryCountExceeded (no error code)

Symptom

### Cause

A message was abandoned or the lock timed-out (transition between the Enqueued and Invisible states) too many times, exceeding the configured maxDeliveryCount value.

### Resolution

Find the device ID and delivery count values (properties column) and consider [changing the maxDeliveryCount configuration](./iot-hub-devguide-messages-c2d.md#cloud-to-device-configuration-options).

## MessageExpired (no error code)

Symptom

### Cause

The C2D message expired because the device hasn't processed the message in time. Typically this is because device was offline. 

### Resolution

To resolve, see [C2D message time to live](./iot-hub-devguide-messages-c2d.md#message-expiration-time-to-live).

## Unauthorized (no error code)

Symptom

### Cause

The Cause.

### Resolution

The Resolution.

## Other steps to try

If the previous steps didn't help, you can try:

* If you have access to the problematic devices, either physically or remotely (like SSH), follow the [device-side troubleshooting guide](https://github.com/Azure/azure-iot-sdk-node/wiki/Troubleshooting-Guide-Devices) to continue troubleshooting.

* Verify that your devices are **Enabled** in the Azure portal > your IoT hub > IoT devices.

* Get help from [Azure IoT Hub forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azureiothub), [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-iot-hub), or [Azure support](https://azure.microsoft.com/support/options/).

To help improve the documentation for everyone, leave a comment in the feedback section below if this guide didn't help you.

## Next steps

* To learn more about resolving transient issues, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).

* To learn more about Azure IoT SDK and managing retries, see [How to manage connectivity and reliable messaging using Azure IoT Hub device SDKs](iot-hub-reliability-features-in-sdks.md#connection-and-retry).

* [Diagnosing IoT Hub Issues](https://github.com/Azure/iothub-diagnostics)

* [Sending Messages to IoT Hubs](./iot-hub-devguide-messages-d2c.md)

* [Monitoring Device Connections in Real-Time with Event Grid](./iot-hub-event-grid.md)
