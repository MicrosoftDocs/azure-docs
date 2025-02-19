---
title: View and monitor maintenance events
titleSuffix: Internet peering
description: Learn how to view current and past peering device maintenance events in Azure Peering Service, and how to create alerts to receive notifications for future events.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/25/2024
---

# View and monitor device maintenance events

In this article, you learn how to view active maintenance events in Azure Peering Service, and how to create alerts for future events. Internet peering partners and Peering Service customers can create alerts to receive notifications by email, voice, SMS, or the Azure mobile app.

## View maintenance events

If you're a partner who has internet peering or Peering Service resources in Azure, you receive notifications on the Azure Service Health pane. In this section, you learn how to view active maintenance events on the Service Health pane.

1. In the [Azure portal](https://portal.azure.com), search for and then select **Service Health**.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/service-health-portal-search.png" alt-text="Screenshot that shows how to search for Service Health in the Azure portal." lightbox="./media/walkthrough-device-maintenance-notification/service-health-portal-search.png":::

1. Select **Planned maintenance** to see active maintenance events. For the **Service** filter, select **Azure Service Peering** to list only maintenance events for Azure Peering Service.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/planned-maintenance.png" alt-text="Screenshot that shows planned maintenance events for Azure Peering Service in the Service Health pane in the Azure portal." lightbox="./media/walkthrough-device-maintenance-notification/service-health-portal-search.png":::

    The Summary tab displays information about the resource that's affected by a maintenance event. It includes the Azure subscription, the Azure region, and the peering location.

    When maintenance is completed, a status update is sent. You can view and review the maintenance event on the **Health history** pane when the event is finished.

1. To see past maintenance events, select **Health history**.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/health-history.png" alt-text="Screenshot that shows how to view past maintenance events in the Azure portal." lightbox="./media/walkthrough-device-maintenance-notification/health-history.png":::

> [!NOTE]
> The end time that's listed for the maintenance is an estimate. Many maintenance events finish before the end time that's shown in Service Health.

## Create alerts

Service Health supports forwarding rules, so you can set up your own alerts when maintenance events occur.

1. To set up a forwarding rule, go to the **Planned maintenance** pane, and then select **Add service health alert**.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/add-service-health-alert.png" alt-text="Screenshot that shows how to add an alert." lightbox="./media/walkthrough-device-maintenance-notification/add-service-health-alert.png":::

1. On the **Scope** tab, select the Azure subscription your internet peering or peering service is associated with. When a maintenance event affects a resource, the alert in Service Health is associated with the Azure subscription ID of the resource.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-scope.png" alt-text="Screenshot that shows how to choose the Azure subscription of the resource.":::

1. Select the **Condition** tab or select the **Next: Condition** button.

1. On the **Condition** tab, enter or select the following information:

    | Setting | Action |
    | --- | --- |
    | **Services** | Select **Azure Peering Service**. |
    | **Regions** | Select the Azure regions of the resources that you want to receive notifications for when maintenance events are planned. |
    | **Event types** | Select **Planned maintenance**. |

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-condition.png" alt-text="Screenshot that shows the Condition tab of creating an alert rule in the Azure portal.":::

1. Select the **Actions** tab or select the **Next: Actions** button.

1. Select **Create action group** to create a new action group. If you previously created an action group, you can use it by choosing **Select action groups**.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-actions.png" alt-text="Screenshot that shows the Actions tab before creating a new action group.":::

1. On the **Basics** tab, enter or select the following information:

    | Setting | Action |
    | --- | --- |
    | *Project details* |  |
    | **Subscription** | Select the Azure subscription that you want to use for the action group. |
    | **Resource group** | 1. Select **Create new**. </br> 2. For **Name**, enter **myResourceGroup**. </br> 3. Select **OK**. </br> If you have an existing resource group that you want to use, select it instead of creating a new one. |
    | **Regions** | Select **Global**. |
    | *Instance details* |  |
    | **Action group name** | Enter a name for the action group. |
    | **Display name** | Enter a short display name (up to 12 characters). |

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-action-group-basics.png" alt-text="Screenshot that shows the Basics tab of creating an action group.":::

1. Select the **Notifications** tab or select the **Next: Notifications** button. Then, select **Email/SMS message/Push/Voice** for the **Notification type**, and enter a name for this notification. Enter the contact information for the type of notification that you want.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-action-group-notifications-email-sms.png" alt-text="Screenshot that shows how to add the required contact information for the notifications.":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

1. After you create the action group, you return to the **Actions** tab of **Create an alert rule**. Select the **PeeringMaintenance** action group to edit it or to send test notifications.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-actions-group.png" alt-text="Screenshot that shows the Actions tab after creating a new action group.":::

1. Select **Test action group** to send test notifications to the contact information you previously entered in the action group. (To change the contact information, select the pencil icon next to the notification.)

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/edit-action-group.png" alt-text="Screenshot that shows how to edit an action group in the Azure portal.":::

1. On **Test PeeringMaintenance**, for **Select sample type**, select **Resource health alert** and select **Test**. Select **Done** after you successfully test the notifications.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/test-notifications.png" alt-text="Screenshot that shows how to send test notifications.":::

1. Select the **Details** tab or select the **Next: Details** button. Enter or select the following information:

    | Setting | Action |
    | --- | --- |
    | *Project Details* |  |
    | **Subscription** | Select the Azure subscription that you want to use for the alert rule. |
    | **Resource group** | Select **myResourceGroup**. |
    | *Alert rule details* |  |
    | **Alert rule name** | Enter a name for the rule. |
    | **Alert rule description** | Enter an optional description. |
    | **Advanced options** | Select **Enable alert rule upon creation**.  |

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-details.png" alt-text="Screenshot that shows the Details tab of creating an alert rule.":::

1. Select **Review + create**, and finish setting up your alert rule.

1. Review the settings, and then select **Create**.

Azure Peering Service notifications are forwarded to you based on your alert rule when maintenance events start and when they're resolved.

For more information on the notification platform of Service Health, see [Create activity log alerts on service notifications by using the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal).

## Receive notifications for legacy peerings

Peering partners who haven't onboarded their peerings as Azure resources can't receive notifications in Service Health because they don't have subscriptions associated with their peerings. Instead, these partners receive maintenance notifications via their network operations center (NOC) contact email address. Partners with legacy peerings don't have to opt in to receive these email notifications. Notifications are sent automatically. The following screenshot shows an example of a maintenance notification email:

:::image type="content" source="./media/walkthrough-device-maintenance-notification/legacy-peering-maintenance-email.png" alt-text="Screenshot that shows an example of a legacy peering maintenance email.":::

## Related content

- [Prerequisites to set up peering with Microsoft](prerequisites.md)
