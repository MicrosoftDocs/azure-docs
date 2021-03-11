---
title: Manage device event alert notifications for your Azure Stack Edge Pro resources | Microsoft Docs 
description: Describes how to use the Azure portal to manage alerts for device events on your Azure Stack Edge Pro resources.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/22/2021
ms.author: alkohli
---
# Manage device event alert notifications on Azure Stack Edge Pro resources

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to create action rules in the Azure portal to trigger or suppress alert notifications for device events that occur within a resource group, an Azure subscription, or an individual Azure Stack Edge resource. This article applies to all models of Azure Stack Edge.  

## About action rules

An action rule can trigger or suppress alert notifications. The action rule is added to an *action group* - a set of notification preferences that's used to notify users who need to act on alerts triggered in different contexts for a resource or set of resources.

For more information about action rules, see [Configuring an action rule](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#configuring-an-action-rule). For more information about action groups, see [Create and manage action groups in the Azure portal](../azure-monitor/alerts/action-groups.md).

> [!NOTE]
> The action rules feature is in preview. Some screens and steps might change as the process is refined.


## Create an action rule

Take the following steps in the Azure portal to create an action rule for your Azure Stack Edge device.

> [!NOTE]
> These steps create an action rule that sends notifications to an action group. For details about creating an action rule to suppress notifications, see [Configuring an action rule](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#configuring-an-action-rule).

1. Go to the Azure Stack Edge device in the Azure portal, and then go to **Monitoring > Alerts**. Select **Manage actions**.

   ![Monitoring Alerts, Manage actions view](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/action-rules-open-view-01.png)

2. Select **Action rules (preview)**, and then select **+ New action rule**.

   ![Manage actions, Action rules option](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/action-rules-open-view-02.png)

3. On the **Create action rule** screen, use **Scope** to select an Azure subscription, resource group, or target resource. The action rule will act on all alerts generated within that scope.

   1. Choose **Select** by **Scope**.

      ![Select a scope for a new action rule](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-01.png)

   2. Select the **Subscription** for the action rule, optionally filter by a **Resource** type. To filter to Azure Stack Edge resources, select **Data Box Edge devices (dataBoxEdge)**.

      The **Resource** area lists the available resources based on your selections.
  
      ![Available resources on the Select Scope screen](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-02.png)

   3. Select the check box by each resource you want to apply the rule to. You can select the subscription, resource groups, or individual resources. Then select **Done**.

      ![Sample settings for an action rule scope](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-03.png)

      The **Create action rule** screen shows the selected scope.

      ![Completed scope for an Azure Stack Edge action rule](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-04.png)

4. Use **Filter** options to narrow the application of the rule to subset of alerts within the selected scope.

   1. Select **Add** to open the **Add filters** pane.

      ![Option for adding filters to an action rule](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-filter-01.png)

   2. Under **Filters**, add each filter you want to apply. For each filter, select the filter type, **Operator**, and **Value**.
   
      For a list of filter options, see [Filter criteria](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#filter-criteria).

      The sample filters below apply to all alerts at Severity levels 2, 3, and 4 that the Monitor service raises for Azure Stack Edge resources.

      When you finish adding filters, select **Done**.
   
      ![Sample filter for an action rule](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-filter-02.png)

5. On the **Create action rule** screen, select **Action group** to create a rule that sends notifications. Then, by **Actions**, choose **Select**.

   ![Action group option for creating an action rule that sends notifications](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-action-group-01.png)

   > [!NOTE]
   > To create a rule that suppresses notifications, you would choose **Suppression**. For more information, see [Configuring an action rule](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#configuring-an-action-rule).

6. Select the action group that you want to use with this action rule. Then choose **Select**. Your new action rule will be added to the notification preferences of the selected action group.

   If you need to create a new action group, select **+ Create action group**, and follow the steps in [Create an action group by using the Azure portal](../azure-monitor/alerts/action-groups.md#create-an-action-group-by-using-the-azure-portal).

   ![Select an action group to use with the rule, and then choose Select.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-action-group-02.png)

7. Give the new action rule a **Name** and **Description**, and assign the rule to a resource group.

9. The new rule is enabled by default. If you don't want to start using the rule immediately, select **No** for **Enable rule update creation**.

10. When you finish your settings, select **Create**.

    ![Completed settings for an action rule that will send alert notifications](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-completed-settings.png)

    The **Action rules (Preview)** screen opens, but you might not see your new action rule immediately. The focus is **All** resource groups.

11. To see your new action rule, select the resource group for the rule.

    ![Action rules screen with the new rule displayed](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-displayed.png)


## View notifications

Notifications go out when a new event triggers an alert for a resource that's within the scope of an action rule.

The action group for a rule sets who receives a notification and the type of notification that's sent - email, a Short Message Service (SMS) message, or both.

It might take a few minutes to receive notifications after an alert is triggered.

The email notification will look similar to this one.

![Sample email notification for an action rule](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/sample-action-rule-email-notification.png)


## Next steps

<!-- - See [Create and manage action groups in the Azure portal](../azure-monitor/alerts/action-groups.md) for guidance on creating a new action group.
- See [Configure an action rule](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#configuring-an-action-rule) for more info about creating action rules that send or suppress alert notifications. -2 bullets referenced above. Making room for local tasks in "Next Steps." --> 
- See [Monitor your Azure Stack Edge Pro](azure-stack-edge-monitor.md) for info about reviewing device events, hardware status, and metrics charts. 
- See [Using Azure Monitor](azure-stack-edge-gpu-enable-azure-monitor.md) for info about optimizing Azure Monitor for Azure Stack Edge Pro GPU devices.
- See [Create, view, and manage metric alerts using Azure Monitor Link target](../azure-monitor/alerts/alerts-metric.md) for info about managing individual alerts.