---
title: Customer data request features​ in Azure IoT Central
description: This article describes identifying, deleting, and exporting customer data in Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# Azure IoT Central customer data request features​

Azure IoT Central is a fully managed Internet of Things (IoT) software-as-a-service solution that makes it easy to connect, monitor, and manage your IoT assets at scale, create deep insights from your IoT data, and take informed action.

[!INCLUDE [gdpr-intro-sentence](../../../includes/gdpr-intro-sentence.md)]

## Identifying customer data

Microsoft Entra Object-IDs are used to identify users and assign roles. The Azure IoT Central portal displays user email addresses for role assignments but only the Microsoft Entra Object-ID is stored, the email address is dynamically queried from Microsoft Entra ID. Azure IoT Central administrators can view, export, and delete application users in the user administration section of an Azure IoT Central application.

Within the application, email addresses can be configured to receive alerts. In this case, email addresses are stored within IoT Central and must be managed from the in-app account administration page.

Regarding devices, Microsoft maintains no information and has no access to data that enables  device to user correlation. Many of the devices managed in Azure IoT Central are not personal devices, for example a vending machine or coffee maker. Customers may, however, consider some devices to be personally identifiable and at their discretion may maintain their own asset or inventory tracking systems that tie devices to individuals. Azure IoT Central manages and stores all data associated with devices as if it were personal data.

When you use Microsoft enterprise services, Microsoft generates some information, known as system-generated logs. These logs constitute factual actions conducted within the service and diagnostic data related to individual devices, and are not related to user activity. Azure IoT Central system-generated logs are not accessible or exportable by application administrators.

## Deleting customer data

The ability to delete user data is only provided through the IoT Central administration page. Application administrators can select the user to be deleted and select **Delete** in the upper right corner of the application to delete the record. Application administrators can also remove individual accounts that are no longer associated with the application in question.

After a user is deleted, no further alerts are emailed to them. However, their email address must be individually removed from each configured alert.

## Exporting customer data

The ability to export data is only provided through the IoT Central administration page. Customer data, including assigned roles, can be selected, copied, and pasted by an application administrator.

## Links to additional documentation

For more information about account administration, including role definitions, see [How to administer your application](howto-administer.md).
