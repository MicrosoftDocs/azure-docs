---
title: Monitor the health of your Azure IoT Hub | Microsoft Docs
description: Use Azure Monitor and Azure Resource Health to monitor your IoT Hub and diagnose problems quickly
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/21/2020
ms.author: robinsh
ms.custom: amqp
---
# Monitor the health of Azure IoT Hub and diagnose problems quickly

Businesses that implement Azure IoT Hub expect reliable performance from their resources. To help you maintain a close watch on your operations, IoT Hub is fully integrated with [Azure Monitor](../azure-monitor/index.yml) and [Azure Resource Health](../service-health/resource-health-overview.md). These two services work to provide you with the data you need to keep your IoT solutions up and running in a healthy state.

Azure Monitor is a single source of monitoring and logging for all your Azure services. You can send the diagnostic logs that Azure Monitor generates to Azure Monitor logs, Event Hubs, or Azure Storage for custom processing. Azure Monitor's metrics and diagnostics settings give you visibility into the performance of your resources. Continue reading this article to learn how to [Use Azure Monitor](#use-azure-monitor) with your IoT hub. 

> [!IMPORTANT]
> The events emitted by the IoT Hub service using Azure Monitor diagnostic logs are not guaranteed to be reliable or ordered. Some events might be lost or delivered out of order. Diagnostic logs also aren't meant to be real-time, and it may take several minutes for events to be logged to your choice of destination.

