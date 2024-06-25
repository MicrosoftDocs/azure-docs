---
title: Monitor Azure IoT Hub
description: Start here to learn how to monitor Azure IoT Hub by using Azure Monitor. Learn about the types of monitoring data you can collect and ways to analyze that data.
ms.date: 06/26/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: conceptual
author: kgremban
ms.author: kgremban
ms.service: iot-hub
---

<!-- 
According to the Content Pattern guidelines all comments must be removed before publication!!!
IMPORTANT 
To make this template easier to use, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- All sections are required unless otherwise noted. Add service-specific information after the includes.
Your service should have the following two articles:
1. The overview monitoring article (based on this template)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"
2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Monitor Azure IoT Hub

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Monitor overview

The **Overview** page in the Azure portal for each IoT hub includes charts that provide some usage metrics, such as the number of messages used and the number of devices connected to the IoT hub.

:::image type="content" source="media/monitor-iot-hub/overview-portal.png" alt-text="Default metric charts on IoT hub Overview page.":::

A correct message count value might be delayed by 1 minute. Due to the IoT Hub service infrastructure, the value can sometimes bounce between higher and lower values on refresh. This counter should be incorrect only for values accrued over the last minute.

The information presented on the **Overview pane** is useful, but represents only a small amount of monitoring data that's available for an IoT hub. Some monitoring data is collected automatically and available for analysis as soon as you create your IoT hub. You can enable other types of data collection with some configuration.

> [!IMPORTANT]
> The events emitted by the IoT Hub service using Azure Monitor resource logs aren't guaranteed to be reliable or ordered. Some events might be lost or delivered out of order. Resource logs aren't intended to be real-time, so it may take several minutes for events to be logged to your choice of destination.

## Monitor per-device disconnects with Event Grid

