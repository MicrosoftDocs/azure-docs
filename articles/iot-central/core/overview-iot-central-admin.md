---
title: Azure IoT Central application administration guide
description: How to administer your IoT Central application. Application administration includes users, organization, security, and automated deployments.
author: dominicbetts 
ms.author: dobett 
ms.date: 08/13/2025
ms.topic: concept-article
ms.service: azure-iot-central
services: iot-central
ms.custom: [mvc, iot-central-frontdoor]

# This article applies to administrators.
---

# IoT Central application administration guide

An IoT Central application lets you monitor and manage your devices, letting you quickly evaluate your IoT scenario. This guide is for administrators who manage IoT Central applications.

IoT Central application administration includes the following tasks:

- Create applications
- Manage security
- Configure application settings
- Upgrade applications
- Export and share applications
- Monitor application health
- Provide DevOps integration

> [!IMPORTANT]
> IoT Central applications that remain inactive for more than 30 consecutive days are subject to deletion. To avoid this outcome, ensure that your applications maintain regular activity. Examples of qualifying activity include:
> 
> - User logins 
> - API calls 
> - Continuous Data Exports 
> - Device message overages
> 
> IoT Central applications that don't manage more than two (2) [real devices](howto-manage-devices-individually.md) and don't incur monthly message overages are also subject to deletion.

## Create applications

You use an *application template* to create an application. An application template consists of:

- Sample dashboards
- Sample device templates
- Simulated devices producing real-time data
- Preconfigured rules and jobs
- Rich documentation including tutorials and how-tos

You choose the application template when you create your application. You can't change the template an application uses after you create it.

### Custom templates

If you want to create your application from scratch, choose the **Custom application** template.

You can also create and manage your own [custom application templates](howto-create-iot-central-application.md#create-and-use-a-custom-application-template) and [copy applications](howto-create-iot-central-application.md#copy-an-application) to create new ones.

### Industry focused templates

Azure IoT Central is an industry agnostic application platform. Application templates are industry focused examples available for these industries today:

[!INCLUDE [iot-central-template-list](../../../includes/iot-central-template-list.md)]

To learn more, see [Tutorial: Create and deploy an in-store analytics application template](../retail/tutorial-in-store-analytics-create-app.md) as an example.

## Manage security

In IoT Central, you can configure and manage security in the following areas:

- User access to your application.
- Device access to your application.
- Programmatic access to your application.
- Authentication to other services from your application.
- Use audit logs to track activity in your IoT Central application.

To learn more, see the [IoT Central security guide](overview-iot-central-security.md).

## Configure an application

An administrator can configure the behavior and appearance of an IoT Central application. To learn more, see:

- [Change application name and URL](howto-administer.md#change-application-name-and-url)
- [Customize the Azure IoT Central UI](howto-customize-ui.md)

## Configure device file upload

An administrator can configure file uploads of an IoT Central application that lets connected devices upload media and other files to Azure Storage container. To learn more, see:

- [Upload files from your devices to the cloud](howto-configure-file-uploads.md)

## Export an application

An administrator can:

- Create a copy of an application if you just need a duplicate copy of your application. For example, you might need a duplicate copy for testing.
- Create an application template from an existing application if you plan to create multiple copies.

To learn more, see [Create and use a custom application template](howto-create-iot-central-application.md#create-and-use-a-custom-application-template).

## Integrate with Azure Pipelines

Continuous integration and continuous delivery (CI/CD) refers to the process of developing and delivering software in short, frequent cycles using automation pipelines. You can use Azure Pipelines to automate the build, test, and deployment of IoT Central application configurations.

Just as IoT Central is a part of your larger IoT solution, make IoT Central a part of your CI/CD pipeline.

To learn more, see [Integrate IoT Central with Azure Pipelines for continuous integration and continuous delivery](howto-integrate-with-devops.md).

## Monitor application health

An administrator can use IoT Central metrics to assess the health of connected devices and the health of running data exports.

To view the metrics, an administrator can use charts in the Azure portal, a REST API, or PowerShell or Azure CLI queries.

To learn more, see [Monitor application health](howto-manage-and-monitor-iot-central.md#monitor-application-health).

## Monitor connected IoT Edge devices

To learn how to monitor your IoT Edge fleet remotely by using Azure Monitor and built-in metrics integration, see [Collect and transport metrics](../../iot-edge/how-to-collect-and-transport-metrics.md).

## Tools

Many of the tools you use as an administrator are available in the **Security** and **Settings** sections of each IoT Central application. You can also use the following tools to complete some administrative tasks:

- [Azure Command-Line Interface (CLI) or PowerShell](howto-manage-and-monitor-iot-central.md?tabs=azure-cli)
- [Azure portal](howto-manage-and-monitor-iot-central.md?tabs=azure-portal)

## Next steps

Now that you've learned about how to administer your Azure IoT Central application, the suggested next step is to learn about security in the [IoT Central security guide](overview-iot-central-security.md).

