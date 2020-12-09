---
title: Proprietary protocols
description: In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/09/2020
ms.topic: conceptual
ms.service: azure
---

# Proprietary protocols

In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the *Horizon Open Development Environment (ODE) SDK*, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting and reporting. Use Horizon to:

- **Expand** visibility and control without the need to upgrade to new versions.

- **Secure** proprietary information by developing on-site as an external plugin.

- **Localize** text for alerts, events, and protocol parameters

The Horizon SDK lets developers design dissector plugins that decode network traffic so it can be processed by automated CyberX network analysis programs.

Protocol dissectors are developed as external plugins and are integrated with an extensive range of CyberX services, for example services that provide monitoring, alerting, and reporting capabilities.

For information about working with the SDK, contact support.microsoft.com.

## Proprietary protocol alerts

Proprietary protocol alerts can be used to communicate information:

- About traffic detections based on protocols and underlying protocols in a proprietary Horizon plugin.

- About a combination of protocol fields from all protocol layers. For example, in an environment running MODBUS, you may want to generate an alert when the sensor detects a write command to a memory register on a specific IP address and ethernet destination, or an alert when any access is performed to a specific IP address.

Alerts are triggered when Horizon alert, rule conditions, are met. 
In addition, working with Horizon custom alerts lets you write your own alert titles and messages. Protocol fields and values resolved can also be embedded in the alert message text.

Using custom, conditioned-based alert triggering and messaging helps pinpoint specific network activity and effectively update your security, IT, and operational teams.

## Customers and partners 

Working with Horizon provides customers and technology partners:

- Unlimited, full support for common, proprietary, custom protocols or protocols that deviate from any standard.  

- A new level of flexibility and scope for Deep Packet Inspection (DPI) development.

- A tool that exponentially expands OT visibility and control, without the need to upgrade CyberX platform versions. 

- The security of allowing proprietary development without divulging sensitive information.

## See also

[Defender for IoT Horizon](how-to-manage-proprietary-protocols.md)
