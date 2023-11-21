---
title: Create alerts in Azure Update Manager
description: This article describes on how to enable alerts (preview) with Azure Update Manager to address events as captured in updates data. 
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 10/19/2023
ms.topic: how-to
---

# Create alerts (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides steps to enable Alerts (preview) with [Azure Update Manager](overview.md) to address events as captured in updates data.

Azure Update Manager is a unified service that allows you to manage and govern updates for all your Windows and Linux virtual machines across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard. It's designed as a standalone Azure service to provide SaaS experience to manage hybrid environments in Azure.

Logs created from patching operations such as update assessments and installations are stored by Azure Update Manager in Azure Resource Graph (ARG). You can view up to last seven days of assessment data, and up to last 30 days of update installation results.

## Prerequisite

Ensure that the alert rule is a managed identity with an assigned role as reader.

## Enable alerts (Preview) with Azure Update Manager

To enable alerts (preview) with Azure Update Manager through Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Monitoring**, select **New alerts rule (Preview)** to create an alert rule.
   
   :::image type="content" source="./media/manage-alerts/access-alerts-inline.png" alt-text="Screenshot that shows how to access alerts feature." lightbox="./media/manage-alerts/access-alerts-expanded.png":::

1. On **Azure Update Manager | Alerts (Preview)** page, provide the following details:
    1. Select a **Subscription** from the dropdown that will be the scope of the alert rule.
    1. From the **Azure Resource Group query** dropdown, select a predefined alerting query option. You can select **Custom query** option to edit or write a custom query.
    
      :::image type="content" source="./media/manage-alerts/create-alert-rule-inline.png" alt-text="Screenshot that shows how to create alert rule." lightbox="./media/manage-alerts/create-alert-rule-expanded.png":::
    
    1. Select **View result and edit query in Logs** to run a selected alerting query option or to edit a query.
    
      :::image type="content" source="./media/manage-alerts/edit-query-inline.png" alt-text="Screenshot that shows how to edit query in logs." lightbox="./media/manage-alerts/edit-query-expanded.png":::
      
   1. 
1. Select **New alert rule** and in the **Create an alert rule** page, to move to the alert rule create flow where you can set up the advanced alert rule configuration. For more information, see [Create Azure Monitor alert rules](../azure-monitor/alerts/alerts-create-new-alert-rule.md#set-the-alert-rule-conditions).
   
    :::image type="content" source="./media/manage-alerts/advance-alert-rule-configuration-inline.png" alt-text="Screenshot that shows how to configure advanced alert rule." lightbox="./media/manage-alerts/advance-alert-rule-configuration-expanded.png":::

1. Select **Review + create** to create alert.


> [!NOTE]
> - Azure Resource Graph query used for alerts can return at maximum of 1000 rows.
> - By default, Azure Resource Graph query will return response as per the access provided via the identity and user need to filter out by subscriptions, resource groups and other criteria as per the requirement.
## Next steps

* [An overview on Azure Update Manager](overview.md)
* [Check update compliance](view-updates.md)
* [Deploy updates now (on-demand) for single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)