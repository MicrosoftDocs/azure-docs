---
title: Get started with Microsoft Defender for IoT
description: In this quickstart, set up a trial for Microsoft Defender for IoT and understand next steps required to configure your network sensors.
ms.topic: quickstart
ms.date: 03/24/2022
---

# Quickstart: Get started with Defender for IoT

This quickstart takes you through the initial steps of setting up Defender for IoT, including:

- Add an Azure subscription to Defender for IoT
- Identify and plan solution architecture

You can use this procedure to set up a Defender for IoT trial. The trial provides 30-day support for 1000 devices and a virtual sensor, which iyou can use to monitor traffic, analyze data, generate alerts, understand network risks and vulnerabilities and more.

## Prerequisites

Before you start, make sure that you have:

- An Azure account. If you do not already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

- Access to an Azure subscription with the **Subscription Contributor** role.

If you are using a Defender for IoT sensor version earlier than 22.1.x, you must also have an Azure IoT Hub (Free or Standard tier) **Contributor** role, for cloud-connected management. Make sure that the **Microsoft Defender for IoT** feature is enabled.

Later on, you'll need the following permissions to use Defender for IoT:

| Permission | Security reader | Security admin | Subscription contributor | Subscription owner |
|--|--|--|--|--|
| Onboard subscriptions and update committed devices  |  | ✓ | ✓ | ✓ |
| Onboard sensors  |  |  ✓ | ✓ | ✓ |
| View details and access software, activation files and threat intelligence packages  | ✓ | ✓ | ✓ | ✓ |
| Recover passwords  | ✓  |  ✓ | ✓ | ✓ |

### Supported service regions

Defender for IoT routes all traffic from all European regions to the *West Europe* regional datacenter. It routes traffic from all remaining regions to the *Central US* regional datacenter.

If you are using a legacy version of the sensor traffic  are connecting sensors through your own IoT Hub, the IoT Hub supported regions are also relevant for your organization. For more information, see [IoT Hub supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).

## Identify and plan your solution architecture

Before start working with Defender for IoT, especially if you plan to start with a trial subscription, we recommend identifying your system requirements and planning your system architecture.

- To deploy Defender for IoT, you'll need network switches that support traffic monitoring via a SPAN port and hardware appliances for NTA sensors.

   For on-premises machines, including network sensors and on-premises management consoles for air-gapped environments, you'll need administrative user permissions for activities such as activation, managing SSL/TLS certificates, managing passwords, and so on.

- Research your own network architecture and monitor bandwidth. Check requirements for creating certificates and other network details, and clarify the sensor appliances you'll need for your own network load.

   Calculate the approximate number of devices you'll be monitoring. Devices can be added in intervals of **1,000**, such as **1000**, **2000**, **3000**. The numbers of monitored devices are called *committed devices*.

Microsoft Defender for IoT supports both physical and virtual deployments. For physical deployments, you'll be able to purchase certified appliances with software pre-installed, or download software to install yourself.

For more information, see:

- [Best practices for planning your OT network monitoring](plan-network-monitoring.md)
- [Prepare your network for Microsoft Defender for IoT](how-to-set-up-your-network.md)
- [Predeployment checklist](predeployment-checklist.md)
- [Identify required appliances](how-to-identify-required-appliances.md).

## Add a subscription to Defender for IoT

This procedure describes how to add a new Azure subscription to Defender for IoT.

**To add your subscription**

1. In the Azure portal, go to **Defender for IoT** > **Pricing**.

1. Select **Add** to add a new subscription, and then define the following values:

   - **Purchase method**. Select a monthly or annual commitment, or a trial. Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes.

        For more information, see the **Microsoft Defender for IoT** section of the [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/en-us/pricing/details/defender-for-cloud/).

   - **Subscription**. Select a subscription where you have a **Subscription Contributor** role.

   - **Committed devices**. If you selected a monthly or annual commitment, enter the number of devices you'll want to monitor. If you selected a trial, this section does not appear as you have a default of 1000 devices.

