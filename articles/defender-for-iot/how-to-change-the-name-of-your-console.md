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

This article describes how to change the name of a sensor and the name of the on-premises management console. The new names appear in the console web browser, in various console windows, and in troubleshooting logs.

## Change the name of a sensor

The process for changing sensor names varies for locally connected sensors and cloud-connected sensors. The default name is **sensor**.

### Change the name of a locally connected sensor

To change the name:

1. In the bottom of the left pane of the console, select the current sensor label.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/label-name.png" alt-text="Screenshot that shows the sensor label.":::

1. In the **Edit sensor name** dialog box, enter a name.

1. Select **Save**. The new name is applied.

### Change the name of a cloud-connected sensor

If your sensor was registered as a cloud-connected sensor, the sensor name is defined by the name assigned during the registration. The name is included in the activation file that you uploaded when signing in for the first time. To change the name of the sensor, you need to upload a new activation file.

To change the name:

1. In the Azure Defender for IoT portal, go to the **Sensor management** page.

1. Delete the sensor from the **Sensor management** window.

1. Register with the new name.

1. Download and new activation file.

1. Sign in to the sensor and upload the new activation file.

## Change the name of the on-premises management console

The default name is **management console**.

To change the name:

1. In the bottom of the left pane, select the current name.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/console-name.png" alt-text="Screenshot of the on-premises management console version.":::

2. In the **Edit management console configuration** dialog box, enter the new name. The name can't be longer than 25 characters.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/edit-management-console-configuration.png" alt-text="Screenshot of editing the Defender for IoT platform configuration.":::

3. Select **Save**. The new name is applied.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/name-changed.png" alt-text="Screenshot that shows the changed name of the console.":::

For more information, see [Deploy and onboard a sensor](how-to-onboard-sensors.md). 
