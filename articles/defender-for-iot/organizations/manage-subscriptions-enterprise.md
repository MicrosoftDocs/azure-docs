---
title: Manage Defender for IoT plans on Azure subscriptions
description: Manage Defender for IoT plans on your Azure subscriptions.
ms.date: 07/06/2022
ms.topic: how-to
---

# Manage Defender for IoT plans for Enterprise IoT security monitoring

Enterprise IoT security monitoring with Defender for IoT is managed by an Enterprise IoT plan on your Azure subscription. While you can view your plan in Microsoft Defender for IoT, onboarding and canceling a plan is done in Microsoft 365 Defender.

For each monthly or annual price plan, you'll be asked to define the number of *committed devices*. Committed devices are the approximate number of devices that will be monitored in your enterprise.

For information about OT networks, see [Manage Defender for IoT plans for OT security monitoring](how-to-manage-subscriptions.md).

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- A Microsoft Defender for Endpoint P2 license

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- The following user roles:

    |Identity management  |Roles required  |
    |---------|---------|
    |**In Azure Active Directory**     |   [Global administrator](/azure/active-directory/roles/permissions-reference#global-administrator) for your Microsoft 365 tenant      |
    |**In Azure RBAC**     | [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) for the Azure subscription that you'll be using for the integration        |

## Calculate committed devices for Enterprise IoT monitoring

If you're adding an Enterprise IoT plan with a monthly or annual commitment, you'll be asked to enter the number of committed devices.

We recommend that you make an initial estimate of your committed devices when onboarding your plan. You can skip this procedure if you're adding a trial plan.

**To calculate committed devices:**:

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Devices**. <!--need to validate this-->

1. Add the total number of devices listed on both the **network devices** and **IoT devices** tabs.

    For example: <!--replace this screenshot-->

    :::image type="content" source="media/how-to-manage-subscriptions/eiot-calculate-devices.png" alt-text="Screenshot of network device and IoT devices in the device inventory in Microsoft Defender for Endpoint.":::

    For more information, see the [Defender for Endpoint Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery).

1. Remove any of the following devices, which are *not* considered as committed devices by Defender for IoT:

    - **Public internet IP addresses**
    - **Multi-cast groups**
    - **Broadcast groups**
    - **Inactive devices**: Devices that have no network activity detected for more than 30 days
    - **Endpoints managed by Defender for Endpoint**

1. Round up your total to a multiple of 100.

For example:

- In the Microsoft 365 Defender **Device inventory**, you have *473* network devices and *1206* IoT devices.
- Added together, the total is *1679* devices, and rounded up to a multiple of 100 is **1700**.

Use **1700** as the estimated number of committed devices.

## Onboard an Enterprise IoT plan

This procedure describes how to add an Enterprise IoT plan to your Azure subscription from Microsoft 365 Defender.

**To add an Enterprise IoT plan**:

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select the following options for your plan:

    - **Select an Azure subscription**: Select the Azure subscription that you want to use for the integration. You'll need a [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) role for the subscription.

    > [!TIP]
    > If your subscription isn't listed, check your account details and confirm your permissions with the subscription owner.

    - **Price plan**: Select a trial, monthly, or annual commitment.

        Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes. For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

        Both monthly and annual commitments require that you enter the number of committed devices that you'd calculated earlier.

1. Select the **I accept the terms and conditions** option and then select **Save**.

    For example:

    :::image type="content" source="media/enterprise-iot/defender-for-endpoint-onboard.png" alt-text="Screenshot of the Enterprise IoT tab in Defender for Endpoint." lightbox="media/enterprise-iot/defender-for-endpoint-onboard.png":::

After you've onboarded your plan, you'll see it listed in Defender for IoT in the Azure portal. Go to the Defender for IoT **Pricing** page and find your subscription with the new **Enterprise IoT** plan listed.

On the Defender for IoT **Pricing** page, expand the **Enterprise IoT** site to find your subscription and plan. For example: <!--add image-->

<!--validate this-->

## Edit your Enterprise IoT plan

To edit your plan, such as to edit your commitment level or the number of committed devices, [cancel the plan](#cancel-your-enterprise-iot-plan) and onboard a new plan.

## Cancel your Enterprise IoT plan

You'll need to cancel your plan if you want to edit the details of your plan, such as the price plan or the number of committed devices, or if you no longer need the service.

You'd also need to cancel your plan and onboard again if you need to work with a new payment entity or Azure subscription. <!--right? b/c no need to add more committed devices if they're all managed by mde. no b/c it's only endpoints that get removed, not IT / IoT devices.  -->

**To cancel your Enterprise IoT plan**:

1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select **Cancel plan**. For example:

    :::image type="content" source="media/enterprise-iot/defender-for-endpoint-cancel-plan.png" alt-text="Screenshot of the Cancel plan option on the Microsoft 365 Defender page.":::

After you cancel your plan, the integration stops and you'll no longer get added security value in Microsoft 365 Defender, or detect new Enterprise IoT devices in Defender for IoT.

The cancellation takes effect one hour after confirming the change.  This change will appear on your next monthly statement, and you will be charged based on the length of time the plan was in effect.

> [!IMPORTANT]
> You can also [cancel a plan](how-to-manage-subscriptions.md#cancel-a-defender-for-iot-plan) from Defender for IoT in the Azure portal. However, canceling a plan from the Azure portal removes all Defender for IoT services from the subscription, including both OT and Enterprise IOT plans. Do this with care.
>
> If you've [registered an Enterprise IoT network sensor](eiot-sensor.md) (Public preview), device data collected by the sensor remains in your Microsoft 365 Defender instance. If you're canceling the Enterprise IoT plan because you no longer need the service, make sure to manually delete data from Microsoft 365 Defender as needed.

## Next steps

For more information, see:

- [Defender for IoT subscription billing](billing.md)

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)

- [Create an additional Azure subscription](../../cost-management-billing/manage/create-subscription.md)

- [Upgrade your Azure subscription](../../cost-management-billing/manage/upgrade-azure-subscription.md)
