---
title: Manage Defender for IoT plans on Azure subscriptions
description: Manage Defender for IoT plans on your Azure subscriptions.
ms.date: 07/06/2022
ms.topic: how-to
---

# Manage Defender for IoT plans

Your Defender for IoT deployment is managed through a Microsoft Defender for IoT plan on your Azure subscription. 

- **For OT networks**, onboard, edit, and cancel Defender for IoT plans from Defender for IoT in the Azure portal. 
- **For Enterprise IoT networks**, onboard and cancel Defender for IoT plans in Microsoft Defender for Endpoint.

For each plan, you'll be asked to define the number of *committed devices*. Committed devices are the approximate number of devices that will be monitored in your enterprise. 

> [!NOTE]
> If you've come to this page because you are a [former CyberX customer](https://blogs.microsoft.com/blog/2020/06/22/microsoft-acquires-cyberx-to-accelerate-and-secure-customers-iot-deployments) and have questions about your account, reach out to your account manager for guidance.


## Subscription billing

You're billed based on the number of committed devices associated with each subscription.

The billing cycle for Microsoft Defender for IoT follows a calendar month. Changes you make to committed devices during the  month are implemented one hour after confirming your update and are reflected in your monthly bill. Removal of Defender for IoT from a subscription also takes effect one hour after canceling a plan.

Your enterprise may have more than one paying entity. If so, you can onboard, edit, or cancel a plan for more than one subscription.

Before you add a plan or services, we recommend that you have a sense of how many devices you would like to monitor. If you're working with OT networks, see [Best practices for planning your OT network monitoring](plan-network-monitoring.md).

Users can also work with a trial commitment, which supports monitoring a limited number of devices for 30 days. For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

## Prerequisites

Before you onboard a plan, verify that:

