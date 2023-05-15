---
title: Integrate Fortinet with Microsoft Defender for IoT
description: In this article, you'll learn how to integrate Microsoft Defender for IoT with Fortinet.
ms.topic: tutorial
ms.date: 01/01/2023
ms.custom: how-to
---

# Integrate Fortinet with Microsoft Defender for IoT

This tutorial will help you learn how to integrate, and use Fortinet with Microsoft Defender for IoT.

Microsoft Defender for IoT mitigates IIoT and ICS and SCADA risk with ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats.  Defender for IoT accomplishes this without relying on agents, rules, signatures, specialized skills, or prior knowledge of the environment.

Defender for IoT, and Fortinet have established a technological partnership that detects, and stop attacks on IoT, and ICS networks.

Fortinet, and Microsoft Defender for IoT prevent:

- Unauthorized changes to programmable logic controllers (PLC).

- Malware that manipulates ICS, and IoT devices via their native protocols.

- Reconnaissance tools from collecting data.

- Protocol violations caused by misconfigurations, or malicious attackers.

Defender for IoT detects anomalous behavior in IoT, and ICS networks and delivers that information to FortiGate, and FortiSIEM, as follows:

- **Visibility:** The information provided by Defender for IoT gives FortiSIEM administrators visibility into previously invisible IoT and ICS networks.

- **Blocking malicious attacks:** FortiGate administrators can use the information discovered by Defender for IoT to create rules to stop anomalous behavior, regardless of whether that behavior is caused by chaotic actors, or misconfigured devices, before it causes damage to production, profits, or people.

FortiSIEM, and Fortinet’s multivendor security incident, and events management solution brings visibility, correlation, automated response, and remediation to a single scalable solution.

Using a Business Services view, the complexity of managing network and security operations is reduced, freeing resources, improving breach detection. FortiSIEM provides cross correlation while applying machine learning, and UEBA to improve response, in order to stop breaches before they occur.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an API key in Fortinet
> - Set a forwarding rule to block malware-related alerts
> - Block the source of suspicious alerts
> - Send Defender for IoT alerts to FortiSIEM
> - Block a malicious source using the Fortigate firewall

If you do not already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

## Prerequisites

There are no prerequisites for this tutorial.

## Create an API key in Fortinet

An application programming interface (API) key is a uniquely generated code that allows an API to identify the application or user requesting access to it. An API key is needed for Microsoft Defender for IoT and Fortinet to communicate correctly.

**To create an API key in Fortinet**:

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

1. Navigate to **System** > **Administrators**, and create a new **REST API Admin** with the following fields:

    | Parameter | Description |
    | --------- | ----------- |
    | **Username** | Enter the forwarding rule name. |
    | **Comments** | Enter the minimal security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Administrator Profile** | From the dropdown list, select the profile name that you have defined in the previous step. |
    | **PKI Group** | Toggle the switch to **Disable**. |
    | **CORS Allow Origin** | Toggle the switch to **Enable**. |
    | **Restrict login to trusted hosts** | Add the IP addresses of the sensors, and management consoles that will connect to FortiGate. |

When the API key is generated, save it as it will not be provided again.

:::image type="content" source="media/tutorial-fortinet/api-key.png" alt-text="Screenshot of the description automatically generates New API Key.":::

## Set a forwarding rule to block malware-related alerts

The FortiGate firewall can be used to block suspicious traffic.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created are not affected by the rule.

**To set a forwarding rule to block malware-related alerts**:

1. Sign in to the Microsoft Defender for IoT Management Console.