Azure Resource Health helps you diagnose and get support when an Azure issue impacts your resources. A dashboard provides current and past health status for each of your IoT hubs. Continue to the section at the bottom of this article to learn how to [Use Azure Resource Health](#use-azure-resource-health) with your IoT hub. 

IoT Hub also provides its own metrics that you can use to understand the state of your IoT resources. To learn more, see [Understand IoT Hub metrics](iot-hub-metrics.md).

## Use Azure Monitor

Azure Monitor provides diagnostics information for Azure resources, which means that you can monitor operations that take place within your IoT hub.

To learn more about the specific metrics and events that Azure Monitor watches, see [Supported metrics with Azure Monitor](../azure-monitor/platform/metrics-supported.md) and [Supported services, schemas, and categories for Azure Diagnostic Logs](../azure-monitor/platform/diagnostic-logs-schema.md).

[!INCLUDE [iot-hub-diagnostics-settings](../../includes/iot-hub-diagnostics-settings.md)]

### Understand the logs

Azure Monitor tracks different operations that occur in IoT Hub. Each category has a schema that defines how events in that category are reported.

#### Connections

The connections category tracks device connect and disconnect events from an IoT hub as well as errors. This category is useful for identifying unauthorized connection attempts and or alerting when you lose connection to devices.

> [!NOTE]
> For reliable connection status of devices check [Device heartbeat](iot-hub-devguide-identity-registry.md#device-heartbeat).

```json
{
   "records":
   [
        {
            "time": " UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "deviceConnect",
            "category": "Connections",
            "level": "Information",
            "properties": "{\"deviceId\":\"<deviceId>\",\"protocol\":\"<protocol>\",\"authType\":\"{\\\"scope\\\":\\\"device\\\",\\\"type\\\":\\\"sas\\\",\\\"issuer\\\":\\\"iothub\\\",\\\"acceptingIpFilterRule\\\":null}\",\"maskedIpAddress\":\"<maskedIpAddress>\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Cloud-to-device commands

The cloud-to-device commands category tracks errors that occur at the IoT hub and are related to the cloud-to-device message pipeline. This category includes errors that occur from:

* Sending cloud-to-device messages (like unauthorized sender errors),
* Receiving cloud-to-device messages (like delivery count exceeded errors), and
* Receiving cloud-to-device message feedback (like feedback expired errors).

This category does not catch errors when the cloud-to-device message is delivered successfully but then improperly handled by the device.

```json
{
    "records":
    [
        {
            "time": " UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "messageExpired",
            "category": "C2DCommands",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "properties": "{\"deviceId\":\"<deviceId>\",\"messageId\":\"<messageId>\",\"messageSizeInBytes\":\"<messageSize>\",\"protocol\":\"Amqp\",\"deliveryAcknowledgement\":\"<None, NegativeOnly, PositiveOnly, Full>\",\"deliveryCount\":\"0\",\"expiryTime\":\"<timestamp>\",\"timeInSystem\":\"<timeInSystem>\",\"ttl\":<ttl>, \"EventProcessedUtcTime\":\"<UTC timestamp>\",\"EventEnqueuedUtcTime\":\"<UTC timestamp>\", \"maskedIpAddress\": \"<maskedIpAddress>\", \"statusCode\": \"4XX\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Device identity operations

The device identity operations category tracks errors that occur when you attempt to create, update, or delete an entry in your IoT hub's identity registry. Tracking this category is useful for provisioning scenarios.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "get",
            "category": "DeviceIdentityOperations",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "properties": "{\"maskedIpAddress\":\"<maskedIpAddress>\",\"deviceId\":\"<deviceId>\", \"statusCode\":\"4XX\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Routes

The [message routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c) category tracks errors that occur during message route evaluation and endpoint health as perceived by IoT Hub. This category includes events such as:

* A rule evaluates to "undefined",
* IoT Hub marks an endpoint as dead, or
* Any errors received from an endpoint.

This category does not include specific errors about the messages themselves (like device throttling errors), which are reported under the "device telemetry" category.

```json
{
    "records":
    [
        {
            "time":"2019-12-12T03:25:14Z",
            "resourceId":"/SUBSCRIPTIONS/91R34780-3DEC-123A-BE2A-213B5500DFF0/RESOURCEGROUPS/ANON-TEST/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/ANONHUB1",
            "operationName":"endpointUnhealthy",
            "category":"Routes",
            "level":"Error",
            "resultType":"403004",
            "resultDescription":"DeviceMaximumQueueDepthExceeded",
            "properties":"{\"deviceId\":null,\"endpointName\":\"anon-sb-1\",\"messageId\":null,\"details\":\"DeviceMaximumQueueDepthExceeded\",\"routeName\":null,\"statusCode\":\"403\"}",
            "location":"westus"
        }
    ]
}
```

Here are more details on routing diagnostic logs:

* [List of routing diagnostic log error codes](troubleshoot-message-routing.md#diagnostics-error-codes)
* [List of routing diagnostic logs operationNames](troubleshoot-message-routing.md#diagnostics-operation-names)

#### Device telemetry

The device telemetry category tracks errors that occur at the IoT hub and are related to the telemetry pipeline. This category includes errors that occur when sending telemetry events (such as throttling) and receiving telemetry events (such as unauthorized reader). This category cannot catch errors caused by code running on the device itself.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "ingress",
            "category": "DeviceTelemetry",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "properties": "{\"deviceId\":\"<deviceId>\",\"batching\":\"0\",\"messageSizeInBytes\":\"<messageSizeInBytes>\",\"EventProcessedUtcTime\":\"<UTC timestamp>\",\"EventEnqueuedUtcTime\":\"<UTC timestamp>\",\"partitionId\":\"1\"}", 
            "location": "Resource location"
        }
    ]
}
```

#### File upload operations

The file upload category tracks errors that occur at the IoT hub and are related to file upload functionality. This category includes:

* Errors that occur with the SAS URI, such as when it expires before a device notifies the hub of a completed upload.

* Failed uploads reported by the device.

* Errors that occur when a file is not found in storage during IoT Hub notification message creation.

This category cannot catch errors that directly occur while the device is uploading a file to storage.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "ingress",
            "category": "FileUploadOperations",
            "level": "Error",
            "resultType": "Event status",
            "resultDescription": "MessageDescription",
            "durationMs": "1",
            "properties": "{\"deviceId\":\"<deviceId>\",\"protocol\":\"<protocol>\",\"authType\":\"{\\\"scope\\\":\\\"device\\\",\\\"type\\\":\\\"sas\\\",\\\"issuer\\\":\\\"iothub\\\",\\\"acceptingIpFilterRule\\\":null}\",\"blobUri\":\"http//bloburi.com\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Cloud-to-device twin operations

The cloud-to-device twin operations category tracks service-initiated events on device twins. These operations can include get twin, update or replace tags, and update or replace desired properties.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "read",
            "category": "C2DTwinOperations",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"deviceId\":\"<deviceId>\",\"sdkVersion\":\"<sdkVersion>\",\"messageSize\":\"<messageSize>\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Device-to-cloud twin operations

The device-to-cloud twin operations category tracks device-initiated events on device twins. These operations can include get twin, update reported properties, and subscribe to desired properties.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "update",
            "category": "D2CTwinOperations",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"deviceId\":\"<deviceId>\",\"protocol\":\"<protocol>\",\"authenticationType\":\"{\\\"scope\\\":\\\"device\\\",\\\"type\\\":\\\"sas\\\",\\\"issuer\\\":\\\"iothub\\\",\\\"acceptingIpFilterRule\\\":null}\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Twin queries

The twin queries category reports on query requests for device twins that are initiated in the cloud.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "query",
            "category": "TwinQueries",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"query\":\"<twin query>\",\"sdkVersion\":\"<sdkVersion>\",\"messageSize\":\"<messageSize>\",\"pageSize\":\"<pageSize>\", \"continuation\":\"<true, false>\", \"resultSize\":\"<resultSize>\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Jobs operations

The jobs operations category reports on job requests to update device twins or invoke direct methods on multiple devices. These requests are initiated in the cloud.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "jobCompleted",
            "category": "JobsOperations",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"jobId\":\"<jobId>\", \"sdkVersion\": \"<sdkVersion>\",\"messageSize\": <messageSize>,\"filter\":\"DeviceId IN ['1414ded9-b445-414d-89b9-e48e8c6285d5']\",\"startTimeUtc\":\"Wednesday, September 13, 2017\",\"duration\":\"0\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Direct Methods

The direct methods category tracks request-response interactions sent to individual devices. These requests are initiated in the cloud.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "send",
            "category": "DirectMethods",
            "level": "Information",
            "durationMs": "1",
            "properties": "{\"deviceId\":<messageSize>, \"RequestSize\": 1, \"ResponseSize\": 1, \"sdkVersion\": \"2017-07-11\"}",
            "location": "Resource location"
        }
    ]
}
```

#### Distributed Tracing (Preview)

The distributed tracing category tracks the correlation IDs for messages that carry the trace context header. To fully enable these logs, client-side code must be updated by following [Analyze and diagnose IoT applications end-to-end with IoT Hub distributed tracing (preview)](iot-hub-distributed-tracing.md).

Note that `correlationId` conforms to the [W3C Trace Context](https://github.com/w3c/trace-context) proposal, where it contains a `trace-id` as well as a `span-id`.

##### IoT Hub D2C (device-to-cloud) logs

IoT Hub records this log when a message containing valid trace properties arrives at IoT Hub.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "DiagnosticIoTHubD2C",
            "category": "DistributedTracing",
            "correlationId": "00-8cd869a412459a25f5b4f31311223344-0144d2590aacd909-01",
            "level": "Information",
            "resultType": "Success",
            "resultDescription":"Receive message success",
            "durationMs": "",
            "properties": "{\"messageSize\": 1, \"deviceId\":\"<deviceId>\", \"callerLocalTimeUtc\": : \"2017-02-22T03:27:28.633Z\", \"calleeLocalTimeUtc\": \"2017-02-22T03:27:28.687Z\"}",
            "location": "Resource location"
        }
    ]
}
```

Here, `durationMs` is not calculated as IoT Hub's clock might not be in sync with the device clock, and thus a duration calculation can be misleading. We recommend writing logic using the timestamps in the `properties` section to capture spikes in device-to-cloud latency.

| Property | Type | Description |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------|
| **messageSize** | Integer | The size of device-to-cloud message in bytes |
| **deviceId** | String of ASCII 7-bit alphanumeric characters | The identity of the device |
| **callerLocalTimeUtc** | UTC timestamp | The creation time of the message as reported by the device local clock |
| **calleeLocalTimeUtc** | UTC timestamp | The time of message arrival at the IoT Hub's gateway as reported by IoT Hub service side clock |

##### IoT Hub ingress logs

IoT Hub records this log when message containing valid trace properties writes to internal or built-in Event Hub.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "DiagnosticIoTHubIngress",
            "category": "DistributedTracing",
            "correlationId": "00-8cd869a412459a25f5b4f31311223344-349810a9bbd28730-01",
            "level": "Information",
            "resultType": "Success",
            "resultDescription":"Ingress message success",
            "durationMs": "10",
            "properties": "{\"isRoutingEnabled\": \"true\", \"parentSpanId\":\"0144d2590aacd909\"}",
            "location": "Resource location"
        }
    ]
}
```

In the `properties` section, this log contains additional information about message ingress.

| Property | Type | Description |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------|
| **isRoutingEnabled** | String | Either true or false, indicates whether or not message routing is enabled in the IoT Hub |
| **parentSpanId** | String | The [span-id](https://w3c.github.io/trace-context/#parent-id) of the parent message, which would be the D2C message trace in this case |

##### IoT Hub egress logs

IoT Hub records this log when [routing](iot-hub-devguide-messages-d2c.md) is enabled and the message is written to an [endpoint](iot-hub-devguide-endpoints.md). If routing is not enabled, IoT Hub doesn't record this log.

```json
{
    "records":
    [
        {
            "time": "UTC timestamp",
            "resourceId": "Resource Id",
            "operationName": "DiagnosticIoTHubEgress",
            "category": "DistributedTracing",
            "correlationId": "00-8cd869a412459a25f5b4f31311223344-98ac3578922acd26-01",
            "level": "Information",
            "resultType": "Success",
            "resultDescription":"Egress message success",
            "durationMs": "10",
            "properties": "{\"endpointType\": \"EventHub\", \"endpointName\": \"myEventHub\", \"parentSpanId\":\"349810a9bbd28730\"}",
            "location": "Resource location"
        }
    ]
}
```

In the `properties` section, this log contains additional information about message ingress.

| Property | Type | Description |
|--------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------|
| **endpointName** | String | The name of the routing endpoint |
| **endpointType** | String | The type of the routing endpoint |
| **parentSpanId** | String | The [span-id](https://w3c.github.io/trace-context/#parent-id) of the parent message, which would be the IoT Hub ingress message trace in this case |

#### Configurations

IoT Hub configuration logs tracks events and error for the Automatic Device Management feature set.

```json
{
    "records":
    [
         {
             "time": "2019-09-24T17:21:52Z",
             "resourceId": "Resource Id",
             "operationName": "ReadManyConfigurations",
             "category": "Configurations",
             "resultType": "",
             "resultDescription": "",
             "level": "Information",
             "durationMs": "17",
             "properties": "{\"configurationId\":\"\",\"sdkVersion\":\"2018-06-30\",\"messageSize\":\"0\",\"statusCode\":null}",
             "location": "southcentralus"
         }
    ]
}
```

### Device Streams (Preview)

The device streams category tracks request-response interactions sent to individual devices.

```json
{
    "records":
    [
         {
             "time": "2019-09-19T11:12:04Z",
             "resourceId": "Resource Id",
             "operationName": "invoke",
             "category": "DeviceStreams",
             "resultType": "",
             "resultDescription": "",    
             "level": "Information",
             "durationMs": "74",
             "properties": "{\"deviceId\":\"myDevice\",\"moduleId\":\"myModule\",\"sdkVersion\":\"2019-05-01-preview\",\"requestSize\":\"3\",\"responseSize\":\"5\",\"statusCode\":null,\"requestName\":\"myRequest\",\"direction\":\"c2d\"}",
             "location": "Central US"
         }
    ]
}
```

### Read logs from Azure Event Hubs

After you set up event logging through diagnostics settings, you can create applications that read out the logs so that you can take action based on the information in them. This sample code retrieves logs from an event hub:

```csharp
class Program
{ 
    static string connectionString = "{your AMS eventhub endpoint connection string}";
    static string monitoringEndpointName = "{your AMS event hub endpoint name}";
    static EventHubClient eventHubClient;
    //This is the Diagnostic Settings schema
    class AzureMonitorDiagnosticLog
    {
        string time { get; set; }
        string resourceId { get; set; }
        string operationName { get; set; }
        string category { get; set; }
        string level { get; set; }
        string resultType { get; set; }
        string resultDescription { get; set; }
        string durationMs { get; set; }
        string callerIpAddress { get; set; }
        string correlationId { get; set; }
        string identity { get; set; }
        string location { get; set; }
        Dictionary<string, string> properties { get; set; }
    };

    static void Main(string[] args)
    {
        Console.WriteLine("Monitoring. Press Enter key to exit.\n");
        eventHubClient = EventHubClient.CreateFromConnectionString(connectionString, monitoringEndpointName);
        var d2cPartitions = eventHubClient.GetRuntimeInformationAsync().PartitionIds;
        CancellationTokenSource cts = new CancellationTokenSource();
        var tasks = new List<Task>();
        foreach (string partition in d2cPartitions)
        {
            tasks.Add(ReceiveMessagesFromDeviceAsync(partition, cts.Token));
        }
        Console.ReadLine();
        Console.WriteLine("Exiting...");
        cts.Cancel();
        Task.WaitAll(tasks.ToArray());
    }

    private static async Task ReceiveMessagesFromDeviceAsync(string partition, CancellationToken ct)
    {
        var eventHubReceiver = eventHubClient.GetDefaultConsumerGroup().CreateReceiver(partition, DateTime.UtcNow);
        while (true)
        {
            if (ct.IsCancellationRequested)
            {
                await eventHubReceiver.CloseAsync();
                break;
            }
            EventData eventData = await eventHubReceiver.ReceiveAsync(new TimeSpan(0,0,10));
            if (eventData != null)
            {
                string data = Encoding.UTF8.GetString(eventData.GetBytes());
                Console.WriteLine("Message received. Partition: {0} Data: '{1}'", partition, data);
                var deserializer = new JavaScriptSerializer();
                //deserialize json data to azure monitor object
                AzureMonitorDiagnosticLog message = new JavaScriptSerializer().Deserialize<AzureMonitorDiagnosticLog>(result);
            }
        }
    }
}
```

## Use Azure Resource Health

Use Azure Resource Health to monitor whether your IoT hub is up and running. You can also learn whether a regional outage is impacting the health of your IoT hub. To understand specific details about the health state of your Azure IoT Hub, we recommend that you [Use Azure Monitor](#use-azure-monitor).

Azure IoT Hub indicates health at a regional level. If a regional outage impacts your IoT hub, the health status shows as **Unknown**. To learn more, see [Resource types and health checks in Azure resource health](../service-health/resource-health-checks-resource-types.md).

To check the health of your IoT hubs, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to **Service Health** > **Resource health**.

3. From the drop-down boxes, select your subscription then select **IoT Hub** as the resource type.

To learn more about how to interpret health data, see [Azure resource health overview](../service-health/resource-health-overview.md).

## Next steps

* [Understand IoT Hub metrics](iot-hub-metrics.md)
* [IoT remote monitoring and notifications with Azure Logic Apps connecting your IoT hub and mailbox](iot-hub-monitoring-notifications-with-azure-logic-apps.md)
