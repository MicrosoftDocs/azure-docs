---
title: Display MedTech service metrics - Azure Health Data Services
description: This article explains how to display MedTech service metrics.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 07/22/2022
ms.author: jasteppe
---

# How to display the MedTech service metrics

In this article, you'll learn how to display MedTech service metrics in the Azure portal and how to pin the MedTech service metrics tile to an Azure portal dashboard. 

## Metric types for the MedTech service

The MedTech service metrics that you can select and display are listed in the following table:

|Metric type|Metric purpose| 
|-----------|--------------|
|Number of Incoming Messages|Displays the number of received raw incoming messages (for example, the device events).|
|Number of Normalized Messages|Displays the number of normalized messages.|
|Number of Message Groups|Displays the number of groups that have messages aggregated in the designated time window.|
|Average Normalized Stage Latency|Displays the average latency of the normalized stage. The normalized stage performs normalization on raw incoming messages.|
|Average Group Stage Latency|Displays the average latency of the group stage. The group stage performs buffering, aggregating, and grouping on normalized messages.| 
|Total Error Count|Displays the total number of errors.| 

## Display the MedTech service metrics 

1. Within your Azure Health Data Services workspace, select **MedTech service** under **Services**. 

   :::image type="content" source="media\iot-metrics-display\iot-workspace-displayed-with-connectors-button.png" alt-text="Screenshot of select the MedTech service button within the workspace." lightbox="media\iot-metrics-display\iot-connectors-button.png"::: 

2. Select the MedTech service that you would like to display the metrics for.

   :::image type="content" source="media\iot-metrics-display\iot-connector-select.png" alt-text="Screenshot of select the MedTech service you would like to display metrics for." lightbox="media\iot-metrics-display\iot-connector-select.png":::
    
3. Select **Metrics** button within the MedTech service page.

   :::image type="content" source="media\iot-metrics-display\iot-select-metrics.png" alt-text="Screenshot of Select the Metrics button within your MedTech service." lightbox="media\iot-metrics-display\iot-metrics-button.png"::: 

4. From the metrics page, you can create the metrics combinations that you want to display for your MedTech service. For this example, we'll be choosing the following selections:

   * **Scope** = Your MedTech service name (**Default**)
   * **Metric Namespace** = Standard metrics (**Default**) 
   * **Metric** = The MedTech service metrics you want to display. For this example, we'll choose **Number of Incoming Messages**.
   * **Aggregation** = How you would like to display the metrics. For this example, we'll choose **Count**. 

   :::image type="content" source="media\iot-metrics-display\iot-select-metrics-to-display.png" alt-text="Screenshot of select metrics to display." lightbox="media\iot-metrics-display\iot-metrics-selection-close-up.png"::: 

5. We can now see the MedTech service metrics for **Number of Incoming Messages** displayed on the Azure portal.

   > [!TIP]
   > You can add additional metrics by selecting the **Add metric** button and making your choices.

   :::image type="content" source="media\iot-metrics-display\iot-metrics-add-button.png" alt-text="Screenshot of select Add metric button to add more metrics." lightbox="media\iot-metrics-display\iot-add-metric-button.png":::

   > [!IMPORTANT]
   > If you leave the metrics page, the metrics settings for your MedTech service are lost and will have to be recreated. If you would like to save your MedTech service metrics for future viewing, you can pin them to an Azure dashboard as a tile.

## How to pin the MedTech service metrics tile to an Azure portal dashboard

1. To pin the MedTech service metrics tile to an Azure portal dashboard, select the **Pin to dashboard** button.

   :::image type="content" source="media\iot-metrics-display\iot-metrics-select-add-pin-to-dashboard.png" alt-text="Screenshot of select the Pin to dashboard button." lightbox="media\iot-metrics-display\iot-pin-to-dashboard-button.png":::

2. Select the dashboard you would like to display your MedTech service metrics on. For this example, we'll use a private dashboard named `MedTech service metrics`. Select **Pin** to add your MedTech service metrics tile to the dashboard.

   :::image type="content" source="media\iot-metrics-display\iot-select-pin-to-dashboard.png" alt-text="Screenshot of select dashboard and Pin button to complete the dashboard pinning process." lightbox="media\iot-metrics-display\iot-select-pin-to-dashboard.png":::

3. You'll receive a confirmation that your MedTech service metrics tile was successfully added to your selected Azure portal dashboard.

   :::image type="content" source="media\iot-metrics-display\iot-select-dashboard-pinned-successful.png" alt-text="Screenshot of metrics tile successfully pinned to dashboard." lightbox="media\iot-metrics-display\iot-select-dashboard-pinned-successful.png":::

4. Once you've received a successful confirmation, select the **Dashboard** button.

   :::image type="content" source="media\iot-metrics-display\iot-select-dashboard-with-metrics-tile.png" alt-text="Screenshot of select the Dashboard button." lightbox="media\iot-metrics-display\iot-dashboard-button.png":::

5. Select the dashboard that you pinned your MedTech service metrics tile to. For this example, the dashboard is named **MedTech service metrics**. The dashboard will display the MedTech service metrics tile that you created in the previous steps.

   :::image type="content" source="media\iot-metrics-display\iot-dashboard-with-metrics-tile-displayed.png" alt-text="Screenshot of dashboard with pinned MedTech service metrics tile." lightbox="media\iot-metrics-display\iot-dashboard-with-metrics-tile-displayed.png":::

   > [!TIP]
   > See the [MedTech service troubleshooting guide](./iot-troubleshoot-guide.md) for assistance fixing common errors, conditions and issues.

## Next steps

To learn how to export the MedTech service metrics, see

>[!div class="nextstepaction"]
>[How to configure diagnostic settings for exporting the MedTech service metrics](./iot-metrics-diagnostics-export.md)

(FHIR&#174;) is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
