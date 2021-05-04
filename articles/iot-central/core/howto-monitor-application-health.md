---
title: Monitor the health of an Azure IoT Central application | Microsoft Docs
description: As an operator or administrator, monitor the overall health of the devices connected to your IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 01/27/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central

#Customer intent: As an operator, I want to monitor the overall health of the devices and data exports in my IoT Central application.
---

# Monitor the overall health of an IoT Central application

> [!NOTE]
> Metrics are only available for version 3 IoT Central applications. To learn how to check your application version, see [About your application](./howto-get-app-info.md).

*This article applies to operators and administrators.*

In this article, you learn how to use the set of metrics provided by IoT Central to assess the health of devices connected to your IoT Central application and the health of your running data exports.

Metrics are enabled by default for your IoT Central application and you access them from the [Azure portal](https://portal.azure.com/). The [Azure Monitor data platform exposes these metrics](../../azure-monitor/essentials/data-platform-metrics.md) and provides several ways for you to interact with them. For example, you can use charts in the Azure portal, a REST API, or queries in PowerShell or the Azure CLI.

### Trial applications

Applications that use the free trial plan don't have an associated Azure subscription and so don't support Azure Monitor metrics. You can [convert an application to a standard pricing plan](./howto-view-bill.md#move-from-free-to-standard-pricing-plan) and get access to these metrics.

## View metrics in the Azure portal

The following steps assume you have an [IoT Central application](./quick-deploy-iot-central.md) with some [connected devices](./tutorial-connect-device.md) or a running [data export](howto-export-data.md).

To view IoT Central metrics in the portal:

1. Navigate to your IoT Central application resource in the portal. By default, IoT Central resources are located in a resource group called **IOTC**.
1. To create a chart from your application's metrics, select **Metrics** in the **Monitoring** section.

![Azure Metrics](media/howto-monitor-application-health/metrics.png)

### Azure portal permissions

Access to metrics in the Azure portal is managed by [Azure role based access control](../../role-based-access-control/overview.md). Use the Azure portal to add users to the IoT Central application/resource group/subscription to grant them access. You must add a user in the portal even they're already added to the IoT Central application. Use [Azure built-in roles](../../role-based-access-control/built-in-roles.md) for finer grained access control.

## IoT Central metrics

For a list of of the metrics that are currently available for IoT Central, see [Supported metrics with Azure Monitor](../../azure-monitor/essentials/metrics-supported.md#microsoftiotcentraliotapps).

### Metrics and invoices

Metrics may differ from the numbers shown on your Azure IoT Central invoice. This situation occurs for a number of reasons such as:

- IoT Central [standard pricing plans](https://azure.microsoft.com/pricing/details/iot-central/) include two devices and varying message quotas for free. While the free items are excluded from billing, they're still counted in the metrics.

- IoT Central autogenerates one test device ID for each device template in the application. This device ID is visible on the **Manage test device** page for a device template. Solution builders may choose to validate their device templates before publishing them by generating code that uses these test device IDs. While these devices are excluded from billing, they're still counted in the metrics.

- While metrics may show a subset of device-to-cloud communication, all communication between the device and the cloud [counts as a message for billing](https://azure.microsoft.com/pricing/details/iot-central/).

## Next steps

Now that you've learned how to use application templates, the suggested next step is to learn how to [Manage IoT Central from the Azure portal](howto-manage-iot-central-from-portal.md).