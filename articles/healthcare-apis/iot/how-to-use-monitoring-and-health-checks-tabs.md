---
title: How to use the MedTech service monitoring and health check tabs - Azure Health Data Services
description: Learn how to use the MedTech service monitoring and health check tabs.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 06/19/2023
ms.author: jasteppe
---

# How to use the MedTech service monitoring and health checks tabs

In this article, learn how to use the MedTech service monitoring and health check tabs in the Azure portal. The monitoring and health check tabs provide access to crucial MedTech service metrics and health checks. These metrics and health checks can be used in assessing the health and performance of your MedTech service and can be useful seeing patterns and/or trends or assisting with troubleshooting your MedTech service.

## Use the MedTech service monitoring tab

1. Within your Azure Health Data Services workspace, select **MedTech service** under **Services**.

   :::image type="content" source="media\how-to-use-monitoring-and-health-checks-tabs\workspace-displayed-with-connectors-button.png" alt-text="Screenshot of select the MedTech service within the workspace." lightbox="media\how-to-use-monitoring-and-health-checks-tabs\workspace-displayed-with-connectors-button.png":::

2. Select the MedTech service that you would like to display metrics for. For this example, we'll select a MedTech service named **mt-azuredocsdemo**. You'll be selecting a MedTech service within your own Azure Health Data Services workspace.

   :::image type="content" source="media\how-to-use-monitoring-and-health-checks-tabs\select-medtech-service.png" alt-text="Screenshot of select the MedTech service you would like to display metrics for." lightbox="media\how-to-use-monitoring-and-health-checks-tabs\select-medtech-service.png":::

3. The MedTech service monitoring tab will open displaying a subset of the supported MedTech service metrics. By default, the **Show data for last** option is set to **1 hour**. To adjust the time duration, select the **Show data for last option**, select the time period you would like to view, and select **Apply**. Select the down arrow in the **Traffic** MedTech service metrics tile to display the next set of MedTech service traffic metrics. 

   :::image type="content" source="media\how-to-use-monitoring-and-health-checks-tabs\display-monitoring-tab.png" alt-text="Screenshot the MedTech service monitoring tab with drop-down menus." lightbox="media\how-to-use-monitoring-and-health-checks-tabs\display-monitoring-tab.png":::

   > [!IMPORTANT]
   > If you leave the MedTech service monitoring tab, any customized settings you have made to the monitoring settings are lost and will have to be recreated. If you would like to save your customizations for future viewing, you can pin them to an Azure portal dashboard as a tile. 
   >
   > To learn how to customize and save metrics settings to an Azure portal dashboard and tile, see [How to configure the MedTech service metrics](configure-metrics.md).  

5. **Optional** - Select the **pin icon** to save the metrics tile to an Azure portal dashboard of your choosing.

   :::image type="content" source="media\how-to-use-monitoring-and-health-checks-tabs\pin-metrics-to-dashboard.png" alt-text="Screenshot the MedTech service monitoring tile with red box around the pin icon." lightbox="media\how-to-use-monitoring-and-health-checks-tabs\pin-metrics-to-dashboard.png":::
   
   > [!TIP]
   > To learn more about advanced metrics display and sharing options, see [Analyze metrics with Azure Monitor metrics explorer](../../azure-monitor/essentials/analyze-metrics.md).

## Available metrics for the MedTech service

This table shows the available MedTech service metrics and the information that the metrics are capturing. The metrics in **bold** are the metrics displayed within the **Monitoring** tab:  

Metric category|Metric name|Metric description|
|--------------|-----------|--------------|
|Availability|IotConnector Health Status|The overall health of the MedTech service.|
|Errors|**Total Error Count**|The total number of errors.|
|Latency|**Average Group Stage Latency**|The average latency of the group stage. The [group stage](overview-of-device-data-processing-stages.md#group---optional) performs buffering, aggregating, and grouping on normalized messages.|
|Latency|**Average Normalize Stage Latency**|The average latency of the normalized stage. The [normalized stage](overview-of-device-data-processing-stages.md#normalize) performs normalization on raw incoming messages.|
|Traffic|Number of Fhir resources saved|The total number of FHIR&reg; resources [updated or persisted](overview-of-device-data-processing-stages.md#persist) by the MedTech service.|
|Traffic|**Number of Incoming Messages**|The number of received raw [incoming messages](overview-of-device-data-processing-stages.md#ingest) (for example, the device events) from the configured source event hub.|
|Traffic|**Number of Measurements**|The number of normalized value readings received by the FHIR [transformation stage](overview-of-device-data-processing-stages.md#transform) of the MedTech service.|
|Traffic|**Number of Message Groups**|The number of groups that have messages aggregated in the designated time window.|
|Traffic|**Number of Normalized Messages**|The number of normalized messages.|

## Use the MedTech service health checks tab

1. Select the **Health checks** tab within your MedTech service to display the health checks. In the example, the MedTech service is passing all health checks as indicated by the **Status** row and the **Connected** status.

   :::image type="content" source="media\how-to-use-monitoring-and-health-checks-tabs\health-checks-without-errors.png" alt-text="Screenshot of the MedTech service health checks tab without errors." lightbox="media\how-to-use-monitoring-and-health-checks-tabs\health-checks-without-errors.png":::

2. In this example, we can see that the MedTech service is indicating that the **Health check** for **Event hub connection** is showing a **Status** of **Disconnected**. To find out how to troubleshoot this failed health check, you can select the **Accessing the MedTech service from the event hub** link under the **Learn more** row to be directed to the MedTech service troubleshooting guide section for addressing this failed health check.
 
    :::image type="content" source="media\how-to-use-monitoring-and-health-checks-tabs\health-checks-with-error.png" alt-text="Screenshot of the MedTech service health checks tab with errors." lightbox="media\how-to-use-monitoring-and-health-checks-tabs\health-checks-with-error.png":::

## Next steps

[How to configure the MedTech service metrics](configure-metrics.md)

[How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
