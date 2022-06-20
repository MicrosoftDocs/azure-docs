---
title: Manage subscriptions
description: Subscriptions consist of managed committed devices and can be onboarded or offboarded as needed. 
ms.date: 11/09/2021
ms.topic: how-to
---

# Manage your subscriptions

Your Defender for IoT deployment is managed through a Microsoft Defender for IoT plan on your Azure subscriptions. You can onboard, edit, and cancel a Defender for IoT plan from your subscriptions in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).

For each plan, you'll be asked to define the number of *committed devices*. Committed devices are the approximate number of devices that will be monitored in your enterprise. 

> [!NOTE]
> If you've come to this page because you are a [former CyberX customer](https://blogs.microsoft.com/blog/2020/06/22/microsoft-acquires-cyberx-to-accelerate-and-secure-customers-iot-deployments) and have questions about your account, reach out to your account manager for guidance.


## Subscription billing

You're billed based on the number of committed devices associated with each subscription.

The billing cycle for Microsoft Defender for IoT follows a calendar month. Changes you make to committed devices during the  month are implemented one hour after confirming your update and are reflected in your monthly bill. Removal of Defender for IoT from a subscription also takes effect one hour after canceling a plan.

Your enterprise may have more than one paying entity. If so, you can onboard, edit, or cancel a plan for more than one subscription.

Before you add a plan or services, we recommend that you have a sense of how many devices you would like to monitor. If you're working with OT networks, see [Best practices for planning your OT network monitoring](plan-network-monitoring.md).

Users can also work with a trial commitment, which supports monitoring a limited number of devices for 30 days. For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

### What's a device?

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

## Prerequisites

Before you onboard a plan, verify that:

