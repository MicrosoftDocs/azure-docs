---
title: Use action rules to manage alert notifications on Azure Stack Edge devices | Microsoft Docs 
description: Describes how to define action rules to manage alert notifications for Azure Stack Edge devices in the Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 12/06/2021
ms.author: alkohli
---
# Use action rules to manage alert notifications on Azure Stack Edge devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to create action rules in the Azure portal to trigger or suppress alert notifications for device events that occur within a resource group, an Azure subscription, or an individual Azure Stack Edge resource.  

## About action rules

An action rule can trigger or suppress alert notifications. The action rule is added to an *action group* - a set of notification preferences that's used to notify users who need to act on alerts triggered in different contexts for a resource or set of resources.

For more information about action rules, see [Configuring an action rule](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#configuring-an-action-rule). For more information about action groups, see [Create and manage action groups in the Azure portal](../azure-monitor/alerts/action-groups.md).

> [!NOTE]
> The action rules feature is in preview. Some screens and steps might change as the process is refined.


## Create an action rule

Take the following steps in the Azure portal to create an action rule for your Azure Stack Edge device.

> [!NOTE]
> These steps create an action rule that sends notifications to an action group. For details about creating an action rule to suppress notifications, see [Configuring an action rule](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#configuring-an-action-rule).

1. Go to the Azure Stack Edge device in the [Azure portal](https://portal.azure.com), and select the **Alerts** menu item (under **Monitoring**). Then select **Action rules (preview)**.

   ![Screenshot showing the Alerts screen for an Azure Stack Edge resource. The Action Rules Preview command is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/action-rules-open-view-01.png)

2. In the **Action rules (preview)**, select **+ Create**.

   [ ![Screenshot showing the command menu at the top of the Action Rules Preview for an Azure Stack Edge resource. The Plus Create command is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/action-rules-open-view-02-inline.png) ](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/action-rules-open-view-02-expanded.png#lightbox)

3. On the **Create action rule** screen, create a **Scope** to select an Azure subscription, resource group, or target resource. The action rule will act on all alerts generated within that scope.

   1. Select **Edit** beside **Scope** to open the **Select scope** panel.

      [ ![Illustration of the Create Action Rule screen in Azure Stack Edge with the Select Scope panel open. The Edit command for Scope is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-01-inline.png) ](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-01-expanded.png#lightbox)

   2. On the **Select Scope** panel, select the **Subscription** for the action rule, and optionally filter by a **Resource** type. To filter to Azure Stack Edge resources, select **Data Box Edge devices (dataBoxEdge)**.
   
      ![Screenshot of the Select Scope panel for an action rule in Azure Stack Edge, with resource group filters. The Data Box Edge Devices filter is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-02.png)

      The **Resource** area lists the available resources based on your selections.

   3. Select the check box by each resource you want to apply the rule to. You can select the subscription, resource groups, or individual resources.

   4. When you finish, select **Done**.

      ![Screenshot of the Select Scope panel for an action rule in Azure Stack Edge. Two selected resources and the Done button are highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-03.png)

      The **Create action rule** screen shows the selected scope.

      ![Screenshot of the Create Action Rule screen for an Azure Stack Edge resource with a scope defined. The completed Scope settings are highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-scope-04.png)

4. Use **Filter** options to narrow the application of the rule to a subset of alerts within the selected scope.

   1. Select **Add** to open the **Add filters** pane.

      ![Screenshot of the Create Action Rule screen for an Azure Stack Edge resource. The Add button for the Filter options is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-filter-01.png)

   2. On the **Add filters** pane, under **Filters**, add each filter you want to apply. For each filter, select the filter type, **Operator**, and **Value**.
   
      For a list of filter options, see [Filter criteria](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#filter-criteria).

      The sample filters below apply to all alerts at Severity levels 2, 3, and 4 that the Monitor service raises for Azure Stack Edge resources.

      ![Screenshot of the Add filters screen for an action rule in Azure Stack Edge with three filters added. The Done button is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-filter-02.png)

   3. When you finish adding filters, select **Done**.

5. On the **Create action rule** screen, select **Action group** to create a rule that sends notifications. Then, by **Actions**, choose **Select**.

   ![Screenshot of the Create Action Rule screen for an Azure Stack Edge resource. The Action Group and the Select button for Actions are highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-action-group-01.png) 

   > [!NOTE]
   > To create a rule that suppresses notifications, you would choose **Suppression**. For more information, see [Configuring an action rule](../azure-monitor/alerts/alerts-action-rules.md?tabs=portal#configuring-an-action-rule).

6. On the **Add action groups** screen, select the action group to use with this action rule. Then choose **Select**. Your new action rule will be added to the notification preferences of the action group.

   If you need to create a new action group, select **+ Create action group**, and follow the steps in [Create an action group by using the Azure portal](../azure-monitor/alerts/action-groups.md#create-an-action-group-by-using-the-azure-portal).

   ![Screenshot of the Add Action Groups screen for an Azure Stack Edge resource. A selected action group and the Select button are highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-action-group-02.png)

7. Give the new action rule a **Name** and **Description** (optional), and assign the rule to a resource group.

8. The new rule will be enabled by default. If you don't want to start using the rule immediately, select **No** for **Enable rule update creation**.

9. When you finish your settings, select **Create**.

    ![Screenshot of the Create Action Rule screen showing a completed action rule that will send alert notifications for an Azure Stack Edge resource.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-completed-settings.png)

    The **Action rules (Preview)** screen opens, but you might not see your new action rule immediately. The focus is **All** resource groups.

10. To see your new action rule, select the resource group for the rule.

    ![Screenshot showing action rules for an Azure Stack Edge resource on the Action Rules Preview screen. The new action rule is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/new-action-rule-displayed.png)


## View notifications

Notifications go out when a new event triggers an alert for a resource that's within the scope of an action rule.

The action group for a rule sets who receives a notification and the type of notification that's sent - email, a Short Message Service (SMS) message, or both.

It might take a few minutes to receive notifications after an alert is triggered.

The email notification will look similar to this one.

![Screenshot showing a sample email notification for an action rule for an Azure Stack Edge resource.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/sample-action-rule-email-notification.png)


## Next steps

- [View device alerts](azure-stack-edge-alerts.md).
- [Work with alert metrics](../azure-monitor/alerts/alerts-metric.md).
- [Set up Azure Monitor](azure-stack-edge-gpu-enable-azure-monitor.md).
