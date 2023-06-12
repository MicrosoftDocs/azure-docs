---
title: Data privacy for Device Update for Azure IoT Hub
description: Understand how Device Update for IoT Hub protects data privacy.
author: chrisjlin
ms.author: lichris
ms.date: 01/19/2023
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update telemetry collection

In order to maintain the quality and availability of the Device Update service, Microsoft collects certain telemetry from your customer data that may be stored and processed outside of your Azure region. The following list contains the data points that Microsoft collects about the Device Update service:

* Device manufacturer, model*
* Device Interface version*
* Device Update agent version, Delivery Optimization (DO) agent version*
* Update namespace, name, version*
* IoT Hub device ID
* Device Update account ID, instance ID
* Import ErrorCode, ExtendedErrorCode
* Deployment ResultCode, ExtendedResultCode
* Log collection ResultCode, Extended ResultCode

*For fields marked with an asterisk, don't put any personal or sensitive data.

Microsoft maintains no information and has no access to data that would allow correlation of these telemetry data points with an individual’s identity. These system-generated data points aren't accessible or exportable by tenant administrators. These data constitute factual actions conducted within the service and diagnostic data related to individual devices.

For more information on Microsoft's privacy commitments, see the "Enterprise and developer products" section of the [Microsoft Privacy Statement](https://privacy.microsoft.com/en-us/privacystatement).

For more information about data residency with Device Update, see [Regional mapping for disaster recovery for Device Update](device-update-region-mapping.md).
