---
title: Transform overview
description: Learn about how to transform
author: viv-liu
ms.author: viviali
ms.date: 10/11/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: corywink
---

# Transform your IoT data (preview features)

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

As an application platform, IoT Central provides several key facets to help you transform your IoT data into the business insights that drive actionable outcomes. IoT Central provides ways to extend your IoT data to external systems to create integrations with Line-Of-Business applications and custom applications. You can monitor device health and operations by creating rules that notify technicians via a mobile service. You can generate specific business insights with custom analytics and machine learning by exporting raw telemetry data to services in Azure. You can create services and tools that monitor and control devices and manage your IoT Central app using the public APIs. 

![Transform in IoT Central overview](media/overview-iot-central-transform-pnp/transform.png)

## Monitor device health and operations using rules
Once your machines are connected and sending data, you can identify which machines are experiencing problems or sending error messages so that they can be fixed to run normally with minimal downtime. You can build rules in your IoT Central app to monitor the telemetry that your devices are sending and alert you when a threshold has been crossed or a specific event message was sent. You can configure actions such as email actions and webhooks for your rules to notify the right people and the right downstream systems. Learn more about rules here.

## Run custom analytics and processing on your exported data
You can generate highly custom business insights such as determining machine efficiency trends or predicting future energy usage on a factory floor by building custom analytics pipelines to process your raw IoT telemetry and storing the end result. You can create data exports in your IoT Central app to export telemetry, device properties and lifecycle, and device template changes information to other Azure services so that you can analyze, store, and visualize the data in the tools that are most valuable to you. Learn more about data export here.

## Build custom IoT solutions and integrations with APIs
You can build IoT solutions like mobile companion apps that can remotely control devices and sets up new devices, or custom integrations with existing Line of Business applications to interact with your IoT devices and data that is tailored to your business. You can use IoT Central as the backbone for device modeling, onboarding, management, and data access. Learn more about the public API in this Learning Module.
