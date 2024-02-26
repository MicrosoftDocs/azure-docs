---
title: Configure alerts in Azure Monitor for SAP solutions in Azure portal 
description: Learn how to use a browser method for configuring alerts in Azure Monitor for SAP solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.date: 10/19/2022
#Customer intent: As a developer, I want to configure alerts in Azure Monitor for SAP solutions so that I can receive alerts and notifications about my SAP systems.
---

# Configure alerts in Azure Monitor for SAP solutions in Azure portal 

In this how-to guide, you learn how to configure alerts in Azure Monitor for SAP solutions. You can configure alerts and notifications from the [Azure portal](https://azure.microsoft.com/features/azure-portal) using its browser-based interface.

## Prerequisites

- An Azure subscription.
- A deployment of an Azure Monitor for SAP solutions resource with at least one provider. You can configure providers for: 
    - The SAP application (NetWeaver)
    - SAP HANA
    - Microsoft SQL Server
    - High availability (HA) Pacemaker clusters
    - IBM Db2 

## Create an alert rule

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, browse and select your Azure Monitor for SAP solutions resource. Make sure you have at least one provider configured for this resource. 
1. Navigate to the workbook you want to use. For example, SAP HANA. 
1. Select a HANA instance.

    :::image type="content" source="./media/get-alerts-portal/ams-alert-1.png" alt-text="Screenshot showing placement of alert button." lightbox="./media/get-alerts-portal/ams-alert-1.png":::
  
1. Select the **Alerts** button to view available **Alert Templates**.

    :::image type="content" source="./media/get-alerts-portal/ams-alert-2.png" alt-text="Screenshot showing list of alert template." lightbox="./media/get-alerts-portal/ams-alert-2.png":::
    
1. Select **Create rule** to configure an alert of your choice.
1. For **Alert threshold**, enter your alert threshold.
1. For **Provider instance**, select a provider instance.
1. For **Action group**, select or create an [action group](../../azure-monitor/alerts/action-groups.md) to configure the notification setting. You can edit frequency and severity information according to your requirements.
    
1. Select **Enable alert rule** to create the alert rule.

    :::image type="content" source="./media/get-alerts-portal/ams-alert-3.png" alt-text="Screenshot showing alert configuration page." lightbox="./media/get-alerts-portal/ams-alert-3.png":::
    
1.	Select **Deploy alert rule** to finish your alert rule configuration. You can choose to see the alert template by selecting **View template**.

    :::image type="content" source="./media/get-alerts-portal/ams-alert-4.png" alt-text="Screenshot showing final step of alert configuration." lightbox="./media/get-alerts-portal/ams-alert-4.png":::
    
1.	Navigate to **Alert rules** to view the newly created alert rule. When and if alerts are fired, you can view them under **Fired alerts**.

    :::image type="content" source="./media/get-alerts-portal/ams-alert-5.png" alt-text="Screenshot showing result of alert configuration." lightbox="./media/get-alerts-portal/ams-alert-5.png":::

## View and manage alerts in a centralized experience (Preview)
This enhanced view introduces powerful capabilities that streamline alert management, providing a unified view of all alerts and alert rules across various providers. This consolidated approach enables you to efficiently manage and monitor alerts, improving your overall experience with Azure Monitor for SAP Solutions.

- **Centralized Alert Management**: 
Gain a holistic view of all alerts fired across different providers within a single, intuitive interface. With the new Alerts experience, you can easily track and manage alerts from various sources in one place, providing a comprehensive overview of your SAP landscape's health.

- **Unified Alert Rules**: 
Simplify your alert configuration by centralizing all alert rules across different providers. This streamlined approach ensures consistency in rule management, making it easier to define, update, and maintain alert rules for your SAP solutions.

- **Grid View for Rule Status and Bulk Operations**: 
Efficiently manage your alert rules using the grid view, allowing you to see the status of all rules and make bulk changes with ease. Enable or disable multiple rules simultaneously, providing a seamless experience for maintaining the health of your SAP environment.

- **Alert Action Group Management**: 
Take control of your alert action groups directly from the new Alerts experience. Manage and configure alert action groups effortlessly, ensuring that the right stakeholders are notified promptly when critical alerts are triggered.

- **Alert Processing Rules for Maintenance Periods**
Enable alert processing rules, a powerful feature that allows you to take specific actions or suppress alerts during maintenance periods. Customize the behavior of alerts to align with your maintenance schedule, minimizing unnecessary notifications and disruptions.

- **Export to CSV**: 
Facilitate data analysis and reporting by exporting fired alerts and alert rules to CSV format. This feature empowers you to share, analyze, and archive alert data seamlessly, supporting your organization's reporting and compliance requirements.

To access the new Alerts experience in Azure Monitor for SAP Solutions:

1. Navigate to the Azure portal.
1. Select your Azure Monitor for SAP Solutions instance.
    :::image type="content" source="./media/get-alerts-portal/new-alerts-view.png" alt-text="Screenshot showing central alerts view." lightbox="./media/get-alerts-portal/new-alerts-view.png":::
1. Click on the "Alerts" tab to explore the enhanced alert management capabilities.

## Next steps

Learn more about Azure Monitor for SAP solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](about-azure-monitor-sap-solutions.md)
