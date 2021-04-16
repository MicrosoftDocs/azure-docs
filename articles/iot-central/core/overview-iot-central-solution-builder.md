---
title: Solution building for Azure IoT Central | Microsoft Docs
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This article provides an overview of building integrated solutions with IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 02/11/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# IoT Central solution builder guide

*This article applies to solution builders.*

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle. This guide is for solution builders who use IoT Central to build integrated solutions. An IoT Central application lets you manage devices, analyze device telemetry, and integrate with other back-end services.

A solution builder:

- Configures dashboards and views in the IoT Central web UI.
- Uses the built-in rules and analytics tools to derive business insights from the connected devices.
- Uses the data export and rules capabilities to integrate IoT Central with other back-end services.

## Configure dashboards and views

An IoT Central application can have one or more dashboards that operators use to view and interact with the application. As a solution builder, you can customize the default dashboard and create specialized dashboards:

- To view some examples of customized dashboards, see [Industry focused templates](concepts-app-templates.md#industry-focused-templates).
- To learn more about dashboards, see [Create and manage multiple dashboards](howto-create-personal-dashboards.md) and [Configure the application dashboard](howto-add-tiles-to-your-dashboard.md).

When a device connects to an IoT Central, the device is associated with a device template for the device type. A device template has customizable views that an operator uses to manage individual devices. As a solution developer, you can create and customize the available views for a device type. To learn more, see [Add views](howto-set-up-template.md#add-views).

## Use built-in rules and analytics

A solution developer can add rules to an IoT Central application that run customizable actions. Rules evaluate conditions, based on data coming from a device, to determine when to run an action. To learn more about rules, see:

- [Tutorial: Create a rule and set up notifications in your Azure IoT Central application](tutorial-create-telemetry-rules.md)
- [Create webhook actions on rules in Azure IoT Central](howto-create-webhooks.md)
- [Group multiple actions to run from one or more rules](howto-use-action-groups.md)

IoT Central has built-in analytics capabilities that an operator can use to analyze the data flowing from the connected devices. To learn more, see [How to use analytics to analyze device data](howto-create-analytics.md).

## Integrate with other services

As a solution builder, you can use the data export and rules capabilities in IoT Central to integrate with other service. To learn more, see:

- [Export IoT data to cloud destinations using data export](howto-export-data.md)
- [Transform data for IoT Central](howto-transform-data.md)
- [Use workflows to integrate your Azure IoT Central application with other cloud services](howto-configure-rules-advanced.md)
- [Extend Azure IoT Central with custom rules using Stream Analytics, Azure Functions, and SendGrid](howto-create-custom-rules.md)
- [Extend Azure IoT Central with custom analytics using Azure Databricks](howto-create-custom-analytics.md)
- [Visualize and analyze your Azure IoT Central data in a Power BI dashboard](howto-connect-powerbi.md)

## Next steps

If you want to learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
