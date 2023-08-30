---
title: Integrate Palo Alto with Microsoft Defender for IoT
description: Defender for IoT has integrated its continuous ICS threat monitoring platform with Palo Alto’s next-generation firewalls to enable blocking of critical threats, faster and more efficiently.
ms.date: 01/01/2023
ms.topic: tutorial
---

# Integrate Palo-Alto with Microsoft Defender for IoT

This article helps you learn how to integrate and use Palo Alto with Microsoft Defender for IoT.

Defender for IoT has integrated its continuous ICS threat monitoring platform with Palo Alto’s next-generation firewalls to enable blocking of critical threats, faster and more efficiently.

The following integration types are available:

- Automatic blocking option: Direct Defender for IoT to Palo Alto integration.

- Send recommendations for blocking to the central management system: Defender for IoT to Panorama integration.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Configure immediate blocking by a specified Palo Alto firewall
> - Create Panorama blocking policies in Defender for IoT

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

Before you begin, make sure that you have the following prerequisites:

- Confirmation by the Panorama Administrator to allow automatic blocking.
- Access to a Defender for IoT OT sensor as an Admin user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Configure immediate blocking by a specified Palo Alto firewall

In cases, such as malware-related alerts, you can enable automatic blocking. Defender for IoT forwarding rules are utilized to send a blocking command directly to a specific Palo Alto firewall.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created aren't affected by the rule.

When Defender for IoT identifies a critical threat, it sends an alert that includes an option of blocking the infected source. Selecting **Block Source** in the alert’s details activates the forwarding rule, which sends the blocking command to the specified Palo Alto firewall.

**To configure immediate blocking**:

1. Sign in to the sensor, and select **Forwarding**.

1. Select **Create new rule**.

1. In the **Add forwarding rule** pane, define the rule parameters:

    :::image type="content" source="media/tutorial-palo-alto/forwarding-rule.png" alt-text="Screenshot of creating the rules for your forwarding rule." lightbox="media/tutorial-palo-alto/forwarding-rule.png":::

    | Parameter | Description |
    |--|--|
    | **Rule name** | The forwarding rule name. |
    | **Minimal alert level** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Any protocol detected**     |  Toggle off to select the protocols you want to include in the rule.       |
    | **Traffic detected by any engine**     | Toggle off to select the traffic you want to include in the rule.       |

1. In the **Actions** area, set the following parameters:

    | Parameter | Description |
    |--|--|
    | **Server** | Select Palo Alto NGFW. |
    | **Host** | Enter the NGFW server IP address. |
    | **Port** | Enter the NGFW server port. |
    | **Username** | Enter the NGFW server username. |
    | **Password** | Enter the NGFW server password. |

1. Configure the following options to allow blocking of the suspicious sources by the Palo Alto firewall:

    | Parameter | Description |
    |--|--|
    | **Block illegal function codes** | Protocol violations - Illegal field value violating ICS protocol specification (potential exploit). |
    | **Block unauthorized PLC programming / firmware updates** | Unauthorized PLC changes. |
    | **Block unauthorized PLC stop** | PLC stop (downtime). |
    | **Block malware related alerts** | Blocking of industrial malware attempts (TRITON, NotPetya, etc.). <br><br> You can select the option of **Automatic blocking**. <br> In that case, the blocking is executed automatically and immediately. |
    | **Block unauthorized scanning** | Unauthorized scanning (potential reconnaissance). |

1. Select **Save**.

You'll then need to block any suspicious source.

**To block a suspicious source**:

1. Navigate to the **Alerts** page, and select the alert related to the Palo Alto integration.

1. To automatically block the suspicious source, select **Block Source**.

1. In the **Please Confirm** dialog box, select **OK**.

The suspicious source is now blocked by the Palo Alto firewall.

## Create Panorama blocking policies in Defender for IoT

Defender for IoT and Palo Alto Network's integration automatically creates new policies in the Palo Alto Network's NMS and Panorama.

This table shows which incidents this integration is intended for:

| Incident type | Description |
|--|--|
|**Unauthorized PLC changes** | An update to the ladder logic, or firmware of a device.  This alert can represent legitimate activity, or an attempt to compromise the device. For example, malicious code, such as a Remote Access Trojan (RAT), or parameters that cause the physical process, such as a spinning turbine, to operate in an unsafe manner. |
|**Protocol Violation** | A packet structure, or field value that violates the protocol specification. This alert can represent a misconfigured application, or a malicious attempt to compromise the device. For example, causing a buffer overflow condition in the target device. |
|**PLC Stop** | A command that causes the device to stop functioning, thereby risking the physical process that is being controlled by the PLC. |
|**Industrial malware found in the ICS network** | Malware that manipulates ICS devices using their native protocols, such as TRITON and Industroyer. Defender for IoT also detects IT malware that has moved laterally into the ICS, and SCADA environment. For example, Conficker, WannaCry, and NotPetya. |
|**Scanning malware** | Reconnaissance tools that collect data about system configuration in a pre-attack phase. For example, the Havex Trojan scans industrial networks for devices using OPC, which is a standard protocol used by Windows-based SCADA systems to communicate with ICS devices. |

