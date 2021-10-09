---
title: Manage proprietary protocols (Horizon) 
description: Defender for IoT Horizon delivers an Open Development Environment (ODE) used to secure IoT and ICS devices running proprietary protocols.
ms.date: 12/12/2020
ms.topic: reference
---

# Defender for IoT Horizon

Defender for IoT Horizon includes an Open Development Environment (ODE) used to secure IoT and ICS devices running proprietary protocols.

Horizon provides:

  - Unlimited, full support for common, proprietary, custom protocols or protocols that deviate from any standard. 
  - A new level of flexibility and scope for DPI development.
  - A tool that exponentially expands OT visibility and control, without the need to upgrade to new versions.
  - The security of allowing proprietary development without divulging sensitive information.

Use the Horizon SDK to design dissector plugins that decode network traffic so it can be processed by automated Defender for IoT network analysis programs.

Protocol dissectors are developed as external plugins and are integrated with an extensive range of Defender for IoT services, for example services that provide monitoring, alerting, and reporting capabilities.

Contact <ms-horizon-support@microsoft.com> for details about working with the Open Development Environment (ODE) SDK and creating protocol plugins.

Once the plugin is developed, you can use Horizon web console to:

  - Upload your plugin
  - Enable and disable plugins  
  - Monitor and debug the plugin to evaluate performance
  - Create custom alerts based on proprietary protocols. Display them in the console and forward them to partner vendors. 

    :::image type="content" source="media/how-to-manage-proprietary-protocols/horizon-plugin.png" alt-text="Upload through your horizon plugin."::: 

This feature is available to Administrator, Cyberx, or Support users.

To sign in to the Horizon console:

1. Sign in to your sensor via CLI.
2. In the file: `/var/cyberx/properties/horizon.properties` change the `ui.enabled` property to `true` (`horizon.properties:ui.enabled=true`)
3. Sign in to the sensor console. 
4. Select **Horizon** from the main menu. 

   :::image type="content" source="media/how-to-manage-proprietary-protocols/horizon-from-the-menu.png" alt-text="Select Horizon from the main menu.":::  

The Horizon console displays the infrastructure plugins provided by Defender for IoT and any other plugin you created and uploaded. 

   :::image type="content" source="media/how-to-manage-proprietary-protocols/infrastructure.png" alt-text="Screenshot of the Horizon infrastructure.":::

## Upload plugins

After creating and testing your proprietary dissector plugin, you can upload and monitor it from the Horizon console.

To upload:

1. Select **UPLOAD** from the console.

   :::image type="content" source="media/how-to-manage-proprietary-protocols/upload-a-plugin.png" alt-text="Select upload for your plugin.":::

2. Drag or browse to your plugin. If the upload fails, an error message will be presented.

Contact <ms-horizon-support@microsoft.com> for details about working with the Open Development Environment (ODE) SDK and creating protocol plugins.

## Enable and disable plugins

Use the toggle button to enable and disable plugins. When disabled, traffic is no longer monitored.

Infrastructure plugins cannot be disabled.

## Monitor plugin performance 

The Horizon console Overview window provides basic information about the plugins you uploaded and lets you disable and enable them.

:::image type="content" source="media/how-to-manage-proprietary-protocols/horizon-overview.png" alt-text="Screenshot of the overview page of Horizon."::: 

| Application | The name of the plugin you uploaded. |
|--|--|
| :::image type="icon" source="media/how-to-manage-proprietary-protocols/toggle-icon.png" border="false"::: | Toggle the plugin on or off. The sensor will not handle protocol traffic defined in the plugin when you toggle off the plugin. |
| Time | The time the data was last analyzed. Updated every five seconds. |
| PPS | The number of packets per second. |
| Bandwidth | The average bandwidth detected within the last five seconds. |
| Malforms | Malformed validations are used after the protocol has been positively validated. If there is a failure to process the packets based on the protocol, a failure response is returned.<br/> <br />This column indicates the number of malform errors in the past five seconds. |
| Warnings | Packets match the structure and specification but there is unexpected behavior based on the plugin warning configuration. |
| Errors | The number of packets that failed basic protocol validations that the packet matches the protocol definitions.  The Number displayed here indicates that n umber of errors detected in the past five seconds. |
| :::image type="icon" source="media/how-to-manage-proprietary-protocols/monitor-icon.png" border="false"::: | Review details about malform and warnings detected for your plugin. |

### Plugin performance details

You can monitor real-time plugin performance by the analyzing number of malform and warnings detected for your plugin. An option is available to freeze the screen and export for further investigation

:::image type="content" source="media/how-to-manage-proprietary-protocols/snmp-monitor.png" alt-text="Screenshot of the SNMP monitor overview.":::

### Horizon logs

Horizon dissection information is available for export in the dissection details, dissection logs, and exports logs.

:::image type="content" source="media/how-to-manage-proprietary-protocols/export-logs-details.png" alt-text="Dissection details of the export logs.":::

## Trigger Horizon alerts 

Enhance alert management in your enterprise by triggering custom alerts for any protocol based on Horizon framework traffic dissectors. 

These alerts can be used to communicate information:  

  - About traffic detections based on protocols and underlying protocols in a proprietary Horizon plugin.

  - About a combination of protocol fields from all protocol layers. For example, in an environment running MODBUS, you may want to generate an alert when the sensor detects a write command to a memory register on a specific IP address and ethernet destination, or an alert when any access is performed to a specific IP address.

Alerts are triggered when Horizon alert, rule conditions, are met.

  :::image type="content" source="media/how-to-manage-proprietary-protocols/custom-alert-rules.png" alt-text="Sample custom rules for Horizon.":::

In addition, working with Horizon custom alerts lets you write your own alert titles and messages. Protocol fields and values resolved can also be embedded in the alert message text.

Using custom, conditioned-based alert triggering and messaging helps pinpoint specific network activity and effectively update your security, IT, and operational teams.

### Working with Horizon alerts

Alerts generated by Horizon custom alert rules are displayed in the sensor and management console Alerts window and in integrated partner systems when using Forwarding Rules. 

Alerts generated by Horizon can be acknowledged or muted. The learn option is not available for custom alerts as the alert events cannot be learned to policy baseline.

Alert information is forwarded to partner vendors when Forwarding rules are used.

The severity for Horizon custom alerts is critical.

Horizon custom alerts include static text under the **Manage this Event** section indicating that the alert was generated by your organization’s security team.

### Required permissions

Users defined as Defender for IoT users have permission to create Horizon Custom Alert Rules.

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

## See also

[View information provided in alerts](how-to-view-information-provided-in-alerts.md)
