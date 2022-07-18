---
title: Get started with Microsoft Defender for IoT
description: In this quickstart, set up a trial for Microsoft Defender for IoT and understand next steps required to configure your network sensors.
ms.topic: quickstart
ms.date: 03/24/2022
---

# Quickstart: Get started with Defender for IoT

This quickstart takes you through the initial steps of setting up Defender for IoT, including:

- Add Defender for IoT to an Azure subscription
- Identify and plan solution architecture

You can use this procedure to set up a Defender for IoT trial. The trial provides 30-day support for 1000 devices and a virtual sensor, which you can use to monitor traffic, analyze data, generate alerts, understand network risks and vulnerabilities and more.

## Prerequisites

Before you start, make sure that you have:

- An Azure account. If you don't already have an Azure account, you can [create your free Azure account today](https://azure.microsoft.com/free/).

- Access to an Azure subscription with the subscription **Owner** or **Contributor** role.

If you're using a Defender for IoT sensor version earlier than 22.1.x, you must also have an Azure IoT Hub (Free or Standard tier) **Contributor** role, for cloud-connected management. Make sure that the **Microsoft Defender for IoT** feature is enabled.

### Permissions

Defender for IoT users require the following permissions:

| Permission | Security reader | Security admin | Subscription contributor | Subscription owner |
|--|--|--|--|--|
| Onboard subscriptions and update committed devices  |  | ✓ | ✓ | ✓ |
| Onboard sensors  |  |  ✓ | ✓ | ✓ |
| View details and access software, activation files and threat intelligence packages  | ✓ | ✓ | ✓ | ✓ |
| Recover passwords  | ✓  |  ✓ | ✓ | ✓ |

For more information, see [Azure roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

### Supported service regions

Defender for IoT routes all traffic from all European regions to the *West Europe* regional datacenter. It routes traffic from all remaining regions to the *Central US* regional datacenter.

If you're using a legacy version of the sensor traffic and are connecting through your own IoT Hub, the IoT Hub supported regions are also relevant for your organization. For more information, see [IoT Hub supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).

## Identify and plan your OT solution architecture

If you're working with an OT network, we recommend that you identify system requirements and plan your system architecture before you start, even if you plan to start with a trial subscription.

> [!NOTE]
> If you're setting up network monitoring for Enterprise IoT systems, you can skip directly to [Add a Defender for IoT plan to an Azure subscription](#add-a-defender-for-iot-plan-to-an-azure-subscription).

**When working with an OT network**:

- To deploy Defender for IoT, you'll need network switches that support traffic monitoring via a SPAN port and hardware appliances for NTA sensors.

   For on-premises machines, including network sensors, on-premises management consoles and for air-gapped environments you'll need administrative user permissions for activities. These include activation, managing SSL/TLS certificates, managing passwords, and so on.

- Research your own network architecture and monitor bandwidth. Check requirements for creating certificates and other network details, and clarify the sensor appliances you'll need for your own network load.

   Calculate the approximate number of devices you'll be monitoring. Devices can be added in intervals of **100**, such as **100**, **200**, **300**. The numbers of monitored devices are called *committed devices*. For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device)

Microsoft Defender for IoT supports both physical and virtual deployments. For physical deployments, you'll be able to purchase certified, preconfigured appliances, or download software to install yourself.

For more information, see:

- [Best practices for planning your OT network monitoring](best-practices/plan-network-monitoring.md)
- [Sensor connection methods](architecture-connections.md)
- [Prepare your OT network for Microsoft Defender for IoT](how-to-set-up-your-network.md)
- [Predeployment checklist](pre-deployment-checklist.md)
- [Identify required appliances](how-to-identify-required-appliances.md)

## Add a Defender for IoT plan to an Azure subscription

This procedure describes how to add a Defender for IoT plan to an Azure subscription.

**To add a Defender for IoT plan to an Azure subscription:**

1. In the Azure portal, go to **Defender for IoT** > **Plans and pricing**.

1. Select **Add plan**.

1. In the **Plan settings** pane, define the plan:

    - **Subscription**. Select the subscription where you would like to add a plan.
    - Toggle on the **OT - Operational / ICS networks** and/or **EIoT - Enterprise IoT for corporate networks**  options as needed for your network types.
    - **Price plan**. Select a monthly or annual commitment, or a [trial](how-to-manage-subscriptions.md#about-defender-for-iot-trials). Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes.

        For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/).

    - **Committed sites** (for OT annual commitment only). Enter the number of committed sites.

    - **Number of devices**. If you selected a monthly or annual commitment, enter the number of devices you'll want to monitor. If you selected a trial, this section doesn't appear as you have a default of 1000 devices.

    :::image type="content" source="media/how-to-manage-subscriptions/onboard-plan.png" alt-text="Screenshot of adding a plan to your subscription." lightbox="media/how-to-manage-subscriptions/onboard-plan.png":::

1. Select **Next**.

1. **Review & purchase**. Review the listed charges for your selections and **accept the terms and conditions**.

1. Select **Purchase**.

Your plan will be shown under the associated subscription in the **Plans and pricing** grid.

For more information, see [Manage your subscriptions](how-to-manage-subscriptions.md).

## Next steps

Continue with one of the following tutorials, depending on whether you're setting up a network for OT system security or Enterprise IoT system security:

- [Tutorial: Get started with OT network security](tutorial-onboarding.md)
- [Tutorial: Get started with Enterprise IoT network security](tutorial-getting-started-eiot-sensor.md)

For more information, see:

- [Welcome to Microsoft Defender for IoT for organizations](overview.md)
- [Microsoft Defender for IoT architecture](architecture.md)