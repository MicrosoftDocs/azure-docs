---
title: Integrations
description: You can expand Defender for IoT's capabilities by sharing both device and alert information with partner systems.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/08/2020
ms.topic: conceptual
ms.service: azure
---

# Integrations

## Overview

You can expand Defender for IoT's capabilities by sharing both device and alert information with partner systems. Integrations help enterprises bridge previously siloed security solutions to significantly enhance device visibility and threat intelligence, as well as accelerate the system-wide responses and mitigate risks faster.

Integrations reduce complexity and eliminate IT and OT silos by integrating them into your existing SOC workflows and security stack. For example:

- SIEMs such as IBM QRadar, Splunk, ArcSight, LogRhythm, RSA NetWitness.

- Security orchestration and ticketing systems such as ServiceNow, IBM Resilient.

- Secure remote access solutions such as CyberArk Privileged Session Manager (PSM), BeyondTrust.

- Secure network access control (NAC) systems such as Aruba ClearPass, Forescout CounterACT.

- Firewalls such as Fortinet and Checkpoint.

:::image type="content" source="media/concept-integrations/sample-integration-screens.png" alt-text="Integration samples for Defender for IoT":::

## Proprietary protocols

**Complete Protocol Support:** In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the Horizon Open Development Environment (ODE) SDK, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting and reporting. Use Horizon to:

- **Expand** visibility and control without the need to upgrade to new versions.

- **Secure** proprietary information by developing on-site as an external plugin.

- **Localize** text for alerts, events, and protocol parameters
