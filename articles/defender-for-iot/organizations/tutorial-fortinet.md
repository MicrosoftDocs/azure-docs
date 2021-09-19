---
title: Integrate Fortinet with Azure Defender for IoT
description: In this tutorial, you will learn how to integrate Azure Defender for IoT with Fortinet.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 09/19/2021
ms.custom: template-tutorial
---

# Tutorial: Integrate Fortinet with Azure Defender for IoT

This tutorial will help you learn how to integrate, and use Fortinet with Azure Defender for IoT.

Defender for IoT mitigates IIoT and ICS and SCADA risk with ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats without relying on agents, rules, signatures, specialized skills, or prior knowledge of the environment.

Defender for IoT and Fortinet have established a technological partnership that detect and stop attacks on IoT and ICS networks.

Together, Fortinet and Defender for IoT prevent:

- Unauthorized changes to programmable logic controllers.

- Malware that manipulates ICS and IoT devices via their native protocols.

- Reconnaissance tools from collecting data.

- Protocol violations caused by misconfigurations or malicious attackers.

Defender for IoT detects anomalous behavior in IoT, and ICS networks and delivers that information to FortiGate, and FortiSIEM, as follows:

- **Visibility:** The information provided by Defender for IoT gives FortiSIEM administrators visibility into previously invisible IoT and ICS networks.

- **Blocking malicious attacks:** FortiGate administrators can use the information discovered by Defender for IoT to create rules to stop anomalous behavior, regardless of whether that behavior is caused by chaotic actors, or misconfigured devices, before it causes damage to production, profits, or people.

> [!div class="checklist"]
> - Create an API key in Fortinet
> - 

## Prerequisites

There are no prerquisites for this tutorial.

## Create an API key in FortiGate

1. In FortiGate, navigate to **System** > **Admin Profiles**.

1. Create a profile with the following permissions:

    | Parameter | Selection |
    |--|--|
    | **Security Fabric** | None |
    | **Fortiview** | None |
    | **User & Device** | None |
    | **Firewall** | Custom |
    | **Policy** | Read/Write |
    | **Address** | Read/Write  |
    | **Service** | None |
    | **Schedule** | None |
    | **Logs & Report** | None |
    | **Network** | None |
    | **System** | None |
    | **Security Profile** | None |
    | **VPN** | None |
    | **WAN Opt & Cache** | None |
    | **WiFi & Switch** | None |

    :::image type="content" source="media/integration-fortinet/admin-profile.png" alt-text="Screenshot of the Admin Profiles setup screen.":::

1. Navigate to **System** > **Administrators**, and create a new **REST API Admin** with the following fields:

    | Parameter | Description |
    | --------- | ----------- |
    | **Username** | Enter the forwarding rule name. |
    | **Comments** | Enter the minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Administrator Profile** | From the dropdown list, select the profile name that you have defined in the previous step. |
    | **PKI Group** | Toggle the switch to disable. |
    | **CORS Allow Origin** | Toggle the switch to enable. |
    | **Restrict login to trusted hosts** | Add the IP addresses of the sensors, and management consoles that will connect to FortiGate. |

When the API key is generated, save it as it will not be provided again.

:::image type="content" source="media/integration-fortinet/api-key.png" alt-text="Cell phone description automatically generates New API Key":::

## Clean up resources

There are no resources to clean up.

## Next steps

In this tutorial, you learned how to get started with the Fortinet integration. Continue on to learn about our [integration](./tutorial-palo-alto.md).

> [!div class="nextstepaction"]
> [Next steps button](./tutorial-palo-alto.md)