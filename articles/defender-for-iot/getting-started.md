---
title: Getting Started
description: Get started with understanding the basic workflow for Defender for IoT deployment.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: shhazam-ms
manager: rkarlin
editor: ''
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/26/2020
ms.author: shhazam
---

# Getting started with Defender for IoT

This article provides an overview of the steps you’ll take to set up Defender for IoT. The process requires that you:

- Register your subscription and sensors on the Azure Defender for IoT portal.
- Install the sensor and on-premises management console software.
- Perform initial activation of the sensor and management console.

## Permission Requirements

Some of the steps carried out during setup require specific user permissions.

**Sensor and On-Premises Management Console Permission Requirements**

Administrative user permissions are required to activate the sensor and management console; upload SSL/TLS certificates and generate new passwords.

**Azure Defender for IoT Portal Permission Requirements**

The following describes user access permissions to Azure Defender for IoT portal tools.

| Permission | Security reader | Security administrator | Subscription contributor | Subscription owner |
|--|--|--|--|--|
| View all Defender for IoT screens and data | ✓ | ✓ | ✓ | ✓ |
| Onboard a sensor  |  |  ✓ | ✓ | ✓ |
| Update pricing  |  |  ✓ | ✓ | ✓ |
| Recover password  | ✓  |  ✓ | ✓ | ✓ |

## 1. Identify the solution infrastructure

**Clarify your network setup needs**

Research your network architecture, monitored bandwidth, and other network details. For more information, see [About Azure Defender for IoT network setup](how-to-set-up-your-network.md).

**Clarify which sensors and management console appliances are required to handle the network load**

Azure Defender for IoT supports both physical and virtual deployments.  For the physical deployments, you can purchase various certified appliances. For more information, see [Identify required appliances](how-to-identify-required-appliances.md).

It is recommended to calculate the approximate number of devices that will be monitored.  Later, when you register your Azure subscription to the portal, you will be asked to enter this number. Numbers can be added in intervals of 1000 s. The numbers of devices monitored are referred to as committed devices.

## 2. Register with Azure Defender for IoT

Registration includes:

- Onboarding your Azure subscriptions to Defender for IoT
- Defining committed devices
- Downloading an on-premises management console activation file

To register:

1. Go to the Azure Defender for IoT portal.
1. Select **Onboard subscription**.
1. In the Pricing page, select a subscription or create a new one and add the number of committed devices.
1. Select **Download the on-premises management console** tab and save the downloaded activation file. This file contains the aggregate committed devices defined. The file will be uploaded to the management console after initial login.

## 3. Install and set up the on-premises management console

After acquiring your on-premises management console appliance:

- Download the ISO package from the Azure Defender for IoT portal
- Install the software
- Activate and carry out initial management console set up

To install and set up:

1. Select **Getting Started** from the Defender for IoT portal.
1. Select the **On-premises management console** tab.
1. Choose a version and select **Download**.
1. Install the on-premises management console software. For more information, see [Defender for IoT installation](how-to-install-software.md).
1. Activate and set up the management console. For more information, see [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md).

## 4. Onboard a sensor

Onboarding is carried out by registering the sensor with Azure with Azure Defender for IoT and downloading a sensor activation file.

When onboarding, you will:
1. Define a sensor name and associate it with a subscription.
1. Choose a sensor management mode:

    **Cloud connected sensors:**
    Information detected by the sensor is displayed in the sensor console. In addition, alert information is delivered through an IoT Hub and can be shared with other Azure services, for example Azure Sentinel.

    **Locally managed sensors:** Information detected by sensors is displayed in the sensor console. If you are working in an air-gapped network and want a unified view of all information detected by multiple Locally managed sensors, work with the on-premises management console. 

1. Download  a sensor activation file.

For more information, see [Onboard and manage sensors in the Defender for IoT portal](how-to-manage-sensors-on-the-cloud.md)
## 5. Install and set up the sensor

Download the ISO package from the Azure Defender for IoT portal, install the software and set up the sensor.

To install and set up:

1. Select **Getting Started** from the Defender for IoT portal.
1. Select **Set up sensor**.
1. Choose a version and select **Download**.
1. Install the sensor software. For more information, see [Defender for IoT installation](how-to-install-software.md).
1. Activate and set up your sensor. For more information, see [Sign in and activate a sensor](how-to-activate-and-set-up-your-sensor.md).

## 6. Connect sensors to an on-premises management console

Connect sensors the management console to ensure that:

- Sensors send alert and device inventory information to the on-premises management console.

- The on-premises management console can perform sensor backups, manage alerts detected by sensors, investigate sensor disconnections, and carry out other activity on connected sensors.
- It is recommended to group multiple sensors monitoring the same networks in one zone. By doing this, information collected by multiple sensors will be coalesced.

For more information, see [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console)
## 7. Populate Azure Sentinel with alert information(optional)

Send alert information to Azure Sentinel by configuring Azure Sentinel. See [Connect your data from Defender for IoT to Azure Sentinel](how-to-configure-with-sentinel.md).

## See also

- [Welcome to Azure Defender for IoT](overview.md)

- [Azure Defender for IoT architecture](architecture.md)

- [About Defender for IoT console and cloud users](how-to-create-and-manage-users.md)
