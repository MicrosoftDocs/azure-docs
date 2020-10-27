---
title: "Quickstart: Enable the service"
description: Learn how to onboard and enable the Defender for IoT security service in your Azure IoT Hub.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''


ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2020
ms.author: mlottner
---

# Quickstart: Onboard Azure Defender for IoT service in IoT Hub

This article provides an explanation of how to enable the Defender for IoT service on your existing IoT Hub. If you don't currently have an IoT Hub, see [Create an IoT Hub using the Azure portal](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal) to get started.

> [!NOTE]
> Defender for IoT currently only supports standard tier IoT Hubs.

## Prerequisites for enabling the service

- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workspace by Defender for IoT; **security alerts** and **recommendations**.
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs.
- IoT Hub (standard tier)
- Meet all [service prerequisites](service-prerequisites.md)

## Enable Defender for IoT on your IoT Hub

To enable security on your IoT Hub:

1. Open your **IoT Hub** in Azure portal.
1. Under the **Security** menu, click **Secure your IoT solution**.

Congratulations! You've completed enabling Defender for IoT on your IoT Hub.

### Geolocation and IP address handling

To secure your IoT solution, IP addresses of incoming and outgoing connections to and from your IoT devices, IoT Edge, and IoT Hub(s) are collected and stored by default. This information is essential to detect abnormal connectivity from suspicious IP sources. For example, when attempts are made to establish connections from an IP source of a known botnet or from an IP source outside your geolocation. Defender for IoT service offers the flexibility to enable and disable collection of IP address data at any time.

To enable or disable collection of IP address data:

1. Open your IoT Hub and then select **Settings** from the **Security** menu.
1. Choose the **Data Collection** screen and modify the geolocation and/or IP handling settings as you wish.

### Log Analytics creation

When Defender for IoT is turned on, a default Azure Log Analytics workspace is created to store raw security events, alerts, and recommendations for your IoT devices, IoT Edge, and IoT Hub. Each month, the first five (5) GB of data ingested per customer to the Azure Log Analytics service  is free. Every GB of data ingested into your Azure Log Analytics workspace is retained at no charge for the first 31 days. Learn more about [Log Analytics](https://azure.microsoft.com/pricing/details/monitor/) pricing.

To change the workspace configuration of Log Analytics:

1. Open your IoT Hub and then select **Settings** from the **Security** menu.
1. Choose the **Data Collection** screen and modify the workspace configuration of Log Analytics settings as you wish.

### Customize your IoT security solution

By default, turning on the Defender for IoT solution automatically secures all IoT Hubs under your Azure subscription.

To turn Defender for IoT service on a specific IoT Hub on or off:

1. Open your IoT Hub and then select **Settings** from the **Security** menu.
1. Choose the **Data Collection** screen and modify the security settings of any IoT hub in your Azure subscription as you wish.

## Next steps

Advance to the next article to configure your solution...

> [!div class="nextstepaction"]
> [Configure your solution](quickstart-configure-your-solution.md)
