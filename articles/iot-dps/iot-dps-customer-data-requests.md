---
title: Customer data request features​ for Azure DPS devices
description: For devices managed in Azure Device Provisioning Service (DPS) that are personal, this article shows admins how to export or delete personal data.
author: kgremban
ms.author: kgremban
ms.date: 05/16/2018
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
---

# Summary of customer data request features​

The Azure IoT Hub Device Provisioning Service is a REST API-based cloud service targeted at enterprise customers that enables seamless, automated zero-touch provisioning of devices to Azure IoT Hub with security that begins at the device and ends with the cloud.

[!INCLUDE [gdpr-intro-sentence](../../includes/gdpr-intro-sentence.md)]

Individual devices are assigned a registration ID and device ID by a tenant administrator. Data from and about these devices is based on these IDs. Microsoft maintains no information and has no access to data that would allow correlation of these devices to an individual.

Many of the devices managed in Device Provisioning Service are not personal devices, for example an office thermostat or factory robot. Customers may, however, consider some devices to be personally identifiable and at their discretion may maintain their own asset or inventory tracking methods that tie devices to individuals. Device Provisioning Service manages and stores all data associated with devices as if it were personal data.

Tenant administrators can use either the Azure portal or the service's REST APIs to fulfill information requests by exporting or deleting data associated with a device ID or registration ID.

> [!NOTE]
> Devices that have been provisioned in Azure IoT Hub through Device Provisioning Service have additional data stored in the Azure IoT Hub service. See the [Azure IoT Hub reference documentation](../iot-hub/iot-hub-customer-data-requests.md) in order to complete a full request for a given device.

## Deleting customer data

Device Provisioning Service stores enrollments and registration records. Enrollments contain information about devices that are allowed to be provisioned, and registration records show which devices have already gone through the provisioning process.

Tenant administrators may remove enrollments from the Azure portal, and this removes any associated registration records as well.

For more information, see [How to manage device enrollments](how-to-manage-enrollments.md).

It is also possible to perform delete operations for enrollments and registration records using REST APIs:

* To delete enrollment information for a single device, you can use [Device Enrollment - Delete](/rest/api/iot-dps/service/individual-enrollment/delete).
* To delete enrollment information for a group of devices, you can use [Device Enrollment Group - Delete](/rest/api/iot-dps/service/enrollment-group/delete).
* To delete information about devices that have been provisioned, you can use [Registration State - Delete Registration State](/rest/api/iot-dps/service/device-registration-state/delete).

## Exporting customer data

Device Provisioning Service stores enrollments and registration records. Enrollments contain information about devices that are allowed to be provisioned, and registration records show which devices have already gone through the provisioning process.

Tenant administrators can view enrollments and registration records through the Azure portal and export them using copy and paste.

For more information on how to manage enrollments, see [How to manage device enrollments](how-to-manage-enrollments.md).

It is also possible to perform export operations for enrollments and registration records using REST APIs:

* To export enrollment information for a single device, you can use [Device Enrollment - Get](/rest/api/iot-dps/service/individual-enrollment/get).
* To export enrollment information for a group of devices, you can use [Device Enrollment Group - Get](/rest/api/iot-dps/service/enrollment-group/get).
* To export information about devices that have already been provisioned, you can use [Registration State - Get Registration State](/rest/api/iot-dps/service/device-registration-state/get).

> [!NOTE]
> When you use Microsoft's enterprise services, Microsoft generates some information, known as system-generated logs. Some Device Provisioning Service system-generated logs are not accessible or exportable by tenant administrators. These logs constitute factual actions conducted within the service and diagnostic data related to individual devices.

## Links to additional documentation

For full documentation of Device Provisioning Service APIs, see [Azure IoT Hub Device Provisioning Service REST API](/rest/api/iot-dps).

Azure IoT Hub [customer data request features](../iot-hub/iot-hub-customer-data-requests.md).
