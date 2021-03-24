---
title: Azure IoT Central administrator guide
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This article provides an overview of the administrator role in IoT Central. 
author: TheJasonAndrew
ms.author: v-anjaso
ms.date: 03/22/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [mvc, device-developer]
---

# IoT Central administrator guide

This article provides an overview of the administrator role in IoT Central. 

To access and use the Administration section, you must be in the Administrator role for an Azure IoT Central application. If you create an Azure IoT Central application, you're automatically assigned to the Administrator role for that application.

As an _administrator_, you are  responsible for administrative tasks such as:

* Managing Roles
* Curate Permissions
* Manage application by changing the application name and URL
* Uploading image
* Deleting an application in your Azure IoT Central application.

## Manage application settings
You have the ability to [manage application settings](howto-administer.md).

## Manage billing
You can [manage your Azure IoT Central billing](howto-view-bill.md). You can move your application from the free pricing plan to a standard pricing plan, and also upgrade or downgrade your pricing plan.

## Export applications
You can [export your Azure IoT application](howto-use-app-templates.md) so that you may reuse it.

## Manage migration between versions
When you create a new IoT Central application, it's a V3 application. If you previously created an application, then depending on when you created it, it may be V2. You can [migrate a V2 to a V3 application](howto-migrate.md).

## Monitor application health
You can set of metrics provided by IoT Central to [assess the health of devices](howto-monitor-application-health.md) connected to your IoT Central application and the health of your running data exports.

## Manage security (X.509, SAS keys, API tokens)
As an _Administrator_ you can do the following:
* Manage [X.509 certificates](how-to-roll-x509-certificates.md)
* Curate [SaS keys](concepts-get-connected.md)
* Review [API tokens](https://docs.microsoft.com/rest/api/iotcentral/)

## Configure file uploads
You can configure how to [file uploads](howto-configure-file-uploads.md)

## Tools - Azure CLI, Azure PowerShell, Azure portal

Here are some tools you have access to as _administrator_.
* [Azure CLI](howto-manage-iot-central-from-cli.md)
* [Azure PowerShell](howto-manage-iot-central-from-powershell.md)
* [Azure portal](howto-manage-iot-central-from-portal.md)

## Next steps

Now that you've learned about how to administer your Azure IoT Central application, the suggested next step is to learn about [Manage users and roles](howto-manage-users-roles.md) in Azure IoT Central.
