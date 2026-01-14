---
title: Collect data from Cisco firewall devices running ASA
description: "Use Microsoft Sentinel connectors to collect logs from Cisco firewall devices in Adaptive Security Appliance (ASA) and Common Event Format (CEF) formats."
author: guywi-ms
ms.date: 03/24/2025
ms.service: microsoft-sentinel
ms.author: guywild
ms.topic: conceptual
ms.collection: sentinel-data-connector
---

# Collect data from Cisco firewall devices

Microsoft Sentinel provides two connectors that collect logs from Cisco Secure Firewall devices, depending on whether the devices run the Firewall Threat Defense (FTD) or Adaptive Security Appliance (ASA) software. This article explains when to use each connector and provides links to installation instructions.

## Collect Syslog from a Cisco FTD or ASA device

To collect syslog from FTD or ASA devices, use the [Cisco ASA/FTD via AMA connector](../sentinel/data-connectors-reference.md#cisco-asaftd-via-ama). For information on syslog configuration guidance for Cisco FTD, see the Cisco documentation [External Logging Configuration](https://secure.cisco.com/secure-firewall/docs/external-logging-configuration).

## Collect CEF logs from a Cisco FTD device

To collect CEF logs from a Cisco FTD device:

1.	Install and configure the eNcore eStreamer client, which collects logs from FTD devices (via the Firewall Management Center) and converts them to Common Event Format (CEF). For more information, see the full Cisco [install guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html).

    > [!NOTE]
    > The eNcore client is no longer being updated, and Cisco recommends the syslog format for new deployments.

1. Install [CEF via AMA connector](connect-cef-syslog-ama.md). 

## Next steps

Learn more about [Microsoft Sentinel data connectors](connect-data-sources.md).
