---
title: Manage sensors from the on-premises management console 
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/04/2020
ms.topic: article
ms.service: azure
---

# Manage Sensors from the Management Console

This section describes how to manage sensors from the management console, including:

- Push System Settings to Sensors

- Enable/Disable Engines on Sensors

- Update Sensor Version

- Update Threat Intelligence Packages

## Push System Settings to Sensors

You can define various system settings and automatically apply them to sensors connected to the management console. This saves time and helps ensure streamlined settings across your enterprise sensors.

The following sensor system settings can be defined from the management console:

- Mail Server

- SNMP MIB Monitoring

- Active Directory

- DNS Settings

- Subnets

- Port Aliases

To apply system settings:

1. In the console left pane, select System Settings.

2. In the Configure Sensors pane, select one of the sensor system setting options.

IMAGE #1 

The following example describes how to set up define Mail Server parameters for your enterprise sensors.

3. Select Mail Server.

IMAGE 2

4. Select a sensor on the left.

5. Set the mail server parameters and select Duplicate. Each item in the Sensors tree appears with a checkbox next to it.

IMAGE 3

6. In the Sensors tree, select the items to which you want to apply the configuration.

7. Select Save.

## Enable/Disable Engines on Sensors

Sensors are protected by 5 Defender for IoT engines. You can enable or disable the engines for connected sensors.