---
title: Display the MedTech service metrics - Azure Health Data Services
description: This article explains how to display MedTech service metrics.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 08/04/2022
ms.author: jasteppe
---

# How to display and configure the MedTech service metrics

In this article, you'll learn how to display and configure the MedTech service metrics in the Azure portal. You'll also learn how to pin the MedTech service metrics tile to an Azure portal dashboard for later viewing.

The MedTech service metrics can be used to help determine the health and performance of your MedTech service and can be useful with troubleshooting and seeing patterns and/or trends with your MedTech service. 

## Metric types for the MedTech service

This table shows the available MedTech service metrics and the information that the metrics are capturing and displaying within the Azure portal:  

Metric domain|Metric type|Metric purpose|
|------------|-----------|--------------|
|Availability|IotConnector Health Status|Indicates the overall health of the MedTech service.|
|Errors|Total Error Count|Displays the total number of errors.|
|Latency|Average Group Stage Latency|Displays the average latency of the group stage. The group stage performs buffering, aggregating, and grouping on normalized messages.|
|Latency|Average Normalize Stage Latency|Displays the average latency of the normalized stage. The normalized stage performs normalization on raw incoming messages.|
|Traffic|Number of Fhir resources saved|The total number of Fast Healthcare Interoperability Resources (FHIR&#174;) resources updated or saved by the MedTech service.|
|Traffic|Number of Incoming Messages|Displays the number of received raw incoming messages (for example, the device events) from the configured source event hub|
|Traffic|Number of Measurements|The number of normalized value readings received by the FHIR conversion stage of the MedTech service.|
|Traffic|Number of Message Groups|Displays the number of groups that have messages aggregated in the designated time window.|
|Traffic|Number of Normalized Messages|Displays the number of [normalized messages](iot-data-flow.md#normalize).|

## Display and configure the MedTech service metrics

1. Within your Azure Health Data Services workspace, select **MedTech service** under **Services**.

   :::image type="content" source="media\iot-metrics-display\iot-workspace-displayed-with-connectors-button.png" alt-text="Screenshot of select the MedTech service button within the workspace." lightbox="media\iot-metrics-display\iot-workspace-displayed-with-connectors-button.png":::

2. Select the MedTech service that you would like to display metrics for. For this example, we'll select a MedTech service named **mt-azuredocsdemo**. You'll select your own MedTech service.

   :::image type="content" source="media\iot-metrics-display\iot-connector-select.png" alt-text="Screenshot of select the MedTech service you would like to display metrics for." lightbox="media\iot-metrics-display\iot-connector-select.png":::

3. Select **Metrics** button within the MedTech service page.

   :::image type="content" source="media\iot-metrics-display\iot-select-metrics.png" alt-text="Screenshot of Select the Metrics button within your MedTech service." lightbox="media\iot-metrics-display\iot-select-metrics.png":::

4. The MedTech service metrics page will open allowing you to use the drop-down menus to view and select the metrics that are available for the MedTech service.

   :::image type="content" source="media\iot-metrics-display\iot-metrics-opening-page.png" alt-text="Screenshot the MedTech service metrics page with drop-down menus." lightbox="media\iot-metrics-display\iot-metrics-opening-page.png":::

5. Select the metrics combinations that you want to display for your MedTech service. For this example, we'll be choosing the following selections:

   * **Scope** = Your MedTech service name (**Default**)
   * **Metric Namespace** = Standard metrics (**Default**)
   * **Metric** = The MedTech service metrics you want to display. For this example, we'll choose **Number of Incoming Messages**.
   * **Aggregation** = How you would like to display the metrics. For this example, we'll choose **Count**.

6. You can now see the MedTech service metrics for **Number of Incoming Messages** displayed on the MedTech service metrics page.

   :::image type="content" source="media\iot-metrics-display\iot-metrics-select-options.png" alt-text="Screenshot of select metrics to display." lightbox="media\iot-metrics-display\iot-metrics-select-options.png":::

7. You can add more metrics by selecting the **Add metric** button and making your choices.

   :::image type="content" source="media\iot-metrics-display\iot-select-add-metric.png" alt-text="Screenshot of select Add metric button to add more MedTech service metrics." lightbox="media\iot-metrics-display\iot-select-add-metric.png":::

   > [!IMPORTANT]
   > If you leave the MedTech service metrics page, the metrics settings for your MedTech service are lost and will have to be recreated. If you would like to save your MedTech service metrics for future viewing, you can pin them to an Azure dashboard as a tile.

## How to pin the MedTech service metrics tile to an Azure portal dashboard

1. To pin the MedTech service metrics tile to an Azure portal dashboard, select the **Pin to dashboard** button.

   :::image type="content" source="media\iot-metrics-display\iot-metrics-select-add-pin-to-dashboard.png" alt-text="Screenshot of select the Pin to dashboard button." lightbox="media\iot-metrics-display\iot-metrics-select-add-pin-to-dashboard.png":::

2. Select the dashboard you would like to display your MedTech service metrics to by using the drop-down menu. For this example, we'll use a private dashboard named **Azuredocsdemo_Dashboard**. Select **Pin** to add your MedTech service metrics tile to the dashboard.

   :::image type="content" source="media\iot-metrics-display\iot-select-pin-to-dashboard.png" alt-text="Screenshot of select dashboard and Pin button to complete the dashboard pinning process." lightbox="media\iot-metrics-display\iot-select-pin-to-dashboard.png":::

3. You'll receive a confirmation that your MedTech service metrics tile was successfully added to your selected Azure portal dashboard.

   :::image type="content" source="media\iot-metrics-display\iot-select-dashboard-pinned-successful.png" alt-text="Screenshot of metrics tile successfully pinned to dashboard." lightbox="media\iot-metrics-display\iot-select-dashboard-pinned-successful.png":::

4. Once you've received a successful confirmation, select the **Dashboard** button.

   :::image type="content" source="media\iot-metrics-display\iot-select-dashboard-with-metrics-tile.png" alt-text="Screenshot of select the Dashboard button." lightbox="media\iot-metrics-display\iot-select-dashboard-with-metrics-tile.png":::

5. Select the dashboard that you pinned your MedTech service metrics tile to using the drop-down menu. For this example, the dashboard is named **Azuredocsdemo_Dashboard**. The dashboard will display the MedTech service metrics tile that you created in the previous steps.

   :::image type="content" source="media\iot-metrics-display\iot-dashboard-with-metrics-tile-displayed.png" alt-text="Screenshot of dashboard with pinned MedTech service metrics tile." lightbox="media\iot-metrics-display\iot-dashboard-with-metrics-tile-displayed.png":::

   > [!TIP]
   > See [Troubleshoot MedTech service](./iot-troubleshoot-guide.md) for assistance fixing common errors, conditions, and issues with the MedTech service.

## Next steps

To learn how to export the MedTech service metrics, see

> [!div class="nextstepaction"]
> [How to configure diagnostic settings for exporting the MedTech service metrics](./iot-metrics-diagnostics-export.md)

(FHIR&#174;) is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
