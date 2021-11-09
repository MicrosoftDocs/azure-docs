---
title: Display IoT connector Metrics logging - Azure Healthcare APIs
description: This article explains how to display IoT connector Metrics
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 11/09/2021
ms.author: jasteppe
---

# How to display IoT connector Metrics

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to display IoT connector Metrics in the Azure portal. 

## Display Metrics

1. Within your Azure Healthcare APIs Workspace, select **IoT connector**. 

     :::image type="content" source="media/iot-metrics-export/azure_portal_workspace.png" alt-text="Screenshot of a Workspace" lightbox="media/iot-metrics-export/azure_portal_workspace.png"::: 

2. Select the IoT connector that you would like to display the Metrics for.

    :::image type="content" source="media/iot-metrics-export/azure_portal_connector_select.png" alt-text="Select IoT connector" lightbox="media/iot-metrics-export/azure_portal_connector_select.png":::
    
3. Select **Metrics** within the IoT connector page.

   :::image type="content" source="media/iot-metrics-export/azure_portal_metrics_select.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/metrics.png"::: 

4. From the Metrics page, you can create the Metrics that you want to display for your IoT connector. For this example, we'll be choosing the following selections:

    * **Scope** = IoT connector name (**Default**)
    * **Metric Namespace** = Standard Metrics (**Default**) 
    * **Metric** = IoT connector metrics you want to display. For this example, we'll choose **Number of Incoming Messages**.
    * **Aggregation** = How you would like to display the metrics. For this example, we'll choose **Count**.

    :::image type="content" source="media/iot-metrics-export/azure_portal_metrics_selection_close_up.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_metrics_selection_close_up.png"::: 

    :::image type="content" source="media/iot-metrics-export/azure_portal_select_metrics_and_add_button.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_metrics_selection_close_up.png"::: 

    > [!TIP]
    > You can add additional Metrics by selecting the **Add metric** button and making your choices.

5. We can now see the IoT connector Metrics for **Number of Incoming Messages** display on the Azure portal.

    :::image type="content" source="media/iot-metrics-export/azure_portal_metrics_displayed_select_add.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_metrics_displayed_select_add.png":::

    > [!TIP]
    > You can add additional Metrics by selecting the **Add metric** button and making your choices.

    > [!IMPORTANT]
    > If you leave the Metrics page, the Metrics settings are lost and will have to be recreated. If you would like to save your IoT connector Metrics for future viewing, you can pin them to an Azure dashboard.

## Pinning Metrics tile on Azure portal dashboard

1. To pin the Metrics tile to an Azure portal dashboard, select the **Pin to dashboard** button:

    :::image type="content" source="media/iot-metrics-export/azure_portal_metrics_displayed_and_pinned.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_metrics_displayed_and_pinned.png":::

2. Select the dashboard you would like to display IoT connector Metrics on. For this example, we'll use a private dashboard named IoT connector Metrics. Select **Pin** to add the Metrics tile to the dashboard.

    :::image type="content" source="media/iot-metrics-export/azure_portal_connector_select_dashboard.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_connector_select_dashboard.png":::

3. You'll receive a confirmation that the Metrics tile was successfully added to the dashboard.

    :::image type="content" source="media/iot-metrics-export/azure_portal_connector_select_dashboard_pin_successful.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_connector_select_dashboard_pin_successful.png":::

4. Once you've received a successful confirmation, select **Dashboard**.

    :::image type="content" source="media/iot-metrics-export/azure_portal_connector_select_dashboard_with_metrics.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_connector_select_dashboard_with_metrics.png":::

5. Select the dashboard that you pinned the Metric tile to. For this example, the dashboard is **IoT connector Metrics**. The dashboard will display the IoT connector Metrics tile that you created in the previous steps.

    :::image type="content" source="media/iot-metrics-export/azure_portal_connector_dashboard_with_metrics_displayed.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/azure_portal_connector_dashboard_with_metrics_displayed.png":::

## Conclusion 

Having access to Metrics is essential for monitoring and troubleshooting.  IoT connector assists you to do these actions through Metrics. 

## Next steps

Check out frequently asked questions about IoT connector.

>[!div class="nextstepaction"]
>[IoT connector FAQs](iot-connector-faqs.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.
