---
title: Azure IoT Central application administration guide
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This guide describes how to administer your IoT Central application. Application administration includes users, organization, and security.
author: dominicbetts 
ms.author: dobett 
ms.date: 01/04/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: mvc

# This article applies to administrators.
---

# IoT Central application administration guide

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle. This guide is for administrators who manage IoT Central applications.

IoT Central application administration includes the following tasks:

- Create applications
- Manage users and roles in the application.
- Create and manage organizations.
- Manage security such as device authentication.
- Configure application settings.
- Upgrade applications.
- Export and share applications.
- Monitor application health.

## Create applications

You use an *application template* to create an application. An application template consists of:

- Sample dashboards
- Sample device templates
- Simulated devices producing real-time data
- Pre-configured rules and jobs
- Rich documentation including tutorials and how-tos

You choose the application template when you create your application. You can't change the template an application uses after it's created.

### Custom templates

If you want to create your application from scratch, choose the **Custom application** template.

You can also create and manage your own [custom application templates](howto-create-iot-central-application.md#create-and-use-a-custom-application-template) and [copy applications](howto-create-iot-central-application.md#copy-an-application) to create new ones.

### Industry focused templates

Azure IoT Central is an industry agnostic application platform. Application templates are industry focused examples available for these industries today:

[!INCLUDE [iot-central-template-list](../../../includes/iot-central-template-list.md)]

To learn more, see [Create a retail application](../retail/tutorial-in-store-analytics-create-app.md) as an example.

## Users and roles

IoT Central uses a role-based access control system to manage user permissions within an application. An administrator is responsible for adding users to an application and assigning them to roles. IoT Central has three built-in roles for app administrators, app builders, and app operators. An administrator can create custom roles with specific sets of permissions.

To learn more, see [Manage users and roles in your IoT Central application](howto-manage-users-roles.md).

## Organizations

To manage which users see which devices in your IoT Central application, use an _organization_ hierarchy. When you define an organization in your application, there are three new built-in roles: _organization administrators_, _organization operators_ and _organization viewers_. The user's role in application determines their permissions over the devices they can see.

To learn more, see [Create an IoT Central organization](howto-create-organizations.md).

## Application security

Devices that connect to your IoT Central application typically use X.509 certificates or shared access signatures (SAS) as credentials. An administrator manages the group certificates or keys that these device credentials are derived from. To learn more, see:

- [X.509 group enrollment](concepts-device-authentication.md#x509-enrollment-group)
- [SAS group enrollment](concepts-device-authentication.md#sas-enrollment-group)
- [How to roll X.509 device certificates](how-to-connect-devices-x509.md).

An administrator can also create and manage the API tokens that a client application uses to authenticate with your IoT Central application. Client applications use the REST API to interact with IoT Central. To learn more, see:

- [Get an API token](howto-authorize-rest-api.md#get-an-api-token)

For data exports, an administrator can configure [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) to secure the connections to the [export destinations](howto-export-data.md). To learn more, see:

- [Configure a managed identity](howto-manage-iot-central-from-portal.md#configure-a-managed-identity)

## Configure an application

An administrator can configure the behavior and appearance of an IoT Central application. To learn more, see:

- [Change application name and URL](howto-administer.md#change-application-name-and-url)
- [Customize application UI](howto-customize-ui.md)
- [Move an application to a different pricing plans](howto-faq.yml#how-do-i-move-from-a-free-to-a-standard-pricing-plan-)

## Configure device file upload

An administrator can configure file uploads of an IoT Central application that lets connected devices upload media and other files to Azure Storage container. To learn more, see:

- [Upload files from your devices to the cloud](howto-configure-file-uploads.md)

## Export an application

An administrator can:

- Create a copy of an application if you just need a duplicate copy of your application. For example, you may need a duplicate copy for testing.
- Create an application template from an existing application if you plan to create multiple copies.

To learn more, see [Create and use a custom application template](howto-create-iot-central-application.md#create-and-use-a-custom-application-template) .

## Migrate to a new version

An administrator can migrate an application to a newer version. Currently, all newly created applications are V3 applications. Depending on when it was created, it may be V2. An administrator is responsible for migrating a V2 application to a V3 application.

To learn more, see [Migrate your V2 IoT Central application to V3](howto-migrate.md).

## Monitor application health

An administrator can use IoT Central metrics to assess the health of connected devices and the health of running data exports.

To view the metrics, an administrator can use charts in the Azure portal, a REST API, or PowerShell or Azure CLI queries.

To learn more, see [Monitor application health](howto-manage-iot-central-from-portal.md#monitor-application-health).

## Monitor connected IoT Edge devices

To learn how to monitor your IoT Edge fleet remotely by using Azure Monitor and built-in metrics integration, see [Collect and transport metrics](../../iot-edge/how-to-collect-and-transport-metrics.md).

## Tools

Many of the tools you use as an administrator are available in the **Administration** section of each IoT Central application. You can also use the following tools to complete some administrative tasks:

- [Azure Command-Line Interface (CLI) or PowerShell](howto-manage-iot-central-from-cli.md)
- [Azure portal](howto-manage-iot-central-from-portal.md)

## Next steps

Now that you've learned about how to administer your Azure IoT Central application, the suggested next step is to learn about [Manage users and roles](howto-manage-users-roles.md) in Azure IoT Central.
