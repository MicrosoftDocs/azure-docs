---
title: Get started with OT network security monitoring - Microsoft Defender for IoT
description: Use this quickstart to set up a trial OT plan with Microsoft Defender for IoT and understand the next steps required to configure your network sensors.
ms.topic: get-started
ms.date: 12/25/2022
---

# Quickstart: Get started with OT network security monitoring

This quickstart describes how to set up a trial plan for OT security monitoring with Microsoft Defender for IoT.

A trial plan for OT monitoring provides 30-day support for 1000 devices. Use this trial with a [virtual sensor](tutorial-onboarding.md) or on-premises sensors to monitor traffic, analyze data, generate alerts, understand network risks and vulnerabilities, and more.

## Prerequisites

Before you start, make sure that you have:

- An Azure account. If you don't already have an Azure account, you can [create your free Azure account today](https://azure.microsoft.com/free/).

- Access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner). For more information, see [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md).

## Identify and plan your OT solution architecture

We recommend that you identify system requirements and plan your OT network monitoring architecture before you start, even if you're starting with a trial subscription.

- Make sure that you have network switches that support [traffic monitoring](best-practices/traffic-mirroring-methods.md) via a SPAN port and TAPs  (Test Access Points).

- Research your own network architecture and decide which and how much data you'll want to monitor. Check any requirements for creating certificates and other details, and [understand where on your network](best-practices/understand-network-architecture.md) you'll want to place your OT network sensors.

- If you want to use on-premises sensors, make sure that you have the [hardware appliances](ot-appliance-sizing.md) for those sensors and any administrative user permissions.

For more information, see the [OT monitoring predeployment checklist](pre-deployment-checklist.md).

## Add a trial Defender for IoT plan for OT networks

This procedure describes how to add a trial Defender for IoT plan for OT networks to an Azure subscription.

**To add your plan**:

1. In the Azure portal, go to [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) and select **Plans and pricing** > **Add plan**.

1. In the **Plan settings** pane, define the following settings:

   - **Subscription**: Select the Azure subscription where you want to add a plan. You'll need a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role for the selected subscription.

        > [!TIP]
        > If your subscription isn't listed, check your account details and confirm your permissions with the subscription owner. Also make sure that you have the right subscriptions selected in your Azure settings > **Directories + subscriptions** page.

   - **Price plan**: For the sake of this quickstart, select **Trial - 30 days - 1000 assets limit**.

    For example:

    :::image type="content" source="media/getting-started/ot-trial.png" alt-text="Screenshot of adding a plan for OT networks to your subscription.":::

1. Select **Next** to review your selections on the **Review and purchase** tab.

1. On the **Review and purchase** tab, select the **I accept the terms and conditions** option > **Purchase**.

Your new plan is listed under the relevant subscription on the **Plans and pricing** > **Plans** page. For more information, see [Manage your subscriptions](how-to-manage-subscriptions.md).

## Next steps

> [!div class="nextstepaction"]
> [Onboard and activate a virtual OT sensor](tutorial-onboarding.md)

> [!div class="nextstepaction"]
> [Use a pre-configure physical appliance](ot-pre-configured-appliances.md)

> [!div class="nextstepaction"]
> [Understand Defender for IoT subscription billing](billing.md)

> [!div class="nextstepaction"]
> [Defender for IoT pricing](https://azure.microsoft.com/pricing/details/iot-defender/)