---
title: Manage proprietary protocols (horizon) 
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/11/2020
ms.topic: article
ms.service: azure
---

# Overview

Defender for IoT *Horizon* delivers an Open Development Environment (ODE) used to secure IoT/ICS devices running proprietary protocols.   

Horizon provides:

  - Unlimited, full support for common, proprietary, custom protocols or protocols that deviate from any standard. 
  - A new level of flexibility and scope for DPI development.
  - A tool that exponentially expands OT visibility and control, without the need to upgrade to new versions.
  - The security of allowing proprietary development without divulging sensitive information.


Use the Horizon SDK to design dissector plugins that decode network traffic so it can be processed by automated Defender for IoT network analysis programs.   

Protocol dissectors are developed as external plugins and are integrated with an extensive range of Defender for IoT services, for example services that provide monitoring, alerting and reporting capabilities.  

Use the Horizon Web Console to: 

  - Upload your plugin
  - Enable and disable plugins  
  - Monitor and debug the plugin to evaluate performance
  - Create Custom Alerts based on proprietary protocols; display them in the console and forward them to 3rd party vendors. 

    :::image type="content" source="media/how-to-manage-proprietary-protocols/image333.png" alt-text="upload plugin":::  


**To Log in to the Horizon Console:**

1. Log in your sensor CLI (Admin, CyberX or Support User).
2. In the file: /var/cyberx/properties/horizon.properties change the **ui.enabled** property to **true** (horizon.properties:ui.enabled=true)
3. Log in to the sensor console. 
4. Select Horizon from the main menu. 

   :::image type="content" source="media/how-to-manage-proprietary-protocols/image334.png" alt-text="select horizon":::  

The Horizon console displays the Infrastructure plugins provided by Defender for IoT and any other plugin you created and uploaded. 

   :::image type="content" source="media/how-to-manage-proprietary-protocols/image335.png" alt-text="Infrastructure":::  

## Manage plugins

### Upload plugins

After creating and testing your proprietary dissector plugin, you can upload and monitor it form the Horizon console.

**To upload:**

1. Select UPLOAD from the console.

   :::image type="content" source="media/how-to-manage-proprietary-protocols/image336.png" alt-text="Select upload":::

2. Drag or browse to your plugin. If the upload fails an error message will be presented.

Contact your support at [support.microsoft.com](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099) for details about working with the Open Development Environment (ODE) SDK.

### Enable and disable plugins

Use the toggle button to enable and disable plugins. When disabled, traffic is no longer monitored.

Infrastructure plugins cannot be disabled.

## Monitor plugin performance 

The Horizon console Overview window provides basic information about the plugins you uploaded and lets you disable and enable them.

:::image type="content" source="media/how-to-manage-proprietary-protocols/image337.png" alt-text="overview":::  

| Application | The name of the plugin you uploaded. |
|--|--|
| <img src="media/how-to-manage-proprietary-protocols/image338.png" alt="toggle" style="width:0.70694in;height:0.21862in" /> | Toggle on/off the plugin. The sensor will not handle protocol traffic defined in the plugin when you toggle the plugin off. |
| Time | The time the data was last analyzed. Updated every 5 seconds. |
| PPS | The number of packets per second. |
| Bandwidth | The average bandwidth detected within the last 5 seconds. |
| Malforms | Malformed validations are used after the protocol has been positively validated. If there is a failure to process the packets based on the protocol, a failure response is returned.   <br/> <br />This column indicates the number of malform errors in the past 5 seconds. |
| Warnings | Packets match the structure and specification but there is unexpected behavior based on the plugin warning configuration. |
| Errors | The number of packets that failed basic protocol validations that the packet matches the protocol definitions.  The Number displayed here indicates that n umber of errors detected in the past 5 seconds. |
| <img src="media/how-to-manage-proprietary-protocols/image339.png" alt="monitor" style="width:0.97904in;height:0.35412in" /> | Review details about Malform and Warnings detected for your plugin. |

### Plugin performance details

You can monitor real-time plugin performance by the analyzing number of *Malform* and *Warnings* detected for your plugin. An option is available to freeze the screen and export for further investigation

:::image type="content" source="media/how-to-manage-proprietary-protocols/image340.png" alt-text="SNMP monitor":::

### Horizon logs

Horizon dissection information is available for export in the *Dissection Details* and *Dissection Logs* Exports logs.

:::image type="content" source="media/how-to-manage-proprietary-protocols/image341.png" alt-text="Dissection Details":::

