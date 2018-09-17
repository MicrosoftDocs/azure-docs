---
title: Create and manage telemetry rules in your Azure IoT Central application | Microsoft Docs
description: Azure IoT Central telemetry rules enable you to monitor your devices in near real time and to automatically invoke actions, such as sending an email, when the rule triggers.
author: ankitgupta
ms.author: ankitgup
ms.date: 08/14/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# Create a telemetry rule and set up notifications in your Azure IoT Central application

*This article applies to operators, builders, and administrators.*

You can use Azure IoT Central to remotely monitor your connected devices. Azure IoT Central rules enable you to monitor your devices in near real time and automatically invoke actions, such as send an email or trigger Microsoft Flow. In just a few clicks, you can define the condition for which to monitor your device data and configure the corresponding action. This article explains how to create rules to monitor telemetry sent by the device.

Devices can use telemetry measurement to send numerical data from the device. A telemetry rule triggers when the selected device telemetry crosses a specified threshold.

## Create a telemetry rule

To create a telemetry rule, the device template must have at least one telemetry measurement defined. This example uses a refrigerated vending machine device that sends temperature and humidity telemetry. The rule monitors the temperature reported by the device and sends an email when it goes above 80 degrees.

1. Using Device Explorer, navigate to the device template for which you are adding the rule for.

1. Under the selected template, click on an existing device. 

    >[!TIP] 
    >If the template doesn't have any devices then add a new device first.

1. If you haven’t created any rules yet, you will see the following screen:

    ![No rules yet](media\howto-create-telemetry-rules\Rules_Landing_Page.png)

1. On the **Rules** tab, click **Edit Template** and then **+ New Rule** to see the types of rules you can create.

1. Click **Telemetry** to create a rule to monitor device telemetry.

    ![Rule Types](media\howto-create-telemetry-rules\Rule_Types.png)

1. Enter a name that helps you to identify the rule in this device template.

1. To immediately enable the rule for all the devices created for this template, toggle **Enable rule for all devices for this template**.

   ![Rule Detail](media\howto-create-telemetry-rules\Rule_Detail.png)
    
    The rule automatically applies to all the devices under the device template.
    

### Configure the rule conditions

Condition defines the criteria that is monitored by the rule.

1. Click **+** next to **Conditions** to add a new condition.

1. Select the telemetry you want to monitor from the **Measurement** dropdown.

   ![Condition](media\howto-create-telemetry-rules\Aggregate_Condition_Filled_Out.png)

1. Next, choose **Aggregation**, **Operator**, and provide a **Threshold** value.
    - Aggregation is optional. Without aggregation, the rule triggers for each telemetry data point that meets the condition. For example, if the rule is configured to trigger when temperature is above 80 then the rule will trigger almost instantly when the device reports temperature > 80.
    - If an aggregate function like Average, Min, Max, Count is chosen then, the user must provide an **Aggregate time window** over which the condition needs to be evaluated. For example, if you set the period as "5 minutes" and your rule looks for Average temperature above 80, the rule triggers when the average temperature is above 80 for at least 5 minutes. The rule evaluation frequency is the same as the **Aggregate time window**, which means, in this example, the rule is evaluated once every 5 minutes.

    >[!NOTE]
    >More than one telemetry measurement can be added under **Condition**. When multiple conditions are specified, all the conditions must be met for the rule to trigger. Each conditon gets joined by an 'AND' clause implicitly. When using aggregate, every measurement must be aggregated.
    
    

### Configure actions

This section shows you how to set up actions to take when the rule is fired. Actions get invoked when all the conditions specified in the rule evaluate to true.

1. Choose the **+** next to **Actions**. Here you see the list of available actions.  

    ![Add Action](media\howto-create-telemetry-rules\Add_Action.png)

1. Choose the **Email** action, enter a valid email address in the **To** field, and provide a note to appear in the body of the email when the rule triggers.

    > [!NOTE]
    > Emails are only sent to the users that have been added to the application and have logged in at least once. Learn more about [user management](howto-administer.md) in Azure IoT Central.

   ![Configure Action](media\howto-create-telemetry-rules\Configure_Action.png)

1. To save the rule, choose **Save**. The rule goes live within a few minutes and starts monitoring telemetry being sent to your application. When the condition specified in the rule matches, the rule triggers the configured email action.

1. Choose **Done** to exit the **Edit Template** mode.

You can add other actions to the rule such as Microsoft Flow and webhooks. You can add up to 5 actions per rule.

- [Microsoft Flow action](howto-add-microsoft-flow.md) to kick off a workflow in Microsoft Flow when a rule is triggered 
- [Webhook action](howto-create-webhooks.md) to notify other services when a rule is triggered

## Parameterize the rule

Rules can derive certain vales from **Device Properties** as parameters. Using parameters is helpful in scenarios where telemetry thresholds vary for different devices. When you create the rule, choose a device property that specifies the threshold, such as **Maximum Ideal Threshold**, instead of providing an absolute value, such as 80 degrees. When the rule executes, it matches the device telemetry with the value set in the device property.

Using parameters is an effective way to reduce the number of rules to manage per device template.

Actions can also be configured using **Device Property** as a parameter. If an email address is stored as a property, then it can be used when you define the **To** address.

## Delete a rule

If you no longer need a rule, delete it by opening the rule and choosing **Delete**. Deleting the rule removes it from the device template and all the associated devices.

## Enable or disable a rule for a device template

Navigate to the device and choose the rule you want to enable or disable. Toggle the **Enable rule for all devices of this template** button in the rule to enable or disable the rule for all devices that are associated with the device template.

## Enable or disable a rule for a device

Navigate to the device and choose the rule you want to enable or disable. Toggle the **Enable rule for this device** button to either enable or disable the rule for that device.

## Next steps

Now that you have learned how to create rules in your Azure IoT Central application, here are some next step:

- [Add Microsoft Flow action in rules](howto-add-microsoft-flow.md)
- [Add Webhook action in rules](howto-create-webhooks.md)
- [How to manage your devices](howto-manage-devices.md)
