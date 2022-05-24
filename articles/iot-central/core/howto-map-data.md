---
title: Transform telemetry on ingress to IoT Central | Microsoft Docs
description: To use complex telemetry from devices, you can use mappings to transform it as it arrives in your IoT Central application. This article describes how to map device telemetry on ingress to IoT Central. 
author: dominicbetts
ms.author: dobett
ms.date: 11/22/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# Map telemetry on ingress to IoT Central

Data mapping lets you transform complex device telemetry into structured data inside IoT Central. For each of your devices, you can map a specific JSON path in the device telemetry message to an _alias_. An alias is a friendly name for the target you're mapping to. IoT Central uses the mappings to transform telemetry on the way in to IoT Central. You can use the mapped telemetry to:

* Create device templates and device management experiences in IoT Central.
* Normalize telemetry from different devices by mapping JSON paths on multiple devices to a common alias.
* Export to destinations outside IoT Central.

:::image type="content" source="media/howto-map-data/map-data-summary.png" alt-text="Diagram that summarizes the mapping process in IoT Central." border="false":::

The following video walks you through the data mapping process:

> [!VIDEO https://aka.ms/docs/player?id=d8e684a7-deda-47d1-9d6c-36939adc57bb]

## Map telemetry for your device

A mapping uses a [JSONPath](https://www.npmjs.com/package/jsonpath) expression to identify the value in an incoming telemetry message to map to an alias.

A JSONPath expression begins with the `$` character, which refers to the root element of the message. The `$` is followed by a sequence of child elements separated using square brackets. For example:

```json
$["messages"]["tmp"]

$["opcua"]["payload"][0]["value"]

$["Messages"]["Payload"]["nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1"]["Value"]
```

IoT Central uses a subset of the JSONPath expression syntax:

* Each segment can only be a non-negative number or a string enclosed in double quotation marks.
* A segment can't contain backslash, square bracket, or double quotation marks.
* A JSON path can't exceed 1,000 characters.

To create a mapping in your IoT Central application, choose one of the following options to navigate to the **Map data** panel:

* From any device page, select **Manage device > Map data**:

    :::image type="content" source="media/howto-map-data/manage-device.png" alt-text="Screenshot that shows the **Map data** menu item.":::

* From the **Raw data** view for your device, expand any telemetry message, hover the mouse pointer over a path, and select **Add alias**. The **Map data** panel opens with the JSONPath expression copied to the **JSON path** field:

    :::image type="content" source="media/howto-map-data/raw-data.png" alt-text="Screenshot that shows the **Add alias** option on the **Raw data** view.":::

The left-hand side of the **Map data** panel shows the latest message from your device. Hover to mouse pointer over any part of the data and select **Add Alias**. The JSONPath expression is copied to **JSON path**. Add an **Alias** name with no more than 64 characters. Add as many mappings as you need and then select **Save**:

:::image type="content" source="media/howto-map-data/map-data.png" alt-text="Screenshot of the **Map data** view showing the Json path and alias.":::

For a given device:

* No two mappings can have the same JSON path.
* No two mappings can have the same alias.

> [!TIP]
> You may need to wait for several minutes for your device to send a telemetry message to display in the left hand panel. If there's still no data in left hand panel, you can manually enter a JSONPath expression in the **JSON path** field.

To verify that IoT Central is mapping the telemetry, navigate to **Raw data** view for your device and check the `_mappeddata` section:

:::image type="content" source="media/howto-map-data/mapped-data.png" alt-text="Screenshot that shows the mapped data section in a message in the **Raw data** view.":::

If you don't see your mapped data after refreshing the **Raw data** several times, check that the JSONPath expression you're using matches the structure of the telemetry message.

For IoT Edge devices, the data mapping applies to the telemetry from all the IoT Edge modules and hub. You can't apply mappings to a specific IoT edge module.

For devices assigned to a device template, you can't map data for components or inherited interfaces. However, you can map any data from your device before you assign it to a device template.

## Manage mappings

To view, edit, or delete mappings, navigate to the **Mapped aliases** page. Select a mapping to edit or delete it. You can select multiple mappings and delete them at the same time:

:::image type="content" source="media/howto-map-data/mapped-aliases.png" alt-text="Screenshot that shows the **Mapped aliases** view with the edit and delete buttons.":::

By default, data exports from IoT Central include mapped data. To exclude mapped data, use a [data transformation](howto-transform-data-internally.md) in your data export.

## Next steps

Now that you've learned how to map data for your device, a suggested next step is to learn [How to use data explorer to analyze device data](howto-create-analytics.md).
