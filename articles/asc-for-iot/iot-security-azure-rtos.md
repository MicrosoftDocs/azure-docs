---
title: Azure RTOS support
description: Learn about support of Azure RTOS in the Azure Security Center for IoT service.
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
ms.date: 07/15/2020
ms.author: mlottner
---

# Azure Security Center for IoT Security Solution for Azure RTOS 

The Azure Security Center for IoT security module provides a comprehensive security solution for Azure RTOS devices. Azure RTOS ships with a built-in security module that covers common threats on real-time operating system devices. 

![Azure Security Center for IoT Azure RTOS](./media/architecture/azure-rtos-security-monitoring.png)


Azure Security Center for IoT security module with Azure RTOS support offers the following features: 
- Malicious network activity detection
- Custom alert based, device behavior baselining
- Improve device security hygiene

### Detection of malicious network activities

Inbound and outbound network activity of each device is monitored (supported protocols: TCP, UDP, ICMP on IPv4 and IPv6). Azure Security Center for IoT inspects each of these network activities against the Microsoft Threat Intelligence feed. The feed gets updated in real-time with millions of unique threat indicators collected worldwide. 

### Device behavior baselining based on custom alerts

Baselining allows for clustering of devices into security groups and defining the expected behavior of each group. As IoT devices are typically designed to operate in well-defined and limited scenarios, it is easy to create a baseline that defines their expected behavior using a set of parameters. Any deviation from the baseline, triggers an alert. 

### Improve your device security hygiene

By leveraging the recommended infrastructure Azure Security Center for IoT provides, gain knowledge and insights about issues in your environment that impact and damage the security posture of your devices. Poor IoT device security posture can allow potential attacks to succeed if left unchanged, as security is always measured by the weakest link within any organization. 

## Get started protecting Azure RTOS devices

- Azure Security Center for IoT security module for Azure RTOS is provided as a free download for your devices. The Azure Security Center for IoT cloud service is available with a 30 day trial per Azure subscription. Download the [Azure Security Center for IoT security module for Azure RTOS](https://github.com/azure-rtos/iot-security-module-preview) to get started. 


## Next steps

In this article, you learned about Azure Security Center for IoT Azure RTOS support. To learn how to get started and enable your security solution in IoT Hub, see the following articles:

- [Service prerequisites](service-prerequisites.md)
- [Getting started](getting-started.md)
- [Configure your solution](quickstart-configure-your-solution.md)
- [Enable security in IoT Hub](quickstart-onboard-iot-hub.md)
- [Azure Security Center for IoT FAQ](resources-frequently-asked-questions.md)
- [Azure Security Center for IoT security alerts](concept-security-alerts.md)
