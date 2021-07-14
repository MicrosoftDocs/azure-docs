---
title: Manage subscriptions
description: Subscriptions consist of managed committed devices and can be onboarded or offboarded as needed. 
ms.date: 3/30/2021
ms.topic: how-to
---

# Manage a subscription

Subscriptions are managed on a monthly basis. When you onboard a subscription, you will be billed for that subscription until the end of the month. Similarly if you when you offboard a subscription, you will be billed for the remainder of the month in which you offboarded that subscription.

## Onboard a subscription

To get started with Azure Defender for IoT, you must have a Microsoft Azure subscription. If you do not have a subscription, you can sign up for a free account. If you already have access to an Azure subscription, but it isn't listed, check your account details, and confirm your permissions with the subscription owner.

To onboard a subscription:

1. Navigate to the Azure portal's Pricing page. 

   :::image type="content" source="media/how-to-manage-subscriptions/no-subscription.png" alt-text="Navigate to the Azure portal's Pricing page.":::

1. Select **Onboard subscription**.

1. In the **Onboard subscription** window select your subscription, and the number of committed devices from the drop-down menus. 

   :::image type="content" source="media/how-to-manage-subscriptions/onboard-subscription.png" alt-text="select your  subscription and the number of committed devices.":::

1. Select **Onboard**.

## Offboard a subscription

Subscriptions are managed on a monthly basis. When you offboard a subscription, you will be billed for that subscription until the end of the month.

Uninstall all sensors that are associated with the subscription prior to offboarding the subscription. For more information on how to delete a sensor, see [Delete a sensor](how-to-manage-sensors-on-the-cloud.md#delete-a-sensor). 

To offboard a subscription:

1. Navigate to the **Pricing** page.
1. Select the subscription, and then select the **delete** icon :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/delete-icon.png" border="false":::.
1. In the confirmation popup, select the checkbox to confirm you have deleted all sensors associated with the subscription.

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/offboard-popup.png" alt-text="Select the checkbox and select offboard to offboard your sensor.":::

1. Select the **Offboard** button. 

## Next steps

[Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md)
