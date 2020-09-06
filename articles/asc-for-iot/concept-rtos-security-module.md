---
title: Azure RTOS IoT security module 
description: Learn about the Azure RTOS IoT security module concepts and workflow.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''


ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2020
ms.author: mlottner
---

# Azure Security Center for IoT, Azure RTOS security module (preview)

This article explains the Azure Security Center for IoT security module delivered with Azure RTOS, summarizes the features and benefits and provides links to relevant configuration and reference resources. 

## Azure RTOS IoT Security Module

Azure Security Center for IoT security module provides a comprehensive security solution for Azure RTOS devices. Azure RTOS now ships with the Azure Security Center for IoT security module built-in and provides coverage for common threats on real-time operating system devices.

:::image type="content" source="media/concept/asc_for_iot_monitoring_capabilities.png" alt-text="Conceptualized image of Azure Security Center for IoT security module information flow":::

Azure Security Center for IoT security module with Azure RTOS support offers the following features:

- **Detect malicious network activities**: 
All inbound and outbound network activity of every device is monitored over these supported protocols: TCP, UDP, ICMP on IPv4 and IPv6. The security module inspects each of these network activities against the Microsoft Threat Intelligence feed. The feed gets updated in real-time with millions of unique threat indicators collected worldwide.
- **Device behavior baselines based on custom alerts**: 
Cluster your devices into logical security groups, then use the baseline tool to define the  expected behavior of each group accordingly. As IoT devices are typically designed to operate in well-defined and limited scenarios, we’ve made it easy to create a baseline that defines their expected behavior using a set of parameters. Any deviation from your baseline definitions, trigger an alert.
- **Improve device security hygiene**: 
Leverage the recommended infrastructure Azure Security Center for IoT provides to gain knowledge and actionable insights about issues in your environment that impact and damage the security posture of your devices. Reduced IoT device security posture can allow potential attacks to succeed if left unchanged, as security is always measured by the weakest link within any organization.

Azure Security Center for IoT security module for Azure RTOS is provided as a free download for your IoT devices. The Azure Security Center for IoT cloud service is available with a 30 day trial per Azure subscription. Download the Azure Security Center for IoT security module for Azure RTOS now to get started.

## Next steps

- Get started with Azure RTOS IoT security module [prerequisites and setup](quickstart-azure-rtos-security-module.md).
- Use the Azure RTOS IoT Security Module [reference API](azure-rtos-security-module-api.md).

