---
title: 'Quickstart: Getting started'
description: In this quickstart, learn how to get started with understanding the basic workflow for Defender for IoT deployment.
ms.topic: quickstart
ms.date: 04/17/2021
---

# Quickstart: Get started with Defender for IoT

This article provides an overview of the steps you'll take to set up Azure Defender for IoT. The process requires that you:

- Register your subscription and sensors on the Azure Defender for IoT portal.
- Install the sensor and on-premises management console software.
- Perform initial activation of the sensor and management console.

## Permission requirements

Some of the setup steps require specific user permissions.

Administrative user permissions are required to activate the sensor and management console, upload SSL/TLS certificates, and generate new passwords.

The following table describes user access permissions to Azure Defender for IoT portal tools:

| Permission | Security reader | Security administrator | Subscription contributor | Subscription owner |
|--|--|--|--|--|
| View details and access software, activation files and threat intelligence packages  | ✓ | ✓ | ✓ | ✓ |
| Onboard a sensor  |  |  ✓ | ✓ | ✓ |
| Update pricing  |  |  ✓ | ✓ | ✓ |
| Recover password  | ✓  |  ✓ | ✓ | ✓ |

## Identify the solution infrastructure

**Clarify your network setup needs**

Research your network architecture, monitored bandwidth, and other network details. For more information, see [About Azure Defender for IoT network setup](how-to-set-up-your-network.md).

**Clarify which sensors and management console appliances are required to handle the network load**

Azure Defender for IoT supports both physical and virtual deployments. For the physical deployments, you can purchase various certified appliances. For more information, see [Identify required appliances](how-to-identify-required-appliances.md).

We recommend that you calculate the approximate number of devices that will be monitored. Later, when you register your Azure subscription to the portal, you'll be asked to enter this number. Numbers can be added in intervals of 1,000 seconds. The numbers of monitored devices are called *committed devices*.

## Register with Azure Defender for IoT

Registration includes:

- Onboarding your Azure subscriptions to Defender for IoT.
- Defining committed devices.
- Downloading an activation file for the on-premises management console.

To register:

1. Go to the Azure Defender for IoT portal.

1. Select **Onboard subscription**.

1. On the **Pricing** page, select a subscription or create a new one, and add the number of committed devices.

1. Select the **Download the on-premises management console** tab and save the downloaded activation file. This file contains the aggregate committed devices that you defined. The file will be uploaded to the management console after initial sign-in.

For information on how to offboard a subscription, see [Offboard a subscription](how-to-manage-subscriptions.md#offboard-a-subscription).

## Install and set up the on-premises management console

After you acquire your on-premises management console appliance:

- Download the ISO package from the Azure Defender for IoT portal.
- Install the software.
- Activate and carry out initial management console setup.

To install and set up:

1. Select **Getting Started** from the Defender for IoT portal.
1. Select the **On-premises management console** tab.
1. Choose a version and select **Download**.
1. Install the on-premises management console software. For more information, see [Defender for IoT installation](how-to-install-software.md).
1. Activate and set up the management console. For more information, see [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md).

## Onboard a sensor ##

Onboard a sensor by registering it with Azure Defender for IoT and downloading a sensor activation file:

1. Define a sensor name and associate it with a subscription.
1. Choose a sensor connection mode:

   - **Cloud connected sensors**: Information that sensors detect is displayed in the sensor console. In addition, alert information is delivered through an IoT hub and can be shared with other Azure services, such as Azure Sentinel.  You can also choose to automatically push threat intelligence packages from the Azure Defender for IoT portal to your sensors. For more information, see [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md).

   - **Locally managed sensors**: Information that sensors detect is displayed in the sensor console. If you're working in an air-gapped network and want a unified view of all information detected by multiple locally managed sensors, work with the on-premises management console.

1. Download a sensor activation file.

For details about onboarding, see [Onboard and manage sensors in the Defender for IoT portal](how-to-manage-sensors-on-the-cloud.md).

## Install and set up the sensor

Download the ISO package from the Azure Defender for IoT portal, install the software, and set up the sensor.

1. Select **Getting Started** from the Defender for IoT portal.

1. Select **Set up sensor**.

1. Choose a version and select **Download**.

1. Install the sensor software. For more information, see [Defender for IoT installation](how-to-install-software.md).

1. Activate and set up your sensor. For more information, see [Sign in and activate a sensor](how-to-activate-and-set-up-your-sensor.md).

## Connect sensors to an on-premises management console

Connect sensors to the management console to ensure that:

- Sensors send alert and device inventory information to the on-premises management console.

- The on-premises management console can perform sensor backups, manage alerts that sensors detect, investigate sensor disconnections, and carry out other activity on connected sensors.

We recommend that you group multiple sensors monitoring the same networks in one zone. Doing this will coalesce information collected by multiple sensors.

For more information, see [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console).

## Populate Azure Sentinel with alert information (optional)

Send alert information to Azure Sentinel by configuring Azure Sentinel. See [Connect your data from Defender for IoT to Azure Sentinel](how-to-configure-with-sentinel.md).

## Next steps ##

[Welcome to Azure Defender for IoT](overview.md)

[Azure Defender for IoT architecture](architecture.md)
