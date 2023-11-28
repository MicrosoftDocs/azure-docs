---
title: Manage EIoT monitoring support | Microsoft Defender for IoT
description: Learn how to manage your EIoT monitoring support with Microsoft Defender for IoT.
ms.date: 09/13/2023
ms.topic: how-to
ms.custom: enterprise-iot
#CustomerIntent: As a Defender for IoT customer, I want to understand how to manage my EIoT monitoring support with Microsoft Defender for IoT so that I can best plan my deployment.
---

# Manage enterprise IoT monitoring support with Microsoft Defender for IoT

Enterprise IoT security monitoring with Defender for IoT is supported by a Microsoft 365 E5 (ME5) or E5 Security license, or extra standalone, per-device licenses purchased as add-ons to Microsoft Defender for Endpoint.

This article describes how to:

- Calculate the devices detected in your environment so that you can understand if you need extra, standalone licenses.
- Cancel support for enterprise IoT monitoring with Microsoft Defender for IoT

If you're looking to manage OT plans, see [Manage Defender for IoT plans for OT security monitoring](how-to-manage-subscriptions.md).

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- One of the following sets of licenses:

    - A Microsoft 365 E5 (ME5) or E5 Security license and a Microsoft Defender for Endpoint P2 license
    - A Microsoft Defender for Endpoint P2 license alone

    For more information, see [Enterprise IoT security in Microsoft Defender XDR](concept-enterprise.md#enterprise-iot-security-in-microsoft-365-defender).

- Access to the Microsoft Defender Portal as a [Global administrator](../../active-directory/roles/permissions-reference.md#global-administrator)

## Obtain a standalone, Enterprise IoT trial license

This procedure describes how to start using a trial, standalone license for enterprise IoT monitoring, for customers who have a Microsoft Defender for Endpoint P2 license only.

Customers with ME5/E5 Security plans have support for enterprise IoT monitoring available on by default, and don't need to start a trial. For more information, see [Get started with enterprise IoT monitoring in Microsoft Defender XDR](eiot-defender-for-endpoint.md).

Start your enterprise IoT trial using the [Microsoft Defender for IoT - EIoT Device License - add-on wizard](https://signup.microsoft.com/get-started/signup?products=b2f91841-252f-4765-94c3-75802d7c0ddb&ali=1&bac=1) or via the Microsoft 365 admin center.


**To start an Enterprise IoT trial**:

1. Go to the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home#/catalog) > **Marketplace**.

1. Search for the **Microsoft Defender for IoT - EIoT Device License - add-on** and filter the results by **Other services**. For example:

    :::image type="content" source="media/enterprise-iot/eiot-standalone.png" alt-text="Screenshot of the Marketplace search results for the EIoT Device License.":::

    > [!IMPORTANT]
    > The prices shown in this image are for example purposes only and are not intended to reflect actual prices.
    >

1. Under **Microsoft Defender for IoT - EIoT Device License - add-on**, select **Details**.

1. On the **Microsoft Defender for IoT - EIoT Device License - add-on** page, select **Start free trial**. On the **Check out** page, select **Try now**.

> [!TIP]
> Make sure to [assign your licenses to specific users](/microsoft-365/admin/manage/assign-licenses-to-users) to start using them.
>

For more information, see [Free trial](billing.md#free-trial).

## Calculate monitored devices for Enterprise IoT monitoring

Use the following procedure to calculate how many devices you need to monitor if:

- You're an ME5/E5 Security customer and thinks you need to monitor more devices than the devices allocated per ME5/E5 Security license
- You're a Defender for Endpoint P2 customer who's purchasing standalone enterprise IoT licenses

**To calculate the number of devices you're monitoring:**:

1. In [Microsoft Defender XDR](https://security.microsoft.com/), select **Assets** \> **Devices** to open the **Device inventory** page.

1. Add the total number of devices listed on both the **Network devices** and **IoT devices** tabs.

    For example:

    :::image type="content" source="media/how-to-manage-subscriptions/eiot-calculate-devices.png" alt-text="Screenshot of network device and IoT devices in the device inventory in Microsoft Defender for Endpoint." lightbox="media/how-to-manage-subscriptions/eiot-calculate-devices.png":::

1. Round up your total to a multiple of 100 and compare it against the number of licenses you have.

For example:

- In the Microsoft Defender XDR **Device inventory**, you have *473* network devices and *1206* IoT devices.
- Added together, the total is *1679* devices.
- You have 320 ME5 licenses, which cover **1600** devices

You need **79** standalone devices to cover the gap.

For more information, see the [Defender for Endpoint Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery).

> [!NOTE]
> Devices listed on the **Computers & Mobile** tab, including those managed by Defender for Endpoint or otherwise, are not included in the number of [devices](billing.md#defender-for-iot-devices) monitored by Defender for IoT.

## Purchase standalone licenses

Purchase standalone, per-device licenses if you're an ME5/E5 Security customer who needs more than the five devices allocated per license, or if you're a Defender for Endpoint customer who wants to add enterprise IoT security to your organization.

**To purchase standalone licenses**:

1. Go to the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home#/catalog) **Billing > Purchase services**. If you don't have this option, select **Marketplace** instead.

1. Search for the **Microsoft Defender for IoT - EIoT Device License - add-on** and filter the results by **Other services**. For example:

    :::image type="content" source="media/enterprise-iot/eiot-standalone.png" alt-text="Screenshot of the Marketplace search results for the EIoT Device License.":::

    > [!IMPORTANT]
    > The prices shown in this image are for example purposes only and are not intended to reflect actual prices.
    >

1. On the **Microsoft Defender for IoT - EIoT Device License - add-on** page, enter your selected license quantity, select a billing frequency, and then select **Buy**.

For more information, see the [Microsoft 365 admin center help](/microsoft-365/admin/).

## Turn off enterprise IoT security

This procedure describes how to turn off enterprise IoT monitoring in Microsoft Defender XDR, and is supported only for customers who don't have any standalone, per-device licenses added on to Microsoft Defender XDR.

Turn off the **Enterprise IoT security** option if you're no longer using the service. 

**To turn off enterprise IoT monitoring**:

1. In [Microsoft Defender XDR](https://security.microsoft.com/), select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Toggle the option to **Off**.

You stop getting security value in Microsoft Defender XDR, including purpose-built alerts, vulnerabilities, and recommendations.

### Cancel a legacy Enterprise IoT plan

If you have a legacy Enterprise IoT plan, are *not* an ME5/E5 Security customer, and no longer to use the service, cancel your plan as follows:

1. In [Microsoft Defender XDR](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select **Cancel plan**. This page is available only for legacy Enterprise IoT plan customers.

After you cancel your plan, the integration stops and you'll no longer get added security value in Microsoft Defender XDR, or detect new Enterprise IoT devices in Defender for IoT.

The cancellation takes effect one hour after confirming the change.  This change appears on your next monthly statement, and you're charged based on the length of time the plan was in effect.

> [!IMPORTANT]
>
> If you've [registered an Enterprise IoT network sensor](eiot-sensor.md) (Public preview), device data collected by the sensor remains in your Microsoft Defender XDR instance. If you're canceling the Enterprise IoT plan because you no longer need the service, make sure to manually delete data from Microsoft Defender XDR as needed.

## Next steps

For more information, see:

- [Securing IoT devices in the enterprise](concept-enterprise.md)
- [Defender for IoT subscription billing](billing.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Create an additional Azure subscription](../../cost-management-billing/manage/create-subscription.md)
- [Upgrade your Azure subscription](../../cost-management-billing/manage/upgrade-azure-subscription.md)