1. Select the **I accept the terms** option, and then select **Save**.

Your subscription is shown in the **Pricing** grid. For example:

:::image type="content" source="media/getting-started/pricing.png" alt-text="Screenshot of the Pricing page in Defender for IoT.":::

For more information, see [Manage Defender for IoT subscriptions](how-to-manage-subscriptions.md).

## Next steps

Continue with one of the following tutorials, depending on whether you're setting up a network for OT system security or Enterprise IoT system security:

- [Tutorial: Get started with OT network security](tutorial-onboarding.md)
- [Tutorial: Get started with Enterprise IoT network security](tutorial-getting-started-eiot-sensor.md)

For more information, see:

- [Welcome to Microsoft Defender for IoT for organizations](overview.md)
- [Microsoft Defender for IoT architecture](architecture.md)

## MOVE ALL BELOW THIS LINE TO SOMEWHERE ELSE
### Install and set up the on-premises management console

This section is required only when you are using a Defender for IoT sensor version lower than 22.1.x.

After you acquire your on-premises management console appliance:

- Download the ISO package from the Azure portal.
- Install the software.
- Activate and carry out initial management console setup.

**To install and set up**:

1. Go to [Defender for IoT: Getting Started](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) in the Azure portal.

1. Select the **On-premises management console** tab.

1. Choose a version and select **Download**.

1. Install the on-premises management console software. For more information, see [Defender for IoT installation](how-to-install-software.md).

1. Activate and set up the management console. For more information, see [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md).

### Onboard a sensor

Onboard a sensor by registering it with Microsoft Defender for IoT and downloading a sensor activation file:

1. Define a sensor name and associate it with a subscription.

1. Choose a sensor connection mode:

   - **Cloud connected sensors**: Information that sensors detect is displayed in the sensor console. In addition, alert information is delivered to Azure and can be shared with other Azure services, such as Microsoft Sentinel. You can also choose to automatically push threat intelligence packages from Defender for IoT to your sensors. For more information, see [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md).

   - **Locally managed sensors**: Information that sensors detect is displayed in the sensor console. If you're working in an air-gapped network and want a unified view of all information detected by multiple locally managed sensors, work with the on-premises management console.

1. Select a site to associate your sensor to. Define the display name, and zone. You can also add descriptive tags. The display name, zone, and tags are descriptive entries on the [Sites and Sensors page](how-to-manage-sensors-on-the-cloud.md#manage-on-boarded-sensors).

1. Select **Register**.

1. Select **Download activation file**.

For details about onboarding, see [Onboard and manage sensors with Defender for IoT](how-to-manage-sensors-on-the-cloud.md).

### Install and set up the sensor

Download the ISO package from the Azure portal, install the software, and set up the sensor.

1. Go to [Defender for IoT: Getting started](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) in the Azure portal.

1. Select **Set up sensor**.

1. Choose a version and select **Download**.

1. Install the sensor software. For more information, see [Defender for IoT installation](how-to-install-software.md).

1. Activate and set up your sensor. For more information, see [Sign in and activate a sensor](how-to-activate-and-set-up-your-sensor.md).

### Connect sensors to Defender for IoT

This section is required only when you are using a Defender for IoT sensor version 22.1.x or higher.

Connect your sensors to Defender for IoT to ensure that sensors send alert and device inventory information to Defender for IoT on the Azure portal.

For more information, see [Sensor connection methods](architecture-connections.md) and [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md)
.

### Connect sensors to an on-premises management console

Connect sensors to the management console to ensure that:

- Sensors send alert and device inventory information to the on-premises management console.

- The on-premises management console can perform sensor backups, manage alerts that sensors detect, investigate sensor disconnections, and carry out other activity on connected sensors.

We recommend that you group multiple sensors monitoring the same networks in one zone. Doing this will coalesce information collected by multiple sensors.

For more information, see [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console).


