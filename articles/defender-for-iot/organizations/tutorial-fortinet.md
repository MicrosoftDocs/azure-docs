---
title: Integrate Fortinet with Microsoft Defender for IoT
description: In this article, you learn how to integrate Microsoft Defender for IoT with Fortinet.
ms.topic: tutorial
ms.date: 01/01/2023
ms.custom: how-to
---

# Integrate Fortinet with Microsoft Defender for IoT

This article helps you learn how to integrate and use Fortinet with Microsoft Defender for IoT.

Microsoft Defender for IoT mitigates IIoT, ICS, and SCADA risk with ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats.  Defender for IoT accomplishes this without relying on agents, rules, signatures, specialized skills, or prior knowledge of the environment.

Defender for IoT and Fortinet have established a technological partnership that detects and stop attacks on IoT and ICS networks.

Fortinet and Microsoft Defender for IoT prevent:

- Unauthorized changes to programmable logic controllers (PLC).

- Malware that manipulates ICS and IoT devices via their native protocols.

- Reconnaissance tools from collecting data.

- Protocol violations caused by misconfigurations or malicious attackers.

Defender for IoT detects anomalous behavior in IoT and ICS networks and delivers that information to FortiGate and FortiSIEM, as follows:

- **Visibility:** The information provided by Defender for IoT gives FortiSIEM administrators visibility into previously invisible IoT and ICS networks.

- **Blocking malicious attacks:** FortiGate administrators can use the information discovered by Defender for IoT to create rules to stop anomalous behavior, regardless of whether that behavior is caused by chaotic actors or misconfigured devices, before it causes damage to production, profits, or people.

FortiSIEM and Fortinet’s multivendor security incident and events management solution brings visibility, correlation, automated response, and remediation to a single scalable solution.

Using a Business Services view, the complexity of managing network and security operations is reduced, freeing resources and improving breach detection. FortiSIEM provides cross correlation, while applying machine learning and UEBA, to improve the response in order to stop breaches before they occur.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create an API key in Fortinet
> - Set a forwarding rule to block malware-related alerts
> - Block the source of suspicious alerts
> - Send Defender for IoT alerts to FortiSIEM
> - Block a malicious source using the Fortigate firewall

## Prerequisites

Before you begin, make sure that you have the following prerequisites:

- Access to a Defender for IoT OT sensor as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- Ability to create API keys in Fortinet.

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
    | **Administrator Profile** | From the dropdown list, select the profile name that you've defined in the previous step. |
    | **PKI Group** | Toggle the switch to **Disable**. |
    | **CORS Allow Origin** | Toggle the switch to **Enable**. |
    | **Restrict login to trusted hosts** | Add the IP addresses of the sensors and on-premises management consoles that will connect to FortiGate. |

Save the API key when it's generated, as it will not be provided again. The bearer of the generated API key will be granted all access privileges assigned to the account.

## Set a forwarding rule to block malware-related alerts

The FortiGate firewall can be used to block suspicious traffic.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created aren't affected by the rule.

**To set a forwarding rule to block malware-related alerts**:

1. Sign in to the Microsoft Defender for IoT sensor, and select **Forwarding**.

1. Select **+ Create new rule**.

1. In the **Add forwarding rule** pane, define the rule parameters:

    :::image type="content" source="media/tutorial-fortinet/forward-rule.png" alt-text="Screenshot of the Forwarding window option in a sensor." lightbox="media/tutorial-fortinet/forward-rule.png":::

    | Parameter | Description |
    |--|--|
    | **Rule name** | The forwarding rule name. |
    | **Minimal alert level** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Any protocol detected**     |  Toggle off to select the protocols you want to include in the rule.       |
    | **Traffic detected by any engine**     | Toggle off to select the traffic you want to include in the rule.       |