Azure Monitor provides a metric, *Connected devices*, that you can use to monitor the number of devices connected to your IoT Hub. This metric triggers an alert when the number of connected devices drops below a threshold value. Azure Monitor also emits events in the [connections category](monitor-iot-hub-reference.md#connections) that you can use to monitor device connects, disconnects, and connection errors. While these events might be sufficient for some scenarios, [Azure Event Grid](../event-grid/index.yml) provides a low-latency, per-device monitoring solution that you can use to track device connections for critical devices and infrastructure.

With Event Grid, you can subscribe to the IoT Hub [**DeviceConnected** and **DeviceDisconnected** events](iot-hub-event-grid.md#event-types) to trigger alerts and monitor device connection state. Event Grid provides a much lower event latency than Azure Monitor, so you can monitor on a per-device basis rather than for all connected devices. These factors make Event Grid the preferred method for monitoring connections for critical devices and infrastructure. We highly recommend using Event Grid to monitor device connections in production environments.

For more information about monitoring device connectivity with Event Grid and Azure Monitor, see [Monitor, diagnose, and troubleshoot device connectivity to Azure IoT Hub](iot-hub-troubleshoot-connectivity.md).

## Collection and routing

Platform metrics, the Activity log, and resource logs have unique collection, storage, and routing specifications.

- Platform metrics and the Activity log are collected and stored automatically, but can be routed to other locations by using a diagnostic setting.

- Resource logs aren't collected and stored until you create a diagnostic setting and route them to one or more locations.

- Metrics and logs can be routed to several locations including:
  - The Azure Monitor Logs store via an associated Log Analytics workspace. There they can be analyzed using Log Analytics.
  - Azure Storage for archiving and offline analysis 
  - An Event Hubs endpoint where external applications can read them, for example, partner security information and event management (SIEM) tools.

In the Azure portal from your IoT hub under **Monitoring**, you can select **Diagnostic settings** followed by **Add diagnostic setting** to create diagnostic settings scoped to the logs and platform metrics emitted by your IoT hub.

:::image type="content" source="media/monitor-iot-hub/add-diagnostic-setting.png" alt-text="Screenshot showing how to add a diagnostic setting in your IoT hub in the Azure portal." border="true":::

The following screenshot shows a diagnostic setting for routing the resource log type *Connection Operations* and all platform metrics to a Log Analytics workspace.

:::image type="content" source="media/monitor-iot-hub/diagnostic-setting-portal.png" alt-text="Screenshot of the Diagnostic Settings form for monitoring an IoT hub." lightbox="media/monitor-iot-hub/diagnostic-setting-portal.png":::

For more information on creating a diagnostic setting using the Azure portal, CLI, or PowerShell, see [Create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md). When you create a diagnostic setting, you specify which categories of logs to collect. The categories for Azure IoT Hub are listed  under [Resource logs in the Monitoring Azure IoT Hub data reference](monitor-iot-hub-reference.md#resource-logs). Events are emitted only for errors in some categories.

When routing IoT Hub platform metrics to other locations:

- These platform metrics aren't exportable via diagnostic settings: *Connected devices* and *Total devices*.

- Multi-dimensional metrics, for example some [routing metrics](monitor-iot-hub-reference.md#routing-metrics), are currently exported as flattened single dimensional metrics aggregated across dimension values. For more information, see [Exporting platform metrics to other locations](../azure-monitor/essentials/metrics-supported.md#exporting-platform-metrics-to-other-locations).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for IoT Hub, see [Azure IoT Hub monitoring data reference](monitor-iot-hub-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

You can analyze metrics for Azure IoT Hub with metrics from other Azure services using metrics explorer. For more information on this tool, see [Analyze metrics with Azure Monitor metrics explorer](../azure-monitor/essentials/analyze-metrics.md).

To open metrics explorer, go to the Azure portal and open your IoT hub, then select **Metrics** under **Monitoring**. This explorer is scoped, by default, to the platform metrics emitted by your IoT hub.

:::image type="content" source="media/monitor-iot-hub/metrics-portal.png" alt-text="Screenshot showing the metrics explorer page for an IoT hub." lightbox="media/monitor-iot-hub/metrics-portal.png":::

For a list of the platform metrics collected for Azure IoT Hub, see [Metrics in the Monitoring Azure IoT Hub data reference](monitor-iot-hub-reference.md#metrics). For a list of the platform metrics collected for all Azure services, see [Supported metrics with Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

For IoT Hub platform metrics that are collected in units of count, some aggregations might not be available or usable. To learn more, see [Supported aggregations in the Monitoring Azure IoT Hub data reference](monitor-iot-hub-reference.md#supported-aggregations).

Some IoT Hub metrics, like [routing metrics](monitor-iot-hub-reference.md#routing-metrics), are multi-dimensional. For these metrics, you can apply [filters](../azure-monitor/essentials/metrics-charts.md#filters) and [splitting](../azure-monitor/essentials/metrics-charts.md#apply-splitting) to your charts based on a dimension.

For a list of available metrics for IoT Hub, see [Azure IoT Hub monitoring data reference](monitor-iot-hub-reference.md#metrics).


<!-- ## OPTIONAL [TODO-replace-with-service-name] metrics
If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

<!-- ## Azure Monitor resource logs -->

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

### Analyzing logs

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties. The data in these tables are associated with a Log Analytics workspace and can be queried in Log Analytics. To learn more about Azure Monitor Logs, see [Azure Monitor Logs overview](../azure-monitor/logs/data-platform-logs.md) in the Azure Monitor documentation. 

To route data to Azure Monitor Logs, you must create a diagnostic setting to send resource logs or platform metrics to a Log Analytics workspace. To learn more, see [Collection and routing](#collection-and-routing).

To perform Log Analytics, go to the Azure portal and open your IoT hub, then select **Logs** under **Monitoring**. These Log Analytics queries are scoped, by default, to the logs and metrics collected in Azure Monitor Logs for your IoT hub.

:::image type="content" source="media/monitor-iot-hub/logs-portal.png" alt-text="Logs page for an IoT hub." lightbox="media/monitor-iot-hub/logs-portal.png":::

For a list of the tables used by Azure Monitor Logs and queryable by Log Analytics, see [Azure Monitor Logs tables in the Monitoring Azure IoT Hub data reference](monitor-iot-hub-reference.md#azure-monitor-logs-tables).

All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema). You can find the schema and categories of resource logs collected for Azure IoT Hub in [Resource logs in the Monitoring Azure IoT Hub data reference](monitor-iot-hub-reference.md#resource-logs). Events are emitted only for errors in some categories.

The [Activity log](../azure-monitor/essentials/activity-log.md) is a platform login Azure that provides insight into subscription-level events. You can view it independently or route it to Azure Monitor Logs, where you can do more complex queries using Log Analytics.  

When routing IoT Hub platform metrics to Azure Monitor Logs:

- The following platform metrics aren't exportable via diagnostic settings: *Connected devices* and *Total devices*.

- Multi-dimensional metrics, for example some [routing metrics](monitor-iot-hub-reference.md#routing-metrics), are currently exported as flattened single dimensional metrics aggregated across dimension values. For more detail, see [Exporting platform metrics to other locations](../azure-monitor/essentials/metrics-supported.md#exporting-platform-metrics-to-other-locations).

For common queries with IoT Hub, see [Sample Kusto queries](#sample-kusto-queries). For more information on using Log Analytics queries, see [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

### SDK version in IoT Hub logs

Some operations in IoT Hub resource logs return an `sdkVersion` property in their `properties` object. For these operations, when a device or backend app is using one of the Azure IoT SDKs, this property contains information about the SDK being used, the SDK version, and the platform on which the SDK is running. 

The following examples show the `sdkVersion` property emitted for a [`deviceConnect`](monitor-iot-hub-reference.md#connections) operation using:

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

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Sample Kusto queries

Use the following [Kusto](/azure/data-explorer/kusto/query/) queries to help you monitor your IoT hub.

> [!IMPORTANT]
> Selecting **Logs** from the **IoT Hub** menu opens **Log Analytics** and includes data solely from your IoT hub resource. For queries that include data from other IoT hubs or Azure services, select **Logs** from the [**Azure Monitor** menu](https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/logs). For more information, see [Log query scope and time range in Azure Monitor Log Analytics](../azure-monitor/logs/scope.md).

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

<!-- ## Alerts -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### IoT Hub alert rules

The following table lists some suggested alert rules for IoT Hub. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [IoT Hub monitoring data reference](monitor-iot-hub-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| | | |
| | | |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure IoT Hub monitoring data reference](monitor-iot-hub-reference.md) for a reference of the metrics, logs, and other important values created for IoT Hub.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
- See [Monitor, diagnose, and troubleshoot device connectivity to Azure IoT Hub](iot-hub-troubleshoot-connectivity.md)for monitoring device connectivity.
