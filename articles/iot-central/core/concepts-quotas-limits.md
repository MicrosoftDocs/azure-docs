---
title: Azure IoT Central quotas and limits
description: This article lists the key quotas and limits that apply to an IoT Central application including from the underlying DPS and IoT Hub services.
author: dominicbetts
ms.author: dobett
ms.date: 10/26/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central

---

# Quotas and limits

There are various quotas and limits that apply to IoT Central applications. IoT Central applications internally use multiple Azure services such as IoT Hub and the Device Provisioning Service (DPS), and these services also have quotas and limits. Where relevant, quotas and limits in the underlying services are called out in this article.

## Devices

| Item | Quota or limit |
| ---- | -------------- |
| Number of devices in an application | 200,000 |
| Number of IoT Central simulated devices in an application | 100 |

## Telemetry

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of messages per second per application | 200 | Individual devices can temporarily send up to 10 messages per second. |
| Maximum size of a device-to-cloud message | 256 KB | The IoT Hub service sets this value. |
| Maximum size of a cloud-to-device message | 64 KB | The IoT Hub service sets this value. |

## Property updates

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of property updates per second | 100 | This limit is a soft limit. IoT Central autoscales the application as needed<sup>1</sup>. |
| Properties | Maximum size of desired properties and reported properties sections are 32 KB each. Maximum size of tags section is 8 KB. Maximum size of each individual property in every section is 4 KB. | The IoT Hub service sets these values. |

## Commands

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of command executions per second | 20 | This limit is a soft limit. IoT Central autoscales the application as needed<sup>1</sup>. |

## REST API calls

| Item | Quota or limit |
| ---- | -------------- |
| Query API requests per second | 1 |
| Other API requests per second | 20 |

## Storage

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Maximum data retention in days | 30 | If you need to keep data for longer, use data export to export it to external storage. |

## Data export

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of data export jobs | 10 | If you need to exceed this limit, contact support to discuss increasing it for your application. |
| Number of data export destinations | 10 | If you need to exceed this limit, contact support to discuss increasing it for your application. |
| Number of data export destinations per job | 10 | If you need to exceed this limit, contact support to discuss increasing it for your application. |
| Number of filters and enrichments per data export job | 10 | If you need to exceed this limit, contact support to discuss increasing it for your application. |

For large volumes of export data, you may experience up to 60 seconds of latency. Typically, the latency is much lower than this.

## Device modeling

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of device templates in an application | 1,000 | For performance reasons, you shouldn't exceed this limit. |
| Number of capabilities in a device template | 300 | For performance reasons, you shouldn't exceed this limit. |

## Device groups

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of device groups in an application | 500 | For performance reasons, you shouldn't exceed this limit. |
| Number of filters in a device group | 100 | For performance reasons, you shouldn't exceed this limit. |

## Device provisioning

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of devices registrations per minute | 200 | The underlying DPS instance sets this quota. |

## Rules

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of rules in an application | 50 | This quota is fixed and can't be changed. |
| Number of actions in a rule | 5 | This quota is fixed and can't be changed. |
| Number of alerts for an email action | One alert every minute per rule | This quota is fixed and can't be changed. |
| Number of alerts for a webhook action | One alert every 10 seconds per action | This quota is fixed and can't be changed. |
| Number of alerts for a Power Automate action | One alert every 10 seconds per action | This quota is fixed and can't be changed. |
| Number of alerts for an Azure Logic App action | One alert every 10 seconds per action | This quota is fixed and can't be changed. |
| Number of alerts for an Azure Monitor Group action | One alert every 10 seconds per action | This quota is fixed and can't be changed. |

## Jobs

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of concurrent job executions | 5 | For performance reasons, you shouldn't exceed this limit. |

## Users, roles, and organizations

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Maximum user role assignments per application | 200 | This limit isn't the same as the number of users per application. |
| Maximum roles per application | 50 | This limit includes the default application and organization roles. |
| Maximum organizations per application| 200 | |
| Maximum organization hierarchy depth | 5 | |

<sup>1</sup> IoT Central doesn't limit the amount of device-to-cloud, cloud-to-device, property, or command traffic. It has variable throttles based on the application's load profile. If your application starts sending more traffic, IoT Central autoscales to best suit the load profile. You might notice throttling messages for a short period of time until IoT Central completes the autoscale process.

## Next steps

Now that you've learned about the quotas and limits that apply to Azure IoT Central, the suggested next step is to learn about [Azure IoT Central architecture](concepts-architecture.md).
