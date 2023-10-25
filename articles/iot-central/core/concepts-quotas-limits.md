---
title: Azure IoT Central quotas and limits
description: This article lists the key quotas and limits that apply to an IoT Central application including from the underlying DPS and IoT Hub services.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central

---

# Quotas and limits

There are various quotas and limits that apply to IoT Central applications. IoT Central applications internally use multiple Azure services such as IoT Hub and the Device Provisioning Service (DPS), and these services also have quotas and limits. Where relevant, quotas and limits in the underlying services are called out in this article.

> [!NOTE]
> The quotas and limits described in this article apply to the new multiple IoT hub architecture. Currently, there are a few legacy IoT Central applications that were created before April 2021 that haven't yet been migrated to the multiple IoT hub architecture. Use the `az iot central device manual-failover` command in the [Azure CLI](/cli/azure/?view=azure-cli-latest&preserve-view=true) to check if your application still uses a single IoT hub. This triggers an IoT hub failover if your application uses the multiple IoT hub architecture. It returns an error if your application uses the older architecture.

## Devices

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of devices in an application | 1,000,000 | Contact support to discuss increasing this quota for your application. |
| Number of IoT Central simulated devices in an application | 100 | Contact support to discuss increasing this quota for your application. |

## Telemetry

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of telemetry messages per second per device| 10 | If you need to exceed this limit, contact support to discuss increasing it for your application. |
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

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Query API requests per second | 1 | If you need to exceed this limit, contact support to discuss increasing it for your application. |
| Other API requests per second | 20 | If you need to exceed this limit, contact support to discuss increasing it for your application. |

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

## Device modeling

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of device templates in an application | 1,000 | For performance reasons, you shouldn't exceed this limit. |
| Number of capabilities in a device template | 300 | For performance reasons, you shouldn't exceed this limit. |

## Device groups

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of device groups in an application | 1,000 | For performance reasons, you shouldn't exceed this limit. |
| Number of filters in a device group | 100 | For performance reasons, you shouldn't exceed this limit. |

## Device provisioning

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of devices registrations per minute | 200 | The underlying DPS instance sets this quota. Contact support to discuss increasing this quota for your application. |

## Rules

| Item | Quota or limit | Notes |
| ---- | -------------- | ----- |
| Number of rules in an application | 50 | Contact support to discuss increasing this quota for your application. |
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
