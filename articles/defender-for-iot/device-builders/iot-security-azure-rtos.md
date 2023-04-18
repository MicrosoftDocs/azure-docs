---

title: Defender-IoT-micro-agent for Azure RTOS overview
description: Learn more about the Defender-IoT-micro-agent for Azure RTOS support and implementation as part of Microsoft Defender for IoT.
ms.topic: conceptual
ms.date: 01/01/2023
---

# Overview: Defender for IoT Defender-IoT-micro-agent for Azure RTOS

The Microsoft Defender for IoT micro module provides a comprehensive security solution for devices that use Azure RTOS. It provides coverage for common threats and potential malicious activities on real-time operating system (RTOS) devices. Azure RTOS now ships with the Azure IoT Defender-IoT-micro-agent built in.

:::image type="content" source="./media/iot-security-azure-rtos/azure-rtos-security-monitoring.png" alt-text="Visualization of Defender for IoT Azure RTOS.":::

The micro module for Azure RTOS offers the following features:

- Malicious network activity detection
- Custom alert-based device behavior baselining
- Improved device security hygiene

## Detect malicious network activities

Inbound and outbound network activity of each device is monitored. Supported protocols are TCP, UDP, and ICMP on IPv4 and IPv6. Defender for IoT inspects each of these network activities against the Microsoft threat intelligence feed. The feed gets updated in real time with millions of unique threat indicators collected worldwide.

## Device behavior baselining based on custom alerts

Baselining allows for clustering of devices into security groups and defining the expected behavior of each group. Because IoT devices are typically designed to operate in well-defined and limited scenarios, it's easy to create a baseline that defines their expected behavior by using a set of parameters. Any deviation from the baseline triggers an alert.

## Improve your device security hygiene

By using the recommended infrastructure Defender for IoT provides, you can gain knowledge and insights about issues in your environment that affect and damage the security posture of your devices. A weak IoT-device security posture can allow potential attacks to succeed if it's left unchanged. Security is always measured by the weakest link within any organization.

## Get started protecting Azure RTOS devices

Defender-IoT-micro-agent for Azure RTOS is provided as a free download for your devices. The Defender for IoT cloud service is available with a 30-day trial per Azure subscription. To get started, download the [Defender-IoT-micro-agent for Azure RTOS](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/defender-for-iot/device-builders/iot-security-azure-rtos.md).

## Next steps

In this article, you learned about the Defender-IoT-micro-agent for Azure RTOS. To learn more about the Defender-IoT-micro-agent and get started, see the following articles:

- [Azure RTOS IoT Defender-IoT-micro-agent concepts](concept-rtos-security-module.md)
- [Quickstart: Azure RTOS IoT Defender-IoT-micro-agent](./how-to-azure-rtos-security-module.md)