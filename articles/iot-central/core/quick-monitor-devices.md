---
title: Quickstart - Monitor your devices in Azure IoT Central
description: Quickstart - As an operator, learn how to use your Azure IoT Central application to monitor your devices.
author: dominicbetts
ms.author: dobett
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# Quickstart: Use Azure IoT Central to monitor your devices

*This article applies to operators, builders, and administrators.*

This quickstart shows you, as an operator, how to use your Microsoft Azure IoT Central application to monitor your devices and change settings.

## Prerequisites

Before you begin, you should complete the three previous quickstarts [Create an Azure IoT Central application](./quick-deploy-iot-central.md), [Add a simulated device to your IoT Central application](./quick-create-simulated-device.md) and [Configure rules and actions for your device](quick-configure-rules.md).

## Receive a notification

Azure IoT Central sends notifications about devices as email messages. As a builder, you added a rule to send a notification to an operator when the humidity in a connected device sensor exceeded a threshold. As an operator, you check your emails for notifications.

Open the email message you received at the end of the [Configure rules and actions for your device](quick-configure-rules.md) quickstart. In the email, select the link to the device:

:::image type="content" source="media/quick-monitor-devices/email.png" alt-text="Screenshot that shows notification email":::

The **Overview** view for the simulated device you created in the previous quickstarts opens in your browser:

:::image type="content" source="media/quick-monitor-devices/dashboard.png" alt-text="Screenshot that shows overview of device that triggered the notification":::

## Investigate an issue

As an operator, you can view information about the device on the **Overview**, **About**, and **Commands** views. The builder created a **Manage device** view for you to edit device information and set device properties.

The chart on the dashboard shows a plot of the device humidity. You decide that the device humidity is too high.

## Remediate an issue

To make a change to the device, use the **Manage device** page.

Change **Target temperature** to 80 to warm the device and reduce the humidity. Choose **Save** to update the device. When the device confirms the settings change, the status of the property changes to **synced**:

:::image type="content" source="media/quick-monitor-devices/change-settings.png" alt-text="Screenshot that shows the updated target temperature setting for the device":::

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

In this quickstart, you learned how to:

* Receive a notification
* Investigate an issue
* Remediate an issue

Now that you know now to monitor your device, the suggested next step is to:

> [!div class="nextstepaction"]
> [Build and manage a device template](howto-set-up-template.md).