1. In the **Actions** area, define the following values:

    | Parameter | Description |
    |--|--|
    | **Server** | Select FortiGage. |
    | **Host** | Define the ClearPass server IP to send alert information. |
    | **API key** | Enter the [API key](#create-an-api-key-in-fortinet) that you created in FortiGate. |
    | **Incoming Interface** | Enter the incoming firewall interface port. |
    | **Outgoing Interface** | Enter the outgoing firewall interface port. |

1. Configure which alert information you want to forward:

    | Parameter | Description |
    |--|--|
    | **Block illegal function codes** | Protocol violations - Illegal field value violating ICS protocol specification (potential exploit) |
    | **Block unauthorized PLC programming / firmware updates** | Unauthorized PLC changes. |
    | **Block unauthorized PLC stop** | PLC stop (downtime). |
    | **Block malware related alerts** | Blocking of the industrial malware attempts (TRITON, NotPetya, etc.). |
    | **Block unauthorized scanning** | Unauthorized scanning (potential reconnaissance) |

1. Select **Save**.

## Block the source of suspicious alerts

The source of suspicious alerts can be blocked in order to prevent further occurrences.

**To block the source of suspicious alerts**:

1. Sign in to the on-premises management console, then select **Alerts**.

1. Select the alert related to Fortinet integration.

1. To automatically block the suspicious source, select **Block Source**.

1. In the Please Confirm dialog box, select **OK**.

## Send Defender for IoT alerts to FortiSIEM

Defender for IoT alerts provide information about an extensive range of security events, including:

- Deviations from learned baseline network activity

- Malware detections

- Detections based on suspicious operational changes

- Network anomalies

- Protocol deviations from protocol specifications

You can configure Defender for IoT to send alerts to the FortiSIEM server, where alert information is displayed in the **ANALYTICS** window:

Each Defender for IoT alert is then parsed without any other configuration on the FortiSIEM side, and they're presented in the FortiSIEM as security events. The following event details appear by default:

- Application Protocol
- Application Version
- Category Type
- Collector ID
- Count
- Device Time
- Event ID
- Event Name
- Event Parse Status

You can then use Defender for IoT's Forwarding Rules to send alert information to FortiSIEM.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created aren't affected by the rule.

**To use Defender for IoT's Forwarding Rules to send alert information to FortiSIEM**:

1. From the sensor console, select **Forwarding**.

1. Select **+ Create new rule**.

1. In the **Add forwarding rule** pane, define the rule parameters:

    :::image type="content" source="media/tutorial-fortinet/forwarding-view.png" alt-text="Screenshot of the view of your forwarding rules in the Forwarding window." lightbox="media/tutorial-fortinet/forwarding-view.png":::

    | Parameter | Description |
    |--|--|
    | **Rule name** | The forwarding rule name. |
    | **Minimal alert level** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Any protocol detected**     |  Toggle off to select the protocols you want to include in the rule.       |
    | **Traffic detected by any engine**     | Toggle off to select the traffic you want to include in the rule.       |

1. In the **Actions** area, define the following values:

    | Parameter | Description |
    |--|--|
    | **Server** | Select FortiSIEM. |
    | **Host** | Define the ClearPass server IP to send alert information. |
    | **Port** | Define the ClearPass port to send alert information. |
    | **Timezone** | The time stamp for the alert detection. |

1. Select **Save**.

## Block a malicious source using the Fortigate firewall

You can set policies to automatically block malicious sources in the FortiGate firewall, using alerts in Defender for IoT.

For example, the following alert can block the malicious source:

:::image type="content" source="media/tutorial-fortinet/suspicion.png" alt-text="Screenshot of the NotPetya Malware suspicion window." lightbox="media/tutorial-fortinet/suspicion.png":::

**To set a FortiGate firewall rule that blocks a malicious source**:

1. In FortiGate, [create an API key](#create-an-api-key-in-fortinet).

1. Sign in to the Defender for IoT sensor, or the on-premises management console, and select **Forwarding**, [set a forwarding rule that blocks malware-related alerts](#set-a-forwarding-rule-to-block-malware-related-alerts).

1. In the Defender for IoT sensor, or the on-premises management console, select **Alerts**, and [block a malicious source](#block-a-malicious-source-using-the-fortigate-firewall).

1. Navigate to the FortiGage **Administrator** window, and locate the malicious source address you blocked.

   The blocking policy is automatically created, and appears in the FortiGate IPv4 Policy window.

   :::image type="content" source="media/tutorial-fortinet/policy.png" alt-text="Screenshot of the FortiGate IPv4 Policy window view." lightbox="media/tutorial-fortinet/policy.png":::

1. Select the policy and ensure that **Enable this policy** is toggled on.

   :::image type="content" source="media/tutorial-fortinet/edit.png" alt-text="Screenshot of the FortiGate IPv4 Policy Edit view." lightbox="media/tutorial-fortinet/edit.png":::

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

## Next steps

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
