---
title: Customer data requests for Azure IoT Hub devices
description: Most of the devices managed in Azure IoT Hub aren't personal, but some are. This article talks about admins being able to export or delete personal data from a device.
author: cwatson-cat
ms.author: cwatson
ms.date: 08/06/2025
ms.topic: concept-article
ms.service: azure-iot-hub
services: iot-hub
---

# Customer data request features for Azure IoT Hub devices

Azure IoT Hub is a REST API-based cloud service targeted at enterprise customers that enables secure, bi-directional communication between millions of devices and a partitioned Azure service.

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

Individual devices are assigned to a device identifier (device ID) by a tenant administrator. Device data is based on the assigned device ID. Microsoft maintains no information and has no access to data that would allow device ID to user correlation.

Many of the devices managed in Azure IoT Hub aren't personal devices, for example an office thermostat or factory robot. Customers might, however, consider some devices to be personally identifiable and at their discretion might maintain their own asset or inventory tracking methods that tie devices to individuals. Azure IoT Hub manages and stores all data associated with devices as if it were personal data.

Tenant administrators can use either the Azure portal or the service's REST APIs to fulfill information requests by exporting or deleting data associated with a device ID.

If you use the routing feature of the Azure IoT Hub service to forward device messages to other services, then the tenant admin for each routing endpoint must perform data requests in order to complete a full request for a given device. For more information, see the reference documentation for each endpoint. For more information about supported endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

If you use the Azure Event Grid integration feature of the Azure IoT Hub service, then the tenant admin must perform data requests for each subscriber of these events. For more information, see [React to IoT Hub events by using Event Grid to trigger actions](iot-hub-event-grid.md).

If you use the Azure Monitor integration feature of the Azure IoT Hub service to create resource logs, then the tenant admin must perform data requests against the stored logs. For more information, see [Monitor Azure IoT Hub](monitor-iot-hub.md).

## Deleting customer data

Tenant administrators can use the IoT devices pane of the Azure IoT Hub extension in the Azure portal to delete a device, which deletes the data associated with that device.

It's also possible to perform delete operations for devices using REST APIs. For more information, see [Devices - Delete Identity](/rest/api/iothub/service/devices/delete-identity).

## Exporting customer data

Tenant administrators can utilize copy and paste within the IoT devices pane of the Azure IoT Hub extension in the Azure portal to export data associated with a device.

It's also possible to perform export operations for devices using REST APIs. For more information, see [Devices - Get Identity](/rest/api/iothub/service/devices/get-identity).

> [!NOTE]
> When you use Microsoft's enterprise services, Microsoft generates some information, known as system-generated logs. Some Azure IoT Hub system-generated logs aren't accessible or exportable by tenant administrators. These logs constitute factual actions conducted within the service and diagnostic data related to individual devices.

## Other links

Full documentation for Azure IoT Hub Service APIs is located at [IoT Hub Service APIs](/rest/api/iothub/service/configuration).
