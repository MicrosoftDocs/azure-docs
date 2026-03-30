---
title: Automatic device management at scale
titleSuffix: Azure IoT Hub
description: Use Azure IoT Hub automatic configurations to manage multiple IoT devices and modules in the Azure portal and Azure CLI.
author: cwatson-cat
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 08/13/2025
ms.author: cwatson
ms.custom: ['Role: Cloud Development', 'Role: IoT Device']
zone_pivot_groups: service-portal-azcli
---

# Automatic IoT device and module management

Azure IoT Hub automatic device management streamlines the process of managing large fleets of devices by automating repetitive and complex tasks. With automatic device and module configurations, you can target devices based on their properties, specify desired settings, and let IoT Hub apply updates as devices meet the defined criteria. This approach enables you to monitor configuration status, resolve conflicts, and roll out changes in phases for greater control and compliance.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

## Overview of automatic device management

Automatic device management operates by applying desired properties to groups of device twins or module twins and summarizing results using reported properties. This process uses a specialized JSON document called a _Configuration_, which consists of three main components:

* The **target condition** defines the scope of device twins or module twins to be updated. The target condition is specified as a query on twin tags and/or reported properties.

* The **target content** defines the desired properties to be added or updated in the targeted device twins or module twins. The content includes a path to the section of desired properties to be changed.

* The **metrics** component provides summary counts for configuration states like **Success**, **In Progress**, and **Error**. You can define custom metrics using queries on twin reported properties, while system metrics automatically track update status, including how many twins are targeted and how many are successfully updated.

Automatic configurations run for the first time shortly after the configuration is created and then at five-minute intervals. Metrics queries run each time the automatic configuration runs. A maximum of 100 automatic configurations is supported on standard tier IoT hubs; 10 on free tier IoT hubs. Throttling limits also apply. To learn more, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

:::zone pivot="azure-portal"

[!INCLUDE [iot-hub-automatic-device-management-portal](../../includes/iot-hub-automatic-device-management-portal.md)]

:::zone-end

:::zone pivot="azure-cli"

[!INCLUDE [iot-hub-automatic-device-management-cli](../../includes/iot-hub-automatic-device-management-cli.md)]

:::zone-end

## Next steps

In this article, you learned how to configure and monitor IoT devices at scale.

To learn how to manage IoT Hub device identities in bulk, see [Import and export IoT Hub device identities in bulk](iot-hub-bulk-identity-mgmt.md)
