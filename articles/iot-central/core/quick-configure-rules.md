---
title: Quickstart - Configure rules and actions in Azure IoT Central
description: This quickstart shows you, as a builder, how to configure telemetry-based rules and actions in your Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# Quickstart: Configure rules and actions for your device in Azure IoT Central

In this quickstart, you create a rule that sends an email when the humidity reported by a device sensor exceeds 55%.

## Prerequisites

Before you begin, you should complete the two previous quickstarts [Create an Azure IoT Central application](./quick-deploy-iot-central.md) and [Add a simulated device to your IoT Central application](./quick-create-simulated-device.md) to create the **Sensor Controller** device template to work with.

## Create a telemetry-based rule

1. To add a new telemetry-based rule to your application, in the left pane, select **Rules**.

1. To create a new rule, select **+ New**.

1. Enter **Environmental humidity** as the rule name.

1. In the **Target devices** section, select **Sensor Controller** as the device template. This option filters the devices the rule applies to by device template type. You can add more filter criteria by selecting **+ Filter**.

1. In the **Conditions** section, you define what triggers your rule. Use the following information to define a condition based on temperature telemetry:

    | Field        | Value            |
    | ------------ | ---------------- |
    | Measurement  | SensorHumid      |
    | Operator     | is greater than  |
    | Value        | 55               |

    To add more conditions, select **+ Condition**.

    :::image type="content" source="media/quick-configure-rules/condition.png" alt-text="Screenshot showing the rule condition":::

1. To add an email action to run when the rule triggers, select **+ Email**.

1. Use the information in the following table to define your action and then select **Done**:

    | Setting   | Value                                             |
    | --------- | ------------------------------------------------- |
    | Display name | Operator email action                          |
    | To        | Your email address                                |
    | Notes     | Environmental humidity exceeded the threshold. |

    > [!NOTE]
    > To receive an email notification, the email address must be a [user ID in the application](howto-administer.md), and that user must have signed in to the application at least once.

    :::image type="content" source="media/quick-configure-rules/action.png" alt-text="Screenshot that shows an email action added to the rule":::

1. Select **Save**. Your rule is listed on the **Rules** page.

## Test the rule

Shortly after you save the rule, it becomes live. When the conditions defined in the rule are met, your application sends an email to the address you specified in the action.

> [!NOTE]
> After your testing is complete, turn off the rule to stop receiving alerts in your inbox.

## Next steps

In this quickstart, you learned how to:

* Create a telemetry-based rule
* Add an action

To learn more about monitoring devices connected to your application, continue to the quickstart:

> [!div class="nextstepaction"]
> [Use Azure IoT Central to monitor your devices](quick-monitor-devices.md).
