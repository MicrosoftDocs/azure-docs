---
title: Conceptual explanation of the basics of the Defender-IoT-micro-agent for Eclipse ThreadX 
description: Learn the basics about the Defender-IoT-micro-agent for Eclipse ThreadX concepts and workflow.
ms.topic: conceptual
ms.date: 04/17/2024
---

# Defender-IoT-micro-agent for Eclipse ThreadX

Use this article to get a better understanding of the Defender-IoT-micro-agent for Eclipse ThreadX, including features and benefits as well as links to relevant configuration and reference resources. 

## Eclipse ThreadX IoT Defender-IoT-micro-agent

Defender-IoT-micro-agent for Eclipse ThreadX provides a comprehensive security solution for Eclipse ThreadX devices as part of the NetX Duo offering. Within the NetX Duo offering, Eclipse ThreadX ships with the Azure IoT Defender-IoT-micro-agent built-in, and provides coverage for common threats on your real-time operating system devices once activated.

The Defender-IoT-micro-agent for Eclipse ThreadX runs in the background, and provides a seamless user experience, while sending security messages using each customer's unique connections to their IoT Hub. The Defender-IoT-micro-agent for Eclipse ThreadX is enabled by default.  

## Eclipse ThreadX NetX Duo

Eclipse ThreadX NetX Duo is an advanced, industrial-grade TCP/IP network stack designed specifically for deeply embedded real-time and IoT applications. Eclipse ThreadX NetX Duo is a dual IPv4 and IPv6 network stack providing a rich set of protocols, including security and cloud. Learn more about [Eclipse ThreadX NetX Duo](https://github.com/eclipse-threadx) solutions.

The module offers the following features:

- **Detect malicious network activities**
- **Device behavior baselines based on custom alerts**
- **Improve device security hygiene**

## Defender-IoT-micro-agent for Eclipse ThreadX architecture

The Defender-IoT-micro-agent for Eclipse ThreadX is initialized by the Azure IoT middleware platform and uses IoT Hub clients to send security telemetry to the Hub.

:::image type="content" source="media/concept-threadx-security-module/security-module-state-diagram.png" alt-text="Micro agent state diagram and information flow.":::

The Defender-IoT-micro-agent for Eclipse ThreadX monitors the following device activity and information using three collectors:
- Device network activity **TCP**, **UDP**, and **ICM**
- System information as **Threadx** and **NetX Duo** versions
- Heartbeat events

Each collector is linked to a priority group and each priority group has its own interval with possible values of **Low**, **Medium**, and **High**. The intervals affect the time interval in which the data is collected and sent.

Each time interval is configurable and the IoT connectors can be enabled and disabled in order to further [customize your solution](how-to-threadx-security-module.md). 

## Supported security alerts and recommendations

The Defender-IoT-micro-agent for Eclipse ThreadX supports specific security alerts and recommendations. Make sure to [review and customize the relevant alert and recommendation values](concept-threadx-security-alerts-recommendations.md) for your service after completing the initial configuration.

## Ready to begin?

Defender-IoT-micro-agent for Eclipse ThreadX is provided as a free download for your IoT devices. The Defender for IoT cloud service is available with a 30-day trial per Azure subscription. [Download the Defender-IoT-micro-agent now](https://github.com/eclipse-threadx) and let's get started. 

## Next steps

- Get started with Defender-IoT-micro-agent for Eclipse ThreadX [prerequisites and setup](./how-to-threadx-security-module.md).
- Learn more about Defender-IoT-micro-agent for Eclipse ThreadX [security alerts and recommendation support](concept-threadx-security-alerts-recommendations.md). 
- Use the Defender-IoT-micro-agent for Eclipse ThreadX [reference API](threadx-security-module-api.md).