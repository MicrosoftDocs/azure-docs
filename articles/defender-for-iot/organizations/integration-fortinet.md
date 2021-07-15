---
title: About the Fortinet integration
description: Defender for IoT and Fortinet has established a technology partnership in order to detect and stop attacks on IoT and ICS networks.
ms.date: 1/17/2021
ms.topic: article
---

# Defender for IoT and Fortinet IIoT and ICS threat detection & prevention

Defender for IoT mitigates IIoT and ICS and SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats in less than an hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

Defender for IoT and Fortinet has established a technology partnership in order to detect and stop attacks on IoT and ICS networks.

Together, Fortinet and Defender for IoT prevent:

- Unauthorized changes to programmable logic controllers.

- Malware that manipulates ICS and IoT devices via their native protocols.
- Reconnaissance tools from collecting data.
- Protocol violations caused by misconfigurations or malicious attackers.

## Defender for IoT and FortiGate joint solution

Defender for IoT detects anomalous behavior in IoT and ICS networks and delivers that information to FortiGate and FortiSIEM, as follows:

- **Visibility:** The information provided by Defender for IoT gives FortiSIEM administrators visibility into previously invisible IoT and ICS networks.

- **Blocking malicious attacks:** FortiGate administrators can use the information discovered by Defender for IoT to create rules to stop the anomalous behavior, regardless of whether that behavior is caused by chaotic actors, or misconfigured devices, before it causes damage to production, profits, or people.

## The Defender for IoT platform

The Defender for IoT platform autodiscovers, and fingerprints any non-managed IoT and ICS devices while continuously monitoring for targeted attacks and malware. Risk and vulnerability management capabilities include automated threat modeling as well as comprehensive reporting about both endpoint and network vulnerabilities, with risk-prioritized mitigation recommendations.  

The Defender for IoT platform is agentless, non-intrusive, and easy to deploy, delivering actionable insights less than an hour after being connected to the network.

## Fortinet FortiSIEM

Effective security requires the visibility of all of the devices, and all the infrastructure in real time, but also with context. What devices represent a threat, what is their capability to you to manage the threat that businesses face, and not the noise that multiple security tools create.

Endpoints, IoT, Infrastructure, Security Tools, Applications, VM’s, and Cloud, are some of things administrators need to secure, and monitor constantly.

FortiSIEM, and Fortinet’s multivendor security incident, and events management solution brings it all together, visibility, correlation, automated response, and remediation in a single, scalable solution.

Using a Business Services view, the complexity of managing network and security operations is reduced, freeing resources, improving breach detection. FortiSIEM provides cross correlation while applying machine learning, and UEBA to improve response, in order to stop breaches before they occur.

## Fortinet FortiGate next-generation firewalls

FortiGate's next-generation firewalls (NGFWs) utilize purpose-built security processors and threat intelligence security services from AI powered FortiGuard labs to deliver top rated protection, high-performance inspection of clear texted, and encrypted traffic.

Next generation firewalls reduce cost and complexity with full visibility into applications, users, and networks and provides best of breed security. As an integral part of the Fortinet Security Fabric next-generation firewalls can communicate within Fortinet’s comprehensive security portfolio and partner security solutions in a multivendor environment to share threat intelligence and improve security posture.

## Use cases

### Prevent unauthorized changes to programmable logic controllers

organizations use programmable logic controllers (PLCs) to manage physical processes such as robotic arms in factories, spinning turbines in wind farms, and centrifuges in nuclear power plants.

An update to the ladder logic or firmware of a PLC can represent a legitimate activity or an attempt to compromise the device by inserting malicious code.  Defender for IoT can detect unauthorized changes to PLCs, and then deliver information about that change to both FortiSIEM and FortiGate. Armed with that information, FortSIEM administrators can decide how to best mitigate the solution. One mitigation option would be to create a rule in FortiGate that stops further communication to the affected device.

### Stop ransomware before it damages IoT and ICS networks

Defender for IoT continuously monitors IoT and ICS networks for behaviors that are caused by ransomware such as LockerGoga, WannaCry, and NotPetya. When integrated with FortiSIEM and FortiGate, Defender for IoT can deliver information about the presence of these types of ransomware so that ForiSIEM operators can see where the malware is, and FortiGate administrators can stop the ransomware from spreading and wreaking more havoc.

## Set sending Defender for IoT alerts to FortiSIEM

