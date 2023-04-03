---
title: Manage OT plans on Azure subscriptions
description: Manage Microsoft Defender for IoT plans for OT monitoring on your Azure subscriptions.
ms.date: 11/07/2022
ms.topic: how-to
---

# Manage OT plans on Azure subscriptions

Your Defender for IoT deployment is managed through a Microsoft Defender for IoT plan on your Azure subscription. For OT networks, use Defender for IoT in the Azure portal to onboard, edit, and cancel Defender for IoT plans.

If you're looking to manage Enterprise IoT plans, see [Manage Defender for IoT plans for Enterprise IoT security monitoring](manage-subscriptions-enterprise.md).

> [!NOTE]
> If you've come to this page because you are a [former CyberX customer](https://blogs.microsoft.com/blog/2020/06/22/microsoft-acquires-cyberx-to-accelerate-and-secure-customers-iot-deployments) and have questions about your account, reach out to your account manager for guidance.

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).

- A [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user role for the Azure subscription that you'll be using for the integration

### Calculate committed devices for OT monitoring

If you're working with a monthly or annual commitment, you'll need to periodically update the number of *committed devices* in your plan as your network grows.

**To calculate committed devices:**:

1. Collect the total number of devices at each site in your network, and add them together.

1. Remove any of the following devices, which are *not* considered as committed devices by Defender for IoT:

    - **Public internet IP addresses**
    - **Multi-cast groups**
    - **Broadcast groups**
    - **Inactive devices**: Devices that have no network activity detected for more than 60 days

For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device)

## Onboard a Defender for IoT plan for OT networks

This procedure describes how to add a Defender for IoT plan for OT networks to an Azure subscription.

**To onboard a Defender for IoT plan for OT networks**:

1. In the Azure portal, go to **Defender for IoT** > **Plans and pricing**.

1. Select **Add plan**.

1. In the **Plan settings** pane, define the plan:

    - **Subscription**. Select the subscription where you would like to add a plan.

        You'll need a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role for the subscription.

        > [!TIP]
        > If your subscription isn't listed, check your account details and confirm your permissions with the subscription owner.

     - **Price plan**. Select a monthly or annual commitment, or a [trial](billing.md#free-trial).

        Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes. Any usage beyond 30 days incurs a charge based on the monthly plan for 1,000 devices. For more information, see [the Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

    - **Committed sites**. Relevant for annual commitments only. Enter the number of committed sites.

    - **Number of devices**. If you selected a monthly or annual commitment, enter the number of [committed devices](#calculate-committed-devices-for-ot-monitoring) you'll want to monitor. If you select a trial, there is a default of 1000 devices.

    For example:

    :::image type="content" source="media/how-to-manage-subscriptions/onboard-ot-plans-pricing.png" alt-text="Screenshot of the plan settings pane to add or edit a plan for OT networks." lightbox="media/how-to-manage-subscriptions/onboard-ot-plans-pricing.png":::

1. Select **Next**.

1. Review your plan, select the **I accept the terms** option, and then select **Purchase**.

Your new plan is listed under the relevant subscription in the **Plans** grid.

## Edit a plan for OT networks

Edit your Defender for IoT plans for OT networks if you need change your plan commitment or update the number of committed devices or sites.

For example, you may have more devices that require monitoring if you're increasing existing site coverage, have discovered more devices than expected, or there are network changes such as adding switches.

**To edit a plan:**

1. In the Azure portal, go to **Defender for IoT** > **Plans and pricing**.

1. On the subscription row, select the options menu (**...**) at the right > select **Edit plan**.

1. Make any of the following changes as needed:

   - Change your price plan from a trial to a monthly or annual commitment
   - Update the number of [committed devices](#calculate-committed-devices-for-ot-monitoring)
   - Update the number of sites (annual commitments only)

1. Select the **I accept the terms** option, and then select **Purchase**.

1. After any changes are made, make sure to reactivate your sensors. For more information, see [Reactivate an OT sensor](how-to-manage-sensors-on-the-cloud.md#reactivate-an-ot-sensor).

1. If you have an on-premises management console, make sure to upload a new activation file, which reflects the changes made. For more information, see [Upload a new activation file](how-to-manage-the-on-premises-management-console.md#upload-a-new-activation-file).

Changes to your plan will take effect one hour after confirming the change. This change will appear on your next monthly statement, and you'll be charged based on the length of time each plan was in effect.

## Cancel a Defender for IoT plan

You may need to cancel a Defender for IoT plan from your Azure subscription, for example, if you need to work with a new payment entity, or if you no longer need the service.

> [!IMPORTANT]
> Canceling a plan removes all Defender for IoT services from the subscription, including both OT and Enterprise IoT services. If you have an Enterprise IoT plan on your subscription, do this with care.
>
> To cancel only an Enterprise IoT plan, do so from Microsoft 365. For more information, see [Cancel your Enterprise IoT plan](manage-subscriptions-enterprise.md#cancel-your-enterprise-iot-plan).
>

**Prerequisites**: Before canceling your plan, make sure to delete any sensors that are associated with the subscription. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

**To cancel a Defender for IoT plan for OT networks**:

1. In the Azure portal, go to **Defender for IoT** > **Plans and pricing**.

1. On the subscription row, select the options menu (**...**) at the right and select **Cancel plan**.

1. In the cancellation dialog, select **I agree** to cancel the Defender for IoT plan from the subscription.

Your changes take effect one hour after confirmation. This change will be reflected in your upcoming monthly statement, and you'll only be charged for the time that the subscription was active.

## Move existing sensors to a different subscription

Business considerations may require that you apply your existing IoT sensors to a different subscription than the one you’re currently using. To do this, you'll need to onboard a new plan to the new subscription, register the sensors under the new subscription, and then remove them from the previous subscription.

Billing changes will take effect one hour after cancellation of the previous subscription, and will be reflected on the next month's bill.

- Devices will be synchronized from the sensor to the new subscription automatically.

- Manual edits made in the portal won't be migrated.

- New alerts created by the sensor will be created under the new subscription, and existing alerts in the old subscription can be closed in bulk.

**To switch sensors to a new subscription**:

1. In the Azure portal, [onboard a new plan for OT networks](#onboard-a-defender-for-iot-plan-for-ot-networks) to the new subscription you want to use.

1. Create a new activation file by [following the steps to onboard an OT sensor](onboard-sensors.md).

    - Replicate site and sensor hierarchy as is.

    - For sensors monitoring overlapping network segments, create the activation file under the same zone. Identical devices that are detected in more than one sensor in a zone, will be merged into one device.

1. [Upload a new activation file](how-to-manage-individual-sensors.md#upload-a-new-activation-file) for your sensors under the new subscription.

1. Delete the sensor identities from the previous subscription. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

1. If relevant, cancel the Defender for IoT plan from the previous subscription. For more information, see [Cancel a Defender for IoT plan](#cancel-a-defender-for-iot-plan).


> [!NOTE]
> If the previous subscription was connected to Microsoft Sentinel, you'll need to connect the new subscription to Microsoft Sentinel and remove the old subscription. For more information, see [Connect Microsoft Defender for IoT with Microsoft Sentinel](../../sentinel/iot-solution.md).

## Next steps

For more information, see:

- [Defender for IoT subscription billing](billing.md)

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)

- [Activate and set up an on-premises management console](ot-deploy/activate-deploy-management.md)

- [Create an additional Azure subscription](../../cost-management-billing/manage/create-subscription.md)

- [Upgrade your Azure subscription](../../cost-management-billing/manage/upgrade-azure-subscription.md)
