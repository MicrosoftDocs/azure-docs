---
title: Conceptual explanation of the basics of the Defender-IoT-micro-agent for Azure RTOS 
description: Learn the basics about the Defender-IoT-micro-agent for Azure RTOS concepts and workflow.
ms.topic: conceptual
ms.date: 09/09/2020
---

# Defender-IoT-micro-agent for Azure RTOS (preview)

Use this article to get a better understanding of the Defender-IoT-micro-agent for Azure RTOS, including features and benefits as well as links to relevant configuration and reference resources. 

## Azure RTOS IoT Defender-IoT-micro-agent

Defender-IoT-micro-agent for Azure RTOS provides a comprehensive security solution for Azure RTOS devices as part of the NetX Duo offering. Within the NetX Duo offering, Azure RTOS ships with the Azure IoT Defender-IoT-micro-agent built-in, and provides coverage for common threats on your real-time operating system devices once activated.

The Defender-IoT-micro-agent for Azure RTOS runs in the background, and provides a seamless user experience, while sending security messages using each customer's unique connections to their IoT Hub. The Defender-IoT-micro-agent for Azure RTOS is enabled by default.  

## Azure RTOS NetX Duo

Azure RTOS NetX Duo is an advanced, industrial-grade TCP/IP network stack designed specifically for deeply embedded real-time and IoT applications. Azure RTOS NetX Duo is a dual IPv4 and IPv6 network stack providing a rich set of protocols, including security and cloud. Learn more about [Azure RTOS NetX Duo](/azure/rtos/netx-duo/) solutions.

The module offers the following features:

- **Detect malicious network activities**
- **Device behavior baselines based on custom alerts**
- **Improve device security hygiene**

## Defender-IoT-micro-agent for Azure RTOS architecture

The Defender-IoT-micro-agent for Azure RTOS is initialized by the Azure IoT middleware platform and uses IoT Hub clients to send security telemetry to the Hub.

:::image type="content" source="media/architecture/security-module-state-diagram.png" alt-text="Azure IoT Defender-IoT-micro-agent state diagram and information flow":::

The Defender-IoT-micro-agent for Azure RTOS monitors the following device activity and information using three collectors:
- Device network activity **TCP**, **UDP**, and **ICM**
- System information as **Threadx** and **NetX Duo** versions
- Heartbeat events

Each collector is linked to a priority group and each priority group has its own interval with possible values of **Low**, **Medium**, and **High**. The intervals affect the time interval in which the data is collected and sent.

Each time interval is configurable and the IoT connectors can be enabled and disabled in order to further [customize your solution](how-to-azure-rtos-security-module.md). 

## Supported security alerts and recommendations

The Defender-IoT-micro-agent for Azure RTOS supports specific security alerts and recommendations. Make sure to [review and customize the relevant alert and recommendation values](concept-rtos-security-alerts-recommendations.md) for your service after completing the initial configuration.

## Ready to begin?

Defender-IoT-micro-agent for Azure RTOS is provided as a free download for your IoT devices. The Defender for IoT cloud service is available with a 30-day trial per Azure subscription. [Download the Defender-IoT-micro-agent now](https://github.com/azure-rtos/azure-iot-preview/releases) and let's get started. 

## Next steps

- Get started with Defender-IoT-micro-agent for Azure RTOS [prerequisites and setup](quickstart-azure-rtos-security-module.md).
- Learn more about Defender-IoT-micro-agent for Azure RTOS [security alerts and recommendation support](concept-rtos-security-alerts-recommendations.md). 
- Use the Defender-IoT-micro-agent for Azure RTOS [reference API](azure-rtos-security-module-api.md).