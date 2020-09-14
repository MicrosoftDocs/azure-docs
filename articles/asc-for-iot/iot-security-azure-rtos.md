---
title: Security Module for Azure RTOS overview
description: Learn more about Security Module for Azure RTOS support and implementation as part of the Azure Security Center for IoT service.
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
ms.date: 09/07/2020
ms.author: mlottner
---

# Overview: Security Module for Azure RTOS (preview)

The Azure Security Center for IoT RTOS security module provides a comprehensive security solution for Azure RTOS devices. Azure RTOS now ships with the Azure IoT Security Module built-in and provides coverage for common threats and potential malicious activities on real-time operating system devices. 

![Azure Security Center for IoT Azure RTOS](./media/architecture/azure-rtos-security-monitoring.png)


Security Module for Azure RTOS offers the following features: 
- Malicious network activity detection
- Custom alert based, device behavior baselining
- Improve device security hygiene

### Detection of malicious network activities

Inbound and outbound network activity of each device is monitored (supported protocols: TCP, UDP, ICMP on IPv4 and IPv6). Azure Security Center for IoT inspects each of these network activities against the Microsoft Threat Intelligence feed. The feed gets updated in real-time with millions of unique threat indicators collected worldwide. 

### Device behavior baselining based on custom alerts

Baselining allows for clustering of devices into security groups and defining the expected behavior of each group. As IoT devices are typically designed to operate in well-defined and limited scenarios, it is easy to create a baseline that defines their expected behavior using a set of parameters. Any deviation from the baseline, triggers an alert. 

### Improve your device security hygiene

By leveraging the recommended infrastructure Azure Security Center for IoT provides, gain knowledge and insights about issues in your environment that impact and damage the security posture of your devices. Weak IoT device security posture can allow potential attacks to succeed if left unchanged, as security is always measured by the weakest link within any organization. 

## Get started protecting Azure RTOS devices

Security Module for Azure RTOS is provided as a free download for your devices. The Azure Security Center for IoT cloud service is available with a 30 day trial per Azure subscription. Download the [Security Module for Azure RTOS](https://github.com/azure-rtos/iot-security-module-preview) to get started. 


## Next steps

In this article, you learned about the Security Module for Azure RTOS service. To learn more about the security module and get started, see the following articles:

- [Azure RTOS IoT security module concepts](concept-rtos-security-module.md)
- [Quickstart: Azure RTOS IoT security module](quickstart-azure-rtos-security-module.md)


