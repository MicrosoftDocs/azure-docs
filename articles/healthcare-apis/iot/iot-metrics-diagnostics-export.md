---
title: Configure the MedTech service Diagnostic settings for metrics export - Azure Health Data Services
description: This article explains how to configure the MedTech service Diagnostic settings for metrics exporting.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 02/16/2022
ms.author: jasteppe
---

# Configure diagnostic setting for the MedTech service metrics exporting

In this article, you'll learn how to configure the diagnostic setting for MedTech service to export metrics to different destinations for audit, analysis, or backup.

## Create diagnostic setting for the MedTech service
1. To enable metrics export for the MedTech service, select **MedTech service** in your workspace.
 
   :::image type="content" source="media/iot-metrics-export/iot-connector-logging-workspace.png" alt-text="Screenshot of select the MedTech service within workspace." lightbox="media/iot-metrics-export/iot-connector-logging-workspace.png":::

2. Select the MedTech service that you want to configure metrics export for.
   
   :::image type="content" source="media/iot-metrics-export/iot-connector-logging-select-connector.png" alt-text="Screenshot of select the MedTech service for exporting metrics" lightbox="media/iot-metrics-export/iot-connector-logging-select-connector.png":::

3. Select the **Diagnostic settings** button and then select the **+ Add diagnostic setting** button.

   :::image type="content" source="media/iot-metrics-export/iot-connector-logging-select-diagnostic-settings.png" alt-text="Screenshot of select the Diagnostic settings and select the + Add diagnostic setting buttons." lightbox="media/iot-metrics-export/iot-connector-logging-select-diagnostic-settings.png"::: 

4. After the **+ Add diagnostic setting** page opens, enter a name in the **Diagnostic setting name** dialog box.   

    :::image type="content" source="media/iot-metrics-export/iot-connector-logging-select-diagnostic-configuration.png" alt-text="Screenshot diagnostic setting and required fields." lightbox="media/iot-metrics-export/iot-connector-logging-select-diagnostic-configuration.png"::: 

5. Under **Destination details**, select the destination you want to use to export your MedTech service metrics to. In the above example, we've selected an Azure storage account.

   Metrics can be exported to the following destinations:

   |Destination|Description|
   |-----------|-----------|
   |Log Analytics workspace|Metrics are converted to log form. This option may not be available for all resource types. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) helps you to integrate them into queries, alerts, and visualizations with existing log data.|
   |Azure storage account|Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive and logs can be kept there indefinitely.|
   |Event Hubs|Sending logs and metrics to Event Hubs allows you to stream data to external systems such as third-party SIEMs and other Log Analytics solutions.|
   |Azure Monitor partner integrations|Specialized integrations between Azure Monitor and other non-Microsoft monitoring platforms. Useful when you're already using one of the partners.|
   
   > [!Important]
   > Each **Destination details** selection requires that certain resources (for example, an existing Azure storage account) be created and available before the selection can be successfully configured. Choose each selection to get a list of the required resources.

6. Select **AllMetrics**.

   > [!Note]
   > To view a complete list of MedTech service metrics associated with **AllMetrics**, see [Supported metrics with Azure Monitor](../../azure-monitor/essentials/metrics-supported.md#microsofthealthcareapisworkspacesiotconnectors). 

7. Select **Save**.

   > [!Note] 
   > It might take up to 15 minutes for the first MedTech service metrics to display in the destination of your choice.  
 
For more information about how to work with diagnostics logs, see the [Azure Resource Log documentation](../../azure-monitor/essentials/platform-logs-overview.md).

## Conclusion 
Having access to metrics is essential for monitoring and troubleshooting.  MedTech service allows you to do these actions through the export of metrics. 

## Next steps

To view the frequently asked questions (FAQs) about the MedTech service, see

>[!div class="nextstepaction"]
>[MedTech service FAQs](iot-connector-faqs.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.