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
> - Block suspicious traffic
> - Block the source

## Prerequisites

There are no prerquisites for this tutorial.

## Create an API key in Fortinet

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
    | **Comments** | Enter the minimal security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Administrator Profile** | From the dropdown list, select the profile name that you have defined in the previous step. |
    | **PKI Group** | Toggle the switch to disable. |
    | **CORS Allow Origin** | Toggle the switch to enable. |
    | **Restrict login to trusted hosts** | Add the IP addresses of the sensors, and management consoles that will connect to FortiGate. |

When the API key is generated, save it as it will not be provided again.

:::image type="content" source="media/integration-fortinet/api-key.png" alt-text="Cell phone description automatically generates New API Key":::

## Block suspicious traffic

The FortiGate firewall can be used to block suspicious traffic.

**To block suspicious traffic**:

1. Sign in to the Azure Defender for IoT Management Console.

1. In the left pane, select **Forwarding**.

    [:::image type="content" source="media/integration-fortinet/forwarding-view.png" alt-text="The Forwarding window option in a sensor.":::](media/integration-fortinet/forwarding-view.png#lightbox)

1. Select **Create Forwarding Rules** and define the following rule parameters.

    :::image type="content" source="media/integration-fortinet/new-rule.png" alt-text="Screenshot of the Create Forwarding Rule window.":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Name** | Enter a meaningful name for the forwarding rule. |
    | **Select Severity** | From the drop down menu, select the minimal security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | To select a specific protocol, select **Specific**, and select the protocol for which this rule is applied. By default, all the protocols are selected. |
    | **Engines** | To select a specific security engine for which this rule is applied, select **Specific**, and select the engine. By default, all the security engines are involved. |
    | **System Notifications** | Forward the sensor's *online* and *offline* status. This option is only available if you have logged into the on-premises management console. |

1. In the Actions section, select **Add**, and then select **Send to FortiGate** from the drop down menu.

    :::image type="content" source="media/integration-fortinet/fortigate.png" alt-text="Screenshot of the add an action section of the Create Forwarding Rule window.":::

1. To configure the FortiGate forwarding rule, set the following parameters::

    :::image type="content" source="media/integration-fortinet/configure.png" alt-text="Configure the Create Forwarding Rule window":::

    | Parameter | Description |
    |--|--|
    | **Host** | Enter the FortiGate server IP address.. |
    | **API Key** | Enter the API key that you created in [FortiGate](#create-an-api-key-in-fortigate). |
    | **Incoming Interface** | Enter the incoming interface port. |
    | **Outgoing Interface** | Enter the outgoing interface port. |
    | **Configure**| Ensure a check mark is showing in the following options to allow blocking of the suspicious sources by the FortiGate firewall: <br> **Block illegal function codes**: Protocol violations - Illegal field value violating ICS protocol specification (potential exploit) <br />**Block unauthorized PLC programming / firmware updates**: Unauthorized PLC changes <br /> **Block unauthorized PLC stop**: PLC stop (downtime) <br /> **Block malware-related alerts**: Blocking of the industrial malware attempts (TRITON, NotPetya, etc.). <br /> (Optional) You can select the option of **Automatic blocking**. In that case, the blocking is executed automatically and immediately. <br />**Block unauthorized scanning**: Unauthorized scanning (potential reconnaissance) |

1. Select **Submit**.

## Block the source

The source of suspicious alerts can be blocked in order to prevent further occurrences.

**To block the source of suspicious alerts**:

1. Sign in to the management console and select **Alerts** from the left side menu.

1. Select the alert related to Fortinet integration.

1. To automatically block the suspicious source, select **Block Source**.

    :::image type="content" source="media/integration-fortinet/unauthorized.png" alt-text="Screenshot of the Alert window.":::

1. In the Please Confirm dialog box, select **OK**.

## Send Defender for IoT alerts to FortiSIEM

Defenders for IoT alerts provide information about an extensive range of security events, including:

- Deviations from learned baseline network activity

- Malware detections

- Detections based on suspicious operational changes

- Network anomalies

- Protocol deviations from protocol specifications

You can configure Defender for IoT to send alerts to the FortiSIEM server, where alert information is displayed in the Analytics window:

:::image type="content" source="media/integration-fortinet/analytics.png" alt-text="Screenshot of the Analytics window.":::

Each Defender for IoT alert is then parsed without any other configuration on the FortiSIEM, side and they are presented in the FortiSIEM as security events. The following event details appear by default:

:::image type="content" source="media/integration-fortinet/event-detail.png" alt-text="View your event details in the Event Details window.":::

You can then use Defender for IoT's Forwarding Rules to send alert information to FortiSIEM.

**To use Defender for IoT's Forwarding Rules to send alert information to FortiSIEM**:

1. From the sensor, or management console left pane, select **Forwarding**.

    [:::image type="content" source="media/integration-fortinet/forwarding-view.png" alt-text="View your forwarding rules in the Forwarding window.":::](media/integration-fortinet/forwarding-view.png#lightbox)

2. Select **Create Forwarding Rules**, and define the rule's parameters.

    | Parameter | Description |
    |--|--|
    | **Name** | Enter a meaningful name for the forwarding rule. |
    | **Select Severity** | Select the minimum security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. By default, all the protocols are selected. |
    | **Engines** | To select a specific security engine for which this rule is applied, select **Specific** and select the engine. By default, all the security engines are involved. |
    | **System Notifications** | Forward a sensor's *online*, or *offline* status. This option is only available if you have logged into the on-premises management console. |

3. In the actions section, select **Send to FortiSIEM**.

    :::image type="content" source="media/integration-fortinet/forward-rule.png" alt-text="Create a Forwarding Rule and select send to Fortinet.":::

4. Enter the FortiSIEM server details.

    :::image type="content" source="media/integration-fortinet/details.png" alt-text="Add the FortiSIEm details to the forwarding rule":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Host** | Enter the FortiSIEM server IP address. |
    | **Port** | Enter the FortiSIEM server port. |
    | **Timezone** | The time stamp for the alert detection. |

5. Select **Submit**.

## Clean up resources

There are no resources to clean up.

## Next steps

In this tutorial, you learned how to get started with the Fortinet integration. Continue on to learn about our [integration](./tutorial-palo-alto.md).

> [!div class="nextstepaction"]
> [Next steps button](./tutorial-palo-alto.md)