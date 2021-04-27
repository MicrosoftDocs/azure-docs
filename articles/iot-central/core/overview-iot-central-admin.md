---
title: Azure IoT Central administrator guide
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This article provides an overview of the administrator role in IoT Central. 
author: philmea
ms.author: philmea
ms.date: 03/25/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# IoT Central administrator guide

*This article applies to administrators.*

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle. This guide is for administrators who manage IoT Central applications.

In IoT Central, an administrator:

- Manages users and roles in the application.
- Manages security such as device authentication.
- Configures application settings.
- Upgrades applications.
- Exports and shares applications.
- Monitors application health.

## Users and roles

IoT Central uses a role-based access control system to manage user permissions within an application. IoT Central has three built-in roles for administrators, solution builders, and operators. An administrator can create custom roles with specific sets of permissions. An administrator is responsible for adding users to an application and assigning them to roles.

To learn more, see [Manage users and roles in your IoT Central application](howto-manage-users-roles.md).

## Application security

Devices that connect to your IoT Central application typically use X.509 certificates or shared access signatures (SAS) as credentials. The administrator manages the group certificates or keys that the device credentials are derived from.

To learn more, see [X.509 group enrollment](concepts-get-connected.md#x509-group-enrollment), [SAS group enrollment](concepts-get-connected.md#sas-group-enrollment), and [How to roll X.509 device certificates](how-to-roll-x509-certificates.md).

The administrator can also create and manage the API tokens that a client application uses to authenticate with your IoT Central application. Client applications use the REST API to interact with IoT Central.

## Configure an application

The administrator can configure the behavior and appearance of an IoT Central application. To learn more, see:

- [Change application name and URL](howto-administer.md#change-application-name-and-url)
- [Customize the UI](howto-customize-ui.md)
- [Move an application to a different pricing plans](howto-view-bill.md)
- [Configure file uploads](howto-configure-file-uploads.md)

## Export an application

An administrator can:

- Create a copy of an application if you just need a duplicate copy of your application. For example, you may need a duplicate copy for testing.
- Create an application template from an existing application if you plan to create multiple copies.

To learn more, see [Export your Azure IoT application](howto-use-app-templates.md).

## Migrate to a new version

An administrator can migrate an application to a newer version. Currently, a newly created application is a V3 application. An administrator may need to migrate a V2 application to a V3 application.

To learn more, see [Migrate your V2 IoT Central application to V3](howto-migrate.md).

## Monitor application health

An administrator can use IoT Central metrics to assess the health of connected devices and the health of running data exports.

To view the metrics, an administrator can use charts in the Azure portal, a REST API, or PowerShell or Azure CLI queries.

To learn more, see [Monitor the overall health of an IoT Central application](howto-monitor-application-health.md).

## Tools

Many of the tools you use as an administrator are available in the **Administration** section of each IoT Central application. You can also use the following tools to complete some administrative tasks:

- [Azure CLI](howto-manage-iot-central-from-cli.md)
- [Azure PowerShell](howto-manage-iot-central-from-powershell.md)
- [Azure portal](howto-manage-iot-central-from-portal.md)

## Next steps

Now that you've learned about how to administer your Azure IoT Central application, the suggested next step is to learn about [Manage users and roles](howto-manage-users-roles.md) in Azure IoT Central.
