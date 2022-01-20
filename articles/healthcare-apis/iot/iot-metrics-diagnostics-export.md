---
title: Enable IoT connector diagnostics logging through Diagnostic settings - Azure Healthcare APIs
description: This article explains how to log IoT connector metrics through Diagnostic settings
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 1/19/2021
ms.author: jasteppe
---

# Enable IoT connector diagnostics logging through Diagnostic settings

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to enable IoT connector diagnostics logging.

## Enable diagnostics logging for IoT connector
1. To enable diagnostics logging for IoT connector, select **IoT connector** in your Workspace.
 
   :::image type="content" source="media/iot-metrics-export/iot-connector-logging-workspace.png" alt-text="Select IoT connector within Workspace" lightbox="media/iot-metrics-export/iot-connector-logging-workspace.png":::

2. Select the IoT connector that you want to enable diagnostics logging for.
   
   :::image type="content" source="media/iot-metrics-export/iot-connector-logging-select-connector.png" alt-text="Select IoT connector for enabling diagnostics logging" lightbox="media/iot-metrics-export/iot-connector-logging-select-connector.png":::

3. Select the **Diagnostic settings** button and then select the **+ Add diagnostic setting** button.

   :::image type="content" source="media/iot-metrics-export/iot-connector-logging-select-diagnostic-settings.png" alt-text="Select the Diagnostic settings and select the + Add diagnostic setting buttons." lightbox="media/iot-metrics-export/iot-connector-logging-select-diagnostic-settings.png"::: 

4. The **Diagnostic setting** page will open.  

    :::image type="content" source="media/iot-metrics-export/iot-connector-logging-select-diagnostic-configuration.png" alt-text="Provide a name for your logs, where you want the logs to be sent, ALLMetrics, and save" lightbox="media/iot-metrics-export/iot-connector-logging-select-diagnostic-configuration.png"::: 

5. Enter a display name in the **Diagnostic setting name** dialog box.

6. Under **Destination details**, select the method you want to use to access your diagnostics logs. In this example, we've selected an Azure storage account.

   Diagnostics logs can be sent to the following destinations:

   |Destination|Description|
   |-----------|-----------|
   |Log Analytics workspace|Metrics are converted to log form. This option may not be available for all resource types. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) helps you to integrate them into queries, alerts, and visualizations with existing log data.|
   |Azure storage account|Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive and logs can be kept there indefinitely.|
   |Event Hubs|Sending logs and metrics to Event Hubs allows you to stream data to external systems such as third-party SIEMs and other Log Analytics solutions.|
   |Azure Monitor partner integrations|Specialized integrations between Azure Monitor and other non-Microsoft monitoring platforms. Useful when you're already using one of the partners.|
   
> [!Important]
> Each **Destination details** selection requires that certain resources (for example: an existing storage account) be created and available before the selection can be successfully configured. Click each selection to get a list of the required resources.

7. Select **AllMetrics**

> [!Note]
> **AllMetrics** contains the following IoT connector metrics:
> * TotalErrors
> * DeviceEvent
> * NormalizedEvent
> * Measurement
> * MeasurementGroup
> * DeviceEventProcessingLatencyMs (Ms = millisecond)
> * MeasurementIngestionLatencyMs (Ms = millisecond)

8. Select **Save**

> [!Note] 
> It might take up to 15 minutes for the first diagnostics logs to display in the destination of your choice.  
 
For more information about how to work with diagnostics logs, see the [Azure Resource Log documentation](../../azure-monitor/essentials/platform-logs-overview.md)

## Conclusion 
Having access to diagnostics logs is essential for monitoring and troubleshooting.  IoT connector allows you to do these actions through diagnostics logging. 

## Next steps

Check out frequently asked questions (FAQs) about IoT connector.

>[!div class="nextstepaction"]
>[IoT connector FAQs](iot-connector-faqs.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.
