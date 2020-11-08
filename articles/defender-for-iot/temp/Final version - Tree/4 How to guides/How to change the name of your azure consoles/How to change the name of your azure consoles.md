---
title: How to change the name of your Azure consoles
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/03/2020
ms.topic: article
ms.service: azure
---

# Overview

## Change the sensor name

This article describes how to customize the name of your sensor. This option is available if you registered your sensor in the Azure Defender for IOT portal as a locally managed sensor.

The name appears in the web browser, in various console windows, and in the on-premises management console, site, and enterprise views. The default name is management console. We recommended you create unique names for your sensors.

To change the name:

1. In the bottom of the left pane of the console, select the current sensor label.

   :::image type="content" source="media/label-name.png" alt-text="sensor label":::

2. In the **Edit Sensor Name** dialog box, enter a name and select **Save**. The new name is applied.

## Sensor name change for cloud-managed sensors

If your sensor was registered as a cloud-managed sensor, the sensor name is defined by the name assigned during the registration. The name is included in the activation file you uploaded when signing in for the first time. If you want to change the name of the sensor, you need to upload a new activation file.

To change the name of a cloud-managed sensor:

1. Navigate to the Azure Defender for IoT portal, **Sensor Management** page.

2. Delete the sensor from the **Sensor Management** window.

3. Re-register with the new name.

## Changing the on-premises management console name

You can change the on-premises management console name.

**To change the name:**

1. In the bottom of the left pane, select the current name.

    :::image type="content" source="media/console-name.png" alt-text="Screenshot of Central Manager Version":::

2. In the Edit management console configuration dialog box, type the new name. The name cannot be longer than 25 characters.

    :::image type="content" source="media/edit-management-console-configuration.png" alt-text="Screenshot of Editing CyberX Platform Configuration":::

3. Select **Save**. The new name appears.
    :::image type="content" source="media/name-changed.png" alt-text="Changed name of console":::