## Trigger horizon alerts 

Enhance alert management in your enterprise by triggering custom alerts for any protocol based on Horizon Framework traffic dissectors. These alerts can be used to communicate information:

These alerts can be used to communicate information:  

  - About traffic detections based on protocols and underlying protocols in a proprietary Horizon plugin.

  - About a combination of protocol fields from all protocol layers. For example, in an environment running MODBUS, you may want to generate an alert when the sensor detects a write command to a memory register on a specific IP and ethernet destination, or an alert when any access is performed to a specific IP address.

Alerts are triggered when Horizon alert *rule conditions* are met.

  :::image type="content" source="media/how-to-manage-proprietary-protocols/image342.png" alt-text="rule conditions":::

In addition, working with Horizon Custom Alerts lets you write your own alert titles and messages. Protocol fields and values resolved can also be embedded in the alert message text.

Using custom, conditioned-based alert triggering and messaging helps pinpoint specific network activity and effectively update your security, IT, and operational teams.

### Working with horizon alerts

Alerts generated by Horizon Custom Alert Rules are displayed in the sensor and management console *Alerts* window and in integrated 3<sup>rd</sup> party systems when using Forwarding Rules. 

Alerts generated by Horizon can be Acknowledged or Muted. The Learn option is not available for custom alerts as the alert events cannot be learned to policy baseline.

Alert information is forwarded to 3<sup>rd</sup> party vendors when Forwarding rules are used.

The severity for Horizon custom alerts is Critical.

Horizon custom alerts include static text under the **Manage this Event** section indicating that the alert was generated by your organization’s security team.

### Required permissions

Users defined as *CyberX* users have permission to create Horizon Custom Alert Rules.

### About creating rule conditions

Rule conditions describe the network traffic that should be detected to trigger the alert. Rule conditions can comprise one or several sets of fields, operators, and values. Create condition sets, by using **AND**.

When the rule condition or condition set is met, the alert is sent. You will be notified if the condition logic is not valid.

  :::image type="content" source="media/how-to-manage-proprietary-protocols/image343.png" alt-text="creating rule conditions":::

You can also create *several rules* for one protocol. This means, an alert will be triggered for each rule you created, when the rule conditions are met.

### About creating titles and messages

Alert messages can contain alphanumeric characters you enter, as well as traffic variables detected. For example, include the detected source and destination addresses in the alert messages. Various languages are supported.

### About alert recommendations 

Horizon custom alerts include static text under the **Manage this Event** section indicating that the alert was generated by your organization’s security team. You can also work with alert *comments* to improve communication between individuals and teams reading your alert. See [Accelerate Incident Workflow with Alert Comments](./accelerate-incident-workflow-with-alert-comments.md) for details.

### How-to create horizon alert rules

This section describes how-to create the alert rule.

**To create Horizon Custom Alerts:**

1. Right-click a plugin from the Plugins menu in the Horizon console.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/image344.png" alt-text="Plugins menu":::

2. Select **Horizon Custom Alerts**. The rule window opens for the plugin you selected.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/image345.png" alt-text="Horizon Custom Alerts":::

3. Enter a title in the **Title** field.

4. Enter an alert message in the **Message** field. Use curly brackets {} to include detected field parameters in the message. When you enter the first bracket, relevant fields appear.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/image346.png" alt-text="Message":::

5. Define alert conditions.:::image type="content" source="media/how-to-manage-proprietary-protocols/image347.png" alt-text="Define conditions":::

6. Select a **Variable**. Variables represent fields configured in the plugin.

7. Select an **Operator**:

    - Equal to
    
    - Not Equal to
    
    - Less than
    
    - Less than or equal to
    
    - Greater than
    
    - Greater than or equal to

8. Enter a **Value** as a number. If the *variable* you selected is a MAC or IP address, the value must be converted from a dotted-decimal address to decimal format. Use an IP address conversion tool, for example <https://www.ipaddressguide.com/ip>.

    :::image type="content" source="media/how-to-manage-proprietary-protocols/image348.png" alt-text="Value":::

9. Select **AND** to create a condition set.

10. Select **SAVE**. The rule is added to the Rules section.

#### Edit and delete horizon custom alert rules

Use edit and delete options as required. Certain rules are embedded and cannot be edited or deleted.

#### Create multiple rules 

When you create multiple rules, alerts are triggered when any rule condition or condition sets are valid.