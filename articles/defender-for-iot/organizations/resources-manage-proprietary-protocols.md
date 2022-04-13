---
title: Manage proprietary protocols (Horizon) - Microsoft Defender for IoT
description: Defender for IoT Horizon delivers an Open Development Environment (ODE) used to secure IoT and ICS devices running proprietary protocols.
ms.date: 11/09/2021
ms.topic: how-to
---

# Manage proprietary protocols with Horizon plugins

You can use the Microsoft Defender for IoT Horizon SDK to develop your plugins to support proprietary protocols used for your IoT and ICS devices.

Horizon provides:

  - Unlimited, full support for common, proprietary, custom protocols or protocols that deviate from any standard.
  - A new level of flexibility and scope for DPI development.
  - A tool that exponentially expands OT visibility and control, without the need to upgrade to new versions.
  - The security of allowing proprietary development without divulging sensitive information.

Use the Horizon SDK to design dissector plugins that decode network traffic so it can be processed by automated Defender for IoT network analysis programs.

Protocol dissectors are developed as external plugins and are integrated with an extensive range of Defender for IoT services, for example services that provide monitoring, alerting, and reporting capabilities.

Contact <ms-horizon-support@microsoft.com> for details about working with the Open Development Environment (ODE) SDK and creating protocol plugins.

## Add a plugin to your sensor

**Prerequisites**:

- Access to the plugin developed for your proprietary protocol and the signing certificate you created for it
- Credentials for the Administrator, Cyberx, or Support users

After you've developed and tested a dissector plugin for proprietary protocols, add it to any sensors where it's needed.

**To upload your plugin to a sensor**:

1. Sign in to your sensor machine via CLI as the *Administrator*, *Cyberx*, or *Support* user.

1. Go the `/var/cyberx/properties/horizon.properties` file and verify that the `ui.enabled` property is set to `true` (`horizon.properties:ui.enabled=true`)

1. Sign in to the sensor console as the *Administrator*, *Cyberx*, or *Support*.

1. Select **System settings > Network monitoring > Protocols DPI (Horizon Plugins)**.

    The **Protocols DPI (Horizon Plugins)** page lists all of the infrastructure plugins provided out-of-the-box by Defender for IoT and any other plugin you've created and uploaded to the sensor.

1. Select **Upload signing certificate**, and then browse to and select the certificate you created for your plugin.

1. Select **Upload protocol plugin**, and then browse to and select your plugin file.

## Toggle a plugin on or off

After you've uploaded a plugin, you can toggle it on or off as needed. Sensors do not handle protocol traffic defined for a plugin that's currently toggled off (disabled).

> [!NOTE]
> Infrastructure plugins cannot be toggled off.

## Monitor plugin performance

Use the data shown on the **Protocols DPI (Horizon Plugins)** page in the sensor console to understand details about your plugin usage. To help locate a specific plugin, use the **Search** box to enter part of all of a plugin name.

The **Protocols DPI (Horizon Plugins)** lists the following data per plugin:

|Column name  |Description |
|---------|---------|
|**Plugin**     | Defines the plugin name        |
|**Type**     |   The plugin type, including APPLICATION or INFRASTRUCTURE.      |
|**Time**     |  The time that data was last analyzed using the plugin. The time stamp is updated every five seconds.       |
|**PPS**     |   The number of packets analyzed per second by the plugin.  |
|**Bandwidth**     |    The average bandwidth detected by the plugin within the last five seconds.     |
|**Malforms**     |  The number of malform errors detected in the last five seconds. Malformed validations are used after the protocol has been positively validated. If there is a failure to process the packets based on the protocol, a failure response is returned.       |
|**Warnings**     | The number of warnings detected, such as when packets match the structure and specifications, but unexpected behavior is detected, based on the plugin warning configuration.        |
| **Errors** | The number of errors detected in the last five seconds for packets that failed basic protocol validations for the packets that match protocol definitions. |

Horizon log data is available for export in the **Dissection statistics** and **Dissection Logs**, log files. For more information, see [Export troubleshooting logs](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md).

