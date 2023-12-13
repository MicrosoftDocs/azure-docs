---
title: Microsoft Defender for IoT billing
description: Learn how you're billed for the Microsoft Defender for IoT service.
ms.topic: concept-article
ms.date: 11/07/2023
ms.custom: enterprise-iot
#CustomerIntent: As a Defender for IoT customer, I want to understand how I'm billed for Defender for IoT services so that I can best plan my deployment.
---

# Defender for IoT billing

As you plan your Microsoft Defender for IoT deployment, you typically want to understand the Defender for IoT pricing plans and billing models so you can optimize your costs.

**OT monitoring** is billed using site-based licenses, where each license applies to an individual site, based on the site size. A site is a physical location, such as a facility, campus, office building, hospital, rig, and so on. Each site can contain any number of network sensors, all which monitor devices detected in connected networks.

**Enterprise IoT** monitoring supports 5 devices per Microsoft 365 E5 (ME5) or E5 Security license, or is available as standalone, per-device licenses for Microsoft Defender for Endpoint P2 customers.

## Free trial

To evaluate Defender for IoT, start a free trial as follows:

- **For OT networks**, use a trial license for 60 days. Deploy one or more Defender for IoT sensors on your network to monitor traffic, analyze data, generate alerts, learn about network risks and vulnerabilities, and more. An OT trial supports a **Large** site license for 60 days. For more information, see [Start a Microsoft Defender for IoT trial](getting-started.md).

- **For Enterprise IoT networks**, use a trial, standalone license for 90 days as an add-on to Microsoft Defender for Endpoint. Trial licenses support 100 devices. For more information, see [Securing IoT devices in the enterprise](concept-enterprise.md) and [Enable Enterprise IoT security with Defender for Endpoint](eiot-defender-for-endpoint.md).

## Defender for IoT devices

We recommend that you have a sense of how many devices you want to monitor so that you know how many OT sites you need to license, or if you need any standalone licenses for enterprise IoT security.

- **OT monitoring**: Purchase a license for each site that you're planning to monitor. License fees differ based on the site size, each which covers a different number of devices.

- **Enterprise IoT monitoring**: Five devices are supported for each ME5/E5 Security user license. If you have more devices to monitor, and are a Defender for Endpoint P2 customer, purchase extra, standalone licenses for each device you want to monitor.

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

## Next steps

For more information, see:

- [Manage Defender for IoT plans for OT monitoring](how-to-manage-subscriptions.md)
- [Manage Defender for IoT plans for Enterprise IoT monitoring](manage-subscriptions-enterprise.md)
- [Operational Technology (OT) networks frequently asked questions](faqs-ot.md)
- [Microsoft Defender for IoT Plans and Pricing](https://www.microsoft.com/en-us/security/business/endpoint-security/microsoft-defender-iot-pricing)