When Defender for IoT detects a pre-configured use case, the **Block Source** button is added to the alert. Then, when the Defender for IoT user selects the **Block Source** button, Defender for IoT creates policies on Panorama by sending the predefined forwarding rule.

The policy is applied only when the Panorama administrator pushes it to the relevant NGFW in the network.

In IT networks, there may be dynamic IP addresses. Therefore, for those subnets, the policy must be based on FQDN (DNS name) and not the IP address. Defender for IoT performs reverse lookup and matches devices with dynamic IP address to their FQDN (DNS name) every configured number of hours.

In addition, Defender for IoT sends an email to the relevant Panorama user to notify that a new policy created by Defender for IoT is waiting for the approval. The figure below presents the Defender for IoT and Panorama integration architecture.

:::image type="content" source="media/tutorial-palo-alto/structure.png" alt-text="Screenshot of the Defender for IoT-Panorama Integration Architecture." lightbox="media/tutorial-palo-alto/structure.png":::

The first step in creating Panorama blocking policies in Defender for IoT is to configure DNS lookup.

**To configure DNS lookup**:

1. Sign in to your OT sensor and select **System settings** > **Network monitoring** > **DNS Reverse Lookup**.

1. Turn on the **Enabled** toggle to activate the lookup.

1. In the **Schedule Reverse Lookup** field, define the scheduling options:
      - By specific times: Specify when to perform the reverse lookup daily.
      - By fixed intervals (in hours): Set the frequency for performing the reverse lookup.

1. Select **+ Add DNS Server**, and then add the following details:

    | Parameter | Description |
    |--|--|
    | **DNS Server Address** | Enter the IP address or the FQDN of the network DNS Server. |
    | **DNS Server Port** | Enter the port used to query the DNS server. |
    | **Number of Labels** | To configure DNS FQDN resolution, add the number of domain labels to display. <br> Up to 30 characters are displayed from left to right. |
    | **Subnets** | Set the Dynamic IP address subnet range. <br> The range that Defender for IoT reverses lookup their IP address in the DNS server to match their current FQDN name. |

1. To ensure your DNS settings are correct, select **Test**. The test ensures that the DNS server IP address, and DNS server port are set correctly.

1. Select **Save**.

## Block suspicious traffic with the Palo Alto firewall

Suspicious traffic needs to be blocked with the Palo Alto firewall. You can block suspicious traffic through the use forwarding rules in Defender for IoT.

Forwarding alert rules run only on alerts triggered after the forwarding rule is created. Alerts already in the system from before the forwarding rule was created aren't affected by the rule.

1. Sign in to the sensor, and select **Forwarding**.

1. Select **Create new rule**.

1. In the **Add forwarding rule** pane, define the rule parameters:

    :::image type="content" source="media/tutorial-palo-alto/edit.png" alt-text="Screenshot of creating the rules for your Palo Alto Panorama forwarding rule." lightbox="media/tutorial-palo-alto/forwarding-rule.png":::

    | Parameter | Description |
    |--|--|
    | **Rule name** | The forwarding rule name. |
    | **Minimal alert level** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Any protocol detected**     |  Toggle off to select the protocols you want to include in the rule.       |
    | **Traffic detected by any engine**     | Toggle off to select the traffic you want to include in the rule.       |

1. In the **Actions** area, set the following parameters:

    | Parameter | Description |
    |--|--|
    | **Server** | Select Palo Alto NGFW. |
    | **Host** | Enter the NGFW server IP address. |
    | **Port** | Enter the NGFW server port. |
    | **Username** | Enter the NGFW server username. |
    | **Password** | Enter the NGFW server password. |
    | **Report Addresses** | Define how the blocking is executed, as follows: <br><br> - **By IP Address**: Always creates blocking policies on Panorama based on the IP address. <br> - **By FQDN or IP Address**: Creates blocking policies on Panorama based on FQDN if it exists, otherwise by the IP Address. |
    | **Email** | Set the email address for the policy notification email. |

    > [!NOTE]
    > Make sure you have configured a Mail Server in the Defender for IoT. If no email address is entered, Defender for IoT does not send a notification email.

1. Configure the following options to allow blocking of the suspicious sources by the Palo Alto Panorama:

    | Parameter | Description |
    |--|--|
    | **Block illegal function codes** | Protocol violations - Illegal field value violating ICS protocol specification (potential exploit). |
    | **Block unauthorized PLC programming / firmware updates** | Unauthorized PLC changes. |
    | **Block unauthorized PLC stop** | PLC stop (downtime). |
    | **Block malware related alerts** | Blocking of industrial malware attempts (TRITON, NotPetya, etc.). <br><br> You can select the option of **Automatic blocking**. <br> In that case, the blocking is executed automatically and immediately. |
    | **Block unauthorized scanning** | Unauthorized scanning (potential reconnaissance). |

1. Select **Save**.

You'll then need to block any suspicious source.

**To block a suspicious source**:

1. Navigate to the **Alerts** page, and select the alert related to the Palo Alto integration.

1. To automatically block the suspicious source, select **Block Source**.

1. Select **OK**.

## Next step

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
