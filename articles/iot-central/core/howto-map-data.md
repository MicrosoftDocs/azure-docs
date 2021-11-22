---
title: Map data for your device in IoT Central | Microsoft Docs
description: IoT devices send complex data that may need to be transformed at ingress for using the device data inside IoT Central or exporting the data to a destination. This article describes how to map device data on the way into IoT Central. 
author: dominicbetts
ms.author: dobett
ms.date: 11/06/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central

# This topic applies to solution builders.
---

# Data mapping in IoT Central

Data mapping lets you transform complex device data into structured data inside IoT Central. For each of your device, you can map a specific JSONpath in the device data message to an Alias, a friendly name to indicate what the JSONpath is leading to. IoT Central will use the device mapped aliases information to do a data transformation at the way into IoT Central (ingress) and provide mapped data that you can use in creating device templates and device management experiences in IoT Central. By mapping JSONpaths to a common alias across multiple devices, you can normalize the data and use it for device management. Also, you can export the mapped data to a destination outside of IoT Central.


:::image type="content" source="media/howto-map-data/map-data-summary.png" alt-text="Summary of data mapping" border="false":::


This article shows you how to map data for each of your device in IoT Central.

## Map data for your device 

Using IoT Central portal devices page, you can start from any of the following sections to reach the Map data panel.To map data, you have to provide a JSONpath from your device message and an alias. You can either select a specific JSON path from the device Raw data or manually enter a JSONpath. When manually entering a JSONpath, follow the JSONpath notation to provide a JSONpath from your device message.

**JSONpath Notation**
A JSONpath expression begins with the dollar sign ($) character, which refers to the root element of the message. The dollar sign is followed by a sequence of child elements, which are separated via the square brackets. Following are few examples of JSONpath notation

$["messages"]["tmp"]

$["opcua"]["payload][0]["value"]


1. **Manage device**: Navigate to Manage device and then select Map data. Now you will see a Map data panel. On the left hand side of the panel, you will find the latest message from your device. Hover over any part of the data and click + Add Alias. The JSONpath in the message will be copied to your right hand JSONpath. Verify the path and add an Alias. Add as many JSONpath and Alias combinations as required and then click Save. 

    > [!TIP]
    > If there is no data in left side panel then manually enter a JSONpath

:::image type="content" source="media/howto-map-data/manage-device.png" alt-text="Manage device" border="false":::

:::image type="content" source="media/howto-map-data/map-data-panel1.png" alt-text="Map data panel" border="false":::

2. **Raw data view**: From the device Raw data view section, expand any device message and hover over the path of device data that you want add as a JSONpath. Now click +Add alias. This will take you to Map data panel with JSON already copied. Now you can add an alias and click Save.

:::image type="content" source="media/howto-map-data/raw-data.png" alt-text="Raw data view" border="false":::

Once the JSON path and Alias are saved, you can find them the mapped aliases section. To verify that IoT Central is create mapped data, navigate to Raw data view section and verify in the _mappeddata section

    > [!TIP]
    > For devices assigned to a template, you cannot map data for component and inherited interfaces. In this case, a better way is to map data for your device before you assign it to template


## Edit or Delete Mapped aliases
To edit or delete JSONpath and aliases, navigate to the Mapped aliases section and select a JSON path to alias mapping to edit or delete. You can select multiple mappings and delete them at once.

## Next steps
Now that you've learned how to map data for your device, a suggested next step is to learn [How to use analytics to analyze device data](howto-create-analytics.md).