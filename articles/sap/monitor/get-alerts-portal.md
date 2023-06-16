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

In this how-to guide, you'll learn how to configure alerts in Azure Monitor for SAP solutions. You can configure alerts and notifications from the [Azure portal](https://azure.microsoft.com/features/azure-portal) using its browser-based interface.

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

## Next steps

Learn more about Azure Monitor for SAP solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](about-azure-monitor-sap-solutions.md)
