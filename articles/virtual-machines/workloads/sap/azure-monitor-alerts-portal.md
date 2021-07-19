---
title: Configure Alerts in Azure Monitor for SAP Solutions by using the Azure portal
description: Learn how to use a browser method for configuring alerts in Azure Monitor for SAP Solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.date: 07/16/2021

---	

# Configure Alerts in Azure Monitor for SAP Solutions by using the Azure portal

In this article, we'll walk through steps to configure alerts in Azure Monitor for SAP Solutions (AMS) from the [Azure portal](https://azure.microsoft.com/features/azure-portal). Using the portal's browser-based interface, we'll configure alerts and notifications.

Prerequisite: you must deploy AMS resource with at least one provider. You can configure providers for SAP Application (NetWeaver), SAP HANA, Microsoft SQL server or high-availability (pacemaker) cluster. 

## Sign in to the portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create an alert rule

1.	In Azure portal, browse and select your Azure Monitor for SAP Solutions (AMS) resource. Ensure that you have at least 1 provider configured for this AMS resource. 
2.	Navigate to workbooks of your choice, example SAP HANA and select a HANA instance.

    :::image type="content" source="./media/ams-alerts/ams-alert-1.png" alt-text="Screenshot showing placement of alert button." lightbox="./media/ams-alerts/ams-alert-1.png":::
  
3.	Click on **Alerts** button to view available **Alert Templates**.

    :::image type="content" source="./media/ams-alerts/ams-alert-2.png" alt-text="Screenshot showing list of alert template." lightbox="./media/ams-alerts/ams-alert-2.png":::
    
4.	Click **Create rule** to configure an alert of your choice.
5.	Enter **Alert threshold**, choose **Provider instance**, choose or create **Action group** to configure notification setting. You can edit frequency and severity information as per your requirements.

    >[!Tip]
    > Learn more about [action groups](https://docs.microsoft.com/azure/azure-monitor/alerts/action-groups). 
    
7.	Click **Enable alert rule**.

    :::image type="content" source="./media/ams-alerts/ams-alert-3.png" alt-text="Screenshot showing alert configuration page." lightbox="./media/ams-alerts/ams-alert-3.png":::
    
7.	Click on **Deploy alert rule** to finish alert rule configuration. You can choose to see alert template by clicking **View template**.

    :::image type="content" source="./media/ams-alerts/ams-alert-4.png" alt-text="Screenshot showing final step of alert configuration." lightbox="./media/ams-alerts/ams-alert-4.png":::
    
8.	Navigate to **Alert rules** to view the newly create alert rule. When and if alerts are fired, you can view those under **Fired alerts**

    :::image type="content" source="./media/ams-alerts/ams-alert-5.png" alt-text="Screenshot showing result of alert cofiguration." lightbox="./media/ams-alerts/ams-alert-5.png":::

## Next steps

Learn more about Azure Monitor for SAP Solutions.

> [!div class="nextstepaction"]
> [Azure Monitor for SAP Solutions](azure-monitor-overview.md)
