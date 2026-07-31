---
title: Configure alerts in Azure Monitor for SAP solutions in the Azure portal
description: Learn how to configure alerts in Azure Monitor for SAP solutions by using the Azure portal.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.date: 03/17/2026
# Customer intent: As an IT operations manager, I want to configure alerts in Azure Monitor for SAP solutions so that I can proactively manage system health and ensure timely notifications for critical issues.
---

# Configure alerts in Azure Monitor for SAP solutions in the Azure portal

[Azure Monitor for SAP solutions](about-azure-monitor-sap-solutions.md) is an Azure-native monitoring product for SAP landscapes that run on Azure. Alerts notify you when monitored metrics cross a defined threshold. When you run critical SAP workloads, timely notification of problems helps you respond before issues affect your business processes.

In this article, you configure alert rules and action groups in the Azure portal to receive notifications when your SAP environment needs attention.

## Prerequisites

- An Azure subscription.
- A deployment of an Azure Monitor for SAP solutions resource with at least one provider. You can configure providers for:

  - The SAP application (NetWeaver)
  - SAP HANA
  - Microsoft SQL Server
  - High availability (HA) Pacemaker clusters
  - IBM Db2

## Create an alert rule

Use the following steps to create an alert rule for your SAP monitoring provider instance. You select an alert template, set a threshold, and configure an action group for notifications.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, go to your Azure Monitor for SAP solutions resource. Make sure you have at least one provider configured for this resource.
1. Go to the workbook you want to use. For example, SAP HANA.
1. Select a HANA instance.

   :::image type="content" source="./media/get-alerts-portal/ams-alert-1.png" alt-text="Screenshot showing an SAP HANA instance under monitoring in the service menu." lightbox="./media/get-alerts-portal/ams-alert-1.png":::

1. Select the **Alerts** button to view available **Alert Templates**.

   :::image type="content" source="./media/get-alerts-portal/ams-alert-2.png" alt-text="Screenshot showing a list of different alert template types." lightbox="./media/get-alerts-portal/ams-alert-2.png":::

1. Select **Create rule** to configure an alert.
1. For **Alert threshold**, enter your alert threshold.
1. For **Provider instance**, select a provider instance.
1. For **Action group**, select or create an [action group](/azure/azure-monitor/alerts/action-groups) to configure the notification setting. You can edit frequency and severity as needed.

1. Select **Enable alert rule** to create the alert rule.

   :::image type="content" source="./media/get-alerts-portal/ams-alert-3.png" alt-text="Screenshot showing the alert rule configuration page for an SAP HANA instance." lightbox="./media/get-alerts-portal/ams-alert-3.png":::

1. Select **Deploy alert rule** to finish your alert rule configuration. To view the alert template, select **View template**.

   :::image type="content" source="./media/get-alerts-portal/ams-alert-4.png" alt-text="Screenshot showing the final step of an alert rule configuration before deployment." lightbox="./media/get-alerts-portal/ams-alert-4.png":::

1. Go to **Alert rules** to view the newly created alert rule. If alerts are fired, you can view them in **Fired alerts**.

   :::image type="content" source="./media/get-alerts-portal/ams-alert-5.png" alt-text="Screenshot showing a list of active and configured rule alerts for an SAP HANA instance." lightbox="./media/get-alerts-portal/ams-alert-5.png":::

## View and manage alerts in a centralized experience (preview)

The centralized alerts experience provides a unified view of all alerts and alert rules across providers.

| Capability | Description |
|---|---|
| **Centralized alert management** | Gain a holistic view of all alerts fired across different providers within a single, intuitive interface. With the new Alerts experience, you can easily track and manage alerts from various sources in one place, providing a comprehensive overview of your SAP landscape's health. |
| **Unified alert rules** | Simplify your alert configuration by centralizing all alert rules across different providers. This streamlined approach ensures consistency in rule management, making it easier to define, update, and maintain alert rules for your SAP solutions. |
| **Grid view and bulk operations** | Efficiently manage your alert rules using the grid view, allowing you to see the status of all rules and make bulk changes with ease. Enable or disable multiple rules simultaneously, providing a seamless experience for maintaining the health of your SAP environment. |
| **Action group management** | Take control of your alert action groups directly from the new Alerts experience. Manage and configure alert action groups effortlessly, ensuring that the right stakeholders are notified promptly when critical alerts are triggered. |
| **Alert processing rules** | Enable alert processing rules, a powerful feature that allows you to take specific actions or suppress alerts during maintenance periods. Customize the behavior of alerts to align with your maintenance schedule, minimizing unnecessary notifications and disruptions. |
| **Export to CSV** | Facilitate data analysis and reporting by exporting fired alerts and alert rules to CSV format. This feature empowers you to share, analyze, and archive alert data seamlessly, supporting your organization's reporting and compliance requirements. |

To access the centralized alerts experience:

1. Go to the Azure portal.
1. Select your Azure Monitor for SAP solutions instance.

   :::image type="content" source="./media/get-alerts-portal/new-alerts-view.png" alt-text="Screenshot showing the central alerts view in Azure Monitor for SAP solutions." lightbox="./media/get-alerts-portal/new-alerts-view.png":::

1. Select the **Alerts** tab to explore the enhanced alert management capabilities.

## Next step

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](about-azure-monitor-sap-solutions.md)
