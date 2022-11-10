---
title: Customer data requests for Azure IoT Hub devices
description: Most of the devices managed in Azure IoT Hub are not personal, but some are. This article talks about admins being able to export or delete personal data from a device.
author: kgremban
ms.author: kgremban
ms.date: 05/16/2018
ms.topic: conceptual
ms.service: iot-hub
services: iot-hub
---

# Customer data request features for Azure IoT Hub devices

The Azure IoT Hub is a REST API-based cloud service targeted at enterprise customers that enables secure, bi-directional communication between millions of devices and a partitioned Azure service.

[!INCLUDE [gdpr-related guidance](../../includes/gdpr-intro-sentence.md)]

Individual devices are assigned a device identifier (device ID) by a tenant administrator. Device data is based on the assigned device ID. Microsoft maintains no information and has no access to data that would allow device ID to user correlation.

Many of the devices managed in Azure IoT Hub are not personal devices, for example an office thermostat or factory robot. Customers may, however, consider some devices to be personally identifiable and at their discretion may maintain their own asset or inventory tracking methods that tie devices to individuals. Azure IoT Hub manages and stores all data associated with devices as if it were personal data.

Tenant administrators can use either the Azure portal or the service's REST APIs to fulfill information requests by exporting or deleting data associated with a device ID.

If you use the routing feature of the Azure IoT Hub service to forward device messages to other services, then data requests must be performed by the tenant admin for each routing endpoint in order to complete a full request for a given device. For more details, see the reference documentation for each endpoint. For more information about supported endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

If you use the Azure Event Grid integration feature of the Azure IoT Hub service, then data requests must be performed by the tenant admin for each subscriber of these events. For more information, see [React to IoT Hub events by using Event Grid](iot-hub-event-grid.md).

If you use the Azure Monitor integration feature of the Azure IoT Hub service to create resource logs, then data requests must be performed by the tenant admin against the stored logs. For more information, see [Monitor IoT Hub](monitor-iot-hub.md).

## Deleting customer data

Tenant administrators can use the IoT devices blade of the Azure IoT Hub extension in the Azure portal to delete a device, which deletes the data associated with that device.

It is also possible to perform delete operations for devices using REST APIs. For more information, see [Service - Delete Device](/rest/api/iothub/service/devices/delete-identity).

## Exporting customer data

Tenant administrators can utilize copy and paste within the IoT devices pane of the Azure IoT Hub extension in the Azure portal to export data associated with a device.

It is also possible to perform export operations for devices using REST APIs. For more information, see [Service - Get Device](/rest/api/iothub/service/devices/get-identity).

> [!NOTE]
> When you use Microsoft's enterprise services, Microsoft generates some information, known as system-generated logs. Some Azure IoT Hub system-generated logs are not accessible or exportable by tenant administrators. These logs constitute factual actions conducted within the service and diagnostic data related to individual devices.

## Links to additional documentation

Full documentation for Azure IoT Hub Service APIs is located at [IoT Hub Service APIs](/rest/api/iothub/service/configuration).
