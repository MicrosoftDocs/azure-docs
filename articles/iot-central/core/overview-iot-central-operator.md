---
title: Azure IoT Central device management guide
description: This guide describes how to manage the IoT devices connected to your IoT Central application at scale. 
author: dominicbetts
ms.author: dobett
ms.date: 05/19/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [mvc, iot-central-frontdoor]

---

# IoT Central device management guide

An IoT Central application lets you monitor and manage hundreds of thousands of devices throughout their life cycle.

IoT Central lets you complete device management tasks such as:

- Provision new devices.
- Monitor and manage the devices connected to the application.
- Troubleshoot and remediate issues with devices.

You can use the following tools in your IoT Central application:

- The **Devices** page lets you monitor and manage individual devices.
- The **Device groups** and **Data explorer** pages let you monitor aggregate data from your devices.
- The **Jobs** page lets you manage your devices in bulk.
- Custom dashboards let you manage and monitor devices in a way that suits you.
- The REST API and Azure CLI enable you to automate device management tasks.

## Search for devices

IoT Central lets you search devices by device name, ID, property value, or cloud property value:

:::image type="content" source="media/overview-iot-central-operator/search-devices.png" alt-text="Screenshot that shows how to search devices":::

## Add devices

Use the **Devices** page to add individual devices:

:::image type="content" source="media/overview-iot-central-operator/add-devices.png" alt-text="Screenshot that shows add device options.":::

You can [import devices](howto-manage-devices-in-bulk.md#import-devices) in bulk from a CSV file.

## Group your devices

On the **Device groups** page, you can use queries to define groups of devices. Use device groups to:

- Monitor aggregate data from devices on the **Device explorer** page.
- Manage groups of devices in bulk by using jobs.
- Control access to groups of devices if your application uses organizations.

To learn more, see [Tutorial: Use device groups to analyze device telemetry](tutorial-use-device-groups.md).

## Manage your devices

Use the **Devices** page to manage individual devices connected to your application:

:::image type="content" source="media/overview-iot-central-operator/device-management-options​.png" alt-text="Screenshot showing the device management options.":::

For an individual device, you can complete tasks such as:

- [Block or unblock it](howto-manage-devices-individually.md#device-status-values)
- [Attach it to a gateway](tutorial-define-gateway-device-type.md)
- [Approve it](howto-manage-devices-individually.md#device-status-values)
- [Migrate it to a new device template](howto-edit-device-template.md#migrate-a-device-across-versions)
- [Associate it with an organization](howto-create-organizations.md)
- [Generate a map to transform the incoming telemetry and properties](howto-map-data.md).

You can also set writable properties and cloud properties that are defined in the device template, and call commands on the device.

To manage IoT Edge devices, you can use the IoT Central UI to create and edit [deployment manifests](concepts-iot-edge.md), and then deploy them to your IoT Edge devices. You can also run commands in IoT Edge modules from within IoT Central.  

Use the **Jobs** page to manage your devices in bulk. Jobs can update properties, run commands, or assign a new device template on multiple devices. To learn more, see [Manage devices in bulk in your Azure IoT Central application](howto-manage-devices-in-bulk.md).

> [!TIP]
> If your IoT Central application uses *organizations*, an administrator controls which devices you have access to.

## Monitor your devices

To monitor individual devices, use the custom device views on the **Devices** page. A solution builder defines these custom views as part of the [device template](concepts-device-templates.md). These views can show device telemetry and property values. An example is the **Overview** view shown in the following screenshot:

:::image type="content" source="media/overview-iot-central-operator/simulated-telemetry.png" alt-text="Screenshot that shows a custom device view.":::

To monitor aggregate data from multiple devices, use device groups and the **Data explorer** page. To learn more, see [How to use data explorer to analyze device data](howto-create-analytics.md).

## Customize

You can further customize the device management and monitoring experience by using the following tools:

- Create more views to display on the **Devices** page for individual devices by adding view definitions to your [device templates](concepts-device-templates.md).
- Customize the text that describes your devices in the application. To learn more, see [Change application text](howto-customize-ui.md#change-application-text).
- Create [custom device management dashboards](howto-manage-dashboards.md). A dashboard can include a [pinned query](howto-manage-dashboards.md#pin-data-explorer-query-to-dashboard) from the **Data explorer**.

## Automate

To automate device management tasks, you can use:

- Rules to trigger actions automatically when device data that you're monitoring reaches predefined thresholds. To learn more, see [Configure rules](howto-configure-rules.md).
- [Job scheduling](howto-manage-devices-in-bulk.md#create-and-run-a-job) for regular device management tasks.
- The Azure CLI to manage your devices from a scripting environment. To learn more, see [az iot central](/cli/azure/iot/central).
- The IoT Central REST API to manage your devices programmatically. To learn more, see [How to use the IoT Central REST API to manage devices](howto-manage-devices-with-rest-api.md).

## Troubleshoot and remediate device issues

The [troubleshooting guide](troubleshoot-connection.md) helps you to diagnose and remediate common issues. You can use the **Devices** page to block devices that appear to be malfunctioning until the problem is resolved.

## Next steps

If you want to learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
