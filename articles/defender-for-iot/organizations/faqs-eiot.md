---
title: FAQs for Enterprise IoT networks - Microsoft Defender for IoT
description: Find answers to the most frequently asked questions about Microsoft Defender for IoT Enterprise IoT networks.
ms.topic: faq
ms.date: 06/05/2023
ms.custom: enterprise-iot
---

# Enterprise IoT network security frequently asked questions

This article provides a list of frequently asked questions about securing Enterprise IoT networks with Microsoft Defender for IoT.

## What is the difference between OT and Enterprise IoT?

### Operational Technology (OT)

OT network sensors use agentless, patented technology to discover, learn, and continuously monitor network devices for a deep visibility into Operational Technology (OT) / Industrial Control System (ICS) risks. Sensors carry out data collection, analysis, and alerting on-site, making them ideal for locations with low bandwidth or high latency.

### Enterprise IoT

Enterprise IoT provides visibility and security for IoT devices in the corporate environment.

Enterprise IoT network protection extends agentless features beyond operational environments, providing coverage for all IoT devices in your environment. For example, an enterprise IoT environment may include printers, cameras, and purpose-built, proprietary, devices.

## What additional security value can Enterprise IoT provide Microsoft Defender for Endpoint customers?

Enterprise IoT is designed to help customers secure un-managed devices throughout the organization and extend IT security to also cover IoT devices. The solution leverages multiple means in order to ensure optimal coverage.

- **In the Microsoft Defender for Endpoint portal**: This is the GA offering for Enterprise IoT. Microsoft 365 P2 customers already have visibility for discovered IoT devices in the **Device inventory** page in Defender for Endpoint. Customers can onboard an Enterprise IoT plan in the same portal and gain security value by viewing alerts, recommendations and vulnerabilities for their discovered IoT devices.

    For more information, see [Onboard with Microsoft Defender for IoT](eiot-defender-for-endpoint.md).

- **In the Azure portal**: Defender for IoT customers can view their discovered IoT devices in the **Device inventory** page in [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal.

    For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

## How can I start using Enterprise IoT?

To get started, Microsoft 365 P2 customers need to [add a Defender for IoT plan with Enterprise IoT](eiot-defender-for-endpoint.md) to an Azure subscription from the Microsoft Defender for Endpoint portal.

If you’re a Defender for Endpoint customer, when adding your Defender for IoT plan, take care to exclude any devices already [managed by Defender for Endpoint](/microsoft-365/security/defender-endpoint/device-discovery) from your count of devices you want to monitor.

## What permissions do I need to add a Defender for IoT plan? Can I use any Azure subscription?

For information on required permissions, see [Prerequisites](eiot-defender-for-endpoint.md#prerequisites).

## Which devices are billable?

For more information about billable devices, see [Devices monitored by Defender for IoT](architecture.md#devices-monitored-by-defender-for-iot).

## How should I estimate the number of devices I want to monitor?

In the **Device inventory** in Defender for Endpoint:

Add the total number of discovered network devices with the total number of discovered IoT devices. Round that up to a multiple of 100, and that is the number of devices to enter.

For more information, see [Devices monitored by Defender for IoT](architecture.md#devices-monitored-by-defender-for-iot).

## How does the integration between Microsoft Defender for Endpoint and Microsoft Defender for IoT work?

Once you've [added a Defender for IoT plan with Enterprise IoT to an Azure subscription in Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration#onboard-a-defender-for-iot-plan), integration between the two products takes place seamlessly.

Discovered IoT devices can be viewed in both Defender for IoT and Defender for Endpoint. For more information, see [Defender for IoT integration](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

## Can I change the subscription I’m using for Defender for IoT?

To change the subscription you're using for your Defender for IoT plan, you'll need to cancel your plan on the existing subscription, and then onboard a new plan to a new subscription. Your existing data won't be migrated to the new subscription. For more information, see [Manage Defender for IoT plans for Enterprise IoT security monitoring](manage-subscriptions-enterprise.md).

## How can I edit my plan in Defender for Endpoint?

To make any changes to an existing plan, you'll need to cancel your existing plan and onboard a new plan with the new details. Changes might include moving billing charges from one subscription to another, changing the number of devices you want to cover, or changing the plan commitment from a trial to a monthly commitment.

## How can I cancel Enterprise IoT?

To remove only Enterprise IoT from your plan, cancel your plan from Microsoft Defender for Endpoint. For more information, see [Cancel your Defender for IoT plan](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration#cancel-your-defender-for-iot-plan).

To cancel the plan and remove all Defender for IoT services from the associated subscription, cancel the plan in [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal. For more information, see [Cancel your Enterprise IoT plan](manage-subscriptions-enterprise.md#cancel-your-enterprise-iot-plan).

## What happens when the 30-day trial ends?

If you haven't changed your plan from a trial to a monthly commitment by the time your trial ends, your plan is automatically canceled, and you’ll lose access to Defender for IoT security features.

To change your plan from a trial to a monthly commitment before the end of the trial, you'll need to cancel your trial plan and onboard a new plan in Defender for Endpoint. For more information, see [Defender for IoT integration](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

## How can I resolve billing issues associated with my Defender for IoT plan?

For any billing or technical issues, create a support request in the Azure portal.

## Next steps

For more information on getting started with Enterprise IoT, see:

- [Securing IoT devices in the enterprise](concept-enterprise.md)
- [Enable Enterprise IoT security in Defender for Endpoint](eiot-defender-for-endpoint.md)
- [Manage Defender for IoT plans for Enterprise IoT security monitoring](manage-subscriptions-enterprise.md)
