---
title: Change the name of your console name.
description: Change the sensor and on-premises management console name. The new name appears in the console web browser, in various console windows, and in troubleshooting logs.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/01/2020
ms.topic: how-to
ms.service: azure
---

# Change console names

This article describes how to change the sensor and on-premises management console name. The new name appears in the console web browser, in various console windows, and in troubleshooting logs.

## Change the sensor console name

The process for changing the sensor names varies for cloud connected sensors  and locally connected sensors. The default name is sensor.

### Change name of a locally connected sensor

To change the name:

1. In the bottom of the left pane of the console, select the current sensor label.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/label-name.png" alt-text="Sensor label name":::

1. In the edit sensor name dialog box, enter a name.

1. Select **Save**. The new name is applied.

### Change of a cloud connected sensor

If your sensor was registered as a cloud connected sensor, the sensor name is defined by the name assigned during the registration. The name is included in the activation file you uploaded when signing in for the first time. To change the name of the sensor, you need to upload a new activation file.

To change the name:

1. Navigate to the Defender for IoT portal, sensor management page.

1. Delete the sensor from the sensor management window.

1. Register with the new name.

1. Download and new activation file.

1. Log in to the sensor and upload the new activation file.

## Change the on-premises management console name

The default name is management console.

To change the name:

1. In the bottom of the left pane, select the current name.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/console-name.png" alt-text="Screenshot of the on-premises management console version":::

2. In the edit management console configuration dialog box, type the new name. The name cannot be longer than 25 characters.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/edit-management-console-configuration.png" alt-text="Screenshot of editing the Defender for IoT platform configuration":::

3. Select **Save**. The new name is applied.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/name-changed.png" alt-text="Changed name of the console":::

See also, [Deploy and onboard a sensor](how-to-onboard-sensors.md) 