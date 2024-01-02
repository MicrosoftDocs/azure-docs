---
title: Quickstart - Configure Azure IoT Central rules and actions
description: In this quickstart, you learn how to configure telemetry-based rules and actions in your IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 10/28/2022
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc, mode-other

# Customer intent: As a new user of IoT Central, I want to learn how to use rules to notify me when a specific condition is detected on one of my device.
---

# Quickstart: Configure rules and actions for your device in Azure IoT Central

Get started with IoT Central rules. IoT Central rules let you automate actions that occur in response to specific conditions. The example in this quickstart uses accelerometer telemetry from the phone to trigger a rule when the phone is turned over.

In this quickstart, you:

- Create a rule that detects when a telemetry value passes a threshold.
- Configure the rule to notify you by email.
- Use the smartphone app to test the rule.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Complete the first quickstart [Create an Azure IoT Central application](./quick-deploy-iot-central.md).

## Create a telemetry-based rule

The smartphone app sends telemetry that includes values from the accelerometer sensor. The sensor works slightly differently on Android and iOS devices:

# [Android](#tab/android)

When the phone is lying on its back, the **z** value is greater than `9`, when the phone is lying on its front, the **z** value is less than `-9`.

1. To add a new telemetry-based rule to your application, in the left pane, select **Rules**.

1. To create a new rule, select **Create a rule**.

1. Enter **Phone turned over** as the rule name.

1. In the **Target devices** section, select **IoT Plug and Play mobile** as the **Device template**. This option filters the devices the rule applies to by device template type. You can add more filter criteria by selecting **+ Filter**.

1. In the **Conditions** section, you define what triggers your rule. Use the following information to define a single condition based on accelerometer z-axis telemetry. This rule uses aggregation, so you receive a maximum of one email for each device every five minutes:

    | Field            | Value            |
    |------------------|------------------|
    | Time aggregation | On, 5 minutes    |
    | Telemetry        | Acceleration / Z |
    | Operator         | Is less than     |
    | Aggregation      | Minimum          |
    | Value            | -9               |

    :::image type="content" source="media/quick-configure-rules/rule-target-condition-android.png" alt-text="Screenshot that shows the rule condition." lightbox="media/quick-configure-rules/rule-target-condition-android.png":::

1. To add an email action to run when the rule triggers, in the **Actions** section, select **+ Email**.

1. Use the information in the following table to define your action and then select **Done**:

    | Setting      | Value                    |
    |--------------|--------------------------|
    | Display name | Your phone moved         |
    | To           | Your email address       |
    | Notes        | Your phone is face down! |

    > [!TIP]
    > To receive an email notification, the email address must be a [user ID in the application](howto-manage-users-roles.md), and the user must have signed in to the application at least once.

    :::image type="content" source="media/quick-configure-rules/rule-action.png" alt-text="Screenshot that shows an email action added to the rule" lightbox="media/quick-configure-rules/rule-action.png":::

1. Select **Save**. Your rule is now listed on the **Rules** page.

# [iOS](#tab/ios)

When the phone is lying on its back, the **z** value is less than `-0.9`, when the phone is lying on its front, the **z** value is greater than `0.9`.

1. To add a new telemetry-based rule to your application, in the left pane, select **Rules**.

1. To create a new rule, select **Create a rule**.

1. Enter **Phone turned over** as the rule name.

1. In the **Target devices** section, select **IoT Plug and Play mobile** as the **Device template**. This option filters the devices the rule applies to by device template type. You can add more filter criteria by selecting **+ Filter**.

1. In the **Conditions** section, you define what triggers your rule. Use the following information to define a single condition based on accelerometer z-axis telemetry. This rule uses aggregation so you receive a maximum of one email for each device every five minutes:

    | Field            | Value            |
    |------------------|------------------|
    | Time aggregation | On, 5 minutes    |
    | Telemetry        | Acceleration / Z |
    | Operator         | Is greater than  |
    | Aggregation      | Maximum          |
    | Value            | 0.9              |

    :::image type="content" source="media/quick-configure-rules/rule-target-condition-ios.png" alt-text="Screenshot that shows the rule condition." lightbox="media/quick-configure-rules/rule-target-condition-ios.png":::

1. To add an email action to run when the rule triggers, in the **Actions** section, select **+ Email**.

1. Use the information in the following table to define your action and then select **Done**:

    | Setting      | Value                    |
    |--------------|--------------------------|
    | Display name | Your phone moved         |
    | To           | Your email address       |
    | Notes        | Your phone is face down! |

    > [!TIP]
    > To receive an email notification, the email address must be a [user ID in the application](howto-manage-users-roles.md), and the user must have signed in to the application at least once.

    :::image type="content" source="media/quick-configure-rules/rule-action.png" alt-text="Screenshot that shows an email action added to the rule" lightbox="media/quick-configure-rules/rule-action.png":::

1. Select **Save**. Your rule is now listed on the **Rules** page.

---

## Test the rule

Shortly after you save the rule, it becomes live. When the conditions defined in the rule are met, IoT Central sends an email to the address you specified in the action.

To trigger the rule, make sure the smartphone app is sending data and then place it face down on your desk. After five minutes, IoT Central sends you an email to notify you that your smartphone is face down.

After your testing is complete, disable the rule to stop receiving the notification emails in your inbox.

## Next steps

In this quickstart, you learned how to create a telemetry-based rule and add an action to it.

To learn more about integrating your IoT Central application with other services, see:

> [!div class="nextstepaction"]
> [Export and process data from your IoT Central application](quick-export-data.md).