Defenders for IoT alerts provide information about an extensive range of security events, including:

- Deviations from learned baseline network activity
- Malware detections
- Detections based on suspicious operational changes
- Network anomalies
- Protocol deviations from protocol specifications

:::image type="content" source="media/integration-fortinet/address-scan.png" alt-text="Screenshot of the Address Scan Detected window.":::

You can configure Defender for IoT to send alerts to the FortiSIEM server, where alert information is displayed in the Analytics window:

:::image type="content" source="media/integration-fortinet/analytics.png" alt-text="Screenshot of the Analytics window.":::

Each Defender for IoT alert is parsed without any other configuration on the FortiSIEM side and they are presented in the FortiSIEM as security events. The following event details appear by default:

:::image type="content" source="media/integration-fortinet/event-detail.png" alt-text="View your event details in the Event Details window.":::

## Define alert forwarding rules

Use Defender for IoT's Forwarding Rules to send alert information to FortiSIEM.

Options are available to customize the alert rules based on the:

- Specific protocols detected.

- Severity of the event.

- Defender for IoT engine that detects events.

To create a forwarding rule

1. From the sensor or on-premises management console left pane, select **Forwarding**.

    [:::image type="content" source="media/integration-fortinet/forwarding-view.png" alt-text="View your forwarding rules in the Forwarding window.":::](media/integration-fortinet/forwarding-view.png#lightbox)

2. Select **Create Forwarding Rules**. In the **Create Forwarding Rule** window, and define your rule's parameters.

    :::image type="content" source="media/integration-fortinet/new-rule.png" alt-text="Create a new Forwarding Rule window.":::

    | Parameter | Description |
    |--|--|
    | **Name** | The forwarding rule name. |
    | **Select Severity** | The minimum security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | By default, all the protocols are selected.<br><br>To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. |
    | **Engines** | By default, all the security engines are involved.<br><br>To select a specific security engine for which this rule is applied, select **Specific** and select the engine. |
    | **System Notifications** | Forward sensor online/offline status. This option is only available if you have logged into the on-premises management console. |

3. To instruct Defender for IoT to send,  alert information to FortiSIEM, select **Action** and then select **Send to FortiSIEM**.

    :::image type="content" source="media/integration-fortinet/forward-rule.png" alt-text="Create a Forwarding Rule and select send to Fortinet.":::

4. Enter the FortiSIEM server details.

    :::image type="content" source="media/integration-fortinet/details.png" alt-text="Add the FortiSIEm details to the forwarding rule":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Host** | FortiSIEM server address. |
    | **Port** | FortiSIEM server port. |
    | **Timezone** | The time stamp for the alert detection. |

5. Select **Submit**.

## Set blocking suspected traffic using Fortigate firewall

You can set blocking policies automatically in the FortiGate firewall based on Defender for IoT alerts.

:::image type="content" source="media/integration-fortinet/firewall.png" alt-text="View of the FortiGate Firewall window view.":::

For example, the following alert can block the malicious source:

:::image type="content" source="media/integration-fortinet/suspicion.png" alt-text="The NotPetya Malware suspicion window":::

To set a FortiGate firewall rule that blocks this malicious source:

1. In FortiGate, create an API key required for the Defender for IoT forwarding rule. For more information, see [Create an API key in FortiGate](#create-an-api-key-in-fortigate).

1. In Defender for IoT **Forwarding**, set a forwarding rule that blocks malware-related alerts. For more information, see [Block suspected traffic using the FortiGate firewall](#block-suspected-traffic-using-the-fortigate-firewall).

1. In Defender for IoT, **Alerts** block a malicious source. For more information, see [Block the suspicious source](#block-the-suspicious-source).

    The malicious source address appears in the FortiGage **Administrator** window.

   :::image type="content" source="media/integration-fortinet/administrator.png" alt-text="The FortiGate Administrator window view.":::

   The blocking policy was automatically created, and it appears in the FortiGate **IPv4 Policy** window.

   :::image type="content" source="media/integration-fortinet/policy.png" alt-text="The FortiGate IPv4 Policy window view.":::

   :::image type="content" source="media/integration-fortinet/edit.png" alt-text="The FortiGate IPv4 Policy Edit view.":::

## Create an API key in FortiGate

1. In FortiGate, select **System** > **Admin Profiles**.

1. Create a profile with the following permissions:

    :::image type="content" source="media/integration-fortinet/admin-profile.png" alt-text="Computer description automatically generated":::

1. Select **System** > **Administrators** and create a new **REST API Admin**.

    :::image type="content" source="media/integration-fortinet/cellphone.png" alt-text="Cell phone description automatically generated":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Username** | The forwarding rule name. |
    | **Comments** | The minimal security level incident to forward. For example, if Minor is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Administrator Profile** | From the dropdown list, select the profile name that you have defined in the previous step. |
    | **PKI Group** | Disable. |
    | **CORS Allow Origin** | Enable. |
    | **Restrict login to trusted hosts** | Adds an IP address of the sensors and CMs that will connect to the FortiGate. |

1. Save the API key.

    :::image type="content" source="media/integration-fortinet/api-key.png" alt-text="Cell phone description automatically generates New API Key":::

## Block suspected traffic using the FortiGate firewall

1. In the left pane, select **Forwarding**.

    [:::image type="content" source="media/integration-fortinet/forwarding-view.png" alt-text="The Forwarding window option in a sensor.":::](media/integration-fortinet/forwarding-view.png#lightbox)

1. Select **Create Forwarding Rules** and define rule parameters.

    :::image type="content" source="media/integration-fortinet/new-rule.png" alt-text="Screenshot of Create Forwarding Rule window":::

    | Parameter | Description |
    | --------- | ----------- |
    | **Name** | The forwarding rule name. |
    | **Select Severity** | The minimal security level incident to forward. For example, if **Minor** is selected, minor alerts and any alert above this severity level will be forwarded. |
    | **Protocols** | By default, all the protocols are selected.<br><br>To select a specific protocol, select **Specific** and select the protocol for which this rule is applied. |
    | **Engines** | By default, all the security engines are involved.<br><br>To select a specific security engine for which this rule is applied, select **Specific** and select the engine. |
    | **System Notifications** | Forward sensor *online and offline* status. This option is only available if you have logged into the on-premises management console. |

1. To instruct Defender for IoT to send firewall rules to FortiGate, select **Action** and then select **Send to FortiGate**.

    :::image type="content" source="media/integration-fortinet/fortigate.png" alt-text="Create Forwarding Rule window and select send to FortiGate":::

1. To configure the FortiGate forwarding rule:

    :::image type="content" source="media/integration-fortinet/configure.png" alt-text="Configure the Create Forwarding Rule window":::

1. In the **Actions** pane, set the following parameters:

    | Parameter | Description |
    |--|--|
    | Host | The FortiGate server IP address type. |
    | Port | The FortiGate server port type. |
    | Username | The FortiGate server username type. |
    | API Key | Enter the API key that you created in FortiGate. |
    | Incoming Interface| Define how blocking is executed:<br /><br />**By IP Address**: Always creates blocking policies on Panorama based on IP address.<br /><br />**By FQDN or IP Address**: Creates blocking policies on Panorama based on FQDN if exists, otherwise IP Address.| 
    | Outgoing Interface |Set the email address for the policy notification email. <br /><br /> **Note**: Make sure you have configured a Mail Server in XSense. If no email address is entered, XSense does not send a notification email.| 
    |Configure| Set-up the following options to allow blocking of the suspicious sources by the FortiGate firewall: <br /><br />**Block illegal function codes**: Protocol violations - Illegal field value violating ICS protocol specification (potential exploit)<br /><br />**Block unauthorized PLC programming / firmware updates**: Unauthorized PLC changes<br /><br />**Block unauthorized PLC stop**: PLC stop (downtime)<br /><br />**Block malware-related alerts**: Blocking of the industrial malware attempts (TRITON, NotPetya, etc.). You can select the option of **Automatic blocking**. In that case, the blocking is executed automatically and immediately.<br /><br />*Block unauthorized scanning*: Unauthorized scanning (potential reconnaissance)

1. Select **Submit**.

## Block the suspicious source

1. In the **Alerts** pane, select the alert related to Fortinet integration.

    :::image type="content" source="media/integration-fortinet/unauthorized.png" alt-text="The Unauthorized PLC programming window":::

1. To automatically block the suspicious source, select **Block Source**.

    :::image type="content" source="media/integration-fortinet/confirm.png" alt-text="The confirmation window.":::

1. In the **Please Confirm** dialog box, select **OK**.

## Next steps

Learn how to [Forward alert information](how-to-forward-alert-information-to-partners.md).
