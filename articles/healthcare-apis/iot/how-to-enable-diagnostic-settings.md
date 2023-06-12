---
title: How to enable the MedTech service diagnostic settings - Azure Health Data Services
description: Learn how to enable the MedTech service diagnostic settings.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 06/07/2023
ms.author: jasteppe
---

# How to enable diagnostic settings for the MedTech service

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, learn how to enable diagnostic settings for the MedTech service to:

* Create a diagnostic setting to export logs and metrics for audit, analysis, or troubleshooting of the MedTech service.
* Use the Azure Log Analytics workspace to view the MedTech service logs.
* Access the MedTech service pre-defined Azure Log Analytics queries.

## Create a diagnostic setting for the MedTech service

1. To enable logs and metrics export for your MedTech service, select **MedTech service** in your workspace under **Services**.
 
   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-medtech-service-in-workspace.png" alt-text="Screenshot of select the MedTech service within workspace." lightbox="media/how-to-enable-diagnostic-settings/select-medtech-service-in-workspace.png":::

2. Select the MedTech service that you want to enable a diagnostic setting for. In this example, we'll be using a MedTech service named *mt-azuredocsdemo*. You'll be selecting a MedTech service within your own Azure Health Data Services workspace.
   
   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-medtech-service.png" alt-text="Screenshot of select the MedTech service for exporting metrics." lightbox="media/how-to-enable-diagnostic-settings/select-medtech-service.png":::

3. Select the **Diagnostic settings** option under **Monitoring**.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-diagnostic-settings.png" alt-text="Screenshot of select the Diagnostic settings." lightbox="media/how-to-enable-diagnostic-settings/select-diagnostic-settings.png"::: 

4. Select the **+ Add diagnostic setting** option.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/add-diagnostic-settings.png" alt-text="Screenshot of select the + Add diagnostic setting." lightbox="media/how-to-enable-diagnostic-settings/add-diagnostic-settings.png"::: 