1. In the left pane, select **Forwarding**.

    [:::image type="content" source="media/tutorial-fortinet/forwarding-view.png" alt-text="Screenshot of the Forwarding window option in a sensor.":::](media/tutorial-fortinet/forwarding-view.png#lightbox)

1. Select **Create Forwarding Rules** and define the following rule parameters.

    | Parameter | Description |
    | --------- | ----------- |
    | **Name** | Enter a meaningful name for the forwarding rule. |
    | **Select Severity** | From the drop-down menu, select the minimal security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | To select a specific protocol, select **Specific**, and select the protocol for which this rule is applied. By default, all the protocols are selected. |
    | **Engines** | To select a specific security engine for which this rule is applied, select **Specific**, and select the engine. By default, all the security engines are involved. |
    | **System Notifications** | Forward the sensor's *online* and *offline* status. This option is only available if you have logged into the on-premises management console. |

1. In the Actions section, select **Add**, and then select **Send to FortiGate** from the drop-down menu.

    :::image type="content" source="media/tutorial-fortinet/fortigate.png" alt-text="Screenshot of the Add an action section of the Create Forwarding Rule window.":::

1. To configure the FortiGate forwarding rule, set the following parameters:

    :::image type="content" source="media/tutorial-fortinet/configure.png" alt-text="Screenshot of the configure the Create Forwarding Rule window.":::

    | Parameter | Description |
    |--|--|
    | **Host** | Enter the FortiGate server IP address. |
    | **API Key** | Enter the [API key](#create-an-api-key-in-fortinet) that you created in FortiGate. |
    | **Incoming Interface** | Enter the incoming firewall interface port. |
    | **Outgoing Interface** | Enter the outgoing firewall interface port. |
    | **Configure**| Ensure a **√** is showing in the following options to enable blocking of suspicious sources via the FortiGate firewall: <br> - **Block illegal function codes**: Protocol violations - Illegal field value violating ICS protocol specification (potential exploit) <br /> - **Block unauthorized PLC programming / firmware updates**: Unauthorized PLC changes <br /> - **Block unauthorized PLC stop**: PLC stop (downtime) <br> - **Block malware-related alerts**: Blocking of the industrial malware attempts (TRITON, NotPetya, etc.). <br> - **(Optional)** You can select the option for **Automatic blocking**. If Automatic Blocking is selected, blocking is executed automatically, and immediately. <br /> - **Block unauthorized scanning**: Unauthorized scanning (potential reconnaissance) |

1. Select **Submit**.

## Block the source of suspicious alerts

The source of suspicious alerts can be blocked in order to prevent further occurrences.

**To block the source of suspicious alerts**:

1. Sign in to the management console and select **Alerts** from the left side menu.

1. Select the alert related to Fortinet integration.

1. To automatically block the suspicious source, select **Block Source**.

    :::image type="content" source="media/tutorial-fortinet/block-source.png" alt-text="Screenshot of the Alert window.":::

1. In the Please Confirm dialog box, select **OK**.

## Send Defender for IoT alerts to FortiSIEM

Defender for IoT alerts provide information about an extensive range of security events, including:

- Deviations from learned baseline network activity

- Malware detections

- Detections based on suspicious operational changes

- Network anomalies

- Protocol deviations from protocol specifications

You can configure Defender for IoT to send alerts to the FortiSIEM server, where alert information is displayed in the Analytics window:

:::image type="content" source="media/tutorial-fortinet/analytics.png" alt-text="Screenshot of the Analytics window.":::

Each Defender for IoT alert is then parsed without any other configuration on the FortiSIEM, side and they are presented in the FortiSIEM as security events. The following event details appear by default:

:::image type="content" source="media/tutorial-fortinet/event-detail.png" alt-text="Screenshot of the view your event details in the Event Details window.":::

You can then use Defender for IoT's Forwarding Rules to send alert information to FortiSIEM.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created are not affected by the rule.

**To use Defender for IoT's Forwarding Rules to send alert information to FortiSIEM**:

1. From the sensor, or management console left pane, select **Forwarding**.

    [:::image type="content" source="media/tutorial-fortinet/forwarding-view.png" alt-text="Screenshot of the view of your forwarding rules in the Forwarding window.":::](media/tutorial-fortinet/forwarding-view.png#lightbox)

2. Select **Create Forwarding Rules**, and define the rule's parameters.

    | Parameter | Description |
    |--|--|
    | **Name** | Enter a meaningful name for the forwarding rule. |
    | **Select Severity** | Select the minimum security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | To select a specific protocol, select **Specific**, and select the protocol for which this rule is applied. By default, all the protocols are selected. |
    | **Engines** | To select a specific security engine for which this rule is applied, select **Specific** and select the engine. By default, all the security engines are involved. |
    | **System Notifications** | Forward a sensor's *online*, or *offline* status. This option is only available if you have logged into the on-premises management console. |

3. In the actions section, select **Send to FortiSIEM**.

    :::image type="content" source="media/tutorial-fortinet/forward-rule.png" alt-text="Screenshot of the create a Forwarding Rule and select send to Fortinet.":::

4. Enter the FortiSIEM server details.

    :::image type="content" source="media/tutorial-fortinet/details.png" alt-text="Screenshot of the add the FortiSIEm details to the forwarding rule.":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Host** | Enter the FortiSIEM server IP address. |
    | **Port** | Enter the FortiSIEM server port. |
    | **Timezone** | The time stamp for the alert detection. |

5. Select **Submit**.

## Block a malicious source using the Fortigate firewall

You can set policies to automatically block malicious sources in the FortiGate firewall using alerts in Defender for IoT.

:::image type="content" source="media/tutorial-fortinet/firewall.png" alt-text="Screenshot of the view of the FortiGate Firewall window view.":::

For example, the following alert can block the malicious source:

:::image type="content" source="media/tutorial-fortinet/suspicion.png" alt-text="Screenshot of the NotPetya Malware suspicion window.":::

**To set a FortiGate firewall rule that blocks a malicious source**:

1. In FortiGate, [create an API key](#create-an-api-key-in-fortinet).

1. Sign in to the Defender for IoT sensor, or the management console, and select **Forwarding**, [set a forwarding rule that blocks malware-related alerts](#set-a-forwarding-rule-to-block-malware-related-alerts).

1. In the Defender for IoT sensor, or the management console, and select **Alerts**, and [block a malicious source](#block-a-malicious-source-using-the-fortigate-firewall).

1. Navigate to the FortiGage **Administrator** window, and locate the malicious source address you blocked.

   :::image type="content" source="media/tutorial-fortinet/administrator.png" alt-text="Screenshot of the FortiGate Administrator window view.":::

   The blocking policy will be automatically created, and appears in the FortiGate IPv4 Policy window.

   :::image type="content" source="media/tutorial-fortinet/policy.png" alt-text="Screenshot of the FortiGate IPv4 Policy window view.":::

1. Select the policy and ensure that Enable this policy is toggled to on position.

   :::image type="content" source="media/tutorial-fortinet/edit.png" alt-text="Screenshot of the FortiGate IPv4 Policy Edit view.":::

    | Parameter | Description|
    |--|--|
    | **Name** | The name of the policy. |
    | **Incoming Interface** | The inbound firewall interface for the traffic. |
    | **Outgoing Interface** | The outbound firewall interface for the traffic. |
    | **Source** | The source address(es) for the traffic. |
    | **Destination** | The destination address(es) for the traffic. |
    | **Schedule** | The occurrence of the newly defined rule. For example, `always`. |
    | **Service** | The protocol, or specific ports for the traffic. |
    | **Action** | The action that the firewall will perform. |

## Clean up resources

There are no resources to clean up.

## Next steps

In this article, you learned how to get started with the Fortinet integration. Continue on to learn about our [Palo Alto integration](./tutorial-palo-alto.md)
