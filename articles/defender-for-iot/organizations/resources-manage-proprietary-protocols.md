---
title: Manage proprietary protocols (Horizon) - Microsoft Defender for IoT
description: Defender for IoT Horizon delivers an Open Development Environment (ODE) used to secure IoT and ICS devices running proprietary protocols.
ms.date: 01/01/2023
ms.topic: how-to
---

# Manage proprietary protocols with Horizon plugins

If your devices use proprietary protocols not supported [out-of-the-box](concept-supported-protocols.md) by Microsoft Defender for IoT, use the Defender for IoT Open Development Environment (ODE) and SDK to develop your own plugin support. Defender for IoT's SDK provides:

- Unlimited, full support for common, proprietary, custom protocols, or protocols that deviate from any standard.
- An extra level of flexibility and scope for DPI development.
- A tool that exponentially expands OT visibility and control, without the need to upgrade to new versions.
- The security of allowing proprietary development without divulging sensitive information.

For more information, contact [ms-horizon-support@microsoft.com](mailto:ms-horizon-support@microsoft.com).

## Prerequisites

Before performing the steps described in this article, make sure that you have:

- An OT network sensor [installed](ot-deploy/install-software-ot-sensor.md), [activated, and configured](ot-deploy/activate-deploy-sensor.md), with device data ingested.

- Access to your OT network sensor as an **Admin** user and as a privileged user for CLI access. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- Access to the plugin developed for your proprietary protocol and the signing certificate created for it.

## Add a plugin to your OT sensor

After you've developed and tested a dissector plugin for proprietary protocols, add it to any sensors where it's needed.

**To upload your plugin to a sensor**:

1. Sign into your OT sensor machine via SSH / Telnet to access the CLI.

1. Go the `/var/cyberx/properties/horizon.properties` file and verify that the `ui.enabled` property is set to `true` (`horizon.properties:ui.enabled=true`).

1. Sign into your OT sensor console and select **System settings > Network monitoring > Protocols DPI (Horizon Plugins)**.

    The **Protocols DPI (Horizon Plugins)** page lists all of the infrastructure plugins provided out-of-the-box by Defender for IoT and any other plugin you've created and uploaded to the sensor. For example:

    :::image type="content" source="media/release-notes/horizon.png" alt-text="Screenshot of the new Protocols D P I (Horizon Plugins) page." lightbox="media/release-notes/horizon.png":::

1. Select **Upload signing certificate**, and then browse to and select the certificate you created for your plugin.

1. Select **Upload protocol plugin**, and then browse to and select your plugin file.

### Toggle a plugin on or off

After you've uploaded a plugin, you can toggle it on or off as needed. Sensors don't handle protocol traffic defined for a plugin that's currently toggled off (disabled).

> [!NOTE]
> Infrastructure plugins cannot be toggled off.

## Monitor plugin performance

Use the data shown on the **Protocols DPI (Horizon Plugins)** page in the sensor console to understand details about your plugin usage. To help locate a specific plugin, use the **Search** box to enter part of all of a plugin name.

The **Protocols DPI (Horizon Plugins)** lists the following data per plugin:

|Column name  |Description |
|---------|---------|
|**Plugin**     | Defines the plugin name.        |
|**Type**     |   The plugin type, including APPLICATION or INFRASTRUCTURE.      |
|**Time**     |  The time that data was last analyzed using the plugin. The time stamp is updated every five seconds.       |
|**PPS**     |   The number of packets analyzed per second by the plugin.  |
|**Bandwidth**     |    The average bandwidth detected by the plugin within the last five seconds.     |
|**Malforms**     |  The number of malform errors detected in the last five seconds. Malformed validations are used after the protocol has been positively validated. If there's a failure to process the packets based on the protocol, a failure response is returned.       |
|**Warnings**     | The number of warnings detected, such as when packets match the structure and specifications, but unexpected behavior is detected, based on the plugin warning configuration.        |
| **Errors** | The number of errors detected in the last five seconds for packets that failed basic protocol validations for the packets that match protocol definitions. |

Horizon log data is available for export in the **Dissection statistics** and **Dissection Logs**, log files. For more information, see [Export troubleshooting logs](how-to-troubleshoot-sensor.md).

## Create custom alert rules for Horizon-based traffic

After adding a proprietary plugin to your sensor, you might want to configure custom alert rules for your proprietary protocol. Custom, conditioned-based alert triggers and messages help to pinpoint specific network activity and effectively update your security, IT, and operational teams.

Use custom alerts to detect traffic based on protocols and underlying protocols in a proprietary Horizon plugin, or a combination of protocol fields from all protocol layers. Custom alerts also let you write your own alert titles and messages, and handle protocol fields and values in the alert message text.

For example, in an environment running MODBUS, you may want to generate an alert when the sensor detects a write command to a memory register on a specific IP address and ethernet destination, or when any access is performed to a specific IP address.

**When an alert is triggered by a Horizon-based custom alert rule**:

- The alert is listed on the sensor and on-premises management consoles **Alerts** pages, and in integrated partner systems when you've configured forwarding rules.

- The alert always has a severity of *Critical*.

- The alert includes static text under the **Take action** section, indicating that the alert was generated by your organization’s security team.

For more information, see [Create custom alert rules on an OT sensor](how-to-accelerate-alert-incident-response.md#create-custom-alert-rules-on-an-ot-sensor).

## Next steps

For more information, see [Protocols supported by Defender for IoT](concept-supported-protocols.md)
