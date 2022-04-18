---
title: Display MedTech service metrics logging - Azure Health Data Services
description: This article explains how to display MedTech service Metrics
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 03/22/2022
ms.author: jasteppe
---

# How to display MedTech service metrics

In this article, you'll learn how to display MedTech service metrics in the Azure portal. 

## Display metrics

1. Within your Azure Health Data Services workspace, select **MedTech service**. 

   :::image type="content" source="media\iot-metrics\iot-workspace-displayed-with-connectors-button.png" alt-text="Screenshot of select the MedTech service button." lightbox="media\iot-metrics\iot-connectors-button.png"::: 

2. Select the MedTech service that you would like to display the metrics for.

   :::image type="content" source="media\iot-metrics\iot-connector-select.png" alt-text="Screenshot of select MedTech service you would like to display metrics for." lightbox="media\iot-metrics\iot-connector-select.png":::
    
3. Select **Metrics** button within the MedTech service page.

   :::image type="content" source="media\iot-metrics\iot-select-metrics.png" alt-text="Screenshot of Select the Metrics button." lightbox="media\iot-metrics\iot-metrics-button.png"::: 

4. From the metrics page, you can create the metrics that you want to display for your MedTech service. For this example, we'll be choosing the following selections:

   * **Scope** = MedTech service name (**Default**)
   * **Metric Namespace** = Standard Metrics (**Default**) 
   * **Metric** = MedTech service metrics you want to display. For this example, we'll choose **Number of Incoming Messages**.
   * **Aggregation** = How you would like to display the metrics. For this example, we'll choose **Count**. 

   :::image type="content" source="media\iot-metrics\iot-select-metrics-to-display.png" alt-text="Screenshpt of select metrics to display." lightbox="media\iot-metrics\iot-metrics-selection-close-up.png"::: 

5. We can now see the MedTech service metrics for **Number of Incoming Messages** displayed on the Azure portal.

   > [!TIP]
   > You can add additional metrics by selecting the **Add metric** button and making your choices.

   :::image type="content" source="media\iot-metrics\iot-metrics-add-button.png" alt-text="Screenshot of select Add metric button to add more metrics." lightbox="media\iot-metrics\iot-add-metric-button.png":::

   > [!IMPORTANT]
   > If you leave the metrics page, the metrics settings are lost and will have to be recreated. If you would like to save your MedTech service metrics for future viewing, you can pin them to an Azure dashboard as a tile.

## Pinning metrics tile on Azure portal dashboard

1. To pin the metrics tile to an Azure portal dashboard, select the **Pin to dashboard** button.

   :::image type="content" source="media\iot-metrics\iot-metrics-select-add-pin-to-dashboard.png" alt-text="Screenshot of select the Pin to dashboard button." lightbox="media\iot-metrics\iot-pin-to-dashboard-button.png":::

2. Select the dashboard you would like to display MedTech service metrics on. For this example, we'll use a private dashboard named `MedTech service Metrics`. Select **Pin** to add the metrics tile to the dashboard.

   :::image type="content" source="media\iot-metrics\iot-select-pin-to-dashboard.png" alt-text="Screenshot of select dashboard and Pin button to complete the dashboard pinning process." lightbox="media\iot-metrics\iot-select-pin-to-dashboard.png":::

3. You'll receive a confirmation that the metrics tile was successfully added to the dashboard.

   :::image type="content" source="media\iot-metrics\iot-select-dashboard-pinned-successful.png" alt-text="Screenshot of metrics tile successfully pinned to dashboard." lightbox="media\iot-metrics\iot-select-dashboard-pinned-successful.png":::

4. Once you've received a successful confirmation, select **Dashboard**.

   :::image type="content" source="media\iot-metrics\iot-select-dashboard-with-metrics-tile.png" alt-text="Screenshot of select the Dashboard button." lightbox="media\iot-metrics\iot-dashboard-button.png":::

5. Select the dashboard that you pinned the metrics tile to. For this example, the dashboard is **MedTech service Metrics**. The dashboard will display the MedTech service metrics tile that you created in the previous steps.

   :::image type="content" source="media\iot-metrics\iot-dashboard-with-metrics-tile-displayed.png" alt-text="Screenshot of dashboard with pinned MedTech service metrics tile." lightbox="media\iot-metrics\iot-dashboard-with-metrics-tile-displayed.png":::

   > [!TIP]
   > See the [MedTech service troubleshooting guide](./iot-troubleshoot-guide.md) for assistance fixing common errors, conditions and issues.

## Next steps

To learn how to export MedTech service metrics, see

>[!div class="nextstepaction"]
>[Configure diagnostic setting for MedTech service metrics exporting](./iot-metrics-diagnostics-export.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.
