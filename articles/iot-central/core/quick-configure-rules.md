---
title: Quickstart - Configure rules and actions in Azure IoT Central
description: This quickstart shows you how to configure telemetry-based rules and actions in your IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 05/27/2021
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# Quickstart: Configure rules and actions for your device in Azure IoT Central

In this quickstart, you create an IoT Central rule that sends an email when someone turns your phone over.

## Prerequisites

Before you begin, you should complete the previous quickstart [Create and use an Azure IoT Central application](./quick-deploy-iot-central.md) to connect the **IoT Plug and Play** smartphone app to your IoT Central application.

## Create a telemetry-based rule

The smartphone app sends telemetry that includes values from the accelerometer sensor. When the phone is lying on it's back, the **z** value is greater than `9`, when the phone is lying on it's front, the **z** value is less than `-9`.

1. To add a new telemetry-based rule to your application, in the left pane, select **Rules**.

1. To create a new rule, select **Create a rule**.

1. Enter **Phone turned over** as the rule name.

1. In the **Target devices** section, select **IoT Plug and Play mobile** as the **Device template**. This option filters the devices the rule applies to by device template type. You can add more filter criteria by selecting **+ Filter**.

1. In the **Conditions** section, you define what triggers your rule. Use the following information to define a single condition based on accelerometer z-axis telemetry. This rule uses aggregation so you receive a maximum of one email for each device every five minutes:

    | Field            | Value            |
    |------------------|------------------|
    | Time aggregation | On, 5 minutes    |
    | Telemetry        | Acceleration / Z |
    | Operator         | is less than     |
    | Aggregation      | Minimum          |
    | Value            | -9               |

    :::image type="content" source="media/quick-configure-rules/rule-target-condition.png" alt-text="Screenshot that shows the rule condition.":::

1. To add an email action to run when the rule triggers, in the **Actions** section, select **+ Email**.

1. Use the information in the following table to define your action and then select **Done**:

    | Setting      | Value                    |
    |--------------|--------------------------|
    | Display name | Your phone moved         |
    | To           | Your email address       |
    | Notes        | Your phone is face down! |

    > [!TIP]
    > To receive an email notification, the email address must be a [user ID in the application](howto-manage-users-roles.md), and the user must have signed in to the application at least once.

    :::image type="content" source="media/quick-configure-rules/rule-action.png" alt-text="Screenshot that shows an email action added to the rule":::

1. Select **Save**. Your rule is now listed on the **Rules** page.

## Test the rule

Shortly after you save the rule, it becomes live. When the conditions defined in the rule are met, IoT Central sends an email to the address you specified in the action.

To trigger the rule, make sure the smartphone app is sending data and then place it face down on your desk. The app now sends accelerometer z-axis telemetry values less than `-9`. After five minutes, IoT Central sends you an email to notify you that your smartphone is face down.

After your testing is complete, disable the rule to stop receiving the notification emails in your inbox.

## Next steps

In this quickstart, you learned how to:

* Create a telemetry-based rule
* Add an action

To learn more about integrating your IoT Central application with other services, see:

> [!div class="nextstepaction"]
> [Export and process data from your IoT Central application](quick-export-data.md).
