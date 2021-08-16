---
title: Onboard a trial subscription of Azure Defender for IoT
description: In this tutorial, learn how to onboard a sensor and management console to try out Defender for IoT for free.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 08/16/2021
ms.custom: template-tutorial
---

# Tutorial: Onboard a trial subscription of Azure Defender for IoT

This tutorial will help you learn how to onboard a trial subscription of Azure Defender for IoT by downloading

Through the use of virtual environments along with the software needed to create a sensor, and a management console, Defender for IoT allows you to:

- Use passive, agentless network monitoring to gain a complete inventory of all your IoT, and OT devices, their details, and how they communicate, with zero impact on the IoT/OT network.

- Identify risks and vulnerabilities in your IoT/OT environment. For example, identify unpatched devices, open ports, unauthorized applications, and unauthorized connections. You can also identify changes to device configurations, PLC code, and firmware.

- Detect anomalous or unauthorized activities with specialized IoT/OT-aware threat intelligence and behavioral analytics. You can even detect advanced threats missed by static IOCs, like zero-day malware, fileless malware, and living-off-the-land tactics.

- Integrate into Azure Sentinel for a bird's-eye view of your entire organization. Implement unified IoT/OT security governance with integration into your existing workflows, including third-party tools like Splunk, IBM QRadar, and ServiceNow.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Onboard with Azure Defender for IoT
> * 
> * 

## Prerequisites

- **Permissions on subscriptions**

- At least one device to monitor connected to a port on the switch.

- Either VMware (ESXi 5.5 or later), or Hyper-V hypervisor (Windows 10 Pro or Enterprise) is installed and operational.

- An on-premises management console VM that supports any of the following architectures:

    | Architecture | Specifications | Usage |
    |--|--|--|
    | Enterprise <br/>(Default and most common) | CPU: 8 <br/>Memory: 32G RAM<br/> HDD: 1.8 TB | Large production environments |
    | Small | CPU: 4 <br/> Memory: 8G RAM<br/> HDD: 500 GB | Large production environments |
    | Office | CPU: 4 <br/>Memory: 8G RAM <br/> HDD: 100 GB | Small test environments |

- A sensor VM that supports the following architectures:

    | Architecture | Specifications | Usage | Comments |
    |--|--|--|--|
    | **Enterprise** | CPU: 8<br/>Memory: 32G RAM<br/>HDD: 1800 GB | Production environment | Default and most common |
    | **Small Business** | CPU: 4 <br/>Memory: 8G RAM<br/>HDD: 500 GB | Test or small production environments | - |
    | **Office** | CPU: 4<br/>Memory: 8G RAM<br/>HDD: 100 GB | Small test environments | - |

- An Azure account. If you do not already have an Azure account you can [create your Azure free account today](https://azure.microsoft.com/free/).

## Onboard with Azure Defender for IoT

To get started with Azure Defender for IoT, you must have a Microsoft Azure subscription. If you do not have a subscription, you can sign up for a free account.

To onboard a subscription:

1. Navigate to the Azure portal.

1. Search for, and select **Azure Defender for IoT**.

1. Select **Onboard subscription**.

    :::image type="content" source="media/tutorial-onboarding/onboard-subscription.png" alt-text="Select the Onboard subscription button from the Getting started page.":::

1. On the Pricing page select **Start with a trial**. **IS THIS THE STEP? WHAT IS THE DIFFERENCE BETWEEN START WITH A TRIAL AND SUBSCRIBE????????????????????????????**

   :::image type="content" source="media/tutorial-onboarding/start-with-trial.png" alt-text="Select the Start with a trial button to open the trial window.":::

1. Select **Onboard**.
