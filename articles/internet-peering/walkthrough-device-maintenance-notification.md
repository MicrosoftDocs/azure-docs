---
title: Device maintenance notification walkthrough
titleSuffix: Internet Peering
description: Learn how to view current and past peering device maintenance events, and how to create alerts to receive notifications for the future events.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 06/15/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Azure Peering maintenance notification walkthrough

In this article, you learn how to see active maintenance events and how to create alerts for future ones. Internet Peering partners and Peering Service customers can create alerts to receive notifications by email, voice, SMS, or the Azure mobile app.

## View maintenance events

If you're a partner who has Internet Peering or Peering Service resources in Azure, you receive notifications through the Azure Service Health page. In this section, you learn how to view active maintenance events in the Service Health page.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *service health*. Select **Service Health** in the search results.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/service-health-portal-search.png" alt-text="Screenshot shows how to search for Service Health in the Azure portal." lightbox="./media/walkthrough-device-maintenance-notification/service-health-portal-search.png":::

1. Select **Planned maintenance** to see active maintenance events. Select **Azure Service Peering** for **Service** filter to only list maintenance events for Azure Peering Service.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/planned-maintenance.png" alt-text="Screenshot shows planned maintenance events for Azure Peering Service in the Service Health page in the Azure portal." lightbox="./media/walkthrough-device-maintenance-notification/service-health-portal-search.png":::

    The summary tab gives you information about the affected resource by a maintenance event, such as the Azure subscription, region, and peering location.

    Once maintenance is completed, a status update is sent. You'll be able to view and review the maintenance event in the **Health history** page after it's completed.

1. Select **Health history** to see past maintenance events.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/health-history.png" alt-text="Screenshot shows how to view past maintenance events in the Azure portal." lightbox="./media/walkthrough-device-maintenance-notification/health-history.png":::

> [!NOTE]
> The end time listed for the maintenance is an estimate. Many maintenance events will complete before the end time that is shown in Service Health, but this is not guaranteed. Future developments to our maintenance notification service will allow for more accurate maintenance end times.

## Create alerts

Service Health supports forwarding rules, so you can set up your own alerts when maintenance events occur.

1. To set up a forwarding rule, go to the **Planned maintenance** page, and then select **+ Add service health alert**.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/add-service-health-alert.png" alt-text="Screenshot shows how to add an alert.":::

1. In the **Scope** tab, select the Azure subscription your Internet Peering or Peering Service is associated with. When a maintenance event affects a resource, the alert in Service Health is associated with the Azure subscription ID of the resource.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-scope.png" alt-text="Screenshot shows how to choose the Azure subscription of the resource.":::

1. Select the **Condition** tab, or select the **Next: Condition** button at the bottom of the page.

1. In the **Condition** tab, Select the following information:

    | Setting | Value |
    | --- | --- |
    | Services | Select **Azure Peering Service**. |
    | Regions | Select the Azure region(s) of the resources that you want to get notified whenever they have planned maintenance events. |
    | Event types | Select **Planned maintenance**. |

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-condition.png" alt-text="Screenshot shows the Condition tab of creating an alert rule in the Azure portal.":::

1. Select the **Actions** tab, or select the **Next: Actions** button.

1. Select **Create action group** to create a new action group. If you previously created an action group, you can use it by selecting **Select action groups**.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-actions.png" alt-text="Screenshot shows the Actions tab before creating a new action group.":::

1. In the **Basics** tab of **Create action group**, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select the Azure subscription that you want to use for the action group. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. </br> If you have an existing resource group that you want to use, select it instead of creating a new one. |
    | Regions | Select **Global**. |
    | **Instance details** |  |
    | Action group name | Enter a name for the action group. |
    | Display name | Enter a short display name (up to 12 characters). |

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-action-group-basics.png" alt-text="Screenshot shows the Basics tab of creating an action group.":::

1. Select the **Notifications** tab, or select the **Next: Notifications** button. Then, select **Email/SMS message/Push/Voice** for the **Notification type**, and enter a name for this notification. Enter the contact information for the type of notification that you want.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-action-group-notifications-email-sms.png" alt-text="Screenshot shows how to add the required contact information for the notifications.":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**. 

1. After creating the action group, you return to the **Actions** tab of **Create an alert rule**. Select **PeeringMaintenance** action group to edit it or send test notifications.

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-actions-group.png" alt-text="Screenshot shows the Actions tab after creating a new action group.":::

1. Select **Test action group** to send test notification(s) to the contact information you previously entered in the action group (to change the contact information, select the pencil icon next to the notification).

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/edit-action-group.png" alt-text="Screenshot shows how to edit an action group in the Azure portal.":::

1. In **Test PeeringMaintenance**, select **Resource health alert** for **Select sample type**, and then select **Test**. Select **Done** after you successfully test the notifications. 

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/test-notifications.png" alt-text="Screenshot shows how to send test notifications.":::

1. Select the **Details** tab, or select the **Next: Details** button. Enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select the Azure subscription that you want to use for the alert rule. |
    | Resource group | Select **myResourceGroup**. |
    | **Alert rule details** |  |
    | Alert rule name | Enter a name for the rule. |
    | Alert rule description | Enter an optional description. |
    | **Advanced options** | Select **Enable alert rule upon creation**.  |

    :::image type="content" source="./media/walkthrough-device-maintenance-notification/create-alert-rule-details.png" alt-text="Screenshot shows the Details tab of creating an alert rule.":::

1. Select **Review + create**, and finish your alert rule.

1. Review the settings, and then select **Create**. 

Azure Peering Service notifications are forwarded to you based on your alert rule whenever maintenance events start, and whenever they're resolved.

For more information on the notification platform of Service Health, see [Create activity log alerts on service notifications using the Azure portal](../service-health/alerts-activity-log-service-notifications-portal.md).

## Receive notifications for legacy peerings

Peering partners who haven't onboarded their peerings as Azure resources can't receive notifications in Service Health as they don't have subscriptions associated with their peerings. Instead, these partners receive maintenance notifications via their NOC contact email. Partners with legacy peerings don't have to opt in to receive these email notifications, they're sent automatically. This is an example of a maintenance notification email:

:::image type="content" source="./media/walkthrough-device-maintenance-notification/legacy-peering-maintenance-email.png" alt-text="Screenshot shows an example of a legacy peering maintenance email.":::

## Next steps

- Learn about the [Prerequisites to set up peering with Microsoft](prerequisites.md).