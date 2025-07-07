---
title: Collect data from Cisco FTD firewall devices running ASA and FXOS
description: "Use Microsoft Sentinel connectors to collect logs from Cisco FTD firewall devices in Adaptive Security Appliance (ASA) and Common Event Format (CEF) formats."
author: guywi-ms
ms.date: 03/24/2025
ms.service: microsoft-sentinel
ms.author: guywild
ms.topic: conceptual
ms.collection: sentinel-data-connector
---

# Collect data from Cisco FTD firewall devices

Microsoft Sentinel provides two connectors that collect logs from Cisco Firepower Threat Defense (FTD) firewall devices, depending on whether the devices run the Adaptive Security Appliance (ASA) operating system or Firepower eXtensible Operating System (FXOS). This article explains when to use each connector and provides links to installation instructions.

## Collect logs from a Cisco FTD ASA firewall device

To collect logs from FTD ASA firewall devices, use the [Cisco ASA/FTD via AMA (Preview) connector](../sentinel/data-connectors-reference.md#cisco-asaftd-via-ama-preview). 

## Collect logs from a Cisco FTD FXOS firewall device

To collect logs from a Cisco FTD FXOS firewall device:

1. Install and configure the Firepower eNcore eStreamer client, which emits logs in Common Event Format (CEF) format. For more information, see the full install [guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html).
1. Install [CEF via AMA connector](connect-cef-syslog-ama.md). 

## Next steps

Learn more about [Microsoft Sentinel data connectors](connect-data-sources.md).
