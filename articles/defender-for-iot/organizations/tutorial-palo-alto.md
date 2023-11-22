---
title: Integrate Palo Alto with Microsoft Defender for IoT
description: Defender for IoT has integrated its continuous ICS threat monitoring platform with Palo Alto’s next-generation firewalls to enable blocking of critical threats, faster and more efficiently.
ms.date: 09/06/2023
ms.topic: tutorial
---

# Integrate Palo Alto with Microsoft Defender for IoT

This article describes how to integrate Palo Alto with Microsoft Defender for IoT, in order to view both Palo Alto and Defender for IoT information in a single place, or use Defender for IoT data to configure blocking actions in Palo Alto.

Viewing both Defender for IoT and Palo Alto information together provides SOC analysts with multidimensional visibility so that they can block critical threats faster.

## Cloud-based integrations

> [!TIP]
> Cloud-based security integrations provide several benefits over on-premises solutions, such as centralized, simpler sensor management and centralized security monitoring.
>
> Other benefits include real-time monitoring, efficient resource use, increased scalability and robustness, improved protection against security threats, simplified maintenance and updates, and seamless integration with third-party solutions.
>

If you're integrating a cloud-connected OT sensor with Palo Alto we recommend that you connect Defender for IoT to [Microsoft Sentinel](concept-sentinel-integration.md).

Install one or more of the following solutions to view both Palo Alto and Defender for IoT data in Microsoft Sentinel.

|Microsoft Sentinel solution  |Learn more  |
|---------|---------|
|[Palo Alto PAN-OS Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltopanos?tab=Overview)     |   [Palo Alto Networks (Firewall) connector for Microsoft Sentinel](/azure/sentinel/data-connectors/palo-alto-networks-firewall)      |
|[Palo Alto Networks Cortex Data Lake Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltocdl?tab=Overview)     |  [Palo Alto Networks Cortex Data Lake (CDL) connector for Microsoft Sentinel](/azure/sentinel/data-connectors/palo-alto-networks-cortex-data-lake-cdl)       |
|[Palo Alto Prisma Cloud CSPM solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltoprisma?tab=Overview)      |   [Palo Alto Prisma Cloud CSPM (using Azure Function) connector for Microsoft Sentinel](/azure/sentinel/data-connectors/palo-alto-prisma-cloud-cspm-using-azure-function)      |

Microsoft Sentinel is a scalable cloud service for security information event management (SIEM) security orchestration automated response (SOAR).  SOC teams can use the integration between Microsoft Defender for IoT and Microsoft Sentinel to collect data across networks, detect and investigate threats, and respond to incidents.

In Microsoft Sentinel, the Defender for IoT data connector and solution brings out-of-the-box security content to SOC teams, helping them to view, analyze and respond to OT security alerts, and understand the generated incidents in the broader organizational threat contents.

For more information, see:

- [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md)
- [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)

## On-premises integrations

If you're working with an air-gapped, locally managed OT sensor, you'll need an on-premises solution to view Defender for IoT and Palo Alto information in the same place.

In such cases, we recommend that you configure your OT sensor to send syslog files directly to Palo Alto, or use Defender for IoT's built-in API.

For more information, see:

- [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md)
- [Defender for IoT API reference](references-work-with-defender-for-iot-apis.md)

## On-premises integration (legacy)

This section describes how to integrate and use Palo Alto with Microsoft Defender for IoT using the legacy, on-premises integration, which automatically creates new policies in the Palo Alto Network's NMS and Panorama.