- Your Azure account is set up.
- You have the required Azure [user permissions](getting-started.md#permissions).

### Azure account subscription requirements

To get started with Microsoft Defender for IoT, you must have a Microsoft Azure account subscription.

If you don't have a subscription, you can sign up for a free account. For more information, see https://azure.microsoft.com/free/.

If you already have access to an Azure subscription, but it isn't listed when subscribing to Defender for IoT, check your account details and confirm your permissions with the subscription owner. For more information, see https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade.

### User permission requirements

Azure subscription **Owners** and subscription **Contributors** can onboard, update, and remove Defender for IoT. For more information on user permissions, see [Defender for IoT user permissions](getting-started.md#permissions).

### Calculate the number of devices you need to monitor

When onboarding or editing your Defender for IoT plan, you'll need to know how many devices you want to monitor.

**To calculate the number of devices you need to monitor**:

Collect the total number of devices in your network and remove:

- **Duplicate devices that have the same IP or MAC address**. When detected, the duplicates are automatically removed by Defender for IoT.

- **Duplicate devices that have the same ID**. These are the same devices, seen by the same sensor, with different field values. For such devices, check the last time each device had activity and use the latest device only.

- **Inactive devices**, with no traffic for more than 60 days.

- **Broadcast / multicast devices**. These represent unique addresses but not unique devices.

For more information, see [What's a device?](#whats-a-device)

## Onboard a Defender for IoT plan to a subscription

This section describes how to add a Defender for IoT plan to a subscription.

**To onboard a Defender for IoT plan to a subscription:**

1. In the Azure portal, go to **Defender for IoT** > **Plans and pricing**.

1. Select **Add plan**.

1. In the **Plan settings** pane, define the plan:

    - **Subscription**. Select the subscription where you would like to add a plan.
    - Toggle on the **OT** and/or **Enterprise IoT** options as needed for your network types.
    - **Price plan**. Select a monthly or annual commitment, or a [trial](#about-defender-for-iot-trials). Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes.
    
        For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

    - **Committed sites** (OT only). Enter the number of committed sites.

    - **Number of devices**. If you selected a monthly or annual commitment, enter the number of devices you'll want to monitor. If you selected a trial, this section doesn't appear as you have a default of 1000 devices.

1. Select **Next**.

1. **Review & purchase**. Review the listed charges for your selections and **accept the terms and conditions**. 

1. Select **Purchase**.


### About Defender for IoT trials

If you would like to evaluate Defender for IoT, you can use a trial commitment. The trial is valid for 30 days and supports 1000 committed devices. Using the trial lets you deploy one or more Defender for IoT sensors on your network. Use the sensors to monitor traffic, analyze data, generate alerts, learn about network risks and vulnerabilities, and more. The trial also allows you to download an on-premises management console to view aggregated information generated by sensors.

## Committed devices overage

You may need to add more devices for monitoring after your initial onboarding and commitment.  For example, you may have more devices that require monitoring if you're increasing existing site coverage, have discovered more devices than expected, or there are network changes such as adding switches.

If the actual number of devices exceeds the number of committed devices on your plan, you'll see a warning on the **Plans and pricing** page, and will need to adjust the number of committed devices on your plan accordingly. 

## Edit a plan

You may need to make changes to your plan, such as to update the number of committed devices or committed sites, change your plan commitment, or remove OT or Enterprise IoT from your plan. 

**To edit a plan:**
1. In the Azure portal, go to **Defender for IoT** > **Plans and pricing**.

1. On the subscription row, select the options menu (**...**) at the right.

1. Select **Edit plan**.

1. Make your changes as needed: 
   - Update the number of committed devices
   - Update the number of sites (OT only)
   - Remove OT or EIoT from the plan by turning off the OT or EIoT toggle. 

1. Select **Next**.

1. On the **Review & purchase** pane, review your selections, and then accept the terms and conditions. 

1. Select **Save**.

Changes to your plan will take effect one hour after confirming the change. Billing for these changes will be reflected at the beginning of the month following confirmation of the change.

> [!NOTE]
> **For an on-premises management console:**
 After any changes are made, you will need to upload a new activation file to your on-premises management console. The activation file reflects the new number of committed devices. For more information, see [Upload an activation file](how-to-manage-the-on-premises-management-console.md#upload-an-activation-file).


## Cancel a Defender for IoT plan from a subscription

You may need to cancel a Defender for IoT plan from a subscription, for example, if you need to work with a new payment entity. Your changes take effect one hour after confirmation. Your upcoming monthly bill will reflect this change.
This option removes all Defender for IoT services from the subscription, including both OT and Enterprise IOT services.

Remove all sensors that are associated with the subscription prior to removing the plan. For more information on how to delete a sensor, see [Delete a sensor](how-to-manage-sensors-on-the-cloud.md#manage-on-boarded-sensors).

**To cancel Defender for IoT from a subscription:**

1. In the Azure portal, go to **Defender for IoT** > **Plans and pricing**.

1. On the subscription row, select the options menu (**...**) at the right.

1. Select **Cancel plan**.

1.  In the confirmation popup, select **Confirm cancellation** to remove the Defender for IoT plan from the subscription.


## Move existing sensors to a different subscription

Business considerations may require that you apply your existing IoT sensors to a different subscription than the one you’re currently using. To do this, you'll need to onboard a new plan and register the sensors under the new subscription, and then remove them from the old subscription. This process may include some downtime, and historic data is not migrated.

**To switch to a new subscription**: 

1. [Onboard a new plan to the new subscription you want to use](#onboard-a-defender-for-iot-plan-to-a-subscription) To avoid double billing, onboard the new plan as a [trial](#about-defender-for-iot-trials) until you've removed the sensors from the old subscription. 
1. Register your sensors under the new subscription. For more information, see [Set up an Enterprise IoT sensor](tutorial-getting-started-eiot-sensor.md#set-up-an-enterprise-iot-sensor).
1. Upload a new activation file for your sensors, see [Upload new activation files](how-to-manage-individual-sensors.md#upload-new-activation-files).
1. Remove the sensor identities from the legacy subscription. For more information, see [Manage on-boarded sensors](how-to-manage-sensors-on-the-cloud.md#manage-on-boarded-sensors).
1. If relevant, [cancel the Defender for IoT plan](#cancel-a-defender-for-iot-plan-from-a-subscription) from the legacy subscription.


## Next steps

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)

- [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md)

- [Create an additional Azure subscription](/azure/cost-management-billing/manage/create-subscription)

- [Upgrade your Azure subscription](/azure/cost-management-billing/manage/upgrade-azure-subscription)
