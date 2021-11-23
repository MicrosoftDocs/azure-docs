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

Data mapping lets you transform complex device telemetry into structured data inside IoT Central. For each of your devices, you can map a specific JSON path in the device telemetry message to an _alias_. An alias is a friendly name for the target you're mapping to. IoT Central uses the mappings to transform telemetry on the way in to IoT Central. Use the transformed data to create device templates and device management experiences in IoT Central. When you map JSON paths on multiple devices to a common alias, you can normalize the telemetry and use it for device management. The mapped telemetry is available to export to destinations outside IoT Central.

:::image type="content" source="media/howto-map-data/map-data-summary.png" alt-text="Diagram that summarizes the mapping process in IoT Central." border="false":::

## Map telemetry for your device

A mapping uses a [JSONPath](https://goessner.net/articles/JsonPath/) expression to identify the value in an incoming telemetry message to map to an alias.

A JSONPath expression begins with the `$` character, which refers to the root element of the message. The `$` is followed by a sequence of child elements separated using square brackets. For example:

```json
$["messages"]["tmp"]

$["opcua"]["payload"][0]["value"]
```

To create a mapping in your IoT Central application, choose one of the following options to navigate to the **Map data** panel:

* From any device page, select **Manage device > Map data**:

    :::image type="content" source="media/howto-map-data/manage-device.png" alt-text="Screenshot that shows the **Map data** menu item.":::

* From the **Raw data** view for your device, expand any telemetry message, hover the mouse pointer over a path, and select **Add alias**. The **Map data** panel opens with the JSONPath expression copied to the **JSON path** field:

    :::image type="content" source="media/howto-map-data/raw-data.png" alt-text="Screenshot that shows the **Add alias** option on the **Raw data** view.":::

The left-hand side of the **Map data** panel shows the latest message from your device. Hover to mouse pointer over any part of the data and select **Add Alias**. The JSONPath expression is copied to **JSON path**. Add your **Alias** name. Add as many mappings as you need and then select **Save**:

:::image type="content" source="media/howto-map-data/map-data.png" alt-text="Screenshot of the **Map data** view showing the Json path and alias.":::

> [!TIP]
> If there's no data in left hand panel, you can manually enter a JSONPath expression in the **JSON path** field.

To verify that IoT Central is mapping the telemetry, navigate to **Raw data** view for your device and check the `_mappeddata` section:

:::image type="content" source="media/howto-map-data/mapped-data.png" alt-text="Screenshot that shows the mapped data section in a message in the **Raw data** view.":::

For devices assigned to a device template, you can't map data for components or inherited interfaces. However, you can map any data from your device before you assign it to a device template.

## Manage mappings

To view, edit, or delete mappings, navigate to the **Mapped aliases** page. Select a mapping to edit or delete it. You can select multiple mappings and delete them at the same time:

:::image type="content" source="media/howto-map-data/mapped-aliases.png" alt-text="Screenshot that shows the **Mapped aliases** view with the edit and delete buttons.":::

## Next steps

Now that you've learned how to map data for your device, a suggested next step is to learn [How to use analytics to analyze device data](howto-create-analytics.md).
