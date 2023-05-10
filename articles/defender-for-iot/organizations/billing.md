---
title: Subscription billing
description: Learn how you're billed for the Microsoft Defender for IoT service on your Azure subscription.
ms.topic: concept-article
ms.date: 10/30/2022
ms.custom: enterprise-iot
---

# Defender for IoT subscription billing

As you plan your Microsoft Defender for IoT deployment, you typically want to understand the Defender for IoT pricing plans and billing models so you can optimize your costs.

## Free trial

If you would like to evaluate Defender for IoT, you can use a trial license for 60 days.

- **For OT networks**, use a trial to deploy one or more Defender for IoT sensors on your network to monitor traffic, analyze data, generate alerts, learn about network risks and vulnerabilities, and more. An OT trial incudes a *Small* sized license, which supports 250 [committed devices](#defender-for-iot-committed-devices), which are the number of devices you want to monitor in your network.

<!--what happens when the trial is up?
    The trial for OT networks is free of charge for the first 30 days. Any usage beyond 30 days incurs a charge based on the monthly plan for 1,000 devices. For more information, see [the Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).-->

- **For Enterprise IoT networks**, use a trial to view alerts, recommendations, and vulnerabilities in Microsoft 365. An Enterprise IoT trial is not limited to a specific number of devices.

## Defender for IoT committed devices

When purchasing a Defender for IoT license for an OT plan, or when onboarding or editing a monthly Enterprise IoT plan, we recommend that you have a sense of how many *committed devices* you'll want to cover. *Committed devices* are the devices being monitored by your Defender for IoT plan.

- **OT monitoring**: Purchase a license for each site that you're planning to monitor. License fees differ based on the number of committed devices covered in each license.

- **Enterprise IoT monitoring**: You're billed based on the number of committed devices associated with each subscription.

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

For more information, see [the Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/) and [Start a Microsoft Defender for IoT trial](getting-started.md).

### Device coverage warning

<!--how is this changing?-->
If the number of actual devices detected by Defender for IoT exceeds the number of committed devices currently listed on your subscription, a warning message will appear in Defender for IoT in the Azure portal. For example:

:::image type="content" source="media/billing/device-coverage-warning.png" alt-text="Screenshot of the device coverage warning.":::

This message indicates that you need to update the number of committed devices on the relevant subscription to match the actual number of devices being monitored.

To update the number of committed devices, edit your plan from the **Plans and pricing** page. For more information, see [Manage OT plans on Azure subscriptions](how-to-manage-subscriptions.md#edit-a-plan-for-ot-networks).

> [!NOTE]
> This warning is a reminder for you to update the number of committed devices for your subscription, and does not affect Defender for IoT functionality.

## Billing cycles and changes in your plans

<!--is this still correct?-->
Billing cycles for Microsoft Defender for IoT follow each a calendar month. Changes you make to Defender for IoT plans are implemented one hour after confirming the updated, and are reflected in your monthly bill.

Canceling a Defender for IoT plan from your Azure subscription also takes effect one hour after canceling the plan.

Your company may have more than one paying entity. If so, you can onboard, edit, or cancel a plan for more than one subscription.

## Next steps

For more information, see:

- The [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/)
- [Manage Defender for IoT plans for OT monitoring](how-to-manage-subscriptions.md)
- [Manage Defender for IoT plans for Enterprise IoT monitoring](manage-subscriptions-enterprise.md)