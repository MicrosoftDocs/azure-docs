---
title: Configure alerts in Azure Monitor for SAP solutions in Azure portal (preview)
description: Learn how to use a browser method for configuring alerts in Azure Monitor for SAP solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.date: 07/21/2022
---

# Configure alerts in Azure Monitor for SAP solutions in Azure portal (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this article, we'll walk through steps to configure alerts in Azure Monitor for SAP solutions (AMS). We'll configure alerts and notifications from the [Azure portal](https://azure.microsoft.com/features/azure-portal) using its browser-based interface.

This content applies to both versions of the service, AMS and AMS (classic).

## Prerequisites

Deploy the Azure Monitor for SAP solutions resource with at least one provider. You can configure providers for: 
- SAP Application (NetWeaver)
- SAP HANA
- Microsoft SQL server
- High-availability (pacemaker) cluster
- IBM Db2 

## Sign in to the portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create an alert rule

1.	In the Azure portal, browse and select your Azure Monitor for SAP solutions resource. Ensure you have at least one provider configured for this resource. 
2.	Navigate to workbooks of your choice. For example, SAP HANA and select a HANA instance.

    :::image type="content" source="./media/ams-alerts/ams-alert-1.png" alt-text="Screenshot showing placement of alert button." lightbox="./media/ams-alerts/ams-alert-1.png":::
  
3.	Select the **Alerts** button to view available **Alert Templates**.

    :::image type="content" source="./media/ams-alerts/ams-alert-2.png" alt-text="Screenshot showing list of alert template." lightbox="./media/ams-alerts/ams-alert-2.png":::
    
4.	Select **Create rule** to configure an alert of your choice.
5.	Enter **Alert threshold**, choose **Provider instance**, and choose or create **Action group** to configure notification setting. You can edit frequency and severity information per your requirements.

    >[!Tip]
    > Learn more about [action groups](../../../azure-monitor/alerts/action-groups.md). 
    
7.	Select **Enable alert rule**.

    :::image type="content" source="./media/ams-alerts/ams-alert-3.png" alt-text="Screenshot showing alert configuration page." lightbox="./media/ams-alerts/ams-alert-3.png":::
    
7.	Select **Deploy alert rule** to finish your alert rule configuration. You can choose to see the alert template by clicking **View template**.

    :::image type="content" source="./media/ams-alerts/ams-alert-4.png" alt-text="Screenshot showing final step of alert configuration." lightbox="./media/ams-alerts/ams-alert-4.png":::
    
8.	Navigate to **Alert rules** to view the newly created alert rule. When and if alerts are fired, you can view them under **Fired alerts**.

    :::image type="content" source="./media/ams-alerts/ams-alert-5.png" alt-text="Screenshot showing result of alert cofiguration." lightbox="./media/ams-alerts/ams-alert-5.png":::

## Next steps

Learn more about Azure Monitor for SAP solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](monitor-sap-on-azure.md)
