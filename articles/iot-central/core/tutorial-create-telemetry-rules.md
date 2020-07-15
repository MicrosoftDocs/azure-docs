---
title: Tutorial - Create and manage rules in your Azure IoT Central application
description: This tutorial shows you how Azure IoT Central rules enable you to monitor your devices in near real time and to automatically invoke actions, such as sending an email, when the rule triggers.
author: dominicbetts
ms.author: dobett
ms.date: 04/06/2020
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: philmea
---

# Tutorial: Create a rule and set up notifications in your Azure IoT Central application

*This article applies to operators, builders, and administrators.*

You can use Azure IoT Central to remotely monitor your connected devices. Azure IoT Central rules let you monitor your devices in near real time and automatically invoke actions, such as sending an email. This article explains how to create rules to monitor the telemetry your devices send.

Devices use telemetry to send numerical data from the device. A  rule triggers when the selected device telemetry crosses a specified threshold.

In this tutorial, you create a rule to send an email when the temperature in a simulated environmental sensor device exceeds 70&deg; F.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a rule
> * Add an email action

## Prerequisites

Before you begin, complete the [Create an Azure IoT Central application](./quick-deploy-iot-central.md) and [Add a simulated device to your IoT Central application](./quick-create-simulated-device.md) quickstarts to create the **MXChip IoT DevKit** device template to work with.

## Create a rule

To create a telemetry rule, the device template must include at least one telemetry value. This tutorial uses a simulated **MXChip IoT DevKit** device that sends temperature and humidity telemetry. You added this device template and created a simulated device in the [Add a simulated device to your IoT Central application](./quick-create-simulated-device.md) quickstart. The rule monitors the temperature reported by the device and sends an email when it goes above 70 degrees.

1. In the left pane, select **Rules**.

1. If you haven't created any rules yet, you see the following screen:

    ![No rules yet](media/tutorial-create-telemetry-rules/rules-landing-page1.png)

1. Select **+** to add a new rule.

1. Enter the name _Temperature monitor_ to identify the rule and press Enter.

1. Select the **MXChip IoT DevKit** device template. By default, the rule automatically applies to all the devices associated with the device template. To filter for a subset of the devices, select **+ Filter** and use device properties to identify the devices. To disable the rule, toggle the **Enabled/Disabled** button in the rule header:

    ![Filters and enable](media/tutorial-create-telemetry-rules/device-filters.png)

### Configure the rule conditions

Conditions define the criteria that the rule monitors. In this tutorial, you configure the rule to fire when the temperature exceeds  70&deg; F.

1. Select **Temperature** in the **Telemetry** dropdown.

1. Next, choose **Is greater than** as the **Operator** and enter _70_ as the **Value**.

    ![Condition](media/tutorial-create-telemetry-rules/condition-filled-out1.png)

1. Optionally, you can set a **Time aggregation**. When you select a time aggregation, you must also select an aggregation type, such as average or sum from the aggregation drop-down.

    * Without aggregation, the rule triggers for each telemetry data point that meets the condition. For example, if you configure the rule to trigger when temperature is above 70 then the rule triggers almost instantly when the device temperature exceeds this value.
    * With aggregation, the rule triggers if the aggregate value of the telemetry data points in the time window meets the condition. For example, if you configure the rule to trigger when temperature is above 70 and with an average time aggregation of 10 minutes, then the rule triggers when the device reports an average temperature greater than 70, calculated over a 10-minute interval.

     ![Aggregate condition](media/tutorial-create-telemetry-rules/aggregate-condition-filled-out1.png)

You can add multiple conditions to a rule by selecting **+ Condition**. When multiple conditions are specified, all the conditions must be met for the rule to trigger. Each condition is joined by an implicit `AND` clause. If you're using time aggregation with multiple conditions, all the telemetry values must be aggregated.

### Configure actions

After you define the condition, you set up the actions to take when the rule fires. Actions are invoked when all the conditions specified in the rule evaluate to true.

1. Select **+ Email** in the **Actions** section.

1. Enter _Temperature warning_ as the display name for the action, your email address in the **To** field, and _You should check the device!_ as a note to appear in the body of the email.

    > [!NOTE]
    > Emails are only sent to the users that have been added to the application and have logged in at least once. Learn more about [user management](howto-administer.md) in Azure IoT Central.

   ![Configure Action](media/tutorial-create-telemetry-rules/configure-action1.png)

1. To save the action, choose **Done**. You can add multiple actions to a rule.

1. To save the rule, choose **Save**. The rule goes live within a few minutes and starts monitoring telemetry being sent to your application. When the condition specified in the rule is met, the rule triggers the configured email action.

After a while, you receive an email message when the rule fires:

![Example email](media/tutorial-create-telemetry-rules/email.png)

## Delete a rule

If you no longer need a rule, delete it by opening the rule and choosing **Delete**.

## Enable or disable a rule

Choose the rule you want to enable or disable. Toggle the **Enabled/Disabled** button in the rule to enable or disable the rule for all devices that are scoped in the rule.

## Enable or disable a rule for specific devices

Choose the rule you want to customize. Use one or more filters in the **Target devices** section to narrow the scope of the rule to the devices you want to monitor.

## Next steps

In this tutorial, you learned how to:

* Create a telemetry-based rule
* Add an action

Now that you've defined a threshold-based rule the suggested next step is to learn how to:

> [!div class="nextstepaction"]
> [Configure continuous data export](./howto-export-data.md).
