---
title: How to enable the MedTech service diagnostic settings - Azure Health Data Services
description: This article explains how to enable the MedTech service diagnostic settings.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 10/24/2022
ms.author: jasteppe
---

# How to enable diagnostic settings for the MedTech service

In this article, you'll learn how to enable the diagnostic settings for the MedTech service to export logs to different destinations (for example: to [Azure storage](/azure/storage/) or an [Azure event hub](/azure/event-hubs/)) for audit, analysis, or backup.

## Create a diagnostic setting for the MedTech service
1. To enable metrics export for your MedTech service, select **MedTech service** in your workspace under **Services**.
 
   :::image type="content" source="media/iot-diagnostic-settings/select-medtech-service-in-workspace.png" alt-text="Screenshot of select the MedTech service within workspace." lightbox="media/iot-diagnostic-settings/select-medtech-service-in-workspace.png":::

2. Select the MedTech service that you want to enable a diagnostic setting for. For this example, we'll be using a MedTech service named **mt-azuredocsdemo**. You'll be selecting a MedTech service within your own Azure Health Data Services workspace.
   
   :::image type="content" source="media/iot-diagnostic-settings/select-medtech-service.png" alt-text="Screenshot of select the MedTech service for exporting metrics." lightbox="media/iot-diagnostic-settings/select-medtech-service.png":::

3. Select the **Diagnostic settings** option under **Monitoring**.

   :::image type="content" source="media/iot-diagnostic-settings/select-diagnostic-settings.png" alt-text="Screenshot of select the Diagnostic settings." lightbox="media/iot-diagnostic-settings/select-diagnostic-settings.png"::: 

4. Select the **+ Add diagnostic setting** option.

   :::image type="content" source="media/iot-diagnostic-settings/add-diagnostic-settings.png" alt-text="Screenshot of select the + Add diagnostic setting." lightbox="media/iot-diagnostic-settings/add-diagnostic-settings.png"::: 

5. The **+ Add diagnostic setting** page will open, requiring configuration inputs from you. 

   :::image type="content" source="media/iot-diagnostic-settings/select-all-logs-and-metrics.png" alt-text="Screenshot of diagnostic setting and required fields." lightbox="media/iot-diagnostic-settings/select-all-logs-and-metrics.png":::   

   1. Enter a display name in the **Diagnostic setting name** box. For this example, we'll name it **MedTech_service_All_Logs_and_Metrics**. You'll enter a display name of your own choosing.  
   
   2. Under **Logs**, select the **AllLogs** option.
   
   3. Under **Metrics**, select the **AllMetrics** option.

      > [!Note]
      > To view a complete list of MedTech service metrics associated with **AllMetrics**, see [Supported metrics with Azure Monitor](../../azure-monitor/essentials/metrics-supported.md#microsofthealthcareapisworkspacesiotconnectors). 

   4. Under **Destination details**, select the destination you want to use for your exported MedTech service metrics. In this example, we've selected an Azure storage account named **azuredocsdemostorage**. You'll select a destination of your own choosing.
   
      > [!Important]
      > Each **Destination details** selection requires that certain resources (for example, an existing Azure storage account) be created and available before the selection can be successfully configured. Choose each selection to see which resources are required.

      Metrics can be exported to the following destinations:

      |Destination|Description|
      |-----------|-----------|
      |Log Analytics workspace|Metrics are converted to log form. Sending the metrics to the Azure Monitor Logs store (which is searchable via Log Analytics) enables you to integrate them into queries, alerts, and visualizations with existing log data.|
      |Azure storage account|Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive, and logs can be kept there indefinitely.|
      |Azure event hub|Sending logs and metrics to an event hub allows you to stream data to external systems such as third-party Security Information and Event Managements (SIEMs) and other Log Analytics solutions.|
      |Azure Monitor partner integrations|Specialized integrations between Azure Monitor and other non-Microsoft monitoring platforms. Useful when you're already using one of the partners.|

   5. Select the **Save** option to save your diagnostic setting selections.

6. Once you've selected the **Save** option, the page will display a message that the diagnostic setting for your MedTech service has been saved successfully.

   :::image type="content" source="media/iot-diagnostic-settings/diagnostic-settings-successfully-saved.png" alt-text="Screenshot of a successful diagnostic setting save." lightbox="media/iot-diagnostic-settings/diagnostic-settings-successfully-saved.png"::: 

   > [!Note] 
   > It might take up to 15 minutes for the first MedTech service metrics to display in the destination of your choice.

7. To view your saved diagnostic setting, select **Diagnostic settings**.

   :::image type="content" source="media/iot-diagnostic-settings/select-diagnostic-settings-banner.png" alt-text="Screenshot of Diagnostic settings option to view the saved diagnostic setting." lightbox="media/iot-diagnostic-settings/select-diagnostic-settings-banner.png"::: 

8. The **Diagnostic settings** page will open, displaying your newly created diagnostic setting for your MedTech service. You'll have the ability to: 
   
   1. **Edit setting**: Edit or delete your saved MedTech service diagnostic setting. 
   2. **+ Add diagnostic setting**: Create more diagnostic settings for your MedTech service (for example: you may also want to send your MedTech service metrics to another destination like a Logs Analytics workspace). 

   :::image type="content" source="media/iot-diagnostic-settings/view-and-edit-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings options." lightbox="media/iot-diagnostic-settings/view-and-edit-diagnostic-settings.png"::: 
 
   > [!TIP]
   > For more information about how to work with diagnostic settings, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal).
   > 
   > For more information about how to work with diagnostic logs, see the [Overview of Azure platform logs](../../azure-monitor/essentials/platform-logs-overview.md).

## Next steps

To view the frequently asked questions (FAQs) about the MedTech service, see

> [!div class="nextstepaction"]
> [MedTech service FAQs](iot-connector-faqs.md)