- Your Azure account is set up.
- You have the required Azure [user permissions](getting-started.md#permissions).

### Azure account subscription requirements

To get started with Microsoft Defender for IoT, you must have a Microsoft Azure account subscription.

If you don't have a subscription, you can sign up for a free account. For more information, see https://azure.microsoft.com/free/.

If you already have access to an Azure subscription, but it isn't listed when adding a Defender for IoT plan, check your account details and confirm your permissions with the subscription owner. For more information, see https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade.

### User permission requirements

Azure **Security admin**, **Subscription owners** and **Subscription contributors** can onboard, update, and remove Defender for IoT plans. For more information on user permissions, see [Defender for IoT user permissions](getting-started.md#permissions).

### Defender for IoT committed devices

When onboarding or editing your Defender for IoT plan, you'll need to know how many devices you want to monitor.

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

#### Calculate the number of devices you need to monitor

We recommend making an initial estimate of your committed devices when onboarding your Defender for IoT plan.

**For OT devices**:

1. Collect the total number of devices at each site in your network, and add them together.

1. Remove any devices that are [*not* considered as committed devices by Defender for IoT](#defender-for-iot-committed-devices).

After you've set up your network sensor and have full visibility into all devices, you can [Edit a plan](#edit-a-plan-for-ot-networks) to update the number of committed devices as needed.

**For Enterprise IoT devices**:

In the **Device inventory** page in the **Defender for Endpoint** portal:

1. Add the total number of discovered **network devices** with the total number of discovered **IoT devices**. 

    For example: 

    :::image type="content" source="media/how-to-manage-subscriptions/eiot-calculate-devices.png" alt-text="Screenshot of network device and IoT devices in the device inventory in Microsoft Defender for Endpoint.":::

    For more information, see the [Defender for Endpoint Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery).

1. Remove any devices that are [*not* considered as committed devices by Defender for IoT](#defender-for-iot-committed-devices).

1. Round up your total to a multiple of 100.

    For example: In the device inventory, you have 473 network devices and 1206 IoT devices. Added together the total is 1679 devices, and rounded up to a multiple of 100 is 1700. Use 1700 as the estimated number of committed devices.  
 
To edit the number of committed Enterprise IoT devices after you've onboarded a plan, you will need to cancel the plan and onboard a new plan in Defender for Endpoint. For more information, see the [Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

## Onboard a Defender for IoT plan for OT networks

This procedure describes how to add a Defender for IoT plan for OT networks to an Azure subscription.

**To onboard a Defender for IoT plan for OT networks:**

1. In the Azure portal, go to **Defender for IoT** > **Pricing**.

1. Select **Add plan**.

1. In the **Purchase** pane, define the plan:

     - **Purchase method**. Select a monthly or annual commitment, or a [trial](#about-defender-for-iot-trials). Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes.
    
        For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

    - **Subscription**. Select the subscription where you would like to add a plan.

    - **Number of sites** (for annual commitment only). Enter the number of committed sites.

    - **Committed devices**. If you selected a monthly or annual commitment, enter the number of assets you'll want to monitor. If you selected a trial, this section doesn't appear as you have a default of 100 devices.

    For example: 

    :::image type="content" source="media/how-to-manage-subscriptions/onboard-plan-2.png" alt-text="Screenshot of adding a plan for OT networks to your subscription.":::

1. Select the **I accept the terms** option, and then select **Save**.

Your OT networks plan will be shown under the associated subscription in the **Plans** grid. 

## Onboard a Defender for IoT plan for Enterprise IoT networks

Onboard your Defender for IoT plan for Enterprise IoT networks in the Defender for Endpoint portal. For more information, see [Onboard Microsoft Defender for IoT](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration) in the Defender for Endpoint documentation.

Once you've onboarded a plan for Enterprise IoT networks from Defender for Endpoint, you'll see the plan in Defender for IoT in the Azure portal, under the associated subscription in the **Plans** grid, on the **Defender for IoT** > **Pricing** page.

### About Defender for IoT trials

If you would like to evaluate Defender for IoT, you can use a trial commitment.

The trial is valid for 30 days and supports 1000 committed devices. Using the trial lets you deploy one or more Defender for IoT sensors on your network to monitor traffic, analyze data, generate alerts, learn about network risks and vulnerabilities, and more.

The trial also allows you to install an on-premises management console to view aggregated information generated by sensors.

## Edit a plan for OT networks

You can make changes to your OT networks plan, such as to change your plan commitment, update the number of committed devices, or committed sites.

For example, you may have more devices that require monitoring if you're increasing existing site coverage, have discovered more devices than expected, or there are network changes such as adding switches. If the actual number of devices exceeds the number of committed devices on your plan, you'll see a warning on the **Pricing** page, and will need to adjust the number of committed devices on your plan accordingly.

**To edit a plan:**

1. In the Azure portal, go to **Defender for IoT** > **Pricing**.

1. On the subscription row, select the options menu (**...**) at the right.

1. Select **Edit plan**.

1. Make your changes as needed: 

   - Change your purchase method
   - Update the number of committed devices
   - Update the number of sites (annual commitments only)

1. Select the **I accept the terms** option, and then select **Save**.

Changes to your plan will take effect one hour after confirming the change.  This change will appear on your next monthly statement, and you will be charged based on the length of time each plan was in effect.

> [!NOTE]
> **For an on-premises management console:**
 After any changes are made, you will need to upload a new activation file to your on-premises management console. The activation file reflects the new number of committed devices. For more information, see [Upload an activation file](how-to-manage-the-on-premises-management-console.md#upload-an-activation-file).

## Cancel a Defender for IoT plan from a subscription

You may need to cancel a Defender for IoT plan from your Azure subscription, for example, if you need to work with a new payment entity. Your changes take effect one hour after confirmation. This change will be reflected in your upcoming monthly statement, and you will only be charged for the time that the subscription was active.
This option removes all Defender for IoT services from the subscription, including both OT and Enterprise IOT services.

Delete all sensors that are associated with the subscription prior to removing the plan. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

**To cancel Defender for IoT from a subscription:**

1. In the Azure portal, go to **Defender for IoT** > **Pricing**.

1. On the subscription row, select the options menu (**...**) at the right.

1. Select **Cancel plan**.

1.  In the plan cancellation dialog, confirm that you've removed all associated sensors, and then select **Confirm cancellation** to cancel the Defender for IoT plan from the subscription.

> [!NOTE]
> To remove Enterprise IoT only from your plan, cancel your plan from Microsoft Defender for Endpoint. For more information, see the [Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration#cancel-your-defender-for-iot-plan).

> [!IMPORTANT]
> If you are a Microsoft Defender for IoT customer and also have a subscription to Microsoft Defender for Endpoint, the data collected by Microsoft Defender for IoT will automatically populate in your Microsoft Defender for Endpoint instance as well. Customers who want to delete their data from Defender for IoT must also delete their data from Defender for Endpoint.

## Move existing sensors to a different subscription

Business considerations may require that you apply your existing IoT sensors to a different subscription than the one you’re currently using. To do this, you'll need to onboard a new plan to the new subscription, register the sensors under the new subscription, and then remove them from the previous subscription.

Billing changes will take effect one hour after cancellation of the previous subscription, and will be reflected on the next month's bill. Devices will be synchronized from the sensor to the new subscription automatically. Manual edits made in the portal will not be migrated. New alerts created by the sensor will be created under the new subscription, and existing alerts in the old subscription can be closed in bulk.

**To switch to a new subscription**:

**For OT sensors**:

1. In the Azure portal, [onboard a new plan for OT networks](#onboard-a-defender-for-iot-plan-for-ot-networks) to the new subscription you want to use. 

1. Create a new activation file by [following the steps to onboard an OT sensor](onboard-sensors.md#onboard-ot-sensors). 
    - Replicate site and sensor hierarchy as is.
    - For sensors monitoring overlapping network segments, create the activation file under the same zone. Identical devices that are detected in more than one sensor in a zone, will be merged into one device.  

1. [Upload a new activation file](how-to-manage-individual-sensors.md#upload-new-activation-files) for your sensors under the new subscription.

1. Delete the sensor identities from the previous subscription. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

1. If relevant, [cancel the Defender for IoT plan](#cancel-a-defender-for-iot-plan-from-a-subscription) from the previous subscription.

**For Enterprise IoT sensors**:

1. In Defender for Endpoint, [onboard a new plan for Enterprise IoT networks](#onboard-a-defender-for-iot-plan-for-enterprise-iot-networks) to the new subscription you want to use.

1. In the Azure portal, [follow the steps to register an Enterprise IoT sensor](tutorial-getting-started-eiot-sensor.md#register-an-enterprise-iot-sensor) under the new subscription.

1. Log into your sensor and run the activation command you saved when registering the sensor under the new subscription.

1. Delete the sensor identities from the previous subscription. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

1. If relevant, [cancel the Defender for IoT plan](#cancel-a-defender-for-iot-plan-from-a-subscription) from the previous subscription.

> [!NOTE]
> If the previous subscription was connected to Microsoft Sentinel, you will need to connect the new subscription to Microsoft Sentinel and remove the old subscription. For more information, see [Connect Microsoft Defender for IoT with Microsoft Sentinel](/azure/sentinel/iot-solution).

## Next steps

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)

- [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md)

- [Create an additional Azure subscription](../../cost-management-billing/manage/create-subscription.md)

- [Upgrade your Azure subscription](../../cost-management-billing/manage/upgrade-azure-subscription.md)
