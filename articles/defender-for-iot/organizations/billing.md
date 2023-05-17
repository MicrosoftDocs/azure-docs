---
title: Subscription billing
description: Learn how you're billed for the Microsoft Defender for IoT service on your Azure subscription.
ms.topic: concept-article
ms.date: 10/30/2022
ms.custom: enterprise-iot
---

# Defender for IoT subscription billing

As you plan your Microsoft Defender for IoT deployment, you typically want to understand the Defender for IoT pricing plans and billing models so you can optimize your costs.

OT monitoring is billed using site-based licenses, where each license applies to an individual site, based on the site size. A site is a physical location, such as a facility, campus, office building, hospital, rig, and so on. Each site can contain any number of network sensors, all which monitor devices detected in connected networks.


## Free trial

If you would like to evaluate Defender for IoT, you can use a trial license for 60 days.

- **For OT networks**, use a trial to deploy one or more Defender for IoT sensors on your network to monitor traffic, analyze data, generate alerts, learn about network risks and vulnerabilities, and more. An OT trial incudes a *Large* sized license, which supports 1,000 [devices](#defender-for-iot-devices).

<!--what happens when the trial is up?
    The trial for OT networks is free of charge for the first 30 days. Any usage beyond 30 days incurs a charge based on the monthly plan for 1,000 devices. For more information, see [the Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).-->

- **For Enterprise IoT networks**, use a trial to view alerts, recommendations, and vulnerabilities in Microsoft 365. An Enterprise IoT trial is not limited to a specific number of devices.

## Defender for IoT devices

When purchasing a Defender for IoT license for an OT plan, or when onboarding or editing a monthly Enterprise IoT plan, we recommend that you have a sense of how many devices you'll want to cover. 

- **OT monitoring**: Purchase a license for each site that you're planning to monitor. License fees differ based on the site size, each which covers a different number of devicves.

- **Enterprise IoT monitoring**: You're billed based on the number of committed devices associated with each subscription.

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

For more information, see [Start a Microsoft Defender for IoT trial](getting-started.md).

### Device coverage warning

<!--how is this changing?-->
If the number of actual devices detected by Defender for IoT exceeds the number of committed devices currently listed on your subscription, a warning message will appear in Defender for IoT in the Azure portal. For example:

:::image type="content" source="media/billing/device-coverage-warning.png" alt-text="Screenshot of the device coverage warning.":::

This message indicates that you need to do one of the following:

- **OT monitoring**: Purchase a new license for a larger site size. For more information, see <m365 on cancellation policies>.
- **Enterprise IoT monitoring**: [Update the number of devices for your plan](manage-subscriptions-enterprise.md) to match the actual number of devices being monitored.    Billing cycles for Enterprise IoT plans follow each a calendar month. Changes you make to an Enterprise IoT plan are implemented one hour after confirming the updated, and are reflected in your monthly bill.


> [!NOTE]
> This warning is a reminder for you to update your plan, and does not affect Defender for IoT functionality.

## Billing cycles and changes in your plans

For information about OT plans, see <xref to M365 docs>.



## Next steps

For more information, see:

- The [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/)
- [Manage Defender for IoT plans for OT monitoring](how-to-manage-subscriptions.md)
- [Manage Defender for IoT plans for Enterprise IoT monitoring](manage-subscriptions-enterprise.md)