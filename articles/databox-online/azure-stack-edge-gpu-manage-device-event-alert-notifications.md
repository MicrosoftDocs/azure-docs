---
title: Use action rules to manage alert notifications on Azure Stack Edge devices | Microsoft Docs 
description: Describes how to define action rules to manage alert notifications for Azure Stack Edge devices in the Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/06/2023
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

1. Go to the Azure Stack Edge device in the [Azure portal](https://portal.azure.com), and select the **Alerts** menu item (under **Monitoring**). Then select **Alert processing rules**.

   [![Screenshot showing the Alerts page for an Azure Stack Edge resource. The Alert processing rules option is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-01.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-01.png#lightbox)

2. Under **Alert processing rules**, select **+ Create**. This will launch the **Create an alert processing rule** wizard.

   [![Screenshot showing the Alert processing rules page for an Azure Stack Edge resource. The Plus Create rules option is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-create-rule-02.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-create-rule-02.png#lightbox)

3. On the **Scope** page, select **+ Select scope**.

   [![Screenshot showing the **Scope** menu in the **Create an alert processing rule** wizard for an Azure Stack Edge resource. The Plus Select scope option is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-select-scope-03.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-select-scope-03.png#lightbox) 

1. Select a **Subscription** and optionally filter by **Resource type**. To filter by Azure Stack Edge resources, select the **Resource type** for **Azure Stack Edge / Data Box Gateway**.

   [![Screenshot showing the **Scope** menu in the **Create an alert processing rule** wizard for an Azure Stack Edge resource. The Select subscription dropdown menu is highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-select-subscription-04.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-alert-processing-rules-select-subscription-04.png#lightbox)

1. The **Resource type** option will list the available resources based on your selection. Use the filter option to reduce the list of options. Select the **Checkbox** for the scope option you want to work with.

   [![Illustration of the Scope options for alert processing rule in Azure Stack Edge with the "asegpu" option selected.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-new-action-rule-scope-selection-05.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-new-action-rule-scope-selection-05.png#lightbox)

1. You can also use the **Filter** control in the following example to reduce the list of options.

   [![Screenshot of the filter control to reduce the list of options for setting the scope for alert processing rules in Azure Stack Edge.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-filter-scope-results-06.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-filter-scope-results-06.png#lightbox)
   
1. On the **Add filters** pane, under **Filters**, add each filter you want to apply. For each filter, select the filter type, **Operator**, and **Value**.

   For a list of filter options, see [Filter criteria](../azure-monitor/alerts/alerts-processing-rules.md?tabs=portal#filter-criteria).

   The sample filters in the following example apply to all alerts at Severity levels 2, 3, and 4 that the Monitor service raises for Azure Stack Edge resources. 

   [![Screenshot of the filter criteria builder for an action rule in Azure Stack Edge.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-action-rule-filter-criteria-builder-07.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-action-rule-filter-criteria-builder-07.png#lightbox)

1. On the **Rule Settings** page, select **Apply action group** to create a rule that sends notifications.
1. Select an option to **+ Select action group** or **+ Create action group**.

   >[!NOTE]
   >Select **Suppress notifications** if you don't want to invoke notifications for alerts. For more information, see [Configuring an action rule](../azure-monitor/alerts/alerts-processing-rules.md?tabs=portal#configuring-an-action-rule).

   [![Screenshot of the rule setting options for rule type and action group options for an action rule in Azure Stack Edge.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-action-rule-setting-options-08.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-action-rule-setting-options-08.png#lightbox)

1. On the **Select action groups** page, select up to five action groups to attach to the action rule, and then choose **Select**. 

   The new action rule will be added to the notification preferences of the action group.

   To create a new action group, select **+ Create action group** and follow the steps in [Create an action group by using the Azure portal](../azure-monitor/alerts/action-groups.md#create-an-action-group-by-using-the-azure-portal).

   [![Screenshot of the Select action groups page for an action rule in Azure Stack Edge.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-select-action-group-09.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-select-action-group-09.png#lightbox) 

1. On the **Details** tab, assign the processing rule to a **Resource group** and then specify a **Name** and a **Description** (optional) for the new rule.

1.	The new rule will be enabled by default. If you don't want to start using the rule immediately, leave the **Enable rule upon creation** option unchecked.

[![Screenshot of the Project details page for an action rule in Azure Stack Edge. This page also shows Alert processing rule details.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-create-processing-rule-10.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-create-processing-rule-10.png#lightbox)

1. To continue, select **Review+Create**.

[![Screenshot of the action group details for an action rule in Azure Stack Edge.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-processing-rule-details-11.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-processing-rule-details-11.png#lightbox)

1. Review your selections and then select **Create**.

1. The **Action rules** page will launch, but you may not see the new rule immediately. The default view is **All** resource groups.

1. To view your new action rule, select the resource group that contains the rule.

   [![Screenshot of the Alert processing rules in Azure Stack Edge with the Resource groups filter highlighted.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-processing-rules-12.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-processing-rules-12.png#lightbox)   


## View notifications

Notifications go out when a new event triggers an alert for a resource within the scope of an action rule.

The action group for a rule determines who receives a notification and the type of notification that's sent. Notifications can be email, an SMS message, or both.

It might take a few minutes to receive notifications after an alert is triggered.

The email notification will look similar to the following message.

[![Screenshot showing a sample email notification for an action rule for an Azure Stack Edge resource.](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-sample-action-rule-email-notification-13.png)](media/azure-stack-edge-gpu-manage-device-event-alert-notifications/azure-stack-edge-sample-action-rule-email-notification-13.png#lightbox)


## Next steps

- [View device alerts](azure-stack-edge-alerts.md).
- [Work with alert metrics](../azure-monitor/alerts/alerts-metric.md).
- [Set up Azure Monitor](azure-stack-edge-gpu-enable-azure-monitor.md).