> [!IMPORTANT]
> The legacy Palo Alto Panorama integration is supported through October 2024 using sensor version 23.1.3, and won't be supported in upcoming major software versions. For customers using the legacy integration, we recommend moving to one of the following methods:
> 
> - If you're integrating your security solution with cloud-based systems, we recommend that you use data connectors through [Microsoft Sentinel](#cloud-based-integrations). 
> - For on-premises integrations, we recommend that you either configure your OT sensor to [forward syslog events, or use Defender for IoT APIs](#on-premises-integrations).
>

The following table shows which incidents this integration is intended for:

| Incident type | Description |
|--|--|
|**Unauthorized PLC changes** | An update to the ladder logic, or firmware of a device.  This alert can represent legitimate activity, or an attempt to compromise the device. For example, malicious code, such as a Remote Access Trojan (RAT), or parameters that cause the physical process, such as a spinning turbine, to operate in an unsafe manner. |
|**Protocol Violation** | A packet structure, or field value that violates the protocol specification. This alert can represent a misconfigured application, or a malicious attempt to compromise the device. For example, causing a buffer overflow condition in the target device. |
|**PLC Stop** | A command that causes the device to stop functioning, thereby risking the physical process that is being controlled by the PLC. |
|**Industrial malware found in the ICS network** | Malware that manipulates ICS devices using their native protocols, such as TRITON and Industroyer. Defender for IoT also detects IT malware that has moved laterally into the ICS, and SCADA environment. For example, Conficker, WannaCry, and NotPetya. |
|**Scanning malware** | Reconnaissance tools that collect data about system configuration in a preattack phase. For example, the Havex Trojan scans industrial networks for devices using OPC, which is a standard protocol used by Windows-based SCADA systems to communicate with ICS devices. |

When Defender for IoT detects a preconfigured use case, the **Block Source** button is added to the alert. Then, when the Defender for IoT user selects the **Block Source** button, Defender for IoT creates policies on Panorama by sending the predefined forwarding rule.

The policy is applied only when the Panorama administrator pushes it to the relevant NGFW in the network.

In IT networks, there might be dynamic IP addresses. Therefore, for those subnets, the policy must be based on FQDN (DNS name) and not the IP address. Defender for IoT performs reverse lookup and matches devices with dynamic IP address to their FQDN (DNS name) every configured number of hours.

In addition, Defender for IoT sends an email to the relevant Panorama user to notify that a new policy created by Defender for IoT is waiting for the approval. The figure below presents the Defender for IoT and Panorama integration architecture:

:::image type="content" source="media/tutorial-palo-alto/structure.png" alt-text="Diagram of the Defender for IoT-Panorama Integration Architecture." lightbox="media/tutorial-palo-alto/structure.png" border="false":::

### Prerequisites

Before you begin, make sure that you have the following prerequisites:

- Confirmation by the Panorama Administrator to allow automatic blocking.
- Access to a Defender for IoT OT sensor as an [Admin user](roles-on-premises.md).

### Configure DNS lookup

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

When you're done, continue by creating forwarding rules as needed:

- [Configure immediate blocking by a specified Palo Alto firewall](#configure-immediate-blocking-by-a-specified-palo-alto-firewall)
- [Block suspicious traffic with the Palo Alto firewall](#block-suspicious-traffic-with-the-palo-alto-firewall)

### Configure immediate blocking by a specified Palo Alto firewall

Configure automatic blocking in cases such as malware-related alerts, by configuring a Defender for IoT forwarding rule to send a blocking command directly to a specific Palo Alto firewall.

When Defender for IoT identifies a critical threat, it sends an alert that includes an option of blocking the infected source. Selecting **Block Source** in the alert’s details activates the forwarding rule, which sends the blocking command to the specified Palo Alto firewall.

When creating your forwarding rule:

1. In the **Actions** area, define the server, host, port, and credentials for the Palo Alto NGFW.

1. Configure the following options to allow blocking of the suspicious sources by the Palo Alto firewall:

    | Parameter | Description |
    |--|--|
    | **Block illegal function codes** | Protocol violations - Illegal field value violating ICS protocol specification (potential exploit). |
    | **Block unauthorized PLC programming / firmware updates** | Unauthorized PLC changes. |
    | **Block unauthorized PLC stop** | PLC stop (downtime). |
    | **Block malware related alerts** | Blocking of industrial malware attempts (TRITON, NotPetya, etc.). <br><br> You can select the option of **Automatic blocking**. <br> In that case, the blocking is executed automatically and immediately. |
    | **Block unauthorized scanning** | Unauthorized scanning (potential reconnaissance). |

For more information, see [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md).

### Block suspicious traffic with the Palo Alto firewall

Configure a Defender for IoT forwarding rule to block suspicious traffic with the Palo Alto firewall.

When creating your forwarding rule:

1. In the **Actions** area, define the server, host, port, and credentials for the Palo Alto NGFW.

1. Define how the blocking is executed, as follows: 

    - **By IP Address**: Always creates blocking policies on Panorama based on the IP address.
    - **By FQDN or IP Address**: Creates blocking policies on Panorama based on FQDN if it exists, otherwise by the IP Address.

1. In the **Email** field, enter the email address for the policy notification email.

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

For more information, see [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md).

### Block specific suspicious sources

After you've created your forwarding rule, use the following steps to block specific, suspicious sources:

1. In the OT sensor's **Alerts** page, locate and select the alert related to the Palo Alto integration.

1. To automatically block the suspicious source, select **Block Source**.

1. In the **Please Confirm** dialog box, select **OK**.

The suspicious source is now blocked by the Palo Alto firewall.

## Next step

> [!div class="nextstepaction"]
> [Integrations with Microsoft and partner services](integrate-overview.md)
