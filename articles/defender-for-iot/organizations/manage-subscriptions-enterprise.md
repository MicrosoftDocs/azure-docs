---
title: Manage eIoT monitoring support | Microsoft Defender for IoT
description: Learn how to manage your eIoT monitoring support with Microsoft Defender for IoT.
ms.date: 09/13/2023
ms.topic: how-to
ms.custom: enterprise-iot
#CustomerIntent: As a Defender for IoT customer, I want to understand how to manage my eIoT monitoring support with Microsoft Defender for IoT so that I can best plan my deployment.
---

# Manage enterprise IoT monitoring support with Microsoft Defender for IoT

Enterprise IoT security monitoring with Defender for IoT is supported by a Microsoft 365 E5 (ME5) or E5 Security license, or extra standalone, per-device licenses purchased as add-ons to Microsoft Defender for Endpoint.

This article describes how to:

- Calculate the devices detected in your environment so that you can understand if you need extra, standalone licenses.
- Cancel support for enterprise IoT monitoring with Microsoft Defender for IoT

<!--
Enterprise IoT security monitoring with Defender for IoT is managed by an Enterprise IoT plan on your Azure subscription. While you can view your plan in Microsoft Defender for IoT, onboarding and canceling a plan is done with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) in Microsoft 365 Defender.

For each monthly price plan, you'll be asked to define an approximate number of [devices](billing.md#defender-for-iot-devices) that you want to monitor and cover by your plan.
-->

If you're looking to manage OT plans, see [Manage Defender for IoT plans for OT security monitoring](how-to-manage-subscriptions.md).

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- One of the following sets of licenses:

    - A Microsoft 365 E5 (ME5) or E5 Security license and a Microsoft Defender for Endpoint P2 license
    - A Microsoft Defender for Endpoint P2 license alone, together with standalone, per-device licenses for enterprise IoT monitoring added on

- Access to the Microsoft 365 Defender portal as a [Global administrator](../../active-directory/roles/permissions-reference.md#global-administrator)

<!--do you no longer need an azure subscription?>
- An Azure subscription. If you need to, [sign up for a free account](https://azure.microsoft.com/free/).


- The following user roles:

    - **In Azure Active Directory**:
    - **In Azure RBAC**:  [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) for the Azure subscription that you'll be using for the integration
-->

## Obtain a trial license

This procedure describes how to start using a trial, standalone license for enterprise IoT monitoring, for customers who have a Microsoft Defender for Endpoint P2 license only.

Customers with ME5/E5 Security plans have support for enterprise IoT monitoring available on by default, and don't need to start a trial.

1. Go to the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home#/catalog) > **Trials**.

1. In the **Security trials** area, locate the **Secure your IoT devices with Defender for IoT** card.

1. Select **Learn more** > **Start trial**.

For more information, see [Free trial](billing.md#free-trial).

## Calculate monitored devices for Enterprise IoT monitoring

Use the following procedure to calculate how many devices you need to monitor if:

- You're an ME5/E5 Security customer and thinks you'll need to monitor more devices than the devices allocated per ME5/E5 Security license
- You're a Defender for Endpoint P2 customer who's purchasing standalone enterprise IoT licenses

**To calculate the number of devices you're monitoring:**:

1. In [Microsoft 365 Defender](https://security.microsoft.com/), select **Assets** \> **Devices** to open the **Device inventory** page.

1. Add the total number of devices listed on both the **Network devices** and **IoT devices** tabs.

    For example:

    :::image type="content" source="media/how-to-manage-subscriptions/eiot-calculate-devices.png" alt-text="Screenshot of network device and IoT devices in the device inventory in Microsoft Defender for Endpoint." lightbox="media/how-to-manage-subscriptions/eiot-calculate-devices.png":::

1. Round up your total to a multiple of 100 and compare it against the number of licenses you have.

For example:

- In the Microsoft 365 Defender **Device inventory**, you have *473* network devices and *1206* IoT devices.
- Added together, the total is *1679* devices.
- You have 320 ME5 licenses, which covers **1600** devices

You'll need **79** standalone devices to cover the gap.
<!-- amit is this a good example-->
For more information, see the [Defender for Endpoint Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery).

> [!NOTE]
> Devices listed on the **Computers & Mobile** tab, including those managed by Defender for Endpoint or otherwise, are not included in the number of [devices](billing.md#defender-for-iot-devices) monitored by Defender for IoT.

## Purchase standalone licenses

Purchase standalone, per-device licenses if you are an ME5/E5 Security customer who needs more than the 5 devices allocated per license, or if you're a Defender for Endpoint customer who wants to add enterprise IoT security to your organization.

**To purchase standalone licenses**:

1. Go to the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home#/catalog) **Billing > Purchase services**. If you don't have this option, select **Marketplace** instead.

1. Search for **Microsoft Defender for IoT** and locate the **Microsoft Defender for IoT - Enterprise IoT** item.

1. Enter the number of licenses you want to purchase and select **Details** > **Purchase**.
<!--is this correct?-->
For more information, see the [Microsoft 365 admin center help](/microsoft-365/admin/).

## Turn off enterprise IoT security

This procedure describes how to turn off enterprise IoT monitoring in Microsoft 365 Defender, and is supported only for customers who don't have any standalone, per-device licenses added on to Microsoft 365 Defender.

Turn off the **Enterprise IoT security** option if you are no longer using the service. 

**To turn off enterprise IoT monitoring**:

1. In [Microsoft 365 Defender](https://security.microsoft.com/), select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Toggle the option to **Off**. <!--For example:-->

You'll stop getting security value in Microsoft 365 Defender, including purpose-built alerts, vulnerabilities, and recommendations.

### Cancel a legacy Enterprise IoT plan

If you have a legacy Enterprise IoT plan, are *not* an ME5/E5 Security customer, and no longer to use the service, cancel your plan as follows:

1. In [Microsoft 365 Defender](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select **Cancel plan**. This page is available only for legacy Enterprise IoT plan customers.

After you cancel your plan, the integration stops and you'll no longer get added security value in Microsoft 365 Defender, or detect new Enterprise IoT devices in Defender for IoT.

The cancellation takes effect one hour after confirming the change.  This change will appear on your next monthly statement, and you will be charged based on the length of time the plan was in effect.

> [!IMPORTANT]
>
> If you've [registered an Enterprise IoT network sensor](eiot-sensor.md) (Public preview), device data collected by the sensor remains in your Microsoft 365 Defender instance. If you're canceling the Enterprise IoT plan because you no longer need the service, make sure to manually delete data from Microsoft 365 Defender as needed.

## Next steps

For more information, see:

- [Securing IoT devices in the enterprise](concept-enterprise.md)
- [Defender for IoT subscription billing](billing.md)
