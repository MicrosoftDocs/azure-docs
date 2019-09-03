---
title: Take a tour of the Azure IoT Central UI | Microsoft Docs
description: As a builder, become familiar with the key areas of the Azure IoT Central UI that you use to create an IoT solution.
author: dominicbetts
ms.author: dobett
ms.date: 07/05/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: philmea
---

# Take a tour of the Azure IoT Central UI (preview features)

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

This article introduces you to the Microsoft Azure IoT Central UI. You can use the UI to create, manage, and use an Azure IoT Central solution and its connected devices.

As a _builder_, you use the Azure IoT Central UI to define your Azure IoT Central solution. You can use the UI to:

* Define the types of device that connect to your solution.
* Configure the rules and actions for your devices.
* Customize the UI for an _operator_ who uses your solution.

As an _operator_, you use the Azure IoT Central UI to manage your Azure IoT Central solution. You can use the UI to:

* Monitor your devices.
* Configure your devices.
* Troubleshoot and remediate issues with your devices.
* Provision new devices.

## Use the left navigation menu

Use the left navigation menu to access the different areas of the application. You can expand or collapse the navigation bar by selecting **<** or **>**:

:::row:::
  :::column span="":::
      ![Left navigation menu](media/overview-iot-central-tour-pnp/navigationbar.png)
  :::column-end:::
  :::column span="2":::

      **Dashboard** displays your application dashboard. As a builder, you can customize the dashboard for your operators. Users can also create their own  dashboards.
    
      **Devices** lists the simulated and real devices associated with each device template in the application. As an operator, you use the **Device Explorer** to manage your connected devices.
    
      **Device groups** lets you view and create device groups. As an operator, you can create device groups as a logical collections of devices specified by a query.

      **Rules** lets you edit rules that fire based on device telemetry and trigger customizable actions.
    
      **Analytics** shows analytics derived from device telemetry for devices and device groups. As an operator, you can create custom views on top of device data to derive insights from your application.
    
      **Jobs** enables bulk device management by having you create and run jobs to update your devices at scale.
    
      **Device templates** shows the tools a builder uses to create and manage device templates.
    
      **Data export** enables an administrator to configure a continuous export to other Azure services such as storage and queues.
    
      **Administration** shows the application administration pages where an administrator can manage application settings, users, and roles.
   :::column-end:::
:::row-end:::

## Search, help, and support

The top menu appears on every page:

![Toolbar](media/overview-iot-central-tour-pnp/toolbar.png)

* To search for device templates and devices, enter a **Search** value.
* To change the UI language or theme, choose the **Settings** icon.
* To sign out of the application, choose the **Account** icon.
* To get help and support, choose the **Help** drop-down for a list of resources. In a trial application, the support resources include access to [live chat](howto-show-hide-chat.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

You can choose between a light theme or a dark theme for the UI:

![Choose a theme for the UI](media/overview-iot-central-tour-pnp/themes.png)

> [!NOTE]
> The option to choose between light and dark themes isn't available if your administrator has configured a custom theme for the application.

## Dashboard

![Dashboard](media/overview-iot-central-tour-pnp/homepage.png)

* The dashboard is the first page you see when you sign in to your Azure IoT Central application. As a builder, you can customize the application dashboard for other users by adding tiles. To learn more, see the [Set up a device template](tutorial-define-device-type-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) tutorial.

* As an operator, you can create personalized dashboards and switch between them and the default dashboard. To learn more, see the [Create and manage personal dashboards](howto-personalize-dashboard.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) how-to article.

## Devices

![Devices page](media/overview-iot-central-tour-pnp/explorer.png)

The explorer page shows the _devices_ in your Azure IoT Central application grouped by _device template_.

* A device template defines a type of device that can connect to your application. To learn more, see the [Define a new device type in your Azure IoT Central application](tutorial-define-device-type-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).
* A device represents either a real or simulated device in your application. To learn more, see the [Add a new device to your Azure IoT Central application](tutorial-add-device-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

## Device groups

![Device groups page](media/overview-iot-central-tour-pnp/devicesets.png)

The _device groups_ page shows device groups created by the builder. A device group is a collection of related devices. A builder defines a query to identify the devices that are included in a device group. You use device groups when you customize the analytics in your application. To learn more, see the [Use device groups in your Azure IoT Central application](howto-use-device-groups-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) article.

## Rules

![Rules page](media/overview-iot-central-tour-pnp/rules.png)

The rules page lets you define rules based on telemetry, device state, or device events. When a rule fires, it can trigger an action such as sending an email to an operator. The builder uses this page to create and manage rules. For more information, see the [Configure rules and actions for your devices in Azure IoT Central](tutorial-configure-rules-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) tutorial.

## Analytics

![Analytics page](media/overview-iot-central-tour-pnp/analytics.png)

The analytics page shows charts that help you understand how the devices connected to your application are behaving. An operator uses this page to monitor and investigate issues with connected devices. The builder can define the charts shown on this page. To learn more, see the [Create custom analytics for your Azure IoT Central application](howto-use-device-groups-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) article.

## Jobs

![Jobs page](media/overview-iot-central-tour-pnp/jobs.png)

The jobs page lets you run bulk device management operations on your devices. The builder uses this page to update device properties, settings, and commands. To learn more, see the [Run a job](howto-run-a-job.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) article.

## Device templates

![Device templates page](media/overview-iot-central-tour-pnp/templates.png)

The device templates page is where a builder creates and manages the device templates in the application. A device template specifies device characteristics such as:

* Telemetry, state, and event measurements.
* Properties.
* Commands.

The builder can also create forms and dashboards for operators to use to manage devices.

To learn more, see the [Define a new device type in your Azure IoT Central application](tutorial-define-device-type-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) tutorial.

## Data export

![Data export page](media/overview-iot-central-tour-pnp/export.png)

The data export page is where an administrator defines how to stream data, such as telemetry, from the application. Other services can store the exported data or use it for analysis. To learn more, see the [Export your data in Azure IoT Central](howto-export-data.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) article.

## Administration

![Administration page](media/overview-iot-central-tour-pnp/administration.png)

The administration page contains links to the tools an administrator uses such as defining users and roles in the application, and customizing the UI. To learn more, see the [Administer your Azure IoT Central application](howto-administer-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) article.

## Next steps

Now that you have an overview of Azure IoT Central and are familiar with the layout of the UI, the suggested next step is to complete the [Create an Azure IoT Central application](quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) quickstart.
