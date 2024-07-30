---
title: Monitor Azure IoT Hub
description: Start here to learn how to monitor Azure IoT Hub by using Azure Monitor. Learn about the types of monitoring data you can collect and ways to analyze that data.
ms.date: 07/30/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: conceptual
author: kgremban
ms.author: kgremban
ms.service: iot-hub
---

# Monitor Azure IoT Hub

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Monitor per-device disconnects with Event Grid

Azure Monitor provides a metric called *Connected devices* that you can use to monitor the number of devices connected to your IoT Hub. This metric triggers an alert when the number of connected devices drops below a threshold value. Azure Monitor also emits events in the [connections category](monitor-iot-hub-reference.md#connections-category) that you can use to monitor device connects, disconnects, and connection errors. While these events might be sufficient for some scenarios, [Azure Event Grid](../event-grid/index.yml) provides a low-latency, per-device monitoring solution that you can use to track device connections for critical devices and infrastructure.

With Event Grid, you can subscribe to the IoT Hub [**DeviceConnected** and **DeviceDisconnected** events](iot-hub-event-grid.md#event-types) to trigger alerts and monitor device connection state. Event Grid provides a much lower event latency than Azure Monitor, so you can monitor on a per-device basis rather than for all connected devices. These factors make Event Grid the preferred method for monitoring connections for critical devices and infrastructure. We highly recommend using Event Grid to monitor device connections in production environments.

For more information about monitoring device connectivity with Event Grid and Azure Monitor, see [Monitor, diagnose, and troubleshoot device connectivity to Azure IoT Hub](iot-hub-troubleshoot-connectivity.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for IoT Hub, see [Azure IoT Hub monitoring data reference](monitor-iot-hub-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

### Collection and routing

Platform metrics, the Activity log, and resource logs have unique collection, storage, and routing specifications.

In the Azure portal from your IoT hub under **Monitoring**, you can select **Diagnostic settings** followed by **Add diagnostic setting** to create diagnostic settings scoped to the logs and platform metrics emitted by your IoT hub.

:::image type="content" source="media/monitor-iot-hub/add-diagnostic-setting.png" alt-text="Screenshot showing how to add a diagnostic setting in your IoT hub in the Azure portal." border="true":::

The following screenshot shows a diagnostic setting for routing the resource log type *Connection Operations* and all platform metrics to a Log Analytics workspace.

:::image type="content" source="media/monitor-iot-hub/diagnostic-setting-portal.png" alt-text="Screenshot of the Diagnostic Settings form for monitoring an IoT hub." lightbox="media/monitor-iot-hub/diagnostic-setting-portal.png":::

When routing IoT Hub platform metrics to other locations:

- These platform metrics aren't exportable by using diagnostic settings: *Connected devices* and *Total devices*.

- Multi-dimensional metrics, for example some [routing metrics](monitor-iot-hub-reference.md#routing-metrics), are currently exported as flattened single dimensional metrics aggregated across dimension values. For more information, see [Exporting platform metrics to other locations](../azure-monitor/essentials/metrics-supported.md#exporting-platform-metrics-to-other-locations).

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

### Monitor overview

The **Overview** page in the Azure portal for each IoT hub includes charts that provide some usage metrics, such as the number of messages used and the number of devices connected to the IoT hub.

:::image type="content" source="media/monitor-iot-hub/overview-portal.png" alt-text="Default metric charts on IoT hub Overview page.":::

A correct message count value might be delayed by 1 minute. Due to the IoT Hub service infrastructure, the value can sometimes bounce between higher and lower values on refresh. This counter should be incorrect only for values accrued over the last minute.

The information presented on the **Overview pane** is useful, but represents only a small amount of monitoring data that's available for an IoT hub. Some monitoring data is collected automatically and available for analysis as soon as you create your IoT hub. You can enable other types of data collection with some configuration.

> [!IMPORTANT]
> The events emitted by the IoT Hub service using Azure Monitor resource logs aren't guaranteed to be reliable or ordered. Some events might be lost or delivered out of order. Resource logs aren't intended to be real-time, so it may take several minutes for events to be logged to your choice of destination.

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

### Route connection events to logs

IoT hub continuously emits resource logs for several categories of operations. To collect this log data, though, you need to create a diagnostic setting to route it to a destination where it can be analyzed or archived. One such destination is Azure Monitor Logs via a Log Analytics workspace ([see pricing](https://azure.microsoft.com/pricing/details/log-analytics/)), where you can analyze the data using Kusto queries.

The IoT Hub [resource logs connections category](monitor-iot-hub-reference.md#connections-category) emits operations and errors having to do with device connections. The following screenshot shows a diagnostic setting to route these logs to a Log Analytics workspace:

:::image type="content" source="media/iot-hub-troubleshoot-connectivity/create-diagnostic-setting.png" alt-text="Recommended setting to send connectivity logs to Log Analytics workspace.":::

We recommend creating a diagnostic setting as early as possible after you create your IoT hub, because, although IoT Hub always emits resource logs, Azure Monitor doesn't collect them until you route them to a destination.

To learn more about routing logs to a destination, see [Collection and routing](monitor-iot-hub.md#collection-and-routing). For detailed instructions to create a diagnostic setting, see the [Use metrics and logs tutorial](tutorial-use-metrics-and-diags.md).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

### Analyzing logs

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties. The data in these tables are associated with a Log Analytics workspace and can be queried in Log Analytics. To learn more about Azure Monitor Logs, see [Azure Monitor Logs overview](../azure-monitor/logs/data-platform-logs.md) in the Azure Monitor documentation.

To route data to Azure Monitor Logs, you must create a diagnostic setting to send resource logs or platform metrics to a Log Analytics workspace. To learn more, see [Collection and routing](#collection-and-routing).

To perform Log Analytics, go to the Azure portal and open your IoT hub, then select **Logs** under **Monitoring**. These Log Analytics queries are scoped, by default, to the logs and metrics collected in Azure Monitor Logs for your IoT hub.

:::image type="content" source="media/monitor-iot-hub/logs-portal.png" alt-text="Logs page for an IoT hub." lightbox="media/monitor-iot-hub/logs-portal.png":::

When routing IoT Hub platform metrics to Azure Monitor Logs:

- The following platform metrics aren't exportable by using diagnostic settings: *Connected devices* and *Total devices*.

- Multi-dimensional metrics, for example some [routing metrics](monitor-iot-hub-reference.md#routing-metrics), are currently exported as flattened single dimensional metrics aggregated across dimension values. For more detail, see [Exporting platform metrics to other locations](../azure-monitor/essentials/metrics-supported.md#exporting-platform-metrics-to-other-locations).

For common queries with IoT Hub, see [Sample Kusto queries](#sample-kusto-queries). For more information on using Log Analytics queries, see [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

### SDK version in IoT Hub logs

Some operations return an `sdkVersion` property in their `properties` object for the IoT Hub resource logs. For these operations, when a device or backend app is using one of the Azure IoT SDKs, this property contains information about the SDK being used, the SDK version, and the platform on which the SDK is running. 

The following examples show the `sdkVersion` property emitted for a [`deviceConnect`](monitor-iot-hub-reference.md#connections-category) operation using:

- The Node.js device SDK: `"azure-iot-device/1.17.1 (node v10.16.0; Windows_NT 10.0.18363; x64)"`
- The .NET (C#) SDK: `".NET/1.21.2 (.NET Framework 4.8.4200.0; Microsoft Windows 10.0.17763 WindowsProduct:0x00000004; X86)"`.

The following table shows the SDK name used for different Azure IoT SDKs:

| SDK name in sdkVersion property | Language |
|----------|----------|
| .NET | .NET (C#) |
| microsoft.azure.devices | .NET (C#) service SDK |
| microsoft.azure.devices.client | .NET (C#) device SDK |
| iothubclient | C or Python v1 (deprecated) device SDK |
| iothubserviceclient | C or Python v1 (deprecated) service SDK |
| azure-iot-device-iothub-py | Python device SDK |
| azure-iot-device | Node.js device SDK |
| azure-iothub | Node.js service SDK |
| com.microsoft.azure.iothub-java-client | Java device SDK |
| com.microsoft.azure.iothub.service.sdk | Java service SDK |
| com.microsoft.azure.sdk.iot.iot-device-client | Java device SDK |
| com.microsoft.azure.sdk.iot.iot-service-client | Java service SDK |
| C | Embedded C |
| C + (OSSimplified = Eclipse ThreadX) | Eclipse ThreadX |

You can extract the SDK version property when you perform queries against IoT Hub resource logs. For example, the following query extracts the SDK version property (and device ID) from the properties returned by Connections operations. These two properties are written to the results along with the time of the operation and the resource ID of the IoT hub that the device is connecting to.

```kusto
// SDK version of devices
// List of devices and their SDK versions that connect to IoT Hub
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
| where Category == "Connections"
| extend parsed_json = parse_json(properties_s) 
| extend SDKVersion = tostring(parsed_json.sdkVersion) , DeviceId = tostring(parsed_json.deviceId)
| distinct DeviceId, SDKVersion, TimeGenerated, _ResourceId
```

### Read logs from Azure Event Hubs

After you set up event logging through diagnostics settings, you can create applications that read out the logs so that you can take action based on the information in them. The following sample code retrieves logs from an event hub.

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

For the available resource log categories, their associated Log Analytics tables, and the log schemas for IoT Hub, see [Azure IoT Hub monitoring data reference](monitor-iot-hub-reference.md#resource-logs).

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

Use the following Kusto queries to help you monitor your IoT hub.

- **Connectivity Errors**: Identify device connection errors.

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where Category == "Connections" and Level == "Error"
    ```

- **Throttling Errors**: Identify devices that made the most requests resulting in throttling errors.

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where ResultType == "429001"
    | extend DeviceId = tostring(parse_json(properties_s).deviceId)
    | summarize count() by DeviceId, Category, _ResourceId
    | order by count_ desc
    ```

- **Dead Endpoints**: Identify dead or unhealthy endpoints by the number of times the issue was reported and know the reason why.

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where Category == "Routes" and OperationName in ("endpointDead", "endpointUnhealthy")
    | extend parsed_json = parse_json(properties_s)
    | extend Endpoint = tostring(parsed_json.endpointName), Reason = tostring(parsed_json.details) 
    | summarize count() by Endpoint, OperationName, Reason, _ResourceId
    | order by count_ desc
    ```

- **Error summary**: Count of errors across all operations by type.

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where Level == "Error"
    | summarize count() by ResultType, ResultDescription, Category, _ResourceId
    ```

- **Recently connected devices**: List of devices that IoT Hub saw connect in the specified time period.

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where Category == "Connections" and OperationName == "deviceConnect"
    | extend DeviceId = tostring(parse_json(properties_s).deviceId)
    | summarize max(TimeGenerated) by DeviceId, _ResourceId
    ```

- **Connection events for a specific device**: All connection events logged for a specific device (*test-device*).

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where Category == "Connections"
    | extend DeviceId = tostring(parse_json(properties_s).deviceId)
    | where DeviceId == "test-device"
    ```

- **SDK version of devices**: List of devices and their SDK versions for device connections or device to cloud twin operations.

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where Category == "Connections" or Category == "D2CTwinOperations"
    | extend parsed_json = parse_json(properties_s)
    | extend SDKVersion = tostring(parsed_json.sdkVersion) , DeviceId = tostring(parsed_json.deviceId)
    | distinct DeviceId, SDKVersion, TimeGenerated, _ResourceId
    ```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### IoT Hub alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [IoT Hub monitoring data reference](monitor-iot-hub-reference.md).

## Set up metric alerts for device disconnects

You can set up alerts based on the platform metrics emitted by IoT Hub. With metric alerts, you can notify individuals that a condition of interest occurred and also trigger actions that can respond to that condition automatically.

The [*Connected devices (preview)*](monitor-iot-hub-reference.md#device-metrics) metric tells you how many devices are connected to your IoT Hub. If this metric drops below a threshold value, an alert can trigger:

:::image type="content" source="media/iot-hub-troubleshoot-connectivity/configure-alert-logic.png" alt-text="Alert logic settings for connected devices metric.":::

You can use metric alert rules to monitor for device disconnect anomalies at-scale. That is, use alerts to determine when a significant number of devices unexpectedly disconnect. When this situation is detected, you can look at logs to help troubleshoot the issue. To monitor per-device disconnects and disconnects for critical devices in near real time, however, you must use Event Grid.

To learn more about alerts with IoT Hub, see [Alerts in Monitor IoT Hub](monitor-iot-hub.md#alerts). For a walk-through of creating alerts in IoT Hub, see the [Use metrics and logs tutorial](tutorial-use-metrics-and-diags.md). For a more detailed overview of alerts, see [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md) in the Azure Monitor documentation.


[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure IoT Hub monitoring data reference](monitor-iot-hub-reference.md) for a reference of the metrics, logs, and other important values created for IoT Hub.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
- See [Monitor, diagnose, and troubleshoot device connectivity to Azure IoT Hub](iot-hub-troubleshoot-connectivity.md) for monitoring device connectivity.