<!--
## Create custom alerts for Horizon-based protocols

After you've started to detect traffic using your proprietary plugin, configure a custom alert for traffic detected. Custom, conditioned-based alert triggers and messages helps to pinpoint specific network activity and effectively update your security, IT, and operational teams.

Use custom alerts to detect traffic based on protocols and underlying protocols in a proprietary Horizon plugin, or a combination of protocol fields from all protocol layers. Custom alerts also let you write your own alert titles and messages, and handle protocol fields and values in the alert message text.

For example, in an environment running MODBUS, you may want to generate an alert when the sensor detects a write command to a memory register on a specific IP address and ethernet destination, or an alert when any access is performed to a specific IP address.

- Alerts generated by Horizon custom alert rules are displayed on the sensor and on-premises management consoles **Alerts** pages, and in integrated partner systems when you've configured forwarding rules.

- While you can close or mute a Horizon-based alert, you cannot learn custom alerts to prevent them from being triggered again.

- The alert severity for Horizon-based alerts is always *Critical*.

- Horizon-based alerts always include static text under the **Manage this Event** section, indicating that the alert was generated by your organization’s security team.


### About creating rule conditions

Rule conditions describe the network traffic that should be detected to trigger the alert. Rule conditions can comprise one or several sets of fields, operators, and values. Create condition sets, by using **AND**.

When the rule condition or condition set is met, the alert is sent. You will be notified if the condition logic is not valid.

  :::image type="content" source="media/how-to-manage-proprietary-protocols/and-condition.png" alt-text="Use the AND condition for your custom rule.":::

You can also create several rules for one protocol. This means, an alert will be triggered for each rule you created, when the rule conditions are met.

### About titles and messages

Alert messages can contain alphanumeric characters you enter, as well as traffic variables detected. For example, include the detected source and destination addresses in the alert messages. Various languages are supported.

### About alert recommendations 

Horizon custom alerts include static text under the **Manage this Event** section indicating that the alert was generated by your organization’s security team. You can also work with alert comments to improve communication between individuals and teams reading your alert. 

## Create Horizon alert rules

This article describes how to create the alert rule.

To create Horizon custom alerts:

1. Right-click a plugin from the plugins menu in the Horizon console.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/plugins-menu.png" alt-text="Right-click on a plugin from the menu.":::

2. Select **Horizon Custom Alerts**. The **Rule** window opens for the plugin you selected.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/sample-rule-window.png" alt-text="The sample rule window opens for your plugin.":::

3. Enter a title in the Title field.

4. Enter an alert message in the Message field. Use curly brackets `{}` to include detected field parameters in the message. When you enter the first bracket, relevant fields appear.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/rule-window.png" alt-text="Use {} in the rule window to include detected fields.":::

5. Define alert conditions.

   :::image type="content" source="media/how-to-manage-proprietary-protocols/define-conditions.png" alt-text="Define the alert's conditions.":::

6. Select a **Variable**. Variables represent fields configured in the plugin.

7. Select an **Operator**:

    - Equal to
    
    - Not equal to
    
    - Less than
    
    - Less than or equal to
    
    - Greater than
    
    - Greater than or equal to

8. Enter a **Value** as a number. If the variable you selected is a MAC address or IP address, the value must be converted from a dotted-decimal address to decimal format. Use an IP address conversion tool, for example <https://www.ipaddressguide.com/ip>.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/ip-address-value.png" alt-text="Translated IP address value.":::

9. Select **AND** to create a condition set.

10. Select **SAVE**. The rule is added to the Rules section.

### Edit and delete Horizon custom alert rules

Use edit and delete options as required. Certain rules are embedded and cannot be edited or deleted.

### Create multiple rules

When you create multiple rules, alerts are triggered when any rule condition or condition sets are valid.

-->
## Next steps

For more information, see [Microsoft Defender for IoT - supported IoT, OT, ICS, and SCADA protocols](concept-supported-protocols.md).