---
title: Create activity log alerts for labs
description: This article provides steps to create activity log alerts for lab in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/10/2020
ms.custom: UpdateFrequency2

#customer intent: As a lab administrator, I want to create activity log alerts for labs in Azure DevTest Labs, so that I can respond to issues quickly.
---

# Create activity log alerts for labs in Azure DevTest Labs
This article explains how to create activity log alerts for labs in Azure DevTest Labs (for example: when a VM is created or when a VM is deleted).

## Create alerts
In this example, you create an alert for all administrative operations on a lab with an action that sends an email to subscription owners. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal search bar, enter *Monitor*, and then select **Monitor** from the results list. 

    :::image type="content" source="./media/create-alerts/search-monitor.png" alt-text="Search for Monitor":::        

1. Select **Alerts** on the left menu, and then select **Create** > **Alert rule** on the toolbar. 

    :::image type="content" source="./media/create-alerts/alerts-page.png" alt-text="Alerts page":::    

1. On the **Create alert rule** page, click **Select resource**. 

    :::image type="content" source="./media/create-alerts/select-resource-link.png" alt-text="Select resource for the alert":::        

1. Select **DevTest Labs** for **Filter by resource type**, select your lab in the list, and then select **Done**.

    :::image type="content" source="./media/create-alerts/select-lab-resource.png" alt-text="Select your lab as the resource":::
1. Back on the **Create alert rule** page, click **Select condition**. 

    :::image type="content" source="./media/create-alerts/select-condition-link.png" alt-text="Select condition link":::    
1. On the **Configure signal logic** page, select a signal supported by DevTest Labs. 

    :::image type="content" source="./media/create-alerts/select-signal.png" alt-text="Select signal":::
1. Filter by **event level** (Verbose, Informational, Warning, Error, Critical, All), **status** (Failed, Started, Succeeded), and **who initiated** the event. 
1. Select **Done** to complete configuring the condition. 

    :::image type="content" source="./media/create-alerts/configure-signal-logic-done.png" alt-text="Configure signal logic - done":::
1. You have specified for the scope (lab) and the condition for the alert. Now, you need to specify an action group with actions to be run when the condition is met. Back on the **Create alert rule** page, choose **Select action group**. 

    :::image type="content" source="./media/create-alerts/select-action-group-link.png" alt-text="Select action group link":::
1. Select **Create action group** link on the toolbar. 

    :::image type="content" source="./media/create-alerts/create-action-group-link.png" alt-text="Create action group link":::
1. On the **Add action group** page, follow these steps:
    1. Enter a **name** for the action group.
    1. Enter a **short name** for the action group. 
    1. Select the **resource group** in which you want the alert to be created. 
    1. Enter a **name for the action**. 
    1. Select the **action type** (in this example, **Email Azure Resource Manager Role**). 

        :::image type="content" source="./media/create-alerts/add-action-group.png" alt-text="Add action group page":::
    1. On the **Email Azure Resource Manager Role** page, select the role. In this example, it's **Owner**. Then, select **OK**. 

        :::image type="content" source="./media/create-alerts/select-role.png" alt-text="Select role":::            
    1. Select **OK** on the **Add action group** page. 
1. Now, on the **Create alert rule** page, enter a name for the alert rule, and then select **OK**. 

    :::image type="content" source="./media/create-alerts/create-alert-rule-done.png" alt-text="Create alert rule - done":::

## View alerts 
1. You will see alerts on the **Alerts** for all administrative operations (in this example). Alerts may take sometime to show up. 

    :::image type="content" source="./media/create-alerts/alerts.png" alt-text="Screen capture displays alerts in the Dashboard.":::
1. If you select number in a column (for example: **Total alerts**), you see the alerts that were raised. 

    :::image type="content" source="./media/create-alerts/all-alerts.png" alt-text="All alerts":::
1. If you select an alert, you see details about it. 

    :::image type="content" source="./media/create-alerts/alert-details.png" alt-text="Alert details":::
1. In this example, you also receive an email with content as shown in the following example: 

    :::image type="content" source="./media/create-alerts/alert-email.png" alt-text="Alert email":::

## Next steps
- To learn more about creating action groups using different action types, see [Create and manage action groups in the Azure portal](../azure-monitor/alerts/action-groups.md).
- To learn more about activity logs, see  [Azure Activity Log](../azure-monitor/essentials/activity-log.md).
- To learn about setting alerts on activity logs, see [Alerts on activity log](../azure-monitor/alerts/activity-log-alerts.md).