5. The **+ Add diagnostic setting** page will open, requiring configuration information from you.  

   1. Enter a display name in the **Diagnostic setting name** box. For this example, we'll name it *MedTech_service_All_Logs_and_Metrics*. You'll enter a display name of your own choosing.  
   
   2. Under **Logs**, select the **AllLogs** option.
   
   3. Under **Metrics**, select the **AllMetrics** option.

      > [!Note]
      > To view a complete list of MedTech service metrics associated with **AllMetrics**, see [Supported metrics with Azure Monitor](../../azure-monitor/essentials/metrics-supported.md#microsofthealthcareapisworkspacesiotconnectors). 

   4. Under **Destination details**, select the destination or destinations you want to use for your exported MedTech service logs and metrics. In this example, we've selected an Azure Log Analytics workspace named *la-azuredocsdemo*. You'll select a destination of your own choosing.
   
      > [!Important]
      > Each **Destination details** selection requires that certain resources (for example, an existing Azure Log Analytics workspace or storage account) be created and available before the selection can be successfully configured. Choose each selection to see which resources are required.
      >
      > For a successful configuration, you should only have a single destination per **diagnostic setting**.

      Metrics can be exported to the following destinations:

      |Destination|Description|
      |-----------|-----------|
      |[Azure Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md)|Metrics are converted to log form. Sending the metrics to the Azure Monitor Logs store (which is searchable via Log Analytics) enables you to integrate them into queries, alerts, and visualizations with existing log data.|
      |[Azure storage account](../../storage/index.yml)|Archiving logs and metrics to an Azure storage account is useful for audit, static analysis, or backup. Compared to Azure Monitor Logs and a Log Analytics workspace, Azure storage is less expensive, and logs can be kept there indefinitely.|
      |[Azure event hub](../../event-hubs/index.yml)|Sending logs and metrics to an event hub allows you to stream data to external systems such as third-party Security Information and Event Managements (SIEMs) and other Log Analytics solutions.|
      |Azure Monitor partner integrations|Specialized integrations between Azure Monitor and other non-Microsoft monitoring platforms. Useful when you're already using one of the partners.|

   5. Select the **Save** option to save your diagnostic setting selections.
   
      :::image type="content" source="media/how-to-enable-diagnostic-settings/select-all-logs-and-metrics.png" alt-text="Screenshot of diagnostic setting and required fields." lightbox="media/how-to-enable-diagnostic-settings/select-all-logs-and-metrics.png":::  

6. Once you've selected the **Save** option, the page will display a message that the diagnostic setting for your MedTech service has been saved successfully.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/diagnostic-settings-successfully-saved.png" alt-text="Screenshot of a successful diagnostic setting save." lightbox="media/how-to-enable-diagnostic-settings/diagnostic-settings-successfully-saved.png"::: 

   > [!Note] 
   > It might take up to 15 minutes for the first MedTech service logs and metrics to display in the destination of your choice.

7. To view your saved diagnostic setting, select **Diagnostic settings**.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-diagnostic-settings-banner.png" alt-text="Screenshot of Diagnostic settings option to view the saved diagnostic setting." lightbox="media/how-to-enable-diagnostic-settings/select-diagnostic-settings-banner.png"::: 

8. The **Diagnostic settings** page will open, displaying your newly created diagnostic setting for your MedTech service. You'll have the ability to: 
   
   1. **Edit setting**: Edit or delete your saved MedTech service diagnostic setting. 
   2. **+ Add diagnostic setting**: Create more diagnostic settings for your MedTech service (for example: you may also want to send your MedTech service metrics to another destination like a Logs Analytics workspace). 

   :::image type="content" source="media/how-to-enable-diagnostic-settings/view-and-edit-diagnostic-settings.png" alt-text="Screenshot of Diagnostic settings options." lightbox="media/how-to-enable-diagnostic-settings/view-and-edit-diagnostic-settings.png"::: 
 
   > [!TIP]
   > To learn about how to work with diagnostic settings, see [Diagnostic settings in Azure Monitor](../../azure-monitor/essentials/diagnostic-settings.md?tabs=portal).
   > 
   > To learn about how to work with diagnostic logs, see [Overview of Azure platform logs](../../azure-monitor/essentials/platform-logs-overview.md).

## Use the Azure Log Analytics workspace to view the MedTech service logs

If you choose to include your Log Analytics workspace as a destination option for your diagnostic setting, you can view the logs within **Logs** in your MedTech service. If there are any logs, they'll be a result of exceptions for your MedTech service (for example: *HealthCheck* exceptions).

1. To access your Log Analytics workspace, select the **Logs** button within your MedTech service.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-logs-button.png" alt-text="Screenshot of logs option." lightbox="media/how-to-enable-diagnostic-settings/select-logs-button.png":::

2. Copy the below table query string into your Log Analytics workspace query area and select **Run**. Using the *AHDSMedTechDiagnosticLogs* table will provide you with all logs contained in the entire table for the selected **Time range** setting (the default value is **Last 24 hours**). The MedTech service provides five pre-defined queries that will be addressed in the article section titled [Accessing the MedTech service pre-defined Azure Log Analytics queries](#accessing-the-medtech-service-pre-defined-azure-log-analytics-queries).

   ```Kusto
   AHDSMedTechDiagnosticLogs
   ```
   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-run-query.png" alt-text="Screenshot of query run option." lightbox="media/how-to-enable-diagnostic-settings/select-run-query.png":::

3. If your MedTech service is configured correctly and healthy, then the query should come back with no error logs.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/query-result-clean.png" alt-text="Screenshot of query with no health issues." lightbox="media/how-to-enable-diagnostic-settings/query-result-clean.png":::

4. If your MedTech service is misconfigured or unhealthy, then the query will come back with error logs.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/query-result-with-errors.png" alt-text="Screenshot of query with health issues." lightbox="media/how-to-enable-diagnostic-settings/query-result-with-errors.png":::

5. Select the down arrow in one of the error logs to display the full error log message, which can be used to help troubleshoot issues with your MedTech service. In this example, the error log message shows that the MedTech service wasn't able to authenticate with the FHIR service.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/display-log-error-message.png" alt-text="Screenshot of log error message." lightbox="media/how-to-enable-diagnostic-settings/display-log-error-message.png":::

6. Once you've resolved the issue, you can adjust the **Time range** setting (for this example, we'll be using **Last 30 minutes**) and select **Run** to see that the error logs have cleared for the issue that you resolved with your MedTech service.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/clean-query-result-post-error-fix.png" alt-text="Screenshot of query after fixing error." lightbox="media/how-to-enable-diagnostic-settings/clean-query-result-post-error-fix.png":::

> [!WARNING]
> The above custom query is not saved and will have to be recreated if you leave your Log Analytics workspace without saving the custom query.
>
> To learn how to save a custom query in Log Analytics, see [Save a query in Azure Monitor Log Analytics](../../azure-monitor/logs/save-query.md) 

> [!TIP]
> To learn how to use the Log Analytics workspace, see [Azure Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md).
>
> For assistance troubleshooting MedTech service errors, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

## Accessing the MedTech service pre-defined Azure Log Analytics queries

The MedTech service comes with pre-defined queries that can be used anytime in your Log Analytics workspace to filter and summarize your logs for more precise investigation. The queries can also be customized and saved/shared.

1. To access the pre-defined queries, select **Queries**, type *MedTech* in the **Search** area, select a pre-defined query by using a double-click, and select **Run** to execute the pre-defined query. In this example, we've selected *MedTech healthcheck exceptions*. You'll select a pre-defined query of your own choosing.

   > [!TIP]
   > You can click on each of the MedTech service pre-defined queries to see their description and access different options for running the query or placing it into the Log Analytics workspace query area. 

   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-and-run-pre-defined-query.png" alt-text="Screenshot of searching, selecting, and running a MedTech service pre-defined query." lightbox="media/how-to-enable-diagnostic-settings/select-and-run-pre-defined-query.png":::

2. Multiple pre-defined queries can be selected. In this example, we've additionally selected *Log count per MedTech log or exception type*. You'll select another pre-defined query of your own choosing.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/select-and-run-additional-pre-defined-query.png" alt-text="Screenshot of searching, selecting, and running a MedTech service and additional pre-defined query." lightbox="media/how-to-enable-diagnostic-settings/select-and-run-additional-pre-defined-query.png":::

3. Only the highlighted pre-defined query will be executed.

   :::image type="content" source="media/how-to-enable-diagnostic-settings/results-of-select-and-run-additional-pre-defined-query.png" alt-text="Screenshot of results of running a MedTech service and additional pre-defined query." lightbox="media/how-to-enable-diagnostic-settings/results-of-select-and-run-additional-pre-defined-query.png":::

> [!WARNING]
> Any changes that you've made to the pre-defined queries are not saved and will have to be recreated if you leave your Log Analytics workspace without saving custom changes you've made to the pre-defined queries.
>
> To learn how to save a query in Log Analytics, see [Save a query in Azure Monitor Log Analytics](../../azure-monitor/logs/save-query.md) 

> [!TIP]
> To learn how to use the Log Analytics workspace, see [Azure Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md).
>
> For assistance troubleshooting MedTech service errors, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).  

## Next steps

In this article, you learned how to enable the diagnostics settings for the MedTech service and use the Log Analytics workspace to query and view the MedTech service logs.

To learn about the MedTech service frequently asked questions (FAQs), see

> [!div class="nextstepaction"]
> [Frequently asked questions about the MedTech service](frequently-asked-questions.md)
