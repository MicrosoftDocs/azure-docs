---
title: How to configure the MedTech service diagnostic settings for metrics export - Azure Health Data Services
description: This article explains how to configure the MedTech service diagnostic settings for metrics exporting.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 08/15/2022
ms.author: jasteppe
---

# How to configure diagnostic settings for exporting the MedTech service metrics 

In this article, you'll learn how to configure the diagnostic settings for the MedTech service to export metrics to different destinations (for example: to [Azure storage](/azure/storage/) or an [Azure Event Hubs Namespace event hub](/azure/event-hubs/)) for audit, analysis, or backup.

## Create diagnostic setting for the MedTech service
1. To enable metrics export for your MedTech service, select **MedTech service** in your workspace under **Services**.
 
   :::image type="content" source="media/iot-metrics-export/iot-select-medtech-service-in-workspace.png" alt-text="Screenshot of select the MedTech service within workspace." lightbox="media/iot-metrics-export/iot-select-medtech-service-in-workspace.png":::

2. Select the MedTech service that you want to configure for metrics exporting. For this example, we'll be using a MedTech service named **mt-azuredocsdemo**. You'll be selecting a MedTech service named by you within your Azure Health Data Services workspace.
   
   :::image type="content" source="media/iot-metrics-export/iot-select-medtech-service.png" alt-text="Screenshot of select the MedTech service for exporting metrics" lightbox="media/iot-metrics-export/iot-select-medtech-service.png":::

3. Select the **Diagnostic settings** option under **Monitoring**.

   :::image type="content" source="media/iot-metrics-export/iot-select-diagnostic-settings.png" alt-text="Screenshot of select the Diagnostic settings." lightbox="media/iot-metrics-export/iot-select-diagnostic-settings.png"::: 

4. Select the **+ Add diagnostic setting** option.

   :::image type="content" source="media/iot-metrics-export/iot-add-diagnostic-setting.png" alt-text="Screenshot of select the + Add diagnostic setting." lightbox="media/iot-metrics-export/iot-add-diagnostic-setting.png":::   

5. After the **+ Add diagnostic setting** page opens, enter a display name in the **Diagnostic setting name** dialog box. For this example, we'll name it **MedTech_service_All_Metrics**. You'll select a display name of your own choosing.  

6. Under **Destination details**, select the destination you want to use to export your MedTech service metrics to. In this example, we've selected an Azure storage account. You'll select a destination of your own choosing.

   Metrics can be exported to the following destinations:

   |Destination|Description|
   |-----------|-----------|
   |Log Analytics workspace|Metrics are converted to log form. This option may not be available for all resource types. Sending them to the Azure Monitor Logs store (which is searchable via Log Analytics) helps you to integrate them into queries, alerts, and visualizations with existing log data.|
   |Azure storage account|Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive and logs can be kept there indefinitely.|
   |Event Hubs|Sending logs and metrics to Event Hubs allows you to stream data to external systems such as third-party SIEMs and other Log Analytics solutions.|
   |Azure Monitor partner integrations|Specialized integrations between Azure Monitor and other non-Microsoft monitoring platforms. Useful when you're already using one of the partners.|
   
   > [!Important]
   > Each **Destination details** selection requires that certain resources (for example, an existing Azure storage account) be created and available before the selection can be successfully configured. Choose each selection to get a list of the required resources.

7. Select the **AllMetrics** option.

   > [!Note]
   >
   > To view a complete list of MedTech service metrics associated with **AllMetrics**, see [Supported metrics with Azure Monitor](../../azure-monitor/essentials/metrics-supported.md#microsofthealthcareapisworkspacesiotconnectors). 

8. Select the **Save** option to save your diagnostic setting selections.

   :::image type="content" source="media/iot-metrics-export/iot-select-diagnostic-setting-options.png" alt-text="Screenshot diagnostic setting and required fields." lightbox="media/iot-metrics-export/iot-select-diagnostic-setting-options.png"::: 

9. Once you've selected the **Save** option, the page will display a message that the diagnostic setting for your MedTech service has saved successfully.

   :::image type="content" source="media/iot-metrics-export/iot-successful-save-diagnostic-setting.png" alt-text="Screenshot of a successful diagnostic setting save." lightbox="media/iot-metrics-export/iot-successful-save-diagnostic-setting.png"::: 

   > [!Note] 
   >
   > It might take up to 15 minutes for the first MedTech service metrics to display in the destination of your choice.

10. To view your saved diagnostic setting, select **Diagnostic settings**.

    :::image type="content" source="media/iot-metrics-export/iot-navigate-to-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings option to view the saved diagnostic setting" lightbox="media/iot-metrics-export/iot-navigate-to-diagnostic-settings.png"::: 

11. The **Diagnostic settings** page will open displaying your newly created diagnostic setting for your MedTech service. You'll have the ability to: 

    1. Edit your saved MedTech service diagnostic setting. 
    2. Create more diagnostic settings for your MedTech service (for example: you may also want to send your MedTech service metrics to another destination like a Logs Analytics workspace). 

    :::image type="content" source="media/iot-metrics-export/iot-view-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings options" lightbox="media/iot-metrics-export/iot-view-diagnostic-settings.png"::: 
 
    > [!TIP]
    > 
    > For more information about how to work with diagnostics logs, see the [Azure Resource Log documentation](../../azure-monitor/essentials/platform-logs-overview.md).

## Conclusion 
Having access to the MedTech service metrics is essential for monitoring and troubleshooting.  The MedTech service allows you to do these actions through the export of metrics. 

## Next steps

To view the frequently asked questions (FAQs) about the MedTech service, see

>[!div class="nextstepaction"]
>[MedTech service FAQs](iot-connector-faqs.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
