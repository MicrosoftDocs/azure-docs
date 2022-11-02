---
title: Data privacy for Device Update for Azure IoT Hub | Microsoft Docs
description: Understand how Device Update for IoT Hub protects data privacy.
author: cjlin
ms.author: lichris
ms.date: 09/12/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update telemetry collection

Device Update for IoT Hub is a REST API-based cloud service targeted at enterprise customers that enables secure, over-the-air updating of millions of devices via a partitioned Azure service.

In order to maintain the quality and availability of the Device Update service, Microsoft collects certain telemetry from your Customer Data which may be stored and processed outside of your Azure region. Below is a list of the data points that Microsoft collects about the Device Update service.
* Device Manufacturer, Model*
* Device Interface Version*
* DU Agent Version, DO Agent Version*
* Update Namespace, Name, Version*
* IoT Hub Device ID
* DU Account ID, Instance ID
* Import ErrorCode, ExtendedErrorCode
* Deployment ResultCode, ExtendedResultCode
* Log collection ResultCode, Extended ResultCode

*For fields marked with asterisk, do not put any personal or sensitive data.

Microsoft maintains no information and has no access to data that would allow correlation of these telemetry data points with an individual’s identity. These system-generated data points are not accessible or exportable by tenant administrators. These data constitute factual actions conducted within the service and diagnostic data related to individual devices.

For further information on Microsoft's privacy commitments, please read the "Enterprise and developer products" section of the Microsoft Privacy Statement.
